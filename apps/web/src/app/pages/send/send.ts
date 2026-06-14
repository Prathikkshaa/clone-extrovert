// Start-sending screen (File 10; File 16 shell + kit).
// WHY: turn a list's approved drafts into a running, throttled campaign. Shows a
// plain-language send plan that respects safe daily limits (deliverability as a
// feature, not a restriction — §2/§7), then "Start sending". Lists existing
// campaigns to open their monitor. Status now goes through toasts; the credit
// chip lives in the shell. Behaviour/data wiring unchanged.
import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LeadsApiService, type LeadList } from '../../core/leads.service';
import {
  CampaignsApiService,
  type CampaignSummary,
  type SendPlan,
} from '../../core/campaigns.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { EmptyState } from '../../ui/empty-state/empty-state';
import { Field } from '../../ui/field/field';
import { Icon } from '../../ui/icon/icon';
import { PageHeader } from '../../ui/page-header/page-header';
import { PipelineStepper } from '../../ui/pipeline-stepper/pipeline-stepper';
import { Skeleton } from '../../ui/skeleton/skeleton';
import { StatusBadge } from '../../ui/status-badge/status-badge';
import { ToastService } from '../../ui/toast/toast.service';

@Component({
  selector: 'app-send',
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    Button,
    Card,
    EmptyState,
    Field,
    Icon,
    PageHeader,
    PipelineStepper,
    Skeleton,
    StatusBadge,
  ],
  templateUrl: './send.html',
})
export class Send {
  private readonly leadsApi = inject(LeadsApiService);
  private readonly api = inject(CampaignsApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly lists = signal<LeadList[]>([]);
  protected selectedListId = '';
  protected readonly plan = signal<SendPlan | null>(null);
  protected readonly loadingPlan = signal(false);
  protected readonly starting = signal(false);
  protected readonly campaigns = signal<CampaignSummary[]>([]);

  /** Whether the loaded plan is ready to send. */
  protected readonly canSend = computed(() => {
    const p = this.plan();
    return !!p && p.hasMailbox && !p.needsAddress && p.leadCount > 0;
  });

  constructor() {
    this.leadsApi.getLists().subscribe({
      next: (l) => this.lists.set(l),
      error: () => this.toast.error('Could not load your lists.'),
    });
    this.refreshCampaigns();
  }

  loadPlan(): void {
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
        this.toast.error('Could not load the send plan.');
      },
    });
  }

  start(): void {
    if (!this.selectedListId) return;
    this.starting.set(true);
    this.api.start(this.selectedListId).subscribe({
      next: (res) => {
        this.starting.set(false);
        if (res.ok) {
          void this.router.navigate(['/campaigns', res.campaignId]);
        } else if (res.reason === 'no_mailbox') {
          this.toast.warn('Connect a mailbox first so we can send from your own inbox.');
        } else if (res.reason === 'no_address') {
          this.toast.warn('Add your mailing address in Settings to send — it’s legally required.');
        } else {
          this.toast.warn('No approved drafts in this list yet. Write and approve emails first.');
        }
      },
      error: () => {
        this.starting.set(false);
        this.toast.error('Could not start sending. Please try again.');
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
