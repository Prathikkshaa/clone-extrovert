// DraftingApiService (web) — client for the File 09 review/edit queue.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DraftMessage {
  id: string;
  step_order: number;
  subject: string | null;
  body: string | null;
  approved: boolean;
}

export interface LeadDrafts {
  leadId: string;
  name: string | null;
  website: string | null;
  email: string | null;
  hook: string | null;
  drafts: DraftMessage[];
}

export type EnqueueResult =
  | {
      ok: true;
      enqueued: number;
      skipped: number;
      costPer: number;
      balance: number;
      reason: 'partial_credits' | null;
    }
  | { ok: false; reason: 'out_of_credits' | 'unavailable'; enqueued: 0; balance: number };

@Injectable({ providedIn: 'root' })
export class DraftingApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  enqueue(leadIds: string[]): Observable<EnqueueResult> {
    return this.http.post<EnqueueResult>(`${this.base}/drafts/enqueue`, { leadIds });
  }

  byLeads(leadIds: string[]): Observable<LeadDrafts[]> {
    return this.http.post<LeadDrafts[]>(`${this.base}/drafts/by-leads`, { leadIds });
  }

  edit(messageId: string, patch: { subject?: string; body?: string }): Observable<DraftMessage> {
    return this.http.put<DraftMessage>(`${this.base}/drafts/${messageId}`, patch);
  }

  approve(leadId: string): Observable<{ approved: number }> {
    return this.http.post<{ approved: number }>(`${this.base}/drafts/approve`, { leadId });
  }

  regenerate(leadId: string): Observable<{ ok: boolean; balance: number; reason?: string }> {
    return this.http.post<{ ok: boolean; balance: number; reason?: string }>(
      `${this.base}/drafts/regenerate`,
      { leadId },
    );
  }
}
