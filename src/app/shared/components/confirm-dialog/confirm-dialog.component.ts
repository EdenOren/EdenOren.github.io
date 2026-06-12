import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  public readonly message = input.required<string>();
  public readonly confirm = output<void>();
  public readonly cancel = output<void>();

  protected onConfirm(): void {
    this.confirm.emit();
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
