import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { SkeletonType } from '../../shared/enums/shared.enums';
import { SectionHeaderComponent } from '../../shared/ui/section-header/section-header.component';
import { TagComponent } from '../../shared/ui/tag/tag.component';
import { ProjectViewModel, ProjectsFacade } from './facades/projects.facade';

@Component({
  selector: 'app-projects',
  imports: [NgOptimizedImage, SkeletonLoaderComponent, ScrollRevealDirective, SectionHeaderComponent, TagComponent],
  providers: [ProjectsFacade],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  private readonly projectsFacade: ProjectsFacade = inject(ProjectsFacade);

  protected readonly translation: Signal<Record<string, string>> = this.projectsFacade.translation;
  protected readonly isLoading: Signal<boolean> = this.projectsFacade.isLoading;
  protected readonly projects: Signal<ProjectViewModel[]> = this.projectsFacade.projects;
  protected readonly SkeletonType: typeof SkeletonType = SkeletonType;
}
