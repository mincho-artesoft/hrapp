import { Injectable, Optional } from '@nestjs/common';
import { PushService } from '../push/push.service';
import { StoreService } from '../store/store.service';
import { CoreService } from '../core/core.service';
import { ApiResult, result } from '../common/api-result';
import { randomId, hashKey } from '../util/ids';
import { nextRevisionTimestamp } from '../util/revision';
import { verifyAppleIdToken, verifyGoogleIdToken, verifyMicrosoftToken } from '../util/verify';
import { EmailService } from '../email/email.service';
import { canonicalInvitationURL, eventInvitationURLWithPreview } from '../email/invitation-url';
import { EVENT_CARD_CSS, eventIcon, eventPalette } from '../presentation/event-card';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? null;
const APPLE_CLIENT_IDS = (process.env.APPLE_CLIENT_IDS ?? 'Deksan.CalendarASD')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

type EventAccessRole = 'reader' | 'writer' | 'owner';

type EventManagementContext = {
  calId: string;
  event: any;
  originalOwnerId: string;
  isOriginalOwner: boolean;
};

type ICloudCalendarAccessContext = {
  ownerId: string;
  calendarId: string;
  calendar: any | null;
  access: EventAccessRole;
  isOriginalOwner: boolean;
};

@Injectable()
export class CalendarService {
  constructor(
    private readonly store: StoreService,
    private readonly core: CoreService,
    private readonly email: EmailService,
    @Optional() private readonly push?: PushService,
  ) {}

  private get keys() { return this.store.keys; }

  sharedEventEmailIcon(kind: unknown, color: unknown): Buffer | null {
    return this.email.sharedEventIconPng(kind, color);
  }

  async sharedEventEmailQRCode(value: unknown): Promise<Buffer | null> {
    const url = canonicalInvitationURL(value, process.env.API_URL ?? 'https://api.cloud-calendars.com');
    if (!url) return null;
    if (url.pathname === '/event-invites/open') {
      const feedId = url.searchParams.get('c')!;
      const eventId = url.searchParams.get('e')!;
      const feed = await this.store.getJSON(this.keys.feedIndex(feedId));
      if (!feed?.calId) return null;
      const acl = await this.store.getJSON(this.keys.acl(feed.calId));
      if (acl?.feeds?.[feedId]?.scope?.eventId !== eventId) return null;
      const event = await this.store.getJSON(this.keys.event(feed.calId, eventId));
      const preview = eventInvitationURLWithPreview(url, event);
      return preview ? this.email.sharedEventQRCodePng(preview.toString()) : null;
    }
    return this.email.sharedEventQRCodePng(url.toString());
  }

  /**
   * Returns only a generated calendar feed. Keeping this behind the API lets
   * non-production environments use a private S3 bucket without a second CDN.
   */
  async calendarFeed(feedFile: unknown): Promise<string | null> {
    const match = /^([A-Za-z0-9_-]{8,128})\.ics$/.exec(String(feedFile ?? ''));
    if (!match) return null;
    return this.store.getText(this.keys.feed(match[1]));
  }

  /** Anonymous registration — the device holds the only key to this calendar. */
  async register(body: any): Promise<ApiResult> {
    const principalId = randomId(16);
    const { calId, ownerFeedId } = await this.core.createCalendar(principalId, body);
    const deviceToken = await this.core.issueToken(principalId, calId);
    return result(201, {
      calendarId: calId, deviceToken, feedId: ownerFeedId, feedUrl: this.core.feedUrl(ownerFeedId),
    });
  }

  /**
   * Resolves a Google, Apple, or Microsoft identity to its calendar, creating one on
   * first sight. `authHeader` lets an already-signed-in caller add a second
   * account to the calendar they own rather than starting a new one.
   */
  async resolve(authHeader: string, body: any): Promise<ApiResult> {
    let identity: any;
    try {
      if (body.provider === 'google') {
        identity = await verifyGoogleIdToken(body.token, GOOGLE_CLIENT_ID);
      } else if (body.provider === 'apple') {
        identity = await verifyAppleIdToken(body.token, APPLE_CLIENT_IDS);
      } else if (body.provider === 'microsoft') {
        identity = await verifyMicrosoftToken(body.token);
      } else {
        return result(400, { error: "provider must be 'google', 'apple', or 'microsoft'" });
      }
    } catch (err: any) {
      return result(401, { error: `identity not verified: ${err.message}` });
    }

    const claimedEmail = normalizeEmail(identity.email);
    const indexKey = this.keys.identity(identity.provider, hashKey(identity.subject));
    const identityId = `${identity.provider}:${hashKey(identity.subject)}`;
    const caller = await this.core.resolveToken(tokenFrom(authHeader));
    const existing = await this.store.getJSON(indexKey);

    if (existing) {
      if (caller && caller.principalId !== existing.principalId) {
        return result(409, { error: 'this identity is already linked to another Cloud Calendars account' });
      }

      const principal = await this.store.getJSON(this.keys.principal(existing.principalId)) ?? {
        id: existing.principalId,
        calId: existing.calId,
        createdAt: new Date().toISOString(),
      };
      const previousIdentity = principal.identities?.[identity.provider];
      const email = claimedEmail ?? normalizeEmail(previousIdentity?.email);
      if (!email) {
        return result(422, {
          code: 'email_required',
          error: 'a verified email must be shared to use Cloud Calendars',
        });
      }
      const emailIndexKey = this.keys.accountEmail(this.core.emailHash(email));
      const emailOwner = await this.store.getJSON(emailIndexKey);
      if (emailOwner && emailOwner.principalId !== existing.principalId) {
        return result(409, { error: 'this email is already linked to another Cloud Calendars account' });
      }
      principal.identities = {
        ...(principal.identities ?? {}),
        [identity.provider]: {
          id: identityId,
          email,
        },
      };
      await Promise.all([
        this.store.putJSON(this.keys.principal(existing.principalId), principal),
        this.store.putJSON(indexKey, {
          principalId: existing.principalId,
          calId: existing.calId,
          provider: identity.provider,
          email,
        }),
        this.store.putJSON(emailIndexKey, { principalId: existing.principalId }),
      ]);

      const deviceToken = await this.core.issueToken(existing.principalId, existing.calId, {
        provider: identity.provider,
        id: identityId,
      });
      const acl = await this.store.getJSON(this.keys.acl(existing.calId));
      const ownerFeedId = Object.keys(acl?.feeds ?? {}).find((f) => acl.feeds[f].role === 'owner');
      return result(200, {
        calendarId: existing.calId, deviceToken,
        feedId: ownerFeedId, feedUrl: this.core.feedUrl(ownerFeedId),
        email, provider: identity.provider,
        ownerId: existing.principalId,
        identities: this.publicIdentities(principal),
        created: false,
      });
    }

    if (!claimedEmail) {
      return result(422, {
        code: 'email_required',
        error: 'a verified email must be shared to use Cloud Calendars',
      });
    }

    const emailIndexKey = this.keys.accountEmail(this.core.emailHash(claimedEmail));
    const emailOwner = await this.store.getJSON(emailIndexKey);
    if (caller && emailOwner && emailOwner.principalId !== caller.principalId) {
      return result(409, { error: 'this email is already linked to another Cloud Calendars account' });
    }

    // A verified e-mail is itself a stable recovery identity. When somebody
    // first used Google and later chooses Apple (or Microsoft) with the same
    // verified address, attach the new provider to that existing principal
    // instead of creating a competing account and returning 409.
    const emailPrincipal = !caller && emailOwner?.principalId
      ? await this.store.getJSON(this.keys.principal(String(emailOwner.principalId)))
      : null;
    const principalId = caller?.principalId
      ?? emailPrincipal?.id
      ?? randomId(16);

    let calId = caller?.calId ?? emailPrincipal?.calId;
    let ownerFeedId: string;
    if (!calId) {
      ({ calId, ownerFeedId } = await this.core.createCalendar(principalId, body));
    } else {
      const acl = await this.store.getJSON(this.keys.acl(calId));
      if (this.core.roleOf(acl, principalId) !== 'owner') {
        return result(403, { error: 'only the owner may link another identity' });
      }
      ownerFeedId = Object.keys(acl?.feeds ?? {}).find((f) => acl.feeds[f].role === 'owner');
    }

    const principal = await this.store.getJSON(this.keys.principal(principalId)) ?? {
      id: principalId, calId, createdAt: new Date().toISOString(),
    };
    principal.identities = {
      ...(principal.identities ?? {}),
      [identity.provider]: {
        id: identityId,
        email: claimedEmail,
      },
    };
    await Promise.all([
      this.store.putJSON(indexKey, { principalId, calId, provider: identity.provider, email: claimedEmail }),
      this.store.putJSON(emailIndexKey, { principalId }),
      this.store.putJSON(this.keys.principal(principalId), principal),
    ]);
    const deviceToken = await this.core.issueToken(principalId, calId, {
      provider: identity.provider,
      id: identityId,
    });

    const reusedAccount = Boolean(caller || emailPrincipal);
    return result(reusedAccount ? 200 : 201, {
      calendarId: calId, deviceToken,
      feedId: ownerFeedId, feedUrl: this.core.feedUrl(ownerFeedId),
      email: claimedEmail, provider: identity.provider,
      ownerId: principalId,
      identities: this.publicIdentities(principal),
      created: !reusedAccount,
    });
  }

  async upsertEvent(principal: any, eventId: string, body: any): Promise<ApiResult> {
    const receivedFeedId = typeof body.feedId === 'string' ? body.feedId : '';
    let recipientWriter = false;
    let calId = body.calendarId ?? principal.calId;

    // A signed-in recipient with Writer access edits the owner's canonical
    // object. The opaque feed id binds the request to the exact invite; the
    // private received-invite reference prevents somebody from guessing an
    // event id and writing to it.
    if (receivedFeedId) {
      const ref = await this.store.getJSON(
        this.keys.receivedInvite(principal.principalId, eventId),
      );
      if (!ref || ref.feedId !== receivedFeedId || !ref.ownerCalId) {
        return result(403, { error: 'this account has not received that event' });
      }
      const receivedEvent = await this.store.getJSON(this.keys.event(ref.ownerCalId, eventId));
      const recipient = (Array.isArray(receivedEvent?.recipients) ? receivedEvent.recipients : [])
        .find((value: any) => value?.userId === principal.principalId);
      if (!this.recipientCanEdit(recipient)) {
        return result(403, { error: 'Reader access cannot edit this event' });
      }
      calId = ref.ownerCalId;
      recipientWriter = true;
    }

    const acl = await this.store.getJSON(this.keys.acl(calId));
    if (!acl) return result(404, { error: 'no such calendar' });

    const role = this.core.roleOf(acl, principal.principalId);
    if (!recipientWriter && !this.core.CAN_WRITE.has(role)) {
      return result(403, { error: 'not allowed to write' });
    }

    if (!body.start || !body.end) return result(400, { error: 'start and end are required' });

    let eventUrl: string | null | undefined;
    if (Object.prototype.hasOwnProperty.call(body, 'url')) {
      if (body.url == null || body.url === '') {
        eventUrl = null;
      } else {
        const rawUrl = String(body.url);
        if (rawUrl.length > 1024 || /[\u0000-\u001f\u007f]/.test(rawUrl)) {
          return result(400, { error: 'url must be up to 1024 characters without control characters' });
        }
        // EventKit permits relative/custom URL values. Preserve user-entered
        // content, but reject schemes reserved for local provider bookkeeping.
        const scheme = rawUrl.match(/^([A-Za-z][A-Za-z0-9+.-]*):/)?.[1]?.toLowerCase();
        if (scheme && ['cloudcalendars', 'gcal', 'mscal'].includes(scheme)) {
          return result(400, { error: 'url uses an internal calendar scheme' });
        }
        eventUrl = rawUrl;
      }
    }
    const localEventIdentifier = typeof body.localEventIdentifier === 'string'
      ? body.localEventIdentifier.slice(0, 512)
      : undefined;
    const hasEventDetails = Object.prototype.hasOwnProperty.call(body, 'details');
    if (hasEventDetails) {
      if (body.details != null && (typeof body.details !== 'object' || Array.isArray(body.details))) {
        return result(400, { error: 'details must be an object' });
      }
    }

    const identities = await this.identitiesFor(principal);
    const primaryIdentity = this.primaryIdentity(principal, identities);
    let contributorForbidden = false;
    let missingReceivedEvent = false;
    let cancelledEventUpdate = false;
    const saved = await this.mutateEvent(calId, eventId, (existing) => {
      if (!existing && recipientWriter) {
        missingReceivedEvent = true;
        return null;
      }
      // Cancellation is terminal. The iOS client adds a visible
      // “Cancelled:” marker to its EventKit copy; a later background edit push
      // must not turn that marker into a new confirmed server revision.
      // A future restore feature must use a dedicated, explicit endpoint.
      if (existing?.status === 'cancelled') {
        cancelledEventUpdate = true;
        return null;
      }
      if (existing && !recipientWriter
          && role === 'contributor' && existing.createdBy !== principal.principalId) {
        contributorForbidden = true;
        return null;
      }
      // Merge against this CAS attempt's canonical revision, not a stale
      // pre-read. Old apps cannot round-trip fields introduced after 1.7.0.
      const eventDetails = hasEventDetails
        ? mergeEventDetailsForWrite(body.details, existing?.details)
        : undefined;
      return {
        ...(existing ?? {}),
        id: eventId,
        // SEQUENCE must increase on every change or calendar clients treat the
        // update as a duplicate and keep showing the old time.
        sequence: existing ? (existing.sequence ?? 0) + 1 : 0,
        title: body.title ?? existing?.title ?? '',
        start: body.start,
        end: body.end,
        allDay: body.allDay ?? false,
        location: body.location ?? null,
        url: eventUrl !== undefined ? eventUrl : (existing?.url ?? null),
        details: eventDetails !== undefined ? eventDetails : (existing?.details ?? null),
        // Keep DESCRIPTION populated for older feed consumers while `details`
        // remains the canonical lossless EventKit representation.
        description: eventDetails !== undefined
          ? (eventDetails?.notes ?? null)
          : (body.description ?? existing?.description ?? null),
        organizerName: body.organizerName ?? existing?.organizerName ?? null,
        organizerEmail: body.organizerEmail ?? existing?.organizerEmail ?? null,
        status: 'confirmed',
        ownerId: existing?.ownerId ?? principal.principalId,
        ownerIdentityId: existing?.ownerIdentityId ?? primaryIdentity?.id ?? null,
        ownerIdentityProvider: existing?.ownerIdentityProvider ?? primaryIdentity?.provider ?? null,
        ownerIdentityIds: {
          ...(existing?.ownerIdentityIds ?? {}),
          ...(recipientWriter ? {} : Object.fromEntries(
            Object.entries(identities).map(([provider, value]: [string, any]) => [provider, value.id]),
          )),
        },
        createdBy: existing?.createdBy ?? principal.principalId,
        ownerLocalEventIdentifier:
          recipientWriter
            ? existing?.ownerLocalEventIdentifier ?? null
            : localEventIdentifier ?? existing?.ownerLocalEventIdentifier ?? null,
        updatedAt: new Date().toISOString(),
      };
    });
    if (!saved && contributorForbidden) {
      return result(403, { error: 'contributors may only edit their own events' });
    }
    if (!saved && cancelledEventUpdate) {
      return result(409, { error: 'cancelled events cannot be edited or reactivated' });
    }
    if (!saved && missingReceivedEvent) return result(404, { error: 'shared event no longer exists' });
    if (!saved) return result(409, { error: 'event could not be updated' });

    await this.core.regenerate(calId, eventId);
    return result(saved.previous ? 200 : 201, { event: saved.event });
  }

