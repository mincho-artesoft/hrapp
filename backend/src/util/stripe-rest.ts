import { createHmac, timingSafeEqual } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

export class StripeRestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'StripeRestError';
  }
}

export function isStripeLiveKey(secretKey: string): boolean {
  return /^(sk|rk)_live_/.test(String(secretKey ?? '').trim());
}

function appendFormValue(out: URLSearchParams, prefix: string, value: any): void {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      appendFormValue(out, `${prefix}[${index}]`, item);
    });
    return;
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      appendFormValue(out, `${prefix}[${k}]`, v);
    }
    return;
  }
  out.append(prefix, String(value));
}

export function encodeStripeForm(params: Record<string, any>): URLSearchParams {
  const out = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    appendFormValue(out, key, value);
  }
  return out;
}

export async function stripeRequest<T = any>(params: {
  secretKey: string;
  method: 'GET' | 'POST';
  path: string;
  form?: Record<string, any>;
  idempotencyKey?: string;
  apiBase?: string;
}): Promise<T> {
  const base = (params.apiBase ?? process.env.STRIPE_API_BASE ?? 'https://api.stripe.com/v1').replace(/\/+$/, '');
  const url = `${base}${params.path.startsWith('/') ? params.path : `/${params.path}`}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${params.secretKey}`,
  };
  if (params.idempotencyKey) {
    headers['Idempotency-Key'] = params.idempotencyKey;
  }

  let finalUrl = url;
  let body: string | undefined;
  if (params.method === 'GET' && params.form) {
    const qs = encodeStripeForm(params.form).toString();
    if (qs) finalUrl += (finalUrl.includes('?') ? '&' : '?') + qs;
  } else if (params.method === 'POST' && params.form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = encodeStripeForm(params.form).toString();
  }

  const res = await fetch(finalUrl, {
    method: params.method,
    headers,
    body,
  });

  const payload: any = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = payload?.error?.message || `Stripe API HTTP ${res.status}`;
    throw new StripeRestError(res.status, msg, payload?.error?.code);
  }
  return payload as T;
}

export function verifyStripeWebhookEvent(params: {
  rawBody: Buffer | string;
  signatureHeader: string;
  webhookSecret: string;
  toleranceSeconds?: number;
  nowSeconds?: number;
}): any {
  const raw = Buffer.isBuffer(params.rawBody)
    ? params.rawBody.toString('utf8')
    : String(params.rawBody ?? '');
  const header = String(params.signatureHeader ?? '').trim();
  if (!raw || !header || !params.webhookSecret) {
    throw new StripeRestError(400, 'Missing Stripe webhook payload or signature.');
  }

  let timestamp = 0;
  const v1Signatures: string[] = [];
  for (const part of header.split(',')) {
    const eq = part.indexOf('=');
    if (eq <= 0) continue;
    const k = part.slice(0, eq).trim();
    const v = part.slice(eq + 1).trim();
    if (k === 't') timestamp = Number(v);
    else if (k === 'v1' && v) v1Signatures.push(v);
  }

  if (!Number.isFinite(timestamp) || timestamp <= 0 || v1Signatures.length === 0) {
    throw new StripeRestError(400, 'Invalid Stripe-Signature header format.');
  }

  const tolerance = params.toleranceSeconds ?? 300;
  const nowSec = params.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (tolerance > 0 && Math.abs(nowSec - timestamp) > tolerance) {
    throw new StripeRestError(400, 'Stripe webhook timestamp is outside tolerance window.');
  }

  const signedPayload = `${timestamp}.${raw}`;
  const expectedHex = createHmac('sha256', params.webhookSecret)
    .update(signedPayload, 'utf8')
    .digest('hex');
  const expectedBuf = Buffer.from(expectedHex, 'utf8');

  const matched = v1Signatures.some((sig) => {
    const sigBuf = Buffer.from(sig, 'utf8');
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });

  if (!matched) {
    throw new StripeRestError(400, 'Invalid Stripe webhook signature.');
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new StripeRestError(400, 'Malformed Stripe webhook JSON payload.');
  }
}

export interface LocalStripeCatalog {
  livemode?: boolean;
  portalConfigurationId?: string;
  plans?: {
    monthly?: { priceId?: string; productId?: string; unitAmount?: number };
    yearly?: { priceId?: string; productId?: string; unitAmount?: number };
  };
}

export function loadLocalStripeEnv(): void {
  const candidates = [
    path.resolve(process.cwd(), '.local-secrets', 'stripe-live.env'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '..', '..', '.local-secrets', 'stripe-live.env'),
    path.resolve(__dirname, '..', '..', '.env'),
  ];
  for (const filePath of candidates) {
    try {
      if (!fs.existsSync(filePath)) continue;
      const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq <= 0) continue;
        const key = trimmed.slice(0, eq).trim();
        const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key && !(key in process.env)) {
          process.env[key] = val;
        }
      }
      return;
    } catch {
      // ignore missing/unreadable local env file
    }
  }
}

export function loadLocalStripeCatalog(secretKey: string): LocalStripeCatalog | null {
  const candidates = [
    path.resolve(process.cwd(), 'data', 'stripe-catalog.json'),
    path.resolve(__dirname, '..', '..', 'data', 'stripe-catalog.json'),
  ];
  for (const filePath of candidates) {
    try {
      if (!fs.existsSync(filePath)) continue;
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as LocalStripeCatalog;
      if (typeof parsed?.livemode === 'boolean' && parsed.livemode !== isStripeLiveKey(secretKey)) {
        continue;
      }
      return parsed;
    } catch {
      // ignore missing/corrupt file
    }
  }
  return null;
}
