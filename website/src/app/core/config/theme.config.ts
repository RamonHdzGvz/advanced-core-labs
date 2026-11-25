export type ThemeMode = 'light' | 'dark';

export interface ThemePalette {
  readonly canvas: string;
  readonly surface: string;
  readonly surfaceRaised: string;
  readonly content: string;
  readonly contentMuted: string;
  readonly border: string;
  readonly primary: string;
  readonly primaryHover: string;
  readonly onPrimary: string;
  readonly focusRing: string;
}

export interface ThemeConfig {
  readonly defaultMode: ThemeMode;
  readonly storageKey: string;
  readonly colorScheme: Readonly<Record<ThemeMode, ThemePalette>>;
  readonly borderRadius: {
    readonly sm: string;
    readonly md: string;
    readonly lg: string;
  };
  readonly fontFamily: string;
  readonly baseFontSize: string;
}

export const THEME_CONFIG = {
  defaultMode: 'light',
  storageKey: 'boilerplate.theme',
  colorScheme: {
    light: {
      canvas: '#f8fafc',
      surface: '#ffffff',
      surfaceRaised: '#f1f5f9',
      content: '#0f172a',
      contentMuted: '#475569',
      border: '#e2e8f0',
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      onPrimary: '#ffffff',
      focusRing: '#818cf8',
    },
    dark: {
      canvas: '#020617',
      surface: '#0f172a',
      surfaceRaised: '#1e293b',
      content: '#f1f5f9',
      contentMuted: '#94a3b8',
      border: '#334155',
      primary: '#818cf8',
      primaryHover: '#a5b4fc',
      onPrimary: '#0f172a',
      focusRing: '#a5b4fc',
    },
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
  fontFamily: 'Inter, system-ui, sans-serif',
  baseFontSize: '16px',
} satisfies ThemeConfig;
