import { Component, Input } from '@angular/core';

export type ThemeFieldControl = 'input' | 'select' | 'textarea' | 'checkbox';
export type ThemeFieldState = 'default' | 'error' | 'disabled';

@Component({
  selector: 'app-theme-field',
  standalone: true,
  templateUrl: './theme-field.html',
})
export class ThemeFieldComponent {
  @Input({ required: true }) inputId = '';
  @Input({ required: true }) label = '';
  @Input() control: ThemeFieldControl = 'input';
  @Input()
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'date' | 'search' = 'text';
  @Input() state: ThemeFieldState = 'default';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() helperText = '';
  @Input() errorText = '';
  @Input() checked = false;
  @Input() options: readonly string[] = [];

  protected get controlClasses(): string {
    const stateClasses: Record<ThemeFieldState, string> = {
      default:
        'border-outline bg-surface text-content placeholder:text-content-muted focus:border-primary focus:ring-focus-ring/20',
      error:
        'border-rose-400 bg-surface text-content placeholder:text-content-muted focus:border-rose-500 focus:ring-rose-500/20',
      disabled: 'cursor-not-allowed border-outline bg-surface-raised text-content-muted',
    };

    return `block w-full rounded-theme-md border px-3.5 py-2.5 text-sm shadow-sm outline-none focus:ring-4 ${stateClasses[this.state]}`;
  }
}
