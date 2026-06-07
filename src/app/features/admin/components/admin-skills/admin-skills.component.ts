import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminSkillsFacade } from './facades/admin-skills.facade';

@Component({
  selector: 'app-admin-skills',
  imports: [],
  providers: [AdminSkillsFacade],
  templateUrl: './admin-skills.component.html',
  styleUrl: './admin-skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSkillsComponent {
  protected readonly facade: AdminSkillsFacade = inject(AdminSkillsFacade);
}
