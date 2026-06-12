import { ChangeDetectionStrategy, Component, Signal, computed, inject } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { Project } from '../../../projects/models/projects.models';
import { AdminProjectsFacade } from './facades/admin-projects.facade';
import { ImageUploadComponent } from '../../../../shared/components/image-upload/image-upload.component';
import { ButtonSize, ButtonVariant } from '../../../../shared/enums/button.enums';
import { CtaButtonComponent } from '../../../../shared/ui/cta-button/cta-button.component';
import { TagComponent } from '../../../../shared/ui/tag/tag.component';

@Component({
  selector: 'app-admin-projects',
  imports: [FormField, ImageUploadComponent, CtaButtonComponent, TagComponent, TranslatePipe],
  providers: [AdminProjectsFacade],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProjectsComponent {
  private readonly adminProjectsFacade: AdminProjectsFacade = inject(AdminProjectsFacade);

  protected readonly buttonVariant: typeof ButtonVariant = ButtonVariant;
  protected readonly buttonSize: typeof ButtonSize = ButtonSize;

  protected readonly projects: Signal<Project[]> = this.adminProjectsFacade.items;
  protected readonly isFormOpen: Signal<boolean> = this.adminProjectsFacade.isFormOpen;
  protected readonly isEditing: Signal<boolean> = this.adminProjectsFacade.isEditing;
  protected readonly isFormValid: Signal<boolean> = this.adminProjectsFacade.isFormValid;
  protected readonly nameField: FieldTree<string> = this.adminProjectsFacade.nameField;
  protected readonly descriptionField: FieldTree<string> = this.adminProjectsFacade.descriptionField;
  protected readonly tagsField: FieldTree<string> = this.adminProjectsFacade.tagsField;
  protected readonly githubUrlField: FieldTree<string> = this.adminProjectsFacade.githubUrlField;

  protected readonly editingId: Signal<string | null> = this.adminProjectsFacade.editingId;
  protected readonly currentProjectImageUrl: Signal<string | null> = computed(() => {
    const id = this.editingId();
    if (id === null) {
      return null;
    }
    return this.projects().find(p => p.id === id)?.image_url ?? null;
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

  protected onFileSelected(file: File | null): void {
    this.adminProjectsFacade.setSelectedFile(file);
  }

  protected onDeleteClick(id: string): void {
    this.adminProjectsFacade.requestDelete(id);
  }
}
