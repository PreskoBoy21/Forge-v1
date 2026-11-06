import assert from 'node:assert/strict';
import { test } from 'node:test';

import { HOWTO } from '../howto.ts';
import { EXERCISES } from '../library.ts';
import { TEMPLATES } from '../program.ts';

test('every exercise has a how-to', () => {
  const names = new Set([
    ...EXERCISES.map((e) => e.name),
    ...Object.values(TEMPLATES).flatMap((days) =>
      days.flatMap((d) => d.moves.map((m) => m.name)),
    ),
  ]);
  const missing = [...names].filter((n) => !HOWTO[n]);
  assert.deepEqual(missing, []);
});
