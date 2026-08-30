import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { buildFeed } from '../util/ics';
import { randomId, hashKey } from '../util/ids';

/**
 * Shared calendar mechanics used across features: rebuilding feeds, creating a
 * calendar, minting device tokens, resolving roles and bearer tokens. Ported
 * from the helpers that lived at the top of the original index.mjs.
 */
@Injectable()
export class CoreService {
  readonly FEED_HOST = process.env.FEED_HOST ?? 'cal.cloud-calendars.com';

  // A cancelled event stays in the feed so subscribers that refresh actually see
  // it disappear; dropping it immediately leaves a stale entry on every device
  // that already fetched it. After a month nobody is still catching up.
  readonly CANCELLED_TTL_DAYS = 30;

  readonly ROLES = ['owner', 'editor', 'contributor', 'viewer', 'busy'];
  readonly CAN_WRITE = new Set(['owner', 'editor', 'contributor']);

  readonly SITE_URL = process.env.SITE_URL ?? 'https://www.cloud-calendars.com';

  constructor(private readonly store: StoreService) {}

  async isEntitled(principalId: string): Promise<boolean> {
    const rec = await this.store.getJSON(this.store.keys.principal(principalId));
    const kind = rec?.entitlement?.kind;
    return kind === 'app' || kind === 'web-paid' || kind === 'comp';
  }

  async grantEntitlement(principalId: string, kind: string, source: string): Promise<any> {
    const rec = (await this.store.getJSON(this.store.keys.principal(principalId))) ?? { id: principalId };
    rec.entitlement = { kind, source, since: new Date().toISOString() };
    await this.store.putJSON(this.store.keys.principal(principalId), rec);
    return rec.entitlement;
  }

  feedUrl(feedId: string): string {
    return `https://${this.FEED_HOST}/f/${feedId}.ics`;
  }

  /** The index key for an invitee: their e-mail, normalised then hashed so the
   *  address itself is never a bucket key. */
  emailHash(email: unknown): string {
    return hashKey(String(email ?? '').trim().toLowerCase());
  }

  /** Resolves a raw bearer token to a principal record, or null. */
  async resolveToken(token: string): Promise<any> {
    if (!token) return null;
    return this.store.getJSON(this.store.keys.token(hashKey(token)));
  }

  roleOf(acl: any, principalId: string | null): string | null {
    if (!principalId) return null;
    if (acl.owner === principalId) return 'owner';
    for (const grant of Object.values(acl.feeds ?? {}) as any[]) {
      if (grant.principalId === principalId) return grant.role;
    }
    return null;
  }

  /**
   * Rewrites the .ics files this calendar serves.
   *
   * Passing `changedEventId` narrows the work to the feeds that event can appear
   * in. Without it a single edit would rewrite every per-event feed on the
   * calendar, which grows with each invite ever sent.
   */
  async regenerate(calId: string, changedEventId: string | null = null): Promise<void> {
    const store = this.store;
    const [meta, acl] = await Promise.all([store.getJSON(store.keys.meta(calId)), store.getJSON(store.keys.acl(calId))]);
    if (!meta || !acl) return;

    const eventKeys = await store.listKeys(store.keys.events(calId));
    const loaded = await Promise.all(eventKeys.map((k) => store.getJSON(k)));

    const cutoff = Date.now() - this.CANCELLED_TTL_DAYS * 86400_000;
    const events: any[] = [];
    for (const ev of loaded) {
      if (!ev) continue;
      if (ev.status === 'cancelled' && (ev.updatedAt ?? 0) < cutoff) {
        await store.del(store.keys.event(calId, ev.id));
        continue;
      }
      events.push(ev);
    }
    events.sort((a, b) => (new Date(a.start) as any) - (new Date(b.start) as any));

    const affected = Object.entries(acl.feeds ?? {}).filter(([, grant]: any) => {
      if (!changedEventId) return true;                        // full rebuild
      if (!grant.scope?.eventId) return true;                  // whole-calendar feeds always
      return grant.scope.eventId === changedEventId;
    });

    await Promise.all(
      affected.map(([feedId, grant]: any) =>
        store.putFeed(
          store.keys.feed(feedId),
          buildFeed({
            name: grant.feedName ?? meta.name,
            timeZone: meta.timeZone,
            role: grant.role,
            busyLabel: meta.busyLabel ?? 'Busy',
            events: grant.scope?.eventId
              ? events.filter((ev) => ev.id === grant.scope.eventId)
              : events,
          }),
        ),
      ),
    );
  }

  /**
   * Anonymous registration. No sign-in: the device gets a bearer token and owns
   * the calendar.
   */
  async createCalendar(principalId: string, body: any): Promise<{ calId: string; ownerFeedId: string }> {
    const store = this.store;
    const calId = randomId(16);
    const ownerFeedId = randomId(22);
    const now = new Date().toISOString();

    const meta = {
      id: calId,
      name: body.name || 'Cloud Calendars',
      timeZone: body.timeZone || 'UTC',
      busyLabel: body.busyLabel || 'Busy',
      ownerId: principalId,
      createdAt: now,
      lastWriteAt: now,
    };

    const acl = {
      owner: principalId,
      feeds: { [ownerFeedId]: { role: 'owner', principalId, label: 'owner', createdAt: now } },
    };

    await Promise.all([
      store.putJSON(store.keys.meta(calId), meta),
      store.putJSON(store.keys.acl(calId), acl),
      store.putJSON(store.keys.principal(principalId), { id: principalId, calId, createdAt: now }),
      store.putJSON(store.keys.feedIndex(ownerFeedId), { calId, role: 'owner', principalId }),
    ]);
    await this.regenerate(calId);

    return { calId, ownerFeedId };
  }

  /** Issues a device token for an existing principal. Each device gets its own,
   *  so one can later be revoked without signing the others out. */
  async issueToken(principalId: string, calId: string): Promise<string> {
    const deviceToken = randomId(32);
    await this.store.putJSON(this.store.keys.token(hashKey(deviceToken)), { principalId, calId });
    return deviceToken;
  }
}
