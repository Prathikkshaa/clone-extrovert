# 08 — Enrichment Worker

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (enrichment rules §2; tables §5; credit gate §6).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–07 done: build passes; leads can be searched and saved (`leads` rows exist with `enrichment_status` not-yet); `CrawlService` + `LlmService` exist (File 05); credit gate `withCreditGate` works (File 06); BullMQ wired (File 06).
- `.env` has `FIRECRAWL_API_KEY`, `OPENROUTER_API_KEY`, `LLM_MODEL`. Email-finder fallback key (if any) is optional for MVP — note in `PROGRESS.md` if not present.

## Scope of THIS file
Turn raw leads into actionable ones. For selected leads, fetch the lead's OWN website, extract a contact email + phone, pull and split Google reviews into positive/negative, and generate the "why reach out" hook. Run as **BullMQ jobs with per-lead progress**, each paid step **metered via the credit gate**. This is what makes later drafts reply-worthy (§ideation).

### 1. Enrichment job (worker)
- A BullMQ queue + processor `enrichLead` taking `{ userId, leadId }`.
- Per lead, run the steps below; update `leads.enrichment_status` through states (e.g. `pending → running → done | partial | failed`) so the UI can show progress.
- Bulk enrichment = enqueue one job per selected lead (so progress is per-lead and failures are isolated). Respect a sane concurrency limit so we don't hammer external APIs.

### 2. Website fetch + contact extraction
- Use `CrawlService.fetchSite(lead.website)` (Firecrawl → Playwright/Cheerio fallback). If the lead has no website (from Places), skip site steps and mark accordingly (these leads rely on phone/WhatsApp — set hook context to reflect "no website", which is itself a sales signal).
- Extract:
  - **Email(s):** parse `mailto:` + email patterns from the site (esp. /contact, /about). Rank candidates: prefer role/person addresses over generic; **de-prioritize** `noreply@`, image-trap, and obviously invalid addresses. Store the best email on `leads.email`; keep alternates available. If none found, set email empty and mark partial.
  - **Phone:** extract phone pattern; store on `leads.phone`.
  - Optional finder fallback slot: if a finder API key is configured and no email was found on-site, you MAY call it (behind a provider, metered) — otherwise skip. Document.
- Be honest about results (§7): never fabricate an email/phone. "Not found" is a valid, surfaced outcome.

### 3. Reviews: pull + split
- Pull Google reviews for the lead (via Places details where available — mind cost/cache from File 07). Use `LlmService` to summarize and **split into positive vs negative** themes; store parsed on `leads.reviews` (jsonb) — parse ONCE here, store structured (per §5 note), not raw.

### 4. The "why reach out" hook (your moat — §ideation)
- Using the site extract + reviews + (absence of) website, generate a short, specific `leads.hook`: the reason this lead is worth contacting and the angle to use. Examples of the KIND of output: "Great reviews but no website — pitch a simple site"; "Reviews mention slow response — pitch your scheduling tool". Grounded only in real data; if nothing specific, produce an honest neutral hook, don't invent problems.

### 5. Metering (uses File 06 gate)
- The crawl + LLM steps are paid: wrap each paid external call in `withCreditGate(userId, 'enrichment', refId, fn)` (or a per-lead enrichment unit — keep consistent with `CREDIT_COSTS.enrichment`; document the unit). On failure, the gate refunds (net-zero). On out-of-credits, stop enriching remaining leads and surface a clear top-up prompt; do not silently drop leads.

### 6. Web UI — enrichment
- From a list/lead view, "Enrich" (selected or all). Show **per-lead progress** (skeleton/progress, not a blocking spinner — §7); the user can keep working while jobs run.
- Each enriched lead card shows: best email (or a clear "no email found"), phone, a compact reviews positive/negative summary, and the **hook surfaced as a small highlighted callout** (the eye should land on it — §ideation).
- Credit cost shown before enriching; balance chip updates as jobs commit.
- Error/edge copy (§7): site unreachable → "Couldn't read their site — phone/WhatsApp still available"; no email → "No email found — you can add one by hand or skip"; partial results clearly labeled; never lose data; always a next step.

## Verification (must pass before Done)
1. `npm run build` passes, zero type errors.
2. Enrich a real lead with a website → email and/or phone extracted (or honest "not found"); reviews split into positive/negative; a specific, grounded hook generated.
3. A no-website lead enriches without error and gets a "no website" hook angle (not a crash, not a fabricated email).
4. Bulk enrich runs per-lead jobs with visible per-lead progress; one lead failing doesn't fail the batch.
5. Email ranking de-prioritizes `noreply@`/generic/invalid; no fabricated contacts anywhere.
6. Metering: each enrichment debits per the gate; a failed crawl/LLM call refunds (net-zero); out-of-credits halts gracefully with a top-up prompt.
7. Caching respected (no duplicate paid Places/detail calls for already-fetched data from File 07).

### Visual verification (UI present — core value screen)
- Run §8 on the enrichment list/lead view via Claude in Chrome.
- **Expected visual result:** per-lead progress shown without blocking the screen; enriched cards show email-or-"no email found", phone, a clean positive/negative reviews summary, and the **hook as a clear highlighted callout** that draws the eye; credit cost shown before, balance updates after; plain honest copy for not-found/partial cases; no clutter/purple/gradients.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual/fallback). `PROGRESS.md` updated (File 08 done; note enrichment credit unit, whether a finder fallback was wired, email-ranking rules). `CODE-MAP.md` updated (enrichLead queue; leads now carry email/reviews/hook for File 09).
- Commit: `feat(enrichment): 08 site fetch, email/phone, review split, why-reach-out hook, metered`
- Push to `main`.

## What's next
File 09 — AI drafting: generate per-lead personalized emails using the user's company profile + each lead's hook/reviews, bulk-generate, and a keyboard-friendly review/edit queue. The personalization USP made visible.
