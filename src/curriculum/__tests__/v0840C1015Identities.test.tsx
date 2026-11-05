// ---------------------------------------------------------------------------
// v0.84.0-c10.15 checkpoint 69 — THE FINAL THREE CLASS 10 UNITS.
//
// Can Class 10 trigonometry be finished without weakening the acute-triangle
// model — representing the boundary values and the undefined ratios
// truthfully, and PROVING the identities rather than tabulating them?
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  ACUTE_STANDARD_ANGLES, RATIO_NAMES, STANDARD_ANGLES, auditInvalidDivision,
  auditProofByExample, basisAt, divideExact, exact, exactValue, formatExact,
  identityHoldsAtStandardAngles, isDefined, ratioAt,
  undefinedRatios, validateStandardAngles, valueOf, writtenMatches, writtenOf,
  type Degrees, type RatioName,
} from '../specialAngles';
import {
  CLASS10_IDENTITY_SECTIONS, renderedStandardTable,
  C10_SECTION_8_3B, C10_SECTION_8_4A, C10_SECTION_8_4B,
} from '../identitySections';
import { STANDARD_ANGLE_RATIOS, CLASS10_TRIGONOMETRY_SECTIONS } from '../trigonometrySections';
import { auditProofScope } from '../proofScopeAudit';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { CLASS10_HEIGHTS_DISTANCES_SECTIONS } from '../heightsDistancesSections';
import { CLASS10_COORDINATE_SECTIONS } from '../coordinateClass10Sections';
import { CLASS10_TANGENT_SECTIONS } from '../tangentSections';

const blocks = (s: (typeof CLASS10_IDENTITY_SECTIONS)[number]): Array<[string, string]> => [
  ['learningGoal', s.learningGoal],
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];
const prose = () => CLASS10_IDENTITY_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');

describe('the standard-angle table — one source of truth', () => {
  it('validates across all five angles', () => {
    expect(validateStandardAngles()).toEqual([]);
    expect(STANDARD_ANGLES).toEqual([0, 30, 45, 60, 90]);
    expect(ACUTE_STANDARD_ANGLES).toEqual([30, 45, 60]);
  });

  it('gives the exact value of every ratio at every angle', () => {
    const expected: Record<number, Record<RatioName, string>> = {
      0: { sin: '0', cos: '1', tan: '0', cosec: 'not defined', sec: '1', cot: 'not defined' },
      30: { sin: '1/2', cos: '\u221a3/2', tan: '1/\u221a3', cosec: '2', sec: '2/\u221a3', cot: '\u221a3' },
      45: { sin: '1/\u221a2', cos: '1/\u221a2', tan: '1', cosec: '\u221a2', sec: '\u221a2', cot: '1' },
      60: { sin: '\u221a3/2', cos: '1/2', tan: '\u221a3', cosec: '2/\u221a3', sec: '2', cot: '1/\u221a3' },
      90: { sin: '1', cos: '0', tan: 'not defined', cosec: '1', sec: 'not defined', cot: '0' },
    };
    for (const d of STANDARD_ANGLES) {
      for (const n of RATIO_NAMES) {
        expect(writtenOf(ratioAt(d, n)), `${n} ${d}`).toBe(expected[d][n]);
      }
    }
  });

  it('keeps sin\u00b2 + cos\u00b2 = 1 across the whole table', () => {
    for (const d of STANDARD_ANGLES) {
      const s = valueOf(ratioAt(d, 'sin'));
      const c = valueOf(ratioAt(d, 'cos'));
      expect(s * s + c * c, `${d}\u00b0`).toBeCloseTo(1, 12);
    }
  });

  it('keeps reciprocals consistent, and undefined together with a zero base', () => {
    for (const d of STANDARD_ANGLES) {
      for (const [a, b] of [['sin', 'cosec'], ['cos', 'sec'], ['tan', 'cot']] as Array<[RatioName, RatioName]>) {
        const va = ratioAt(d, a); const vb = ratioAt(d, b);
        if (isDefined(va) && valueOf(va) === 0) {
          expect(vb.kind, `${b} ${d}`).toBe('undefined');
        } else if (isDefined(va) && isDefined(vb)) {
          expect(valueOf(va) * valueOf(vb), `${a}\u00b7${b} ${d}`).toBeCloseTo(1, 12);
        }
      }
    }
  });

  it('checks every written form against its computed value', () => {
    for (const d of STANDARD_ANGLES) {
      for (const n of RATIO_NAMES) {
        const v = ratioAt(d, n);
        if (v.kind !== 'defined') continue;
        expect(writtenMatches(v.written, exactValue(v.exact)), `${n} ${d} written "${v.written}"`).toBe(true);
      }
    }
    expect(writtenMatches('1/\u221a3', 1 / Math.sqrt(3))).toBe(true);
    expect(writtenMatches('1/\u221a3', 0.5)).toBe(false);
  });

  it('renders the table from the canonical data, not a typed copy', () => {
    const rows = renderedStandardTable();
    expect(rows.length).toBe(5);
    expect(rows[0]).toContain('cosec not defined');
    expect(rows[4]).toContain('tan not defined');
  });
});

