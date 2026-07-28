import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ScrollService } from '../../core/scroll.service';
import { APP_STORE_URL } from '../../core/app-facts';

interface NavItem {
  label: string;
  fragment: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly scroll = inject(ScrollService);

  readonly appStoreUrl = APP_STORE_URL;
  readonly isScrolled = this.scroll.isScrolled;
  readonly progress = this.scroll.progress;
  readonly menuOpen = signal(false);

  readonly nav: NavItem[] = [
    { label: 'Tour', fragment: 'showcase' },
    { label: 'Widgets', fragment: 'widgets' },
    { label: 'Weather', fragment: 'weather' },
    { label: 'Features', fragment: 'features' },
    { label: 'Pricing', fragment: 'pricing' },
  ];

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    document.body.style.overflow = this.menuOpen() ? 'hidden' : '';
  }

  closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
