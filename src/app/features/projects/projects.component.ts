import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProjectsFacade } from './projects.facade';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  template: `<section class="projects"><!-- feature/projects --></section>`,
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  protected readonly facade = inject(ProjectsFacade);
}
