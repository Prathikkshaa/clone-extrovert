# DB — migrations & generated types

The database is **Supabase Postgres**. The schema is defined in master-context §5 and lives in versioned SQL migrations.

## Where things live
- **Migrations:** `supabase/migrations/*.sql` (applied in filename/timestamp order).
- **Supabase CLI config:** `supabase/config.toml`.
- **Backend client:** `@extrovertai/server` → `SupabaseService` (admin/service_role client; backend only).
- **Generated row/enum types:** `packages/shared/src/types/database.ts`, re-exported from `@extrovertai/shared` as `Database`.

## Golden rule
**Never edit a past migration.** Once a migration has been applied, it is immutable. Any schema change goes in a NEW migration file with a later timestamp.

## Applying migrations (remote Supabase project)
Run from the repo root. The CLI reads `DATABASE_URL` from `.env`; it must be the **direct** connection string (not the transaction pooler) for DDL.

```bash
set -a && . ./.env && set +a
npx supabase db push --db-url "$DATABASE_URL"
```

This records applied migrations in the remote `supabase_migrations.schema_migrations` table, so re-running only applies new files.

## Regenerating shared types (after any schema change)
```bash
set -a && . ./.env && set +a
npx supabase gen types typescript --db-url "$DATABASE_URL" --schema public \
  > packages/shared/src/types/database.ts
npm run build:shared
```

Then make sure `packages/shared/src/types/index.ts` re-exports `./database`. Hand-written DTOs must reference these generated row types rather than redefining columns (single source of truth).

## Row-Level Security
Every user-owned table has RLS enabled with an owner policy (`user_id = auth.uid()`, or derived from the parent for join/child tables). The `service_role` client used by the API/worker **bypasses RLS** — backend code must still scope queries by `user_id` itself (defense in depth).
