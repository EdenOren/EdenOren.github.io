import { Injectable, inject } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';
import { SKILLS_SECTION_NUMBER } from './skills.constants';

export interface SkillGroup {
  id: string;
  labelKey: string;
  skills: string[];
}

@Injectable({ providedIn: 'root' })
export class SkillsFacade {
  private readonly translate = inject(TranslateService);

  readonly heading = this.translate.t('skills', 'heading');
  readonly sectionNumber = SKILLS_SECTION_NUMBER;
  readonly frontendLabel = this.translate.t('skills', 'frontend');
  readonly toolsLabel = this.translate.t('skills', 'tools');
  readonly otherLabel = this.translate.t('skills', 'other');

  readonly groups: SkillGroup[] = [
    {
      id: 'frontend',
      labelKey: 'frontend',
      skills: ['Angular', 'TypeScript', 'RxJS', 'Signals', 'HTML', 'CSS / SCSS', 'Animations', 'A11y'],
    },
    {
      id: 'tools',
      labelKey: 'tools',
      skills: ['Git', 'GitHub Actions', 'Vite', 'Node.js', 'Figma', 'Storybook', 'Jest', 'Playwright'],
    },
    {
      id: 'other',
      labelKey: 'other',
      skills: ['REST APIs', 'GraphQL', 'Design Systems', 'Web Perf', 'SEO', 'i18n'],
    },
  ];
}
