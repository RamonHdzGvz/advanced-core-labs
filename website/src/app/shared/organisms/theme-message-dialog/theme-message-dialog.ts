import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { ThemeButtonComponent } from '@shared/atoms/theme-button/theme-button';
import { MessageService } from '@core/services/message.service';

@Component({
  selector: 'app-theme-message-dialog',
  standalone: true,
  imports: [ThemeButtonComponent],
  templateUrl: './theme-message-dialog.html',
})
export class ThemeMessageDialogComponent {
  protected readonly messageService = inject(MessageService);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const message = this.messageService.current();
      const element = this.dialog()?.nativeElement;
      if (!element) return;

      if (message && !element.open) element.showModal();
      else if (!message && element.open) element.close();
    });
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    if (this.messageService.current()?.kind === 'confirm') return;
    this.messageService.close(false);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && this.messageService.current()?.kind !== 'confirm') {
      this.messageService.close(false);
    }
  }
}
