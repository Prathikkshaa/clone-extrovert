// ui-confirm-dialog — the modal rendered by ConfirmService (File 16 §7).
// WHY: one accessible confirm modal for the whole app. role=dialog + aria-modal,
// focus moves into the dialog on open and is trapped (Tab cycles), ESC cancels,
// the backdrop click cancels, and focus returns to the trigger on close. Mounted
// once in the shell.
import {
  Component,
  effect,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { Button } from '../button/button';
import { ConfirmService } from './confirm.service';

@Component({
  selector: 'ui-confirm-dialog',
  imports: [Button],
  template: `
    @if (pending(); as p) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-ink/40"
          aria-hidden="true"
          (click)="cancel()"
        ></div>
        <div
          #panel
          class="ui-dialog relative w-full max-w-md rounded-lg border border-line bg-surface p-6 shadow-xl"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="p.message ? bodyId : null"
          (keydown)="onKeydown($event)"
        >
          <h2 [id]="titleId" class="text-heading-sm text-ink">{{ p.title }}</h2>
          @if (p.message) {
            <p [id]="bodyId" class="mt-2 text-body text-muted">{{ p.message }}</p>
          }
          <div class="mt-6 flex justify-end gap-2">
            <button ui-button variant="ghost" (click)="cancel()">
              {{ p.cancelLabel }}
            </button>
            <button
              ui-button
              [variant]="p.danger ? 'danger' : 'primary'"
              (click)="confirm()"
            >
              {{ p.confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialog {
  private readonly service = inject(ConfirmService);
  protected readonly pending = this.service.pending;

  protected readonly titleId = 'confirm-title';
  protected readonly bodyId = 'confirm-body';

  private readonly panel =
    viewChild<ElementRef<HTMLElement>>('panel');
  private lastFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const open = this.pending();
      const panel = this.panel();
      if (open && panel) {
        this.lastFocused = document.activeElement as HTMLElement | null;
        queueMicrotask(() => this.focusables(panel.nativeElement)[0]?.focus());
      } else if (!open && this.lastFocused) {
        this.lastFocused.focus();
        this.lastFocused = null;
      }
    });
  }

  protected confirm(): void {
    this.service.settle(true);
  }
  protected cancel(): void {
    this.service.settle(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel();
      return;
    }
    if (event.key !== 'Tab') return;
    const panel = this.panel()?.nativeElement;
    if (!panel) return;
    const items = this.focusables(panel);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusables(root: HTMLElement): HTMLElement[] {
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute('disabled'));
  }
}
