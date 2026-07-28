import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';
import { isBrowser, prefersReducedMotion } from './motion';

export type RevealKind = 'up' | 'zoom' | 'left' | 'right' | 'rotate' | 'fade';

/**
 * Reveals an element as it enters the viewport.
 *
 * The actual animation lives in styles.scss (`[data-reveal]`), so the directive
 * only has to flip a class — which keeps it off the main thread and lets the
 * markup stay declarative:
 *
 *   <div appReveal="rotate" [revealDelay]="120">…</div>
 *
 * `appRevealStagger` on a parent cascades the delay across its children.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);

  /** Animation flavour. */
  @Input('appReveal') kind: RevealKind | '' = 'up';
  /** Delay in ms before the reveal runs. */
  @Input() revealDelay = 0;
  /** How much of the element must be visible (0..1). */
  @Input() revealThreshold = 0.12;
  /** Replay the animation every time it re-enters the viewport. */
  @Input() revealRepeat = false;

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const el = this.host.nativeElement as HTMLElement;
    el.setAttribute('data-reveal', this.kind || 'up');

    if (this.revealDelay) {
      el.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);
    }

    if (!isBrowser() || prefersReducedMotion() || !('IntersectionObserver' in window)) {
      el.classList.add('is-revealed');
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              el.classList.add('is-revealed');
              if (!this.revealRepeat) this.observer?.unobserve(el);
            } else if (this.revealRepeat) {
              el.classList.remove('is-revealed');
            }
          }
        },
        { threshold: this.revealThreshold, rootMargin: '0px 0px -8% 0px' },
      );
      this.observer.observe(el);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}

/**
 * Cascades reveal delays across direct children so a grid arrives as a wave
 * rather than all at once.
 */
@Directive({
  selector: '[appRevealStagger]',
  standalone: true,
})
export class RevealStaggerDirective implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Milliseconds between each child. */
  @Input('appRevealStagger') step: number | string = 90;
  /** Offset applied to every child. */
  @Input() staggerFrom = 0;

  ngAfterViewInit(): void {
    const step = Number(this.step) || 90;
    const children = Array.from(this.host.nativeElement.children) as HTMLElement[];
    children.forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${this.staggerFrom + i * step}ms`);
    });
  }
}
