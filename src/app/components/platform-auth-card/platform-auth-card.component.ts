import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CalendarApiError,
  CalendarPlatformApiService,
  UserProfile,
} from '../../core/calendar-platform-api.service';

@Component({
  selector: 'app-platform-auth-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './platform-auth-card.component.html',
  styleUrl: './platform-auth-card.component.scss',
})
export class PlatformAuthCardComponent implements OnInit {
  readonly api = inject(CalendarPlatformApiService);

  @Input() badgeText = 'CLOUD CALENDARS WEB';
  @Input() title = 'Sign in to your Calendar & Scheduling Studio';
  @Input() subtitle =
    'Connect with Google, Microsoft, or a 6-digit email verification code. Accounts sharing the same verified email automatically sync with your CloudCalendars calendar.';
  @Input() allowSandbox = false;
  @Input() includeCalendarScopeOnOAuth = true;

  @Output() signedIn = new EventEmitter<UserProfile>();

  readonly step = signal<'method' | 'code'>('method');
  readonly email = signal('');
  readonly displayName = signal('');
  readonly code = signal('');
  readonly busy = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly infoMsg = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.api.ensureInitialized();
  }

  async onGoogleClick(): Promise<void> {
    this.errorMsg.set(null);
    this.infoMsg.set(null);
    this.busy.set(true);
    try {
      const { profile } = await this.api.signInWithGooglePopup({
        includeCalendarReadonly: this.includeCalendarScopeOnOAuth,
      });
      this.signedIn.emit(profile);
    } catch (e) {
      if (e instanceof CalendarApiError && e.code === 'oauth_not_configured') {
        this.infoMsg.set(
          'Enter your Gmail / Google Workspace address below to sign in instantly with a 6-digit verification code (resolves to the exact same CloudCalendars account).',
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
      this.signedIn.emit(profile);
    } catch (e) {
      if (e instanceof CalendarApiError && e.code === 'oauth_not_configured') {
        this.infoMsg.set(
          'Enter your Microsoft / Outlook / Office 365 email below to sign in instantly with a 6-digit verification code (resolves to the exact same CloudCalendars account).',
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
