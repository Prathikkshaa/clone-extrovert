// DraftingService — per-lead personalized outreach (File 09).
//
// WHY: this is the personalization USP. For one lead it writes a SHORT, human,
// specific cold-email SEQUENCE (first email + two follow-ups) that pitches the
// USER's real offer in the user's voice (from company_profiles) AND references
// the lead's own hook/reviews. One LLM call returns the whole set.
//
// METERING (§6): the paid LLM call runs inside one `withCreditGate(userId,
// 'draft', leadId, …)` — one credit per lead per drafting (the full sequence).
// On failure the gate refunds (net-zero). Idempotent: a lead that already has
// holding-area drafts is skipped (no re-charge); "regenerate" deletes first.
//
// HONESTY (§7/§4): never fabricate facts about the lead or invent proof points
// the user didn't give. Thin profile → a solid generic-but-specific message, not
// made-up claims. The guardrail is stated in the prompt.
//
// STORAGE: drafts are `messages` rows in a holding area (campaign_id null,
// state 'queued', approved false, step_order 1..3). File 10 builds the campaign +
// sequence_steps and sends only `approved` drafts.
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { BillingService } from '../billing/billing.service';
import { InsufficientCreditsError } from '../billing/billing.errors';
import { LlmService } from '../llm/llm.service';
import { SEQUENCE_STEPS } from './drafting.constants';
import type { Json, Tables } from '@extrovertai/shared';

export type DraftOutcome =
  | { status: 'drafted'; leadId: string; count: number }
  | { status: 'skipped'; leadId: string; reason: 'already_drafted' | 'not_found' }
  | { status: 'failed'; leadId: string; reason: 'out_of_credits' | 'error'; message: string };

export type ReplyDraftResult =
  | { ok: true; body: string }
  | { ok: false; reason: 'out_of_credits' | 'error' | 'not_found' };

interface GeneratedMessage {
  step: number;
  subject: string;
  body: string;
}

type LeadRow = Pick<
  Tables<'leads'>,
  'id' | 'name' | 'website' | 'email' | 'hook' | 'reviews' | 'rating' | 'review_count'
>;
type ProfileRow = Pick<
  Tables<'company_profiles'>,
  'website' | 'services' | 'about' | 'value_prop' | 'tone' | 'proof_points'
> | null;

const LEAD_BODY_MAX = 1100;

@Injectable()
export class DraftingService {
  private readonly logger = new Logger(DraftingService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly billing: BillingService,
    private readonly llm: LlmService,
  ) {}

