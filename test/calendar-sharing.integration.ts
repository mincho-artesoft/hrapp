import assert from 'node:assert/strict';
import { CalendarService } from '../src/calendar/calendar.service';
import { CoreService } from '../src/core/core.service';
import { EmailService } from '../src/email/email.service';
import { keys } from '../src/store/keys';

type JsonValue = Record<string, any>;

class MemoryStore {
  readonly keys = keys;
  private readonly objects = new Map<string, { value: JsonValue; revision: number }>();
  private readonly feeds = new Map<string, string>();

  async getJSON(key: string): Promise<any> {
    const stored = this.objects.get(key);
    return stored ? structuredClone(stored.value) : null;
  }

  async getText(key: string): Promise<string | null> {
    return this.feeds.get(key) ?? null;
  }

  async getJSONWithETag(key: string): Promise<{ value: any; etag: string } | null> {
    const stored = this.objects.get(key);
    return stored
      ? { value: structuredClone(stored.value), etag: String(stored.revision) }
      : null;
  }

  async putJSON(key: string, value: any): Promise<void> {
    const revision = (this.objects.get(key)?.revision ?? 0) + 1;
    this.objects.set(key, { value: structuredClone(value), revision });
  }

  async putJSONIfAbsent(key: string, value: any): Promise<boolean> {
    if (this.objects.has(key)) return false;
    this.objects.set(key, { value: structuredClone(value), revision: 1 });
    return true;
  }

  async putJSONIfMatch(key: string, value: any, etag: string): Promise<boolean> {
    const stored = this.objects.get(key);
    if (!stored || String(stored.revision) !== etag) return false;
    this.objects.set(key, {
      value: structuredClone(value),
      revision: stored.revision + 1,
    });
    return true;
  }

  async listKeys(prefix: string): Promise<string[]> {
    return [...this.objects.keys()].filter((key) => key.startsWith(prefix)).sort();
  }

  async del(key: string): Promise<void> {
    this.objects.delete(key);
    this.feeds.delete(key);
  }

  async putFeed(key: string, value: string): Promise<void> {
    this.feeds.set(key, value);
  }
}

class FakeEmailService {
  readonly eventInvitations: any[] = [];
  readonly calendarInvitations: any[] = [];

  sharedEventIconPng(): Buffer { return Buffer.from('icon'); }
  async sharedEventQRCodePng(): Promise<Buffer> { return Buffer.from('qr'); }
  async sendSharedEventInvitation(value: any): Promise<void> {
    this.eventInvitations.push(structuredClone(value));
  }
  async sendSharedCalendarInvitation(value: any): Promise<void> {
    this.calendarInvitations.push(structuredClone(value));
  }
}

const owner = {
  principalId: 'owner-user',
  calId: 'owner-calendar',
  identityProvider: 'google',
  identityId: 'google:owner',
};
const recipient = {
  principalId: 'recipient-user',
  calId: 'recipient-calendar',
  identityProvider: 'google',
  identityId: 'google:recipient',
};
const ownerEmail = 'owner@example.com';
const recipientEmail = 'recipient@example.com';

function expectStatus(actual: { status: number; body: any }, expected: number, label: string): any {
  assert.equal(
    actual.status,
    expected,
    `${label}: expected HTTP ${expected}, got ${actual.status}: ${JSON.stringify(actual.body)}`,
  );
  return actual.body;
}

function htmlAttribute(value: string): string {
  return value.replace(/&amp;/g, '&');
}

function invitationButtonURL(html: string, label: string): URL {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<a href="([^"]+)"[^>]*>${escapedLabel}</a>`));
  assert.ok(match, `${label} button must be present in the invitation e-mail`);
  return new URL(htmlAttribute(match[1]));
}

function invitationQRCodeTarget(html: string, alt: string): string {
  const escapedAlt = alt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<img src="([^"]+)"[^>]*alt="${escapedAlt}"`));
  assert.ok(match, `${alt} must be present in the invitation e-mail`);
  const assetURL = new URL(htmlAttribute(match[1]));
  return assetURL.searchParams.get('url') ?? '';
}

