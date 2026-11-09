import assert from 'node:assert/strict';
import { test } from 'node:test';

import { cleanProps } from '../telemetry-props.ts';

test('cleanProps cuts long strings and drops non-finite numbers', () => {
  const out = cleanProps({
    a: 'x'.repeat(500),
    n: Number.NaN,
    i: Infinity,
    ok: 3,
    b: true,
    z: null,
  });
  assert.equal((out.a as string).length, 300);
  assert.equal(out.n, null);
  assert.equal(out.i, null);
  assert.equal(out.ok, 3);
  assert.equal(out.b, true);
  assert.equal(out.z, null);
});

test('cleanProps keeps at most 12 keys', () => {
  const many = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [`k${i}`, i]),
  );
  assert.equal(Object.keys(cleanProps(many)).length, 12);
});
