// MailboxApiService — thin client for the mailbox API endpoints.
// WHY: keeps HTTP calls out of the component (one responsibility) and types the
// metadata the API returns (never tokens).
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MailboxItem {
  id: string;
  provider: string;
  email: string;
  status: string;
  daily_cap: number;
  warmup_state: string;
  created_at: string;
}

export interface ProviderStatus {
  google: boolean;
  microsoft: boolean;
}

@Injectable({ providedIn: 'root' })
export class MailboxApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/mailboxes`;

  providers(): Observable<ProviderStatus> {
    return this.http.get<ProviderStatus>(`${this.base}/providers`);
  }

  list(): Observable<MailboxItem[]> {
    return this.http.get<MailboxItem[]>(this.base);
  }

  connectUrl(provider: 'google' | 'microsoft'): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.base}/connect/${provider}`);
  }

  disconnect(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.base}/${id}`);
  }

  /** Permanently remove a disconnected mailbox from history. */
  remove(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.base}/${id}/permanent`);
  }
}
