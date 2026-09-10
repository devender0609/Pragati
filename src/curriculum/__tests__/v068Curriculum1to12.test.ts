// v0.68 (Classes 1–12 spec, §J) — the official curriculum registry must
// stay independent of what Pragati happens to have built.

import { describe, it, expect } from 'vitest';
import {
  OFFICIAL_CURRICULA,
  officialCurriculumForGrade,
  officialUnitCount,
  officialTopicCount,
  officialChapterList,
  isGradeStructureVerified,
  gradesPendingVerification,
} from '../officialCurriculum';
import {
  auditAllGrades,
  auditGrade,
  completenessHeadline,
  checkRegistryInvariants,
  ALL_TWELVE_GRADES,
} from '../curriculumCompletenessAudit';
import {
  gradeCurriculumView,
  officialChaptersAlwaysListed,
} from '../officialCurriculumStudentModel';
import { CHAPTER_CATALOGUE } from '../chapterCatalogue';
import { class6ChapterCards } from '../studentChapterModel';

describe('§D one registry model covers all twelve classes', () => {
  it('has exactly one curriculum record per class', () => {
    expect(OFFICIAL_CURRICULA).toHaveLength(12);
    expect(new Set(OFFICIAL_CURRICULA.map((c) => c.grade)).size).toBe(12);
    for (const g of ALL_TWELVE_GRADES) {
      expect(officialCurriculumForGrade(g), g).not.toBeNull();
    }
  });

  it('gives every official unit a stable ID and a number', () => {
    const ids = new Set<string>();
    for (const c of OFFICIAL_CURRICULA) {
      for (const u of c.units) {
        expect(u.officialUnitId).toBeTruthy();
        expect(ids.has(u.officialUnitId), u.officialUnitId).toBe(false);
        ids.add(u.officialUnitId);
        expect(u.number).toBeGreaterThan(0);
        expect(u.title.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe('§B evidence is recorded, and its absence is recorded too', () => {
  it('verifies Classes 9-12 from the current CBSE curriculum documents', () => {
    for (const g of ['class9', 'class10', 'class11', 'class12'] as const) {
      const c = officialCurriculumForGrade(g)!;
      expect(c.status).toBe('primary_source_verified');
      expect(c.authority).toBe('CBSE');
      expect(c.academicYear).toBe('2026-27');
      expect(c.sourceUrl).toMatch(/^https:\/\/cbseacademic\.nic\.in\//);
      expect(c.inspectionDate).toBeTruthy();
    }
  });

  it('keeps Class 6 verified from the NCERT primary source', () => {
    const c = officialCurriculumForGrade('class6')!;
    expect(c.status).toBe('primary_source_verified');
    expect(c.units).toHaveLength(10);
  });

  it('leaves Classes 1-5, 7 and 8 explicitly unverified with the reason stated', () => {
    for (const g of ['class1', 'class2', 'class3', 'class4', 'class5', 'class7', 'class8'] as const) {
      const c = officialCurriculumForGrade(g)!;
      expect(c.status).toBe('official_structure_pending_verification');
      expect(c.units).toEqual([]);
      expect(c.evidenceNote).toMatch(/robots\.txt|not read/i);
      // A manual step must exist, or the gap is not actionable.
      expect(c.manualVerificationStep).toBeTruthy();
    }
    expect(gradesPendingVerification()).toHaveLength(7);
  });

  it('does not silently fall back to a superseded edition', () => {
    for (const c of gradesPendingVerification()) {
      // No pre-NCF chapter list may be inherited to fill the gap.
      expect(c.units).toEqual([]);
    }
  });
});

describe('§A/§C unknown means unknown, never zero', () => {
  it('returns null rather than 0 for an unverified official unit count', () => {
    expect(officialUnitCount('class3')).toBeNull();
    expect(officialUnitCount('class7')).toBeNull();
    expect(officialUnitCount('class6')).toBe(10);
    expect(officialUnitCount('class10')).toBe(7);
  });

  it('returns null for topic depth that was never read', () => {
    expect(officialTopicCount('class1')).toBeNull();
    // Class 6 is section-verified for all ten chapters.
    expect(officialTopicCount('class6')).toBe(65);
    expect(officialTopicCount('class9')).toBe(15);
  });

  it('reports "not yet available" as null when the denominator is unknown', () => {
    // You cannot subtract Pragati's coverage from an unknown total.
    expect(auditGrade('class4').missingFromPragati).toBeNull();
    expect(auditGrade('class10').missingFromPragati).toBe(7);
  });

  it('never sums unknown grades into a headline figure', () => {
    const h = completenessHeadline();
    expect(h.gradesVerified).toBe(5);
    expect(h.gradesPending).toBe(7);
    expect(h.sentence).toMatch(/not zero/i);
  });
});

describe('§J official curriculum and Pragati coverage stay independent', () => {
  it('holds every registry invariant', () => {
    expect(checkRegistryInvariants()).toEqual([]);
  });

  it('does not let a legacy module count determine the official count', () => {
    for (const r of auditAllGrades()) {
      if (r.officialUnitsKnown === null) continue;
      const legacyDrivesIt =
        r.legacyModuleRows > 0 && r.officialUnitsKnown === r.legacyModuleRows;
      // Class 6 genuinely has 6 legacy rows and 10 official chapters.
      expect(legacyDrivesIt, r.gradeLabel).toBe(false);
    }
  });

  it('keeps a verified official chapter listed when Pragati has nothing for it', () => {
    // The defect this whole spec exists to remove.
    const c10 = auditGrade('class10');
    expect(c10.officialUnitsKnown).toBe(7);
    expect(c10.representedInPragati).toBe(0);
    expect(c10.officialUnitTitles).toHaveLength(7);
    for (const g of ALL_TWELVE_GRADES) {
      expect(officialChaptersAlwaysListed(g), g).toBe(true);
    }
  });

  it('classifies why each grade looks thin, rather than calling them all errors', () => {
    const reasons = new Set(auditAllGrades().map((r) => r.mismatchReason));
    // Class 3 (never read) and Class 10 (read, no content) are
    // different problems and must not share a label.
    expect(auditGrade('class3').mismatchReason).toBe('legacy_module_inventory_only');
    expect(auditGrade('class10').mismatchReason).toBe('no_pragati_coverage');
    expect(auditGrade('class6').mismatchReason).toBe('partial_pragati_coverage');
    expect(reasons.size).toBeGreaterThan(1);
  });

  it('preserves legacy rows rather than deleting them', () => {
    // §H — legacy content is kept and reclassified, never removed.
    expect(CHAPTER_CATALOGUE.length).toBeGreaterThan(60);
    expect(auditGrade('class1').legacyModuleRows).toBeGreaterThan(0);
  });
});

describe('§E the student sees the official structure, or an honest gap', () => {
  it('shows every official chapter for a verified grade', () => {
    const v = gradeCurriculumView('class10');
    if (v.kind !== 'verified') throw new Error('expected a verified view');
    expect(v.chapters).toHaveLength(7);
    // v0.69 §20 — these 7 are CBSE units, and must not be called chapters.
    expect(v.entryNoun.plural).toBe('units');
    // Unavailable does not mean hidden.
    expect(v.chapters.every((c) => c.availability === 'not_available_yet')).toBe(true);
    expect(v.readyCount).toBe(0);
  });

  it('keeps all ten Class 6 chapters visible, as before', () => {
    const v = gradeCurriculumView('class6');
    if (v.kind !== 'verified') throw new Error('expected a verified view');
    expect(v.chapters).toHaveLength(10);
    // And the pre-existing student surface is unchanged.
    expect(class6ChapterCards()).toHaveLength(10);
  });

  it('refuses to present legacy modules as an official chapter list', () => {
    const v = gradeCurriculumView('class3');
    expect(v.kind).toBe('structure_not_ready');
    if (v.kind !== 'structure_not_ready') return;
    // Six legacy rows exist for Class 3 and none of them appear.
    expect(auditGrade('class3').legacyModuleRows).toBeGreaterThan(0);
    expect(v.message).not.toMatch(/module|legacy|verif|registry/i);
  });

  it('uses no governance vocabulary in student-facing text', () => {
    for (const g of ALL_TWELVE_GRADES) {
      const v = gradeCurriculumView(g);
      const text =
        v.kind === 'verified'
          ? [v.summaryLine, ...v.chapters.map((c) => `${c.title} ${c.statusLine}`)].join(' ')
          : v.message;
      expect(text, g).not.toMatch(
        /primary_source_verified|pending_verification|authored_draft|unmapped|legacy/i
      );
    }
  });

  it('takes titles for a verified grade from the official registry', () => {
    // v0.69 §19 — Class 9's syllabus names chapters INSIDE its units, so
    // the student view now shows the 15 chapters rather than the 6 unit
    // headings. Both are true; the chapter list is the more useful one
    // and the source establishes it.
    const v = gradeCurriculumView('class9');
    if (v.kind !== 'verified') throw new Error('expected a verified view');
    const official = officialChapterList('class9')!.map((c) => c.title);
    expect(v.chapters.map((c) => c.title)).toEqual(official);
    expect(v.chapters).toHaveLength(15);
  });
});

describe('§I Class 6 remains the instructional pilot', () => {
  it('is the only grade with any Learn or Practice coverage', () => {
    for (const r of auditAllGrades()) {
      if (r.grade === 'class6') {
        expect(r.learnAvailable + r.practiceAvailable).toBeGreaterThan(0);
      } else {
        expect(r.learnAvailable + r.practiceAvailable, r.gradeLabel).toBe(0);
      }
    }
  });

  it('has no grade reviewed or published', () => {
    for (const r of auditAllGrades()) {
      expect(r.reviewed, r.gradeLabel).toBe(0);
      expect(r.published, r.gradeLabel).toBe(0);
    }
  });

  it('did not author hundreds of lessons to fill the registry', () => {
    // §C — structure without placeholder content.
    const verifiedUnits = auditAllGrades()
      .filter((r) => r.registryStatus === 'primary_source_verified')
      .reduce((n, r) => n + (r.officialUnitsKnown ?? 0), 0);
    const covered = auditAllGrades().reduce((n, r) => n + r.representedInPragati, 0);
    expect(verifiedUnits).toBeGreaterThan(30);
    expect(covered).toBeLessThan(5);
  });
});

describe('§K the reported table is derivable, not hand-maintained', () => {
  it('produces a row for every class', () => {
    const rows = auditAllGrades();
    expect(rows).toHaveLength(12);
    for (const r of rows) {
      expect(r.gradeLabel).toMatch(/^Class \d{1,2}$/);
      expect(r.evidenceNote.length).toBeGreaterThan(20);
      expect(isGradeStructureVerified(r.grade)).toBe(
        r.registryStatus === 'primary_source_verified'
      );
    }
  });
});
