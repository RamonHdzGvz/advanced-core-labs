import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home-page').then((module) => module.FormsHomePage),
  },
  {
    path: 'error/:code',
    loadComponent: () =>
      import('@shared/layouts/error-layout/error-layout').then((module) => module.ErrorLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/error/error-page').then((module) => module.FormsErrorPage),
        data: {
          errorPage: {
            homeLabel: 'Volver a formularios',
            messages: {
              404: {
                title: 'No encontramos ese formulario',
                description: 'Revisa la dirección o vuelve a la galería de formularios.',
              },
            },
          },
        },
      },
    ],
  },
  { path: '**', redirectTo: 'error/404' },
];
