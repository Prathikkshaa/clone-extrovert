// Dashboard (File 12).
// WHY: a calm, trustworthy overview answering one question at a glance — "is my
// outreach working, and what needs my attention?" It LEADS with money-linked, reliable
// numbers (meetings booked, replies) and demotes unreliable ones: opens are shown last,
// muted, and labelled honestly as "not tracked" (master-context §2/§4/§7). A
// deliverability health strip frames the safe-sending limits as protection.
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import {
  DashboardApiService,
  type CampaignStat,
  type DashboardSummary,
} from '../../core/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly api = inject(DashboardApiService);

  protected readonly appName = APP_NAME;
  protected readonly summary = signal<DashboardSummary | null>(null);
  protected readonly campaigns = signal<CampaignStat[] | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly showTopUpNote = signal(false);

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

  topUp(): void {
    // Full billing/top-up is File 14; for now we surface an honest note (no broken link).
    this.showTopUpNote.set(true);
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
    this.error.set(null);
    this.api.summary(30).subscribe({
      next: (s) => {
        this.summary.set(s);
        this.loading.set(false);
        // Drill-down (below the fold) only matters once there's activity.
        if (!s.isEmpty) this.loadCampaigns();
      },
      error: () => {
        this.loading.set(false);
        this.error.set("Couldn't load your dashboard. Please try again.");
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
