import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, afterRenderEffect, computed, inject, input, signal, untracked, viewChild } from '@angular/core';
import { BookingCalendar } from '../../core/booking-workspace';
import { CalendarLocalization, CalendarNativeTextPipe } from '../../core/calendar-localization';
import { CalendarRepeatRule, WebCalendarEvent } from '../../core/calendar-platform-api.service';
import { calendarOccurrences } from '../../core/calendar-recurrence';
import { nativeTimelineLayout } from '../../core/calendar-timeline-layout';
import { CalendarSymbolComponent } from './calendar-symbol.component';

interface TimelineEntry {
  id: string;
  title: string;
  status: string;
  start: Date;
  end: Date;
}

const frequencies: CalendarRepeatRule['frequency'][] = ['daily', 'weekly', 'monthly', 'yearly'];
const statusLabel = {pending: 'Pending', accepted: 'Accepted', past: 'Past', declined: 'Declined'};

function dateKey(day: Date) {
  return [String(day.getFullYear()).padStart(4, '0'), String(day.getMonth() + 1).padStart(2, '0'), String(day.getDate()).padStart(2, '0')].join('-');
}

function addDays(day: Date, count: number) {
  const date = new Date(day);
  date.setDate(date.getDate() + count);
  return date;
}

function minutes(time: Date) { return time.getHours() * 60 + time.getMinutes(); }

function timelineEntries(calendar: BookingCalendar, first: Date, end: Date): TimelineEntry[] {
  const bookings = calendar.requests.filter(request => request.status !== 'declined');
  const occupied = new Set(bookings.map(request => request.slotId));
  const reservations: TimelineEntry[] = [];
  for (const request of bookings) {
    const start = new Date(request.start), finish = new Date(request.end);
    if (start < end && finish > first && finish > start) {
      reservations.push({id: 'request-' + request.id, title: [request.title, request.guestName].filter(Boolean).join(' · '),
        status: statusLabel[request.status], start, end: finish});
    }
  }
  const entries = [...reservations];
  for (const slot of calendar.slots) {
    const event: WebCalendarEvent = {id: slot.id, start: slot.start, end: slot.end, title: slot.title ?? '',
      details: {timeZone: slot.timeZone, recurrenceRules: slot.rule ? [{...slot.rule, frequency: frequencies[slot.rule.frequency]}] : []}};
    for (const occurrence of calendarOccurrences(event, first, end)) {
      const start = new Date(occurrence.start), finish = new Date(occurrence.end);
      if (start < end && finish > first && finish > start && !occupied.has(occurrence.id)
          && !reservations.some(r => r.start < finish && r.end > start)) {
        entries.push({id: 'slot-' + occurrence.id, title: event.title, status: 'Available time', start, end: finish});
      }
    }
  }
  return entries;
}

@Component({
  selector: 'cc-booking-calendar-timeline',
  standalone: true,
  imports: [CalendarNativeTextPipe, CalendarSymbolComponent],
  templateUrl: './booking-calendar-timeline.component.html',
  styleUrl: './booking-calendar-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCalendarTimelineComponent implements AfterViewInit, OnDestroy {
  readonly calendar = input.required<BookingCalendar>();
  readonly locale = inject(CalendarLocalization);
  readonly anchor = signal(dateKey(new Date()));
  readonly count = signal(3);
  readonly hours = Array.from({length: 24}, (_, hour) => hour);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private observer?: ResizeObserver;
  private readonly first = computed(() => new Date(this.anchor() + 'T00:00:00'));
  private readonly entries = computed(() => timelineEntries(this.calendar(), this.first(), addDays(this.first(), this.count())));
  readonly columns = computed(() => {
    const formatter = new Intl.DateTimeFormat(this.locale.formattingLocale(), {weekday: 'short', month: 'short', day: 'numeric'});
    const entries = this.entries(), today = dateKey(new Date());
    return Array.from({length: this.count()}, (_, index) => {
      const day = addDays(this.first(), index), end = addDays(day, 1), key = dateKey(day);
      const blocks = nativeTimelineLayout(entries.filter(e => e.start < end && e.end > day).map(data => {
        const startMinutes = data.start <= day ? 0 : minutes(data.start);
        const endMinutes = data.end >= end ? 1440 : Math.max(startMinutes + 1, minutes(data.end));
        return {id: data.id, startMinutes, endMinutes, data};
      }), {start: 0, end: 1440, minimumHeaderDuration: 15});
      return {key, label: formatter.format(day), today: key === today, blocks};
    });
  });
  readonly ruler = computed(() => this.hours.map(hour => this.locale.shortTime().format(new Date(2024, 0, 15, hour))));

  constructor() {
    afterRenderEffect(() => {
      const first = this.first();
      this.count();
      const entries = untracked(this.entries);
      const earliest = entries.reduce((hour, entry) => Math.min(hour, +entry.start), Infinity);
      const hour = Number.isFinite(earliest) ? new Date(Math.max(+first, earliest)).getHours() : 9;
      this.scroller().nativeElement.scrollTop = Math.max(0, hour - 1) * 52;
    });
  }
  ngAfterViewInit() {
    this.observer = new ResizeObserver(([entry]) => this.count.set(Math.max(2, Math.min(8, Math.floor((entry.contentRect.width - 56) / 100)))));
    this.observer.observe(this.host.nativeElement);
  }
  ngOnDestroy() { this.observer?.disconnect(); }
  move(direction: number) { this.anchor.set(dateKey(addDays(this.first(), direction * this.count()))); }
  today() { this.anchor.set(dateKey(new Date())); }
  selectDate(value: string) { if (value && Number.isFinite(+new Date(value + 'T00:00:00'))) this.anchor.set(value); }
  describe(entry: TimelineEntry) {
    const time = this.locale.shortTime();
    return [entry.title, this.locale.text(entry.status), time.format(entry.start) + ' – ' + time.format(entry.end)].filter(Boolean).join(' · ');
  }
}
