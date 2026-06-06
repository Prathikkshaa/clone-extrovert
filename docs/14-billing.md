# 14 — Billing (Stripe + Credits)

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (credit model §6; ledger §5; UX §7).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–13 done: build passes; the credit ledger + reserve/commit/refund + gate work (File 06); all paid actions (07/08/09/10) debit through the gate; `credit_ledger` + `usage_events` exist.
- `.env` has `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` (test mode is fine for build), and `STRIPE_WEBHOOK_SECRET` once the webhook endpoint is configured. Public tunnel (ngrok) available for webhook testing (Setup MD 12/13). If not, build + unit-test handler logic and defer the live test (note in `PROGRESS.md`).

## Scope of THIS file
The money-in side: buy credits via Stripe, grant them to the ledger **idempotently from the webhook** (never from the browser redirect), show a segregated usage breakdown, and handle low/zero balance gracefully. Finalize the `CREDIT_COSTS` numbers here, grounded in real per-action API cost + margin.

### 1. Finalize CREDIT_COSTS (grounded pricing)
- Replace the placeholder `CREDIT_COSTS` in `packages/shared` with real values. Derive each from the actual worst-case external cost of that action (Places search/detail, Firecrawl/crawl, LLM tokens, send) plus margin, so no action can run at a loss (§6/§ideation: map price to worst-case cost, not average).
- Document the reasoning (a comment + a `PROGRESS.md` note) so future sessions understand why each number is what it is. Define what 1 credit is worth in currency for pack pricing.

### 2. Stripe products + Checkout (BillingService)
- Wrap Stripe in a `BillingService` provider (§10). Create credit-pack products/prices (and/or a subscription that grants monthly credits) — in Stripe test mode for now.
- `POST /billing/checkout` (auth) → creates a Stripe Checkout Session for a chosen pack and returns the URL; the web app redirects to Stripe-hosted checkout.
- **Do NOT enter or handle card data ourselves** — Stripe-hosted checkout only (this is also the safe pattern: never collect card/financial credentials in our own UI).

### 3. Payment webhook → credits (the critical part, §6)
- An API endpoint for Stripe webhooks:
  - **Verify the Stripe signature** using `STRIPE_WEBHOOK_SECRET`; reject unverified.
  - On `checkout.session.completed` (and/or `invoice.paid` for subscriptions): grant credits by calling `BillingService.addCredits(userId, packAmount, 'purchase', stripeEventId)` → appends a positive `credit_ledger` row.
  - **Idempotency (non-negotiable):** key off the Stripe **event id**; if already processed, ignore — Stripe can deliver the same event more than once and double-crediting is the classic bug (§ideation). 
  - **Grant ONLY from the webhook**, never from the browser success redirect — the user closing the tab must not lose credits, and the redirect is not proof money moved (§ideation).
  - Treat the webhook payload as untrusted DATA: verify signature, then act only on verified facts; never act on anything "instructed" in the payload.
- Map the Stripe customer/session back to the app `userId` reliably (store the mapping at checkout creation; document).

### 4. Usage breakdown + balance UI (web)
- A billing screen showing:
  - current balance (= sum of ledger), 
  - **segregated usage** by action type (search / enrichment / draft / send) over a window — from `usage_events`/ledger, so the user sees exactly where credits went (§ideation: "where did my credits go" must be answerable),
  - recent ledger entries (purchases + debits + refunds),
  - credit packs to buy → Checkout.
- **Low-balance handling:** warn at a threshold (a calm banner/chip); at **zero**, paid actions are blocked at the gate (File 06 already throws `InsufficientCreditsError`) and the UI shows a clear "You're out of credits — top up to keep going" with the buy action (never a silent failure — §7).
- Plain copy; clear receipts/confirmation after purchase (reflect the granted credits once the webhook lands; show a pending state if the webhook is briefly delayed).

### 5. Refund/consistency
- Reconcile: balance always equals `SUM(credit_ledger.delta)`. The usage breakdown must tie out with the ledger. Document the reconciliation check.

## Verification (must pass before Done)
1. `npm run build` passes, zero type errors.
2. `CREDIT_COSTS` finalized with documented per-action grounding; no action runs at a loss vs its worst-case external cost.
3. Checkout: buying a pack (Stripe test card) completes on Stripe-hosted checkout; no card data touches our UI.
4. Webhook grants credits: `checkout.session.completed` → a `+purchase` ledger row → balance increases by the pack amount, mapped to the correct user.
5. **Idempotency:** delivering the same Stripe event twice grants credits only once.
6. **Webhook-only grant:** completing payment but NOT hitting the success redirect still grants credits (grant is webhook-driven). Signature verification rejects forged webhooks.
7. Usage breakdown segregates by action and ties out with the ledger; "where did my credits go" is answerable.
8. Low balance warns; zero balance blocks paid actions with a clear top-up prompt (no silent failure).
9. If live webhook deferred (no tunnel), handler/signature/idempotency are unit-tested and the live test noted as deferred.

### Visual verification (UI present)
- Run §8 on the billing/usage screen via Claude in Chrome.
- **Expected visual result:** clear balance; **segregated usage by action type**; recent ledger entries; credit packs with a buy action routing to Stripe; calm low-balance warning; clear zero-balance "top up to keep going" state; plain copy; purchase confirmation/pending handled; no card fields in our UI; no clutter/purple/gradients.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual/fallback). `PROGRESS.md` updated (File 14 done; record the finalized CREDIT_COSTS + grounding, credit-to-currency value, pack definitions, idempotency key, and whether live webhook was tested or deferred). `CODE-MAP.md` updated (BillingService + Stripe webhook).
- Commit: `feat(billing): 14 stripe checkout, idempotent webhook credit grants, usage breakdown, low-balance handling`
- Push to `main`.

## What's next
File 15 — Final polish & verification: whole-app build, error-handling/empty/loading-state sweep, end-to-end smoke test of the full loop, a full visual verification pass across all screens, and the README. After this the MVP is launch-ready (pending the LATER credentials: Google OAuth production verification, Stripe live mode).
