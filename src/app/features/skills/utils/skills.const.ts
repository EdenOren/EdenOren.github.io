import { SkillCategory, SkillGroupKey } from '../enums/skills.enums';

export const SKILL_CATEGORY_ORDER: readonly string[] = [
  SkillCategory.Frontend,
  SkillCategory.Backend,
  SkillCategory.Tools,
];

export const CATEGORY_TO_I18N_KEY: Readonly<Record<string, string>> = {
  [SkillCategory.Frontend]: SkillGroupKey.Frontend,
  [SkillCategory.Backend]: SkillGroupKey.Backend,
  [SkillCategory.Tools]: SkillGroupKey.Tools,
};
