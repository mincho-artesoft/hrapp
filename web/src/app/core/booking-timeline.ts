import type { BookingCalendar, BookingTimelineMove } from './booking-workspace';
import type { CalendarRepeatRule, WebCalendarEvent } from './calendar-platform-api.service';
import { bookingParticipantName, bookingStatus, BookingEventStatus, unreservedStatus } from './booking-status';
import { calendarOccurrences, wallDate, calendarDayStart } from './calendar-recurrence';

interface TimelineEntry {
  id: string;
  title: string;
  status: BookingEventStatus;
  readOnly?: boolean;
  proposed?: boolean;
  allDay?: boolean;
  timeZone?: string;
  location?: string;
  videoCallURL?: string;
  start: Date;
  end: Date;
}

const frequencies: CalendarRepeatRule['frequency'][] = ['daily', 'weekly', 'monthly', 'yearly'];

// A day booked in another time zone still occupies the same civil date on this grid.
export function bookingDisplayDate(iso: string, zone: string): number {
  const day = wallDate(new Date(iso), zone);
  return new Date(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()).getTime();
}
export function bookingMidnight(date: number, zone: string): Date | null {
  const day = new Date(date);
  return calendarDayStart(new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())), zone);
}

export function bookingTimelineEvents(calendar: BookingCalendar, first: Date, end: Date,
                                     text: (label: string) => string, moves: BookingTimelineMove[] = []): WebCalendarEvent[] {
  const bookings = calendar.requests.filter(request => request.status !== 'declined');
  const entries: TimelineEntry[] = [];
  const holds: {start: Date; end: Date}[] = [];
  for (const request of bookings) {
    const move = request.proposal ? undefined : moves.find(m => m.requestId === request.id && m.calendarId === calendar.id && m.revision === calendar.revision);
    const slot = request.proposal ?? request;
    const proposed = !!request.proposal || !!move;
    const start = new Date(move?.start ?? slot.start), finish = new Date(move?.end ?? slot.end);
    if (proposed) holds.push({start: new Date(request.start), end: new Date(request.end)});
    if (start >= end || finish <= first || finish <= start) continue;
    holds.push({start, end: finish});
    entries.push({
      id: 'request-' + request.id, title: [slot.title, bookingParticipantName(request.guestName, text)].filter(Boolean).join(' · '),
      start, end: finish, allDay: move?.allDay ?? slot.allDay, timeZone: move?.timeZone ?? slot.timeZone,
      location: slot.location, videoCallURL: slot.videoCallURL, proposed, status: proposed ? 'pending' : request.status, readOnly: proposed || request.status === 'past',
    });
  }
  for (const slot of calendar.slots) {
    const event: WebCalendarEvent = {id: slot.id, allDay:slot.allDay, start: slot.start, end: slot.end, title: slot.title ?? '',
      details: {timeZone: slot.timeZone, recurrenceRules: slot.rule ? [{...slot.rule, frequency: frequencies[slot.rule.frequency]}] : []}};
    const excluded = new Set(slot.excludedStarts?.map(value => Date.parse(value)));
    for (const occurrence of calendarOccurrences(event, first, end, slot.hoursOfDay, slot.dailyPattern)) {
      const start = new Date(occurrence.start), finish = new Date(occurrence.end);
      if (start < end && finish > first && finish > start && !excluded.has(start.getTime())
          && !holds.some(r => r.start < finish && r.end > start)) {
        entries.push({id: 'slot-' + occurrence.id, title: event.title, allDay:slot.allDay, timeZone:slot.timeZone, location: slot.location, videoCallURL: slot.videoCallURL, status: unreservedStatus(finish), start, end: finish});
      }
    }
  }
  return entries.map(entry => ({
    id: entry.id, allDay:entry.allDay, calendarId: calendar.id, calendarTitle: calendar.title, color: bookingStatus[entry.status].color,
    title: [entry.title, text(entry.proposed ? 'Proposed change' : bookingStatus[entry.status].label)].filter(Boolean).join(' · '), location: entry.location,
    details: {videoCallURL:entry.videoCallURL, timeZone:entry.timeZone},
    start: entry.start.toISOString(), end: entry.end.toISOString(), readOnly: entry.readOnly ?? false,
  }));
}
