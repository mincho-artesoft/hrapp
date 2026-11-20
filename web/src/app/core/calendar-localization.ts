import { Injectable, Pipe, PipeTransform, computed, inject, signal } from "@angular/core";
import languages from "../components/calendar-native/native-languages.json";

import { DEFAULT_LOCALE, LOCALES, Locale } from "./locales";

import { calendarDateFormatter, calendarHourCycle } from "./calendar-format-preferences";

const supported = new Set(languages.map(language => language.value));

function dictionaryCode(tag: string): string {
  if (supported.has(tag)) return tag;
  const base = tag.split("-")[0];
  if (base === "no") return "nb";
  if (base === "zh") return new Intl.Locale(tag).maximize().script === "Hant" ? "zh-Hant" : "zh-Hans";
  return supported.has(base) ? base : "en";
}

const siteLanguages = new Map(LOCALES.map(locale => [dictionaryCode(locale.hreflang), locale]));

export function siteForCalendarLanguage(code: string): Locale {
  const family = code === "zh-HK" ? "zh-Hant" : code.split("-")[0];
  return siteLanguages.get(code) ?? siteLanguages.get(family) ?? DEFAULT_LOCALE;
}

export function calendarLanguageDirection(code: string): "rtl" | "ltr" {
  return ["ar", "he", "ur"].includes(code) ? "rtl" : "ltr";
}

@Injectable({ providedIn: "root" })
export class CalendarLocalization {
  readonly languages = languages;
  readonly locale = signal("en");
  readonly formattingLocale = signal("en");
  readonly direction = computed(() => calendarLanguageDirection(this.locale()));
  readonly preferences = signal<Record<string, string>>({});
  readonly datePreference = computed(() => this.preferences()["date"] ?? "system");
  readonly shortDate = computed(() => calendarDateFormatter(this.formattingLocale(), this.datePreference()));
  readonly shortTime = computed(() => new Intl.DateTimeFormat(this.formattingLocale(), {
    hour: "numeric", minute: "2-digit", hourCycle: calendarHourCycle(this.preferences()["time"]),
  }));
  private readonly strings = signal<Record<string, string>>({});
  private request = 0;

  async usePageLanguage(site: Locale, explicit: string | null) {
    const browser = typeof window !== "undefined";
    let tag = site.code;
    if (browser) {
      try {
        const saved = localStorage.getItem("cc.calendar.language") ??
          JSON.parse(localStorage.getItem("cc.mac.preferences") || "{}").language;
        if (supported.has(saved) && (!site.slug || siteForCalendarLanguage(saved).code === site.code)) tag = saved;
        else if (!site.slug && (!saved || saved === "system")) tag = navigator.language;
      } catch {}
    }
    const selected = explicit !== null && supported.has(explicit);
    if (selected) tag = explicit;
    const code = dictionaryCode(tag);
    const request = ++this.request;
    if (code !== this.locale()) {
      let strings: Record<string, string> = {};
      if (browser && code !== "en") {
        try {
          const response = await fetch(`/calendar-locales/${code}.json`);
          if (!response.ok) return;
          strings = await response.json();
        } catch { return; }
      }
      if (request !== this.request) return;
      this.strings.set(strings);
      this.locale.set(code);
    }
    this.formattingLocale.set(tag);
    if (selected && browser) {
      try { localStorage.setItem("cc.calendar.language", code); } catch {}
    }
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
    if (format === "shortDate") return this.localization.shortDate()(date);
    if (format === "shortTime") return this.localization.shortTime().format(date);
    const formats: Record<string, Intl.DateTimeFormatOptions> = {
      "MMMM yyyy": { month: "long", year: "numeric" },
      MMMM: { month: "long" },
      MMM: {month:'short'}, EEEEE:{weekday:'narrow'}, EEE:{weekday:'short'},
      'EEE dd.MM.yy':{weekday:'short',day:'2-digit',month:'2-digit',year:'2-digit'},
      mediumDate:{dateStyle:'medium'},
      "MMM d": { month: "short", day: "numeric" },
      fullDate: { dateStyle: "full" },
      medium: { dateStyle: "medium", timeStyle: "short" },
      "EEEE, MMMM d, y": { dateStyle: "full" },
    };
    return new Intl.DateTimeFormat(
      this.localization.formattingLocale(),
      formats[format] ?? { dateStyle: "medium" },
    ).format(date);
  }
}
