import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

import { Locale } from '../../core/locales';
import MANIFEST from '../../core/media-manifest.json';
import DESCRIPTIONS from '../../core/screenshot-descriptions.json';

const SHOT_DESCRIPTIONS: Readonly<Record<string, Readonly<Record<string, string>>>> = DESCRIPTIONS;

interface Shot {
  readonly name: string;
  readonly alt: string;
  readonly avif: string;
  readonly webp: string;
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
        <li class="rail__item">
          <picture>
            <source type="image/avif" [attr.srcset]="shot.srcsetAvif" [attr.sizes]="sizes" />
            <source type="image/webp" [attr.srcset]="shot.srcsetWebp" [attr.sizes]="sizes" />
            <img
              [src]="shot.webp"
              [alt]="shot.alt"
              width="340"
              height="736"
              loading="lazy"
              decoding="async"
            />
          </picture>
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
        width: 170px;
        scroll-snap-align: start;
      }

      .rail__item img {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 22px;
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
  @Input() device: 'iPhone' | 'iPad' = 'iPhone';

  @Input() label = 'Screenshots, scrollable';

  private readonly current = signal<Locale | null>(null);

  /** Rendered at 170 CSS px, so 340 covers 2x and 680 covers 3x and zoom. */
  readonly sizes = '170px';

  readonly dir = computed(() => this.current()?.dir ?? 'ltr');

  readonly shots = computed<Shot[]>(() => {
    const locale = this.current();
    if (!locale) return [];

    const folder = MANIFEST.locales[locale.media as keyof typeof MANIFEST.locales];
    const names: string[] = folder?.[this.device as 'iPhone' | 'iPad'] ?? [];
    const widths: number[] = MANIFEST.widths[this.device as 'iPhone' | 'iPad'] ?? [];
    if (!names.length || widths.length < 2) return [];

    const base = `${MANIFEST.base}/${locale.media}/${this.device}`;
    const [small, large] = widths;

    return names.map((name) => {
      const kind = name.replace(/^\d+-/, '');
      const alt = SHOT_DESCRIPTIONS[locale.code]?.[kind];
      if (!alt) throw new Error(`Missing screenshot description: ${locale.code}/${name}`);

      return {
        name,
        alt,
        avif: `${base}/${name}-${small}.avif`,
        webp: `${base}/${name}-${small}.webp`,
        srcsetAvif: `${base}/${name}-${small}.avif ${small}w, ${base}/${name}-${large}.avif ${large}w`,
        srcsetWebp: `${base}/${name}-${small}.webp ${small}w, ${base}/${name}-${large}.webp ${large}w`,
      };
    });
  });
}
