// CampaignsApiService (web) — client for the File 10 sending screens.
// Send plan preview, start sending, list campaigns, and the campaign monitor.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MailboxCapacity {
  mailboxId: string;
  email: string;
  warmupState: string;
  effectiveCap: number;
  usedToday: number;
  remaining: number;
}
export interface CapacitySummary {
  connectedCount: number;
  totalCap: number;
  totalUsed: number;
  totalRemaining: number;
  mailboxes: MailboxCapacity[];
}
export interface SendPlan {
  hasMailbox: boolean;
  leadCount: number;
  todayCount: number;
  laterCount: number;
  capacity: CapacitySummary;
}
export type StartResult =
  | { ok: true; campaignId: string; plan: SendPlan }
  | { ok: false; reason: 'no_mailbox' | 'no_drafts' };

export interface CampaignCounts {
  total: number;
  sent: number;
  replied: number;
  bounced: number;
  stopped: number;
  queued: number;
}
export interface CampaignSummary {
  id: string;
  status: string;
  channel: string;
  created_at: string;
  counts: CampaignCounts;
}
export interface CampaignStepState {
  step_order: number;
  state: string;
  sent_at: string | null;
  send_error: string | null;
}
export interface CampaignLeadState {
  leadId: string;
  name: string | null;
  email: string | null;
  steps: CampaignStepState[];
}
export interface CampaignDetail extends CampaignSummary {
  leads: CampaignLeadState[];
  capacity: CapacitySummary;
}

@Injectable({ providedIn: 'root' })
export class CampaignsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  plan(listId: string): Observable<SendPlan> {
    return this.http.get<SendPlan>(`${this.base}/campaigns/plan`, { params: { listId } });
  }
  start(listId: string): Observable<StartResult> {
    return this.http.post<StartResult>(`${this.base}/campaigns/start`, { listId });
  }
  list(): Observable<CampaignSummary[]> {
    return this.http.get<CampaignSummary[]>(`${this.base}/campaigns`);
  }
  detail(id: string): Observable<CampaignDetail> {
    return this.http.get<CampaignDetail>(`${this.base}/campaigns/${id}`);
  }
  setStatus(id: string, status: 'paused' | 'active'): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.base}/campaigns/${id}/status`, { status });
  }
}
