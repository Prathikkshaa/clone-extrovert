# 02 — Supabase: Client, Schema, RLS, Types

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (source of truth — schema is in §5).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- File 01 done: monorepo builds cleanly (`npm run build` passes); `apps/api`, `apps/worker`, `apps/web`, `packages/shared` exist.
- `.env` exists with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `TOKEN_ENCRYPTION_KEY` filled (Setup MD Step 3). If missing, STOP and tell the user which values are needed.

## Scope of THIS file
Set up Supabase access and create the entire database schema from `00-master-context.md` §5 via migrations, with row-level security, and generate typed DB definitions into `packages/shared`. No feature endpoints yet — this is the data layer.

### 1. Supabase clients (providers, per §10)
- In a shared backend location (importable by `api` and `worker`), create a `SupabaseService` provider that:
  - exposes an **admin client** (service_role key) for backend/worker use — never exposed to the browser.
  - documents clearly (doc comment) that the service_role key must never reach the frontend.
- The Angular app will use the **anon key** client separately (set up in File 03 for auth). Do not put the service_role key anywhere in `apps/web`.

### 2. Migrations — create the full schema (§5)
Create SQL migrations (one logical migration is fine, or split by domain) defining every table in §5 with:
- UUID primary keys (default gen), `created_at` and `updated_at` (with an `updated_at` trigger) on every table.
- Correct foreign keys and the stated enums (use Postgres enum types or check constraints matching the `packages/shared` enums — keep them in sync).
- Tables: `users`, `company_profiles`, `mailboxes`, `searches`, `leads`, `lists`, `lead_list`, `campaigns`, `sequence_steps`, `messages`, `suppressions`, `credit_ledger`, `usage_events`, `click_events`, `reply_events`, `bounce_events`, `booking_events`.
- Notes:
  - `company_profiles.theme_source` enum `fetched | official`.
  - `mailboxes` token columns store **encrypted** values (encryption happens in app code in File 04 using `TOKEN_ENCRYPTION_KEY`; columns are just text/bytea here).
  - `credit_ledger` is append-only (no update/delete in normal flow); `delta` is integer.
  - `messages.thread_id` to support threaded replies later.
  - Indexes on common lookups: `leads(user_id, status)`, `messages(campaign_id)`, `messages(lead_id)`, `suppressions(user_id, email)`, `credit_ledger(user_id)`, each `*_events(user_id, created_at)`.

### 3. Row-Level Security (RLS)
- Enable RLS on every user-owned table.
- Policy: a row is accessible only when its `user_id` matches the authenticated user (`auth.uid()`), for select/insert/update as appropriate.
- The service_role client bypasses RLS (that's expected for backend/worker jobs); document that backend code must always scope queries by `user_id` itself even though service_role can see all — defense in depth.
- Join tables (`lead_list`) and child tables (`sequence_steps`, `messages`) derive ownership via their parent — implement policies that check the parent's `user_id`.

### 4. Generated types into shared
- Generate TypeScript types from the Supabase schema and place them in `packages/shared` (e.g. `types/database.ts`).
- Make the hand-written DTO/enum stubs from File 01 align with these generated types (single source — don't duplicate field definitions; re-export generated row types where useful).
- Document in a doc comment how to regenerate types when the schema changes (so future sessions know).

### 5. Migration workflow doc
- Add a short section to `/docs/CODE-MAP.md` (or a `/docs/DB.md`) describing: where migrations live, how to apply them to Supabase, the rule "never edit a past migration — always add a new one", and how to regenerate shared types.

## Verification (must pass before Done)
1. Migrations apply cleanly to the Supabase project (all tables, enums, indexes, triggers, RLS present). Verify by listing tables/policies.
2. `npm run build` passes with zero type errors (generated types compile and are importable from `@extrovertai/shared`).
3. `SupabaseService` admin client can perform a trivial read (e.g. count rows of an empty table) from `apps/api` without error.
4. A quick RLS sanity check: a query via the anon client without an authenticated user cannot read user-owned rows (document the check result).
5. No service_role key present anywhere under `apps/web`.

### Visual verification
- No UI in this file → skip visual verification. Note "no UI changes" in `PROGRESS.md`.

## Definition of Done (§9)
- Verification passes. `PROGRESS.md` updated (File 02 done; note the schema + RLS are live; record any column you added beyond §5 and why). `CODE-MAP.md`/`DB.md` updated.
- Commit: `feat(db): 02 supabase schema, rls, generated types`
- Push to `main`.

## What's next
File 03 — Auth: Supabase Auth in the Angular app + API, signup/login, create the `users` app-profile row on first login, protected routes/guards.
