import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ActiveLocaleService } from '../../core/active-locale.service';
import { storeCta } from '../../core/store-cta';
import { APP_DEVELOPER, APP_MIN_IOS, APP_STORE_URL, APP_VERSION } from '../../core/app-facts';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  private readonly active = inject(ActiveLocaleService);

  /** Follows the language of the page being read, not the site default. */
  readonly appStoreUrl = this.active.storeHref;
  readonly homePath = computed(() => {
    const home = this.active.path('/');
    return home.endsWith('/') ? home : `${home}/`;
  });
  readonly developer = APP_DEVELOPER;
  readonly version = APP_VERSION;
  readonly minIos = APP_MIN_IOS;
  readonly versionLine = computed(() => this.copy().footer.version.replace('{v}', APP_VERSION));
  readonly iosLine = computed(() => this.copy().footer.iosOrLater.replace('{v}', APP_MIN_IOS));

  readonly copy = this.active.copy;
  readonly storeCta = computed(() => storeCta(this.active.locale().code));

  /** Fragment links point at the home page of the reader's own language. */
  readonly productLinks = computed(() => {
    const n = this.copy().nav;
    const home = this.active.path('/');
    const base = home.endsWith('/') ? home : `${home}/`;
    return [
      { label: n.tour, href: `${base}#showcase` },
      { label: n.widgets, href: `${base}#widgets` },
      { label: n.weather, href: `${base}#weather` },
      { label: n.features, href: `${base}#features` },
      { label: n.pricing, href: `${base}#pricing` },
      { label: n.faq, href: `${base}#faq` },
    ];
  });

  readonly rights = computed(() =>
    this.copy()
      .footer.rights.replace('{year}', String(this.year))
      .replace('{developer}', APP_DEVELOPER),
  );
}
