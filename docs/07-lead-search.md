# 07 — Lead Search (Google Places)

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (lead source rules §2; tables §5; credit model §6).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–06 done: build passes; auth works; `searches`, `leads`, `lists`, `lead_list` tables exist; the credit gate (`withCreditGate`) and `BillingService` from File 06 exist and pass their tests.
- `.env` has `GOOGLE_PLACES_API_KEY` with billing enabled on the Google Cloud project (Setup MD Step 5). If missing, STOP and tell the user — search can't work without it.

## Scope of THIS file
Let a user search for businesses via Google Places by location + industry with buying-signal filters, save results as leads into a list, and do it cost-efficiently (caching) and metered (credit gate). Lead source is **Places API only — no scraping** (§2).

### 1. PlacesService (reusable provider, §10)
- `PlacesService.search({ industry, location, filters })` wrapping the Google Places API.
  - Use text/nearby search to find businesses; capture place_id, name, address, location, rating, review count, and (where available cheaply) website + phone.
  - **Cost control (important):** detail lookups (website/phone) cost more per call than basic search. Minimize detail calls; fetch details only when needed and **cache by place_id** so the same business is never re-fetched/re-charged. Document the caching strategy.
- Robustness: API errors, quota/rate-limit, zero results — each returns a clear typed result; never throw unhandled. On Places rate-limit, surface a calm "search is busy, try again shortly" (§7), not a raw error.

### 2. Buying-signal filters (a differentiator — §ideation)
- Support filters that map to sales intent, at minimum:
  - industry + location (required),
  - "no website" (business has no website — prime for agencies selling web/marketing),
  - rating below a threshold / low review count (improvement opportunity).
- Implement filtering against the Places data; document which filters are applied client-side vs query-side.

### 3. Metering (uses File 06 gate)
- Searching is a paid action: wrap the Places calls in `withCreditGate(userId, 'search', refId, fn)`. 
- Decide and document the unit (e.g. credits per search, or per N results) — keep it simple for MVP and consistent with `CREDIT_COSTS.search`. If the user is out of credits, do not call Places; return the clear "out of credits" outcome so the UI prompts top-up.
- Run searches via a BullMQ job if they may be slow/large (so the UI doesn't block); otherwise inline with a responsive loading state. If queued, provide progress/polling.

### 4. Persist results
- Save a `searches` row (industry, location, filters). Save each result as a `leads` row (status `new`, `enrichment_status` not-yet) linked to the search and user. De-duplicate within and across searches (don't create duplicate leads for the same place_id for the same user).
- Saving to a list: create/select a `lists` row and link leads via `lead_list`. A lead can be in multiple lists.

### 5. Web UI — search + results
- A clean search screen: industry + location inputs, the buying-signal filters (as simple toggles/selects with one-line hints), and a "Find leads" button (verb label, §7).
- Results as a **virtualized list** (§7 performance) of lead cards: name, rating/reviews, website-or-"no website" badge, phone if present. Stream/paginate so first results show fast.
- Bulk select → "Save to list" (create new or pick existing). Optimistic UI on quick actions.
- Empty state teaches ("No leads yet — try an industry and a city, like 'plumbers in Austin'"). 
- Show credit cost context (e.g. "This search uses N credits") before running, and the balance chip reflects the debit after.
- Error/edge copy (§7): out of credits → clear top-up prompt; zero results → "No businesses matched. Try a broader area or different industry."; Places busy → calm retry message. Never lose the user's search inputs on error.

## Verification (must pass before Done)
1. `npm run build` passes, zero type errors.
2. A real search (e.g. a real industry + city) returns real businesses with name/rating/website-or-not.
3. "No website" filter correctly narrows to businesses without a website; low-rating filter works.
4. Results persist as `leads` + a `searches` row; saving to a list creates `lead_list` links; duplicates are not created on a repeated identical search.
5. Caching: repeating a search / re-viewing details does not re-charge or re-call Places for already-fetched place_ids (verify via logs/cache).
6. Metering: a search debits exactly `CREDIT_COSTS.search` via the gate; a failed Places call refunds (net-zero); out-of-credits blocks the call and prompts top-up.
7. Long/large search stays responsive (queued or streamed), with a loading state.

### Visual verification (UI present — core screen)
- Run §8 on the search screen and results via Claude in Chrome.
- **Expected visual result:** calm search form with industry/location + filter toggles and one-line hints; "Find leads" verb button in accent; results render as a fast, clean virtualized list of lead cards with a clear "no website" badge where applicable; bulk-select + "Save to list" works; empty state teaches; credit cost shown before running and balance chip updates after; plain error messages; no clutter/purple/gradients.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual/fallback). `PROGRESS.md` updated (File 07 done; note the search credit unit chosen, caching approach, which filters are query- vs client-side). `CODE-MAP.md` updated (PlacesService flagged; note leads now exist for File 08 to enrich).
- Commit: `feat(search): 07 places lead search, buying-signal filters, lists, caching, metering`
- Push to `main`.

## What's next
File 08 — Enrichment worker: for saved leads, fetch the lead's own site (CrawlService), extract email/phone, pull + split reviews (positive/negative), and generate the "why reach out" hook — all metered via the credit gate, run as BullMQ jobs with per-lead progress.
