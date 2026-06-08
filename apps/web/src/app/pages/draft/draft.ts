// Drafting review queue (File 09) — the personalization USP screen.
// WHY: a FAST, calm, keyboard-first review queue (not a wall of textareas). One
// lead at a time with its name + hook beside the draft so the user sees WHY this
// message. Approve / skip / edit / regenerate from the keyboard; edits persist;
// approving marks the sequence ready for sending (File 10). Per-lead progress
// while generating; failed drafts flagged with a clear Regenerate next step.
import { Component, HostListener, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_NAME, CREDIT_COSTS } from '@extrovertai/shared';
import { LeadsApiService, type LeadList } from '../../core/leads.service';
import { CreditsApiService } from '../../core/credits.service';
import { EnrichmentApiService } from '../../core/enrichment.service';
import {
  DraftingApiService,
  type DraftMessage,
  type LeadDrafts,
} from '../../core/drafting.service';

interface ReviewLead {
  leadId: string;
  name: string | null;
  hook: string | null;
  drafts: DraftMessage[];
  approved: boolean;
}

interface TodoLead {
  leadId: string;
  name: string | null;
  hook: string | null;
}

const POLL_MS = 3000;
const GENERATE_TIMEOUT_MS = 90000;
const STEP_LABELS: Record<number, string> = { 1: 'Email', 2: 'Follow-up 1', 3: 'Follow-up 2' };

@Component({
  selector: 'app-draft',
  imports: [FormsModule, RouterLink],
  templateUrl: './draft.html',
})
export class Draft implements OnDestroy {
  private readonly leadsApi = inject(LeadsApiService);
  private readonly enrichApi = inject(EnrichmentApiService);
  private readonly api = inject(DraftingApiService);
  private readonly credits = inject(CreditsApiService);

  protected readonly appName = APP_NAME;
  protected readonly costPer = CREDIT_COSTS.draft;
  protected readonly stepLabel = (s: number): string => STEP_LABELS[s] ?? `Step ${s}`;

  protected readonly lists = signal<LeadList[]>([]);
  protected selectedListId = '';
  protected readonly loading = signal(false);
  protected readonly balance = signal<number | null>(null);
  protected readonly message = signal<{ kind: 'info' | 'warn' | 'error'; text: string } | null>(null);

  protected readonly todo = signal<TodoLead[]>([]); // leads with no drafts yet
  protected readonly review = signal<ReviewLead[]>([]); // leads with drafts (the queue)
  protected readonly failed = signal<TodoLead[]>([]); // generation timed out / failed

  protected readonly index = signal(0);
  protected readonly step = signal(1);

  // Inline edit fields (bound to the active draft; saved on blur).
  protected subject = '';
  protected body = '';

  private generating = new Map<string, number>(); // leadId -> enqueued timestamp
  private pollTimer: ReturnType<typeof setInterval> | null = null;

