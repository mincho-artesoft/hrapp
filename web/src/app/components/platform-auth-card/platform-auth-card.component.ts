import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarSymbolComponent } from '../calendar-native/calendar-symbol.component';
import { APP_STORE_URL, SITE_URL, isIosQrAuthEnabled } from '../../core/app-facts';
import { generateQrSvgDataUrl } from '../../core/ios-event-palette';
import {
  CalendarApiError,
  CalendarPlatformApiService,
  IosQrChallengeStartResponse,
  UserProfile,
} from '../../core/calendar-platform-api.service';

@Component({
  selector: 'app-platform-auth-card',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarSymbolComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './platform-auth-card.component.html',
  styleUrl: './platform-auth-card.component.scss',
})
export class PlatformAuthCardComponent implements OnInit, OnDestroy {
  readonly api = inject(CalendarPlatformApiService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @Input() badgeText = 'Cloud Calendars Account';
  @Input() title = 'Sign in to Web Calendar';
  @Input() subtitle = '';
  @Input() allowSandbox = false;
  @Input() includeCalendarScopeOnOAuth = false;

  @Output() signedIn = new EventEmitter<UserProfile>();

  readonly appStoreUrl = APP_STORE_URL;
  readonly appleWebUrl = SITE_URL + '/calendar/';
  readonly appleUsesOtherDomain = this.isBrowser && window.location.origin !== SITE_URL;
  readonly iosQrEnabled = signal(isIosQrAuthEnabled());
  readonly effectiveSubtitle = computed(() => {
    if (this.subtitle) return this.subtitle;
    return this.iosQrEnabled()
      ? 'Sign in with the Cloud Calendars app, Apple, Google, Microsoft, or a 6-digit email verification code.'
      : 'Use Apple, Google, Microsoft, or a 6-digit email verification code to sign in.';
  });
  readonly iosTab = signal<'qr' | 'totp'>('qr');
  readonly step = signal<'method' | 'code'>('method');
  readonly email = signal('');
  readonly displayName = signal('');
  readonly code = signal('');
  readonly totpEmail = signal('');
  readonly totpCode = signal('');
  readonly busy = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly infoMsg = signal<string | null>(null);

  readonly qrChallenge = signal<IosQrChallengeStartResponse | null>(null);
  readonly qrLoading = signal(false);
  readonly qrDataUrl = computed(() => {
    const ch = this.qrChallenge();
    return ch?.qrUrl ? generateQrSvgDataUrl(ch.qrUrl) : null;
  });

  private pollTimer: any = null;
  private pollInFlight = false;

  async ngOnInit(): Promise<void> {
    this.iosQrEnabled.set(isIosQrAuthEnabled());
    await this.api.ensureInitialized();
    if (this.isBrowser && this.iosQrEnabled()) {
      await this.refreshQrChallenge();
    }
  }

  ngOnDestroy(): void {
    this.stopQrPolling();
  }

  switchIosTab(tab: 'qr' | 'totp'): void {
    this.iosTab.set(tab);
    this.errorMsg.set(null);
    if (tab === 'qr' && !this.qrChallenge() && this.isBrowser) {
      this.refreshQrChallenge();
    }
  }

  async refreshQrChallenge(): Promise<void> {
    if (!this.isBrowser) return;
    this.stopQrPolling();
    this.qrLoading.set(true);
    try {
      const ch = await this.api.startIosQrChallenge(this.api.isSignedInWithAccount());
      this.qrChallenge.set(ch);
      this.startQrPolling();
    } catch {
      this.qrChallenge.set(null);
    } finally {
      this.qrLoading.set(false);
    }
  }

  private startQrPolling(): void {
    this.stopQrPolling();
    this.pollTimer = setInterval(() => {
      this.tickQrPoll().catch(() => null);
    }, 2200);
  }

  private stopQrPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private async tickQrPoll(): Promise<void> {
    if (this.pollInFlight || this.iosTab() !== 'qr' || this.step() !== 'method') return;
    const ch = this.qrChallenge();
    if (!ch) return;
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;

    this.pollInFlight = true;
    try {
      const res = await this.api.pollIosQrChallenge(ch.challengeId, ch.pollToken);
      if (res.status === 'approved' && res.profile) {
        this.stopQrPolling();
        this.signedIn.emit(res.profile);
      } else if (res.status === 'expired') {
        await this.refreshQrChallenge();
      }
    } finally {
      this.pollInFlight = false;
    }
  }

  async submitTotpLogin(): Promise<void> {
    this.errorMsg.set(null);
    this.infoMsg.set(null);
    const cleanEmail = this.totpEmail().trim().toLowerCase();
    const cleanCode = this.totpCode().trim().replace(/\s+/g, '');
    if (!cleanEmail || !cleanEmail.includes('@')) {
      this.errorMsg.set('Please enter the email connected to your Cloud Calendars iOS account.');
      return;
    }
    if (!/^\d{6}$/.test(cleanCode)) {
      this.errorMsg.set('Please enter the 6-digit Authenticator code from your iOS app.');
      return;
    }
    this.busy.set(true);
    try {
      const profile = await this.api.verifyTotpLogin({ email: cleanEmail, code: cleanCode });
      this.stopQrPolling();
      this.signedIn.emit(profile);
    } catch (e) {
      this.errorMsg.set(e instanceof Error ? e.message : 'Invalid 6-digit Authenticator code.');
    } finally {
      this.busy.set(false);
    }
  }

  async onAppleClick(): Promise<void> {
    this.errorMsg.set(null);
    this.infoMsg.set(null);
    this.busy.set(true);
    try {
      const { profile } = await this.api.signInWithApplePopup();
      this.stopQrPolling();
      this.signedIn.emit(profile);
    } catch (e) {
      if (e instanceof CalendarApiError && e.code === 'oauth_not_configured') {
        this.errorMsg.set('Sign in with Apple is currently unavailable.');
      } else {
        this.errorMsg.set(e instanceof Error ? e.message : 'Apple sign-in failed.');
      }
    } finally {
      this.busy.set(false);
    }
  }

  async onGoogleClick(): Promise<void> {
    this.errorMsg.set(null);
    this.infoMsg.set(null);
    this.busy.set(true);
    try {
      const { profile } = await this.api.signInWithGooglePopup({
        includeCalendarReadonly: this.includeCalendarScopeOnOAuth,
      });
      this.stopQrPolling();
      this.signedIn.emit(profile);
    } catch (e) {
      if (e instanceof CalendarApiError && e.code === 'oauth_not_configured') {
        this.infoMsg.set(
          'Enter your Gmail / Google Workspace address below to sign in instantly with a 6-digit verification code.',
        );
      } else {
        this.errorMsg.set(e instanceof Error ? e.message : 'Google sign-in failed.');
      }
    } finally {
      this.busy.set(false);
    }
  }

  async onMicrosoftClick(): Promise<void> {
    this.errorMsg.set(null);
    this.infoMsg.set(null);
    this.busy.set(true);
    try {
      const { profile } = await this.api.signInWithMicrosoftPopup({
        includeCalendarReadonly: this.includeCalendarScopeOnOAuth,
      });
      this.stopQrPolling();
      this.signedIn.emit(profile);
    } catch (e) {
      if (e instanceof CalendarApiError && e.code === 'oauth_not_configured') {
        this.infoMsg.set(
          'Enter your Microsoft / Outlook / Office 365 email below to sign in instantly with a 6-digit verification code.',
        );
      } else {
        this.errorMsg.set(e instanceof Error ? e.message : 'Microsoft sign-in failed.');
      }
    } finally {
      this.busy.set(false);
    }
  }

  async sendCode(): Promise<void> {
    this.errorMsg.set(null);
    this.infoMsg.set(null);
    const cleanEmail = this.email().trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      this.errorMsg.set('Please enter a valid email address.');
      return;
    }
    this.busy.set(true);
    try {
      await this.api.requestEmailAuthCode(cleanEmail);
      this.step.set('code');
      this.infoMsg.set(`We sent a 6-digit verification code to ${cleanEmail}.`);
    } catch (e) {
      this.errorMsg.set(e instanceof Error ? e.message : 'Could not send verification code.');
    } finally {
      this.busy.set(false);
    }
  }

  async verifyCode(): Promise<void> {
    this.errorMsg.set(null);
    const cleanCode = this.code().trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      this.errorMsg.set('Please enter the 6-digit code from your email.');
      return;
    }
    this.busy.set(true);
    try {
      const profile = await this.api.verifyEmailAuthCode({
        email: this.email(),
        code: cleanCode,
        name: this.displayName() || undefined,
      });
      this.stopQrPolling();
      this.signedIn.emit(profile);
    } catch (e) {
      this.errorMsg.set(e instanceof Error ? e.message : 'Invalid or expired code.');
    } finally {
      this.busy.set(false);
    }
  }

  async startSandbox(): Promise<void> {
    this.errorMsg.set(null);
    this.busy.set(true);
    try {
      const profile = await this.api.ensureWorkspaceSession('My Cloud Calendar');
      this.stopQrPolling();
      this.signedIn.emit(profile);
    } catch (e) {
      this.errorMsg.set(e instanceof Error ? e.message : 'Could not initialize workspace.');
    } finally {
      this.busy.set(false);
    }
  }

  backToEmail(): void {
    this.step.set('method');
    this.code.set('');
    this.errorMsg.set(null);
  }
}
