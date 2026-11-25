import { Injectable, signal } from '@angular/core';

export type MessageTone = 'info' | 'success' | 'warning' | 'danger';

export interface MessageDialogOptions {
  title: string;
  message: string;
  tone?: MessageTone;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface ActiveMessageDialog extends Required<MessageDialogOptions> {
  id: number;
  kind: 'alert' | 'confirm';
}

interface QueuedMessageDialog {
  dialog: ActiveMessageDialog;
  resolve: (confirmed: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly activeDialog = signal<ActiveMessageDialog | null>(null);
  private readonly queue: QueuedMessageDialog[] = [];
  private activeResolve: ((confirmed: boolean) => void) | null = null;
  private nextId = 0;

  readonly current = this.activeDialog.asReadonly();

  alert(options: MessageDialogOptions): Promise<void> {
    return this.enqueue(options, 'alert').then(() => undefined);
  }

  confirm(options: MessageDialogOptions): Promise<boolean> {
    return this.enqueue(options, 'confirm');
  }

  close(confirmed: boolean): void {
    const dialog = this.activeDialog();
    if (!dialog) return;

    this.activeResolve?.(dialog.kind === 'confirm' && confirmed);
    this.activeResolve = null;
    this.activeDialog.set(null);
    setTimeout(() => this.presentNext(), 0);
  }

  private enqueue(
    options: MessageDialogOptions,
    kind: ActiveMessageDialog['kind'],
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this.queue.push({
        dialog: {
          id: ++this.nextId,
          kind,
          tone: options.tone ?? 'info',
          title: options.title,
          message: options.message,
          confirmLabel: options.confirmLabel ?? (kind === 'confirm' ? 'Confirmar' : 'Aceptar'),
          cancelLabel: options.cancelLabel ?? 'Cancelar',
        },
        resolve,
      });
      this.presentNext();
    });
  }

  private presentNext(): void {
    if (this.activeDialog() || this.queue.length === 0) return;
    const next = this.queue.shift();
    if (!next) return;

    this.activeResolve = next.resolve;
    this.activeDialog.set(next.dialog);
  }
}
