import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminProjectsFacade } from './facades/admin-projects.facade';

@Component({
  selector: 'app-admin-projects',
  imports: [],
  providers: [AdminProjectsFacade],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProjectsComponent {
  protected readonly facade: AdminProjectsFacade = inject(AdminProjectsFacade);
}
