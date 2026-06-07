# PROGRESS — ExtrovertAI build state

> Updated at the end of every build session. New sessions read this + 00-master-context.md to know where things stand.

## Current status
- Last completed file: 05
- Next file: 06 (Credit ledger + metering core: ledger/usage services, atomic reserve→commit→refund, balance = sum(ledger), BullMQ gate scaffold)
- Branch: main
- App boots: api ✅ / worker ✅ / web ✅
- DB: schema + RLS live on Supabase project `ywdrznybrxyskvyccwxb`; generated types in `@extrovertai/shared`.
- Auth: Supabase Auth live — web signup/login + guards; API JWT guard + `GET /me`; `users` profile row auto-created on first authed request.
- Mailbox OAuth: built for Gmail + Outlook. **Gmail live OAuth + token refresh VERIFIED** (connected `nuras1999@gmail.com`; access+refresh tokens encrypted at rest; live refresh returns a fresh token). Outlook deferred — Microsoft Azure app/creds pending.
- Onboarding: `CrawlService` (Firecrawl + fetch fallback) + `LlmService` (OpenRouter) live; website-to-profile extraction, logo/accent theming (contrast-guarded), manual path, Settings theme reset. **Crawl + LLM extraction verified live** (stripe.com → grounded profile).

## In progress / deferred / blockers
- **Outlook (Microsoft) credential gap:** `MS_OAUTH_CLIENT_ID/SECRET` are not in `.env` (user is setting up Azure later). `OutlookProvider` is fully implemented; live connect/refresh unverified until then. To verify later: create the Azure app (redirect URI `http://localhost:3000/auth/microsoft/callback`), fill `MS_OAUTH_*` in `.env`, restart the API, `/mailboxes` → Connect Outlook → consent → expect a connected row with encrypted tokens.
- **Gmail: DONE.** `GOOGLE_OAUTH_*` set; connect URL accepted by Google; full consent → callback → encrypted storage → refresh verified live (2026-06-07). Google app is in "testing" mode (test users only) — fine for dev; production needs Google verification for the restricted `gmail.*` scopes.

## Completed files
- [x] 01 — Monorepo scaffold (npm workspaces; web/api/worker skeletons; @extrovertai/shared package; Tailwind + design tokens; .env.example; docs). Commit: c5bea53
- [x] 02 — Supabase data layer: `@extrovertai/server` package with `SupabaseService` (admin client, backend-only); full schema migration (17 tables, 10 enums, FKs, updated_at triggers, indexes, RLS); generated DB types in `@extrovertai/shared`; `GET /health/db` readiness check; `docs/DB.md`. **No UI changes** (visual verification N/A). Commit: 9ddd272
- [x] 03 — Authentication: Supabase Auth. Web `AuthService` (anon client), login/signup screens, `authGuard`/`guestGuard`, Bearer HTTP interceptor, protected Home; API `SupabaseAuthGuard` (validates JWT via `auth.getUser`), `@CurrentUser()`, `GET /me`, idempotent `users` profile creation. Verified end-to-end (login → /me 200, no token → 401, RLS own-row only, profile created exactly once) + visual (login/signup). Commit: 793d15a
- [x] 04 — Mailbox OAuth: `CryptoService` (AES-256-GCM) + Gmail/Outlook providers + `MailboxOAuthService` in `@extrovertai/server`; API `MailboxesService` (signed-state CSRF, encrypted token storage), `/mailboxes` connect/list/disconnect/providers + unguarded `/auth/:provider/callback`; web Connect-mailbox screen. Verified: build, lint, AES-GCM round-trip, not-configured 400, CRUD + RLS + metadata-only (no token leak), encrypted-at-rest, 401, visual (login e2e + /mailboxes). **Gmail verified live (see status); Outlook pending creds.** Commit: 480f0fb
- [x] 05 — Onboarding + website-to-profile + theming: `CrawlService` + `LlmService` (in `@extrovertai/server`, reused by 08/09); API `OnboardingService` + `POST /onboarding/crawl`, `GET`/`PUT /company-profile`; web onboarding flow (URL → skeleton → prefilled editable review), "no website" manual path, `ThemeService` (accent token swap), Settings reset. Verified: build, lint, **live crawl+extract (stripe.com → grounded profile, branding detected, raw_crawl cached)**, visual (URL step, manual review, theme applied on neutral base + reset to official). Commit: a68dc72

