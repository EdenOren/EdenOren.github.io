import { Service, inject } from '@angular/core';
import { AdminService } from '../../../core/services/data/admin.service';

@Service({ autoProvided: false })
export class AdminFacade {
  private readonly adminService = inject(AdminService);
}
