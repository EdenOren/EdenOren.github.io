import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { SkeletonType } from '../../shared/enums/shared.enums';
import { SkillsFacade } from './skills.facade';

@Component({
  selector: 'app-skills',
  imports: [SkeletonLoaderComponent],
  providers: [SkillsFacade],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  protected readonly facade = inject(SkillsFacade);
  protected readonly SkeletonType: typeof SkeletonType = SkeletonType;
}
