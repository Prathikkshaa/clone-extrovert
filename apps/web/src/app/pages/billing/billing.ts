// Billing (File 14).
// WHY: the money-in screen — buy credits (Stripe-hosted checkout), see the CURRENT
// balance, a SEGREGATED breakdown of where credits went (search/enrichment/draft/
// send), recent ledger entries, and a calm low/zero-balance prompt. Card data never
// touches us: "Buy" returns a Stripe URL we redirect to. Credits land via the webhook,
// so after a successful return we briefly re-poll the balance (the grant may lag a
// second or two) and show a pending note until it does.
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import {
  BillingApiService,
  type BillingSummary,
  type CreditPack,
} from '../../core/billing.service';

const DEBIT_ACTIONS = ['search', 'enrichment', 'draft', 'send'] as const;
const PENDING_POLLS = 5; // re-check the balance ~5× after a successful return

@Component({
  selector: 'app-billing',
  imports: [RouterLink],
  templateUrl: './billing.html',
})
export class Billing {
  private readonly api = inject(BillingApiService);

  protected readonly appName = APP_NAME;
  protected readonly summary = signal<BillingSummary | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly buyingPackId = signal<string | null>(null);
  protected readonly notice = signal<{ kind: 'info' | 'warn' | 'pending'; text: string } | null>(null);

  protected readonly actions = DEBIT_ACTIONS;

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
    this.notice.set(null);
    this.buyingPackId.set(pack.id);
    this.api.checkout(pack.id).subscribe({
      next: (res) => {
        if ('url' in res) {
          window.location.href = res.url; // hand off to Stripe-hosted checkout
          return;
        }
        this.buyingPackId.set(null);
        this.notice.set({
          kind: 'warn',
          text: res.configured
            ? res.error
            : 'Billing isn’t switched on yet. Add your Stripe keys to enable buying credits.',
        });
      },
      error: () => {
        this.buyingPackId.set(null);
        this.notice.set({ kind: 'warn', text: 'Could not start checkout. Please try again.' });
      },
    });
  }

  reload(): void {
    this.load();
  }

  private load(done?: (s: BillingSummary) => void): void {
    this.api.summary().subscribe({
      next: (s) => {
        this.summary.set(s);
        this.loading.set(false);
        done?.(s);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Could not load your billing details. Please try again.');
      },
    });
  }

  /** React to Stripe's redirect back (?status=success|cancelled). */
  private handleReturn(): void {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status === 'cancelled') {
      this.notice.set({ kind: 'info', text: 'Checkout cancelled — you weren’t charged.' });
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
          this.notice.set({ kind: 'info', text: 'Credits added. You’re good to go.' });
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
