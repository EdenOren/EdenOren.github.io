import {
  DestroyRef,
  Service,
  Signal,
  WritableSignal,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FieldTree, form, required } from '@angular/forms/signals';
import { Project } from '../../../../../features/projects/models/projects.models';
import { ProjectsService } from '../../../../../core/services/data/projects.service';
import { AdminCrudFacade } from '../../../facades/admin-crud.facade';

interface ProjectFormModel {
  name: string;
  description: string;
  tags: string;
  githubUrl: string;
}

@Service({ autoProvided: false })
export class AdminProjectsFacade extends AdminCrudFacade<Project> {
  private readonly projectsService: ProjectsService = inject(ProjectsService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  override readonly items: WritableSignal<Project[]> = linkedSignal(() =>
    this.projectsService.items()
  );

  private readonly formModel: WritableSignal<ProjectFormModel> = signal({
    name: '',
    description: '',
    tags: '',
    githubUrl: '',
  });

  private readonly formTree: FieldTree<ProjectFormModel> = form(
    this.formModel,
    (p) => {
      required(p.name);
    }
  );

  readonly nameField: FieldTree<string> = this.formTree.name;
  readonly descriptionField: FieldTree<string> = this.formTree.description;
  readonly tagsField: FieldTree<string> = this.formTree.tags;
  readonly githubUrlField: FieldTree<string> = this.formTree.githubUrl;

  override readonly isFormValid: Signal<boolean> = computed(() => this.formTree().valid());

  override openAdd(): void {
    this.formModel.set({ name: '', description: '', tags: '', githubUrl: '' });
    this.beginAdd();
  }

  override openEdit(project: Project): void {
    this.formModel.set({
      name: project.name,
      description: project.description,
      tags: project.tags.join(', '),
      githubUrl: project.github_url ?? '',
    });
    this.beginEdit(project.id);
  }

  override save(): void {
    if (!this.isFormValid()) {
      return;
    }
    const value = this.formModel();
    const existing = this.items().find(item => item.id === this.editingId());
    const project: Project = {
      id: this.editingId() ?? crypto.randomUUID(),
      name: value.name.trim(),
      description: value.description.trim(),
      tags: value.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      github_url: value.githubUrl.trim() || null,
      sort_order: existing?.sort_order ?? this.items().length,
    };

    const call$ = this.isEditing()
      ? this.projectsService.update(project.id, project)
      : this.projectsService.create(project);

    call$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.projectsService.reload();
        this.closeForm();
      },
    });
  }

  override remove(id: string): void {
    this.projectsService
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.projectsService.reload() });
  }
}
