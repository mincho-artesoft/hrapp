import { Injectable } from '@nestjs/common';
import { SESv2Client, SendEmailCommand, Attachment } from '@aws-sdk/client-sesv2';
import QRCode from 'qrcode';
import { eventPalette } from '../presentation/event-card';
import { canonicalInvitationURL, eventInvitationURLWithPreview } from './invitation-url';
import { EmailSendGuard } from './send-guard';

const PNGJS: any = require('pngjs');

/**
 * Calendar/event invitations and fixed-date event registration notifications.
 * Ported from the original lib/email.mjs — same SES delivery, same
 * templates matched to the iOS App Clip, same owner-vs-invitee wording.
 *
 * Sending is guarded: with no `EMAIL_FROM` configured the calls become no-ops
 * and calendar actions still complete.
 */
@Injectable()
export class EmailService {
  private readonly EMAIL_FROM = process.env.EMAIL_FROM ?? null;
  private readonly EMAIL_REGION = process.env.EMAIL_REGION ?? process.env.AWS_REGION ?? 'us-east-1';
  private readonly SITE_URL = process.env.SITE_URL ?? 'https://www.cloud-calendars.com';
  private readonly API_URL = process.env.API_URL ?? 'https://api.cloud-calendars.com';
  private readonly ses = this.EMAIL_FROM ? new SESv2Client({ region: this.EMAIL_REGION, maxAttempts: 1 }) : null;
  private readonly sendGuard = new EmailSendGuard();

  private readonly ACCENT = '#5b9bff';
  private get LOGO_URL() { return `${this.SITE_URL}/icons/icon-192.png`; }

