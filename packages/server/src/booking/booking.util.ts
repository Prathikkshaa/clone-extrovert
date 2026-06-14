// booking.util — PURE Cal.com webhook helpers (no Nest/DB), so the security-critical
// bits (signature verification, payload parsing) are unit-testable in isolation.
//
// WHY pure: a webhook is an "instructions from external content" boundary
// (master-context). We treat the body as untrusted DATA: verify its HMAC signature
// against the shared secret FIRST, then parse only the fields we need, never executing
// anything it "says". Keeping this free of injection/DB makes it trivial to test the
// reject paths (unsigned / tampered / wrong secret) without standing up the app.
import { createHmac, timingSafeEqual } from 'node:crypto';

// The trigger events we act on. Anything else is logged + ignored upstream.
export type CalTrigger =
  | 'BOOKING_CREATED'
  | 'BOOKING_RESCHEDULED'
  | 'BOOKING_CANCELLED'
  | string; // unknown triggers are still carried through (handled = ignore + log)

export interface ParsedBooking {
  trigger: CalTrigger;
  /** Stable per-booking id from Cal.com — our idempotency key. */
  uid: string | null;
  /** The Cal.com account host (used to resolve WHICH of our users this belongs to). */
  organizerEmail: string | null;
  /** Lowercased attendee emails (we match these to a lead to attribute the booking). */
  attendeeEmails: string[];
  title: string | null;
  startTime: string | null;
}

/**
 * Verify a Cal.com webhook signature. Cal.com signs the RAW request body with
 * HMAC-SHA256 (hex) keyed by CALCOM_WEBHOOK_SECRET and sends it as the
 * `X-Cal-Signature-256` header. Returns false on any mismatch, empty input, or
 * missing secret — we never accept an unverified webhook. Timing-safe compare.
 */
export function verifyCalSignature(rawBody: string, signature: string | undefined, secret: string): boolean {
  if (!secret || !signature || !rawBody) return false;
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  // Normalize: Cal.com sends lowercase hex; compare as bytes of equal length.
  const a = Buffer.from(signature.trim().toLowerCase(), 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Parse the bits we need out of a Cal.com webhook body. Tolerant by design: Cal.com
 * has shifted payload shapes across versions, so we read defensively and return what
 * we can (null/empty when absent) rather than throwing — an unparseable payload is
 * handled as "nothing to record", never a crash.
 */
export function parseCalWebhook(json: unknown): ParsedBooking | null {
  if (!json || typeof json !== 'object') return null;
  const root = json as Record<string, unknown>;
  const trigger = str(root['triggerEvent']) ?? '';
  if (!trigger) return null;

  // The booking sits under `payload` in current Cal.com webhooks; fall back to root.
  const payload =
    root['payload'] && typeof root['payload'] === 'object'
      ? (root['payload'] as Record<string, unknown>)
      : root;

  const organizer =
    payload['organizer'] && typeof payload['organizer'] === 'object'
      ? (payload['organizer'] as Record<string, unknown>)
      : null;

  return {
    trigger,
    uid: str(payload['uid']) ?? str(payload['bookingId']) ?? null,
    organizerEmail: lower(str(organizer?.['email'])),
    attendeeEmails: attendeeEmails(payload['attendees']),
    title: str(payload['title']),
    startTime: str(payload['startTime']) ?? str(payload['start']),
  };
}

/** Lowercased, de-duped attendee emails from Cal.com's attendees array. */
function attendeeEmails(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out = new Set<string>();
  for (const a of value) {
    if (a && typeof a === 'object') {
      const email = lower(str((a as Record<string, unknown>)['email']));
      if (email) out.add(email);
    }
  }
  return [...out];
}

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function lower(value: string | null): string | null {
  return value ? value.toLowerCase() : null;
}
