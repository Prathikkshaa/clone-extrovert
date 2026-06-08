// InboxApiService (web) — client for the threaded inbox + AI reply (File 11).
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Conversation {
  leadId: string;
  name: string | null;
  email: string | null;
  status: string;
  lastAt: string;
  snippet: string;
  label: string;
}
export interface ThreadMessage {
  id: string;
  direction: string;
  subject: string | null;
  body: string | null;
  state: string;
  at: string;
}
export interface ThreadView {
  leadId: string;
  name: string | null;
  email: string | null;
  status: string;
  messages: ThreadMessage[];
}
export type ReplyDraftResult =
  | { ok: true; body: string }
  | { ok: false; reason: 'out_of_credits' | 'error' | 'not_found' };
export type SendReplyResult =
  | { ok: true }
  | { ok: false; reason: 'no_email' | 'suppressed' | 'no_mailbox' | 'no_address' | 'reauth' | 'error' };

@Injectable({ providedIn: 'root' })
export class InboxApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  conversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.base}/inbox`);
  }
  thread(leadId: string): Observable<ThreadView> {
    return this.http.get<ThreadView>(`${this.base}/inbox/${leadId}`);
  }
  draftReply(leadId: string): Observable<ReplyDraftResult> {
    return this.http.post<ReplyDraftResult>(`${this.base}/inbox/${leadId}/draft-reply`, {});
  }
  sendReply(leadId: string, body: string): Observable<SendReplyResult> {
    return this.http.post<SendReplyResult>(`${this.base}/inbox/${leadId}/send-reply`, { body });
  }
}
