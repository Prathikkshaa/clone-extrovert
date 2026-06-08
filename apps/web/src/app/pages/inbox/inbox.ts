// Threaded inbox + AI reply (File 11).
// WHY: a calm unified inbox of conversations (lead replies). Open a thread to see
// the full back-and-forth, draft an AI reply in your voice, edit it, and send —
// nothing sends without your explicit click (approval-by-default, §2).
import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import { CreditsApiService } from '../../core/credits.service';
import {
  InboxApiService,
  type Conversation,
  type ThreadView,
} from '../../core/inbox.service';

@Component({
  selector: 'app-inbox',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './inbox.html',
})
export class Inbox {
  private readonly api = inject(InboxApiService);
  private readonly credits = inject(CreditsApiService);

  protected readonly appName = APP_NAME;
  protected readonly conversations = signal<Conversation[]>([]);
  protected readonly loadingList = signal(true);
  protected readonly thread = signal<ThreadView | null>(null);
  protected readonly loadingThread = signal(false);
  protected readonly selectedLeadId = signal<string | null>(null);
  protected readonly balance = signal<number | null>(null);
  protected replyBody = '';
  protected readonly drafting = signal(false);
  protected readonly sending = signal(false);
  protected readonly message = signal<{ kind: 'info' | 'warn' | 'error'; text: string } | null>(
    null,
  );

  constructor() {
    this.api.conversations().subscribe({
      next: (c) => {
        this.conversations.set(c);
        this.loadingList.set(false);
      },
      error: () => {
        this.loadingList.set(false);
        this.message.set({ kind: 'error', text: 'Could not load your inbox.' });
      },
    });
    this.refreshBalance();
  }

  select(leadId: string): void {
    this.message.set(null);
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
        this.message.set({ kind: 'error', text: 'Could not open this conversation.' });
      },
    });
  }

  draftReply(): void {
    const leadId = this.selectedLeadId();
    if (!leadId) return;
    this.message.set(null);
    this.drafting.set(true);
    this.api.draftReply(leadId).subscribe({
      next: (res) => {
        this.drafting.set(false);
        if (res.ok) {
          this.replyBody = res.body;
        } else if (res.reason === 'out_of_credits') {
          this.message.set({ kind: 'warn', text: 'Out of credits — top up to draft a reply.' });
        } else {
          this.message.set({ kind: 'error', text: 'Could not draft a reply. Try again.' });
        }
        this.refreshBalance();
      },
      error: () => {
        this.drafting.set(false);
        this.message.set({ kind: 'error', text: 'Could not draft a reply. Try again.' });
      },
    });
  }

  sendReply(): void {
    const leadId = this.selectedLeadId();
    if (!leadId || !this.replyBody.trim()) {
      this.message.set({ kind: 'warn', text: 'Write a reply first.' });
      return;
    }
    this.sending.set(true);
    this.api.sendReply(leadId, this.replyBody.trim()).subscribe({
      next: (res) => {
        this.sending.set(false);
        if (res.ok) {
          this.message.set({ kind: 'info', text: 'Reply sent.' });
          this.replyBody = '';
          this.select(leadId); // reload the thread
        } else {
          this.message.set({ kind: 'warn', text: this.sendError(res.reason) });
        }
      },
      error: () => {
        this.sending.set(false);
        this.message.set({ kind: 'error', text: 'Could not send the reply. Try again.' });
      },
    });
  }

  labelClass(label: string): string {
    if (label === 'positive') return 'text-positive';
    if (label === 'unsubscribe') return 'text-danger';
    return 'text-muted';
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

  private refreshBalance(): void {
    this.credits.balance().subscribe({
      next: (b) => this.balance.set(b.balance),
      error: () => {
        /* non-critical */
      },
    });
  }
}