  /**
   * Draft (or skip) one lead's outreach sequence. Metered as one `draft` unit.
   * Idempotent: existing holding-area drafts are kept (no re-charge). Use
   * `deleteDrafts` (API regenerate) before re-enqueuing to force a redraft.
   */
  async draftForLead(userId: string, leadId: string): Promise<DraftOutcome> {
    const lead = await this.loadLead(userId, leadId);
    if (!lead) return { status: 'skipped', leadId, reason: 'not_found' };

    const existing = await this.countDrafts(leadId);
    if (existing > 0) return { status: 'skipped', leadId, reason: 'already_drafted' };

    const profile = await this.loadProfile(userId);
    try {
      const messages = await this.billing.withCreditGate(userId, 'draft', leadId, () =>
        this.generate(lead, profile),
      );
      await this.persist(leadId, messages);
      return { status: 'drafted', leadId, count: messages.length };
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        return {
          status: 'failed',
          leadId,
          reason: 'out_of_credits',
          message: 'Out of credits — top up to draft this lead.',
        };
      }
      this.logger.warn(`Drafting failed for ${leadId} (refunded): ${(err as Error).message}`);
      return {
        status: 'failed',
        leadId,
        reason: 'error',
        message: 'Drafting didn’t finish. Nothing was charged — try again.',
      };
    }
  }

  /**
   * Draft a REPLY to a lead in the user's voice, grounded in the thread + profile
   * (File 11). Metered as one `draft` unit. Returns the proposed body — it is NOT
   * sent or stored (approval-by-default: the user reviews/edits, then sends).
   */
  async draftReply(
    userId: string,
    leadId: string,
    thread: { direction: string; body: string | null }[],
  ): Promise<ReplyDraftResult> {
    const lead = await this.loadLead(userId, leadId);
    if (!lead) return { ok: false, reason: 'not_found' };
    const profile = await this.loadProfile(userId);
    const senderName = await this.senderName(userId);
    try {
      const body = await this.billing.withCreditGate(userId, 'draft', `reply:${leadId}`, () =>
        this.generateReply(lead, profile, thread, senderName),
      );
      return { ok: true, body };
    } catch (err) {
      if (err instanceof InsufficientCreditsError) return { ok: false, reason: 'out_of_credits' };
      this.logger.warn(`Reply draft failed for ${leadId} (refunded): ${(err as Error).message}`);
      return { ok: false, reason: 'error' };
    }
  }

  private async generateReply(
    lead: LeadRow,
    profile: ProfileRow,
    thread: { direction: string; body: string | null }[],
    senderName: string | null,
  ): Promise<string> {
    const convo = thread
      .filter((m) => (m.body ?? '').trim())
      .map(
        (m) =>
          `${m.direction === 'inbound' ? lead.name ?? 'Them' : 'You'}: ${(m.body ?? '').slice(0, 800)}`,
      )
      .join('\n\n');
    const profileBlock = profile
      ? [
          profile.services ? `Sender services: ${profile.services}` : '',
          profile.value_prop ? `Value prop: ${profile.value_prop}` : '',
          profile.tone ? `Tone: ${profile.tone}` : '',
        ]
          .filter(Boolean)
          .join('\n')
      : '(no sender profile — keep it natural and helpful, do not invent offerings)';
    const signOff = senderName
      ? `End with a sign-off using the sender's name, e.g. "Best,\n${senderName}".`
      : 'End with a simple sign-off the user can edit (e.g. "Best,").';
    const body = await this.llm.complete({
      system:
        'You write a SHORT, warm, human reply to a B2B email, in the sender\'s voice. ' +
        'Respond directly to what they said. No filler, no hype. Only use facts given — never ' +
        `invent results, prices, or commitments. ${signOff} ` +
        'Return ONLY the reply body text (no subject, no quotes).',
      prompt: `Sender:\n${profileBlock}\n\nConversation so far:\n${convo}\n\nWrite the sender's next reply.`,
      maxTokens: 400,
      temperature: 0.5,
    });
    const text = body.trim();
    if (!text) throw new Error('The model returned an empty reply.');
    return text;
  }

  /** Delete a lead's holding-area drafts (used by "regenerate" before redrafting). */
  async deleteDrafts(userId: string, leadId: string): Promise<void> {
    const lead = await this.loadLead(userId, leadId);
    if (!lead) return;
    await this.supabase
      .getAdminClient()
      .from('messages')
      .delete()
      .eq('lead_id', leadId)
      .is('campaign_id', null)
      .eq('state', 'queued');
  }

  // --- generation ---

  private async generate(lead: LeadRow, profile: ProfileRow): Promise<GeneratedMessage[]> {
    // The sender's signature is appended automatically at send time (Settings →
    // email signature, or a "Regards, <name>" default), so the body must NOT add its
    // own closing — otherwise every email would have two sign-offs.
    const signOffRule =
      'Do NOT add a sign-off, closing line, or signature (no "Best,", "Regards,", or a ' +
      'name) — end the message right after the call to action. A signature is added ' +
      'automatically afterwards.';
    const parsed = await this.llm.extractJson<{ messages?: unknown }>({
      system:
        'You write short, human, specific B2B cold outreach. You ONLY use facts you are given. ' +
        'Never invent facts about the recipient, and never invent results, clients, or proof ' +
        'points the sender did not provide. No filler ("I hope this finds you well"), no hype, ' +
        `no buzzwords. Plain words a 12-year-old understands. ${signOffRule}`,
      prompt: this.buildPrompt(lead, profile),
      maxTokens: 1100,
      temperature: 0.5,
    });

    const raw = Array.isArray(parsed.messages) ? parsed.messages : [];
    const messages: GeneratedMessage[] = [];
    for (const step of SEQUENCE_STEPS) {
      const found = raw.find(
        (m): m is Record<string, unknown> =>
          !!m && typeof m === 'object' && Number((m as { step?: unknown }).step) === step.step,
      );
      const subject = this.str(found?.['subject']);
      const body = this.str(found?.['body']);
      if (subject && body) messages.push({ step: step.step, subject, body });
    }
    // Fall back to whatever valid messages came back, in order, if step tags were off.
    if (messages.length === 0) {
      raw.forEach((m, i) => {
        const rec = m as Record<string, unknown>;
        const subject = this.str(rec?.['subject']);
        const body = this.str(rec?.['body']);
        if (subject && body) messages.push({ step: i + 1, subject, body });
      });
    }
    if (messages.length === 0) throw new Error('The model did not return any usable drafts.');
    return messages;
  }

  private buildPrompt(lead: LeadRow, profile: ProfileRow): string {
    const reviews = this.parseReviews(lead.reviews);
    const profileBlock = profile
      ? [
          profile.services ? `Services: ${profile.services}` : '',
          profile.value_prop ? `Value proposition: ${profile.value_prop}` : '',
          profile.about ? `About the sender: ${profile.about}` : '',
          profile.tone ? `Preferred tone: ${profile.tone}` : '',
          this.proofPoints(profile.proof_points),
          profile.website ? `Sender website: ${profile.website}` : '',
        ]
          .filter(Boolean)
          .join('\n')
      : '(The sender has not filled in their company profile — write a solid, specific message about reaching out to help, WITHOUT inventing what they offer.)';

    return [
      "SENDER (the person writing the email) — pitch THIS person's offer in their voice:",
      profileBlock,
      '',
      'RECIPIENT (the lead being contacted):',
      `Business name: ${lead.name ?? 'the business'}`,
      `Has website: ${lead.website ? 'yes' : 'no'}`,
      lead.rating != null ? `Google rating: ${lead.rating} (${lead.review_count ?? 0} reviews)` : '',
      lead.hook ? `Why reach out (the angle): ${lead.hook}` : '',
      reviews.positive.length ? `Customers praise: ${reviews.positive.join('; ')}` : '',
      reviews.negative.length ? `Customers complain about: ${reviews.negative.join('; ')}` : '',
      '',
      'Write a 3-message cold-email sequence to this recipient:',
      '  step 1 = first email: open with something specific to THEM (use the angle above), then',
      '           briefly say how the sender can help, then a soft ask. Keep it under ~110 words.',
      '  step 2 = a short follow-up a few days later: light, friendly nudge, new small angle. <70 words.',
      '  step 3 = a final brief check-in: very short, easy to say no to. <50 words.',
      'Each needs its own subject line (short, lowercase-ish, not clickbait, no "Re:").',
      '',
      'Return JSON exactly: {"messages":[{"step":1,"subject":"...","body":"..."},{"step":2,...},{"step":3,...}]}',
      'Ground every sentence in the facts above. If a fact is missing, leave it out — do not invent it.',
    ]
      .filter(Boolean)
      .join('\n');
  }

  // --- persistence ---

  private async persist(leadId: string, messages: GeneratedMessage[]): Promise<void> {
    const rows = messages.map((m) => ({
      lead_id: leadId,
      campaign_id: null,
      channel: 'email' as const,
      state: 'queued' as const,
      step_order: m.step,
      subject: m.subject,
      body: m.body,
      approved: false,
    }));
    const { error } = await this.supabase.getAdminClient().from('messages').insert(rows);
    if (error) throw new Error(`Could not save drafts: ${error.message}`);
  }

  private async countDrafts(leadId: string): Promise<number> {
    const { count } = await this.supabase
      .getAdminClient()
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('lead_id', leadId)
      .is('campaign_id', null)
      .eq('state', 'queued');
    return count ?? 0;
  }

  private async loadLead(userId: string, leadId: string): Promise<LeadRow | null> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('leads')
      .select('id,name,website,email,hook,reviews,rating,review_count')
      .eq('id', leadId)
      .eq('user_id', userId)
      .maybeSingle();
    return (data as LeadRow) ?? null;
  }

  private async loadProfile(userId: string): Promise<ProfileRow> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('company_profiles')
      .select('website,services,about,value_prop,tone,proof_points')
      .eq('user_id', userId)
      .maybeSingle();
    return (data as ProfileRow) ?? null;
  }

  /** The sender's display name (from auth metadata) for email sign-offs. Returns
   *  null when unset so the model falls back to a plain "Best," sign-off. */
  private async senderName(userId: string): Promise<string | null> {
    try {
      const { data } = await this.supabase.getAdminClient().auth.admin.getUserById(userId);
      const meta = data.user?.user_metadata as { full_name?: string } | undefined;
      const name = meta?.full_name?.trim();
      return name && name.length > 0 ? name : null;
    } catch {
      return null;
    }
  }

  // --- small helpers ---

  private parseReviews(reviews: Json): { positive: string[]; negative: string[] } {
    if (reviews && typeof reviews === 'object' && !Array.isArray(reviews)) {
      const r = reviews as Record<string, unknown>;
      const list = (v: unknown): string[] =>
        Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 4) : [];
      return { positive: list(r['positive']), negative: list(r['negative']) };
    }
    return { positive: [], negative: [] };
  }

  private proofPoints(value: Json): string {
    if (!Array.isArray(value) || value.length === 0) return '';
    const points = value.filter((v): v is string => typeof v === 'string').slice(0, 4);
    return points.length ? `Proof points the sender provided: ${points.join('; ')}` : '';
  }

  private str(value: unknown): string {
    return typeof value === 'string' ? value.trim().slice(0, LEAD_BODY_MAX) : '';
  }
}
