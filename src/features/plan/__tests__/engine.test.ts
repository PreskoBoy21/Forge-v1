import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  bmrMifflinStJeor,
  calcTargets,
  nextWeight,
  pickSplit,
  weeklyCheckin,
} from '../engine.ts';

const male = {
  sex: 'male',
  age: 24,
  heightCm: 180,
  weightKg: 80,
  trainingDays: 4,
} as const;

test('Mifflin-St Jeor BMR', () => {
  assert.equal(
    bmrMifflinStJeor({ ...male, goal: 'recomp' }),
    10 * 80 + 6.25 * 180 - 5 * 24 + 5,
  );
  assert.equal(
    bmrMifflinStJeor({ ...male, sex: 'female', goal: 'recomp' }),
    10 * 80 + 6.25 * 180 - 5 * 24 - 161,
  );
});

test('fat loss: 20% deficit, macros add up', () => {
  const t = calcTargets({ ...male, goal: 'lose_fat' });
  assert.equal(t.kcal, Math.round((t.tdee * 0.8) / 10) * 10);
  assert.equal(t.proteinG, 144);
  const macroKcal = t.proteinG * 4 + t.carbsG * 4 + t.fatG * 9;
  assert.ok(
    Math.abs(macroKcal - t.kcal) <= 6,
    `macros ${macroKcal} vs ${t.kcal}`,
  );
});

test('safety floor: small woman never below 1200 kcal or BMR', () => {
  const t = calcTargets({
    sex: 'female',
    age: 40,
    heightCm: 150,
    weightKg: 45,
    trainingDays: 2,
    goal: 'lose_fat',
  });
  assert.ok(t.kcal >= 1200);
  assert.ok(t.kcal >= t.bmr);
  assert.ok(t.adjustments.length > 0);
});

test('fat never below 0.6 g/kg', () => {
  const t = calcTargets({
    sex: 'female',
    age: 30,
    heightCm: 160,
    weightKg: 120,
    trainingDays: 2,
    goal: 'lose_fat',
  });
  assert.ok(t.fatG >= Math.ceil(0.6 * 120));
});

test('under 18 is blocked', () => {
  assert.throws(() => calcTargets({ ...male, age: 17, goal: 'recomp' }));
});

test('split by training days', () => {
  assert.equal(pickSplit(3), 'full_body');
  assert.equal(pickSplit(4), 'upper_lower');
  assert.equal(pickSplit(6), 'ppl');
});

test('progressive overload', () => {
  assert.deepEqual(
    nextWeight({
      weightKg: 60,
      repMax: 10,
      reps: [10, 10, 10],
      missedStreak: 0,
      isLowerBody: false,
    }),
    { weightKg: 62.5, reason: 'increase' },
  );
  assert.deepEqual(
    nextWeight({
      weightKg: 100,
      repMax: 8,
      reps: [8, 8],
      missedStreak: 0,
      isLowerBody: true,
    }),
    { weightKg: 105, reason: 'increase' },
  );
  assert.deepEqual(
    nextWeight({
      weightKg: 60,
      repMax: 10,
      reps: [10, 9, 8],
      missedStreak: 1,
      isLowerBody: false,
    }),
    { weightKg: 60, reason: 'keep' },
  );
  assert.deepEqual(
    nextWeight({
      weightKg: 100,
      repMax: 8,
      reps: [6, 5],
      missedStreak: 2,
      isLowerBody: true,
    }),
    { weightKg: 92.5, reason: 'deload' },
  );
});

test('weekly check-in: fat loss too slow twice → −100 kcal', () => {
  const base = {
    goal: 'lose_fat',
    sex: 'male',
    bmr: 1800,
    currentKcal: 2200,
    prevAvgWeightKg: 80,
  } as const;
  const first = weeklyCheckin({
    ...base,
    avgWeightKg: 80,
    previousWeekTooSlow: false,
  });
  assert.equal(first.kcalChange, 0);
  assert.equal(first.tooSlow, true);
  const second = weeklyCheckin({
    ...base,
    avgWeightKg: 80,
    previousWeekTooSlow: true,
  });
  assert.equal(second.kcalChange, -100);
});

test('weekly check-in: losing >1.5% → raise calories, capped at 150', () => {
  const r = weeklyCheckin({
    goal: 'lose_fat',
    sex: 'male',
    bmr: 1800,
    currentKcal: 2000,
    avgWeightKg: 78.5,
    prevAvgWeightKg: 80,
    previousWeekTooSlow: false,
  });
  assert.equal(r.verdict, 'slow_down');
  assert.equal(r.kcalChange, 150);
});

test('weekly check-in never goes below the floor', () => {
  const r = weeklyCheckin({
    goal: 'lose_fat',
    sex: 'female',
    bmr: 1250,
    currentKcal: 1250,
    avgWeightKg: 60,
    prevAvgWeightKg: 60,
    previousWeekTooSlow: true,
  });
  assert.ok(r.newKcal >= 1250);
});
