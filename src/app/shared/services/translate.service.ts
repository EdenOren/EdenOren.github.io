import { Service, Signal, computed, signal } from '@angular/core';
import { I18nSection } from '../enums/i18n-section.enum';

type TranslationMap = Record<string, Record<string, string>>;

@Service()
export class TranslateService {
  private readonly translations = signal<TranslationMap>({});

  async load(): Promise<void> {
    try {
      const response = await fetch('assets/i18n/en.json');
      const data = await response.json() as TranslationMap;
      this.translations.set(data);
    } catch {
      // silently fall back to key placeholders
    }
  }

  get(section: I18nSection, key: string): Signal<string> {
    return computed(() => this.translations()[section]?.[key] ?? `${section}.${key}`);
  }
}
