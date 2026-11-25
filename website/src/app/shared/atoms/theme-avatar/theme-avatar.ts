import { Component, Input } from '@angular/core';

export type ThemeAvatarTone = 'primary' | 'rose' | 'amber' | 'neutral';

@Component({
  selector: 'app-theme-avatar',
  standalone: true,
  templateUrl: './theme-avatar.html',
})
export class ThemeAvatarComponent {
  @Input({ required: true }) initials = '';
  @Input() tone: ThemeAvatarTone = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() label = '';

  protected get classes(): string {
    const tones: Record<ThemeAvatarTone, string> = {
      primary: 'bg-primary/10 text-primary',
      rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200',
      amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200',
      neutral: 'bg-surface-raised text-content-muted',
    };
    const sizes: Record<'sm' | 'md' | 'lg', string> = {
      sm: 'size-8 text-[10px]',
      md: 'size-9 text-xs',
      lg: 'size-11 text-sm',
    };

    return `inline-flex shrink-0 items-center justify-center rounded-full font-bold ${tones[this.tone]} ${sizes[this.size]}`;
  }
}
