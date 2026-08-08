// Billing (File 14; File 16 shell + kit).
// WHY: the money-in screen — buy credits (Stripe-hosted checkout), see the CURRENT
// balance, a SEGREGATED breakdown of where credits went (search/enrichment/draft/
// send), recent ledger entries, and a calm low/zero-balance prompt. Card data never
// touches us: "Buy" returns a Stripe URL we redirect to. Credits land via the webhook,
// so after a successful return we briefly re-poll the balance (the grant may lag a
// second or two) and show a pending note until it does. Refit to the shell + kit.
import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {
  BillingApiService,
  type BillingReport,
  type BillingSummary,
  type CreditPack,
  type LedgerEntry,
} from '../../core/billing.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { EmptyState } from '../../ui/empty-state/empty-state';
import { Icon } from '../../ui/icon/icon';
import { PageHeader } from '../../ui/page-header/page-header';
import { Skeleton } from '../../ui/skeleton/skeleton';
import { ToastService } from '../../ui/toast/toast.service';
import { environment } from '../../../environments/environment';

const DEBIT_ACTIONS = ['search', 'enrichment', 'draft', 'send'] as const;
const PENDING_POLLS = 5; // re-check the balance ~5× after a successful return

// Distinct, theme-neutral chart colours per action (donut segments + legend).
const ACTION_COLORS: Record<string, string> = {
  search: '#0ea5e9',
  enrichment: '#8b5cf6',
  draft: '#f59e0b',
  send: '#10b981',
};
// Rough end-to-end credit cost to take ONE lead from found → enriched → drafted →
// sent (enrichment 2 + draft 1 + send 1; search is amortised across a batch).
const CREDITS_PER_LEAD = 4;

@Component({
  selector: 'app-billing',
  imports: [DatePipe, FormsModule, Button, Card, EmptyState, Icon, PageHeader, Skeleton],
  templateUrl: './billing.html',
})
export class Billing {
  private readonly api = inject(BillingApiService);
  private readonly toast = inject(ToastService);

  protected readonly summary = signal<BillingSummary | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly buyingPackId = signal<string | null>(null);
  // Persistent note for the post-checkout return flow (pending grant / info).
  protected readonly notice = signal<{ kind: 'info' | 'pending'; text: string } | null>(null);

  protected readonly actions = DEBIT_ACTIONS;
  protected readonly freeCredits = environment.signupCredits;

  // Report export (#15): the user picks a window, we fetch + print to PDF.
  protected reportDays = 30;
  protected readonly reportRanges = [
    { value: 7, label: 'Last 7 days' },
    { value: 30, label: 'Last 30 days' },
    { value: 90, label: 'Last 90 days' },
    { value: 365, label: 'Last 12 months' },
  ];
  protected readonly exportingReport = signal(false);

  // Balance state for the banners.
  protected readonly isZero = computed(() => (this.summary()?.balance ?? 0) <= 0);
  protected readonly isLow = computed(() => {
    const s = this.summary();
    if (!s) return false;
    return s.balance > 0 && s.balance <= s.lowBalanceThreshold;
  });

  constructor() {
    this.load();
    this.handleReturn();
  }

  /** Spend for one action over the window (0 when none). */
  spend(action: string): number {
    return this.summary()?.usage.spendByAction[action] ?? 0;
  }

  /** A pack's price as a $ string. */
  price(pack: CreditPack): string {
    return `$${(pack.priceUsdCents / 100).toFixed(2)}`;
  }

  /** Per-credit price (helps the user compare packs). */
  perCredit(pack: CreditPack): string {
    return `$${(pack.priceUsdCents / 100 / pack.credits).toFixed(3)}/credit`;
  }

  /** Approx. leads a pack covers end-to-end — outcomes, not raw numbers (#11). */
  approxLeads(pack: CreditPack): number {
    return Math.floor(pack.credits / CREDITS_PER_LEAD);
  }

