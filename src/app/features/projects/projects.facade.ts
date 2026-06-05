import { Injectable, inject } from '@angular/core';
import { ProjectsService } from './projects.service';

@Injectable({ providedIn: 'root' })
export class ProjectsFacade {
  private readonly service = inject(ProjectsService);
}
