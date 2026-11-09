import { useMemo, useState } from 'react';

import { nutritionSummary } from '@/features/food/nutrition';
import { useFood, useTargets } from '@/features/food/store';
import { useAnalysis } from '@/features/health/ui/useAnalysis';
import { useOnboardingDraft } from '@/features/onboarding/draft-store';
import {
  consistency,
  recentPRs,
  trainingSummary,
} from '@/features/train/stats';
import { useTrain } from '@/features/train/store';

import { dailyHabit, verdictGoal, weeklyVerdict } from './verdict';

const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** The user's real week → one verdict, the numbers behind it, and today's habit. */
export function useWeekly() {
  const history = useTrain((s) => s.history);
  const meals = useFood((s) => s.meals);
  const targets = useTargets();
  const goal = useOnboardingDraft((s) => s.goal);
  const planned = useOnboardingDraft((s) => s.trainingDays);
  const { analysis } = useAnalysis();
  const [today] = useState(() => iso(Date.now()));

  return useMemo(() => {
    const training = trainingSummary(history, today, planned);
    const weekAgo = iso(Date.parse(`${today}T00:00:00Z`) - 6 * 864e5);
    const prs7d = recentPRs(history, 50).filter((p) => p.date >= weekAgo);
    const nutrition = nutritionSummary(meals, today, targets);
    // Demo data only exists in the web preview; phones start empty.
    const activity = analysis.activity;
    const weight = analysis.weight;

    const verdict = weeklyVerdict({
      goal: verdictGoal(goal),
      workouts7d: training.workouts7d,
      plannedPerWeek: planned,
      prs7d: prs7d.length,
      weekStreak: training.weekStreak,
      nutrition,
      avgSleepH: activity?.avgSleep7d,
      weightChangePct: weight?.weeklyChangePct,
      weighIns: weight?.weighIns,
    });
    const habit = dailyHabit({
      avgSleepH: activity?.avgSleep7d,
      avgSteps: activity?.avgSteps7d,
    });
    return {
      verdict,
      habit,
      week: consistency(history, today, 7),
      stats: {
        workouts: training.workouts7d,
        planned,
        prs: prs7d.length,
        prNames: prs7d.slice(0, 3).map((p) => `${p.exercise} ${p.kg} kg`),
        protein: nutrition?.avgProteinG,
        proteinTarget: targets.proteinG,
        sleep: activity?.avgSleep7d,
        weightPct: weight?.weeklyChangePct,
      },
    };
  }, [history, meals, targets, goal, planned, analysis, today]);
}
