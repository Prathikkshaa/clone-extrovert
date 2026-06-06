// AuthService — the single wrapper around Supabase Auth in the browser.
// WHY: one place owns the anon Supabase client, the current session (as a
// signal), and signup/login/logout. Components and guards depend on this, never
// on supabase-js directly. Uses the PUBLIC anon key only (RLS protects data).
import { Injectable, computed, signal } from '@angular/core';
import {
  createClient,
  type AuthError,
  type Session,
  type SupabaseClient,
} from '@supabase/supabase-js';
import type { Database } from '@extrovertai/shared';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase: SupabaseClient<Database> = createClient<Database>(
    environment.supabaseUrl,
    environment.supabaseAnonKey,
    { auth: { persistSession: true, autoRefreshToken: true } },
  );

  /** Current session (null when logged out). Updated reactively. */
  readonly session = signal<Session | null>(null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  /** Resolves once the initial session has been restored from storage. Guards
   *  await this so they don't redirect before auth state is known. */
  readonly ready: Promise<void>;

  constructor() {
    this.ready = this.supabase.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
    });
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
    });
  }

  accessToken(): string | null {
    return this.session()?.access_token ?? null;
  }

  currentEmail(): string | null {
    return this.session()?.user.email ?? null;
  }

  signUp(email: string, password: string): Promise<{ error: AuthError | null; needsConfirmation: boolean }> {
    return this.supabase.auth
      .signUp({ email, password })
      .then(({ data, error }) => ({
        error,
        // When email confirmation is enabled, signUp returns a user but no session.
        needsConfirmation: !error && data.user !== null && data.session === null,
      }));
  }

  signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
    return this.supabase.auth
      .signInWithPassword({ email, password })
      .then(({ error }) => ({ error }));
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.session.set(null);
  }
}
