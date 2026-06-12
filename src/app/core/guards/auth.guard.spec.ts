import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/platform/auth.service';

describe('authGuard', () => {
  const isAuthenticated = signal(false);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AuthService, useValue: { isAuthenticated } },
      ],
    });
  });

  function runGuard(): true | UrlTree {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ) as true | UrlTree;
  }

  it('returns true when the user is authenticated', () => {
    isAuthenticated.set(true);
    expect(runGuard()).toBe(true);
  });

  it('returns a UrlTree redirecting to "/" when the user is not authenticated', () => {
    isAuthenticated.set(false);
    const result = runGuard();
    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/');
  });
});
