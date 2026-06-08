// SendingService — the sequence engine core (File 10).
//
// WHY: processes ONE message-step send. Before sending it re-checks the stop
// conditions (lead replied? suppressed? — signals populated in File 11, checked
// here now), picks a mailbox with daily headroom (throttle + warm-up + rotation),
// meters the send through the credit gate, records the send, and reports what the
// worker should do next (schedule the follow-up as a delayed job, retry later, or
// pause the campaign). All outward effects are funnelled here so the worker stays
// a thin BullMQ adapter.
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { BillingService } from '../billing/billing.service';
import { InsufficientCreditsError } from '../billing/billing.errors';
import { MailboxSenderService } from '../mailbox/mailbox-sender.service';
import { MailboxSendError, type OutboundEmail } from '../mailbox/mailbox.types';
import { MailboxCapacityService } from './mailbox-capacity.service';
import {
  FOLLOWUP_WAIT_DAYS,
  RATE_LIMIT_BACKOFF_MS,
  TRANSIENT_BACKOFF_MS,
  msUntilTomorrow,
  waitDaysToMs,
} from './sending.constants';
import type { Tables } from '@extrovertai/shared';

export type SendOutcome =
  | { kind: 'sent'; messageId: string; nextStep: { messageId: string; delayMs: number } | null }
  | { kind: 'stopped'; messageId: string; reason: 'replied' | 'suppressed' }
  | { kind: 'skipped'; messageId: string; reason: 'not_queued' | 'not_found' | 'no_email' }
  | {
      kind: 'retry';
      messageId: string;
      delayMs: number;
      reason: 'no_capacity' | 'rate_limited' | 'transient';
    }
  | { kind: 'paused'; messageId: string; reason: 'out_of_credits' | 'reauth' | 'no_mailbox' }
  | { kind: 'failed'; messageId: string; reason: 'rejected' | 'error' };

type MessageRow = Pick<
  Tables<'messages'>,
  'id' | 'lead_id' | 'campaign_id' | 'step_order' | 'subject' | 'body' | 'state' | 'thread_id'
>;
type LeadRow = Pick<Tables<'leads'>, 'id' | 'user_id' | 'email' | 'name' | 'status'>;

@Injectable()
export class SendingService {
  private readonly logger = new Logger(SendingService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly billing: BillingService,
    private readonly sender: MailboxSenderService,
    private readonly capacity: MailboxCapacityService,
  ) {}

  async processSend(userId: string, messageId: string): Promise<SendOutcome> {
    const admin = this.supabase.getAdminClient();

    const msg = await this.loadMessage(messageId);
    if (!msg) return { kind: 'skipped', messageId, reason: 'not_found' };
    if (msg.state !== 'queued') return { kind: 'skipped', messageId, reason: 'not_queued' };

    const lead = await this.loadLead(msg.lead_id, userId);
    if (!lead) return { kind: 'skipped', messageId, reason: 'not_found' };

    // --- Stop checks (File 11 populates lead.status='replied' + suppressions) ---
    if (lead.status === 'replied') {
      await this.stopLeadSequence(msg.campaign_id, msg.lead_id);
      return { kind: 'stopped', messageId, reason: 'replied' };
    }
    if (lead.email && (await this.isSuppressed(userId, lead.email))) {
      await this.stopLeadSequence(msg.campaign_id, msg.lead_id);
      return { kind: 'stopped', messageId, reason: 'suppressed' };
    }
    if (!lead.email) {
      await this.failMessage(messageId, 'No email address for this lead.');
      return { kind: 'skipped', messageId, reason: 'no_email' };
    }

    // --- Pick a mailbox with daily headroom (throttle + warm-up + rotation) ---
    const pick = await this.capacity.pick(userId);
    if (!pick.ok) {
      if (pick.reason === 'no_mailbox') {
        await this.pauseCampaign(msg.campaign_id);
        return { kind: 'paused', messageId, reason: 'no_mailbox' };
      }
      // All mailboxes at cap today — try again after the daily reset.
      return { kind: 'retry', messageId, delayMs: msUntilTomorrow(), reason: 'no_capacity' };
    }
    const mailbox = pick.mailbox;

    // --- Build the email (thread follow-ups under the first email) ---
    const threadId = msg.step_order > 1 ? await this.priorThreadId(msg) : null;
    const subject = msg.step_order > 1 ? this.ensureRe(msg.subject) : (msg.subject ?? '');
    const email: OutboundEmail = {
      to: lead.email,
      subject,
      body: msg.body ?? '',
      fromEmail: mailbox.email,
      threadId,
      inReplyToRfcId: null,
    };

    // --- Meter + send ---
    try {
      const result = await this.billing.withCreditGate(userId, 'send', messageId, () =>
        this.sender.sendThroughMailbox(mailbox, email),
      );
      await admin
        .from('messages')
        .update({
          state: 'sent',
          mailbox_id: mailbox.id,
          provider_message_id: result.providerMessageId || null,
          thread_id: result.threadId ?? threadId,
          sent_at: new Date().toISOString(),
          send_error: null,
        })
        .eq('id', messageId);
      await this.capacity.recordSend(mailbox.id);
      const nextStep = await this.nextStep(msg);
      return { kind: 'sent', messageId, nextStep };
    } catch (err) {
      return this.handleSendError(err, messageId, msg.campaign_id, mailbox.id);
    }
  }

