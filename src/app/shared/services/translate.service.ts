import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';

type TranslationMap = Record<string, Record<string, string>>;

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly http = inject(HttpClient);
  private readonly translations = signal<TranslationMap>({});

  load(): Promise<void> {
    return new Promise(resolve => {
      this.http.get<TranslationMap>('assets/i18n/en.json').subscribe({
        next: data => { this.translations.set(data); resolve(); },
        error: () => resolve(),
      });
    });
  }

  t(section: string, key: string): Signal<string> {
    return computed(() => this.translations()[section]?.[key] ?? `${section}.${key}`);
  }
}
