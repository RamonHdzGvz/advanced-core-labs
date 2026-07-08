import { Routes } from "@angular/router";

export default [
  {
    path: "",
    loadComponent: () => import("@templates/layouts/main-layout/main-layout").then((m) => m.MainLayout),
    children: [
      {
        path: "",
        loadComponent: () => import("@domains/www/home-page/home-page").then((m) => m.HomePage),
      },
      {
        path: "error",
        loadComponent: () => import("@domains/www/pages/error-page/error-page").then((m) => m.ErrorPage),
      },
      {
        path: '**',
        redirectTo: 'error',
      }
    ],
  },
] satisfies Routes;
