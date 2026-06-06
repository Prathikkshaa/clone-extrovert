// MailboxOAuthService — selects a provider by key and exposes the OAuth lifecycle.
// WHY: the single entry point the API uses for connect/callback/refresh, so
// controllers never branch on provider. DB persistence + encryption live in the
// API layer (MailboxesService); this service is OAuth only.
import { Injectable } from '@nestjs/common';
import type { MailboxProviderClient } from './mailbox-provider.interface';
import type { OAuthProviderKey } from './mailbox.types';
import { GmailProvider } from './gmail.provider';
import { OutlookProvider } from './outlook.provider';

@Injectable()
export class MailboxOAuthService {
  private readonly providers: Record<OAuthProviderKey, MailboxProviderClient>;

  constructor(gmail: GmailProvider, outlook: OutlookProvider) {
    this.providers = { google: gmail, microsoft: outlook };
  }

  isValidKey(key: string): key is OAuthProviderKey {
    return key === 'google' || key === 'microsoft';
  }

  get(key: OAuthProviderKey): MailboxProviderClient {
    return this.providers[key];
  }

  /** Which providers have their credentials configured (for the UI). */
  configuredStatus(): Record<OAuthProviderKey, boolean> {
    return {
      google: this.providers.google.isConfigured(),
      microsoft: this.providers.microsoft.isConfigured(),
    };
  }
}
