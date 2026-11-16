import { ArticleChrome } from '../types';

/**
 * Les mots que partagent tous les articles en français.
 *
 * Séparés des articles pour qu'ajouter une langue consiste à traduire un objet
 * de plus, et non à chercher de l'anglais résiduel dans quarante fichiers.
 */
export const CHROME_FR_FR: ArticleChrome = {
  allArticles: 'Tous les articles',
  hubTitle: 'Guides pour les agendas iCloud, Google et Outlook',
  hubDescription:
    'Des réponses claires sur le partage d’un agenda, la réunion d’iCloud, Google et Outlook dans une seule vue sur iPhone et iPad, les widgets et la météo.',
  commonBelief: 'Ce que presque tout le monde suppose',
  whatIsTrue: 'Ce qui se passe vraiment',
  theNumbers: 'Les chiffres',
  colWhat: 'Ce que cela décrit',
  colValue: 'Valeur',
  practical: 'Que faire',
  faqHeading: 'Questions',
  seeAlso: 'À lire aussi',
  updated: 'Dernière révision',
  ctaLine: 'Votre agenda et la météo dans une seule vue — sur iPhone et iPad.',
  gallery: 'À quoi cela ressemble',
  familyWeather: 'La météo',
  familyUnify: 'Une vue, tous les comptes',
  familyWidgets: "Widgets et écran d'accueil",
  familySharing: 'Partage',
  familyPlanning: 'Planifier et modifier',
  familyCompare: 'Coût et comparaison',
};
