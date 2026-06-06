// Mailbox OAuth types shared across providers.
// WHY: one place defines the token/identity shapes so Gmail and Outlook are
// interchangeable behind MailboxOAuthService.

/** URL/path identifier for a provider — matches the registered OAuth redirect
 *  URIs (`/auth/google/callback`, `/auth/microsoft/callback`). Distinct from the
 *  DB `mailbox_provider` enum (gmail/outlook). */
export type OAuthProviderKey = 'google' | 'microsoft';

/** Access/refresh token pair after an exchange or refresh. */
export interface OAuthTokenSet {
  accessToken: string;
  /** May be null on refresh if the provider doesn't re-issue it. */
  refreshToken: string | null;
  /** ISO timestamp when the access token expires, or null if unknown. */
  expiresAt: string | null;
}

/** Result of exchanging an authorization code: tokens + the connected identity. */
export interface OAuthConnection extends OAuthTokenSet {
  email: string;
}
