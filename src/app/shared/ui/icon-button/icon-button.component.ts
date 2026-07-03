import { ChangeDetectionStrategy, Component, InputSignal, input } from '@angular/core';
import { ButtonType } from '../../enums/button.enums';

@Component({
  selector: 'app-icon-button',
  imports: [],
  template: `
    <button
      class="icon-button"
      [class.icon-button--icon-only]="iconOnly()"
      [type]="buttonType()"
      [attr.aria-expanded]="ariaExpanded()"
      [attr.aria-haspopup]="ariaHasPopup() || null">
      <span
        class="icon-button__icon"
        [style.maskImage]="'url(' + iconSrc() + ')'"
        [style.width.px]="iconWidth()"
        [style.height.px]="iconHeight()"
        aria-hidden="true">
      </span>
      @if (label()) {
        <span class="icon-button__label">{{ label() }}</span>
      }
    </button>
  `,
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  readonly iconSrc: InputSignal<string> = input.required<string>();
  readonly iconWidth: InputSignal<number> = input<number>(16);
  readonly iconHeight: InputSignal<number> = input<number>(16);
  readonly label: InputSignal<string> = input<string>('');
  readonly buttonType: InputSignal<ButtonType> = input<ButtonType>(ButtonType.Button);
  readonly ariaExpanded: InputSignal<boolean | null> = input<boolean | null>(null);
  readonly ariaHasPopup: InputSignal<boolean> = input<boolean>(false);
  readonly iconOnly: InputSignal<boolean> = input<boolean>(false);
}