describe('undefined is a kind, never a number', () => {
  it('names exactly the four undefined entries', () => {
    const u = undefinedRatios();
    expect(u.length).toBe(4);
    expect(u.map((x) => `${x.name} ${x.degrees}`).sort())
      .toEqual(['cosec 0', 'cot 0', 'sec 90', 'tan 90']);
    for (const x of u) expect(x.reason).toMatch(/division by zero is not defined/);
  });

  it('never stores Infinity, NaN or a sentinel', () => {
    for (const d of STANDARD_ANGLES) {
      for (const n of RATIO_NAMES) {
        const v = ratioAt(d, n);
        if (v.kind === 'undefined') {
          expect(v).not.toHaveProperty('exact');
          expect(JSON.stringify(v)).not.toMatch(/Infinity|NaN|99999|-1\b/);
        } else {
          expect(Number.isFinite(exactValue(v.exact)), `${n} ${d}`).toBe(true);
        }
      }
    }
  });

  it('throws rather than returning a number for an undefined ratio', () => {
    expect(() => valueOf(ratioAt(90, 'tan'))).toThrow(/undefined/);
    expect(() => valueOf(ratioAt(0, 'cot'))).toThrow(/undefined/);
    expect(() => valueOf(ratioAt(0, 'cosec'))).toThrow(/undefined/);
    expect(() => valueOf(ratioAt(90, 'sec'))).toThrow(/undefined/);
  });

  it('separates zero from undefined in the model and in the lesson', () => {
    // cot 90 is zero; tan 90 is undefined. Same angle, different outcomes.
    expect(writtenOf(ratioAt(90, 'cot'))).toBe('0');
    expect(ratioAt(90, 'tan').kind).toBe('undefined');
    expect(writtenOf(ratioAt(0, 'tan'))).toBe('0');
    expect(ratioAt(0, 'cot').kind).toBe('undefined');
    const t = prose();
    expect(t).toMatch(/not defined/i);
    expect(t).toMatch(/zero is a value|Zero is a value|being zero is a value/i);
    // The infinity claim appears only inside a sentence that refutes it.
    for (const m of t.matchAll(/.{0,120}tan 90\u00b0 = \u221e.{0,160}/g)) {
      expect(m[0], 'an unrefuted infinity claim').toMatch(/what is wrong|not defined|a student writes/i);
    }
  });

  it('rejects dividing by zero and calling it infinity', () => {
    for (const t of [
      'tan 90 is infinity.',
      '1/0 is a very large number.',
      'Dividing by cos\u00b2A at 90 degrees gives the identity.',
      'Dividing by sin\u00b2A at 0 degrees gives the identity.',
    ]) expect(auditInvalidDivision([['x', t]]).length, t).toBe(1);
    for (const t of [
      'A student writes tan 90 is infinity, which is wrong.',
      'tan 90 is undefined, not infinity.',
      'You cannot divide by cos\u00b2A at 90 degrees.',
    ]) expect(auditInvalidDivision([['x', t]]), t).toEqual([]);
    for (const s of CLASS10_IDENTITY_SECTIONS) {
      expect(auditInvalidDivision(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });
});

describe('the acute-triangle model was not weakened', () => {
  it('keeps the boundary values outside rightTriangleRoles', () => {
    expect(basisAt(0)).toBe('motivated_by_limiting_argument');
    expect(basisAt(90)).toBe('motivated_by_limiting_argument');
    for (const d of ACUTE_STANDARD_ANGLES) expect(basisAt(d)).toBe('derived_from_triangle');
  });

  it('says in the lesson that no triangle exists at the boundary', () => {
    const t = C10_SECTION_8_3B.explanation.join(' ') + C10_SECTION_8_3B.summary;
    expect(t).toMatch(/no (?:such )?triangle|collapsed|cannot have a second right angle/i);
    expect(t).toMatch(/motivated|limiting/i);
    expect(t).toMatch(/not derived|rather than derived/i);
  });

  it('draws no figure at 0 or 90', () => {
    for (const s of CLASS10_IDENTITY_SECTIONS) {
      expect(Object.keys(s.visualsById).length).toBe(0);
    }
  });
});

describe('cross-chapter regression on the standard angles', () => {
  it('leaves STANDARD_ANGLE_RATIOS identical in shape and value', () => {
    expect(STANDARD_ANGLE_RATIOS.map((r) => r.degrees)).toEqual([30, 45, 60]);
    const expected = [
      { degrees: 30, sin: '1/2', cos: '\u221a3/2', tan: '1/\u221a3' },
      { degrees: 45, sin: '1/\u221a2', cos: '1/\u221a2', tan: '1' },
      { degrees: 60, sin: '\u221a3/2', cos: '1/2', tan: '\u221a3' },
    ];
    STANDARD_ANGLE_RATIOS.forEach((r, i) => {
      expect(r.sin.exact).toBe(expected[i].sin);
      expect(r.cos.exact).toBe(expected[i].cos);
      expect(r.tan.exact).toBe(expected[i].tan);
      expect(r.sin.value).toBeCloseTo(Math.sin((r.degrees * Math.PI) / 180), 12);
      expect(r.cos.value).toBeCloseTo(Math.cos((r.degrees * Math.PI) / 180), 12);
      expect(r.tan.value).toBeCloseTo(Math.tan((r.degrees * Math.PI) / 180), 12);
    });
  });

  it('agrees with the canonical table it is now derived from', () => {
    for (const r of STANDARD_ANGLE_RATIOS) {
      for (const n of ['sin', 'cos', 'tan'] as const) {
        expect(r[n].exact).toBe(writtenOf(ratioAt(r.degrees as Degrees, n)));
      }
    }
  });

  it('leaks no boundary value into the acute-only application chapter', () => {
    // Heights and Distances uses 30/45/60 only; none of its values is undefined.
    const t = CLASS10_HEIGHTS_DISTANCES_SECTIONS
      .flatMap((s) => [s.explanation.join(' '), s.summary]).join(' ');
    expect(t).not.toMatch(/not defined|undefined/i);
    expect(t).not.toMatch(/tan 90|sec 90|cot 0|cosec 0/i);
  });
});

describe('the Pythagorean identity is proved', () => {
  it('passes auditProofScope at each unit\u2019s recorded expectation', () => {
    expect(auditProofScope(C10_SECTION_8_3B, 'UNDERSTAND')).toEqual([]);
    expect(auditProofScope(C10_SECTION_8_4A, 'PROVE')).toEqual([]);
    expect(auditProofScope(C10_SECTION_8_4B, 'APPLY')).toEqual([]);
  });

  it('fails a PROVE unit that only states the identity', () => {
    const stated = {
      ...C10_SECTION_8_4A,
      learningGoal: 'You will use the identity sin squared A plus cos squared A equals 1.',
      explanation: ['The identity sin\u00b2A + cos\u00b2A = 1 holds for every acute angle A.'],
      summary: 'Remember that sin\u00b2A + cos\u00b2A = 1.',
      workedExamples: [],
    };
    expect(auditProofScope(stated as never, 'PROVE').length).toBeGreaterThan(0);
  });

  it('carries the full derivation chain', () => {
    const proof = C10_SECTION_8_4A.workedExamples[0];
    expect(proof.steps.length).toBeGreaterThanOrEqual(6);
    const t = [proof.prompt, ...proof.steps.map((x) => `${x.text} ${x.reasoning}`)].join(' ');
    expect(t).toMatch(/GIVEN/);
    expect(t).toMatch(/TO PROVE/);
    expect(t).toMatch(/Pythagorean theorem/i);
    expect(t).toMatch(/divide both sides.{0,40}h\u00b2|by h\u00b2/i);
    expect(t).toMatch(/h > 0|non-zero/i);
    expect(t).toMatch(/sin\u00b2A \+ cos\u00b2A = 1/);
  });

  it('derives both consequences with their denominator conditions', () => {
    const sec = C10_SECTION_8_4A.workedExamples[1];
    const cosec = C10_SECTION_8_4A.workedExamples[2];
    const st = sec.steps.map((x) => `${x.text} ${x.reasoning}`).join(' ');
    const ct = cosec.steps.map((x) => `${x.text} ${x.reasoning}`).join(' ');
    expect(st).toMatch(/divide every term by cos\u00b2A/i);
    expect(st).toMatch(/cos A \u2260 0/);
    expect(st).toMatch(/1 \+ tan\u00b2A = sec\u00b2A/);
    expect(ct).toMatch(/divide every term by sin\u00b2A/i);
    expect(ct).toMatch(/sin A \u2260 0/);
    expect(ct).toMatch(/1 \+ cot\u00b2A = cosec\u00b2A/);
  });

  it('separates the acute proof from the boundary verification', () => {
    const t = C10_SECTION_8_4A.explanation.join(' ');
    expect(t).toMatch(/acute/i);
    expect(t).toMatch(/verification at the ends|checked separately|not an extension/i);
  });

  it('distinguishes identity from equation and fixes the notation', () => {
    const t = prose();
    expect(t).toMatch(/sin\u00b2A means \(sin A\)\u00b2/);
    expect(t).toMatch(/does NOT mean sin\(A\u00b2\)|not.{0,20}sin\(A\u00b2\)/i);
    expect(t).toMatch(/every (?:value|angle) in its (?:valid )?range|true for EVERY/i);
  });
});

describe('identity applications — algebra, not examples', () => {
  it('holds numerically at the standard angles, as a sanity check only', () => {
    // These CATCH false identities; they do not prove true ones.
    const cases: Array<[string, (a: number) => number, (a: number) => number, Degrees[]]> = [
      ['(1 - cos^2)cosec^2 = 1', (a) => (1 - Math.cos(a) ** 2) / Math.sin(a) ** 2, () => 1, [0]],
      ['(sec+tan)(sec-tan) = 1', (a) => (1 / Math.cos(a) + Math.tan(a)) * (1 / Math.cos(a) - Math.tan(a)), () => 1, [90]],
      ['(1 + cot^2)sin^2 = 1', (a) => (1 + (Math.cos(a) / Math.sin(a)) ** 2) * Math.sin(a) ** 2, () => 1, [0]],
      ['tan*cos = sin', (a) => Math.tan(a) * Math.cos(a), (a) => Math.sin(a), [90]],
      ['(1 - sin^2)sec^2 = 1', (a) => (1 - Math.sin(a) ** 2) / Math.cos(a) ** 2, () => 1, [90]],
      ['cot*sin = cos', (a) => (Math.cos(a) / Math.sin(a)) * Math.sin(a), (a) => Math.cos(a), [0]],
    ];
    for (const [name, lhs, rhs, skip] of cases) {
      expect(identityHoldsAtStandardAngles(lhs, rhs, skip), name).toBe(true);
    }
    // A false identity is caught.
    expect(identityHoldsAtStandardAngles((a) => Math.sin(a), (a) => Math.cos(a))).toBe(false);
  });

  it('says plainly that angle checks are not a proof', () => {
    const t = prose();
    expect(t).toMatch(/not a proof|is evidence|never a proof/i);
    expect(t).toMatch(/disprove/i);
    for (const s of CLASS10_IDENTITY_SECTIONS) {
      expect(auditProofByExample(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });

  it('catches proof by example, and passes its correction', () => {
    expect(auditProofByExample([['x', 'Checking at 30, 45 and 60 gives 1 each time, so the identity is proved.']]).length).toBe(1);
    expect(auditProofByExample([['x', 'Checking at 30, 45 and 60 gives 1 each time, which is not a proof.']])).toEqual([]);
  });

  it('warns against cancelling across an addition', () => {
    const t = prose();
    expect(t).toMatch(/cancel/i);
    expect(t).toMatch(/1 \+ cot A/);
    expect(t).toMatch(/factor/i);
  });

  it('keeps to one-directional chains and simple identities', () => {
    const t = prose();
    expect(t).toMatch(/LHS|one side into the other|transforming one side/i);
    expect(t).not.toMatch(/compound angle|double angle|sin\(A \+ B\)|cos\(A \+ B\)/i);
    expect(t).not.toMatch(/unit circle|radian/i);
  });
});

describe('exact arithmetic', () => {
  it('simplifies radicals and divides exactly', () => {
    expect(formatExact(exact(1, 2, 3))).toBe('\u221a3/2');
    expect(formatExact(exact(2, 4))).toBe('1/2');
    expect(formatExact(exact(1, 2, 4))).toBe('1');
    expect(formatExact(exact(0, 1, 5))).toBe('0');
    const half = exact(1, 2);
    const rootThreeOverTwo = exact(1, 2, 3);
    expect(formatExact(divideExact(half, rootThreeOverTwo)!)).toBe('\u221a3/3');
    expect(exactValue(divideExact(half, rootThreeOverTwo)!)).toBeCloseTo(1 / Math.sqrt(3), 12);
    expect(divideExact(exact(1, 1), exact(0, 1))).toBeNull();
  });
});

describe('final Class 10 state and governance', () => {
  it('authors the last three lessons with correct Chapter 8 provenance', () => {
    expect(CLASS10_IDENTITY_SECTIONS.length).toBe(3);
    for (const s of CLASS10_IDENTITY_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch08');
      expect(['8.3', '8.4']).toContain(s.source.sectionNumber);
      expect([121, 128]).toContain(s.source.startPage);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_IDENTITY_SECTIONS) {
      const whole = blocks(s).map(([, t]) => t).join(' ').toLowerCase() + ' ' + s.nextStep.toLowerCase()
        + ' ' + s.vocabulary.map((v) => v.meaning).join(' ').toLowerCase();
      for (const v of s.vocabulary) {
        const head = v.term.toLowerCase().split(' ').slice(-1)[0];
        expect(whole.includes(v.term.toLowerCase()) || whole.includes(head), `${s.contentArtifactId}: ${v.term}`).toBe(true);
      }
      for (const w of s.workedExamples) {
        for (const step of w.steps) expect(step.reasoning.length, `${w.id}: ${step.text}`).toBeGreaterThan(40);
      }
      for (const [, t] of blocks(s)) {
        expect(t, s.contentArtifactId).not.toMatch(/TODO|TBD|placeholder|recheck/i);
        expect(t, s.contentArtifactId).not.toMatch(/\$\{/);
      }
    }
  });

  it('completes all sixty-five Class 10 lessons across fourteen chapters, all drafts', () => {
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    expect(c10.length).toBe(65);
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    expect(cat.chapters.length).toBe(14);
    expect(cat.lessonCount).toBe(65);
    const ch8 = cat.chapters.find((c) => c.number === 8)!;
    expect(ch8.lessons.length).toBe(7);
    for (const lesson of ch8.lessons.slice(4)) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the lifecycle at zero and the gate closed', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    expect(c10.filter((s) => s.reviewStatus !== 'authored_draft').length).toBe(0);
  });

  it('leaves the earlier waves and Class 9 unchanged', () => {
    expect(CLASS10_TRIGONOMETRY_SECTIONS.length).toBe(4);
    for (const w of [CLASS10_TRIGONOMETRY_SECTIONS, CLASS10_HEIGHTS_DISTANCES_SECTIONS,
      CLASS10_COORDINATE_SECTIONS, CLASS10_TANGENT_SECTIONS]) {
      for (const s of w) expect(s.contentArtifactVersion).toBe(1);
    }
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
