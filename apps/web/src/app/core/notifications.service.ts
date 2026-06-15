// NotificationsService — lean, client-derived alerts (no backend, no piling up).
// WHY: we only surface a SMALL set of critical/important conditions the user must
// act on — a mailbox that needs reconnecting, and out-of/low credits. Each is a
// stable id so it never duplicates: we derive the live set from app state on
// refresh(), remember the first time each was seen (for the timestamp) and which
// ones the user dismissed/cleared (in localStorage), and expose the rest. The bell
// reads items()/unreadCount(); the panel calls dismiss()/clearAll().
import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MailboxApiService } from './mailbox-api.service';
import { CreditsApiService } from './credits.service';
import type { IconName } from '../ui/icon/icon-paths';

export type NotificationKind = 'critical' | 'warning';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  icon: IconName;
  title: string;
  body: string;
  link: string;
  createdAt: number; // epoch ms — first time this condition was seen
}

const LOW_CREDITS_THRESHOLD = 10;
const SEEN_KEY = 'extrovertai.notif.seen'; // id -> first-seen timestamp
const CLEARED_KEY = 'extrovertai.notif.cleared'; // ids the user dismissed

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly mailboxApi = inject(MailboxApiService);
  private readonly credits = inject(CreditsApiService);

  private readonly seen = signal<Record<string, number>>(this.read(SEEN_KEY));
  private readonly cleared = signal<string[]>(this.readArray(CLEARED_KEY));
  private readonly active = signal<AppNotification[]>([]);

  /** Visible notifications (active conditions the user hasn't cleared), newest first. */
  readonly items = computed(() =>
    this.active()
      .filter((n) => !this.cleared().includes(n.id))
      .sort((a, b) => b.createdAt - a.createdAt),
  );
  readonly unreadCount = computed(() => this.items().length);

  /** Recompute notifications from live app state. Cheap; call on navigation. */
  refresh(): void {
    forkJoin({
      mailboxes: this.mailboxApi.list(),
      balance: this.credits.balance(),
    }).subscribe({
      next: ({ mailboxes, balance }) => {
        const next: AppNotification[] = [];

        if (mailboxes.some((m) => m.status === 'reauth_required')) {
          next.push(
            this.build({
              id: 'mailbox-reauth',
              kind: 'critical',
              icon: 'triangle-alert',
              title: 'Mailbox needs reconnecting',
              body: 'A mailbox’s authorization expired. Reconnect it to keep sending.',
              link: '/mailboxes',
            }),
          );
        }

        const bal = balance.balance;
        if (bal <= 0) {
          next.push(
            this.build({
              id: 'credits-empty',
              kind: 'critical',
              icon: 'wallet',
              title: 'You’re out of credits',
              body: 'Top up to keep finding, enriching, and sending.',
              link: '/billing',
            }),
          );
        } else if (bal <= LOW_CREDITS_THRESHOLD) {
          next.push(
            this.build({
              id: 'credits-low',
              kind: 'warning',
              icon: 'wallet',
              title: 'Low credit balance',
              body: `Only ${bal} credit${bal === 1 ? '' : 's'} left — top up before you run out.`,
              link: '/billing',
            }),
          );
        }

        // A condition that's no longer active is auto-removed from "cleared" so it
        // can re-notify if it happens again later.
        const activeIds = new Set(next.map((n) => n.id));
        this.cleared.update((ids) => ids.filter((id) => activeIds.has(id)));
        this.persistArray(CLEARED_KEY, this.cleared());
        this.active.set(next);
      },
      error: () => {
        /* notifications are best-effort */
      },
    });
  }

  dismiss(id: string): void {
    this.cleared.update((ids) => (ids.includes(id) ? ids : [...ids, id]));
    this.persistArray(CLEARED_KEY, this.cleared());
  }

  clearAll(): void {
    this.cleared.set(this.active().map((n) => n.id));
    this.persistArray(CLEARED_KEY, this.cleared());
  }

  /** Build a notification, stamping (and remembering) when it was first seen. */
  private build(n: Omit<AppNotification, 'createdAt'>): AppNotification {
    const seen = this.seen();
    let createdAt = seen[n.id];
    if (!createdAt) {
      createdAt = Date.now();
      const updated = { ...seen, [n.id]: createdAt };
      this.seen.set(updated);
      this.persist(SEEN_KEY, updated);
    }
    return { ...n, createdAt };
  }

  private read(key: string): Record<string, number> {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '{}') as Record<string, number>;
    } catch {
      return {};
    }
  }
  private readArray(key: string): string[] {
    try {
      const v = JSON.parse(localStorage.getItem(key) ?? '[]');
      return Array.isArray(v) ? (v as string[]) : [];
    } catch {
      return [];
    }
  }
  private persist(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage may be unavailable */
    }
  }
  private persistArray(key: string, value: string[]): void {
    this.persist(key, value);
  }
}
