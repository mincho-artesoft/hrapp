import { DestroyRef, Injectable, NgZone, inject, signal } from '@angular/core';
import { clamp, isBrowser, lerp, prefersReducedMotion } from './motion';

export interface PointerState {
  /** 0..1 across the viewport. */
  x: number;
  y: number;
  /** -1..1, eased — what parallax should actually read. */
  ex: number;
  ey: number;
}

/**
 * One frame scheduler for scroll- and pointer-driven effects across the site.
 *
 * Every scroll- or pointer-driven effect subscribes here instead of adding its
 * own listener, so we pay for exactly one rAF, one scroll listener and one
 * pointer listener no matter how many animated sections are on the page.
 * Values are exposed as signals only. They are deliberately *not* published as
 * custom properties on <html>: an inherited custom property set on the root
 * element invalidates style for the whole document, so doing it per frame
 * costs far more than the effects it drives.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  /** Captured here because a field initialiser is an injection context;
   *  method bodies are not. */
  private readonly browser = isBrowser();

  /** Raw scrollTop in px. */
  readonly scrollY = signal(0);
  /** 0..1 through the whole document. */
  readonly progress = signal(0);
  /** Pixels per frame, smoothed — used for velocity-reactive effects. */
  readonly velocity = signal(0);
  readonly pointer = signal<PointerState>({ x: 0.5, y: 0.5, ex: 0, ey: 0 });
  readonly isScrolled = signal(false);

  private readonly listeners = new Set<(t: number) => void>();

  private rafId: number | null = null;
  private lastY = 0;
  private smoothVel = 0;
  private targetPX = 0.5;
  private targetPY = 0.5;
  private easedPX = 0.5;
  private easedPY = 0.5;
  private calm = false;

  constructor() {
    if (!this.browser) return;

    this.calm = prefersReducedMotion();

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
      if (!this.calm) {
        window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      }
      this.onScroll();
    });

    this.destroyRef.onDestroy(() => this.dispose());
  }

  /** Notify a scroll effect when input, layout or easing changes. */
  onFrame(fn: (time: number) => void): () => void {
    this.listeners.add(fn);
    this.requestFrame();
    return () => this.listeners.delete(fn);
  }

  requestFrame(): void {
    if (!this.browser || this.rafId !== null) return;
    this.rafId = this.zone.runOutsideAngular(() => requestAnimationFrame(this.tick));
  }

  private readonly tick = (time: number): void => {
    this.rafId = null;
    const easing = Math.abs(this.targetPX - this.easedPX) > 0.0008 ||
      Math.abs(this.targetPY - this.easedPY) > 0.0008;
    const x = this.easedPX = easing ? lerp(this.easedPX, this.targetPX, 0.075) : this.targetPX;
    const y = this.easedPY = easing ? lerp(this.easedPY, this.targetPY, 0.075) : this.targetPY;
    const previous = this.pointer();
    if (previous.x !== x || previous.y !== y) {
      this.pointer.set({ x, y, ex: (x - 0.5) * 2, ey: (y - 0.5) * 2 });
    }
    this.smoothVel = lerp(this.smoothVel, 0, 0.08);
    if (Math.abs(this.smoothVel) < 0.01) this.smoothVel = 0;
    if (!this.smoothVel || Math.abs(this.velocity() - this.smoothVel) > 0.05) {
      this.velocity.set(this.smoothVel);
    }
    for (const fn of this.listeners) fn(time);
    if (easing || this.smoothVel !== 0) this.requestFrame();
  };

  private readonly onScroll = (): void => {
    const y = window.scrollY || window.pageYOffset || 0;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    this.smoothVel = lerp(this.smoothVel, y - this.lastY, 0.5);
    this.lastY = y;

    this.scrollY.set(y);
    this.progress.set(clamp(y / max));

    const scrolled = y > 24;
    if (scrolled !== this.isScrolled()) this.isScrolled.set(scrolled);
    this.requestFrame();
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    this.targetPX = clamp(e.clientX / Math.max(1, window.innerWidth));
    this.targetPY = clamp(e.clientY / Math.max(1, window.innerHeight));
    this.requestFrame();
  };

  private dispose(): void {
    if (!this.browser) return;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    window.removeEventListener('pointermove', this.onPointerMove);
    this.listeners.clear();
  }
}
