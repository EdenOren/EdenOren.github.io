import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Project } from '../../../projects/models/projects.models';
import { AdminProjectsFacade } from './facades/admin-projects.facade';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-projects',
  imports: [FormField, ConfirmDialogComponent],
  providers: [AdminProjectsFacade],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProjectsComponent {
  private readonly adminProjectsFacade: AdminProjectsFacade = inject(AdminProjectsFacade);

  protected readonly projects: WritableSignal<Project[]> = this.adminProjectsFacade.items;
  protected readonly isFormOpen: WritableSignal<boolean> = this.adminProjectsFacade.isFormOpen;
  protected readonly isEditing: Signal<boolean> = this.adminProjectsFacade.isEditing;
  protected readonly isFormValid: Signal<boolean> = this.adminProjectsFacade.isFormValid;
  protected readonly nameField: FieldTree<string> = this.adminProjectsFacade.nameField;
  protected readonly descriptionField: FieldTree<string> = this.adminProjectsFacade.descriptionField;
  protected readonly tagsField: FieldTree<string> = this.adminProjectsFacade.tagsField;
  protected readonly githubUrlField: FieldTree<string> = this.adminProjectsFacade.githubUrlField;

  private readonly deletingId: WritableSignal<string | null> = signal(null);
  protected readonly isDeleteDialogOpen: Signal<boolean> = computed(() => this.deletingId() !== null);
  protected readonly deleteDialogMessage: Signal<string> = computed(() => {
    const id = this.deletingId();
    if (id === null) { return ''; }
    const project = this.projects().find(p => p.id === id);
    return project ? `Delete "${project.name}"?` : 'Delete this item?';
  });

  protected openAdd(): void {
    this.adminProjectsFacade.openAdd();
  }

  protected openEdit(project: Project): void {
    this.adminProjectsFacade.openEdit(project);
  }

  protected closeForm(): void {
    this.adminProjectsFacade.closeForm();
  }

  protected save(): void {
    this.adminProjectsFacade.save();
  }

  protected openDeleteFor(id: string): void {
    this.deletingId.set(id);
  }

  protected confirmDelete(): void {
    const id = this.deletingId();
    if (id === null) { return; }
    this.deletingId.set(null);
    this.adminProjectsFacade.remove(id);
  }

  protected cancelDelete(): void {
    this.deletingId.set(null);
  }
}
