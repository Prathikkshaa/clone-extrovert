// Connect-your-mailbox screen (File 16 shell + kit).
// WHY: lets the user connect Gmail/Outlook and see connected mailboxes. Plain
// copy, one short privacy hint, calm rows with a "Connected" badge, friendly
// cancel/error handling (§7). Providers without configured credentials show as
// "not set up yet" rather than a broken button. Status goes through toasts;
// disconnect uses the accessible confirm dialog.
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MailboxApiService,
  type MailboxItem,
  type ProviderStatus,
} from '../../core/mailbox-api.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { ConfirmService } from '../../ui/confirm/confirm.service';
import { Icon } from '../../ui/icon/icon';
import { PageHeader } from '../../ui/page-header/page-header';
import { StatusBadge } from '../../ui/status-badge/status-badge';
import { ToastService } from '../../ui/toast/toast.service';

@Component({
  selector: 'app-mailboxes',
  imports: [Button, Card, Icon, PageHeader, StatusBadge],
  templateUrl: './mailboxes.html',
})
export class Mailboxes {
  private readonly api = inject(MailboxApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly providers = signal<ProviderStatus>({ google: false, microsoft: false });
  protected readonly mailboxes = signal<MailboxItem[]>([]);
  protected readonly connecting = signal(false);

  // Active (usable) mailboxes vs disconnected history.
  protected readonly active = computed(() =>
    this.mailboxes().filter((m) => m.status !== 'disconnected'),
  );
  protected readonly history = computed(() =>
    this.mailboxes().filter((m) => m.status === 'disconnected'),
  );

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
      error: () => this.toast.error("Couldn't load your mailboxes. Please try again."),
    });
  }

  private readBanner(): void {
    const status = this.route.snapshot.queryParamMap.get('mailbox');
    if (status === 'connected') {
      this.toast.success('Mailbox connected.');
    } else if (status === 'cancelled') {
      this.toast.warn('Connection cancelled — no changes made.');
    } else if (status === 'failed') {
      this.toast.error("We couldn't connect that mailbox. Please try again.");
    }
    // Strip the ?mailbox=... param so a refresh or Back doesn't re-show the banner.
    if (status) {
      history.replaceState(history.state, '', window.location.pathname);
    }
  }

  connect(provider: 'google' | 'microsoft'): void {
    this.connecting.set(true);
    this.api.connectUrl(provider).subscribe({
      next: ({ url }) => {
        // REPLACE (not assign) so the provider's consent page replaces this entry
        // in history. After the round-trip lands back on /mailboxes, pressing Back
        // returns to the page BEFORE connecting — never re-triggering OAuth.
        window.location.replace(url);
      },
      error: (err) => {
        this.connecting.set(false);
        this.toast.error(
          err?.error?.message ?? 'Could not start the connection. Please try again.',
        );
      },
    });
  }

  /** Reconnect a disconnected mailbox — re-runs the provider's OAuth flow. The
   *  callback updates the existing row back to 'connected'. */
  reconnect(item: MailboxItem): void {
    this.connect(item.provider === 'gmail' ? 'google' : 'microsoft');
  }

  /** Permanently remove a disconnected mailbox from the history list. */
  async remove(item: MailboxItem): Promise<void> {
    const ok = await this.confirm.ask({
      title: `Remove ${item.email} from history?`,
      message: 'This deletes it from your list. You can always connect it again later.',
      confirmLabel: 'Remove',
      danger: true,
    });
    if (!ok) return;
    this.api.remove(item.id).subscribe({
      next: () => {
        this.refresh();
        this.toast.success('Removed from your mailbox history.');
      },
      error: () => this.toast.error('Could not remove that mailbox. Please try again.'),
    });
  }

  async disconnect(item: MailboxItem): Promise<void> {
    const ok = await this.confirm.ask({
      title: `Disconnect ${item.email}?`,
      message: 'You can reconnect it anytime. Running campaigns will pause if this was their only mailbox.',
      confirmLabel: 'Disconnect',
      danger: true,
    });
    if (!ok) return;
    this.api.disconnect(item.id).subscribe({
      next: () => {
        this.refresh();
        this.toast.success('Mailbox disconnected.');
      },
      error: () => this.toast.error('Could not disconnect that mailbox. Please try again.'),
    });
  }

  protected providerLabel(provider: string): string {
    return provider === 'gmail' ? 'Gmail' : provider === 'outlook' ? 'Outlook' : provider;
  }
}
