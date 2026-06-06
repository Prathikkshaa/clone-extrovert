# 03 — Authentication

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully.
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01 & 02 done: monorepo builds; Supabase schema + RLS live; `SupabaseService` admin client works; generated types in `packages/shared`.
- `.env` has `SUPABASE_URL`, `SUPABASE_ANON_KEY` (frontend), `SUPABASE_SERVICE_ROLE_KEY` (backend).

## Scope of THIS file
Implement authentication using **Supabase Auth**: email/password signup + login on the Angular side, an authenticated API that verifies Supabase JWTs, automatic creation of the `users` app-profile row on first login, and route protection. Keep it simple and clear — this is the front door, copy and errors matter (§7).

### 1. Frontend auth (`apps/web`)
- Set up the Supabase JS client with the **anon key** (frontend only).
- Create an `AuthService` (Angular) wrapping signup, login, logout, current-session, and an observable of auth state.
- Screens (plain copy, token-styled, calm — §7):
  - **Sign up** — email + password. Button: "Create account". 
  - **Log in** — email + password. Button: "Log in".
  - Minimal, centered card on canvas background; one accent button; clear inline errors.
- Copy/error rules (§7):
  - Plain language. e.g. wrong password → "That email or password didn't match. Try again." Not a raw error code.
  - Never lose what they typed on error (keep the email field populated).
  - Every error gives a next step.
- Auth state persists across reload (Supabase session storage). On logout, clear and route to login.

### 2. Route protection (`apps/web`)
- An auth guard: unauthenticated users hitting app routes are redirected to login; authenticated users hitting login/signup are redirected to the app home.
- Keep routes lazy-loadable (§7). Add a placeholder authed "Home" route (e.g. shows "Welcome" + the user's email + a logout button) to prove the protected area works.

### 3. API auth (`apps/api`)
- Add a guard/middleware that validates the Supabase JWT (Bearer token) on protected routes and attaches the `user` (id, email) to the request.
- Add an authenticated `GET /me` endpoint returning the current user's app profile (`users` row).
- Document the pattern (doc comment) so all future protected endpoints reuse this guard.

### 4. App-profile row creation (`users` table)
- On first authenticated request (or first login), if no `users` row exists for this `auth.uid()`, create one with sensible defaults: `mode = 'draft'`, a default `daily_send_cap` (e.g. a conservative starting value — document it), empty `physical_address`.
- This must be idempotent (never create duplicates). Implement it server-side via the admin client, scoped to the authenticated user id.
- Note: the richer onboarding (company profile, theming) happens in File 05; here we only ensure the base `users` row exists.

### 5. Wire web ↔ api
- The Angular app attaches the Supabase access token as a Bearer header on API calls (an HTTP interceptor). Confirm `GET /me` works end-to-end (logged-in web app receives its profile).

## AI-friendly code requirements (§10)
- One responsibility per file: `AuthService`, guard, interceptor, auth screens each separate.
- Explicit types; reuse `users` row type from `@extrovertai/shared`.
- No secrets in frontend; only the anon key client-side.

## Verification (must pass before Done)
1. `npm run build` passes (web + api), zero type errors.
2. Sign up a new test user → a `users` row is created exactly once.
3. Log out / log in → session persists; protected Home route reachable only when authed.
4. `GET /me` returns the correct profile for the logged-in user; returns 401 without a valid token.
5. RLS still holds (a user can only read their own `users` row).
6. Wrong-password and duplicate-email cases show plain, friendly messages (not raw errors), and don't clear the email field.

### Visual verification (UI present)
- Run §8 of `00-master-context.md` on the **sign up** and **log in** screens via Claude in Chrome.
- **Expected visual result:** calm centered card on warm off-white canvas; warm near-black text; exactly one accent-colored primary button per screen; inputs clearly labeled; an example error message renders in the danger color and reads in plain English; no purple, no gradients, no clutter; verb-based button labels ("Create account", "Log in").
- Fix deviations, re-verify. If Claude in Chrome unavailable, use the §8 fallback and note the skip.

## Definition of Done (§9)
- Verification passes (incl. visual or fallback). `PROGRESS.md` updated (File 03 done; note default `daily_send_cap` value chosen). `CODE-MAP.md` updated with auth modules.
- Commit: `feat(auth): 03 supabase auth, guards, users profile, protected routes`
- Push to `main`.

## What's next
File 04 — Mailbox OAuth (Gmail + Outlook): connect a sending mailbox via OAuth, store tokens encrypted (using `TOKEN_ENCRYPTION_KEY`), record in `mailboxes`. (Google verification may still be pending — File 04 works with test users per the Setup MD.)
