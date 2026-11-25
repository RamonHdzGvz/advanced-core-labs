import { computed, Injectable, signal } from '@angular/core';
import { THEME_CONFIG, ThemeMode } from '@core/config/theme.config';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly currentMode = signal<ThemeMode>(THEME_CONFIG.defaultMode);

  readonly mode = this.currentMode.asReadonly();
  readonly isDark = computed(() => this.currentMode() === 'dark');

  initialize(): void {
    let mode: ThemeMode = THEME_CONFIG.defaultMode;

    try {
      const savedMode = localStorage.getItem(THEME_CONFIG.storageKey);
      if (savedMode === 'light' || savedMode === 'dark') {
        mode = savedMode;
      }
    } catch {
      // The theme still works for this page view when browser storage is unavailable.
    }

    this.setTheme(mode, false);
  }

  setTheme(mode: ThemeMode, persist = true): void {
    this.currentMode.set(mode);
    this.applyTheme(mode);

    if (persist) {
      try {
        localStorage.setItem(THEME_CONFIG.storageKey, mode);
      } catch {
        // Applying the theme does not depend on browser storage.
      }
    }
  }

  toggle(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  private applyTheme(mode: ThemeMode): void {
    const root = document.documentElement;
    const palette = THEME_CONFIG.colorScheme[mode];

    root.classList.toggle('dark', mode === 'dark');
    root.dataset['theme'] = mode;

    for (const [token, value] of Object.entries(palette)) {
      root.style.setProperty(`--app-${this.toKebabCase(token)}`, value);
    }

    for (const [token, value] of Object.entries(THEME_CONFIG.borderRadius)) {
      root.style.setProperty(`--app-radius-${token}`, value);
    }

    root.style.setProperty('--app-font-family', THEME_CONFIG.fontFamily);
    root.style.setProperty('--app-base-font-size', THEME_CONFIG.baseFontSize);
  }

  private toKebabCase(value: string): string {
    return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }
}
