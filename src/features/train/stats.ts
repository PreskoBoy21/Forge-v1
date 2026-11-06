/**
 * Training statistics — pure functions over the workout history.
 * Used by the Train tab (charts) and the AI coach payload.
 */
import { findExercise, type WorkoutLog } from './program.ts';

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const parse = (d: string) => Date.parse(`${d}T00:00:00Z`);
const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

/** Estimated one-rep max (Epley). Reps above 12 are capped for stability. */
export function e1rm(weightKg: number, reps: number) {
  if (weightKg <= 0 || reps <= 0) return 0;
  return weightKg * (1 + Math.min(reps, 12) / 30);
}

export const volumeOf = (w: WorkoutLog) =>
  w.sets.reduce((t, s) => t + s.weightKg * s.reps, 0);

/** Monday of the week containing `date` (YYYY-MM-DD). */
export function mondayOf(date: string) {
  const t = parse(date);
  const dow = (new Date(t).getUTCDay() + 6) % 7;
  return iso(t - dow * DAY);
}

export function weeklyVolume(
  history: WorkoutLog[],
  today: string,
  weeks = 8,
): { week: string; label: string; volume: number; workouts: number }[] {
  const thisMonday = parse(mondayOf(today));
  const out = Array.from({ length: weeks }, (_, i) => {
    const start = iso(thisMonday - (weeks - 1 - i) * 7 * DAY);
    return {
      week: start,
      label: `${start.slice(8)}/${start.slice(5, 7)}`,
      volume: 0,
      workouts: 0,
    };
  });
  const idx = new Map(out.map((w, i) => [w.week, i]));
  for (const w of history) {
    const i = idx.get(mondayOf(w.date));
    if (i === undefined) continue;
    out[i]!.volume += volumeOf(w);
    out[i]!.workouts += 1;
  }
  return out.map((w) => ({ ...w, volume: Math.round(w.volume) }));
}

/** Best estimated 1RM per session for one exercise, oldest → newest. */
export function liftProgress(history: WorkoutLog[], exercise: string) {
  return [...history]
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .map((w) => {
      const sets = w.sets.filter((s) => s.exercise === exercise);
      if (!sets.length) return null;
      const best = Math.max(...sets.map((s) => e1rm(s.weightKg, s.reps)));
      const top = Math.max(...sets.map((s) => s.weightKg));
      return { date: w.date, e1rm: round(best), topKg: top };
    })
    .filter(
      (r): r is { date: string; e1rm: number; topKg: number } =>
        r !== null && r.e1rm > 0,
    );
}

/** Weighted exercises the user has done most often (≥ 2 sessions). */
export function topLifts(history: WorkoutLog[], limit = 5) {
  const count = new Map<string, number>();
  for (const w of history) {
    const seen = new Set(
      w.sets.filter((s) => s.weightKg > 0).map((s) => s.exercise),
    );
    for (const e of seen) count.set(e, (count.get(e) ?? 0) + 1);
  }
  return [...count.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

export type PR = { date: string; exercise: string; kg: number; prevKg: number };

/** Weight PRs (heavier than every earlier session), newest first. */
export function recentPRs(history: WorkoutLog[], limit = 5): PR[] {
  const best: Record<string, number> = {};
  const out: PR[] = [];
  const asc = [...history].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  );
  for (const w of asc) {
    const top: Record<string, number> = {};
    for (const s of w.sets)
      if (s.reps > 0)
        top[s.exercise] = Math.max(top[s.exercise] ?? 0, s.weightKg);
    for (const [ex, kg] of Object.entries(top)) {
      const prev = best[ex];
      if (prev !== undefined && kg > prev)
        out.push({ date: w.date, exercise: ex, kg, prevKg: prev });
      best[ex] = Math.max(prev ?? 0, kg);
    }
  }
  return out.reverse().slice(0, limit);
}

/** Hard sets per muscle group in the last 7 days. */
export function musclesThisWeek(history: WorkoutLog[], today: string) {
  const from = iso(parse(today) - 6 * DAY);
  const sets = new Map<string, number>();
  for (const w of history) {
    if (w.date < from || w.date > today) continue;
    for (const s of w.sets) {
      const m = findExercise(s.exercise)?.muscle ?? 'other';
      sets.set(m, (sets.get(m) ?? 0) + 1);
    }
  }
  return [...sets.entries()]
    .map(([muscle, n]) => ({ muscle, sets: n }))
    .sort((a, b) => b.sets - a.sets);
}

/** Did the user train on each of the last `days` days? oldest → newest. */
export function consistency(history: WorkoutLog[], today: string, days = 28) {
  const set = new Set(history.map((w) => w.date));
  const end = parse(today);
  return Array.from({ length: days }, (_, i) => {
    const d = iso(end - (days - 1 - i) * DAY);
    return { date: d, trained: set.has(d) };
  });
}

/** Weeks in a row (this week or last week counting) with ≥ 1 workout. */
export function weekStreak(history: WorkoutLog[], today: string) {
  const weeks = new Set(history.map((w) => mondayOf(w.date)));
  let t = parse(mondayOf(today));
  if (!weeks.has(iso(t))) t -= 7 * DAY;
  let n = 0;
  while (weeks.has(iso(t))) {
    n += 1;
    t -= 7 * DAY;
  }
  return n;
}

export type TrainingSummary = {
  workouts7d: number;
  plannedPerWeek: number;
  volume7dKg: number;
  volumeChangePct?: number;
  prs30d: number;
  weekStreak: number;
  totalWorkouts: number;
};

export function trainingSummary(
  history: WorkoutLog[],
  today: string,
  plannedPerWeek: number,
): TrainingSummary {
  const t = parse(today);
  const from7 = iso(t - 6 * DAY);
  const from14 = iso(t - 13 * DAY);
  const from30 = iso(t - 29 * DAY);
  const last7 = history.filter((w) => w.date >= from7 && w.date <= today);
  const prev7 = history.filter((w) => w.date >= from14 && w.date < from7);
  const v7 = last7.reduce((a, w) => a + volumeOf(w), 0);
  const vPrev = prev7.reduce((a, w) => a + volumeOf(w), 0);
  return {
    workouts7d: last7.length,
    plannedPerWeek,
    volume7dKg: Math.round(v7),
    volumeChangePct:
      vPrev > 0 ? Math.round(((v7 - vPrev) / vPrev) * 100) : undefined,
    prs30d: recentPRs(history, 999).filter((p) => p.date >= from30).length,
    weekStreak: weekStreak(history, today),
    totalWorkouts: history.length,
  };
}
