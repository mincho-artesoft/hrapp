import { Routes } from '@angular/router';

// Import your new page components (we'll create these next)
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';
import { TermsPageComponent } from './pages/terms-page/terms-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component'; // We'll create a simple home page

export const routes: Routes = [
    { path: '', component: HomePageComponent, pathMatch: 'full' }, // Default route to home
    { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    { path: 'terms-of-service', component: TermsPageComponent },
    { path: '**', redirectTo: '' } // Optional: Redirect unknown paths to home
];
