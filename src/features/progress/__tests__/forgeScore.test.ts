import assert from 'node:assert/strict';
import { test } from 'node:test';

import { activeStreak, forgeScore } from '../forgeScore.ts';

const day = {
  trained: true,
  weekDone: false,
  proteinG: 150,
  proteinTargetG: 150,
  kcal: 2500,
  kcalTarget: 2500,
  mealsLogged: 3,
};

test('perfect day = 100', () => {
  assert.equal(forgeScore(day).score, 100);
});

test('rest day counts once the week is done', () => {
  assert.equal(
    forgeScore({ ...day, trained: false, weekDone: true }).rows[0]!.points,
    40,
  );
  assert.equal(forgeScore({ ...day, trained: false }).rows[0]!.points, 0);
});

test('protein is proportional, calories banded', () => {
  const r = forgeScore({ ...day, proteinG: 75, kcal: 2900, mealsLogged: 1 });
  assert.equal(r.rows[1]!.points, 15);
  assert.equal(r.rows[2]!.points, 10); // 16% off
  assert.equal(r.rows[3]!.points, 5);
  assert.equal(forgeScore({ ...day, kcal: 0 }).rows[2]!.points, 0);
  assert.equal(forgeScore({ ...day, kcal: 3200 }).rows[2]!.points, 0);
});

test('empty day = 0', () => {
  assert.equal(
    forgeScore({ ...day, trained: false, proteinG: 0, kcal: 0, mealsLogged: 0 })
      .score,
    0,
  );
});

test('streak ends today or yesterday', () => {
  assert.equal(activeStreak([true, true, false, true, true, true]), 3);
  assert.equal(activeStreak([true, true, true, false]), 3);
  assert.equal(activeStreak([true, false, false]), 0);
  assert.equal(activeStreak([]), 0);
});
