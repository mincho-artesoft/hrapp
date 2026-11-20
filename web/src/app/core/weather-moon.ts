// The phase names, SF Symbols and artwork follow MoonDetailSheet in the native app.
const phases = [
  ['New Moon', 'new', 'new.moon'], ['Waxing Crescent', 'waxing_crescent', 'waxing.crescent'],
  ['First Quarter', 'first_quarter', 'first.quarter'], ['Waxing Gibbous', 'waxing_gibbous', 'waxing.gibbous'],
  ['Full Moon', 'full', 'full.moon'], ['Waning Gibbous', 'waning_gibbous', 'waning.gibbous'],
  ['Last Quarter', 'third_quarter', 'last.quarter'], ['Waning Crescent', 'waning_crescent', 'waning.crescent'],
].map(([name, asset, symbol]) => ({
  name, artwork: '/icons/calendar-native/artwork/phase_' + asset + '.png', symbol: 'moonphase.' + symbol,
}));

export function moonPhaseInfo(fraction: number | null | undefined) {
  return fraction == null ? undefined : phases[Math.round(fraction * 8) % 8];
}

const referenceNewMoon = 947182440000;
const synodicMonth = 29.530588853 * 86400000;

export function lunarFraction(instant: number): number {
  const cycles = (instant - referenceNewMoon) / synodicMonth;
  return cycles - Math.floor(cycles);
}

export function lunarIllumination(instant: number): number {
  return (1 - Math.cos(2 * Math.PI * lunarFraction(instant))) / 2;
}

export function nextLunarEvent(instant: number, phase: 0 | 0.5): number {
  const cycles = (instant - referenceNewMoon) / synodicMonth;
  const nearestCycle = Math.round(cycles - phase) + phase;
  const nearest = referenceNewMoon + nearestCycle * synodicMonth;
  return nearest > instant ? nearest : referenceNewMoon + (nearestCycle + 1) * synodicMonth;
}
