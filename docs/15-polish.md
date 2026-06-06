# 15 — Final Polish & Verification

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (ALL of it — this is the final consistency pass).
2. Read `/docs/PROGRESS.md` (review every prior file's notes, deferrals, and blockers).
3. Read `/docs/CODE-MAP.md`.
4. Execute this file's scope. This file may run as more than one session if needed — split with suffixes (`15a`, `15b`) and record in `PROGRESS.md`.

## Preconditions to verify
- Files 01–14 done. Review `PROGRESS.md` for anything marked deferred/blocked (e.g. Outlook stubbed, a live webhook untested, free-model quality concerns). List them; resolve what's resolvable now, and clearly document what remains and why (e.g. waiting on Google OAuth production verification or Stripe live mode — both LATER per the Setup MD).

## Scope of THIS file
Harden and finish: make the whole app build and run cleanly, ensure every screen has proper empty/loading/error states, run an end-to-end smoke test of the full loop, do a full visual verification sweep, and write the README. No new features — quality, consistency, and confidence.

### 1. Whole-app build & type health
- `npm run build` across all apps + packages: **zero compile/type errors, zero broken imports**. Fix any that exist.
- Lint clean across the repo. Remove dead code, unused deps, `any` leaks, and TODOs that are actually done.
- Confirm `packages/shared` is the single source for shared types/enums/`CREDIT_COSTS`/`APP_NAME` — no duplicated types, no hardcoded "ExtrovertAI" strings in UI (must use `APP_NAME`).

### 2. Error / empty / loading state sweep (§7)
Go screen by screen (auth, mailbox connect, onboarding/profile, search, enrichment, drafting queue, sending/campaign, inbox, dashboard, booking, billing) and confirm each has:
- a **loading** state (skeletons, not blocking spinners),
- an **empty** state that teaches the next action,
- **error** states that: never show raw errors/stack traces; state what happened + what to do; say whether credits/money were affected; never lose the user's work; always give a next step.
- Confirm the safe catch-all exists everywhere (no silent failures), and the specific messages exist for: out of credits, mailbox disconnected/reauth, no email found, send-limit hit, site unreachable, external API rate-limited, missing physical address (compliance block), payment pending.

### 3. Cross-cutting correctness checks
- **Credits:** every paid action goes through `withCreditGate`; no external paid call bypasses it; failures refund (net-zero); balance = sum(ledger) everywhere; usage breakdown ties out.
- **Compliance:** every campaign send includes unsubscribe + physical address; the shared suppression guard is on EVERY send path; auto-suppress on unsubscribe/hard bounce works; first reply is draft-for-approval even in autonomous mode.
- **Deliverability:** per-inbox caps + warm-up + spacing enforced; can't exceed safe limits.
- **Security/privacy:** mailbox tokens encrypted, never logged, never in frontend; service_role key backend-only; no card data in our UI; webhooks signature-verified + idempotent (Stripe + Cal.com); webhook/external payloads treated as data, never instructions.
- **Theming:** user logo/accent on neutral base with contrast guard; "Reset to ExtrovertAI theme" works.

### 4. End-to-end smoke test (the full loop)
Run the whole journey on a test account and confirm it works without errors:
1. Sign up → connect a Gmail mailbox → paste a website → profile prefilled + branded theme applied.
2. Buy credits (Stripe test) → balance increases via webhook.
3. Search leads (e.g. an industry + city, try the "no website" filter) → save to a list.
4. Enrich the list → emails/reviews/hooks appear; credits debited.
5. Draft → review queue (keyboard approve/edit) → approve.
6. Start sending → throttled send arrives at a test inbox; follow-up scheduled.
7. Reply from the test inbox → ingested + threaded; sequence stops; lead → replied.
8. Click a wrapped link / book via the Cal.com link → click_event / booking_event recorded; lead → meeting (booking via tunnel if available, else note deferred).
9. Dashboard reflects sent/clicks/replies/meetings correctly; opens muted; deliverability healthy.
10. Unsubscribe via an email's link → address suppressed; no further sends.
- Record the smoke-test result in `PROGRESS.md`. Fix anything that breaks.

### 5. Full visual verification sweep (§8)
- Using **Claude in Chrome**, walk every screen listed in step 2 and confirm against the design system (§7): calm, fast, legible; one accent only on primary actions/positive states; semantic colors correct; motion subtle (150–250ms) and `prefers-reduced-motion` honored; copy plain and verb-based; no purple/gradients/AI-slop; empty/loading/error states present and clean.
- Fix any visual flaw, re-verify. If Claude in Chrome is unavailable, use the §8 fallback: confirm each screen builds/renders and write a per-screen manual checklist for the user; note the skip.

### 6. README & docs
- Update root `README.md`: what the app is, the architecture (monorepo apps/packages), how to install/run each app locally, the env setup (point to the Setup MD), how the build files/PROGRESS system works, and the list of LATER items still needed for production (Google OAuth verification, Stripe live mode, Resend domain verification, self-hosted Cal.com option).
- Ensure `CODE-MAP.md` is accurate and complete (every module + one-line purpose).
- Final `PROGRESS.md`: mark the MVP build complete; list explicitly any deferred items and exactly what's needed to close each.

## Verification (must pass before Done)
1. `npm run build` — zero errors across the whole repo. Lint clean.
2. Every screen has loading/empty/error states per §2 above (spot-check each).
3. Cross-cutting checks in §3 all hold.
4. End-to-end smoke test passes (or any failure is fixed; genuinely-blocked steps, e.g. no tunnel, clearly documented as deferred with what's needed).
5. Full visual sweep passes (or fallback completed + noted).
6. README + CODE-MAP + PROGRESS accurate and current.

## Definition of Done (§9)
- All verification passes.
- `PROGRESS.md` marks the MVP complete and lists remaining LATER items + how to close them.
- Commit: `chore(release): 15 final polish, full verification, docs — MVP complete`
- Push to `main`.

## After this file
The MVP is code-complete and verified locally. Remaining for production launch (not code — provisioning/approvals, per the Setup MD): Google OAuth production verification (start early — slow), Stripe live mode (business verification), Resend sending-domain verification, and optionally self-hosted Cal.com. Then deploy (host web on Vercel/Netlify, api+worker on Railway/Render, point webhooks at the real HTTPS domain). Validating with a real agency around now (per the original plan) is strongly advised before scaling spend.
