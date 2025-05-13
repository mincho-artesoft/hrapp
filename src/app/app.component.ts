import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import {PricingComponent} from './components/pricing/pricing.component';
import {FeaturesComponent} from './components/features/features.component';
import {HeroComponent} from './components/hero/hero.component';
import {HeaderComponent} from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    FeaturesComponent,
    PricingComponent,
    FooterComponent,
    // RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'arte-calendar';
}
