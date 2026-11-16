import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // The prerendered HTML is adopted rather than thrown away and redrawn,
    // and clicks that land before the bundle finishes are replayed instead
    // of swallowed.
    provideClientHydration(withEventReplay()),
    provideRouter(
      routes,
      // Navigating between pages goes to the top; #fragment links scroll to
      // their section — both of which the default router leaves to the browser.
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),
  ],
};
