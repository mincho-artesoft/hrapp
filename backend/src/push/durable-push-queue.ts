import { randomUUID } from 'node:crypto';
import { StoreService } from '../store/store.service';

const prefix = 'push/queue/';
/** Hetzner-backed queue. CAS leases survive process restarts and concurrent workers. */
export class DurablePushQueue {
  private draining = false;
  constructor(private readonly store: StoreService, private readonly dispatch: (job: any) => Promise<void>,
    private readonly now = () => Date.now()) {}

  async enqueue(job: { id: string }) {
    if (!/^[0-9a-f-]{36}$/i.test(job.id)) throw new Error('Invalid push job id');
    await this.store.putJSONIfAbsent(`${prefix}${job.id}.json`, { job, attempts: 0, nextAttempt: 0, leaseUntil: 0 });
  }

  async drain() {
    if (this.draining) return;
    this.draining = true;
    try {
      let processed = 0;
      for (const key of await this.store.listKeys(prefix)) {
        const entry = await this.store.getJSONWithETag(key);
        if (!entry || entry.value.nextAttempt > this.now() || entry.value.leaseUntil > this.now()) continue;
        const claim = { ...entry.value, lease: randomUUID(), leaseUntil: this.now() + 300_000 };
        if (!await this.store.putJSONIfMatch(key, claim, entry.etag)) continue;
        processed++;
        let delivered = false;
        try { await this.dispatch(claim.job); delivered = true; } catch { /* durable retry below */ }
        const current = await this.store.getJSONWithETag(key);
        if (!current || current.value.lease !== claim.lease) continue;
        if (delivered) {
          await this.store.del(key);
        } else {
          const attempts = claim.attempts + 1;
          await this.store.putJSONIfMatch(key, { ...claim, attempts, leaseUntil: 0,
            nextAttempt: this.now() + Math.min(3_600_000, 5_000 * 2 ** Math.min(attempts, 10)) }, current.etag);
        }
        if (processed >= 100) break;
      }
    } finally { this.draining = false; }
  }
}
