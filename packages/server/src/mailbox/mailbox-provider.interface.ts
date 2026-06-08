// MailboxProviderClient — the provider abstraction (master-context §10).
// WHY: Gmail and Outlook differ in endpoints/scopes but must be interchangeable.
// MailboxOAuthService selects a provider by key; callers never branch on it.
//
// send() and listReplies() are declared here as signatures only — they are
// implemented in File 10 (sending) and File 11 (replies). They throw for now.
import type { MailboxProvider } from '@extrovertai/shared';
import type {
  OAuthConnection,
  OAuthProviderKey,
  OAuthTokenSet,
  OutboundEmail,
  SendResult,
} from './mailbox.types';

export interface MailboxProviderClient {
  /** URL identifier ('google' | 'microsoft'), matching the redirect URI. */
  readonly key: OAuthProviderKey;
  /** DB enum value persisted in `mailboxes.provider`. */
  readonly mailboxProvider: MailboxProvider;

  /** True when this provider's client id/secret/redirect are configured in env. */
  isConfigured(): boolean;

  /** Build the provider consent URL, embedding the opaque `state`. */
  getAuthUrl(state: string): string;

  /** Exchange an authorization code for tokens + the connected email. */
  exchangeCode(code: string): Promise<OAuthConnection>;

  /** Exchange a refresh token for a fresh access token. */
  refreshToken(refreshToken: string): Promise<OAuthTokenSet>;

  /** Send an email; returns provider message/thread ids. Throws MailboxSendError. */
  send(accessToken: string, message: OutboundEmail): Promise<SendResult>;

  // --- Implemented later ---
  /** File 11. */
  listReplies(_accessToken: string, _since: Date): Promise<unknown>;
}
