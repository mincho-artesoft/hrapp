import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SeoService } from '../../core/seo.service';
import { DEFAULT_LOCALE, Locale, LOCALES, localePath } from '../../core/locales';
import { EventRegistrationApiService, EventRegistrationError, EventRegisterResult, PublicEvent } from '../../core/event-registration-api.service';
import { eventCopyFor } from '../../content/event-registration/event-registry';

type Mode = 'loading' | 'view' | 'done' | 'notfound' | 'error';

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss',
})
export class EventPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly api = inject(EventRegistrationApiService);

  protected locale: Locale = DEFAULT_LOCALE;
  protected copy = eventCopyFor(DEFAULT_LOCALE.code);

  protected readonly mode = signal<Mode>('loading');
  protected readonly event = signal<PublicEvent | null>(null);
  protected readonly result = signal<EventRegisterResult | null>(null);
  protected readonly errorMsg = signal<string | null>(null);
  protected readonly submitting = signal(false);
  protected readonly name = signal('');
  protected readonly email = signal('');

  private handle = '';

  protected readonly canRegister = computed(() => {
    const ev = this.event();
    return !!ev && !ev.cancelled && !ev.closed;
  });

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.copy = eventCopyFor(this.locale.code);
    this.seo.apply({
      title: this.copy.seoTitle,
      description: this.copy.seoDescription,
      path: localePath(this.locale, '/event'),
      locale: this.locale,
      noindex: true,
      alternates: LOCALES.map((l) => ({ hreflang: l.hreflang, path: localePath(l, '/event') })),
    });

    this.handle = this.route.snapshot.queryParamMap.get('e') ?? '';
    if (!this.handle) { this.mode.set('notfound'); return; }
    await this.load();
  }

  private async load(): Promise<void> {
    this.mode.set('loading');
    try {
      const ev = await this.api.publicEvent(this.handle);
      this.event.set(ev);
      this.mode.set('view');
      if (ev.title) this.seo.apply({ title: `${ev.title} — Cloud Calendars`, description: this.copy.seoDescription, path: localePath(this.locale, '/event'), locale: this.locale, noindex: true });
    } catch (e) {
      this.mode.set(e instanceof EventRegistrationError && e.status === 404 ? 'notfound' : 'error');
    }
  }

  protected async register(): Promise<void> {
    this.errorMsg.set(null);
    const name = this.name().trim();
    const email = this.email().trim();
    if (!name || !email.includes('@')) { this.errorMsg.set(this.copy.genericError); return; }

    this.submitting.set(true);
    try {
      const res = await this.api.registerForEvent(this.handle, { name, email });
      this.result.set(res);
      this.mode.set('done');
    } catch (e) {
      if (e instanceof EventRegistrationError && (e.status === 409 || e.status === 410)) {
        await this.load(); // refresh: now full or cancelled
      } else {
        this.errorMsg.set(this.copy.genericError);
      }
    } finally {
      this.submitting.set(false);
    }
  }

  // --- formatting ---
  protected whenText(ev: PublicEvent | EventRegisterResult['event']): string {
    const tz = (this.event()?.timeZone) || 'UTC';
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

  protected get webcal(): string {
    return this.result()?.invitee.webcal ?? '';
  }
  protected get homeHref(): string {
    return this.locale.slug ? `/${this.locale.slug}/` : '/';
  }
}