  /** Resolves an opaque scoped feed from an Email/QR URL and renders a small
   * server-owned landing page. The URL contains a bounded preview so the app's
   * scanner can import immediately, while this page verifies it against S3 and
   * builds a full-app deep link from the canonical event. */
  async eventInvitationLanding(query: any): Promise<{ status: number; html: string }> {
    const eventId = boundedQueryValue(query?.e, 128);
    const feedId = boundedQueryValue(query?.c, 128);
    if (!eventId || !feedId) {
      return {
        status: 400,
        html: eventInvitationErrorPage('Invalid event invitation'),
      };
    }

    const feedIndex = await this.store.getJSON(this.keys.feedIndex(feedId));
    if (!feedIndex?.calId) {
      return {
        status: 404,
        html: eventInvitationErrorPage('This event invitation is no longer available'),
      };
    }

    const acl = await this.store.getJSON(this.keys.acl(feedIndex.calId));
    if (acl?.feeds?.[feedId]?.scope?.eventId !== eventId) {
      return {
        status: 404,
        html: eventInvitationErrorPage('This event invitation is no longer available'),
      };
    }

    const event = await this.store.getJSON(this.keys.event(feedIndex.calId, eventId));
    if (!event) {
      return {
        status: 404,
        html: eventInvitationErrorPage('This event invitation is no longer available'),
      };
    }

    const start = new Date(String(event.start ?? ''));
    const end = new Date(String(event.end ?? ''));
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
      return {
        status: 422,
        html: eventInvitationErrorPage('This event invitation has invalid dates'),
      };
    }

    const timeZone = safeTimeZone(boundedQueryValue(query?.timeZone, 128)) ?? 'UTC';
    const color = /^#[0-9a-f]{6}$/i.test(boundedQueryValue(query?.color, 16) ?? '')
      ? String(boundedQueryValue(query?.color, 16))
      : '#0A84FF';
    const title = String(event.title ?? 'Shared event').slice(0, 120);
    const location = event.location == null ? null : String(event.location).slice(0, 160);
    const eventURL = event.url == null ? null : String(event.url).slice(0, 1024);
    const isAllDay = Boolean(event.allDay);

    const deepLinkParams = new URLSearchParams({
      e: eventId,
      c: feedId,
      title,
      start: String(start.getTime() / 1000),
      end: String(end.getTime() / 1000),
      allDay: isAllDay ? '1' : '0',
      timeZone,
      color,
    });
    if (location) deepLinkParams.set('location', location);
    if (eventURL) deepLinkParams.set('eventURL', eventURL);

    const fullAppURL = `cloudcalendars://shared-event?${deepLinkParams.toString()}`;
    const when = formatInvitationDateParts(start, end, timeZone, isAllDay);
    const cancelled = event.status === 'cancelled';
    const senderPrincipalId = String(
      acl?.feeds?.[feedId]?.principalId
        ?? event.createdBy
        ?? event.ownerId
        ?? acl?.owner
        ?? '',
    );
    const [senderAccount, calendarMeta] = senderPrincipalId
      ? await Promise.all([
        this.store.getJSON(this.keys.principal(senderPrincipalId)),
        this.store.getJSON(this.keys.meta(feedIndex.calId)),
      ])
      : [null, null];
    const senderEmail = this.recipientIdentities(senderAccount)[0]?.email ?? null;
    const senderName = boundedPlainText(calendarMeta?.name, 160);
    const sender = senderName && senderEmail && senderName !== senderEmail
      ? `${senderName} <${senderEmail}>`
      : senderEmail ?? senderName ?? 'Cloud Calendars';

