// GmailProvider — Google OAuth + Gmail API mailbox provider.
//
// Scopes (minimal for send + read + offline):
//   - https://www.googleapis.com/auth/gmail.send      (send campaigns)
//   - https://www.googleapis.com/auth/gmail.readonly  (ingest replies, File 11)
//   - openid, email                                   (identify the mailbox)
// access_type=offline + prompt=consent are required to receive a refresh token.
// gmail.send/gmail.readonly are RESTRICTED scopes — fine for local dev with test
// users; production needs Google verification (see setup-credentials-md.md).
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailboxProvider } from '@extrovertai/shared';
import type { MailboxProviderClient } from './mailbox-provider.interface';
import {
  MailboxSendError,
  type OAuthConnection,
  type OAuthProviderKey,
  type OAuthTokenSet,
  type OutboundEmail,
  type SendResult,
} from './mailbox.types';
import { buildMimeMessage } from './mime.util';
import { decodeJwtClaim, expiresInToIso, postForm } from './oauth.util';

const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const SEND_ENDPOINT = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'openid',
  'email',
];

@Injectable()
export class GmailProvider implements MailboxProviderClient {
  readonly key: OAuthProviderKey = 'google';
  readonly mailboxProvider = MailboxProvider.Gmail;

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.clientId() && this.clientSecret() && this.redirectUri());
  }

  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId(),
      redirect_uri: this.redirectUri(),
      response_type: 'code',
      scope: SCOPES.join(' '),
      access_type: 'offline',
      include_granted_scopes: 'true',
      prompt: 'consent',
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
    });

    const idToken = typeof data['id_token'] === 'string' ? data['id_token'] : '';
    const email = decodeJwtClaim(idToken, 'email');
    if (!email) {
      throw new Error('Could not determine the Gmail address from the OAuth response.');
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
    });
    return {
      accessToken: String(data['access_token'] ?? ''),
      // Google usually does not re-issue a refresh token; keep the existing one.
      refreshToken: typeof data['refresh_token'] === 'string' ? data['refresh_token'] : null,
      expiresAt: expiresInToIso(data['expires_in']),
    };
  }

  async send(accessToken: string, message: OutboundEmail): Promise<SendResult> {
    const { raw, rfcMessageId } = buildMimeMessage(message);
    let res: Response;
    try {
      res = await fetch(SEND_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          message.threadId ? { raw, threadId: message.threadId } : { raw },
        ),
        signal: AbortSignal.timeout(30000),
      });
    } catch (err) {
      throw new MailboxSendError('transient', `Gmail send failed: ${(err as Error).message}`);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw this.classifyError(res.status, text);
    }

    const json = (await res.json()) as { id?: string; threadId?: string };
    return {
      providerMessageId: json.id ?? '',
      threadId: json.threadId ?? null,
      rfcMessageId,
    };
  }

  /** Map a Gmail API error to a typed MailboxSendError so the engine can react. */
  private classifyError(status: number, body: string): MailboxSendError {
    if (status === 401 || status === 403 || /invalid_grant|insufficient/i.test(body)) {
      return new MailboxSendError('reauth', 'Gmail authorization expired — reconnect the mailbox.');
    }
    if (status === 429 || status === 503) {
      return new MailboxSendError('rate_limited', 'Gmail is rate-limiting sends right now.');
    }
    if (status >= 400 && status < 500) {
      return new MailboxSendError('rejected', `Gmail rejected the message (${status}).`);
    }
    return new MailboxSendError('transient', `Gmail send error (${status}).`);
  }

  listReplies(): Promise<unknown> {
    throw new Error('GmailProvider.listReplies() is implemented in File 11.');
  }

  private clientId(): string {
    return this.config.get<string>('GOOGLE_OAUTH_CLIENT_ID') ?? '';
  }
  private clientSecret(): string {
    return this.config.get<string>('GOOGLE_OAUTH_CLIENT_SECRET') ?? '';
  }
  private redirectUri(): string {
    return this.config.get<string>('GOOGLE_OAUTH_REDIRECT_URI') ?? '';
  }
}
