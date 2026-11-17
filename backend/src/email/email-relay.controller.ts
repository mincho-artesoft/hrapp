import { Body, Controller, Headers, HttpException, Post } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';
import { EmailService } from './email.service';

/** Keep SES and its shared rate limits in AWS without exporting AWS credentials. */
@Controller('internal/email')
export class EmailRelayController {
  constructor(private readonly email: EmailService) {}

  @Post('deliver')
  async deliver(@Headers('authorization') auth: string, @Body() body: any) {
    const secret = process.env.EMAIL_RELAY_TOKEN;
    const hash = (value: string) => createHash('sha256').update(value).digest();
    if (!secret || secret.length < 32 || !timingSafeEqual(hash(auth ?? ''), hash(`Bearer ${secret}`))) {
      throw new HttpException({ error: 'unauthorized' }, 401);
    }
    if (typeof body?.to !== 'string' || typeof body?.subject !== 'string' || typeof body?.html !== 'string'
        || (body.replyTo != null && (typeof body.replyTo !== 'string' || /[\r\n\0]/.test(body.replyTo)))
        || (body.attachments != null && (!Array.isArray(body.attachments) || body.attachments.length > 10
          || body.attachments.some((a: any) => typeof a?.RawContent !== 'string' || typeof a?.FileName !== 'string')))) {
      throw new HttpException({ error: 'invalid email payload' }, 400);
    }
    try {
      await this.email.deliverThroughSES(body.to, body.subject, body.html, {
        replyTo: body.replyTo,
        attachments: body.attachments?.map((a: any) => ({ ...a, RawContent: Buffer.from(a.RawContent, 'base64') })),
      });
      return { delivered: true };
    } catch {
      throw new HttpException({ error: 'email delivery unavailable' }, 503);
    }
  }
}
