// AuthUser — the minimal authenticated principal attached to each request.
// WHY: protected controllers read the caller's identity from here (set by
// SupabaseAuthGuard) rather than re-parsing the token.
export interface AuthUser {
  id: string;
  email: string | null;
}
