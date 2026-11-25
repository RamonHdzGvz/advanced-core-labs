import { Routes } from '@angular/router';
import { createAppRegistry, createAppRoutes } from '@core/routing/multi-app/multi-app.factory';

export const appRegistry = createAppRegistry({
  www: {
    subdomains: ['www'],
    isDefault: true,
    loadRoutes: () => import('@subdomains/www/router').then((module) => module.routes),
  },
});

export const routes: Routes = createAppRoutes(appRegistry, window.location.hostname);
