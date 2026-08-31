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

/**
 * The "my bookings" page (`/bookings`), where a person signs in with a magic
 * link e-mailed to the address they booked with, and sees every meeting they
 * have booked across every owner — no account, no password.
 */
export interface BookingMineCopy {
  readonly seoTitle: string;
  readonly seoDescription: string;

  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;

  // Sign-in
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly sendLink: string;
  readonly sending: string;
  readonly checkEmailTitle: string;
  readonly checkEmailSub: string;

  // List
  readonly upcoming: string;
  readonly past: string;
  readonly noBookings: string;
  readonly withLabel: string;
  readonly manage: string;
  readonly cancelledBadge: string;

  // States
  readonly expired: string;
  readonly genericError: string;
  readonly signOut: string;
  readonly backHome: string;
  /** Header/nav label linking here. */
  readonly navLabel: string;
}

/**
 * The owner's view of who has booked them, shown on the setup page once a
 * returning owner is recognised in this browser. From here the host can decline
 * a meeting or move it to another open time; the guest is notified by e-mail.
 *
 * Its own interface and fallback registry, like {@link BookingSetupCopy}: it is
 * a tool behind an owner's link, so it can fill in languages as they land and
 * fall back to English until then.
 */
export interface OwnerManageCopy {
  /** Section heading over the list of incoming bookings. */
  readonly title: string;
  /** One line under the heading explaining what the host can do here. */
  readonly hint: string;
  /** Shown when the host has no upcoming bookings. */
  readonly empty: string;
  /** While the list is loading. */
  readonly loading: string;
  /** The "decline" (cancel) action on a booking. */
  readonly decline: string;
  /** Native-confirm text before a decline goes through. */
  readonly declineConfirm: string;
  /** The "reschedule" (move) action on a booking. */
  readonly reschedule: string;
  /** Heading over the list of new times when moving a booking. */
  readonly pickNew: string;
  /** Shown when no open times exist in the reschedule window. */
  readonly noTimes: string;
  /** Dismiss the reschedule picker, leaving the booking where it is. */
  readonly keepTime: string;
  /** Shown when a decline or move fails. */
  readonly error: string;
}

/**
 * The pairing screen (`/book/link`), where an owner who already uses the iOS app
 * links this browser to their existing account by scanning a QR (or, on the same
 * phone, tapping through to the app). The app approves; the browser then manages
 * the owner's real booking page from the web.
 */
export interface BookingLinkCopy {
  readonly seoTitle: string;
  readonly seoDescription: string;

  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;

  /** Instruction under the QR, for scanning from another device. */
  readonly scanHint: string;
  /** Divider between the QR and the same-device button. */
  readonly or: string;
  /** Button that opens the app to approve, on the same phone. */
  readonly openApp: string;

  /** While polling for the app's approval. */
  readonly waiting: string;
  /** Briefly, once approved, before redirecting to the owner's page. */
  readonly approved: string;
  /** When the short-lived code has expired. */
  readonly expired: string;
  /** Get a fresh code after expiry. */
  readonly refresh: string;
  /** On any failure. */
  readonly error: string;

  /** Link on the setup page that brings an app owner here. */
  readonly entryLink: string;
  /** Link from here back to creating a brand-new standalone page. */
  readonly newInstead: string;
}

/**
 * Shareable fixed-date events: the attendee-facing pages (the public event page
 * at `/event?e=…` and the registrant's manage page at `/event/manage?t=…`) and
 * the owner's create/manage page at `/book/events`. One event, many people
 * register with just their e-mail; each gets only that event plus notifications.
 */
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

  // --- Owner create/manage (/book/events) ---
  readonly ownerSeoTitle: string;
  readonly ownerSeoDescription: string;
  readonly ownerTitle: string;
  readonly ownerLead: string;
  readonly newEventHeading: string;
  readonly fTitle: string;
  readonly fTitlePlaceholder: string;
  readonly fStart: string;
  readonly fEnd: string;
  readonly fLocation: string;
  readonly fLocationPlaceholder: string;
  readonly fDescription: string;
  readonly fDescriptionPlaceholder: string;
  readonly fCapacity: string;
  readonly fCapacityPlaceholder: string;
  readonly publishCta: string;
  readonly publishing: string;
  readonly shareLabel: string;
  readonly copy: string;
  readonly copied: string;
  readonly yourEventsHeading: string;
  readonly noEvents: string;
  /** Rendered after a number, e.g. "5 registered". */
  readonly registeredCount: string;
  readonly viewRegistrants: string;
  readonly hideRegistrants: string;
  readonly changeTime: string;
  readonly cancelEvent: string;
  readonly cancelEventConfirm: string;
  readonly cancelledBadge: string;
  /** Link on the booking-setup page pointing here. */
  readonly ownerEntry: string;
  readonly errNeedTitle: string;
  readonly errNeedTime: string;
}
