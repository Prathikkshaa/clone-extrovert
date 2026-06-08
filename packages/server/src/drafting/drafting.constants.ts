// Drafting queue contract — shared by the API (producer) and worker (consumer).
// WHY: queue name + job payload must match on both sides; define once to prevent drift.

/** BullMQ queue that carries one job per lead to draft a sequence for. */
export const DRAFTING_QUEUE = 'drafting';

/** Payload for a single lead-drafting job. */
export interface DraftLeadJob {
  userId: string;
  leadId: string;
}

/** Sequence shape: first email + two follow-ups (step_order 1..3). */
export const SEQUENCE_STEPS = [
  { step: 1, label: 'Email', waitDays: 0 },
  { step: 2, label: 'Follow-up 1', waitDays: 3 },
  { step: 3, label: 'Follow-up 2', waitDays: 6 },
] as const;
