// stripe.util — PURE Stripe-webhook helpers (no SDK calls, no DB), so the grant
// logic is unit-testable in isolation.
//
// WHY pure: granting credits from a webhook is the money path. We extract WHO to
// credit and HOW MUCH from a verified event using only data WE put on the Checkout
// Session at creation time (client_reference_id + metadata) — never trusting amounts
// the payload could be tricked into carrying. Keeping this free of the SDK/DB makes
// the "which events grant, and how much" rules trivial to test.
import { CREDIT_PACKS, findCreditPack } from '@extrovertai/shared';

export interface CreditGrant {
  userId: string;
  credits: number;
  packId: string | null;
}

// The minimal shape we read off a Stripe event. We avoid importing Stripe's types
// here so this file stays SDK-free; the service passes the parsed event object in.
interface MinimalStripeEvent {
  id?: unknown;
  type?: unknown;
  data?: { object?: Record<string, unknown> };
}

/** Event types that should grant credits (one-off pack purchase + subscription invoice). */
export const GRANTING_EVENT_TYPES = ['checkout.session.completed', 'invoice.paid'] as const;

export function isGrantingEvent(type: string): boolean {
  return (GRANTING_EVENT_TYPES as readonly string[]).includes(type);
}

/**
 * Derive the credit grant from a VERIFIED event. We trust only fields we set at
 * checkout creation: `client_reference_id` (the app userId) and `metadata.credits`
 * /`metadata.packId`. The credit amount is re-validated against the pack catalogue
 * when a packId is present, so a tampered metadata amount can't over-credit. Returns
 * null when the event isn't a grant, isn't paid, or lacks a resolvable user/amount.
 */
export function extractGrant(event: MinimalStripeEvent): CreditGrant | null {
  const type = typeof event.type === 'string' ? event.type : '';
  if (!isGrantingEvent(type)) return null;

  const obj = event.data?.object ?? {};

  // For checkout sessions, only grant when actually paid.
  if (type === 'checkout.session.completed') {
    const paymentStatus = str(obj['payment_status']);
    if (paymentStatus && paymentStatus !== 'paid') return null;
  }

  const userId = str(obj['client_reference_id']) ?? metaStr(obj, 'userId');
  if (!userId) return null;

  const packId = metaStr(obj, 'packId');
  const pack = packId ? findCreditPack(packId) : undefined;

  // Authoritative amount: the pack catalogue when we know the pack; otherwise fall
  // back to the metadata credits we set (still our own value, set at creation).
  const credits = pack ? pack.credits : toPositiveInt(metaStr(obj, 'credits'));
  if (!credits || credits <= 0) return null;

  return { userId, credits, packId: pack?.id ?? packId ?? null };
}

/** Build the Checkout metadata we attach so the webhook can resolve the grant. */
export function checkoutMetadata(userId: string, packId: string): Record<string, string> {
  const pack = findCreditPack(packId);
  return {
    userId,
    packId,
    credits: String(pack?.credits ?? ''),
  };
}

/** Total catalogue size sanity (used by tests to assert packs exist). */
export const CREDIT_PACK_COUNT = CREDIT_PACKS.length;

// --- helpers ---
function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function metaStr(obj: Record<string, unknown>, key: string): string | null {
  const meta = obj['metadata'];
  if (meta && typeof meta === 'object') {
    return str((meta as Record<string, unknown>)[key]);
  }
  return null;
}

function toPositiveInt(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}
