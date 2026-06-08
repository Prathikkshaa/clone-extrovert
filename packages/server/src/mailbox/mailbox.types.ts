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

/** An outbound email to send through the user's mailbox (File 10). */
export interface OutboundEmail {
  to: string;
  subject: string;
  /** Plain-text body. File 11 adds the HTML + compliance footer variant. */
  body: string;
  /** The connected mailbox address (From header). */
  fromEmail: string;
  /** Provider thread to send within (threads follow-ups under the first email). */
  threadId?: string | null;
  /** RFC Message-ID of the message we're replying to (In-Reply-To/References). */
  inReplyToRfcId?: string | null;
}

/** Result of a successful send: provider message id + thread id (for threading). */
export interface SendResult {
  providerMessageId: string;
  threadId: string | null;
  /** RFC Message-ID header of the sent message (used to thread the next step). */
  rfcMessageId: string | null;
}

/** An inbound message read from a thread we started (a reply or a bounce). File 11. */
export interface InboundMessage {
  threadId: string;
  providerMessageId: string;
  from: string; // sender email, lowercased
  fromName: string | null;
  subject: string | null;
  snippet: string;
  body: string;
  receivedAt: string; // ISO
  isBounce: boolean; // mailer-daemon / delivery-status notification
}

/** How a send failure is classified, so the UI/engine can react appropriately. */
export type SendErrorKind = 'reauth' | 'rate_limited' | 'rejected' | 'transient';

export class MailboxSendError extends Error {
  constructor(
    readonly kind: SendErrorKind,
    message: string,
  ) {
    super(message);
    this.name = 'MailboxSendError';
  }
}
