import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LocalStorageKeys } from '../enums/core.enums';

export const authGuard: CanActivateFn = (): true | UrlTree => {
  const router: Router = inject(Router);
  const token: string | null = localStorage.getItem(LocalStorageKeys.AdminToken);
  if (token) {
    return true;
  }
  return router.parseUrl('/');
};
