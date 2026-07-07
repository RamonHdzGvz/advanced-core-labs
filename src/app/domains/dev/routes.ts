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
        path: "demo",
        loadComponent: () => import("@domains/dev/demo-page/demo-page").then((m) => m.DemoPage),
      },
    ],
  },
] satisfies Routes;
