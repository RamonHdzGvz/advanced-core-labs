import type { Type } from '@angular/core';
import type { CanActivateFn, CanMatchFn, Routes } from '@angular/router';

export type AppRegistry = Record<string, SubdomainConfig>;

export interface SubdomainConfig {
  /** Host labels assigned to this miniapp, such as `www` or `admin`. */
  subdomains: readonly string[];
  loadRoutes: () => Promise<Routes>;
  guards?: {
    canActivate?: CanActivateFn[];
    canMatch?: CanMatchFn[];
  };
  layout?: () => Promise<Type<unknown>>;
  isDefault?: boolean;
}
