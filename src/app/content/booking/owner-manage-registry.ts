import { LocaleCode } from '../../core/locales';
import { OwnerManageCopy } from './types';
import { OWNER_MANAGE_EN_US } from './owner-manage-en';
import { OWNER_MANAGE_AR_SA } from './owner-manage-ar-SA';
import { OWNER_MANAGE_CS } from './owner-manage-cs';
import { OWNER_MANAGE_DA } from './owner-manage-da';
import { OWNER_MANAGE_DE_DE } from './owner-manage-de-DE';
import { OWNER_MANAGE_EL } from './owner-manage-el';
import { OWNER_MANAGE_ES_ES } from './owner-manage-es-ES';
import { OWNER_MANAGE_FI } from './owner-manage-fi';
import { OWNER_MANAGE_FR_FR } from './owner-manage-fr-FR';
import { OWNER_MANAGE_HE } from './owner-manage-he';
import { OWNER_MANAGE_HI } from './owner-manage-hi';
import { OWNER_MANAGE_HU } from './owner-manage-hu';
import { OWNER_MANAGE_ID } from './owner-manage-id';
import { OWNER_MANAGE_IT } from './owner-manage-it';
import { OWNER_MANAGE_JA } from './owner-manage-ja';
import { OWNER_MANAGE_KO } from './owner-manage-ko';
import { OWNER_MANAGE_MS } from './owner-manage-ms';
import { OWNER_MANAGE_NL_NL } from './owner-manage-nl-NL';
import { OWNER_MANAGE_NO } from './owner-manage-no';
import { OWNER_MANAGE_PL } from './owner-manage-pl';
import { OWNER_MANAGE_PT_BR } from './owner-manage-pt-BR';
import { OWNER_MANAGE_RO } from './owner-manage-ro';
import { OWNER_MANAGE_RU } from './owner-manage-ru';
import { OWNER_MANAGE_SV } from './owner-manage-sv';
import { OWNER_MANAGE_TH } from './owner-manage-th';
import { OWNER_MANAGE_TR } from './owner-manage-tr';
import { OWNER_MANAGE_VI } from './owner-manage-vi';
import { OWNER_MANAGE_ZH_HANS } from './owner-manage-zh-Hans';
import { OWNER_MANAGE_ZH_HANT } from './owner-manage-zh-Hant';

/** The owner's incoming-bookings panel, per language — English fallback. */
export const OWNER_MANAGE_COPY: Readonly<Record<LocaleCode, OwnerManageCopy>> = {
  'en-US': OWNER_MANAGE_EN_US,
  'ar-SA': OWNER_MANAGE_AR_SA,
  cs: OWNER_MANAGE_CS,
  da: OWNER_MANAGE_DA,
  'de-DE': OWNER_MANAGE_DE_DE,
  el: OWNER_MANAGE_EL,
  'es-ES': OWNER_MANAGE_ES_ES,
  fi: OWNER_MANAGE_FI,
  'fr-FR': OWNER_MANAGE_FR_FR,
  he: OWNER_MANAGE_HE,
  hi: OWNER_MANAGE_HI,
  hu: OWNER_MANAGE_HU,
  id: OWNER_MANAGE_ID,
  it: OWNER_MANAGE_IT,
  ja: OWNER_MANAGE_JA,
  ko: OWNER_MANAGE_KO,
  ms: OWNER_MANAGE_MS,
  'nl-NL': OWNER_MANAGE_NL_NL,
  no: OWNER_MANAGE_NO,
  pl: OWNER_MANAGE_PL,
  'pt-BR': OWNER_MANAGE_PT_BR,
  ro: OWNER_MANAGE_RO,
  ru: OWNER_MANAGE_RU,
  sv: OWNER_MANAGE_SV,
  th: OWNER_MANAGE_TH,
  tr: OWNER_MANAGE_TR,
  vi: OWNER_MANAGE_VI,
  'zh-Hans': OWNER_MANAGE_ZH_HANS,
  'zh-Hant': OWNER_MANAGE_ZH_HANT,
};

export function ownerManageCopyFor(code: string): OwnerManageCopy {
  return OWNER_MANAGE_COPY[code as LocaleCode] ?? OWNER_MANAGE_EN_US;
}
