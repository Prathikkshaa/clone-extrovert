// CreditsApiService — reads the credit balance + recent ledger.
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

export interface CreditBalance {
  balance: number;
  recent: LedgerEntry[];
}

@Injectable({ providedIn: 'root' })
export class CreditsApiService {
  private readonly http = inject(HttpClient);

  balance(): Observable<CreditBalance> {
    return this.http.get<CreditBalance>(`${environment.apiUrl}/credits/balance`);
  }
}
