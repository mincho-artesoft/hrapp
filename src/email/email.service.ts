import { Injectable } from '@nestjs/common';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import QRCode from 'qrcode';

const PNGJS: any = require('pngjs');

/**
 * Booking e-mails: confirmation, reschedule, cancellation, and the passwordless
 * sign-in link. Ported from the original lib/email.mjs — same SES delivery, same
 * templates matched to the iOS App Clip, same owner-vs-invitee wording.
 *
 * Sending is guarded: with no `EMAIL_FROM` configured the calls become no-ops
 * and a booking still completes.
 */
@Injectable()
export class EmailService {
  private readonly EMAIL_FROM = process.env.EMAIL_FROM ?? null;
  private readonly EMAIL_REGION = process.env.EMAIL_REGION ?? process.env.AWS_REGION ?? 'us-east-1';
  private readonly SITE_URL = process.env.SITE_URL ?? 'https://www.cloud-calendars.com';
  private readonly API_URL = process.env.API_URL ?? 'https://api.cloud-calendars.com';
  private readonly ses = this.EMAIL_FROM ? new SESv2Client({ region: this.EMAIL_REGION }) : null;

  private readonly ACCENT = '#5b9bff';
  private get LOGO_URL() { return `${this.SITE_URL}/icons/icon-192.png`; }

  mailConfigured(): boolean {
    return Boolean(this.EMAIL_FROM);
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    options: { replyTo?: string | null } = {},
  ): Promise<void> {
    if (!this.ses || !this.EMAIL_FROM) {
      console.log(`[email skipped — not configured] "${subject}" → ${to}`);
      return;
    }
    try {
      await this.ses.send(
        new SendEmailCommand({
          FromEmailAddress: this.EMAIL_FROM,
          Destination: { ToAddresses: [to] },
          ReplyToAddresses: options.replyTo ? [options.replyTo] : undefined,
          Content: {
            Simple: {
              Subject: { Data: subject, Charset: 'UTF-8' },
              Body: {
                Html: { Data: html, Charset: 'UTF-8' },
                Text: { Data: this.plainText(html), Charset: 'UTF-8' },
              },
            },
          },
        }),
      );
    } catch (err: any) {
      // Never let a mail failure break a booking — the meeting is already saved.
      console.error(`[email failed] "${subject}" → ${to}: ${err?.name ?? ''} ${err?.message ?? err}`);
    }
  }

