import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CoreService } from '../core/core.service';
import { ApiResult, result } from '../common/api-result';
import { randomId, hashKey } from '../util/ids';
import { verifyAppleIdToken, verifyGoogleIdToken, verifyMicrosoftToken } from '../util/verify';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? null;
const APPLE_CLIENT_IDS = (process.env.APPLE_CLIENT_IDS ?? 'Deksan.CalendarASD')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

@Injectable()
export class CalendarService {
  constructor(private readonly store: StoreService, private readonly core: CoreService) {}

  private get keys() { return this.store.keys; }

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

    const principalId = caller?.principalId ?? randomId(16);
    const emailIndexKey = this.keys.accountEmail(this.core.emailHash(claimedEmail));
    const emailOwner = await this.store.getJSON(emailIndexKey);
    if (emailOwner && emailOwner.principalId !== principalId) {
      return result(409, { error: 'this email is already linked to another Cloud Calendars account' });
    }

    let calId = caller?.calId;
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

    return result(201, {
      calendarId: calId, deviceToken,
      feedId: ownerFeedId, feedUrl: this.core.feedUrl(ownerFeedId),
      email: claimedEmail, provider: identity.provider,
      ownerId: principalId,
      identities: this.publicIdentities(principal),
      created: !caller,
    });
  }

  async upsertEvent(principal: any, eventId: string, body: any): Promise<ApiResult> {
    const calId = body.calendarId ?? principal.calId;
    const acl = await this.store.getJSON(this.keys.acl(calId));
    if (!acl) return result(404, { error: 'no such calendar' });

    const role = this.core.roleOf(acl, principal.principalId);
    if (!this.core.CAN_WRITE.has(role)) return result(403, { error: 'not allowed to write' });

    const existing = await this.store.getJSON(this.keys.event(calId, eventId));
    if (existing && role === 'contributor' && existing.createdBy !== principal.principalId) {
      return result(403, { error: 'contributors may only edit their own events' });
    }

    if (!body.start || !body.end) return result(400, { error: 'start and end are required' });

    const identities = await this.identitiesFor(principal);
    const primaryIdentity = this.primaryIdentity(principal, identities);
    const event = {
      id: eventId,
      // SEQUENCE must increase on every change or calendar clients treat the
      // update as a duplicate and keep showing the old time.
      sequence: existing ? (existing.sequence ?? 0) + 1 : 0,
      title: body.title ?? existing?.title ?? '',
      start: body.start,
      end: body.end,
      allDay: body.allDay ?? false,
      location: body.location ?? null,
      description: body.description ?? null,
      organizerName: body.organizerName ?? existing?.organizerName ?? null,
      organizerEmail: body.organizerEmail ?? existing?.organizerEmail ?? null,
      status: 'confirmed',
      ownerId: existing?.ownerId ?? principal.principalId,
      ownerIdentityId: existing?.ownerIdentityId ?? primaryIdentity?.id ?? null,
      ownerIdentityProvider: existing?.ownerIdentityProvider ?? primaryIdentity?.provider ?? null,
      ownerIdentityIds: {
        ...(existing?.ownerIdentityIds ?? {}),
        ...Object.fromEntries(
          Object.entries(identities).map(([provider, value]: [string, any]) => [provider, value.id]),
        ),
      },
      createdBy: existing?.createdBy ?? principal.principalId,
      updatedAt: new Date().toISOString(),
    };

    await this.store.putJSON(this.keys.event(calId, eventId), event);
    await this.core.regenerate(calId, eventId);
    return result(existing ? 200 : 201, { event });
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
      outgoing.push({ ...event, feedId: feed.feedId });
    }

    const receivedKeys = await this.store.listKeys(this.keys.receivedInvites(principal.principalId));
    const refs = await Promise.all(receivedKeys.map((key) => this.store.getJSON(key)));
    const received: any[] = [];
    for (const ref of refs.filter(Boolean)) {
      const event = await this.store.getJSON(this.keys.event(ref.ownerCalId, ref.eventId));
      if (event) received.push({ ...event, feedId: ref.feedId });
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

    await this.store.putJSON(this.keys.receivedInvite(principal.principalId, eventId), {
      eventId, feedId, ownerCalId: feedIndex.calId, recordedAt: new Date().toISOString(),
    });
    return result(201, { remembered: true });
  }

  async forgetReceivedInvite(principal: any, eventId: string): Promise<ApiResult> {
    await this.store.del(this.keys.receivedInvite(principal.principalId, eventId));
    return result(200, { forgotten: true });
  }

  async cancelEvent(principal: any, eventId: string, query: any): Promise<ApiResult> {
    const calId = query.calendarId ?? principal.calId;
    const acl = await this.store.getJSON(this.keys.acl(calId));
    if (!acl) return result(404, { error: 'no such calendar' });
    if (!this.core.CAN_WRITE.has(this.core.roleOf(acl, principal.principalId))) return result(403, { error: 'not allowed' });

    const existing = await this.store.getJSON(this.keys.event(calId, eventId));
    if (!existing) return result(404, { error: 'no such event' });

    existing.status = 'cancelled';
    existing.sequence = (existing.sequence ?? 0) + 1;
    existing.updatedAt = new Date().toISOString();

    await this.store.putJSON(this.keys.event(calId, eventId), existing);
    await this.core.regenerate(calId, eventId);
    return result(200, { event: existing });
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
