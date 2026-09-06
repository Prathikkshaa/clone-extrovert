// Single source for the *derived* pricing math shown on the marketing site.
// Every number here is computed from the FINALIZED product values in
// @extrovertai/shared (CREDIT_COSTS / CREDIT_PACKS), never hardcoded - so the
// hero ROI band, the pack cards, the comparison matrix and the interactive
// calculator can never disagree with each other or with what the API charges.
import { CREDIT_COSTS, CREDIT_PACKS } from '@extrovertai/shared';

// A lead is found (search), researched (enrichment), and its 3-email sequence
// written once (draft). Sends vary: follow-ups stop the moment a lead replies,
// so at best 1 email sends, at worst all 3 do.
const CREDITS_PER_LEAD_BASE = CREDIT_COSTS.search + CREDIT_COSTS.enrichment + CREDIT_COSTS.draft;
export const CREDITS_PER_LEAD_LOW = CREDITS_PER_LEAD_BASE + CREDIT_COSTS.send; // reply came early
export const CREDITS_PER_LEAD_HIGH = CREDITS_PER_LEAD_BASE + 3 * CREDIT_COSTS.send; // full sequence

export const usd = (cents: number) => `$${(cents / 100).toLocaleString('en-US')}`;

// Leads a credit balance works, as an honest RANGE (both floored so we never
// over-promise): fewer sends per lead => more leads, so the LOW count uses the
// HIGH per-lead cost.
export const leadsForCredits = (credits: number) => ({
  low: Math.floor(credits / CREDITS_PER_LEAD_HIGH),
  high: Math.floor(credits / CREDITS_PER_LEAD_LOW),
});

// Cost per lead in USD, as a range derived from the leads range (fewer leads =>
// each costs more). The single strongest value anchor on the page.
export const costPerLeadUsd = (priceUsdCents: number, credits: number) => {
  const l = leadsForCredits(credits);
  const hi = priceUsdCents / 100 / l.low;
  const lo = priceUsdCents / 100 / l.high;
  return { lo, hi };
};
export const fmtUsd2 = (n: number) => `$${n.toFixed(2)}`;

// Best-value pack = lowest price per credit (a computed fact, honest highlight).
export const bestPack = [...CREDIT_PACKS].sort(
  (a, b) => a.priceUsdCents / a.credits - b.priceUsdCents / b.credits,
)[0];

export const LOWEST_PER_CREDIT_USD = `$${(bestPack.priceUsdCents / bestPack.credits / 100).toFixed(3)}`;

// Headline "$/lead from" anchor: the best (lowest) per-lead cost across all packs,
// i.e. the cheapest pack worked at the full 3-email sequence.
export const LOWEST_COST_PER_LEAD = (() => {
  const c = costPerLeadUsd(bestPack.priceUsdCents, bestPack.credits);
  return fmtUsd2(c.lo);
})();
