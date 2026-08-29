import { LocaleCode } from '../../core/locales';
import { BookingManageCopy } from './types';
import { BOOKING_MANAGE_EN_US } from './manage-en';
import { BOOKING_MANAGE_AR_SA } from './manage-ar-SA';
import { BOOKING_MANAGE_CS } from './manage-cs';
import { BOOKING_MANAGE_DA } from './manage-da';
import { BOOKING_MANAGE_DE_DE } from './manage-de-DE';
import { BOOKING_MANAGE_EL } from './manage-el';
import { BOOKING_MANAGE_ES_ES } from './manage-es-ES';
import { BOOKING_MANAGE_FI } from './manage-fi';
import { BOOKING_MANAGE_FR_FR } from './manage-fr-FR';
import { BOOKING_MANAGE_HE } from './manage-he';
import { BOOKING_MANAGE_HI } from './manage-hi';
import { BOOKING_MANAGE_HU } from './manage-hu';
import { BOOKING_MANAGE_ID } from './manage-id';
import { BOOKING_MANAGE_IT } from './manage-it';
import { BOOKING_MANAGE_JA } from './manage-ja';
import { BOOKING_MANAGE_KO } from './manage-ko';
import { BOOKING_MANAGE_MS } from './manage-ms';
import { BOOKING_MANAGE_NL_NL } from './manage-nl-NL';
import { BOOKING_MANAGE_NO } from './manage-no';
import { BOOKING_MANAGE_PL } from './manage-pl';
import { BOOKING_MANAGE_PT_BR } from './manage-pt-BR';
import { BOOKING_MANAGE_RO } from './manage-ro';
import { BOOKING_MANAGE_RU } from './manage-ru';
import { BOOKING_MANAGE_SV } from './manage-sv';
import { BOOKING_MANAGE_TH } from './manage-th';
import { BOOKING_MANAGE_TR } from './manage-tr';
import { BOOKING_MANAGE_VI } from './manage-vi';
import { BOOKING_MANAGE_ZH_HANS } from './manage-zh-Hans';
import { BOOKING_MANAGE_ZH_HANT } from './manage-zh-Hant';

/**
 * The invitee manage page, per language — all twenty-nine, like the booking and
 * setup pages. The fallback stays so a locale added to {@link LocaleCode} before
 * its file lands renders in English rather than crashing.
 */
export const BOOKING_MANAGE_COPY: Readonly<Record<LocaleCode, BookingManageCopy>> = {
  'en-US': BOOKING_MANAGE_EN_US,
  'ar-SA': BOOKING_MANAGE_AR_SA,
  cs: BOOKING_MANAGE_CS,
  da: BOOKING_MANAGE_DA,
  'de-DE': BOOKING_MANAGE_DE_DE,
  el: BOOKING_MANAGE_EL,
  'es-ES': BOOKING_MANAGE_ES_ES,
  fi: BOOKING_MANAGE_FI,
  'fr-FR': BOOKING_MANAGE_FR_FR,
  he: BOOKING_MANAGE_HE,
  hi: BOOKING_MANAGE_HI,
  hu: BOOKING_MANAGE_HU,
  id: BOOKING_MANAGE_ID,
  it: BOOKING_MANAGE_IT,
  ja: BOOKING_MANAGE_JA,
  ko: BOOKING_MANAGE_KO,
  ms: BOOKING_MANAGE_MS,
  'nl-NL': BOOKING_MANAGE_NL_NL,
  no: BOOKING_MANAGE_NO,
  pl: BOOKING_MANAGE_PL,
  'pt-BR': BOOKING_MANAGE_PT_BR,
  ro: BOOKING_MANAGE_RO,
  ru: BOOKING_MANAGE_RU,
  sv: BOOKING_MANAGE_SV,
  th: BOOKING_MANAGE_TH,
  tr: BOOKING_MANAGE_TR,
  vi: BOOKING_MANAGE_VI,
  'zh-Hans': BOOKING_MANAGE_ZH_HANS,
  'zh-Hant': BOOKING_MANAGE_ZH_HANT,
};

export function bookingManageCopyFor(code: string): BookingManageCopy {
  return BOOKING_MANAGE_COPY[code as LocaleCode] ?? BOOKING_MANAGE_EN_US;
}
