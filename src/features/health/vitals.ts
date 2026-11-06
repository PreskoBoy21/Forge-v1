import type { DayPoint } from './types';

export type VitalKey = 'sleepHours' | 'restingHr' | 'hrvMs' | 'steps';

export type Vital = {
  key: VitalKey;
  latest?: number;
  /** Average of the 28 days before the latest reading. */
  baseline?: number;
  /** Last 7 days, oldest → newest (undefined = no reading). */
  week: (number | undefined)[];
};

const mean = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined;

/** Latest value + personal baseline for the Today vitals grid. */
export function vital(days: DayPoint[], key: VitalKey): Vital {
  let idx = -1;
  for (let i = days.length - 1; i >= 0 && i >= days.length - 3; i--) {
    if (days[i]![key] !== undefined) {
      idx = i;
      break;
    }
  }
  const latest = idx >= 0 ? days[idx]![key] : undefined;
  const base = days
    .slice(Math.max(0, idx - 28), Math.max(0, idx))
    .map((d) => d[key])
    .filter((v): v is number => v !== undefined);
  return {
    key,
    latest,
    baseline: mean(base),
    week: days.slice(-7).map((d) => d[key]),
  };
}

/** Slice of days for a chart range. */
export function lastDays(days: DayPoint[], n: number) {
  return days.slice(-n);
}

export const shortDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
