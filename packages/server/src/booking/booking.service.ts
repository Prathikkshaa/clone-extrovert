// BookingService — the single provider for everything Cal.com (master-context §10).
//
// WHY: leads should be able to book a meeting, and we want "meetings booked" to be a
// REAL, hands-off metric — not something the user types in. We don't build availability
// /timezone/conflict logic ourselves (Cal.com owns that, §2); we just (a) hold the
// user's booking link and (b) capture verified booking webhooks into booking_events,
// advancing the matched lead to `meeting`.
//
// TRUST BOUNDARY: a webhook is untrusted external content. The controller verifies the
// HMAC signature (verifyCalSignature) BEFORE this service ever sees the payload, and we
// only ever RECORD facts from it — never act on anything it "instructs".
//
// IDEMPOTENCY: the same webhook can arrive more than once. We key each recorded event
// off (cal_uid, cal_trigger) with a unique index + insert-if-absent, so a duplicate
// delivery records ONE row (no double count).
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { parseCalWebhook, verifyCalSignature, type ParsedBooking } from './booking.util';
import type { Json } from '@extrovertai/shared';

export type BookingOutcome =
  | { kind: 'recorded'; trigger: string; leadId: string | null; duplicate: boolean }
  | { kind: 'ignored'; reason: 'unknown_trigger' | 'unparseable' | 'no_user' };

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /** Verify a raw webhook body against the configured secret (delegates to the pure util). */
  verifySignature(rawBody: string, signature: string | undefined, secret: string): boolean {
    return verifyCalSignature(rawBody, signature, secret);
  }

  /** The user's saved Cal.com booking link (the CTA we drop into outreach). Null if unset. */
  async bookingLink(userId: string): Promise<string | null> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('users')
      .select('booking_url')
      .eq('id', userId)
      .maybeSingle();
    const url = (data?.booking_url ?? '').trim();
    return url || null;
  }

  /**
   * Handle a SIGNATURE-VERIFIED webhook body. Resolves which of our users the booking
   * belongs to (by the Cal.com host email), records a booking_events row idempotently,
   * and on a created booking advances the matched lead to `meeting`. Never throws on an
   * unexpected/unknown payload — returns an `ignored` outcome so the controller can 200
   * (Cal.com retries non-2xx, so we ack what we safely handled).
   */
  async handleVerifiedWebhook(rawJson: unknown): Promise<BookingOutcome> {
    const parsed = parseCalWebhook(rawJson);
    if (!parsed) return { kind: 'ignored', reason: 'unparseable' };

    const userId = await this.resolveUser(parsed.organizerEmail);
    if (!userId) {
      // booking_events.user_id is NOT NULL — without a user we can't (and shouldn't)
      // record. Log enough to debug attribution, drop the rest.
      this.logger.warn(
        `Cal.com ${parsed.trigger}: no user matched organizer "${parsed.organizerEmail ?? '?'}" — ignored.`,
      );
      return { kind: 'ignored', reason: 'no_user' };
    }

    if (!this.isHandledTrigger(parsed.trigger)) {
      // Don't crash on event types we don't specifically handle — record nothing, log.
      this.logger.log(`Cal.com ${parsed.trigger}: not a handled trigger — ignored.`);
      return { kind: 'ignored', reason: 'unknown_trigger' };
    }

    const leadId = await this.matchLead(userId, parsed.attendeeEmails);
    const duplicate = !(await this.recordEvent(userId, leadId, parsed, rawJson));

    // Advance the lead only on a fresh CREATED booking (don't re-advance on a duplicate
    // delivery; don't advance on reschedule/cancel — those are recorded but not a new
    // pipeline move). Booking won → lead reaches `meeting`.
    if (!duplicate && parsed.trigger === 'BOOKING_CREATED' && leadId) {
      await this.advanceLeadToMeeting(userId, leadId);
    }

    return { kind: 'recorded', trigger: parsed.trigger, leadId, duplicate };
  }

  // --- user / lead resolution ---

  /**
   * Resolve our user from the Cal.com host email. Strategy (documented): the BYO
   * Cal.com account's host email is matched to either the user's login email
   * (`users.email`) or one of their connected sending mailboxes (`mailboxes.email`) —
   * in practice the same Google account powers both Cal.com and Gmail. No match →
   * null (we can't attribute the booking to a tenant, so we ignore it).
   */
  private async resolveUser(organizerEmail: string | null): Promise<string | null> {
    if (!organizerEmail) return null;
    const admin = this.supabase.getAdminClient();

    const byUser = await admin
      .from('users')
      .select('id')
      .eq('email', organizerEmail)
      .maybeSingle();
    if (byUser.data?.id) return byUser.data.id;

    const byMailbox = await admin
      .from('mailboxes')
      .select('user_id')
      .eq('email', organizerEmail)
      .maybeSingle();
    return byMailbox.data?.user_id ?? null;
  }

  /**
   * Attribute the booking to a lead by matching any attendee email to a lead email for
   * this user (first match wins). No match → null: we still record the booking for the
   * user (it counts), just unattributed to a specific lead.
   */
  private async matchLead(userId: string, attendeeEmails: string[]): Promise<string | null> {
    if (attendeeEmails.length === 0) return null;
    const { data } = await this.supabase
      .getAdminClient()
      .from('leads')
      .select('id,email')
      .eq('user_id', userId)
      .in('email', attendeeEmails)
      .limit(1);
    return data?.[0]?.id ?? null;
  }

  // --- persistence ---

  /** Insert the booking event idempotently. Returns true if a NEW row was written. */
  private async recordEvent(
    userId: string,
    leadId: string | null,
    parsed: ParsedBooking,
    rawJson: unknown,
  ): Promise<boolean> {
    const admin = this.supabase.getAdminClient();

    // Idempotency: only count a (uid, trigger) once. We check first (the DB also has a
    // unique index as the hard guarantee), then insert. A race that loses the unique
    // index is caught and treated as a duplicate.
    if (parsed.uid) {
      const existing = await admin
        .from('booking_events')
        .select('id')
        .eq('cal_uid', parsed.uid)
        .eq('cal_trigger', parsed.trigger)
        .maybeSingle();
      if (existing.data) return false;
    }

    const { error } = await admin.from('booking_events').insert({
      user_id: userId,
      lead_id: leadId,
      cal_uid: parsed.uid,
      cal_trigger: parsed.trigger,
      payload: this.toJson(parsed, rawJson),
    });

    if (error) {
      // Unique-index violation = a concurrent duplicate delivery beat us here.
      if (error.code === '23505' || error.message.toLowerCase().includes('duplicate')) {
        return false;
      }
      this.logger.warn(`booking_events insert failed: ${error.message}`);
      return false;
    }
    return true;
  }

  /** Move the lead to `meeting` — the pipeline win. Idempotent (already-meeting is fine). */
  private async advanceLeadToMeeting(userId: string, leadId: string): Promise<void> {
    const { error } = await this.supabase
      .getAdminClient()
      .from('leads')
      .update({ status: 'meeting' })
      .eq('id', leadId)
      .eq('user_id', userId);
    if (error) this.logger.warn(`advance lead ${leadId} to meeting failed: ${error.message}`);
  }

  private isHandledTrigger(trigger: string): boolean {
    return (
      trigger === 'BOOKING_CREATED' ||
      trigger === 'BOOKING_RESCHEDULED' ||
      trigger === 'BOOKING_CANCELLED'
    );
  }

  /** Store a compact, useful slice of the booking plus the raw payload for audit. */
  private toJson(parsed: ParsedBooking, rawJson: unknown): Json {
    return {
      title: parsed.title,
      startTime: parsed.startTime,
      attendeeEmails: parsed.attendeeEmails,
      organizerEmail: parsed.organizerEmail,
      raw: rawJson,
    } as unknown as Json;
  }
}
