import { ChangeDetectionStrategy, Component, OutputEmitterRef, Signal, inject, input, InputSignal, output } from '@angular/core';
import { HeroFacade } from '../../../../hero/facades/hero.facade';
import { BoardRegion } from '../../../enums/board.enums';

@Component({
  selector: 'app-hero-panel',
  providers: [HeroFacade],
  templateUrl: './hero-panel.component.html',
  styleUrl: './hero-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroPanelComponent {
  private readonly heroFacade: HeroFacade = inject(HeroFacade);

  readonly aside: InputSignal<string> = input.required<string>();
  readonly regionRequested: OutputEmitterRef<BoardRegion> = output<BoardRegion>();

  protected readonly translation: Signal<Record<string, string>> = this.heroFacade.translation;

  protected onShowProjects(): void {
    this.regionRequested.emit(BoardRegion.Projects);
  }

  protected onShowContact(): void {
    this.regionRequested.emit(BoardRegion.Contact);
  }
}
