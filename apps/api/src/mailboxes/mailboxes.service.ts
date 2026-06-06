// MailboxesService — orchestrates mailbox connection + storage.
//
// WHY: ties together OAuth (MailboxOAuthService), token encryption
// (CryptoService), and persistence (SupabaseService). Tokens are encrypted
// before they touch the DB and are never returned to the frontend.
//
// CSRF/binding: the OAuth `state` is an HMAC-signed token carrying the user id +
// provider + expiry, so the unauthenticated callback can be tied back to the user
// who started the flow without trusting any query param.
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import {
  CryptoService,
  MailboxOAuthService,
  SupabaseService,
  type OAuthProviderKey,
} from '@extrovertai/server';
import type { Tables } from '@extrovertai/shared';

/** New mailboxes start with a conservative daily cap; ramped during warm-up (File 10). */
const DEFAULT_DAILY_CAP = 30;
const STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

type MailboxListItem = Pick<
  Tables<'mailboxes'>,
  'id' | 'provider' | 'email' | 'status' | 'daily_cap' | 'warmup_state' | 'created_at'
>;

interface StatePayload {
  u: string; // user id
  k: OAuthProviderKey; // provider key
  e: number; // expiry (epoch ms)
  n: string; // nonce
}

@Injectable()
export class MailboxesService {
  private readonly logger = new Logger(MailboxesService.name);
  private readonly stateSecret: Buffer;

  constructor(
    private readonly oauth: MailboxOAuthService,
    private readonly crypto: CryptoService,
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {
    // Derive the state-signing secret from the token encryption key (already a
    // 32-byte secret available to the backend).
    this.stateSecret = Buffer.from(
      this.config.get<string>('TOKEN_ENCRYPTION_KEY') ?? '',
      'base64',
    );
  }

  providerStatus(): Record<OAuthProviderKey, boolean> {
    return this.oauth.configuredStatus();
  }

  /** Build the provider consent URL for this user, or 400 if not configured. */
  getConnectUrl(userId: string, key: string): string {
    if (!this.oauth.isValidKey(key)) {
      throw new BadRequestException('Unknown mailbox provider.');
    }
    const provider = this.oauth.get(key);
    if (!provider.isConfigured()) {
      throw new BadRequestException(
        `${key === 'google' ? 'Gmail' : 'Outlook'} connection isn’t set up yet.`,
      );
    }
    return provider.getAuthUrl(this.signState(userId, key));
  }

  /** Handle the OAuth callback: verify state, exchange code, store encrypted
   *  tokens, upsert the mailbox row. Returns the connected provider key. */
  async completeConnection(key: string, code: string, state: string): Promise<OAuthProviderKey> {
    if (!this.oauth.isValidKey(key)) {
      throw new BadRequestException('Unknown mailbox provider.');
    }
    const payload = this.verifyState(state);
    if (payload.k !== key) {
      throw new BadRequestException('State does not match this provider.');
    }

    const provider = this.oauth.get(key);
    const connection = await provider.exchangeCode(code);
    const admin = this.supabase.getAdminClient();

    const accessEnc = this.crypto.encrypt(connection.accessToken);
    const refreshEnc = connection.refreshToken
      ? this.crypto.encrypt(connection.refreshToken)
      : null;

    const existing = await admin
      .from('mailboxes')
      .select('id')
      .eq('user_id', payload.u)
      .eq('provider', provider.mailboxProvider)
      .eq('email', connection.email)
      .maybeSingle();

    if (existing.data) {
      await admin
        .from('mailboxes')
        .update({
          access_token_encrypted: accessEnc,
          refresh_token_encrypted: refreshEnc,
          token_expires_at: connection.expiresAt,
          status: 'connected',
        })
        .eq('id', existing.data.id);
    } else {
      await admin.from('mailboxes').insert({
        user_id: payload.u,
        provider: provider.mailboxProvider,
        email: connection.email,
        access_token_encrypted: accessEnc,
        refresh_token_encrypted: refreshEnc,
        token_expires_at: connection.expiresAt,
        daily_cap: DEFAULT_DAILY_CAP,
        warmup_state: 'new',
        status: 'connected',
      });
    }

    return key;
  }

  /** Connected mailboxes for a user — metadata only, never tokens. */
  async listMailboxes(userId: string): Promise<MailboxListItem[]> {
    const { data, error } = await this.supabase
      .getAdminClient()
      .from('mailboxes')
      .select('id, provider, email, status, daily_cap, warmup_state, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      this.logger.error(`Failed to list mailboxes: ${error.message}`);
      throw new BadRequestException('Could not load your mailboxes.');
    }
    return data ?? [];
  }

  /** Disconnect (delete) a mailbox owned by the user. */
  async disconnect(userId: string, id: string): Promise<void> {
    const { data, error } = await this.supabase
      .getAdminClient()
      .from('mailboxes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('id');

    if (error) {
      throw new BadRequestException('Could not disconnect that mailbox.');
    }
    if (!data || data.length === 0) {
      throw new NotFoundException('Mailbox not found.');
    }
  }

  /** Base URL of the web app, used to redirect back after the OAuth callback. */
  webBaseUrl(): string {
    const port = this.config.get<string>('WEB_PORT') ?? '4200';
    return `http://localhost:${port}`;
  }

  // --- signed state helpers ---
  private signState(userId: string, key: OAuthProviderKey): string {
    const payload: StatePayload = {
      u: userId,
      k: key,
      e: Date.now() + STATE_TTL_MS,
      n: randomBytes(8).toString('hex'),
    };
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${body}.${this.hmac(body)}`;
  }

  private verifyState(state: string): StatePayload {
    const [body, sig] = state.split('.');
    if (!body || !sig) {
      throw new BadRequestException('Invalid state.');
    }
    const expected = this.hmac(body);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new BadRequestException('State signature mismatch.');
    }
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as StatePayload;
    if (typeof payload.e !== 'number' || payload.e < Date.now()) {
      throw new BadRequestException('This connection link expired. Please try again.');
    }
    return payload;
  }

  private hmac(body: string): string {
    return createHmac('sha256', this.stateSecret).update(body).digest('base64url');
  }
}
