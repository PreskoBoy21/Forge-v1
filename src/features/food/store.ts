import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  useOnboardingDraft,
  type OnboardingDraft,
} from '@/features/onboarding/draft-store';
import {
  calcTargets,
  weeklyCheckin,
  type CheckinResult,
  type PlanGoal,
} from '@/features/plan/engine';
import { deviceStorage } from '@/lib/storage';

import type { DayPoint } from '../health/types';
import {
  adjustTargets,
  dayTotals,
  weekStart,
  weeklyWindows,
  type Meal,
} from './nutrition';
import { pushCheckin, pushMeal } from './sync';

export type CheckinRecord = CheckinResult & {
  weekStart: string;
  avgWeightKg: number;
  prevAvgWeightKg: number;
};

type FoodState = {
  meals: Meal[];
  kcalAdjust: number;
  checkins: CheckinRecord[];
  addMeal: (meal: Omit<Meal, 'id' | 'synced'>) => void;
  removeMeal: (id: string) => void;
  markSynced: (id: string) => void;
  applyCheckin: (c: CheckinRecord) => void;
};

export const useFood = create<FoodState>()(
  persist(
    (set, get) => ({
      meals: [],
      kcalAdjust: 0,
      checkins: [],
      addMeal: (m) => {
        const meal: Meal = { ...m, id: `${Date.now()}`, synced: false };
        // keep ~60 days on the device
        const cutoff = new Date(Date.now() - 60 * 864e5)
          .toISOString()
          .slice(0, 10);
        set({
          meals: [meal, ...get().meals.filter((x) => x.date >= cutoff)],
        });
        void pushMeal(meal)
          .then((ok) => ok && get().markSynced(meal.id))
          .catch(() => undefined);
      },
      removeMeal: (id) =>
        set({ meals: get().meals.filter((m) => m.id !== id) }),
      markSynced: (id) =>
        set({
          meals: get().meals.map((m) =>
            m.id === id ? { ...m, synced: true } : m,
          ),
        }),
      applyCheckin: (c) => {
        set({
          kcalAdjust: get().kcalAdjust + c.kcalChange,
          checkins: [
            c,
            ...get().checkins.filter((x) => x.weekStart !== c.weekStart),
          ],
        });
        void pushCheckin(c).catch(() => undefined);
      },
    }),
    {
      name: 'forge-food',
      storage: deviceStorage,
      partialize: (s) => ({
        meals: s.meals,
        kcalAdjust: s.kcalAdjust,
        checkins: s.checkins,
      }),
    },
  ),
);

export function planGoal(d: Pick<OnboardingDraft, 'goal'>): PlanGoal {
  return d.goal === 'both' || !d.goal ? 'recomp' : d.goal;
}

export function baseTargets(d: OnboardingDraft) {
  const age = d.birthYear ? new Date().getFullYear() - d.birthYear : 24;
  return calcTargets({
    sex: d.sex ?? 'male',
    age: Math.max(18, age),
    heightCm: d.heightCm,
    weightKg: d.weightKg,
    trainingDays: d.trainingDays,
    goal: planGoal(d),
  });
}

/** Current daily targets = onboarding plan + check-in adjustments. */
export function useTargets() {
  const draft = useOnboardingDraft();
  const kcalAdjust = useFood((s) => s.kcalAdjust);
  return useMemo(
    () => adjustTargets(baseTargets(draft), kcalAdjust),
    [draft, kcalAdjust],
  );
}

export function useToday() {
  const meals = useFood((s) => s.meals);
  const targets = useTargets();
  return useMemo(() => {
    const date = new Date().toISOString().slice(0, 10);
    const eaten = dayTotals(meals, date);
    return {
      date,
      eaten,
      targets,
      meals: meals.filter((m) => m.date === date),
    };
  }, [meals, targets]);
}

/**
 * This week's check-in (null when it's already done or there aren't
 * enough weigh-ins). Uses the engine's weekly rule.
 */
export function computeCheckin(
  days: DayPoint[],
  draft: OnboardingDraft,
  kcalAdjust: number,
  checkins: CheckinRecord[],
  today: string,
): CheckinRecord | { missing: number } | null {
  const ws = weekStart(today);
  if (checkins.some((c) => c.weekStart === ws)) return null;
  const win = weeklyWindows(days, today);
  if (!win) {
    const recent = days.filter(
      (d) =>
        d.weightKg !== undefined &&
        d.date >
          new Date(Date.parse(today) - 7 * 864e5).toISOString().slice(0, 10),
    ).length;
    return { missing: Math.max(1, 3 - recent) };
  }
  const base = baseTargets(draft);
  const current = adjustTargets(base, kcalAdjust);
  const prev = checkins[0];
  const r = weeklyCheckin({
    goal: planGoal(draft),
    sex: draft.sex ?? 'male',
    bmr: base.bmr,
    currentKcal: current.kcal,
    avgWeightKg: win.avgWeightKg,
    prevAvgWeightKg: win.prevAvgWeightKg,
    previousWeekTooSlow: prev?.tooSlow ?? false,
  });
  return { ...r, ...win, weekStart: ws };
}
