// Sending queue contract + tuning constants — shared by API (producer) and worker.
// WHY: queue name + job payload must match on both sides; tuning lives in one place.

/** BullMQ queue carrying one job per message-step to send. */
export const SENDING_QUEUE = 'sending';

/** Payload for a single send-step job. */
export interface SendStepJob {
  userId: string;
  messageId: string;
}

// Warm-up ramp for a `new` mailbox: start low and add WARMUP_STEP_PER_DAY each day
// until it reaches the mailbox's daily_cap. Protects a fresh domain's reputation.
export const WARMUP_BASE = 5;
export const WARMUP_STEP_PER_DAY = 5;

// Days to wait between a sequence step and the next (the gap a follow-up waits
// after the previous step sends). Used when creating sequence_steps + as a fallback.
export const FOLLOWUP_WAIT_DAYS = 3;

// Back-off delays the worker uses when a step can't send yet.
export const RATE_LIMIT_BACKOFF_MS = 15 * 60 * 1000; // provider said slow down
export const TRANSIENT_BACKOFF_MS = 5 * 60 * 1000; // transient network/5xx

// Human-like spacing between sends (rate limiter + random jitter on top).
export const SEND_SPACING_MS = 8_000;
export const SEND_JITTER_MS = 5_000;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Milliseconds until the next UTC midnight (+ a small buffer) — when caps reset. */
export function msUntilTomorrow(now = Date.now()): number {
  const next = Math.floor(now / DAY_MS) * DAY_MS + DAY_MS;
  return next - now + 60_000;
}

/** Convert a sequence step's wait_days into a job delay. */
export function waitDaysToMs(waitDays: number): number {
  return Math.max(0, waitDays) * DAY_MS;
}
