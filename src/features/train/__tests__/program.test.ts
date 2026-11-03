import assert from 'node:assert/strict';
import { test } from 'node:test';

import { nextWeight } from '../../plan/engine.ts';
import {
  easier,
  lastSessionFor,
  startingWeight,
  swapsFor,
  todaysDay,
  type WorkoutLog,
} from '../program.ts';

test('rotates days by completed count', () => {
  assert.equal(todaysDay('ppl', 0).name, 'Push');
  assert.equal(todaysDay('ppl', 4).name, 'Pull');
  assert.equal(todaysDay('upper_lower', 3).name, 'Lower B');
});

test('home equipment swaps barbell/machine moves', () => {
  const day = todaysDay('ppl', 0, 'home_dumbbells');
  assert.equal(day.moves[0]!.name, 'Dumbbell bench press');
  assert.ok(!day.moves.some((m) => m.name === 'Triceps pushdown'));
});

test('swaps keep the movement pattern', () => {
  const s = swapsFor('Barbell bench press');
  assert.ok(s.length > 0);
  assert.ok(s.every((e) => e.muscle === 'chest'));
  assert.equal(s[0]!.pattern, 'push_h');
});

test('easy day drops a set, never below 2', () => {
  const d = easier(todaysDay('full_body', 0));
  assert.equal(d.moves[0]!.sets, 2);
  assert.equal(d.moves[4]!.sets, 2);
});

const log = (date: string, reps: number[], kg = 60): WorkoutLog => ({
  id: date,
  date,
  dayName: 'Push',
  sets: reps.map((r, i) => ({
    exercise: 'Barbell bench press',
    setIndex: i,
    weightKg: kg,
    reps: r,
    repMin: 6,
    repMax: 8,
  })),
});

test('all sets at top of range → +2.5 kg', () => {
  const last = lastSessionFor(
    [log('2026-11-01', [8, 8, 8, 8])],
    'Barbell bench press',
  );
  assert.ok(last);
  assert.deepEqual(nextWeight(last), { weightKg: 62.5, reason: 'increase' });
});

test('missed twice in a row → deload', () => {
  const last = lastSessionFor(
    [
      log('2026-10-28', [5, 5, 4]),
      log('2026-11-01', [5, 4, 4]),
      log('2026-10-20', [8, 8, 8]),
    ],
    'Barbell bench press',
  );
  assert.equal(last!.missedStreak, 2);
  assert.equal(nextWeight(last!).reason, 'deload');
});

test('never-done exercise has no last session; start weight is sane', () => {
  assert.equal(lastSessionFor([], 'Leg press'), null);
  assert.equal(
    startingWeight('Leg press', { beginner: false, female: false }),
    60,
  );
  assert.equal(startingWeight('Push-up', { beginner: true, female: false }), 0);
  assert.equal(
    startingWeight('Lateral raise', { beginner: true, female: true }),
    4,
  );
});
