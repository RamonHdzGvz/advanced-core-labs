import { Component, inject } from '@angular/core';
import { ThemeButtonComponent } from '@shared/atoms/theme-button/theme-button';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [ThemeButtonComponent],
  templateUrl: './theme-toggle.html',
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly isDark = this.themeService.isDark;

  protected toggle(): void {
    this.themeService.toggle();
  }
}
