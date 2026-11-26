import type { Appointment, BookingCalendar, BookingSlot } from './booking-workspace';

export type BookingEventStatus = 'available' | Appointment['status'];

export const bookingStatus = {
  available: { label: 'Available time', color: '#0A84FF' },
  pending:   { label: 'Pending',        color: '#FF9F0A' },
  accepted:  { label: 'Accepted',       color: '#34C759' },
  declined:  { label: 'Declined',       color: '#FF453A' },
  past:      { label: 'Past',           color: '#8E8E93' },
} satisfies Record<BookingEventStatus, { label: string; color: string }>;

export function unreservedStatus(end: Date): BookingEventStatus {
  return end.getTime() <= Date.now() ? 'past' : 'available';
}

export function slotStatus(calendar: BookingCalendar, slot: BookingSlot): BookingEventStatus {
  if (slot.rule) return 'available';
  const reservation = slotReservation(calendar, slot);
  return reservation?.status ?? unreservedStatus(new Date(slot.end));
}

export function slotReservation(calendar: BookingCalendar, slot: BookingSlot): Appointment | undefined {
  if (slot.rule) return undefined;
  return calendar.requests.find(r => {
    const held = r.proposal ?? r;
    return r.slotId === slot.id && r.status !== 'declined' && held.start === slot.start && held.end === slot.end;
  });
}
