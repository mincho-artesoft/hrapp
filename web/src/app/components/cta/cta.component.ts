import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { DeviceFrameComponent } from '../device-frame/device-frame.component';
import { ActiveLocaleService } from '../../core/active-locale.service';
import { storeCta } from '../../core/store-cta';
import {
  APP_MIN_IOS,
  APP_RATING,
  APP_RATING_COUNT,
  APP_SIZE_MB,
} from '../../core/app-facts';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [DeviceFrameComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.scss',
})
export class CtaComponent {
  private readonly active = inject(ActiveLocaleService);

  readonly copy = computed(() => this.active.copy().cta);
  readonly storeCta = computed(() => storeCta(this.active.locale().code));
  readonly appStoreUrl = this.active.storeHref;

  /** Substituted here rather than in the template: the values are numbers, and
   *  a language may want them in a different position in the sentence. */
  readonly ratingsLine = computed(() =>
    this.copy().fromRatings.replace('{n}', String(APP_RATING_COUNT)),
  );
  readonly iosLine = computed(() => this.copy().requiresIos.replace('{v}', APP_MIN_IOS));
  readonly rating = APP_RATING;
  readonly ratingCount = APP_RATING_COUNT;
  readonly minIos = APP_MIN_IOS;
  readonly sizeMb = APP_SIZE_MB;
}
