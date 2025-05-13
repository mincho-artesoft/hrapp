import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router'; // Import provideRouter

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // Import your routes

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimationsAsync(),
        provideRouter(routes) // Provide the routes to the application
    ]
})
    .catch((err) => console.error(err));
