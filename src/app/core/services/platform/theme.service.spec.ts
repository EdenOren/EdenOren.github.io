import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ThemeService } from './theme.service';
import { LocalStorageKeys, Theme } from '../../enums/core.enums';

describe('ThemeService', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => store[key] ?? null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = String(value); });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ThemeService],
    });
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  describe('init()', () => {
    it('applies the stored theme when one is persisted', () => {
      store[LocalStorageKeys.Theme] = Theme.Light;
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.theme()).toBe(Theme.Light);
      expect(document.documentElement.getAttribute('data-theme')).toBe(Theme.Light);
    });

    it('resolves to dark when there is no stored value and the system prefers dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({ matches: true }),
      });
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.theme()).toBe(Theme.Dark);
      expect(document.documentElement.getAttribute('data-theme')).toBe(Theme.Dark);
    });

    it('resolves to light when there is no stored value and the system prefers light', () => {
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.theme()).toBe(Theme.Light);
      expect(document.documentElement.getAttribute('data-theme')).toBe(Theme.Light);
    });
  });

  describe('toggle()', () => {
    it('switches from dark to light and persists the choice', () => {
      store[LocalStorageKeys.Theme] = Theme.Dark;
      const service = TestBed.inject(ThemeService);
      service.init();
      service.toggle();
      expect(service.theme()).toBe(Theme.Light);
      expect(store[LocalStorageKeys.Theme]).toBe(Theme.Light);
      expect(document.documentElement.getAttribute('data-theme')).toBe(Theme.Light);
    });

    it('switches from light to dark and persists the choice', () => {
      store[LocalStorageKeys.Theme] = Theme.Light;
      const service = TestBed.inject(ThemeService);
      service.init();
      service.toggle();
      expect(service.theme()).toBe(Theme.Dark);
      expect(store[LocalStorageKeys.Theme]).toBe(Theme.Dark);
    });
  });

  it('isDark reflects the current theme signal', () => {
    const service = TestBed.inject(ThemeService);
    service.theme.set(Theme.Dark);
    expect(service.isDark()).toBe(true);
    service.theme.set(Theme.Light);
    expect(service.isDark()).toBe(false);
  });
});
