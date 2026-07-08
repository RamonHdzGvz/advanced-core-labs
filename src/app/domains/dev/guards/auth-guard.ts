import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const isAuthenticated = false; // temporal, replace with authentication check logic

  if (isAuthenticated) {
    return true;
  }

  return router.parseUrl('/login');
};