import { Injectable } from '@nestjs/common';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { randomUUID } from 'node:crypto';
import { APNsService, PushEnvironment } from './apns.service';
import { StoreService } from '../store/store.service';
import { hashKey } from '../util/ids';
import { ApiResult, result } from '../common/api-result';

type InvitationJob = {
  version: 1; id: string; kind: 'event' | 'calendar'; emailHash: string;
  ownerId: string; resourceId: string; createdAt: number;
};
const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();
const deviceKey = (id: string) => `push/devices/${id}.json`;
const principalDevices = (id: string) => `principal/${id}/push-devices/`;

@Injectable()
export class PushService {
  private readonly sqs = new SQSClient({});
  constructor(private readonly store: StoreService, private readonly apns: APNsService) {}

  get configured(): boolean { return Boolean(process.env.PUSH_QUEUE_URL) && this.apns.configured; }

  private identityHashes(account: any): Set<string> {
    return new Set(Object.values(account?.identities ?? {}).flatMap((identity: any) =>
      identity?.email ? [hashKey(normalize(identity.email))] : []));
  }

  /** Auth binds the account; the installation capability prevents somebody
   * guessing an installation ID from reassigning or disabling its device. */
  async register(principal: any, installationId: string, body: any): Promise<ApiResult> {
    if (!/^[0-9a-f-]{36}$/i.test(installationId)
        || !/^[0-9a-f]{64}$/i.test(body.secret ?? '')
        || !Number.isSafeInteger(body.revision) || body.revision < 1
        || typeof body.enabled !== 'boolean') return result(400, { error: 'invalid push installation' });
    const token = String(body.token ?? '').toLowerCase();
    const environment = body.environment as PushEnvironment;
    if (!/^[0-9a-f]{32,512}$/.test(token)
        || !['sandbox', 'production'].includes(environment)) return result(400, { error: 'invalid APNs registration' });
    const allowed = (process.env.APNS_ALLOWED_ENVIRONMENTS ?? 'sandbox').split(',');
    if (!allowed.includes(environment)) return result(400, { error: 'APNs environment is not enabled on this server' });
    const account = await this.store.getJSON(this.store.keys.principal(principal.principalId));
    if (this.identityHashes(account).size === 0) return result(403, { error: 'a verified account is required' });
    const secretHash = hashKey(body.secret);
    for (let attempt = 0; attempt < 5; attempt++) {
      const previous = await this.store.getJSONWithETag(deviceKey(installationId));
      if (previous && previous.value.secretHash !== secretHash) return result(403, { error: 'invalid installation capability' });
      if (previous && previous.value.revision >= body.revision) return result(409, { error: 'stale push registration' });
      const record = {
        installationId, secretHash, revision: body.revision, principalId: principal.principalId,
        token, environment, enabled: body.enabled, registeredAt: Date.now(),
      };
      const saved = previous
        ? await this.store.putJSONIfMatch(deviceKey(installationId), record, previous.etag)
        : await this.store.putJSONIfAbsent(deviceKey(installationId), record);
      if (!saved) continue;
      await this.store.putJSON(`${principalDevices(principal.principalId)}${installationId}.json`, { installationId });
      // An old index is harmless: dispatch always rechecks canonical ownership.
      if (previous && previous.value.principalId !== principal.principalId) {
        await this.store.del(`${principalDevices(previous.value.principalId)}${installationId}.json`);
      }
      return result(200, { registered: true, remoteInvitations: this.configured && body.enabled });
    }
    return result(409, { error: 'push registration changed; retry' });
  }

  /** Enqueue after the canonical invitation and recipient index are committed.
   * SQS owns retries independently of the API request and the sender app. */
  async enqueue(kind: 'event' | 'calendar', email: string, ownerId: string, resourceId: string): Promise<void> {
    if (!this.configured) return; // Existing production stays untouched until configured.
    const job: InvitationJob = {
      version: 1, id: randomUUID(), kind, emailHash: hashKey(normalize(email)),
      ownerId, resourceId, createdAt: Date.now(),
    };
    await this.sqs.send(new SendMessageCommand({ QueueUrl: process.env.PUSH_QUEUE_URL, MessageBody: JSON.stringify(job) }));
  }

