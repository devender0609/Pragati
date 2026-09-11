// v0.61 §21 — the guards that make the content model load-bearing.
//
// Each test here corresponds to a specific way Pragati has previously
// been able to overstate what it has. They are written as prohibitions,
// not as feature checks: the value is in what they make impossible.

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  emptyUnitStatus,
  isPublishedForStudents,
  isGeneratedDraft,
  countsAsOfficialCoverage,
  outstandingWork,
  officialAtLeast,
  LESSON_STATUSES,
  PRACTICE_STATUSES,
  type UnitContentStatus,
} from '../contentStatus';
import {
  completenessForGrade,
  completenessForAllGrades,
  officialUnitCountFor,
  coverageHeadline,
  ALL_GRADES,
} from '../completenessRecord';
import { computeAssignReadiness } from '../../features/assessment/GrowthAdministration';
import { GANITA_PRAKASH_C6_SOURCE } from '../officialChapters';

// ---------------------------------------------------------------------------
// §21 — content status independence
// ---------------------------------------------------------------------------

describe('§21 content statuses are independent axes', () => {
  it('an authored lesson does not imply visuals, practice, or a unit check', () => {
    const s = emptyUnitStatus('u1');
    s.lesson = 'published';

    // The whole point: publishing prose about fractions tells you
    // nothing about whether a fraction strip was ever drawn.
    expect(s.visuals).toBe('none');
    expect(s.guidedPractice).toBe('insufficient');
    expect(s.unitCheck).toBe('unavailable');
    expect(isPublishedForStudents(s)).toBe(false);
  });

  it('an item bank does not imply lesson completeness', () => {
    // The Class 6 shape exactly: many items, no instruction.
    const s = emptyUnitStatus('u2');
    s.independentPractice = 'published';
    s.guidedPractice = 'published';
    s.mixedApplicationPractice = 'published';

    expect(s.lesson).toBe('none');
    expect(isPublishedForStudents(s)).toBe(false);
    expect(outstandingWork(s)).toContain('lesson: none');
  });

  it('exposes no function that derives one axis from another', () => {
    // A structural guard. If someone later adds
    // `deriveVisualStatusFromLesson`, this fails.
    const src = readFileSync(
      join(__dirname, '..', 'contentStatus.ts'),
      'utf8'
    );
    expect(src).not.toMatch(/derive[A-Z]\w*(From|Using)[A-Z]/);
  });
});

describe('§21 a generated draft can never count as published', () => {
  it('recognises a generated draft as such', () => {
    const s = emptyUnitStatus('u3');
    s.lesson = 'generated_draft';
    expect(isGeneratedDraft(s)).toBe(true);
    expect(isPublishedForStudents(s)).toBe(false);
  });

  it('orders generated_draft below every authored stage', () => {
    const gi = LESSON_STATUSES.indexOf('generated_draft');
    for (const later of [
      'authored_draft',
      'math_reviewed',
      'curriculum_reviewed',
      'educator_reviewed',
      'published',
    ] as const) {
      expect(LESSON_STATUSES.indexOf(later)).toBeGreaterThan(gi);
    }
  });

  it('requires every axis to be published, not just the lesson', () => {
    const s: UnitContentStatus = {
      unitId: 'u4',
      officialCurriculum: 'mapping_reviewed',
      lesson: 'published',
      workedExamples: 'published',
      visuals: 'concept_specific', // one short of published
      guidedPractice: 'published',
      independentPractice: 'published',
      mixedApplicationPractice: 'published',
      teacherResources: 'published',
      unitCheck: 'published',
    };
    expect(isPublishedForStudents(s)).toBe(false);
    expect(outstandingWork(s)).toEqual(['visuals: concept_specific']);
  });
});

