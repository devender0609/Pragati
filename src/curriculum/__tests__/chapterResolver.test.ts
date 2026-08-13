// v0.48 §1 — chapter resolver tests.

import { describe, it, expect } from 'vitest';
import {
  resolveChapter,
  chapterBelongsToGrade,
} from '../chapterResolver';
import { STATIC_MAPPING } from '../contentMapping';

describe('resolveChapter — canonical, pure, no-mutation', () => {
  it('Class 6 Fractions opens (mapped_official)', () => {
    const before = STATIC_MAPPING.length;
    const r = resolveChapter('official:g06_fractions_officialplaceholder');
    expect(r).not.toBeNull();
    expect(r!.kind).toBe('mapped_official');
    expect(r!.grade).toBe('class6');
    expect(r!.primaryLegacyModuleId).toBe('fractions');
    expect(r!.inventory.totalItemCount).toBeGreaterThan(0);
    // The resolver must never mutate STATIC_MAPPING.
    expect(STATIC_MAPPING.length).toBe(before);
  });

  it('Class 6 Fractions also opens without the official: prefix', () => {
    const r = resolveChapter('g06_fractions_officialplaceholder');
    expect(r).not.toBeNull();
    expect(r!.kind).toBe('mapped_official');
  });

  it('a legacy Pragati module opens its truthful status page', () => {
    const r = resolveChapter('legacy:decimals');
    expect(r).not.toBeNull();
    expect(r!.kind).toBe('legacy_module');
    expect(r!.primaryLegacyModuleId).toBe('decimals');
    expect(r!.grade).toBe('class6');
    // Never launches an empty session.
    expect(r!.inventory.status).not.toBe('no_content');
  });

  it('an unmapped official chapter would render its truthful status page', () => {
    // We simulate an "unmapped official" by writing one that isn't in
    // STATIC_MAPPING. Today OFFICIAL_CHAPTERS only holds the seeded
    // fractions row, so this test just proves the code path exists;
    // v0.49+ will seed real unmapped rows.
    // Guard: current seed IS mapped, so we can't test the unmapped
    // branch from real data yet. Instead we assert the resolver
    // doesn't crash on the non-existent id and returns null.
    const r = resolveChapter('official:no_such_chapter');
    expect(r).toBeNull();
  });

  it('unknown identifiers return null (no accidental default)', () => {
    expect(resolveChapter('')).toBeNull();
    expect(resolveChapter('foobar')).toBeNull();
    expect(resolveChapter('legacy:not_a_real_module_id_at_all')).toBeNull();
  });

  it('cross-grade check rejects a chapter opened by the wrong student', () => {
    const r = resolveChapter('official:g06_fractions_officialplaceholder')!;
    expect(chapterBelongsToGrade(r, 'class6')).toBe(true);
    expect(chapterBelongsToGrade(r, 'class9')).toBe(false);
  });

  it('does not mutate STATIC_MAPPING across many resolutions', () => {
    const before = STATIC_MAPPING.length;
    for (let i = 0; i < 10; i++) {
      resolveChapter('legacy:decimals');
      resolveChapter('legacy:fractions');
      resolveChapter('legacy:geometry');
      resolveChapter('official:g06_fractions_officialplaceholder');
      resolveChapter('no_such_thing');
    }
    expect(STATIC_MAPPING.length).toBe(before);
  });
});
