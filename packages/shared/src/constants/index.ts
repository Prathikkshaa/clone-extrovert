// Shared constants.
// WHY: credit costs are referenced by the metering layer (worker) and surfaced
// in the UI. Defining them by named key here means no magic numbers are scattered
// through feature code. The exact values are placeholders.

/**
 * Credit cost per paid action, in integer credit units.
 * Keys mirror the paid actions metered in master-context §6.
 * TODO: finalized in File 14 (Billing). Values below are placeholders.
 */
export const CREDIT_COSTS = {
  search: 1,
  enrichment: 1,
  draft: 1,
  send: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;
