import { Service, Signal, WritableSignal, computed, signal } from '@angular/core';
import { MS_PER_SECOND } from '../../constants/core.constants';
import { LocalStorageKeys } from '../../enums/core.enums';
import { GoogleIdTokenPayload } from '../../models/core.models';

export function parseToken(token: string): GoogleIdTokenPayload | null {
  try {
    const base64: string = token.split('.')[1]
                            .replace(/-/g, '+')
                            .replace(/_/g, '/');
    return JSON.parse(atob(base64)) as GoogleIdTokenPayload;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) {
    return false;
  }
  const payload = parseToken(token);
  return payload !== null && payload.exp * MS_PER_SECOND > Date.now();
}

@Service()
export class AuthService {
  private readonly _authenticated: WritableSignal<boolean> = signal(
    AuthService.checkStoredToken()
  );

  private static checkStoredToken(): boolean {
    const token: string | null = localStorage.getItem(LocalStorageKeys.AdminToken);
    if (isTokenValid(token)) {
      return true;
    }
    if (token) {
      localStorage.removeItem(LocalStorageKeys.AdminToken);
    }
    return false;
  }

  readonly isAuthenticated: Signal<boolean> = computed(() => this._authenticated());

  getValidToken(): string | null {
    const token = localStorage.getItem(LocalStorageKeys.AdminToken);
    return isTokenValid(token) ? token : null;
  }

  login(token: string): void {
    localStorage.setItem(LocalStorageKeys.AdminToken, token);
    this._authenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem(LocalStorageKeys.AdminToken);
    this._authenticated.set(false);
  }
}
