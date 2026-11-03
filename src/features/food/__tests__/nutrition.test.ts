import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { DayPoint } from '../../health/types.ts';
import {
  adjustTargets,
  dayTotals,
  sumMacros,
  weekStart,
  weeklyWindows,
  type Meal,
} from '../nutrition.ts';

const chicken = {
  name: 'Chicken',
  grams: 150,
  kcal: 165,
  protein: 31,
  carbs: 0,
  fat: 3.6,
};
const rice = {
  name: 'Rice',
  grams: 200,
  kcal: 130,
  protein: 2.7,
  carbs: 28,
  fat: 0.3,
};

test('meal macros scale by grams', () => {
  assert.deepEqual(sumMacros([chicken, rice]), {
    kcal: 508,
    protein: 52,
    carbs: 56,
    fat: 6,
  });
});

test('day totals only count that day', () => {
  const meals: Meal[] = [
    {
      id: 'a',
      date: '2026-11-02',
      eatenAt: '',
      type: 'lunch',
      source: 'manual',
      items: [chicken],
    },
    {
      id: 'b',
      date: '2026-11-01',
      eatenAt: '',
      type: 'lunch',
      source: 'manual',
      items: [rice],
    },
  ];
  assert.equal(dayTotals(meals, '2026-11-02').protein, 47);
});

test('kcal adjustments move carbs, floor 50 g', () => {
  const t = adjustTargets({ kcal: 2200, carbsG: 200 }, -100);
  assert.deepEqual(t, { kcal: 2100, carbsG: 175 });
  assert.equal(adjustTargets({ kcal: 1500, carbsG: 60 }, -200).carbsG, 50);
});

test('weekly windows need 3 weigh-ins per week', () => {
  const days: DayPoint[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(Date.UTC(2026, 10, 2) - i * 864e5)
      .toISOString()
      .slice(0, 10);
    days.push({ date: d, weightKg: i < 7 ? 80 : 81 });
  }
  assert.deepEqual(weeklyWindows(days, '2026-11-02'), {
    avgWeightKg: 80,
    prevAvgWeightKg: 81,
    weighIns: 7,
  });
  assert.equal(weeklyWindows(days.slice(0, 5), '2026-11-02'), null);
});

test('week starts on Monday', () => {
  assert.equal(weekStart('2026-11-02'), '2026-11-02');
  assert.equal(weekStart('2026-11-08'), '2026-11-02');
});
