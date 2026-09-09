# ExtrovertAI

ExtrovertAI is a global, email-first B2B sales-outreach platform for solo founders, freelancers, small SaaS companies, digital marketing agencies, and IT solution providers. A user connects their own Gmail/Outlook mailbox, and the platform finds leads, enriches them, drafts personalized emails in the user's own voice, sends them through the user's mailbox in a throttled, compliant sequence with follow-ups, ingests replies into a threaded inbox, drafts AI replies (approval-by-default), books meetings via Cal.com, and tracks everything on a dashboard. The platform owns all third-party API keys; users pay via a credit system metered per action. The product name is surfaced through a single `APP_NAME` constant so it can be renamed at any time; it is **currently set to "Milo"** (see the AI-agent section below).

> **For contributors / AI agents:** read [`/docs/00-master-context.md`](docs/00-master-context.md) first (every session), then [`/docs/PROGRESS.md`](docs/PROGRESS.md) and [`/docs/CODE-MAP.md`](docs/CODE-MAP.md). External account/key setup is documented in [`/docs/setup-credentials-md.md`](docs/setup-credentials-md.md).

---

## For AI agents (start here)

**This is a single [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) monorepo** containing BOTH the marketing/landing website AND the full product application. Read this section before running anything.

### What lives where

| Path | Workspace name | What it is |
| --- | --- | --- |
| `apps/marketing` | `marketing` | **The public marketing/landing website** (Next.js 15 App Router). Routes: `/` (landing), `/pricing`, `/about`, `/how-it-works`, `/blog`. **This is the currently active workstream.** |
| `apps/web` | `web` | The product application itself — the app users log into (Angular + Tailwind). |
| `apps/api` | `api` | NestJS HTTP API (auth, endpoints, webhooks). |
| `apps/worker` | `worker` | NestJS BullMQ worker (enrichment, drafting, sending, reply polling). |
| `packages/shared` | `@extrovertai/shared` | Browser-safe shared types/enums/constants — **including the product name** (`APP_NAME`). No secrets. |
| `packages/server` | `@extrovertai/server` | Backend-only shared providers (may hold secrets; never imported by `web`/`marketing`). |
| `docs/`, `supabase/` | — | Build spine + SQL migrations. |

The marketing site and the product app are independent to run: **you do not need the database, Redis, API, or any secret keys to run and view the landing site.**

### Run the landing site (the usual task)

```bash
npm install            # once, at the repo root — resolves all workspaces
npm run dev:marketing  # Next.js dev server → http://localhost:4321
```

Then open **http://localhost:4321** — that is the landing page. Navigate from there to `/pricing`, `/about`, `/how-it-works`, `/blog`. All marketing source is under `apps/marketing/src/` (`app/` = routes, `components/sections/` = page sections, `components/` = shared UI, `lib/` = config/data).

### Product name is "Milo" — single source of truth

The product is currently named **Milo**. It is set in ONE place and read everywhere else — never hardcode it:

- `packages/shared/src/app.ts` → `DEFAULT_APP_NAME` (overridable via the `APP_NAME` env var). Everything imports `APP_NAME`.
- `@extrovertai/shared` is consumed as its **built `dist/`**, so after changing the name (or anything in `packages/shared`) you must rebuild it for the marketing/app to pick it up:

```bash
npm run build:shared   # rebuilds packages/shared/dist so APP_NAME propagates
```

### Marketing app: conventions & gotchas (must-know)

- **Stack:** Next.js 15.5 (App Router, RSC-first — client components only where interaction is needed, e.g. `hero-leads-panel`, `faq`, `how-it-works`). **Tailwind v3** with design tokens as RGB-channel CSS variables in `apps/marketing/src/app/globals.css`. Dev port is **4321**.
- **Design tokens:** semantic utilities `ink / canvas / surface / muted / line / accent / accent-strong / accent-soft`. The **primary brand teal is `rgb(15 118 110)`** (the nav "Start free" button = `bg-accent`). Dark "island" sections use the `.on-dark` class (which remaps tokens + paints a dark bg) — **never use `bg-ink` inside `.on-dark`**.
- **Copy rule: NO em dashes anywhere** in user-facing copy — use commas, colons, or a spaced hyphen.
- **Type-check instead of building during dev:** run `npx tsc --noEmit` inside `apps/marketing`. **Do NOT run `next build` while the dev server is running** (it can corrupt `.next`); the real production build runs on Vercel on push.
- **Deploy:** the marketing site auto-deploys via **Vercel** on push (see `vercel.json`).
- **Responsive:** all mobile-only changes must be behind `md:`/`sm:` breakpoints so desktop is unaffected; verify no horizontal overflow at 320/375/390/430px.

