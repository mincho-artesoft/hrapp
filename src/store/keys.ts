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

  // Booking (Calendly-style scheduling on top of a calendar)
  booking: (calId: string) => `cal/${calId}/booking.json`, // owner's availability config
  bookingHandle: (handle: string) => `idx/book/${handle}.json`, // public handle -> {calId}
  booked: (calId: string, slotKey: string) => `cal/${calId}/booked/${slotKey}.json`, // atomic slot claim

  // Web booking access: pairing a browser to an installed app, and Stripe entitlement
  pair: (code: string) => `idx/pair/${code}.json`, // short-lived QR pairing code
  stripeCustomer: (id: string) => `idx/stripe/${id}.json`, // stripe customer -> {principalId}

  // An invitee's manage link: unguessable token -> the booking they can move or cancel
  manage: (token: string) => `idx/manage/${token}.json`,
  // Reverse pointer so the owner, who knows only the event, can find that manage
  // record to decline or move a booking from their own side.
  eventManage: (calId: string, eventId: string) => `idx/eventmanage/${calId}/${eventId}.json`,

  // "My bookings": a passwordless session, and every booking an e-mail ever made
  session: (token: string) => `idx/session/${token}.json`, // magic-link session -> {emailHash,email}
  inviteeIndex: (emailHash: string) => `idx/invitee/${emailHash}/`, // prefix: all of one person's bookings
  inviteeBooking: (emailHash: string, token: string) => `idx/invitee/${emailHash}/${token}.json`,

  // Shareable fixed-date events: one event, many registrants, each with their
  // own scoped feed. The event itself is a normal calendar event (keys.event),
  // marked createdBy:'shared'; these index the public handle and the registrants.
  eventPub: (handle: string) => `idx/eventpub/${handle}.json`, // public handle -> {calId, eventId}
  eventRegs: (calId: string, eventId: string) => `idx/eventreg/${calId}/${eventId}/`, // prefix: all registrants
  eventReg: (calId: string, eventId: string, token: string) => `idx/eventreg/${calId}/${eventId}/${token}.json`,
};
