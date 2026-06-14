// DashboardApiService — reads the trustworthy-metrics dashboard (File 12).
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type HealthStatus = 'healthy' | 'warning' | 'danger';

export interface DeliverabilityHealth {
  volumeUsed: number;
  volumeCap: number;
  bounceRate: number;
  complaintRate: number | null;
  status: HealthStatus;
  thresholds: { bounceWarning: number; bounceDanger: number };
}

export interface DashboardSummary {
  windowDays: number;
  meetingsBooked: number;
  positiveReplies: number;
  totalReplies: number;
  emailsSent: number;
  followUpsPending: number;
  bounces: number;
  linkClicks: number;
  opens: { tracked: false };
  health: DeliverabilityHealth;
  creditBalance: number;
  isEmpty: boolean;
}

export interface CampaignStat {
  campaignId: string;
  name: string | null;
  status: string;
  sent: number;
  linkClicks: number;
  replies: number;
  bounces: number;
  meetings: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/dashboard`;

  summary(days = 30): Observable<DashboardSummary> {
    const params = new HttpParams().set('days', String(days));
    return this.http.get<DashboardSummary>(`${this.base}/summary`, { params });
  }

  campaigns(days = 30): Observable<CampaignStat[]> {
    const params = new HttpParams().set('days', String(days));
    return this.http.get<CampaignStat[]>(`${this.base}/campaigns`, { params });
  }
}
