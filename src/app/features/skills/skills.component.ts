import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { SkeletonType } from '../../shared/enums/shared.enums';
import { SkillsFacade } from './facades/skills.facade';

@Component({
  selector: 'app-skills',
  imports: [SkeletonLoaderComponent, ScrollRevealDirective],
  providers: [SkillsFacade],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  protected readonly facade = inject(SkillsFacade);
  protected readonly SkeletonType: typeof SkeletonType = SkeletonType;
}
