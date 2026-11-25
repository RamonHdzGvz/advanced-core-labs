import type { Routes } from '@angular/router';
import { authenticatedGuard } from '@core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('@subdomains/secured/pages/home/home-page').then((module) => module.SecuredHomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('@subdomains/secured/pages/login/login-page').then((module) => module.LoginPage),
  },
  {
    path: 'profile',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('@subdomains/secured/pages/profile/profile-page').then(
        (module) => module.SecuredProfilePage,
      ),
  },
  {
    path: 'error/:code',
    loadComponent: () =>
      import('@shared/layouts/error-layout/error-layout').then((module) => module.ErrorLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/error/error-page').then((module) => module.SecuredErrorPage),
        data: {
          errorPage: {
            homeLabel: 'Volver a Home',
            messages: {
              401: {
                title: 'Inicia sesión para continuar',
                description: 'Tu sesión terminó o necesitas autenticarte para acceder.',
                actionLabel: 'Iniciar sesión',
                actionUrl: '/login',
              },
              403: {
                title: 'No tienes acceso a esta sección',
                description: 'Inicia sesión con una cuenta que tenga los permisos necesarios.',
              },
              404: {
                title: 'Ruta segura no encontrada',
                description: 'La página que buscas no está disponible en esta sección.',
              },
            },
          },
        },
      },
    ],
  },
  { path: '**', redirectTo: 'error/404' },
];
