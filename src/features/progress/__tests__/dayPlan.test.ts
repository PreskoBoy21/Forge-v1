import assert from 'node:assert/strict';
import { test } from 'node:test';

import { clock, dayPlan, typicalTime, type PlanMeal } from '../dayPlan.ts';

const base = {
  today: '2026-11-20',
  proteinTarget: 160,
  kcalTarget: 2600,
};

test('clock formats minutes', () => {
  assert.equal(clock(480), '08:00');
  assert.equal(clock(1170), '19:30');
});

test('defaults when there is no meal history', () => {
  assert.equal(typicalTime([], 'lunch', '2026-11-20'), 780);
});

test('learns the usual lunch time', () => {
  const meals: PlanMeal[] = ['11', '12', '13', '14'].map((d) => ({
    type: 'lunch',
    minute: 735,
    date: `2026-11-${d}`,
    protein: 40,
    kcal: 700,
  }));
  assert.equal(typicalTime(meals, 'lunch', '2026-11-20'), 735);
});

test('logged breakfast is done, protein split over the rest, workout planned', () => {
  const items = dayPlan({
    ...base,
    nowMinute: 600,
    meals: [
      {
        type: 'breakfast',
        minute: 470,
        date: '2026-11-20',
        protein: 40,
        kcal: 500,
      },
    ],
    workout: { name: 'Legs', minutes: 55, done: false, call: 'push' },
  });
  const by = Object.fromEntries(items.map((i) => [i.key, i]));
  assert.equal(by.breakfast!.state, 'done');
  assert.equal(by.lunch!.state, 'next');
  assert.match(by.lunch!.body, /~50 g protein/);
  assert.match(by.workout!.title, /go heavy/);
  assert.equal(items.at(-1)!.key, 'sleep');
  // sorted by time
  assert.deepEqual(
    items.map((i) => i.minute),
    [...items.map((i) => i.minute)].sort((a, b) => a - b),
  );
});

test('no workout → rest day', () => {
  const items = dayPlan({ ...base, nowMinute: 600, meals: [] });
  assert.ok(items.some((i) => i.key === 'rest'));
});
