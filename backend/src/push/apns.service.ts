import { Injectable } from '@nestjs/common';
import { createPrivateKey, sign } from 'node:crypto';
import { connect } from 'node:http2';

export type PushEnvironment = 'sandbox' | 'production';
export type APNsResult = { status: number; reason?: string; timestamp?: number };

/** Lambda encrypts these environment variables at rest. The .p8 never travels
 * through the app, source tree, deployment archive or notification queue. */
@Injectable()
export class APNsService {
  private cached?: { jwt: string; expires: number };

  get configured(): boolean {
    return Boolean(process.env.APNS_PRIVATE_KEY && process.env.APNS_KEY_ID && process.env.APNS_TEAM_ID);
  }

  private async authorization(): Promise<string> {
    if (this.cached && this.cached.expires > Date.now()) return this.cached.jwt;
    const credentials = {
      privateKey: process.env.APNS_PRIVATE_KEY,
      keyId: process.env.APNS_KEY_ID, teamId: process.env.APNS_TEAM_ID,
    };
    if (!/^[A-Z0-9]{10}$/.test(credentials.keyId ?? '')
        || !/^[A-Z0-9]{10}$/.test(credentials.teamId ?? '')
        || typeof credentials.privateKey !== 'string') throw new Error('APNs secret is incomplete');
    const iat = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'ES256', kid: credentials.keyId })).toString('base64url');
    const claims = Buffer.from(JSON.stringify({ iss: credentials.teamId, iat })).toString('base64url');
    const input = `${header}.${claims}`;
    const signature = sign('sha256', Buffer.from(input), {
      key: createPrivateKey(credentials.privateKey), dsaEncoding: 'ieee-p1363',
    }).toString('base64url');
    this.cached = { jwt: `${input}.${signature}`, expires: Date.now() + 45 * 60_000 };
    return this.cached.jwt;
  }

  async send(device: { token: string; environment: PushEnvironment }, payload: any, collapseId: string): Promise<APNsResult> {
    const jwt = await this.authorization();
    const body = JSON.stringify(payload);
    if (Buffer.byteLength(body) > 4096) throw new Error('APNs payload too large');
    // Both the environment and topic are allowlisted; never use a caller URL.
    const host = device.environment === 'sandbox' ? 'api.sandbox.push.apple.com' : 'api.push.apple.com';
    return new Promise((resolve, reject) => {
      const session = connect(`https://${host}`);
      const timer = setTimeout(() => finish(new Error('APNs timeout')), 8_000);
      let completed = false;
      const finish = (error?: Error, result?: APNsResult) => {
        if (completed) return;
        completed = true;
        clearTimeout(timer);
        session.destroy();
        if (error) reject(error); else resolve(result!);
      };
      session.on('error', () => finish(new Error('APNs connection failed')));
      const request = session.request({
        ':method': 'POST', ':path': `/3/device/${device.token}`,
        authorization: `bearer ${jwt}`,
        'apns-topic': 'Deksan.CalendarASD',
        'apns-push-type': 'alert', 'apns-priority': '10',
        'apns-expiration': String(Math.floor(Date.now() / 1000) + 86400),
        'apns-collapse-id': collapseId,
      });
      let status = 0;
      let response = '';
      request.on('response', (headers) => { status = Number(headers[':status']); });
      request.setEncoding('utf8');
      request.on('data', (chunk) => { if (response.length < 8192) response += chunk; });
      request.on('error', () => finish(new Error('APNs request failed')));
      request.on('end', () => {
        let details: any = {};
        try { details = JSON.parse(response || '{}'); } catch { /* no response body on success */ }
        if (status === 403) this.cached = undefined;
        finish(undefined, { status, reason: details.reason, timestamp: details.timestamp });
      });
      request.end(body);
    });
  }
}
