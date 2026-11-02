import { supabase } from '@/lib/supabase';

import type { HealthSnapshot } from './types';

/** Upserts the last 42 days of health data for the signed-in user. */
export async function syncHealthDays(snapshot: HealthSnapshot) {
  if (!supabase || snapshot.provider === 'demo') return;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;
  const rows = snapshot.days
    .filter(
      (d) =>
        d.weightKg !== undefined ||
        d.steps !== undefined ||
        d.sleepHours !== undefined ||
        d.restingHr !== undefined,
    )
    .map((d) => ({
      user_id: auth.user!.id,
      date: d.date,
      weight_kg: d.weightKg ?? null,
      body_fat_pct: d.bodyFatPct ?? null,
      lean_mass_kg: d.leanMassKg ?? null,
      steps: d.steps ?? null,
      sleep_hours: d.sleepHours ?? null,
      resting_hr: d.restingHr ?? null,
      hrv_ms: d.hrvMs ?? null,
      active_kcal: d.activeKcal ?? null,
      source: snapshot.provider,
      updated_at: new Date().toISOString(),
    }));
  if (!rows.length) return;
  await supabase
    .from('health_days')
    .upsert(rows, { onConflict: 'user_id,date' });
}
