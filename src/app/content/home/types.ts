/**
 * Every word the home page shows a reader.
 *
 * The articles were translated first, which left the site in a state worse
 * than either extreme: a reader could switch to Japanese, get twenty-nine
 * languages of articles, and land back on an English front door. A language
 * switcher that visibly fails on the most important page is a worse signal
 * than no switcher at all.
 *
 * So the copy comes out of the components and into one object per language,
 * the same shape the articles already use. Components render what they are
 * given; nothing user-facing is written inside a template any more.
 *
 * What is deliberately NOT here: the mock event chips inside the 3D device
 * stage and the gesture demonstration. Those are aria-hidden depictions of the
 * app's own interface, not page copy, and the real screenshots beside them are
 * already per-locale images from the App Store.
 */

export interface Titled {
  readonly title: string;
  readonly body: string;
}

export interface Section {
  readonly eyebrow: string;
  /** Rendered as two lines; the second is the accented half. */
  readonly title: readonly [string, string];
  readonly lead: string;
}

export interface ShowcasePanel {
  readonly kicker: string;
  readonly title: string;
  readonly body: string;
  readonly alt: string;
  readonly bullets: readonly string[];
}

export interface PlanCopy {
  readonly name: string;
  readonly tagline: string;
  readonly features: readonly string[];
  readonly yearlyNote?: string;
}

export interface HomeCopy {
  /** Title and description for <head>. */
  readonly metaTitle: string;
  readonly metaDescription: string;

  readonly nav: {
    readonly tour: string;
    readonly widgets: string;
    readonly weather: string;
    readonly features: string;
    readonly pricing: string;
    readonly faq: string;
    readonly articles: string;
    /** Short label for the header button; the long badge phrase does not fit. */
    readonly getApp: string;
    readonly menu: string;
    readonly language: string;
  };

  readonly hero: {
    readonly badge: string;
    /** Three lines; the second is accented. */
    readonly title: readonly [string, string, string];
    readonly lead: string;
    readonly seeItMove: string;
    readonly onTheAppStore: string;
    readonly freeToStart: string;
    readonly scroll: string;
    readonly ratingLabel: string;
    /** Alt text for the three phones in the hero. */
    readonly altMonth: string;
    readonly altDay: string;
    readonly altWeather: string;
  };

  /** The scrolling capability strip under the hero. */
  readonly marquee: readonly string[];

  readonly showcase: Section & { readonly panels: readonly ShowcasePanel[] };

  readonly widgets: Section & {
    readonly newIn: string;
    readonly items: readonly Titled[];
  };

  readonly weather: Section & {
    readonly searchLabel: string;
    readonly searchPlaceholder: string;
    readonly searching: string;
    readonly alt: string;
    /** Shown when the live fetch fails and the sample data stands in. */
    readonly unavailable: string;
    /** "Live from Open-Meteo, as of {t}." — {t} is the observation time. */
    readonly liveFrom: string;
    readonly tapAnHour: string;
    readonly readings: {
      readonly feelsLike: string;
      readonly precipitation: string;
      readonly uv: string;
      readonly wind: string;
      readonly humidity: string;
      readonly pressure: string;
    };
  };

  readonly features: Section & {
    readonly unified: Titled;
    readonly gestures: Titled;
    readonly tiles: readonly (Titled & { readonly badge: string })[];
    readonly sourceNotes: {
      readonly builtIn: string;
      readonly twoWay: string;
      readonly premium: string;
    };
  };

  readonly pricing: Section & {
    readonly monthly: string;
    readonly yearly: string;
    readonly saveMore: string;
    readonly billingPeriod: string;
    readonly mostPopular: string;
    /** "Everything in {tier}, plus:" — {tier} is substituted. */
    readonly everythingIn: string;
    readonly forever: string;
    readonly perMonth: string;
    readonly perYear: string;
    readonly downloadFree: string;
    /** "Start with {tier}" — {tier} is substituted. */
    readonly startWith: string;
    readonly note: string;
    readonly plans: {
      readonly free: PlanCopy;
      readonly advanced: PlanCopy;
      readonly premium: PlanCopy;
    };
  };

  readonly faq: Section & {
    readonly privacyLink: string;
    readonly items: readonly { readonly q: string; readonly a: string }[];
  };

  readonly cta: {
    readonly title: readonly [string, string];
    readonly lead: string;
    /** "from {n} ratings" — {n} is substituted. */
    readonly fromRatings: string;
    readonly download: string;
    readonly requiresIos: string;
    readonly alt: string;
  };

  readonly footer: {
    readonly tagline: string;
    readonly product: string;
    readonly legal: string;
    readonly app: string;
    readonly privacy: string;
    readonly terms: string;
    readonly eula: string;
    /** "Version {v}" — {v} is substituted. */
    readonly version: string;
    readonly iosOrLater: string;
    readonly viewOnStore: string;
    /** "© {year} {developer}. All rights reserved." */
    readonly rights: string;
    readonly weatherBy: string;
  };
}
