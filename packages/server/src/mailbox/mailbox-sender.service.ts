// MailboxSenderService — send an email through a connected mailbox (File 10).
//
// WHY: the sending engine needs one place that turns a stored mailbox row into a
// real send: decrypt the access token in-memory, refresh it if expired (persisting
// the new encrypted token), then call the provider's send(). Tokens are never
// logged or returned. Failures surface as typed MailboxSendError so the engine can
// react (reauth → reconnect prompt; rate-limited → back off; etc.).
import { Injectable, Logger } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { SupabaseService } from '../supabase/supabase.service';
import { MailboxOAuthService } from './mailbox-oauth.service';
import type { MailboxProviderClient } from './mailbox-provider.interface';
import { MailboxSendError, type OutboundEmail, type SendResult } from './mailbox.types';
import type { Tables } from '@extrovertai/shared';

type MailboxRow = Tables<'mailboxes'>;
const REFRESH_BUFFER_MS = 60_000; // refresh a minute before expiry

@Injectable()
export class MailboxSenderService {
  private readonly logger = new Logger(MailboxSenderService.name);

  constructor(
    private readonly crypto: CryptoService,
    private readonly oauth: MailboxOAuthService,
    private readonly supabase: SupabaseService,
  ) {}

  /** Send through the given mailbox. Throws MailboxSendError on failure. */
  async sendThroughMailbox(mailbox: MailboxRow, email: OutboundEmail): Promise<SendResult> {
    const provider = this.providerFor(mailbox);
    const accessToken = await this.freshAccessToken(mailbox, provider);
    return provider.send(accessToken, email);
  }

  /** A fresh (refreshed-if-needed) access token for read operations (File 11 poller). */
  async accessTokenFor(mailbox: MailboxRow): Promise<string> {
    return this.freshAccessToken(mailbox, this.providerFor(mailbox));
  }

  private providerFor(mailbox: MailboxRow): MailboxProviderClient {
    // DB enum gmail/outlook → OAuth key google/microsoft.
    return this.oauth.get(mailbox.provider === 'gmail' ? 'google' : 'microsoft');
  }

  /** Decrypt the access token, refreshing (and persisting) it if near expiry. */
  private async freshAccessToken(
    mailbox: MailboxRow,
    provider: MailboxProviderClient,
  ): Promise<string> {
    const expiresAt = mailbox.token_expires_at ? Date.parse(mailbox.token_expires_at) : 0;
    const stillValid =
      mailbox.access_token_encrypted && expiresAt > Date.now() + REFRESH_BUFFER_MS;
    if (stillValid && mailbox.access_token_encrypted) {
      return this.crypto.decrypt(mailbox.access_token_encrypted);
    }

    if (!mailbox.refresh_token_encrypted) {
      throw new MailboxSendError('reauth', 'Mailbox needs reconnecting (no refresh token).');
    }

    let tokens;
    try {
      const refreshToken = this.crypto.decrypt(mailbox.refresh_token_encrypted);
      tokens = await provider.refreshToken(refreshToken);
    } catch (err) {
      this.logger.warn(`Token refresh failed for mailbox ${mailbox.id}: ${(err as Error).message}`);
      throw new MailboxSendError('reauth', 'Mailbox authorization expired — reconnect it.');
    }
    if (!tokens.accessToken) {
      throw new MailboxSendError('reauth', 'Mailbox authorization expired — reconnect it.');
    }

    await this.supabase
      .getAdminClient()
      .from('mailboxes')
      .update({
        access_token_encrypted: this.crypto.encrypt(tokens.accessToken),
        token_expires_at: tokens.expiresAt,
        ...(tokens.refreshToken
          ? { refresh_token_encrypted: this.crypto.encrypt(tokens.refreshToken) }
          : {}),
      })
      .eq('id', mailbox.id);

    return tokens.accessToken;
  }
}
