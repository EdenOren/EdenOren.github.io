import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { SkeletonType } from '../../shared/enums/shared.enums';
import { ExperienceFacade } from './experience.facade';

@Component({
  selector: 'app-experience',
  imports: [SkeletonLoaderComponent],
  providers: [ExperienceFacade],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  protected readonly facade = inject(ExperienceFacade);
  protected readonly SkeletonType: typeof SkeletonType = SkeletonType;
}
