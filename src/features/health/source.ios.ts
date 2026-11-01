/**
 * Apple Health (HealthKit) source.
 * Smart scales (Withings, RENPHO, Eufy, Wyze, Etekcity…) write weight, body fat
 * and lean mass into Apple Health through their own apps; Apple Watch and the
 * iPhone add steps, sleep, resting heart rate and HRV. We only READ.
 */
import {
  isHealthDataAvailableAsync,
  queryCategorySamples,
  queryQuantitySamples,
  queryStatisticsCollectionForQuantity,
  requestAuthorization,
} from '@kingstinct/react-native-healthkit';

import { addTo, emptyDays, setLatest } from './merge';
import type { HealthPermissionResult, HealthSnapshot } from './types';

export const providerLabel = 'Apple Health';

const READ = [
  'HKQuantityTypeIdentifierBodyMass',
  'HKQuantityTypeIdentifierBodyFatPercentage',
  'HKQuantityTypeIdentifierLeanBodyMass',
  'HKQuantityTypeIdentifierStepCount',
  'HKQuantityTypeIdentifierRestingHeartRate',
  'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
  'HKQuantityTypeIdentifierActiveEnergyBurned',
  'HKCategoryTypeIdentifierSleepAnalysis',
] as const;

export async function isAvailable() {
  try {
    return await isHealthDataAvailableAsync();
  } catch {
    return false;
  }
}

export async function requestPermissions(): Promise<HealthPermissionResult> {
  if (!(await isAvailable())) return 'unavailable';
  try {
    // HealthKit never tells apps whether READ access was denied (privacy);
    // a successful prompt means "asked". Missing data just shows as empty.
    await requestAuthorization({ toRead: READ });
    return 'granted';
  } catch {
    return 'denied';
  }
}

export async function fetchSnapshot(days = 42): Promise<HealthSnapshot> {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  const filter = { date: { startDate: start, endDate: now } };
  const map = emptyDays(days, now);
  const sources = new Set<string>();

  const samples = async (
    id: (typeof READ)[number] & `HKQuantityTypeIdentifier${string}`,
    unit: string,
    key: Parameters<typeof setLatest>[2],
    scale = 1,
  ) => {
    try {
      const rows = await queryQuantitySamples(id, {
        limit: 0,
        ascending: true,
        unit: unit as never,
        filter,
      });
      for (const r of rows) {
        setLatest(
          map,
          r.startDate,
          key,
          Math.round(r.quantity * scale * 10) / 10,
        );
        const name = (r as { sourceRevision?: { source?: { name?: string } } })
          .sourceRevision?.source?.name;
        if (name) sources.add(name);
      }
    } catch {
      // type not authorised or no data — leave empty
    }
  };

  const dailySum = async (
    id:
      | 'HKQuantityTypeIdentifierStepCount'
      | 'HKQuantityTypeIdentifierActiveEnergyBurned',
    unit: string,
    key: 'steps' | 'activeKcal',
  ) => {
    try {
      const rows = await queryStatisticsCollectionForQuantity(
        id,
        ['cumulativeSum'],
        start,
        { day: 1 },
        { filter, unit: unit as never },
      );
      for (const r of rows) {
        if (r.startDate && r.sumQuantity) {
          setLatest(map, r.startDate, key, Math.round(r.sumQuantity.quantity));
        }
      }
    } catch {
      // ignore
    }
  };

  await Promise.all([
    samples('HKQuantityTypeIdentifierBodyMass', 'kg', 'weightKg'),
    samples(
      'HKQuantityTypeIdentifierBodyFatPercentage',
      '%',
      'bodyFatPct',
      100,
    ),
    samples('HKQuantityTypeIdentifierLeanBodyMass', 'kg', 'leanMassKg'),
    samples(
      'HKQuantityTypeIdentifierRestingHeartRate',
      'count/min',
      'restingHr',
    ),
    samples('HKQuantityTypeIdentifierHeartRateVariabilitySDNN', 'ms', 'hrvMs'),
    dailySum('HKQuantityTypeIdentifierStepCount', 'count', 'steps'),
    dailySum(
      'HKQuantityTypeIdentifierActiveEnergyBurned',
      'kcal',
      'activeKcal',
    ),
  ]);

  // Sleep: sum asleep stages (core/deep/REM/unspecified = values 1,3,4,5),
  // attributed to the day the sleep ended (the morning).
  try {
    const sleep = await queryCategorySamples(
      'HKCategoryTypeIdentifierSleepAnalysis',
      {
        limit: 0,
        filter,
      },
    );
    for (const s of sleep) {
      const v = Number(s.value);
      if (v === 1 || v === 3 || v === 4 || v === 5) {
        const hrs = (s.endDate.getTime() - s.startDate.getTime()) / 3_600_000;
        addTo(map, s.endDate, 'sleepHours', hrs);
      }
    }
    for (const row of map.values()) {
      if (row.sleepHours !== undefined)
        row.sleepHours = Math.round(row.sleepHours * 10) / 10;
    }
  } catch {
    // ignore
  }

  return {
    provider: 'apple_health',
    days: [...map.values()],
    sources: [...sources],
    fetchedAt: now.toISOString(),
  };
}
