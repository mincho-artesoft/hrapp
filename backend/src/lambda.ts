import 'reflect-metadata';
import express from 'express';
import serverlessExpress from '@codegenie/serverless-express';
import { createApp } from './bootstrap';
import { PushService } from './push/push.service';

// The Nest app is built once per warm container and reused across invocations.
let cachedHandler: any;
let pushService: PushService;

async function boot() {
  const expressApp = express();
  const app = await createApp(expressApp);
  await app.init();
  pushService = app.get(PushService);
  return serverlessExpress({ app: expressApp });
}

export const handler = async (event: any, context: any, callback: any) => {
  cachedHandler = cachedHandler ?? (await boot());
  if (Array.isArray(event.Records) && event.Records.every((r: any) => r.eventSource === 'aws:sqs')) {
    const batchItemFailures: { itemIdentifier: string }[] = [];
    for (const record of event.Records) {
      try {
        await pushService.dispatch(JSON.parse(record.body));
      } catch {
        console.error('[Push] Retry required', { messageId: record.messageId });
        batchItemFailures.push({ itemIdentifier: record.messageId });
      }
    }
    return { batchItemFailures };
  }
  return cachedHandler(event, context, callback);
};
