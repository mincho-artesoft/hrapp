import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollService } from './core/scroll.service';
import { ActiveLocaleService } from './core/active-locale.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly active = inject(ActiveLocaleService);
  readonly mainHref = computed(() => `${this.active.currentPath()}#main`);
  /** Instantiated here so the single rAF loop starts with the app. */
  private readonly scroll = inject(ScrollService);
}
