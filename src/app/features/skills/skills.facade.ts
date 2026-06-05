import { Injectable, inject } from '@angular/core';
import { SkillsService } from './skills.service';

@Injectable({ providedIn: 'root' })
export class SkillsFacade {
  private readonly service = inject(SkillsService);
}
