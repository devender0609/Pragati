// v0.26 tests — curriculum validator + wraps `npm run validate:curriculum`.

import { describe, expect, it } from 'vitest';
import { summarizeIssues, validateCurriculumRegistry } from '../index';

describe('validateCurriculumRegistry (also runs as `npm run validate:curriculum`)', () => {
  it('reports zero errors on the bootstrapped v0.26 registry', () => {
    const issues = validateCurriculumRegistry();
    const { errors, warnings, ok } = summarizeIssues(issues);
    if (!ok) {
      // Surface the first few messages so failures are debuggable.
      const preview = errors.slice(0, 5).map((e) => `${e.code}: ${e.message}`).join('\n');
      throw new Error(`Registry validation failed:\n${preview}`);
    }
    expect(errors).toEqual([]);
    // Warnings are allowed; the validator does not use them in v0.26.
    expect(Array.isArray(warnings)).toBe(true);
  });
});
