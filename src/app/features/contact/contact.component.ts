import { ChangeDetectionStrategy, Component, Signal, WritableSignal, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { ContactFacade } from './facades/contact.facade';
import { CONTACT_TEXTAREA_ROWS } from './utils/contact.constants';

@Component({
  selector: 'app-contact',
  imports: [ScrollRevealDirective, TranslatePipe],
  providers: [ContactFacade],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly facade: ContactFacade = inject(ContactFacade);

  protected readonly name: WritableSignal<string> = this.facade.name;
  protected readonly email: WritableSignal<string> = this.facade.email;
  protected readonly message: WritableSignal<string> = this.facade.message;
  protected readonly attempted: Signal<boolean> = this.facade.attempted;
  protected readonly isLoading: Signal<boolean> = this.facade.isLoading;
  protected readonly isSuccess: Signal<boolean> = this.facade.isSuccess;
  protected readonly isError: Signal<boolean> = this.facade.isError;
  protected readonly SECTION_NUMBER: string = this.facade.SECTION_NUMBER;
  protected readonly TEXTAREA_ROWS: number = CONTACT_TEXTAREA_ROWS;

  protected submit(): void {
    void this.facade.submit();
  }
}
