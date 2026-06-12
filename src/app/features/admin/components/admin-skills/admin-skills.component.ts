import { ChangeDetectionStrategy, Component, DestroyRef, Signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FieldTree, FormField } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { AdminSkillGroup } from '../../models/admin.models';
import { AdminSkillsFacade } from './facades/admin-skills.facade';
import { ConfirmDialogService } from '../../../../core/services/platform/confirm-dialog.service';

@Component({
  selector: 'app-admin-skills',
  imports: [FormField],
  providers: [AdminSkillsFacade],
  templateUrl: './admin-skills.component.html',
  styleUrl: './admin-skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSkillsComponent {
  private readonly adminSkillsFacade: AdminSkillsFacade = inject(AdminSkillsFacade);
  private readonly confirmDialogService: ConfirmDialogService = inject(ConfirmDialogService);
  private readonly translateService: TranslateService = inject(TranslateService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

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
    const group: AdminSkillGroup | undefined = this.groups().find(g => g.id === id);
    const message: string = group
      ? this.translateService.instant('ADMIN.CONFIRM_DELETE_NAMED', { name: group.label })
      : this.translateService.instant('ADMIN.CONFIRM_DELETE');
    this.confirmDialogService.open(message)
      .pipe(filter(confirmed => confirmed), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.adminSkillsFacade.remove(id));
  }
}
