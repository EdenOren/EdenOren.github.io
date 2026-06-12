import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input } from '@angular/core';
import { ButtonSize, ButtonType, ButtonVariant } from '../../enums/button.enums';

@Component({
  selector: 'app-button',
  imports: [],
  template: `
    <button
      class="cta-button"
      [class.cta-button--filled]="isFilledVariant()"
      [class.cta-button--outline]="isOutlineVariant()"
      [class.cta-button--ghost]="isGhostVariant()"
      [class.cta-button--danger]="isDangerVariant()"
      [class.cta-button--compact]="isCompactSize()"
      [class.cta-button--loading]="loading()"
      [type]="buttonType()"
      [disabled]="loading() || disabled()">
      @if (loading()) {
        <span class="cta-button__spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styleUrl: './cta-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaButtonComponent {
  readonly variant: InputSignal<ButtonVariant> = input<ButtonVariant>(ButtonVariant.Filled);
  readonly size: InputSignal<ButtonSize> = input<ButtonSize>(ButtonSize.Default);
  readonly loading: InputSignal<boolean> = input<boolean>(false);
  readonly disabled: InputSignal<boolean> = input<boolean>(false);
  readonly buttonType: InputSignal<ButtonType> = input<ButtonType>(ButtonType.Button);

  protected readonly isFilledVariant: Signal<boolean> = computed(() => this.variant() === ButtonVariant.Filled);
  protected readonly isOutlineVariant: Signal<boolean> = computed(() => this.variant() === ButtonVariant.Outline);
  protected readonly isGhostVariant: Signal<boolean> = computed(() => this.variant() === ButtonVariant.Ghost);
  protected readonly isDangerVariant: Signal<boolean> = computed(() => this.variant() === ButtonVariant.Danger);
  protected readonly isCompactSize: Signal<boolean> = computed(() => this.size() === ButtonSize.Compact);
}
