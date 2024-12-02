import test from 'node:test';
import assert from 'node:assert/strict';
import {analyzeReport} from "./day2.js";

test('analyzeReport', (t) => {
  // base tests
  assert.strictEqual(analyzeReport([7, 6, 4, 2, 1]));
  assert.strictEqual(analyzeReport([1, 2, 7, 8, 9]));
  assert.strictEqual(analyzeReport([9, 7, 6, 2, 1]));
  assert.strictEqual(analyzeReport([1, 3, 2, 4, 5]));
  assert.strictEqual(analyzeReport([8, 6, 4, 4, 1]));
  assert.strictEqual(analyzeReport([1, 3, 6, 7, 9]));
  // other tests
  assert.strictEqual(analyzeReport([1, 2, 3, 4, 5]), true);
  assert.strictEqual(analyzeReport([1, 2, 3, 4, 10]), true);
  assert.strictEqual(analyzeReport([1, 2, 3, 10, 10]), false);
  assert.strictEqual(analyzeReport([1, 2, 3, 10, 5]), true);
  assert.strictEqual(analyzeReport([1, 2, 3, 10, 7]), false);
  assert.strictEqual(analyzeReport([1]), true);
  assert.strictEqual(analyzeReport([1, 5]), true);
  assert.strictEqual(analyzeReport([1, 5, 6]), true);
  assert.strictEqual(analyzeReport([1, 2, 5, 6]), true);
  assert.strictEqual(analyzeReport([1, 2, 6, 7]), false);
  assert.strictEqual(analyzeReport([1, 1, 1, 1]), false);
  assert.strictEqual(analyzeReport([1, 1]), true);
  // puzzle input tests
  assert.strictEqual(analyzeReport([20, 21, 24, 25, 27, 29, 27]), true);
  assert.strictEqual(analyzeReport([60, 61, 62, 64, 64]), true);
  assert.strictEqual(analyzeReport([15, 18, 21, 22, 25, 26, 30]), true);
  assert.strictEqual(analyzeReport([5, 8, 11, 14, 16, 19, 20, 26]), true);
  assert.strictEqual(analyzeReport([20, 22, 20, 23, 24]), true);
  assert.strictEqual(analyzeReport([20, 22, 20, 23, 24]), true);
  assert.strictEqual(analyzeReport([89, 91, 92, 95, 98, 95, 96, 95]), false);
});