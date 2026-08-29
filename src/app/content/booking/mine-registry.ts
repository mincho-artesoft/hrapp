import { LocaleCode } from '../../core/locales';
import { BookingMineCopy } from './types';
import { BOOKING_MINE_EN_US } from './mine-en';
import { BOOKING_MINE_AR_SA } from './mine-ar-SA';
import { BOOKING_MINE_CS } from './mine-cs';
import { BOOKING_MINE_DA } from './mine-da';
import { BOOKING_MINE_DE_DE } from './mine-de-DE';
import { BOOKING_MINE_EL } from './mine-el';
import { BOOKING_MINE_ES_ES } from './mine-es-ES';
import { BOOKING_MINE_FI } from './mine-fi';
import { BOOKING_MINE_FR_FR } from './mine-fr-FR';
import { BOOKING_MINE_HE } from './mine-he';
import { BOOKING_MINE_HI } from './mine-hi';
import { BOOKING_MINE_HU } from './mine-hu';
import { BOOKING_MINE_ID } from './mine-id';
import { BOOKING_MINE_IT } from './mine-it';
import { BOOKING_MINE_JA } from './mine-ja';
import { BOOKING_MINE_KO } from './mine-ko';
import { BOOKING_MINE_MS } from './mine-ms';
import { BOOKING_MINE_NL_NL } from './mine-nl-NL';
import { BOOKING_MINE_NO } from './mine-no';
import { BOOKING_MINE_PL } from './mine-pl';
import { BOOKING_MINE_PT_BR } from './mine-pt-BR';
import { BOOKING_MINE_RO } from './mine-ro';
import { BOOKING_MINE_RU } from './mine-ru';
import { BOOKING_MINE_SV } from './mine-sv';
import { BOOKING_MINE_TH } from './mine-th';
import { BOOKING_MINE_TR } from './mine-tr';
import { BOOKING_MINE_VI } from './mine-vi';
import { BOOKING_MINE_ZH_HANS } from './mine-zh-Hans';
import { BOOKING_MINE_ZH_HANT } from './mine-zh-Hant';

/** The "my bookings" page, per language — all twenty-nine, English fallback. */
export const BOOKING_MINE_COPY: Readonly<Record<LocaleCode, BookingMineCopy>> = {
  'en-US': BOOKING_MINE_EN_US,
  'ar-SA': BOOKING_MINE_AR_SA,
  cs: BOOKING_MINE_CS,
  da: BOOKING_MINE_DA,
  'de-DE': BOOKING_MINE_DE_DE,
  el: BOOKING_MINE_EL,
  'es-ES': BOOKING_MINE_ES_ES,
  fi: BOOKING_MINE_FI,
  'fr-FR': BOOKING_MINE_FR_FR,
  he: BOOKING_MINE_HE,
  hi: BOOKING_MINE_HI,
  hu: BOOKING_MINE_HU,
  id: BOOKING_MINE_ID,
  it: BOOKING_MINE_IT,
  ja: BOOKING_MINE_JA,
  ko: BOOKING_MINE_KO,
  ms: BOOKING_MINE_MS,
  'nl-NL': BOOKING_MINE_NL_NL,
  no: BOOKING_MINE_NO,
  pl: BOOKING_MINE_PL,
  'pt-BR': BOOKING_MINE_PT_BR,
  ro: BOOKING_MINE_RO,
  ru: BOOKING_MINE_RU,
  sv: BOOKING_MINE_SV,
  th: BOOKING_MINE_TH,
  tr: BOOKING_MINE_TR,
  vi: BOOKING_MINE_VI,
  'zh-Hans': BOOKING_MINE_ZH_HANS,
  'zh-Hant': BOOKING_MINE_ZH_HANT,
};

export function bookingMineCopyFor(code: string): BookingMineCopy {
  return BOOKING_MINE_COPY[code as LocaleCode] ?? BOOKING_MINE_EN_US;
}
