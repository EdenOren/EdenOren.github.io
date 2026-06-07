import { Service, Signal, WritableSignal, computed, signal } from '@angular/core';

const ADMIN_TOKEN_KEY = 'eo:admin:token';

@Service()
export class AuthService {
  private readonly _authenticated: WritableSignal<boolean> = signal(
    !!localStorage.getItem(ADMIN_TOKEN_KEY)
  );
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
