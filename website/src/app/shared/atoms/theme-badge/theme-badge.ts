import { Component, Input } from '@angular/core';

export type ThemeBadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-theme-badge',
  standalone: true,
  templateUrl: './theme-badge.html',
})
export class ThemeBadgeComponent {
  @Input() tone: ThemeBadgeTone = 'neutral';
  @Input() outlined = false;

  protected get classes(): string {
    const tones: Record<ThemeBadgeTone, { solid: string; outline: string }> = {
      neutral: {
        solid: 'bg-surface-raised text-content-muted',
        outline: 'border-outline text-content-muted',
      },
      brand: {
        solid: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-200',
        outline: 'border-indigo-300 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300',
      },
      success: {
        solid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200',
        outline:
          'border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300',
      },
      warning: {
        solid: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200',
        outline: 'border-amber-300 text-amber-800 dark:border-amber-800 dark:text-amber-300',
      },
      danger: {
        solid: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200',
        outline: 'border-rose-300 text-rose-700 dark:border-rose-800 dark:text-rose-300',
      },
      info: {
        solid: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200',
        outline: 'border-sky-300 text-sky-700 dark:border-sky-800 dark:text-sky-300',
      },
    };

    return `inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${this.outlined ? tones[this.tone].outline : `border-transparent ${tones[this.tone].solid}`}`;
  }
}
