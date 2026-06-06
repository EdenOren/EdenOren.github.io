import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { AboutFacade } from './facades/about.facade';

@Component({
  selector: 'app-about',
  imports: [ScrollRevealDirective],
  providers: [AboutFacade],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly facade = inject(AboutFacade);
}
