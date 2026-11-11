import { createPublicKey, verify as cryptoVerify } from 'node:crypto';

const GOOGLE_JWKS = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_USERINFO = 'https://openidconnect.googleapis.com/v1/userinfo';
const GOOGLE_TOKENINFO = 'https://oauth2.googleapis.com/tokeninfo';
const GOOGLE_ISSUERS = new Set(['accounts.google.com', 'https://accounts.google.com']);
const APPLE_JWKS = 'https://appleid.apple.com/auth/keys';
const APPLE_ISSUER = 'https://appleid.apple.com';
const GRAPH_ME = 'https://graph.microsoft.com/v1.0/me';

// Google rotates signing keys, so the set is refetched - but not per request,
// which would add a round trip to every call and hammer their endpoint. The
// cache honours their Cache-Control, falling back to an hour.
let jwksCache: { keys: any[] | null; expiresAt: number } = { keys: null, expiresAt: 0 };
let appleJwksCache: { keys: any[] | null; expiresAt: number } = { keys: null, expiresAt: 0 };

async function googleKeys(): Promise<any[]> {
  if (jwksCache.keys && Date.now() < jwksCache.expiresAt) return jwksCache.keys;

  const res = await fetch(GOOGLE_JWKS);
  if (!res.ok) throw new Error(`jwks fetch failed: ${res.status}`);
  const body: any = await res.json();

  const maxAge = /max-age=(\d+)/.exec(res.headers.get('cache-control') ?? '');
  const ttl = maxAge ? Number(maxAge[1]) * 1000 : 3600_000;

  jwksCache = { keys: body.keys, expiresAt: Date.now() + ttl };
  return body.keys;
}

async function appleKeys(): Promise<any[]> {
  if (appleJwksCache.keys && Date.now() < appleJwksCache.expiresAt) return appleJwksCache.keys;

  const res = await fetch(APPLE_JWKS);
  if (!res.ok) throw new Error(`apple jwks fetch failed: ${res.status}`);
  const body: any = await res.json();
  const maxAge = /max-age=(\d+)/.exec(res.headers.get('cache-control') ?? '');
  const ttl = maxAge ? Number(maxAge[1]) * 1000 : 3600_000;
  appleJwksCache = { keys: body.keys, expiresAt: Date.now() + ttl };
  return body.keys;
}

const b64urlToBuffer = (s: string) => Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const b64urlToJSON = (s: string) => JSON.parse(b64urlToBuffer(s).toString('utf8'));

/**
 * Verifies a Google ID token (RS256 JWT) or Google OAuth2 access token and returns its stable subject.
 *
 * Accepts either a single audience string or an array of allowed client IDs (e.g. iOS + Web client IDs).
 */
