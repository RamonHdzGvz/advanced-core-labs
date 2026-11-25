import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-theme-card',
  standalone: true,
  templateUrl: './theme-card.html',
})
export class ThemeCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() padding: 'sm' | 'md' = 'md';

  protected get classes(): string {
    const padding = this.padding === 'sm' ? 'p-5' : 'p-6';
    return `block rounded-theme-lg border border-outline bg-surface text-content shadow-sm ${padding}`;
  }
}
