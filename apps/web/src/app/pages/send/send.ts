// Start-sending screen (File 10).
// WHY: turn a list's approved drafts into a running, throttled campaign. Shows a
// plain-language send plan that respects safe daily limits (deliverability as a
// feature, not a restriction — §2/§7), then "Start sending". Lists existing
// campaigns to open their monitor.
import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import { LeadsApiService, type LeadList } from '../../core/leads.service';
import { CreditsApiService } from '../../core/credits.service';
import {
  CampaignsApiService,
  type CampaignSummary,
  type SendPlan,
} from '../../core/campaigns.service';

@Component({
  selector: 'app-send',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './send.html',
})
export class Send {
  private readonly leadsApi = inject(LeadsApiService);
  private readonly api = inject(CampaignsApiService);
  private readonly credits = inject(CreditsApiService);
  private readonly router = inject(Router);

  protected readonly appName = APP_NAME;
  protected readonly lists = signal<LeadList[]>([]);
  protected selectedListId = '';
  protected readonly plan = signal<SendPlan | null>(null);
  protected readonly loadingPlan = signal(false);
  protected readonly starting = signal(false);
  protected readonly balance = signal<number | null>(null);
  protected readonly campaigns = signal<CampaignSummary[]>([]);
  protected readonly message = signal<{ kind: 'info' | 'warn' | 'error'; text: string } | null>(
    null,
  );

  constructor() {
    this.leadsApi.getLists().subscribe({
      next: (l) => this.lists.set(l),
      error: () => this.message.set({ kind: 'error', text: 'Could not load your lists.' }),
    });
    this.refreshBalance();
    this.refreshCampaigns();
  }

  loadPlan(): void {
    this.message.set(null);
    this.plan.set(null);
    if (!this.selectedListId) return;
    this.loadingPlan.set(true);
    this.api.plan(this.selectedListId).subscribe({
      next: (p) => {
        this.plan.set(p);
        this.loadingPlan.set(false);
      },
      error: () => {
        this.loadingPlan.set(false);
        this.message.set({ kind: 'error', text: 'Could not load the send plan.' });
      },
    });
  }

  start(): void {
    if (!this.selectedListId) return;
    this.message.set(null);
    this.starting.set(true);
    this.api.start(this.selectedListId).subscribe({
      next: (res) => {
        this.starting.set(false);
        if (res.ok) {
          void this.router.navigate(['/campaigns', res.campaignId]);
        } else if (res.reason === 'no_mailbox') {
          this.message.set({
            kind: 'warn',
            text: 'Connect a mailbox first so we can send from your own inbox.',
          });
        } else if (res.reason === 'no_address') {
          this.message.set({
            kind: 'warn',
            text: 'Add your mailing address in Settings to send — it’s legally required.',
          });
        } else {
          this.message.set({
            kind: 'warn',
            text: 'No approved drafts in this list yet. Write and approve emails first.',
          });
        }
      },
      error: () => {
        this.starting.set(false);
        this.message.set({ kind: 'error', text: 'Could not start sending. Please try again.' });
      },
    });
  }

  private refreshBalance(): void {
    this.credits.balance().subscribe({
      next: (b) => this.balance.set(b.balance),
      error: () => {
        /* non-critical */
      },
    });
  }

  private refreshCampaigns(): void {
    this.api.list().subscribe({
      next: (c) => this.campaigns.set(c),
      error: () => {
        /* optional */
      },
    });
  }
}
