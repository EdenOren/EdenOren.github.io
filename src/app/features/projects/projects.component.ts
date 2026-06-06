import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProjectsFacade } from './projects.facade';

@Component({
  selector: 'app-projects',
  imports: [],
  providers: [ProjectsFacade],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  protected readonly facade = inject(ProjectsFacade);
}
