// Barrel for @extrovertai/server.
// WHY: one import surface for backend-only shared providers used by both
// apps/api and apps/worker. This package must NEVER be imported by apps/web —
// it may hold secrets (e.g. the Supabase service_role key, OAuth secrets).
export * from './supabase/supabase.module';
export * from './supabase/supabase.service';
export * from './crypto/crypto.module';
export * from './crypto/crypto.service';
export * from './mailbox/mailbox.types';
export * from './mailbox/mailbox-provider.interface';
export * from './mailbox/gmail.provider';
export * from './mailbox/outlook.provider';
export * from './mailbox/mailbox-oauth.service';
export * from './mailbox/mailbox.module';
