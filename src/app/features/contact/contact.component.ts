import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { ButtonType, ButtonVariant } from '../../shared/enums/button.enums';
import { CtaButtonComponent } from '../../shared/ui/cta-button/cta-button.component';
import { SectionHeaderComponent } from '../../shared/ui/section-header/section-header.component';
import { ContactFacade } from './facades/contact.facade';
import { CONTACT_TEXTAREA_ROWS } from './utils/contact.constants';

@Component({
  selector: 'app-contact',
  imports: [ScrollRevealDirective, TranslatePipe, FormField, CtaButtonComponent, SectionHeaderComponent],
  providers: [ContactFacade],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly contactFacade: ContactFacade = inject(ContactFacade);

  protected readonly ButtonVariant: typeof ButtonVariant = ButtonVariant;
  protected readonly ButtonType: typeof ButtonType = ButtonType;
  protected readonly isSuccess: Signal<boolean> = this.contactFacade.isSuccess;
  protected readonly isLoading: Signal<boolean> = this.contactFacade.isLoading;
  protected readonly isError: Signal<boolean> = this.contactFacade.isError;
  protected readonly nameField: FieldTree<string> = this.contactFacade.nameField;
  protected readonly emailField: FieldTree<string> = this.contactFacade.emailField;
  protected readonly messageField: FieldTree<string> = this.contactFacade.messageField;
  protected readonly TEXTAREA_ROWS: number = CONTACT_TEXTAREA_ROWS;

  protected submit(): void {
    void this.contactFacade.submit();
  }
}
