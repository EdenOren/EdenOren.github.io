import { Service, Signal, WritableSignal, computed, signal } from '@angular/core';

const ADMIN_TOKEN_KEY = 'eo:admin:token';

export function isTokenValid(token: string | null): boolean {
  if (!token) {
    return false;
  }
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64)) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

@Service()
export class AuthService {
  private readonly _authenticated: WritableSignal<boolean> = signal(
    AuthService.checkStoredToken()
  );

  private static checkStoredToken(): boolean {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (isTokenValid(token)) {
      return true;
    }
    if (token) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
    return false;
  }
  readonly isAuthenticated: Signal<boolean> = computed(() => this._authenticated());

  login(credential: string): void {
    localStorage.setItem(ADMIN_TOKEN_KEY, credential);
    this._authenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    this._authenticated.set(false);
  }
}
