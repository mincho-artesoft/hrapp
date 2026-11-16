import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ActiveLocaleService } from '../../core/active-locale.service';

/**
 * A slow ticker of what the app does.
 *
 * Two identical copies of the list scroll side by side and the animation
 * translates by exactly -50%, so the seam is invisible and the loop is
 * perfectly continuous no matter how wide the viewport is.
 */
@Component({
  selector: 'app-marquee',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="marquee" aria-hidden="true">
      <div class="marquee__track">
        @for (pass of [0, 1]; track pass) {
          <ul class="marquee__list">
            @for (item of items(); track item) {
              <li>
                <span class="marquee__dot"></span>
                {{ item }}
              </li>
            }
          </ul>
        }
      </div>
    </div>
    <p class="sr-only">
      Cloud Calendars supports iCloud, Google Calendar and Microsoft sync, day, week, month, year
      and list views, hourly weather, Home Screen widgets, Live Activities, Google Meet and
      Microsoft Teams links.
    </p>
  `,
  styleUrl: './marquee.component.scss',
})
export class MarqueeComponent {
  private readonly active = inject(ActiveLocaleService);
  readonly items = computed(() => this.active.copy().marquee);
}
