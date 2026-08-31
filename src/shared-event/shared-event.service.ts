import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CoreService } from '../core/core.service';
import { EmailService } from '../email/email.service';
import { ApiResult, result } from '../common/api-result';
import { randomId } from '../util/ids';

/**
 * Shareable fixed-date events: an owner publishes one event at a set time, shares
 * a link, and many people register with just their e-mail. Each registrant gets
 * a feed scoped to that one event (never the whole calendar) plus a confirmation
 * e-mail, and is notified when the organizer moves or cancels it. Built on the
 * same event-scoped-feed and e-mail machinery the booking flow already uses.
 */
@Injectable()
export class SharedEventService {
  constructor(
    private readonly store: StoreService,
    private readonly core: CoreService,
    private readonly email: EmailService,
  ) {}

  private get keys() { return this.store.keys; }
  private get FEED_HOST() { return this.core.FEED_HOST; }
  private get SITE_URL() { return this.core.SITE_URL; }

  private publicUrl(handle: string): string {
    return `${this.SITE_URL}/event/?e=${handle}`;
  }

  /** The owner's public name and zone, from their booking config or calendar meta. */
  private async ownerDisplay(calId: string): Promise<{ displayName: string; timeZone: string; contactEmail: string | null }> {
    const [config, meta] = await Promise.all([
      this.store.getJSON(this.keys.booking(calId)),
      this.store.getJSON(this.keys.meta(calId)),
    ]);
    return {
      displayName: config?.displayName || meta?.name || 'Cloud Calendars',
      timeZone: config?.timeZone || meta?.timeZone || 'UTC',
      contactEmail: config?.contactEmail ?? null,
    };
  }

  private async resolveHandle(handle: string): Promise<{ calId: string; eventId: string; event: any } | null> {
    const idx = await this.store.getJSON(this.keys.eventPub(handle));
    if (!idx) return null;
    const event = await this.store.getJSON(this.keys.event(idx.calId, idx.eventId));
    if (!event || event.createdBy !== 'shared') return null;
    return { calId: idx.calId, eventId: idx.eventId, event };
  }

  private async registrantsOf(calId: string, eventId: string): Promise<any[]> {
    const keys = await this.store.listKeys(this.keys.eventRegs(calId, eventId));
    const loaded = await Promise.all(keys.map((k) => this.store.getJSON(k)));
    return loaded.filter(Boolean);
  }

  // ── owner: create, list, manage ──────────────────────────────────────────

  async createSharedEvent(principal: any, body: any): Promise<ApiResult> {
    const calId = principal.calId;
    const acl = await this.store.getJSON(this.keys.acl(calId));
    if (!acl) return result(404, { error: 'no such calendar' });
    if (this.core.roleOf(acl, principal.principalId) !== 'owner') {
      return result(403, { error: 'only the owner may create an event' });
    }
    if (!body.title || !body.title.trim()) return result(400, { error: 'a title is required' });
    const start = new Date(body.start);
    const end = new Date(body.end);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return result(400, { error: 'a valid start and end are required' });
    }
    const capacity = Number.isFinite(body.capacity) && body.capacity > 0 ? Math.floor(body.capacity) : null;

    const display = await this.ownerDisplay(calId);

