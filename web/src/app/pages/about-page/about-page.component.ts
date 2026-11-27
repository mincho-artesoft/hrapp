import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss',
})
export class AboutPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.apply({
      title: 'About Cloud Calendars & Editorial Policy — Arte Soft',
      description:
        'Who builds Cloud Calendars, how our engineering team tests iCloud, Google Calendar, Outlook, and RFC 5545 guides on real devices, and our privacy-first architecture.',
      path: '/about',
    });
  }
}