  /** Called only by the SQS-triggered Lambda, never by a public HTTP route. */
  async dispatch(job: InvitationJob): Promise<void> {
    if (job.version !== 1 || !['event', 'calendar'].includes(job.kind)
        || !/^[0-9a-f-]{36}$/i.test(job.id) || !job.ownerId || !job.resourceId
        || !job.emailHash || !Number.isFinite(job.createdAt)) throw new Error('Invalid push job');
    if (Date.now() - job.createdAt > 86400_000) return;
    const index = await this.store.getJSON(this.store.keys.accountEmail(job.emailHash));
    if (!index?.principalId) return; // Email still reaches invitees without an app account.
    const account = await this.store.getJSON(this.store.keys.principal(index.principalId));
    if (!this.identityHashes(account).has(job.emailHash)) return;
    const invitation = await this.pendingInvitation(job);
    if (!invitation) return; // Accepted, declined, cancelled or revoked while queued.
    const invitationId = hashKey(`${job.ownerId}:${job.resourceId}`);
    const payload = {
      aps: {
        alert: {
          'title-loc-key': job.kind === 'event' ? 'New event invitation' : 'New calendar invitation',
          'loc-key': '%@ invited you to %@',
          'loc-args': [String(invitation.sender).slice(0, 160), String(invitation.title).slice(0, 120)],
        },
        sound: 'default', 'thread-id': 'cloud-calendars.invitations',
      },
      [job.kind === 'event' ? 'pendingEventInvitationID' : 'pendingCalendarInvitationID']: invitationId,
      cloudCalendarsPush: true,
    };
    const deviceIndexes = await this.store.listKeys(principalDevices(index.principalId));
    const results = await Promise.allSettled(deviceIndexes.map(async (key) => {
      const pointer = await this.store.getJSON(key);
      if (!pointer?.installationId) return;
      const entry = await this.store.getJSONWithETag(deviceKey(pointer.installationId));
      const device = entry?.value;
      if (!device?.enabled || device.principalId !== index.principalId) return;
      if (!(process.env.APNS_ALLOWED_ENVIRONMENTS ?? 'sandbox').split(',').includes(device.environment)) return;
      const receiptKey = `push/receipts/${job.id}/${hashKey(device.token)}.json`;
      const receipt = await this.store.getJSONWithETag(receiptKey);
      if (receipt?.value.acceptedAt) return;
      if (receipt?.value.leaseUntil > Date.now()) throw new Error('Delivery is already in progress');
      const lease = { leaseUntil: Date.now() + 60_000 };
      const claimed = receipt
        ? await this.store.putJSONIfMatch(receiptKey, lease, receipt.etag)
        : await this.store.putJSONIfAbsent(receiptKey, lease);
      if (!claimed) throw new Error('Concurrent delivery claim');
      let response;
      try {
        response = await this.apns.send(device, payload, hashKey(`${job.kind}:${invitationId}`));
      } catch (error) {
        await this.store.putJSON(receiptKey, { leaseUntil: 0 });
        throw error;
      }
      if (response.status === 200) {
        await this.store.putJSON(receiptKey, { acceptedAt: Date.now() });
        console.log('[Push] APNs accepted', { jobId: job.id, kind: job.kind });
        return;
      }
      if (response.status === 410 || response.reason === 'BadDeviceToken' || response.reason === 'DeviceTokenNotForTopic') {
        // Do not disable a newer re-registration because an older token failed.
        if (!response.timestamp || response.timestamp >= device.registeredAt) {
          await this.store.putJSONIfMatch(deviceKey(device.installationId), {
            ...device, enabled: false, invalidatedAt: Date.now(),
          }, entry!.etag);
        }
        await this.store.putJSON(receiptKey, { acceptedAt: Date.now(), skippedInvalidToken: true });
        return;
      }
      await this.store.putJSON(receiptKey, { leaseUntil: 0 });
      console.warn('[Push] APNs rejected', { status: response.status, reason: response.reason });
      // Authentication failures and transient failures remain visible in the
      // retry queue/DLQ; never acknowledge an undelivered alert as successful.
      throw new Error(`APNs rejected notification (${response.status}, ${response.reason ?? 'unknown'})`);
    }));
    if (results.some((value) => value.status === 'rejected')) throw new Error('One or more APNs deliveries failed');
  }

  private async pendingInvitation(job: InvitationJob): Promise<{ title: string; sender: string } | null> {
    if (job.kind === 'event') {
      const ref = await this.store.getJSON(this.store.keys.pendingEventInvitation(job.emailHash, job.ownerId, job.resourceId));
      const event = await this.store.getJSON(this.store.keys.event(job.ownerId, job.resourceId));
      if (!ref || !event || event.status === 'cancelled'
          || !Number.isFinite(new Date(event.end).getTime())) return null;
      // Fresh invitations notify even for past events. The separate queue-age
      // limit above only prevents delayed jobs from replaying stale alerts.
      const pending = (event.recipients ?? []).some((r: any) => !r.userId && !r.anonymousId
        && [r.invitedEmail, ...(r.emails ?? [])].some((email) => email && hashKey(normalize(email)) === job.emailHash));
      return pending ? { title: event.title ?? 'Shared event', sender: ref.senderName ?? ref.senderEmail ?? 'Cloud Calendars' } : null;
    }
    const ref = await this.store.getJSON(this.store.keys.pendingICloudCalendarInvitation(job.emailHash, job.ownerId, job.resourceId));
    const calendar = await this.store.getJSON(this.store.keys.icloudCalendarSharing(job.ownerId, job.resourceId));
    if (!ref || ref.revokedAt || !calendar || calendar.deletedAt) return null;
    const pending = (calendar.recipients ?? []).some((r: any) => r.isPending === true
      && hashKey(normalize(r.email)) === job.emailHash);
    const owner = await this.store.getJSON(this.store.keys.principal(job.ownerId));
    const sender: any = Object.values(owner?.identities ?? {}).find((i: any) => i?.email);
    return pending ? { title: calendar.title ?? 'Shared calendar', sender: sender?.email ?? 'Cloud Calendars' } : null;
  }
}
