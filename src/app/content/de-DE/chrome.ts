import { ArticleChrome } from '../types';

/**
 * Die Wörter, die alle deutschen Artikel gemeinsam haben.
 *
 * Getrennt von den Artikeln selbst, damit eine neue Sprache bedeutet: ein
 * Objekt übersetzen plus die Texte, die diese Sprache wirklich hat — statt in
 * vierzig Dateien nach übrig gebliebenem Englisch zu suchen.
 */
export const CHROME_DE_DE: ArticleChrome = {
  allArticles: 'Alle Artikel',
  commonBelief: 'Was die meisten annehmen',
  whatIsTrue: 'Was tatsächlich stimmt',
  theNumbers: 'Die Zahlen',
  colWhat: 'Wofür sie steht',
  colValue: 'Wert',
  practical: 'Was zu tun ist',
  seeAlso: 'Verwandt',
  updated: 'Zuletzt geprüft',
  ctaLine: 'Ihr Kalender und die Vorhersage in einer Ansicht — auf iPhone und iPad.',
  gallery: 'So sieht es aus',
  familyWeather: 'Wetter',
  familyUnify: 'Eine Ansicht, alle Konten',
  familyWidgets: 'Widgets und Home-Bildschirm',
  familySharing: 'Teilen',
  familyPlanning: 'Planen und bearbeiten',
  familyCompare: 'Kosten und Vergleich',
};
