// Shared constants — credit economics (master-context §6).
// WHY: credit costs are referenced by the metering layer (worker) AND surfaced in
// the UI; credit packs are referenced by the billing API AND the buy UI. Defining
// them once here means no magic numbers and no drift between charge + display.

/**
 * Credit-to-currency anchor (File 14).
 *
 * 1 credit = USD $0.10 retail value. Pack prices below are set so the effective
 * per-credit price stays at/above this floor (bulk packs give a small bonus, never
 * below ~$0.074/credit). Everything downstream prices off this anchor.
 */
export const CREDIT_USD_CENTS = 10;

/**
 * Credit cost per paid action, in integer credit units (FINALIZED, File 14).
 *
 * Each value is grounded in the WORST-CASE external cost of the action (not the
 * average), so no action can run at a loss vs the $0.10/credit anchor:
 *
 *  - search (1cr = $0.10): one Google Places "Text Search (Pro)" call ≈ $0.032,
 *    field-masked + cached. ~3× margin.
 *  - enrichment (2cr = $0.20): Place Details w/ reviews (Enterprise+Atmosphere SKU)
 *    ≈ $0.02–0.04 + a site crawl (Firecrawl free tier; paid worst case ≈ $0.001/pg)
 *    + one LLM call. Heaviest action → priced at 2. ~4–5× margin worst case.
 *  - draft (1cr = $0.10): one LLM completion (OpenRouter free now; paid worst case
 *    e.g. Gemini Flash ≈ $0.001–0.005 for the 3-message sequence). Min unit.
 *  - send (1cr = $0.10): the email goes through the USER's own Gmail/Outlook (no
 *    per-send external cost to us) — priced at 1 for margin + anti-abuse throttling.
 *
 * If any external price rises, bump the value here (single source) — never let an
 * action dip below its worst-case cost.
 */
export const CREDIT_COSTS = {
  search: 1,
  enrichment: 2,
  draft: 1,
  send: 1,
  export: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

/** The action types that DEBIT credits (for the segregated usage breakdown UI). */
export const CREDIT_DEBIT_ACTIONS: readonly CreditAction[] = [
  'search',
  'enrichment',
  'draft',
  'send',
  'export',
];

/**
 * Buyable credit packs (File 14). `priceUsdCents` is what Stripe charges; `credits`
 * is what we grant on a verified `checkout.session.completed`. Prices give a gentle
 * bulk bonus while staying ≥ the per-credit cost floor. Stripe Checkout is created
 * with an inline price from these values, so no Stripe dashboard product setup is
 * needed to go live — paste the keys and it works.
 */
export const CREDIT_PACKS = [
  {
    id: 'starter',
    label: 'Starter',
    credits: 100,
    priceUsdCents: 1000,
    audience: 'Trying it out',
    tagline: 'Test the waters with your first campaign.',
    popular: false,
  },
  {
    id: 'growth',
    label: 'Growth',
    credits: 550,
    priceUsdCents: 4500,
    audience: 'Growing your outreach',
    tagline: 'Run real campaigns every week — the best value.',
    popular: true,
  },
  {
    id: 'scale',
    label: 'Scale',
    credits: 1200,
    priceUsdCents: 8900,
    audience: 'High-volume senders',
    tagline: 'Always-on outreach at the lowest price per credit.',
    popular: false,
  },
] as const;

export type CreditPack = (typeof CREDIT_PACKS)[number];
export type CreditPackId = CreditPack['id'];

/** Find a pack by id (used by the checkout API to validate the requested pack). */
export function findCreditPack(id: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id);
}

/**
 * Low-balance warning threshold (credits). At/below this the UI shows a calm warning;
 * at zero the credit gate (File 06) blocks paid actions and the UI prompts a top-up.
 */
export const LOW_BALANCE_THRESHOLD = 20;

/**
 * Free credits granted once to a brand-new account. Surfaced on the marketing site
 * so "start free" states a real number instead of a vague "batch of credits".
 *
 * MUST match the API's signup grant (apps/api users.service.ts DEFAULT_SIGNUP_CREDITS
 * and the SIGNUP_CREDITS env default). Kept here as the single value the public site
 * reads; if you change the grant, change it in both places (or wire the API to import
 * this).
 */
export const FREE_SIGNUP_CREDITS = 100;