  /** Colour for an action's chart segment + legend swatch. */
  colorFor(action: string): string {
    return ACTION_COLORS[action] ?? '#94a3b8';
  }

  // --- Donut chart for "where credits went" (#10) ---
  readonly donutRadius = 42;
  private get circumference(): number {
    return 2 * Math.PI * this.donutRadius;
  }
  hasSpend(): boolean {
    return (this.summary()?.usage.totalSpent ?? 0) > 0;
  }
  /** Segment specs for an SVG stroke-dasharray donut. */
  donutSegments(): {
    action: string;
    value: number;
    pct: number;
    color: string;
    dash: string;
    offset: number;
  }[] {
    const s = this.summary();
    if (!s) return [];
    const total = s.usage.totalSpent || 1;
    const c = this.circumference;
    let cumulative = 0;
    return this.actions
      .map((action) => {
        const value = this.spend(action);
        const frac = value / total;
        const seg = {
          action,
          value,
          pct: Math.round(frac * 100),
          color: this.colorFor(action),
          dash: `${frac * c} ${c - frac * c}`,
          offset: -cumulative * c,
        };
        cumulative += frac;
        return seg;
      })
      .filter((seg) => seg.value > 0);
  }

  /** Fetch the activity report for the chosen window and print it as a PDF (#15). */
  async exportReport(): Promise<void> {
    if (this.exportingReport()) return;
    this.exportingReport.set(true);
    try {
      const report = await firstValueFrom(this.api.report(this.reportDays));
      this.printReport(report);
      this.toast.success('Report ready — choose “Save as PDF” in the print dialog.');
    } catch {
      this.toast.error('Could not build the report. Please try again.');
    } finally {
      this.exportingReport.set(false);
    }
  }

  private printReport(r: BillingReport): void {
    const win = window.open('', '_blank', 'width=900,height=1000');
    if (!win) {
      this.toast.warn('Allow pop-ups to export the report.');
      return;
    }
    win.document.write(this.reportHtml(r));
    win.document.close();
    win.focus();
    // Give the new document a tick to lay out before invoking print.
    setTimeout(() => win.print(), 300);
  }

