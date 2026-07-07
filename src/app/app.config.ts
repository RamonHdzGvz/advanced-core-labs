import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from "@angular/core";
import { createPrimeTheme } from "./theme/theme.factory";
import { providePrimeNG } from "primeng/config";
import { provideRouter } from "@angular/router";
import { registry, routes } from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";
import { MessageService } from "primeng/api";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideAppRegistry } from "@core/routing/multi-app/multi-app.provider";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppRegistry(registry),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({ theme: { preset: createPrimeTheme(), options: { darkModeSelector: '.app-dark' } } }),
    provideAnimations(),
    MessageService,
    provideAnimationsAsync(),
  ],
};
