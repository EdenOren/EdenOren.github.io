import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminFacade } from './admin.facade';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  template: `<section class="admin"><!-- feature/admin-panel --></section>`,
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  protected readonly facade = inject(AdminFacade);
}
