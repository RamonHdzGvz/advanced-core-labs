import { Routes } from "@angular/router";
import { authGuard } from "@domains/www/guards/auth-guard";

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
        path: "login",
        loadComponent: () =>
          import("@domains/www/pages/login-page/login-page").then((m) => m.LoginPage),
      },
      {
        path: "private",
        canActivate: [authGuard],
        loadComponent: () =>
          import("@domains/www/pages/private-page/private-page").then((m) => m.PrivatePage),
      },
      {
        path: '**',
        redirectTo: 'error',
      }
    ],
  },
] satisfies Routes;
