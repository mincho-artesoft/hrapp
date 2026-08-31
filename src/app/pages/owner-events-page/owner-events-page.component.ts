import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SeoService } from '../../core/seo.service';
import { DEFAULT_LOCALE, Locale, LOCALES, localePath } from '../../core/locales';
import { BookingApiService, BookingError, EventRegistrant, OwnerSharedEvent } from '../../core/booking-api.service';
import { eventCopyFor } from '../../content/booking/event-registry';

const TOKEN_KEY = 'cc_booking_token';

@Component({
  selector: 'app-owner-events-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './owner-events-page.component.html',
  styleUrl: './owner-events-page.component.scss',
})
export class OwnerEventsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly api = inject(BookingApiService);

  protected locale: Locale = DEFAULT_LOCALE;
  protected copy = eventCopyFor(DEFAULT_LOCALE.code);

  protected readonly ready = signal(false);
  protected readonly signedIn = signal(false);
  protected readonly events = signal<OwnerSharedEvent[]>([]);
  protected readonly creating = signal(false);
  protected readonly errorMsg = signal<string | null>(null);
  protected readonly justShared = signal<{ title: string; publicUrl: string } | null>(null);
  protected readonly copied = signal(false);
  protected readonly busyId = signal<string | null>(null);
  protected readonly reschedulingId = signal<string | null>(null);
  protected readonly newStart = signal('');
  protected readonly expandedId = signal<string | null>(null);
  protected readonly registrants = signal<EventRegistrant[]>([]);

  protected form = { title: '', start: '', end: '', location: '', description: '', capacity: null as number | null };

  protected setupHref = '/book/setup/';

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.copy = eventCopyFor(this.locale.code);
    this.setupHref = localePath(this.locale, '/book/setup') + '/';
    this.seo.apply({
      title: this.copy.ownerSeoTitle,
      description: this.copy.ownerSeoDescription,
      path: localePath(this.locale, '/book/events'),
      locale: this.locale,
      noindex: true,
      alternates: LOCALES.map((l) => ({ hreflang: l.hreflang, path: localePath(l, '/book/events') })),
    });

    const token = this.readToken();
    if (token) {
      this.signedIn.set(true);
      await this.loadEvents();
    }
    this.ready.set(true);
  }

  private async loadEvents(): Promise<void> {
    const token = this.readToken();
    if (!token) return;
    try {
      this.events.set(await this.api.ownerSharedEvents(token));
    } catch (e) {
      if (e instanceof BookingError && e.status === 401) this.signedIn.set(false);
    }
  }

  protected async create(): Promise<void> {
    this.errorMsg.set(null);
    const token = this.readToken();
    if (!token) return;
    const title = this.form.title.trim();
    if (!title) { this.errorMsg.set(this.copy.errNeedTitle); return; }
    if (!this.form.start || !this.form.end) { this.errorMsg.set(this.copy.errNeedTime); return; }
    let start: string, end: string;
    try {
      start = new Date(this.form.start).toISOString();
      end = new Date(this.form.end).toISOString();
    } catch { this.errorMsg.set(this.copy.errNeedTime); return; }

    this.creating.set(true);
    try {
      const ev = await this.api.createSharedEvent(token, {
        title, start, end,
        location: this.form.location.trim() || null,
        description: this.form.description.trim() || null,
        capacity: this.form.capacity && this.form.capacity > 0 ? this.form.capacity : null,
      });
      this.justShared.set({ title: ev.title, publicUrl: ev.publicUrl });
      this.form = { title: '', start: '', end: '', location: '', description: '', capacity: null };
      await this.loadEvents();
    } catch (e) {
      this.errorMsg.set(e instanceof BookingError ? e.message : this.copy.genericError);
    } finally {
      this.creating.set(false);
    }
  }

  protected async copyLink(url: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    } catch { /* visible to select by hand */ }
  }

  protected async toggleRegistrants(ev: OwnerSharedEvent): Promise<void> {
    if (this.expandedId() === ev.id) { this.expandedId.set(null); return; }
    const token = this.readToken();
    if (!token) return;
    this.expandedId.set(ev.id);
    this.registrants.set([]);
    try {
      this.registrants.set(await this.api.eventRegistrants(token, ev.id));
    } catch { /* leave empty */ }
  }

  protected startReschedule(ev: OwnerSharedEvent): void {
    this.reschedulingId.set(this.reschedulingId() === ev.id ? null : ev.id);
    this.newStart.set('');
  }

  protected async confirmReschedule(ev: OwnerSharedEvent): Promise<void> {
    const token = this.readToken();
    if (!token || !this.newStart()) return;
    this.busyId.set(ev.id);
    try {
      await this.api.rescheduleSharedEvent(token, ev.id, new Date(this.newStart()).toISOString());
      this.reschedulingId.set(null);
      await this.loadEvents();
    } catch { /* ignore, they can retry */ } finally { this.busyId.set(null); }
  }

  protected async cancelEvent(ev: OwnerSharedEvent): Promise<void> {
    if (typeof confirm === 'function' && !confirm(this.copy.cancelEventConfirm)) return;
    const token = this.readToken();
    if (!token) return;
    this.busyId.set(ev.id);
    try {
      await this.api.cancelSharedEvent(token, ev.id);
      await this.loadEvents();
    } catch { /* ignore */ } finally { this.busyId.set(null); }
  }

  protected whenText(ev: OwnerSharedEvent): string {
    try {
      const day = new Intl.DateTimeFormat(this.locale.code, {
        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      }).format(new Date(ev.start));
      return day;
    } catch { return ev.start; }
  }

  private readToken(): string | null {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  }
}
