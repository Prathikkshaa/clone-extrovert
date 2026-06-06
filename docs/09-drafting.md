# 09 — AI Drafting

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (drafting rules §2; profile §5; credit gate §6; copy/UX §7).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–08 done: build passes; leads can be enriched (carry `email`, `reviews`, `hook`); `company_profiles` populated (File 05); `LlmService` exists (File 05); credit gate works (File 06); BullMQ wired.
- `.env` has `OPENROUTER_API_KEY`, `LLM_MODEL`. If the free model produces weak drafts, note it in `PROGRESS.md` (migration to Gemini Flash is a one-value swap per §2) — but do not block.

## Scope of THIS file
Generate **per-lead personalized** outreach that sounds like the USER pitching THEIR offer — drawing on the user's company profile + each lead's hook/reviews. Support bulk generation and a fast, keyboard-friendly review/edit queue. This is the personalization USP made visible (§ideation). Drafting only here; sending is File 10.

### 1. Drafting service (uses LlmService)
- A `DraftingService.draftForLead({ userId, leadId, sequenceContext })` that builds a grounded prompt from:
  - the user's `company_profiles` (services, value_prop, tone, proof_points) → so the email pitches the user's real offer in the user's voice;
  - the lead's `hook` + reviews + name/site context → so it's specific to that lead;
  - channel + sequence step context (email now; the `wa.me` WhatsApp message variant can reuse the same service with a shorter format).
- Prompt rules (§7, anti-slop): plain, human, specific. Reference the real hook. No generic hype, no "I hope this email finds you well" filler, no fabricated claims about the lead. Keep it short. Respect the user's stated tone.
- Generate a coherent **sequence** when asked (email 1 + follow-up 1 + follow-up 2 as a set, not disconnected) — align with `sequence_steps` shape from §5 (the sending engine in File 10 consumes these).
- Return subject + body; store drafts on `messages` rows (state `queued`/draft) linked to lead + campaign, or a draft holding area — keep consistent with §5 and document the choice.

### 2. Bulk generation (worker)
- A BullMQ queue + processor to draft for many selected leads — one job per lead so progress is per-lead and failures isolated (mirror File 08's pattern). Sane concurrency.
- Each paid LLM call wrapped in `withCreditGate(userId, 'draft', refId, fn)` (unit consistent with `CREDIT_COSTS.draft`; document). Failure → refund (net-zero). Out-of-credits → stop, prompt top-up, don't drop leads silently.

### 3. Review/edit queue (web — a delight feature, §ideation)
- Present generated drafts as a **fast review queue**, not a wall of 30 textareas:
  - one draft at a time (or a tight list) with the lead's name + the **hook shown alongside** so the user sees WHY this message;
  - **keyboard-first**: approve (e.g. Enter/→), edit inline, skip (e.g. ↓), with visible shortcuts. This respects power users' time.
  - edits save per draft; approving marks the draft ready for sending (File 10).
- "Regenerate" on a draft (re-runs drafting for that lead — metered again). 
- Optimistic UI; smooth transitions between drafts (§7 motion).
- Empty/loading/error states: generating shows per-lead progress (skeleton); a failed draft is clearly flagged with a "Regenerate" next step; never lose edits.

### 4. Honesty & safety
- Never fabricate facts about the lead or invent proof points the user didn't provide. If profile data is thin, produce a solid generic-but-specific message rather than making things up. Document this guardrail in the prompt.

## Verification (must pass before Done)
1. `npm run build` passes, zero type errors.
2. Draft for an enriched lead → the email clearly (a) pitches the USER's offer/voice from their profile and (b) references the lead's specific hook. Not generic slop, no filler, no fabricated claims.
3. Bulk draft for N leads → per-lead jobs with visible progress; one failure doesn't fail the batch.
4. Review queue: keyboard approve/edit/skip works; edits persist; approve marks ready; regenerate re-drafts (and re-meters).
5. Metering: each draft debits per the gate; failed LLM call refunds (net-zero); out-of-credits halts gracefully with top-up prompt.
6. A thin-profile user still gets a reasonable, non-fabricated draft.
7. Sequence generation produces coherent email 1 + follow-ups consistent with `sequence_steps`.

### Visual verification (UI present — USP screen)
- Run §8 on the review/edit queue via Claude in Chrome.
- **Expected visual result:** a fast, calm review queue (NOT a wall of textareas); each draft shown with the lead name + the hook beside it; visible keyboard shortcuts; inline edit + approve + skip + regenerate all work; smooth transitions; per-lead progress while generating; failed drafts flagged with a clear next step; plain, human draft copy (no hype/filler); no clutter/purple/gradients.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual/fallback). `PROGRESS.md` updated (File 09 done; note draft credit unit, the model used + whether free-model quality was adequate or migration is advised, where drafts are stored). `CODE-MAP.md` updated (DraftingService + draft queue; drafts now feed File 10).
- Commit: `feat(drafting): 09 personalized per-lead drafts, bulk generate, keyboard review queue, metered`
- Push to `main`.

## What's next
File 10 — Sending engine: send approved drafts through the user's mailbox with per-inbox throttling + warm-up, run the follow-up sequence on BullMQ delayed jobs, and stop-on-reply. (Compliance footer/suppression + reply ingestion come in File 11.)
