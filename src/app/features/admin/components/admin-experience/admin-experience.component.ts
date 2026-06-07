import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminExperienceFacade } from './facades/admin-experience.facade';

@Component({
  selector: 'app-admin-experience',
  imports: [],
  providers: [AdminExperienceFacade],
  templateUrl: './admin-experience.component.html',
  styleUrl: './admin-experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminExperienceComponent {
  protected readonly facade: AdminExperienceFacade = inject(AdminExperienceFacade);
}
