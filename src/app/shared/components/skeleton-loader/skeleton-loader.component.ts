import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input } from '@angular/core';
import { SkeletonType } from '../../enums/shared.enums';

@Component({
  selector: 'app-skeleton-loader',
  imports: [],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLoaderComponent {
  readonly type: InputSignal<SkeletonType> = input<SkeletonType>(SkeletonType.Bar);
  readonly count: InputSignal<number> = input<number>(3);
  readonly height: InputSignal<string> = input<string>('1rem');
  readonly width: InputSignal<string> = input<string>('100%');
  readonly ariaLabel: InputSignal<string> = input<string>('Loading…');

  protected readonly SkeletonType: typeof SkeletonType = SkeletonType;
  protected readonly countArray: Signal<number[]> = computed(() =>
    Array.from({ length: this.count() }, (_, index) => index)
  );
}
