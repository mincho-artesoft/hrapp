import { createHash } from 'crypto';
import { DynamoDBClient, TransactWriteItemsCommand } from '@aws-sdk/client-dynamodb';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
/** Atomic across concurrent Lambda instances. No addresses or message text in the guard table. */
export function sendGuardItems(table: string, scope: string, to: string, subject: string, html: string, now = Date.now()) {
  const sec = Math.floor(now / 1000);
  const count = (key: string, limit: number) => ({ Update: {
    TableName: table, Key: { pk: { S: key } },
    UpdateExpression: 'SET expires = :ttl ADD hits :one',
    ConditionExpression: 'attribute_not_exists(hits) OR hits < :limit',
    ExpressionAttributeValues: { ':ttl': { N: String(sec + 3 * 86400) }, ':one': { N: '1' }, ':limit': { N: String(limit) } },
  } });
  return [
    { Put: { TableName: table, Item: {
      pk: { S: `calendar-dedup#${scope}#${hash(to + '\n' + subject + '\n' + html)}#${Math.floor(sec / 600)}` },
      expires: { N: String(sec + 86400) },
    }, ConditionExpression: 'attribute_not_exists(pk)' } },
    count(`calendar-hour#${scope}#${Math.floor(sec / 3600)}`, 30),
    count(`calendar-day#${scope}#${Math.floor(sec / 86400)}`, 150),
    count(`calendar-recipient-hour#${scope}#${hash(to)}#${Math.floor(sec / 3600)}`, 5),
    count(`calendar-recipient-day#${scope}#${hash(to)}#${Math.floor(sec / 86400)}`, 15),
  ];
}

export class EmailSendGuard {
  private readonly client = new DynamoDBClient({ region: process.env.EMAIL_REGION ?? process.env.AWS_REGION ?? 'us-east-1' });
  async claim(from: string, to: string, subject: string, html: string) {
    const table = process.env.EMAIL_GUARD_TABLE;
    if (!table) throw new Error('email-guard-not-configured');
    if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(to) || /[\r\n\0]/.test(to + subject)) throw new Error('invalid-mail-fields');
    await this.client.send(new TransactWriteItemsCommand({ TransactItems: sendGuardItems(table, hash(from), to.toLowerCase(), subject, html) }));
  }
}
