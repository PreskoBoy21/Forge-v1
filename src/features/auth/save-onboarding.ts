import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import { calcTargets, pickSplit, type PlanGoal } from '@/features/plan/engine';
import { supabase } from '@/lib/supabase';

const EQUIPMENT = {
  basic_fit: 'full_gym',
  fit_for_free: 'full_gym',
  other: 'full_gym',
  home: 'home_dumbbells',
} as const;

/**
 * Writes the onboarding answers, calculated targets and split to the
 * signed-in user's rows. Safe to call more than once (upserts).
 */
export async function saveOnboarding() {
  if (!supabase) return;
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return;
  const d = useOnboardingDraft.getState();
  const goal: PlanGoal = d.goal === 'both' || !d.goal ? 'recomp' : d.goal;
  const age = d.birthYear ? new Date().getFullYear() - d.birthYear : 24;

  const { error: pErr } = await supabase.from('profiles').upsert({
    id: user.id,
    sex: d.sex,
    birth_year: d.birthYear,
    height_cm: d.heightCm,
    goal,
    training_days: d.trainingDays,
    experience: d.experience,
    gym: d.gym,
    equipment: EQUIPMENT[d.gym ?? 'other'],
    coach_style: d.coach,
    diet_prefs: { notes: d.dietNotes, hates: d.hateEating },
    onboarded_at: new Date().toISOString(),
  });
  if (pErr) throw pErr;

  const t = calcTargets({
    sex: d.sex ?? 'male',
    age: Math.max(18, age),
    heightCm: d.heightCm,
    weightKg: d.weightKg,
    trainingDays: d.trainingDays,
    goal,
  });
  const today = new Date().toISOString().slice(0, 10);
  const { error: tErr } = await supabase.from('nutrition_targets').upsert(
    {
      user_id: user.id,
      valid_from: today,
      kcal: t.kcal,
      protein_g: t.proteinG,
      carbs_g: t.carbsG,
      fat_g: t.fatG,
      reason: 'onboarding',
    },
    { onConflict: 'user_id,valid_from' },
  );
  if (tErr) throw tErr;

  await supabase.from('body_metrics').insert({
    user_id: user.id,
    measured_at: new Date().toISOString(),
    weight_kg: d.weightKg,
    source: 'manual',
  });

  const { data: existing } = await supabase
    .from('training_programs')
    .select('id')
    .eq('user_id', user.id)
    .limit(1);
  if (!existing?.length) {
    await supabase.from('training_programs').insert({
      user_id: user.id,
      split: pickSplit(d.trainingDays),
      days: [],
    });
  }
}

/**
 * Returning user (log in on a new phone): copy their saved profile into the
 * on-device draft. Returns true when the account already finished onboarding.
 */
export async function restoreProfile(): Promise<boolean> {
  if (!supabase) return false;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;
  const { data: p } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', auth.user.id)
    .maybeSingle();
  if (!p?.onboarded_at) return false;
  const { data: w } = await supabase
    .from('body_metrics')
    .select('weight_kg')
    .eq('user_id', auth.user.id)
    .order('measured_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  const prefs = (p.diet_prefs ?? {}) as { notes?: string; hates?: string };
  const draft = useOnboardingDraft.getState();
  draft.update({
    goal: p.goal === 'recomp' ? 'both' : (p.goal as typeof draft.goal),
    sex: p.sex as typeof draft.sex,
    birthYear: p.birth_year,
    confirmed18Plus: true,
    heightCm: p.height_cm ?? draft.heightCm,
    weightKg: w?.weight_kg ?? draft.weightKg,
    trainingDays: p.training_days ?? draft.trainingDays,
    experience: p.experience as typeof draft.experience,
    gym: p.gym as typeof draft.gym,
    coach: p.coach_style as typeof draft.coach,
    dietNotes: prefs.notes ?? '',
    hateEating: prefs.hates ?? '',
  });
  return true;
}
