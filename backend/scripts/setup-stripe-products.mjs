#!/usr/bin/env node
/**
 * Syncs Cloud Calendars Web Studio products, prices ($1.99/mo & $19.99/yr),
 * and an isolated Billing Portal Configuration on the shared Stripe account.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-products.mjs
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe-products.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CATALOG_OUT_PATH = path.join(ROOT_DIR, 'data', 'stripe-catalog.json');

const secretKey = (process.env.STRIPE_SECRET_KEY || '').trim();
if (!secretKey) {
  console.error(
    'Error: STRIPE_SECRET_KEY is required.\nUsage: STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-products.mjs',
  );
  process.exit(1);
}

function appendForm(out, prefix, value) {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    value.forEach((v, i) => appendForm(out, `${prefix}[${i}]`, v));
    return;
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      appendForm(out, `${prefix}[${k}]`, v);
    }
    return;
  }
  out.append(prefix, String(value));
}

async function stripe(method, endpoint, params) {
  let url = `https://api.stripe.com/v1${endpoint}`;
  const headers = { Authorization: `Bearer ${secretKey}` };
  let body;
  if (params) {
    const form = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) appendForm(form, k, v);
    if (method === 'GET') {
      url += (url.includes('?') ? '&' : '?') + form.toString();
    } else {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      body = form.toString();
    }
  }
  const res = await fetch(url, { method, headers, body });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `Stripe HTTP ${res.status}`);
  }
  return data;
}

const PLANS = [
  {
    key: 'monthly',
    name: 'Cloud Calendars Web Studio — Monthly',
    description: 'Full access to Cloud Calendars Web Calendar, Event & Booking Studio ($1.99/month).',
    unitAmount: 199,
    interval: 'month',
  },
  {
    key: 'yearly',
    name: 'Cloud Calendars Web Studio — Yearly',
    description: 'Full access to Cloud Calendars Web Calendar, Event & Booking Studio ($19.99/year — save 16%).',
    unitAmount: 1999,
    interval: 'year',
  },
];

async function upsertPlan(plan) {
  const lookupKey = `cloud_calendars:${plan.key}`;
  const products = await stripe('GET', '/products', { active: true, limit: 100 });
  let product = (products.data || []).find((p) => p.metadata?.cloud_calendars_key === lookupKey);

  const metadata = {
    app: 'cloud_calendars',
    cloud_calendars_key: lookupKey,
    plan: plan.key,
  };

  if (product) {
    product = await stripe('POST', `/products/${product.id}`, {
      name: plan.name,
      description: plan.description,
      metadata,
    });
  } else {
    product = await stripe('POST', '/products', {
      name: plan.name,
      description: plan.description,
      metadata,
    });
  }

  const prices = await stripe('GET', '/prices', { product: product.id, active: true, limit: 100 });
  let price = (prices.data || []).find(
    (pr) =>
      pr.unit_amount === plan.unitAmount &&
      pr.currency === 'usd' &&
      pr.recurring?.interval === plan.interval &&
      pr.recurring?.interval_count === 1,
  );

  if (!price) {
    price = await stripe('POST', '/prices', {
      product: product.id,
      currency: 'usd',
      unit_amount: plan.unitAmount,
      tax_behavior: 'exclusive',
      recurring: { interval: plan.interval },
      metadata,
    });
  }

  return {
    productId: product.id,
    priceId: price.id,
    unitAmount: plan.unitAmount,
    interval: plan.interval,
  };
}

async function ensurePortalConfig(monthlyPlan, yearlyPlan) {
  const existing = await stripe('GET', '/billing_portal/configurations', { active: true, limit: 50 });
  const found = (existing.data || []).find((c) => c.metadata?.app === 'cloud_calendars');
  const payload = {
    business_profile: {
      headline: 'Cloud Calendars Web Studio — Manage your subscription',
      privacy_policy_url: 'https://www.cloud-calendars.com/privacy-policy/',
      terms_of_service_url: 'https://www.cloud-calendars.com/terms-of-service/',
    },
    default_return_url: 'https://www.cloud-calendars.com/calendar/',
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ['email', 'address', 'tax_id'],
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: {
        enabled: true,
        mode: 'at_period_end',
      },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ['price'],
        proration_behavior: 'create_prorations',
        products:
          monthlyPlan.productId === yearlyPlan.productId
            ? [{ product: monthlyPlan.productId, prices: [monthlyPlan.priceId, yearlyPlan.priceId] }]
            : [
                { product: monthlyPlan.productId, prices: [monthlyPlan.priceId] },
                { product: yearlyPlan.productId, prices: [yearlyPlan.priceId] },
              ],
      },
    },
    metadata: { app: 'cloud_calendars' },
  };

  if (found) {
    const updated = await stripe('POST', `/billing_portal/configurations/${found.id}`, payload);
    return updated.id;
  }
  const created = await stripe('POST', '/billing_portal/configurations', payload);
  return created.id;
}

async function main() {
  console.log('Syncing Cloud Calendars Web Studio products & prices with Stripe...');
  const livemode = /^(sk|rk)_live_/.test(secretKey);
  const plans = {};
  for (const p of PLANS) {
    plans[p.key] = await upsertPlan(p);
    console.log(
      `  [${p.key}] product=${plans[p.key].productId} price=${plans[p.key].priceId} ($${(p.unitAmount / 100).toFixed(2)}/${p.interval})`,
    );
  }
  const portalConfigurationId = await ensurePortalConfig(plans.monthly, plans.yearly);
  console.log(`  [portal] configuration=${portalConfigurationId}`);

  const catalog = {
    updatedAt: new Date().toISOString(),
    livemode,
    portalConfigurationId,
    plans,
  };
  fs.mkdirSync(path.dirname(CATALOG_OUT_PATH), { recursive: true });
  fs.writeFileSync(CATALOG_OUT_PATH, JSON.stringify(catalog, null, 2));
  console.log(`\nSaved catalog to ${CATALOG_OUT_PATH}`);
  console.log('\nLambda Environment Variables:');
  console.log(`  STRIPE_PRICE_MONTHLY_ID=${plans.monthly.priceId}`);
  console.log(`  STRIPE_PRICE_YEARLY_ID=${plans.yearly.priceId}`);
  console.log(`  STRIPE_PORTAL_CONFIGURATION_ID=${portalConfigurationId}`);
}

main().catch((err) => {
  console.error('Failed to setup Stripe catalog:', err);
  process.exit(1);
});
