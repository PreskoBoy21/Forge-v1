/**
 * Default (web) health source: no device health store, so the app runs on
 * sample data. iOS and Android use source.ios.ts / source.android.ts.
 */
import { demoSnapshot } from './demo';
import type { HealthPermissionResult, HealthSnapshot } from './types';

export const providerLabel = 'Sample data';

export async function isAvailable(): Promise<boolean> {
  return false;
}

export async function requestPermissions(): Promise<HealthPermissionResult> {
  return 'unavailable';
}

export async function fetchSnapshot(days = 42): Promise<HealthSnapshot> {
  return demoSnapshot(days);
}
