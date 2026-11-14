import { DestroyRef, Service, Signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { GOOGLE_CLIENT_ID } from '../../../core/constants/core.const';
import { AppRoute } from '../../../core/enums/core.enums';
import { AuthService } from '../../../core/services/platform/auth.service';
import { ThemeService } from '../../../core/services/platform/theme.service';
import { AdminService } from '../../../core/services/data/admin.service';
import { GoogleIdentityResponse } from '../../../core/models/core.models';
import { AdminRoute, GoogleButtonShape, GoogleButtonTheme } from '../enums/admin.enums';
import { GoogleButtonStyle } from '../models/admin.models';

const CLASSIC_GOOGLE_BUTTON: GoogleButtonStyle = {
  theme: GoogleButtonTheme.Outline,
  shape: GoogleButtonShape.Rectangular,
};

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
  private readonly themeService: ThemeService = inject(ThemeService);

  readonly isAuthenticated: Signal<boolean> = this.authService.isAuthenticated;
  readonly isNight: Signal<boolean> = this.themeService.isDark;

  initGoogleSignIn(buttonEl: HTMLElement, style: GoogleButtonStyle = CLASSIC_GOOGLE_BUTTON): void {
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
    // Google draws the button in its own iframe; re-rendering (e.g. on a theme change) must start empty.
    buttonEl.replaceChildren();
    google.accounts.id.renderButton(buttonEl, {
      theme: style.theme,
      size: 'large',
      shape: style.shape,
      text: 'signin_with',
      width: 280,
    });
  }

  // Re-navigating lets the signed-out route match, so the board login replaces the panel.
  logout(): void {
    this.authService.logout();
    void this.router.navigate([`/${AppRoute.Admin}`]);
  }
}
