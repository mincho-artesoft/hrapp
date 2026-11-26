import type { BookingCalendar, BookingTimelineMove } from './booking-workspace';
import type { CalendarRepeatRule, WebCalendarEvent } from './calendar-platform-api.service';
import { bookingStatus, BookingEventStatus, unreservedStatus } from './booking-status';
import { calendarOccurrences } from './calendar-recurrence';

interface TimelineEntry {
  id: string;
  title: string;
  status: BookingEventStatus;
  readOnly?: boolean;
  proposed?: boolean;
  location?: string;
  start: Date;
  end: Date;
}

const frequencies: CalendarRepeatRule['frequency'][] = ['daily', 'weekly', 'monthly', 'yearly'];

export function bookingTimelineEvents(calendar: BookingCalendar, first: Date, end: Date,
                                     text: (label: string) => string, moves: BookingTimelineMove[] = []): WebCalendarEvent[] {
  const bookings = calendar.requests.filter(request => request.status !== 'declined');
  const reservations: TimelineEntry[] = [];
  for (const request of bookings) {
    const start = new Date(request.start), finish = new Date(request.end);
    if (start < end && finish > first && finish > start) {
      reservations.push({id: 'request-' + request.id, title: [request.title, request.guestName].filter(Boolean).join(' · '),
        location: request.location, status: request.status, readOnly: !!request.proposal || request.status === 'past', start, end: finish});
    }
    if (request.proposal) {
      const p = request.proposal, start = new Date(p.start), finish = new Date(p.end);
      if (start < end && finish > first) {
        if (p.start === request.start && p.end === request.end) {
          const original = reservations.findIndex(r => r.id === 'request-' + request.id);
          if (original >= 0) reservations.splice(original, 1);
        }
        reservations.push({id:'proposal-' + request.id, title:[p.title,request.guestName].filter(Boolean).join(' · '),
          location:p.location, status:'pending', proposed:true, readOnly:true, start, end:finish});
      }
    }
  }
  const entries = [...reservations];
  for (const slot of calendar.slots) {
    const event: WebCalendarEvent = {id: slot.id, start: slot.start, end: slot.end, title: slot.title ?? '',
      details: {timeZone: slot.timeZone, recurrenceRules: slot.rule ? [{...slot.rule, frequency: frequencies[slot.rule.frequency]}] : []}};
    for (const occurrence of calendarOccurrences(event, first, end)) {
      const start = new Date(occurrence.start), finish = new Date(occurrence.end);
      if (start < end && finish > first && finish > start && !slot.excludedStarts?.includes(start.toISOString())
          && !reservations.some(r => r.start < finish && r.end > start)) {
        entries.push({id: 'slot-' + occurrence.id, title: event.title, location: slot.location, status: unreservedStatus(finish), start, end: finish});
      }
    }
  }
  for (const move of moves) {
    if (move.calendarId !== calendar.id || move.revision !== calendar.revision) continue;
    const request = move.requestId ? bookings.find(r => r.id === move.requestId) : undefined;
    const source = request ?? calendar.slots.find(slot => slot.id === move.slotId.split('@')[0]);
    if (!source) continue;
    const originalId = request ? 'request-' + request.id : 'slot-' + move.slotId;
    const original = entries.findIndex(entry => entry.id === originalId);
    if (original >= 0) {
      if (request) entries[original].readOnly = true;
      else entries.splice(original, 1);
    }
    const start = new Date(move.start), finish = new Date(move.end);
    if (start >= end || finish <= first) continue;
    entries.push({id: request ? 'proposal-' + request.id : originalId,
      title: [source.title, request?.guestName].filter(Boolean).join(' · '), location: source.location,
      proposed: !!request, status: request ? 'pending' : unreservedStatus(finish), readOnly: true, start, end: finish});
  }
  return entries.map(entry => ({
    id: entry.id, calendarId: calendar.id, calendarTitle: calendar.title, color: bookingStatus[entry.status].color,
    title: [entry.title, text(entry.proposed ? 'Proposed change' : bookingStatus[entry.status].label)].filter(Boolean).join(' · '), location: entry.location,
    start: entry.start.toISOString(), end: entry.end.toISOString(), readOnly: entry.readOnly ?? false,
  }));
}
