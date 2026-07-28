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
 * A single requestAnimationFrame loop for the whole site.
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

  /** Raw scrollTop in px. */
  readonly scrollY = signal(0);
  /** 0..1 through the whole document. */
  readonly progress = signal(0);
  /** Pixels per frame, smoothed — used for velocity-reactive effects. */
  readonly velocity = signal(0);
  readonly pointer = signal<PointerState>({ x: 0.5, y: 0.5, ex: 0, ey: 0 });
  readonly isScrolled = signal(false);

  private readonly listeners = new Set<(t: number) => void>();

  private rafId = 0;
  private running = false;
  private lastY = 0;
  private smoothVel = 0;
  private targetPX = 0.5;
  private targetPY = 0.5;
  private easedPX = 0.5;
  private easedPY = 0.5;
  private calm = false;

  constructor() {
    if (!isBrowser()) return;

    this.calm = prefersReducedMotion();

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll, { passive: true });
      if (!this.calm) {
        window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      }
      this.onScroll();
      this.start();
    });

    this.destroyRef.onDestroy(() => this.dispose());
  }

  /** Register a per-frame callback. Returns an unsubscribe function. */
  onFrame(fn: (time: number) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // ---------------------------------------------------------------- internals

  private start(): void {
    if (this.running) return;
    this.running = true;
    const tick = (time: number) => {
      this.rafId = requestAnimationFrame(tick);

      // Ease the pointer so parallax glides instead of snapping.
      this.easedPX = lerp(this.easedPX, this.targetPX, 0.075);
      this.easedPY = lerp(this.easedPY, this.targetPY, 0.075);

      const px = this.easedPX;
      const py = this.easedPY;

      const prev = this.pointer();
      if (Math.abs(prev.x - px) > 0.0008 || Math.abs(prev.y - py) > 0.0008) {
        this.pointer.set({ x: px, y: py, ex: (px - 0.5) * 2, ey: (py - 0.5) * 2 });
      }

      // Decay velocity so it settles to zero when scrolling stops.
      this.smoothVel = lerp(this.smoothVel, 0, 0.08);
      if (Math.abs(this.smoothVel) < 0.01) this.smoothVel = 0;
      if (Math.abs(this.velocity() - this.smoothVel) > 0.05) {
        this.velocity.set(this.smoothVel);
      }

      for (const fn of this.listeners) fn(time);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private readonly onScroll = (): void => {
    const y = window.scrollY || window.pageYOffset || 0;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    this.smoothVel = lerp(this.smoothVel, y - this.lastY, 0.5);
    this.lastY = y;

    this.scrollY.set(y);
    this.progress.set(clamp(y / max));

    const scrolled = y > 24;
    if (scrolled !== this.isScrolled()) this.isScrolled.set(scrolled);
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    this.targetPX = clamp(e.clientX / Math.max(1, window.innerWidth));
    this.targetPY = clamp(e.clientY / Math.max(1, window.innerHeight));
  };

  private dispose(): void {
    if (!isBrowser()) return;
    cancelAnimationFrame(this.rafId);
    this.running = false;
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);
    window.removeEventListener('pointermove', this.onPointerMove);
    this.listeners.clear();
  }
}
