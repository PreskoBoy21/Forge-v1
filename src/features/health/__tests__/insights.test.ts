import assert from 'node:assert/strict';
import { test } from 'node:test';

import { demoSnapshot } from '../demo.ts';
import {
  analyze,
  readiness,
  summarizeComposition,
  summarizeWeight,
  weightTrend,
} from '../insights.ts';
import type { DayPoint } from '../types.ts';

const day = (i: number, p: Partial<DayPoint>): DayPoint => ({
  date: new Date(Date.UTC(2026, 9, 1 + i)).toISOString().slice(0, 10),
  ...p,
});

test('trend smooths a one-day water spike', () => {
  const days = Array.from({ length: 14 }, (_, i) =>
    day(i, { weightKg: i === 13 ? 82 : 80 }),
  );
  const s = weightTrend(days);
  assert.ok(
    s.at(-1)!.trend < 80.3,
    'a 2 kg spike moves the trend by only ~0.2 kg',
  );
});

test('weekly change on steady loss', () => {
  const days = Array.from({ length: 28 }, (_, i) =>
    day(i, { weightKg: 85 - i * 0.1 }),
  );
  const w = summarizeWeight(days)!;
  assert.ok(
    w.weeklyChangeKg < -0.4 && w.weeklyChangeKg > -0.8,
    String(w.weeklyChangeKg),
  );
});

test('lean-mass loss is detected and flagged', () => {
  const days = Array.from({ length: 28 }, (_, i) =>
    day(i, { weightKg: 85 - i * 0.15, leanMassKg: 68 - i * 0.06 }),
  );
  const c = summarizeComposition(days)!;
  assert.ok(c.leanChangeKg <= -0.5);
  const a = analyze(days, 'lose_fat');
  assert.ok(a.insights.some((i) => i.id === 'lean_loss'));
});

test('low readiness → easy training', () => {
  const base = Array.from({ length: 28 }, (_, i) =>
    day(i, { hrvMs: 60, restingHr: 55, sleepHours: 8 }),
  );
  const today = day(28, { hrvMs: 40, restingHr: 62, sleepHours: 4.5 });
  const r = readiness([...base, today])!;
  assert.equal(r.level, 'low');
  assert.equal(r.training, 'easy');
});

test('high readiness → push', () => {
  const base = Array.from({ length: 28 }, (_, i) =>
    day(i, { hrvMs: 50, restingHr: 58, sleepHours: 7 }),
  );
  const r = readiness([
    ...base,
    day(28, { hrvMs: 62, restingHr: 55, sleepHours: 8.2 }),
  ])!;
  assert.equal(r.training, 'push');
});

test('too fast loss is the top insight', () => {
  const days = Array.from({ length: 21 }, (_, i) =>
    day(i, { weightKg: 80 - i * 0.25 }),
  );
  const a = analyze(days, 'lose_fat');
  assert.equal(a.insights[0]!.id, 'loss_too_fast');
});

test('demo data produces a full analysis', () => {
  const a = analyze(demoSnapshot(42, new Date('2026-11-01')).days, 'lose_fat');
  assert.ok(a.weight && a.composition && a.readiness && a.activity);
  assert.ok(a.insights.length >= 1);
});

test('no data → empty analysis, no crash', () => {
  const a = analyze([], 'recomp');
  assert.deepEqual(a.insights, []);
});