    return {
      status: 200,
      html: eventInvitationPage({
        title,
        date: when.date,
        time: when.time,
        location,
        color,
        fullAppURL,
        sender,
        cancelled,
      }),
    };
  }

  /** Removes one recovery identity while preserving the stable account and its
   * events. The last identity cannot be removed because that would make the
   * account impossible to recover after the current device signs out. */
  async unlinkIdentity(principal: any, provider: string): Promise<ApiResult> {
    if (!['google', 'apple', 'microsoft'].includes(provider)) {
      return result(400, { error: 'unknown identity provider' });
    }

    const principalKey = this.keys.principal(principal.principalId);
    const account = await this.store.getJSON(principalKey);
    const identities = { ...(account?.identities ?? {}) };
    const removed = identities[provider];
    if (!removed) return result(404, { error: 'identity is not linked' });

    const remainingEntries = Object.entries(identities)
      .filter(([linkedProvider]) => linkedProvider !== provider) as Array<[string, any]>;
    if (remainingEntries.length === 0) {
      return result(409, {
        code: 'last_identity_required',
        error: 'the last recovery identity cannot be unlinked',
      });
    }

    delete identities[provider];
    account.identities = identities;

    const writes: Promise<any>[] = [this.store.putJSON(principalKey, account)];
    const identityHash = String(removed.id ?? '').startsWith(`${provider}:`)
      ? String(removed.id).slice(provider.length + 1)
      : '';
    if (/^[a-f0-9]{64}$/.test(identityHash)) {
      writes.push(this.store.del(this.keys.identity(provider, identityHash)));
    }

    const removedEmail = normalizeEmail(removed.email);
    const emailStillLinked = remainingEntries.some(([, value]) =>
      normalizeEmail(value?.email) === removedEmail,
    );
    if (removedEmail && !emailStillLinked) {
      writes.push(this.store.del(this.keys.accountEmail(this.core.emailHash(removedEmail))));
    }
    await Promise.all(writes);

    const [nextProvider, nextIdentity] = remainingEntries[0];
    const deviceToken = await this.core.issueToken(principal.principalId, principal.calId, {
      provider: nextProvider,
      id: nextIdentity.id,
    });
    const acl = await this.store.getJSON(this.keys.acl(principal.calId));
    const ownerFeedId = Object.keys(acl?.feeds ?? {}).find((f) => acl.feeds[f].role === 'owner');

    return result(200, {
      calendarId: principal.calId,
      deviceToken,
      feedId: ownerFeedId,
      feedUrl: this.core.feedUrl(ownerFeedId),
      email: normalizeEmail(nextIdentity.email),
      provider: nextProvider,
      ownerId: principal.principalId,
      identities: this.publicIdentities(account),
    });
  }

  /** All App Clip share metadata owned by this authenticated account. */
  async sharedState(principal: any): Promise<ApiResult> {
    const acl = await this.store.getJSON(this.keys.acl(principal.calId));
    if (this.core.roleOf(acl, principal.principalId) !== 'owner') {
      return result(403, { error: 'only the owner may restore shared state' });
    }

    const identities = await this.identitiesFor(principal);
    const primaryIdentity = this.primaryIdentity(principal, identities);
    const eventKeys = await this.store.listKeys(this.keys.events(principal.calId));
    const events = await Promise.all(eventKeys.map((key) => this.store.getJSON(key)));
    const outgoing: any[] = [];
    for (const event of events.filter(Boolean)) {
      const feed = await this.store.getJSON(this.keys.eventFeed(principal.calId, event.id));
      if (!feed?.feedId) continue;
      let identityBackfilled = false;
      if (!event.ownerId) {
        event.ownerId = principal.principalId;
        identityBackfilled = true;
      }
      if (!event.ownerIdentityId && primaryIdentity) {
        event.ownerIdentityId = primaryIdentity.id;
        event.ownerIdentityProvider = primaryIdentity.provider;
        identityBackfilled = true;
      }
      const allIdentityIds = Object.fromEntries(
        Object.entries(identities).map(([provider, value]: [string, any]) => [provider, value.id]),
      );
      const mergedIdentityIds = { ...(event.ownerIdentityIds ?? {}), ...allIdentityIds };
      if (JSON.stringify(mergedIdentityIds) !== JSON.stringify(event.ownerIdentityIds ?? {})) {
        event.ownerIdentityIds = mergedIdentityIds;
        identityBackfilled = true;
      }
      if (identityBackfilled) {
        await this.store.putJSON(this.keys.event(principal.calId, event.id), event);
      }
      const { ownerLocalEventIdentifier, ...publicEvent } = event;
      outgoing.push({
        ...publicEvent,
        feedId: feed.feedId,
        localEventIdentifier: ownerLocalEventIdentifier ?? null,
      });
    }

    const receivedKeys = await this.store.listKeys(this.keys.receivedInvites(principal.principalId));
    const refs = await Promise.all(receivedKeys.map((key) => this.store.getJSON(key)));
    const received: any[] = [];
    for (const ref of refs.filter(Boolean)) {
      const event = await this.store.getJSON(this.keys.event(ref.ownerCalId, ref.eventId));
      if (event) {
        // A recipient may read the event itself, never the other recipients'
        // account IDs or email addresses. That list is owner-only metadata.
        const {
          recipients,
          recipientCount,
          recipientsUpdatedAt,
          ownerLocalEventIdentifier,
          ...publicEvent
        } = event;
        const recipient = (Array.isArray(event.recipients) ? event.recipients : [])
          .find((value: any) => value?.userId === principal.principalId);
        received.push({
          ...publicEvent,
          feedId: ref.feedId,
          localEventIdentifier: ref.localEventIdentifier ?? null,
          access: this.recipientAccess(recipient),
        });
      }
    }

    const account = await this.store.getJSON(this.keys.principal(principal.principalId));
    return result(200, {
      ownerId: principal.principalId,
      identities: this.publicIdentities(account),
      outgoing,
      received,
    });
  }

  /** All identities linked to the stable owner. The token identity is merged
   * in as a fallback for records created by an older API deployment. */
  private async identitiesFor(principal: any): Promise<Record<string, { id: string; email?: string | null }>> {
    const account = await this.store.getJSON(this.keys.principal(principal.principalId));
    const identities = { ...(account?.identities ?? {}) };
    // Only old account records need the bearer-token fallback. Once an account
    // has an explicit identities map, a deliberately unlinked provider must
    // never be reintroduced by an older device token.
    if (account?.identities == null && principal.identityId && principal.identityProvider) {
      identities[principal.identityProvider] = {
        ...(identities[principal.identityProvider] ?? {}),
        id: principal.identityId,
      };
    }
    return identities;
  }

  private primaryIdentity(
    principal: any,
    identities: Record<string, { id: string }>,
  ): { provider: string; id: string } | null {
    if (principal.identityId
        && principal.identityProvider
        && identities[principal.identityProvider]?.id === principal.identityId) {
      return { provider: principal.identityProvider, id: principal.identityId };
    }
    const first = Object.entries(identities)[0];
    return first?.[1]?.id ? { provider: first[0], id: first[1].id } : null;
  }

  private publicIdentities(principal: any): Array<{ provider: string; email: string | null }> {
    return Object.entries(principal?.identities ?? {}).map(([provider, value]: [string, any]) => ({
      provider,
      email: value?.email ?? null,
    }));
  }

  private recipientAccess(recipient: any): EventAccessRole {
    if (recipient?.access === 'owner') return 'owner';
    return recipient?.access === 'writer' ? 'writer' : 'reader';
  }

  private recipientCanEdit(recipient: any): boolean {
    const access = this.recipientAccess(recipient);
    return access === 'writer' || access === 'owner';
  }

  private eventAccessRank(access: EventAccessRole): number {
    if (access === 'owner') return 2;
    if (access === 'writer') return 1;
    return 0;
  }

  /** Resolves one canonical event for either its first sharer or a signed-in
   * recipient with delegated Owner access. The received reference is private
   * to that principal, so knowing an event id alone never grants management. */
  private async eventManagementContext(
    principal: any,
    eventId: string,
  ): Promise<EventManagementContext | null> {
    const [localEvent, localAcl] = await Promise.all([
      this.store.getJSON(this.keys.event(principal.calId, eventId)),
      this.store.getJSON(this.keys.acl(principal.calId)),
    ]);
    if (localEvent && this.core.roleOf(localAcl, principal.principalId) === 'owner') {
      return {
        calId: principal.calId,
        event: localEvent,
        originalOwnerId: String(
          localEvent.ownerId ?? localEvent.createdBy ?? principal.principalId,
        ),
        isOriginalOwner: true,
      };
    }

    const ref = await this.store.getJSON(
      this.keys.receivedInvite(principal.principalId, eventId),
    );
    if (!ref?.ownerCalId) return null;
    const event = await this.store.getJSON(this.keys.event(ref.ownerCalId, eventId));
    if (!event) return null;
    const recipient = (Array.isArray(event.recipients) ? event.recipients : [])
      .find((value: any) => value?.userId === principal.principalId);
    if (this.recipientAccess(recipient) !== 'owner') return null;
    return {
      calId: String(ref.ownerCalId),
      event,
      originalOwnerId: String(event.ownerId ?? event.createdBy ?? ''),
      isOriginalOwner: false,
    };
  }

  private recipientEmails(recipient: any): string[] {
    const values = [
      ...(Array.isArray(recipient?.emails) ? recipient.emails : []),
      ...(Array.isArray(recipient?.identities)
        ? recipient.identities.map((identity: any) => identity?.email)
        : []),
      recipient?.invitedEmail,
    ];
    return [...new Set(values.map(normalizeEmail).filter(Boolean))] as string[];
  }

  private pendingInvitationEmail(recipient: any): string | null {
    if (recipient?.userId || recipient?.anonymousId) return null;
    return normalizeEmail(recipient?.invitedEmail)
      ?? this.recipientEmails(recipient)[0]
      ?? null;
  }

  private recipientId(recipient: any): string {
    if (recipient?.anonymousId && !recipient?.userId) {
      return `anonymous:${String(recipient.anonymousId)}`;
    }
    if (recipient?.userId) return String(recipient.userId);
    const email = this.pendingInvitationEmail(recipient);
    return email ? `invited:${hashKey(email)}` : '';
  }

  private publicRecipient(recipient: any): any {
    const isAnonymous = Boolean(recipient?.anonymousId) && !recipient?.userId;
    const invitationEmail = this.pendingInvitationEmail(recipient);
    const recipientId = this.recipientId(recipient);
    return {
      id: recipientId,
      userId: recipient?.userId ? String(recipient.userId) : null,
      isAnonymous,
      emails: this.recipientEmails(recipient),
      identities: Array.isArray(recipient?.identities)
        ? recipient.identities.map((identity: any) => ({
          provider: String(identity?.provider ?? ''),
          email: normalizeEmail(identity?.email),
        })).filter((identity: any) => identity.provider)
        : [],
      access: this.recipientAccess(recipient),
      isOriginalOwner: false,
      acceptedAt: recipient?.acceptedAt ?? null,
      invitedAt: recipient?.invitedAt ?? (invitationEmail ? recipient?.updatedAt ?? null : null),
      updatedAt: recipient?.updatedAt ?? null,
    };
  }

  private async publicOriginalOwner(
    context: EventManagementContext,
  ): Promise<any> {
    const ownerAccount = context.originalOwnerId
      ? await this.store.getJSON(this.keys.principal(context.originalOwnerId))
      : null;
    const identities = this.recipientIdentities(ownerAccount);
    return {
      id: `owner:${context.originalOwnerId || context.calId}`,
      userId: context.originalOwnerId || null,
      isAnonymous: false,
      emails: [...new Set(identities.map((identity) => identity.email))],
      identities: identities.map((identity) => ({
        provider: identity.provider,
        email: identity.email,
      })),
      access: 'owner',
      isOriginalOwner: true,
      acceptedAt: context.event.createdAt ?? null,
      invitedAt: null,
      updatedAt: context.event.updatedAt ?? null,
    };
  }

  /** Recipient identities are private event metadata visible only to owner. */
  async eventRecipients(principal: any, eventId: string): Promise<ApiResult> {
    const context = await this.eventManagementContext(principal, eventId);
    if (!context) {
      return result(403, { error: 'Owner access is required to view event recipients' });
    }
    const originalOwner = await this.publicOriginalOwner(context);
    const recipients = (Array.isArray(context.event.recipients) ? context.event.recipients : [])
      .map((recipient: any) => this.publicRecipient(recipient));
    return result(200, { recipients: [originalOwner, ...recipients] });
  }

  /** Applies every role change and removal from the owner's Save action in one
   * optimistic S3 mutation. Removed identities are retained as private revoke
   * tombstones so an old invitation link cannot silently restore access. */
  async saveEventRecipientChanges(principal: any, eventId: string, body: any): Promise<ApiResult> {
    const context = await this.eventManagementContext(principal, eventId);
    if (!context) {
      return result(403, { error: 'Owner access is required to change event access' });
    }

    const rawUpdates = Array.isArray(body.updates) ? body.updates : [];
    const rawRemovedIds = Array.isArray(body.removedIds) ? body.removedIds : [];
    if (rawUpdates.length > 1000 || rawRemovedIds.length > 1000) {
      return result(400, { error: 'too many recipient changes' });
    }
    const updates = new Map<string, EventAccessRole>();
    for (const raw of rawUpdates) {
      const id = String(raw?.id ?? '');
      const access = String(raw?.access ?? '').toLowerCase();
      if (!id || !['reader', 'writer', 'owner'].includes(access)) {
        return result(400, {
          error: 'every update requires an id and Reader, Writer, or Owner access',
        });
      }
      updates.set(id, access as EventAccessRole);
    }
    const removedIds = new Set<string>(
      rawRemovedIds
        .map((value: any) => String(value ?? ''))
        .filter((value: string) => Boolean(value)),
    );
    for (const removedId of removedIds) updates.delete(removedId);
    const originalOwnerRecipientId = `owner:${context.originalOwnerId || context.calId}`;
    if (updates.has(originalOwnerRecipientId) || removedIds.has(originalOwnerRecipientId)) {
      return result(403, { error: "the original owner's access cannot be changed" });
    }

    let missingRecipientId: string | null = null;
    let removedRecipients: any[] = [];
    const now = new Date().toISOString();
    const saved = await this.mutateEvent(context.calId, eventId, (event) => {
      if (!event) return null;
      const recipients = Array.isArray(event.recipients) ? [...event.recipients] : [];
      const byId = new Map(recipients.map((recipient: any) => [this.recipientId(recipient), recipient]));
      for (const id of [...updates.keys(), ...removedIds]) {
        if (!byId.has(id)) {
          missingRecipientId = id;
          return null;
        }
      }

      removedRecipients = recipients.filter((recipient: any) =>
        removedIds.has(this.recipientId(recipient)),
      );
      const remaining = recipients
        .filter((recipient: any) => !removedIds.has(this.recipientId(recipient)))
        .map((recipient: any) => {
          const access = updates.get(this.recipientId(recipient));
          return access ? { ...recipient, access, updatedAt: now } : recipient;
        });
      const revokedRecipients = [
        ...(Array.isArray(event.revokedRecipients) ? event.revokedRecipients : []),
        ...removedRecipients.map((recipient: any) => ({
          recipientId: this.recipientId(recipient),
          userId: recipient?.userId ?? null,
          anonymousId: recipient?.anonymousId ?? null,
          emails: this.recipientEmails(recipient),
          revokedAt: now,
        })),
      ].slice(-2000);
      return {
        ...event,
        recipients: remaining,
        recipientCount: remaining.length,
        revokedRecipients,
        recipientsUpdatedAt: now,
      };
    });
    if (!saved && missingRecipientId) {
      return result(409, { error: `recipient ${missingRecipientId} changed; reload and try again` });
    }
    if (!saved) return result(404, { error: 'no such event' });

    const removalDeletes: Promise<any>[] = removedRecipients
      .filter((recipient: any) => Boolean(recipient?.userId))
      .map((recipient: any) => this.store.del(
        this.keys.receivedInvite(String(recipient.userId), eventId),
      ));
    for (const recipient of removedRecipients) {
      for (const email of this.recipientEmails(recipient)) {
        removalDeletes.push(this.store.del(this.keys.pendingEventInvitation(
          this.core.emailHash(email),
          context.calId,
          eventId,
        )));
      }
    }
    await Promise.all(removalDeletes);

    return result(200, {
      recipients: [
        await this.publicOriginalOwner({ ...context, event: saved.event }),
        ...saved.event.recipients.map((recipient: any) => this.publicRecipient(recipient)),
      ],
    });
  }

  /** Stores e-mail recipients and their event role before acceptance, then
   * sends the scoped server invitation URL to each address through SES. */
  async inviteEventRecipients(principal: any, eventId: string, body: any): Promise<ApiResult> {
    const context = await this.eventManagementContext(principal, eventId);
    if (!context) {
      return result(403, { error: 'Owner access is required to invite event recipients' });
    }
    const acl = await this.store.getJSON(this.keys.acl(context.calId));

    const rawInvitations = Array.isArray(body.invitations) ? body.invitations : [];
    if (rawInvitations.length === 0 || rawInvitations.length > 50) {
      return result(400, { error: 'between 1 and 50 invitations are required' });
    }

    const invitationByEmail = new Map<string, { email: string; access: EventAccessRole }>();
    for (const raw of rawInvitations) {
      const email = normalizeEmail(raw?.email);
      const access = String(raw?.access ?? '').toLowerCase();
      if (!email) return result(400, { error: 'every invitation requires a valid email' });
      if (!['reader', 'writer', 'owner'].includes(access)) {
        return result(400, { error: "access must be 'reader', 'writer', or 'owner'" });
      }
      invitationByEmail.set(email, { email, access: access as EventAccessRole });
    }
    const invitations = [...invitationByEmail.values()];

    let rawEventURL = String(body.eventUrl ?? '');
    if (!rawEventURL || rawEventURL.length > 8192) {
      return result(400, { error: 'a valid eventUrl is required' });
    }
    const eventURL = canonicalInvitationURL(rawEventURL, process.env.API_URL ?? 'https://api.cloud-calendars.com');
    if (!eventURL || eventURL.pathname !== '/event-invites/open' || eventURL.searchParams.get('e') !== eventId) {
      return result(400, { error: 'eventUrl is not a matching Cloud Calendars invitation link' });
    }
    const feedId = eventURL.searchParams.get('c')!;
    rawEventURL = eventURL.toString();
    const feedIndex = await this.store.getJSON(this.keys.feedIndex(feedId));
    if (feedIndex?.calId !== context.calId
        || acl?.feeds?.[feedId]?.scope?.eventId !== eventId) {
      return result(403, { error: 'eventUrl does not belong to this shared event' });
    }

    const existingEvent = await this.store.getJSON(this.keys.event(context.calId, eventId));
    if (!existingEvent) return result(404, { error: 'no such event' });
    const [ownerAccount, calendarMeta] = await Promise.all([
      this.store.getJSON(this.keys.principal(principal.principalId)),
      this.store.getJSON(this.keys.meta(principal.calId)),
    ]);
    const ownerIdentities = this.recipientIdentities(ownerAccount);
    const senderIdentity = ownerIdentities.find((identity) =>
      identity.provider === principal.identityProvider,
    ) ?? ownerIdentities[0];
    const senderEmail = senderIdentity?.email ?? null;
    const senderName = String(
      calendarMeta?.name
        || senderEmail
        || existingEvent.organizerName
        || 'Cloud Calendars',
    ).slice(0, 160);

    const now = new Date().toISOString();
    let recipientLimitReached = false;
    const saved = await this.mutateEvent(context.calId, eventId, (event) => {
      if (!event) return null;
      let recipients = Array.isArray(event.recipients) ? [...event.recipients] : [];
      let revokedRecipients = Array.isArray(event.revokedRecipients)
        ? [...event.revokedRecipients]
        : [];

      for (const invitation of invitations) {
        revokedRecipients = revokedRecipients.filter((revoked: any) => {
          const revokedEmails = Array.isArray(revoked?.emails)
            ? revoked.emails.map(normalizeEmail).filter(Boolean)
            : [];
          return !revokedEmails.includes(invitation.email);
        });
        const acceptedIndex = recipients.findIndex((recipient: any) =>
          Boolean(recipient?.userId) && this.recipientEmails(recipient).includes(invitation.email),
        );
        const pendingIndex = recipients.findIndex((recipient: any) =>
          this.pendingInvitationEmail(recipient) === invitation.email,
        );

        if (acceptedIndex >= 0) {
          recipients[acceptedIndex] = {
            ...recipients[acceptedIndex],
            access: invitation.access,
            invitedAt: recipients[acceptedIndex]?.invitedAt ?? now,
            invitationSentAt: now,
            updatedAt: now,
          };
          if (pendingIndex >= 0 && pendingIndex !== acceptedIndex) {
            recipients.splice(pendingIndex, 1);
          }
          continue;
        }

        if (pendingIndex >= 0) {
          recipients[pendingIndex] = {
            ...recipients[pendingIndex],
            invitedEmail: invitation.email,
            emails: [invitation.email],
            access: invitation.access,
            invitationSentAt: now,
            updatedAt: now,
          };
          continue;
        }

        if (recipients.length >= 1000) {
          recipientLimitReached = true;
          return null;
        }
        recipients.push({
          invitationId: hashKey(invitation.email),
          invitedEmail: invitation.email,
          emails: [invitation.email],
          identities: [],
          access: invitation.access,
          invitedAt: now,
          invitationSentAt: now,
          updatedAt: now,
        });
      }

      recipients = recipients.filter((recipient: any) => Boolean(this.recipientId(recipient)));
      return {
        ...event,
        recipients,
        recipientCount: recipients.length,
        revokedRecipients,
        recipientsUpdatedAt: now,
      };
    });
    if (!saved && recipientLimitReached) return result(429, { error: 'recipient limit reached' });
    if (!saved) return result(404, { error: 'no such event' });

    const pendingInvitationEmails = new Set(
      (Array.isArray(saved.event.recipients) ? saved.event.recipients : [])
        .map((recipient: any) => this.pendingInvitationEmail(recipient))
        .filter(Boolean),
    );
    await Promise.all(invitations
      .filter((invitation) => pendingInvitationEmails.has(invitation.email))
      .map((invitation) => this.store.putJSON(
        this.keys.pendingEventInvitation(
          this.core.emailHash(invitation.email),
          context.calId,
          eventId,
        ),
        {
          ownerCalId: context.calId,
          eventId,
          feedId,
          eventUrl: rawEventURL,
          senderName,
          senderEmail,
          invitedAt: now,
          updatedAt: now,
        },
      )));

    const timeZone = eventURL.searchParams.get('timeZone') ?? 'UTC';
    await Promise.all(invitations.filter((invitation) => pendingInvitationEmails.has(invitation.email))
      .map((invitation) => this.push?.enqueue('event', invitation.email, context.calId, eventId)));
    await Promise.all(invitations.map((invitation) => this.email.sendSharedEventInvitation({
      email: invitation.email,
      access: invitation.access,
      event: saved.event,
      eventUrl: rawEventURL,
      timeZone,
      senderName,
      senderEmail,
      eventColor: eventURL.searchParams.get('color'),
    })));

    const invitedEmails = new Set(invitations.map((invitation) => invitation.email));
    const recipients = saved.event.recipients
      .filter((recipient: any) => this.recipientEmails(recipient).some((email) => invitedEmails.has(email)))
      .map((recipient: any) => this.publicRecipient(recipient));
    return result(201, { recipients, invitedCount: invitations.length });
  }

  /** Lists unaccepted event invitations addressed to any verified e-mail on
   * the current account. The private S3 index avoids scanning every calendar,
   * while every result is still revalidated against the canonical event. */
  async pendingEventInvitations(principal: any): Promise<ApiResult> {
    const account = await this.store.getJSON(this.keys.principal(principal.principalId));
    const emails = [...new Set(
      this.recipientIdentities(account).map((identity) => identity.email),
    )];
    if (emails.length === 0) return result(200, { invitations: [] });

    const indexed = (await Promise.all(emails.map(async (email) => {
      const prefix = this.keys.pendingEventInvitations(this.core.emailHash(email));
      const objectKeys = await this.store.listKeys(prefix);
      const values = await Promise.all(objectKeys.map(async (key) => ({
        key,
        email,
        ref: await this.store.getJSON(key),
      })));
      return values;
    }))).flat();

    const invitations = new Map<string, any>();
    const staleKeys: string[] = [];

    for (const indexedValue of indexed) {
      const ref = indexedValue.ref;
      const ownerCalId = String(ref?.ownerCalId ?? '');
      const eventId = String(ref?.eventId ?? '');
      const feedId = String(ref?.feedId ?? '');
      if (!ownerCalId || !eventId || !feedId) {
        staleKeys.push(indexedValue.key);
        continue;
      }

      const event = await this.store.getJSON(this.keys.event(ownerCalId, eventId));
      const recipient = (Array.isArray(event?.recipients) ? event.recipients : [])
        .find((value: any) => this.pendingInvitationEmail(value) === indexedValue.email);
      const start = new Date(String(event?.start ?? ''));
      const end = new Date(String(event?.end ?? ''));
      if (!event
          || event.status === 'cancelled'
          || !recipient
          || !Number.isFinite(start.getTime())
          || !Number.isFinite(end.getTime())) {
        staleKeys.push(indexedValue.key);
        continue;
      }
      // A past event can still be shared. Its end date does not expire the
      // invitation or authorize deleting the recipient's pending index.

      let eventUrl: URL;
      try {
        eventUrl = new URL(String(ref?.eventUrl ?? ''));
      } catch {
        staleKeys.push(indexedValue.key);
        continue;
      }
      if (eventUrl.protocol !== 'https:'
          || eventUrl.searchParams.get('e') !== eventId
          || eventUrl.searchParams.get('c') !== feedId) {
        staleKeys.push(indexedValue.key);
        continue;
      }

      eventUrl.searchParams.set('title', String(event.title ?? 'Shared event').slice(0, 120));
      eventUrl.searchParams.set('start', String(start.getTime() / 1000));
      eventUrl.searchParams.set('end', String(end.getTime() / 1000));
      eventUrl.searchParams.set('allDay', event.allDay ? '1' : '0');
      if (event.location) eventUrl.searchParams.set('location', String(event.location).slice(0, 160));
      else eventUrl.searchParams.delete('location');
      if (event.url) eventUrl.searchParams.set('eventURL', String(event.url).slice(0, 1024));
      else eventUrl.searchParams.delete('eventURL');

      const identity = `${ownerCalId}:${eventId}`;
      const invitation = {
        id: hashKey(identity),
        eventId,
        feedId,
        title: String(event.title ?? 'Shared event').slice(0, 120),
        start: start.toISOString(),
        end: end.toISOString(),
        allDay: Boolean(event.allDay),
        location: event.location == null ? null : String(event.location).slice(0, 160),
        access: this.recipientAccess(recipient),
        invitedAt: recipient.invitedAt ?? ref.invitedAt ?? null,
        senderName: ref.senderName ?? event.organizerName ?? 'Cloud Calendars',
        senderEmail: normalizeEmail(ref.senderEmail ?? event.organizerEmail),
        eventUrl: eventUrl.toString(),
        color: eventUrl.searchParams.get('color') ?? '#0A84FF',
      };
      const previous = invitations.get(identity);
      if (!previous
          || this.eventAccessRank(invitation.access) > this.eventAccessRank(previous.access)) {
        invitations.set(identity, invitation);
      }
    }

    await Promise.all(staleKeys.map((key) => this.store.del(key)));
    return result(200, {
      invitations: [...invitations.values()].sort((a, b) =>
        String(b.invitedAt ?? '').localeCompare(String(a.invitedAt ?? '')),
      ),
    });
  }

  /** Declines an e-mail invitation for every verified identity linked to the
   * current account. A later re-invite remains possible because declining is
   * not recorded as an owner revocation. */
  async declinePendingEventInvitation(
    principal: any,
    eventId: string,
    body: any,
  ): Promise<ApiResult> {
    const feedId = String(body.feedId ?? '');
    if (!eventId || !feedId) {
      return result(400, { error: 'eventId and feedId are required' });
    }

    const feedIndex = await this.store.getJSON(this.keys.feedIndex(feedId));
    if (!feedIndex?.calId) return result(404, { error: 'no such invitation' });
    const acl = await this.store.getJSON(this.keys.acl(feedIndex.calId));
    if (acl?.feeds?.[feedId]?.scope?.eventId !== eventId) {
      return result(403, { error: 'feed is not scoped to this event' });
    }

    const account = await this.store.getJSON(this.keys.principal(principal.principalId));
    const identityEmails = new Set(
      this.recipientIdentities(account).map((identity) => identity.email),
    );
    if (identityEmails.size === 0) {
      return result(422, {
        code: 'email_required',
        error: 'a verified email identity is required to decline this invitation',
      });
    }

    const declinedEmails: string[] = [];
    const now = new Date().toISOString();
    const saved = await this.mutateEvent(feedIndex.calId, eventId, (event) => {
      if (!event) return null;
      const recipients = Array.isArray(event.recipients) ? event.recipients : [];
      const matchingEmails = recipients
        .map((recipient: any) => this.pendingInvitationEmail(recipient))
        .filter((email: string | null): email is string =>
          email != null && identityEmails.has(email),
        );
      if (matchingEmails.length === 0) return null;
      declinedEmails.push(...matchingEmails);
      const remaining = recipients.filter((recipient: any) => {
        const email = this.pendingInvitationEmail(recipient);
        return email == null || !identityEmails.has(email);
      });
      return {
        ...event,
        recipients: remaining,
        recipientCount: remaining.length,
        recipientsUpdatedAt: now,
      };
    });
    if (!saved) return result(404, { error: 'pending invitation not found' });

    await Promise.all([...new Set(declinedEmails)].map((email) => this.store.del(
      this.keys.pendingEventInvitation(
        this.core.emailHash(email),
        feedIndex.calId,
        eventId,
      ),
    )));
    return result(200, { declined: true });
  }

  /** Resolves the one canonical calendar share for its first owner or for a
   * recipient identified by a verified account e-mail. Only the first owner
   * may create a missing record; delegated access always requires an existing
   * canonical S3 object. */
  private async iCloudCalendarAccessContext(
    principal: any,
    calendarId: string,
    requestedOwnerId?: unknown,
    allowMissingOriginal = false,
  ): Promise<ICloudCalendarAccessContext | null> {
    const ownerId = boundedPlainText(requestedOwnerId, 128)
      ?? String(principal.principalId);
    const calendar = await this.store.getJSON(
      this.keys.icloudCalendarSharing(ownerId, calendarId),
    );

    if (ownerId === principal.principalId) {
      if (!calendar && !allowMissingOriginal) return null;
      return {
        ownerId,
        calendarId,
        calendar,
        access: 'owner',
        isOriginalOwner: true,
      };
    }
    if (!calendar || calendar.deletedAt) return null;

    const account = await this.store.getJSON(
      this.keys.principal(principal.principalId),
    );
    const identityEmails = new Set(
      this.recipientIdentities(account).map((identity) => identity.email),
    );
    const recipient = (Array.isArray(calendar.recipients) ? calendar.recipients : [])
      .find((value: any) => {
        if (value?.isPending === true) return false;
        if (value?.userId === principal.principalId) return true;
        return this.recipientEmails(value).some((email) => identityEmails.has(email));
      });
    if (!recipient) return null;
    return {
      ownerId,
      calendarId,
      calendar,
      access: this.recipientAccess(recipient),
      isOriginalOwner: false,
    };
  }

  private async publicICloudCalendarSharing(
    context: ICloudCalendarAccessContext,
  ): Promise<any> {
    const [ownerAccount, calendarEvents] = await Promise.all([
      this.store.getJSON(this.keys.principal(context.ownerId)),
      this.store.getJSON(
        this.keys.icloudCalendarEvents(context.ownerId, context.calendarId),
      ),
    ]);
    const ownerIdentities = this.recipientIdentities(ownerAccount);
    const calendar = context.calendar ?? {
      schemaVersion: 2,
      id: context.calendarId,
      ownerId: context.ownerId,
      title: '',
      color: '#0088FF',
      timeZone: 'UTC',
      calendarKind: 'eventkit',
      recipients: [],
    };
    return {
      ...calendar,
      ownerId: context.ownerId,
      ownerEmail: ownerIdentities[0]?.email ?? null,
      currentAccess: context.access,
      isOriginalOwner: context.isOriginalOwner,
      events: Array.isArray(calendarEvents?.events) ? calendarEvents.events : [],
      eventsUpdatedAt: calendarEvents?.updatedAt ?? null,
      windowStart: calendarEvents?.windowStart ?? null,
      windowEnd: calendarEvents?.windowEnd ?? null,
    };
  }

  /** Returns the app-managed sharing metadata for one local iCloud calendar.
   * The client sends only a SHA-256 fingerprint, never EventKit's raw calendar
   * identifier. Records are also namespaced by the authenticated principal. */
  async iCloudCalendarSharing(
    principal: any,
    calendarId: string,
    ownerId?: unknown,
  ): Promise<ApiResult> {
    if (!validICloudCalendarShareId(calendarId)) {
      return result(400, { error: 'invalid iCloud calendar identifier' });
    }
    const context = await this.iCloudCalendarAccessContext(
      principal,
      calendarId,
      ownerId,
      true,
    );
    if (!context) return result(403, { error: 'calendar access is required' });
    if (!context.isOriginalOwner && context.access !== 'owner') {
      return result(403, { error: 'Owner access is required to manage calendar sharing' });
    }
    const record = context.calendar;
    if (record && record.schemaVersion !== 2) {
      return this.saveICloudCalendarSharing(principal, calendarId, {
        ownerId: context.ownerId,
        title: record.title,
        color: record.color,
        timeZone: record.timeZone,
        calendarKind: record.calendarKind,
        recipients: (Array.isArray(record.recipients) ? record.recipients : []).map(
          (recipient: any) => ({
            email: recipient.email,
            access: recipient.access,
          }),
        ),
      });
    }
    return result(200, {
      calendar: await this.publicICloudCalendarSharing(context),
    });
  }

  /** Lists calendars addressed to any verified e-mail linked to the current
   * Cloud Calendars account. Each e-mail index is revalidated against the
   * owner's canonical record so removed access disappears immediately. */
  async iCloudCalendarsSharedWithMe(principal: any): Promise<ApiResult> {
    const account = await this.store.getJSON(this.keys.principal(principal.principalId));
    const emails = [...new Set(
      this.recipientIdentities(account).map((identity) => identity.email),
    )];
    if (emails.length === 0) return result(200, { calendars: [] });

    const indexed = (await Promise.all(emails.map(async (email) => {
      const prefix = this.keys.pendingICloudCalendarInvitations(
        this.core.emailHash(email),
      );
      const objectKeys = await this.store.listKeys(prefix);
      return Promise.all(objectKeys.map(async (key) => ({
        key,
        email,
        ref: await this.store.getJSON(key),
      })));
    }))).flat();

    const calendars = new Map<string, any>();
    const staleKeys: string[] = [];
    const ownerEmailCache = new Map<string, string | null>();

    for (const indexedValue of indexed) {
      const ownerId = String(indexedValue.ref?.ownerId ?? '');
      const calendarId = String(indexedValue.ref?.calendarId ?? '');
      if (!ownerId || !validICloudCalendarShareId(calendarId)) {
        staleKeys.push(indexedValue.key);
        continue;
      }

      const calendar = await this.store.getJSON(
        this.keys.icloudCalendarSharing(ownerId, calendarId),
      );
      const recipient = (Array.isArray(calendar?.recipients) ? calendar.recipients : [])
        .find((value: any) => normalizeEmail(value?.email) === indexedValue.email);
      const revokedAt = boundedPlainText(
        indexedValue.ref?.revokedAt ?? calendar?.deletedAt,
        128,
      );
      const revokedReason = revokedAt
        ? boundedPlainText(
          indexedValue.ref?.revokedReason
            ?? (calendar?.deletedAt ? 'owner_deleted' : 'access_removed'),
          64,
        ) ?? 'access_removed'
        : null;
      const isPending = Boolean(recipient?.isPending ?? indexedValue.ref?.isPending);
      if ((!calendar || !recipient) && !revokedAt) {
        staleKeys.push(indexedValue.key);
        continue;
      }
      // Email invitations are shown in Pending invitations until the recipient
      // explicitly accepts them; they must not also appear as active calendars.
      if (isPending && !revokedAt) continue;

      if (!ownerEmailCache.has(ownerId)) {
        const ownerAccount = await this.store.getJSON(this.keys.principal(ownerId));
        ownerEmailCache.set(
          ownerId,
          this.recipientIdentities(ownerAccount)[0]?.email ?? null,
        );
      }

      const identity = `${ownerId}:${calendarId}`;
      const calendarEvents = calendar
        ? await this.store.getJSON(this.keys.icloudCalendarEvents(ownerId, calendarId))
        : null;
      const sharedCalendar = {
        id: hashKey(identity),
        ownerId,
        ownerEmail: ownerEmailCache.get(ownerId) ?? null,
        calendarId,
        title: String(calendar?.title ?? indexedValue.ref?.title ?? 'Shared calendar').slice(0, 512),
        color: /^#[0-9a-fA-F]{6}$/.test(
          String(calendar?.color ?? indexedValue.ref?.color ?? ''),
        )
          ? String(calendar?.color ?? indexedValue.ref?.color).toUpperCase()
          : '#0088FF',
        timeZone: safeTimeZone(
          String(calendar?.timeZone ?? indexedValue.ref?.timeZone ?? ''),
        ) ?? 'UTC',
        calendarKind: calendar?.calendarKind === 'app_local'
          || indexedValue.ref?.calendarKind === 'app_local'
          ? 'app_local'
          : 'eventkit',
        access: this.recipientAccess({
          access: recipient?.access ?? indexedValue.ref?.access,
        }),
        invitedAt: recipient?.invitedAt ?? indexedValue.ref?.invitedAt ?? null,
        updatedAt: calendar?.updatedAt
          ?? recipient?.updatedAt
          ?? indexedValue.ref?.updatedAt
          ?? null,
        isRevoked: Boolean(revokedAt),
        revokedAt: revokedAt ?? null,
        revokedReason,
        events: Array.isArray(calendarEvents?.events) ? calendarEvents.events : [],
        eventsUpdatedAt: calendarEvents?.updatedAt ?? null,
        windowStart: calendarEvents?.windowStart ?? null,
        windowEnd: calendarEvents?.windowEnd ?? null,
      };
      const previous = calendars.get(identity);
      if (!previous
          || (previous.isRevoked && !sharedCalendar.isRevoked)
          || (previous.isRevoked === sharedCalendar.isRevoked
            && this.eventAccessRank(sharedCalendar.access)
              > this.eventAccessRank(previous.access))) {
        calendars.set(identity, sharedCalendar);
      }
    }

    await Promise.all(staleKeys.map((key) => this.store.del(key)));
    return result(200, {
      calendars: [...calendars.values()].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }),
      ),
    });
  }

  async iCloudCalendarInvitationLanding(
    query: any,
  ): Promise<{ status: number; html: string }> {
    const ownerId = boundedQueryValue(query?.o, 128);
    const calendarId = boundedQueryValue(query?.c, 128);
    if (!ownerId || !calendarId || !validICloudCalendarShareId(calendarId)) {
      return {
        status: 400,
        html: eventInvitationErrorPage('Invalid calendar invitation'),
      };
    }
    const calendar = await this.store.getJSON(
      this.keys.icloudCalendarSharing(ownerId, calendarId),
    );
    if (!calendar || calendar.deletedAt) {
      return {
        status: 404,
        html: eventInvitationErrorPage('This calendar invitation is no longer available'),
      };
    }

    const deepLink = new URL('cloudcalendars://shared-calendar');
    deepLink.searchParams.set('o', ownerId);
    deepLink.searchParams.set('c', calendarId);
    deepLink.searchParams.set('title', calendar.title ?? 'Shared calendar');
    deepLink.searchParams.set('color', calendar.color ?? '#0088FF');
    const title = String(calendar.title ?? 'Shared calendar');
    const color = /^#[0-9a-fA-F]{6}$/.test(String(calendar.color ?? ''))
      ? String(calendar.color)
      : '#0088FF';
    const ownerAccount = await this.store.getJSON(this.keys.principal(ownerId));
    const sender = this.recipientIdentities(ownerAccount)[0]?.email
      ?? normalizeEmail(calendar.ownerEmail)
      ?? 'Cloud Calendars';
    return {
      status: 200,
      html: eventInvitationDocument(`
        <section class="clip-content" data-view="app-clip-preview" style="--event-color:${escapeHTML(color)}">
          <div class="sender-line">From <strong>${escapeHTML(sender)}</strong></div>
          <div class="invitation-label">${eventIcon('calendar')}<span>Calendar invitation</span></div>
          <div class="preview-card calendar-preview">
            <span class="symbol preview-symbol" aria-hidden="true">${eventIcon('calendar')}</span>
            <strong class="event-title">${escapeHTML(title)}</strong>
          </div>
          <div class="actions">
            <a class="primary" href="${escapeHTML(deepLink.toString())}">Open in Cloud Calendars</a>
            <a class="secondary" href="${escapeHTML(CLOUD_CALENDARS_APP_STORE_URL)}">Download Cloud Calendars</a>
          </div>
          <div class="privacy-note"><span aria-hidden="true">♢</span><span>This page previews the calendar invitation. Open Cloud Calendars to add it to Shared with me.</span></div>
        </section>`, title, 'Shared calendar'),
    };
  }

  /** Accepts an App Clip, QR, or link invitation into the recipient's
   * Cloud Calendars account. Unlike importing a single event, this does not
   * create a new EventKit calendar on the device: the canonical S3 share and
   * the recipient's "Shared with me" index remain the source of truth. */
  async acceptICloudCalendarInvitation(principal: any, body: any): Promise<ApiResult> {
    const ownerId = boundedPlainText(body.ownerId, 128);
    const calendarId = boundedPlainText(body.calendarId, 128);
    if (!ownerId || !calendarId || !validICloudCalendarShareId(calendarId)) {
      return result(400, { error: 'ownerId and a valid calendarId are required' });
    }
    if (ownerId === principal.principalId) {
      return result(409, { error: 'the owner already has full calendar access' });
    }

    const calendarKey = this.keys.icloudCalendarSharing(ownerId, calendarId);
    const [calendar, account, ownerAccount] = await Promise.all([
      this.store.getJSON(calendarKey),
      this.store.getJSON(this.keys.principal(principal.principalId)),
      this.store.getJSON(this.keys.principal(ownerId)),
    ]);
    if (!calendar || calendar.deletedAt) {
      return result(404, { error: 'shared calendar no longer exists' });
    }

    const identities = this.recipientIdentities(account);
    if (identities.length === 0) {
      return result(422, {
        code: 'email_required',
        error: 'a verified email identity is required to receive shared calendars',
      });
    }

    const identityEmails = new Set(identities.map((identity) => identity.email));
    const existingRecipients = Array.isArray(calendar.recipients)
      ? calendar.recipients
      : [];
    const matchesCurrentUser = (recipient: any) => {
      if (recipient?.userId === principal.principalId) return true;
      const emails = [
        normalizeEmail(recipient?.email),
        normalizeEmail(recipient?.invitedEmail),
        ...(Array.isArray(recipient?.emails)
          ? recipient.emails.map(normalizeEmail)
          : []),
      ].filter((email): email is string => Boolean(email));
      return emails.some((email) => identityEmails.has(email));
    };
    const matchingRecipients = existingRecipients.filter(matchesCurrentUser);
    const existing = matchingRecipients.find(
      (recipient: any) => recipient?.userId === principal.principalId,
    ) ?? matchingRecipients[0];
    const email = normalizeEmail(existing?.email) ?? identities[0].email;
    const now = nextRevisionTimestamp(calendar.updatedAt);
    const access = matchingRecipients
      .map((value: any) => this.recipientAccess(value))
      .sort((a, b) => this.eventAccessRank(b) - this.eventAccessRank(a))[0]
      ?? 'reader';
    const recipient = {
      id: principal.principalId,
      userId: principal.principalId,
      email,
      invitedEmail: normalizeEmail(existing?.invitedEmail) ?? email,
      emails: [...new Set(identities.map((identity) => identity.email))],
      identities: identities.map((identity) => ({
        provider: identity.provider,
        email: identity.email,
      })),
      access,
      isPending: false,
      invitedAt: existing?.invitedAt ?? now,
      acceptedAt: existing?.acceptedAt ?? now,
      updatedAt: now,
    };
    const recipients = existingRecipients
      .filter((value: any) => !matchesCurrentUser(value));
    recipients.push(recipient);
    recipients.sort((a: any, b: any) =>
      String(a?.email ?? '').localeCompare(String(b?.email ?? '')),
    );
    const savedCalendar = {
      ...calendar,
      recipients,
      recipientCount: recipients.length,
      updatedAt: now,
    };

    const ownerIdentities = this.recipientIdentities(ownerAccount);
    const invitationRef = {
      ownerId,
      calendarId,
      title: String(calendar.title ?? 'Shared calendar').slice(0, 512),
      color: /^#[0-9a-fA-F]{6}$/.test(String(calendar.color ?? ''))
        ? String(calendar.color).toUpperCase()
        : '#0088FF',
      timeZone: safeTimeZone(String(calendar.timeZone ?? '')) ?? 'UTC',
      calendarKind: calendar.calendarKind === 'app_local' ? 'app_local' : 'eventkit',
      email,
      recipientId: principal.principalId,
      userId: principal.principalId,
      access,
      isPending: false,
      invitedAt: recipient.invitedAt,
      acceptedAt: recipient.acceptedAt,
      updatedAt: now,
    };
    await Promise.all([
      this.store.putJSON(calendarKey, savedCalendar),
      this.store.putJSON(this.keys.pendingICloudCalendarInvitation(
        this.core.emailHash(email),
        ownerId,
        calendarId,
      ), invitationRef),
      this.store.putJSON(this.keys.receivedICloudCalendar(
        principal.principalId,
        ownerId,
        calendarId,
      ), {
        ...invitationRef,
        ownerEmail: ownerIdentities[0]?.email ?? null,
      }),
    ]);
    return result(201, {
      accepted: true,
      calendar: {
        id: hashKey(`${ownerId}:${calendarId}`),
        ownerId,
        ownerEmail: ownerIdentities[0]?.email ?? null,
        calendarId,
        title: invitationRef.title,
        color: invitationRef.color,
        timeZone: invitationRef.timeZone,
        calendarKind: invitationRef.calendarKind,
        access,
        invitedAt: invitationRef.invitedAt,
        updatedAt: now,
      },
    });
  }

  /** Lets a recipient leave a shared calendar. This removes every canonical
   * recipient row associated with the current signed-in account and deletes
   * its S3 indexes, so the user also disappears from the creator's access
   * list. The original creator can never leave their own calendar. */
  async leaveICloudCalendar(
    principal: any,
    calendarId: string,
    requestedOwnerId?: unknown,
  ): Promise<ApiResult> {
    const ownerId = boundedPlainText(requestedOwnerId, 128);
    if (!ownerId || !validICloudCalendarShareId(calendarId)) {
      return result(400, { error: 'ownerId and a valid calendarId are required' });
    }
    if (ownerId === principal.principalId) {
      return result(403, { error: 'the original creator cannot leave their own calendar' });
    }

    const calendarKey = this.keys.icloudCalendarSharing(ownerId, calendarId);
    const [calendar, account] = await Promise.all([
      this.store.getJSON(calendarKey),
      this.store.getJSON(this.keys.principal(principal.principalId)),
    ]);
    if (!calendar || calendar.deletedAt) {
      await this.store.del(this.keys.receivedICloudCalendar(
        principal.principalId,
        ownerId,
        calendarId,
      ));
      return result(200, { left: true });
    }

    const identityEmails = new Set(
      this.recipientIdentities(account).map((identity) => identity.email),
    );
    const matchesCurrentUser = (recipient: any) =>
      recipient?.userId === principal.principalId
        || this.recipientEmails(recipient).some((email) => identityEmails.has(email));
    const existingRecipients = Array.isArray(calendar.recipients)
      ? calendar.recipients
      : [];
    const removedRecipients = existingRecipients.filter(matchesCurrentUser);
    const recipients = existingRecipients.filter((recipient: any) =>
      !matchesCurrentUser(recipient),
    );

    const deletes: Promise<any>[] = [
      this.store.del(this.keys.receivedICloudCalendar(
        principal.principalId,
        ownerId,
        calendarId,
      )),
    ];
    const removedEmails = new Set<string>();
    for (const recipient of removedRecipients) {
      for (const email of this.recipientEmails(recipient)) removedEmails.add(email);
      if (recipient?.userId) {
        deletes.push(this.store.del(this.keys.receivedICloudCalendar(
          String(recipient.userId),
          ownerId,
          calendarId,
        )));
      }
    }
    for (const email of removedEmails) {
      deletes.push(this.store.del(this.keys.pendingICloudCalendarInvitation(
        this.core.emailHash(email),
        ownerId,
        calendarId,
      )));
    }

    if (removedRecipients.length > 0) {
      const now = nextRevisionTimestamp(calendar.updatedAt);
      await this.store.putJSON(calendarKey, {
        ...calendar,
        recipients,
        recipientCount: recipients.length,
        updatedAt: now,
      });
    }
    await Promise.all(deletes);
    return result(200, { left: true });
  }

  /** Saves the canonical calendar share object and all recipient indexes in
   * S3. As with shared events, a recipient is linked to a stable principal
   * whenever their verified e-mail already belongs to an app account. */
  async saveICloudCalendarSharing(
    principal: any,
    calendarId: string,
    body: any,
  ): Promise<ApiResult> {
    if (!validICloudCalendarShareId(calendarId)) {
      return result(400, { error: 'invalid iCloud calendar identifier' });
    }
    const context = await this.iCloudCalendarAccessContext(
      principal,
      calendarId,
      body.ownerId,
      true,
    );
    if (!context || context.access !== 'owner') {
      return result(403, { error: 'Owner access is required to manage calendar sharing' });
    }
    const ownerId = context.ownerId;
    const title = boundedPlainText(body.title, 512);
    if (!title) return result(400, { error: 'calendar title is required' });
    const color = /^#[0-9a-fA-F]{6}$/.test(String(body.color ?? ''))
      ? String(body.color).toUpperCase()
      : '#0088FF';
    const timeZone = safeTimeZone(boundedPlainText(body.timeZone, 128)) ?? 'UTC';
    const rawRecipients = Array.isArray(body.recipients) ? body.recipients : [];
    if (rawRecipients.length > 100) {
      return result(400, { error: 'no more than 100 recipients are allowed' });
    }

    const recipientsByEmail = new Map<string, { email: string; access: EventAccessRole }>();
    for (const raw of rawRecipients) {
      const email = normalizeEmail(raw?.email);
      const access = String(raw?.access ?? '').toLowerCase();
      if (!email) return result(400, { error: 'every recipient requires a valid email' });
      if (!['reader', 'writer', 'owner'].includes(access)) {
        return result(400, { error: "access must be 'reader', 'writer', or 'owner'" });
      }
      recipientsByEmail.set(email, { email, access: access as EventAccessRole });
    }

    const key = this.keys.icloudCalendarSharing(ownerId, calendarId);
    const existing = context.calendar;
    const requestedCalendarKind = boundedPlainText(body.calendarKind, 32);
    const calendarKind = existing?.calendarKind === 'app_local'
      || (!existing && requestedCalendarKind === 'app_local')
      ? 'app_local'
      : 'eventkit';
    const expectedUpdatedAt = boundedPlainText(body.expectedUpdatedAt, 128);
    if (expectedUpdatedAt && existing?.updatedAt !== expectedUpdatedAt) {
      return result(409, {
        error: 'calendar metadata changed on another device',
        updatedAt: existing?.updatedAt ?? null,
      });
    }
    const ownerAccount = await this.store.getJSON(this.keys.principal(ownerId));
    const ownerIdentities = this.recipientIdentities(ownerAccount);
    const ownerEmails = new Set(ownerIdentities.map((identity) => identity.email));
    for (const email of recipientsByEmail.keys()) {
      if (ownerEmails.has(email)) {
        return result(400, { error: 'the owner already has full calendar access' });
      }
    }
    const existingByEmail = new Map<string, any>();
    for (const recipient of Array.isArray(existing?.recipients) ? existing.recipients : []) {
      const email = normalizeEmail(recipient?.email);
      if (email) existingByEmail.set(email, recipient);
    }
    const removedRecipientEmails = new Set<string>(
      (Array.isArray(body.removedRecipientEmails) ? body.removedRecipientEmails : [])
        .map(normalizeEmail)
        .filter((email: string | null): email is string => Boolean(email)),
    );
    if (body.preserveUnmentionedRecipients === true) {
      // A QR/App Clip recipient can accept while the owner's sharing sheet is
      // open. Merging unmentioned server rows prevents a later Save from that
      // stale sheet from revoking the freshly accepted user. Revocation is
      // always explicit through removedRecipientEmails.
      for (const [email, recipient] of existingByEmail) {
        if (!removedRecipientEmails.has(email) && !recipientsByEmail.has(email)) {
          recipientsByEmail.set(email, {
            email,
            access: this.recipientAccess(recipient),
          });
        }
      }
    }
    for (const email of removedRecipientEmails) recipientsByEmail.delete(email);
    if (recipientsByEmail.size > 100) {
      return result(400, { error: 'no more than 100 recipients are allowed' });
    }
    const now = nextRevisionTimestamp(existing?.updatedAt);
    const recipients = await Promise.all(
      [...recipientsByEmail.values()]
        .sort((a, b) => a.email.localeCompare(b.email))
        .map(async (recipient) => {
          const previous = existingByEmail.get(recipient.email);
          // An e-mail invitation must stay pending until that exact recipient
          // accepts it. A later Save from the owner must not silently turn a
          // pending invitation into active access merely because the e-mail is
          // already linked to a Cloud Calendars account.
          const preservePending = previous?.isPending === true;
          const accountRef = await this.store.getJSON(
            this.keys.accountEmail(this.core.emailHash(recipient.email)),
          );
          const recipientPrincipalId = !preservePending && accountRef?.principalId
            && accountRef.principalId !== ownerId
            ? String(accountRef.principalId)
            : null;
          const recipientAccount = recipientPrincipalId
            ? await this.store.getJSON(this.keys.principal(recipientPrincipalId))
            : null;
          const identities = this.recipientIdentities(recipientAccount).map((identity) => ({
            provider: identity.provider,
            email: identity.email,
          }));
          const emails = [...new Set([
            recipient.email,
            ...identities.map((identity) => identity.email),
          ])];
          return {
            id: recipientPrincipalId ?? `invited:${hashKey(recipient.email)}`,
            userId: recipientPrincipalId,
            email: recipient.email,
            invitedEmail: recipient.email,
            emails,
            identities,
            access: recipient.access,
            isPending: preservePending || recipientPrincipalId == null,
            invitedAt: previous?.invitedAt ?? now,
            acceptedAt: !preservePending && recipientPrincipalId
              ? previous?.acceptedAt ?? now
              : null,
            updatedAt: now,
          };
        }),
    );
    const calendar = {
      schemaVersion: 2,
      id: calendarId,
      ownerId,
      ownerEmail: ownerIdentities[0]?.email ?? null,
      owner: {
        id: ownerId,
        emails: [...ownerEmails],
        identities: ownerIdentities.map((identity) => ({
          provider: identity.provider,
          email: identity.email,
        })),
      },
      title,
      color,
      timeZone,
      calendarKind,
      recipients,
      recipientCount: recipients.length,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      deletedAt: null,
    };
    await this.store.putJSON(key, calendar);

    const previousEmails = new Set<string>(existingByEmail.keys());
    const currentEmails = new Set<string>(recipients.map((recipient) => recipient.email));
    const indexes: Promise<any>[] = [];
    for (const email of previousEmails) {
      if (!currentEmails.has(email)) {
        const previousRecipient = existingByEmail.get(email);
        const tombstone = {
          ownerId,
          ownerEmail: ownerIdentities[0]?.email ?? null,
          calendarId,
          title,
          color,
          timeZone,
          calendarKind,
          email,
          recipientId: previousRecipient?.id ?? null,
          userId: previousRecipient?.userId ?? null,
          access: this.recipientAccess(previousRecipient),
          isPending: false,
          invitedAt: previousRecipient?.invitedAt ?? null,
          acceptedAt: previousRecipient?.acceptedAt ?? null,
          updatedAt: now,
          revokedAt: now,
          revokedReason: 'access_removed',
        };
        indexes.push(this.store.putJSON(this.keys.pendingICloudCalendarInvitation(
          this.core.emailHash(email),
          ownerId,
          calendarId,
        ), tombstone));
        const previousUserId = previousRecipient?.userId;
        if (previousUserId) {
          indexes.push(this.store.putJSON(this.keys.receivedICloudCalendar(
            String(previousUserId),
            ownerId,
            calendarId,
          ), tombstone));
        }
      }
    }
    for (const recipient of recipients) {
      const previousUserId = existingByEmail.get(recipient.email)?.userId;
      if (previousUserId && previousUserId !== recipient.userId) {
        indexes.push(this.store.del(this.keys.receivedICloudCalendar(
          String(previousUserId),
          ownerId,
          calendarId,
        )));
      }
      indexes.push(this.store.putJSON(this.keys.pendingICloudCalendarInvitation(
        this.core.emailHash(recipient.email),
        ownerId,
        calendarId,
      ), {
        ownerId,
        calendarId,
        title,
        color,
        timeZone,
        calendarKind,
        email: recipient.email,
        recipientId: recipient.id,
        userId: recipient.userId,
        access: recipient.access,
        isPending: recipient.isPending,
        invitedAt: recipient.invitedAt,
        acceptedAt: recipient.acceptedAt,
        updatedAt: now,
        revokedAt: null,
        revokedReason: null,
      }));
      if (recipient.userId) {
        indexes.push(this.store.putJSON(this.keys.receivedICloudCalendar(
          recipient.userId,
          ownerId,
          calendarId,
        ), {
          ownerId,
          ownerEmail: ownerIdentities[0]?.email ?? null,
          calendarId,
          title,
          color,
          timeZone,
          calendarKind,
          recipientId: recipient.id,
          access: recipient.access,
          invitedAt: recipient.invitedAt,
          acceptedAt: recipient.acceptedAt,
          updatedAt: now,
          revokedAt: null,
          revokedReason: null,
        }));
      }
    }
    await Promise.all(indexes);
    return result(existing ? 200 : 201, {
      calendar: await this.publicICloudCalendarSharing({ ...context, calendar }),
    });
  }

  /** Marks selected e-mail recipients as pending and sends (or re-sends) their
   * invitation. Saving sharing metadata and delivering mail are deliberately
   * separate operations so App Clip/QR recipients remain unaffected. */
  async inviteICloudCalendarRecipients(
    principal: any,
    calendarId: string,
    body: any,
  ): Promise<ApiResult> {
    if (!validICloudCalendarShareId(calendarId)) {
      return result(400, { error: 'invalid iCloud calendar identifier' });
    }
    const context = await this.iCloudCalendarAccessContext(
      principal,
      calendarId,
      body.ownerId,
      false,
    );
    if (!context || context.access !== 'owner' || !context.calendar) {
      return result(403, { error: 'Owner access is required to invite calendar recipients' });
    }

    const emails = [...new Set(
      (Array.isArray(body.emails) ? body.emails : [])
        .map(normalizeEmail)
        .filter((email: string | null): email is string => Boolean(email)),
    )];
    if (emails.length === 0 || emails.length > 50) {
      return result(400, { error: 'between 1 and 50 invitation emails are required' });
    }

    const emailSet = new Set(emails);
    const now = nextRevisionTimestamp(context.calendar.updatedAt);
    const previousRecipients = Array.isArray(context.calendar.recipients)
      ? context.calendar.recipients
      : [];
    const matched = previousRecipients.filter((recipient: any) =>
      emailSet.has(normalizeEmail(recipient?.email) ?? ''),
    );
    if (matched.length !== emails.length) {
      return result(409, { error: 'save every invitation recipient before sending email' });
    }

    const previousUserIds = matched
      .map((recipient: any) => boundedPlainText(recipient?.userId, 128))
      .filter((value: string | null): value is string => Boolean(value));
    const recipients = previousRecipients.map((recipient: any) => {
      const email = normalizeEmail(recipient?.email);
      if (!email || !emailSet.has(email)) return recipient;
      return {
        ...recipient,
        id: `invited:${hashKey(email)}`,
        userId: null,
        email,
        invitedEmail: email,
        emails: [email],
        identities: [],
        isPending: true,
        acceptedAt: null,
        invitedAt: recipient?.invitedAt ?? now,
        invitationSentAt: now,
        updatedAt: now,
      };
    });
    const calendar = {
      ...context.calendar,
      recipients,
      recipientCount: recipients.length,
      updatedAt: now,
    };
    await this.store.putJSON(
      this.keys.icloudCalendarSharing(context.ownerId, calendarId),
      calendar,
    );

    const invitedRecipients = recipients.filter((recipient: any) =>
      emailSet.has(normalizeEmail(recipient?.email) ?? ''),
    );
    const indexWrites: Promise<any>[] = invitedRecipients.map((recipient: any) =>
      this.store.putJSON(this.keys.pendingICloudCalendarInvitation(
        this.core.emailHash(recipient.email),
        context.ownerId,
        calendarId,
      ), {
        ownerId: context.ownerId,
        calendarId,
        title: calendar.title,
        color: calendar.color,
        timeZone: calendar.timeZone,
        calendarKind: calendar.calendarKind === 'app_local' ? 'app_local' : 'eventkit',
        email: recipient.email,
        recipientId: recipient.id,
        userId: null,
        access: recipient.access,
        isPending: true,
        invitedAt: recipient.invitedAt,
        invitationSentAt: now,
        acceptedAt: null,
        updatedAt: now,
        revokedAt: null,
        revokedReason: null,
      }),
    );
    indexWrites.push(...previousUserIds.map((userId) => this.store.del(
      this.keys.receivedICloudCalendar(userId, context.ownerId, calendarId),
    )));
    await Promise.all(indexWrites);

    const senderAccount = await this.store.getJSON(
      this.keys.principal(principal.principalId),
    );
    const senderIdentities = this.recipientIdentities(senderAccount);
    const senderEmail = senderIdentities.find((identity) =>
      identity.provider === principal.identityProvider,
    )?.email ?? senderIdentities[0]?.email ?? null;
    await Promise.all(invitedRecipients.map((recipient: any) =>
      this.push?.enqueue('calendar', recipient.email, context.ownerId, calendarId)));
    await Promise.all(invitedRecipients.map((recipient: any) =>
      this.email.sendSharedCalendarInvitation({
        email: recipient.email,
        access: this.recipientAccess(recipient),
        calendar,
        ownerId: context.ownerId,
        calendarId,
        senderEmail,
      }),
    ));

    return result(201, {
      invitedCount: invitedRecipients.length,
      calendar: await this.publicICloudCalendarSharing({ ...context, calendar }),
    });
  }

  /** Lists unaccepted calendar invitations for every verified account e-mail. */
  async pendingICloudCalendarInvitations(principal: any): Promise<ApiResult> {
    const account = await this.store.getJSON(this.keys.principal(principal.principalId));
    const emails = [...new Set(
      this.recipientIdentities(account).map((identity) => identity.email),
    )];
    if (emails.length === 0) return result(200, { invitations: [] });

    const indexed = (await Promise.all(emails.map(async (email) => {
      const prefix = this.keys.pendingICloudCalendarInvitations(this.core.emailHash(email));
      const objectKeys = await this.store.listKeys(prefix);
      return Promise.all(objectKeys.map(async (key) => ({
        key,
        email,
        ref: await this.store.getJSON(key),
      })));
    }))).flat();

    const invitations = new Map<string, any>();
    const staleKeys: string[] = [];
    for (const value of indexed) {
      const ownerId = String(value.ref?.ownerId ?? '');
      const calendarId = String(value.ref?.calendarId ?? '');
      if (!ownerId || !validICloudCalendarShareId(calendarId) || value.ref?.revokedAt) {
        if (!value.ref?.revokedAt) staleKeys.push(value.key);
        continue;
      }
      const calendar = await this.store.getJSON(
        this.keys.icloudCalendarSharing(ownerId, calendarId),
      );
      const recipient = (Array.isArray(calendar?.recipients) ? calendar.recipients : [])
        .find((item: any) => normalizeEmail(item?.email) === value.email);
      if (!calendar || calendar.deletedAt || !recipient || recipient.isPending !== true) {
        if (!recipient || recipient?.isPending !== false) staleKeys.push(value.key);
        continue;
      }

      const ownerAccount = await this.store.getJSON(this.keys.principal(ownerId));
      const ownerEmail = this.recipientIdentities(ownerAccount)[0]?.email ?? null;
      const identity = `${ownerId}:${calendarId}`;
      invitations.set(identity, {
        id: hashKey(identity),
        ownerId,
        ownerEmail,
        calendarId,
        title: String(calendar.title ?? 'Shared calendar').slice(0, 512),
        color: /^#[0-9a-fA-F]{6}$/.test(String(calendar.color ?? ''))
          ? String(calendar.color).toUpperCase()
          : '#0088FF',
        timeZone: safeTimeZone(String(calendar.timeZone ?? '')) ?? 'UTC',
        calendarKind: calendar.calendarKind === 'app_local' ? 'app_local' : 'eventkit',
        access: this.recipientAccess(recipient),
        invitedAt: recipient.invitedAt ?? value.ref?.invitedAt ?? null,
        senderEmail: ownerEmail,
      });
    }
    await Promise.all(staleKeys.map((key) => this.store.del(key)));
    return result(200, {
      invitations: [...invitations.values()].sort((a, b) =>
        String(b.invitedAt ?? '').localeCompare(String(a.invitedAt ?? '')),
      ),
    });
  }

  async declinePendingICloudCalendarInvitation(
    principal: any,
    calendarId: string,
    body: any,
  ): Promise<ApiResult> {
    const ownerId = boundedPlainText(body.ownerId, 128);
    if (!ownerId || !validICloudCalendarShareId(calendarId)) {
      return result(400, { error: 'ownerId and a valid calendarId are required' });
    }
    const account = await this.store.getJSON(this.keys.principal(principal.principalId));
    const emails = new Set(this.recipientIdentities(account).map((identity) => identity.email));
    const key = this.keys.icloudCalendarSharing(ownerId, calendarId);
    const calendar = await this.store.getJSON(key);
    if (!calendar) return result(404, { error: 'pending invitation not found' });
    const removed = (Array.isArray(calendar.recipients) ? calendar.recipients : [])
      .filter((recipient: any) => recipient?.isPending === true
        && emails.has(normalizeEmail(recipient?.email) ?? ''));
    if (removed.length === 0) return result(404, { error: 'pending invitation not found' });
    const recipients = calendar.recipients.filter((recipient: any) => !removed.includes(recipient));
    await this.store.putJSON(key, {
      ...calendar,
      recipients,
      recipientCount: recipients.length,
      updatedAt: nextRevisionTimestamp(calendar.updatedAt),
    });
    await Promise.all(removed.map((recipient: any) => this.store.del(
      this.keys.pendingICloudCalendarInvitation(
        this.core.emailHash(normalizeEmail(recipient.email)!),
        ownerId,
        calendarId,
      ),
    )));
    return result(200, { declined: true });
  }

  /** Keeps the last shared snapshot as a tombstone when the owner deletes the
   * local calendar. Recipients retain a frozen, struck-through copy instead of
   * seeing the calendar and all of its events disappear without explanation. */
  async deleteICloudCalendarSharing(
    principal: any,
    calendarId: string,
  ): Promise<ApiResult> {
    if (!validICloudCalendarShareId(calendarId)) {
      return result(400, { error: 'invalid iCloud calendar identifier' });
    }

    const key = this.keys.icloudCalendarSharing(principal.principalId, calendarId);
    const [calendar, ownerAccount] = await Promise.all([
      this.store.getJSON(key),
      this.store.getJSON(this.keys.principal(principal.principalId)),
    ]);
    // Deletion is intentionally idempotent. A local calendar that was never
    // shared has no server record and therefore needs no recipient tombstone.
    if (!calendar) return result(200, { deleted: true });
    if (String(calendar.ownerId ?? principal.principalId) !== principal.principalId) {
      return result(403, { error: 'only the original creator may delete this calendar' });
    }

    const now = calendar.deletedAt ?? nextRevisionTimestamp(calendar.updatedAt);
    const ownerEmail = this.recipientIdentities(ownerAccount)[0]?.email ?? null;
    const deletedCalendar = {
      ...calendar,
      deletedAt: now,
      updatedAt: now,
    };
    const indexes: Promise<any>[] = [this.store.putJSON(key, deletedCalendar)];

    for (const recipient of Array.isArray(calendar.recipients) ? calendar.recipients : []) {
      const email = normalizeEmail(recipient?.email);
      if (!email) continue;
      const tombstone = {
        ownerId: principal.principalId,
        ownerEmail,
        calendarId,
        title: String(calendar.title ?? 'Shared calendar').slice(0, 512),
        color: /^#[0-9a-fA-F]{6}$/.test(String(calendar.color ?? ''))
          ? String(calendar.color).toUpperCase()
          : '#0088FF',
        timeZone: safeTimeZone(String(calendar.timeZone ?? '')) ?? 'UTC',
        calendarKind: calendar.calendarKind === 'app_local' ? 'app_local' : 'eventkit',
        email,
        recipientId: recipient?.id ?? null,
        userId: recipient?.userId ?? null,
        access: this.recipientAccess(recipient),
        isPending: false,
        invitedAt: recipient?.invitedAt ?? null,
        acceptedAt: recipient?.acceptedAt ?? null,
        updatedAt: now,
        revokedAt: now,
        revokedReason: 'owner_deleted',
      };
      indexes.push(this.store.putJSON(this.keys.pendingICloudCalendarInvitation(
        this.core.emailHash(email),
        principal.principalId,
        calendarId,
      ), tombstone));
      if (recipient?.userId) {
        indexes.push(this.store.putJSON(this.keys.receivedICloudCalendar(
          String(recipient.userId),
          principal.principalId,
          calendarId,
        ), tombstone));
      }
    }

    await Promise.all(indexes);
    return result(200, { deleted: true, deletedAt: now });
  }

  /** Stores the portable EventKit snapshot for one shared iCloud calendar.
   * Calendar metadata and event content are separate S3 objects so changing a
   * recipient never risks replacing a newer event snapshot (and vice versa). */
  async saveICloudCalendarEvents(
    principal: any,
    calendarId: string,
    body: any,
  ): Promise<ApiResult> {
    if (!validICloudCalendarShareId(calendarId)) {
      return result(400, { error: 'invalid iCloud calendar identifier' });
    }
    const context = await this.iCloudCalendarAccessContext(
      principal,
      calendarId,
      body.ownerId,
    );
    if (!context) {
      return result(404, { error: 'calendar must be shared before its events can sync' });
    }
    if (context.access === 'reader') {
      return result(403, { error: 'Reader access cannot edit calendar events' });
    }
    const sharing = context.calendar;
    if (sharing.deletedAt) {
      return result(409, { error: 'deleted calendars can no longer sync events' });
    }

    const existingSnapshotEntry = await this.store.getJSONWithETag(
      this.keys.icloudCalendarEvents(context.ownerId, calendarId),
    );
    const existingSnapshot = existingSnapshotEntry?.value;
    const expectedUpdatedAt = boundedPlainText(body.expectedUpdatedAt, 128);
    if (expectedUpdatedAt && existingSnapshot?.updatedAt !== expectedUpdatedAt) {
      return result(409, {
        error: 'calendar events changed on another device',
        updatedAt: existingSnapshot?.updatedAt ?? null,
      });
    }

    const rawEvents = Array.isArray(body.events) ? body.events : null;
    if (!rawEvents) return result(400, { error: 'events must be an array' });
    if (rawEvents.length > 5000) {
      return result(400, { error: 'no more than 5000 calendar events are allowed' });
    }
    const windowStart = validISODate(body.windowStart);
    const windowEnd = validISODate(body.windowEnd);
    if (!windowStart || !windowEnd || Date.parse(windowEnd) < Date.parse(windowStart)) {
      return result(400, { error: 'a valid sync window is required' });
    }

    const previousEvents = new Map<string, any>(
      (existingSnapshot?.events ?? []).map((event: any) => [event.id, event]),
    );
    const eventsById = new Map<string, any>();
    for (const raw of rawEvents) {
      const id = String(raw?.id ?? '').toLowerCase();
      if (!validICloudCalendarShareId(id)) {
        return result(400, { error: 'every event requires a valid identifier' });
      }
      const title = boundedPlainText(raw?.title, 512);
      const start = validISODate(raw?.start);
      const end = validISODate(raw?.end);
      if (!title || !start || !end || Date.parse(end) < Date.parse(start)) {
        return result(400, { error: 'every event requires a title, start, and end' });
      }
      const location = optionalMultilinePlainText(raw?.location, 2048);
      const eventUrl = optionalEventURL(raw?.url);
      if (eventUrl === undefined && raw?.url != null && raw?.url !== '') {
        return result(400, { error: 'an event URL is invalid' });
      }
      eventsById.set(id, {
        id,
        title,
        start,
        end,
        allDay: Boolean(raw?.allDay),
        location,
        url: eventUrl ?? null,
        details: mergeEventDetailsForWrite(raw?.details, previousEvents.get(id)?.details),
      });
    }

    const now = nextRevisionTimestamp(existingSnapshot?.updatedAt);
    const snapshot = {
      schemaVersion: 1,
      ownerId: context.ownerId,
      calendarId,
      windowStart,
      windowEnd,
      events: [...eventsById.values()].sort((a, b) =>
        a.start === b.start ? a.id.localeCompare(b.id) : a.start.localeCompare(b.start),
      ),
      updatedAt: now,
    };
    const snapshotKey = this.keys.icloudCalendarEvents(context.ownerId, calendarId);
    const written = existingSnapshotEntry
      ? await this.store.putJSONIfMatch(snapshotKey, snapshot, existingSnapshotEntry.etag)
      : await this.store.putJSONIfAbsent(snapshotKey, snapshot);
    if (!written) return result(409, { error: 'calendar events changed on another device' });
    return result(200, {
      eventCount: snapshot.events.length,
      updatedAt: now,
    });
  }

  async updateEventRecipientAccess(
    principal: any,
    eventId: string,
    recipientId: string,
    body: any,
  ): Promise<ApiResult> {
    const access = String(body.access ?? '').toLowerCase();
    if (!['reader', 'writer', 'owner'].includes(access)) {
      return result(400, { error: "access must be 'reader', 'writer', or 'owner'" });
    }
    const context = await this.eventManagementContext(principal, eventId);
    if (!context) {
      return result(403, { error: 'Owner access is required to change event access' });
    }
    if (recipientId === `owner:${context.originalOwnerId || context.calId}`) {
      return result(403, { error: "the original owner's access cannot be changed" });
    }

    let missingRecipient = false;
    const now = new Date().toISOString();
    const saved = await this.mutateEvent(context.calId, eventId, (event) => {
      if (!event) return null;
      const recipients = Array.isArray(event.recipients) ? [...event.recipients] : [];
      const index = recipients.findIndex((recipient: any) => this.recipientId(recipient) === recipientId);
      if (index < 0) {
        missingRecipient = true;
        return null;
      }
      recipients[index] = { ...recipients[index], access, updatedAt: now };
      return { ...event, recipients, recipientsUpdatedAt: now };
    });
    if (!saved && missingRecipient) return result(404, { error: 'recipient has not accepted this event' });
    if (!saved) return result(404, { error: 'no such event' });
    return result(200, { recipient: this.publicRecipient(
      saved.event.recipients.find((recipient: any) => this.recipientId(recipient) === recipientId),
    ) });
  }

  private async mutateEvent(
    calId: string,
    eventId: string,
    mutation: (existing: any | null) => any | null,
  ): Promise<{ previous: any | null; event: any } | null> {
    const key = this.keys.event(calId, eventId);
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const loaded = await this.store.getJSONWithETag(key);
      const previous = loaded?.value ?? null;
      const event = mutation(previous);
      if (!event) return null;
      const written = loaded
        ? await this.store.putJSONIfMatch(key, event, loaded.etag)
        : await this.store.putJSONIfAbsent(key, event);
      if (written) return { previous, event };
    }
    throw new Error('event changed too many times; retry the request');
  }

  private recipientIdentities(account: any): Array<{
    provider: string;
    identityId: string;
    email: string;
  }> {
    return Object.entries(account?.identities ?? {})
      .map(([provider, value]: [string, any]) => ({
        provider,
        identityId: String(value?.id ?? ''),
        email: normalizeEmail(value?.email),
      }))
      .filter((identity): identity is { provider: string; identityId: string; email: string } =>
        Boolean(identity.identityId && identity.email),
      )
      .sort((a, b) => a.provider.localeCompare(b.provider));
  }

  /** Associates a received scoped feed with the signed-in recipient. */
  async rememberReceivedInvite(principal: any, body: any): Promise<ApiResult> {
    const eventId = String(body.eventId ?? '');
    const feedId = String(body.feedId ?? '');
    if (!eventId || !feedId) return result(400, { error: 'eventId and feedId are required' });

    const feedIndex = await this.store.getJSON(this.keys.feedIndex(feedId));
    if (!feedIndex) return result(404, { error: 'no such feed' });
    const acl = await this.store.getJSON(this.keys.acl(feedIndex.calId));
    const grant = acl?.feeds?.[feedId];
    if (grant?.scope?.eventId !== eventId) return result(403, { error: 'feed is not scoped to this event' });

    const account = await this.store.getJSON(this.keys.principal(principal.principalId));
    const identities = this.recipientIdentities(account);
    if (identities.length === 0) {
      return result(422, {
        code: 'email_required',
        error: 'a verified email identity is required to receive shared events',
      });
    }

    const sharedEvent = await this.store.getJSON(this.keys.event(feedIndex.calId, eventId));
    const identityEmails = new Set(identities.map((identity) => identity.email));
    const accessRevoked = (Array.isArray(sharedEvent?.revokedRecipients)
      ? sharedEvent.revokedRecipients
      : []).some((revoked: any) =>
      revoked?.userId === principal.principalId
        || (Array.isArray(revoked?.emails)
          && revoked.emails.map(normalizeEmail).filter(Boolean)
            .some((email: string) => identityEmails.has(email))),
    );
    if (accessRevoked) return result(403, { error: 'event access was removed by the owner' });

    const now = new Date().toISOString();
    const previousRef = await this.store.getJSON(
      this.keys.receivedInvite(principal.principalId, eventId),
    );
    const localEventIdentifier = typeof body.localEventIdentifier === 'string'
      ? body.localEventIdentifier.slice(0, 512)
      : previousRef?.localEventIdentifier ?? null;
    await this.store.putJSON(this.keys.receivedInvite(principal.principalId, eventId), {
      eventId,
      feedId,
      ownerCalId: feedIndex.calId,
      localEventIdentifier,
      recordedAt: previousRef?.recordedAt ?? now,
      updatedAt: now,
    });

    const saved = await this.mutateEvent(feedIndex.calId, eventId, (event) => {
      if (!event) return null;
      const anonymousId = this.anonymousRecipientHash(body.anonymousRecipientId);
      let recipients = (Array.isArray(event.recipients) ? [...event.recipients] : [])
        // Signing in upgrades the same installation from an anonymous row to
        // its verified user row instead of showing the owner two recipients.
        .filter((value: any) => !anonymousId || value?.anonymousId !== anonymousId);
      const identityEmails = new Set(identities.map((identity) => identity.email));
      const matchingInvitations = recipients.filter((value: any) => {
        const invitedEmail = this.pendingInvitationEmail(value);
        return invitedEmail != null && identityEmails.has(invitedEmail);
      });
      recipients = recipients.filter((value: any) => !matchingInvitations.includes(value));
      const existingIndex = recipients.findIndex((value: any) =>
        value?.userId === principal.principalId,
      );
      const existing = existingIndex >= 0 ? recipients[existingIndex] : null;
      const grantedAccess = [existing, ...matchingInvitations]
        .filter(Boolean)
        .map((value: any) => this.recipientAccess(value))
        .sort((a, b) => this.eventAccessRank(b) - this.eventAccessRank(a))[0]
        ?? 'reader';
      const recipient = {
        userId: principal.principalId,
        emails: [...new Set(identities.map((identity) => identity.email))],
        identities,
        access: grantedAccess,
        invitedAt: existing?.invitedAt
          ?? matchingInvitations.map((value: any) => value?.invitedAt).filter(Boolean).sort()[0]
          ?? null,
        acceptedAt: existing?.acceptedAt ?? now,
        updatedAt: now,
      };
      if (existingIndex >= 0) recipients[existingIndex] = recipient;
      else recipients.push(recipient);
      recipients.sort((a: any, b: any) => String(a.userId).localeCompare(String(b.userId)));
      return {
        ...event,
        recipients,
        recipientCount: recipients.length,
        recipientsUpdatedAt: now,
      };
    });
    if (!saved) return result(404, { error: 'shared event no longer exists' });
    await Promise.all(identities.map((identity) => this.store.del(
      this.keys.pendingEventInvitation(
        this.core.emailHash(identity.email),
        feedIndex.calId,
        eventId,
      ),
    )));
    const recipient = saved.event.recipients.find(
      (value: any) => value?.userId === principal.principalId,
    );
    return result(201, {
      remembered: true,
      recipientCount: saved.event.recipientCount,
      access: this.recipientAccess(recipient),
    });
  }

  private anonymousRecipientHash(value: unknown): string | null {
    const raw = String(value ?? '').trim();
    if (!/^[A-Za-z0-9-]{16,128}$/.test(raw)) return null;
    return hashKey(raw);
  }

  private async scopedEventForFeed(eventId: string, feedId: string): Promise<any | null> {
    const feedIndex = await this.store.getJSON(this.keys.feedIndex(feedId));
    if (!feedIndex) return null;
    const acl = await this.store.getJSON(this.keys.acl(feedIndex.calId));
    if (acl?.feeds?.[feedId]?.scope?.eventId !== eventId) return null;
    return feedIndex;
  }

  /** Anonymous acceptance is intentionally Reader-only. The installation id
   * is hashed before storage and cannot be used to recover an account. */
  async rememberAnonymousReceivedInvite(body: any): Promise<ApiResult> {
    const eventId = String(body.eventId ?? '');
    const feedId = String(body.feedId ?? '');
    const anonymousId = this.anonymousRecipientHash(body.anonymousRecipientId);
    if (!eventId || !feedId || !anonymousId) {
      return result(400, { error: 'eventId, feedId and anonymousRecipientId are required' });
    }
    const feedIndex = await this.scopedEventForFeed(eventId, feedId);
    if (!feedIndex) return result(403, { error: 'feed is not scoped to this event' });

    const now = new Date().toISOString();
    let recipientLimitReached = false;
    let accessRevoked = false;
    const saved = await this.mutateEvent(feedIndex.calId, eventId, (event) => {
      if (!event) return null;
      if ((Array.isArray(event.revokedRecipients) ? event.revokedRecipients : [])
        .some((value: any) => value?.anonymousId === anonymousId)) {
        accessRevoked = true;
        return null;
      }
      const recipients = Array.isArray(event.recipients) ? [...event.recipients] : [];
      const index = recipients.findIndex((value: any) => value?.anonymousId === anonymousId);
      if (index < 0 && recipients.length >= 1000) {
        recipientLimitReached = true;
        return null;
      }
      const recipient = {
        anonymousId,
        access: 'reader',
        acceptedAt: index >= 0 ? recipients[index]?.acceptedAt ?? now : now,
        updatedAt: now,
      };
      if (index >= 0) recipients[index] = recipient;
      else recipients.push(recipient);
      return {
        ...event,
        recipients,
        recipientCount: recipients.length,
        recipientsUpdatedAt: now,
      };
    });
    if (!saved && accessRevoked) return result(403, { error: 'event access was removed by the owner' });
    if (!saved && recipientLimitReached) return result(429, { error: 'recipient limit reached' });
    if (!saved) return result(404, { error: 'shared event no longer exists' });
    return result(201, {
      remembered: true,
      recipientCount: saved.event.recipientCount,
      access: 'reader',
    });
  }

  async forgetAnonymousReceivedInvite(body: any): Promise<ApiResult> {
    const eventId = String(body.eventId ?? '');
    const feedId = String(body.feedId ?? '');
    const anonymousId = this.anonymousRecipientHash(body.anonymousRecipientId);
    if (!eventId || !feedId || !anonymousId) {
      return result(400, { error: 'eventId, feedId and anonymousRecipientId are required' });
    }
    const feedIndex = await this.scopedEventForFeed(eventId, feedId);
    if (!feedIndex) return result(403, { error: 'feed is not scoped to this event' });
    const now = new Date().toISOString();
    await this.mutateEvent(feedIndex.calId, eventId, (event) => {
      if (!event) return null;
      const recipients = (Array.isArray(event.recipients) ? event.recipients : [])
        .filter((value: any) => value?.anonymousId !== anonymousId);
      return {
        ...event,
        recipients,
        recipientCount: recipients.length,
        recipientsUpdatedAt: now,
      };
    });
    return result(200, { forgotten: true });
  }

  async anonymousReceivedInviteAccess(body: any): Promise<ApiResult> {
    const eventId = String(body.eventId ?? '');
    const feedId = String(body.feedId ?? '');
    const anonymousId = this.anonymousRecipientHash(body.anonymousRecipientId);
    if (!eventId || !feedId || !anonymousId) {
      return result(400, { error: 'eventId, feedId and anonymousRecipientId are required' });
    }
    const feedIndex = await this.scopedEventForFeed(eventId, feedId);
    if (!feedIndex) return result(403, { error: 'feed is not scoped to this event' });
    const event = await this.store.getJSON(this.keys.event(feedIndex.calId, eventId));
    if (!event) return result(404, { error: 'shared event no longer exists' });
    const recipient = (Array.isArray(event.recipients) ? event.recipients : [])
      .find((value: any) => value?.anonymousId === anonymousId);
    if (!recipient) return result(404, { error: 'anonymous event access was removed' });
    return result(200, { access: 'reader' });
  }

  async receivedInviteAccess(principal: any, eventId: string): Promise<ApiResult> {
    const ref = await this.store.getJSON(
      this.keys.receivedInvite(principal.principalId, eventId),
    );
    if (!ref?.ownerCalId) return result(404, { error: 'received event is not registered' });
    const event = await this.store.getJSON(this.keys.event(ref.ownerCalId, eventId));
    if (!event) return result(404, { error: 'shared event no longer exists' });
    const recipient = (Array.isArray(event.recipients) ? event.recipients : [])
      .find((value: any) => value?.userId === principal.principalId);
    if (!recipient) return result(404, { error: 'recipient is no longer registered' });
    return result(200, { access: this.recipientAccess(recipient) });
  }

  async forgetReceivedInvite(principal: any, eventId: string): Promise<ApiResult> {
    const refKey = this.keys.receivedInvite(principal.principalId, eventId);
    const ref = await this.store.getJSON(refKey);
    if (ref?.ownerCalId) {
      const now = new Date().toISOString();
      await this.mutateEvent(ref.ownerCalId, eventId, (event) => {
        if (!event) return null;
        const recipients = (Array.isArray(event.recipients) ? event.recipients : [])
          .filter((value: any) => value?.userId !== principal.principalId);
        return {
          ...event,
          recipients,
          recipientCount: recipients.length,
          recipientsUpdatedAt: now,
        };
      });
    }
    await this.store.del(refKey);
    return result(200, { forgotten: true });
  }

  async cancelEvent(principal: any, eventId: string, query: any): Promise<ApiResult> {
    // Cancellation is an event-management operation, not a normal calendar
    // write. Besides the first sharer, a signed-in recipient explicitly given
    // Owner access must therefore be able to cancel the canonical object too.
    // Resolve through the private received-invite reference so an event id on
    // its own never grants this permission.
    const context = await this.eventManagementContext(principal, eventId);
    if (!context) {
      return result(403, { error: 'Owner access is required to cancel this event' });
    }
    const calId = context.calId;

    const saved = await this.mutateEvent(calId, eventId, (existing) => existing ? {
      ...existing,
      // Older clients temporarily wrote the presentation-only cancellation
      // prefix back into the canonical title. Keep cancellation as metadata;
      // the clients render the label/strikethrough themselves.
      title: typeof existing.title === 'string'
        ? existing.title.replace(/^Cancelled:\s+/i, '')
        : existing.title,
      status: 'cancelled',
      sequence: (existing.sequence ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    } : null);
    if (!saved) return result(404, { error: 'no such event' });
    const pendingIndexDeletes: Promise<any>[] = [];
    for (const recipient of Array.isArray(saved.event.recipients) ? saved.event.recipients : []) {
      const email = this.pendingInvitationEmail(recipient);
      if (email) {
        pendingIndexDeletes.push(this.store.del(this.keys.pendingEventInvitation(
          this.core.emailHash(email),
          calId,
          eventId,
        )));
      }
    }
    await Promise.all(pendingIndexDeletes);
    await this.core.regenerate(calId, eventId);
    return result(200, { event: saved.event });
  }

  async createGrant(principal: any, body: any): Promise<ApiResult> {
    const calId = body.calendarId ?? principal.calId;
    const acl = await this.store.getJSON(this.keys.acl(calId));
    if (!acl) return result(404, { error: 'no such calendar' });
    if (this.core.roleOf(acl, principal.principalId) !== 'owner') return result(403, { error: 'only the owner may grant access' });

    const role = body.role;
    if (!this.core.ROLES.includes(role)) return result(400, { error: `role must be one of ${this.core.ROLES.join(', ')}` });

    const scopedEventId = body.eventId ?? null;

    // Sharing the same event twice must reach the same feed.
    if (scopedEventId) {
      const existing = await this.store.getJSON(this.keys.eventFeed(calId, scopedEventId));
      if (existing?.feedId && acl.feeds?.[existing.feedId]) {
        return result(200, {
          feedId: existing.feedId,
          role: acl.feeds[existing.feedId].role,
          feedUrl: this.core.feedUrl(existing.feedId),
          webcal: `webcal://${this.core.FEED_HOST}/f/${existing.feedId}.ics`,
          created: false,
        });
      }
    }

    const feedId = randomId(22);
    acl.feeds[feedId] = {
      role,
      principalId: body.principalId ?? null,
      label: body.label ?? null,
      feedName: body.feedName ?? null,
      scope: scopedEventId ? { eventId: scopedEventId } : null,
      createdAt: new Date().toISOString(),
    };

    const writes: Promise<any>[] = [
      this.store.putJSON(this.keys.acl(calId), acl),
      this.store.putJSON(this.keys.feedIndex(feedId), { calId, role, principalId: body.principalId ?? null }),
    ];
    if (scopedEventId) writes.push(this.store.putJSON(this.keys.eventFeed(calId, scopedEventId), { feedId }));
    await Promise.all(writes);

    await this.core.regenerate(calId, scopedEventId);

    return result(201, {
      feedId, role,
      feedUrl: this.core.feedUrl(feedId),
      webcal: `webcal://${this.core.FEED_HOST}/f/${feedId}.ics`,
      created: true,
    });
  }

  async revokeGrant(principal: any, feedId: string): Promise<ApiResult> {
    const index = await this.store.getJSON(this.keys.feedIndex(feedId));
    if (!index) return result(404, { error: 'no such feed' });

    const acl = await this.store.getJSON(this.keys.acl(index.calId));
    if (this.core.roleOf(acl, principal.principalId) !== 'owner') return result(403, { error: 'only the owner may revoke' });
    if (acl.owner === acl.feeds?.[feedId]?.principalId) return result(400, { error: 'cannot revoke the owner feed' });

    delete acl.feeds[feedId];
    await Promise.all([
      this.store.putJSON(this.keys.acl(index.calId), acl),
      this.store.del(this.keys.feed(feedId)),
      this.store.del(this.keys.feedIndex(feedId)),
    ]);
    return result(200, { revoked: feedId });
  }
}

