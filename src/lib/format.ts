import { palette } from '../theme/colors';

export type AccentName = 'navy' | 'brass' | 'clay' | 'pine' | 'slate';

export const accentHex: Record<AccentName, string> = {
  navy: palette.navy,
  brass: palette.brass,
  clay: palette.clay,
  pine: palette.pine,
  slate: palette.slate,
};

/** Time-of-day greeting. Accepts an hour for testability (defaults to now). */
export function greeting(hour: number = new Date().getHours()): string {
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function compact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}
