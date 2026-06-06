// Shared DTO/entity types.
// WHY: a single home for cross-app data shapes so the API, worker, and web never
// redefine the same structure. The generated Supabase row/enum types are the
// single source for DB shapes — hand-written DTOs should build on these.
export * from './database';
