/**
 * Forge training program — deterministic, testable.
 * Split templates → today's session → swaps → last-session lookup for
 * progressive overload (engine.nextWeight does the actual weight rule).
 */
import { EXERCISES, type Equipment, type Exercise } from './library.ts';

export type SplitId = 'full_body' | 'upper_lower' | 'ppl';
export type EquipmentAccess = 'full_gym' | 'home_dumbbells';

export type PlannedMove = {
  name: string;
  sets: number;
  repMin: number;
  repMax: number;
  restSec: number;
};

export type DayTemplate = { name: string; moves: PlannedMove[] };

const m = (
  name: string,
  sets: number,
  repMin: number,
  repMax: number,
  restSec = 90,
): PlannedMove => ({ name, sets, repMin, repMax, restSec });

export const TEMPLATES: Record<SplitId, DayTemplate[]> = {
  full_body: [
    {
      name: 'Full body A',
      moves: [
        m('Back squat', 3, 6, 8, 150),
        m('Barbell bench press', 3, 6, 8, 150),
        m('Seated cable row', 3, 8, 12),
        m('Lateral raise', 3, 12, 15, 60),
        m('Cable crunch', 2, 10, 15, 60),
      ],
    },
    {
      name: 'Full body B',
      moves: [
        m('Romanian deadlift', 3, 8, 10, 150),
        m('Overhead press', 3, 6, 8, 120),
        m('Lat pulldown', 3, 8, 12),
        m('Leg press', 3, 10, 12),
        m('Dumbbell curl', 2, 10, 12, 60),
      ],
    },
  ],
  upper_lower: [
    {
      name: 'Upper A',
      moves: [
        m('Barbell bench press', 4, 6, 8, 150),
        m('Barbell row', 3, 6, 10, 120),
        m('Seated dumbbell press', 3, 8, 10),
        m('Lat pulldown', 3, 8, 12),
        m('Triceps pushdown', 2, 10, 12, 60),
        m('Dumbbell curl', 2, 10, 12, 60),
      ],
    },
    {
      name: 'Lower A',
      moves: [
        m('Back squat', 4, 6, 8, 150),
        m('Romanian deadlift', 3, 8, 10, 120),
        m('Leg extension', 3, 10, 15, 60),
        m('Lying leg curl', 3, 10, 12, 60),
        m('Standing calf raise', 3, 10, 15, 60),
      ],
    },
    {
      name: 'Upper B',
      moves: [
        m('Overhead press', 3, 6, 8, 120),
        m('Pull-up', 3, 6, 10, 120),
        m('Incline dumbbell press', 3, 8, 12),
        m('Seated cable row', 3, 8, 12),
        m('Lateral raise', 3, 12, 15, 60),
        m('Face pull', 2, 12, 15, 60),
      ],
    },
    {
      name: 'Lower B',
      moves: [
        m('Leg press', 4, 8, 12, 120),
        m('Hip thrust', 3, 8, 12, 120),
        m('Bulgarian split squat', 3, 8, 10),
        m('Seated leg curl', 3, 10, 12, 60),
        m('Hanging knee raise', 2, 10, 15, 60),
      ],
    },
  ],
  ppl: [
    {
      name: 'Push',
      moves: [
        m('Barbell bench press', 4, 6, 8, 150),
        m('Seated dumbbell press', 3, 8, 10),
        m('Incline dumbbell press', 3, 8, 12),
        m('Lateral raise', 3, 12, 15, 60),
        m('Triceps pushdown', 3, 10, 12, 60),
      ],
    },
    {
      name: 'Pull',
      moves: [
        m('Lat pulldown', 4, 8, 10, 120),
        m('Barbell row', 3, 6, 10, 120),
        m('Seated cable row', 3, 8, 12),
        m('Face pull', 3, 12, 15, 60),
        m('Dumbbell curl', 3, 10, 12, 60),
      ],
    },
    {
      name: 'Legs',
      moves: [
        m('Back squat', 4, 6, 8, 150),
        m('Romanian deadlift', 3, 8, 10, 120),
        m('Leg press', 3, 10, 12),
        m('Lying leg curl', 3, 10, 12, 60),
        m('Standing calf raise', 3, 10, 15, 60),
      ],
    },
  ],
};

const ALLOWED: Record<EquipmentAccess, Equipment[]> = {
  full_gym: ['barbell', 'dumbbell', 'machine', 'cable', 'bodyweight'],
  home_dumbbells: ['dumbbell', 'bodyweight'],
};

