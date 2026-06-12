import { ChangeDetectionStrategy, Component, Signal, WritableSignal, inject } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { Project } from '../../../projects/models/projects.models';
import { AdminProjectsFacade } from './facades/admin-projects.facade';

@Component({
  selector: 'app-admin-projects',
  imports: [FormField],
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

  protected remove(id: string): void {
    this.adminProjectsFacade.remove(id);
  }
}
