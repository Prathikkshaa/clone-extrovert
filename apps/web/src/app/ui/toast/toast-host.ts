// ui-toast-host — renders the ToastService queue (File 16 §7).
// WHY: a single, fixed, screen-reader-friendly region for transient messages.
// Mounted once in the app shell. Calm styling (surface card, hairline border,
// tone-coloured icon only — no loud full-colour banners), slide-in, manual
// dismiss; the global reduced-motion rule neutralises the animation.
import { Component, inject } from '@angular/core';
import { Icon } from '../icon/icon';
import type { IconName } from '../icon/icon-paths';
import { ToastService, type ToastKind } from './toast.service';

@Component({
  selector: 'ui-toast-host',
  imports: [Icon],
  template: `
    <div
      class="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
      aria-live="polite"
      aria-atomic="false"
    >
      @for (t of toasts(); track t.id) {
        <div
          class="ui-toast pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border border-line bg-surface p-3 shadow-lg"
          [attr.role]="t.kind === 'error' ? 'alert' : 'status'"
        >
          <span class="flex shrink-0 items-center" [class]="toneText(t.kind)">
            <ui-icon [name]="icon(t.kind)" [size]="18" />
          </span>
          <p class="flex-1 text-sm leading-snug text-ink">{{ t.message }}</p>
          <button
            type="button"
            class="flex shrink-0 items-center self-start rounded text-muted transition-colors duration-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            (click)="dismiss(t.id)"
            aria-label="Dismiss notification"
          >
            <ui-icon name="x" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastHost {
  private readonly service = inject(ToastService);
  protected readonly toasts = this.service.toasts;

  protected dismiss(id: number): void {
    this.service.dismiss(id);
  }

  protected icon(kind: ToastKind): IconName {
    switch (kind) {
      case 'success':
        return 'circle-check';
      case 'warn':
        return 'triangle-alert';
      case 'error':
        return 'circle-x';
      default:
        return 'info';
    }
  }

  protected toneText(kind: ToastKind): string {
    switch (kind) {
      case 'success':
        return 'text-positive';
      case 'warn':
        return 'text-warning';
      case 'error':
        return 'text-danger';
      default:
        return 'text-accent';
    }
  }
}
