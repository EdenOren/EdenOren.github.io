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
import { Observable, Subject, filter } from 'rxjs';
import { AuthService } from './auth.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Service()
export class ConfirmDialogService {
  private readonly appRef: ApplicationRef = inject(ApplicationRef);
  private readonly environmentInjector: EnvironmentInjector = inject(EnvironmentInjector);
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);

  private activeRef: ComponentRef<ConfirmDialogComponent> | null = null;
  private activeSubject: Subject<boolean> | null = null;

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => this.closeActive(false));

    effect(() => {
      if (!this.authService.isAuthenticated()) {
        this.closeActive(false);
      }
    });
  }

  open(message: string): Observable<boolean> {
    this.closeActive(false);

    const subject: Subject<boolean> = new Subject<boolean>();
    this.activeSubject = subject;

    const componentRef: ComponentRef<ConfirmDialogComponent> = createComponent(ConfirmDialogComponent, {
      environmentInjector: this.environmentInjector,
    });
    this.activeRef = componentRef;

    componentRef.setInput('message', message);

    componentRef.instance.confirm.subscribe(() => this.closeActive(true));
    componentRef.instance.cancel.subscribe(() => this.closeActive(false));

    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);

    return subject.asObservable();
  }

  private closeActive(confirmed: boolean): void {
    if (this.activeRef === null) {
      return;
    }
    this.appRef.detachView(this.activeRef.hostView);
    this.activeRef.destroy();
    this.activeRef = null;

    if (this.activeSubject !== null) {
      this.activeSubject.next(confirmed);
      this.activeSubject.complete();
      this.activeSubject = null;
    }
  }
}
