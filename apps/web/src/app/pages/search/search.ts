// Lead search screen (master-context §2/§7; File 16 shell + kit).
// WHY: the core discovery screen — industry/location + buying-signal filters,
// a metered "Search leads" action, results as selectable cards, and save-to-list.
// Renders inside the app shell with a ui-page-header, the pipeline stepper, kit
// states, and a "what's next → Enrich" step. Behaviour/data wiring unchanged.
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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

  // form
  protected industry = '';
  protected location = '';
  protected noWebsite = false;
  protected lowRating = false;

  // state
  protected readonly loading = signal(false);
  protected readonly searched = signal(false);
  protected readonly cached = signal(false);
  protected readonly results = signal<LeadCard[]>([]);
  protected readonly selected = signal<Set<string>>(new Set());
  protected readonly selectedCount = computed(() => this.selected().size);
  /** True once at least one lead has been saved (drives the next-step card). */
  protected readonly savedAny = signal(false);

  // save-to-list
  protected readonly lists = signal<LeadList[]>([]);
  protected targetListId = ''; // '' = new list
  protected newListName = '';
  protected readonly saving = signal(false);

  constructor() {
    this.api.getLists().subscribe({
      next: (l) => this.lists.set(l),
      error: () => {
        /* lists are optional */
      },
    });
  }

  find(): void {
    if (!this.industry.trim() || !this.location.trim()) {
      this.toast.warn('Enter an industry and a location to search.');
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
            if (res.count === 0) {
              this.toast.info('No businesses matched. Try a broader area.');
            }
          } else {
            this.results.set([]);
            this.toast.error(res.message);
          }
        },
        error: () => {
          this.loading.set(false);
          this.searched.set(true);
          this.toast.error('Something went wrong — nothing was charged. Try again.');
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
    const leadIds = [...this.selected()];
    if (leadIds.length === 0) {
      this.toast.warn('Select at least one lead first.');
      return;
    }
    if (!this.targetListId && !this.newListName.trim()) {
      this.toast.warn('Pick a list or name a new one.');
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
          this.savedAny.set(true);
          this.toast.success(
            `Saved ${r.linked} lead${r.linked === 1 ? '' : 's'} to your list.`,
          );
          this.selected.set(new Set());
          this.newListName = '';
          this.api.getLists().subscribe({ next: (l) => this.lists.set(l) });
        },
        error: () => {
          this.saving.set(false);
          this.toast.error('Could not save to the list. Please try again.');
        },
      });
  }
}
