import assert from 'node:assert/strict';
import { test } from 'node:test';

import { hm, sleepSummary } from '../sleep.ts';
import type { DayPoint } from '../types.ts';

const days = (hours: (number | undefined)[]): DayPoint[] =>
  hours.map((sleepHours, i) => ({
    date: `2026-11-${String(10 + i).padStart(2, '0')}`,
    sleepHours,
  })) as DayPoint[];

test('hm formats hours', () => {
  assert.equal(hm(7.2), '7h 12m');
  assert.equal(hm(undefined), '—');
});

test('compares last night with the week before', () => {
  const s = sleepSummary(days([6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 7.5]));
  assert.equal(s.lastNight, 7.5);
  assert.equal(s.delta, 1);
  assert.equal(s.status, 'rested');
});

test('very short night → keep today light', () => {
  const s = sleepSummary(days([7, 7, 7, 5]));
  assert.equal(s.status, 'very_short');
  assert.match(s.tip.title, /light/);
});

test('no data', () => {
  const s = sleepSummary(days([undefined, undefined]));
  assert.equal(s.status, 'none');
  assert.equal(s.lastNight, undefined);
});
