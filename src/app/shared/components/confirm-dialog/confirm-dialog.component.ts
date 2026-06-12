import { ChangeDetectionStrategy, Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonVariant } from '../../enums/button.enums';
import { CtaButtonComponent } from '../../ui/cta-button/cta-button.component';

@Component({
  selector: 'confirm-dialog',
  imports: [TranslatePipe, CtaButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly message: InputSignal<string> = input.required<string>();
  readonly confirm: OutputEmitterRef<void> = output<void>();
  readonly cancel: OutputEmitterRef<void> = output<void>();

  protected readonly buttonVariant: typeof ButtonVariant = ButtonVariant;

  protected onConfirm(): void {
    this.confirm.emit();
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
