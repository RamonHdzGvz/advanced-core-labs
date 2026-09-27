import { Routes } from "@angular/router";

export default [
  {
    path: "",
    loadComponent: () => import("@templates/layouts/main-layout/main-layout").then((m) => m.MainLayout),
    children: [
      {
        path: "",
        loadComponent: () => import("@domains/dev/logo-page/logo-page").then((m) => m.LogoPage),
      },
      {
        path: "info",
        loadComponent: () => import("@domains/dev/testing-page/testing-page").then((m) => m.TestingPage),
      },
    ],
  },
] satisfies Routes;
