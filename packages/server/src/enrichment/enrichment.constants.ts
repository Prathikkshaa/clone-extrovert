// Enrichment queue contract — shared by the API (producer) and worker (consumer).
// WHY: the queue name + job payload must match on both sides; defining them once
// here prevents drift between apps/api and apps/worker.

/** BullMQ queue that carries one job per lead to enrich. */
export const ENRICHMENT_QUEUE = 'enrichment';

/** Payload for a single lead-enrichment job. */
export interface EnrichLeadJob {
  userId: string;
  leadId: string;
}
