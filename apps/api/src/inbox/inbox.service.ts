// InboxService — the threaded reply inbox + AI reply (File 11).
//
// WHY: surfaces conversations (a lead's sent emails + their replies in one thread),
// proposes an AI reply in the user's voice (DraftingService, metered), and sends a
// reply in the SAME thread. APPROVAL-BY-DEFAULT: nothing is ever auto-sent — every
// reply requires an explicit send call (the user's approval), so draft-mode and
// autonomous-mode both keep the first (and every) reply human-approved. Every send
// goes through the shared compliance guard (suppression + footer).
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ComplianceService,
  DraftingService,
  MailboxSenderService,
  MailboxSendError,
  SupabaseService,
  type ReplyDraftResult,
} from '@extrovertai/server';
import type { Tables } from '@extrovertai/shared';

export interface Conversation {
  leadId: string;
  name: string | null;
  email: string | null;
  status: string;
  lastAt: string;
  snippet: string;
  label: string;
}
export interface ThreadMessage {
  id: string;
  direction: string;
  subject: string | null;
  body: string | null;
  state: string;
  at: string;
}
export interface ThreadView {
  leadId: string;
  name: string | null;
  email: string | null;
  status: string;
  messages: ThreadMessage[];
}
export type SendReplyResult =
  | { ok: true }
  | { ok: false; reason: 'no_email' | 'suppressed' | 'no_mailbox' | 'no_address' | 'reauth' | 'error' };

@Injectable()
export class InboxService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly drafting: DraftingService,
    private readonly compliance: ComplianceService,
    private readonly sender: MailboxSenderService,
  ) {}

  /** Conversations (leads who replied), newest first. */
  async conversations(userId: string): Promise<Conversation[]> {
    const admin = this.supabase.getAdminClient();
    const events = await admin
      .from('reply_events')
      .select('lead_id,payload,created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    const seen = new Set<string>();
    const convos: Conversation[] = [];
    for (const e of events.data ?? []) {
      if (!e.lead_id || seen.has(e.lead_id)) continue;
      seen.add(e.lead_id);
      const lead = await admin
        .from('leads')
        .select('id,name,email,status')
        .eq('id', e.lead_id)
        .maybeSingle();
      if (!lead.data) continue;
      const p = (e.payload ?? {}) as { snippet?: string; label?: string };
      convos.push({
        leadId: e.lead_id,
        name: lead.data.name,
        email: lead.data.email,
        status: lead.data.status,
        lastAt: e.created_at,
        snippet: p.snippet ?? '',
        label: p.label ?? 'neutral',
      });
    }
    return convos;
  }

  /** Full thread (outbound + inbound) in chronological order. */
  async thread(userId: string, leadId: string): Promise<ThreadView> {
    const admin = this.supabase.getAdminClient();
    const lead = await admin
      .from('leads')
      .select('id,name,email,status')
      .eq('id', leadId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!lead.data) throw new NotFoundException('Conversation not found.');

    const msgs = await admin
      .from('messages')
      .select('id,direction,subject,body,state,sent_at,created_at')
      .eq('lead_id', leadId)
      .in('state', ['sent', 'replied', 'bounced', 'stopped'])
      .order('created_at', { ascending: true });

    const messages: ThreadMessage[] = (msgs.data ?? [])
      .map((m) => ({
        id: m.id,
        direction: m.direction,
        subject: m.subject,
        body: m.body,
        state: m.state,
        at: m.sent_at ?? m.created_at,
      }))
      .sort((a, b) => (a.at < b.at ? -1 : 1));

    return {
      leadId,
      name: lead.data.name,
      email: lead.data.email,
      status: lead.data.status,
      messages,
    };
  }

  /** Propose an AI reply (metered draft). Not sent or stored. */
  async draftReply(userId: string, leadId: string): Promise<ReplyDraftResult> {
    const t = await this.thread(userId, leadId);
    return this.drafting.draftReply(
      userId,
      leadId,
      t.messages.map((m) => ({ direction: m.direction, body: m.body })),
    );
  }

  /** Send a reply in the same thread (explicit approval). Compliance-guarded. */
  async sendReply(userId: string, leadId: string, body: string): Promise<SendReplyResult> {
    const admin = this.supabase.getAdminClient();
    const lead = await admin
      .from('leads')
      .select('id,email')
      .eq('id', leadId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!lead.data?.email) return { ok: false, reason: 'no_email' };
    if (await this.compliance.isSuppressed(userId, lead.data.email)) {
      return { ok: false, reason: 'suppressed' };
    }

    const last = await admin
      .from('messages')
      .select('thread_id,subject,mailbox_id,campaign_id')
      .eq('lead_id', leadId)
      .eq('direction', 'outbound')
      .order('sent_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const mailbox = await this.resolveMailbox(userId, last.data?.mailbox_id ?? null);
    if (!mailbox) return { ok: false, reason: 'no_mailbox' };

    const compliant = await this.compliance.applyCompliance(userId, leadId, lead.data.email, body);
    if (!compliant.ok) return { ok: false, reason: 'no_address' };

    const subject = this.ensureRe(last.data?.subject ?? 'your email');
    try {
      const result = await this.sender.sendThroughMailbox(mailbox, {
        to: lead.data.email,
        subject,
        body: compliant.body,
        fromEmail: mailbox.email,
        threadId: last.data?.thread_id ?? null,
        inReplyToRfcId: null,
      });
      await admin.from('messages').insert({
        lead_id: leadId,
        campaign_id: last.data?.campaign_id ?? null,
        channel: 'email',
        state: 'sent',
        direction: 'outbound',
        thread_id: result.threadId ?? last.data?.thread_id ?? null,
        provider_message_id: result.providerMessageId || null,
        subject,
        body: compliant.body,
        sent_at: new Date().toISOString(),
        mailbox_id: mailbox.id,
        step_order: 0,
      });
      return { ok: true };
    } catch (err) {
      if (err instanceof MailboxSendError && err.kind === 'reauth') {
        return { ok: false, reason: 'reauth' };
      }
      return { ok: false, reason: 'error' };
    }
  }

  private async resolveMailbox(
    userId: string,
    mailboxId: string | null,
  ): Promise<Tables<'mailboxes'> | null> {
    const admin = this.supabase.getAdminClient();
    if (mailboxId) {
      const { data } = await admin.from('mailboxes').select('*').eq('id', mailboxId).maybeSingle();
      if (data) return data as Tables<'mailboxes'>;
    }
    const { data } = await admin
      .from('mailboxes')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'connected')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    return (data as Tables<'mailboxes'>) ?? null;
  }

  private ensureRe(subject: string): string {
    const s = subject.trim();
    return /^re:/i.test(s) ? s : `Re: ${s}`;
  }
}