export async function verifyGoogleIdToken(
  tokenOrIdToken: string,
  audience?: string | string[] | null,
): Promise<any> {
  const raw = String(tokenOrIdToken ?? '').trim();
  const allowedAudiences = Array.isArray(audience)
    ? audience.map((a) => String(a ?? '').trim()).filter(Boolean)
    : audience
      ? String(audience).split(',').map((a) => a.trim()).filter(Boolean)
      : [];

  const parts = raw.split('.');
  // Web GIS TokenClient returns an OAuth2 access_token (ya29....) rather than a 3-part JWT when
  // calendar scopes are requested alongside openid/email/profile. Verify it against Google's OIDC userinfo
  // AND check aud via tokeninfo when audiences are pinned.
  if (parts.length !== 3) {
    if (!raw.startsWith('ya29.')) throw new Error('malformed token');
    if (allowedAudiences.length > 0) {
      const tiRes = await fetch(`${GOOGLE_TOKENINFO}?access_token=${encodeURIComponent(raw)}`);
      if (!tiRes.ok) throw new Error(`google tokeninfo rejected token: ${tiRes.status}`);
      const ti: any = await tiRes.json();
      const candidateAuds = [ti.aud, ti.azp, ti.issued_to]
        .map((x) => String(x ?? '').trim())
        .filter(Boolean);
      if (!candidateAuds.some((a) => allowedAudiences.includes(a))) {
        throw new Error('audience mismatch');
      }
    }
    const uiRes = await fetch(GOOGLE_USERINFO, {
      headers: { Authorization: `Bearer ${raw}` },
    });
    if (!uiRes.ok) throw new Error(`google userinfo rejected token: ${uiRes.status}`);
    const ui: any = await uiRes.json();
    if (!ui.sub) throw new Error('token carries no subject');
    if (ui.email && ui.email_verified !== true && ui.email_verified !== 'true') {
      throw new Error('email is not verified');
    }
    return {
      provider: 'google',
      subject: ui.sub,
      email: ui.email ?? null,
      name: ui.name ?? null,
      picture: ui.picture ?? null,
    };
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  const header = b64urlToJSON(headerB64);
  const payload = b64urlToJSON(payloadB64);

  if (header.alg !== 'RS256') throw new Error(`unexpected alg ${header.alg}`);

  const jwk = (await googleKeys()).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('signing key not found');

  const ok = cryptoVerify(
    'RSA-SHA256',
    Buffer.from(`${headerB64}.${payloadB64}`),
    createPublicKey({ key: jwk, format: 'jwk' }),
    b64urlToBuffer(signatureB64),
  );
  if (!ok) throw new Error('bad signature');

  if (!GOOGLE_ISSUERS.has(payload.iss)) throw new Error(`unexpected issuer ${payload.iss}`);
  if (allowedAudiences.length > 0 && !allowedAudiences.includes(payload.aud)) {
    throw new Error('audience mismatch');
  }
  if (!payload.exp || payload.exp * 1000 < Date.now()) throw new Error('token expired');
  if (!payload.sub) throw new Error('token carries no subject');
  if (payload.email && payload.email_verified !== true && payload.email_verified !== 'true') {
    throw new Error('email is not verified');
  }

  return {
    provider: 'google',
    subject: payload.sub,
    email: payload.email ?? null,
    name: payload.name ?? null,
    picture: payload.picture ?? null,
  };
}

/** Verifies the identity token returned by native Sign in with Apple. */
export async function verifyAppleIdToken(idToken: string, audiences: string[]): Promise<any> {
  const parts = String(idToken ?? '').split('.');
  if (parts.length !== 3) throw new Error('malformed token');

  const [headerB64, payloadB64, signatureB64] = parts;
  const header = b64urlToJSON(headerB64);
  const payload = b64urlToJSON(payloadB64);
  if (header.alg !== 'RS256') throw new Error(`unexpected alg ${header.alg}`);

  const jwk = (await appleKeys()).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('apple signing key not found');
  const ok = cryptoVerify(
    'RSA-SHA256',
    Buffer.from(`${headerB64}.${payloadB64}`),
    createPublicKey({ key: jwk, format: 'jwk' }),
    b64urlToBuffer(signatureB64),
  );
  if (!ok) throw new Error('bad signature');

  if (payload.iss !== APPLE_ISSUER) throw new Error(`unexpected issuer ${payload.iss}`);
  if (audiences.length > 0 && !audiences.includes(payload.aud)) throw new Error('audience mismatch');
  if (!payload.exp || payload.exp * 1000 < Date.now()) throw new Error('token expired');
  if (!payload.sub) throw new Error('token carries no subject');
  if (payload.email && payload.email_verified !== true && payload.email_verified !== 'true') {
    throw new Error('email is not verified');
  }

  return { provider: 'apple', subject: payload.sub, email: payload.email ?? null };
}

/**
 * Microsoft access tokens are issued for Graph, not for us, so validating the
 * signature locally is the wrong move - Microsoft explicitly says third
 * parties must not. Calling Graph with it is the supported check: a 200 proves
 * the token is live and tells us whose it is.
 */
export async function verifyMicrosoftToken(accessToken: string): Promise<any> {
  const res = await fetch(GRAPH_ME, { headers: { authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`graph rejected the token: ${res.status}`);
  const me: any = await res.json();
  if (!me.id) throw new Error('graph returned no id');
  return {
    provider: 'microsoft',
    subject: me.id,
    email: me.mail ?? me.userPrincipalName ?? null,
    name: me.displayName ?? null,
  };
}
