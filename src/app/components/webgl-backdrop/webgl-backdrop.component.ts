import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

import { ScrollService } from '../../core/scroll.service';
import { canRunHeavyScene, clamp, isBrowser } from '../../core/motion';
import type { BackdropScene } from './scene';

/**
 * The live 3D backdrop behind the hero.
 *
 * Three layers, no post-processing pass — glow is baked into the shaders:
 *
 *   1. a starfield that parallaxes with the pointer and dives on scroll
 *   2. an aurora dome of flowing noise ribbons
 *   3. a receding "time horizon" grid whose lines march toward the camera
 *
 * Where it runs matters as much as what it draws. The preferred path hands the
 * canvas to a worker via `transferControlToOffscreen()`, so three.js is parsed
 * and every frame is built and submitted off the main thread — scrolling stays
 * responsive while the scene animates. Browsers without OffscreenCanvas fall
 * back to the identical scene on the main thread, and devices that fail
 * `canRunHeavyScene()` get the CSS gradient underneath instead.
 */
@Component({
  selector: 'app-webgl-backdrop',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop" [class.is-live]="live()">
      <canvas #canvas class="backdrop__canvas" aria-hidden="true"></canvas>
      <div class="backdrop__fallback" aria-hidden="true"></div>
      <div class="backdrop__vignette" aria-hidden="true"></div>
    </div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        display: block;
        pointer-events: none;
        overflow: hidden;
      }

      .backdrop,
      .backdrop__canvas,
      .backdrop__fallback,
      .backdrop__vignette {
        position: absolute;
        inset: 0;
      }

      .backdrop__canvas {
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 1.6s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .backdrop.is-live .backdrop__canvas {
        opacity: 1;
      }

      /* Static stand-in — also visible *through* the canvas, which is what
         gives the scene its colour depth rather than sitting on pure black. */
      .backdrop__fallback {
        z-index: -1;
        background:
          radial-gradient(70% 52% at 50% 4%, rgba(77, 124, 255, 0.34), transparent 68%),
          radial-gradient(46% 40% at 14% 26%, rgba(165, 102, 255, 0.28), transparent 70%),
          radial-gradient(50% 44% at 88% 20%, rgba(56, 224, 240, 0.2), transparent 70%),
          radial-gradient(80% 50% at 50% 104%, rgba(56, 224, 240, 0.12), transparent 70%);
      }

      /* Keeps the centre of the composition dark enough for white type. */
      .backdrop__vignette {
        background:
          radial-gradient(58% 46% at 50% 42%, rgba(3, 5, 12, 0.62), transparent 72%),
          linear-gradient(180deg, rgba(3, 5, 12, 0.7) 0%, transparent 22%, transparent 62%, rgba(3, 5, 12, 0.94) 100%);
      }
    `,
  ],
})
export class WebglBackdropComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  /** Overall brightness of the aurora, 0..1. */
  @Input() intensity = 1;
  /** Star count. Scaled down automatically on small screens. */
  @Input() starCount = 2600;

  private readonly zone = inject(NgZone);
  private readonly scroll = inject(ScrollService);

  readonly live = signal(false);

  private worker?: Worker;
  /** Only set on the fallback path. */
  private scene?: BackdropScene;
  private rafId = 0;
  private startedAt = 0;

  private offFrame?: () => void;
  private resizeObserver?: ResizeObserver;
  private intersection?: IntersectionObserver;

  private visible = true;
  private destroyed = false;
  private lastSent = { x: 9, y: 9, p: 9 };

  // --------------------------------------------------------------- lifecycle

  ngAfterViewInit(): void {
    if (!isBrowser() || !canRunHeavyScene()) return;

    // Never block first paint on the 3D scene.
    const boot = () => this.zone.runOutsideAngular(() => { void this.init(); });
    if ('requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void, o?: object) => number })
        .requestIdleCallback(boot, { timeout: 900 });
    } else {
      setTimeout(boot, 220);
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.dispose();
  }

  // -------------------------------------------------------------------- init

  private async init(): Promise<void> {
    const canvas = this.canvasRef.nativeElement;
    const host = canvas.parentElement as HTMLElement;
    const { width, height } = this.measure(host);
    const pixelRatio = this.ratio();

    const started =
      this.tryWorker(canvas, width, height, pixelRatio) ||
      (await this.tryMainThread(canvas, width, height, pixelRatio));

    if (!started || this.destroyed) return;

    this.watch(host);
    this.zone.run(() => this.live.set(true));
  }

  /** Preferred path: render on a worker thread. */
  private tryWorker(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    pixelRatio: number,
  ): boolean {
    if (typeof Worker === 'undefined') return false;
    if (typeof canvas.transferControlToOffscreen !== 'function') return false;

    let worker: Worker;
    try {
      worker = new Worker(new URL('./backdrop.worker', import.meta.url), { type: 'module' });
    } catch {
      return false; // module workers unsupported — canvas is untouched
    }

    try {
      const offscreen = canvas.transferControlToOffscreen();
      worker.postMessage(
        {
          type: 'init',
          canvas: offscreen,
          width,
          height,
          pixelRatio,
          intensity: this.intensity,
          starCount: this.starCount,
        },
        [offscreen],
      );
    } catch {
      worker.terminate();
      return false;
    }

    worker.addEventListener('message', ({ data }) => {
      if (data?.type === 'failed') this.dispose();
    });

    this.worker = worker;
    return true;
  }

  /** Fallback: identical scene, main thread. */
  private async tryMainThread(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    pixelRatio: number,
  ): Promise<boolean> {
    try {
      const { BackdropScene } = await import('./scene');
      if (this.destroyed) return false;

      this.scene = new BackdropScene({
        canvas,
        width,
        height,
        pixelRatio,
        intensity: this.intensity,
        starCount: this.starCount,
      });
      this.startedAt = performance.now();

      const tick = () => {
        this.rafId = requestAnimationFrame(tick);
        if (!this.visible || document.hidden || !this.scene) return;
        const p = this.scroll.pointer();
        this.scene.render((performance.now() - this.startedAt) / 1000, {
          pointerX: p.ex,
          pointerY: p.ey,
          progress: this.heroProgress(),
        });
      };
      this.rafId = requestAnimationFrame(tick);
      return true;
    } catch {
      return false;
    }
  }

  // ------------------------------------------------------------- main thread

  private watch(host: HTMLElement): void {
    // Feed the worker pointer and scroll values — but only when they move, so
    // a still page posts nothing at all.
    if (this.worker) {
      this.offFrame = this.scroll.onFrame(() => {
        if (!this.visible) return;
        const p = this.scroll.pointer();
        const x = +p.ex.toFixed(3);
        const y = +p.ey.toFixed(3);
        const prog = +this.heroProgress().toFixed(3);
        const last = this.lastSent;
        if (x === last.x && y === last.y && prog === last.p) return;
        this.lastSent = { x, y, p: prog };
        this.worker?.postMessage({ type: 'state', pointerX: x, pointerY: y, progress: prog });
      });
    }

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => this.onResize(host));
      this.resizeObserver.observe(host);
    } else {
      (window as Window).addEventListener('resize', () => this.onResize(host));
    }

    // Stop rendering entirely when the hero scrolls away or the tab is hidden.
    this.intersection = new IntersectionObserver(([e]) => this.setVisible(e.isIntersecting));
    this.intersection.observe(host);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  private setVisible(value: boolean): void {
    if (value === this.visible) return;
    this.visible = value;
    this.worker?.postMessage({ type: 'running', value: value && !document.hidden });
  }

  private readonly onVisibility = (): void => {
    this.worker?.postMessage({ type: 'running', value: this.visible && !document.hidden });
  };

  private onResize(host: HTMLElement): void {
    const { width, height } = this.measure(host);
    const pixelRatio = this.ratio();
    this.worker?.postMessage({ type: 'resize', width, height, pixelRatio });
    this.scene?.resize(width, height, pixelRatio);
  }

  /**
   * Deliberately below the display's native ratio. The aurora is a soft,
   * blurry field, so the extra pixels cost real milliseconds and show nothing.
   */
  private ratio(): number {
    return Math.min(window.devicePixelRatio || 1, 1.35);
  }

  private measure(host: HTMLElement): { width: number; height: number } {
    return {
      width: host.clientWidth || window.innerWidth,
      height: host.clientHeight || window.innerHeight,
    };
  }

  /** 0 at the top of the page, 1 once the hero has scrolled away. */
  private heroProgress(): number {
    return clamp(this.scroll.scrollY() / Math.max(1, window.innerHeight));
  }

  // ----------------------------------------------------------------- cleanup

  private dispose(): void {
    cancelAnimationFrame(this.rafId);
    this.offFrame?.();
    this.resizeObserver?.disconnect();
    this.intersection?.disconnect();

    if (isBrowser()) {
      document.removeEventListener('visibilitychange', this.onVisibility);
    }

    if (this.worker) {
      const worker = this.worker;
      worker.postMessage({ type: 'dispose' });
      // Give it a beat to release the GL context before it is killed.
      setTimeout(() => worker.terminate(), 80);
      this.worker = undefined;
    }

    this.scene?.dispose();
    this.scene = undefined;
  }
}
