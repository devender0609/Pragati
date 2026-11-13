// ---------------------------------------------------------------------------
// v0.84.0-c10.10 checkpoint 64 — ARITHMETIC PROGRESSIONS.
//
// Two governing questions. Can Class 10 deepen APs without pretending
// students are seeing sequence structure for the first time? And does every
// displayed term, position and sum come from one consistent AP object?
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  term, firstTerms, consecutiveDifferences, isArithmetic, lastTerm, termFromEnd,
  positionOf, isTermOf, sum, sumWithLast, directSum, toNumber, formatRational,
  rational, validateArithmeticProgression, auditNoveltyClaims, ALREADY_IN_CLASS_9,
  type ArithmeticProgression,
} from '../arithmeticProgression';
import {
  CLASS10_AP_SECTIONS, CANONICAL_APS, CLASS_9_PRIOR,
  AP_UP, AP_DOWN, AP_FLAT, AP_FINITE, AP_SEATS, AP_SAVINGS,
} from '../apSections';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { CLASS10_TRIGONOMETRY_SECTIONS } from '../trigonometrySections';
import { CLASS10_COMPOSITE_SOLIDS_SECTIONS } from '../compositeSolidsSections';
import { CLASS10_SIMILARITY_SECTIONS } from '../similaritySections';
import { CLASS10_QUADRATIC_SECTIONS } from '../quadraticSections';
import { CLASS10_STATISTICS_SECTIONS } from '../statisticsSections';
import { CLASS10_LINEAR_SYSTEM_SECTIONS } from '../linearSystemSections';
import { CLASS10_HEIGHTS_DISTANCES_SECTIONS } from '../heightsDistancesSections';
import { CLASS10_REAL_NUMBERS_SECTIONS } from '../realNumbersSections';
import { CLASS10_POLYNOMIAL_SECTIONS } from '../polynomialSections';

const blocks = (s: (typeof CLASS10_AP_SECTIONS)[number]): Array<[string, string]> => [
  ['learningGoal', s.learningGoal],
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];
const prose = () => CLASS10_AP_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');

