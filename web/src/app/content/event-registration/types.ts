export interface EventCopy {
  // --- Public event page (/event) ---
  readonly seoTitle: string;
  readonly seoDescription: string;
  readonly eyebrow: string;
  readonly hostedBy: string;
  readonly whenLabel: string;
  readonly whereLabel: string;
  /** Rendered after a number, e.g. "3 spots left". */
  readonly spotsLeft: string;
  readonly full: string;
  readonly cancelledNotice: string;
  readonly registerHeading: string;
  readonly nameLabel: string;
  readonly namePlaceholder: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly registerCta: string;
  readonly registering: string;
  readonly doneTitle: string;
  readonly doneSub: string;
  readonly addToCalendar: string;
  readonly alreadyRegistered: string;
  readonly genericError: string;
  readonly backHome: string;

  // --- Registrant manage (/event/manage) ---
  readonly yourSpotTitle: string;
  readonly cancelSpot: string;
  readonly cancelSpotConfirm: string;
  readonly keepSpot: string;
  readonly spotCancelledTitle: string;
  readonly spotCancelledSub: string;
  readonly regNotFound: string;
}
