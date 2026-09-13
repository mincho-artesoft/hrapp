/**
 * The shape of an article, split in two.
 *
 * Facts live once, in article-facts.ts, and are shared by every language:
 * a forecast horizon, a number of supported accounts, a price. Prose lives per
 * language. They are joined by id at render, so a translator can rewrite every
 * sentence on the page and cannot change what the page claims.
 *
 * This is the same separation the sibling nutrition site uses, for the same
 * reason: translation is where numbers go wrong, and a number that disagrees
 * with itself across languages is the kind of error nobody finds for months.
 */

/** Which of the tracked buyer-intent prompts an article answers. */
export type Intent = 'core' | 'unify' | 'widgets' | 'editing' | 'price' | 'compare' | 'device';

/** The thematic group an article belongs to, used for hub grouping. */
export type Family = 'weather' | 'unify' | 'widgets' | 'sharing' | 'planning' | 'compare';

export interface ClaimFact {
  /** Joined to the localised wording by this id. */
  readonly id: string;
  /** The value itself: a number, a duration, a count. Never translated. */
  readonly value: string;
}

export interface ArticleFacts {
  readonly slug: string;
  readonly family: Family;
  readonly intent: Intent;
  /**
   * The prompt id from ai-visibility/prompts.json this page is written to
   * answer, where one applies. Kept so the visibility report and the content
   * can be read against each other rather than drifting apart.
   */
  readonly prompt?: string;
  readonly claims: readonly ClaimFact[];
  /** ISO date the substance last changed. Feeds the sitemap and the page. */
  readonly updated: string;
}

/** A claim as the reader sees it: our wording, the shared value. */
export interface ClaimRow {
  readonly label: string;
  readonly value: string;
}

export interface LocalisedArticle {
  /** Full headline. */
  readonly title: string;
  /** Short form, for cards and breadcrumbs. */
  readonly short: string;
  /** Meta description. Under 160 characters. */
  readonly description: string;
  /** The opening paragraph. */
  readonly lede: string;
  /** What most people assume, named before it is answered. */
  readonly commonBelief?: string;
  readonly sections: readonly { readonly heading: string; readonly body: readonly string[] }[];
  /** Wording for each fact id this article cites. */
  readonly claims: Readonly<Record<string, string>>;
  /** What to actually do, in order. */
  readonly practical: readonly string[];
  readonly seeAlso?: readonly string[];
}

/** Wording shared by every article in one language. */
export interface ArticleChrome {
  readonly allArticles: string;
  /**
   * The hub's <title> and description, which are not its heading.
   *
   * "All articles" is the right words above a list and the wrong words in a
   * search result: nobody types it, so the page drew twenty-four impressions
   * and no clicks. The heading stays; these two say what the list is about.
   */
  readonly hubTitle: string;
  readonly hubDescription: string;
  readonly commonBelief: string;
  readonly whatIsTrue: string;
  readonly theNumbers: string;
  readonly colWhat: string;
  readonly colValue: string;
  readonly practical: string;
  readonly seeAlso: string;
  readonly updated: string;
  readonly ctaLine: string;
  /** Heading above the screenshot rail. */
  readonly gallery: string;
  readonly familyWeather: string;
  readonly familyUnify: string;
  readonly familyWidgets: string;
  readonly familySharing: string;
  readonly familyPlanning: string;
  readonly familyCompare: string;
}

export interface ArticleLocale {
  readonly chrome: ArticleChrome;
  readonly articles: Readonly<Record<string, LocalisedArticle>>;
}
