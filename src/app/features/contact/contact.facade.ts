import { Injectable, inject } from '@angular/core';
import { ContactService } from './contact.service';

@Injectable({ providedIn: 'root' })
export class ContactFacade {
  private readonly service = inject(ContactService);
}
