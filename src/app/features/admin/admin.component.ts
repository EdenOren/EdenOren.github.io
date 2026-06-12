import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Signal,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminFacade } from './facades/admin.facade';
import { AdminRoute } from './enums/admin-route.enum';

@Component({
  selector: 'app-admin',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  providers: [AdminFacade],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private readonly adminFacade: AdminFacade = inject(AdminFacade);
  private readonly googleBtnEl = viewChild<ElementRef<HTMLElement>>('googleBtn');

  protected readonly isAuthenticated: Signal<boolean> = this.adminFacade.isAuthenticated;
  protected readonly ADMIN_ROUTE: typeof AdminRoute = AdminRoute;

  constructor() {
    effect(() => {
      const el = this.googleBtnEl();
      if (el) {
        this.adminFacade.initGoogleSignIn(el.nativeElement);
      }
    });
  }

  protected logout(): void {
    this.adminFacade.logout();
  }
}
