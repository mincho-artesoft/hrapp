import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { HeroComponent } from '../../components/hero/hero.component';
import { MarqueeComponent } from '../../components/marquee/marquee.component';
import { ShowcaseComponent } from '../../components/showcase/showcase.component';
import { WidgetsComponent } from '../../components/widgets/widgets.component';
import { WeatherHubComponent } from '../../components/weather-hub/weather-hub.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { PricingComponent } from '../../components/pricing/pricing.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { CtaComponent } from '../../components/cta/cta.component';
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
    PricingComponent,
    FaqComponent,
    CtaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.apply({
      title: 'Cloud Calendars — your calendar and the weather, in one view',
      description:
        'Unify iCloud, Google Calendar and Microsoft in one iPhone app, with hourly ' +
        'forecasts built into every day, Home Screen widgets and Live Activities. Free on the App Store.',
      path: '/',
    });
  }
}
