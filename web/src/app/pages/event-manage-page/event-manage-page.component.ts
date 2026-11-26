import { CalendarActionSheetComponent } from '../../components/calendar-native/calendar-action-sheet.component';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { SeoService } from '../../core/seo.service';
import { DEFAULT_LOCALE, Locale, LOCALES, localePath } from '../../core/locales';
import { EventRegistrationApiService, RegistrationView } from '../../core/event-registration-api.service';
import { eventCopyFor } from '../../content/event-registration/event-registry';

type Mode = 'loading' | 'view' | 'cancelled' | 'notfound';

@Component({
  selector: 'app-event-manage-page',
  standalone: true,
  imports: [CommonModule, CalendarActionSheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-manage-page.component.html',
  styleUrl: '../event-page/event-page.component.scss',
})
export class EventManagePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly api = inject(EventRegistrationApiService);

  protected locale: Locale = DEFAULT_LOCALE;
  protected copy = eventCopyFor(DEFAULT_LOCALE.code);

  protected readonly mode = signal<Mode>('loading');
  protected readonly reg = signal<RegistrationView | null>(null);
  protected readonly working = signal(false);
  protected readonly confirming = signal(false);

  private token = '';

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.copy = eventCopyFor(this.locale.code);
    this.seo.apply({
      title: this.copy.yourSpotTitle + ' — Cloud Calendars',
      description: this.copy.seoDescription,
      path: localePath(this.locale, '/event/manage'),
      locale: this.locale,
      noindex: true,
      alternates: LOCALES.map((l) => ({ hreflang: l.hreflang, path: localePath(l, '/event/manage') })),
    });

    this.token = this.route.snapshot.queryParamMap.get('t') ?? '';
    if (!this.token) { this.mode.set('notfound'); return; }
    try {
      const reg = await this.api.registration(this.token);
      this.reg.set(reg);
      this.mode.set(reg.cancelled ? 'cancelled' : 'view');
    } catch {
      this.mode.set('notfound');
    }
  }

  protected async cancel(): Promise<void> {
    if (!this.confirming() || this.working()) return;
    this.confirming.set(false);
    this.working.set(true);
    try {
      await this.api.cancelRegistration(this.token);
      this.mode.set('cancelled');
    } catch {
      /* leave them on the view; they can retry */
    } finally {
      this.working.set(false);
    }
  }

  protected whenText(ev: RegistrationView['event']): string {
    const tz = this.reg()?.timeZone || 'UTC';
    try {
      const day = new Intl.DateTimeFormat(this.locale.code, {
        timeZone: tz, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      }).format(new Date(ev.start));
      const t = (iso: string) => new Intl.DateTimeFormat(this.locale.code, { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
      return `${day} · ${t(ev.start)} – ${t(ev.end)}`;
    } catch {
      return ev.start;
    }
  }

  protected get homeHref(): string {
    return this.locale.slug ? `/${this.locale.slug}/` : '/';
  }
}