  protected readonly current = computed<ReviewLead | null>(() => this.review()[this.index()] ?? null);
  protected readonly activeDraft = computed<DraftMessage | null>(
    () => this.current()?.drafts.find((d) => d.step_order === this.step()) ?? null,
  );
  // True while a generation batch is polling. A signal (not a computed over the
  // plain `generating` Map) so the UI actually reacts — a computed has no signal
  // dependency on Map.size and would stay stuck at its first value.
  protected readonly busyGenerating = signal(false);
  protected readonly remaining = computed(() => this.review().filter((l) => !l.approved).length);

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
    this.todo.set([]);
    this.review.set([]);
    this.failed.set([]);
    this.index.set(0);
    this.step.set(1);
    if (!this.selectedListId) return;
    this.loading.set(true);
    this.enrichApi.listLeads(this.selectedListId).subscribe({
      next: (leads) => {
        const ids = leads.map((l) => l.id);
        const meta = new Map(leads.map((l) => [l.id, { name: l.name, hook: l.hook }]));
        if (ids.length === 0) {
          this.loading.set(false);
          return;
        }
        this.api.byLeads(ids).subscribe({
          next: (rows) => {
            this.loading.set(false);
            this.ingest(rows, meta);
          },
          error: () => {
            this.loading.set(false);
            this.message.set({ kind: 'error', text: 'Could not load drafts for this list.' });
          },
        });
      },
      error: () => {
        this.loading.set(false);
        this.message.set({ kind: 'error', text: 'Could not load this list’s leads.' });
      },
    });
  }

  generateAll(): void {
    const ids = this.todo().map((l) => l.leadId);
    if (ids.length === 0) {
      this.message.set({ kind: 'info', text: 'Every lead here already has drafts.' });
      return;
    }
    this.enqueue(ids);
  }

  // --- review queue navigation ---
  setStep(s: number): void {
    this.step.set(s);
    this.loadActive();
  }

  goNext(): void {
    if (this.index() < this.review().length - 1) {
      this.index.update((i) => i + 1);
      this.step.set(1);
      this.loadActive();
    }
  }

  goPrev(): void {
    if (this.index() > 0) {
      this.index.update((i) => i - 1);
      this.step.set(1);
      this.loadActive();
    }
  }

  approveCurrent(): void {
    const lead = this.current();
    if (!lead || lead.approved) {
      this.goNext();
      return;
    }
    // Optimistic: mark approved + advance immediately.
    this.review.update((rows) =>
      rows.map((l) => (l.leadId === lead.leadId ? { ...l, approved: true } : l)),
    );
    this.api.approve(lead.leadId).subscribe({
      error: () =>
        this.message.set({ kind: 'error', text: 'Could not save approval. Try again.' }),
    });
    this.goNext();
  }

  regenerateCurrent(): void {
    const lead = this.current();
    if (!lead) return;
    this.api.regenerate(lead.leadId).subscribe({
      next: (res) => {
        if (!res.ok) {
          this.message.set({
            kind: 'warn',
            text:
              res.reason === 'out_of_credits'
                ? 'Out of credits — top up to regenerate. Nothing was charged.'
                : 'Regenerate is unavailable right now.',
          });
          return;
        }
        // Move this lead back to "generating" and remove its current drafts.
        this.review.update((rows) => rows.filter((l) => l.leadId !== lead.leadId));
        this.generating.set(lead.leadId, Date.now());
        this.todo.update((t) => [{ leadId: lead.leadId, name: lead.name, hook: lead.hook }, ...t]);
        if (this.index() >= this.review().length) this.index.set(Math.max(0, this.review().length - 1));
        this.loadActive();
        this.startPolling();
        this.message.set({ kind: 'info', text: 'Rewriting this lead’s drafts…' });
      },
      error: () => this.message.set({ kind: 'error', text: 'Could not regenerate. Try again.' }),
    });
  }

  saveEdit(): void {
    const draft = this.activeDraft();
    if (!draft) return;
    if (this.subject === (draft.subject ?? '') && this.body === (draft.body ?? '')) return;
    const subject = this.subject;
    const body = this.body;
    // Optimistic local update.
    this.review.update((rows) =>
      rows.map((l) => ({
        ...l,
        drafts: l.drafts.map((d) => (d.id === draft.id ? { ...d, subject, body } : d)),
      })),
    );
    this.api.edit(draft.id, { subject, body }).subscribe({
      error: () => this.message.set({ kind: 'error', text: 'Could not save your edit. Try again.' }),
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    const tag = (e.target as HTMLElement | null)?.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if (typing) {
      if (e.key === 'Escape') (e.target as HTMLElement).blur();
      return; // don't hijack editing keys
    }
    if (this.review().length === 0) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'Enter':
        e.preventDefault();
        this.approveCurrent();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.goNext();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.goPrev();
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        this.regenerateCurrent();
        break;
      case '1':
      case '2':
      case '3':
        this.setStep(Number(e.key));
        break;
    }
  }

  // --- internals ---
  private enqueue(ids: string[]): void {
    this.message.set(null);
    this.api.enqueue(ids).subscribe({
      next: (res) => {
        if (!res.ok) {
          this.message.set({
            kind: res.reason === 'out_of_credits' ? 'warn' : 'error',
            text:
              res.reason === 'out_of_credits'
                ? 'You’re out of credits. Top up to write drafts — nothing was charged.'
                : 'Drafting is unavailable right now. Please try again shortly.',
          });
          return;
        }
        const now = Date.now();
        ids.forEach((id) => this.generating.set(id, now));
        this.todo.set([]);
        if (res.reason === 'partial_credits') {
          this.message.set({
            kind: 'warn',
            text: `Writing ${res.enqueued} draft set${res.enqueued === 1 ? '' : 's'}; ${res.skipped} skipped — out of credits. Top up to finish.`,
          });
        } else {
          this.message.set({
            kind: 'info',
            text: `Writing drafts for ${res.enqueued} lead${res.enqueued === 1 ? '' : 's'}…`,
          });
        }
        this.startPolling();
      },
      error: () => this.message.set({ kind: 'error', text: 'Could not start drafting. Try again.' }),
    });
  }

  private ingest(rows: LeadDrafts[], meta: Map<string, { name: string | null; hook: string | null }>): void {
    const review: ReviewLead[] = [];
    const todo: TodoLead[] = [];
    for (const r of rows) {
      const name = r.name ?? meta.get(r.leadId)?.name ?? null;
      const hook = r.hook ?? meta.get(r.leadId)?.hook ?? null;
      if (r.drafts.length > 0) {
        review.push({
          leadId: r.leadId,
          name,
          hook,
          drafts: [...r.drafts].sort((a, b) => a.step_order - b.step_order),
          approved: r.drafts.every((d) => d.approved),
        });
      } else if (!this.generating.has(r.leadId)) {
        todo.push({ leadId: r.leadId, name, hook });
      }
    }
    this.review.set(review);
    this.todo.set(todo);
    this.loadActive();
  }

  private startPolling(): void {
    this.stopPolling();
    this.busyGenerating.set(true);
    this.pollTimer = setInterval(() => this.poll(), POLL_MS);
    this.poll();
  }

  private poll(): void {
    const ids = [...this.generating.keys()];
    if (ids.length === 0) {
      this.stopPolling();
      this.refreshBalance();
      return;
    }
    this.api.byLeads(ids).subscribe({
      next: (rows) => {
        let changed = false;
        for (const r of rows) {
          if (r.drafts.length > 0) {
            this.generating.delete(r.leadId);
            this.addToReview(r);
            changed = true;
          } else if (Date.now() - (this.generating.get(r.leadId) ?? 0) > GENERATE_TIMEOUT_MS) {
            this.generating.delete(r.leadId);
            this.failed.update((f) => [...f, { leadId: r.leadId, name: r.name, hook: r.hook }]);
            changed = true;
          }
        }
        if (changed) this.loadActive();
        if (this.generating.size === 0) {
          this.stopPolling();
          this.refreshBalance();
        }
      },
      error: () => {
        /* transient — next tick retries */
      },
    });
  }

  private addToReview(r: LeadDrafts): void {
    this.review.update((rows) => {
      if (rows.some((l) => l.leadId === r.leadId)) return rows;
      return [
        ...rows,
        {
          leadId: r.leadId,
          name: r.name,
          hook: r.hook,
          drafts: [...r.drafts].sort((a, b) => a.step_order - b.step_order),
          approved: r.drafts.every((d) => d.approved),
        },
      ];
    });
  }

  private loadActive(): void {
    const d = this.activeDraft();
    this.subject = d?.subject ?? '';
    this.body = d?.body ?? '';
  }

  private stopPolling(): void {
    this.busyGenerating.set(false);
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
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

  retryFailed(lead: TodoLead): void {
    this.failed.update((f) => f.filter((l) => l.leadId !== lead.leadId));
    this.enqueue([lead.leadId]);
  }
}
