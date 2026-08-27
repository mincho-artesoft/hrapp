import { ArticleChrome } from '../types';

/**
 * Las palabras que comparten todos los artículos en español.
 *
 * Separadas de los artículos para que añadir un idioma signifique traducir un
 * objeto más los textos que ese idioma realmente tiene, en lugar de buscar
 * inglés suelto dentro de cuarenta ficheros.
 */
export const CHROME_ES_ES: ArticleChrome = {
  allArticles: 'Todos los artículos',
  commonBelief: 'Lo que casi todo el mundo supone',
  whatIsTrue: 'Lo que de verdad ocurre',
  theNumbers: 'Las cifras',
  colWhat: 'Qué describe',
  colValue: 'Valor',
  practical: 'Qué hacer',
  seeAlso: 'Relacionado',
  updated: 'Última revisión',
  ctaLine: 'Su calendario y la previsión en una sola vista — en iPhone y iPad.',
  gallery: 'Qué aspecto tiene',
  familyWeather: 'El tiempo',
  familyUnify: 'Una vista, todas las cuentas',
  familyWidgets: 'Widgets y pantalla de inicio',
  familySharing: 'Compartir',
  familyPlanning: 'Planificar y editar',
  familyCompare: 'Coste y comparación',
};
