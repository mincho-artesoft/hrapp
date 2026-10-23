import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { STORE_MEDIA, StoreMediaDevice, storeMediaUrl } from '../../core/store-media';
import { ShotRailComponent } from '../shot-rail/shot-rail.component';

@Component({
  selector: 'app-store-media',
  standalone: true,
  imports: [ShotRailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (sets().length) {
      <section class="store-media shell" aria-labelledby="store-media-title" [attr.dir]="locale().dir">
        <header class="store-media__head">
          <p class="eyebrow">iOS &amp; iPadOS</p>
          <h2 id="store-media-title" class="section-title">{{ title() }}</h2>
        </header>
        <div class="store-media__grid">
          @for (set of sets(); track locale().media + '/' + set.device) {
            <section class="card store-media__device" [attr.aria-label]="set.label">
              <div class="store-media__device-head">
                <span class="chip">{{ set.label }}</span>
              </div>
              @if (set.screenshots.length) {
                <cc-shot-rail [locale]="locale()" [device]="set.device" [label]="title() + ' — ' + set.label" />
              }
              @if (set.video; as video) {
                <div class="store-media__video-wrap">
                  <video controls preload="none" playsinline
                    [src]="url(video.src)" [poster]="url(video.poster)"
                    [attr.width]="video.width" [attr.height]="video.height"
                    [attr.aria-label]="title() + ' — ' + set.label">
                  </video>
                </div>
              }
            </section>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    :host { display: block; }
    .store-media { padding-block: clamp(3.5rem, 7vw, 6.5rem); }
    .store-media__head { margin-bottom: clamp(1.8rem, 4vw, 2.8rem); }
    .store-media__grid { display: grid; gap: clamp(1.5rem, 3vw, 2.4rem); }
    .store-media__device {
      padding: clamp(1.35rem, 2.8vw, 2rem);
      display: grid;
      gap: 1.15rem;
    }
    .store-media__device-head { display: flex; align-items: center; }
    .store-media__video-wrap {
      display: flex;
      justify-content: center;
      padding-top: 0.4rem;
    }
    video {
      display: block;
      max-width: 100%;
      width: auto;
      height: auto;
      max-height: 540px;
      border-radius: 22px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 24px 60px -18px rgba(0, 0, 0, 0.8);
      background: #080c1c;
      object-fit: contain;
    }
  `],
})
export class StoreMediaComponent {
  private readonly active = inject(ActiveLocaleService);
  readonly locale = this.active.locale;
  readonly title = computed(() => this.active.copy().showcase.title.join(' '));
  readonly url = storeMediaUrl;
  private readonly devices: readonly { device: StoreMediaDevice; label: string }[] = [
    { device: 'iPhone', label: 'iPhone' },
    { device: 'iPad', label: 'iPad' },
    { device: 'iPhoneDuo', label: 'iPhone Duo' },
  ];
  readonly sets = computed(() => this.devices.flatMap(({ device, label }) => {
    const set = STORE_MEDIA.locales[this.locale().media]?.[device];
    if (!set) return [];
    const video = set.video?.src && set.video.poster && set.video.width > 0 && set.video.height > 0
      ? set.video : undefined;
    return set.screenshots.length || video ? [{ device, label, screenshots: set.screenshots, video }] : [];
  }));
}
