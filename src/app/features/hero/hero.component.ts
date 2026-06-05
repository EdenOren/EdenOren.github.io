import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeroFacade } from './hero.facade';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  template: `<section class="hero"><!-- feature/hero --></section>`,
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  protected readonly facade = inject(HeroFacade);
}
