import { Injectable } from '@nestjs/common';
import { StoreService } from '../store/store.service';
import { CoreService } from '../core/core.service';
import { ApiResult, result } from '../common/api-result';
import { randomId, hashKey } from '../util/ids';

const PAIR_TTL_SECONDS = 300;

@Injectable()
export class PairingService {
  constructor(private readonly store: StoreService, private readonly core: CoreService) {}

  private get keys() { return this.store.keys; }

  /** POST /pair/start — a browser asks for a QR code to pair with the app. Public. */
  async pairStart(): Promise<ApiResult> {
    const code = randomId(10);
    const secret = randomId(32);
    const now = Date.now();
    await this.store.putJSON(this.keys.pair(code), {
      status: 'pending',
      secretHash: hashKey(secret),
      createdAt: new Date(now).toISOString(),
      expiresAt: now + PAIR_TTL_SECONDS * 1000,
    });
    return result(201, { code, secret, expiresInSeconds: PAIR_TTL_SECONDS });
  }

  /** POST /pair/approve — the installed app approves a code it scanned. Owner-authed. */
  async pairApprove(principal: any, body: any): Promise<ApiResult> {
    const code = String(body.code ?? '').trim();
    const rec = await this.store.getJSON(this.keys.pair(code));
    if (!rec) return result(404, { error: 'no such pairing code' });
    if (rec.status !== 'pending') return result(409, { error: 'pairing code already used' });
    if (Date.now() > rec.expiresAt) return result(410, { error: 'pairing code expired' });

    const webToken = await this.core.issueToken(principal.principalId, principal.calId);
    await this.core.grantEntitlement(principal.principalId, 'app', 'pair');
    Object.assign(rec, {
      status: 'approved',
      calId: principal.calId,
      principalId: principal.principalId,
      webToken,
      approvedAt: new Date().toISOString(),
    });
    await this.store.putJSON(this.keys.pair(code), rec);
    return result(200, { ok: true });
  }

  /** GET /pair/status?code=&secret= — the browser polls until the app approves. Public. */
  async pairStatus(query: any): Promise<ApiResult> {
    const code = String(query.code ?? '').trim();
    const secret = String(query.secret ?? '');
    const rec = await this.store.getJSON(this.keys.pair(code));
    if (!rec) return result(404, { error: 'no such pairing code' });
    if (rec.secretHash !== hashKey(secret)) return result(403, { error: 'bad secret' });
    if (rec.status === 'pending' && Date.now() > rec.expiresAt) return result(200, { status: 'expired' });
    if (rec.status !== 'approved') return result(200, { status: rec.status });

    // Reveal the web token exactly once, then blank it.
    const webToken = rec.webToken;
    rec.webToken = null;
    rec.status = 'claimed';
    await this.store.putJSON(this.keys.pair(code), rec);
    return result(200, { status: 'approved', webToken, calId: rec.calId });
  }
}
