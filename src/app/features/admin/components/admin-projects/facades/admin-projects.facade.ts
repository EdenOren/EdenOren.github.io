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
import { TranslateService } from '@ngx-translate/core';
import { filter, switchMap } from 'rxjs';
import { FieldTree, form, required } from '@angular/forms/signals';
import { Project } from '../../../../../features/projects/models/projects.models';
import { ProjectsService } from '../../../../../core/services/data/projects.service';
import { UploadService } from '../../../../../core/services/data/upload.service';
import { ConfirmDialogService } from '../../../../../core/services/platform/confirm-dialog.service';
import { AdminCrudFacade } from '../../../facades/admin-crud.facade';

interface ProjectFormModel {
  name: string;
  description: string;
  tags: string;
  githubUrl: string;
  liveUrl: string;
}

@Service({ autoProvided: false })
export class AdminProjectsFacade extends AdminCrudFacade<Project> {
  private readonly projectsService: ProjectsService = inject(ProjectsService);
  private readonly uploadService: UploadService = inject(UploadService);
  private readonly confirmDialogService: ConfirmDialogService = inject(ConfirmDialogService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  override readonly items: WritableSignal<Project[]> = linkedSignal(() =>
    this.projectsService.items()
  );

  private readonly formModel: WritableSignal<ProjectFormModel> = signal({
    name: '',
    description: '',
    tags: '',
    githubUrl: '',
    liveUrl: '',
  });

  private readonly formTree: FieldTree<ProjectFormModel> = form(
    this.formModel,
    (p) => {
      required(p.name);
    }
  );

  private readonly selectedFile: WritableSignal<File | null> = signal(null);

  readonly nameField: FieldTree<string> = this.formTree.name;
  readonly descriptionField: FieldTree<string> = this.formTree.description;
  readonly tagsField: FieldTree<string> = this.formTree.tags;
  readonly githubUrlField: FieldTree<string> = this.formTree.githubUrl;
  readonly liveUrlField: FieldTree<string> = this.formTree.liveUrl;

  override readonly isFormValid: Signal<boolean> = computed(() => this.formTree().valid());

  setSelectedFile(file: File | null): void {
    this.selectedFile.set(file);
  }

  override openAdd(): void {
    this.formModel.set({ name: '', description: '', tags: '', githubUrl: '', liveUrl: '' });
    this.selectedFile.set(null);
    this.beginAdd();
  }

  override openEdit(project: Project): void {
    this.formModel.set({
      name: project.name,
      description: project.description,
      tags: project.tags.join(', '),
      githubUrl: project.github_url ?? '',
      liveUrl: project.live_url ?? '',
    });
    this.selectedFile.set(null);
    this.beginEdit(project.id);
  }

  override save(): void {
    if (!this.isFormValid()) {
      return;
    }

    const value = this.formModel();
    const existing = this.items().find(item => item.id === this.editingId());
    const file = this.selectedFile();

    const buildProject = (imageUrl: string | null): Project => ({
      id: this.editingId() ?? crypto.randomUUID(),
      name: value.name.trim(),
      description: value.description.trim(),
      tags: value.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      github_url: value.githubUrl.trim() || null,
      live_url: value.liveUrl.trim() || null,
      image_url: imageUrl,
      sort_order: existing?.sort_order ?? this.items().length,
    });

    const persist = (imageUrl: string | null) => {
      const project = buildProject(imageUrl);
      return this.isEditing()
        ? this.projectsService.update(project.id, project)
        : this.projectsService.create(project);
    };

    const save$ = file
      ? this.uploadService.upload(file).pipe(switchMap(({ url }) => persist(url)))
      : persist(existing?.image_url ?? null);

    save$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

  requestDelete(id: string): void {
    const project: Project | undefined = this.items().find(p => p.id === id);
    const message: string = project
      ? this.translateService.instant('ADMIN.CONFIRM_DELETE_NAMED', { name: project.name })
      : this.translateService.instant('ADMIN.CONFIRM_DELETE');
    this.confirmDialogService.open(message)
      .pipe(filter(confirmed => confirmed), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.remove(id));
  }
}
