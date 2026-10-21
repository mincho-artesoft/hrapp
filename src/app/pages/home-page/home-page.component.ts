import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { HeroComponent } from '../../components/hero/hero.component';
import { MarqueeComponent } from '../../components/marquee/marquee.component';
import { ShowcaseComponent } from '../../components/showcase/showcase.component';
import { WidgetsComponent } from '../../components/widgets/widgets.component';
import { WeatherHubComponent } from '../../components/weather-hub/weather-hub.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { MoreAppsComponent } from '../../components/more-apps/more-apps.component';
import { PricingComponent } from '../../components/pricing/pricing.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { CtaComponent } from '../../components/cta/cta.component';
import { homeCopyFor } from '../../content/home/registry';
import { DEFAULT_LOCALE, LOCALES, Locale, localePath } from '../../core/locales';
import { SeoService } from '../../core/seo.service';
import { APP_NAME, APP_DEVELOPER, APP_MIN_IOS, APP_VERSION, APP_SIZE_MB, APP_RATING, APP_RATING_COUNT, APP_STORE_URL, SITE_URL } from '../../core/app-facts';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HeroComponent,
    MarqueeComponent,
    ShowcaseComponent,
    WidgetsComponent,
    WeatherHubComponent,
    FeaturesComponent,
    MoreAppsComponent,
    PricingComponent,
    FaqComponent,
    CtaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly doc = inject(DOCUMENT);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const locale = (this.route.snapshot.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE;
    const copy = homeCopyFor(locale.code);
    this.describeApp();

    this.seo.apply({
      title: copy.metaTitle,
      description: copy.metaDescription,
      path: localePath(locale, '/'),
      locale,
      // The home page exists in every language, translated or not: an
      // untranslated one falls back to English copy rather than 404ing, and
      // listing it here is what lets a reader who arrives in the wrong
      // language find their own.
      alternates: LOCALES.map((other) => ({
        hreflang: other.hreflang,
        path: localePath(other, '/'),
      })),
    });
  }

  /** Keep crawler-facing facts in step with the version and rating visible on the page. */
  private describeApp(): void {
    this.doc.getElementById('app-jsonld')?.remove();
    const script = this.doc.createElement('script');
    script.id = 'app-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: APP_NAME,
      operatingSystem: `iOS ${APP_MIN_IOS} or later`,
      applicationCategory: 'ProductivityApplication',
      downloadUrl: APP_STORE_URL,
      softwareVersion: APP_VERSION,
      fileSize: `${APP_SIZE_MB} MB`,
      image: `${SITE_URL}/icons/icon-512.png`,
      author: { '@type': 'Organization', name: APP_DEVELOPER },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: APP_RATING, ratingCount: APP_RATING_COUNT },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free download' },
    });
    this.doc.head.appendChild(script);
  }

  ngOnDestroy(): void {
    this.doc.getElementById('app-jsonld')?.remove();
  }

}
