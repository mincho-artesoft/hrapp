import { NgTemplateOutlet, TitleCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from "@angular/core";
import { CalendarNativeTextPipe } from "../../core/calendar-localization";
import { CalendarNativeService } from "../../core/calendar-native.service";
import { CalendarPlatformApiService } from "../../core/calendar-platform-api.service";
import { CalendarProgressComponent } from "./calendar-progress.component";
import { CalendarSymbolComponent } from "./calendar-symbol.component";

type Provider = "apple" | "google" | "microsoft";

@Component({
  selector: "cc-calendar-account",
  standalone: true,
  imports: [CalendarNativeTextPipe, CalendarSymbolComponent, CalendarProgressComponent, NgTemplateOutlet, TitleCasePipe],
  templateUrl: "./calendar-account.component.html",
  styleUrl: "./calendar-account.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarAccountComponent {
  readonly api = inject(CalendarPlatformApiService);
  private readonly sharing = inject(CalendarNativeService);
  private readonly sheet = viewChild.required<ElementRef<HTMLDialogElement>>("sheet");
  readonly providers: readonly Provider[] = ["apple", "google", "microsoft"];
  readonly busy = signal(false);
  readonly signingIn = signal(false);
  readonly error = signal("");

  open(trigger: HTMLButtonElement): void {
    this.error.set("");
    trigger.focus({ preventScroll: true });
    this.sheet().nativeElement.showModal();
  }

  dismissBackdrop(event: MouseEvent): void {
    const dialog = this.sheet().nativeElement;
    if (event.target !== dialog) return;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
      dialog.close();
    }
  }

  identity(provider: Provider) {
    return this.api.profile()?.identities.find(identity => identity.provider === provider);
  }

  connectIdentity(provider: Provider): void {
    void this.update(async () => {
      this.signingIn.set(true);
      if (provider === "apple") await this.api.signInWithApplePopup();
      else if (provider === "google") await this.api.signInWithGooglePopup({ includeCalendarReadonly: false });
      else await this.api.signInWithMicrosoftPopup({ includeCalendarReadonly: false });
    });
  }

  unlink(provider: Provider): void {
    void this.update(async () => {
      const token = this.api.token();
      await this.sharing.request(`/identities/${provider}`, "DELETE");
      if (this.api.token() !== token) return;
      await this.api.refreshProfile();
      if (this.api.token() === token && !this.api.isSignedInWithAccount()) {
        this.api.signOut();
      }
    });
  }

  private async update(action: () => Promise<void>): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set("");
    try {
      await action();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : "Please try again.");
    } finally {
      this.signingIn.set(false);
      this.busy.set(false);
    }
  }
}
