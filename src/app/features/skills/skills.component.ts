import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkillsFacade } from './skills.facade';

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
}