  private reportHtml(r: BillingReport): string {
    const esc = (v: unknown): string =>
      String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
    const app = environment.appName;
    const generated = new Date(r.generatedAt).toLocaleString();
    const rows = r.entries
      .map(
        (e: LedgerEntry) => `
          <tr>
            <td>${esc(new Date(e.created_at).toLocaleString())}</td>
            <td>${esc(this.reasonLabel(e.reason))}</td>
            <td class="num ${e.delta > 0 ? 'pos' : ''}">${e.delta > 0 ? '+' : ''}${esc(e.delta)}</td>
          </tr>`,
      )
      .join('');
    const usageRows = this.actions
      .map(
        (a) =>
          `<tr><td>${esc(this.reasonLabel(a))}</td><td class="num">${esc(this.spend(a))}</td></tr>`,
      )
      .join('');
    return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(app)} — Credit report</title>
      <style>
        *{box-sizing:border-box} body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a18;margin:40px;font-size:13px;line-height:1.5}
        h1{font-size:20px;margin:0 0 4px} h2{font-size:14px;margin:28px 0 8px;border-bottom:1px solid #e7e7e2;padding-bottom:4px}
        .muted{color:#6b6b66} .head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0f766e;padding-bottom:12px}
        .kpis{display:flex;gap:24px;margin-top:16px} .kpi{background:#fafaf8;border:1px solid #e7e7e2;border-radius:8px;padding:12px 16px}
        .kpi .n{font-size:22px;font-weight:600} table{width:100%;border-collapse:collapse;margin-top:6px}
        th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #eee} th{color:#6b6b66;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.03em}
        .num{text-align:right;font-variant-numeric:tabular-nums} .pos{color:#15803d}
        @media print{body{margin:16px}}
      </style></head><body>
      <div class="head"><div><h1>${esc(app)} — Credit report</h1><div class="muted">Last ${esc(r.days)} days · generated ${esc(generated)}</div></div></div>
      <div class="kpis">
        <div class="kpi"><div class="muted">Current balance</div><div class="n">${esc(r.balance)}</div></div>
        <div class="kpi"><div class="muted">Spent</div><div class="n">${esc(r.usage.totalSpent)}</div></div>
        <div class="kpi"><div class="muted">Bought</div><div class="n">${esc(r.usage.purchased)}</div></div>
        <div class="kpi"><div class="muted">Refunded</div><div class="n">${esc(r.usage.refunded)}</div></div>
      </div>
      <h2>Where credits went</h2>
      <table><thead><tr><th>Action</th><th class="num">Credits</th></tr></thead><tbody>${usageRows}
        <tr><td><strong>Total spent</strong></td><td class="num"><strong>${esc(r.usage.totalSpent)}</strong></td></tr></tbody></table>
      <h2>Activity (${esc(r.entries.length)} entries)</h2>
      <table><thead><tr><th>When</th><th>Type</th><th class="num">Change</th></tr></thead><tbody>${rows || '<tr><td colspan="3" class="muted">No activity in this window.</td></tr>'}</tbody></table>
      </body></html>`;
  }

  /** Plain label for a ledger reason. */
  reasonLabel(reason: string): string {
    const map: Record<string, string> = {
      purchase: 'Top-up',
      search: 'Lead search',
      enrichment: 'Enrichment',
      draft: 'Drafting',
      send: 'Sending',
      refund: 'Refund',
    };
    return map[reason] ?? reason;
  }

  buy(pack: CreditPack): void {
    if (this.buyingPackId()) return;
    this.buyingPackId.set(pack.id);
    this.api.checkout(pack.id).subscribe({
      next: (res) => {
        if ('url' in res) {
          window.location.href = res.url; // hand off to Stripe-hosted checkout
          return;
        }
        this.buyingPackId.set(null);
        this.toast.warn(
          res.configured
            ? res.error
            : 'Billing isn’t switched on yet. Add your Stripe keys to enable buying credits.',
        );
      },
      error: () => {
        this.buyingPackId.set(null);
        this.toast.warn('Could not start checkout. Please try again.');
      },
    });
  }

  reload(): void {
    this.load();
  }

  private load(done?: (s: BillingSummary) => void): void {
    this.loadFailed.set(false);
    this.api.summary().subscribe({
      next: (s) => {
        this.summary.set(s);
        this.loading.set(false);
        done?.(s);
      },
      error: () => {
        this.loading.set(false);
        this.loadFailed.set(true);
      },
    });
  }

  /** React to Stripe's redirect back (?status=success|cancelled). */
  private handleReturn(): void {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status === 'cancelled') {
      this.toast.info('Checkout cancelled — you weren’t charged.');
      this.clearQuery();
    } else if (status === 'success') {
      // The webhook grants the credits; it may lag a moment. Poll a few times.
      this.notice.set({ kind: 'pending', text: 'Payment received — adding your credits…' });
      this.clearQuery();
      this.pollForGrant(this.summary()?.balance ?? null, PENDING_POLLS);
    }
  }

  private pollForGrant(previousBalance: number | null, attemptsLeft: number): void {
    if (attemptsLeft <= 0) {
      this.notice.set({
        kind: 'info',
        text: 'Your top-up is processing. It’ll appear here shortly — refresh in a moment.',
      });
      return;
    }
    window.setTimeout(() => {
      this.load((s) => {
        if (previousBalance === null || s.balance > previousBalance) {
          this.notice.set(null);
          this.toast.success('Credits added. You’re good to go.');
        } else {
          this.pollForGrant(previousBalance, attemptsLeft - 1);
        }
      });
    }, 2000);
  }

  private clearQuery(): void {
    window.history.replaceState({}, '', window.location.pathname);
  }
}
