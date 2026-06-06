# 00 — Master Context & Build Spine (ExtrovertAI)

> **READ THIS FIRST, EVERY SESSION.** This file is the single source of truth for the whole project. Claude Code sessions do not share memory. At the start of every build session you MUST read this file and `/docs/PROGRESS.md` before writing any code. At the end of every build session you MUST update `/docs/PROGRESS.md`.
>
> This file lives in the repo at `/docs/00-master-context.md`. Do not delete or shorten it. You may append clarifications under "Amendments log" at the bottom, but never remove existing content.

---

## 0. How the build process works (cross-session continuity)

- The project is built by feeding **numbered build MD files** (`01-...md`, `02-...md`, …) to Claude Code one at a time, often in **separate sessions**.
- Because sessions are stateless, continuity is maintained by **two files in the repo**:
  - `/docs/00-master-context.md` (this file) — stable context: what the project is, the stack, schema, conventions, rules.
  - `/docs/PROGRESS.md` — living state: what is done, what's in progress, what's next, and any decisions/notes made along the way.
- **Every build file begins by instructing you to read both.** That is how a fresh session knows where things stand.
- The user will hand you one build MD at a time. Execute only that file's scope. Do not skip ahead.

### Mandatory session ritual
1. Read `/docs/00-master-context.md` (this file) fully.
2. Read `/docs/PROGRESS.md` fully.
3. Read the build MD file the user provided for this session.
4. Verify the "Preconditions" listed in that build file actually hold in the codebase (run the verification commands). If they don't, STOP and tell the user which earlier file appears incomplete.
5. Do the work for this file's scope only.
6. Run verification (including visual verification for UI work — see §8).
7. Update `/docs/PROGRESS.md`.
8. Commit and push to `main` (see §9).

---

## 1. What we are building (one paragraph)

ExtrovertAI is a global, email-first B2B sales-outreach tool for solo founders, freelancers, small SaaS companies, digital marketing agencies, and IT solution providers. A user connects their own Gmail/Outlook mailbox, and the platform finds leads (Google Places API), enriches them (fetches their website + reviews, finds an email, generates a "why reach out" hook), drafts personalized emails in the user's own voice, sends them through the user's mailbox in a throttled, compliant sequence with follow-ups, ingests replies into a threaded inbox, drafts AI replies (approval-by-default), books meetings via Cal.com, and tracks everything (clicks, replies, bounces, bookings) on a dashboard. **The platform owns all the third-party API keys** (Places, crawling, LLM); users pay via a **credit system** metered per action. "ExtrovertAI" is a placeholder name used everywhere via a single config constant so it can be renamed later.

---

## 2. Locked product decisions (do not relitigate)

- **Launch markets:** USA, UAE, India (email-first, global-capable). WhatsApp is assisted click-to-send (`wa.me` links) only — not automated.
- **Lead source:** Google Places API only. No scraping of third-party platforms.
- **Enrichment:** fetch the lead's OWN website (Firecrawl free tier → Playwright/Cheerio fallback) + Google reviews; find email via site extraction, with a finder API fallback slot.
- **Key model:** platform-owned API keys. Users pay in **credits**. (BYO-key is a future upgrade, NOT in this build.)
- **Sending:** through the USER's own Gmail/Outlook via OAuth. Never through a shared service for cold mail. **Resend is for the platform's own system email only** (signup, alerts, "you got a reply").
- **Open tracking is unreliable** — track **link clicks, replies, bounces, bookings** as primary metrics; show opens only as a muted "approximate" number.
- **AI drafting:** OpenRouter free models now, behind an abstraction so the model is a one-line swap (migrate to Gemini Flash later).
- **Booking:** Cal.com cloud free tier + Google Calendar now; self-hosted Cal.com later. Booking captured via Cal.com webhook.
- **Modes:** "Draft" (default) and "Autonomous". Even in autonomous mode, the FIRST reply to a lead is draft-for-approval; full autonomy is an explicit opt-in.
- **Compliance is non-removable in v1:** every email has a working unsubscribe link + sender physical address; global suppression checked before every send; auto-suppress on unsubscribe or hard bounce. These are NOT user-toggleable off.
- **Credits metering happens in the worker BEFORE any paid external call** (reserve → call → commit on success / refund on failure). Balance = sum of a credit ledger (append-only), never a mutable integer.
- **Commit/push:** after each build file completes and verifies, commit and push to `main`.
- **Codebase:** monorepo.

