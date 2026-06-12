import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminSkillGroup } from '../../models/admin.models';
import { AdminSkillsFacade } from './facades/admin-skills.facade';
import { ButtonSize, ButtonVariant } from '../../../../shared/enums/button.enums';
import { CtaButtonComponent } from '../../../../shared/ui/cta-button/cta-button.component';
import { TagComponent } from '../../../../shared/ui/tag/tag.component';

@Component({
  selector: 'app-admin-skills',
  imports: [FormField, CtaButtonComponent, TagComponent, TranslatePipe],
  providers: [AdminSkillsFacade],
  templateUrl: './admin-skills.component.html',
  styleUrl: './admin-skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSkillsComponent {
  private readonly adminSkillsFacade: AdminSkillsFacade = inject(AdminSkillsFacade);

  protected readonly buttonVariant: typeof ButtonVariant = ButtonVariant;
  protected readonly buttonSize: typeof ButtonSize = ButtonSize;

  protected readonly groups: Signal<AdminSkillGroup[]> = this.adminSkillsFacade.items;
  protected readonly isFormOpen: Signal<boolean> = this.adminSkillsFacade.isFormOpen;
  protected readonly isEditing: Signal<boolean> = this.adminSkillsFacade.isEditing;
  protected readonly isFormValid: Signal<boolean> = this.adminSkillsFacade.isFormValid;
  protected readonly labelField: FieldTree<string> = this.adminSkillsFacade.labelField;
  protected readonly skillsField: FieldTree<string> = this.adminSkillsFacade.skillsField;

  protected openAdd(): void {
    this.adminSkillsFacade.openAdd();
  }

  protected openEdit(group: AdminSkillGroup): void {
    this.adminSkillsFacade.openEdit(group);
  }

  protected closeForm(): void {
    this.adminSkillsFacade.closeForm();
  }

  protected save(): void {
    this.adminSkillsFacade.save();
  }

  protected onDeleteClick(id: string): void {
    this.adminSkillsFacade.requestDelete(id);
  }
}
