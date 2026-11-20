import type { DayPoint } from './types.ts';

export type SleepSummary = {
  /** Most recent night with a reading (within the last 3 days). */
  lastNight?: number;
  lastDate?: string;
  /** Average of the 7 nights before last night. */
  weekAvg?: number;
  /** Average of the last 7 days with data (incl. last night). */
  avg7?: number;
  /** lastNight − weekAvg, in hours. */
  delta?: number;
  /** Nights with 7 h+ out of the last 7 with data. */
  goodNights: number;
  nights: number;
  best?: number;
  status: 'rested' | 'short' | 'very_short' | 'none';
  tip: { title: string; body: string };
};

const mean = (xs: number[]) =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : undefined;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Formats hours as "7h 12m". */
export function hm(h: number | undefined) {
  if (h === undefined) return '—';
  const m = Math.round(h * 60);
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
}

/** Last night vs your week, plus one plain recommendation. */
export function sleepSummary(days: DayPoint[]): SleepSummary {
  let idx = -1;
  for (let i = days.length - 1; i >= 0 && i >= days.length - 3; i--) {
    if (days[i]!.sleepHours !== undefined) {
      idx = i;
      break;
    }
  }
  const lastNight = idx >= 0 ? days[idx]!.sleepHours : undefined;
  const before = days
    .slice(Math.max(0, idx - 7), Math.max(0, idx))
    .map((d) => d.sleepHours)
    .filter((v): v is number => v !== undefined);
  const week = days
    .slice(-7)
    .map((d) => d.sleepHours)
    .filter((v): v is number => v !== undefined);
  const weekAvg = mean(before);
  const delta =
    lastNight !== undefined && weekAvg !== undefined
      ? r1(lastNight - weekAvg)
      : undefined;
  const avg7 = mean(week);
  const status =
    lastNight === undefined
      ? 'none'
      : lastNight >= 7
        ? 'rested'
        : lastNight >= 6
          ? 'short'
          : 'very_short';

  let tip: SleepSummary['tip'];
  if (status === 'none') {
    tip = {
      title: 'Log last night',
      body: 'Add your hours and your coach can plan today around them.',
    };
  } else if (status === 'very_short') {
    tip = {
      title: 'Keep today light',
      body: 'Under 6 hours slows recovery. Same weights, one set less, and get to bed 30–60 min earlier tonight.',
    };
  } else if (avg7 !== undefined && avg7 < 7) {
    const short = Math.round((7 - avg7) * 60);
    tip = {
      title: `${short} min short on average`,
      body: `You average ${hm(avg7)} this week. Go to bed ${short >= 45 ? '45' : short >= 25 ? '30' : '15'} min earlier to reach 7 hours.`,
    };
  } else if (status === 'short') {
    tip = {
      title: 'One short night is fine',
      body: 'Your week is solid, so train as planned. Aim for your usual bedtime tonight.',
    };
  } else {
    tip = {
      title: 'Sleep is on point',
      body: 'Keep the same bedtime. A steady schedule matters as much as the hours.',
    };
  }

  return {
    lastNight,
    lastDate: idx >= 0 ? days[idx]!.date : undefined,
    weekAvg: weekAvg === undefined ? undefined : r1(weekAvg),
    avg7: avg7 === undefined ? undefined : r1(avg7),
    delta,
    goodNights: week.filter((h) => h >= 7).length,
    nights: week.length,
    best: week.length ? Math.max(...week) : undefined,
    status,
    tip,
  };
}
