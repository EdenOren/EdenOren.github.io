import { afterNextRender, DestroyRef, Directive, ElementRef, inject, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  host: { class: 'scroll-reveal' },
})
export class ScrollRevealDirective {
  private readonly elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender((): void => {
      const element: HTMLElement = this.elementRef.nativeElement;

      const observer = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]): void => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.renderer.addClass(element, 'is-visible');
              observer.unobserve(element);
            }
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(element);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
