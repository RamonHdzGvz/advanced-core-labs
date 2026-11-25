import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-theme-progress',
  standalone: true,
  templateUrl: './theme-progress.html',
})
export class ThemeProgressComponent {
  @Input() value = 0;
  @Input() label = '';
  @Input() supportingText = '';

  protected get normalizedValue(): number {
    return Math.max(0, Math.min(100, this.value));
  }
}
