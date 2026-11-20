// Keep the three existing web preference keys so saved numeric formats stay selected.
const datePatterns = {
  dmy: 'dd/MM/yyyy', mdy: 'MM/dd/yyyy', ymd: 'yyyy-MM-dd',
  dayMonthYearDot: 'dd.MM.yyyy', monthDayYearDot: 'MM.dd.yyyy', yearMonthDayDot: 'yyyy.MM.dd',
  dayMonthYearDash: 'dd-MM-yyyy', monthDayYearDash: 'MM-dd-yyyy', yearMonthDaySlash: 'yyyy/MM/dd',
  dayAbbreviatedMonthYear: 'd MMM yyyy', abbreviatedMonthDayYear: 'MMM d, yyyy', yearAbbreviatedMonthDay: 'yyyy MMM d',
  dayFullMonthYear: 'd MMMM yyyy', fullMonthDayYear: 'MMMM d, yyyy', yearFullMonthDay: 'yyyy MMMM d',
};
export const calendarDateChoices = ['system', 'medium', 'long', 'full', ...Object.keys(datePatterns)];

export const systemLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
const systemHour12 = !!new Intl.DateTimeFormat(undefined, {hour: 'numeric'}).resolvedOptions().hour12;

export function calendarHourCycle(preference?: string): 'h12' | 'h23' {
  if (preference === '12') return 'h12';
  if (preference === '24') return 'h23';
  return systemHour12 ? 'h12' : 'h23';
}

export function systemWeekStart(tag = systemLocale): number {
  const locale = new Intl.Locale(tag) as Intl.Locale & {
    getWeekInfo?(): {firstDay: number};
    weekInfo?: {firstDay: number};
  };
  const info = locale.getWeekInfo?.() ?? locale.weekInfo;
  if (info) return info.firstDay % 7;
  // CLDR territory rules for browsers without Intl.Locale week information.
  const region = locale.maximize().region ?? '';
  if (region === 'MV') return 5;
  if ('AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' ').includes(region)) return 6;
  if ('AG AS BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'.split(' ').includes(region)) return 0;
  return 1;
}

export function calendarWeekStart(preference?: string): number {
  return /^[0-6]$/.test(preference ?? '') ? Number(preference) : systemWeekStart();
}

interface DateDisplay {
  includeYear?: boolean;
  weekday?: 'short' | 'long';
  timeZone?: string;
}

export function calendarDateFormatter(locale: string, preference = 'system', {
  includeYear = true, weekday, timeZone,
}: DateDisplay = {}): (date: Date | number) => string {
  const withWeekday = weekday && preference !== 'full'
    ? new Intl.DateTimeFormat(locale, {weekday, timeZone}) : undefined;
  const pattern = Object.hasOwn(datePatterns, preference) ? datePatterns[preference as keyof typeof datePatterns] : undefined;
  let format: (date: Date | number) => string;
  if (pattern) {
    const display = includeYear ? pattern : pattern.replace(/^yyyy[ ./-]+|[, ./-]+yyyy$/, '');
    const month = pattern.includes('MMMM') ? 'long' : pattern.includes('MMM') ? 'short' : '2-digit';
    const fields = new Intl.DateTimeFormat(locale, {
      timeZone, day: pattern.includes('dd') ? '2-digit' : 'numeric', year: 'numeric', month,
    });
    const monthName = month === '2-digit' ? undefined : new Intl.DateTimeFormat(locale, {month, timeZone});
    format = date => {
      const parts = Object.fromEntries(fields.formatToParts(date).map(part => [part.type, part.value]));
      // Some locales put the month suffix in a separate literal in a complete date.
      if (monthName && /^\p{N}+$/u.test(parts['month'])) parts['month'] = monthName.format(date);
      return display.replace(/yyyy|M{2,4}|dd?/g, token => {
        if (token === 'yyyy') return parts['year'] ?? parts['relatedYear'];
        return token.startsWith('M') ? parts['month'] : parts['day'];
      });
    };
  } else {
    const style = preference === 'medium' || preference === 'long' || preference === 'full' ? preference : 'short';
    const options: Intl.DateTimeFormatOptions = includeYear ? {dateStyle: style} : {
      day: 'numeric', month: style === 'short' ? 'numeric' : style === 'medium' ? 'short' : 'long',
      weekday: style === 'full' ? 'long' : undefined,
    };
    format = new Intl.DateTimeFormat(style === 'short' ? systemLocale : locale, {...options, timeZone}).format;
  }
  return withWeekday ? date => withWeekday.format(date) + ', ' + format(date) : format;
}
