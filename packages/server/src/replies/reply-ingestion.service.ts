// ReplyIngestionService — detect + ingest inbound replies (File 11).
//
// WHY: closes the loop. For each connected mailbox we read the threads WE started,
// match new inbound messages to the originating lead by thread_id, and: record the
// reply (reply_events + an inbound `messages` row), set lead.status='replied' (the
// STOP signal File 10 consumes — and we stop remaining steps immediately), and
// classify the reply (LLM) — routing unsubscribe-requests into suppression. Hard
// bounces (mailer-daemon) → bounce_events + auto-suppress + mark the message bounced.
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { LlmService } from '../llm/llm.service';
import { ComplianceService } from '../compliance/compliance.service';
import { MailboxOAuthService } from '../mailbox/mailbox-oauth.service';
import { MailboxSenderService } from '../mailbox/mailbox-sender.service';
import type { InboundMessage } from '../mailbox/mailbox.types';
import { SuppressionReason } from '@extrovertai/shared';
import type { Json, Tables } from '@extrovertai/shared';

export type ReplyLabel =
  | 'positive'
  | 'not_interested'
  | 'out_of_office'
  | 'auto_reply'
  | 'unsubscribe'
  | 'neutral';

type MailboxRow = Tables<'mailboxes'>;
const RECENT_THREAD_DAYS = 21;

@Injectable()
export class ReplyIngestionService {
  private readonly logger = new Logger(ReplyIngestionService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly llm: LlmService,
    private readonly compliance: ComplianceService,
    private readonly oauth: MailboxOAuthService,
    private readonly sender: MailboxSenderService,
  ) {}

  /** Poll one mailbox for replies/bounces in the threads we started. Returns count. */
  async pollMailbox(mailbox: MailboxRow): Promise<number> {
    const threadIds = await this.recentThreadIds(mailbox);
    if (threadIds.length === 0) return 0;

    const provider = this.oauth.get(mailbox.provider === 'gmail' ? 'google' : 'microsoft');
    let inbound: InboundMessage[];
    try {
      const token = await this.sender.accessTokenFor(mailbox);
      inbound = await provider.listReplies(token, threadIds, mailbox.email);
    } catch (err) {
      this.logger.warn(`Reply poll failed for ${mailbox.email}: ${(err as Error).message}`);
      return 0;
    }

    let ingested = 0;
    for (const msg of inbound) {
      if (await this.alreadyIngested(msg.providerMessageId)) continue;
      const origin = await this.originForThread(mailbox.user_id, msg.threadId);
      if (!origin) continue; // not one of our threads
      if (msg.isBounce) await this.handleBounce(mailbox.user_id, origin, msg);
      else await this.handleReply(mailbox.user_id, origin, msg);
      ingested++;
    }
    if (ingested > 0) this.logger.log(`Ingested ${ingested} inbound for ${mailbox.email}.`);
    return ingested;
  }

  // --- reply ---
  private async handleReply(
    userId: string,
    origin: { leadId: string; campaignId: string | null; email: string | null },
    msg: InboundMessage,
  ): Promise<void> {
    const admin = this.supabase.getAdminClient();
    const label = await this.classify(msg.body || msg.snippet);

    const inserted = await admin
      .from('messages')
      .insert({
        lead_id: origin.leadId,
        campaign_id: origin.campaignId,
        channel: 'email',
        state: 'replied',
        direction: 'inbound',
        thread_id: msg.threadId,
        provider_message_id: msg.providerMessageId,
        subject: msg.subject,
        body: msg.body || msg.snippet,
        sent_at: msg.receivedAt,
        step_order: 0,
      })
      .select('id')
      .single();

    await admin.from('reply_events').insert({
      user_id: userId,
      lead_id: origin.leadId,
      message_id: inserted.data?.id ?? null,
      payload: { from: msg.from, subject: msg.subject, snippet: msg.snippet, label } as unknown as Json,
    });

    // STOP signal for File 10 + immediate halt of remaining steps.
    await admin.from('leads').update({ status: 'replied' }).eq('id', origin.leadId);
    await this.stopRemaining(origin.campaignId, origin.leadId);

    // Route an unsubscribe-request into suppression (honored immediately).
    if (label === 'unsubscribe' && origin.email) {
      await this.compliance.suppress(userId, origin.email, SuppressionReason.Unsubscribe);
    }
  }

