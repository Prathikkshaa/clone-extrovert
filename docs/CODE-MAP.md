# CODE-MAP — where things live

> A short index of the codebase, updated as modules are added. Read this to find where to put new code.

## Workspaces (npm workspaces)

| Path | Name | Purpose |
|---|---|---|
| `packages/shared` | `@extrovertai/shared` | Shared types, enums, constants, and generated DB types. Imported by every app (browser-safe — no secrets). Built to `dist/` (CommonJS). |
| `packages/server` | `@extrovertai/server` | **Backend-only** shared NestJS providers (Supabase; later Places/LLM/Mailbox/Billing). May hold secrets — **never imported by `apps/web`**. Built to `dist/` (CommonJS). |
| `apps/api` | `api` | NestJS HTTP API. |
| `apps/worker` | `worker` | NestJS **standalone** background worker (BullMQ; processors added File 06+). |
| `apps/web` | `web` | Angular + Tailwind frontend. |

## packages/shared (`src/`)
- `index.ts` — barrel re-exporting everything below.
- `app.ts` — `APP_NAME` (single source of the product name; env-aware, browser-safe).
- `enums/index.ts` — domain enums (LeadStatus, EnrichmentStatus, MessageState, UserMode, MailboxProvider, CampaignChannel, ThemeSource, CreditReason, UsageStatus, SuppressionReason).
- `types/index.ts` — re-exports `./database` (generated DB types are the single source for DB shapes).
- `types/database.ts` — Supabase `public` schema types: `Database`, `Json`, and helpers `Tables`/`TablesInsert`/`TablesUpdate`/`Enums`. Mirrors `supabase/migrations/*` (regen: see `/docs/DB.md`).
- `constants/index.ts` — `CREDIT_COSTS` (placeholder values; finalized File 14).

## packages/server (`src/`) — backend only
- `index.ts` — barrel.
- `supabase/supabase.service.ts` — `SupabaseService`: admin (service_role) Supabase client. **Never expose to the browser.**
- `supabase/supabase.module.ts` — `SupabaseModule` (provides/exports `SupabaseService`).
- `crypto/crypto.service.ts` + `crypto.module.ts` — `CryptoService`: AES-256-GCM encrypt/decrypt for secrets at rest (mailbox tokens).
- `mailbox/mailbox-provider.interface.ts` + `mailbox.types.ts` — provider abstraction + OAuth token/identity types.
- `mailbox/gmail.provider.ts`, `mailbox/outlook.provider.ts` — Google/Microsoft OAuth (auth URL, code exchange, refresh; send/listReplies stubbed for Files 10/11).
- `mailbox/mailbox-oauth.service.ts` + `mailbox.module.ts` — `MailboxOAuthService` selects a provider by key; `isConfigured()` status.
- `mailbox/oauth.util.ts` — form POST + id_token claim helpers.
- `crawl/crawl.service.ts` + `crawl.module.ts` — `CrawlService`: site text (Firecrawl → fetch+Cheerio fallback) + `fetchBranding` (logo/theme-color). **Reused by File 08.**
- `llm/llm.service.ts` + `llm.module.ts` — `LlmService`: OpenRouter completions + robust `extractJson`. **Reused by File 09.**
- `billing/billing.service.ts` + `billing.module.ts` + `billing.errors.ts` — `BillingService`: balance/addCredits/reserve/commit/refund + **`withCreditGate` (mandatory path for ALL paid actions)**; `InsufficientCreditsError`. **Used by 07/08/09/10/14.**
- `places/places.service.ts` + `places.module.ts` — `PlacesService`: Google Places API (New) text search + buying-signal filters (File 07) + **`getPlaceDetails(placeId)`** (reviews + freshest contact info; paid details SKU — File 08).
- `cache/cache.service.ts` + `cache.module.ts` — `CacheService`: Redis JSON cache w/ TTL (guarded). Used to avoid re-charging/re-calling paid lookups.
- `queue/redis.util.ts` — `buildRedisConnection(url)`: parse a redis(s):// URL into BullMQ/ioredis connection options. Shared by the api producer + worker consumer.
- `enrichment/contact-extract.ts` — **pure** email/phone helpers: `extractEmails`/`extractPhones`/`rankEmails`/`pickPhone`. Ranking de-prioritizes `noreply@`/generic, filters image-traps/placeholders; never fabricates. (File 08)
- `enrichment/enrichment.service.ts` + `enrichment.module.ts` — `EnrichmentService.enrichLead(userId, leadId)`: the per-lead enrichment unit — Place details (reviews, cached by place_id) + site crawl + email/phone extract + reviews split + "why reach out" hook (one LLM call, deterministic fallback). Metered via one `withCreditGate('enrichment', leadId)`; idempotent (skips already-`complete`). (File 08)
- `enrichment/enrichment.constants.ts` — `ENRICHMENT_QUEUE` + `EnrichLeadJob` (queue contract shared by api/worker).
- `drafting/drafting.service.ts` + `drafting.module.ts` — `DraftingService.draftForLead(userId, leadId)`: builds a grounded prompt from `company_profiles` + the lead's hook/reviews → ONE LLM call → a 3-message sequence (email + 2 follow-ups). Metered via one `withCreditGate('draft', leadId)`; idempotent (skips leads that already have holding-area drafts); `deleteDrafts` supports regenerate. Honesty guardrail in the prompt (never fabricate). (File 09)
- `drafting/drafting.constants.ts` — `DRAFTING_QUEUE` + `DraftLeadJob` + `SEQUENCE_STEPS` (step/label/waitDays).

