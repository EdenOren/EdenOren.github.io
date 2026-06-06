import { Service, Signal, inject } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';
import { I18nSection } from '../../shared/enums/i18n-section.enum';
import { SKILLS_SECTION_NUMBER } from './skills.constants';
import { SkillGroupKey } from './skills.enums';

export interface SkillGroup {
  id: SkillGroupKey;
  labelKey: SkillGroupKey;
  skills: string[];
}

@Service({ autoProvided: false })
export class SkillsFacade {
  private readonly translate = inject(TranslateService);

  readonly heading:        Signal<string> = this.translate.get(I18nSection.Skills, 'HEADING');
  readonly SECTION_NUMBER: number         = SKILLS_SECTION_NUMBER;
  readonly frontendLabel:  Signal<string> = this.translate.get(I18nSection.Skills, 'FRONTEND');
  readonly toolsLabel:     Signal<string> = this.translate.get(I18nSection.Skills, 'TOOLS');
  readonly otherLabel:     Signal<string> = this.translate.get(I18nSection.Skills, 'OTHER');

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
}
