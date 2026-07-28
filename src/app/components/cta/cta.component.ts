import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DeviceFrameComponent } from '../device-frame/device-frame.component';
import { RevealDirective } from '../../core/reveal.directive';
import { APP_MIN_IOS, APP_RATING, APP_SIZE_MB, APP_STORE_URL } from '../../core/app-facts';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [DeviceFrameComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.scss',
})
export class CtaComponent {
  readonly appStoreUrl = APP_STORE_URL;
  readonly rating = APP_RATING;
  readonly minIos = APP_MIN_IOS;
  readonly sizeMb = APP_SIZE_MB;
}
