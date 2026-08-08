// BillingApiService — billing summary (balance + segregated usage + ledger + packs)
// and starting a Stripe-hosted Checkout. Card data never touches the browser app —
// checkout returns a Stripe URL we redirect to.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LedgerEntry {
  delta: number;
  reason: string;
  ref_id: string | null;
  created_at: string;
}

export interface UsageSummary {
  windowDays: number;
  spendByAction: Record<string, number>;
  totalSpent: number;
  purchased: number;
  refunded: number;
  netChange: number;
}

export interface CreditPack {
  id: string;
  label: string;
  credits: number;
  priceUsdCents: number;
  audience?: string;
  tagline?: string;
  popular?: boolean;
}

export interface BillingReport {
  generatedAt: string;
  days: number;
  balance: number;
  usage: UsageSummary;
  entries: LedgerEntry[];
}

export interface BillingSummary {
  balance: number;
  lowBalanceThreshold: number;
  usage: UsageSummary;
  recent: LedgerEntry[];
  packs: CreditPack[];
  creditCosts: Record<string, number>;
  billingConfigured: boolean;
}

export type CheckoutResponse = { url: string } | { error: string; configured: boolean };

@Injectable({ providedIn: 'root' })
export class BillingApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  summary(): Observable<BillingSummary> {
    return this.http.get<BillingSummary>(`${this.base}/billing/summary`);
  }

  report(days: number): Observable<BillingReport> {
    return this.http.get<BillingReport>(`${this.base}/billing/report`, {
      params: { days: String(days) },
    });
  }

  checkout(packId: string): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.base}/billing/checkout`, { packId });
  }
}