function tokenFrom(header: string): string {
  const h = header ?? '';
  return h.startsWith('Bearer ') ? h.slice(7).trim() : '';
}

/** Canonical form used both in account records and the private lookup index. */
function normalizeEmail(value: unknown): string | null {
  const email = String(value ?? '').trim().toLowerCase();
  if (!email || email.length > 320) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function validICloudCalendarShareId(value: unknown): boolean {
  return /^[0-9a-f]{64}$/i.test(String(value ?? ''));
}

function boundedPlainText(value: unknown, maximumLength: number): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > maximumLength) return null;
  if (/[\u0000-\u001f\u007f]/.test(normalized)) return null;
  return normalized;
}

function optionalMultilinePlainText(value: unknown, maximumLength: number): string | null {
  if (value == null || value === '') return null;
  if (typeof value !== 'string') return null;
  // EventKit represents a selected place as a display title followed by its
  // postal address on a second line. Preserve that meaningful newline while
  // still rejecting every other control character.
  const normalized = value.replace(/\r\n?/g, '\n').trim();
  if (!normalized || normalized.length > maximumLength) return null;
  if (/[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f]/.test(normalized)) return null;
  return normalized;
}

function validISODate(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 64 || Number.isNaN(Date.parse(value))) {
    return null;
  }
  return new Date(value).toISOString();
}