  private fmtWhen(startISO: string, endISO: string, timeZone?: string): string {
    const tz = timeZone || 'UTC';
    try {
      const date = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      }).format(new Date(startISO));
      const t = (iso: string) =>
        new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
      return `${date} · ${t(startISO)}–${t(endISO)} (${tz})`;
    } catch {
      return `${startISO} – ${endISO}`;
    }
  }

  private fmtAppClipEvent(
    startISO: string,
    endISO: string,
    timeZone?: string,
    isAllDay = false,
  ): { date: string; time: string | null } {
    const tz = timeZone || 'UTC';
    try {
      const date = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(startISO));
      if (isAllDay) return { date, time: null };
      const formatTime = (iso: string) => new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(iso));
      return { date, time: `${formatTime(startISO)} – ${formatTime(endISO)}` };
    } catch {
      return { date: startISO, time: isAllDay ? null : `${startISO} – ${endISO}` };
    }
  }

  private esc(s: unknown): string {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /** A real text alternative keeps the invitation readable in clients that
   * suppress HTML or remote images. */
  private plainText(html: string): string {
    return html
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(br|\/p|\/div|\/h[1-6]|\/tr)>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&#39;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /** One visual shell so the e-mails read as one product. */
  private shell(bodyHtml: string): string {
    return `<!doctype html><html><body style="margin:0;padding:0;background:#08213f;">
  <div style="background:#08213f;background-image:linear-gradient(135deg,#051C3B 0%,#0A4D80 100%);padding:34px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
      <tr><td align="center" style="padding-bottom:20px;">
        <img src="${this.LOGO_URL}" width="64" height="64" alt="Cloud Calendars" style="display:block;border-radius:15px;" />
        <div style="margin-top:10px;font-weight:700;font-size:15px;color:rgba(255,255,255,0.85);letter-spacing:.01em;">Cloud Calendars</div>
      </td></tr>
      <tr><td style="color:#eaf0fb;">${bodyHtml}</td></tr>
      <tr><td align="center" style="padding-top:22px;font-size:12px;color:rgba(255,255,255,0.42);">
        <a href="${this.SITE_URL}" style="color:rgba(255,255,255,0.42);text-decoration:none;">cloud-calendars.com</a>
      </td></tr>
    </table>
  </div></body></html>`;
  }

  private button(href: string, label: string): string {
    return `<a href="${this.esc(href)}" style="display:inline-block;background:${this.ACCENT};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 30px;border-radius:999px;">${this.esc(label)}</a>`;
  }

  private detailRow(icon: string, text: string, color = '#cdd9f2'): string {
    return `<div style="margin-top:8px;color:${color};font-size:14px;">${icon}&nbsp;&nbsp;${this.esc(text)}</div>`;
  }

  /** The event, drawn like the App Clip's card: a tinted panel with an accent bar. */
  private eventBlock(title: string, rows: string): string {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(91,155,255,0.16);border-radius:10px;">
    <tr>
      <td width="4" style="width:4px;background:${this.ACCENT};border-radius:10px 0 0 10px;">&nbsp;</td>
      <td style="padding:15px 18px;">
        <div style="font-weight:700;font-size:16px;color:#ffffff;">${this.esc(title)}</div>
        ${rows}
      </td>
    </tr>
  </table>`;
  }

  private appClipEventBlock({ title, date, time, location, eventColor }: any): string {
    const color = this.validEventColor(eventColor);
    const red = Number.parseInt(color.slice(1, 3), 16);
    const green = Number.parseInt(color.slice(3, 5), 16);
    const blue = Number.parseInt(color.slice(5, 7), 16);
    const tint = `rgba(${red},${green},${blue},0.30)`;
    const icon = (name: 'calendar' | 'clock' | 'location', alt: string) => {
      const iconColor = name === 'calendar' ? '#CDD9F2' : color;
      return `<img src="${this.esc(this.sharedEventIconURL(name, iconColor))}" width="14" height="14" alt="${alt}" style="display:inline-block;width:14px;height:14px;margin:0 7px 0 0;vertical-align:-2px;border:0;" />`;
    };
    const detail = (
      iconName: 'clock' | 'location',
      iconAlt: string,
      value: string,
    ) => `<div style="margin-top:7px;color:${color};font-size:14px;font-weight:600;line-height:18px;">
      ${icon(iconName, iconAlt)}${this.esc(value)}
    </div>`;
    return `<div style="margin:0 4px 10px;color:rgba(255,255,255,0.72);font-size:13px;font-weight:600;line-height:18px;">
      ${icon('calendar', 'Date')}${this.esc(date)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${tint};border-radius:5px;">
    <tr>
      <td width="3" style="width:3px;background:${color};border-radius:5px 0 0 5px;font-size:0;line-height:0;">&nbsp;</td>
      <td style="padding:6px 8px;color:${color};">
        <div style="font-weight:700;font-size:16px;line-height:20px;color:${color};">${this.esc(title)}</div>
        ${time ? detail('clock', 'Time', time) : ''}
        ${location ? detail('location', 'Location', location) : ''}
      </td>
    </tr>
  </table>`;
  }

  private validEventColor(value: unknown): string {
    const color = String(value ?? '');
    return /^#[0-9a-fA-F]{6}$/.test(color) ? color.toUpperCase() : this.ACCENT;
  }

  private sharedEventIconURL(
    kind: 'calendar' | 'clock' | 'location',
    color: string,
  ): string {
    const url = new URL('/email-assets/shared-event-icon', this.API_URL);
    url.searchParams.set('kind', kind);
    url.searchParams.set('color', this.validEventColor(color));
    return url.toString();
  }

  private sharedEventQRCodeURL(eventUrl: string): string {
    const url = new URL('/email-assets/shared-event-qr', this.API_URL);
    url.searchParams.set('url', eventUrl);
    return url.toString();
  }

  /** Small raster equivalents of the App Clip's SF Symbols. CID-hosted PNGs
   * render consistently in Gmail, unlike Unicode clock/location glyphs. */
  private invitationIconPng(
    kind: 'calendar' | 'clock' | 'location',
    requestedColor: string,
  ): Buffer {
    const size = 40;
    const png = new PNGJS.PNG({ width: size, height: size, colorType: 6 });
    const color = this.validEventColor(requestedColor);
    const red = Number.parseInt(color.slice(1, 3), 16);
    const green = Number.parseInt(color.slice(3, 5), 16);
    const blue = Number.parseInt(color.slice(5, 7), 16);

    const pixel = (x: number, y: number, alpha = 255) => {
      const px = Math.round(x);
      const py = Math.round(y);
      if (px < 0 || py < 0 || px >= size || py >= size) return;
      const offset = (py * size + px) * 4;
      png.data[offset] = red;
      png.data[offset + 1] = green;
      png.data[offset + 2] = blue;
      png.data[offset + 3] = Math.max(png.data[offset + 3], alpha);
    };
    const brush = (x: number, y: number, radius = 2) => {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if ((dx * dx) + (dy * dy) <= radius * radius) pixel(x + dx, y + dy);
        }
      }
    };
    const line = (x1: number, y1: number, x2: number, y2: number, radius = 2) => {
      const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2;
      for (let step = 0; step <= steps; step += 1) {
        const progress = steps === 0 ? 0 : step / steps;
        brush(x1 + ((x2 - x1) * progress), y1 + ((y2 - y1) * progress), radius);
      }
    };
    const circle = (centerX: number, centerY: number, radius: number, stroke = 2) => {
      for (let degree = 0; degree < 360; degree += 1) {
        const angle = degree * Math.PI / 180;
        brush(
          centerX + (Math.cos(angle) * radius),
          centerY + (Math.sin(angle) * radius),
          stroke,
        );
      }
    };

    if (kind === 'clock') {
      circle(20, 20, 13, 2);
      line(20, 20, 20, 11, 2);
      line(20, 20, 27, 20, 2);
      brush(20, 20, 2);
    } else if (kind === 'location') {
      line(6, 18, 34, 6, 2);
      line(34, 6, 22, 34, 2);
      line(22, 34, 18, 23, 2);
      line(18, 23, 6, 18, 2);
      line(18, 23, 34, 6, 2);
    } else {
      line(8, 10, 32, 10, 2);
      line(32, 10, 32, 33, 2);
      line(32, 33, 8, 33, 2);
      line(8, 33, 8, 10, 2);
      line(8, 16, 32, 16, 2);
      line(14, 6, 14, 12, 2);
      line(26, 6, 26, 12, 2);
      brush(14, 22, 2);
      brush(20, 22, 2);
      brush(26, 22, 2);
      brush(14, 28, 2);
      brush(20, 28, 2);
      brush(26, 28, 2);
    }

    return PNGJS.PNG.sync.write(png);
  }

  sharedEventIconPng(kind: unknown, color: unknown): Buffer | null {
    if (!['calendar', 'clock', 'location'].includes(String(kind ?? ''))) return null;
    return this.invitationIconPng(
      String(kind) as 'calendar' | 'clock' | 'location',
      this.validEventColor(color),
    );
  }

  async sharedEventQRCodePng(value: unknown): Promise<Buffer | null> {
    const raw = String(value ?? '');
    if (!raw || raw.length > 2_048) return null;
    try {
      const url = new URL(raw);
      const apiHost = new URL(this.API_URL).hostname;
      const allowedInvitationPaths = new Set([
        '/event-invites/open',
        '/icloud-calendar-invites/open',
      ]);
      if (url.protocol !== 'https:'
          || url.hostname !== apiHost
          || !allowedInvitationPaths.has(url.pathname)) {
        return null;
      }
      return await QRCode.toBuffer(url.toString(), {
        type: 'png',
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#08213FFF', light: '#FFFFFFFF' },
      });
    } catch {
      return null;
    }
  }

  private inviteeHtml(kind: string, { title, when, location, manageUrl, webcal, by }: any): string {
    const byHost = by === 'owner';
    const heading = {
      booked: 'You’re booked',
      rescheduled: 'Your booking moved',
      cancelled: 'Booking cancelled',
    }[kind];
    const intro = {
      booked: 'Your meeting is confirmed. Add it to your calendar below.',
      rescheduled: byHost
        ? 'The host moved your meeting to a new time.'
        : 'Your meeting has been moved to a new time.',
      cancelled: byHost
        ? 'The host cancelled this meeting. Nothing more to do.'
        : 'This meeting has been cancelled. Nothing more to do.',
    }[kind];

    let body = `<h1 style="margin:4px 0 8px;font-size:26px;font-weight:800;color:#ffffff;text-align:center;">${this.esc(heading)}</h1>
    <p style="margin:0 auto 22px;max-width:40ch;color:rgba(255,255,255,0.68);font-size:15px;text-align:center;">${this.esc(intro)}</p>
    ${this.eventBlock(title, this.detailRow('🗓', when) + (location ? this.detailRow('📍', location) : ''))}`;

    if (kind !== 'cancelled') {
      if (webcal) body += `<div style="text-align:center;margin:24px 0 0;">${this.button(webcal, 'Add to calendar')}</div>`;
      body += `<p style="margin:16px 0 0;text-align:center;color:rgba(255,255,255,0.55);font-size:13px;">Need a different time? <a href="${this.esc(manageUrl)}" style="color:${this.ACCENT};text-decoration:underline;">Reschedule or cancel</a>.</p>`;
    }
    return this.shell(body);
  }

  private ownerHtml(kind: string, { title, when, name, email }: any): string {
    const heading = {
      booked: 'New booking',
      rescheduled: 'A booking was moved',
      cancelled: 'A booking was cancelled',
    }[kind];
    const body = `<h1 style="margin:4px 0 16px;font-size:26px;font-weight:800;color:#ffffff;text-align:center;">${this.esc(heading)}</h1>
    ${this.eventBlock(title, this.detailRow('🗓', when) + this.detailRow('👤', `${name} <${email}>`))}
    <p style="margin:16px 0 0;text-align:center;color:rgba(255,255,255,0.55);font-size:13px;">It’s already on your Cloud Calendars feed.</p>`;
    return this.shell(body);
  }

  /**
   * Fan a booking change out to the two participants. `kind` is one of
   * 'booked' | 'rescheduled' | 'cancelled'. The owner mail is sent only when the
   * booking config carries a contact address, and never when the owner is the
   * one who acted (`by === 'owner'`).
   */
  async notifyBooking(kind: string, { config, event, name, email, manageToken, webcal, by }: any): Promise<void> {
    const when = this.fmtWhen(event.start, event.end, config?.timeZone);
    const manageUrl = `${this.SITE_URL}/booking/manage/?t=${manageToken}`;
    const location = event.location ?? null;
    const title = event.title;

    const subj = {
      booked: `Confirmed: ${title}`,
      rescheduled: `Rescheduled: ${title}`,
      cancelled: `Cancelled: ${title}`,
    }[kind];

    await this.sendEmail(email, subj, this.inviteeHtml(kind, { title, when, location, manageUrl, webcal, by }));

    const ownerEmail = by === 'owner' ? null : config?.contactEmail;
    if (ownerEmail) {
      const ownerSubj = {
        booked: `New booking: ${title}`,
        rescheduled: `Moved: ${title}`,
        cancelled: `Cancelled: ${title}`,
      }[kind];
      await this.sendEmail(ownerEmail, ownerSubj, this.ownerHtml(kind, { title, when, name, email }));
    }
  }

  private registrationHtml(kind: string, { title, when, location, webcal, manageUrl }: any): string {
    const heading = {
      registered: 'You’re registered',
      moved: 'The event moved',
      cancelled: 'Event cancelled',
    }[kind];
    const intro = {
      registered: 'You’re on the list. Add it to your calendar below.',
      moved: 'The organizer moved this event to a new time.',
      cancelled: 'The organizer cancelled this event. Nothing more to do.',
    }[kind];

    let body = `<h1 style="margin:4px 0 8px;font-size:26px;font-weight:800;color:#ffffff;text-align:center;">${this.esc(heading)}</h1>
    <p style="margin:0 auto 22px;max-width:40ch;color:rgba(255,255,255,0.68);font-size:15px;text-align:center;">${this.esc(intro)}</p>
    ${this.eventBlock(title, this.detailRow('🗓', when) + (location ? this.detailRow('📍', location) : ''))}`;

    if (kind !== 'cancelled') {
      if (webcal) body += `<div style="text-align:center;margin:24px 0 0;">${this.button(webcal, 'Add to calendar')}</div>`;
      if (manageUrl) body += `<p style="margin:16px 0 0;text-align:center;color:rgba(255,255,255,0.55);font-size:13px;">Can’t make it? <a href="${this.esc(manageUrl)}" style="color:${this.ACCENT};text-decoration:underline;">Cancel your spot</a>.</p>`;
    }
    return this.shell(body);
  }

  /**
   * Notify one registrant of a shareable fixed-date event. `kind` is
   * 'registered' | 'moved' | 'cancelled'. Guarded like every send: a no-op with
   * no EMAIL_FROM configured.
   */
  async notifyRegistration(kind: string, { event, email, webcal, manageToken, timeZone }: any): Promise<void> {
    const when = this.fmtWhen(event.start, event.end, timeZone);
    const manageUrl = manageToken ? `${this.SITE_URL}/event/manage/?t=${manageToken}` : null;
    const subj = {
      registered: `Registered: ${event.title}`,
      moved: `Moved: ${event.title}`,
      cancelled: `Cancelled: ${event.title}`,
    }[kind];
    await this.sendEmail(
      email, subj,
      this.registrationHtml(kind, { title: event.title, when, location: event.location ?? null, webcal, manageUrl }),
    );
  }

  /** Sends an owner-created App Clip event invitation. The recipient role is
   * already stored on the canonical S3 event before this method is called. */
  async sendSharedEventInvitation({
    email,
    access,
    event,
    eventUrl,
    timeZone,
    senderName,
    senderEmail,
    eventColor,
  }: any): Promise<void> {
    const eventDateTime = this.fmtAppClipEvent(
      event.start,
      event.end,
      timeZone,
      Boolean(event.allDay),
    );
    const role = access === 'owner' ? 'Owner' : access === 'writer' ? 'Writer' : 'Reader';
    const fromName = String(senderName || senderEmail || 'Cloud Calendars');
    const fromLine = senderEmail
      ? `${this.esc(fromName)} &lt;<a href="mailto:${this.esc(senderEmail)}" style="color:${this.ACCENT};text-decoration:none;">${this.esc(senderEmail)}</a>&gt;`
      : this.esc(fromName);
    const permission = access === 'owner'
      ? 'You can edit, share, and manage access after signing in with this e-mail address.'
      : access === 'writer'
        ? 'You can edit this event after signing in with this e-mail address.'
        : 'You can view this event and keep it synchronized.';
    const color = this.validEventColor(eventColor);
    const qrBlock = `<div style="margin:24px auto 0;text-align:center;">
          <div style="display:inline-block;background:#ffffff;padding:14px;border-radius:18px;">
            <img src="${this.esc(this.sharedEventQRCodeURL(eventUrl))}" width="240" height="240" alt="QR code to open the event" style="display:block;width:240px;height:240px;" />
          </div>
          <p style="margin:10px 0 0;color:rgba(255,255,255,0.62);font-size:13px;">Scan with Cloud Calendars</p>
        </div>`;
    const body = `<h1 style="margin:4px 0 8px;font-size:26px;font-weight:800;color:#ffffff;text-align:center;">Event invitation</h1>
    <p style="margin:0 auto 8px;max-width:44ch;color:rgba(255,255,255,0.78);font-size:15px;text-align:center;">From <strong style="color:#ffffff;">${fromLine}</strong></p>
    <p style="margin:0 auto 22px;max-width:40ch;color:rgba(255,255,255,0.68);font-size:15px;text-align:center;">You were invited as <strong style="color:#ffffff;">${role}</strong>. ${permission}</p>
    ${this.appClipEventBlock({
      title: event.title,
      date: eventDateTime.date,
      time: eventDateTime.time,
      location: event.location,
      eventColor: color,
    })}
    <div style="text-align:center;margin:24px 0 0;">${this.button(eventUrl, 'Open event')}</div>
    ${qrBlock}
    <p style="margin:16px 0 0;text-align:center;color:rgba(255,255,255,0.48);font-size:12px;">Sign in with ${this.esc(email)} to use the assigned access.</p>`;
    await this.sendEmail(
      email,
      `${fromName} invited you: ${event.title}`,
      this.shell(body),
      { replyTo: senderEmail },
    );
  }

  /** Sends a calendar invitation after the pending role has been persisted.
   * The link is server-owned so Email and QR never depend on the App Clip URL. */
  async sendSharedCalendarInvitation({
    email,
    access,
    calendar,
    ownerId,
    calendarId,
    senderEmail,
  }: any): Promise<void> {
    const invitationURL = new URL('/icloud-calendar-invites/open', this.API_URL);
    invitationURL.searchParams.set('o', String(ownerId));
    invitationURL.searchParams.set('c', String(calendarId));

    const role = access === 'owner' ? 'Owner' : access === 'writer' ? 'Writer' : 'Reader';
    const sender = String(senderEmail || calendar?.ownerEmail || 'Cloud Calendars');
    const title = String(calendar?.title || 'Shared calendar');
    const color = this.validEventColor(calendar?.color);
    const permission = access === 'owner'
      ? 'You can view, edit, share, and manage access after accepting.'
      : access === 'writer'
        ? 'You can view and edit its events after accepting.'
        : 'You can view its synchronized events after accepting.';
    const qrImageURL = new URL(this.sharedEventQRCodeURL(invitationURL.toString()));
    // Gmail's image proxy can cache a previous failed response for the same
    // URL. Give every sent/resend invitation a fresh image URL so a repaired
    // QR endpoint is fetched again immediately.
    qrImageURL.searchParams.set('v', Date.now().toString());
    const qrURL = qrImageURL.toString();
    const body = `<h1 style="margin:4px 0 8px;font-size:26px;font-weight:800;color:#ffffff;text-align:center;">Calendar invitation</h1>
    <p style="margin:0 auto 8px;max-width:44ch;color:rgba(255,255,255,0.78);font-size:15px;text-align:center;">From <strong style="color:#ffffff;">${this.esc(sender)}</strong></p>
    <p style="margin:0 auto 22px;max-width:42ch;color:rgba(255,255,255,0.68);font-size:15px;text-align:center;">You were invited as <strong style="color:#ffffff;">${role}</strong>. ${permission}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.10);border-radius:10px;">
      <tr>
        <td width="4" style="width:4px;background:${color};border-radius:10px 0 0 10px;">&nbsp;</td>
        <td style="padding:16px 18px;">
          <div style="font-weight:700;font-size:18px;color:#ffffff;">${this.esc(title)}</div>
          <div style="margin-top:8px;color:rgba(255,255,255,0.70);font-size:14px;">Calendar · ${role}</div>
        </td>
      </tr>
    </table>
    <div style="text-align:center;margin:24px 0 0;">${this.button(invitationURL.toString(), 'Open calendar')}</div>
    <div style="margin:24px auto 0;text-align:center;">
      <div style="display:inline-block;background:#ffffff;padding:14px;border-radius:18px;">
        <img src="${this.esc(qrURL)}" width="240" height="240" alt="QR code to open the calendar" style="display:block;width:240px;height:240px;" />
      </div>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.62);font-size:13px;">Scan with Cloud Calendars</p>
    </div>
    <p style="margin:16px 0 0;text-align:center;color:rgba(255,255,255,0.48);font-size:12px;">Sign in with ${this.esc(email)} to accept the assigned access.</p>`;
    await this.sendEmail(
      email,
      `${sender} invited you: ${title}`,
      this.shell(body),
      { replyTo: senderEmail },
    );
  }

  /** The passwordless sign-in link to the "my bookings" page. */
  async sendLoginLink(to: string, url: string): Promise<void> {
    const body = `<h1 style="margin:4px 0 8px;font-size:26px;font-weight:800;color:#ffffff;text-align:center;">Your bookings</h1>
    <p style="margin:0 auto 22px;max-width:40ch;color:rgba(255,255,255,0.68);font-size:15px;text-align:center;">Tap below to see and manage every meeting you’ve booked. This link works for 7 days.</p>
    <div style="text-align:center;margin:6px 0 0;">${this.button(url, 'View my bookings')}</div>
    <p style="margin:18px 0 0;text-align:center;color:rgba(255,255,255,0.45);font-size:12px;">If you didn’t ask for this, you can ignore it.</p>`;
    await this.sendEmail(to, 'Your Cloud Calendars bookings', this.shell(body));
  }
}
