/**
 * Default (web) health source: browsers can't read Apple Health / Health
 * Connect, so the web app runs on the user's own daily check-in
 * (sleep, feel, weight). iOS and Android use source.ios.ts / source.android.ts.
 */
import { manualDays, useManualLog } from './manual';
import type { HealthPermissionResult, HealthSnapshot } from './types';

export const providerLabel: string = 'Daily check-in';

export async function isAvailable(): Promise<boolean> {
  return true;
}

export async function requestPermissions(): Promise<HealthPermissionResult> {
  return 'granted';
}

export async function fetchSnapshot(days = 42): Promise<HealthSnapshot> {
  return {
    provider: 'manual',
    days: manualDays(useManualLog.getState().entries, days),
    sources: ['Daily check-in'],
    fetchedAt: new Date().toISOString(),
  };
}
