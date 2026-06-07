import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { ContactFacade } from './facades/contact.facade';
import { CONTACT_TEXTAREA_ROWS } from './utils/contact.constants';

@Component({
  selector: 'app-contact',
  imports: [ScrollRevealDirective, TranslatePipe, FormField],
  providers: [ContactFacade],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected readonly facade: ContactFacade = inject(ContactFacade);
  protected readonly TEXTAREA_ROWS: number = CONTACT_TEXTAREA_ROWS;
}
