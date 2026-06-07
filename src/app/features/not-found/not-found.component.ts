import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotFoundFacade } from './facades/not-found.facade';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  providers: [NotFoundFacade],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  private readonly notFoundFacade: NotFoundFacade = inject(NotFoundFacade);

  protected readonly translation: Signal<Record<string, string>> = this.notFoundFacade.translation;
}
