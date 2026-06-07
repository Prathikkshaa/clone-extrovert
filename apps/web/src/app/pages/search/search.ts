// Lead search screen (master-context §2/§7).
// WHY: the core discovery screen — industry/location + buying-signal filters,
// a metered "Find leads" action, results as selectable cards, and save-to-list.
// Plain copy, teaching empty states, friendly out-of-credits/busy handling.
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@extrovertai/shared';
import {
  LeadsApiService,
  type LeadCard,
  type LeadList,
} from '../../core/leads.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule, RouterLink],
  templateUrl: './search.html',
})
export class Search {
  private readonly api = inject(LeadsApiService);

  protected readonly appName = APP_NAME;

  // form
  protected industry = '';
  protected location = '';
  protected noWebsite = false;
  protected lowRating = false;

  // state
  protected readonly loading = signal(false);
  protected readonly searched = signal(false);
  protected readonly cached = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly results = signal<LeadCard[]>([]);
  protected readonly selected = signal<Set<string>>(new Set());
  protected readonly selectedCount = computed(() => this.selected().size);

  // save-to-list
  protected readonly lists = signal<LeadList[]>([]);
  protected targetListId = ''; // '' = new list
  protected newListName = '';
  protected readonly saving = signal(false);
  protected readonly saveMsg = signal<string | null>(null);

  constructor() {
    this.api.getLists().subscribe({
      next: (l) => this.lists.set(l),
      error: () => {
        /* lists are optional */
      },
    });
  }

  find(): void {
    this.error.set(null);
    this.saveMsg.set(null);
    if (!this.industry.trim() || !this.location.trim()) {
      this.error.set('Enter an industry and a location to search.');
      return;
    }
    this.loading.set(true);
    this.selected.set(new Set());
    this.api
      .search({
        industry: this.industry,
        location: this.location,
        filters: {
          noWebsite: this.noWebsite || undefined,
          maxRating: this.lowRating ? 4.0 : undefined,
        },
      })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.searched.set(true);
          if (res.ok) {
            this.results.set(res.leads);
            this.cached.set(res.cached);
          } else {
            this.results.set([]);
            this.error.set(res.message);
          }
        },
        error: () => {
          this.loading.set(false);
          this.searched.set(true);
          this.error.set('Something went wrong. Please try again.');
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

  save(): void {
    this.saveMsg.set(null);
    const leadIds = [...this.selected()];
    if (leadIds.length === 0) {
      this.saveMsg.set('Select at least one lead first.');
      return;
    }
    if (!this.targetListId && !this.newListName.trim()) {
      this.saveMsg.set('Pick a list or name a new one.');
      return;
    }
    this.saving.set(true);
    this.api
      .saveToList({
        listId: this.targetListId || undefined,
        listName: this.targetListId ? undefined : this.newListName.trim(),
        leadIds,
      })
      .subscribe({
        next: (r) => {
          this.saving.set(false);
          this.saveMsg.set(`Saved ${r.linked} lead${r.linked === 1 ? '' : 's'} to your list.`);
          this.selected.set(new Set());
          this.newListName = '';
          this.api.getLists().subscribe({ next: (l) => this.lists.set(l) });
        },
        error: () => {
          this.saving.set(false);
          this.saveMsg.set('Could not save to the list. Please try again.');
        },
      });
  }
}
