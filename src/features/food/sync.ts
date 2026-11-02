import { supabase } from '@/lib/supabase';

import type { Meal } from './nutrition';
import type { CheckinRecord } from './store';

async function userId() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function pushMeal(meal: Meal): Promise<boolean> {
  const uid = await userId();
  if (!supabase || !uid) return false;
  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id: uid,
      eaten_at: meal.eatenAt,
      meal_type: meal.type,
      source: meal.source,
    })
    .select('id')
    .single();
  if (error) throw error;
  const { error: iErr } = await supabase.from('meal_items').insert(
    meal.items.map((i) => ({
      meal_id: data.id,
      name: i.name,
      grams: i.grams,
      kcal_per_100g: i.kcal,
      protein_per_100g: i.protein,
      carbs_per_100g: i.carbs,
      fat_per_100g: i.fat,
      ai_confidence: i.confidence ?? null,
      user_edited: meal.source === 'manual',
    })),
  );
  if (iErr) throw iErr;
  return true;
}

export async function pushCheckin(c: CheckinRecord): Promise<boolean> {
  const uid = await userId();
  if (!supabase || !uid) return false;
  const { error } = await supabase.from('checkins').insert({
    user_id: uid,
    week_start: c.weekStart,
    avg_weight_kg: c.avgWeightKg,
    prev_avg_weight_kg: c.prevAvgWeightKg,
    kcal_change: c.kcalChange,
  });
  if (error) throw error;
  if (c.kcalChange !== 0) {
    // Record the new calorie target too (history of plan changes).
    const today = new Date().toISOString().slice(0, 10);
    const { data: t } = await supabase
      .from('nutrition_targets')
      .select('kcal,protein_g,carbs_g,fat_g')
      .eq('user_id', uid)
      .order('valid_from', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (t)
      await supabase.from('nutrition_targets').upsert(
        {
          user_id: uid,
          valid_from: today,
          kcal: t.kcal + c.kcalChange,
          protein_g: t.protein_g,
          carbs_g: Math.max(50, t.carbs_g + Math.round(c.kcalChange / 4)),
          fat_g: t.fat_g,
          reason: `weekly_checkin_${c.verdict}`,
        },
        { onConflict: 'user_id,valid_from' },
      );
  }
  return true;
}
