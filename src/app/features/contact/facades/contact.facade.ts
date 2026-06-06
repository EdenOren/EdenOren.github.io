import { Service, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SubmitState } from '../enums/contact.enums';
import {
  CONTACT_MIN_MESSAGE_LENGTH,
  CONTACT_SECTION_NUMBER,
  CONTACT_SUBMIT_DELAY_MS,
} from '../utils/contact.constants';

export { SubmitState };

@Service({ autoProvided: false })
export class ContactFacade {
  private readonly translateService: TranslateService = inject(TranslateService);

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('CONTACT') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );

  readonly SECTION_NUMBER: string = CONTACT_SECTION_NUMBER;

  readonly name: WritableSignal<string> = signal('');
  readonly email: WritableSignal<string> = signal('');
  readonly message: WritableSignal<string> = signal('');
  readonly submitState: WritableSignal<SubmitState> = signal<SubmitState>(SubmitState.Idle);

  readonly isValid: Signal<boolean> = computed(() =>
    this.name().trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim()) &&
    this.message().trim().length > CONTACT_MIN_MESSAGE_LENGTH
  );

  readonly isLoading: Signal<boolean> = computed(() => this.submitState() === SubmitState.Loading);
  readonly isSuccess: Signal<boolean> = computed(() => this.submitState() === SubmitState.Success);
  readonly isError: Signal<boolean> = computed(() => this.submitState() === SubmitState.Error);

  async submit(): Promise<void> {
    if (!this.isValid() || this.isLoading()) {
      return;
    }

    this.submitState.set(SubmitState.Loading);

    await new Promise<void>(resolve => setTimeout(resolve, CONTACT_SUBMIT_DELAY_MS));

    this.submitState.set(SubmitState.Success);
    this.name.set('');
    this.email.set('');
    this.message.set('');
  }
}
