// ui-page-header — the standard screen header (File 16 §7).
// WHY: every screen had a hand-rolled header with drifting title sizes and ad-hoc
// "back" links. This renders one consistent header: title + optional subtitle on
// the left, a single primary action (projected via [actions]) on the right. The
// breadcrumb trail is pushed to the topbar (BreadcrumbService) rather than drawn
// here, so back/breadcrumb live in one place (the topbar) — no double chrome.
import { Component, effect, inject, input } from '@angular/core';
import { BreadcrumbService, type Crumb } from '../../core/breadcrumb.service';

@Component({
  selector: 'ui-page-header',
  template: `
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-heading-lg text-ink">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="mt-1 text-body text-muted">{{ subtitle() }}</p>
        }
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <ng-content select="[actions]" />
      </div>
    </div>
  `,
  host: { class: 'block' },
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  /** Trail for the topbar. Defaults to [Home › <title>] when omitted. */
  readonly breadcrumb = input<Crumb[] | null>(null);

  private readonly breadcrumbs = inject(BreadcrumbService);

  constructor() {
    effect(() => {
      const trail =
        this.breadcrumb() ??
        [{ label: 'Home', link: '/home' }, { label: this.title() }];
      this.breadcrumbs.set(trail);
    });
  }
}
