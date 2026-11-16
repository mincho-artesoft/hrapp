import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import { Locale } from '../../core/locales';
import MANIFEST from '../../core/media-manifest.json';
import DESCRIPTIONS from '../../core/screenshot-descriptions.json';
import { STORE_MEDIA, StoreMediaDevice } from '../../core/store-media';

const SHOT_DESCRIPTIONS: Readonly<Record<string, Readonly<Record<string, string>>>> = DESCRIPTIONS;

interface Shot {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  readonly avif: string;
  readonly webp: string;
  readonly fullWebp: string;
  readonly srcsetAvif: string;
  readonly srcsetWebp: string;
}

/**
 * Public screenshot renditions selected by the locale's media folder.
 * Descriptions use the page language, including Bulgarian's English-image
 * fallback. Semantic filename suffixes identify the subject independently
 * of the numbered order used by right-to-left screenshot sets.
 */
@Component({
  selector: 'cc-shot-rail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="rail" tabindex="0" [attr.aria-label]="label" [attr.dir]="dir()">
      @for (shot of shots(); track shot.name) {
        <li class="rail__item" [class.is-landscape]="shot.width > shot.height">
          <a [href]="shot.fullWebp" target="_blank" rel="noopener">
          <picture>
            <source type="image/avif" [attr.srcset]="shot.srcsetAvif" [attr.sizes]="sizes" />
            <source type="image/webp" [attr.srcset]="shot.srcsetWebp" [attr.sizes]="sizes" />
            <img
              [src]="shot.webp"
              [alt]="shot.alt"
              [attr.width]="shot.width"
              [attr.height]="shot.height"
              loading="lazy"
              decoding="async"
            />
          </picture>
          </a>
        </li>
      }
    </ul>
  `,
  styles: [
    `
      .rail {
        display: flex;
        gap: 18px;
        margin: 0;
        padding: 4px 0 18px;
        list-style: none;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        scroll-snap-type: x proximity;
        scrollbar-width: thin;
      }

      .rail__item {
        flex: none;
        width: 184px;
        scroll-snap-align: start;
      }

      .rail__item.is-landscape {
        width: min(320px, 78vw);
      }

      .rail__item a {
        display: block;
        border-radius: 22px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 14px 36px -14px rgba(0, 0, 0, 0.72);
        overflow: hidden;
        transition: transform 0.35s var(--ease-out), border-color 0.35s var(--ease-out);
      }
      .rail__item a:hover {
        transform: translateY(-3px);
        border-color: rgba(56, 224, 240, 0.35);
      }
      .rail__item a:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }

      .rail__item img {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 21px;
        background: rgb(0 0 0 / 0.2);
      }
    `,
  ],
})
export class ShotRailComponent {
  @Input({ required: true }) set locale(value: Locale) {
    this.current.set(value);
  }

  /** Which device's shots to show. iPhone unless a page says otherwise. */
  @Input() set device(value: StoreMediaDevice) {
    this.currentDevice.set(value);
  }
  private readonly currentDevice = signal<StoreMediaDevice>('iPhone');

  @Input() set subjects(value: readonly string[]) { this.currentSubjects.set(value); }
  private readonly currentSubjects = signal<readonly string[]>([]);

  @Input() label = 'Screenshots, scrollable';

  private readonly current = signal<Locale | null>(null);

  /** Rendered at 170 CSS px, so 340 covers 2x and 680 covers 3x and zoom. */
  readonly sizes = '170px';

  readonly dir = computed(() => this.current()?.dir ?? 'ltr');

  readonly shots = computed<Shot[]>(() => {
    const locale = this.current();
    if (!locale) return [];

    const device = this.currentDevice();
    const updated = STORE_MEDIA.locales[locale.media]?.[device];
    if (updated?.screenshots.length) {
      const widths = STORE_MEDIA.widths[device];
      if (!widths?.length) throw new Error(`Missing screenshot widths: ${device}`);
      const base = `${STORE_MEDIA.base}/${locale.media}/${device}`;
      return updated.screenshots.filter(shot => !this.currentSubjects().length || this.currentSubjects().includes(shot.kind)).map((shot) => {
        const alt = SHOT_DESCRIPTIONS[locale.code]?.[shot.kind];
        if (!alt) throw new Error(`Missing screenshot description: ${locale.code}/${shot.kind}`);
        return {
          name: shot.name, alt, width: shot.width, height: shot.height,
          avif: `${base}/${shot.name}-${widths[0]}.avif`,
          webp: `${base}/${shot.name}-${widths[0]}.webp`,
          fullWebp: `${base}/${shot.name}-${Math.max(...widths)}.webp`,
          srcsetAvif: widths.map((width) => `${base}/${shot.name}-${width}.avif ${width}w`).join(', '),
          srcsetWebp: widths.map((width) => `${base}/${shot.name}-${width}.webp ${width}w`).join(', '),
        };
      });
    }
    // Older localized panels remain available until their replacement set exists.
    if (device === 'iPhoneDuo') return [];
    const folder = MANIFEST.locales[locale.media as keyof typeof MANIFEST.locales];
    const names: string[] = folder?.[device] ?? [];
    const widths: number[] = MANIFEST.widths[device] ?? [];
    if (!names.length || widths.length < 2) return [];

    const base = `${MANIFEST.base}/${locale.media}/${device}`;
    const [small, large] = widths;

    return names.filter(name => !this.currentSubjects().length || this.currentSubjects().includes(name.replace(/^\d+-/, ''))).map((name) => {
      const kind = name.replace(/^\d+-/, '');
      const alt = SHOT_DESCRIPTIONS[locale.code]?.[kind];
      if (!alt) throw new Error(`Missing screenshot description: ${locale.code}/${name}`);

      return {
        name,
        width: 340,
        height: 736,
        alt,
        avif: `${base}/${name}-${small}.avif`,
        webp: `${base}/${name}-${small}.webp`,
        fullWebp: `${base}/${name}-${large}.webp`,
        srcsetAvif: `${base}/${name}-${small}.avif ${small}w, ${base}/${name}-${large}.avif ${large}w`,
        srcsetWebp: `${base}/${name}-${small}.webp ${small}w, ${base}/${name}-${large}.webp ${large}w`,
      };
    });
  });
}