describe('progression fidelity — the central qualitative audit', () => {
  it('records what Class 9 already covered', () => {
    expect(CLASS_9_PRIOR.alreadyCovered.join(' ')).toMatch(/a \+ \(n \u2212 1\)d/);
    expect(CLASS_9_PRIOR.alreadyCovered.join(' ')).toMatch(/pairing sum/i);
    expect(CLASS_9_PRIOR.alreadyCovered.length).toBe(5);
    expect(CLASS_9_PRIOR.genuinelyNewInClass10.length).toBeGreaterThan(0);
    expect(ALREADY_IN_CLASS_9).toContain('nth term');
    expect(ALREADY_IN_CLASS_9).toContain('common difference');
  });

  it('claims no novelty for anything Class 9 already covered', () => {
    for (const s of CLASS10_AP_SECTIONS) {
      expect(auditNoveltyClaims(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });

  it('catches an overclaim, and allows honest framing', () => {
    const bad = [
      'You are meeting the common difference for the first time.',
      'You have never seen an nth term rule before.',
      'Arithmetic progressions begin in Class 10.',
      'This is your first sequence.',
    ];
    for (const t of bad) expect(auditNoveltyClaims([['x', t]]).length, t).toBe(1);
    const good = [
      'You already met the nth term in Class IX; Class 10 formalises it.',
      'Counting a term from the end of a finite AP is new here.',
      'Class 10 builds a systematic theory on what you derived earlier.',
      'A student says sequences begin in Class 10, which is wrong.',
    ];
    for (const t of good) expect(auditNoveltyClaims([['x', t]]), t).toEqual([]);
  });

  it('credits Class IX explicitly where it formalises', () => {
    const all = prose();
    expect(all).toMatch(/Class IX/);
    expect(all).toMatch(/formalis/i);
    expect(all).toMatch(/derived (?:a \+ )?\(?n|already (?:met|derived|named)/i);
  });
});

describe('common difference — signed, and every pair checked', () => {
  it('keeps d signed, never an absolute difference', () => {
    expect(AP_DOWN.d).toBe(-3);
    expect(consecutiveDifferences(firstTerms(AP_DOWN, 5))).toEqual([-3, -3, -3, -3]);
    // Reversing the list reverses the sign, so the two are distinguishable.
    const up = firstTerms(AP_DOWN, 4).slice().reverse();
    expect(consecutiveDifferences(up)).toEqual([3, 3, 3]);
    expect(prose()).toMatch(/d = \u22123|\u2212 ?3\b/);
    expect(prose()).toMatch(/not 3\b/);
  });

  it('accepts d = 0 as an AP', () => {
    expect(validateArithmeticProgression(AP_FLAT)).toEqual([]);
    expect(firstTerms(AP_FLAT, 4)).toEqual([5, 5, 5, 5]);
    expect(isArithmetic([5, 5, 5, 5])).toBe(true);
    expect(prose()).toMatch(/d = 0/);
  });

  it('requires every consecutive difference, not just the first', () => {
    expect(isArithmetic([2, 5, 8, 12])).toBe(false);
    expect(consecutiveDifferences([2, 5, 8, 12])).toEqual([3, 3, 4]);
    expect(isArithmetic([1, 4, 9, 16])).toBe(false);
    expect(isArithmetic([3, 7, 11, 14])).toBe(false);
  });
});

describe('nth term — the off-by-one invariant', () => {
  it('returns exactly a at n = 1, for every canonical AP', () => {
    for (const ap of CANONICAL_APS) {
      expect(term(ap, 1), ap.id).toBe(ap.a);
      // a + nd would give a + d, which must differ wherever d is non-zero.
      if (ap.d !== 0) expect(ap.a + 1 * ap.d).not.toBe(term(ap, 1));
    }
  });

  it('matches the terms generated by repeated addition', () => {
    for (const ap of CANONICAL_APS) {
      let running = ap.a;
      for (let n = 1; n <= 8; n += 1) {
        expect(term(ap, n), `${ap.id} at ${n}`).toBe(running);
        running += ap.d;
      }
    }
  });

  it('recomputes every authored term claim', () => {
    expect(term(AP_UP, 10)).toBe(32);
    expect(term(AP_UP, 25)).toBe(77);
    expect(term(AP_DOWN, 15)).toBe(-32);
    expect(term(AP_SEATS, 20)).toBe(56);
    expect(term(AP_SAVINGS, 12)).toBe(350);
    expect(term({ id: 'x', a: 4, d: 6 }, 17)).toBe(100);
    expect(term({ id: 'y', a: 7, d: 4 }, 20)).toBe(83);
  });

  it('refuses a non-integer or non-positive position', () => {
    expect(() => term(AP_UP, 0)).toThrow(/not a term position/);
    expect(() => term(AP_UP, 2.5)).toThrow(/not a term position/);
    expect(() => term(AP_UP, -3)).toThrow(/not a term position/);
  });

  it('rejects an AP whose generated terms contradict d', () => {
    const broken = { ...AP_UP, a: 5 } as ArithmeticProgression;
    expect(validateArithmeticProgression(broken)).toEqual([]);
    expect(validateArithmeticProgression({ id: 'f', a: 1.5, d: 2 }).join(' ')).toMatch(/first term must be an integer/);
  });
});

describe('membership — exact positions, never rounded', () => {
  it('accepts only a whole-number position at least 1', () => {
    expect(formatRational(positionOf(AP_UP, 74)!)).toBe('24');
    expect(isTermOf(AP_UP, 74)).toBe(true);
    expect(formatRational(positionOf(AP_UP, 73)!)).toBe('71/3');
    expect(isTermOf(AP_UP, 73)).toBe(false);
    expect(formatRational(positionOf(AP_UP, 100)!)).toBe('98/3');
    expect(isTermOf(AP_UP, 100)).toBe(false);
  });

  it('does not round a fractional position into a term', () => {
    const n = positionOf(AP_UP, 73)!;
    expect(n.den).not.toBe(1);
    // The rounded position names a DIFFERENT value, which is the point.
    expect(term(AP_UP, Math.round(toNumber(n)))).toBe(74);
    expect(term(AP_UP, Math.round(toNumber(n)))).not.toBe(73);
    // A 13/2 position is not a term under any tolerance.
    const half = { id: 'h', a: 1, d: 2 } as ArithmeticProgression;
    expect(formatRational(positionOf(half, 12)!)).toBe('13/2');
    expect(isTermOf(half, 12)).toBe(false);
  });

  it('rejects a value sitting before the first term', () => {
    expect(formatRational(positionOf(AP_UP, 2)!)).toBe('0');
    expect(isTermOf(AP_UP, 2)).toBe(false);
    expect(isTermOf(AP_UP, -100)).toBe(false);
  });

  it('respects the length of a finite AP', () => {
    expect(isTermOf(AP_FINITE, lastTerm(AP_FINITE)!)).toBe(true);
    // The next term in the pattern lies beyond the stated length.
    expect(isTermOf(AP_FINITE, lastTerm(AP_FINITE)! + AP_FINITE.d)).toBe(false);
  });

  it('handles a constant AP without dividing by zero', () => {
    expect(isTermOf(AP_FLAT, 5)).toBe(true);
    expect(isTermOf(AP_FLAT, 6)).toBe(false);
  });
});

describe('terms from the end of a finite AP', () => {
  it('makes the 1st from the end the last term', () => {
    expect(termFromEnd(AP_FINITE, 1)).toBe(lastTerm(AP_FINITE));
    expect(lastTerm(AP_FINITE)).toBe(51);
    expect(lastTerm(AP_SEATS)).toBe(56);
  });

  it('recomputes the authored from-the-end claims', () => {
    expect(termFromEnd(AP_FINITE, 3)).toBe(43);
    expect(termFromEnd(AP_FINITE, 2)).toBe(47);
    // Position arithmetic: length - k + 1.
    expect(termFromEnd({ id: 'z', a: 1, d: 1, length: 30 }, 5)).toBe(26);
  });

  it('returns nothing for an endless AP', () => {
    expect(termFromEnd(AP_UP, 3)).toBeNull();
    expect(lastTerm(AP_UP)).toBeNull();
  });
});

describe('sums — two forms, and direct reconciliation', () => {
  it('agrees with direct addition on every canonical AP', () => {
    for (const ap of CANONICAL_APS) {
      for (const n of [1, 2, 5, 10]) {
        if (ap.length !== undefined && n > ap.length) continue;
        expect(toNumber(sum(ap, n)), `${ap.id} S${n}`).toBe(directSum(ap, n));
      }
    }
  });

  it('makes the two formulas agree wherever both apply', () => {
    for (const ap of CANONICAL_APS.filter((x) => x.length !== undefined)) {
      for (let n = 1; n <= ap.length!; n += 1) {
        const l = term(ap, n);
        expect(toNumber(sumWithLast(ap.a, l, n)), `${ap.id} at ${n}`).toBe(toNumber(sum(ap, n)));
      }
    }
  });

  it('works for odd n exactly as for even n', () => {
    for (const n of [1, 3, 5, 7, 9, 11]) {
      expect(toNumber(sum(AP_UP, n))).toBe(directSum(AP_UP, n));
      expect(toNumber(sum(AP_DOWN, n))).toBe(directSum(AP_DOWN, n));
    }
    // And the lesson says why: rows, not pairs.
    expect(prose()).toMatch(/two rows|column by column/i);
    expect(prose()).toMatch(/odd/i);
  });

  it('recomputes every authored sum', () => {
    expect(formatRational(sum(AP_UP, 10))).toBe('185');
    expect(formatRational(sum(AP_DOWN, 15))).toBe('-165');
    expect(formatRational(sum(AP_FINITE, 12))).toBe('348');
    expect(formatRational(sum(AP_SEATS, 20))).toBe('740');
    expect(formatRational(sum(AP_SEATS, 5))).toBe('110');
    expect(formatRational(sum(AP_SAVINGS, 12))).toBe('7500');
    expect(toNumber(sumWithLast(3, 60, 20))).toBe(630);
    expect(toNumber(sum({ id: 'w', a: 200, d: 25 }, 10))).toBe(3125);
    expect(toNumber(sum({ id: 'v', a: 2, d: 5 }, 6))).toBe(87);
  });

  it('satisfies aN = SN - S(N-1) where used in reasoning', () => {
    for (const ap of [AP_UP, AP_DOWN, AP_SEATS, AP_SAVINGS]) {
      for (let n = 2; n <= 8; n += 1) {
        expect(toNumber(sum(ap, n)) - toNumber(sum(ap, n - 1)), `${ap.id} at ${n}`).toBe(term(ap, n));
      }
    }
  });

  it('refuses to sum a non-positive or fractional number of terms', () => {
    expect(() => sum(AP_UP, 0)).toThrow(/cannot sum/);
    expect(() => sum(AP_UP, 3.5)).toThrow(/cannot sum/);
  });

  it('keeps halves exact rather than floating', () => {
    // n odd with an odd bracket leaves a genuine half before simplification.
    const r = sum({ id: 'q', a: 1, d: 1 }, 3);
    expect(r.den).toBe(1);
    expect(r.num).toBe(6);
    expect(formatRational(rational(15 * -22, 2))).toBe('-165');
  });
});

describe('term versus cumulative total', () => {
  it('gives different answers on the same AP, and both are authored', () => {
    expect(term(AP_SEATS, 20)).toBe(56);
    expect(toNumber(sum(AP_SEATS, 20))).toBe(740);
    expect(term(AP_SEATS, 20)).not.toBe(toNumber(sum(AP_SEATS, 20)));
    const all = prose();
    expect(all).toMatch(/56/);
    expect(all).toMatch(/740/);
  });

  it('teaches how to tell the questions apart', () => {
    const all = prose();
    expect(all).toMatch(/one stage|single row|ONE row/i);
    expect(all).toMatch(/altogether|in total|cumulative/i);
  });

  it('includes a decreasing context whose terms stay meaningful', () => {
    expect(AP_SAVINGS.d).toBeLessThan(0);
    for (let n = 1; n <= AP_SAVINGS.length!; n += 1) expect(term(AP_SAVINGS, n)).toBeGreaterThan(0);
    expect(prose()).toMatch(/negative|falls|less each/i);
  });

  it('separates the endless rule from the finite range', () => {
    expect(prose()).toMatch(/dots describe the (?:rule|pattern)|rule continues/i);
  });

  it('introduces no geometric progression', () => {
    expect(prose()).not.toMatch(/geometric progression|common ratio/i);
    expect(prose()).not.toMatch(/arithmetic mean|insert.{0,20}terms between/i);
  });
});

describe('lesson quality and governance', () => {
  it('authors five lessons with correct Chapter 5 provenance', () => {
    expect(CLASS10_AP_SECTIONS.length).toBe(5);
    for (const s of CLASS10_AP_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch05');
      expect(['5.2', '5.3', '5.4']).toContain(s.source.sectionNumber);
      expect([51, 56, 63]).toContain(s.source.startPage);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_AP_SECTIONS) {
      const whole = blocks(s).map(([, t]) => t).join(' ').toLowerCase() + ' ' + s.nextStep.toLowerCase()
        + ' ' + s.vocabulary.map((v) => v.meaning).join(' ').toLowerCase();
      for (const v of s.vocabulary) {
        const head = v.term.toLowerCase().split(' ').slice(-1)[0];
        expect(whole.includes(v.term.toLowerCase()) || whole.includes(head), `${s.contentArtifactId}: ${v.term}`).toBe(true);
      }
      for (const w of s.workedExamples) {
        for (const step of w.steps) expect(step.reasoning.length, `${w.id}: ${step.text}`).toBeGreaterThan(40);
      }
      for (const t of [...s.explanation, s.summary]) expect(t).not.toMatch(/TODO|TBD|placeholder|recheck/i);
    }
  });

  it('keeps its five lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.11 checkpoint 65 — Chapter 14 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const ch5 = cat.chapters.find((c) => c.number === 5)!;
    expect(ch5.lessons.length).toBe(5);
    for (const lesson of ch5.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the nine earlier waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    const waves = [CLASS10_TRIGONOMETRY_SECTIONS, CLASS10_COMPOSITE_SOLIDS_SECTIONS,
      CLASS10_SIMILARITY_SECTIONS, CLASS10_QUADRATIC_SECTIONS, CLASS10_STATISTICS_SECTIONS,
      CLASS10_LINEAR_SYSTEM_SECTIONS, CLASS10_HEIGHTS_DISTANCES_SECTIONS,
      CLASS10_REAL_NUMBERS_SECTIONS, CLASS10_POLYNOMIAL_SECTIONS];
    expect(waves.map((w) => w.length)).toEqual([4, 3, 6, 4, 8, 5, 3, 4, 4]);
    for (const w of waves) for (const s of w) expect(s.contentArtifactVersion).toBe(1);
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
