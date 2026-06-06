# 01 — Monorepo Scaffold

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully. It is the source of truth.
2. Read `/docs/PROGRESS.md` (if it doesn't exist yet, this file creates it).
3. Then execute the scope below. Do ONLY this file's scope.

## Preconditions to verify
- Node v20+ and npm available (`node -v`, `npm -v`).
- git available and authenticated to GitHub; a remote repo named `ExtrovertAI` exists (created by the user per the Setup MD).
- This is a fresh/empty working directory (or contains only this repo's initial state).
- If the repo already has app code, STOP — this scaffold file was likely already run; check `/docs/PROGRESS.md`.

## Scope of THIS file
Create the monorepo skeleton exactly as specified in `00-master-context.md` §4, with Tailwind + design tokens (§7) and the bookkeeping docs. No feature logic yet — this is the empty, buildable shell that every later file fills in.

### 1. Root workspace
- Initialize git if needed; set the `origin` remote to the user's `ExtrovertAI` repo; default branch `main`.
- Create root `package.json` using **npm workspaces** with workspaces: `apps/*`, `packages/*`.
- Add a root `.gitignore` covering: `node_modules`, `dist`, `.env`, `.env.*` (but NOT `.env.example`), Angular/Nest build output, coverage, OS files, editor folders, ngrok logs.
- Add root `README.md`: one-paragraph project description (from §1), how to install (`npm install` at root), how to run each app, and a pointer to `/docs/00-master-context.md` and the Setup MD.
- Add root scripts that delegate to workspaces: `build`, `lint`, `dev:web`, `dev:api`, `dev:worker` (wire these to the per-app scripts).

### 2. `packages/shared`
- A TypeScript package (buildable, with its own `tsconfig`) exporting:
  - `APP_NAME` constant = value from env or default `"ExtrovertAI"` (single source for the app name; UI must use this, never a hardcoded string).
  - Placeholder barrel files for: `types/` (DTOs, entities — empty stubs now), `enums/` (lead status, message state, mode, providers, credit reasons — define the enums from §5/§6 now since they're stable), `constants/` (a `CREDIT_COSTS` object with named keys `search`/`enrichment`/`draft`/`send` set to placeholder values + a `// TODO: finalized in File 14` note).
- Ensure `apps/api`, `apps/worker`, `apps/web` can import from `@extrovertai/shared` (configure paths/workspace name accordingly).

### 3. `apps/api` (NestJS)
- Scaffold a minimal NestJS app that compiles and boots.
- A single `GET /health` endpoint returning `{ status: 'ok', app: APP_NAME }`.
- Wire global config loading from `.env` (use Nest's config module). Read `API_PORT` (default 3000).
- Add a global validation pipe (class-validator) ready for later DTOs.
- Add the top-of-file doc-comment convention (§10) to the main module.

### 4. `apps/worker` (NestJS standalone)
- Scaffold a NestJS **standalone application** (no HTTP server) that boots and logs "worker started".
- Add BullMQ as a dependency and create an empty queue-module placeholder (no processors yet — those arrive in File 06+). It should compile and run without a live Redis connection (guard the connection so booting doesn't crash if `REDIS_URL` is absent — log a clear warning instead).

### 5. `apps/web` (Angular + Tailwind)
- Scaffold a minimal Angular app that builds and serves.
- Install and configure **Tailwind CSS**.
- Implement the **design tokens** from §7 as CSS custom properties in the global stylesheet AND map them into the Tailwind config (semantic names, not raw hex), specifically:
  - `--color-ink: #1A1A18`, `--color-canvas: #FAFAF8`, an accent token (deep teal/green — pick one, document the hex), and semantic tokens `--color-positive` (green), `--color-warning` (amber), `--color-danger` (red).
  - A spacing scale, radius tokens (`md`, `lg`), and a type scale with weights 400/500 only (headings 22/18/16 @500, body 16/400).
  - Tokens must be swappable for theming later (File 05) and for dark mode — structure them so changing values re-themes the app without component edits.
- Add a single placeholder landing route showing `APP_NAME` and a short tagline, styled with the tokens (canvas background, ink text, accent on one button) so the token system is visibly working.
- Set up lazy-loadable routing structure (even with one route now) per the performance rule (§7).

### 6. Bookkeeping docs
- Create `/docs/PROGRESS.md` (see template below).
- Create `/docs/CODE-MAP.md`: a short index listing each app/package and one line on its purpose; will be updated by later files.

### 7. `.env.example`
- Create `.env.example` at repo root with EXACTLY the variable names listed in the Setup MD's final `.env` block (all of them, empty values, grouped with the same comment headers). This file IS committed. `.env` is NOT.

## AI-friendly code requirements (from §10)
- Explicit types; no `any`. Small single-purpose files. Top-of-file doc comments explaining purpose + why.
- All future external-API access will go through injectable providers — leave the structure clean so those slot in.
- Keep `CODE-MAP.md` accurate as you add things.

## Verification (must pass before Done)
1. `npm install` at root succeeds (workspaces resolve).
2. `npm run build` builds all three apps + shared with **zero type/compile errors**.
3. `apps/api` boots; `GET /health` returns `{ status: 'ok', app: 'ExtrovertAI' }`.
4. `apps/worker` boots and logs startup (and logs a clean warning, not a crash, if `REDIS_URL` is empty).
5. `apps/web` builds and serves; the landing route renders with canvas/ink/accent tokens applied.
6. Lint passes across the repo.

### Visual verification (UI present in this file)
- The web app has a visible landing route, so run §8 of `00-master-context.md`:
  - Serve `apps/web`, open the landing route in **Claude in Chrome**.
  - **Expected visual result:** warm off-white background (not stark white), warm near-black text, exactly one accented button in the teal/green accent, app name shown via `APP_NAME`, no purple, no gradients, clean and calm.
  - Fix any deviation, re-verify. If Claude in Chrome is unavailable, use the §8 fallback (confirm it builds/serves, write a manual checklist for the user, note the skip in `PROGRESS.md`).

## Definition of Done (from §9)
- All verification passes (incl. visual or its fallback).
- `/docs/PROGRESS.md` updated: mark File 01 done, list what exists now, note anything deferred.
- `/docs/CODE-MAP.md` reflects the scaffold.
- Commit: `chore(scaffold): 01 monorepo skeleton, tailwind tokens, docs`
- Push to `main`.

## What's next
File 02 — Supabase: client setup, all migrations (schema §5), RLS, and generated DB types into `packages/shared`. File 02 will assume this scaffold exists and builds cleanly.

---

### `/docs/PROGRESS.md` — create with this template
```markdown
# PROGRESS — ExtrovertAI build state

> Updated at the end of every build session. New sessions read this + 00-master-context.md to know where things stand.

## Current status
- Last completed file: 01
- Next file: 02
- Branch: main
- App boots: api ✅ / worker ✅ / web ✅  (update as true)

## Completed files
- [x] 01 — Monorepo scaffold (workspaces, web/api/worker skeletons, shared package, Tailwind + design tokens, .env.example, docs). Commit: <hash>

## In progress / deferred / blockers
- (none)

## Decisions & notes (append-only)
- Accent color chosen: <hex> (teal/green).
- (add notes future sessions must know)

## How to run
- Install: `npm install` (root)
- API: `npm run dev:api`  (port from API_PORT)
- Worker: `npm run dev:worker`
- Web: `npm run dev:web`  (port from WEB_PORT)
```
