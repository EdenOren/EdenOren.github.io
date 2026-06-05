import { Injectable, inject } from '@angular/core';
import { AboutService } from './about.service';

@Injectable({ providedIn: 'root' })
export class AboutFacade {
  private readonly service = inject(AboutService);
}
