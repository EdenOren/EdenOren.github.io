import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContactFacade } from './contact.facade';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  template: `<section class="contact"><!-- feature/contact --></section>`,
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected readonly facade = inject(ContactFacade);
}
