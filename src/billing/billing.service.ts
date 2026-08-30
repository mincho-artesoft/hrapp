import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { StoreService } from '../store/store.service';
import { CoreService } from '../core/core.service';
import { ApiResult, result } from '../common/api-result';

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY ?? null;
const STRIPE_PRICE = process.env.STRIPE_PRICE_ID ?? null;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? null;

@Injectable()
export class BillingService {
  constructor(private readonly store: StoreService, private readonly core: CoreService) {}

  private get keys() { return this.store.keys; }
  private get SITE_URL() { return this.core.SITE_URL; }

  /** POST /billing/checkout — start a Stripe subscription for a web owner. Authed. */
  async billingCheckout(principal: any, body: any): Promise<ApiResult> {
    if (!STRIPE_SECRET || !STRIPE_PRICE) return result(501, { error: 'billing not configured' });
    const returnPath = typeof body.returnPath === 'string' ? body.returnPath : '/book/setup';
    const params = new URLSearchParams();
    params.set('mode', 'subscription');
    params.set('line_items[0][price]', STRIPE_PRICE);
    params.set('line_items[0][quantity]', '1');
    params.set('client_reference_id', principal.principalId);
    params.set('success_url', `${this.SITE_URL}${returnPath}?paid=1`);
    params.set('cancel_url', `${this.SITE_URL}${returnPath}?paid=0`);
    if (body.email) params.set('customer_email', String(body.email));
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${STRIPE_SECRET}`,
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });
    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) return result(502, { error: data.error?.message ?? 'stripe error' });
    return result(200, { url: data.url });
  }

  /** POST /billing/webhook — Stripe reports a subscription starting or ending.
   *  Public, signed against the exact raw bytes Stripe sent. */
  async billingWebhook(rawBody: string, signature: string | undefined): Promise<ApiResult> {
    if (!STRIPE_WEBHOOK_SECRET) return result(501, { error: 'billing not configured' });
    const raw = rawBody ?? '';
    if (!this.verifyStripeSignature(raw, signature, STRIPE_WEBHOOK_SECRET)) return result(400, { error: 'bad signature' });

    let evt: any;
    try {
      evt = JSON.parse(raw);
    } catch {
      return result(400, { error: 'bad payload' });
    }
    const obj = evt.data?.object ?? {};
    if (evt.type === 'checkout.session.completed') {
      if (obj.client_reference_id) {
        await this.core.grantEntitlement(obj.client_reference_id, 'web-paid', 'stripe');
        if (obj.customer) await this.store.putJSON(this.keys.stripeCustomer(obj.customer), { principalId: obj.client_reference_id });
      }
    } else if (evt.type === 'customer.subscription.deleted') {
      const link = obj.customer ? await this.store.getJSON(this.keys.stripeCustomer(obj.customer)) : null;
      if (link?.principalId) await this.core.grantEntitlement(link.principalId, 'none', 'stripe-cancel');
    }
    return result(200, { received: true });
  }

  private verifyStripeSignature(raw: string, header: string | undefined, secret: string): boolean {
    if (!header || !raw) return false;
    const parts: any = Object.fromEntries(String(header).split(',').map((kv) => kv.split('=')));
    if (!parts.t || !parts.v1) return false;
    const expected = createHmac('sha256', secret).update(`${parts.t}.${raw}`).digest('hex');
    try {
      return timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
    } catch {
      return false;
    }
  }
}
