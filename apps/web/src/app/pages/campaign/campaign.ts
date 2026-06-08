// Campaign monitor (File 10).
// WHY: shows a live, per-lead view of a running campaign — each lead's step states
// (queued/sent/replied/bounced/stopped), today's send count vs the safe cap, and
// pause/resume. Paused campaigns explain the next step (top up / reconnect) calmly.
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import { CampaignsApiService, type CampaignDetail } from '../../core/campaigns.service';

const POLL_MS = 4000;

@Component({
  selector: 'app-campaign',
  imports: [RouterLink, DatePipe],
  templateUrl: './campaign.html',
})
export class Campaign implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CampaignsApiService);

  protected readonly appName = APP_NAME;
  protected readonly detail = signal<CampaignDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly pausing = signal(false);
  protected readonly error = signal<string | null>(null);

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

  stepClass(state: string): string {
    if (state === 'sent') return 'text-positive';
    if (state === 'replied') return 'text-positive';
    if (state === 'bounced') return 'text-danger';
    if (state === 'stopped') return 'text-muted';
    return 'text-muted'; // queued
  }

  private setStatus(status: 'paused' | 'active'): void {
    this.pausing.set(true);
    this.api.setStatus(this.campaignId, status).subscribe({
      next: () => {
        this.pausing.set(false);
        this.load(false);
      },
      error: () => {
        this.pausing.set(false);
        this.error.set('Could not update the campaign. Please try again.');
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
        this.error.set('Could not load this campaign.');
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
