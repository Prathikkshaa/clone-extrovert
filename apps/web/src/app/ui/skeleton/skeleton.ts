// ui-skeleton — loading placeholder (File 16 §7: skeletons over spinners).
// WHY: loading blocks were ad-hoc "Loading…" text. This renders calm shimmer
// bars sized to the content that will replace them. Multi-line mode draws N bars
// with a shorter last line. Uses Tailwind's pulse, which the global
// reduced-motion rule freezes automatically.
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'ui-skeleton',
  template: `
    @if (lines() > 1) {
      <div class="space-y-2">
        @for (l of lineArray(); track $index) {
          <div
            class="animate-pulse rounded bg-line"
            [style.height.px]="height()"
            [style.width]="$last ? '60%' : '100%'"
          ></div>
        }
      </div>
    } @else {
      <div
        class="animate-pulse rounded bg-line"
        [style.height.px]="height()"
        [style.width]="width()"
      ></div>
    }
  `,
  host: { class: 'block' },
})
export class Skeleton {
  /** Number of shimmer lines. >1 draws a stacked block with a short last line. */
  readonly lines = input(1);
  /** Bar height in px. */
  readonly height = input(16);
  /** Bar width (CSS length) for single-line mode. */
  readonly width = input('100%');

  protected readonly lineArray = computed(() =>
    Array.from({ length: Math.max(1, this.lines()) }),
  );
}
