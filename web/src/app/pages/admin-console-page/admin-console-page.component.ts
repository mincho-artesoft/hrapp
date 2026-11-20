import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SeoService } from '../../core/seo.service';
import { DEFAULT_LOCALE, LOCALES, Locale, linkPath, localePath } from '../../core/locales';
import {
  AdminOverviewResponse,
  CalendarApiError,
  CalendarPlatformApiService,
} from '../../core/calendar-platform-api.service';
import { PlatformAuthCardComponent } from '../../components/platform-auth-card/platform-auth-card.component';

@Component({
  selector: 'app-admin-console-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PlatformAuthCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-console-page.component.html',
  styleUrl: './admin-console-page.component.scss',
})
export class AdminConsolePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  readonly api = inject(CalendarPlatformApiService);

  protected locale: Locale = DEFAULT_LOCALE;

  readonly loading = signal(false);
  readonly forbiddenMsg = signal<string | null>(null);
  readonly data = signal<AdminOverviewResponse | null>(null);

  // Editable OAuth Settings
  readonly googleWebClientId = signal('');
  readonly googleWebClientSecret = signal('');
  readonly microsoftWebClientId = signal('');
  readonly microsoftTenant = signal('common');
  readonly appleWebClientId = signal('');
  readonly savingSettings = signal(false);
  readonly toast = signal<string | null>(null);

  readonly calendarHref = computed(() => linkPath(this.locale, '/calendar'));

  async ngOnInit(): Promise<void> {
    this.locale = (this.route.snapshot.data['locale'] as Locale) ?? DEFAULT_LOCALE;
    this.seo.apply({
      title: 'Platform Admin Console — Cloud Calendars',
      description: 'Administrative console for Cloud Calendars Web Scheduling.',
      path: localePath(this.locale, '/admin'),
      locale: this.locale,
      noindex: true,
      alternates: LOCALES.map((l) => ({ hreflang: l.hreflang, path: localePath(l, '/admin') })),
    });

    if (!this.isBrowser) return;
    await this.api.ensureInitialized();
    if (this.api.isSignedInWithAccount()) {
      await this.loadOverview();
    }
  }

  async onSignedIn(): Promise<void> {
    await this.loadOverview();
  }

  async loadOverview(): Promise<void> {
    this.loading.set(true);
    this.forbiddenMsg.set(null);
    try {
      const ov = await this.api.getAdminOverview();
      this.data.set(ov);
      this.googleWebClientId.set(ov.settings.googleWebClientId || '');
      this.microsoftWebClientId.set(ov.settings.microsoftWebClientId || '');
      this.microsoftTenant.set(ov.settings.microsoftTenant || 'common');
      this.appleWebClientId.set(ov.settings.appleWebClientId || '');
    } catch (e) {
      if (e instanceof CalendarApiError && e.status === 403) {
        this.forbiddenMsg.set(
          'Your signed-in account does not have platform administrator privileges. Sign in with an authorized Arte Soft admin email.',
        );
      } else {
        this.forbiddenMsg.set(e instanceof Error ? e.message : 'Failed to load admin overview.');
      }
    } finally {
      this.loading.set(false);
    }
  }

  async saveSettings(): Promise<void> {
    this.savingSettings.set(true);
    try {
      await this.api.updateAdminSettings({
        googleWebClientId: this.googleWebClientId().trim(),
        ...(this.googleWebClientSecret().trim()
          ? { googleWebClientSecret: this.googleWebClientSecret().trim() }
          : {}),
        microsoftWebClientId: this.microsoftWebClientId().trim(),
        microsoftTenant: this.microsoftTenant().trim() || 'common',
        appleWebClientId: this.appleWebClientId().trim(),
      });
      this.googleWebClientSecret.set('');
      await this.loadOverview();
      this.notify('OAuth & Platform settings saved live!');
    } catch (e) {
      this.notify(e instanceof Error ? e.message : 'Could not save settings.');
    } finally {
      this.savingSettings.set(false);
    }
  }

  private notify(msg: string): void {
    this.toast.set(msg);
    setTimeout(() => this.toast.set(null), 4500);
  }
}
