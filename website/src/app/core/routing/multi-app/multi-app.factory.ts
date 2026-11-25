import { inject } from '@angular/core';
import type { Routes } from '@angular/router';
import { APP_REGISTRY_TOKEN } from './multi-app.token';
import type { AppRegistry, SubdomainConfig } from './multi-app.types';
import {
  extractSubdomain,
  getAppConfig,
  getBaseHostname,
  hasValidSubdomain,
  resolveAppType,
} from './multi-app.resolver';
import { validateRegistry } from './multi-app.validator';

export function createAppRegistry<T extends AppRegistry>(registry: T): T {
  validateRegistry(registry);
  return registry;
}

export function createAppRoutes(registry: AppRegistry, hostname: string): Routes {
  redirectUnknownSubdomainToDefault(registry, hostname);
  const config = getAppConfig(hostname, registry);

  return [
    {
      path: '',
      loadChildren: () =>
        config.loadRoutes().then((routes) => withConfiguredLayout(config, routes)),
      canActivate: config.guards?.canActivate ?? [],
      canMatch: config.guards?.canMatch ?? [],
    },
    { path: '**', redirectTo: '' },
  ];
}

function redirectUnknownSubdomainToDefault(registry: AppRegistry, hostname: string): void {
  const subdomain = extractSubdomain(hostname);
  if (!subdomain || hasValidSubdomain(hostname, registry) || typeof window === 'undefined') {
    return;
  }

  const defaultApp = Object.values(registry).find((app) => app.isDefault);
  const defaultSubdomain = defaultApp?.subdomains[0];
  if (!defaultSubdomain || window.location.hostname.toLowerCase() !== hostname.toLowerCase()) {
    return;
  }

  const targetUrl = new URL(window.location.href);
  targetUrl.hostname = `${defaultSubdomain}.${getBaseHostname(hostname)}`;
  targetUrl.search = '';
  targetUrl.hash = '';
  if (targetUrl.hostname !== window.location.hostname) {
    window.location.replace(targetUrl.toString());
  }
}

/** Wrap child routes with the layout registered for the current host, when one is configured. */
export function createSubdomainRoutes(children: Routes): Routes {
  const registry = inject(APP_REGISTRY_TOKEN);
  const config = registry[resolveAppType(window.location.hostname, registry)];
  return withConfiguredLayout(config, children);
}

function withConfiguredLayout(config: SubdomainConfig, children: Routes): Routes {
  if (!config.layout) {
    return children;
  }

  return [
    {
      path: '',
      loadComponent: config.layout,
      children,
    },
  ];
}
