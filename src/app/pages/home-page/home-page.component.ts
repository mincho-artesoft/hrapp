import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
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
export class HomePageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const locale = (this.route.snapshot.data['locale'] as Locale | undefined) ?? DEFAULT_LOCALE;
    const copy = homeCopyFor(locale.code);

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
}
