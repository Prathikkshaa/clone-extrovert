// Threaded inbox + AI reply (File 11; File 16 shell + kit).
// WHY: a calm unified inbox of conversations (lead replies). Open a thread to see
// the full back-and-forth, draft an AI reply in your voice, edit it, and send —
// nothing sends without your explicit click (approval-by-default, §2). Transient
// status goes through toasts; the conversation count feeds the sidebar Inbox
// badge (NavBadgeService).
import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavBadgeService } from '../../core/nav-badge.service';
import {
  InboxApiService,
  type Conversation,
  type ThreadView,
} from '../../core/inbox.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { EmptyState } from '../../ui/empty-state/empty-state';
import { PageHeader } from '../../ui/page-header/page-header';
import { Skeleton } from '../../ui/skeleton/skeleton';
import { StatusBadge } from '../../ui/status-badge/status-badge';
import { ToastService } from '../../ui/toast/toast.service';

@Component({
  selector: 'app-inbox',
  imports: [
    FormsModule,
    RouterLink,
    DatePipe,
    Button,
    Card,
    EmptyState,
    PageHeader,
    Skeleton,
    StatusBadge,
  ],
  templateUrl: './inbox.html',
})
export class Inbox {
  private readonly api = inject(InboxApiService);
  private readonly toast = inject(ToastService);
  private readonly badges = inject(NavBadgeService);

  protected readonly conversations = signal<Conversation[]>([]);
  protected readonly loadingList = signal(true);
  protected readonly thread = signal<ThreadView | null>(null);
  protected readonly loadingThread = signal(false);
  protected readonly selectedLeadId = signal<string | null>(null);
  protected replyBody = '';
  protected readonly drafting = signal(false);
  protected readonly sending = signal(false);

  constructor() {
    this.api.conversations().subscribe({
      next: (c) => {
        this.conversations.set(c);
        this.loadingList.set(false);
        this.badges.setInboxUnread(c.length);
      },
      error: () => {
        this.loadingList.set(false);
        this.toast.error('Could not load your inbox.');
      },
    });
  }

  select(leadId: string): void {
    this.replyBody = '';
    this.selectedLeadId.set(leadId);
    this.loadingThread.set(true);
    this.api.thread(leadId).subscribe({
      next: (t) => {
        this.thread.set(t);
        this.loadingThread.set(false);
      },
      error: () => {
        this.loadingThread.set(false);
        this.toast.error('Could not open this conversation.');
      },
    });
  }

  draftReply(): void {
    const leadId = this.selectedLeadId();
    if (!leadId) return;
    this.drafting.set(true);
    this.api.draftReply(leadId).subscribe({
      next: (res) => {
        this.drafting.set(false);
        if (res.ok) {
          this.replyBody = res.body;
        } else if (res.reason === 'out_of_credits') {
          this.toast.warn('Out of credits — top up to draft a reply.');
        } else {
          this.toast.error('Could not draft a reply. Try again.');
        }
      },
      error: () => {
        this.drafting.set(false);
        this.toast.error('Could not draft a reply. Try again.');
      },
    });
  }

  sendReply(): void {
    const leadId = this.selectedLeadId();
    if (!leadId || !this.replyBody.trim()) {
      this.toast.warn('Write a reply first.');
      return;
    }
    this.sending.set(true);
    this.api.sendReply(leadId, this.replyBody.trim()).subscribe({
      next: (res) => {
        this.sending.set(false);
        if (res.ok) {
          this.toast.success('Reply sent.');
          this.replyBody = '';
          this.select(leadId); // reload the thread
        } else {
          this.toast.warn(this.sendError(res.reason));
        }
      },
      error: () => {
        this.sending.set(false);
        this.toast.error('Could not send the reply. Try again.');
      },
    });
  }

  private sendError(reason: string): string {
    switch (reason) {
      case 'suppressed':
        return 'This person unsubscribed — we can’t email them.';
      case 'no_address':
        return 'Add your mailing address in Settings to send (legally required).';
      case 'no_mailbox':
        return 'Connect a mailbox to send.';
      case 'reauth':
        return 'Reconnect your mailbox to keep sending.';
      case 'no_email':
        return 'This lead has no email address.';
      default:
        return 'Could not send the reply. Try again.';
    }
  }
}
