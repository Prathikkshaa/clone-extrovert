// OutlookProvider — Microsoft identity platform (v2.0) + Microsoft Graph.
//
// Scopes (minimal for send + read + offline):
//   - https://graph.microsoft.com/Mail.Send   (send campaigns)
//   - https://graph.microsoft.com/Mail.Read    (ingest replies, File 11)
//   - offline_access                           (refresh token)
//   - openid, email                            (identify the mailbox)
// Uses the /common authority so both work + personal Microsoft accounts connect.
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailboxProvider } from '@extrovertai/shared';
import type { MailboxProviderClient } from './mailbox-provider.interface';
import {
  MailboxSendError,
  type InboundMessage,
  type OAuthConnection,
  type OAuthProviderKey,
  type OAuthTokenSet,
  type OutboundEmail,
  type SendResult,
} from './mailbox.types';
import { decodeJwtClaim, expiresInToIso, postForm } from './oauth.util';

const SENDMAIL_ENDPOINT = 'https://graph.microsoft.com/v1.0/me/sendMail';

const AUTH_ENDPOINT = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
const TOKEN_ENDPOINT = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
const SCOPES = [
  'https://graph.microsoft.com/Mail.Send',
  'https://graph.microsoft.com/Mail.Read',
  'offline_access',
  'openid',
  'email',
];

@Injectable()
export class OutlookProvider implements MailboxProviderClient {
  readonly key: OAuthProviderKey = 'microsoft';
  readonly mailboxProvider = MailboxProvider.Outlook;

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.clientId() && this.clientSecret() && this.redirectUri());
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId(),
      redirect_uri: this.redirectUri(),
      response_type: 'code',
      response_mode: 'query',
      scope: SCOPES.join(' '),
      state,
    });
    return `${AUTH_ENDPOINT}?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<OAuthConnection> {
    const data = await postForm(TOKEN_ENDPOINT, {
      code,
      client_id: this.clientId(),
      client_secret: this.clientSecret(),
      redirect_uri: this.redirectUri(),
      grant_type: 'authorization_code',
      scope: SCOPES.join(' '),
    });

    const idToken = typeof data['id_token'] === 'string' ? data['id_token'] : '';
    const email =
      decodeJwtClaim(idToken, 'email') ?? decodeJwtClaim(idToken, 'preferred_username');
    if (!email) {
      throw new Error('Could not determine the Outlook address from the OAuth response.');
    }

    return {
      accessToken: String(data['access_token'] ?? ''),
      refreshToken: typeof data['refresh_token'] === 'string' ? data['refresh_token'] : null,
      expiresAt: expiresInToIso(data['expires_in']),
      email,
    };
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokenSet> {
    const data = await postForm(TOKEN_ENDPOINT, {
      refresh_token: refreshToken,
      client_id: this.clientId(),
      client_secret: this.clientSecret(),
      grant_type: 'refresh_token',
      scope: SCOPES.join(' '),
    });
    return {
      accessToken: String(data['access_token'] ?? ''),
      refreshToken: typeof data['refresh_token'] === 'string' ? data['refresh_token'] : null,
      expiresAt: expiresInToIso(data['expires_in']),
    };
  }

  async send(accessToken: string, message: OutboundEmail): Promise<SendResult> {
    // Graph /sendMail returns 202 with no body/id. Threading by id isn't exposed
    // here; File 11 refines reply matching. Best-effort (Outlook creds pending).
    let res: Response;
    try {
      res = await fetch(SENDMAIL_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            subject: message.subject,
            body: { contentType: 'Text', content: message.body },
            toRecipients: [{ emailAddress: { address: message.to } }],
          },
          saveToSentItems: true,
        }),
        signal: AbortSignal.timeout(30000),
      });
    } catch (err) {
      throw new MailboxSendError('transient', `Outlook send failed: ${(err as Error).message}`);
    }
    if (!res.ok && res.status !== 202) {
      const text = await res.text().catch(() => '');
      if (res.status === 401 || res.status === 403) {
        throw new MailboxSendError('reauth', 'Outlook authorization expired — reconnect the mailbox.');
      }
      if (res.status === 429) {
        throw new MailboxSendError('rate_limited', 'Outlook is rate-limiting sends right now.');
      }
      throw new MailboxSendError(
        res.status >= 400 && res.status < 500 ? 'rejected' : 'transient',
        `Outlook send error (${res.status}): ${text.slice(0, 120)}`,
      );
    }
    return { providerMessageId: '', threadId: message.threadId ?? null, rfcMessageId: null };
  }

  // Reply ingestion for Outlook needs Graph /messages filtering by conversationId;
  // deferred until MS creds exist (Gmail is the tested path). Returns nothing so the
  // poller skips Outlook mailboxes cleanly rather than throwing.
  listReplies(): Promise<InboundMessage[]> {
    return Promise.resolve([]);
  }

  private clientId(): string {
    return this.config.get<string>('MS_OAUTH_CLIENT_ID') ?? '';
  }
  private clientSecret(): string {
    return this.config.get<string>('MS_OAUTH_CLIENT_SECRET') ?? '';
  }
  private redirectUri(): string {
    return this.config.get<string>('MS_OAUTH_REDIRECT_URI') ?? '';
  }
}
