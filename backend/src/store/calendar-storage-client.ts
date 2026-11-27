import { S3Client } from '@aws-sdk/client-s3';

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

  async send(command: any, inventory?: { CalendarInventory: 'all' | 'account'; KnownETags: Record<string, string> }): Promise<any> {
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
    const response = await fetch(new URL('/v1/objects', this.endpoint), {
      method: 'POST', headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(input), signal: AbortSignal.timeout(20000),
    });
    const result: any = await response.json();
    if (!response.ok) {
      const error: any = new Error(result.error ?? 'Calendar storage request failed');
      error.name = result.error ?? 'StorageError';
      error.$metadata = { httpStatusCode: response.status };
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
}
