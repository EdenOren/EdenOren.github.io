import { Injectable, inject } from '@angular/core';
import { AdminService } from './admin.service';

@Injectable({ providedIn: 'root' })
export class AdminFacade {
  private readonly service = inject(AdminService);
}
