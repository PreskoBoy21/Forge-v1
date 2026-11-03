import { create } from 'zustand';

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
  useDemo: () => void;
};

export const healthProviderLabel = source.providerLabel;

export const useHealth = create<HealthState>((set, get) => ({
  connected: false,
  permission: 'unknown',
  snapshot: demoSnapshot(),
  loading: false,
  connect: async () => {
    set({ loading: true, error: undefined });
    const permission = await source.requestPermissions();
    set({ permission, connected: permission === 'granted', loading: false });
    if (permission === 'granted') await get().refresh();
    return permission;
  },
  refresh: async () => {
    if (!get().connected) return;
    set({ loading: true, error: undefined });
    try {
      const snapshot = await source.fetchSnapshot(42);
      const hasData = snapshot.days.some(
        (d) =>
          d.weightKg !== undefined ||
          d.steps !== undefined ||
          d.sleepHours !== undefined,
      );
      set({ snapshot: hasData ? snapshot : get().snapshot, loading: false });
      if (hasData) void syncHealthDays(snapshot).catch(() => undefined);
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : 'Could not read health data',
      });
    }
  },
  useDemo: () =>
    set({ connected: false, permission: 'unknown', snapshot: demoSnapshot() }),
}));
