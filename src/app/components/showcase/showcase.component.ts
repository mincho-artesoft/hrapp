import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
  computed,
  signal,
} from '@angular/core';

import { DeviceFrameComponent } from '../device-frame/device-frame.component';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { ScrollService } from '../../core/scroll.service';
import { clamp, isBrowser, prefersReducedMotion } from '../../core/motion';

export interface ShowcaseStep {
  readonly id: string;
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  readonly shot: string;
  readonly alt: string;
  readonly bullets: readonly string[];
  readonly hue: string;
}

/**
 * The product tour.
 *
 * A tall scroll track with a sticky stage. The copy advances as you scroll and
 * the screenshots move through a coverflow: the current one square on, the two
 * either side turned away, pushed back and dimmed. Scrolling slides the whole
 * carousel rather than cross-dissolving one image into another, so you can see
 * where you have been and what is coming — which a dissolve never showed.
 *
 * Every frame is written **straight to the elements**, not through a binding.
 * Five covers and five rail fills updated 60 times a second is 600 bindings a
 * second through change detection; the same values assigned to `style` cost
 * ten property writes and no change detection at all. `active()` is still a
 * signal because it changes a handful of times per section, not per frame.
 */
@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [DeviceFrameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
})
export class ShowcaseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('track', { static: true }) private trackRef!: ElementRef<HTMLElement>;
  @ViewChild('flow') private flowRef?: ElementRef<HTMLElement>;
  @ViewChildren('cover') private coverRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('fill') private fillRefs!: QueryList<ElementRef<HTMLElement>>;

  private readonly scroll = inject(ScrollService);
  /** Captured here because a field initialiser is an injection context;
   *  method bodies are not. */
  private readonly browser = isBrowser();
  private off?: () => void;
  private observer?: IntersectionObserver;
  private onScreen = false;

  private covers: HTMLElement[] = [];
  private fills: HTMLElement[] = [];
  private resizeObserver?: ResizeObserver;
  /** Continuous carousel position, in cover indices. */
  private pos = -1;
  /** Neighbour offset as a percentage of one cover's width; set from CSS. */
  private spread = 78;

  readonly active = signal(0);

  private readonly active_ = inject(ActiveLocaleService);
  readonly copy = computed(() => this.active_.copy().showcase);

  /**
   * Screenshot and hue live here; kicker, title, body, alt and bullets come
   * from the language. Pairing them by position rather than merging the two
   * into one translated object keeps a translator from ever being able to
   * point a panel at the wrong image.
   */
  private readonly visuals = [
    { id: 'day', shot: 'assets/images/app-screenshots/single-day-view.webp', hue: '210' },
    { id: 'week', shot: 'assets/images/app-screenshots/multi-day-view-v.webp', hue: '190' },
    { id: 'multi', shot: 'assets/images/app-screenshots/multi-calndar-view.webp', hue: '265' },
    { id: 'month', shot: 'assets/images/app-screenshots/month-view.webp', hue: '35' },
    { id: 'list', shot: 'assets/images/app-screenshots/list-view.webp', hue: '150' },
  ];

  readonly steps = computed<ShowcaseStep[]>(() =>
    this.visuals.map((v, i) => ({ ...v, ...this.copy().panels[i] })),
  );

  ngAfterViewInit(): void {
    if (!this.browser) return;

    this.covers = this.coverRefs.map((r) => r.nativeElement);
    this.fills = this.fillRefs.map((r) => r.nativeElement);

    const track = this.trackRef.nativeElement;
    const flow = this.flowRef?.nativeElement;

    // The spread is a CSS custom property, so it can change at a breakpoint.
    // Reading it costs a style resolution, which is why it happens when the
    // box changes rather than on every frame.
    if (flow) {
      this.readSpread(flow);
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => {
          this.readSpread(flow);
          const at = this.pos;
          this.pos = -1; // force a re-layout at the new spread
          this.layout(Math.max(0, at));
        });
        this.resizeObserver.observe(flow);
      }
    }

    // Lay the carousel out once before anything scrolls. This is also the
    // whole story under reduced motion: the first cover front and centre, the
    // rest parked where they would be, nothing moving.
    this.layout(0);

    if (prefersReducedMotion()) {
      this.active.set(0);
      return;
    }

    let lastIndex = -1;

    // getBoundingClientRect forces layout, so skip it entirely unless the
    // track is actually on screen rather than measuring and then bailing.
    // The same signal scopes `will-change` to the moments it earns its keep:
    // five promoted layers is real GPU memory to hold for a section that may
    // be a page and a half away.
    this.observer = new IntersectionObserver(([e]) => {
      this.onScreen = e.isIntersecting;
      flow?.classList.toggle('is-live', e.isIntersecting);
    });
    this.observer.observe(track);

    this.off = this.scroll.onFrame(() => {
      if (!this.onScreen) return;

      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      if (total <= 0) return;

      const p = clamp(-r.top / total);
      // Bias slightly so the first step is fully readable before it advances.
      const scaled = clamp(p * 1.06) * this.steps().length;
      const index = Math.min(this.steps().length - 1, Math.floor(scaled));

      // Half a step behind `scaled`, so a cover is dead centre in the middle
      // of its step rather than at its start — which also makes the copy swap
      // land exactly as the carousel passes the midpoint between two phones.
      const last = this.steps().length - 1;
      this.layout(Math.max(0, Math.min(last, scaled - 0.5)));
      this.setRail(index, scaled - index);

      if (index !== lastIndex) {
        lastIndex = index;
        this.active.set(index);
      }
    });
  }

  ngOnDestroy(): void {
    this.off?.();
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
  }

  /** Jump the page to a given step. Also what clicking a side cover does. */
  goTo(index: number): void {
    const track = this.trackRef.nativeElement;
    const total = track.offsetHeight - window.innerHeight;
    const y = track.offsetTop + (total * (index + 0.5)) / this.steps().length;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  /**
   * Place every cover for a continuous carousel position.
   *
   * Two rings, not a linear ramp: the first neighbour steps a long way back so
   * the centre reads as the subject, and the second only a little further, so
   * the covers bunch towards the edges like a real coverflow instead of
   * marching off in even strides. Beyond that they are simply gone.
   *
   * The track wraps, so the first step is flanked by the last one rather than
   * by nothing — otherwise the carousel opens and closes as a lopsided pair.
   * A cover crosses the seam at half the track away, which is well past the
   * point where it has already faded out, so the jump is never on screen.
   */
  private layout(pos: number): void {
    if (Math.abs(pos - this.pos) < 0.0015) return;
    this.pos = pos;

    const n = this.covers.length;
    const half = n / 2;

    for (let i = 0; i < n; i++) {
      const el = this.covers[i];
      const offset = ((((i - pos + half) % n) + n) % n) - half;
      const dist = Math.abs(offset);

      if (dist >= 2.02) {
        if (el.style.visibility !== 'hidden') {
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
        }
        continue;
      }

      const dir = offset < 0 ? -1 : 1;
      const near = Math.min(dist, 1); // 0..1 across the first neighbour
      const far = Math.max(0, dist - 1); // 0..1 across the second

      const x = dir * this.spread * (near + 0.34 * far);
      const z = -(180 * near + 120 * far);
      const turn = -dir * (28 * near + 8 * far);
      const scale = 1 - 0.32 * near - 0.13 * far;

      el.style.visibility = 'visible';
      el.style.opacity = (1 - 0.48 * near - 0.52 * far).toFixed(3);
      el.style.transform =
        `translate3d(${x.toFixed(2)}%, 0, ${z.toFixed(1)}px)` +
        ` rotateY(${turn.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      el.style.zIndex = String(50 - Math.round(dist * 10));
      el.style.pointerEvents = dist < 0.5 ? 'none' : 'auto';
    }
  }

  private readSpread(flow: HTMLElement): void {
    const raw = parseFloat(getComputedStyle(flow).getPropertyValue('--flow-x'));
    if (Number.isFinite(raw) && raw > 0) this.spread = raw;
  }

  private setRail(index: number, local: number): void {
    for (let i = 0; i < this.fills.length; i++) {
      this.fills[i].style.scale = `${i < index ? 1 : i === index ? local.toFixed(3) : 0} 1`;
    }
  }
}
