import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AboutFacade } from './about.facade';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `<section class="about"><!-- feature/about --></section>`,
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly facade = inject(AboutFacade);
}
