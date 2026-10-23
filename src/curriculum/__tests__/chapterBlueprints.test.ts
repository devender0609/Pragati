// v0.48 §3 — chapter blueprint tests.

import { describe, it, expect } from 'vitest';
import {
  blueprintForChapter,
  chaptersWithBlueprint,
} from '../chapterBlueprints';

describe('chapterBlueprints', () => {
  it('Class 6 Fractions has an explicit chapter blueprint', () => {
    const bp = blueprintForChapter(
      'official:g06_fractions_officialplaceholder'
    );
    expect(bp).not.toBeNull();
    expect(bp!.legacyModuleId).toBe('fractions');
    expect(bp!.requiredSkillIds.length).toBeGreaterThanOrEqual(3);
    expect(bp!.targetItemCount).toBeGreaterThan(0);
    expect(bp!.mixedPracticeItemCount).toBeGreaterThan(0);
    expect(bp!.mixedPracticeItemCount).toBeLessThan(bp!.targetItemCount);
  });

  it('every other chapter returns null (no fake chapter check)', () => {
    expect(blueprintForChapter('legacy:decimals')).toBeNull();
    expect(blueprintForChapter('legacy:geometry')).toBeNull();
    expect(blueprintForChapter('official:g10_polynomials_placeholder')).toBeNull();
    expect(blueprintForChapter('nonsense')).toBeNull();
  });

  it('chaptersWithBlueprint returns exactly Fractions today', () => {
    const list = chaptersWithBlueprint();
    expect(list.length).toBe(1);
    expect(list[0].legacyModuleId).toBe('fractions');
  });
});
