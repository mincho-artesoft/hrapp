import 'reflect-metadata';
import { createApp } from './bootstrap';

/** Local dev server, for running the same app on a plain HTTP port. */
async function main() {
  const app = await createApp();
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`cloud-calendars-api (NestJS) listening on http://localhost:${port}`);
}

main();
