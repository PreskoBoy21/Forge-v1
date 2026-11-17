/** One calendar day of body + recovery data, merged from every source. */
export type DayPoint = {
  date: string; // YYYY-MM-DD (local)
  weightKg?: number;
  bodyFatPct?: number; // 0–100
  leanMassKg?: number;
  steps?: number;
  sleepHours?: number;
  restingHr?: number;
  hrvMs?: number;
  activeKcal?: number;
  /** Web check-in: 1 tired · 2 ok · 3 fresh. */
  feel?: number;
};

export type HealthProviderId =
  'apple_health' | 'health_connect' | 'manual' | 'demo';

export type HealthSnapshot = {
  provider: HealthProviderId;
  days: DayPoint[]; // oldest → newest
  /** Apps/devices that wrote the data, e.g. "Withings", "RENPHO Health". */
  sources: string[];
  fetchedAt: string;
};

export type HealthPermissionResult = 'granted' | 'denied' | 'unavailable';
