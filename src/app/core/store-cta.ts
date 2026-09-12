/**
 * "Download on the App Store", in each published language.
 *
 * Kept apart from ArticleChrome because it is shell text rather than article
 * text: the header and footer say it on every page, including pages that are
 * not articles. Putting it here means adding a language touches one file
 * instead of thirty-four.
 *
 * Apple ships the badge artwork already localised; this is the plain-text
 * button, which is ours to translate. Leaving it in English on a Japanese page
 * is the same class of mistake as leaving the meta description in English —
 * small, and visible to exactly the reader you were trying to reach.
 */
export const STORE_CTA: Readonly<Record<string, string>> = {
  'en-US': 'Download on the App Store',
  'ar-SA': 'التنزيل من App Store',
  bg: 'Изтеглете от App Store',
  cs: 'Stáhnout z App Store',
  da: 'Hent i App Store',
  'de-DE': 'Laden im App Store',
  el: 'Λήψη από το App Store',
  'es-ES': 'Consíguelo en el App Store',
  fi: 'Lataa App Storesta',
  'fr-FR': 'Télécharger dans l’App Store',
  he: 'הורדה מ‑App Store',
  hi: 'App Store से डाउनलोड करें',
  hu: 'Letöltés az App Store-ból',
  id: 'Unduh di App Store',
  it: 'Scarica su App Store',
  ja: 'App Store からダウンロード',
  ko: 'App Store에서 다운로드',
  ms: 'Muat turun di App Store',
  'nl-NL': 'Download in de App Store',
  no: 'Last ned i App Store',
  pl: 'Pobierz w App Store',
  'pt-BR': 'Baixar na App Store',
  ro: 'Descarcă din App Store',
  ru: 'Загрузить в App Store',
  sv: 'Hämta i App Store',
  th: 'ดาวน์โหลดบน App Store',
  tr: "App Store'dan indirin",
  vi: 'Tải xuống trên App Store',
  'zh-Hans': '从 App Store 下载',
  'zh-Hant': '從 App Store 下載',
};

export function storeCta(code: string): string {
  return STORE_CTA[code] ?? STORE_CTA['en-US'];
}
