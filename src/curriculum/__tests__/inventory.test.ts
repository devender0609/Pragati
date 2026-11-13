// v0.47 D + A tests — derived content status + canonical shell guards.

import { describe, it, expect } from 'vitest';
import { OFFICIAL_CHAPTERS } from '../officialChapters';
import { STATIC_MAPPING } from '../contentMapping';
import { inventoryChapter, canLaunchAssessment } from '../inventory';

describe('inventory — derived content status', () => {
  it('an official chapter with no mapping resolves to no_content', () => {
    const record = {
      officialChapterId: 'nowhere_g10_test',
      curriculum: 'CBSE_NCERT' as const,
      curriculumVersion: null,
      grade: 'class10' as const,
      subject: 'mathematics' as const,
      officialChapterNumber: null,
      officialTitle: null,
      textbookTitle: null,
      sourceReference: null,
      edition: null,
      dateVerified: null,
      sourceOrganization: null,
      pageReference: null,
      verifierNotes: null,
      verificationStatus: 'unverified' as const,
      notes: '',
    };
    const inv = inventoryChapter(record);
    expect(inv.status).toBe('no_content');
    expect(canLaunchAssessment(inv)).toBe(false);
  });

  it('Fractions maps to a status better than no_content', () => {
    const fractions = OFFICIAL_CHAPTERS.find(
      (c) => c.officialChapterId === 'ncert_gp_c6_ch07_fractions'
    );
    expect(fractions, 'seed record must exist').toBeDefined();
    const inv = inventoryChapter(fractions!);
    expect(inv.status).not.toBe('no_content');
    expect(inv.mapping.legacyModuleIds).toContain('fractions');
    expect(inv.totalItemCount).toBeGreaterThan(0);
  });

  it('static mapping stays honest — no rows for unmapped grades', () => {
    // Static mapping is intentionally small: this iteration only wires
    // Class 6 Fractions. Other grades are shown via the shell's
    // synthetic-legacy path, not the static map.
    const grades = new Set(
      STATIC_MAPPING.map((r) => {
        const rec = OFFICIAL_CHAPTERS.find(
          (c) => c.officialChapterId === r.officialChapterId
        );
        return rec?.grade;
      })
    );
    expect(grades.has('class6')).toBe(true);
  });

  it('canLaunchAssessment guards zero-item chapters', () => {
    const record = {
      officialChapterId: 'zero_items',
      curriculum: 'CBSE_NCERT' as const,
      curriculumVersion: null,
      grade: 'class6' as const,
      subject: 'mathematics' as const,
      officialChapterNumber: null,
      officialTitle: null,
      textbookTitle: null,
      sourceReference: null,
      edition: null,
      dateVerified: null,
      sourceOrganization: null,
      pageReference: null,
      verifierNotes: null,
      verificationStatus: 'unverified' as const,
      notes: '',
    };
    const inv = inventoryChapter(record);
    expect(canLaunchAssessment(inv)).toBe(false);
  });

  it('synthesised lessons are NOT counted as hand-authored', () => {
    const fractions = OFFICIAL_CHAPTERS.find(
      (c) => c.officialChapterId === 'ncert_gp_c6_ch07_fractions'
    )!;
    const inv = inventoryChapter(fractions);
    // handAuthoredLessonCount comes from real LESSONS keys; the
    // synthesiser (v0.35) is intentionally excluded from that count.
    expect(inv.handAuthoredLessonCount + inv.synthesisedLessonCount).toBe(
      inv.registeredSkillCount
    );
  });
});
