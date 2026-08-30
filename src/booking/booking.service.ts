import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CoreService } from '../core/core.service';
import { EmailService } from '../email/email.service';
import { ApiResult, result } from '../common/api-result';
import { randomId } from '../util/ids';
import { computeSlots, slotKey } from '../util/booking-slots';

// Off until the web sign-in gateway and Stripe are live.
const REQUIRE_ENTITLEMENT = /^(1|true|yes)$/i.test(process.env.REQUIRE_ENTITLEMENT ?? '');

@Injectable()
export class BookingService {
  constructor(
    private readonly store: StoreService,
    private readonly core: CoreService,
    private readonly email: EmailService,
  ) {}

  private get keys() { return this.store.keys; }
  private get FEED_HOST() { return this.core.FEED_HOST; }
  private get SITE_URL() { return this.core.SITE_URL; }

  private bookingUrl(handle: string): string {
    return `https://www.cloud-calendars.com/book?c=${handle}`;
  }

  /** The busy intervals a booking must avoid: every confirmed event, as
   *  [startMs, endMs] pairs. Cancelled events free their time back up. */
  private async busyIntervalsFor(calId: string): Promise<[number, number][]> {
    const eventKeys = await this.store.listKeys(this.keys.events(calId));
    const loaded = await Promise.all(eventKeys.map((k) => this.store.getJSON(k)));
    const busy: [number, number][] = [];
    for (const ev of loaded) {
      if (!ev || ev.status === 'cancelled' || ev.allDay) continue;
      busy.push([new Date(ev.start).getTime(), new Date(ev.end).getTime()]);
    }
    return busy;
  }

  private async bookedKeysFor(calId: string): Promise<Set<string>> {
    const bookedKeys = await this.store.listKeys(`cal/${calId}/booked/`);
    return new Set(bookedKeys.map((k) => k.slice(`cal/${calId}/booked/`.length).replace(/\.json$/, '')));
  }

  /**
   * The owner's own commitments, as [startMs, endMs] pairs, pushed by the app
   * from the owner's real source calendar.
   */
  private externalBusy(config: any): [number, number][] {
    const out: [number, number][] = [];
    for (const b of config?.busyBlocks ?? []) {
      const s = new Date(b.start).getTime();
      const e = new Date(b.end).getTime();
      if (Number.isFinite(s) && Number.isFinite(e) && e > s) out.push([s, e]);
    }
    return out;
  }

  private publicView(config: any) {
    return {
      handle: config.handle,
      displayName: config.displayName,
      timeZone: config.timeZone,
      meetingTypes: (config.meetingTypes ?? []).map((t: any) => ({
        id: t.id, name: t.name, durationMinutes: t.durationMinutes,
        description: t.description ?? null, location: t.location ?? null, color: t.color ?? null,
      })),
      bookingUrl: this.bookingUrl(config.handle),
    };
  }

