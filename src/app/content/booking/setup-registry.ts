import { LocaleCode } from '../../core/locales';
import { BookingSetupCopy } from './types';
import { BOOKING_SETUP_EN_US } from './setup-en';
import { BOOKING_SETUP_AR_SA } from './setup-ar-SA';
import { BOOKING_SETUP_CS } from './setup-cs';
import { BOOKING_SETUP_DA } from './setup-da';
import { BOOKING_SETUP_DE_DE } from './setup-de-DE';
import { BOOKING_SETUP_EL } from './setup-el';
import { BOOKING_SETUP_ES_ES } from './setup-es-ES';
import { BOOKING_SETUP_FI } from './setup-fi';
import { BOOKING_SETUP_FR_FR } from './setup-fr-FR';
import { BOOKING_SETUP_HE } from './setup-he';
import { BOOKING_SETUP_HI } from './setup-hi';
import { BOOKING_SETUP_HU } from './setup-hu';
import { BOOKING_SETUP_ID } from './setup-id';
import { BOOKING_SETUP_IT } from './setup-it';
import { BOOKING_SETUP_JA } from './setup-ja';
import { BOOKING_SETUP_KO } from './setup-ko';
import { BOOKING_SETUP_MS } from './setup-ms';
import { BOOKING_SETUP_NL_NL } from './setup-nl-NL';
import { BOOKING_SETUP_NO } from './setup-no';
import { BOOKING_SETUP_PL } from './setup-pl';
import { BOOKING_SETUP_PT_BR } from './setup-pt-BR';
import { BOOKING_SETUP_RO } from './setup-ro';
import { BOOKING_SETUP_RU } from './setup-ru';
import { BOOKING_SETUP_SV } from './setup-sv';
import { BOOKING_SETUP_TH } from './setup-th';
import { BOOKING_SETUP_TR } from './setup-tr';
import { BOOKING_SETUP_VI } from './setup-vi';
import { BOOKING_SETUP_ZH_HANS } from './setup-zh-Hans';
import { BOOKING_SETUP_ZH_HANT } from './setup-zh-Hant';

/**
 * The owner-setup form, per language.
 *
 * Ships in all twenty-nine like the public booking page. Kept a `Record` (not a
 * `Partial`) now that every language is present; the fallback still stands so a
 * future locale added to {@link LocaleCode} before its file lands renders in
 * English rather than crashing.
 */
export const BOOKING_SETUP_COPY: Readonly<Record<LocaleCode, BookingSetupCopy>> = {
  'en-US': BOOKING_SETUP_EN_US,
  'ar-SA': BOOKING_SETUP_AR_SA,
  cs: BOOKING_SETUP_CS,
  da: BOOKING_SETUP_DA,
  'de-DE': BOOKING_SETUP_DE_DE,
  el: BOOKING_SETUP_EL,
  'es-ES': BOOKING_SETUP_ES_ES,
  fi: BOOKING_SETUP_FI,
  'fr-FR': BOOKING_SETUP_FR_FR,
  he: BOOKING_SETUP_HE,
  hi: BOOKING_SETUP_HI,
  hu: BOOKING_SETUP_HU,
  id: BOOKING_SETUP_ID,
  it: BOOKING_SETUP_IT,
  ja: BOOKING_SETUP_JA,
  ko: BOOKING_SETUP_KO,
  ms: BOOKING_SETUP_MS,
  'nl-NL': BOOKING_SETUP_NL_NL,
  no: BOOKING_SETUP_NO,
  pl: BOOKING_SETUP_PL,
  'pt-BR': BOOKING_SETUP_PT_BR,
  ro: BOOKING_SETUP_RO,
  ru: BOOKING_SETUP_RU,
  sv: BOOKING_SETUP_SV,
  th: BOOKING_SETUP_TH,
  tr: BOOKING_SETUP_TR,
  vi: BOOKING_SETUP_VI,
  'zh-Hans': BOOKING_SETUP_ZH_HANS,
  'zh-Hant': BOOKING_SETUP_ZH_HANT,
};

export function bookingSetupCopyFor(code: string): BookingSetupCopy {
  return BOOKING_SETUP_COPY[code as LocaleCode] ?? BOOKING_SETUP_EN_US;
}