---

## 3. Tech stack (locked)

- **Frontend:** Angular (latest stable) + Tailwind CSS. Design tokens via CSS custom properties + Tailwind config (see §7).
- **Backend:** NestJS (TypeScript).
- **Workers:** NestJS standalone worker app using **BullMQ** (queue, throttling, delayed jobs, retries).
- **Queue store:** Redis via **Upstash** (free tier).
- **DB + Auth + Storage:** **Supabase** (Postgres + Auth + Storage).
- **Shared types/constants:** a `packages/shared` workspace package imported by all apps.
- **External services:** Google Places API, Firecrawl (+ Playwright/Cheerio fallback), OpenRouter (LLM), Gmail API + Microsoft Graph (mailbox OAuth + send + read), Resend (system mail), Cal.com (booking), Stripe (payments), Google Calendar API (via Cal.com sync).
- **Local dev:** everything runs locally. Public HTTPS for webhooks (Stripe, Cal.com) via a tunnel (ngrok or similar) during dev.

---

## 4. Monorepo layout (locked)

Use **npm workspaces** (simple, well-understood by AI tools). Layout:

```
extrovertai/
  docs/
    00-master-context.md         <- this file
    PROGRESS.md                  <- living state, updated every session
    CODE-MAP.md                  <- updated map of where things live
  apps/
    web/                         <- Angular frontend
    api/                         <- NestJS HTTP API
    worker/                      <- NestJS standalone BullMQ workers
  packages/
    shared/                      <- TS types, DB types, constants, credit costs, enums
  .env.example                   <- every env var, documented (no secrets)
  package.json                   <- workspaces root
  README.md
```

- Shared DTOs/types/enums live ONLY in `packages/shared` and are imported everywhere. Never duplicate a type.
- The API and worker import the same service/provider code where sensible (e.g. the Supabase client, the credit-ledger service, the external-API providers).

---

## 5. Data schema (authoritative)

All tables in Supabase Postgres. Use UUID primary keys, `created_at`/`updated_at` timestamps on every table, and row-level security keyed to the owning user. Money/credits are integers (credit units), never floats.

**Core tables:**
- `users` — id, email, plan, mode (`draft` | `autonomous`), daily_send_cap, physical_address, created_at. (Auth handled by Supabase Auth; this is the app profile row.)
- `company_profiles` — id, user_id, website, logo_url, brand_color, theme_source (`fetched` | `official`), services (text), about (text), value_prop (text), tone (text), proof_points (jsonb), raw_crawl (text). One per user.
- `mailboxes` — id, user_id, provider (`gmail` | `outlook`), email, oauth tokens (encrypted), daily_cap, warmup_state, status.
- `searches` — id, user_id, industry, location, filters (jsonb), created_at.
- `leads` — id, user_id, search_id, name, website, email, phone, reviews (jsonb: parsed positive/negative split), hook (text: "why reach out"), status (`new`|`contacted`|`replied`|`meeting`|`won`|`lost`), enrichment_status.
- `lists` — id, user_id, name.
- `lead_list` — id, list_id, lead_id (join; a lead can be in many lists).
- `campaigns` — id, user_id, list_id, channel (`email`|`whatsapp`), mode, status.
- `sequence_steps` — id, campaign_id, step_order, wait_days, template/prompt ref.
- `messages` — id, campaign_id, lead_id, channel, state (`queued`|`sent`|`bounced`|`replied`|`stopped`), thread_id, sent_at, body.
- `suppressions` — id, user_id, email, reason (`unsubscribe`|`bounce`|`manual`). Checked before EVERY send.

**Credits & usage (platform owns keys):**
- `credit_ledger` — id, user_id, delta (int, + or −), reason (`purchase`|`search`|`enrichment`|`draft`|`send`|`refund`), ref_id, created_at. **Balance = SUM(delta).** Append-only.
- `usage_events` — id, user_id, action, credits (int), status (`reserved`|`committed`|`refunded`), ref_id, created_at.

**Tracking events:**
- `click_events`, `reply_events`, `bounce_events`, `booking_events` — each id, user_id, lead_id/message_id, payload (jsonb), created_at. Dashboard aggregates these.