## Decisions & notes (append-only)
- **Toolchain versions:** Node v24.16.0, npm 11.13.0. Angular **22.0.0** (generated via Angular CLI), TypeScript **~6.0.2** (monorepo-wide), NestJS **11**, `@nestjs/config` **4** (independently versioned — not 11), BullMQ **5**.
- **Accent color chosen:** `#0F766E` (deep teal). Semantic tokens: positive `#15803D`, warning `#B45309`, danger `#B91C1C`. Canvas `#FAFAF8`, ink `#1A1A18`. Defined as CSS custom properties in `apps/web/src/styles.css` and mapped to semantic Tailwind utility names in `apps/web/tailwind.config.js`.
- **Tailwind v3.4** (classic `tailwind.config.js` + `.postcssrc.json`), chosen over v4's CSS-first model for predictability and to match master-context §7's "CSS variables + Tailwind config" wording. Tokens are a pure swap (dark-mode block already present via `[data-theme="dark"]`/`.dark`) so theming (File 05) needs no component edits.
- **Shared package consumption:** `@extrovertai/shared` builds to CommonJS (`dist/`, with both `main`/`types` and an `exports` map) so the Node apps (moduleResolution `node`) and Angular (bundler resolution) both resolve it. Angular's `allowedCommonJsDependencies` lists it to avoid the CJS optimization-bailout warning. **Build order matters:** shared is built first (root `build` script enforces this).
- **APP_NAME** reads `process.env.APP_NAME` with a `typeof process` guard so it is safe in browser bundles (falls back to `"ExtrovertAI"`); single source for the product name.
- **TS 6.0 quirks handled:** added `"ignoreDeprecations": "6.0"` (node10 moduleResolution is deprecated in TS6) and explicit `"rootDir": "./src"` to the Nest tsconfigs. Removed `"incremental": true` from the Nest tsconfigs because it conflicts with nest-cli's `deleteOutDir` (stale `.tsbuildinfo` caused only changed files to re-emit, breaking `node dist/main.js`). If re-adding incremental later, disable `deleteOutDir` or clean `.tsbuildinfo`.
- **Worker keep-alive:** the standalone Nest context exits immediately once the event loop drains (an unresolved Promise does NOT hold it open). A `setInterval` heartbeat keeps the worker daemon alive until real BullMQ Workers (File 06+) hold the loop open via Redis sockets. Shuts down cleanly on SIGINT/SIGTERM.
- **Lint:** single repo-wide ESLint flat config (`eslint.config.mjs`) using `@eslint/js` + `typescript-eslint` recommended over all `**/*.ts`; root `npm run lint` = `eslint .`. (Build/dev scripts delegate to workspaces; lint is intentionally a single root pass — still repo-wide.)
- **Dev-server PATH note (this machine):** Node/npm are provided via nvm and are NOT on the default non-login-shell PATH. The committed `.claude/launch.json` uses plain `npm` (portable/correct for normal setups). Visual verification this session was done via the Claude Preview MCP after pointing the launch config at a temporary PATH-setting wrapper, which was then removed and the config restored.

