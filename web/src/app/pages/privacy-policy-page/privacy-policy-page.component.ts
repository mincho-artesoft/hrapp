import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-privacy-policy-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './privacy-policy-page.component.html',
  styleUrl: './privacy-policy-page.component.scss',
})
export class PrivacyPolicyPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.apply({
      title: 'Privacy Policy — Cloud Calendars',
      description:
        'How Cloud Calendars collects, uses and shares information, including calendar ' +
        'data, location used for weather forecasts, and third-party account connections.',
      path: '/privacy-policy',
    });
  }
}
