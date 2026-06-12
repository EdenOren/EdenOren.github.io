import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { SkeletonType } from '../../shared/enums/shared.enums';
import { SectionHeaderComponent } from '../../shared/ui/section-header/section-header.component';
import { TagComponent } from '../../shared/ui/tag/tag.component';
import { TagVariant } from '../../shared/enums/tag.enum';
import { ExperienceEntryView, ExperienceFacade } from './facades/experience.facade';

@Component({
  selector: 'app-experience',
  imports: [SkeletonLoaderComponent, ScrollRevealDirective, SectionHeaderComponent, TagComponent],
  providers: [ExperienceFacade],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  private readonly experienceFacade: ExperienceFacade = inject(ExperienceFacade);

  protected readonly translation: Signal<Record<string, string>> = this.experienceFacade.translation;
  protected readonly isLoading: Signal<boolean> = this.experienceFacade.isLoading;
  protected readonly entries: Signal<ExperienceEntryView[]> = this.experienceFacade.entries;
  protected readonly SkeletonType: typeof SkeletonType = SkeletonType;
  protected readonly tagVariant: typeof TagVariant = TagVariant;
}
