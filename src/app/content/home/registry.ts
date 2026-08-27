import { LocaleCode } from '../../core/locales';
import { HOME_EN_US } from './en-US';
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
};

export function homeCopyFor(code: string): HomeCopy {
  return HOME_COPY[code as LocaleCode] ?? HOME_EN_US;
}

/** Languages whose home page is genuinely in that language. */
export function homeIsTranslated(code: string): boolean {
  return code in HOME_COPY;
}
