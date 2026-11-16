import { afterNextRender, ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';

const SRC = 'https://arte-soft.com/promo/more-apps.js';

/**
 * "More from Arte Soft": the other Arte Soft apps and the most-read guides of
 * their sites, in the reader's language. The block and its daily feed are
 * served from arte-soft.com (arte-soft-sites/promo), the same on every Arte
 * Soft site; it leaves out Cloud Calendars itself by host name. This only
 * places the element and loads its script once, in the browser.
 */
@Component({
  selector: 'cc-more-apps',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: { '[class.inline]': 'inline()' },
  template: `<arte-more-apps></arte-more-apps>`,
  styles: [
    `
      :host { display: block; box-sizing: border-box; width: 100%; max-width: calc(76rem + 40px); margin-inline: auto; padding-inline: 20px; }
      arte-more-apps { --ama-max: none; --ama-gutter: 0; --ama-margin: clamp(40px, 6vw, 72px) 0; }
      /* Inside a column that already has its padding (an article, the guides list). */
      :host(.inline) { max-width: none; padding-inline: 0; }
      :host(.inline) arte-more-apps { --ama-margin: 44px 0; }
    `,
  ],
})
export class MoreAppsComponent {
  readonly inline = input(false);

  constructor() {
    afterNextRender(() => {
      if (document.querySelector(`script[src="${SRC}"]`)) return;
      const s = document.createElement('script');
      s.src = SRC;
      s.async = true;
      document.head.appendChild(s);
    });
  }
}
