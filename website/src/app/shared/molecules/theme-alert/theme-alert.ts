import { Component, Input } from '@angular/core';
import { ThemeBadgeTone } from '@shared/atoms/theme-badge/theme-badge';

export type ThemeAlertTone = Extract<ThemeBadgeTone, 'info' | 'success' | 'warning' | 'danger'>;

@Component({
  selector: 'app-theme-alert',
  standalone: true,
  templateUrl: './theme-alert.html',
})
export class ThemeAlertComponent {
  @Input() tone: ThemeAlertTone = 'info';
  @Input({ required: true }) title = '';
  @Input({ required: true }) message = '';
  @Input() actionLabel = '';
  @Input() actionHref = '';

  protected get classes(): string {
    const tones: Record<ThemeAlertTone, string> = {
      info: 'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100',
      success:
        'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100',
      warning:
        'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100',
      danger:
        'border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-100',
    };

    return `flex gap-3 rounded-theme-lg border p-4 ${tones[this.tone]}`;
  }

  protected get role(): 'status' | 'alert' {
    return this.tone === 'danger' ? 'alert' : 'status';
  }
}
