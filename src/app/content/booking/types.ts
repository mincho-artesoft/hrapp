/**
 * Every word the booking page shows a reader, per language.
 *
 * The booking page has two audiences in one component. A visitor who arrives
 * with no owner handle sees the landing copy — the marketing pitch and the CTA
 * that sends them to the app to create their own bookable calendar. A visitor
 * who follows an owner's link (`/book?c=xxxx`) sees the scheduler chrome:
 * the meeting facts, the day strip, the slot labels, the confirmation form.
 *
 * The App Store button label is not here — it is shared shell text and already
 * lives in {@link ../../core/store-cta}. The owner CTA on the landing links to
 * the store too, but with its own booking-specific wording ("Create your
 * booking page"), so that string is ours.
 */
export interface BookingCopy {
  /** <head> title and description for the landing page. */
  readonly seoTitle: string;
  readonly seoDescription: string;

  // --- Landing (no owner handle) ---
  readonly eyebrow: string;
  readonly landingTitle: string;
  readonly landingLead: string;
  /** Three or four selling points, each shown with a bullet. */
  readonly points: readonly string[];
  /** Label on the button that sends an owner to the App Store to set up. */
  readonly ownerCta: string;
  readonly backHome: string;
  /** Sample card under the pitch. */
  readonly demoName: string;
  readonly demoMeta: string;

  // --- Scheduler chrome (following an owner's link) ---
  /** Unit shown after a duration number, e.g. "30 min". */
  readonly minutes: string;
  readonly powered: string;
  readonly pickTime: string;
  /** Small label under each open slot block. */
  readonly available: string;
  readonly noTimes: string;

  // --- Confirmation form ---
  readonly confirmDetails: string;
  readonly name: string;
  readonly email: string;
  readonly notes: string;
  readonly schedule: string;

  // --- Done ---
  readonly scheduled: string;
  readonly scheduledSub: string;
  readonly addToCalendar: string;

  // --- Errors ---
  readonly genericError: string;
  readonly slotTaken: string;
}

/**
 * Every word the owner-setup page shows — the form where a subscriber defines
 * their own bookable calendar, at `/book/setup`.
 *
 * Kept in its own interface (and its own fallback registry) rather than folded
 * into {@link BookingCopy} so the two can ship on different schedules: the
 * public page went out in all twenty-nine languages at once, while this form is
 * a tool behind a CTA and can fill in languages as they land, falling back to
 * English until then.
 */
export interface BookingSetupCopy {
  readonly seoTitle: string;
  readonly seoDescription: string;

  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;

  // Profile
  readonly profileTitle: string;
  readonly yourName: string;
  readonly yourNamePlaceholder: string;
  readonly timeZone: string;

  // Meeting types
  readonly typesTitle: string;
  readonly typesHint: string;
  readonly typeName: string;
  readonly typeNamePlaceholder: string;
  readonly duration: string;
  readonly locationLabel: string;
  readonly locationPlaceholder: string;
  readonly descriptionLabel: string;
  readonly descriptionPlaceholder: string;
  readonly addType: string;
  readonly removeType: string;

  // Availability
  readonly availabilityTitle: string;
  readonly availabilityHint: string;
  readonly from: string;
  readonly to: string;

  // Rules
  readonly rulesTitle: string;
  readonly slotInterval: string;
  readonly minNotice: string;
  readonly maxAdvance: string;
  /** Units shown beside the rule numbers. */
  readonly hours: string;
  readonly days: string;
  readonly minutesUnit: string;

  // Actions
  readonly create: string;
  readonly saveChanges: string;
  readonly saving: string;

  // Success
  readonly successTitle: string;
  readonly successLead: string;
  readonly shareLabel: string;
  readonly copy: string;
  readonly copied: string;
  readonly subscribeLabel: string;
  readonly subscribeHint: string;
  readonly subscribeAction: string;
  readonly keepNote: string;
  readonly openPage: string;
  readonly editAgain: string;

  // Errors
  readonly errNeedName: string;
  readonly errNeedType: string;
  readonly errNeedAvailability: string;
  readonly errGeneric: string;

  readonly backHome: string;
}

/**
 * The invitee's manage page (`/booking/manage?t=…`), where the person who booked
 * can move or cancel their own time without an account — the token in the link
 * is their whole identity here.
 */
export interface BookingManageCopy {
  readonly seoTitle: string;
  readonly seoDescription: string;

  readonly eyebrow: string;
  readonly title: string;
  readonly whenLabel: string;
  readonly reschedule: string;
  readonly cancel: string;
  readonly addToCalendar: string;

  readonly pickNew: string;
  readonly minutes: string;
  readonly available: string;
  readonly noTimes: string;
  readonly confirmMove: string;
  readonly keepCurrent: string;

  readonly movedTitle: string;
  readonly movedSub: string;

  readonly cancelTitle: string;
  readonly cancelBody: string;
  readonly cancelConfirm: string;
  readonly keepIt: string;
  readonly cancelledTitle: string;
  readonly cancelledSub: string;

  readonly notFound: string;
  readonly genericError: string;
  readonly slotTaken: string;
  readonly backHome: string;
  /** Shown on the booking confirmation, linking to this page. */
  readonly manageLinkLabel: string;
}
