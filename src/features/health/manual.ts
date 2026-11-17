import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { deviceStorage } from '@/lib/storage';

import type { DayPoint } from './types';

/**
 * Web has no Apple Health / Health Connect, so the user logs a 3-second
 * morning check-in instead: hours slept, how they feel and (optionally)
 * their weight. Stored on the device and synced to `health_days` as
 * source 'manual'.
 */
export type Feel = 1 | 2 | 3; // tired · ok · fresh

export type ManualEntry = {
  sleepHours?: number;
  feel?: Feel;
  weightKg?: number;
};

type ManualState = {
  entries: Record<string, ManualEntry>;
  logDay: (date: string, patch: ManualEntry) => void;
};

export const useManualLog = create<ManualState>()(
  persist(
    (set, get) => ({
      entries: {},
      logDay: (date, patch) =>
        set({
          entries: {
            ...get().entries,
            [date]: { ...get().entries[date], ...patch },
          },
        }),
    }),
    { name: 'forge-manual-log', storage: deviceStorage },
  ),
);

export const localDate = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

/** The last `days` calendar days (oldest → newest) from the manual log. */
export function manualDays(
  entries: Record<string, ManualEntry>,
  days = 42,
  now = new Date(),
): DayPoint[] {
  const out: DayPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const date = localDate(d);
    const e = entries[date] ?? {};
    out.push({
      date,
      sleepHours: e.sleepHours,
      weightKg: e.weightKg,
      feel: e.feel,
    });
  }
  return out;
}
