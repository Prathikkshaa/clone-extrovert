// MeApiService — read/update the caller's app profile (mailing address + mode).
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MeProfile {
  id: string;
  email: string | null;
  plan: string;
  mode: 'draft' | 'autonomous';
  daily_send_cap: number;
  physical_address: string | null;
}

@Injectable({ providedIn: 'root' })
export class MeApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  get(): Observable<MeProfile> {
    return this.http.get<MeProfile>(`${this.base}/me`);
  }
  update(patch: { physical_address?: string; mode?: 'draft' | 'autonomous' }): Observable<MeProfile> {
    return this.http.put<MeProfile>(`${this.base}/me`, patch);
  }
}
