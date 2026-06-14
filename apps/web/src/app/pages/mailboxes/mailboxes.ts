// Connect-your-mailbox screen (File 16 shell + kit).
// WHY: lets the user connect Gmail/Outlook and see connected mailboxes. Plain
// copy, one short privacy hint, calm rows with a "Connected" badge, friendly
// cancel/error handling (§7). Providers without configured credentials show as
// "not set up yet" rather than a broken button. Status goes through toasts;
// disconnect uses the accessible confirm dialog.
import { Component, inject, signal } from '@angular/core';
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
  }

  connect(provider: 'google' | 'microsoft'): void {
    this.connecting.set(true);
    this.api.connectUrl(provider).subscribe({
      next: ({ url }) => {
        window.location.href = url;
      },
      error: (err) => {
        this.connecting.set(false);
        this.toast.error(
          err?.error?.message ?? 'Could not start the connection. Please try again.',
        );
      },
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
