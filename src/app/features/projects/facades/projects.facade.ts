import { Service, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ProjectsService } from '../../../core/services/data/projects.service';
import { Project } from '../models/projects.models';

export interface ProjectViewModel {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string | undefined;
  liveUrl: string | undefined;
  imageUrl: string | undefined;
}

@Service({ autoProvided: false })
export class ProjectsFacade {
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly projectsService: ProjectsService = inject(ProjectsService);

  readonly isLoading: Signal<boolean> = this.projectsService.isLoading;
  readonly isError: Signal<boolean> = this.projectsService.isError;

  readonly projects: Signal<ProjectViewModel[]> = computed(() =>
    this.projectsService.items().map((project: Project) => ({
      id: project.id,
      title: project.name,
      description: project.description,
      tags: project.tags,
      githubUrl: project.github_url ?? undefined,
      liveUrl: project.live_url ?? undefined,
      imageUrl: project.image_url ?? undefined,
    }))
  );

  readonly translation: Signal<Record<string, string>> = toSignal(
    this.translateService.stream('PROJECTS') as Observable<Record<string, string>>,
    { initialValue: {} as Record<string, string> }
  );
}
