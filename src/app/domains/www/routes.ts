import { Routes } from "@angular/router";

export default [
  {
    path: "",
    loadComponent: () => import("@templates/layouts/acl-main-layout/acl-main-layout").then((m) => m.ACLMainLayout),
    children: [
      {
        path: "",
        pathMatch: "full",
        loadComponent: () => import("@domains/www/home-page/home-page").then((m) => m.HomePage),
      },
      {
        path: "soluciones",
        loadComponent: () => import("@domains/www/solutions-page/solutions-page").then((m) => m.SolutionsPage),
      },
    ],
  },
] satisfies Routes;
