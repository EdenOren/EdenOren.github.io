import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkillsFacade } from './skills.facade';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  protected readonly facade = inject(SkillsFacade);

  protected groupLabel(group: { labelKey: string }): string {
    if (group.labelKey === 'frontend') return this.facade.frontendLabel();
    if (group.labelKey === 'tools') return this.facade.toolsLabel();
    return this.facade.otherLabel();
  }
}