async function testInvitationEmailLinks(): Promise<void> {
  const emailService = new EmailService();
  const sent: Array<{ to: string; subject: string; html: string }> = [];
  (emailService as any).sendEmail = async (to: string, subject: string, html: string) => {
    sent.push({ to, subject, html });
  };

  const eventServerURL = 'https://api.cloud-calendars.com/event-invites/open?e=event-id&c=feed-id&title=New%20event&start=1977972000&end=1977977400&allDay=0&timeZone=Europe%2FSofia&color=%230088FF';
  await emailService.sendSharedEventInvitation({
    email: recipientEmail,
    access: 'reader',
    event: eventPayload('New event'),
    eventUrl: eventServerURL,
    timeZone: 'Europe/Sofia',
    senderName: 'Owner',
    senderEmail: ownerEmail,
    eventColor: '#0088FF',
  });
  assert.equal(sent.length, 1);
  const eventButtonURL = invitationButtonURL(sent[0].html, 'Open event');
  assert.equal(eventButtonURL.origin + eventButtonURL.pathname, 'https://api.cloud-calendars.com/event-invites/open');
  assert.equal(eventButtonURL.searchParams.get('e'), 'event-id');
  assert.equal(eventButtonURL.searchParams.get('c'), 'feed-id');
  assert.equal(
    invitationQRCodeTarget(sent[0].html, 'QR code to open the event'),
    eventServerURL,
    'event QR must keep the server invitation URL',
  );

  sent.length = 0;
  const calendarId = 'd'.repeat(64);
  const calendarServerURL = `https://api.cloud-calendars.com/icloud-calendar-invites/open?o=${owner.principalId}&c=${calendarId}`;
  await emailService.sendSharedCalendarInvitation({
    email: recipientEmail,
    access: 'writer',
    calendar: { title: 'Team calendar', color: '#FF9500' },
    ownerId: owner.principalId,
    calendarId,
    senderEmail: ownerEmail,
  });
  assert.equal(sent.length, 1);
  const calendarButtonURL = invitationButtonURL(sent[0].html, 'Open calendar');
  assert.equal(calendarButtonURL.origin + calendarButtonURL.pathname, 'https://api.cloud-calendars.com/icloud-calendar-invites/open');
  assert.equal(calendarButtonURL.searchParams.get('o'), owner.principalId);
  assert.equal(calendarButtonURL.searchParams.get('c'), calendarId);
  assert.equal(
    invitationQRCodeTarget(sent[0].html, 'QR code to open the calendar'),
    calendarServerURL,
    'calendar QR must keep the server invitation URL',
  );
}

async function seedAccount(
  store: MemoryStore,
  core: CoreService,
  principal: typeof owner,
  email: string,
): Promise<void> {
  await Promise.all([
    store.putJSON(keys.principal(principal.principalId), {
      id: principal.principalId,
      calId: principal.calId,
      identities: {
        google: { id: principal.identityId, email },
      },
    }),
    store.putJSON(keys.accountEmail(core.emailHash(email)), {
      principalId: principal.principalId,
    }),
    store.putJSON(keys.meta(principal.calId), {
      id: principal.calId,
      name: email,
      timeZone: 'Europe/Sofia',
      ownerId: principal.principalId,
    }),
    store.putJSON(keys.acl(principal.calId), {
      owner: principal.principalId,
      feeds: {
        [`${principal.principalId}-feed`]: {
          role: 'owner',
          principalId: principal.principalId,
        },
      },
    }),
  ]);
}

function eventPayload(title: string): any {
  return {
    title,
    start: '2032-09-03T10:00:00.000Z',
    end: '2032-09-03T11:30:00.000Z',
    allDay: false,
    location: 'Sofia\nBulgaria',
    url: 'https://example.com/meeting',
    localEventIdentifier: `local-${title}`,
    details: {
      notes: 'Complete shared event notes',
      timeZone: 'Europe/Sofia',
      availability: 'busy',
      travelTime: 900,
      alarms: [{ relativeOffset: -900 }],
      recurrenceRules: [],
      structuredLocation: {
        title: 'Sofia',
        geoLocation: { latitude: 42.6977, longitude: 23.3219 },
      },
    },
  };
}

