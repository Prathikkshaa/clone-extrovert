# ExtrovertAI

ExtrovertAI is a global, email-first B2B sales-outreach platform for solo founders, freelancers, small SaaS companies, digital marketing agencies, and IT solution providers. A user connects their own Gmail/Outlook mailbox, and the platform finds leads, enriches them, drafts personalized emails in the user's own voice, sends them through the user's mailbox in a throttled, compliant sequence with follow-ups, ingests replies into a threaded inbox, drafts AI replies, books meetings, and tracks everything on a dashboard. The platform owns all third-party API keys; users pay via a credit system metered per action. "ExtrovertAI" is a placeholder name surfaced through a single `APP_NAME` constant so it can be renamed later.

> **For contributors / AI agents:** read [`/docs/00-master-context.md`](docs/00-master-context.md) first (every session), then [`/docs/PROGRESS.md`](docs/PROGRESS.md). External account/key setup is documented in [`/docs/setup-credentials-md.md`](docs/setup-credentials-md.md).

## Monorepo layout

This is an [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) monorepo.

```
extrovertai/
  apps/
    web/        Angular + Tailwind frontend
    api/        NestJS HTTP API
    worker/     NestJS standalone BullMQ worker
  packages/
    shared/     Shared TypeScript types, enums, constants (@extrovertai/shared)
  docs/         Build spine, progress log, code map, setup guide
```

## Prerequisites

- Node.js v20+ and npm
- A `.env` file at the repo root: `cp .env.example .env` and fill in values as needed (see the setup guide). Local development boots without most keys — missing keys are reported, not fatal.

## Install

```bash
npm install        # at the repo root; resolves all workspaces
```

## Run

```bash
npm run dev:api     # NestJS API on API_PORT (default 3000); GET /health
npm run dev:worker  # NestJS standalone worker (BullMQ; warns if REDIS_URL is unset)
npm run dev:web     # Angular dev server on port 4200
```

## Build & lint (all workspaces)

```bash
npm run build      # builds shared, then api, worker, web
npm run lint       # ESLint across the repo
```
