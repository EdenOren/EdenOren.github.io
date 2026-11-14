import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/platform/auth.service';

export const signedOutGuard: CanMatchFn = (): boolean => !inject(AuthService).isAuthenticated();
