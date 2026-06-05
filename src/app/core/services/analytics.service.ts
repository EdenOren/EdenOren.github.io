import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  // TODO: wire up analytics provider (e.g. Google Analytics)
  trackEvent(_name: string, _params?: Record<string, unknown>): void {}
}
