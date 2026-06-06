import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContactFacade } from './contact.facade';
import { CONTACT_TEXTAREA_ROWS } from './contact.constants';

@Component({
  selector: 'app-contact',
  imports: [],
  providers: [ContactFacade],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected readonly facade = inject(ContactFacade);
  protected readonly TEXTAREA_ROWS: number = CONTACT_TEXTAREA_ROWS;
}
