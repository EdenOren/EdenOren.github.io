import { Signal, computed, inject } from '@angular/core';
import {HttpClient, HttpResourceRef} from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiPath } from '../../enums/core.enums';

export abstract class BaseDataService<T extends { id: string }> {
  protected abstract readonly apiPath: ApiPath;

  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly resource: HttpResourceRef<T[] | undefined> = httpResource<T[]>(() => `${this.baseUrl}`);

  readonly items: Signal<T[]> = computed(() => this.resource.value() ?? []);
  readonly isLoading: Signal<boolean> = this.resource.isLoading;
  readonly isError: Signal<boolean> = computed(() => this.resource.error() !== undefined);

  private get baseUrl(): string {
    return `${environment.apiBaseUrl}api/${this.apiPath}`;
  }

  reload(): void {
    this.resource.reload();
  }

  create(item: T): Observable<T> {
    return this.httpClient.post<T>(this.baseUrl, item);
  }

  update(id: string, item: T): Observable<T> {
    return this.httpClient.patch<T>(`${this.baseUrl}/${id}`, item);
  }

  delete(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
