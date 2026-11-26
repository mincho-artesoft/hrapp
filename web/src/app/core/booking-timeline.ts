import type { BookingCalendar } from './booking-workspace';
import type { CalendarRepeatRule, WebCalendarEvent } from './calendar-platform-api.service';
import { bookingStatus, BookingEventStatus, unreservedStatus } from './booking-status';
import { calendarOccurrences } from './calendar-recurrence';

interface TimelineEntry {
  id: string;
  title: string;
  status: BookingEventStatus;
  location?: string;
  start: Date;
  end: Date;
}

const frequencies: CalendarRepeatRule['frequency'][] = ['daily', 'weekly', 'monthly', 'yearly'];

export function bookingTimelineEvents(calendar: BookingCalendar, first: Date, end: Date,
                                     text: (label: string) => string): WebCalendarEvent[] {
  const bookings = calendar.requests.filter(request => request.status !== 'declined');
  const occupied = new Set(bookings.map(request => request.slotId));
  const reservations: TimelineEntry[] = [];
  for (const request of bookings) {
    const start = new Date(request.start), finish = new Date(request.end);
    if (start < end && finish > first && finish > start) {
      reservations.push({id: 'request-' + request.id, title: [request.title, request.guestName].filter(Boolean).join(' · '),
        location: request.location, status: request.status, start, end: finish});
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
        entries.push({id: 'slot-' + occurrence.id, title: event.title, location: slot.location, status: unreservedStatus(finish), start, end: finish});
      }
    }
  }
  return entries.map(entry => ({
    id: entry.id, calendarId: calendar.id, calendarTitle: calendar.title, color: bookingStatus[entry.status].color,
    title: [entry.title, text(bookingStatus[entry.status].label)].filter(Boolean).join(' · '), location: entry.location,
    start: entry.start.toISOString(), end: entry.end.toISOString(), readOnly: true,
  }));
}
