import 'reflect-metadata';
import { createApp } from './bootstrap';

async function main() {
  // No development dotenv files or AWS instance credentials on Hetzner.
  if (!process.env.CALENDAR_STORAGE_URL || !process.env.CALENDAR_STORAGE_TOKEN) {
    throw new Error('Hetzner storage must be configured');
  }
  const app = await createApp();
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? 9471), '0.0.0.0');
  console.log('Cloud Calendars API ready');
}
void main();
