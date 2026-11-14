import { ChangeDetectionStrategy, Component, InputSignal, Signal, inject, input } from '@angular/core';
import { ExperienceEntryView, ExperienceFacade } from '../../../../experience/facades/experience.facade';

@Component({
  selector: 'app-experience-panel',
  providers: [ExperienceFacade],
  templateUrl: './experience-panel.component.html',
  styleUrl: './experience-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperiencePanelComponent {
  private readonly experienceFacade: ExperienceFacade = inject(ExperienceFacade);

  readonly loadingLabel: InputSignal<string> = input.required<string>();
  readonly errorLabel: InputSignal<string> = input.required<string>();

  protected readonly translation: Signal<Record<string, string>> = this.experienceFacade.translation;
  protected readonly isLoading: Signal<boolean> = this.experienceFacade.isLoading;
  protected readonly isError: Signal<boolean> = this.experienceFacade.isError;
  protected readonly entries: Signal<ExperienceEntryView[]> = this.experienceFacade.entries;
}
