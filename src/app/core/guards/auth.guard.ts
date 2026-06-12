import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/platform/auth.service';

export const authGuard: CanActivateFn = (): true | UrlTree => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }
  return router.parseUrl('/');
};
