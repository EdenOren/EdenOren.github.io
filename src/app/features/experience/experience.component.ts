import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ExperienceFacade } from './experience.facade';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  protected readonly facade = inject(ExperienceFacade);
}
