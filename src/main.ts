import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Use the same router and hydration configuration as the prerendered pages.
bootstrapApplication(AppComponent, appConfig).catch(error => console.error(error));
