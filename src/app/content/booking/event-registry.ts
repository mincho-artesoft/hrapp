import { LocaleCode } from '../../core/locales';
import { EventCopy } from './types';
import { EVENT_EN_US } from './event-en';
import { EVENT_AR_SA } from './event-ar-SA';
import { EVENT_CS } from './event-cs';
import { EVENT_DA } from './event-da';
import { EVENT_DE_DE } from './event-de-DE';
import { EVENT_EL } from './event-el';
import { EVENT_ES_ES } from './event-es-ES';
import { EVENT_FI } from './event-fi';
import { EVENT_FR_FR } from './event-fr-FR';
import { EVENT_HE } from './event-he';
import { EVENT_HI } from './event-hi';
import { EVENT_HU } from './event-hu';
import { EVENT_ID } from './event-id';
import { EVENT_IT } from './event-it';
import { EVENT_JA } from './event-ja';
import { EVENT_KO } from './event-ko';
import { EVENT_MS } from './event-ms';
import { EVENT_NL_NL } from './event-nl-NL';
import { EVENT_NO } from './event-no';
import { EVENT_PL } from './event-pl';
import { EVENT_PT_BR } from './event-pt-BR';
import { EVENT_RO } from './event-ro';
import { EVENT_RU } from './event-ru';
import { EVENT_SV } from './event-sv';
import { EVENT_TH } from './event-th';
import { EVENT_TR } from './event-tr';
import { EVENT_VI } from './event-vi';
import { EVENT_ZH_HANS } from './event-zh-Hans';
import { EVENT_ZH_HANT } from './event-zh-Hant';

/** The shareable-events copy, per language — English fallback. */
export const EVENT_COPY: Readonly<Record<LocaleCode, EventCopy>> = {
  'en-US': EVENT_EN_US,
  'ar-SA': EVENT_AR_SA,
  cs: EVENT_CS,
  da: EVENT_DA,
  'de-DE': EVENT_DE_DE,
  el: EVENT_EL,
  'es-ES': EVENT_ES_ES,
  fi: EVENT_FI,
  'fr-FR': EVENT_FR_FR,
  he: EVENT_HE,
  hi: EVENT_HI,
  hu: EVENT_HU,
  id: EVENT_ID,
  it: EVENT_IT,
  ja: EVENT_JA,
  ko: EVENT_KO,
  ms: EVENT_MS,
  'nl-NL': EVENT_NL_NL,
  no: EVENT_NO,
  pl: EVENT_PL,
  'pt-BR': EVENT_PT_BR,
  ro: EVENT_RO,
  ru: EVENT_RU,
  sv: EVENT_SV,
  th: EVENT_TH,
  tr: EVENT_TR,
  vi: EVENT_VI,
  'zh-Hans': EVENT_ZH_HANS,
  'zh-Hant': EVENT_ZH_HANT,
};

export function eventCopyFor(code: string): EventCopy {
  return EVENT_COPY[code as LocaleCode] ?? EVENT_EN_US;
}
