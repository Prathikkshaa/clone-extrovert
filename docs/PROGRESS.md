# PROGRESS — ExtrovertAI build state

> Updated at the end of every build session. New sessions read this + 00-master-context.md to know where things stand.

## Current status
- Last completed file: 01
- Next file: 02 (Supabase: client setup, migrations, RLS, generated DB types into packages/shared)
- Branch: main
- App boots: api ✅ / worker ✅ / web ✅

## Completed files
- [x] 01 — Monorepo scaffold (npm workspaces; web/api/worker skeletons; @extrovertai/shared package; Tailwind + design tokens; .env.example; docs). Commit: <set on commit>

## In progress / deferred / blockers
- (none)

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