  /** Owner defines their bookable availability and meeting types. */
  async setBooking(principal: any, body: any): Promise<ApiResult> {
    const calId = body.calendarId ?? principal.calId;
    const acl = await this.store.getJSON(this.keys.acl(calId));
    if (!acl) return result(404, { error: 'no such calendar' });
    if (this.core.roleOf(acl, principal.principalId) !== 'owner') {
      return result(403, { error: 'only the owner may configure booking' });
    }
    if (REQUIRE_ENTITLEMENT && !(await this.core.isEntitled(principal.principalId))) {
      return result(402, { error: 'a plan is required to publish a booking page', needsPayment: true });
    }

    const meetingTypes = (body.meetingTypes ?? []).filter((t: any) => t && t.name && t.durationMinutes > 0);
    if (meetingTypes.length === 0) return result(400, { error: 'at least one meeting type is required' });
    for (const t of meetingTypes) t.id ||= randomId(8);

    const existing = await this.store.getJSON(this.keys.booking(calId));
    let handle = existing?.handle;
    if (!handle) {
      for (let attempt = 0; attempt < 5 && !handle; attempt++) {
        const candidate = randomId(10);
        if (await this.store.putJSONIfAbsent(this.keys.bookingHandle(candidate), { calId })) handle = candidate;
      }
      if (!handle) return result(500, { error: 'could not allocate a handle' });
    }

    const config = {
      handle,
      enabled: body.enabled !== false,
      displayName: body.displayName || (await this.store.getJSON(this.keys.meta(calId)))?.name || 'Cloud Calendars',
      timeZone: body.timeZone || (await this.store.getJSON(this.keys.meta(calId)))?.timeZone || 'UTC',
      contactEmail: body.contactEmail ?? existing?.contactEmail ?? null,
      sourceCalendarId: body.sourceCalendarId ?? existing?.sourceCalendarId ?? null,
      meetingTypes,
      availability: (body.availability ?? []).filter(
        (r: any) => r && r.day >= 0 && r.day <= 6 && r.end > r.start,
      ),
      busyBlocks: existing?.busyBlocks ?? [],
      minNoticeHours: body.minNoticeHours ?? 12,
      maxAdvanceDays: body.maxAdvanceDays ?? 60,
      slotIntervalMinutes: body.slotIntervalMinutes ?? 30,
      bufferMinutes: body.bufferMinutes ?? 0,
      updatedAt: new Date().toISOString(),
    };
    await this.store.putJSON(this.keys.booking(calId), config);
    return result(200, { config, bookingUrl: this.bookingUrl(handle) });
  }

  async getBooking(principal: any): Promise<ApiResult> {
    const config = await this.store.getJSON(this.keys.booking(principal.calId));
    if (!config) return result(404, { error: 'booking not configured' });
    return result(200, { config, bookingUrl: this.bookingUrl(config.handle) });
  }

  private async resolveHandle(handle: string): Promise<{ calId: string; config: any } | null> {
    const index = await this.store.getJSON(this.keys.bookingHandle(handle));
    if (!index) return null;
    const config = await this.store.getJSON(this.keys.booking(index.calId));
    if (!config || config.enabled === false) return null;
    return { calId: index.calId, config };
  }

  /** Public: what an invitee sees before picking a time. */
  async publicBooking(handle: string): Promise<ApiResult> {
    const resolved = await this.resolveHandle(handle);
    if (!resolved) return result(404, { error: 'no such booking page' });
    return result(200, this.publicView(resolved.config));
  }

  /** Public: the open slots for one meeting type over a date range. */
  async bookingSlots(handle: string, query: any): Promise<ApiResult> {
    const resolved = await this.resolveHandle(handle);
    if (!resolved) return result(404, { error: 'no such booking page' });
    const { calId, config } = resolved;

    const type = config.meetingTypes.find((t: any) => t.id === query.type) || config.meetingTypes[0];
    if (!type) return result(400, { error: 'unknown meeting type' });

    const from = query.from || new Date().toISOString().slice(0, 10);
    const to = query.to || new Date(Date.now() + 14 * 86400_000).toISOString().slice(0, 10);

    const [busy, booked] = await Promise.all([this.busyIntervalsFor(calId), this.bookedKeysFor(calId)]);
    const slots = computeSlots(config, type, [...busy, ...this.externalBusy(config)], booked, { from, to });
    return result(200, { handle, type: type.id, timeZone: config.timeZone, slots });
  }

