import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroFacade } from './hero.facade';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  providers: [HeroFacade],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  protected readonly facade = inject(HeroFacade);
}
