import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class AdminService {
  private readonly http: HttpClient = inject(HttpClient);

  verify(): Observable<void> {
    return this.http.get<void>(`${environment.apiBaseUrl}api/admin/verify`);
  }
}
