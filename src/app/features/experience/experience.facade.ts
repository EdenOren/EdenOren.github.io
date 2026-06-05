import { Injectable, inject } from '@angular/core';
import { ExperienceService } from './experience.service';

@Injectable({ providedIn: 'root' })
export class ExperienceFacade {
  private readonly service = inject(ExperienceService);
}
