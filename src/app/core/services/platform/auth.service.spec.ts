import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AuthService, isTokenValid, parseToken } from './auth.service';
import { LocalStorageKeys } from '../../enums/core.enums';

function makeToken(exp: number): string {
  const payload = {
    exp, sub: 'u', iat: 0, aud: '', azp: '', email: '',
    email_verified: false, family_name: '', given_name: '',
    iss: '', jti: '', name: '', nbf: 0, picture: '',
  };
  const encoded = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `header.${encoded}.sig`;
}

describe('parseToken', () => {
  it('returns the decoded payload for a valid token', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const result = parseToken(makeToken(exp));
    expect(result).not.toBeNull();
    expect(result!.exp).toBe(exp);
  });

  it('returns null when the token has no dots', () => {
    expect(parseToken('nodots')).toBeNull();
  });

  it('returns null when the payload section is not valid JSON', () => {
    expect(parseToken(`h.${btoa('not-json')}.s`)).toBeNull();
  });
});

describe('isTokenValid', () => {
  it('returns false for null', () => {
    expect(isTokenValid(null)).toBe(false);
  });

  it('returns false for an expired token', () => {
    expect(isTokenValid(makeToken(Math.floor(Date.now() / 1000) - 1))).toBe(false);
  });

  it('returns true for a token that expires in the future', () => {
    expect(isTokenValid(makeToken(Math.floor(Date.now() / 1000) + 3600))).toBe(true);
  });

  it('returns false for a malformed string', () => {
    expect(isTokenValid('not.a.jwt')).toBe(false);
  });
});

describe('AuthService', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => store[key] ?? null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = String(value); });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(key => { delete store[key]; });
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), AuthService],
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it('starts unauthenticated when no token is stored', () => {
    expect(TestBed.inject(AuthService).isAuthenticated()).toBe(false);
  });

  it('starts authenticated when a valid token is already stored', () => {
    store[LocalStorageKeys.AdminToken] = makeToken(Math.floor(Date.now() / 1000) + 3600);
    expect(TestBed.inject(AuthService).isAuthenticated()).toBe(true);
  });

  it('removes an expired stored token on init and starts unauthenticated', () => {
    store[LocalStorageKeys.AdminToken] = makeToken(Math.floor(Date.now() / 1000) - 1);
    const service = TestBed.inject(AuthService);
    expect(service.isAuthenticated()).toBe(false);
    expect(store[LocalStorageKeys.AdminToken]).toBeUndefined();
  });

  it('login() persists the token and flips isAuthenticated to true', () => {
    const service = TestBed.inject(AuthService);
    const token = makeToken(Math.floor(Date.now() / 1000) + 3600);
    service.login(token);
    expect(store[LocalStorageKeys.AdminToken]).toBe(token);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('logout() removes the stored token and flips isAuthenticated to false', () => {
    store[LocalStorageKeys.AdminToken] = makeToken(Math.floor(Date.now() / 1000) + 3600);
    const service = TestBed.inject(AuthService);
    service.logout();
    expect(store[LocalStorageKeys.AdminToken]).toBeUndefined();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('getValidToken() returns the token when it is valid', () => {
    const token = makeToken(Math.floor(Date.now() / 1000) + 3600);
    store[LocalStorageKeys.AdminToken] = token;
    expect(TestBed.inject(AuthService).getValidToken()).toBe(token);
  });

  it('getValidToken() returns null when no token is stored', () => {
    expect(TestBed.inject(AuthService).getValidToken()).toBeNull();
  });

  it('getValidToken() returns null for an expired token', () => {
    store[LocalStorageKeys.AdminToken] = makeToken(Math.floor(Date.now() / 1000) - 1);
    expect(TestBed.inject(AuthService).getValidToken()).toBeNull();
  });
});
