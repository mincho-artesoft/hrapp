import { Injectable, Pipe, PipeTransform, inject, signal } from "@angular/core";
import languages from "../components/calendar-native/native-languages.json";

@Injectable({ providedIn: "root" })
export class CalendarLocalization {
  readonly languages = languages;
  readonly locale = signal("en");
  readonly formattingLocale = signal("en");
  private readonly strings = signal<Record<string, string>>({});
  private request = 0;
  constructor() {
    if (typeof localStorage !== "undefined") {
      try {
        void this.setLanguage(
          JSON.parse(localStorage.getItem("cc.mac.preferences") || "{}")
            .language ?? "system",
        );
      } catch {}
    }
  }
  async setLanguage(value: string) {
    const requested =
      value === "system"
        ? typeof navigator !== "undefined"
          ? navigator.language
          : "en"
        : value;
    const locale =
      languages.find((l) => l.value === requested)?.value ??
      languages.find((l) => l.value === requested.split("-")[0])?.value ??
      "en";
    this.locale.set(locale);
    this.formattingLocale.set(value === "system" ? requested : locale);
    this.strings.set({});
    const request = ++this.request;
    if (locale === "en") return;
    try {
      const response = await fetch(
        `/calendar-locales/${encodeURIComponent(locale)}.json`,
      );
      if (response.ok) {
        const strings = await response.json();
        if (request === this.request) this.strings.set(strings);
      }
    } catch {}
  }
  text(value: unknown): string {
    const text = String(value ?? "");
    return this.strings()[text] ?? text;
  }
}
@Pipe({ name: "nativeText", standalone: true, pure: false })
export class CalendarNativeTextPipe implements PipeTransform {
  private readonly localization = inject(CalendarLocalization);
  transform(value: unknown) {
    return this.localization.text(value);
  }
}
@Pipe({ name: "nativeDate", standalone: true, pure: false })
export class CalendarNativeDatePipe implements PipeTransform {
  private readonly localization = inject(CalendarLocalization);
  transform(value: string | Date | undefined, format = "medium"): string {
    if (!value) return "";
    const date =
      typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? new Date(value + "T12:00:00")
        : new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    const formats: Record<string, Intl.DateTimeFormatOptions> = {
      "MMMM yyyy": { month: "long", year: "numeric" },
      MMMM: { month: "long" },
      MMM: {month:'short'}, EEEEE:{weekday:'narrow'}, EEE:{weekday:'short'},
      'EEE dd.MM.yy':{weekday:'short',day:'2-digit',month:'2-digit',year:'2-digit'},
      mediumDate:{dateStyle:'medium'},
      "MMM d": { month: "short", day: "numeric" },
      fullDate: { dateStyle: "full" },
      shortDate: { dateStyle: "short" },
      shortTime: { hour: "numeric", minute: "2-digit" },
      medium: { dateStyle: "medium", timeStyle: "short" },
      "EEEE, MMMM d, y": { dateStyle: "full" },
    };
    return new Intl.DateTimeFormat(
      this.localization.formattingLocale(),
      formats[format] ?? { dateStyle: "medium" },
    ).format(date);
  }
}
