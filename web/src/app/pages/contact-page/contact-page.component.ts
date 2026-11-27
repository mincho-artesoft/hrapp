import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.apply({
      title: 'Contact Us & Support — Cloud Calendars',
      description:
        'Get technical support for Cloud Calendars on iOS and Web, report guide updates, or reach ARTE SOFT EOOD for privacy, GDPR, and business inquiries.',
      path: '/contact',
    });
  }
}
