import { createHash } from 'node:crypto';
import type { Response } from 'express';
import type { ApiResult } from '../common/api-result';
import { withStorageReadBatch } from '../store/calendar-storage-client';
import { storageReadRevisions } from '../store/store.service';

interface SerializedState {
  etag: string;
  json: string;
}

export class WebStateResponses {
  // At most eight 2 MiB snapshots per warm worker. The AuthGuard has already
  // resolved the bearer token anew before every lookup, including a 304.
  private readonly cached = new Map<string, { revision: string; state: SerializedState }>();

  async reply(principal: any, query: Record<string, unknown>, ifNoneMatch: string | undefined,
              res: Response, load: () => Promise<ApiResult>): Promise<string | undefined> {
    res.set('Cache-Control', 'private, no-store').vary('Authorization').type('application/json');
    const revision = query.sync === '0' && Object.keys(query).length === 1
      ? storageReadRevisions.get(principal) : undefined;
    const key = JSON.stringify([principal.principalId, principal.calId]);
    const entry = revision ? this.cached.get(key) : undefined;
    let state = entry?.revision === revision ? entry?.state : undefined;
    if (!state) {
      const response = await withStorageReadBatch(load);
      const json = JSON.stringify(response.body);
      if (response.status !== 200) {
        res.status(response.status);
        return json;
      }
      const digest = createHash('sha256').update(json).digest('base64url');
      state = {json, etag: 'W/"' + digest + '"'};
      if (revision && Buffer.byteLength(json) <= 2 * 1024 * 1024) {
        this.cached.delete(key);
        if (this.cached.size >= 8) this.cached.delete(this.cached.keys().next().value);
        this.cached.set(key, {revision, state});
      }
    }
    res.set('ETag', state.etag).set('Access-Control-Expose-Headers', 'ETag');
    if (ifNoneMatch?.split(',').some(tag => tag.trim() === state.etag)) {
      res.status(304);
      return;
    }
    return state.json;
  }
}
