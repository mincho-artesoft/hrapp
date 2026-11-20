import { afterNextRender, computed, Component, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { CalendarLocalization, CalendarNativeTextPipe } from '../../core/calendar-localization';
import { CalendarNativeService, PendingInvitation } from '../../core/calendar-native.service';
import { computeIosEventStyle } from "../../core/ios-event-palette";
import { CalendarChoiceComponent } from "./calendar-choice.component";
import { CalendarSymbolComponent } from "./calendar-symbol.component";
import { DeviceCalendar, CalendarPlatformApiService } from '../../core/calendar-platform-api.service';
import { CalendarProgressComponent } from './calendar-progress.component';

@Component({
  selector: 'cc-email-invitation',
  imports: [CalendarNativeTextPipe, CalendarProgressComponent, CalendarChoiceComponent, CalendarSymbolComponent],
  template: `
    <dialog #sheet class="native-sheet" [class.light]="theme() === 'light'" aria-labelledby="email-invitation-title"
      (cancel)="$event.preventDefault(); close()">
      <header class="sheet-heading">
        <button type="button" class="round-button" [attr.aria-label]="'Close' | nativeText" [disabled]="saving()" (click)="close()"><cc-symbol name="xmark" /></button>
        <h2 id="email-invitation-title">{{ (isCalendar() ? 'Calendar invitation' : 'Shared event') | nativeText }}</h2>
        <span class="round-spacer" aria-hidden="true"></span>
      </header>
      <div class="sheet-body">
        @let item = invitation();
        @if (loading()) {
          <cc-calendar-progress />
        } @else if (item) {
          @if (isCalendar()) {
            <div class="calendar-preview">
              <span class="calendar-icon" [style.color]="palette().hex"><cc-symbol name="calendar" /></span>
              <div><h3>{{ item.title }}</h3><p>{{ 'Shared calendar' | nativeText }}</p></div>
            </div>
          } @else {
            <div>
              <div class="event-date"><cc-symbol name="calendar" />{{ schedule().day }}</div>
              <div class="event-card" [class.all-day]="item.allDay" [style.background]="palette().fill"
                [style.--stripe]="palette().accentBar" [style.color]="palette().detailColor">
                <h3 [style.color]="palette().titleColor">{{ item.title }}</h3>
                <div><cc-symbol [name]="item.allDay ? 'calendar' : 'clock'" />{{ schedule().time }}</div>
                @if (item.location) { <div><cc-symbol name="location" />{{ item.location }}</div> }
              </div>
            </div>
            <div class="calendar-picker">
              <strong><cc-symbol name="calendar" />{{ 'Calendar' | nativeText }}</strong>
              @if (options().length) {
                <cc-choice [options]="options()" [label]="'Calendar' | nativeText" [value]="destination()" [disabled]="saving()" (valueChange)="selected.set($event)" />
              } @else { <span>{{ 'Add a writable calendar first.' | nativeText }}</span> }
            </div>
          }
          <button type="button" class="add" [disabled]="saving() || (!isCalendar() && !destination())" (click)="add()">
            @if (saving()) { <cc-calendar-progress />{{ 'Adding…' | nativeText }} }
            @else { <cc-symbol [name]="isCalendar() ? 'person.badge.plus' : 'calendar.badge.plus'" />
              {{ (isCalendar() ? 'Add to Shared with me' : 'Add to Calendar') | nativeText }} }
          </button>
        } @else if (!failed()) {
          <p>{{ 'No pending invitations.' | nativeText }}</p>
          <p>{{ api.profile()?.email }}</p>
        }
        @if (failed()) {
          <p role="alert">{{ failed() | nativeText }}</p>
          @if (!invitation()) { <button type="button" (click)="retry.update(increment)">{{ 'Try Again' | nativeText }}</button> }
        }
      </div>
    </dialog>`,
  styleUrl: './calendar-email-invitation.component.scss',
})
export class CalendarEmailInvitationComponent {
  readonly link = input.required<string>();
  readonly calendars = input.required<DeviceCalendar[]>();
  readonly preferred = input('');
  readonly theme = input<'light' | 'dark'>('dark');
  readonly selected = signal('');
  readonly options = computed(() => this.calendars().filter(c => c.allowsChanges && c.available !== false)
    .map(c => ({ value: c.id, label: c.title, color: c.color || '#0A84FF' })));
  readonly destination = computed(() => {
    const options = this.options();
    return [this.selected(), this.preferred()].find(id => options.some(c => c.value === id)) || options[0]?.value || '';
  });
  readonly isCalendar = computed(() => this.link().startsWith('invite=calendar&'));
  readonly palette = computed(() => computeIosEventStyle(this.invitation()?.color, this.theme()));
  private readonly localization = inject(CalendarLocalization);
  readonly schedule = computed(() => {
    const item = this.invitation();
    if (!item?.start || !item.end) return {day: '', time: ''};
    const start = new Date(item.start), end = new Date(item.end);
    if (!Number.isFinite(+start) || !Number.isFinite(+end)) return {day: '', time: ''};
    const locale = this.localization.formattingLocale();
    let timeZone: string | undefined;
    try {
      const tz = item.eventUrl && new URL(item.eventUrl).searchParams.get('timeZone');
      if (tz) timeZone = new Intl.DateTimeFormat(locale, {timeZone: tz}).resolvedOptions().timeZone;
    } catch { /* Older invitations may omit the time zone. */ }
    const date = new Intl.DateTimeFormat(locale, {dateStyle:'full', timeZone});
    const short = new Intl.DateTimeFormat(locale, {month:'numeric', day:'numeric', timeZone});
    const time = new Intl.DateTimeFormat(locale, {hour:'numeric', minute:'2-digit', hourCycle:this.localization.shortTime().resolvedOptions().hourCycle, timeZone});
    const multiDay = date.format(start) !== date.format(end);
    const label = (value: Date) => (multiDay ? short.format(value) + ' ' : '') + time.format(value);
    return {day:date.format(start), time:item.allDay ? this.localization.text('All-day event') : label(start) + ' – ' + label(end)};
  });
  readonly closed = output<void>();
  readonly changed = output<void>();
  readonly api = inject(CalendarPlatformApiService);
  private readonly sharing = inject(CalendarNativeService);
  private readonly sheet = viewChild.required<ElementRef<HTMLDialogElement>>('sheet');
  readonly invitation = signal<PendingInvitation | null>(null);
  private acceptedInvitation: PendingInvitation | null = null;
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly failed = signal('');
  readonly retry = signal(0);
  readonly increment = (n: number) => n + 1;

  constructor() {
    afterNextRender(() => this.sheet().nativeElement.showModal());
    effect(onCleanup => {
      const link = this.link();
      const token = this.api.token();
      this.retry();
      let current = true;
      onCleanup(() => { current = false; });
      const params = new URLSearchParams(link);
      const id = params.get('id');
      const kind = params.get('invite');
      this.invitation.set(null);
      this.acceptedInvitation = null;
      this.selected.set('');
      this.failed.set('');
      this.saving.set(false);
      this.loading.set(false);
      if (!token || !id || !/^[a-f0-9]{64}$/.test(id) || !['event', 'calendar'].includes(kind ?? '')) return;
      const path = kind === 'event' ? '/event-invitations/pending' : '/icloud-calendar-invitations/pending';
      this.loading.set(true);
      this.sharing.request<{ invitations: PendingInvitation[] }>(path)
        .then(result => { if (current) this.invitation.set(result.invitations.find(item => item.id === id) ?? null); })
        .catch(error => { if (current) this.failed.set(error.message || 'Could not load invitations.'); })
        .finally(() => { if (current) this.loading.set(false); });
    });
  }

  close() {
    if (!this.saving()) this.closed.emit();
  }

  async add() {
    const item = this.invitation();
    const token = this.api.token();
    const calendarId = this.destination();
    if (!item || this.saving() || (!item.calendarId && !calendarId)) return;
    this.saving.set(true);
    this.failed.set('');
    try {
      if (this.acceptedInvitation !== item) {
        await this.sharing.respond(item, true);
        if (this.invitation() !== item || this.api.token() !== token) return;
        this.acceptedInvitation = item;
      }
      if (item.eventId && item.feedId) {
        await this.sharing.request(`/events/${encodeURIComponent(item.eventId)}/calendar`, 'PUT', {feedId: item.feedId, calendarId});
        this.sharing.refreshAfterChange();
      }
      if (this.invitation() === item && this.api.token() === token) {
        this.changed.emit();
        this.closed.emit();
      }
    } catch (error) {
      if (this.invitation() === item) this.failed.set(error instanceof Error ? error.message : 'Could not update invitation.');
    } finally {
      if (this.invitation() === item) this.saving.set(false);
    }
  }
}
