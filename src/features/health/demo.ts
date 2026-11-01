import type { DayPoint, HealthSnapshot } from './types';

/** Deterministic sample data so the app looks alive before a scale is connected. */
export function demoSnapshot(days = 42, now = new Date()): HealthSnapshot {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const out: DayPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const t = days - 1 - i;
    const weight = 82.4 - t * 0.055 + (rnd() - 0.5) * 0.9;
    const fat = 19.6 - t * 0.05 + (rnd() - 0.5) * 0.8;
    out.push({
      date: d.toISOString().slice(0, 10),
      weightKg: rnd() > 0.2 ? Math.round(weight * 10) / 10 : undefined,
      bodyFatPct: rnd() > 0.2 ? Math.round(fat * 10) / 10 : undefined,
      steps: Math.round(7200 + rnd() * 4500),
      sleepHours: Math.round((6.2 + rnd() * 1.9) * 10) / 10,
      restingHr: Math.round(57 + rnd() * 6),
      hrvMs: Math.round(48 + rnd() * 18),
      activeKcal: Math.round(380 + rnd() * 320),
    });
  }
  return {
    provider: 'demo',
    days: out,
    sources: ['Sample data'],
    fetchedAt: now.toISOString(),
  };
}
