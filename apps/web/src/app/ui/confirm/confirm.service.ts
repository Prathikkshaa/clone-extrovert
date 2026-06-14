// ConfirmService — accessible confirm prompts for destructive actions (File 16 §7).
// WHY: irreversible actions (delete drafts, disconnect mailbox, stop a campaign)
// must not fire on a stray click. Call `ask(...)` to get a Promise<boolean>;
// ui-confirm-dialog (mounted once in the shell) renders the modal and resolves
// it. One queued prompt at a time is enough for this app.
import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Style the confirm button as destructive (red). */
  danger?: boolean;
}

interface PendingConfirm extends Required<Omit<ConfirmOptions, 'message'>> {
  message?: string;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly pending = signal<PendingConfirm | null>(null);

  ask(options: ConfirmOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.pending.set({
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel ?? 'Confirm',
        cancelLabel: options.cancelLabel ?? 'Cancel',
        danger: options.danger ?? false,
        resolve,
      });
    });
  }

  /** Resolve the open prompt (true=confirm, false=cancel) and close it. */
  settle(value: boolean): void {
    const p = this.pending();
    if (!p) return;
    this.pending.set(null);
    p.resolve(value);
  }
}
