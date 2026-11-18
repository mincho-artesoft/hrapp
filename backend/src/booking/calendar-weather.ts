import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { sign } from 'node:crypto';

const ttl = 10 * 60_000;
const forecasts = new Map<string, {expires: number; result: Promise<unknown>}>();

function coordinate(input: unknown, limit: number): string {
  if (typeof input !== 'string' || !input.trim() || !Number.isFinite(Number(input)) || Math.abs(Number(input)) > limit)
    throw new BadRequestException('Invalid forecast coordinates.');
  return Number(input).toFixed(2);
}

function authorization(): string {
  const issuer = process.env.APNS_TEAM_ID, kid = process.env.APNS_KEY_ID, key = process.env.APNS_PRIVATE_KEY;
  if (!issuer || !kid || !key) throw new ServiceUnavailableException('Forecast service unavailable.');
  const subject = process.env.APPLE_WEB_CLIENT_ID || 'Deksan.CalendarASD.web';
  const iat = Math.floor(Date.now() / 1000);
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const header = encode({alg: 'ES256', kid, id: issuer + '.' + subject});
  const claims = encode({iss: issuer, sub: subject, iat, exp: iat + 300});
  const input = header + '.' + claims;
  const signature = sign('sha256', Buffer.from(input), {key, dsaEncoding: 'ieee-p1363'});
  return input + '.' + signature.toString('base64url');
}

export async function calendarWeather(query: Record<string, unknown>): Promise<unknown> {
  const lat = coordinate(query.latitude, 90), lon = coordinate(query.longitude, 180);
  const language = typeof query.language === 'string' && /^[a-z]{2,3}(-[a-zA-Z]{2,8})*$/.test(query.language)
    ? query.language : 'en';
  let timezone: string;
  try { timezone = new Intl.DateTimeFormat('en', {timeZone: String(query.timezone || 'UTC')}).resolvedOptions().timeZone; }
  catch { throw new BadRequestException('Invalid forecast time zone.'); }
  const params = new URLSearchParams({timezone, dataSets: 'currentWeather,forecastDaily,forecastHourly,weatherAlerts'});
  if (typeof query.country === 'string' && /^[A-Z]{2}$/.test(query.country)) params.set('country', query.country);
  const url = 'https://weatherkit.apple.com/api/v1/weather/' + language + '/' + lat + '/' + lon + '?' + params;
  const hit = forecasts.get(url);
  if (hit && hit.expires > Date.now()) return hit.result;
  if (forecasts.size >= 64) forecasts.delete(forecasts.keys().next().value!);
  const result = fetch(url, {headers: {Authorization: 'Bearer ' + authorization()}, signal: AbortSignal.timeout(7000)})
    .then(async response => {
      if (!response.ok) throw new Error('Forecast unavailable');
      return response.json();
    });
  forecasts.set(url, {expires: Date.now() + ttl, result});
  try { return await result; }
  catch {
    if (forecasts.get(url)?.result === result) forecasts.delete(url);
    throw new ServiceUnavailableException('Forecast service unavailable.');
  }
}
