// The timeline uses the device's wall clock. Calendar-day arithmetic also works on DST boundaries.
export type TimelineGesture = 'create' | 'move' | 'resize-start' | 'resize-end';
export interface TimelineInterval { start: number; end: number; allDay: boolean }

export function timelineDay(day: Date, offset = 0): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate() + offset);
}

export function minuteOnDay(time: number, day: Date): number {
  if (time <= day.getTime()) return 0;
  if (time >= timelineDay(day, 1).getTime()) return 1440;
  const date = new Date(time);
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

function civilDay(time: number): number {
  const date = new Date(time);
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
}

export function timelinePlacement(
  mode: TimelineGesture, original: TimelineInterval, sliceDay: Date,
  targetDay: Date, minute: number, overAllDay: boolean,
): TimelineInterval | null {
  if (overAllDay) {
    if (mode === 'resize-start' || mode === 'resize-end') return null;
    const offset = mode === 'create' ? 0 : civilDay(sliceDay.getTime()) - civilDay(original.start);
    const count = mode === 'create' ? 1 : civilDay(original.end - 1) - civilDay(original.start) + 1;
    const first = timelineDay(targetDay, -offset);
    return {start: first.getTime(), end: timelineDay(first, count).getTime(), allDay: true};
  }

  const snapped = Math.round(minute / 10) * 10;
  const startMinute = Math.max(0, Math.min(mode === 'create' ? 1380 : 1440, snapped));
  const at = (m: number) => new Date(targetDay.getFullYear(), targetDay.getMonth(), targetDay.getDate(), 0, m).getTime();
  const edge = at(startMinute);
  if (mode === 'create') return {start: edge, end: Math.max(edge + 600000, at(startMinute + 60)), allDay: false};
  if (mode === 'resize-start') return edge < original.end ? {...original, start: edge} : original;
  if (mode === 'resize-end') return edge > original.start ? {...original, end: edge} : original;
  const start = original.allDay ? edge : edge - Math.max(0, sliceDay.getTime() - original.start);
  return {start, end: start + (original.allDay ? 3600000 : original.end - original.start), allDay: false};
}
