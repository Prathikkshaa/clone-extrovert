# 04 — Mailbox OAuth (Gmail + Outlook)

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully.
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–03 done: build passes; Supabase schema + RLS live; auth works; `GET /me` returns the profile; API JWT guard exists.
- `.env` has the Google OAuth values (`GOOGLE_OAUTH_CLIENT_ID/SECRET/REDIRECT_URI`) and/or Microsoft values (`MS_OAUTH_CLIENT_ID/SECRET/REDIRECT_URI`), plus `TOKEN_ENCRYPTION_KEY`.
  - If only one provider's creds are ready, build that provider fully and stub the other behind the same interface; record the gap in `PROGRESS.md`. Don't block.
- Reminder (from Setup MD): Google may still be in "testing" mode with test users — that's fine for local dev. Do not block on production verification.

## Scope of THIS file
Let a logged-in user connect a sending mailbox (Gmail or Outlook) via OAuth, store the tokens **encrypted**, and record the mailbox in the `mailboxes` table. This is connection + storage only — actual sending/reading is built in Files 10/11. Build a clean `MailboxService` abstraction so Gmail and Outlook are interchangeable.

### 1. Provider abstraction (§10)
- Define a `MailboxProvider` interface with methods needed across providers: `getAuthUrl(state)`, `exchangeCode(code)`, `refreshToken(refreshToken)`, and (signatures only, implemented later) `send(...)`, `listReplies(...)`. 
- Implement `GmailProvider` (Google OAuth + Gmail API) and `OutlookProvider` (Microsoft identity + Graph). A `MailboxService` selects the provider by `provider` enum.
- Request the **minimal scopes** required for send + read + offline access. Confirm the exact current scope strings from each provider's docs at build time (do not hardcode stale scopes). Document the chosen scopes in a doc comment and in `PROGRESS.md`.

### 2. Token encryption
- Create a small `CryptoService` that encrypts/decrypts token strings using `TOKEN_ENCRYPTION_KEY` (authenticated symmetric encryption, e.g. AES-GCM). 
- Never store raw tokens. The `mailboxes` token columns hold ciphertext only. Decrypt only in-memory when needed (refresh/send/read).
- Doc-comment the rule clearly.

### 3. OAuth connect flow (API + web)
- API endpoints (all behind the auth guard):
  - `GET /mailboxes/connect/:provider` → returns the provider auth URL with a signed/opaque `state` tying the callback to this user (prevent CSRF / cross-user binding).
  - `GET /auth/:provider/callback` → handles the redirect, validates `state`, exchanges the code for tokens, encrypts + stores them, upserts a `mailboxes` row (`provider`, `email`, encrypted tokens, default `daily_cap` from §2 reality (~30–50/day), `warmup_state = 'new'`, `status = 'connected'`).
  - `GET /mailboxes` → list the current user's connected mailboxes (id, provider, email, status, daily_cap) — never return tokens.
  - `DELETE /mailboxes/:id` → disconnect (mark disconnected / remove tokens). This is a normal action (not destructive data loss) — but still confirm in the UI.
- **Privacy/security:** tokens never leave the backend; never logged; never sent to the frontend. The frontend only ever sees non-secret mailbox metadata.

### 4. Token refresh
- Implement refresh logic in each provider; refresh proactively when expired before any future send/read. Store the refreshed (encrypted) token. Handle refresh failure by marking the mailbox `status = 'reauth_required'` and surfacing a clear reconnect prompt later.

### 5. Web UI — "Connect your mailbox"
- A settings/onboarding screen: two clear options, "Connect Gmail" and "Connect Outlook", each starting its OAuth flow in a popup or redirect. After return, show the connected mailbox (provider + email + a green "Connected" state).
- Plain copy. Explain in one opt-in hint why we need access ("We send your campaigns from your own mailbox so they land in inboxes, not spam. We never read or send without you setting up a campaign."). Keep it short.
- Error/edge handling (§7): user cancels consent → friendly "Connection cancelled, no changes made."; provider error → plain message + retry; reauth-required state shows a "Reconnect" button.

## Verification (must pass before Done)
1. `npm run build` passes (web + api), zero type errors.
2. With a test user, complete the Gmail connect flow end-to-end → a `mailboxes` row appears with **encrypted** tokens (verify the stored value is not plaintext) and correct `email`.
3. (If MS creds ready) same for Outlook; otherwise confirm the Outlook path is stubbed behind the interface and noted in `PROGRESS.md`.
4. `GET /mailboxes` returns metadata only (no tokens). `DELETE` disconnects.
5. Token refresh works (simulate/await expiry or unit-test the refresh path); refresh failure flips status to `reauth_required`.
6. No tokens appear in logs, responses, or anywhere under `apps/web`.

### Visual verification (UI present)
- Run §8 on the "Connect your mailbox" screen via Claude in Chrome.
- **Expected visual result:** two clear provider buttons; after connecting, a calm "Connected" row with the mailbox email and a green status; the one-line privacy hint present and short; cancel/error states read in plain English; token-styled, no clutter.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual or fallback). `PROGRESS.md` updated (File 04 done; record chosen scopes, default `daily_cap`, and whether Outlook was fully built or stubbed). `CODE-MAP.md` updated.
- Commit: `feat(mailbox): 04 gmail/outlook oauth connect, encrypted token storage`
- Push to `main`.

## What's next
File 05 — Onboarding + website-to-profile: fetch the user's site, LLM-extract their company profile (services/about/value-prop/tone), extract logo + accent for theming, prefilled editable profile form, and the "I don't have a website" path.
