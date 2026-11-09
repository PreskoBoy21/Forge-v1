/**
 * Weekly Verdict + daily-life habit — pure rules over the user's real week.
 * One decision per week, the most important first, always with the reason.
 * Inputs are plain numbers so this stays easy to test (no stores, no React).
 */

export type VerdictGoal = 'lose_fat' | 'build_muscle' | 'recomp';

export type VerdictInput = {
  goal: VerdictGoal;
  workouts7d: number;
  plannedPerWeek: number;
  prs7d: number;
  weekStreak: number;
  nutrition?: {
    daysLogged7d: number;
    avgProteinG: number;
    proteinTargetG: number;
  };
  avgSleepH?: number;
  weightChangePct?: number; // per week, from the smoothed trend
  weighIns?: number;
};

export type VerdictKey =
  | 'start'
  | 'show_up'
  | 'sleep'
  | 'protein'
  | 'eat_less'
  | 'eat_more'
  | 'deload'
  | 'keep_going';

export type Verdict = {
  key: VerdictKey;
  call: string;
  reason: string;
  tone: 'good' | 'warn' | 'info';
};

const r1 = (n: number) => Math.round(n * 10) / 10;

export function weeklyVerdict(i: VerdictInput): Verdict {
  const planned = Math.max(1, i.plannedPerWeek);

  if (i.workouts7d === 0 && !i.nutrition) {
    return {
      key: 'start',
      call: 'Start here',
      reason:
        'No workouts logged this week yet. Do your first session — the verdict gets sharper with every workout you log.',
      tone: 'info',
    };
  }

  if (i.workouts7d < Math.max(1, planned - 1)) {
    return {
      key: 'show_up',
      call: 'Show up first',
      reason: `You trained ${i.workouts7d} of ${planned} planned days. Hit all ${planned} next week before we change anything else — consistency beats any tweak.`,
      tone: 'warn',
    };
  }

  if (i.avgSleepH !== undefined && i.avgSleepH < 6.5) {
    return {
      key: 'sleep',
      call: 'Sleep first',
      reason: `You averaged ${r1(i.avgSleepH)} h of sleep. Aim for 7+ h next week — recovery is holding you back, not effort.`,
      tone: 'warn',
    };
  }

  const n = i.nutrition;
  if (n && n.daysLogged7d >= 3 && n.avgProteinG < n.proteinTargetG * 0.8) {
    return {
      key: 'protein',
      call: 'Protein first',
      reason: `You averaged ${n.avgProteinG} g of protein against a ${n.proteinTargetG} g target. Add one protein-heavy meal a day before changing calories.`,
      tone: 'warn',
    };
  }

  if (i.weightChangePct !== undefined && (i.weighIns ?? 0) >= 3) {
    const pct = i.weightChangePct;
    const fmt = `${pct > 0 ? '+' : ''}${r1(pct)}%`;
    if (i.goal === 'lose_fat' && pct > -0.25)
      return {
        key: 'eat_less',
        call: '−100 kcal',
        reason: `Your weight trend moved ${fmt} this week — fat loss has stalled. Eat about 100 kcal less per day and keep training the same.`,
        tone: 'info',
      };
    if (i.goal === 'lose_fat' && pct < -1)
      return {
        key: 'eat_more',
        call: '+100 kcal',
        reason: `You lost ${r1(-pct)}% in a week — too fast, you risk losing muscle. Eat about 100 kcal more per day.`,
        tone: 'warn',
      };
    if (i.goal === 'build_muscle' && pct < 0.1)
      return {
        key: 'eat_more',
        call: '+100 kcal',
        reason: `Your weight trend moved ${fmt} this week — not enough to build muscle. Eat about 100 kcal more per day.`,
        tone: 'info',
      };
    if (i.goal === 'build_muscle' && pct > 0.5)
      return {
        key: 'eat_less',
        call: '−100 kcal',
        reason: `You gained ${fmt} in a week — faster than muscle can grow, so some of it is fat. Eat about 100 kcal less per day.`,
        tone: 'info',
      };
    if (i.goal === 'recomp' && Math.abs(pct) > 0.5)
      return pct > 0
        ? {
            key: 'eat_less',
            call: '−100 kcal',
            reason: `Your weight trend moved ${fmt}. For a recomp it should stay about level — eat about 100 kcal less per day.`,
            tone: 'info',
          }
        : {
            key: 'eat_more',
            call: '+100 kcal',
            reason: `Your weight trend moved ${fmt}. For a recomp it should stay about level — eat about 100 kcal more per day.`,
            tone: 'info',
          };
  }

  if (i.weekStreak >= 6 && i.prs7d === 0) {
    return {
      key: 'deload',
      call: 'Easy week',
      reason: `${i.weekStreak} weeks in a row and no new PR this week. Take an easier week — same exercises, one set less each — then come back stronger.`,
      tone: 'info',
    };
  }

  return {
    key: 'keep_going',
    call: 'Keep going',
    reason:
      i.prs7d > 0
        ? `${i.workouts7d} workouts and ${i.prs7d} new PR${i.prs7d > 1 ? 's' : ''}. The plan is working — same plan, keep adding weight.`
        : `${i.workouts7d} of ${planned} workouts done and everything on track. Same plan next week.`,
    tone: 'good',
  };
}

export type HabitInput = {
  avgSleepH?: number; // last 7 nights
  avgSteps?: number; // last 7 days
};

export type Habit = { kind: 'sleep' | 'steps' | 'keep'; text: string };

/** One daily-life habit for Today, picked from the user's own baseline. */
export function dailyHabit(i: HabitInput): Habit | undefined {
  if (i.avgSleepH !== undefined && i.avgSleepH < 7) {
    return {
      kind: 'sleep',
      text: `Sleep: aim for 7.5 h tonight (you average ${r1(i.avgSleepH)} h)`,
    };
  }
  if (i.avgSteps !== undefined && i.avgSteps < 8000) {
    const target = Math.min(10000, Math.ceil((i.avgSteps + 1500) / 500) * 500);
    return {
      kind: 'steps',
      text: `Steps: walk ${target.toLocaleString('en-GB')} today (you average ${Math.round(i.avgSteps).toLocaleString('en-GB')})`,
    };
  }
  if (i.avgSleepH !== undefined || i.avgSteps !== undefined) {
    return {
      kind: 'keep',
      text: 'Sleep and steps are on point. Keep the routine.',
    };
  }
  return undefined;
}

/** Map onboarding goal ('both' = recomp) to the verdict goal. */
export const verdictGoal = (g: string | null | undefined): VerdictGoal =>
  g === 'lose_fat' || g === 'build_muscle' ? g : 'recomp';
