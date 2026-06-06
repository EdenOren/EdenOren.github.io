import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  imports: [],
  template: `
    <div class="skeleton-loader" [style.height]="height()" [style.width]="width()"></div>
  `,
  styleUrl: './skeleton-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonLoaderComponent {
  readonly height = input<string>('1rem');
  readonly width = input<string>('100%');
}
