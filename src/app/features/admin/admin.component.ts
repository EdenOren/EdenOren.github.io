import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AdminFacade } from './facades/admin.facade';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  providers: [AdminFacade],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  protected readonly facade: AdminFacade = inject(AdminFacade);
  private readonly googleBtnEl = viewChild<ElementRef<HTMLElement>>('googleBtn');

  constructor() {
    effect(() => {
      const el = this.googleBtnEl();
      if (el) {
        this.facade.initGoogleSignIn(el.nativeElement);
      }
    });
  }
}
