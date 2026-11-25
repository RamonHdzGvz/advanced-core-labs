import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home-page').then((module) => module.HomePage),
  },
  {
    path: 'error/:code',
    loadComponent: () =>
      import('@shared/layouts/error-layout/error-layout').then((module) => module.ErrorLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/error/error-page').then((module) => module.WwwErrorPage),
        data: {
          errorPage: {
            homeLabel: 'Volver al inicio',
            messages: {
              404: {
                title: 'No encontramos esa página',
                description: 'Revisa la dirección o vuelve a la página principal.',
              },
            },
          },
        },
      },
    ],
  },
  { path: '**', redirectTo: 'error/404' },
];
