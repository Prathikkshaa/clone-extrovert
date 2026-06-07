// EnrichmentApiService (web) — client for the File 08 enrichment screen.
// Loads a list's leads, kicks off enrichment, and polls per-lead progress.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/** Parsed reviews stored on a lead (matches @extrovertai/server ParsedReviews). */
export interface ParsedReviews {
  positive: string[];
  negative: string[];
  count: number;
  source: string;
}

export interface EnrichedLead {
  id: string;
  name: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  rating: number | null;
  review_count: number | null;
  reviews: ParsedReviews | Record<string, never> | null;
  hook: string | null;
  status: string;
  enrichment_status: 'pending' | 'in_progress' | 'complete' | 'failed';
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
export class EnrichmentApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  listLeads(listId: string): Observable<EnrichedLead[]> {
    return this.http.get<EnrichedLead[]>(`${this.base}/lists/${listId}/leads`);
  }

  enqueue(leadIds: string[]): Observable<EnqueueResult> {
    return this.http.post<EnqueueResult>(`${this.base}/enrichment/enqueue`, { leadIds });
  }

  status(leadIds: string[]): Observable<EnrichedLead[]> {
    return this.http.post<EnrichedLead[]>(`${this.base}/enrichment/status`, { leadIds });
  }
}