function calendarEvent(title: string): any {
  return {
    id: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    title,
    start: '2032-09-04T12:00:00.000Z',
    end: '2032-09-04T13:00:00.000Z',
    allDay: false,
    location: 'Plovdiv\nBulgaria',
    url: 'https://example.com/calendar-event',
    details: {
      notes: 'Shared calendar event notes',
      timeZone: 'Europe/Sofia',
      availability: 'free',
      alarms: [{ relativeOffset: -600 }],
      recurrenceRules: [],
    },
  };
}

async function testEventSharing(service: CalendarService, email: FakeEmailService): Promise<void> {
  const eventId = 'event-sharing-roles';
  expectStatus(await service.upsertEvent(owner, eventId, eventPayload('Original event')), 201, 'create event');

  const grant = expectStatus(await service.createGrant(owner, {
    role: 'viewer',
    eventId,
    feedName: 'Original event',
  }), 201, 'create event grant');
  assert.match(
    await service.calendarFeed(`${grant.feedId}.ics`) ?? '',
    /BEGIN:VCALENDAR/,
    'generated feed is available through the API feed gateway',
  );
  assert.equal(await service.calendarFeed('../private.json'), null);
  const eventUrl = `https://api.cloud-calendars.com/event-invites/open?e=${eventId}&c=${grant.feedId}&title=Original%20event&start=1977972000&end=1977977400&allDay=0&timeZone=Europe%2FSofia&color=%230A84FF`;
  const eventLanding = await service.eventInvitationLanding({
    e: eventId,
    c: grant.feedId,
    timeZone: 'Europe/Sofia',
    color: '#0A84FF',
  });
  assert.equal(eventLanding.status, 200);
  assert.match(eventLanding.html, /data-view="app-clip-preview"/);
  assert.match(eventLanding.html, />Shared event</);
  assert.match(eventLanding.html, /class="preview-card"/);
  assert.match(eventLanding.html, /From <strong>owner@example\.com<\/strong>/);
  assert.match(
    eventLanding.html,
    /href="https:\/\/apps\.apple\.com\/us\/app\/cloud-calendars-sync-widget\/id6744690319">Download Cloud Calendars<\/a>/,
  );
  assert.doesNotMatch(eventLanding.html, /Download calendar event/);

  expectStatus(await service.inviteEventRecipients(owner, eventId, {
    eventUrl,
    invitations: [{ email: recipientEmail, access: 'reader' }],
  }), 201, 'invite event reader');
  assert.equal(email.eventInvitations.length, 1, 'event invitation email is requested once');

  const pending = expectStatus(
    await service.pendingEventInvitations(recipient),
    200,
    'list pending event invitations',
  );
  assert.equal(pending.invitations.length, 1);
  assert.equal(pending.invitations[0].access, 'reader');
  assert.equal(pending.invitations[0].title, 'Original event');

  const accepted = expectStatus(await service.rememberReceivedInvite(recipient, {
    eventId,
    feedId: grant.feedId,
    localEventIdentifier: 'recipient-local-event',
  }), 201, 'accept event invitation');
  assert.equal(accepted.access, 'reader');
  assert.equal(
    expectStatus(await service.pendingEventInvitations(recipient), 200, 'pending after accept')
      .invitations.length,
    0,
  );
  assert.equal(
    expectStatus(await service.receivedInviteAccess(recipient, eventId), 200, 'reader access').access,
    'reader',
  );
  expectStatus(
    await service.upsertEvent(recipient, eventId, {
      ...eventPayload('Reader must not edit'),
      feedId: grant.feedId,
    }),
    403,
    'reader event edit denied',
  );

  const recipientRow = expectStatus(
    await service.eventRecipients(owner, eventId),
    200,
    'owner sees recipients',
  ).recipients.find((value: any) => value.userId === recipient.principalId);
  assert.ok(recipientRow, 'accepted recipient is visible to the owner');

  expectStatus(await service.updateEventRecipientAccess(
    owner,
    eventId,
    recipientRow.id,
    { access: 'writer' },
  ), 200, 'promote event recipient to writer');
  expectStatus(await service.upsertEvent(recipient, eventId, {
    ...eventPayload('Writer updated event'),
    location: 'Varna\nBulgaria',
    feedId: grant.feedId,
  }), 200, 'writer updates canonical event');
  expectStatus(await service.eventRecipients(recipient, eventId), 403, 'writer cannot manage recipients');

  const ownerState = expectStatus(await service.sharedState(owner), 200, 'owner shared state');
  const updated = ownerState.outgoing.find((value: any) => value.id === eventId);
  assert.equal(updated.title, 'Writer updated event');
  assert.equal(updated.location, 'Varna\nBulgaria');
  assert.equal(updated.url, 'https://example.com/meeting');
  assert.equal(updated.details.notes, 'Complete shared event notes');

  expectStatus(await service.updateEventRecipientAccess(
    owner,
    eventId,
    recipientRow.id,
    { access: 'owner' },
  ), 200, 'promote event recipient to owner');
  const delegatedRecipients = expectStatus(
    await service.eventRecipients(recipient, eventId),
    200,
    'delegated owner sees recipients',
  ).recipients;
  const originalOwner = delegatedRecipients.find((value: any) => value.isOriginalOwner);
  assert.ok(originalOwner);
  expectStatus(await service.updateEventRecipientAccess(
    recipient,
    eventId,
    originalOwner.id,
    { access: 'reader' },
  ), 403, 'original event owner is immutable');

  expectStatus(await service.cancelEvent(recipient, eventId, {}), 200, 'delegated owner cancels event');
  const cancelled = expectStatus(await service.sharedState(owner), 200, 'cancelled owner state')
    .outgoing.find((value: any) => value.id === eventId);
  assert.equal(cancelled.status, 'cancelled');
  assert.equal(cancelled.title, 'Writer updated event');
  expectStatus(await service.upsertEvent(owner, eventId, eventPayload('Must stay cancelled')), 409, 'cancel is terminal');

  const removedEventId = 'event-recipient-removal';
  expectStatus(await service.upsertEvent(owner, removedEventId, eventPayload('Removal event')), 201, 'create removal event');
  const removedGrant = expectStatus(await service.createGrant(owner, {
    role: 'viewer', eventId: removedEventId,
  }), 201, 'create removal grant');
  await service.rememberReceivedInvite(recipient, {
    eventId: removedEventId,
    feedId: removedGrant.feedId,
  });
  const removedRecipient = expectStatus(
    await service.eventRecipients(owner, removedEventId),
    200,
    'removal recipient list',
  ).recipients.find((value: any) => value.userId === recipient.principalId);
  expectStatus(await service.saveEventRecipientChanges(owner, removedEventId, {
    updates: [],
    removedIds: [removedRecipient.id],
  }), 200, 'remove event recipient');
  expectStatus(
    await service.receivedInviteAccess(recipient, removedEventId),
    404,
    'removed event access is gone',
  );

  const anonymousEventId = 'event-anonymous-reader';
  expectStatus(await service.upsertEvent(owner, anonymousEventId, eventPayload('Anonymous event')), 201, 'create anonymous event');
  const anonymousGrant = expectStatus(await service.createGrant(owner, {
    role: 'viewer', eventId: anonymousEventId,
  }), 201, 'create anonymous grant');
  const anonymousId = 'test-installation-1234567890';
  expectStatus(await service.rememberAnonymousReceivedInvite({
    eventId: anonymousEventId,
    feedId: anonymousGrant.feedId,
    anonymousRecipientId: anonymousId,
  }), 201, 'anonymous event acceptance');
  assert.equal(expectStatus(await service.anonymousReceivedInviteAccess({
    eventId: anonymousEventId,
    feedId: anonymousGrant.feedId,
    anonymousRecipientId: anonymousId,
  }), 200, 'anonymous reader access').access, 'reader');
  expectStatus(await service.forgetAnonymousReceivedInvite({
    eventId: anonymousEventId,
    feedId: anonymousGrant.feedId,
    anonymousRecipientId: anonymousId,
  }), 200, 'anonymous local removal');
  expectStatus(await service.anonymousReceivedInviteAccess({
    eventId: anonymousEventId,
    feedId: anonymousGrant.feedId,
    anonymousRecipientId: anonymousId,
  }), 404, 'anonymous access removed');
}

