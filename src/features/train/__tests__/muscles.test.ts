import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { HOWTO } from '../howto.ts';
import { musclesFor, musclesForMany, weeklyMuscleSets } from '../muscles.ts';

describe('musclesFor', () => {
  it('maps every guide to at least one primary muscle', () => {
    for (const name of Object.keys(HOWTO)) {
      assert.ok((musclesFor(name)?.primary.length ?? 0) > 0, name);
    }
  });
  it('splits primary and secondary', () => {
    assert.deepEqual(musclesFor('Barbell bench press'), {
      primary: ['chest'],
      secondary: ['deltoids', 'triceps'],
    });
  });
  it('counts both leg muscles of a compound as primary', () => {
    const squat = Object.keys(HOWTO).find(
      (n) => HOWTO[n]!.works === 'Quads, glutes',
    )!;
    assert.deepEqual(musclesFor(squat)?.primary, ['quadriceps', 'gluteal']);
  });
  it('unknown exercise → undefined', () => {
    assert.equal(musclesFor('Nope'), undefined);
  });
});

describe('weekly maps', () => {
  it('merges exercises with primary winning', () => {
    const m = musclesForMany(['Barbell bench press', 'Push-up']);
    assert.ok(m.primary.includes('chest'));
    assert.ok(!m.secondary.includes('chest'));
  });
  it('counts sets in the last 7 days only', () => {
    const set = (exercise: string) => ({
      exercise,
      setIndex: 0,
      weightKg: 50,
      reps: 8,
      repMin: 6,
      repMax: 10,
    });
    const out = weeklyMuscleSets(
      [
        {
          id: 'a',
          date: '2026-11-19',
          dayName: 'Push',
          sets: [set('Barbell bench press'), set('Barbell bench press')],
        },
        {
          id: 'b',
          date: '2026-11-01',
          dayName: 'Push',
          sets: [set('Barbell bench press')],
        },
      ],
      '2026-11-20',
    );
    assert.equal(out.chest, 2);
    assert.equal(out.triceps, 1);
  });
});
