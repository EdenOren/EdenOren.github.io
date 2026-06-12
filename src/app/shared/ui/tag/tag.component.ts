import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input } from '@angular/core';
import { TagVariant } from '../../enums/tag.enum';

@Component({
  selector: 'app-tag',
  imports: [],
  template: `<ng-content />`,
  host: {
    'class': 'tag',
    '[class.tag--accent]': 'isAccentVariant()',
    '[class.tag--hoverable]': 'hoverable()',
  },
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly variant: InputSignal<TagVariant> = input<TagVariant>(TagVariant.Default);
  readonly hoverable: InputSignal<boolean> = input<boolean>(false);

  protected readonly isAccentVariant: Signal<boolean> = computed(() => this.variant() === TagVariant.Accent);
}
