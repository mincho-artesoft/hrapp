import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CoreService } from '../core/core.service';
import { EmailService } from '../email/email.service';
import { ApiResult, result } from '../common/api-result';
import { randomId } from '../util/ids';

const SESSION_TTL_DAYS = 7;

@Injectable()
export class MeService {
  constructor(
    private readonly store: StoreService,
    private readonly core: CoreService,
    private readonly email: EmailService,
  ) {}

  private get keys() { return this.store.keys; }
  private get SITE_URL() { return this.core.SITE_URL; }

  /** GET /me — who this token is, and whether they may publish a booking page. */
  async whoAmI(principal: any): Promise<ApiResult> {
    const rec = await this.store.getJSON(this.keys.principal(principal.principalId));
    return result(200, {
      principalId: principal.principalId,
      calId: principal.calId,
      entitlement: rec?.entitlement ?? null,
      entitled: await this.core.isEntitled(principal.principalId),
    });
  }

  /** POST /me/login — mail a sign-in link, but only if the address has bookings.
   *  The response never reveals which, so an address cannot be probed. */
  async inviteeLogin(body: any): Promise<ApiResult> {
    const email = String(body.email ?? '').trim().toLowerCase();
    if (!email.includes('@')) return result(400, { error: 'a valid email is required' });

    const owned = await this.store.listKeys(this.keys.inviteeIndex(this.core.emailHash(email)));
    if (owned.length > 0) {
      const token = randomId(32);
      await this.store.putJSON(this.keys.session(token), {
        emailHash: this.core.emailHash(email),
        email,
        createdAt: new Date().toISOString(),
        expiresAt: Date.now() + SESSION_TTL_DAYS * 86400_000,
      });
      await this.email.sendLoginLink(email, `${this.SITE_URL}/bookings?s=${token}`);
    }
    return result(200, { sent: true });
  }

  /** GET /me/bookings?s= — every booking this session's e-mail has, with its
   *  current time and status, plus the manage link to move or cancel each. */
  async listMyBookings(query: any): Promise<ApiResult> {
    const token = String(query.s ?? '');
    const session = token ? await this.store.getJSON(this.keys.session(token)) : null;
    if (!session) return result(401, { error: 'not signed in' });
    if (Date.now() > session.expiresAt) return result(401, { error: 'session expired' });

    const indexKeys = await this.store.listKeys(this.keys.inviteeIndex(session.emailHash));
    const refs = await Promise.all(indexKeys.map((k) => this.store.getJSON(k)));
    const bookings: any[] = [];
    for (const ref of refs) {
      if (!ref?.manageToken) continue;
      const m = await this.store.getJSON(this.keys.manage(ref.manageToken));
      if (!m) continue;
      const [event, config] = await Promise.all([
        this.store.getJSON(this.keys.event(m.calId, m.eventId)),
        this.store.getJSON(this.keys.booking(m.calId)),
      ]);
      if (!event) continue;
      const type = config?.meetingTypes.find((t: any) => t.id === m.typeId) ?? null;
      bookings.push({
        manageToken: ref.manageToken,
        manageUrl: `${this.SITE_URL}/booking/manage?t=${ref.manageToken}`,
        handle: m.handle,
        displayName: config?.displayName ?? 'Cloud Calendars',
        timeZone: config?.timeZone ?? 'UTC',
        status: event.status ?? 'confirmed',
        title: event.title,
        start: event.start,
        end: event.end,
        location: event.location ?? null,
        typeName: type?.name ?? null,
      });
    }
    bookings.sort((a, b) => (new Date(a.start) as any) - (new Date(b.start) as any));
    return result(200, { email: session.email, bookings });
  }
}