/** `null` is a valid empty URL; `undefined` means validation failed. */
function optionalEventURL(value: unknown): string | null | undefined {
  if (value == null || value === '') return null;
  if (typeof value !== 'string'
      || value.length > 1024
      || /[\u0000-\u001f\u007f]/.test(value)) {
    return undefined;
  }
  const scheme = value.match(/^([A-Za-z][A-Za-z0-9+.-]*):/)?.[1]?.toLowerCase();
  if (scheme && ['cloudcalendars', 'gcal', 'mscal'].includes(scheme)) {
    return undefined;
  }
  return value;
}

function boundedQueryValue(value: unknown, maximumLength: number): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (typeof candidate !== 'string') return null;
  const normalized = candidate.trim();
  if (!normalized || normalized.length > maximumLength) return null;
  if (/[\u0000-\u001f\u007f]/.test(normalized)) return null;
  return normalized;
}

function safeTimeZone(value: string | null): string | null {
  if (!value) return null;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format(new Date());
    return value;
  } catch {
    return null;
  }
}

function formatInvitationDateParts(
  start: Date,
  end: Date,
  timeZone: string,
  isAllDay: boolean,
): { date: string; time: string | null } {
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeZone,
  });
  try {
    if (isAllDay) {
      return { date: dateFormatter.formatRange(start, end), time: null };
    }
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone,
    });
    return {
      date: dateFormatter.format(start),
      time: timeFormatter.formatRange(start, end),
    };
  } catch {
    return {
      date: dateFormatter.format(start),
      time: isAllDay ? null : `${start.toISOString()} – ${end.toISOString()}`,
    };
  }
}

