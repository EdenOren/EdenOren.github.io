import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkillsFacade, SkillGroup } from './skills.facade';
import { SkillGroupKey } from './skills.enums';

@Component({
  selector: 'app-skills',
  imports: [],
  providers: [SkillsFacade],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  protected readonly facade = inject(SkillsFacade);

  protected groupLabel(group: SkillGroup): string {
    if (group.labelKey === SkillGroupKey.Frontend) {
      return this.facade.frontendLabel();
    }
    if (group.labelKey === SkillGroupKey.Tools) {
      return this.facade.toolsLabel();
    }
    return this.facade.otherLabel();
  }
}
