import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { SkeletonType } from '../../shared/enums/shared.enums';
import { ProjectsFacade } from './projects.facade';

@Component({
  selector: 'app-projects',
  imports: [SkeletonLoaderComponent],
  providers: [ProjectsFacade],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  protected readonly facade = inject(ProjectsFacade);
  protected readonly SkeletonType: typeof SkeletonType = SkeletonType;
}
