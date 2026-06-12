import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Service,
  createComponent,
  effect,
  inject,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Service()
export class ConfirmDialogService {
  private readonly appRef: ApplicationRef = inject(ApplicationRef);
  private readonly environmentInjector: EnvironmentInjector = inject(EnvironmentInjector);
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);

  private activeRef: ComponentRef<ConfirmDialogComponent> | null = null;

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => this.closeActive());

    effect(() => {
      if (!this.authService.isAuthenticated()) {
        this.closeActive();
      }
    });
  }

  open(message: string, onConfirm: () => void): void {
    this.closeActive();

    const componentRef: ComponentRef<ConfirmDialogComponent> = createComponent(ConfirmDialogComponent, {
      environmentInjector: this.environmentInjector,
    });
    this.activeRef = componentRef;

    componentRef.setInput('message', message);

    componentRef.instance.confirm.subscribe(() => {
      onConfirm();
      this.closeActive();
    });

    componentRef.instance.cancel.subscribe(() => {
      this.closeActive();
    });

    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);
  }

  private closeActive(): void {
    if (this.activeRef === null) {
      return;
    }
    this.appRef.detachView(this.activeRef.hostView);
    this.activeRef.destroy();
    this.activeRef = null;
  }
}
