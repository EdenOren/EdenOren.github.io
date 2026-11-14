import { ChangeDetectionStrategy, Component, InputSignal, Signal, inject, input } from '@angular/core';
import { SkillGroup, SkillsFacade } from '../../../../skills/facades/skills.facade';

@Component({
  selector: 'app-skills-panel',
  providers: [SkillsFacade],
  templateUrl: './skills-panel.component.html',
  styleUrl: './skills-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsPanelComponent {
  private readonly skillsFacade: SkillsFacade = inject(SkillsFacade);

  readonly loadingLabel: InputSignal<string> = input.required<string>();
  readonly errorLabel: InputSignal<string> = input.required<string>();

  protected readonly translation: Signal<Record<string, string>> = this.skillsFacade.translation;
  protected readonly isLoading: Signal<boolean> = this.skillsFacade.isLoading;
  protected readonly isError: Signal<boolean> = this.skillsFacade.isError;
  protected readonly groups: Signal<SkillGroup[]> = this.skillsFacade.groups;
}
