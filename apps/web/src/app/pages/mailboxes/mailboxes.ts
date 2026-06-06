// Connect-your-mailbox screen.
// WHY: lets the user connect Gmail/Outlook and see connected mailboxes. Plain
// copy, one short privacy hint, calm token-styled rows with a green "Connected"
// state, friendly cancel/error handling (§7). Providers without configured
// credentials show as "Not set up yet" rather than a broken button.
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import {
  MailboxApiService,
  type MailboxItem,
  type ProviderStatus,
} from '../../core/mailbox-api.service';

@Component({
  selector: 'app-mailboxes',
  imports: [RouterLink],
  templateUrl: './mailboxes.html',
})
export class Mailboxes {
  private readonly api = inject(MailboxApiService);
  private readonly route = inject(ActivatedRoute);

  protected readonly appName = APP_NAME;
  protected readonly providers = signal<ProviderStatus>({ google: false, microsoft: false });
  protected readonly mailboxes = signal<MailboxItem[]>([]);
  protected readonly banner = signal<{ kind: 'ok' | 'error'; text: string } | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly connecting = signal(false);

  constructor() {
    this.readBanner();
    this.api.providers().subscribe({
      next: (p) => this.providers.set(p),
      error: () => this.providers.set({ google: false, microsoft: false }),
    });
    this.refresh();
  }

  private refresh(): void {
    this.api.list().subscribe({
      next: (list) => this.mailboxes.set(list),
      error: () => this.error.set("Couldn't load your mailboxes. Please try again."),
    });
  }

  private readBanner(): void {
    const status = this.route.snapshot.queryParamMap.get('mailbox');
    if (status === 'connected') {
      this.banner.set({ kind: 'ok', text: 'Mailbox connected.' });
    } else if (status === 'cancelled') {
      this.banner.set({ kind: 'error', text: 'Connection cancelled — no changes made.' });
    } else if (status === 'failed') {
      this.banner.set({
        kind: 'error',
        text: "We couldn't connect that mailbox. Please try again.",
      });
    }
  }

  connect(provider: 'google' | 'microsoft'): void {
    this.error.set(null);
    this.connecting.set(true);
    this.api.connectUrl(provider).subscribe({
      next: ({ url }) => {
        window.location.href = url;
      },
      error: (err) => {
        this.connecting.set(false);
        this.error.set(
          err?.error?.message ?? 'Could not start the connection. Please try again.',
        );
      },
    });
  }

  disconnect(item: MailboxItem): void {
    const ok = window.confirm(`Disconnect ${item.email}? You can reconnect it anytime.`);
    if (!ok) return;
    this.api.disconnect(item.id).subscribe({
      next: () => this.refresh(),
      error: () => this.error.set('Could not disconnect that mailbox. Please try again.'),
    });
  }

  protected providerLabel(provider: string): string {
    return provider === 'gmail' ? 'Gmail' : provider === 'outlook' ? 'Outlook' : provider;
  }
}
