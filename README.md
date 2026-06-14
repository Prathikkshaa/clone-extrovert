# ExtrovertAI

ExtrovertAI is a global, email-first B2B sales-outreach platform for solo founders, freelancers, small SaaS companies, digital marketing agencies, and IT solution providers. A user connects their own Gmail/Outlook mailbox, and the platform finds leads, enriches them, drafts personalized emails in the user's own voice, sends them through the user's mailbox in a throttled, compliant sequence with follow-ups, ingests replies into a threaded inbox, drafts AI replies (approval-by-default), books meetings via Cal.com, and tracks everything on a dashboard. The platform owns all third-party API keys; users pay via a credit system metered per action. "ExtrovertAI" is a placeholder name surfaced through a single `APP_NAME` constant so it can be renamed later.

> **For contributors / AI agents:** read [`/docs/00-master-context.md`](docs/00-master-context.md) first (every session), then [`/docs/PROGRESS.md`](docs/PROGRESS.md) and [`/docs/CODE-MAP.md`](docs/CODE-MAP.md). External account/key setup is documented in [`/docs/setup-credentials-md.md`](docs/setup-credentials-md.md).

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
    web/        Angular + Tailwind frontend (lazy-loaded screens)
    api/        NestJS HTTP API (auth, feature endpoints, public webhooks)
    worker/     NestJS standalone BullMQ worker (enrichment, drafting, sending, reply polling)
  packages/
    shared/     Shared TypeScript types, enums, constants, CREDIT_COSTS, APP_NAME (@extrovertai/shared — browser-safe, no secrets)
    server/     Backend-only shared NestJS providers (@extrovertai/server — Supabase, billing, mailbox, places, llm, crawl, stripe, …; may hold secrets, NEVER imported by web)
  docs/         Build spine (00-master-context), progress log, code map, setup guide
  supabase/     SQL migrations (apply via the Supabase SQL editor)
```

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
npm run dev:api     # NestJS API on API_PORT (default 3000); GET /health, GET /health/db
npm run dev:worker  # NestJS standalone worker (BullMQ; warns if REDIS_URL is unset)
npm run dev:web     # Angular dev server on port 4200
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
