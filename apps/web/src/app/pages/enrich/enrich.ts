// Enrichment screen (File 08) — the core value screen.
// WHY: turns saved leads into actionable ones. Pick a list, enrich selected/all,
// watch per-lead progress (non-blocking), and read each enriched card: best email
// (or an honest "no email found"), phone, a positive/negative reviews summary, and
// the "why reach out" hook as a highlighted callout. Cost is shown before; the
// balance updates as jobs commit. Plain, honest copy for not-found/partial cases.
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_NAME, CREDIT_COSTS } from '@extrovertai/shared';
import { LeadsApiService, type LeadList } from '../../core/leads.service';
import { CreditsApiService } from '../../core/credits.service';
import {
  EnrichmentApiService,
  type EnrichedLead,
  type ParsedReviews,
} from '../../core/enrichment.service';

const POLL_MS = 2500;

@Component({
  selector: 'app-enrich',
  imports: [FormsModule, RouterLink],
  templateUrl: './enrich.html',
})
export class Enrich implements OnDestroy {
  private readonly leadsApi = inject(LeadsApiService);
  private readonly api = inject(EnrichmentApiService);
  private readonly credits = inject(CreditsApiService);

  protected readonly appName = APP_NAME;
  protected readonly costPer = CREDIT_COSTS.enrichment;

  protected readonly lists = signal<LeadList[]>([]);
  protected selectedListId = '';

  protected readonly leads = signal<EnrichedLead[]>([]);
  protected readonly loading = signal(false);
  protected readonly selected = signal<Set<string>>(new Set());
  protected readonly balance = signal<number | null>(null);
  protected readonly message = signal<{ kind: 'info' | 'warn' | 'error'; text: string } | null>(
    null,
  );

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  // Leads still needing enrichment (for "enrich all" + cost preview).
  protected readonly pendingLeads = computed(() =>
    this.leads().filter((l) => l.enrichment_status !== 'complete'),
  );
  protected readonly selectedCount = computed(() => this.selected().size);
  protected readonly busy = computed(() =>
    this.leads().some(
      (l) => l.enrichment_status === 'pending' || l.enrichment_status === 'in_progress',
    ),
  );

  constructor() {
    this.leadsApi.getLists().subscribe({
      next: (l) => this.lists.set(l),
      error: () => this.message.set({ kind: 'error', text: 'Could not load your lists.' }),
    });
    this.refreshBalance();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  loadList(): void {
    this.message.set(null);
    this.selected.set(new Set());
    if (!this.selectedListId) {
      this.leads.set([]);
      return;
    }
    this.loading.set(true);
    this.api.listLeads(this.selectedListId).subscribe({
      next: (rows) => {
        this.leads.set(rows);
        this.loading.set(false);
        if (this.busy()) this.startPolling();
      },
      error: () => {
        this.loading.set(false);
        this.message.set({ kind: 'error', text: 'Could not load this list’s leads.' });
      },
    });
  }

  toggle(id: string): void {
    const next = new Set(this.selected());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.selected.set(next);
  }

  isSelected(id: string): boolean {
    return this.selected().has(id);
  }

  enrichSelected(): void {
    const ids = [...this.selected()].filter((id) =>
      this.pendingLeads().some((l) => l.id === id),
    );
    if (ids.length === 0) {
      this.message.set({ kind: 'warn', text: 'Select at least one lead that still needs enriching.' });
      return;
    }
    this.enqueue(ids);
  }

  enrichAll(): void {
    const ids = this.pendingLeads().map((l) => l.id);
    if (ids.length === 0) {
      this.message.set({ kind: 'info', text: 'Every lead in this list is already enriched.' });
      return;
    }
    this.enqueue(ids);
  }

  // --- reviews helpers (reviews can be {} before enrichment) ---
  positives(lead: EnrichedLead): string[] {
    return this.asReviews(lead)?.positive ?? [];
  }
  negatives(lead: EnrichedLead): string[] {
    return this.asReviews(lead)?.negative ?? [];
  }
  hasReviewSummary(lead: EnrichedLead): boolean {
    return this.positives(lead).length > 0 || this.negatives(lead).length > 0;
  }

  private asReviews(lead: EnrichedLead): ParsedReviews | null {
    const r = lead.reviews;
    if (r && typeof r === 'object' && 'positive' in r) return r as ParsedReviews;
    return null;
  }

  private enqueue(ids: string[]): void {
    this.message.set(null);
    this.api.enqueue(ids).subscribe({
      next: (res) => {
        if (!res.ok) {
          if (res.reason === 'out_of_credits') {
            this.message.set({
              kind: 'warn',
              text: 'You’re out of credits. Top up to enrich these leads — nothing was charged.',
            });
          } else {
            this.message.set({
              kind: 'error',
              text: 'Enrichment is unavailable right now. Please try again shortly.',
            });
          }
          return;
        }
        if (res.reason === 'partial_credits') {
          this.message.set({
            kind: 'warn',
            text: `Started ${res.enqueued} lead${res.enqueued === 1 ? '' : 's'}; ${res.skipped} skipped — you ran out of credits. Top up to finish the rest.`,
          });
        } else {
          this.message.set({
            kind: 'info',
            text: `Enriching ${res.enqueued} lead${res.enqueued === 1 ? '' : 's'}…`,
          });
        }
        // Optimistically mark queued leads as pending so progress shows immediately.
        const queued = new Set(ids);
        this.leads.update((rows) =>
          rows.map((l) =>
            queued.has(l.id) && l.enrichment_status !== 'complete'
              ? { ...l, enrichment_status: 'pending' as const }
              : l,
          ),
        );
        this.selected.set(new Set());
        this.startPolling();
      },
      error: () =>
        this.message.set({ kind: 'error', text: 'Could not start enrichment. Please try again.' }),
    });
  }

  private startPolling(): void {
    this.stopPolling();
    this.pollTimer = setInterval(() => this.poll(), POLL_MS);
    this.poll();
  }

  private poll(): void {
    const ids = this.leads()
      .filter((l) => l.enrichment_status === 'pending' || l.enrichment_status === 'in_progress')
      .map((l) => l.id);
    if (ids.length === 0) {
      this.stopPolling();
      this.refreshBalance();
      return;
    }
    this.api.status(ids).subscribe({
      next: (updates) => {
        const byId = new Map(updates.map((u) => [u.id, u]));
        this.leads.update((rows) => rows.map((l) => byId.get(l.id) ?? l));
        if (!this.busy()) {
          this.stopPolling();
          this.refreshBalance();
        }
      },
      error: () => {
        /* transient poll failure — keep the timer; next tick retries */
      },
    });
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private refreshBalance(): void {
    this.credits.balance().subscribe({
      next: (b) => this.balance.set(b.balance),
      error: () => {
        /* balance chip is non-critical */
      },
    });
  }
}
