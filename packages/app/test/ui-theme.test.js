import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('editor chrome uses one electric-blue accent with no acid-lime remnants', async () => {
  const css=await readFile(new URL('../src/index.css',import.meta.url),'utf8');
  assert.match(css,/--accent-ui:#48d7ff/);
  assert.match(css,/--accent-ui-soft:#7ee6ff/);
  assert.match(css,/--accent-ui-rgb:72,215,255/);
  assert.doesNotMatch(css,/--acid/);
  assert.doesNotMatch(css,/#(?:e7ff00|c8dc24|e0ff61|f3ff9c)/i);
  assert.doesNotMatch(css,/rgba\((?:215,255,56|231,255,0),/);
});
