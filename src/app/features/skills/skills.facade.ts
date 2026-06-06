import { Service, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SKILLS_SECTION_NUMBER } from './skills.constants';
import { SkillGroupKey } from './skills.enums';

export interface SkillGroup {
  id: SkillGroupKey;
  labelKey: SkillGroupKey;
  skills: string[];
}

@Service({ autoProvided: false })
export class SkillsFacade {
  private readonly translateService: TranslateService = inject(TranslateService);

  private readonly _loading: WritableSignal<boolean> = signal(true);
  readonly isLoading: Signal<boolean> = computed(() => this._loading());

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('SKILLS') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  readonly SECTION_NUMBER: string = SKILLS_SECTION_NUMBER;

  readonly GROUPS: SkillGroup[] = [
    {
      id: SkillGroupKey.Frontend,
      labelKey: SkillGroupKey.Frontend,
      skills: ['Angular', 'TypeScript', 'RxJS', 'Signals', 'HTML', 'CSS / SCSS', 'Animations', 'A11y'],
    },
    {
      id: SkillGroupKey.Tools,
      labelKey: SkillGroupKey.Tools,
      skills: ['Git', 'GitHub Actions', 'Vite', 'Node.js', 'Figma', 'Storybook', 'Jest', 'Playwright'],
    },
    {
      id: SkillGroupKey.Other,
      labelKey: SkillGroupKey.Other,
      skills: ['REST APIs', 'GraphQL', 'Design Systems', 'Web Perf', 'SEO', 'i18n'],
    },
  ];

  constructor() {
    // Simulates realistic async latency for static in-memory data
    setTimeout(() => this._loading.set(false), 600);
  }
}
