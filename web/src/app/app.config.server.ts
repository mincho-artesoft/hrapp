import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), provideServerRouting(serverRoutes)],
};

/**
 * The server half of the application config.
 *
 * Only used at build time: `outputMode: 'static'` renders every route through
 * this and writes the result to disk, so nothing here ever runs in production.
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
