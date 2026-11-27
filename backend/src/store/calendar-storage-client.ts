import { AsyncLocalStorage } from 'node:async_hooks';
import { S3Client } from '@aws-sdk/client-s3';

interface PrivateReply { Status: number; Result: any }
interface PendingRead {
  input: any;
  resolve: (reply: PrivateReply) => void;
  reject: (reason: unknown) => void;
}

const reader = new AsyncLocalStorage<Map<CalendarStorageClient, PendingRead[]>>();

export function withStorageReadBatch<T>(read: () => Promise<T>): Promise<T> {
  return reader.run(new Map(), read);
}

/** Bridge private calendar operations to the configured HTTPS storage service. */
export class CalendarStorageClient {
  private readonly aws = new S3Client({});
  private readonly endpoint = process.env.CALENDAR_STORAGE_URL;
  private readonly token = process.env.CALENDAR_STORAGE_TOKEN;

  constructor() {
    if (this.endpoint && (!this.token || !this.endpoint.startsWith('https://'))) {
      throw new Error('Calendar storage requires HTTPS and a private credential');
    }
  }

  async send(command: any, inventory?: { CalendarInventory: 'all' | 'account' | 'documents'; KnownETags: Record<string, string> }): Promise<any> {
    if (!this.endpoint || command?.input?.Bucket !== process.env.CAL_BUCKET) {
      return this.aws.send(command);
    }
    const operations: Record<string, string> = {
      GetObjectCommand: 'get', PutObjectCommand: 'put', DeleteObjectCommand: 'delete',
      ListObjectsV2Command: 'list', ListObjectVersionsCommand: 'versions',
    };
    const operation = operations[command?.constructor?.name];
    if (!operation) throw new Error('Unsupported calendar storage operation');
    const input: any = { ...command.input, ...inventory, Operation: operation };
    if (input.Body !== undefined) input.Body = Buffer.from(input.Body).toString('base64');
    const batch = reader.getStore();
    const {Status, Result: result} = batch && (operation === 'get' || operation === 'list')
      ? await this.enqueue(batch, input) : await this.request(input);
    if (Status < 200 || Status >= 300) {
      const error: any = new Error(result.error ?? 'Calendar storage request failed');
      error.name = result.error ?? 'StorageError';
      error.$metadata = { httpStatusCode: Status };
      throw error;
    }
    if (typeof result.Body === 'string') {
      const bytes = Buffer.from(result.Body, 'base64');
      result.Body = {
        transformToString: async () => bytes.toString('utf8'),
        transformToByteArray: async () => new Uint8Array(bytes),
      };
    }
    return result;
  }

  private async request(input: any): Promise<PrivateReply> {
    const response = await fetch(new URL('/v1/objects', this.endpoint), {
      method: 'POST', headers: {Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json'},
      body: JSON.stringify(input), signal: AbortSignal.timeout(20000),
    });
    return {Status: response.status, Result: await response.json()};
  }

  private enqueue(scope: Map<CalendarStorageClient, PendingRead[]>, input: any): Promise<PrivateReply> {
    let group = scope.get(this);
    if (!group || group.length === 16) {
      const reads: PendingRead[] = [];
      group = reads;
      scope.set(this, reads);
      queueMicrotask(() => {
        if (scope.get(this) === reads) scope.delete(this);
        void this.flush(reads).catch(error => reads.forEach(read => read.reject(error)));
      });
    }
    const reads = group;
    return new Promise((resolve, reject) => reads.push({input, resolve, reject}));
  }

  private async flush(reads: PendingRead[]): Promise<void> {
    if (reads.length === 1) {
      reads[0].resolve(await this.request(reads[0].input));
      return;
    }
    const {Status, Result} = await this.request({
      Bucket: reads[0].input.Bucket, Operation: 'readBatch', Reads: reads.map(read => read.input),
    });
    const legacy = Status === 400 && Result.error === 'UnsupportedOperation';
    if (!legacy && (Status !== 200 || !Array.isArray(Result.Results) || Result.Results.length !== reads.length)) {
      throw new Error('Calendar storage read batch failed');
    }
    await Promise.all(reads.map(async (read, index) => {
      try {
        read.resolve((legacy ? null : Result.Results[index]) ?? await this.request(read.input));
      } catch (error) {
        read.reject(error);
      }
    }));
  }

}
