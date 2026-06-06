import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AboutFacade } from './about.facade';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly facade = inject(AboutFacade);
}
