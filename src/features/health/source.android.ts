/**
 * Android Health Connect source. Smart-scale apps (Withings, RENPHO, Eufy,
 * Fitdays…) and Samsung Health / Google Fit / Fitbit write into Health
 * Connect; we only READ.
 */
import type { Permission, RecordType } from 'react-native-health-connect';

import { demoSnapshot } from './demo';
import { addTo, emptyDays, setLatest } from './merge';
import type { HealthPermissionResult, HealthSnapshot } from './types';

type HC = typeof import('react-native-health-connect');

/** Lazy so Expo Go (no native module) falls back to sample data. */
let hcMod: HC | null | undefined;
function hc(): HC | null {
  if (hcMod !== undefined) return hcMod;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    hcMod = require('react-native-health-connect') as HC;
  } catch {
    hcMod = null;
  }
  return hcMod;
}

export const providerLabel = hc() ? 'Health Connect' : 'Sample data';

const TYPES: RecordType[] = [
  'Weight',
  'BodyFat',
  'LeanBodyMass',
  'Steps',
  'SleepSession',
  'RestingHeartRate',
  'HeartRateVariabilityRmssd',
  'ActiveCaloriesBurned',
];

let ready = false;
async function ensureInit() {
  if (ready) return true;
  const m = hc();
  if (!m) return false;
  const status = await m.getSdkStatus();
  if (status !== m.SdkAvailabilityStatus.SDK_AVAILABLE) return false;
  ready = await m.initialize();
  return ready;
}

export async function isAvailable() {
  try {
    return await ensureInit();
  } catch {
    return false;
  }
}

export async function requestPermissions(): Promise<HealthPermissionResult> {
  if (!(await isAvailable())) return 'unavailable';
  try {
    const perms: Permission[] = TYPES.map((recordType) => ({
      accessType: 'read',
      recordType,
    }));
    const granted = await hc()!.requestPermission(perms);
    return granted.length > 0 ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}

export async function fetchSnapshot(days = 42): Promise<HealthSnapshot> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  const timeRangeFilter = {
    operator: 'between' as const,
    startTime: start.toISOString(),
    endTime: now.toISOString(),
  };
  const map = emptyDays(days, now);
  const sources = new Set<string>();
  if (!(await ensureInit())) return demoSnapshot(days);
  const { readRecords } = hc()!;

  const read = async <T extends RecordType>(type: T) => {
    try {
      const res = await readRecords(type, {
        timeRangeFilter,
        ascendingOrder: true,
        pageSize: 5000,
      });
      for (const r of res.records) {
        const origin = (r as { metadata?: { dataOrigin?: string } }).metadata
          ?.dataOrigin;
        if (origin) sources.add(origin);
      }
      return res.records;
    } catch {
      return [];
    }
  };

  const [weight, fat, lean, steps, sleep, rhr, hrv, kcal] = await Promise.all([
    read('Weight'),
    read('BodyFat'),
    read('LeanBodyMass'),
    read('Steps'),
    read('SleepSession'),
    read('RestingHeartRate'),
    read('HeartRateVariabilityRmssd'),
    read('ActiveCaloriesBurned'),
  ]);

  for (const r of weight)
    setLatest(
      map,
      new Date(r.time),
      'weightKg',
      Math.round(r.weight.inKilograms * 10) / 10,
    );
  for (const r of fat)
    setLatest(
      map,
      new Date(r.time),
      'bodyFatPct',
      Math.round(r.percentage * 10) / 10,
    );
  for (const r of lean)
    setLatest(
      map,
      new Date(r.time),
      'leanMassKg',
      Math.round(r.mass.inKilograms * 10) / 10,
    );
  for (const r of rhr)
    setLatest(map, new Date(r.time), 'restingHr', r.beatsPerMinute);
  for (const r of hrv)
    setLatest(
      map,
      new Date(r.time),
      'hrvMs',
      Math.round(r.heartRateVariabilityMillis),
    );
  // Note: Steps/ActiveCalories may contain overlapping records from several
  // apps; Health Connect's aggregate API dedupes — a later step can switch to it.
  for (const r of steps) addTo(map, new Date(r.startTime), 'steps', r.count);
  for (const r of kcal)
    addTo(
      map,
      new Date(r.startTime),
      'activeKcal',
      Math.round(r.energy.inKilocalories),
    );
  for (const s of sleep) {
    const asleep = (s.stages ?? []).filter((st) =>
      [2, 4, 5, 6].includes(st.stage),
    );
    const ms = asleep.length
      ? asleep.reduce(
          (a, st) => a + (Date.parse(st.endTime) - Date.parse(st.startTime)),
          0,
        )
      : Date.parse(s.endTime) - Date.parse(s.startTime);
    addTo(
      map,
      new Date(s.endTime),
      'sleepHours',
      Math.round((ms / 3_600_000) * 10) / 10,
    );
  }

  return {
    provider: 'health_connect',
    days: [...map.values()],
    sources: [...sources],
    fetchedAt: now.toISOString(),
  };
}
