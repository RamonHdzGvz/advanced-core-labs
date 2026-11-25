import { Injectable, signal } from '@angular/core';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastMessage {
  id: number;
  tone: ToastTone;
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastList = signal<readonly ToastMessage[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  readonly toasts = this.toastList.asReadonly();

  show(tone: ToastTone, title: string, message: string, durationMs = 5000): number {
    const id = ++this.nextId;
    this.toastList.update((items) => [...items, { id, tone, title, message }]);

    if (durationMs > 0) {
      this.timers.set(
        id,
        setTimeout(() => this.dismiss(id), durationMs),
      );
    }

    return id;
  }

  info(message: string, title = 'Información', durationMs = 5000): number {
    return this.show('info', title, message, durationMs);
  }

  success(message: string, title = 'Listo', durationMs = 5000): number {
    return this.show('success', title, message, durationMs);
  }

  warning(message: string, title = 'Atención', durationMs = 6000): number {
    return this.show('warning', title, message, durationMs);
  }

  danger(message: string, title = 'Ocurrió un error', durationMs = 7000): number {
    return this.show('danger', title, message, durationMs);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) clearTimeout(timer);
    this.timers.delete(id);
    this.toastList.update((items) => items.filter((toast) => toast.id !== id));
  }
}