> The exact migration SQL is created in the foundation files. If you add a column later, add a migration; never edit a past migration.

---

## 6. Credit model (authoritative principle)

- Each paid action has a credit cost defined as a constant in `packages/shared` (e.g. `CREDIT_COSTS = { search: x, enrichment: y, draft: z, send: w }`). Exact numbers are set in the billing file; until then use the named constants, never magic numbers.
- **Reserve-before-call, in the worker:** before any paid external call, check balance, write a `reserved` usage_event + a negative ledger entry; on success mark `committed`; on failure write a compensating `+refund` ledger entry and mark `refunded`.
- Reserve/commit/refund must be **atomic** (DB transaction). Never double-charge; never charge for a failed external call.
- Every credit-affecting outcome must be surfaceable to the user ("did this cost me anything?" must always be answerable).

---

## 7. Design system & UX rules (enforced everywhere)

**Philosophy:** calm, fast, legible under stress. Not flashy. Anti-"AI-slop." Specificity and restraint over hype.

**Tokens (define once, in `apps/web` Tailwind config + CSS variables; never hardcode hex):**
- Ink (text): warm near-black `#1A1A18`.
- Canvas: warm off-white `#FAFAF8`.
- One accent: deep teal/green for primary actions + positive states (sales = "go/closed-won"). Accent appears ONLY on primary actions and positive states.
- Semantic: green = replies/booked/healthy; amber = pending/warning; red = bounce/error.
- Spacing scale, radius (md/lg), and a 2-weight type scale (400/500 only). Headings 22/18/16 at weight 500. Body 16/400.

**Theming (user logo/brand):**
- If the user provided a website at setup, fetch logo + a single accent color. Apply the **logo + their accent** on TOP of our solid, accessibility-checked neutral base. Do NOT repaint the whole UI in their palette (brand colors usually fail contrast for backgrounds/text).
- `company_profiles.theme_source` toggles `fetched` vs `official`. Settings has a one-click "Reset to ExtrovertAI theme."
- Theme is a token swap only — no component rewrites.

**Motion:** animation explains, never decorates. 150–250ms transitions. Skeletons over spinners. Optimistic UI on quick actions. Reserve a brief celebration only for genuine wins (meeting booked, positive reply). Always honor `prefers-reduced-motion`.

**Copy rules:**
- Plain words only; a 12-year-old should understand. Buttons are verbs ("Find leads", "Write emails", "Start sending") — never "Submit"/"Execute".
- Help is opt-in: a small "?" or one-line hint, never a blocking paragraph. Keep copy short.
- Empty states teach the next action. Errors state what happened + what to do + whether credits/money were affected.

**Performance:** lazy-load Angular routes; virtualize long lead lists; paginate/stream search results; background long jobs (enrichment/drafting/sending) with per-item progress; never block the screen on slow external calls.

**Error handling (every action):**
- A safe catch-all everywhere: never a silent failure or raw stack trace. Plain-English fallback: "Something went wrong — nothing was charged. Try again."
- Specific messages for high-frequency cases: out of credits, mailbox disconnected, no email found, send-limit hit, site unreachable, external API rate-limited.
- Three rules: never lose the user's work; always say whether credits were affected; always give a next step. External API failures surface as calm plain status, never technical leakage.

---

## 8. Visual self-verification (for any file that creates/changes UI)

If a build file changes UI, before finishing you MUST:
1. Run the app locally (web + api as needed).
2. Open the affected screen(s) using **Claude in Chrome**.
3. Check against the explicit "Expected visual result" checklist in that build file.
4. If anything is wrong/flawed, fix it and re-verify. Only finish when the checklist passes.
5. **Fallback:** if Claude in Chrome is not connected/available in this session, do NOT hard-block. Instead: ensure the app builds and runs, write a short manual verification checklist into the session output for the user to eyeball, and note in `PROGRESS.md` that visual auto-verification was skipped and why.

---

## 9. Definition of Done + commit ritual (every build file)

A build file is DONE only when ALL hold:
- Scope of that file implemented.
- `npm run build` (or workspace build) passes with **no compile/type errors** across affected apps.
- Lint passes; no unused/broken imports.
- Verification steps in the file pass (incl. visual verification or its fallback).
- `/docs/PROGRESS.md` updated (mark this file done; note anything deferred or decided).
- `/docs/CODE-MAP.md` updated if new modules/files of note were added.
- Commit with message format: `feat(<area>): <file-number> <short summary>` (or `fix/chore` as appropriate).
- **Push to `main`.** (User chose auto-push to main. Note: this is intentional per user instruction; an imperfect commit will land on the only branch.)

