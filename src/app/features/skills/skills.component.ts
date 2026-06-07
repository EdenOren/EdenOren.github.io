import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { SkeletonType } from '../../shared/enums/shared.enums';
import { SectionHeaderComponent } from '../../shared/ui/section-header/section-header.component';
import { SkillGroup, SkillsFacade } from './facades/skills.facade';

@Component({
  selector: 'app-skills',
  imports: [SkeletonLoaderComponent, ScrollRevealDirective, SectionHeaderComponent],
  providers: [SkillsFacade],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  private readonly skillsFacade: SkillsFacade = inject(SkillsFacade);

  protected readonly translation: Signal<Record<string, string>> = this.skillsFacade.translation;
  protected readonly isLoading: Signal<boolean> = this.skillsFacade.isLoading;
  protected readonly groups: Signal<SkillGroup[]> = this.skillsFacade.groups;
  protected readonly SkeletonType: typeof SkeletonType = SkeletonType;
}
