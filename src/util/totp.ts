import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function encodeBase32(bytes: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < bytes.length; i += 1) {
    value = (value << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

export function decodeBase32(encoded: string): Buffer {
  const cleaned = String(encoded ?? '')
    .toUpperCase()
    .replace(/[\s=-]+/g, '');
  if (!cleaned) return Buffer.alloc(0);

  let bits = 0;
  let value = 0;
  const out: number[] = [];

  for (let i = 0; i < cleaned.length; i += 1) {
    const idx = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (idx === -1) {
      throw new Error('Invalid Base32 character in TOTP secret.');
    }
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

/**
 * Generates a 160-bit (20-byte) RFC 6238 Base32 secret (32 characters).
 */
export function generateTotpSecret(byteLength = 20): string {
  return encodeBase32(randomBytes(byteLength));
}

export function computeTotpAtStep(secretBase32: string, step: number, digits = 6): string {
  const key = decodeBase32(secretBase32);
  if (!key.length) {
    throw new Error('Empty TOTP secret.');
  }
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.max(0, Math.floor(step))));

  const digest = createHmac('sha1', key).update(counter).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const mod = 10 ** digits;
  return String(binary % mod).padStart(digits, '0');
}

export function computeTotpCode(
  secretBase32: string,
  nowMs = Date.now(),
  periodSeconds = 30,
  digits = 6,
): { code: string; step: number; secondsRemaining: number } {
  const nowSec = Math.floor(nowMs / 1000);
  const step = Math.floor(nowSec / periodSeconds);
  const secondsRemaining = periodSeconds - (nowSec % periodSeconds);
  return {
    code: computeTotpAtStep(secretBase32, step, digits),
    step,
    secondsRemaining,
  };
}

export function verifyTotpCode(
  secretBase32: string,
  candidateCode: string,
  opts?: {
    nowMs?: number;
    periodSeconds?: number;
    digits?: number;
    window?: number;
    lastAcceptedStep?: number | null;
  },
): { valid: boolean; matchedStep?: number } {
  const digits = opts?.digits ?? 6;
  const normalized = String(candidateCode ?? '').replace(/\s+/g, '');
  if (!new RegExp(`^\\d{${digits}}$`).test(normalized)) {
    return { valid: false };
  }

  const nowMs = opts?.nowMs ?? Date.now();
  const periodSeconds = opts?.periodSeconds ?? 30;
  const window = opts?.window ?? 1;
  const lastAcceptedStep = opts?.lastAcceptedStep ?? null;
  const currentStep = Math.floor(nowMs / 1000 / periodSeconds);

  const candidateBuf = Buffer.from(normalized, 'utf8');
  for (let delta = -window; delta <= window; delta += 1) {
    const step = currentStep + delta;
    if (step < 0) continue;
    if (typeof lastAcceptedStep === 'number' && step <= lastAcceptedStep) {
      continue;
    }
    const expected = Buffer.from(computeTotpAtStep(secretBase32, step, digits), 'utf8');
    if (expected.length === candidateBuf.length && timingSafeEqual(expected, candidateBuf)) {
      return { valid: true, matchedStep: step };
    }
  }

  return { valid: false };
}

export function buildOtpAuthUri(params: {
  email: string;
  secret: string;
  issuer?: string;
  periodSeconds?: number;
  digits?: number;
}): string {
  const issuer = params.issuer ?? 'Cloud Calendars';
  const period = params.periodSeconds ?? 30;
  const digits = params.digits ?? 6;
  const label = `${encodeURIComponent(issuer)}:${encodeURIComponent(params.email)}`;
  const qs = new URLSearchParams({
    secret: params.secret,
    issuer,
    algorithm: 'SHA1',
    digits: String(digits),
    period: String(period),
  });
  return `otpauth://totp/${label}?${qs.toString()}`;
}
