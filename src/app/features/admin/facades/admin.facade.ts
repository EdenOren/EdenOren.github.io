import { DestroyRef, Service, Signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { GOOGLE_CLIENT_ID } from '../../../core/constants/core.constants';
import { AuthService } from '../../../core/services/platform/auth.service';
import { AdminService } from '../../../core/services/data/admin.service';
import { GoogleIdentityResponse } from '../../../core/models/core.models';
import { AdminRoute } from '../enums/admin-route.enum';

declare const google: {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleIdentityResponse) => void;
      }) => void;
      renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
      disableAutoSelect: () => void;
    };
  };
};

@Service({ autoProvided: false })
export class AdminFacade {
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);
  private readonly adminService: AdminService = inject(AdminService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  readonly isAuthenticated: Signal<boolean> = this.authService.isAuthenticated;

  initGoogleSignIn(buttonEl: HTMLElement): void {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: GoogleIdentityResponse): void => {
        this.authService.login(response.credential);
        this.adminService.verify()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.router.navigate(['/admin', AdminRoute.ABOUT]),
            error: () => {
              this.authService.logout();
              google.accounts.id.disableAutoSelect();
              this.router.navigate(['/']);
            },
          });
      },
    });
    google.accounts.id.renderButton(buttonEl, {
      theme: 'outline',
      size: 'large',
      shape: 'rectangular',
      text: 'signin_with',
      width: 280,
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
