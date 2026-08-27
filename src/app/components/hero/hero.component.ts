import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
} from '@angular/core';

import { WebglBackdropComponent } from '../webgl-backdrop/webgl-backdrop.component';
import { DeviceFrameComponent } from '../device-frame/device-frame.component';
import { RevealDirective } from '../../core/reveal.directive';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { ScrollService } from '../../core/scroll.service';
import { storeCta } from '../../core/store-cta';
import { isBrowser, prefersReducedMotion } from '../../core/motion';
import { APP_STORE_URL, APP_VERSION, APP_RATING_COUNT, APP_RATING } from '../../core/app-facts';

interface TitleLine {
  text: string;
  words: string[];
  accent: boolean;
}

const line = (text: string, accent = false): TitleLine => ({
  text,
  words: text.split(' '),
  accent,
});

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [WebglBackdropComponent, DeviceFrameComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('stage') private stageRef?: ElementRef<HTMLElement>;

  private readonly scroll = inject(ScrollService);
  /** Captured here because a field initialiser is an injection context;
   *  method bodies are not. */
  private readonly browser = isBrowser();
  private off?: () => void;
  private observer?: IntersectionObserver;
  private visible = true;

  readonly appStoreUrl = APP_STORE_URL;
  readonly version = APP_VERSION;
  readonly rating = APP_RATING;
  readonly ratingCount = APP_RATING_COUNT;

  private readonly active = inject(ActiveLocaleService);
  readonly copy = computed(() => this.active.copy().hero);
  readonly appStore = this.active.storeHref;
  readonly storeCta = computed(() => storeCta(this.active.locale().code));
  readonly badge = computed(() => this.copy().badge.replace('{v}', APP_VERSION));
  readonly ratingLabel = computed(() =>
    this.copy()
      .ratingLabel.replace('{r}', String(APP_RATING))
      .replace('{n}', String(APP_RATING_COUNT)),
  );

  /** Split into lines and words so each can be animated independently. The
   *  middle line is the accented one in every language. */
  readonly titleLines = computed<TitleLine[]>(() =>
    this.copy().title.map((text, i) => line(text, i === 1)),
  );

  /**
   * The device cluster leans toward the pointer.
   *
   * Written straight onto the stage element rather than through a custom
   * property on <html> — the latter invalidates style for the entire document
   * on every frame to move one box.
   */
  ngAfterViewInit(): void {
    const el = this.stageRef?.nativeElement;
    if (!el || !this.browser || prefersReducedMotion()) return;

    this.observer = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
    });
    this.observer.observe(el);

    let lastX = 0;
    let lastY = 0;

    this.off = this.scroll.onFrame(() => {
      if (!this.visible) return;
      const p = this.scroll.pointer();
      const rx = (-p.ey * 3.5).toFixed(3);
      const ry = (p.ex * 5.5).toFixed(3);
      if (rx === lastX.toFixed(3) && ry === lastY.toFixed(3)) return;
      lastX = +rx;
      lastY = +ry;
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }

  ngOnDestroy(): void {
    this.off?.();
    this.observer?.disconnect();
  }
}
