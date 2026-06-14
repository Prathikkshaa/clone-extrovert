// ToastService — non-blocking notifications (File 16 §7).
// WHY: screens used inline ad-hoc status text that shifted layout and was easy to
// miss. This is the one place to raise transient success/info/warn/error
// messages; ui-toast-host (mounted once in the shell) renders them and they
// auto-dismiss. Errors persist a little longer and can be dismissed manually.
import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'info' | 'warn' | 'error';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private seq = 0;

  show(message: string, kind: ToastKind = 'info', durationMs?: number): number {
    const id = ++this.seq;
    this.toasts.update((list) => [...list, { id, kind, message }]);
    const ms = durationMs ?? (kind === 'error' ? 7000 : 4000);
    if (ms > 0) setTimeout(() => this.dismiss(id), ms);
    return id;
  }

  success(message: string, durationMs?: number): number {
    return this.show(message, 'success', durationMs);
  }
  info(message: string, durationMs?: number): number {
    return this.show(message, 'info', durationMs);
  }
  warn(message: string, durationMs?: number): number {
    return this.show(message, 'warn', durationMs);
  }
  error(message: string, durationMs?: number): number {
    return this.show(message, 'error', durationMs);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
