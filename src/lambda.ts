import 'reflect-metadata';
import express from 'express';
import serverlessExpress from '@codegenie/serverless-express';
import { createApp } from './bootstrap';

// The Nest app is built once per warm container and reused across invocations.
let cachedHandler: any;

async function boot() {
  const expressApp = express();
  const app = await createApp(expressApp);
  await app.init();
  return serverlessExpress({ app: expressApp });
}

export const handler = async (event: any, context: any, callback: any) => {
  cachedHandler = cachedHandler ?? (await boot());
  return cachedHandler(event, context, callback);
};
