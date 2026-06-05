import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ExperienceFacade } from './experience.facade';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [],
  template: `<section class="experience"><!-- feature/experience --></section>`,
  styleUrl: './experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  protected readonly facade = inject(ExperienceFacade);
}
