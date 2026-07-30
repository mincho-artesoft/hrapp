import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';

import { isBrowser, prefersReducedMotion } from './motion';

/**
 * Plays a video while it is on screen, and exposes just enough state for the
 * page to draw a single control of its own.
 *
 * The element carries **no `controls` attribute**, deliberately. Native video
 * controls cannot be trimmed — `controlsList` removes download, fullscreen and
 * playback rate, but there is no way to drop the timeline — and a scrubber on a
 * nine-second silent loop invites people to treat marketing footage like a
 * film. So the directive never sets `controls`, and instead exports `playing`
 * and `toggle()` for a custom button.
 *
 * It also carries no `autoplay` attribute: that one makes the browser fetch the
 * clip at page load regardless of `preload="none"`, which defeats the point of
 * keeping half a megabyte off the critical path. Playback is started here, when
 * the section actually scrolls into view.
 *
 * The poster is handled the same way, for the same reason. A `poster` attribute
 * is fetched at page load no matter what `preload` says — measured at 40 kB on a
 * section that sits several screens down — so the template carries
 * `data-poster` instead and this directive promotes it once the clip is worth
 * showing. Until then the element is an empty box inside a dark bezel on a dark
 * page, which is not something a visitor can see.
 *
 * Once the visitor touches the button their intent wins: a deliberate pause is
 * not undone by scrolling away and back, and under `prefers-reduced-motion`
 * nothing starts until they ask for it.
 */
@Directive({
  selector: 'video[appInViewVideo]',
  standalone: true,
  exportAs: 'inViewVideo',
})
export class InViewVideoDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLVideoElement>);
  private observer?: IntersectionObserver;

  /** What we want. Not always what the element is doing yet — play() is async. */
  private wantPlaying = false;

  /** Set once the visitor presses the button; from then on it outranks scroll. */
  private intent: 'play' | 'pause' | null = null;

  /** Mirrors the element, so the button can label itself. */
  readonly playing = signal(false);

  private get video(): HTMLVideoElement {
    return this.host.nativeElement as HTMLVideoElement;
  }

  ngAfterViewInit(): void {
    if (!isBrowser()) return;

    const video = this.video;

    // Track the element rather than assume: playback can also stop on its own
    // (low power mode, a background tab, a decode error).
    video.addEventListener('play', this.onPlay);
    video.addEventListener('pause', this.onPause);

    if (!('IntersectionObserver' in window)) {
      this.applyPoster();
      if (!prefersReducedMotion()) this.start();
      return;
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Before anything else, and regardless of playback intent: a paused
          // clip should still show its poster rather than an empty rectangle.
          this.applyPoster();
          if (this.intent === 'pause') return;
          if (prefersReducedMotion() && this.intent !== 'play') return;
          this.start();
        } else {
          this.wantPlaying = false;
          if (!video.paused) video.pause();
        }
      },
      // rootMargin gives the poster a head start: 300px of lead time is
      // enough for it to decode before the section is actually looked at.
      { threshold: 0.25, rootMargin: '300px 0px' },
    );

    this.observer.observe(video);
  }

  /** Wired to the page's own play/pause button. */
  toggle(): void {
    if (this.video.paused) {
      this.intent = 'play';
      this.start();
    } else {
      this.intent = 'pause';
      this.wantPlaying = false;
      this.video.pause();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.video.removeEventListener('play', this.onPlay);
    this.video.removeEventListener('pause', this.onPause);
  }

  /**
   * Move `data-poster` onto `poster`. Idempotent — the attribute is cleared, so
   * a second call does nothing.
   */
  private applyPoster(): void {
    const video = this.video;
    const src = video.dataset['poster'];
    if (!src) return;
    video.poster = src;
    delete video.dataset['poster'];
  }

  private start(): void {
    const video = this.video;
    this.wantPlaying = true;

    if (video.preload !== 'auto') {
      video.preload = 'auto';
      video.load();
    }

    // play() is async. If the element leaves the viewport before the promise
    // settles, a naive pause() is undone the moment it resolves — so re-check
    // the intent rather than trusting the ordering.
    void video
      .play()
      .then(() => {
        if (!this.wantPlaying) video.pause();
      })
      .catch(() => {
        // Refused — low power mode, for one. Nothing to repair: the poster
        // stays up and the button is already on the page, so the visitor has
        // a way to start it deliberately.
        this.wantPlaying = false;
      });
  }

  private readonly onPlay = () => this.playing.set(true);
  private readonly onPause = () => this.playing.set(false);
}
