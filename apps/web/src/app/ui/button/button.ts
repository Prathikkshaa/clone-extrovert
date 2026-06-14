// ui-button — the one button primitive (File 16 §7).
// WHY: every screen used bespoke button markup with drifting padding/colour. This
// is the single source: variants (primary teal / secondary / ghost / danger),
// sizes, a loading spinner that also disables, and optional leading/trailing
// icons. Attribute selector on a real <button> so native type/form/click and
// keyboard focus all work; `disabled` is an input we reflect to the DOM so
// loading also disables. Primary = the one teal accent action per region.
import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { Icon } from '../icon/icon';
import type { IconName } from '../icon/icon-paths';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

@Component({
  selector: 'button[ui-button]',
  imports: [Icon],
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (loading()) {
      <ui-icon name="loader" [size]="iconSize()" class="animate-spin" />
    } @else if (iconLeft()) {
      <ui-icon [name]="iconLeft()!" [size]="iconSize()" />
    }
    <span class="ui-button__label"><ng-content /></span>
    @if (iconRight() && !loading()) {
      <ui-icon [name]="iconRight()!" [size]="iconSize()" />
    }
  `,
  host: {
    '[class]': 'classes()',
    '[disabled]': 'disabledAttr()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('secondary');
  readonly size = input<ButtonSize>('md');
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly iconLeft = input<IconName | null>(null);
  readonly iconRight = input<IconName | null>(null);

  protected readonly iconSize = computed(() => (this.size() === 'sm' ? 16 : 18));
  protected readonly disabledAttr = computed(() =>
    this.disabled() || this.loading() ? true : null,
  );

  private static readonly BASE =
    'inline-flex items-center justify-center gap-2 rounded-md font-medium ' +
    'transition-all duration-200 select-none ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-canvas active:scale-[.98] ' +
    'disabled:opacity-50 disabled:pointer-events-none';

  private static readonly SIZES: Record<ButtonSize, string> = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-heading-sm px-4 py-2.5',
  };

  private static readonly VARIANTS: Record<ButtonVariant, string> = {
    primary:
      'bg-accent text-white hover:bg-accent-strong focus-visible:ring-accent',
    secondary:
      'border border-line bg-surface text-ink hover:bg-canvas focus-visible:ring-accent',
    ghost: 'text-ink hover:bg-surface focus-visible:ring-accent',
    danger:
      'bg-danger text-white hover:opacity-90 focus-visible:ring-danger',
  };

  protected readonly classes = computed(
    () =>
      `${Button.BASE} ${Button.SIZES[this.size()]} ${Button.VARIANTS[this.variant()]}`,
  );
}
