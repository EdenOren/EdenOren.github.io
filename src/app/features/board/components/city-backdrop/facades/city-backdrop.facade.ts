import { DOCUMENT } from '@angular/common';
import { Service, Signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, map } from 'rxjs';
import { CITY_REDUCED_MOTION_QUERY, CITY_WIDE_QUERY } from '../../../utils/board.const';

@Service({ autoProvided: false })
export class CityBackdropFacade {
  private readonly document: Document = inject(DOCUMENT);

  readonly isPageVisible: Signal<boolean> = toSignal(
    fromEvent(this.document, 'visibilitychange').pipe(map(() => !this.document.hidden)),
    { initialValue: !this.document.hidden }
  );

  readonly prefersReducedMotion: Signal<boolean> = this.matchMedia(CITY_REDUCED_MOTION_QUERY);
  readonly isWide: Signal<boolean> = this.matchMedia(CITY_WIDE_QUERY);

  readonly isAnimating: Signal<boolean> = computed(
    () => this.isPageVisible() && !this.prefersReducedMotion()
  );
  readonly isPaused: Signal<boolean> = computed(() => !this.isAnimating());

  private matchMedia(query: string): Signal<boolean> {
    const mediaQuery = this.document.defaultView?.matchMedia(query);
    if (!mediaQuery) {
      return computed(() => false);
    }
    return toSignal(
      fromEvent<MediaQueryListEvent>(mediaQuery, 'change').pipe(map(event => event.matches)),
      { initialValue: mediaQuery.matches }
    );
  }
}
