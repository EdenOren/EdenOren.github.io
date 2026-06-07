import { Signal, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApiPath } from '../../enums/core.enums';

export abstract class BaseDataService<T> {
  protected abstract readonly apiPath: ApiPath;

  private readonly resource = httpResource<T[]>(
    () => `${environment.apiBaseUrl}/api/${this.apiPath}`
  );

  readonly items: Signal<T[]> = computed(() => this.resource.value() ?? []);
  readonly isLoading: Signal<boolean> = this.resource.isLoading;
  readonly isError: Signal<boolean> = computed(() => this.resource.error() !== undefined);
}