function escapeHTML(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const CLOUD_CALENDARS_APP_STORE_URL = 'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319';

export function eventInvitationDocument(
  content: string,
  title: string,
  screenTitle = 'Shared event',
): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; base-uri 'none'; form-action 'none'" />
  <title>${escapeHTML(title)} · Cloud Calendars</title>
  <style>
    :root { color-scheme:light dark; --ink:#1c1c1e; --secondary:#636366; --page:#f2f2f7; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
    @media (prefers-color-scheme:dark) { :root { --ink:#fff; --secondary:#aeaeb2; --page:#000; } }
    * { box-sizing:border-box; }
    body { margin:0; min-height:100vh; min-height:100svh; background:var(--page); color:var(--ink); }
    main { width:min(100%,560px); margin:0 auto; padding:28px 22px max(28px,env(safe-area-inset-bottom)); }
    .clip-header { display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px; margin-bottom:22px; }
    .clip-icon { display:block; width:86px; height:86px; border-radius:20px; object-fit:cover; }
    .brand-name { color:var(--secondary); font-size:17px; font-weight:650; }
    .screen-title { margin:0; color:var(--ink); font-size:clamp(30px,8vw,38px); line-height:1.08; font-weight:800; overflow-wrap:anywhere; }
    .clip-content { width:100%; }
    .sender-line { margin:-4px 4px 20px; color:var(--secondary); font-size:14px; line-height:19px; text-align:center; overflow-wrap:anywhere; }
    .sender-line strong { color:var(--ink); font-weight:700; }
    .invitation-label { display:flex; align-items:center; gap:4px; margin:0 4px 10px; color:var(--secondary); font-size:14px; font-weight:600; line-height:18px; }
    .symbol { display:inline-flex; width:18px; flex:0 0 18px; align-items:center; justify-content:center; font-size:17px; line-height:1; }
    ${EVENT_CARD_CSS}
    .calendar-preview { min-height:52px; flex-direction:row; align-items:center; gap:10px; padding-top:10px; padding-bottom:10px; border-radius:9px; }
    .preview-symbol { margin-left:1px; }
    .actions { display:grid; gap:12px; margin-top:22px; }
    a { display:block; padding:14px 18px; border-radius:999px; text-align:center; text-decoration:none; font-size:17px; line-height:22px; font-weight:700; }
    .primary { background:#007aff; color:#fff; }
    .secondary { border:1px solid var(--secondary); color:var(--ink); }
    .privacy-note { display:flex; align-items:flex-start; gap:9px; margin-top:18px; color:var(--secondary); font-size:13px; line-height:18px; }
    .cancelled { align-self:flex-start; margin:0 0 10px; padding:6px 10px; border-radius:999px; background:#ff453a; color:#fff; font-size:13px; font-weight:750; }
    .message-card { padding:24px; border:1px solid rgba(255,255,255,.16); border-radius:24px; background:rgba(255,255,255,.10); }
    .message-card h2 { margin:0 0 10px; font-size:25px; line-height:1.12; }
    .message-card p { margin:0; color:var(--secondary); line-height:1.5; }
    @media (max-width:380px) { main { padding-inline:18px; } .clip-icon { width:78px; height:78px; } }
  </style>
</head>
<body>
  <main>
    <header class="clip-header">
      <img class="clip-icon" src="https://www.cloud-calendars.com/icons/icon-192.png" width="86" height="86" alt="" />
      <div class="brand-name">Cloud Calendars</div>
      <h1 class="screen-title">${escapeHTML(screenTitle)}</h1>
    </header>
    ${content}
  </main>
</body>
</html>`;
}

function eventInvitationErrorPage(message: string): string {
  return eventInvitationDocument(`
    <section class="message-card">
      <h2>${escapeHTML(message)}</h2>
      <p>Ask the sender for a new event link.</p>
    </section>`, message);
}

export function eventInvitationPage(input: {
  title: string;
  date: string;
  time: string | null;
  location: string | null;
  color: string;
  fullAppURL: string;
  sender: string;
  cancelled: boolean;
}): string {
  const location = input.location
    ? `<div class="preview-row">${eventIcon('location')}<span>${escapeHTML(input.location)}</span></div>`
    : '';
  const cancelled = input.cancelled ? '<div class="cancelled">Cancelled</div>' : '';
  return eventInvitationDocument(`
    <section class="clip-content" data-view="app-clip-preview" style="--event-color:${eventPalette(input.color).color}">
      ${cancelled}
      <div class="sender-line">From <strong>${escapeHTML(input.sender)}</strong></div>
      <div class="invitation-label">${eventIcon('calendar')}<span>${escapeHTML(input.date)}</span></div>
      <div class="preview-card${input.cancelled ? ' event-cancelled' : ''}">
        <strong class="event-title">${escapeHTML(input.title)}</strong>
        ${input.time ? `<div class="preview-row">${eventIcon('clock')}<span>${escapeHTML(input.time)}</span></div>` : ''}
        ${location}
      </div>
      <div class="actions">
        <a class="primary" href="${escapeHTML(input.fullAppURL)}">Open in Cloud Calendars</a>
        <a class="secondary" href="${escapeHTML(CLOUD_CALENDARS_APP_STORE_URL)}">Download Cloud Calendars</a>
      </div>
      <div class="privacy-note"><span aria-hidden="true">♢</span><span>This page previews the event. Open Cloud Calendars to add and synchronize it.</span></div>
    </section>`, input.title);
}

/** Missing extension fields mean "unknown to this client", not "delete".
 * Modern clients use explicit null/[] to clear them. Omitted whole details in
 * a legacy calendar snapshot also must not erase the canonical representation. */
function mergeEventDetailsForWrite(value: any, previous: any): any {
  if (value === undefined) return previous ?? null;
  const sanitized = sanitizeEventDetails(value);
  if (!sanitized || !previous) return sanitized;
  for (const field of ['travelTime', 'attachments', 'videoCallURL']) {
    if (!Object.prototype.hasOwnProperty.call(value, field)
        && Object.prototype.hasOwnProperty.call(previous, field)) {
      sanitized[field] = previous[field];
    }
  }
  return sanitized;
}

/** Bounded, JSON-only copy of the portable EventKit fields. Feed URLs are
 * capabilities, so even authenticated owner input must not be allowed to grow
 * an S3 object without limit or inject arbitrary structures into recipients. */
function sanitizeEventDetails(value: any): any {
  if (!value) return null;

  const text = (input: unknown, max: number): string | null => {
    if (typeof input !== 'string') return null;
    return input.slice(0, max);
  };
  const integer = (input: unknown, fallback = 0): number =>
    Number.isSafeInteger(input) ? Number(input) : fallback;
  const integerList = (input: unknown, max = 64): number[] | null =>
    Array.isArray(input)
      ? input.filter(Number.isSafeInteger).slice(0, max).map(Number)
      : null;
  const participant = (input: any): any | null => {
    if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
    return {
      name: text(input.name, 512),
      email: normalizeEmail(input.email),
      role: integer(input.role),
      type: integer(input.type),
      status: integer(input.status),
      isCurrentUser: Boolean(input.isCurrentUser),
    };
  };

  const structured = value.structuredLocation;
  const latitude = typeof structured?.latitude === 'number' ? structured.latitude : Number.NaN;
  const longitude = typeof structured?.longitude === 'number' ? structured.longitude : Number.NaN;
  const radius = typeof structured?.radius === 'number' ? structured.radius : Number.NaN;
  const structuredLocation = structured && typeof structured === 'object' && !Array.isArray(structured)
    ? {
      title: text(structured.title, 1024) ?? '',
      latitude: Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 ? latitude : null,
      longitude: Number.isFinite(longitude) && longitude >= -180 && longitude <= 180 ? longitude : null,
      radius: Number.isFinite(radius) && radius >= 0 ? Math.min(radius, 10000000) : 0,
    }
    : null;

  const alarms = Array.isArray(value.alarms) ? value.alarms.slice(0, 32).map((alarm: any) => {
    const relative = typeof alarm?.relativeOffset === 'number'
      ? alarm.relativeOffset
      : Number.NaN;
    const absolute = text(alarm?.absoluteDate, 64);
    return {
      relativeOffset: Number.isFinite(relative) ? relative : null,
      absoluteDate: absolute && !Number.isNaN(Date.parse(absolute)) ? absolute : null,
    };
  }).filter((alarm: any) => alarm.relativeOffset != null || alarm.absoluteDate != null) : [];

  const recurrenceRules = Array.isArray(value.recurrenceRules)
    ? value.recurrenceRules.slice(0, 8).map((rule: any) => ({
      frequency: Math.max(0, Math.min(3, integer(rule?.frequency))),
      interval: Math.max(1, Math.min(1000, integer(rule?.interval, 1))),
      daysOfTheWeek: Array.isArray(rule?.daysOfTheWeek)
        ? rule.daysOfTheWeek.slice(0, 32).map((day: any) => ({
          weekday: Math.max(1, Math.min(7, integer(day?.weekday, 1))),
          weekNumber: Math.max(-53, Math.min(53, integer(day?.weekNumber))),
        }))
        : null,
      daysOfTheMonth: integerList(rule?.daysOfTheMonth),
      monthsOfTheYear: integerList(rule?.monthsOfTheYear),
      weeksOfTheYear: integerList(rule?.weeksOfTheYear),
      daysOfTheYear: integerList(rule?.daysOfTheYear),
      setPositions: integerList(rule?.setPositions),
      endDate: typeof rule?.endDate === 'string' && !Number.isNaN(Date.parse(rule.endDate))
        ? rule.endDate.slice(0, 64)
        : null,
      occurrenceCount: Number.isSafeInteger(rule?.occurrenceCount) && rule.occurrenceCount > 0
        ? Math.min(rule.occurrenceCount, 100000)
        : null,
    }))
    : [];

  const travelTimeValue = typeof value.travelTime === 'number'
    ? value.travelTime
    : Number.NaN;
  const travelTime = Number.isFinite(travelTimeValue)
    ? Math.max(0, Math.min(86400, travelTimeValue))
    : null;
  let attachmentBytes = 0;
  const attachments = Array.isArray(value.attachments)
    ? value.attachments.slice(0, 5).map((attachment: any) => {
      const dataBase64 = text(attachment?.dataBase64, 1_400_000);
      if (!dataBase64 || !/^[A-Za-z0-9+/]*={0,2}$/.test(dataBase64)) return null;
      const approximateBytes = Math.floor(dataBase64.length * 0.75);
      if (approximateBytes > 1_000_000 || attachmentBytes + approximateBytes > 4_000_000) {
        return null;
      }
      attachmentBytes += approximateBytes;
      return {
        id: text(attachment?.id, 128) ?? '',
        fileName: text(attachment?.fileName, 512) ?? 'Attachment',
        contentType: text(attachment?.contentType, 256),
        dataBase64,
      };
    }).filter(Boolean)
    : [];

  return {
    notes: text(value.notes, 20000),
    timeZone: text(value.timeZone, 128),
    availability: Math.max(-1, Math.min(3, integer(value.availability))),
    alarms,
    recurrenceRules,
    structuredLocation,
    videoCallURL: optionalEventURL(value.videoCallURL) ?? null,
    travelTime,
    attachments,
    organizer: participant(value.organizer),
    attendees: Array.isArray(value.attendees)
      ? value.attendees.slice(0, 250).map(participant).filter(Boolean)
      : [],
  };
}
