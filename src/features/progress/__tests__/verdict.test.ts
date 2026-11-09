import assert from 'node:assert/strict';
import { test } from 'node:test';

import { dailyHabit, weeklyVerdict, type VerdictInput } from '../verdict.ts';

const base: VerdictInput = {
  goal: 'build_muscle',
  workouts7d: 4,
  plannedPerWeek: 4,
  prs7d: 1,
  weekStreak: 3,
};

test('no data → start', () => {
  assert.equal(weeklyVerdict({ ...base, workouts7d: 0 }).key, 'start');
});

test('missed sessions come first', () => {
  const v = weeklyVerdict({ ...base, workouts7d: 1, avgSleepH: 5 });
  assert.equal(v.key, 'show_up');
  assert.match(v.reason, /1 of 4/);
});

test('one missed day is still on plan', () => {
  assert.notEqual(weeklyVerdict({ ...base, workouts7d: 3 }).key, 'show_up');
});

test('short sleep beats nutrition and weight', () => {
  const v = weeklyVerdict({
    ...base,
    avgSleepH: 6.1,
    nutrition: { daysLogged7d: 5, avgProteinG: 80, proteinTargetG: 150 },
  });
  assert.equal(v.key, 'sleep');
});

test('low protein with enough logged days', () => {
  const v = weeklyVerdict({
    ...base,
    nutrition: { daysLogged7d: 4, avgProteinG: 100, proteinTargetG: 150 },
  });
  assert.equal(v.key, 'protein');
  assert.match(v.reason, /100 g/);
});

test('protein ignored with too few logged days', () => {
  const v = weeklyVerdict({
    ...base,
    nutrition: { daysLogged7d: 2, avgProteinG: 50, proteinTargetG: 150 },
  });
  assert.notEqual(v.key, 'protein');
});

test('weight rules per goal', () => {
  const w = { weighIns: 5 };
  assert.equal(
    weeklyVerdict({ ...base, ...w, goal: 'lose_fat', weightChangePct: 0 }).key,
    'eat_less',
  );
  assert.equal(
    weeklyVerdict({ ...base, ...w, goal: 'lose_fat', weightChangePct: -1.4 })
      .key,
    'eat_more',
  );
  assert.equal(
    weeklyVerdict({ ...base, ...w, goal: 'lose_fat', weightChangePct: -0.6 })
      .key,
    'keep_going',
  );
  assert.equal(
    weeklyVerdict({ ...base, ...w, goal: 'build_muscle', weightChangePct: 0 })
      .key,
    'eat_more',
  );
  assert.equal(
    weeklyVerdict({ ...base, ...w, goal: 'build_muscle', weightChangePct: 0.8 })
      .key,
    'eat_less',
  );
  assert.equal(
    weeklyVerdict({ ...base, ...w, goal: 'recomp', weightChangePct: 0.2 }).key,
    'keep_going',
  );
});

test('weight ignored with too few weigh-ins', () => {
  assert.equal(
    weeklyVerdict({
      ...base,
      goal: 'lose_fat',
      weightChangePct: 0,
      weighIns: 1,
    }).key,
    'keep_going',
  );
});

test('long streak without PRs → easy week', () => {
  assert.equal(
    weeklyVerdict({ ...base, weekStreak: 7, prs7d: 0 }).key,
    'deload',
  );
});

test('keep going mentions PRs', () => {
  const v = weeklyVerdict({ ...base, prs7d: 2 });
  assert.equal(v.key, 'keep_going');
  assert.match(v.reason, /2 new PRs/);
});

test('daily habit picks sleep, then steps, then keep', () => {
  assert.equal(dailyHabit({ avgSleepH: 6.2, avgSteps: 3000 })?.kind, 'sleep');
  const s = dailyHabit({ avgSleepH: 7.4, avgSteps: 5200 });
  assert.equal(s?.kind, 'steps');
  assert.match(s!.text, /7,000/);
  assert.equal(dailyHabit({ avgSleepH: 7.6, avgSteps: 9500 })?.kind, 'keep');
  assert.equal(dailyHabit({}), undefined);
});

test('steps target is capped at 10,000', () => {
  assert.match(dailyHabit({ avgSteps: 7900 })!.text, /walk 9,500/);
  assert.match(dailyHabit({ avgSleepH: 8, avgSteps: 7999 })!.text, /9,500/);
});
