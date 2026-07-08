import { Routes } from "@angular/router";
import { authGuard } from "@domains/dev/guards/auth-guard";

export default [
  {
    path: "",
    loadComponent: () => import("@templates/layouts/main-layout/main-layout").then((m) => m.MainLayout),
    children: [
      {
        path: "",
        loadComponent: () => import("@domains/dev/testing-page/testing-page").then((m) => m.TestingPage),
      },
      {
        path: "error",
        loadComponent: () => import("@domains/dev/pages/error-page/error-page").then((m) => m.ErrorPage),
      },
      {
        path: "login",
        loadComponent: () =>
          import("@domains/dev/pages/login-page/login-page").then((m) => m.LoginPage),
      },
      {
        path: "private",
        canActivate: [authGuard],
        loadComponent: () =>
          import("@domains/dev/pages/private-page/private-page").then((m) => m.PrivatePage),
      },
      {
        path: "**",
        redirectTo: "error",
      }
    ],
  },
] satisfies Routes;
