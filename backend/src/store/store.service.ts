import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { CalendarStorageClient } from './calendar-storage-client';
import { keys } from './keys';

/**
 * S3-as-DB. A thin, injectable wrapper around the exact operations the original
 * Lambda's lib/store.mjs performed — same bucket, same key layout, same
 * semantics, including conditional writes for concurrent calendar changes.
 */
@Injectable()
export class StoreService {
  readonly keys = keys;
  private readonly bucket = process.env.CAL_BUCKET as string;
  private readonly s3 = new CalendarStorageClient();
  // Only inventory readers supply an ETag from a fresh listing. Keep immutable
  // JSON bytes so a caller editing its result cannot change a later read.
  private readonly listedJSON = new Map<string, { etag: string; bytes: Buffer }>();
  private listedBytes = 0;

  async getJSON(key: string, listedETag?: string): Promise<any> {
    if (!listedETag) return (await this.getJSONWithETag(key))?.value ?? null;
    const cached = this.listedJSON.get(key);
    if (cached?.etag === listedETag) {
      this.listedJSON.delete(key);
      this.listedJSON.set(key, cached);
      return JSON.parse(cached.bytes.toString('utf8'));
    }
    const row = await this.getJSONWithETag(key);
    if (row?.etag === listedETag) {
      this.rememberListedJSON(key, row.etag, Buffer.from(JSON.stringify(row.value)));
    }
    return row?.value ?? null;
  }

  private rememberListedJSON(key: string, etag: string, bytes: Buffer): void {
    if (bytes.length > 2 * 1024 * 1024) return;
    this.discardListedJSON(key);
    while (this.listedJSON.size >= 512 || this.listedBytes + bytes.length > 8 * 1024 * 1024) {
      this.discardListedJSON(this.listedJSON.keys().next().value);
    }
    this.listedJSON.set(key, { etag, bytes });
    this.listedBytes += bytes.length;
  }

  private discardListedJSON(key: string): void {
    const entry = this.listedJSON.get(key);
    if (entry) {
      this.listedBytes -= entry.bytes.length;
      this.listedJSON.delete(key);
    }
  }

  /** Reads a generated text asset such as a subscribable `.ics` feed. */
  async getText(key: string): Promise<string | null> {
    try {
      const res = await this.s3.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
      return await res.Body.transformToString();
    } catch (err: any) {
      if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) return null;
      throw err;
    }
  }

  /** Reads the object together with the exact version marker needed for an
   * optimistic conditional update. */
  async getJSONWithETag(key: string): Promise<{ value: any; etag: string } | null> {
    try {
      const res = await this.s3.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
      if (!res.ETag) throw new Error(`S3 returned no ETag for ${key}`);
      return {
        value: JSON.parse(await res.Body.transformToString()),
        etag: res.ETag,
      };
    } catch (err: any) {
      if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) return null;
      throw err;
    }
  }

  async putJSON(key: string, value: any): Promise<void> {
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket, Key: key,
      Body: JSON.stringify(value),
      ContentType: 'application/json',
    }));
  }

  /**
   * Writes only if the object does not already exist, atomically.
   *
   * This is the one place the whole system needs a real concurrency guard: two
   * people racing to book the same slot both read it as free, so "free" cannot be
   * decided by a read. S3's conditional write (`If-None-Match: *`) makes the claim
   * itself the arbiter — exactly one PUT wins, the other gets 412. Returns true if
   * this call created the object, false if it was already there.
   */
  async putJSONIfAbsent(key: string, value: any): Promise<boolean> {
    try {
      await this.s3.send(new PutObjectCommand({
        Bucket: this.bucket, Key: key,
        Body: JSON.stringify(value),
        ContentType: 'application/json',
        IfNoneMatch: '*',
      }));
      return true;
    } catch (err: any) {
      if (err.name === 'PreconditionFailed' || err.$metadata?.httpStatusCode === 412) return false;
      throw err;
    }
  }

  /** Replaces an object only if nobody changed it after the corresponding
   * getJSONWithETag read. Callers retry on false, merging the newer value. */
  async putJSONIfMatch(key: string, value: any, etag: string): Promise<boolean> {
    try {
      await this.s3.send(new PutObjectCommand({
        Bucket: this.bucket, Key: key,
        Body: JSON.stringify(value),
        ContentType: 'application/json',
        IfMatch: etag,
      }));
      return true;
    } catch (err: any) {
      if (err.name === 'PreconditionFailed'
          || err.name === 'ConditionalRequestConflict'
          || err.$metadata?.httpStatusCode === 409
          || err.$metadata?.httpStatusCode === 412) return false;
      throw err;
    }
  }

  /**
   * Shared-event recipients poll while the app is active. Revalidation keeps a
   * CDN or URLSession from serving the previous revision during that poll;
   * otherwise even the app's 20-second sync can remain stale for another minute.
   */
  async putFeed(key: string, ics: string): Promise<void> {
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket, Key: key,
      Body: ics,
      ContentType: 'text/calendar; charset=utf-8',
      CacheControl: 'no-cache, max-age=0, must-revalidate',
    }));
  }

  async del(key: string): Promise<void> {
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async listKeys(prefix: string, versions?: Map<string, string>, inventory?: 'all' | 'account'): Promise<string[]> {
    const out: string[] = [];
    const options = inventory ? {
      CalendarInventory: inventory,
      KnownETags: Object.fromEntries([...this.listedJSON].filter(([key]) => key.startsWith(prefix)).map(([key, entry]) => [key, entry.etag])),
    } : undefined;
    let token: string | undefined;
    do {
      const res = await this.s3.send(new ListObjectsV2Command({
        Bucket: this.bucket, Prefix: prefix, ContinuationToken: token,
      }), options);
      for (const obj of res.Contents ?? []) {
        out.push(obj.Key);
        if (inventory && obj.ETag && typeof obj.Body === 'string') {
          this.rememberListedJSON(obj.Key, obj.ETag, Buffer.from(obj.Body, 'base64'));
        }
        if (versions && obj.ETag) versions.set(obj.Key, obj.ETag);
      }
      token = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (token);
    return out;
  }
}