export function findExercise(name: string): Exercise | undefined {
  return EXERCISES.find((e) => e.name === name);
}

/** Same movement pattern (and muscle when possible), different exercise. */
export function swapsFor(
  name: string,
  access: EquipmentAccess = 'full_gym',
  limit = 3,
): Exercise[] {
  const ex = findExercise(name);
  if (!ex) return [];
  const ok = (e: Exercise) =>
    e.name !== name && ALLOWED[access].includes(e.equipment);
  const same = EXERCISES.filter(
    (e) => ok(e) && e.pattern === ex.pattern && e.muscle === ex.muscle,
  );
  const near = EXERCISES.filter(
    (e) => ok(e) && e.muscle === ex.muscle && !same.includes(e),
  );
  return [...same, ...near].slice(0, limit);
}

/** Replace moves the user can't do with their equipment. */
export function adaptToEquipment(
  day: DayTemplate,
  access: EquipmentAccess,
): DayTemplate {
  return {
    ...day,
    moves: day.moves.map((mv) => {
      const ex = findExercise(mv.name);
      if (!ex || ALLOWED[access].includes(ex.equipment)) return mv;
      const alt = swapsFor(mv.name, access, 1)[0];
      return alt ? { ...mv, name: alt.name } : mv;
    }),
  };
}

/** Rotate through the split's days by how many workouts are done. */
export function todaysDay(
  split: SplitId,
  completedCount: number,
  access: EquipmentAccess = 'full_gym',
): DayTemplate {
  const days = TEMPLATES[split];
  const day = days[completedCount % days.length] ?? days[0]!;
  return adaptToEquipment(day, access);
}

/** Easy readiness day: one set less per move (minimum 2). */
export function easier(day: DayTemplate): DayTemplate {
  return {
    ...day,
    moves: day.moves.map((mv) => ({ ...mv, sets: Math.max(2, mv.sets - 1) })),
  };
}

// ------------------------------------------------------------ history

export type LoggedSet = {
  exercise: string;
  setIndex: number;
  weightKg: number;
  reps: number;
  repMin: number;
  repMax: number;
};

export type WorkoutLog = {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string;
  sets: LoggedSet[];
  synced?: boolean;
};

/**
 * Builds engine.LastSession for one exercise from history (newest first
 * or any order). Returns null when the exercise was never done.
 */
export function lastSessionFor(history: WorkoutLog[], exercise: string) {
  const sessions = [...history]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .map((w) => w.sets.filter((s) => s.exercise === exercise))
    .filter((sets) => sets.length > 0);
  const last = sessions[0];
  if (!last) return null;
  let missedStreak = 0;
  for (const sets of sessions) {
    if (sets.some((s) => s.reps < s.repMin)) missedStreak += 1;
    else break;
  }
  const top = Math.max(...last.map((s) => s.weightKg));
  return {
    weightKg: top,
    repMax: last[0]!.repMax,
    reps: last.filter((s) => s.weightKg === top).map((s) => s.reps),
    missedStreak,
    isLowerBody: findExercise(exercise)?.lower ?? false,
  };
}

/** First-time weight: conservative, by equipment, experience and sex. */
export function startingWeight(
  exercise: string,
  opts: { beginner: boolean; female: boolean },
): number {
  const ex = findExercise(exercise);
  if (!ex || ex.equipment === 'bodyweight') return 0;
  const compound = ex.pattern !== 'isolation';
  let kg: number;
  switch (ex.equipment) {
    case 'barbell':
      kg = ex.lower ? 50 : 40;
      break;
    case 'machine':
      kg = compound ? (ex.lower ? 60 : 35) : 25;
      break;
    case 'cable':
      kg = compound ? 35 : 15;
      break;
    default:
      kg = compound ? 16 : 8;
  }
  if (opts.beginner) kg *= 0.75;
  if (opts.female) kg *= 0.6;
  const step = ex.equipment === 'dumbbell' ? 2 : 2.5;
  return Math.max(step, Math.round(kg / step) * step);
}

/** Highest weight ever logged per exercise (for PR detection). */
export function bestWeights(history: WorkoutLog[]): Record<string, number> {
  const best: Record<string, number> = {};
  for (const w of history)
    for (const s of w.sets)
      if (s.reps >= 1 && s.weightKg > (best[s.exercise] ?? 0))
        best[s.exercise] = s.weightKg;
  return best;
}

export function kgLabel(kg: number) {
  return kg === 0 ? 'Bodyweight' : `${kg} kg`;
}
