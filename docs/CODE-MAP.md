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

## apps/api (`src/`)
- `main.ts` — bootstrap: creates the HTTP app, global ValidationPipe, reads `API_PORT` from `.env`.
- `app.module.ts` — root module: global `ConfigModule` (loads repo-root `.env`) + feature modules.
- `health/health.module.ts`, `health/health.controller.ts` — `GET /health` → `{ status: 'ok', app: APP_NAME }`; `GET /health/db` → live admin-client count of `users` (DB readiness; 503 if unreachable).
- `auth/supabase-auth.guard.ts` — `SupabaseAuthGuard`: validates `Bearer` JWT via `auth.getUser`, attaches `request.user`. **Reuse on every protected route.**
- `auth/current-user.decorator.ts` — `@CurrentUser()` param decorator (reads `request.user`).
- `auth/auth-user.interface.ts` — `AuthUser { id, email }`; `auth/auth.module.ts` — provides/exports the guard.
- `users/users.service.ts` — `getOrCreateProfile()` (idempotent `users` row creation, admin client); `users/users.controller.ts` — `GET /me` (protected); `users/users.module.ts`.
- `mailboxes/mailboxes.service.ts` — orchestrates OAuth + token encryption + DB; signed-state CSRF. `mailboxes.controller.ts` — `GET /mailboxes/providers|connect/:provider`, `GET /mailboxes`, `DELETE /mailboxes/:id` (all guarded). `oauth-callback.controller.ts` — `GET /auth/:provider/callback` (unguarded; state-verified). `mailboxes.module.ts`.
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
- `app/app.routes.ts` — routes; all screens lazy-loaded via `loadComponent`. `/login` + `/signup` are `guestGuard`-only; `/home` is `authGuard`-only.
- `app/app.config.ts` — providers: router + `provideHttpClient(withInterceptors([authInterceptor]))`.
- `app/core/auth.service.ts` — `AuthService`: wraps the anon Supabase client, current `session` signal, signUp/signIn/signOut, access token.
- `app/core/auth.guard.ts` — `authGuard` (require auth) + `guestGuard` (require signed-out); both await `AuthService.ready`.
- `app/core/auth.interceptor.ts` — attaches `Authorization: Bearer <token>` to requests hitting `environment.apiUrl`.
- `app/core/mailbox-api.service.ts` — typed client for the mailbox endpoints (metadata only).
- `app/pages/landing/landing.*` — landing (CTA → /signup, /login). `app/pages/login/*`, `app/pages/signup/*` — auth screens. `app/pages/home/*` — protected home (shows email + fetches `GET /me`; link to /mailboxes). `app/pages/mailboxes/*` — protected Connect-your-mailbox screen.
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