### File 02 decisions & additions
- **New package `@extrovertai/server`** (`packages/server`) — backend-only shared NestJS providers (Supabase now; Places/LLM/Mailbox/Billing later). Goes beyond the §4 layout but is justified: api AND worker both need these providers, and they may hold secrets (service_role) so they must NOT live in the browser-safe `@extrovertai/shared`. **Never import `@extrovertai/server` from `apps/web`.** Build order: shared → server → apps.
- **`GET /health/db`** added to api — readiness probe doing a `count(*)` on `users` via the admin client; verified live (count 0, HTTP 200).
- **Schema columns beyond §5 (sensible concretions):** `users.plan` default `'free'`; `mailboxes`: `access_token_encrypted`, `refresh_token_encrypted`, `token_expires_at`, `daily_cap` (50), `warmup_state` ('new'), `status` ('connected'); `sequence_steps`: `template_ref` + `prompt` (the "template/prompt ref"); jsonb defaults (`proof_points '[]'`, `reviews/filters/payload '{}'`). `mailboxes.warmup_state`/`status` and `campaigns.status` are **text** (not enums) — values not yet locked; revisit if they need constraining.
- **RLS:** owner policies `FOR ALL TO authenticated` using `user_id = auth.uid()` (derived from parent for `lead_list`/`sequence_steps`/`messages`). Verified: anon SELECT returns 0 rows, anon INSERT blocked with code 42501. service_role bypasses RLS (expected) — backend must still scope by `user_id`.
- **Type generation:** `supabase gen types --db-url` requires Docker (runs a pg-meta container); Docker is not installed on this machine, and `--project-id` needs a Supabase access token. So `packages/shared/src/types/database.ts` was **hand-authored to mirror the migration** (supabase-generated shape: Row/Insert/Update/Relationships/Enums). `docs/DB.md` documents both regeneration routes. Keep this file in sync with the SQL on every schema change until generation tooling is available.
- **Migrations applied via** `supabase db push --db-url "$DATABASE_URL"` (direct 5432 connection). DATABASE_URL is read from `.env`, never echoed.

### File 03 decisions & notes
- **Default `daily_send_cap` = 50** (the DB column default; insert omits it). Conservative account-level ceiling; per-mailbox warm-up/throttle is File 10. `mode` defaults to `draft`.
- **JWT validation** uses `supabase.auth.getUser(token)` (network call to GoTrue) rather than verifying the JWT secret locally — works with any signing scheme and needs no extra secret (we were not given the JWT secret). Trade-off: one auth call per protected request; revisit with local JWKS/secret verification if latency matters.
- **Profile creation** happens in `GET /me` (the web app calls it right after login). Idempotent via PK + re-read on race. If a future protected endpoint can be hit before `/me`, move `getOrCreateProfile` into the guard.
- **Web public config**: `apps/web/src/environments/environment.ts` is **generated from `.env`** by `scripts/gen-web-env.mjs` (wired into web `start`/`build`/`watch`) and **gitignored** — keeps even the public anon key out of git. Committed template: `environment.example.ts`. A raw `ng build` without the gen step will fail (documented); use `npm run build`/`dev:web`.
- **CORS** enabled on the API (`origin: true` for dev; tighten for prod) so the browser can call `/me` with the Bearer token.
- **Email confirmation**: signup UI handles both modes — if the Supabase project requires email confirmation, it shows "check your inbox, then log in"; if disabled, it goes straight to /home. For a frictionless dev login flow, the project owner can turn off "Confirm email" in Supabase Auth settings. (Verification used an admin-created pre-confirmed user, so it passes regardless.)
- **`@types/express`** added to `apps/api` devDeps (needed for the `Request` type in the guard/decorator under Express 5).

### File 04 decisions & notes
- **Both providers fully built (not stubbed).** Gmail and Outlook each implement `getAuthUrl`/`exchangeCode`/`refreshToken` (send/listReplies are interface signatures, thrown stubs until Files 10/11). Selected by `MailboxOAuthService`. They report `isConfigured()=false` when env creds are absent, so the UI shows "not set up yet" and `connect` returns a friendly 400.
- **OAuth scopes chosen (documented in code):**
  - Gmail: `gmail.send`, `gmail.readonly`, `openid`, `email` + `access_type=offline&prompt=consent` (for refresh token). gmail.* are *restricted* scopes — dev works with test users; prod needs Google verification.
  - Outlook: `Mail.Send`, `Mail.Read`, `offline_access`, `openid`, `email` via the `/common` authority.
