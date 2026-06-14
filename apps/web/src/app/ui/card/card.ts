// ui-card — raised surface container (File 16 §7).
// WHY: one consistent card (surface bg, hairline border, lg radius, padding) so
// every panel matches. Optional `title` renders a header row; a [header] slot
// allows custom header content (e.g. a title + action). Body is projected.
import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  template: `
    @if (title()) {
      <div class="mb-4 flex items-center justify-between gap-3">
        <h2 class="text-heading-sm text-ink">{{ title() }}</h2>
        <ng-content select="[header]" />
      </div>
    }
    <ng-content />
  `,
  host: {
    class: 'block rounded-lg border border-line bg-surface p-6',
  },
})
export class Card {
  /** Optional heading shown at the top of the card (with an optional [header] slot). */
  readonly title = input<string | null>(null);
}
