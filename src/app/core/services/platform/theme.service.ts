import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Service, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { LocalStorageKeys, Theme } from '../../enums/core.enums';

@Service()
export class ThemeService {
  private readonly document: Document = inject(DOCUMENT);
  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme: WritableSignal<Theme> = signal<Theme>(Theme.Dark);
  readonly isDark: Signal<boolean> = computed(() => this.theme() === Theme.Dark);

  private applyTheme(theme: Theme): void {
    this.theme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  init(): void {
    if (!this.isBrowser) {
      return;
    }
    const stored: Theme | null = localStorage.getItem(LocalStorageKeys.Theme) as Theme | null;
    const prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved: Theme = stored ?? (prefersDark ? Theme.Dark : Theme.Light);
    this.applyTheme(resolved);
  }

  toggle(): void {
    const next: Theme = this.theme() === Theme.Dark ? Theme.Light : Theme.Dark;
    this.applyTheme(next);
    localStorage.setItem(LocalStorageKeys.Theme, next);
  }
}
