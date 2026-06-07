import { Service, Signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/platform/auth.service';

declare const google: {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
      }) => void;
      renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
    };
  };
};

const ADMIN_EMAIL = 'edenoren@gmail.com';
const GOOGLE_CLIENT_ID = '596502613850-03b6m23dr2tjor3mi9o08n8lau9s3s9u.apps.googleusercontent.com';

@Service({ autoProvided: false })
export class AdminFacade {
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);

  readonly isAuthenticated: Signal<boolean> = this.authService.isAuthenticated;

  initGoogleSignIn(buttonEl: HTMLElement): void {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: { credential: string }) => {
        const base64 = response.credential.split('.')[1]
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        const payload = JSON.parse(atob(base64)) as Record<string, unknown>;
        this.onCredential(response.credential, payload['email'] as string);
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

  private onCredential(credential: string, email: string): void {
    if (email !== ADMIN_EMAIL) {
      this.router.navigate(['/']);
      return;
    }
    this.authService.login(credential);
    this.router.navigate(['/admin/experience']);
  }

  logout(): void {
    this.authService.logout();
  }
}
