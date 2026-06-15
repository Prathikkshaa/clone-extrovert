// Lead search screen (master-context §2/§7; File 16 shell + kit).
// WHY: the core discovery screen — industry/location + buying-signal filters,
// a metered "Search leads" action, results as selectable cards, "Load more" for
// the next page, and a sticky selection bar to save + jump straight to enriching
// the leads you just picked (no manual list step). Behaviour preserved.
import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LeadsApiService,
  type LeadCard,
  type LeadList,
} from '../../core/leads.service';
import { Button } from '../../ui/button/button';
import { Card } from '../../ui/card/card';
import { EmptyState } from '../../ui/empty-state/empty-state';
import { Field } from '../../ui/field/field';
import { Icon } from '../../ui/icon/icon';
import { PageHeader } from '../../ui/page-header/page-header';
import { PipelineStepper } from '../../ui/pipeline-stepper/pipeline-stepper';
import { Skeleton } from '../../ui/skeleton/skeleton';
import { StatusBadge } from '../../ui/status-badge/status-badge';
import { ToastService } from '../../ui/toast/toast.service';

@Component({
  selector: 'app-search',
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    Button,
    Card,
    EmptyState,
    Field,
    Icon,
    PageHeader,
    PipelineStepper,
    Skeleton,
    StatusBadge,
  ],
  templateUrl: './search.html',
})
export class Search {
  private readonly api = inject(LeadsApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  // form
  protected industry = '';
  protected location = '';
  protected noWebsite = false;
  protected lowRating = false;

  // state
  protected readonly loading = signal(false);
  protected readonly loadingMore = signal(false);
  protected readonly searched = signal(false);
  protected readonly cached = signal(false);
  protected readonly results = signal<LeadCard[]>([]);
  protected readonly selected = signal<Set<string>>(new Set());
  protected readonly selectedCount = computed(() => this.selected().size);
  private readonly nextPageToken = signal<string | null>(null);
  protected readonly canLoadMore = computed(() => !!this.nextPageToken());

  // save-to-list
  protected readonly lists = signal<LeadList[]>([]);
  protected targetListId = ''; // '' = new list
  protected newListName = '';
  protected readonly saving = signal(false);

  // per-list row actions (export/delete) on the saved-lists view
  protected readonly exportingId = signal<string | null>(null);
  protected readonly deletingId = signal<string | null>(null);

  constructor() {
    this.loadLists();
  }

  private loadLists(): void {
    this.api.getLists().subscribe({
      next: (l) => this.lists.set(l),
      error: () => {
        /* lists are optional */
      },
    });
  }

  /** Download a list's leads as CSV (metered — spends one export credit). */
  exportList(list: LeadList): void {
    if (this.exportingId()) return;
    this.exportingId.set(list.id);
    this.api.exportList(list.id).subscribe({
      next: (res) => {
        this.exportingId.set(null);
        this.downloadCsv(res.filename, res.csv);
        this.toast.success(
          `Exported ${res.rows} lead${res.rows === 1 ? '' : 's'} from “${list.name}”.`,
        );
      },
      error: (err) => {
        this.exportingId.set(null);
        const msg =
          err?.status === 402 || /credit/i.test(err?.error?.message ?? '')
            ? 'Out of credits — top up to export. Nothing was charged.'
            : 'Could not export this list. Please try again.';
        this.toast.error(msg);
      },
    });
  }

  /** Delete a saved list (keeps the underlying leads). */
  deleteList(list: LeadList): void {
    if (this.deletingId()) return;
    if (!confirm(`Delete the list “${list.name}”? The leads themselves are kept.`)) return;
    this.deletingId.set(list.id);
    this.api.deleteList(list.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.lists.update((ls) => ls.filter((l) => l.id !== list.id));
        this.toast.success('List deleted.');
      },
      error: () => {
        this.deletingId.set(null);
        this.toast.error('Could not delete the list. Please try again.');
      },
    });
  }

  private downloadCsv(filename: string, csv: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  find(): void {
    if (!this.industry.trim() || !this.location.trim()) {
      this.toast.warn('Enter an industry and a location to search.');
      return;
    }
    this.loading.set(true);
    this.selected.set(new Set());
    this.results.set([]);
    this.nextPageToken.set(null);
    this.runSearch(null);
  }

  loadMore(): void {
    const token = this.nextPageToken();
    if (!token || this.loadingMore()) return;
    this.loadingMore.set(true);
    this.runSearch(token);
  }

  private runSearch(pageToken: string | null): void {
    this.api
      .search({
        industry: this.industry,
        location: this.location,
        filters: {
          noWebsite: this.noWebsite || undefined,
          maxRating: this.lowRating ? 4.0 : undefined,
        },
        pageToken: pageToken ?? undefined,
      })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.loadingMore.set(false);
          this.searched.set(true);
          if (res.ok) {
            // Append for "load more", replace for a fresh search.
            this.results.update((cur) =>
              pageToken ? this.mergeLeads(cur, res.leads) : res.leads,
            );
            this.cached.set(res.cached);
            this.nextPageToken.set(res.nextPageToken ?? null);
            if (!pageToken && res.count === 0) {
              this.toast.info('No businesses matched. Try a broader area.');
            }
          } else {
            this.toast.error(res.message);
          }
        },
        error: () => {
          this.loading.set(false);
          this.loadingMore.set(false);
          this.searched.set(true);
          this.toast.error('Something went wrong — nothing was charged. Try again.');
        },
      });
  }

  private mergeLeads(current: LeadCard[], incoming: LeadCard[]): LeadCard[] {
    const seen = new Set(current.map((l) => l.id));
    return [...current, ...incoming.filter((l) => !seen.has(l.id))];
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

  selectAll(): void {
    this.selected.set(new Set(this.results().map((l) => l.id)));
  }

  clearSelection(): void {
    this.selected.set(new Set());
  }

  /** Save selected to a list (new or existing) and stay on the page. */
  save(): void {
    this.persist((listId) => {
      this.toast.success('Saved to your list.');
      this.refreshLists(listId);
    });
  }

  /** Save selected, then jump straight to enriching that list. */
  saveAndEnrich(): void {
    this.persist((listId) => {
      this.toast.success('Saved — let’s enrich them.');
      void this.router.navigate(['/enrich'], { queryParams: { list: listId } });
    });
  }

  private persist(onDone: (listId: string) => void): void {
    const leadIds = [...this.selected()];
    if (leadIds.length === 0) {
      this.toast.warn('Select at least one business first.');
      return;
    }
    const listName = this.targetListId
      ? undefined
      : this.newListName.trim() || this.defaultListName();
    this.saving.set(true);
    this.api
      .saveToList({ listId: this.targetListId || undefined, listName, leadIds })
      .subscribe({
        next: (r) => {
          this.saving.set(false);
          this.selected.set(new Set());
          this.newListName = '';
          onDone(r.listId);
        },
        error: () => {
          this.saving.set(false);
          this.toast.error('Could not save to the list. Please try again.');
        },
      });
  }

  private defaultListName(): string {
    const base = `${this.industry} in ${this.location}`.trim();
    return base.length > 1 ? base : `Leads ${new Date().toLocaleDateString()}`;
  }

  private refreshLists(selectId: string): void {
    this.api.getLists().subscribe({
      next: (l) => {
        this.lists.set(l);
        this.targetListId = selectId;
      },
    });
  }
}
