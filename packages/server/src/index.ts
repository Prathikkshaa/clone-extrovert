// Barrel for @extrovertai/server.
// WHY: one import surface for backend-only shared providers used by both
// apps/api and apps/worker. This package must NEVER be imported by apps/web —
// it may hold secrets (e.g. the Supabase service_role key).
export * from './supabase/supabase.module';
export * from './supabase/supabase.service';