- **URL provider keys** are `google`/`microsoft` (match the redirect URIs in `.env`); the DB `mailbox_provider` enum is `gmail`/`outlook`. Mapped in each provider.
- **Token encryption:** `CryptoService` (AES-256-GCM, key = base64-decoded `TOKEN_ENCRYPTION_KEY`). Ciphertext format `v1:<base64(iv|tag|ct)>`. Tokens are encrypted before DB write; `GET /mailboxes` returns metadata only (verified no token fields in responses).
- **Default mailbox `daily_cap` = 30** (conservative warm-up start; ramped in File 10). `warmup_state='new'`, `status='connected'` on connect.
- **Callback security:** `GET /auth/:provider/callback` is intentionally **NOT** behind the JWT guard (the provider redirect carries no Bearer header). Instead an HMAC-signed `state` (signed with the `TOKEN_ENCRYPTION_KEY` bytes, 10-min TTL) ties the callback back to the user. The callback always redirects to `${WEB}/mailboxes?mailbox=connected|cancelled|failed`.
- **CryptoService/Mailbox providers live in `@extrovertai/server`** (backend-only) so the worker can reuse them for send/refresh in File 10.

### File 05 decisions & notes
- **CrawlService** (`@extrovertai/server`): primary = Firecrawl v1 `/scrape` (markdown, onlyMainContent); fallback = plain `fetch` + Cheerio text extraction (used when Firecrawl has no key / fails). A Playwright fallback for JS-rendered sites can slot in behind the same interface later. `fetchBranding` parses `og:image`/`<link rel=icon>` for logo + `<meta name=theme-color>` for accent (best-effort; no image color analysis). `raw_crawl` cached on `company_profiles` for re-extraction without re-crawling. Added `cheerio` dep.
- **LlmService** (`@extrovertai/server`): OpenRouter chat completions via `LLM_MODEL`; one abstraction so swapping models is one env value. `extractJson` is hardened (strips code fences, scans for a balanced JSON block, retries once) because reasoning models wrap answers in prose.
- **LLM model in use: `nvidia/nemotron-3-super-120b-a12b:free`.** Verified working live (crawled stripe.com → grounded services/about/value_prop/tone + 5 proof_points). ⚠️ It's a **reasoning** model: slow (~50–90s/extraction) and intermittently exceeds the token/time budget (one run returned null fields → handled by the manual-path fallback). **Recommendation:** switch `LLM_MODEL` to a fast free *instruct* model (e.g. a Llama/Gemini/Qwen `:free` instruct id from OpenRouter) for snappy, reliable extraction — it's a one-line `.env` change. Left as-is per user's choice.
- **Theming (contrast guard):** `resolveAccent` applies the detected `brand_color` as the accent ONLY if its contrast vs white ≥ 3.0 (button text is white); otherwise it falls back to the official accent `#0F766E` and flags it. Theme is a pure token swap — web `ThemeService` sets `--color-accent`/`--color-accent-strong`; it never repaints canvas/text. `theme_source` toggles `fetched`/`official`; Settings has the one-click reset. Verified visually (orange brand accent applied on neutral base, then reset to teal).
- **Crawl runs inline** in `POST /onboarding/crawl` (HTTP 201). Because the current model is slow, consider moving this behind the BullMQ queue (File 06) with polling if it stays slow; inline is acceptable for MVP per the build file.
- **Failure handling:** unreachable/empty site → 400 with plain copy + manual path; LLM parse failure → profile saved with empty fields + a "couldn't auto-fill, add details" notice (never fabricated). `PUT /company-profile` sends the full profile (Settings included) so theme toggles never drop fields.

## Visual verification (File 01)
- Performed via the **Claude Preview MCP** (Claude in Chrome was not connected this session). Landing route at `/` confirmed:
  - body background `rgb(250,250,248)` = `#FAFAF8` (canvas); text `rgb(26,26,24)` = `#1A1A18` (ink).
  - one accent button `rgb(15,118,110)` = `#0F766E` (teal), white text, font-weight 500, rounded.
  - app name shown via `APP_NAME`; no purple, no gradients; no console errors.

## How to run
- Install: `npm install` (root)
- API: `npm run dev:api`  (port from API_PORT, default 3000; `GET /health` → `{ status: 'ok', app: 'ExtrovertAI' }`)
- Worker: `npm run dev:worker`  (warns and runs cleanly if REDIS_URL is unset)
- Web: `npm run dev:web`  (Angular dev server on port 4200)
- Build all: `npm run build`   |   Lint all: `npm run lint`
