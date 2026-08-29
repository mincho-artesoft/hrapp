import { LocaleCode } from '../../core/locales';
import { BookingCopy } from './types';
import { BOOKING_EN_US } from './en-US';
import { BOOKING_AR_SA } from './ar-SA';
import { BOOKING_CS } from './cs';
import { BOOKING_DA } from './da';
import { BOOKING_DE_DE } from './de-DE';
import { BOOKING_EL } from './el';
import { BOOKING_ES_ES } from './es-ES';
import { BOOKING_FI } from './fi';
import { BOOKING_FR_FR } from './fr-FR';
import { BOOKING_HE } from './he';
import { BOOKING_HI } from './hi';
import { BOOKING_HU } from './hu';
import { BOOKING_ID } from './id';
import { BOOKING_IT } from './it';
import { BOOKING_JA } from './ja';
import { BOOKING_KO } from './ko';
import { BOOKING_MS } from './ms';
import { BOOKING_NL_NL } from './nl-NL';
import { BOOKING_NO } from './no';
import { BOOKING_PL } from './pl';
import { BOOKING_PT_BR } from './pt-BR';
import { BOOKING_RO } from './ro';
import { BOOKING_RU } from './ru';
import { BOOKING_SV } from './sv';
import { BOOKING_TH } from './th';
import { BOOKING_TR } from './tr';
import { BOOKING_VI } from './vi';
import { BOOKING_ZH_HANS } from './zh-Hans';
import { BOOKING_ZH_HANT } from './zh-Hant';

/**
 * The booking page, per language.
 *
 * All twenty-nine ship at once — unlike the articles, this is a single short
 * screen of copy, so there is no half-translated middle state to avoid. The
 * registry still falls back to English by code so a locale that is ever added
 * to {@link LocaleCode} before its file lands renders in English rather than
 * crashing the router.
 */
export const BOOKING_COPY: Readonly<Record<LocaleCode, BookingCopy>> = {
  'en-US': BOOKING_EN_US,
  'ar-SA': BOOKING_AR_SA,
  cs: BOOKING_CS,
  da: BOOKING_DA,
  'de-DE': BOOKING_DE_DE,
  el: BOOKING_EL,
  'es-ES': BOOKING_ES_ES,
  fi: BOOKING_FI,
  'fr-FR': BOOKING_FR_FR,
  he: BOOKING_HE,
  hi: BOOKING_HI,
  hu: BOOKING_HU,
  id: BOOKING_ID,
  it: BOOKING_IT,
  ja: BOOKING_JA,
  ko: BOOKING_KO,
  ms: BOOKING_MS,
  'nl-NL': BOOKING_NL_NL,
  no: BOOKING_NO,
  pl: BOOKING_PL,
  'pt-BR': BOOKING_PT_BR,
  ro: BOOKING_RO,
  ru: BOOKING_RU,
  sv: BOOKING_SV,
  th: BOOKING_TH,
  tr: BOOKING_TR,
  vi: BOOKING_VI,
  'zh-Hans': BOOKING_ZH_HANS,
  'zh-Hant': BOOKING_ZH_HANT,
};

export function bookingCopyFor(code: string): BookingCopy {
  return BOOKING_COPY[code as LocaleCode] ?? BOOKING_EN_US;
}