async function testCalendarSharing(service: CalendarService, email: FakeEmailService): Promise<void> {
  const calendarId = 'a'.repeat(64);
  const first = expectStatus(await service.saveICloudCalendarSharing(owner, calendarId, {
    title: 'Team Calendar',
    color: '#FF9500',
    timeZone: 'Europe/Sofia',
    recipients: [{ email: recipientEmail, access: 'reader' }],
  }), 201, 'create shared calendar');
  assert.equal(first.calendar.currentAccess, 'owner');
  assert.equal(first.calendar.recipients[0].access, 'reader');
  const calendarLanding = await service.iCloudCalendarInvitationLanding({
    o: owner.principalId,
    c: calendarId,
  });
  assert.equal(calendarLanding.status, 200);
  assert.match(calendarLanding.html, /data-view="app-clip-preview"/);
  assert.match(calendarLanding.html, />Shared calendar</);
  assert.match(calendarLanding.html, /class="preview-card calendar-preview"/);
  assert.match(calendarLanding.html, /From <strong>owner@example\.com<\/strong>/);
  assert.match(
    calendarLanding.html,
    /href="https:\/\/apps\.apple\.com\/us\/app\/cloud-calendars-sync-widget\/id6744690319">Download Cloud Calendars<\/a>/,
  );

  let shared = expectStatus(
    await service.iCloudCalendarsSharedWithMe(recipient),
    200,
    'reader calendar list',
  ).calendars.find((value: any) => value.calendarId === calendarId);
  assert.equal(shared.title, 'Team Calendar');
  assert.equal(shared.color, '#FF9500');
  assert.equal(shared.access, 'reader');
  assert.equal(shared.isRevoked, false);

  expectStatus(await service.saveICloudCalendarEvents(recipient, calendarId, {
    ownerId: owner.principalId,
    windowStart: '2032-01-01T00:00:00.000Z',
    windowEnd: '2033-01-01T00:00:00.000Z',
    events: [calendarEvent('Reader must not edit')],
  }), 403, 'reader calendar event edit denied');
  expectStatus(await service.saveICloudCalendarSharing(recipient, calendarId, {
    ownerId: owner.principalId,
    title: 'Reader must not rename',
    color: '#34C759',
    timeZone: 'Europe/Sofia',
    recipients: [],
  }), 403, 'reader calendar sharing edit denied');

  const promotedWriter = expectStatus(await service.saveICloudCalendarSharing(owner, calendarId, {
    title: 'Team Calendar Renamed',
    color: '#34C759',
    timeZone: 'Europe/Sofia',
    recipients: [{ email: recipientEmail, access: 'writer' }],
    expectedUpdatedAt: first.calendar.updatedAt,
  }), 200, 'rename calendar and promote writer');
  assert.equal(promotedWriter.calendar.recipients[0].access, 'writer');

  const savedEvents = expectStatus(await service.saveICloudCalendarEvents(recipient, calendarId, {
    ownerId: owner.principalId,
    windowStart: '2032-01-01T00:00:00.000Z',
    windowEnd: '2033-01-01T00:00:00.000Z',
    events: [calendarEvent('Writer synced event')],
  }), 200, 'writer syncs calendar events');
  assert.equal(savedEvents.eventCount, 1);
  expectStatus(await service.saveICloudCalendarEvents(owner, calendarId, {
    windowStart: '2032-01-01T00:00:00.000Z',
    windowEnd: '2033-01-01T00:00:00.000Z',
    expectedUpdatedAt: 'stale-revision',
    events: [calendarEvent('Stale update')],
  }), 409, 'calendar event optimistic conflict');

  shared = expectStatus(await service.iCloudCalendarsSharedWithMe(recipient), 200, 'writer calendar list')
    .calendars.find((value: any) => value.calendarId === calendarId);
  assert.equal(shared.title, 'Team Calendar Renamed');
  assert.equal(shared.color, '#34C759');
  assert.equal(shared.access, 'writer');
  assert.equal(shared.events[0].title, 'Writer synced event');
  assert.equal(shared.events[0].location, 'Plovdiv\nBulgaria');
  assert.equal(shared.events[0].details.notes, 'Shared calendar event notes');

  const promotedOwner = expectStatus(await service.saveICloudCalendarSharing(owner, calendarId, {
    title: 'Team Calendar Renamed',
    color: '#34C759',
    timeZone: 'Europe/Sofia',
    recipients: [{ email: recipientEmail, access: 'owner' }],
    expectedUpdatedAt: promotedWriter.calendar.updatedAt,
  }), 200, 'promote calendar recipient to owner');
  assert.equal(promotedOwner.calendar.recipients[0].access, 'owner');
  expectStatus(await service.iCloudCalendarSharing(
    recipient,
    calendarId,
    owner.principalId,
  ), 200, 'delegated calendar owner can manage sharing');

  const delegatedRename = expectStatus(await service.saveICloudCalendarSharing(recipient, calendarId, {
    ownerId: owner.principalId,
    title: 'Delegated Owner Calendar',
    color: '#AF52DE',
    timeZone: 'Europe/Sofia',
    recipients: [{ email: recipientEmail, access: 'owner' }],
    expectedUpdatedAt: promotedOwner.calendar.updatedAt,
  }), 200, 'delegated owner updates calendar metadata');
  assert.equal(delegatedRename.calendar.title, 'Delegated Owner Calendar');
  assert.equal(delegatedRename.calendar.color, '#AF52DE');

  // Calling the creator-only delete route as a delegated owner addresses the
  // recipient's own namespace. It must never delete the original calendar.
  expectStatus(await service.deleteICloudCalendarSharing(recipient, calendarId), 200, 'delegated owner delete is harmless');
  const stillExists = expectStatus(
    await service.iCloudCalendarSharing(owner, calendarId),
    200,
    'original calendar survives delegated delete',
  );
  assert.equal(stillExists.calendar.deletedAt, null);

  expectStatus(await service.saveICloudCalendarSharing(owner, calendarId, {
    title: 'Delegated Owner Calendar',
    color: '#AF52DE',
    timeZone: 'Europe/Sofia',
    recipients: [],
    removedRecipientEmails: [recipientEmail],
    expectedUpdatedAt: delegatedRename.calendar.updatedAt,
  }), 200, 'remove calendar recipient');
  const revoked = expectStatus(
    await service.iCloudCalendarsSharedWithMe(recipient),
    200,
    'revoked shared calendar tombstone',
  ).calendars.find((value: any) => value.calendarId === calendarId);
  assert.equal(revoked.isRevoked, true);
  assert.equal(revoked.revokedReason, 'access_removed');

  const emailCalendarId = 'b'.repeat(64);
  const emailCalendar = expectStatus(await service.saveICloudCalendarSharing(owner, emailCalendarId, {
    title: 'Invitation Calendar',
    color: '#0A84FF',
    timeZone: 'Europe/Sofia',
    recipients: [{ email: recipientEmail, access: 'reader' }],
  }), 201, 'create email invitation calendar');
  expectStatus(await service.inviteICloudCalendarRecipients(owner, emailCalendarId, {
    emails: [recipientEmail],
  }), 201, 'send calendar invitation');
  assert.equal(email.calendarInvitations.length, 1, 'calendar invitation email is requested once');
  const pending = expectStatus(
    await service.pendingICloudCalendarInvitations(recipient),
    200,
    'pending calendar invitation list',
  );
  assert.equal(pending.invitations.length, 1);
  assert.equal(pending.invitations[0].calendarId, emailCalendarId);
  assert.equal(pending.invitations[0].access, 'reader');

  expectStatus(await service.acceptICloudCalendarInvitation(recipient, {
    ownerId: owner.principalId,
    calendarId: emailCalendarId,
  }), 201, 'accept calendar invitation');
  assert.equal(
    expectStatus(await service.pendingICloudCalendarInvitations(recipient), 200, 'pending calendar after accept')
      .invitations.length,
    0,
  );
  assert.ok(expectStatus(await service.iCloudCalendarsSharedWithMe(recipient), 200, 'accepted calendar list')
    .calendars.some((value: any) => value.calendarId === emailCalendarId && !value.isRevoked));

  expectStatus(await service.leaveICloudCalendar(
    recipient,
    emailCalendarId,
    owner.principalId,
  ), 200, 'recipient leaves shared calendar');
  const ownerAfterLeave = expectStatus(
    await service.iCloudCalendarSharing(owner, emailCalendarId),
    200,
    'owner list after recipient leaves',
  );
  assert.equal(ownerAfterLeave.calendar.recipients.length, 0);

  const deletedCalendarId = 'c'.repeat(64);
  await service.saveICloudCalendarSharing(owner, deletedCalendarId, {
    title: 'Calendar To Delete',
    color: '#FF3B30',
    timeZone: 'Europe/Sofia',
    recipients: [{ email: recipientEmail, access: 'reader' }],
  });
  expectStatus(await service.deleteICloudCalendarSharing(owner, deletedCalendarId), 200, 'creator deletes calendar');
  const deleted = expectStatus(
    await service.iCloudCalendarsSharedWithMe(recipient),
    200,
    'deleted calendar tombstone',
  ).calendars.find((value: any) => value.calendarId === deletedCalendarId);
  assert.equal(deleted.isRevoked, true);
  assert.equal(deleted.revokedReason, 'owner_deleted');

  expectStatus(await service.saveICloudCalendarSharing(owner, emailCalendarId, {
    title: 'Stale Metadata',
    color: '#0A84FF',
    timeZone: 'Europe/Sofia',
    recipients: [],
    expectedUpdatedAt: emailCalendar.calendar.updatedAt,
  }), 409, 'calendar metadata optimistic conflict');

  const appLocalCalendarId = 'd'.repeat(64);
  const appLocal = expectStatus(await service.saveICloudCalendarSharing(owner, appLocalCalendarId, {
    title: 'Cloud Calendars Only',
    color: '#5856D6',
    timeZone: 'Europe/Sofia',
    calendarKind: 'app_local',
    recipients: [{ email: recipientEmail, access: 'writer' }],
  }), 201, 'create app-local shared calendar');
  assert.equal(appLocal.calendar.calendarKind, 'app_local');
  const receivedAppLocal = expectStatus(
    await service.iCloudCalendarsSharedWithMe(recipient),
    200,
    'app-local recipient calendar list',
  ).calendars.find((value: any) => value.calendarId === appLocalCalendarId);
  assert.equal(receivedAppLocal.calendarKind, 'app_local');
  assert.equal(receivedAppLocal.access, 'writer');

  const stillAppLocal = expectStatus(await service.saveICloudCalendarSharing(owner, appLocalCalendarId, {
    title: 'Cloud Calendars Only',
    color: '#5856D6',
    timeZone: 'Europe/Sofia',
    calendarKind: 'eventkit',
    recipients: [{ email: recipientEmail, access: 'writer' }],
    expectedUpdatedAt: appLocal.calendar.updatedAt,
  }), 200, 'app-local calendar kind is immutable');
  assert.equal(stillAppLocal.calendar.calendarKind, 'app_local');
}

async function main(): Promise<void> {
  const store = new MemoryStore();
  const core = new CoreService(store as any);
  const email = new FakeEmailService();
  const service = new CalendarService(store as any, core, email as any);
  await seedAccount(store, core, owner, ownerEmail);
  await seedAccount(store, core, recipient, recipientEmail);

  await testInvitationEmailLinks();
  await testEventSharing(service, email);
  await testCalendarSharing(service, email);

  console.log('PASS invitation e-mails: server invitation buttons and QR targets');
  console.log('PASS event sharing: invitations, Reader/Writer/Owner, sync, cancellation, removal, anonymous access');
  console.log('PASS calendar sharing: invitation/accept/leave, Reader/Writer/Owner, metadata + event sync, revocation/deletion');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
