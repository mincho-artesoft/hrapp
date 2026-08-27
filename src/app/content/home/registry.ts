import { LocaleCode } from '../../core/locales';
import { HOME_EN_US } from './en-US';
import { HOME_DE_DE } from './de-DE';
import { HOME_ES_ES } from './es-ES';
import { HOME_FR_FR } from './fr-FR';
import { HOME_IT } from './it';
import { HOME_NL_NL } from './nl-NL';
import { HOME_PT_BR } from './pt-BR';
import { HOME_PL } from './pl';
import { HOME_RU } from './ru';
import { HOME_SV } from './sv';
import { HOME_DA } from './da';
import { HOME_NO } from './no';
import { HOME_FI } from './fi';
import { HOME_CS } from './cs';
import { HOME_HU } from './hu';
import { HOME_RO } from './ro';
import { HOME_EL } from './el';
import { HOME_TR } from './tr';
import { HOME_ID } from './id';
import { HOME_MS } from './ms';
import { HOME_VI } from './vi';
import { HOME_JA } from './ja';
import { HOME_KO } from './ko';
import { HOME_ZH_HANS } from './zh-Hans';
import { HOME_ZH_HANT } from './zh-Hant';
import { HOME_HI } from './hi';
import { HOME_TH } from './th';
import { HOME_AR_SA } from './ar-SA';
import { HOME_HE } from './he';
import { HomeCopy } from './types';

/**
 * The home page, per language.
 *
 * A language is added here as its translation lands. Until then it falls back
 * to English, which is the honest behaviour: a half-translated page is worse
 * than an English one, and the fallback keeps the language switcher from ever
 * pointing at a broken address.
 */
export const HOME_COPY: Readonly<Partial<Record<LocaleCode, HomeCopy>>> = {
  'en-US': HOME_EN_US,
  he: HOME_HE,
  'ar-SA': HOME_AR_SA,
  th: HOME_TH,
  hi: HOME_HI,
  'zh-Hant': HOME_ZH_HANT,
  'zh-Hans': HOME_ZH_HANS,
  ko: HOME_KO,
  ja: HOME_JA,
  vi: HOME_VI,
  ms: HOME_MS,
  id: HOME_ID,
  tr: HOME_TR,
  el: HOME_EL,
  ro: HOME_RO,
  hu: HOME_HU,
  cs: HOME_CS,
  fi: HOME_FI,
  no: HOME_NO,
  da: HOME_DA,
  sv: HOME_SV,
  ru: HOME_RU,
  pl: HOME_PL,
  'pt-BR': HOME_PT_BR,
  'nl-NL': HOME_NL_NL,
  it: HOME_IT,
  'fr-FR': HOME_FR_FR,
  'es-ES': HOME_ES_ES,
  'de-DE': HOME_DE_DE,
};

export function homeCopyFor(code: string): HomeCopy {
  return HOME_COPY[code as LocaleCode] ?? HOME_EN_US;
}

/** Languages whose home page is genuinely in that language. */
export function homeIsTranslated(code: string): boolean {
  return code in HOME_COPY;
}
