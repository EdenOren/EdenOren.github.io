import { Service, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { ContactService } from '../../../core/services/data/contact.service';
import { SubmitState } from '../enums/contact.enums';
import { CONTACT_SECTION_NUMBER } from '../utils/contact.constants';

export { SubmitState };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Service({ autoProvided: false })
export class ContactFacade {
  private readonly contactService: ContactService = inject(ContactService);

  readonly SECTION_NUMBER: string = CONTACT_SECTION_NUMBER;

  readonly name: WritableSignal<string> = signal('');
  readonly email: WritableSignal<string> = signal('');
  readonly message: WritableSignal<string> = signal('');
  readonly submitState: WritableSignal<SubmitState> = signal<SubmitState>(SubmitState.Idle);
  readonly attempted: WritableSignal<boolean> = signal(false);

  readonly isValid: Signal<boolean> = computed(() =>
    this.name().trim().length > 0 &&
    EMAIL_REGEX.test(this.email().trim()) &&
    this.message().trim().length > 0
  );

  readonly isLoading: Signal<boolean> = computed(() => this.submitState() === SubmitState.Loading);
  readonly isSuccess: Signal<boolean> = computed(() => this.submitState() === SubmitState.Success);
  readonly isError: Signal<boolean> = computed(() => this.submitState() === SubmitState.Error);

  async submit(): Promise<void> {
    this.attempted.set(true);

    if (!this.isValid() || this.isLoading()) {
      return;
    }

    this.submitState.set(SubmitState.Loading);

    try {
      await this.contactService.send({
        name: this.name().trim(),
        email: this.email().trim(),
        message: this.message().trim(),
      });
      this.submitState.set(SubmitState.Success);
      this.name.set('');
      this.email.set('');
      this.message.set('');
      this.attempted.set(false);
    } catch {
      this.submitState.set(SubmitState.Error);
    }
  }
}
