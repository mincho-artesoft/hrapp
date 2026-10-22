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
        <h2 id="store-media-title">{{ title() }}</h2>
        @for (set of sets(); track locale().media + '/' + set.device) {
          <section class="store-media__device" [attr.aria-label]="set.label">
            <h3>{{ set.label }}</h3>
            @if (set.screenshots.length) {
              <cc-shot-rail [locale]="locale()" [device]="set.device" [label]="title() + ' — ' + set.label" />
            }
            @if (set.video; as video) {
              <video controls preload="none" playsinline
                [src]="url(video.src)" [poster]="url(video.poster)"
                [attr.width]="video.width" [attr.height]="video.height"
                [attr.aria-label]="title() + ' — ' + set.label">
              </video>
            }
          </section>
        }
      </section>
    }
  `,
  styles: [`
    :host { display: block; }
    .store-media { padding-block: 64px; }
    h2 { margin-block: 0 32px; }
    h3 { margin-block: 0 18px; }
    .store-media__device + .store-media__device { margin-block-start: 40px; }
    video { display: block; max-width: 100%; width: auto; height: auto; max-height: 720px;
      margin-block-start: 24px; border-radius: 18px; background: #111; object-fit: contain; }
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