  // --- bounce ---
  private async handleBounce(
    userId: string,
    origin: { leadId: string; campaignId: string | null; email: string | null },
    msg: InboundMessage,
  ): Promise<void> {
    const admin = this.supabase.getAdminClient();
    await admin.from('bounce_events').insert({
      user_id: userId,
      lead_id: origin.leadId,
      payload: { from: msg.from, subject: msg.subject, snippet: msg.snippet } as unknown as Json,
    });
    // Mark our outbound message(s) in this thread bounced + auto-suppress the recipient.
    await admin
      .from('messages')
      .update({ state: 'bounced', send_error: 'Hard bounce (delivery failed).' })
      .eq('thread_id', msg.threadId)
      .eq('direction', 'outbound');
    await this.stopRemaining(origin.campaignId, origin.leadId);
    if (origin.email) {
      await this.compliance.suppress(userId, origin.email, SuppressionReason.Bounce);
    }
    // Dedup marker so we don't reprocess the same bounce notification.
    await admin.from('messages').insert({
      lead_id: origin.leadId,
      campaign_id: origin.campaignId,
      channel: 'email',
      state: 'bounced',
      direction: 'inbound',
      thread_id: msg.threadId,
      provider_message_id: msg.providerMessageId,
      subject: msg.subject,
      body: msg.snippet,
      sent_at: msg.receivedAt,
      step_order: 0,
    });
  }

  // --- classification ---
  private async classify(text: string): Promise<ReplyLabel> {
    const trimmed = (text ?? '').slice(0, 1500).trim();
    if (!trimmed) return 'neutral';
    // Cheap deterministic shortcut for explicit opt-outs.
    if (/\b(unsubscribe|remove me|stop emailing|take me off)\b/i.test(trimmed)) return 'unsubscribe';
    try {
      const parsed = await this.llm.extractJson<{ label?: string }>({
        system:
          'Classify a B2B email reply into ONE label. Be conservative: if unsure, use "neutral". ' +
          'Labels: positive (interested/wants to talk), not_interested, out_of_office, ' +
          'auto_reply (automated non-OOO), unsubscribe (asks to stop/opt out), neutral.',
        prompt: `Reply:\n"""${trimmed}"""\n\nReturn JSON: {"label": "..."}`,
        maxTokens: 50,
        temperature: 0,
      });
      const label = (parsed.label ?? '').toLowerCase();
      const allowed: ReplyLabel[] = [
        'positive',
        'not_interested',
        'out_of_office',
        'auto_reply',
        'unsubscribe',
        'neutral',
      ];
      return (allowed as string[]).includes(label) ? (label as ReplyLabel) : 'neutral';
    } catch {
      return 'neutral';
    }
  }

  // --- queries ---
  private async recentThreadIds(mailbox: MailboxRow): Promise<string[]> {
    const since = new Date(Date.now() - RECENT_THREAD_DAYS * 86400000).toISOString();
    const { data } = await this.supabase
      .getAdminClient()
      .from('messages')
      .select('thread_id')
      .eq('mailbox_id', mailbox.id)
      .eq('direction', 'outbound')
      .not('thread_id', 'is', null)
      .gte('sent_at', since);
    return [...new Set((data ?? []).map((r) => r.thread_id as string))];
  }

  private async alreadyIngested(providerMessageId: string): Promise<boolean> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('messages')
      .select('id')
      .eq('provider_message_id', providerMessageId)
      .eq('direction', 'inbound')
      .maybeSingle();
    return Boolean(data);
  }

  private async originForThread(
    userId: string,
    threadId: string,
  ): Promise<{ leadId: string; campaignId: string | null; email: string | null } | null> {
    const admin = this.supabase.getAdminClient();
    const { data } = await admin
      .from('messages')
      .select('lead_id,campaign_id')
      .eq('thread_id', threadId)
      .eq('direction', 'outbound')
      .order('sent_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!data) return null;
    const lead = await admin
      .from('leads')
      .select('id,email,user_id')
      .eq('id', data.lead_id)
      .eq('user_id', userId)
      .maybeSingle();
    if (!lead.data) return null;
    return { leadId: lead.data.id, campaignId: data.campaign_id, email: lead.data.email };
  }

  private async stopRemaining(campaignId: string | null, leadId: string): Promise<void> {
    if (!campaignId) return;
    await this.supabase
      .getAdminClient()
      .from('messages')
      .update({ state: 'stopped' })
      .eq('campaign_id', campaignId)
      .eq('lead_id', leadId)
      .eq('state', 'queued');
  }
}
