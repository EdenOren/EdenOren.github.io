import { ChangeDetectionStrategy, Component, InputSignal, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  imports: [],
  template: `<h2 class="section-header__heading">{{ heading() }}</h2>`,
  styleUrl: './section-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeaderComponent {
  readonly heading: InputSignal<string> = input.required<string>();
}