  /** Public: claim a slot. The atomic write settles a race between two invitees;
   *  only then is the event created on the owner's calendar. */
  async book(handle: string, body: any): Promise<ApiResult> {
    const resolved = await this.resolveHandle(handle);
    if (!resolved) return result(404, { error: 'no such booking page' });
    const { calId, config } = resolved;

    const type = config.meetingTypes.find((t: any) => t.id === body.type);
    if (!type) return result(400, { error: 'unknown meeting type' });
    if (!body.start) return result(400, { error: 'start is required' });
    if (!body.name || !body.email) return result(400, { error: 'name and email are required' });

    const start = new Date(body.start);
    if (Number.isNaN(start.getTime())) return result(400, { error: 'invalid start' });
    const startISO = start.toISOString();
    const end = new Date(start.getTime() + type.durationMinutes * 60000);

    const [busy, booked] = await Promise.all([this.busyIntervalsFor(calId), this.bookedKeysFor(calId)]);
    const offered = computeSlots(config, type, [...busy, ...this.externalBusy(config)], booked, {
      from: new Date(start.getTime() - 86400_000).toISOString().slice(0, 10),
      to: new Date(start.getTime() + 86400_000).toISOString().slice(0, 10),
    });
    if (!offered.some((s) => s.start === startISO)) {
      return result(409, { error: 'that time is no longer available' });
    }

    const claimed = await this.store.putJSONIfAbsent(this.keys.booked(calId, slotKey(type.id, startISO)), {
      name: body.name, email: body.email, start: startISO, bookedAt: new Date().toISOString(),
    });
    if (!claimed) return result(409, { error: 'that time was just taken' });

    const eventId = `bk${randomId(14)}`;
    const event = {
      id: eventId,
      sequence: 0,
      title: `${type.name} — ${body.name}`,
      start: startISO,
      end: end.toISOString(),
      allDay: false,
      location: type.location ?? null,
      description: [body.notes, `Booked by ${body.name} <${body.email}>`].filter(Boolean).join('\n\n'),
      organizerName: body.name,
      organizerEmail: body.email,
      status: 'confirmed',
      createdBy: 'booking',
      updatedAt: new Date().toISOString(),
    };
    await this.store.putJSON(this.keys.event(calId, eventId), event);

    const acl = await this.store.getJSON(this.keys.acl(calId));
    const inviteeFeedId = randomId(22);
    acl.feeds[inviteeFeedId] = {
      role: 'viewer', principalId: null,
      label: body.email, feedName: type.name,
      scope: { eventId }, createdAt: new Date().toISOString(),
    };
    const manageToken = randomId(24);
    await this.store.putJSON(this.keys.manage(manageToken), {
      calId, handle, eventId, typeId: type.id,
      slotKey: slotKey(type.id, startISO),
      name: body.name, email: body.email, start: startISO,
      inviteeFeedId, createdAt: new Date().toISOString(),
    });
    await this.store.putJSON(this.keys.inviteeBooking(this.core.emailHash(body.email), manageToken), {
      manageToken, createdAt: new Date().toISOString(),
    });
    await this.store.putJSON(this.keys.eventManage(calId, eventId), { manageToken });

    await Promise.all([
      this.store.putJSON(this.keys.acl(calId), acl),
      this.store.putJSON(this.keys.feedIndex(inviteeFeedId), { calId, role: 'viewer', principalId: null }),
      this.store.putJSON(this.keys.eventFeed(calId, eventId), { feedId: inviteeFeedId }),
    ]);
    await this.core.regenerate(calId, eventId);

    const webcal = `webcal://${this.FEED_HOST}/f/${inviteeFeedId}.ics`;
    await this.email.notifyBooking('booked', { config, event, name: body.name, email: body.email, manageToken, webcal });

    return result(201, {
      confirmed: true,
      event: { id: eventId, title: event.title, start: startISO, end: event.end, location: event.location },
      invitee: { feedUrl: this.core.feedUrl(inviteeFeedId), webcal },
      manage: { token: manageToken, url: `${this.SITE_URL}/booking/manage?t=${manageToken}` },
    });
  }

  // ── invitee self-management ──────────────────────────────────────────────

  async getManage(token: string): Promise<ApiResult> {
    const m = await this.store.getJSON(this.keys.manage(token));
    if (!m) return result(404, { error: 'no such booking' });
    const [event, config] = await Promise.all([
      this.store.getJSON(this.keys.event(m.calId, m.eventId)),
      this.store.getJSON(this.keys.booking(m.calId)),
    ]);
    if (!event) return result(404, { error: 'no such booking' });
    const type = config?.meetingTypes.find((t: any) => t.id === m.typeId) ?? null;
    return result(200, {
      handle: m.handle,
      name: m.name,
      email: m.email,
      cancelled: event.status === 'cancelled',
      displayName: config?.displayName ?? 'Cloud Calendars',
      timeZone: config?.timeZone ?? 'UTC',
      event: { title: event.title, start: event.start, end: event.end, location: event.location },
      type: type && {
        id: type.id, name: type.name, durationMinutes: type.durationMinutes,
        description: type.description ?? null, location: type.location ?? null,
      },
    });
  }

