// LeadsApiService — client for lead search + lists.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LeadCard {
  id: string;
  name: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  rating: number | null;
  review_count: number | null;
  place_id: string | null;
  status: string;
}

export interface SearchFilters {
  noWebsite?: boolean;
  maxRating?: number;
  maxReviews?: number;
}

export type SearchResponse =
  | { ok: true; cached: boolean; searchId: string; leads: LeadCard[]; count: number }
  | { ok: false; reason: 'out_of_credits' | 'busy' | 'error'; message: string };

export interface LeadList {
  id: string;
  name: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class LeadsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  search(input: {
    industry: string;
    location: string;
    filters?: SearchFilters;
  }): Observable<SearchResponse> {
    return this.http.post<SearchResponse>(`${this.base}/leads/search`, input);
  }

  getLists(): Observable<LeadList[]> {
    return this.http.get<LeadList[]>(`${this.base}/lists`);
  }

  saveToList(input: {
    listId?: string;
    listName?: string;
    leadIds: string[];
  }): Observable<{ listId: string; linked: number }> {
    return this.http.post<{ listId: string; linked: number }>(
      `${this.base}/leads/save-to-list`,
      input,
    );
  }
}
