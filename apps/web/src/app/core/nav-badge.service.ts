// NavBadgeService — small shared counters for the sidebar (File 16, Phase 2).
// WHY: the sidebar shows an unread badge on Inbox, but there is no dedicated
// count endpoint. Rather than over-fetch from the shell, the Inbox screen sets
// this signal when it loads conversations (Phase 4); the sidebar reads it and
// hides the badge while the count is 0. Easy to connect, no extra API calls.
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavBadgeService {
  /** Number of inbox conversations needing attention (0 = hide the badge). */
  readonly inboxUnread = signal<number>(0);

  setInboxUnread(count: number): void {
    this.inboxUnread.set(Math.max(0, count));
  }
}
