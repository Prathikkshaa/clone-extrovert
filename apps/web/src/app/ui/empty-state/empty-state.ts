// ui-empty-state — "nothing here yet, do this next" (File 16 §7).
// WHY: empty states must teach the next action (master-context §7), not just say
// "no data". One icon + headline + one teaching line + a projected CTA, centred
// in a calm card-less block. Used everywhere a list/screen has no data yet.
import { Component, input } from '@angular/core';
import { Icon } from '../icon/icon';
import type { IconName } from '../icon/icon-paths';

@Component({
  selector: 'ui-empty-state',
  imports: [Icon],
  template: `
    <div
      class="mx-auto flex w-full max-w-sm flex-col items-center px-4 py-10 text-center sm:px-6 sm:py-12"
    >
      <div
        class="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
      >
        <ui-icon [name]="icon()" [size]="24" />
      </div>
      <h3 class="text-balance text-heading-sm text-ink">{{ title() }}</h3>
      @if (message()) {
        <p class="mt-1.5 text-pretty text-body text-muted">{{ message() }}</p>
      }
      <!-- Actions collapse entirely (no dead space) when no CTA is projected. -->
      <div
        class="mt-5 flex flex-wrap items-center justify-center gap-2 empty:mt-0 empty:hidden"
      >
        <ng-content />
      </div>
    </div>
  `,
  host: { class: 'block' },
})
export class EmptyState {
  readonly icon = input<IconName>('inbox');
  readonly title = input.required<string>();
  readonly message = input<string | null>(null);
}