If Done cannot be reached (e.g. blocked by a missing credential or an incomplete earlier file), STOP, write the blocker clearly into `PROGRESS.md`, commit what safely builds, and tell the user exactly what's needed.

---

## 10. Code conventions (AI-friendly & human-friendly)

The codebase will be maintained mostly by AI tools — optimize for predictability and clarity.
- Clear descriptive names over clever ones. No abbreviations except well-known ones.
- Small, single-purpose files and functions. One responsibility each.
- Explicit TypeScript types everywhere. No `any` (use `unknown` + narrowing if needed).
- A short top-of-file doc comment on every module: what it does + WHY it exists.
- Consistent structure so any AI can predict where things live: NestJS = module/controller/service/provider per feature; Angular = feature folders with component/service/model.
- All external-API access goes through a single injectable provider per service (`PlacesService`, `CrawlService`, `LlmService`, `MailboxService`, `BillingService`, etc.) so they're swappable and individually rate-limited. No raw `fetch` to a third party scattered in feature code.
- Config/secrets only via env (see `.env.example`); never hardcode keys; never commit secrets.
- Keep `/docs/CODE-MAP.md` current: a short index of modules and what each does.
- Validate all external input (DTOs with class-validator on the API).
- Use the placeholder app name via one constant `APP_NAME` in `packages/shared` — never hardcode "ExtrovertAI" in UI strings.

---

## 11. Build file order (index)

> Status is tracked in `/docs/PROGRESS.md`. This is the planned sequence. Each file is scoped small to avoid long sessions.

- **00** — Master context & build spine (this file). *Not executed; read every session.*
- **SETUP** — External accounts, API keys, OAuth, env values (used in a normal Claude chat, not Claude Code).
- **01** — Monorepo scaffold: workspaces, apps/web + apps/api + apps/worker skeletons, packages/shared, Tailwind + design tokens, `.env.example`, PROGRESS.md + CODE-MAP.md, first commit/push.
- **02** — Supabase: client setup, all migrations (schema in §5), RLS, generated DB types into shared.
- **03** — Auth: Supabase Auth wiring, signup/login, the `users` app-profile row, protected routes.
- **04** — Mailbox OAuth (Gmail + Outlook): connect flow, encrypted token storage, `mailboxes` table usage.
- **05** — Onboarding + website-to-profile: crawl user's site, LLM extract, prefilled editable profile, logo/accent extraction + theming, "no website" path.
- **06** — Credit ledger + metering core: ledger/usage services, reserve/commit/refund, balance, BullMQ gate scaffold.
- **07** — Lead search: PlacesService, search UI + filters (incl. "no website"/low-rating), save to list, caching.
- **08** — Enrichment worker: site fetch + email/phone extract + reviews split + hook generation, metered via §6.
- **09** — AI drafting: LlmService, per-lead personalized drafts from profile + hook, bulk generate, review/edit queue (keyboard-friendly).
- **10** — Sending engine: mailbox send, per-inbox throttle + warm-up, sequence steps, BullMQ delayed jobs.
- **11** — Replies + inbox + compliance: reply ingestion, threaded view, AI reply (approval-default), unsubscribe/suppression/address footer, auto-suppress on bounce/unsub.
- **12** — Dashboard: tracking-event tables + aggregation, metric cards (replies/meetings led; opens muted), deliverability health strip.
- **13** — Booking: Cal.com connect + Google Calendar sync, booking link in emails, Cal.com webhook → booking_events + pipeline advance.
- **14** — Billing: Stripe Checkout (credit packs/subscription), idempotent payment webhook → ledger, segregated usage breakdown, low-balance + zero-balance handling.
- **15** — Final polish & verification: full-app build, error-handling pass, empty/loading/error states, end-to-end smoke test, full visual verification sweep, README.

*(File numbers may be split further if a session would run long; if so, use suffixes like `10a`, `10b` and record it here + in PROGRESS.)*

---

## 12. Amendments log
*(Append-only. Record any decision or change made during the build that future sessions must know. Date + one line each.)*

- (none yet)
