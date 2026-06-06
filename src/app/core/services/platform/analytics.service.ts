import { Service } from '@angular/core';

@Service()
export class AnalyticsService {
  // TODO: wire up analytics provider (e.g. Google Analytics)
  trackEvent(_name: string, _params?: Record<string, unknown>): void {}
}
