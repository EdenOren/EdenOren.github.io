import { ChangeDetectionStrategy, Component, InputSignal, Signal, inject, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactFacade } from '../../../../contact/facades/contact.facade';
import { CONTACT_TEXTAREA_ROWS } from '../../../../contact/utils/contact.const';

@Component({
  selector: 'app-contact-panel',
  imports: [FormField, TranslatePipe],
  providers: [ContactFacade],
  templateUrl: './contact-panel.component.html',
  styleUrl: './contact-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPanelComponent {
  private readonly contactFacade: ContactFacade = inject(ContactFacade);

  readonly sendLabel: InputSignal<string> = input.required<string>();
  readonly sendingLabel: InputSignal<string> = input.required<string>();

  protected readonly TEXTAREA_ROWS: number = CONTACT_TEXTAREA_ROWS;
  protected readonly isSuccess: Signal<boolean> = this.contactFacade.isSuccess;
  protected readonly isLoading: Signal<boolean> = this.contactFacade.isLoading;
  protected readonly isError: Signal<boolean> = this.contactFacade.isError;
  protected readonly nameField: FieldTree<string> = this.contactFacade.nameField;
  protected readonly emailField: FieldTree<string> = this.contactFacade.emailField;
  protected readonly messageField: FieldTree<string> = this.contactFacade.messageField;

  protected onSubmit(event: Event): void {
    event.preventDefault();
    void this.contactFacade.submit();
  }
}
