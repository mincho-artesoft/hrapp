import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { keys } from './keys';

/**
 * S3-as-DB. A thin, injectable wrapper around the exact operations the original
 * Lambda's lib/store.mjs performed — same bucket, same key layout, same
 * semantics (including the conditional write that arbitrates a booking race).
 */
@Injectable()
export class StoreService {
  readonly keys = keys;
  private readonly bucket = process.env.CAL_BUCKET as string;
  private readonly s3 = new S3Client({});

  async getJSON(key: string): Promise<any> {
    return (await this.getJSONWithETag(key))?.value ?? null;
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

  async listKeys(prefix: string): Promise<string[]> {
    const out: string[] = [];
    let token: string | undefined;
    do {
      const res = await this.s3.send(new ListObjectsV2Command({
        Bucket: this.bucket, Prefix: prefix, ContinuationToken: token,
      }));
      for (const obj of res.Contents ?? []) out.push(obj.Key);
      token = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (token);
    return out;
  }
}
