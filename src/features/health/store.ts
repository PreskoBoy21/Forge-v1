import { Platform } from 'react-native';

import { track } from '@/lib/telemetry';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { deviceStorage } from '@/lib/storage';

import { demoSnapshot } from './demo';
import * as source from './source';
import { syncHealthDays } from './sync';
import type { HealthPermissionResult, HealthSnapshot } from './types';

type HealthState = {
  connected: boolean;
  permission: HealthPermissionResult | 'unknown';
  snapshot: HealthSnapshot;
  loading: boolean;
  error?: string;
  connect: () => Promise<HealthPermissionResult>;
  refresh: () => Promise<void>;
};

export const healthProviderLabel = source.providerLabel;
/** Apple Health / Health Connect exists on this device build. */
export const healthSupported = source.providerLabel !== 'Sample data';

const empty = (): HealthSnapshot => ({
  provider: Platform.OS === 'ios' ? 'apple_health' : 'health_connect',
  days: [],
  sources: [],
  fetchedAt: new Date().toISOString(),
});

/**
 * Real users only ever see their own data: without a connection the screens
 * show "connect" states. Sample data is used only where no health store
 * exists (web preview / store screenshots).
 */
const initial = (): HealthSnapshot =>
  healthSupported ? empty() : demoSnapshot();

export function hasHealthData(s: HealthSnapshot) {
  return s.days.some(
    (d) =>
      d.weightKg !== undefined ||
      d.steps !== undefined ||
      d.sleepHours !== undefined ||
      d.restingHr !== undefined,
  );
}

export const useHealth = create<HealthState>()(
  persist(
    (set, get) => ({
      connected: false,
      permission: 'unknown',
      snapshot: initial(),
      loading: false,
      connect: async () => {
        set({ loading: true, error: undefined });
        const permission = await source.requestPermissions();
        set({
          permission,
          connected: permission === 'granted',
          loading: false,
        });
        track('health_connected', { result: permission });
        if (permission === 'granted') await get().refresh();
        return permission;
      },
      refresh: async () => {
        if (!get().connected) return;
        set({ loading: true, error: undefined });
        try {
          const snapshot = await source.fetchSnapshot(42);
          set({ snapshot, loading: false });
          if (hasHealthData(snapshot))
            void syncHealthDays(snapshot).catch(() => undefined);
        } catch (e) {
          set({
            loading: false,
            error:
              e instanceof Error ? e.message : 'Could not read health data',
          });
        }
      },
    }),
    {
      name: 'forge-health',
      storage: deviceStorage,
      // Only remember that the user connected; data is re-read on launch.
      partialize: (s) => ({ connected: s.connected }),
    },
  ),
);
