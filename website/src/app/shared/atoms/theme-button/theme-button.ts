import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ThemeButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'contrast';
export type ThemeButtonSize = 'sm' | 'md' | 'lg' | 'icon';

@Component({
  selector: 'app-theme-button',
  standalone: true,
  templateUrl: './theme-button.html',
})
export class ThemeButtonComponent {
  @Input() variant: ThemeButtonVariant = 'primary';
  @Input() size: ThemeButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() ariaLabel: string | null = null;
  @Input() ariaPressed: boolean | null = null;
  @Output() pressed = new EventEmitter<MouseEvent>();

  protected get classes(): string {
    const variants: Record<ThemeButtonVariant, string> = {
      primary:
        'bg-primary text-on-primary shadow-sm hover:bg-primary-hover focus-visible:ring-focus-ring/30',
      secondary:
        'border border-outline bg-surface text-content shadow-sm hover:bg-surface-raised focus-visible:ring-focus-ring/30',
      ghost: 'text-primary hover:bg-surface-raised focus-visible:ring-focus-ring/30',
      danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-500/30',
      contrast:
        'bg-content text-canvas shadow-sm hover:opacity-85 focus-visible:ring-focus-ring/30',
    };
    const sizes: Record<ThemeButtonSize, string> = {
      sm: 'rounded-theme-sm px-3 py-1.5 text-xs',
      md: 'rounded-theme-md px-4 py-2.5 text-sm',
      lg: 'rounded-theme-lg px-5 py-3 text-base',
      icon: 'size-10 rounded-full p-0',
    };

    return `inline-flex items-center justify-center gap-2 font-semibold transition focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${variants[this.variant]} ${sizes[this.size]}`;
  }
}
