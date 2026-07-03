import { Service, Signal, computed, inject } from '@angular/core';
import { HttpClient, HttpResourceRef, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AboutData } from '../../../features/about/models/about.models';
import { ApiOkResponse } from '../../../shared/models/api.models';

@Service()
export class AboutService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly resource: HttpResourceRef<AboutData | undefined> =
    httpResource<AboutData>(() => `${environment.apiBaseUrl}api/about`);

  readonly data: Signal<AboutData | undefined> = computed(() => this.resource.value());
  readonly isLoading: Signal<boolean> = this.resource.isLoading;

  reload(): void {
    this.resource.reload();
  }

  update(payload: Partial<Omit<AboutData, 'id'>>): Observable<ApiOkResponse> {
    return this.httpClient.patch<ApiOkResponse>(
      `${environment.apiBaseUrl}api/admin/about`,
      payload
    );
  }
}
