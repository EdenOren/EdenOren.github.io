import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '../../shared/services/translate.service';
import {
  CONTACT_MIN_MESSAGE_LENGTH,
  CONTACT_SECTION_NUMBER,
  CONTACT_SUBMIT_DELAY_MS,
} from './contact.constants';

export type SubmitState = 'idle' | 'loading' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ContactFacade {
  private readonly translate = inject(TranslateService);

  readonly heading = this.translate.t('contact', 'heading');
  readonly nameLabel = this.translate.t('contact', 'name_label');
  readonly namePlaceholder = this.translate.t('contact', 'name_placeholder');
  readonly emailLabel = this.translate.t('contact', 'email_label');
  readonly emailPlaceholder = this.translate.t('contact', 'email_placeholder');
  readonly messageLabel = this.translate.t('contact', 'message_label');
  readonly messagePlaceholder = this.translate.t('contact', 'message_placeholder');
  readonly submitLabel = this.translate.t('contact', 'submit');
  readonly successMessage = this.translate.t('contact', 'success');
  readonly errorMessage = this.translate.t('contact', 'error');
  readonly sectionNumber = CONTACT_SECTION_NUMBER;

  readonly name = signal('');
  readonly email = signal('');
  readonly message = signal('');
  readonly submitState = signal<SubmitState>('idle');

  readonly isValid = computed(() =>
    this.name().trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim()) &&
    this.message().trim().length > CONTACT_MIN_MESSAGE_LENGTH
  );

  readonly isLoading = computed(() => this.submitState() === 'loading');

  async submit(): Promise<void> {
    if (!this.isValid() || this.isLoading()) return;

    this.submitState.set('loading');

    await new Promise<void>(resolve => setTimeout(resolve, CONTACT_SUBMIT_DELAY_MS));

    this.submitState.set('success');
    this.name.set('');
    this.email.set('');
    this.message.set('');
  }
}
