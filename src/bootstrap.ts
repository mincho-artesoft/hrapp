import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { Express } from 'express';
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
    allowedHeaders: 'authorization,content-type,cache-control,stripe-signature',
    maxAge: 86400,
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  return app;
}
