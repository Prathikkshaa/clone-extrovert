// Dashboard (File 12; File 16 shell + kit).
// WHY: a calm, trustworthy overview answering one question at a glance — "is my
// outreach working, and what needs my attention?" It LEADS with money-linked, reliable
// numbers (meetings booked, replies) and demotes unreliable ones: opens are shown last,
// muted, and labelled honestly as "not tracked" (master-context §2/§4/§7). A
// deliverability health strip frames the safe-sending limits as protection.
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  DashboardApiService,
  type CampaignStat,
  type DashboardSummary,
} from '../../core/dashboard.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { EmptyState } from '../../ui/empty-state/empty-state';
import { Icon } from '../../ui/icon/icon';
import { PageHeader } from '../../ui/page-header/page-header';
import { Skeleton } from '../../ui/skeleton/skeleton';
import { StatusBadge } from '../../ui/status-badge/status-badge';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    Button,
    Card,
    EmptyState,
    Icon,
    PageHeader,
    Skeleton,
    StatusBadge,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly api = inject(DashboardApiService);

  protected readonly summary = signal<DashboardSummary | null>(null);
  protected readonly campaigns = signal<CampaignStat[] | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);

  // Bounce rate as a friendly percentage string (1 decimal).
  protected readonly bouncePct = computed(() => {
    const h = this.summary()?.health;
    if (!h) return '0%';
    return `${(h.bounceRate * 100).toFixed(h.bounceRate > 0 && h.bounceRate < 0.01 ? 1 : 0)}%`;
  });

  // Today's volume as a 0..100 width for the capacity bar.
  protected readonly volumePct = computed(() => {
    const h = this.summary()?.health;
    if (!h || h.volumeCap <= 0) return 0;
    return Math.min(100, Math.round((h.volumeUsed / h.volumeCap) * 100));
  });

  constructor() {
    this.load();
  }

  reload(): void {
    this.load();
  }

  healthLabel(status: string): string {
    if (status === 'healthy') return 'Healthy';
    if (status === 'warning') return 'Worth a look';
    return 'Needs attention';
  }

  healthDotClass(status: string): string {
    if (status === 'healthy') return 'bg-positive';
    if (status === 'warning') return 'bg-warning';
    return 'bg-danger';
  }

  private load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.api.summary(30).subscribe({
      next: (s) => {
        this.summary.set(s);
        this.loading.set(false);
        // Drill-down (below the fold) only matters once there's activity.
        if (!s.isEmpty) this.loadCampaigns();
      },
      error: () => {
        this.loading.set(false);
        this.loadFailed.set(true);
      },
    });
  }

  private loadCampaigns(): void {
    this.api.campaigns(30).subscribe({
      next: (c) => this.campaigns.set(c),
      error: () => {
        /* drill-down is non-critical; the headline still renders */
      },
    });
  }
}
