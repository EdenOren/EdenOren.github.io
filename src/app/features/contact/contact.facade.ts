import { Service, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';
import { I18nSection } from '../../shared/enums/i18n-section.enum';
import { SubmitState } from './contact.enums';
import {
  CONTACT_MIN_MESSAGE_LENGTH,
  CONTACT_SECTION_NUMBER,
  CONTACT_SUBMIT_DELAY_MS,
} from './contact.constants';

export { SubmitState };

@Service({ autoProvided: false })
export class ContactFacade {
  private readonly translate = inject(TranslateService);

  readonly heading:            Signal<string> = this.translate.get(I18nSection.Contact, 'HEADING');
  readonly nameLabel:          Signal<string> = this.translate.get(I18nSection.Contact, 'NAME_LABEL');
  readonly namePlaceholder:    Signal<string> = this.translate.get(I18nSection.Contact, 'NAME_PLACEHOLDER');
  readonly emailLabel:         Signal<string> = this.translate.get(I18nSection.Contact, 'EMAIL_LABEL');
  readonly emailPlaceholder:   Signal<string> = this.translate.get(I18nSection.Contact, 'EMAIL_PLACEHOLDER');
  readonly messageLabel:       Signal<string> = this.translate.get(I18nSection.Contact, 'MESSAGE_LABEL');
  readonly messagePlaceholder: Signal<string> = this.translate.get(I18nSection.Contact, 'MESSAGE_PLACEHOLDER');
  readonly submitLabel:        Signal<string> = this.translate.get(I18nSection.Contact, 'SUBMIT');
  readonly successMessage:     Signal<string> = this.translate.get(I18nSection.Contact, 'SUCCESS');
  readonly errorMessage:       Signal<string> = this.translate.get(I18nSection.Contact, 'ERROR');
  readonly SECTION_NUMBER:     number         = CONTACT_SECTION_NUMBER;

  readonly name:        WritableSignal<string>      = signal('');
  readonly email:       WritableSignal<string>      = signal('');
  readonly message:     WritableSignal<string>      = signal('');
  readonly submitState: WritableSignal<SubmitState> = signal<SubmitState>(SubmitState.Idle);

  readonly isValid:   Signal<boolean> = computed(() =>
    this.name().trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim()) &&
    this.message().trim().length > CONTACT_MIN_MESSAGE_LENGTH
  );

  readonly isLoading: Signal<boolean> = computed(() => this.submitState() === SubmitState.Loading);
  readonly isSuccess: Signal<boolean> = computed(() => this.submitState() === SubmitState.Success);
  readonly isError:   Signal<boolean> = computed(() => this.submitState() === SubmitState.Error);

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