  async reschedule(token: string, body: any): Promise<ApiResult> {
    const m = await this.store.getJSON(this.keys.manage(token));
    if (!m) return result(404, { error: 'no such booking' });
    return this.applyReschedule(m, token, body, 'invitee');
  }

  private async applyReschedule(m: any, token: string, body: any, actor: string): Promise<ApiResult> {
    const config = await this.store.getJSON(this.keys.booking(m.calId));
    if (!config) return result(404, { error: 'no such booking page' });
    const type = config.meetingTypes.find((t: any) => t.id === m.typeId);
    if (!type) return result(400, { error: 'unknown meeting type' });
    if (!body.start) return result(400, { error: 'start is required' });

    const start = new Date(body.start);
    if (Number.isNaN(start.getTime())) return result(400, { error: 'invalid start' });
    const startISO = start.toISOString();
    const newKey = slotKey(type.id, startISO);
    if (newKey === m.slotKey) return result(200, { rescheduled: true, unchanged: true });

    const end = new Date(start.getTime() + type.durationMinutes * 60000);

    const [busy, booked] = await Promise.all([this.busyIntervalsFor(m.calId), this.bookedKeysFor(m.calId)]);
    const offered = computeSlots(config, type, [...busy, ...this.externalBusy(config)], booked, {
      from: new Date(start.getTime() - 86400_000).toISOString().slice(0, 10),
      to: new Date(start.getTime() + 86400_000).toISOString().slice(0, 10),
    });
    if (!offered.some((s) => s.start === startISO)) {
      return result(409, { error: 'that time is not available' });
    }

    const claimed = await this.store.putJSONIfAbsent(this.keys.booked(m.calId, newKey), {
      name: m.name, email: m.email, start: startISO, bookedAt: new Date().toISOString(),
    });
    if (!claimed) return result(409, { error: 'that time was just taken' });
    await this.store.del(this.keys.booked(m.calId, m.slotKey));

    const event = await this.store.getJSON(this.keys.event(m.calId, m.eventId));
    if (!event) return result(404, { error: 'no such booking' });
    event.start = startISO;
    event.end = end.toISOString();
    event.sequence = (event.sequence ?? 0) + 1;
    event.status = 'confirmed';
    event.updatedAt = new Date().toISOString();
    await this.store.putJSON(this.keys.event(m.calId, m.eventId), event);

    m.slotKey = newKey;
    m.start = startISO;
    await this.store.putJSON(this.keys.manage(token), m);
    await this.core.regenerate(m.calId, m.eventId);

    const webcal = m.inviteeFeedId ? `webcal://${this.FEED_HOST}/f/${m.inviteeFeedId}.ics` : undefined;
    await this.email.notifyBooking('rescheduled', { config, event, name: m.name, email: m.email, manageToken: token, webcal, by: actor });

    return result(200, { rescheduled: true, event: { start: startISO, end: event.end } });
  }

  async cancelBooking(token: string): Promise<ApiResult> {
    const m = await this.store.getJSON(this.keys.manage(token));
    if (!m) return result(404, { error: 'no such booking' });
    return this.applyCancel(m, token, 'invitee');
  }

