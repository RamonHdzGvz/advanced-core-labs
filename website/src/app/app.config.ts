import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRegistry, routes } from './app.routes';
import { provideAppRegistry } from './core/routing/multi-app/multi-app.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppRegistry(appRegistry),
    provideRouter(routes),
  ],
};