    // Allocate an unguessable public handle.
    let handle: string | undefined;
    for (let attempt = 0; attempt < 5 && !handle; attempt++) {
      const candidate = randomId(10);
      const eventId = `sh${randomId(14)}`;
      if (await this.store.putJSONIfAbsent(this.keys.eventPub(candidate), { calId, eventId })) {
        handle = candidate;
        return await this.writeNewEvent(calId, eventId, handle, body, start, end, capacity, display);
      }
    }
    return result(500, { error: 'could not allocate a handle' });
  }

  private async writeNewEvent(
    calId: string, eventId: string, handle: string, body: any,
    start: Date, end: Date, capacity: number | null, display: any,
  ): Promise<ApiResult> {
    const event = {
      id: eventId,
      sequence: 0,
      title: String(body.title).trim(),
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: false,
      location: body.location?.trim() || null,
      description: body.description?.trim() || null,
      organizerName: display.displayName,
      organizerEmail: display.contactEmail,
      status: 'confirmed',
      createdBy: 'shared',
      registration: { handle, capacity },
      updatedAt: new Date().toISOString(),
    };
    await this.store.putJSON(this.keys.event(calId, eventId), event);
    await this.core.regenerate(calId, eventId);
    return result(201, {
      eventId, handle, publicUrl: this.publicUrl(handle),
      event: this.ownerEventView(event, 0),
    });
  }

  private ownerEventView(event: any, registrants: number) {
    return {
      id: event.id,
      handle: event.registration?.handle ?? null,
      title: event.title,
      start: event.start,
      end: event.end,
      location: event.location ?? null,
      description: event.description ?? null,
      capacity: event.registration?.capacity ?? null,
      status: event.status ?? 'confirmed',
      registrants,
      publicUrl: event.registration?.handle ? this.publicUrl(event.registration.handle) : null,
    };
  }

  async listSharedEvents(principal: any): Promise<ApiResult> {
    const calId = principal.calId;
    const eventKeys = await this.store.listKeys(this.keys.events(calId));
    const loaded = await Promise.all(eventKeys.map((k) => this.store.getJSON(k)));
    const events = [];
    for (const ev of loaded) {
      if (!ev || ev.createdBy !== 'shared') continue;
      const regs = await this.registrantsOf(calId, ev.id);
      events.push(this.ownerEventView(ev, regs.length));
    }
    events.sort((a, b) => (new Date(a.start) as any) - (new Date(b.start) as any));
    return result(200, { events });
  }

  async listRegistrants(principal: any, eventId: string): Promise<ApiResult> {
    const calId = principal.calId;
    const event = await this.store.getJSON(this.keys.event(calId, eventId));
    if (!event || event.createdBy !== 'shared') return result(404, { error: 'no such event' });
    const regs = await this.registrantsOf(calId, eventId);
    regs.sort((a, b) => (new Date(a.registeredAt) as any) - (new Date(b.registeredAt) as any));
    return result(200, {
      registrants: regs.map((r) => ({ name: r.name, email: r.email, registeredAt: r.registeredAt })),
    });
  }

  async rescheduleSharedEvent(principal: any, eventId: string, body: any): Promise<ApiResult> {
    const calId = principal.calId;
    const event = await this.store.getJSON(this.keys.event(calId, eventId));
    if (!event || event.createdBy !== 'shared') return result(404, { error: 'no such event' });
    const start = new Date(body.start);
    if (Number.isNaN(start.getTime())) return result(400, { error: 'a valid start is required' });
    // If only a new start is given, keep the original duration.
    const duration = new Date(event.end).getTime() - new Date(event.start).getTime();
    const end = body.end ? new Date(body.end) : new Date(start.getTime() + duration);
    if (Number.isNaN(end.getTime()) || end <= start) return result(400, { error: 'invalid end' });

    event.start = start.toISOString();
    event.end = end.toISOString();
    event.sequence = (event.sequence ?? 0) + 1;
    event.status = 'confirmed';
    event.updatedAt = new Date().toISOString();
    await this.store.putJSON(this.keys.event(calId, eventId), event);
    await this.core.regenerate(calId, eventId);

    const notified = await this.fanOut(calId, eventId, event, 'moved');
    return result(200, { rescheduled: true, event: this.ownerEventView(event, notified), notified });
  }

  async cancelSharedEvent(principal: any, eventId: string): Promise<ApiResult> {
    const calId = principal.calId;
    const event = await this.store.getJSON(this.keys.event(calId, eventId));
    if (!event || event.createdBy !== 'shared') return result(404, { error: 'no such event' });
    let notified = 0;
    if (event.status !== 'cancelled') {
      event.status = 'cancelled';
      event.sequence = (event.sequence ?? 0) + 1;
      event.updatedAt = new Date().toISOString();
      await this.store.putJSON(this.keys.event(calId, eventId), event);
      await this.core.regenerate(calId, eventId);
      notified = await this.fanOut(calId, eventId, event, 'cancelled');
    }
    return result(200, { cancelled: true, notified });
  }

  /** Mail every registrant of an event a change ('moved' | 'cancelled'). */
  private async fanOut(calId: string, eventId: string, event: any, kind: string): Promise<number> {
    const { timeZone } = await this.ownerDisplay(calId);
    const regs = await this.registrantsOf(calId, eventId);
    await Promise.all(regs.map((r) =>
      this.email.notifyRegistration(kind, {
        event, email: r.email, timeZone,
        webcal: r.feedId ? `webcal://${this.FEED_HOST}/f/${r.feedId}.ics` : undefined,
        manageToken: r.manageToken,
      }),
    ));
    return regs.length;
  }

  // ── public: view + register ──────────────────────────────────────────────

  async publicEvent(handle: string): Promise<ApiResult> {
    const resolved = await this.resolveHandle(handle);
    if (!resolved) return result(404, { error: 'no such event' });
    const { calId, eventId, event } = resolved;
    const [display, regs] = await Promise.all([this.ownerDisplay(calId), this.registrantsOf(calId, eventId)]);
    const capacity = event.registration?.capacity ?? null;
    const spotsLeft = capacity ? Math.max(0, capacity - regs.length) : null;
    return result(200, {
      handle,
      title: event.title,
      start: event.start,
      end: event.end,
      location: event.location ?? null,
      description: event.description ?? null,
      displayName: display.displayName,
      timeZone: display.timeZone,
      capacity,
      spotsLeft,
      closed: spotsLeft === 0,
      cancelled: event.status === 'cancelled',
    });
  }

  async register(handle: string, body: any): Promise<ApiResult> {
    const resolved = await this.resolveHandle(handle);
    if (!resolved) return result(404, { error: 'no such event' });
    const { calId, eventId, event } = resolved;
    if (event.status === 'cancelled') return result(410, { error: 'this event was cancelled' });

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    if (!name || !email || !email.includes('@')) return result(400, { error: 'name and a valid email are required' });

    const regs = await this.registrantsOf(calId, eventId);
    const { timeZone } = await this.ownerDisplay(calId);

    // Idempotent per e-mail: registering twice returns the first registration.
    const existing = regs.find((r) => String(r.email).toLowerCase() === email.toLowerCase());
    if (existing) {
      const webcal = `webcal://${this.FEED_HOST}/f/${existing.feedId}.ics`;
      return result(200, {
        registered: true, already: true,
        event: { title: event.title, start: event.start, end: event.end, location: event.location ?? null },
        invitee: { feedUrl: this.core.feedUrl(existing.feedId), webcal },
        manage: { token: existing.manageToken, url: `${this.SITE_URL}/event/manage/?t=${existing.manageToken}` },
      });
    }

    const capacity = event.registration?.capacity ?? null;
    if (capacity && regs.length >= capacity) return result(409, { error: 'this event is full' });

    const acl = await this.store.getJSON(this.keys.acl(calId));
    const feedId = randomId(22);
    acl.feeds[feedId] = {
      role: 'viewer', principalId: null,
      label: email, feedName: event.title,
      scope: { eventId }, createdAt: new Date().toISOString(),
    };
    const manageToken = randomId(24);
    await this.store.putJSON(this.keys.manage(manageToken), {
      kind: 'registration', calId, eventId, feedId, handle, name, email, createdAt: new Date().toISOString(),
    });
    await this.store.putJSON(this.keys.eventReg(calId, eventId, manageToken), {
      name, email, feedId, manageToken, registeredAt: new Date().toISOString(),
    });
    await Promise.all([
      this.store.putJSON(this.keys.acl(calId), acl),
      this.store.putJSON(this.keys.feedIndex(feedId), { calId, role: 'viewer', principalId: null }),
    ]);
    await this.core.regenerate(calId, eventId);

    const webcal = `webcal://${this.FEED_HOST}/f/${feedId}.ics`;
    await this.email.notifyRegistration('registered', { event, email, webcal, manageToken, timeZone });

    return result(201, {
      registered: true,
      event: { title: event.title, start: event.start, end: event.end, location: event.location ?? null },
      invitee: { feedUrl: this.core.feedUrl(feedId), webcal },
      manage: { token: manageToken, url: `${this.SITE_URL}/event/manage/?t=${manageToken}` },
    });
  }

  // ── registrant: view + cancel their own spot ─────────────────────────────

  async getRegistration(token: string): Promise<ApiResult> {
    const m = await this.store.getJSON(this.keys.manage(token));
    if (!m || m.kind !== 'registration') return result(404, { error: 'no such registration' });
    const event = await this.store.getJSON(this.keys.event(m.calId, m.eventId));
    if (!event) return result(404, { error: 'no such registration' });
    const display = await this.ownerDisplay(m.calId);
    return result(200, {
      name: m.name,
      email: m.email,
      cancelled: event.status === 'cancelled',
      displayName: display.displayName,
      timeZone: display.timeZone,
      event: { title: event.title, start: event.start, end: event.end, location: event.location ?? null },
    });
  }

  async cancelRegistration(token: string): Promise<ApiResult> {
    const m = await this.store.getJSON(this.keys.manage(token));
    if (!m || m.kind !== 'registration') return result(404, { error: 'no such registration' });

    const acl = await this.store.getJSON(this.keys.acl(m.calId));
    if (acl?.feeds?.[m.feedId]) {
      delete acl.feeds[m.feedId];
      await this.store.putJSON(this.keys.acl(m.calId), acl);
    }
    // Removing the feed is the unsubscribe: the next refresh 404s and the
    // registrant's calendar drops the event. The event itself stays for others.
    await Promise.all([
      this.store.del(this.keys.feed(m.feedId)),
      this.store.del(this.keys.feedIndex(m.feedId)),
      this.store.del(this.keys.eventReg(m.calId, m.eventId, token)),
      this.store.del(this.keys.manage(token)),
    ]);
    return result(200, { cancelled: true });
  }
}
