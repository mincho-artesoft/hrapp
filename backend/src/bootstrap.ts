import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { json, Router, type Express } from 'express';
import compression from 'compression';
import { constants as zlib } from 'node:zlib';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

/**
 * Build the Nest app with the same behaviour on Lambda and locally: CORS matching the
 * original API, and the exception filter that preserves the original error
 * bodies. Pass an Express instance for the serverless adapter; omit it for a
 * standalone HTTP server in local dev.
 */
export async function createApp(expressApp?: Express): Promise<INestApplication> {
  const app = expressApp
    ? await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
        rawBody: true,
        logger: ['error', 'warn'],
      })
    : await NestFactory.create(AppModule, {
        rawBody: true,
        logger: ['error', 'warn'],
      });

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'authorization,content-type,cache-control,stripe-signature,if-none-match',
    maxAge: 86400,
  });
  // Browsers and URLSession negotiate compression for the large calendar snapshots.
  app.use('/web-calendar/state', compression({threshold: 2048, level: 6, brotli: {params: {[zlib.BROTLI_PARAM_QUALITY]: 5}}}));
  app.use(['/web-calendar/providers', '/ios/calendars/account', '/ios/calendars/sync', '/shared-state', '/booking-calendars'],
    compression({threshold: 2048, level: zlib.Z_BEST_SPEED}));
  // A replica upload contains the calendar's events, including recurrence and attachments.
  app.use(Router().post('/ios/calendars/sync', json({ limit: '5mb' })));
  app.useGlobalFilters(new AllExceptionsFilter());
  return app;
}
