import type { WebCalendarEvent } from "./calendar-platform-api.service";

/** Preserve the complete EventKit snapshot while translating its numeric enums. */
export function webEventDetails(details: any): WebCalendarEvent["details"] {
  const next = { ...details };
  if (typeof next.availability === "number")
    next.availability =
      ["busy", "free", "tentative", "unavailable"][next.availability] ?? "busy";
  if (Array.isArray(next.alarms))
    next.alarms = next.alarms.map((alarm: any) => ({
      ...alarm,
      relativeOffsetSeconds:
        alarm.relativeOffsetSeconds ?? alarm.relativeOffset,
    }));
  if (Array.isArray(next.recurrenceRules))
    next.recurrenceRules = next.recurrenceRules.map((rule: any) => ({
      ...rule,
      frequency:
        typeof rule.frequency === "number"
          ? ["daily", "weekly", "monthly", "yearly"][rule.frequency]
          : rule.frequency,
    }));
  return next;
}

export function nativeEventDetails(details: any): any {
  const next = { ...details };
  if (typeof next.availability === "string")
    next.availability = Math.max(
      0,
      ["busy", "free", "tentative", "unavailable"].indexOf(next.availability),
    );
  if (Array.isArray(next.alarms))
    next.alarms = next.alarms.map(
      ({ relativeOffsetSeconds, ...alarm }: any) => ({
        ...alarm,
        relativeOffset: relativeOffsetSeconds ?? alarm.relativeOffset,
      }),
    );
  if (Array.isArray(next.recurrenceRules))
    next.recurrenceRules = next.recurrenceRules.map((rule: any) => ({
      ...rule,
      frequency:
        typeof rule.frequency === "string"
          ? ["daily", "weekly", "monthly", "yearly"].indexOf(rule.frequency)
          : rule.frequency,
    }));
  return next;
}

/** Received access never implies permission to change sharing or its recipients. */
export function canShareEvent(event: WebCalendarEvent): boolean {
  return (
    !event.readOnly &&
    event.sourceKind !== "external" &&
    (!event.receivedAccess || event.receivedAccess === "owner")
  );
}
