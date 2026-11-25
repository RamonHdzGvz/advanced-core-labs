import { InjectionToken } from '@angular/core';

export interface AppConfig {
  readonly auth: {
    readonly inactivityTimeoutMs: number;
    readonly lastActivityStorageKey: string;
  };
}

export const appConfig = {
  auth: {
    inactivityTimeoutMs: 60_000,
    lastActivityStorageKey: 'boilerplate.auth.last-activity-at',
  },
} satisfies AppConfig;

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => appConfig,
});
