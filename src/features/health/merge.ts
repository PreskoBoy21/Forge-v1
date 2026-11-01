import type { DayPoint } from './types';

export const dayKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Builds an empty day list from (now − days) to today. */
export function emptyDays(days: number, now = new Date()) {
  const map = new Map<string, DayPoint>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    map.set(dayKey(d), { date: dayKey(d) });
  }
  return map;
}

/** Latest value of the day wins for instantaneous readings (scale weigh-ins). */
export function setLatest(
  map: Map<string, DayPoint>,
  date: Date,
  key: keyof Omit<DayPoint, 'date'>,
  value: number,
) {
  const row = map.get(dayKey(date));
  if (row) row[key] = value;
}

export function addTo(
  map: Map<string, DayPoint>,
  date: Date,
  key: keyof Omit<DayPoint, 'date'>,
  value: number,
) {
  const row = map.get(dayKey(date));
  if (row) row[key] = (row[key] ?? 0) + value;
}
