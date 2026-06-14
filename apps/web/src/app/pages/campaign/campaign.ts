// Campaign monitor (File 10; File 16 shell + kit).
// WHY: shows a live, per-lead view of a running campaign — each lead's step states
// (queued/sent/replied/bounced/stopped), today's send count vs the safe cap, and
// pause/resume. Paused campaigns explain the next step (top up / reconnect) calmly.
// Status changes go through toasts; a load failure shows a calm empty state.
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CampaignsApiService, type CampaignDetail } from '../../core/campaigns.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { EmptyState } from '../../ui/empty-state/empty-state';
import { Icon } from '../../ui/icon/icon';
import { PageHeader } from '../../ui/page-header/page-header';
import { Skeleton } from '../../ui/skeleton/skeleton';
import { StatusBadge } from '../../ui/status-badge/status-badge';
import { ToastService } from '../../ui/toast/toast.service';

const POLL_MS = 4000;

@Component({
  selector: 'app-campaign',
  imports: [
    RouterLink,
    DatePipe,
    Button,
    Card,
    EmptyState,
    Icon,
    PageHeader,
    Skeleton,
    StatusBadge,
  ],
  templateUrl: './campaign.html',
})
export class Campaign implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CampaignsApiService);
  private readonly toast = inject(ToastService);

  protected readonly detail = signal<CampaignDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly pausing = signal(false);
  protected readonly loadFailed = signal(false);

  private campaignId = '';
  private pollTimer: ReturnType<typeof setInterval> | null = null;

  protected readonly isPaused = computed(() => this.detail()?.status === 'paused');
  // A lead is mid-sequence if any step is still queued.
  protected readonly anyQueued = computed(() => (this.detail()?.counts.queued ?? 0) > 0);

  constructor() {
    this.campaignId = this.route.snapshot.paramMap.get('id') ?? '';
    this.load(true);
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  pause(): void {
    this.setStatus('paused');
  }
  resume(): void {
    this.setStatus('active');
  }

  stepLabel(stepOrder: number): string {
    return stepOrder === 1 ? 'Email' : 'Follow-up ' + (stepOrder - 1);
  }

  private setStatus(status: 'paused' | 'active'): void {
    this.pausing.set(true);
    this.api.setStatus(this.campaignId, status).subscribe({
      next: () => {
        this.pausing.set(false);
        this.load(false);
        this.toast.success(status === 'paused' ? 'Campaign paused.' : 'Campaign resumed.');
      },
      error: () => {
        this.pausing.set(false);
        this.toast.error('Could not update the campaign. Please try again.');
      },
    });
  }

  private load(first: boolean): void {
    if (first) this.loading.set(true);
    this.api.detail(this.campaignId).subscribe({
      next: (d) => {
        this.detail.set(d);
        this.loading.set(false);
        // Keep polling while work remains and the campaign is active.
        if (d.status === 'active' && d.counts.queued > 0) this.startPolling();
        else this.stopPolling();
      },
      error: () => {
        this.loading.set(false);
        this.loadFailed.set(true);
        this.stopPolling();
      },
    });
  }

  private startPolling(): void {
    if (this.pollTimer) return;
    this.pollTimer = setInterval(() => this.load(false), POLL_MS);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
}