### Git workflow (required)

- **Never commit directly to `main`.** Create a branch, open a PR against `main`, and merge from there. Keep commit messages clear; end them with the required `Co-Authored-By` trailer if configured.

### Running the full product app (only if asked)

The product app needs more setup (Supabase, Redis, OAuth, etc.) and most keys are optional for local boot (missing keys are reported, not fatal). See **Prerequisites**, **Database**, and **Run** below, and [`docs/setup-credentials-md.md`](docs/setup-credentials-md.md).

---

## What it does (the loop)

1. **Sign up & connect** a Gmail/Outlook mailbox (OAuth; tokens encrypted at rest).
2. **Onboard** — paste your website; we crawl it and an LLM drafts your company profile + brand accent (applied on a neutral, contrast-checked base).
3. **Find leads** via Google Places (industry + city; filters like "no website").
4. **Enrich** — fetch each lead's site + Google reviews, find an email, generate a "why reach out" hook.
5. **Draft** a personalized 3-message sequence per lead in your voice; review/edit in a keyboard-first queue; approve.
6. **Send** through your own mailbox — throttled, warm-up-aware, with scheduled follow-ups. Every email carries a working unsubscribe link + your physical address (non-removable compliance) and your Cal.com booking link.
7. **Replies** are ingested into a threaded inbox, classified, and stop the sequence; AI drafts a reply (approval-by-default).
8. **Bookings** (Cal.com webhook) and **link clicks** (tracked redirect) advance the pipeline and feed the **dashboard** (meetings/replies/clicks led; opens shown honestly as not-tracked).
9. **Billing** — buy credits via Stripe-hosted Checkout; credits are granted idempotently from the verified webhook; a segregated usage breakdown shows where credits went.

## Architecture

This is an [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) monorepo.

```
extrovertai/
  apps/
    marketing/  Next.js 15 marketing/landing website (public site; the active workstream) — port 4321
    web/        Angular + Tailwind frontend (lazy-loaded screens)
    api/        NestJS HTTP API (auth, feature endpoints, public webhooks)
    worker/     NestJS standalone BullMQ worker (enrichment, drafting, sending, reply polling)
  packages/
    shared/     Shared TypeScript types, enums, constants, CREDIT_COSTS, APP_NAME (@extrovertai/shared — browser-safe, no secrets)
    server/     Backend-only shared NestJS providers (@extrovertai/server — Supabase, billing, mailbox, places, llm, crawl, stripe, …; may hold secrets, NEVER imported by web)
  docs/         Build spine (00-master-context), progress log, code map, setup guide
  supabase/     SQL migrations (apply via the Supabase SQL editor)
```

- **Web UI (File 16 — UI/UX revamp):** every authenticated screen renders inside a persistent **app shell** (`apps/web/src/app/layout/` — left sidebar grouped Workflow/Manage/Billing+Settings, top bar with back + breadcrumb, credits chip, account menu). A reusable **component kit** lives in `apps/web/src/app/ui/` (button, page-header, card, empty-state, status-badge, skeleton, field, toast, confirm-dialog, pipeline-stepper). **Dark/light mode** is a token swap toggled from the top bar (and Settings), persisted in `localStorage`, defaulting to the OS preference (`ThemeModeService`). **Icons** use an inline-SVG set built from Lucide path data (`ui/icon`). Home is a launchpad with a getting-started checklist + pipeline overview; the four workflow screens carry a Find→Enrich→Write→Send stepper. Design tokens (calm warm-neutral base, one teal accent, semantic colours) are CSS variables in `apps/web/src/styles.css` mapped to Tailwind utilities.
- **DB/Auth/Storage:** Supabase (Postgres + Auth + RLS). **Queue:** BullMQ on Upstash Redis.
- **Credits:** balance is always `SUM(credit_ledger.delta)` (append-only). Every paid action runs through `withCreditGate` (reserve → call → commit/refund) so we never charge for a failed call. See [`docs/CODE-MAP.md`](docs/CODE-MAP.md) for the module index.
- **External APIs** are each wrapped in a single injectable provider (PlacesService, CrawlService, LlmService, MailboxSenderService, BillingService, StripeService, BookingService, …) — no scattered third-party `fetch`.
- **Webhooks** (Stripe, Cal.com) are signature-verified against the raw request body and idempotent.

