import { createAppRegistry, createAppRoutes } from "@core/routing/multi-app/multi-app.factory";
import { localhostGuard } from "@core/routing/multi-app/multi-app.guard";

export const registry = createAppRegistry({
  www: {
    subdomains: ["www"],
    loadRoutes: () => import("@domains/www/routes"),
    layout: () => import("@templates/layouts/main-layout/main-layout").then((m) => m.MainLayout),
  },
  dev: {
    subdomains: ["dev"],
    isDefault: true,
    loadRoutes: () => import("@domains/dev/routes"),
    guards: {
      canMatch: [localhostGuard],
    },
  },
});

export const routes = createAppRoutes(registry, window.location.hostname);
