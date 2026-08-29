/**
 * "Book", the header link to the booking page, in each published language.
 *
 * Kept apart from the booking page's own copy for the same reason
 * {@link ./store-cta} is kept apart from the article chrome: this one word is
 * shell text, shown in the header of every page, while the rest of the booking
 * copy is a whole screen that only the booking route ever renders. Importing
 * the full per-language booking registry into the app shell would drag that
 * entire screen of copy — twenty-nine languages of it — into the initial bundle
 * of every page on the site. This map is the single word the header needs.
 */
export const BOOK_NAV: Readonly<Record<string, string>> = {
  'en-US': 'Book',
  'ar-SA': 'حجز',
  cs: 'Rezervace',
  da: 'Book',
  'de-DE': 'Buchen',
  el: 'Κράτηση',
  'es-ES': 'Reservar',
  fi: 'Varaa',
  'fr-FR': 'Réserver',
  he: 'קביעת פגישה',
  hi: 'बुकिंग',
  hu: 'Foglalás',
  id: 'Pesan',
  it: 'Prenota',
  ja: '予約',
  ko: '예약',
  ms: 'Tempah',
  'nl-NL': 'Boeken',
  no: 'Book',
  pl: 'Rezerwuj',
  'pt-BR': 'Agendar',
  ro: 'Rezervări',
  ru: 'Запись',
  sv: 'Boka',
  th: 'จอง',
  tr: 'Randevu',
  vi: 'Đặt lịch',
  'zh-Hans': '预约',
  'zh-Hant': '預約',
};

export function bookNav(code: string): string {
  return BOOK_NAV[code] ?? BOOK_NAV['en-US'];
}
