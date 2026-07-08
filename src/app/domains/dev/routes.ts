import { Routes } from "@angular/router";

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
        path: "**",
        redirectTo: "error",
      }
    ],
  },
] satisfies Routes;
