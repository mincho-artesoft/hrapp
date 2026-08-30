import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CoreService } from '../core/core.service';
import { ApiResult, result } from '../common/api-result';
import { randomId, hashKey } from '../util/ids';
import { verifyGoogleIdToken, verifyMicrosoftToken } from '../util/verify';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? null;

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
   * Resolves a Google or Microsoft identity to its calendar, creating one on
   * first sight. `authHeader` lets an already-signed-in caller add a second
   * account to the calendar they own rather than starting a new one.
   */
  async resolve(authHeader: string, body: any): Promise<ApiResult> {
    let identity: any;
    try {
      if (body.provider === 'google') {
        identity = await verifyGoogleIdToken(body.token, GOOGLE_CLIENT_ID);
      } else if (body.provider === 'microsoft') {
        identity = await verifyMicrosoftToken(body.token);
      } else {
        return result(400, { error: "provider must be 'google' or 'microsoft'" });
      }
    } catch (err: any) {
      return result(401, { error: `identity not verified: ${err.message}` });
    }

    const indexKey = this.keys.identity(identity.provider, hashKey(identity.subject));
    const existing = await this.store.getJSON(indexKey);

    if (existing) {
      const deviceToken = await this.core.issueToken(existing.principalId, existing.calId);
      const acl = await this.store.getJSON(this.keys.acl(existing.calId));
      const ownerFeedId = Object.keys(acl?.feeds ?? {}).find((f) => acl.feeds[f].role === 'owner');
      return result(200, {
        calendarId: existing.calId, deviceToken,
        feedId: ownerFeedId, feedUrl: this.core.feedUrl(ownerFeedId),
        email: identity.email, created: false,
      });
    }

    const caller = await this.core.resolveToken(tokenFrom(authHeader));
    const principalId = caller?.principalId ?? randomId(16);

    let calId = caller?.calId;
    let ownerFeedId: string;
    if (!calId) {
      ({ calId, ownerFeedId } = await this.core.createCalendar(principalId, body));
    } else {
      const acl = await this.store.getJSON(this.keys.acl(calId));
      ownerFeedId = Object.keys(acl?.feeds ?? {}).find((f) => acl.feeds[f].role === 'owner');
    }

    await this.store.putJSON(indexKey, { principalId, calId, provider: identity.provider, email: identity.email });
    const deviceToken = await this.core.issueToken(principalId, calId);

    return result(201, {
      calendarId: calId, deviceToken,
      feedId: ownerFeedId, feedUrl: this.core.feedUrl(ownerFeedId),
      email: identity.email, created: !caller,
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
      createdBy: existing?.createdBy ?? principal.principalId,
      updatedAt: new Date().toISOString(),
    };

    await this.store.putJSON(this.keys.event(calId, eventId), event);
    await this.core.regenerate(calId, eventId);
    return result(existing ? 200 : 201, { event });
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