  private async applyCancel(m: any, token: string, actor: string): Promise<ApiResult> {
    const [event, config] = await Promise.all([
      this.store.getJSON(this.keys.event(m.calId, m.eventId)),
      this.store.getJSON(this.keys.booking(m.calId)),
    ]);
    if (event && event.status !== 'cancelled') {
      event.status = 'cancelled';
      event.sequence = (event.sequence ?? 0) + 1;
      event.updatedAt = new Date().toISOString();
      await this.store.putJSON(this.keys.event(m.calId, m.eventId), event);
      await this.store.del(this.keys.booked(m.calId, m.slotKey));
      await this.core.regenerate(m.calId, m.eventId);
      await this.email.notifyBooking('cancelled', { config, event, name: m.name, email: m.email, manageToken: token, by: actor });
    }
    return result(200, { cancelled: true });
  }

  // ── owner-side management ────────────────────────────────────────────────

  private async findManageForEvent(calId: string, eventId: string): Promise<{ token: string; m: any } | null> {
    const ref = await this.store.getJSON(this.keys.eventManage(calId, eventId));
    if (ref?.manageToken) {
      const m = await this.store.getJSON(this.keys.manage(ref.manageToken));
      if (m && m.calId === calId && m.eventId === eventId) return { token: ref.manageToken, m };
    }
    for (const k of await this.store.listKeys('idx/manage/')) {
      const m = await this.store.getJSON(k);
      if (m && m.calId === calId && m.eventId === eventId) {
        const token = k.slice('idx/manage/'.length).replace(/\.json$/, '');
        await this.store.putJSON(this.keys.eventManage(calId, eventId), { manageToken: token });
        return { token, m };
      }
    }
    return null;
  }

  async ownerCancelBooking(principal: any, eventId: string): Promise<ApiResult> {
    const found = await this.findManageForEvent(principal.calId, eventId);
    if (!found) return result(404, { error: 'no such booking' });
    return this.applyCancel(found.m, found.token, 'owner');
  }

  async ownerRescheduleBooking(principal: any, eventId: string, body: any): Promise<ApiResult> {
    const found = await this.findManageForEvent(principal.calId, eventId);
    if (!found) return result(404, { error: 'no such booking' });
    return this.applyReschedule(found.m, found.token, body, 'owner');
  }

  // ── app bridge: busy push, booking mirror ────────────────────────────────

  async setBusy(principal: any, body: any): Promise<ApiResult> {
    const calId = principal.calId;
    const config = await this.store.getJSON(this.keys.booking(calId));
    if (!config) return result(404, { error: 'booking not configured' });

    const blocks = (Array.isArray(body.blocks) ? body.blocks : [])
      .map((b: any) => {
        const s = new Date(b.start).getTime();
        const e = new Date(b.end).getTime();
        return Number.isFinite(s) && Number.isFinite(e) && e > s
          ? { start: new Date(s).toISOString(), end: new Date(e).toISOString() }
          : null;
      })
      .filter(Boolean)
      .slice(0, 2000);

    config.busyBlocks = blocks;
    if (body.sourceCalendarId) config.sourceCalendarId = String(body.sourceCalendarId);
    config.busyUpdatedAt = new Date().toISOString();
    await this.store.putJSON(this.keys.booking(calId), config);
    return result(200, { ok: true, count: blocks.length });
  }

  async listBookingEvents(principal: any, query: any): Promise<ApiResult> {
    const calId = principal.calId;
    const eventKeys = await this.store.listKeys(this.keys.events(calId));
    const loaded = await Promise.all(eventKeys.map((k) => this.store.getJSON(k)));
    const since = query.since ? new Date(query.since).getTime() : 0;
    const out: any[] = [];
    for (const ev of loaded) {
      if (!ev || ev.createdBy !== 'booking') continue;
      if (Number.isFinite(since) && since > 0 && new Date(ev.updatedAt ?? 0).getTime() < since) continue;
      out.push({
        id: ev.id,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        location: ev.location ?? null,
        status: ev.status ?? 'confirmed',
        organizerName: ev.organizerName ?? null,
        organizerEmail: ev.organizerEmail ?? null,
        sequence: ev.sequence ?? 0,
        updatedAt: ev.updatedAt ?? null,
      });
    }
    out.sort((a, b) => (new Date(a.start) as any) - (new Date(b.start) as any));
    return result(200, { events: out });
  }
}
