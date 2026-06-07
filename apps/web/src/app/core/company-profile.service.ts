// CompanyProfileApiService — client for the onboarding/company-profile endpoints.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CompanyProfile {
  id: string;
  website: string | null;
  logo_url: string | null;
  brand_color: string | null;
  theme_source: 'fetched' | 'official';
  services: string | null;
  about: string | null;
  value_prop: string | null;
  tone: string | null;
  proof_points: string[];
}

export interface CrawlResult {
  ok: boolean;
  profile: CompanyProfile;
  meta: {
    accentDetected: boolean;
    accentFallback: boolean;
    crawlSource: string;
    extractionFailed: boolean;
  };
}

export interface SaveProfileInput {
  website?: string | null;
  services?: string | null;
  about?: string | null;
  value_prop?: string | null;
  tone?: string | null;
  proof_points?: string[];
  logo_url?: string | null;
  brand_color?: string | null;
  theme_source?: 'fetched' | 'official';
}

@Injectable({ providedIn: 'root' })
export class CompanyProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  crawl(url: string): Observable<CrawlResult> {
    return this.http.post<CrawlResult>(`${this.base}/onboarding/crawl`, { url });
  }

  get(): Observable<CompanyProfile | null> {
    return this.http.get<CompanyProfile | null>(`${this.base}/company-profile`);
  }

  save(input: SaveProfileInput): Observable<CompanyProfile> {
    return this.http.put<CompanyProfile>(`${this.base}/company-profile`, input);
  }
}
