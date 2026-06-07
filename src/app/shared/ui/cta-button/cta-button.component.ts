import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input } from '@angular/core';
import { ButtonType, ButtonVariant } from '../../enums/button.enums';

@Component({
  selector: 'app-cta-button',
  imports: [],
  template: `
    <button
      class="cta-button"
      [class.cta-button--filled]="isFilledVariant()"
      [class.cta-button--outline]="isOutlineVariant()"
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
  readonly loading: InputSignal<boolean> = input<boolean>(false);
  readonly disabled: InputSignal<boolean> = input<boolean>(false);
  readonly buttonType: InputSignal<ButtonType> = input<ButtonType>(ButtonType.Button);

  protected readonly isFilledVariant: Signal<boolean> = computed(() => this.variant() === ButtonVariant.Filled);
  protected readonly isOutlineVariant: Signal<boolean> = computed(() => this.variant() === ButtonVariant.Outline);
}
