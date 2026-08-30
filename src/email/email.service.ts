import { Injectable } from '@nestjs/common';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

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
  private readonly ses = this.EMAIL_FROM ? new SESv2Client({ region: this.EMAIL_REGION }) : null;

  private readonly ACCENT = '#5b9bff';
  private get LOGO_URL() { return `${this.SITE_URL}/icons/icon-192.png`; }

  mailConfigured(): boolean {
    return Boolean(this.EMAIL_FROM);
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!this.ses || !this.EMAIL_FROM) {
      console.log(`[email skipped — not configured] "${subject}" → ${to}`);
      return;
    }
    try {
      await this.ses.send(
        new SendEmailCommand({
          FromEmailAddress: this.EMAIL_FROM,
          Destination: { ToAddresses: [to] },
          Content: {
            Simple: {
              Subject: { Data: subject, Charset: 'UTF-8' },
              Body: { Html: { Data: html, Charset: 'UTF-8' } },
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

  private esc(s: unknown): string {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

  private detailRow(icon: string, text: string): string {
    return `<div style="margin-top:8px;color:#cdd9f2;font-size:14px;">${icon}&nbsp;&nbsp;${this.esc(text)}</div>`;
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
    const manageUrl = `${this.SITE_URL}/booking/manage?t=${manageToken}`;
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

  /** The passwordless sign-in link to the "my bookings" page. */
  async sendLoginLink(to: string, url: string): Promise<void> {
    const body = `<h1 style="margin:4px 0 8px;font-size:26px;font-weight:800;color:#ffffff;text-align:center;">Your bookings</h1>
    <p style="margin:0 auto 22px;max-width:40ch;color:rgba(255,255,255,0.68);font-size:15px;text-align:center;">Tap below to see and manage every meeting you’ve booked. This link works for 7 days.</p>
    <div style="text-align:center;margin:6px 0 0;">${this.button(url, 'View my bookings')}</div>
    <p style="margin:18px 0 0;text-align:center;color:rgba(255,255,255,0.45);font-size:12px;">If you didn’t ask for this, you can ignore it.</p>`;
    await this.sendEmail(to, 'Your Cloud Calendars bookings', this.shell(body));
  }
}
