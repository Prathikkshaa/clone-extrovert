# CODE-MAP — where things live

> A short index of the codebase, updated as modules are added. Read this to find where to put new code.

## Workspaces (npm workspaces)

| Path | Name | Purpose |
|---|---|---|
| `packages/shared` | `@extrovertai/shared` | Shared TypeScript types, enums, and constants imported by every app. Built to `dist/` (CommonJS). |
| `apps/api` | `api` | NestJS HTTP API. |
| `apps/worker` | `worker` | NestJS **standalone** background worker (BullMQ; processors added File 06+). |
| `apps/web` | `web` | Angular + Tailwind frontend. |

## packages/shared (`src/`)
- `index.ts` — barrel re-exporting everything below.
- `app.ts` — `APP_NAME` (single source of the product name; env-aware, browser-safe).
- `enums/index.ts` — domain enums (LeadStatus, EnrichmentStatus, MessageState, UserMode, MailboxProvider, CampaignChannel, ThemeSource, CreditReason, UsageStatus, SuppressionReason).
- `types/index.ts` — shared DTO/entity types (empty stub; filled File 02+).
- `constants/index.ts` — `CREDIT_COSTS` (placeholder values; finalized File 14).

## apps/api (`src/`)
- `main.ts` — bootstrap: creates the HTTP app, global ValidationPipe, reads `API_PORT` from `.env`.
- `app.module.ts` — root module: global `ConfigModule` (loads repo-root `.env`) + feature modules.
- `health/health.module.ts`, `health/health.controller.ts` — `GET /health` → `{ status: 'ok', app: APP_NAME }`.
- Config: `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json`.

## apps/worker (`src/`)
- `main.ts` — bootstrap: standalone application context, startup log, SIGINT/SIGTERM graceful shutdown, keep-alive heartbeat.
- `app.module.ts` — root module: global `ConfigModule` (repo-root `.env`) + `QueueModule`.
- `queue/queue.module.ts`, `queue/queue.service.ts` — BullMQ placeholder; warns (does not crash) when `REDIS_URL` is unset. Processors added File 06+.
- Config: `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json`.

## apps/web (`src/`)
- `main.ts` — `bootstrapApplication(App, appConfig)`.
- `app/app.ts` — root shell (router-outlet only).
- `app/app.config.ts` — providers (router, etc.).
- `app/app.routes.ts` — routes; all screens lazy-loaded via `loadComponent`.
- `app/pages/landing/landing.ts` + `landing.html` — landing route; proves design tokens + `APP_NAME` are wired.
- `styles.css` — global styles + design tokens (CSS custom properties; dark-mode block).
- `tailwind.config.js` — maps tokens to semantic Tailwind utilities (bg-canvas, text-ink, bg-accent, …).
- `.postcssrc.json` — Tailwind + autoprefixer PostCSS plugins.
- Config: `angular.json` (lists `@extrovertai/shared` in `allowedCommonJsDependencies`), `tsconfig*.json`.

## Root
- `package.json` — workspaces + delegating scripts (`build`, `lint`, `dev:web|api|worker`).
- `eslint.config.mjs` — repo-wide ESLint flat config.
- `.env.example` — every env var (committed; real `.env` is gitignored).
- `.claude/launch.json` — dev-server launch config for the Preview tooling.
- `docs/` — `00-master-context.md` (source of truth), `PROGRESS.md` (living state), `CODE-MAP.md` (this file), `setup-credentials-md.md` (external accounts/keys).
