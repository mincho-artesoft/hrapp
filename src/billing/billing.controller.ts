import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { BillingService } from './billing.service';
import { AuthGuard } from '../common/auth.guard';
import { reply } from '../common/api-result';

@Controller('billing')
export class BillingController {
  constructor(private readonly svc: BillingService) {}

  // Public, but signed: Stripe posts the exact bytes it signed, so the raw body
  // (captured via NestFactory `rawBody: true`) is what the signature verifies.
  @Post('webhook')
  async webhook(@Req() req: Request & { rawBody?: Buffer }, @Res({ passthrough: true }) res: Response) {
    const raw = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body ?? {});
    const signature = (req.headers['stripe-signature'] as string) ?? (req.headers['Stripe-Signature'] as any);
    return reply(res, await this.svc.billingWebhook(raw, signature));
  }

  @Post('checkout')
  @UseGuards(AuthGuard)
  async checkout(@Req() req: any, @Body() body: any, @Res({ passthrough: true }) res: Response) {
    return reply(res, await this.svc.billingCheckout(req.principal, body ?? {}));
  }
}
