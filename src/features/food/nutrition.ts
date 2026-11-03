/**
 * Food math — deterministic, testable.
 * Meal macros, daily totals, check-in weight windows.
 */
import type { DayPoint } from '../health/types.ts';

export type MealItem = {
  name: string;
  grams: number;
  /** per 100 g */
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  /** 0–1 when estimated by the AI scan */
  confidence?: number;
};

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Meal = {
  id: string;
  date: string; // YYYY-MM-DD
  eatenAt: string; // ISO
  type: MealType;
  source: 'scan' | 'manual';
  items: MealItem[];
  synced?: boolean;
};

export type Macros = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

const ZERO: Macros = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

export function itemMacros(i: MealItem): Macros {
  const k = i.grams / 100;
  return {
    kcal: i.kcal * k,
    protein: i.protein * k,
    carbs: i.carbs * k,
    fat: i.fat * k,
  };
}

export function sumMacros(items: MealItem[]): Macros {
  const t = items.map(itemMacros).reduce(
    (a, b) => ({
      kcal: a.kcal + b.kcal,
      protein: a.protein + b.protein,
      carbs: a.carbs + b.carbs,
      fat: a.fat + b.fat,
    }),
    ZERO,
  );
  return {
    kcal: Math.round(t.kcal),
    protein: Math.round(t.protein),
    carbs: Math.round(t.carbs),
    fat: Math.round(t.fat),
  };
}

export function dayTotals(meals: Meal[], date: string): Macros {
  return sumMacros(
    meals.filter((m) => m.date === date).flatMap((m) => m.items),
  );
}

export function mealTypeFor(hour: number): MealType {
  if (hour < 11) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour >= 17 && hour < 22) return 'dinner';
  return 'snack';
}

/** Applies check-in calorie changes to the base targets (carbs absorb it). */
export function adjustTargets<T extends { kcal: number; carbsG: number }>(
  base: T,
  kcalAdjust: number,
): T {
  const carbsG = Math.max(50, base.carbsG + Math.round(kcalAdjust / 4));
  return {
    ...base,
    kcal: base.kcal + (carbsG - base.carbsG) * 4,
    carbsG,
  };
}

/**
 * Average weight this week (last 7 days up to `end`) vs the 7 days before.
 * Needs at least 3 weigh-ins in each window, otherwise null.
 */
export function weeklyWindows(days: DayPoint[], end: string) {
  const endT = Date.parse(end);
  const inWindow = (d: DayPoint, from: number, to: number) => {
    const t = Date.parse(d.date);
    return t > endT - to * 864e5 && t <= endT - from * 864e5;
  };
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const w = (from: number, to: number) =>
    days
      .filter((d) => d.weightKg !== undefined && inWindow(d, from, to))
      .map((d) => d.weightKg!);
  const cur = w(0, 7);
  const prev = w(7, 14);
  if (cur.length < 3 || prev.length < 3) return null;
  return {
    avgWeightKg: Math.round(avg(cur) * 100) / 100,
    prevAvgWeightKg: Math.round(avg(prev) * 100) / 100,
    weighIns: cur.length,
  };
}

/** Monday of the week containing `date` (YYYY-MM-DD). */
export function weekStart(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dow);
  return d.toISOString().slice(0, 10);
}
