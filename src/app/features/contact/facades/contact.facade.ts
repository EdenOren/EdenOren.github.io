import { Service, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { FieldTree, email, form, minLength, required, submit } from '@angular/forms/signals';
import { ContactService } from '../../../core/services/data/contact.service';
import { SubmitState } from '../enums/contact.enums';
import { CONTACT_MIN_MESSAGE_LENGTH } from '../utils/contact.constants';

interface ContactData {
  name: string;
  email: string;
  message: string;
}

@Service({ autoProvided: false })
export class ContactFacade {
  private readonly contactService: ContactService = inject(ContactService);

  private readonly model: WritableSignal<ContactData> = signal<ContactData>({
    name: '',
    email: '',
    message: '',
  });

  readonly contactForm: FieldTree<ContactData> = form(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'CONTACT.FIELD_REQUIRED' });
    required(schemaPath.email, { message: 'CONTACT.FIELD_REQUIRED' });
    email(schemaPath.email, { message: 'CONTACT.EMAIL_INVALID' });
    required(schemaPath.message, { message: 'CONTACT.FIELD_REQUIRED' });
    minLength(schemaPath.message, CONTACT_MIN_MESSAGE_LENGTH, { message: 'CONTACT.MESSAGE_TOO_SHORT' });
  });

  private readonly _result: WritableSignal<SubmitState> = signal<SubmitState>(SubmitState.Idle);

  readonly isLoading: Signal<boolean> = computed(() => this.contactForm().submitting());
  readonly isSuccess: Signal<boolean> = computed(() => this._result() === SubmitState.Success);
  readonly isError: Signal<boolean> = computed(() => this._result() === SubmitState.Error);

  async submit(): Promise<void> {
    await submit(this.contactForm, async (field) => {
      try {
        await this.contactService.send({
          name: field().value().name.trim(),
          email: field().value().email.trim(),
          message: field().value().message.trim(),
        });
        this.model.set({ name: '', email: '', message: '' });
        this._result.set(SubmitState.Success);
        return;
      } catch {
        this._result.set(SubmitState.Error);
        return { kind: 'serverError', message: 'CONTACT.ERROR' };
      }
    });
  }
}
