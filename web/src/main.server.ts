import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

/**
 * The prerenderer's entry point.
 *
 * The context has to be threaded through: on the server there is no ambient
 * platform for `bootstrapApplication` to find, so without it the render fails
 * with "Missing Platform" rather than producing a page.
 */
export default (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);
