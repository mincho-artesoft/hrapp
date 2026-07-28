import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_DEVELOPER, APP_STORE_URL, APP_VERSION } from '../../core/app-facts';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly appStoreUrl = APP_STORE_URL;
  readonly developer = APP_DEVELOPER;
  readonly version = APP_VERSION;

  readonly columns = [
    {
      title: 'Product',
      links: [
        { label: 'Tour', href: '/#showcase' },
        { label: 'Widgets', href: '/#widgets' },
        { label: 'Weather hub', href: '/#weather' },
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'FAQ', href: '/#faq' },
      ],
    },
  ];
}
