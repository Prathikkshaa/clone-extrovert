# 06 — Credit Ledger + Metering Core

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (credit model is §6; tables in §5).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–05 done: build passes; auth works; `credit_ledger` and `usage_events` tables exist; `SupabaseService` admin client works; worker app boots.
- `.env` has `REDIS_URL` (Upstash). If absent, you can build the services and unit-test the ledger logic, but the BullMQ gate end-to-end test needs Redis — note any skipped part in `PROGRESS.md`.
- `CREDIT_COSTS` constant exists in `packages/shared` (placeholder values from File 01; finalized in File 14 — that's fine, use the named keys now).

## Scope of THIS file
Build the financial spine: a credit ledger (balance = sum of append-only deltas), a usage-event lifecycle, and the **reserve → commit → refund** metering pattern (§6), plus the **BullMQ gate** that every paid action (Files 07/08/09/10) will call before touching a paid external API. No feature uses it yet — this file builds and proves the mechanism in isolation.

### 1. BillingService / LedgerService (reusable, §10)
- `getBalance(userId)` → integer = `SUM(delta)` from `credit_ledger` for that user. Never store a mutable balance.
- `addCredits(userId, amount, reason, refId)` → append a positive ledger row (used by purchases later in File 14; here just implement + test).
- `reserve(userId, action, refId)`:
  - look up cost from `CREDIT_COSTS[action]`.
  - in a **single DB transaction**: check `getBalance >= cost`; if not, throw a typed `InsufficientCreditsError`; if yes, write a negative `credit_ledger` row (reason = action) AND a `usage_events` row (`status='reserved'`, credits=cost, ref_id). Return a handle (usage_event id).
  - Must be atomic and race-safe (two concurrent reserves can't both pass on a balance that only covers one). Use row locking / atomic SQL as needed.
- `commit(usageEventId)` → mark the usage_event `committed`. (Ledger already debited at reserve; commit just finalizes status.)
- `refund(usageEventId)` → append a compensating positive `credit_ledger` row (reason=`refund`, ref_id links to original) AND mark usage_event `refunded`. Idempotent: refunding twice must not double-credit.
- All operations scoped to `userId`; never cross users.

### 2. The metering gate (worker-side, §6)
- Create a reusable helper, e.g. `withCreditGate(userId, action, refId, fn)`:
  1. `reserve(...)` → if `InsufficientCreditsError`, do NOT call `fn`; surface a clear "out of credits" outcome (so the UI can prompt top-up).
  2. run `fn()` (the actual external call) inside try/catch.
  3. on success → `commit(...)`, return result.
  4. on failure → `refund(...)`, rethrow a typed error so the job can report failure without charging the user.
- This helper is what Files 07/08/09/10 wrap their paid external calls in. Document it loudly in a doc comment as the mandatory path for ALL paid actions. No paid external call may bypass it.

### 3. BullMQ wiring (worker)
- Configure the BullMQ connection from `REDIS_URL` (guarded startup from File 01 — now make it real).
- Create a generic job pattern that demonstrates the gate: a trivial test queue + processor that, given `{ userId, action }`, runs `withCreditGate` around a no-op/sleep "fake external call", to prove reserve/commit/refund end-to-end. (Real queues for search/enrichment/etc. are added in their files.)
- Ensure BullMQ rate-limiting / delayed-job features are available for later (throttled sending in File 10) — confirm the version supports them; document.

### 4. Balance API + low-balance signal (api + minimal web)
- `GET /credits/balance` (auth) → current balance + a small recent ledger summary (last N entries: reason, delta, date) for the "where did my credits go" need (§6).
- A reusable low-balance concept: expose enough for the frontend to warn at a threshold and block paid actions at zero (full UI in File 14, but the API + a basic balance display belong here).
- Minimal web: show the credit balance somewhere visible (e.g. header chip) reading from this endpoint. Full top-up UI is File 14.

## Verification (must pass before Done)
1. `npm run build` passes (api + worker + web), zero type errors.
2. Ledger math: seed some credits via `addCredits`; `getBalance` = sum of deltas. 
3. Reserve path: reserving when balance < cost throws `InsufficientCreditsError` and writes NO ledger/usage rows. Reserving when sufficient debits exactly once and creates a `reserved` usage_event.
4. Commit: marks `committed`; balance unchanged from reserve.
5. Refund: appends a `+refund` row restoring balance; marks `refunded`; refunding twice does NOT double-credit (idempotent).
6. Gate: `withCreditGate` with a failing `fn` refunds and reports failure (net-zero credit change). With a succeeding `fn`, credits stay debited and status is committed.
7. Concurrency: two simultaneous reserves on a balance covering only one → exactly one succeeds, one gets `InsufficientCreditsError` (no negative balance).
8. (If Redis present) the test queue runs a job through the gate end-to-end. If Redis absent, unit-test the gate directly and note the deferred integration check in `PROGRESS.md`.
9. `GET /credits/balance` returns correct balance + recent ledger; header chip displays it.

### Visual verification (minor UI — balance chip)
- Run §8 on the balance chip via Claude in Chrome.
- **Expected visual result:** a small, calm credit-balance indicator in the app header; reads the real balance; unobtrusive; token-styled. (Full billing UI is File 14.)
- Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual/fallback). `PROGRESS.md` updated (File 06 done; note the gate helper name + that it is the mandatory path for all paid actions; note any Redis-integration test deferred). `CODE-MAP.md` updated (BillingService + gate flagged as used by 07/08/09/10/14).
- Commit: `feat(credits): 06 ledger, reserve/commit/refund, bullmq metering gate`
- Push to `main`.

## What's next
File 07 — Lead search: `PlacesService`, search UI + filters (industry, location, "no website", low rating), save to list, caching. It will be the FIRST consumer of the credit gate built here.