## Prerequisites

- Node.js v20+ (developed on v24) and npm.
- A `.env` at the repo root: `cp .env.example .env` and fill values as you obtain them (see the [setup guide](docs/setup-credentials-md.md)). **Local dev boots without most keys** — missing keys are reported, not fatal (e.g. Stripe shows a calm "not switched on" state until keys are added).

## Install

```bash
npm install        # at the repo root; resolves all workspaces
```

## Database

SQL migrations live in [`supabase/migrations/`](supabase/migrations). Apply them in the Supabase **SQL Editor** (paste each file's contents and run — all are idempotent). They must be applied in filename order.

## Run

```bash
npm run dev:marketing  # Next.js marketing/landing site → http://localhost:4321 (no DB/keys needed)
npm run dev:api        # NestJS API on API_PORT (default 3000); GET /health, GET /health/db
npm run dev:worker     # NestJS standalone worker (BullMQ; warns if REDIS_URL is unset)
npm run dev:web        # Angular dev server on port 4200
```

## Build, lint & tests

```bash
npm run build      # builds shared → server → api → worker → web (zero type errors expected)
npm run lint       # ESLint across the repo

# Offline unit checks (no DB/network; Node 24 type-stripping):
node --experimental-strip-types scripts/test-booking.ts   # Cal.com webhook: signature + parse + idempotency
node --experimental-strip-types scripts/test-billing.ts   # Stripe: signature round-trip + grant extraction + pricing grounding
```

## Webhooks (local testing)

Stripe and Cal.com call back over HTTPS, so for local testing expose the API with a tunnel (e.g. ngrok) and set `PUBLIC_API_URL` / `PUBLIC_WEB_URL` to the tunnel/app origins:

- **Stripe:** register `…/webhooks/stripe`, put its signing secret in `STRIPE_WEBHOOK_SECRET`. Credits are granted only from this verified webhook (never the browser redirect).
- **Cal.com:** register `…/webhooks/calcom`, put its secret in `CALCOM_WEBHOOK_SECRET`. A booking advances the matched lead to `meeting`.

## How the build/docs system works

The project was built by feeding numbered build files (`docs/01-…md` … `docs/15-…md`) to an AI agent one at a time, often in separate (stateless) sessions. Continuity lives in two files, read at the start of every session and updated at the end:

- [`docs/00-master-context.md`](docs/00-master-context.md) — stable spec: stack, schema, conventions, locked decisions.
- [`docs/PROGRESS.md`](docs/PROGRESS.md) — living state: what's done, deferred, or blocked.

[`docs/CODE-MAP.md`](docs/CODE-MAP.md) is a one-line-per-module index of where everything lives.

## Status & remaining for production

The MVP is **code-complete and locally verified**. Remaining items are provisioning/approvals (not code), per the setup guide:

- **Stripe live mode** — add `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` (test mode works for dev); business verification for live mode.
- **Google OAuth production verification** — required for the restricted `gmail.*` scopes (start early; the app currently runs in Google "testing" mode = test users only).
- **Microsoft/Outlook** — `MS_OAUTH_*` not yet provisioned; the `OutlookProvider` is fully implemented and unverified until an Azure app exists.
- **Resend** — sending-domain verification for system email.
- **Cal.com** — cloud free tier works now; self-hosting is an optional later upgrade.
- **Deploy** — web on Vercel/Netlify, api+worker on Railway/Render, point webhooks at the real HTTPS domain.

Validating with a real agency before scaling spend is strongly advised.