describe('§21 an unverified module cannot count as official coverage', () => {
  it('refuses coverage until the official record is mapped', () => {
    const s = emptyUnitStatus('u5');
    s.lesson = 'published';
    s.independentPractice = 'published';

    // Plenty of content. No verified official unit behind it.
    expect(countsAsOfficialCoverage(s)).toBe(false);

    s.officialCurriculum = 'primary_inspected';
    expect(countsAsOfficialCoverage(s)).toBe(false);

    s.officialCurriculum = 'mapped';
    expect(countsAsOfficialCoverage(s)).toBe(true);
  });

  it('orders the official axis so mapping follows inspection', () => {
    expect(officialAtLeast('mapped', 'primary_inspected')).toBe(true);
    expect(officialAtLeast('source_located', 'primary_inspected')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// §21 — completeness cannot be computed from an unknown denominator
// ---------------------------------------------------------------------------

describe('§21 completeness needs a primary-verified denominator', () => {
  it('returns null, not zero, for every grade without a primary source', () => {
    for (const grade of ALL_GRADES) {
      if (grade === 'class6') continue;
      const g = completenessForGrade(grade);
      expect(g.officialUnitsKnown).toBeNull();
      expect(g.completenessPercent).toBeNull();
      // And it must say WHY, so the UI cannot render a blank.
      expect(g.denominatorProblem).not.toBeNull();
    }
  });

  it('never substitutes Pragati module count for the official count', () => {
    // Class 10 has many Pragati modules and no inspected source. If the
    // denominator ever silently became "modules Pragati has", this
    // grade would report 100%.
    const g = completenessForGrade('class10');
    expect(g.completenessPercent).toBeNull();
  });

  it('computes a percentage only for the primary-verified grade', () => {
    const c6 = completenessForGrade('class6');
    expect(c6.primaryVerified).toBe(true);
    expect(c6.officialUnitsKnown).toBe(10);
    expect(c6.completenessPercent).not.toBeNull();
  });

  it('states in the headline how many grades cannot be measured', () => {
    const h = coverageHeadline();
    expect(h).toMatch(/Class 6/);
    expect(h).toMatch(/cannot be calculated for the other 11/);
  });
});

// ---------------------------------------------------------------------------
// §21 — primary-source mapping precedes official completeness claims
// ---------------------------------------------------------------------------

describe('§21 Class 6 official structure rests on primary evidence', () => {
  it('records the archive that actually served the textbook', () => {
    expect(GANITA_PRAKASH_C6_SOURCE.totalOfficialChapters).toBe(10);
    expect(GANITA_PRAKASH_C6_SOURCE.archiveUrl).toMatch(/ncert\.nic\.in/);
    // The endpoint that refuses automated access is recorded too, so
    // the next reader does not repeat seven iterations of retries.
    expect(GANITA_PRAKASH_C6_SOURCE.blockedUrl).not.toBe(
      GANITA_PRAKASH_C6_SOURCE.archiveUrl
    );
  });

  it('does not count the Learning Material Sheets appendix as a chapter', () => {
    const { count } = officialUnitCountFor('class6');
    expect(count).toBe(10);
    expect(GANITA_PRAKASH_C6_SOURCE.appendix).toMatch(/not a chapter/i);
  });

  it('reports no chapter as fully mapped, including Fractions', () => {
    const c6 = completenessForGrade('class6');
    const fractions = c6.units.find((u) => u.officialNumber === 7);
    // Downgraded from 'exact' on section-level evidence: 5 of 9
    // official sections are covered.
    expect(fractions?.mappingType).toBe('partial');
    expect(c6.mappedUnits).toBe(0);
  });

  it('counts five official chapters with no Pragati content at all', () => {
    const c6 = completenessForGrade('class6');
    expect(c6.unmappedOfficialUnits).toBe(5);
  });

  it('records the Pragati modules with no home in the current book', () => {
    const c6 = completenessForGrade('class6');
    expect(c6.legacyPragatiOnlyUnits).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// §21 — no formal readiness fallback to Class 6
// ---------------------------------------------------------------------------

describe('§21 formal readiness never falls back to Class 6', () => {
  it('does not call the preparation pipeline without a valid grade', () => {
    let called = 0;
    const prepare = ((): never => {
      called += 1;
      throw new Error('prepare must not be called without a grade');
    }) as never;

    const r = computeAssignReadiness({
      selectedClassroomId: 'room-a',
      rawGrade: 'Year Six-ish',
      prepare,
    });

    // The assertion that matters. v0.60 evaluated Class 6 here and hid
    // the answer behind a disabled button.
    expect(called).toBe(0);
    expect(r.kind).toBe('invalid_grade');
  });

  it('does not evaluate readiness when no class is selected', () => {
    let called = 0;
    const prepare = ((): never => {
      called += 1;
      throw new Error('prepare must not be called');
    }) as never;

    const r = computeAssignReadiness({
      selectedClassroomId: null,
      rawGrade: 'class6',
      prepare,
    });
    expect(called).toBe(0);
    expect(r.kind).toBe('no_class_selected');
  });

  it('names the offending value so the teacher can fix it', () => {
    const r = computeAssignReadiness({
      selectedClassroomId: 'room-a',
      rawGrade: 'Std VI',
      prepare: (() => {
        throw new Error('unreachable');
      }) as never,
    });
    if (r.kind !== 'invalid_grade') throw new Error('expected invalid_grade');
    expect(r.message).toMatch(/Std VI/);
  });

  it('has no Class 6 literal anywhere in the formal assessment source', () => {
    const dir = join(__dirname, '..', '..', 'features', 'assessment');
    const offenders: string[] = [];
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.ts') && !f.endsWith('.tsx')) continue;
      const src = readFileSync(join(dir, f), 'utf8');
      // Strip comments — the history of the bug is documented there.
      const code = src
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      if (/'class6'/.test(code)) offenders.push(f);
    }
    // rationalNumberSpecifications and assessmentAssembler legitimately
    // declare grade RANGES; a fallback is a different thing.
    const unexpected = offenders.filter(
      (f) =>
        f !== 'rationalNumberSpecifications.ts' &&
        f !== 'assessmentAssembler.ts'
    );
    expect(unexpected).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §21 — the legacy assignment type is out of active formal UI
// ---------------------------------------------------------------------------

describe('§21 active formal UI does not import the legacy assignment type', () => {
  const ACTIVE_FORMAL_UI = [
    'GrowthAdministration.tsx',
    'AssignmentManagementPanel.tsx',
    'FormalSittingView.tsx',
  ];

  it('imports FormalGrowthAssignment or its derived view, never the legacy type', () => {
    const dir = join(__dirname, '..', '..', 'features', 'assessment');
    for (const f of ACTIVE_FORMAL_UI) {
      const src = readFileSync(join(dir, f), 'utf8');
      const code = src
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      expect(
        /\bLegacyGrowthAssignment\b/.test(code),
        `${f} imports the legacy assignment type`
      ).toBe(false);
    }
  });

  it('keeps the legacy type reachable only under its deprecated name', () => {
    const src = readFileSync(
      join(__dirname, '..', '..', 'features', 'assessment', 'growthSession.ts'),
      'utf8'
    );
    expect(src).toMatch(/@deprecated/);
    expect(src).toMatch(/export type LegacyGrowthAssignment/);
    // The undecorated name must not be exported any more.
    expect(src).not.toMatch(/export type GrowthAssignment\b/);
  });
});

// ---------------------------------------------------------------------------
// §21 — student UI stays free of governance vocabulary
// ---------------------------------------------------------------------------

describe('§21 internal content-governance terms stay out of student UI', () => {
  const STUDENT_DIR = join(__dirname, '..', '..', 'features', 'student');
  const BANNED = [
    'generated_draft',
    'authored_draft',
    'curriculum_reviewed',
    'educator_reviewed',
    'primary_source_verified',
    'secondary_corroborated',
    'mapping_pending',
    'denominatorProblem',
    'blueprint',
    'psychometric',
  ];

  it('renders no governance status vocabulary to students', () => {
    const files = readdirSync(STUDENT_DIR).filter(
      (f) => f.endsWith('.tsx') && !f.includes('.test.')
    );
    const hits: string[] = [];
    for (const f of files) {
      const src = readFileSync(join(STUDENT_DIR, f), 'utf8');
      const code = src
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
        // Import specifiers are module paths, not screen text.
        .replace(/^\s*import[\s\S]*?from\s+['"][^'"]+['"];?$/gm, '');

      // Only what can REACH THE SCREEN counts: string literals and JSX
      // text. An identifier like `blueprintForChapter` is internal
      // plumbing and is not a student-facing word — banning it would
      // make this test noise rather than a guard.
      const rendered = [
        ...(code.match(/'[^'\n]*'/g) ?? []),
        ...(code.match(/"[^"\n]*"/g) ?? []),
        ...(code.match(/`[^`]*`/g) ?? []),
        ...(code.match(/>[^<>{}]+</g) ?? []),
      ].join(' ');

      for (const term of BANNED) {
        if (rendered.toLowerCase().includes(term.toLowerCase())) {
          hits.push(`${f}: ${term}`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Sanity: the practice axis starts at 'insufficient', not 'none'
// ---------------------------------------------------------------------------

describe('§21 practice has no "none" state', () => {
  it('starts at insufficient, because zero questions is a usability fact', () => {
    expect(PRACTICE_STATUSES[0]).toBe('insufficient');
    expect(PRACTICE_STATUSES).not.toContain('none');
  });

  it('reports every grade in the all-grades record', () => {
    expect(completenessForAllGrades()).toHaveLength(12);
  });
});
