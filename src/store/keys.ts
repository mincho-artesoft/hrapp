/**
 * The S3 key layout — the whole data model. Ported verbatim from the original
 * Lambda's lib/store.mjs so the NestJS service reads and writes exactly the same
 * objects in the same bucket (S3-as-DB is preserved).
 */
export const keys = {
  meta: (calId: string) => `cal/${calId}/meta.json`,
  acl: (calId: string) => `cal/${calId}/acl.json`,
  event: (calId: string, evId: string) => `cal/${calId}/events/${evId}.json`,
  events: (calId: string) => `cal/${calId}/events/`,
  feed: (feedId: string) => `f/${feedId}.ics`,
  feedIndex: (feedId: string) => `idx/feed/${feedId}.json`,
  token: (hash: string) => `idx/token/${hash}.json`,
  principal: (id: string) => `principal/${id}.json`,
  identity: (provider: string, hash: string) => `idx/${provider}/${hash}.json`,
  accountEmail: (hash: string) => `idx/account-email/${hash}.json`,
  eventFeed: (calId: string, eventId: string) => `idx/eventfeed/${calId}/${eventId}.json`,
  receivedInvites: (principalId: string) => `principal/${principalId}/received/`,
  receivedInvite: (principalId: string, eventId: string) => `principal/${principalId}/received/${eventId}.json`,
  receivedICloudCalendars: (principalId: string) =>
    `principal/${principalId}/received-icloud-calendars/`,
  receivedICloudCalendar: (principalId: string, ownerId: string, calendarId: string) =>
    `principal/${principalId}/received-icloud-calendars/${encodeURIComponent(ownerId)}--${encodeURIComponent(calendarId)}.json`,
  pendingEventInvitations: (emailHash: string) => `idx/event-invite-email/${emailHash}/`,
  pendingEventInvitation: (emailHash: string, calId: string, eventId: string) =>
    `idx/event-invite-email/${emailHash}/${encodeURIComponent(calId)}--${encodeURIComponent(eventId)}.json`,
  icloudCalendarSharing: (principalId: string, calendarId: string) =>
    `principal/${principalId}/icloud-calendars/${calendarId}.json`,
  icloudCalendarEvents: (principalId: string, calendarId: string) =>
    `principal/${principalId}/icloud-calendar-events/${calendarId}.json`,
  pendingICloudCalendarInvitations: (emailHash: string) =>
    `idx/icloud-calendar-invite-email/${emailHash}/`,
  pendingICloudCalendarInvitation: (emailHash: string, principalId: string, calendarId: string) =>
    `idx/icloud-calendar-invite-email/${emailHash}/${encodeURIComponent(principalId)}--${encodeURIComponent(calendarId)}.json`,

  // Registrant self-management tokens (not appointment scheduling).
  manage: (token: string) => `idx/manage/${token}.json`,

  // Shareable fixed-date events: one event, many registrants, each with their
  // own scoped feed. The event itself is a normal calendar event (keys.event),
  // marked createdBy:'shared'; these index the public handle and the registrants.
  eventPub: (handle: string) => `idx/eventpub/${handle}.json`, // public handle -> {calId, eventId}
  eventRegs: (calId: string, eventId: string) => `idx/eventreg/${calId}/${eventId}/`, // prefix: all registrants
  eventReg: (calId: string, eventId: string, token: string) => `idx/eventreg/${calId}/${eventId}/${token}.json`,

  // Web Scheduling, Interactive Calendar, Guest Bookings & Admin Platform
  authOtp: (emailHash: string) => `idx/auth-otp/${emailHash}.json`,
  bookingConfig: (calId: string) => `cal/${calId}/booking.json`,
  bookingBusy: (calId: string) => `cal/${calId}/booking-busy.json`,
  oauthConnections: (calId: string) => `cal/${calId}/oauth-connections.json`,
  bookedBucket: (calId: string, bucketKey: string) => `cal/${calId}/booked-v2/${bucketKey}.json`,
  bookingHandle: (handle: string) => `idx/booking-handle/${handle}.json`,
  bookingInvite: (token: string) => `idx/booking-invite/${token}.json`,
  hostBookingInvitesPrefix: (calId: string) => `cal/${calId}/booking-invites/`,
  hostBookingInvite: (calId: string, token: string) => `cal/${calId}/booking-invites/${token}.json`,
  bookingOtp: (handle: string, emailHash: string) => `idx/booking-otp/${handle}--${emailHash}.json`,
  guestBookingsPrefix: (emailHash: string) => `idx/guest-bookings/${emailHash}/`,
  guestBooking: (emailHash: string, bookingId: string) => `idx/guest-bookings/${emailHash}/${bookingId}.json`,
  hostBookingsPrefix: () => `idx/booking-hosts/`,
  hostBookingSummary: (calId: string) => `idx/booking-hosts/${calId}.json`,
  allBookingsPrefix: () => `idx/booking-all/`,
  allBookingRecord: (bookingId: string) => `idx/booking-all/${bookingId}.json`,
  adminSettings: () => `idx/admin/settings.json`,
};
