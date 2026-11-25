import { Component, Input } from '@angular/core';
import { ThemeCardComponent } from '@shared/molecules/theme-card/theme-card';

export type ThemeStatTrend = 'positive' | 'negative' | 'neutral';

@Component({
  selector: 'app-theme-stat-card',
  standalone: true,
  imports: [ThemeCardComponent],
  templateUrl: './theme-stat-card.html',
})
export class ThemeStatCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value = '';
  @Input() change = '';
  @Input() hint = '';
  @Input() trend: ThemeStatTrend = 'neutral';

  protected get trendClasses(): string {
    const classes: Record<ThemeStatTrend, string> = {
      positive: 'text-emerald-700 dark:text-emerald-300',
      negative: 'text-rose-700 dark:text-rose-300',
      neutral: 'text-content-muted',
    };
    return classes[this.trend];
  }
}
