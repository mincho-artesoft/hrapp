import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';
import { clamp, isBrowser, isCoarsePointer, lerp, prefersReducedMotion } from './motion';

/**
 * Pointer-driven 3D tilt.
 *
 * Rotates the host toward the cursor and publishes the normalised cursor
 * position as `--mx` / `--my` (0..1) plus `--tilt` (0..1 proximity), which the
 * component's own stylesheet uses to move specular highlights and shadows in
 * sync with the rotation. Without the matching highlight the tilt reads as a
 * cheap CSS trick; with it, the surface reads as glass.
 *
 * Disabled on touch devices and under prefers-reduced-motion.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  /** Captured here because a field initialiser is an injection context;
   *  method bodies are not. */
  private readonly browser = isBrowser();

  /** Maximum rotation in degrees. */
  @Input() tiltMax = 9;
  /** How far the element lifts toward the viewer, in px. */
  @Input() tiltLift = 14;
  /** Scale applied while hovered. */
  @Input() tiltScale = 1.015;
  /** Smoothing factor, 0..1 — lower is heavier. */
  @Input() tiltEase = 0.12;

  private raf = 0;
  private active = false;
  private enabled = false;

  private targetX = 0;
  private targetY = 0;
  private curX = 0;
  private curY = 0;
  private targetAmount = 0;
  private curAmount = 0;

  ngAfterViewInit(): void {
    if (!this.browser || prefersReducedMotion() || isCoarsePointer()) return;

    this.enabled = true;
    const el = this.host.nativeElement as HTMLElement;
    el.style.transformStyle = 'preserve-3d';
    // will-change is applied on enter and dropped on settle: leaving it on
    // permanently pins a composited layer per element for the whole session.

    this.zone.runOutsideAngular(() => {
      el.addEventListener('pointerenter', this.onEnter);
      el.addEventListener('pointermove', this.onMove);
      el.addEventListener('pointerleave', this.onLeave);
    });
  }

  ngOnDestroy(): void {
    if (!this.enabled) return;
    const el = this.host.nativeElement as HTMLElement;
    el.removeEventListener('pointerenter', this.onEnter);
    el.removeEventListener('pointermove', this.onMove);
    el.removeEventListener('pointerleave', this.onLeave);
    cancelAnimationFrame(this.raf);
  }

  private readonly onEnter = (): void => {
    this.targetAmount = 1;
    (this.host.nativeElement as HTMLElement).style.willChange = 'transform';
    this.startLoop();
  };

  private readonly onMove = (e: PointerEvent): void => {
    const el = this.host.nativeElement as HTMLElement;
    const r = el.getBoundingClientRect();
    const nx = clamp((e.clientX - r.left) / Math.max(1, r.width));
    const ny = clamp((e.clientY - r.top) / Math.max(1, r.height));

    // Rotate *toward* the pointer: cursor right → right edge recedes.
    this.targetX = (0.5 - ny) * 2;
    this.targetY = (nx - 0.5) * 2;

    el.style.setProperty('--mx', nx.toFixed(4));
    el.style.setProperty('--my', ny.toFixed(4));
  };

  private readonly onLeave = (): void => {
    this.targetAmount = 0;
    this.targetX = 0;
    this.targetY = 0;
  };

  private startLoop(): void {
    if (this.active) return;
    this.active = true;

    const el = this.host.nativeElement as HTMLElement;
    const step = () => {
      this.curX = lerp(this.curX, this.targetX, this.tiltEase);
      this.curY = lerp(this.curY, this.targetY, this.tiltEase);
      this.curAmount = lerp(this.curAmount, this.targetAmount, this.tiltEase);

      const rx = (this.curX * this.tiltMax).toFixed(3);
      const ry = (this.curY * this.tiltMax).toFixed(3);
      const z = (this.curAmount * this.tiltLift).toFixed(2);
      const s = (1 + (this.tiltScale - 1) * this.curAmount).toFixed(4);

      el.style.transform =
        `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(0,0,${z}px) scale(${s})`;
      el.style.setProperty('--tilt', this.curAmount.toFixed(4));

      const settled =
        this.targetAmount === 0 &&
        Math.abs(this.curAmount) < 0.002 &&
        Math.abs(this.curX) < 0.002 &&
        Math.abs(this.curY) < 0.002;

      if (settled) {
        el.style.transform = '';
        el.style.willChange = '';
        el.style.setProperty('--tilt', '0');
        this.active = false;
        return;
      }
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }
}
