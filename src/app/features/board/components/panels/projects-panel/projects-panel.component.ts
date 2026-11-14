import { ChangeDetectionStrategy, Component, InputSignal, Signal, inject, input } from '@angular/core';
import { ProjectViewModel, ProjectsFacade } from '../../../../projects/facades/projects.facade';

@Component({
  selector: 'app-projects-panel',
  providers: [ProjectsFacade],
  templateUrl: './projects-panel.component.html',
  styleUrl: './projects-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsPanelComponent {
  private readonly projectsFacade: ProjectsFacade = inject(ProjectsFacade);

  readonly loadingLabel: InputSignal<string> = input.required<string>();
  readonly errorLabel: InputSignal<string> = input.required<string>();

  protected readonly translation: Signal<Record<string, string>> = this.projectsFacade.translation;
  protected readonly isLoading: Signal<boolean> = this.projectsFacade.isLoading;
  protected readonly isError: Signal<boolean> = this.projectsFacade.isError;
  protected readonly projects: Signal<ProjectViewModel[]> = this.projectsFacade.projects;
}
