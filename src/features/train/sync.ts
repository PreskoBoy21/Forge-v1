import { supabase } from '@/lib/supabase';

import type { WorkoutLog } from './program';

let exerciseIds: Record<string, string> | null = null;

async function idsByName() {
  if (exerciseIds || !supabase) return exerciseIds ?? {};
  const { data, error } = await supabase.from('exercises').select('id,name');
  if (error) throw error;
  exerciseIds = Object.fromEntries(data.map((e) => [e.name, e.id]));
  return exerciseIds;
}

/** Saves one finished workout + its sets. Returns false when signed out. */
export async function pushWorkout(log: WorkoutLog): Promise<boolean> {
  if (!supabase) return false;
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return false;
  const ids = await idsByName();

  const { data: w, error } = await supabase
    .from('workouts')
    .insert({
      user_id: user.id,
      date: log.date,
      day_name: log.dayName,
      status: 'done',
    })
    .select('id')
    .single();
  if (error) throw error;

  const rows = log.sets
    .filter((s) => ids[s.exercise])
    .map((s) => ({
      workout_id: w.id,
      exercise_id: ids[s.exercise]!,
      set_index: s.setIndex,
      actual_weight_kg: s.weightKg,
      actual_reps: s.reps,
      target_reps_min: s.repMin,
      target_reps_max: s.repMax,
    }));
  if (rows.length) {
    const { error: sErr } = await supabase.from('workout_sets').insert(rows);
    if (sErr) throw sErr;
  }
  return true;
}

/** Loads the last ~90 days of workouts (e.g. on a new phone). */
export async function pullWorkouts(): Promise<WorkoutLog[] | null> {
  if (!supabase) return null;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const since = new Date(Date.now() - 90 * 864e5).toISOString().slice(0, 10);
  const { data: workouts, error } = await supabase
    .from('workouts')
    .select('id,date,day_name')
    .eq('status', 'done')
    .gte('date', since)
    .order('date', { ascending: false });
  if (error || !workouts?.length) return error ? null : [];
  const ids = await idsByName();
  const names = Object.fromEntries(Object.entries(ids).map(([n, i]) => [i, n]));
  const { data: sets } = await supabase
    .from('workout_sets')
    .select(
      'workout_id,exercise_id,set_index,actual_weight_kg,actual_reps,target_reps_min,target_reps_max',
    )
    .in(
      'workout_id',
      workouts.map((w) => w.id),
    );
  return workouts.map((w) => ({
    id: w.id,
    date: w.date,
    dayName: w.day_name,
    synced: true,
    sets: (sets ?? [])
      .filter((s) => s.workout_id === w.id && names[s.exercise_id])
      .map((s) => ({
        exercise: names[s.exercise_id]!,
        setIndex: s.set_index,
        weightKg: Number(s.actual_weight_kg ?? 0),
        reps: s.actual_reps ?? 0,
        repMin: s.target_reps_min,
        repMax: s.target_reps_max,
      })),
  }));
}
