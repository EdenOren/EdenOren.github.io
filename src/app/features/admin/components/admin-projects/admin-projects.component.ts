import { ChangeDetectionStrategy, Component, Signal, WritableSignal, inject } from '@angular/core';
import { Project } from '../../models/admin.models';
import { AdminProjectsFacade } from './facades/admin-projects.facade';

@Component({
  selector: 'app-admin-projects',
  imports: [],
  providers: [AdminProjectsFacade],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProjectsComponent {
  private readonly adminProjectsFacade: AdminProjectsFacade = inject(AdminProjectsFacade);

  protected readonly projects: WritableSignal<Project[]> = this.adminProjectsFacade.items;
  protected readonly isFormOpen: WritableSignal<boolean> = this.adminProjectsFacade.isFormOpen;
  protected readonly titleField: WritableSignal<string> = this.adminProjectsFacade.titleField;
  protected readonly descriptionField: WritableSignal<string> = this.adminProjectsFacade.descriptionField;
  protected readonly tagsField: WritableSignal<string> = this.adminProjectsFacade.tagsField;
  protected readonly githubUrlField: WritableSignal<string> = this.adminProjectsFacade.githubUrlField;
  protected readonly liveUrlField: WritableSignal<string> = this.adminProjectsFacade.liveUrlField;
  protected readonly featuredField: WritableSignal<boolean> = this.adminProjectsFacade.featuredField;
  protected readonly isEditing: Signal<boolean> = this.adminProjectsFacade.isEditing;
  protected readonly isFormValid: Signal<boolean> = this.adminProjectsFacade.isFormValid;

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
