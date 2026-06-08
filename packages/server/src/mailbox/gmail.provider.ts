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
  type InboundMessage,
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
const THREADS_ENDPOINT = 'https://gmail.googleapis.com/gmail/v1/users/me/threads';
const MAX_THREADS_PER_POLL = 40;
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

  /**
   * Read inbound messages from the threads we started (privacy-friendly: only OUR
   * threads, not the whole inbox). A message is inbound if its From is not the
   * mailbox owner. Bounces (mailer-daemon) are flagged.
   */
  async listReplies(
    accessToken: string,
    threadIds: string[],
    selfEmail: string,
  ): Promise<InboundMessage[]> {
    const self = selfEmail.toLowerCase();
    const out: InboundMessage[] = [];
    for (const threadId of threadIds.slice(0, MAX_THREADS_PER_POLL)) {
      let thread: GmailThread | null = null;
      try {
        const res = await fetch(`${THREADS_ENDPOINT}/${threadId}?format=full`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) continue;
        thread = (await res.json()) as GmailThread;
      } catch {
        continue;
      }
      for (const m of thread.messages ?? []) {
        const headers = m.payload?.headers ?? [];
        const fromRaw = this.header(headers, 'From');
        const { email, name } = this.parseFrom(fromRaw);
        if (!email || email === self) continue; // skip our own outbound messages
        const subject = this.header(headers, 'Subject');
        out.push({
          threadId,
          providerMessageId: m.id,
          from: email,
          fromName: name,
          subject,
          snippet: this.decodeSnippet(m.snippet ?? ''),
          body: this.extractPlainText(m.payload) || this.decodeSnippet(m.snippet ?? ''),
          receivedAt: m.internalDate
            ? new Date(Number(m.internalDate)).toISOString()
            : new Date().toISOString(),
          isBounce: this.looksLikeBounce(email, subject),
        });
      }
    }
    return out;
  }

  private header(headers: { name: string; value: string }[], name: string): string | null {
    return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? null;
  }

  private parseFrom(value: string | null): { email: string | null; name: string | null } {
    if (!value) return { email: null, name: null };
    const match = value.match(/<([^>]+)>/);
    const email = (match ? match[1] : value).trim().toLowerCase();
    const name = match ? value.replace(/<[^>]+>/, '').replace(/"/g, '').trim() : null;
    return { email: /\S+@\S+\.\S+/.test(email) ? email : null, name: name || null };
  }

  private looksLikeBounce(email: string, subject: string | null): boolean {
    if (/mailer-daemon|postmaster/i.test(email)) return true;
    return /delivery status notification|undeliverable|delivery failure|returned mail|mail delivery failed/i.test(
      subject ?? '',
    );
  }

  private decodeSnippet(snippet: string): string {
    // Gmail snippets HTML-encode a few entities.
    return snippet.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
  }

  /** Walk MIME parts for the first text/plain body (base64url). */
  private extractPlainText(payload: GmailPart | undefined): string {
    if (!payload) return '';
    if (payload.mimeType === 'text/plain' && payload.body?.data) {
      return Buffer.from(payload.body.data, 'base64url').toString('utf8').trim();
    }
    for (const part of payload.parts ?? []) {
      const text = this.extractPlainText(part);
      if (text) return text;
    }
    return '';
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

interface GmailPart {
  mimeType?: string;
  headers?: { name: string; value: string }[];
  body?: { data?: string };
  parts?: GmailPart[];
}

interface GmailMessage {
  id: string;
  internalDate?: string;
  snippet?: string;
  payload?: GmailPart;
}

interface GmailThread {
  messages?: GmailMessage[];
}
