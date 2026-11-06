import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { WorkoutLog } from '../program.ts';
import {
  consistency,
  e1rm,
  liftProgress,
  mondayOf,
  musclesThisWeek,
  recentPRs,
  topLifts,
  trainingSummary,
  weekStreak,
  weeklyVolume,
} from '../stats.ts';

const w = (date: string, kg: number, reps = [8, 8]): WorkoutLog => ({
  id: date,
  date,
  dayName: 'Upper A',
  sets: reps.map((r, i) => ({
    exercise: 'Barbell bench press',
    setIndex: i,
    weightKg: kg,
    reps: r,
    repMin: 6,
    repMax: 8,
  })),
});

const history = [
  w('2026-11-05', 65),
  w('2026-11-02', 62.5),
  w('2026-10-29', 60),
  w('2026-10-20', 60),
];

test('Epley 1RM', () => {
  assert.equal(Math.round(e1rm(100, 5)), 117);
  assert.equal(e1rm(0, 5), 0);
});

test('monday of week', () => {
  assert.equal(mondayOf('2026-11-06'), '2026-11-02'); // Friday
  assert.equal(mondayOf('2026-11-02'), '2026-11-02');
  assert.equal(mondayOf('2026-11-08'), '2026-11-02'); // Sunday
});

test('weekly volume buckets by week', () => {
  const v = weeklyVolume(history, '2026-11-06', 4);
  assert.equal(v.length, 4);
  assert.equal(v.at(-1)!.workouts, 2);
  assert.equal(v.at(-1)!.volume, 65 * 16 + 62.5 * 16);
  assert.equal(v[1]!.workouts, 1); // week of 20 Oct
});

test('lift progress is oldest first and rising', () => {
  const p = liftProgress(history, 'Barbell bench press');
  assert.equal(p[0]!.date, '2026-10-20');
  assert.ok(p.at(-1)!.e1rm > p[0]!.e1rm);
});

test('PRs only count beating an earlier session', () => {
  const prs = recentPRs(history);
  assert.deepEqual(
    prs.map((p) => p.kg),
    [65, 62.5],
  );
  assert.equal(prs[0]!.prevKg, 62.5);
});

test('top lifts need two sessions', () => {
  assert.deepEqual(topLifts(history), ['Barbell bench press']);
  assert.deepEqual(topLifts([w('2026-11-05', 60)]), []);
});

test('muscles, consistency and streak', () => {
  assert.deepEqual(musclesThisWeek(history, '2026-11-06'), [
    { muscle: 'chest', sets: 4 },
  ]);
  const days = consistency(history, '2026-11-06', 7);
  assert.equal(days.filter((d) => d.trained).length, 2);
  assert.equal(weekStreak(history, '2026-11-06'), 3);
  assert.equal(weekStreak([], '2026-11-06'), 0);
});

test('training summary compares weeks', () => {
  const s = trainingSummary(history, '2026-11-06', 4);
  assert.equal(s.workouts7d, 2);
  assert.equal(s.plannedPerWeek, 4);
  assert.equal(s.prs30d, 2);
  assert.ok(s.volumeChangePct !== undefined && s.volumeChangePct > 0);
});