  // --- error handling ---
  private async handleSendError(
    err: unknown,
    messageId: string,
    campaignId: string | null,
    mailboxId: string,
  ): Promise<SendOutcome> {
    if (err instanceof InsufficientCreditsError) {
      await this.pauseCampaign(campaignId);
      return { kind: 'paused', messageId, reason: 'out_of_credits' };
    }
    if (err instanceof MailboxSendError) {
      await this.setMessageError(messageId, err.message);
      if (err.kind === 'reauth') {
        await this.markMailboxReauth(mailboxId);
        await this.pauseCampaign(campaignId);
        return { kind: 'paused', messageId, reason: 'reauth' };
      }
      if (err.kind === 'rate_limited') {
        return { kind: 'retry', messageId, delayMs: RATE_LIMIT_BACKOFF_MS, reason: 'rate_limited' };
      }
      if (err.kind === 'rejected') {
        await this.supabase
          .getAdminClient()
          .from('messages')
          .update({ state: 'bounced' })
          .eq('id', messageId);
        return { kind: 'failed', messageId, reason: 'rejected' };
      }
      return { kind: 'retry', messageId, delayMs: TRANSIENT_BACKOFF_MS, reason: 'transient' };
    }
    this.logger.warn(`Unexpected send error for ${messageId}: ${(err as Error).message}`);
    await this.setMessageError(messageId, 'Unexpected error while sending.');
    return { kind: 'failed', messageId, reason: 'error' };
  }

  // --- queries / mutations ---
  private async loadMessage(messageId: string): Promise<MessageRow | null> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('messages')
      .select('id,lead_id,campaign_id,step_order,subject,body,state,thread_id')
      .eq('id', messageId)
      .maybeSingle();
    return (data as MessageRow) ?? null;
  }

  private async loadLead(leadId: string, userId: string): Promise<LeadRow | null> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('leads')
      .select('id,user_id,email,name,status')
      .eq('id', leadId)
      .eq('user_id', userId)
      .maybeSingle();
    return (data as LeadRow) ?? null;
  }

  private async isSuppressed(userId: string, email: string): Promise<boolean> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('suppressions')
      .select('id')
      .eq('user_id', userId)
      .eq('email', email)
      .maybeSingle();
    return Boolean(data);
  }

  private async priorThreadId(msg: MessageRow): Promise<string | null> {
    if (!msg.campaign_id) return null;
    const { data } = await this.supabase
      .getAdminClient()
      .from('messages')
      .select('thread_id')
      .eq('campaign_id', msg.campaign_id)
      .eq('lead_id', msg.lead_id)
      .eq('state', 'sent')
      .not('thread_id', 'is', null)
      .order('step_order', { ascending: true })
      .limit(1)
      .maybeSingle();
    return (data?.thread_id as string | null) ?? null;
  }

  private async nextStep(
    msg: MessageRow,
  ): Promise<{ messageId: string; delayMs: number } | null> {
    if (!msg.campaign_id) return null;
    const admin = this.supabase.getAdminClient();
    const next = await admin
      .from('messages')
      .select('id,step_order')
      .eq('campaign_id', msg.campaign_id)
      .eq('lead_id', msg.lead_id)
      .eq('state', 'queued')
      .gt('step_order', msg.step_order)
      .order('step_order', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!next.data) return null;

    const step = await admin
      .from('sequence_steps')
      .select('wait_days')
      .eq('campaign_id', msg.campaign_id)
      .eq('step_order', next.data.step_order)
      .maybeSingle();
    const waitDays = step.data?.wait_days ?? FOLLOWUP_WAIT_DAYS;
    return { messageId: next.data.id, delayMs: waitDaysToMs(waitDays) };
  }

  private async stopLeadSequence(campaignId: string | null, leadId: string): Promise<void> {
    if (!campaignId) return;
    await this.supabase
      .getAdminClient()
      .from('messages')
      .update({ state: 'stopped' })
      .eq('campaign_id', campaignId)
      .eq('lead_id', leadId)
      .eq('state', 'queued');
  }

  private async failMessage(messageId: string, reason: string): Promise<void> {
    await this.supabase
      .getAdminClient()
      .from('messages')
      .update({ state: 'stopped', send_error: reason })
      .eq('id', messageId);
  }

  private async setMessageError(messageId: string, reason: string): Promise<void> {
    await this.supabase
      .getAdminClient()
      .from('messages')
      .update({ send_error: reason })
      .eq('id', messageId);
  }

  private async pauseCampaign(campaignId: string | null): Promise<void> {
    if (!campaignId) return;
    await this.supabase
      .getAdminClient()
      .from('campaigns')
      .update({ status: 'paused' })
      .eq('id', campaignId);
  }

  private async markMailboxReauth(mailboxId: string): Promise<void> {
    await this.supabase
      .getAdminClient()
      .from('mailboxes')
      .update({ status: 'reauth_required' })
      .eq('id', mailboxId);
  }

  private ensureRe(subject: string | null): string {
    const s = (subject ?? '').trim();
    return /^re:/i.test(s) ? s : `Re: ${s}`;
  }
}
