import { Service, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SkillsService } from '../../../core/services/data/skills.service';
import { Skill } from '../models/skills.models';
import { CATEGORY_TO_I18N_KEY, SKILL_CATEGORY_ORDER } from '../utils/skills.const';

export interface SkillGroup {
  id: string;
  labelKey: string;
  skills: string[];
}

function categoryRank(category: string): number {
  const index = SKILL_CATEGORY_ORDER.indexOf(category);
  return index === -1 ? SKILL_CATEGORY_ORDER.length : index;
}

@Service({ autoProvided: false })
export class SkillsFacade {
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly skillsService: SkillsService = inject(SkillsService);

  readonly isLoading: Signal<boolean> = this.skillsService.isLoading;
  readonly isError: Signal<boolean> = this.skillsService.isError;

  readonly groups: Signal<SkillGroup[]> = computed(() => {
    const sortedSkills: Skill[] = [...this.skillsService.items()].sort(
      (first: Skill, second: Skill) =>
        categoryRank(first.category) - categoryRank(second.category) ||
        first.sort_order - second.sort_order
    );
    const grouped = new Map<string, string[]>();
    for (const skill of sortedSkills) {
      const existing = grouped.get(skill.category) ?? [];
      existing.push(skill.name);
      grouped.set(skill.category, existing);
    }
    return Array.from(grouped.entries()).map(([category, skills]: [string, string[]]) => ({
      id: category,
      labelKey: CATEGORY_TO_I18N_KEY[category] ?? category.toUpperCase().replace(/\s+/g, '_'),
      skills,
    }));
  });

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('SKILLS') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );
}
