import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdminFacade } from './admin.facade';

@Component({
  selector: 'app-admin',
  imports: [],
  providers: [AdminFacade],
  template: `<section class="admin"><!-- feature/admin-panel --></section>`,
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  protected readonly facade = inject(AdminFacade);
}