  mailConfigured(): boolean {
    return Boolean(this.EMAIL_FROM);
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    options: { replyTo?: string | null; attachments?: Attachment[] } = {},
  ): Promise<void> {
    if (!this.ses || !this.EMAIL_FROM) {
      console.log('[email skipped — not configured]');
      return;
    }
    try {
      await this.sendGuard.claim(this.EMAIL_FROM, to, subject, html);
      const sent = await this.ses.send(
        new SendEmailCommand({
          FromEmailAddress: this.EMAIL_FROM,
          Destination: { ToAddresses: [to] },
          ReplyToAddresses: options.replyTo ? [options.replyTo] : undefined,
          Content: {
            Simple: {
              Subject: { Data: subject, Charset: 'UTF-8' },
              Attachments: options.attachments,
              Body: {
                Html: { Data: html, Charset: 'UTF-8' },
                Text: { Data: this.plainText(html), Charset: 'UTF-8' },
              },
            },
          },
        }),
      );
      console.info('[email sent]', JSON.stringify({ messageId: sent.MessageId }));
    } catch (err: any) {
      // Delivery failure must not roll back an already-saved calendar action.
      console.error('[email not sent or needs review]', JSON.stringify({ type: err?.name ?? 'Error' }));
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
      .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
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
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><style>
      .cc-event, .cc-event td { box-sizing:border-box; }
      .cc-event-title, .cc-event-meta { overflow-wrap:anywhere; word-break:break-word; }
      @media (prefers-color-scheme:dark) {
        .cc-event { background:var(--cc-dark,#032C54) !important; }
        .cc-event-title { color:var(--cc-color,#0A84FF) !important; }
      }
    </style></head><body style="margin:0;padding:0;background:#08213f;">
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

  private detailRow(icon: string, text: string, color = eventPalette(this.ACCENT).detail): string {
    const kind = icon === '📍' ? 'location' : icon === '🗓' ? 'calendar' : null;
    const symbol = kind ? `<img src="${this.esc(this.sharedEventIconURL(kind, color))}" width="14" height="14" alt="" style="vertical-align:-2px;border:0;" />` : icon;
    return `<div class="cc-event-meta" style="margin-top:2px;color:${color};font-size:14px;line-height:19px;">${symbol}&nbsp;${this.esc(text)}</div>`;
  }

  /** The event, drawn like the App Clip's card: a tinted panel with an accent bar. */
  private eventBlock(title: string, rows: string, eventColor: unknown = this.ACCENT): string {
    const p = eventPalette(eventColor);
    return `<table class="cc-event" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="--cc-color:${p.color};--cc-dark:${p.dark};background:${p.light};border-radius:5px;table-layout:fixed;">
    <tr>
      <td style="padding:5px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed;"><tr>
          <td width="3" style="width:3px;background:${p.color};border-radius:2px;font-size:0;">&nbsp;</td>
          <td style="padding:0 2px 0 4px;">
            <div class="cc-event-title" style="font-weight:600;font-size:16px;line-height:20px;color:${p.title};">${this.esc(title)}</div>
            ${rows}
          </td>
        </tr></table>
      </td>
    </tr>
  </table>`;
  }

  private appClipEventBlock({ title, date, time, location, eventColor }: any): string {
    const palette = eventPalette(eventColor);
    const color = palette.detail;
    const icon = (name: 'calendar' | 'clock' | 'location', alt: string) => {
      const iconColor = name === 'calendar' ? '#CDD9F2' : color;
      return `<img src="${this.esc(this.sharedEventIconURL(name, iconColor))}" width="14" height="14" alt="${alt}" style="display:inline-block;width:14px;height:14px;margin:0 7px 0 0;vertical-align:-2px;border:0;" />`;
    };
    const detail = (
      iconName: 'clock' | 'location',
      iconAlt: string,
      value: string,
    ) => `<div class="cc-event-meta" style="margin-top:2px;color:${color};font-size:14px;font-weight:400;line-height:19px;">
      ${icon(iconName, iconAlt)}${this.esc(value)}
    </div>`;
    return `<div style="margin:0 4px 10px;color:rgba(255,255,255,0.72);font-size:13px;font-weight:600;line-height:18px;">
      ${icon('calendar', 'Date')}${this.esc(date)}
    </div>
    ${this.eventBlock(title,
      (time ? detail('clock', 'Time', time) : '') + (location ? detail('location', 'Location', location) : ''),
      palette.color)}`;
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
    const url = canonicalInvitationURL(value, this.API_URL, true);
    if (!url) return null;
    try {
      return await QRCode.toBuffer(url.toString(), {
        type: 'png',
        width: 600,
        margin: 4,
        errorCorrectionLevel: 'M',
        color: { dark: '#08213FFF', light: '#FFFFFFFF' },
      });
    } catch {
      return null;
    }
  }

  private async invitationQRAttachment(url: string): Promise<Attachment> {
    const png = await this.sharedEventQRCodePng(url);
    // Never send a broken QR img silently. The caller keeps the invitation
    // pending and can retry delivery if rendering fails.
    if (!png) throw new Error('Invalid invitation QR URL');
    return { RawContent: png, FileName: 'invitation-qr.png', ContentId: 'invitation-qr',
      ContentType: 'image/png', ContentDisposition: 'INLINE', ContentTransferEncoding: 'BASE64' };
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
    const canonicalURL = canonicalInvitationURL(eventUrl, this.API_URL);
    if (!canonicalURL) throw new Error('Invalid event invitation URL');
    const previewURL = eventInvitationURLWithPreview(canonicalURL, {
      ...event, details: { ...event.details, timeZone: event.details?.timeZone ?? timeZone },
    });
    if (!previewURL) throw new Error('Invalid event invitation preview');
    if (!previewURL.searchParams.has('color') && eventColor) {
      previewURL.searchParams.set('color', this.validEventColor(eventColor));
    }
    eventUrl = previewURL.toString();
    const qrAttachment = await this.invitationQRAttachment(eventUrl);
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
            <img src="cid:invitation-qr" width="240" height="240" alt="QR code to open the event" style="display:block;width:240px;height:240px;" />
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
      { replyTo: senderEmail, attachments: [qrAttachment] },
    );
  }

  /** Sends a calendar invitation after the pending role has been persisted.
   * The server URL is shared through both the e-mail button and QR code. */
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
    const qrAttachment = await this.invitationQRAttachment(invitationURL.toString());
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
        <img src="cid:invitation-qr" width="240" height="240" alt="QR code to open the calendar" style="display:block;width:240px;height:240px;" />
      </div>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.62);font-size:13px;">Scan with Cloud Calendars</p>
    </div>
    <p style="margin:16px 0 0;text-align:center;color:rgba(255,255,255,0.48);font-size:12px;">Sign in with ${this.esc(email)} to accept the assigned access.</p>`;
    await this.sendEmail(
      email,
      `${sender} invited you: ${title}`,
      this.shell(body),
      { replyTo: senderEmail, attachments: [qrAttachment] },
    );
  }

  /** Sends a 6-digit verification code for passwordless Web sign-in or booking confirmation. */
  async sendVerificationCodeEmail({
    email,
    code,
    purpose,
    hostName,
  }: {
    email: string;
    code: string;
    purpose: 'login' | 'booking';
    hostName?: string | null;
  }): Promise<void> {
    const heading = purpose === 'booking'
      ? 'Confirm your booking'
      : 'Your Cloud Calendars sign-in code';
    const intro = purpose === 'booking'
      ? `Enter this 6-digit verification code to confirm your appointment${hostName ? ` with ${hostName}` : ''}.`
      : 'Enter this 6-digit code in Cloud Calendars Web to access your calendar and bookings.';
    const body = `<h1 style="margin:4px 0 10px;font-size:25px;font-weight:800;color:#ffffff;text-align:center;">${this.esc(heading)}</h1>
    <p style="margin:0 auto 22px;max-width:42ch;color:rgba(255,255,255,0.72);font-size:15px;text-align:center;">${this.esc(intro)}</p>
    <div style="margin:0 auto 22px;max-width:280px;padding:18px 20px;border-radius:16px;background:rgba(255,255,255,0.10);border:1px solid rgba(255,255,255,0.18);text-align:center;">
      <div style="font-family:'SF Mono',Menlo,Consolas,monospace;font-size:32px;font-weight:800;letter-spacing:0.28em;color:#ffffff;padding-left:0.28em;">${this.esc(code)}</div>
    </div>
    <p style="margin:0;text-align:center;color:rgba(255,255,255,0.5);font-size:12px;">Valid for 10 minutes. If you didn’t request this code, you can safely ignore this message.</p>`;

    const subject = purpose === 'booking'
      ? `${code} is your Cloud Calendars booking verification code`
      : `${code} is your Cloud Calendars sign-in code`;
    await this.sendEmail(email, subject, this.shell(body));
  }

  /** Sends booking confirmation, reschedule, or cancellation notice to the invitee/guest. */
  async sendBookingInviteeNotification({
    kind,
    event,
    hostName,
    hostEmail,
    guestName,
    guestEmail,
    timeZone,
    webcalUrl,
    icsContent,
    manageUrl,
    guestPortalUrl,
    videoCallURL,
    reason,
  }: {
    kind: 'confirmed' | 'rescheduled' | 'cancelled';
    event: any;
    hostName: string;
    hostEmail?: string | null;
    guestName: string;
    guestEmail: string;
    timeZone?: string;
    webcalUrl?: string | null;
    icsContent?: string | null;
    manageUrl: string;
    guestPortalUrl?: string | null;
    videoCallURL?: string | null;
    reason?: string | null;
  }): Promise<void> {
    const dt = this.fmtAppClipEvent(event.start, event.end, timeZone, Boolean(event.allDay));
    const tzLabel = timeZone || 'UTC';
    const timeText = dt.time ? `${dt.time} (${tzLabel})` : tzLabel;
    const color = this.validEventColor(event.color ?? event.details?.color ?? this.ACCENT);

    const headingMap = {
      confirmed: 'Meeting confirmed',
      rescheduled: 'Meeting rescheduled',
      cancelled: 'Meeting cancelled',
    };
    const introMap = {
      confirmed: `Hi ${guestName}, your meeting with ${hostName} is scheduled and locked in.`,
      rescheduled: `Hi ${guestName}, your meeting with ${hostName} has been moved to a new time.`,
      cancelled: `Hi ${guestName}, this meeting with ${hostName} has been cancelled.`,
    };
    const subjectMap = {
      confirmed: `Confirmed: ${event.title} with ${hostName}`,
      rescheduled: `Rescheduled: ${event.title} with ${hostName}`,
      cancelled: `Cancelled: ${event.title} with ${hostName}`,
    };

    const locText = videoCallURL || event.location || null;
    let body = `<h1 style="margin:4px 0 8px;font-size:26px;font-weight:800;color:#ffffff;text-align:center;">${this.esc(headingMap[kind])}</h1>
    <p style="margin:0 auto 20px;max-width:44ch;color:rgba(255,255,255,0.74);font-size:15px;text-align:center;">${this.esc(introMap[kind])}</p>
    ${this.appClipEventBlock({
      title: event.title,
      date: dt.date,
      time: timeText,
      location: locText,
      eventColor: color,
    })}`;

    if (reason) {
      body += `<div style="margin:14px 0 0;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.82);font-size:13px;"><strong>Note:</strong> ${this.esc(reason)}</div>`;
    }

    if (kind !== 'cancelled') {
      body += `<div style="text-align:center;margin:24px 0 0;">
        ${videoCallURL ? `<div style="margin-bottom:12px;">${this.button(videoCallURL, 'Join video call')}</div>` : ''}
        ${webcalUrl ? `<div>${this.button(webcalUrl, 'Subscribe in Calendar')}</div>` : ''}
      </div>
      <p style="margin:18px 0 0;text-align:center;color:rgba(255,255,255,0.62);font-size:13px;">
        Need to change plans? <a href="${this.esc(manageUrl)}" style="color:${this.ACCENT};text-decoration:underline;">Reschedule or cancel</a>
        ${guestPortalUrl ? ` · <a href="${this.esc(guestPortalUrl)}" style="color:${this.ACCENT};text-decoration:underline;">All my bookings</a>` : ''}
      </p>`;
    } else if (guestPortalUrl) {
      body += `<p style="margin:18px 0 0;text-align:center;color:rgba(255,255,255,0.62);font-size:13px;">
        <a href="${this.esc(guestPortalUrl)}" style="color:${this.ACCENT};text-decoration:underline;">View my bookings or book a new time</a>
      </p>`;
    }

    const attachments: Attachment[] = [];
    if (icsContent) {
      attachments.push({
        RawContent: Buffer.from(icsContent, 'utf8'),
        FileName: 'meeting.ics',
        ContentType: 'text/calendar; charset=utf-8; method=PUBLISH',
        ContentDisposition: 'ATTACHMENT',
      });
    }

    await this.sendEmail(guestEmail, subjectMap[kind], this.shell(body), {
      replyTo: hostEmail ?? undefined,
      attachments: attachments.length ? attachments : undefined,
    });
  }

  /** Sends booking activity notification to the calendar owner/host. */
  async sendBookingHostNotification({
    kind,
    event,
    hostEmail,
    guestName,
    guestEmail,
    guestNotes,
    timeZone,
    studioUrl,
    reason,
  }: {
    kind: 'confirmed' | 'rescheduled' | 'cancelled';
    event: any;
    hostEmail: string;
    guestName: string;
    guestEmail: string;
    guestNotes?: string | null;
    timeZone?: string;
    studioUrl: string;
    reason?: string | null;
  }): Promise<void> {
    const dt = this.fmtAppClipEvent(event.start, event.end, timeZone, Boolean(event.allDay));
    const tzLabel = timeZone || 'UTC';
    const timeText = dt.time ? `${dt.time} (${tzLabel})` : tzLabel;
    const color = this.validEventColor(event.color ?? event.details?.color ?? this.ACCENT);

    const headingMap = {
      confirmed: 'New booking received',
      rescheduled: 'Booking moved',
      cancelled: 'Booking cancelled',
    };
    const introMap = {
      confirmed: `${guestName} (${guestEmail}) booked a time on your Cloud Calendars schedule.`,
      rescheduled: `Your meeting with ${guestName} (${guestEmail}) was moved to a new slot.`,
      cancelled: `Your meeting with ${guestName} (${guestEmail}) was cancelled.`,
    };
    const subjectMap = {
      confirmed: `New booking: ${guestName} — ${event.title}`,
      rescheduled: `Moved: ${guestName} — ${event.title}`,
      cancelled: `Cancelled: ${guestName} — ${event.title}`,
    };

    let body = `<h1 style="margin:4px 0 8px;font-size:25px;font-weight:800;color:#ffffff;text-align:center;">${this.esc(headingMap[kind])}</h1>
    <p style="margin:0 auto 20px;max-width:44ch;color:rgba(255,255,255,0.74);font-size:15px;text-align:center;">${this.esc(introMap[kind])}</p>
    ${this.appClipEventBlock({
      title: event.title,
      date: dt.date,
      time: timeText,
      location: event.details?.videoCallURL ?? event.location ?? null,
      eventColor: color,
    })}`;

    if (guestNotes) {
      body += `<div style="margin:14px 0 0;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.86);font-size:13px;"><strong>Guest notes:</strong> ${this.esc(guestNotes)}</div>`;
    }
    if (reason) {
      body += `<div style="margin:10px 0 0;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.86);font-size:13px;"><strong>Reason:</strong> ${this.esc(reason)}</div>`;
    }
    body += `<div style="text-align:center;margin:24px 0 0;">${this.button(studioUrl, 'Open Web Calendar')}</div>`;

    await this.sendEmail(hostEmail, subjectMap[kind], this.shell(body), {
      replyTo: guestEmail,
    });
  }
}
