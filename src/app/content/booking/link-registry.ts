import { LocaleCode } from '../../core/locales';
import { BookingLinkCopy } from './types';
import { BOOKING_LINK_EN_US } from './link-en';
import { BOOKING_LINK_AR_SA } from './link-ar-SA';
import { BOOKING_LINK_CS } from './link-cs';
import { BOOKING_LINK_DA } from './link-da';
import { BOOKING_LINK_DE_DE } from './link-de-DE';
import { BOOKING_LINK_EL } from './link-el';
import { BOOKING_LINK_ES_ES } from './link-es-ES';
import { BOOKING_LINK_FI } from './link-fi';
import { BOOKING_LINK_FR_FR } from './link-fr-FR';
import { BOOKING_LINK_HE } from './link-he';
import { BOOKING_LINK_HI } from './link-hi';
import { BOOKING_LINK_HU } from './link-hu';
import { BOOKING_LINK_ID } from './link-id';
import { BOOKING_LINK_IT } from './link-it';
import { BOOKING_LINK_JA } from './link-ja';
import { BOOKING_LINK_KO } from './link-ko';
import { BOOKING_LINK_MS } from './link-ms';
import { BOOKING_LINK_NL_NL } from './link-nl-NL';
import { BOOKING_LINK_NO } from './link-no';
import { BOOKING_LINK_PL } from './link-pl';
import { BOOKING_LINK_PT_BR } from './link-pt-BR';
import { BOOKING_LINK_RO } from './link-ro';
import { BOOKING_LINK_RU } from './link-ru';
import { BOOKING_LINK_SV } from './link-sv';
import { BOOKING_LINK_TH } from './link-th';
import { BOOKING_LINK_TR } from './link-tr';
import { BOOKING_LINK_VI } from './link-vi';
import { BOOKING_LINK_ZH_HANS } from './link-zh-Hans';
import { BOOKING_LINK_ZH_HANT } from './link-zh-Hant';

/** The app-pairing screen, per language — English fallback. */
export const BOOKING_LINK_COPY: Readonly<Record<LocaleCode, BookingLinkCopy>> = {
  'en-US': BOOKING_LINK_EN_US,
  'ar-SA': BOOKING_LINK_AR_SA,
  cs: BOOKING_LINK_CS,
  da: BOOKING_LINK_DA,
  'de-DE': BOOKING_LINK_DE_DE,
  el: BOOKING_LINK_EL,
  'es-ES': BOOKING_LINK_ES_ES,
  fi: BOOKING_LINK_FI,
  'fr-FR': BOOKING_LINK_FR_FR,
  he: BOOKING_LINK_HE,
  hi: BOOKING_LINK_HI,
  hu: BOOKING_LINK_HU,
  id: BOOKING_LINK_ID,
  it: BOOKING_LINK_IT,
  ja: BOOKING_LINK_JA,
  ko: BOOKING_LINK_KO,
  ms: BOOKING_LINK_MS,
  'nl-NL': BOOKING_LINK_NL_NL,
  no: BOOKING_LINK_NO,
  pl: BOOKING_LINK_PL,
  'pt-BR': BOOKING_LINK_PT_BR,
  ro: BOOKING_LINK_RO,
  ru: BOOKING_LINK_RU,
  sv: BOOKING_LINK_SV,
  th: BOOKING_LINK_TH,
  tr: BOOKING_LINK_TR,
  vi: BOOKING_LINK_VI,
  'zh-Hans': BOOKING_LINK_ZH_HANS,
  'zh-Hant': BOOKING_LINK_ZH_HANT,
};

export function bookingLinkCopyFor(code: string): BookingLinkCopy {
  return BOOKING_LINK_COPY[code as LocaleCode] ?? BOOKING_LINK_EN_US;
}
