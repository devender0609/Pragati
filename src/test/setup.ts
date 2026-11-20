// v0.49 §11 — shared test setup.
//
// Two things the DOM suite needs that v0.48 did without:
//
//  1. jest-dom matchers (`toBeDisabled`, `toBeVisible`, ...). Without
//     these, `expect(el).toBeDisabled()` throws "Invalid Chai
//     property" — which reads like a passing assertion never ran.
//  2. RTL cleanup between tests. `globals: false` disables RTL's
//     automatic afterEach cleanup, so every render stacked into the
//     same document and queries matched elements from earlier tests.
//
// Both are guarded on `document` because unit tests run in the Node
// environment, where there is nothing to clean up.

import { afterEach } from 'vitest';

if (typeof document !== 'undefined') {
  await import('@testing-library/jest-dom/vitest');
  const { cleanup } = await import('@testing-library/react');
  afterEach(() => {
    cleanup();
  });
}
