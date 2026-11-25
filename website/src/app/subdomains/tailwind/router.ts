import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home-page').then((module) => module.TailwindHomePage),
  },
  {
    path: 'error/:code',
    loadComponent: () =>
      import('@shared/layouts/error-layout/error-layout').then((module) => module.ErrorLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/error/error-page').then((module) => module.TailwindErrorPage),
        data: {
          errorPage: {
            homeLabel: 'Volver a la galería',
            messages: {
              404: {
                title: 'Componente o página no encontrado',
                description: 'No existe contenido con esa dirección en la galería de Tailwind.',
              },
            },
          },
        },
      },
    ],
  },
  { path: '**', redirectTo: 'error/404' },
];
