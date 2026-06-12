import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from './confirm-dialog.service';
import { AuthService } from './auth.service';

describe('ConfirmDialogService', () => {
  const isAuthenticated = signal(true);

  beforeEach(() => {
    isAuthenticated.set(true);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        ...provideTranslateService({ defaultLanguage: 'en' }),
        ConfirmDialogService,
        { provide: AuthService, useValue: { isAuthenticated } },
      ],
    });
  });

  afterEach(() => {
    document.body.querySelectorAll('confirm-dialog').forEach(el => el.remove());
  });

  it('open() returns an observable', () => {
    const service = TestBed.inject(ConfirmDialogService);
    const obs = service.open('Are you sure?');
    expect(obs).toBeDefined();
    obs.subscribe().unsubscribe();
  });

  it('emits true and completes when the confirm output fires', () => {
    const service = TestBed.inject(ConfirmDialogService);
    const results: boolean[] = [];
    let completed = false;

    service.open('Delete?').subscribe({
      next: val => results.push(val),
      complete: () => { completed = true; },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = (service as any).activeRef;
    ref.instance.confirm.emit();

    expect(results).toEqual([true]);
    expect(completed).toBe(true);
  });

  it('emits false and completes when the cancel output fires', () => {
    const service = TestBed.inject(ConfirmDialogService);
    const results: boolean[] = [];
    let completed = false;

    service.open('Delete?').subscribe({
      next: val => results.push(val),
      complete: () => { completed = true; },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = (service as any).activeRef;
    ref.instance.cancel.emit();

    expect(results).toEqual([false]);
    expect(completed).toBe(true);
  });

  it('opening a second dialog closes the first with false', () => {
    const service = TestBed.inject(ConfirmDialogService);
    const firstResults: boolean[] = [];
    let firstCompleted = false;

    service.open('First').subscribe({
      next: val => firstResults.push(val),
      complete: () => { firstCompleted = true; },
    });

    service.open('Second');

    expect(firstResults).toEqual([false]);
    expect(firstCompleted).toBe(true);
  });

  it('auto-closes with false when the user logs out', () => {
    const service = TestBed.inject(ConfirmDialogService);
    const results: boolean[] = [];
    let completed = false;

    service.open('Delete?').subscribe({
      next: val => results.push(val),
      complete: () => { completed = true; },
    });

    isAuthenticated.set(false);
    TestBed.flushEffects();

    expect(results).toEqual([false]);
    expect(completed).toBe(true);
  });

  it('auto-closes with false on router navigation', async () => {
    const service = TestBed.inject(ConfirmDialogService);
    const results: boolean[] = [];
    let completed = false;

    service.open('Delete?').subscribe({
      next: val => results.push(val),
      complete: () => { completed = true; },
    });

    await TestBed.inject(Router).navigate(['/']);

    expect(results).toEqual([false]);
    expect(completed).toBe(true);
  });
});
