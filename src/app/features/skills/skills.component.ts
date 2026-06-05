import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkillsFacade } from './skills.facade';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  template: `<section class="skills"><!-- feature/skills --></section>`,
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  protected readonly facade = inject(SkillsFacade);
}
