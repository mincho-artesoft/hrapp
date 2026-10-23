import { ARTICLE_FACTS } from './article-facts';
import { ARTICLE_SLUGS } from './article-index';
import type { Family } from './types';

export const ARTICLE_PAGE_SIZE = 24;
export const ARTICLE_FAMILIES: readonly Family[] = ['weather', 'unify', 'widgets', 'sharing', 'planning', 'compare'];
export function topicSlugs(family: Family): readonly string[] {
  return ARTICLE_SLUGS['en-US'].filter(slug => ARTICLE_FACTS[slug]?.family === family);
}
export function topicPageCount(family: Family): number {
  return Math.ceil(topicSlugs(family).length / ARTICLE_PAGE_SIZE);
}
export function topicPath(family: Family, page = 1): string {
  return `/articles/topics/${family}/${page}`;
}
export function topicPrerenderParams(): { family: string; page: string }[] {
  return ARTICLE_FAMILIES.flatMap(family => Array.from({ length: topicPageCount(family) }, (_, index) => ({ family, page: String(index + 1) })));
}