## apps/api (`src/`)
- `main.ts` — bootstrap: creates the HTTP app, global ValidationPipe, reads `API_PORT` from `.env`.
- `app.module.ts` — root module: global `ConfigModule` (loads repo-root `.env`) + feature modules.
- `health/health.module.ts`, `health/health.controller.ts` — `GET /health` → `{ status: 'ok', app: APP_NAME }`; `GET /health/db` → live admin-client count of `users` (DB readiness; 503 if unreachable).
- `auth/supabase-auth.guard.ts` — `SupabaseAuthGuard`: validates `Bearer` JWT via `auth.getUser`, attaches `request.user`. **Reuse on every protected route.**
- `auth/current-user.decorator.ts` — `@CurrentUser()` param decorator (reads `request.user`).
- `auth/auth-user.interface.ts` — `AuthUser { id, email }`; `auth/auth.module.ts` — provides/exports the guard.
- `users/users.service.ts` — `getOrCreateProfile()` (idempotent `users` row creation, admin client) + **one-time signup credit bonus** (`SIGNUP_CREDITS`, default 100, granted on first create; best-effort); `users/users.controller.ts` — `GET /me` (protected); `users/users.module.ts` (imports `BillingModule`).
- `mailboxes/mailboxes.service.ts` — orchestrates OAuth + token encryption + DB; signed-state CSRF. `mailboxes.controller.ts` — `GET /mailboxes/providers|connect/:provider`, `GET /mailboxes`, `DELETE /mailboxes/:id` (all guarded). `oauth-callback.controller.ts` — `GET /auth/:provider/callback` (unguarded; state-verified). `mailboxes.module.ts`.
- `onboarding/onboarding.service.ts` — crawl → LLM extract → branding/accent → persist `company_profiles`. `onboarding.controller.ts` — `POST /onboarding/crawl`, `GET`/`PUT /company-profile` (guarded). `theme.util.ts` — accent contrast guard. `onboarding.dto.ts`, `onboarding.module.ts`.
- `credits/credits.controller.ts` — `GET /credits/balance` (balance + recent ledger, guarded). `credits.module.ts`.
- `leads/leads.service.ts` — gated+cached+dedup Places search, lists, save-to-list, **`getListLeads`** (leads + enrichment fields for the File 08 screen). `leads.controller.ts` — `POST /leads/search`, `GET /lists`, `GET /lists/:id/leads`, `POST /leads/save-to-list` (guarded). `leads.dto.ts`, `leads.module.ts`.
- `enrichment/enrichment.service.ts` — `EnrichmentApiService`: BullMQ **producer** (enqueue one job per lead) + upfront balance gate (enqueues only what's affordable, reports skipped) + status reads. `enrichment.controller.ts` — `POST /enrichment/enqueue`, `POST /enrichment/status` (guarded). `enrichment.dto.ts`, `enrichment.module.ts`. (File 08)
- `drafting/drafting.service.ts` — `DraftingApiService`: BullMQ **producer** (bulk draft, balance-gated) + review queue (`byLeads` → drafts grouped per lead with the hook) + `edit` (one message) + `approve` (a lead's whole set) + `regenerate` (delete + re-enqueue). `drafting.controller.ts` — `POST /drafts/enqueue|by-leads|approve|regenerate`, `PUT /drafts/:id` (guarded). `drafting.dto.ts`, `drafting.module.ts`. (File 09)
- Config: `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json`.

## apps/worker (`src/`)
- `main.ts` — bootstrap: standalone application context, startup log, SIGINT/SIGTERM graceful shutdown, keep-alive heartbeat.
- `app.module.ts` — root module: global `ConfigModule` (repo-root `.env`) + `QueueModule` + `EnrichmentWorkerModule`.
- `queue/queue.module.ts`, `queue/queue.service.ts` — BullMQ wiring (Upstash). `metering-test` queue + worker demonstrating `withCreditGate`; warns + runs without queues when `REDIS_URL` is unset.
- `enrichment/enrichment.worker.ts` + `enrichment.worker.module.ts` — `EnrichmentWorker`: BullMQ **consumer** on `ENRICHMENT_QUEUE` (concurrency 3) → `EnrichmentService.enrichLead`. Guarded by `REDIS_URL`. (File 08)
- `drafting/drafting.worker.ts` + `drafting.worker.module.ts` — `DraftingWorker`: BullMQ **consumer** on `DRAFTING_QUEUE` (concurrency 2 — LLM rate limits) → `DraftingService.draftForLead`. (File 09)
- Config: `nest-cli.json`, `tsconfig.json`, `tsconfig.build.json`.

## apps/web (`src/`)
- `main.ts` — `bootstrapApplication(App, appConfig)`.
- `app/app.ts` — root shell (router-outlet only).
- `app/app.config.ts` — providers (router, etc.).
- `app/app.routes.ts` — routes; all screens lazy-loaded via `loadComponent`. `/login` + `/signup` are `guestGuard`-only; `/home` is `authGuard`-only.
- `app/app.config.ts` — providers: router + `provideHttpClient(withInterceptors([authInterceptor]))`.
- `app/core/auth.service.ts` — `AuthService`: wraps the anon Supabase client, current `session` signal, signUp/signIn/signOut, access token.
- `app/core/auth.guard.ts` — `authGuard` (require auth) + `guestGuard` (require signed-out); both await `AuthService.ready`.
- `app/core/auth.interceptor.ts` — attaches `Authorization: Bearer <token>` to requests hitting `environment.apiUrl`.
- `app/core/mailbox-api.service.ts` — typed client for the mailbox endpoints (metadata only).
- `app/core/company-profile.service.ts` — client for onboarding/company-profile. `app/core/theme.service.ts` — applies/reverts the brand accent token. `app/core/credits.service.ts` — reads credit balance + recent ledger (home header chip). `app/core/leads.service.ts` — lead search + lists client. `app/core/enrichment.service.ts` — enrichment client (list leads, enqueue, status poll). (File 08)
- `app/pages/search/*` — protected Find-leads screen (search form, filters, results cards, save-to-list, "Enrich them →" link).
- `app/pages/enrich/*` — protected Enrich-leads screen: pick a list, enrich selected/all, **per-lead progress poll** (non-blocking), cards show email-or-"no email found", phone, positive/negative reviews, and the **hook as a highlighted callout**; cost shown before, balance chip updates after. (File 08)
- `app/core/drafting.service.ts` — drafting client (enqueue, by-leads, edit, approve, regenerate). `app/pages/draft/*` — protected **keyboard-first review queue**: pick list, bulk-generate, one lead at a time with the **hook beside the draft**, step tabs (email + 2 follow-ups), inline edit (saved on blur), approve/skip/regenerate with keyboard shortcuts (Enter/→ approve, ↓ skip, ↑ back, R regenerate, 1/2/3 step), per-lead progress poll, failed-draft retry. (File 09)
- `app/pages/landing/landing.*` — landing (CTA → /signup, /login). `app/pages/login/*`, `app/pages/signup/*` — auth screens. `app/pages/home/*` — protected home (email + `GET /me`; applies theme; links to onboarding/settings/mailboxes). `app/pages/mailboxes/*` — Connect-your-mailbox. `app/pages/onboarding/*` — website-to-profile flow (URL → skeleton → editable review + manual path). `app/pages/settings/*` — theme reset.
- `environments/environment.ts` — **generated** (gitignored) public client config; `environment.example.ts` — committed template. Generator: `scripts/gen-web-env.mjs`.
- `styles.css` — global styles + design tokens (CSS custom properties; dark-mode block).
- `tailwind.config.js` — maps tokens to semantic Tailwind utilities (bg-canvas, text-ink, bg-accent, …).
- `.postcssrc.json` — Tailwind + autoprefixer PostCSS plugins.
- Config: `angular.json` (lists `@extrovertai/shared` in `allowedCommonJsDependencies`), `tsconfig*.json`.

## Root
- `package.json` — workspaces + delegating scripts (`build`, `lint`, `dev:web|api|worker`).
- `scripts/gen-web-env.mjs` — writes `apps/web/src/environments/environment.ts` from `.env` (public client config only).
- `eslint.config.mjs` — repo-wide ESLint flat config.
- `.env.example` — every env var (committed; real `.env` is gitignored).
- `.claude/launch.json` — dev-server launch config for the Preview tooling.
- `supabase/` — Supabase CLI project: `config.toml` and `migrations/*.sql` (the schema; never edit a past migration).
- `docs/` — `00-master-context.md` (source of truth), `PROGRESS.md` (living state), `CODE-MAP.md` (this file), `DB.md` (migrations + type-gen workflow), `setup-credentials-md.md` (external accounts/keys).
