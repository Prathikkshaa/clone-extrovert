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
import type { OAuthConnection, OAuthProviderKey, OAuthTokenSet } from './mailbox.types';
import { decodeJwtClaim, expiresInToIso, postForm } from './oauth.util';

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

  send(): Promise<void> {
    throw new Error('OutlookProvider.send() is implemented in File 10.');
  }

  listReplies(): Promise<unknown> {
    throw new Error('OutlookProvider.listReplies() is implemented in File 11.');
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
