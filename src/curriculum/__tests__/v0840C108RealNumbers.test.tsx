// ---------------------------------------------------------------------------
// v0.84.0-c10.8 checkpoint 62 — REAL NUMBERS.
//
// The governing question: can Pragati distinguish what the current textbook
// still SAYS from what the current curriculum REQUIRES, so stale
// rationalisation residue cannot become student instruction?
//
// The rationalisation-leak audit is the central guard. The number-theory
// tests exist because a composite masquerading as a prime factor looks
// exactly like a real one.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  isPrime, primeFactorise, productOf, validateFactorisation, formatFactorisation,
  hcfByFactorisation, lcmByFactorisation, productRelationHolds,
  auditRationalisationLeak, auditRealNumbersScope,
} from '../numberTheory';
import {
  CLASS10_REAL_NUMBERS_SECTIONS, SECTION_1_1_DISPOSITION,
  PAIR_HCF_LCM, PAIR_CONTEXT,
  C10_SECTION_1_2A, C10_SECTION_1_3A, C10_SECTION_1_3B,
} from '../realNumbersSections';
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

const EXPECTATION: Record<string, Parameters<typeof auditRealNumbersScope>[1]> = {
  ncert_jemh1_s1_2_fta_lesson: 'STATE_WITHOUT_PROOF',
  ncert_jemh1_s1_2_hcf_lcm_lesson: 'APPLY',
  ncert_jemh1_s1_3_root2_proof_lesson: 'PROVE',
  ncert_jemh1_s1_3_more_irrationals_lesson: 'PROVE',
};

const blocks = (s: (typeof CLASS10_REAL_NUMBERS_SECTIONS)[number]): Array<[string, string]> => [
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];

describe('the rationalisation guard — the central test', () => {
  it('finds no removed Euclid-algorithm content in any lesson', () => {
    for (const s of CLASS10_REAL_NUMBERS_SECTIONS) {
      expect(auditRationalisationLeak(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });

  it('flags instruction but passes a governance note', () => {
    // Negative fixtures: these must fire.
    for (const bad of [
      'Use Euclid\u2019s division algorithm to find the HCF of 96 and 404.',
      'Divide, take the remainder, and repeat until the remainder is zero.',
      'You will learn the division algorithm for positive integers.',
    ]) {
      expect(auditRationalisationLeak([['x', bad]]).length, bad).toBe(1);
    }
    // Positive fixtures: these must not.
    for (const good of [
      'The textbook introduction still mentions Euclid\u2019s division algorithm, but that material was removed by rationalisation.',
      'Euclid\u2019s division algorithm is not part of the current scope and is not taught here.',
      'Use prime factorisation to find the HCF of 96 and 404.',
    ]) {
      expect(auditRationalisationLeak([['x', good]]), good).toEqual([]);
    }
  });

  it('keeps the source discrepancy recorded rather than erased', () => {
    expect(SECTION_1_1_DISPOSITION.sectionNumber).toBe('1.1');
    expect(SECTION_1_1_DISPOSITION.role).toBe('REVIEW');
    expect(SECTION_1_1_DISPOSITION.warrantsUnit).toBe(false);
    // The note names the removed topic AND says it is removed.
    expect(SECTION_1_1_DISPOSITION.note).toMatch(/Euclid/);
    expect(SECTION_1_1_DISPOSITION.note).toMatch(/removed|rationalisation/i);
    // And the note itself is not mistaken for instruction.
    expect(auditRationalisationLeak([['disposition', SECTION_1_1_DISPOSITION.note]])).toEqual([]);
  });

  it('finds HCF by prime factorisation, never by repeated division', () => {
    const prose = CLASS10_REAL_NUMBERS_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/prime factorisation/i);
    expect(prose).toMatch(/minimum|smaller exponent|MINIMUM/);
    // No unit of this wave has a standalone §1.1 lesson.
    expect(CLASS10_REAL_NUMBERS_SECTIONS.every((s) => s.source.sectionNumber !== '1.1')).toBe(true);
  });
});

describe('proof scope', () => {
  it('holds every lesson to its canonical expectation', () => {
    for (const s of CLASS10_REAL_NUMBERS_SECTIONS) {
      expect(auditRealNumbersScope(s, EXPECTATION[s.contentArtifactId]), s.contentArtifactId).toEqual([]);
    }
  });

  it('does not prove the Fundamental Theorem, and says so', () => {
    const prose = [C10_SECTION_1_2A.learningGoal, ...C10_SECTION_1_2A.explanation].join(' ');
    expect(prose).toMatch(/without proving|uses the theorem/i);
    // A leak would be caught.
    const leaked = { ...C10_SECTION_1_2A, explanation: [...C10_SECTION_1_2A.explanation, 'We now prove the Fundamental Theorem of Arithmetic.'] };
    expect(auditRealNumbersScope(leaked, 'STATE_WITHOUT_PROOF').length).toBeGreaterThan(0);
  });

  it('holds the irrationality units to a real proof', () => {
    for (const s of [C10_SECTION_1_3A, C10_SECTION_1_3B]) {
      const whole = blocks(s).map(([, t]) => t).join(' ');
      for (const probe of [/suppose|assume/i, /lowest terms/i, /divides/i, /contradict/i]) {
        expect(whole, `${s.contentArtifactId} ${probe}`).toMatch(probe);
      }
    }
    // A proof stripped of its lowest-terms condition must fail.
    const w0 = C10_SECTION_1_3A.workedExamples[0];
    const stripped = {
      ...C10_SECTION_1_3A,
      workedExamples: [{
        ...w0,
        steps: w0.steps.map((x) => ({
          ...x,
          text: x.text.replace(/, and the fraction in lowest terms/, '').replace(/, contradicting that they share no common factor other than 1/, ''),
          reasoning: x.reasoning.replace(/lowest terms/gi, 'that form').replace(/no common factor/gi, 'nothing'),
        })),
      }],
    };
    expect(auditRealNumbersScope(stripped, 'PROVE').map((f) => f.reason).join(' ')).toMatch(/lowest-terms/);
    // And one downgraded to observation.
    const downgraded = { ...C10_SECTION_1_3A, explanation: ['\u221a2 is clearly irrational.'] };
    expect(auditRealNumbersScope(downgraded, 'PROVE').map((f) => f.reason).join(' ')).toMatch(/observation|never/);
  });

  it('keeps general \u221ap as background, not a required task', () => {
    const whole = blocks(C10_SECTION_1_3B).map(([, t]) => t).join(' ');
    expect(whole).toMatch(/not (?:something you are )?required|not a required proof task/i);
    // No practice item asks for a proof for arbitrary p.
    for (const p of C10_SECTION_1_3B.independentPractice) {
      expect(p.prompt).not.toMatch(/prove.{0,30}\bfor (?:every|any|all) prime/i);
    }
  });

  it('does not claim irrational numbers or contradiction are new', () => {
    const whole = CLASS10_REAL_NUMBERS_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(whole).not.toMatch(/first (?:time you )?meet irrational/i);
    expect(whole).not.toMatch(/your first proof/i);
    // And the deepening is stated.
    expect(whole).toMatch(/Class IX/);
    expect(whole).toMatch(/not new|deepen|already met|have used/i);
  });
});

describe('exact integer fidelity', () => {
  it('recognises primes and rejects composites', () => {
    for (const p of [2, 3, 5, 7, 11, 101]) expect(isPrime(p), String(p)).toBe(true);
    for (const c of [1, 4, 6, 9, 15, 91, 100]) expect(isPrime(c), String(c)).toBe(false);
  });

  it('factorises and multiplies back', () => {
    for (const n of [96, 404, 60, 540, 90, 1260, 84, 300, 336, 54, 510, 92]) {
      const f = primeFactorise(n);
      expect(productOf(f), String(n)).toBe(n);
      for (const p of f) expect(isPrime(p.prime), `${p.prime} in ${n}`).toBe(true);
      expect(validateFactorisation(n, f), String(n)).toEqual([]);
    }
    expect(formatFactorisation(primeFactorise(96))).toBe('2^5 \u00d7 3');
    expect(formatFactorisation(primeFactorise(404))).toBe('2^2 \u00d7 101');
  });

  it('rejects a composite masquerading as a prime factor', () => {
    expect(validateFactorisation(60, [{ prime: 4, exponent: 1 }, { prime: 15, exponent: 1 }]).join(' '))
      .toMatch(/composite/);
    // A wrong exponent, which multiplies to the wrong number.
    expect(validateFactorisation(72, [{ prime: 2, exponent: 2 }, { prime: 3, exponent: 2 }]).join(' '))
      .toMatch(/multiply to 36, not 72/);
    // An uncollected repeat.
    expect(validateFactorisation(12, [{ prime: 2, exponent: 1 }, { prime: 2, exponent: 1 }, { prime: 3, exponent: 1 }]).join(' '))
      .toMatch(/more than once/);
  });

  it('recomputes every HCF and LCM the lessons state', () => {
    const cases: Array<[number, number, number, number]> = [
      [PAIR_HCF_LCM.a, PAIR_HCF_LCM.b, 4, 9696],
      [PAIR_CONTEXT.a, PAIR_CONTEXT.b, 6, 3024],
      [6, 20, 2, 60],
      [510, 92, 2, 23460],
      [12, 18, 6, 36],
    ];
    for (const [a, b, hcf, lcm] of cases) {
      expect(hcfByFactorisation(a, b), `HCF ${a},${b}`).toBe(hcf);
      expect(lcmByFactorisation(a, b), `LCM ${a},${b}`).toBe(lcm);
      expect(productRelationHolds(a, b), `relation ${a},${b}`).toBe(true);
      expect(hcf * lcm).toBe(a * b);
    }
    // The ribbon example divides exactly.
    expect(PAIR_CONTEXT.a % 6).toBe(0);
    expect(PAIR_CONTEXT.b % 6).toBe(0);
    expect(PAIR_CONTEXT.a / 6 + PAIR_CONTEXT.b / 6).toBe(65);
    // And i2: 12 x 180 / 36.
    expect((12 * 180) / 36).toBe(60);
  });

  it('confirms the product relation fails for three numbers', () => {
    const [a, b, c] = [4, 6, 15];
    const hcf = hcfByFactorisation(hcfByFactorisation(a, b), c);
    const lcm = lcmByFactorisation(lcmByFactorisation(a, b), c);
    expect(hcf).toBe(1);
    expect(lcm).toBe(60);
    expect(hcf * lcm).not.toBe(a * b * c);
    expect(a * b * c).toBe(360);
  });

  it('uses no floating point in any divisibility claim', () => {
    // Every exported number-theory result is an integer.
    for (const n of [96, 404, 336, 54]) expect(Number.isInteger(productOf(primeFactorise(n)))).toBe(true);
    expect(Number.isInteger(hcfByFactorisation(96, 404))).toBe(true);
    expect(Number.isInteger(lcmByFactorisation(96, 404))).toBe(true);
  });
});

describe('content hygiene and governance', () => {
  it('authors four lessons with correct Chapter 1 provenance', () => {
    expect(CLASS10_REAL_NUMBERS_SECTIONS.length).toBe(4);
    for (const s of CLASS10_REAL_NUMBERS_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch01');
      expect(['1.2', '1.3']).toContain(s.source.sectionNumber);
      expect([2, 6]).toContain(s.source.startPage);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_REAL_NUMBERS_SECTIONS) {
      const whole = blocks(s).map(([, t]) => t).join(' ').toLowerCase() + ' ' + s.nextStep.toLowerCase();
      for (const v of s.vocabulary) {
        const head = v.term.toLowerCase().split(' ').slice(-1)[0];
        expect(whole.includes(v.term.toLowerCase()) || whole.includes(head), `${s.contentArtifactId}: ${v.term}`).toBe(true);
      }
      for (const w of s.workedExamples) {
        for (const step of w.steps) expect(step.reasoning.length, w.id).toBeGreaterThan(40);
      }
      for (const t of [...s.explanation, s.summary]) expect(t).not.toMatch(/TODO|TBD|placeholder|recheck/i);
    }
  });

  it('keeps its four lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.9 checkpoint 63 — Chapter 2 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const chapter1 = cat.chapters.find((c) => c.number === 1)!;
    expect(chapter1.lessons.length).toBe(4);
    for (const lesson of chapter1.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the seven earlier waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    const waves = [CLASS10_TRIGONOMETRY_SECTIONS, CLASS10_COMPOSITE_SOLIDS_SECTIONS,
      CLASS10_SIMILARITY_SECTIONS, CLASS10_QUADRATIC_SECTIONS, CLASS10_STATISTICS_SECTIONS,
      CLASS10_LINEAR_SYSTEM_SECTIONS, CLASS10_HEIGHTS_DISTANCES_SECTIONS];
    expect(waves.map((w) => w.length)).toEqual([4, 3, 6, 4, 8, 5, 3]);
    for (const w of waves) for (const s of w) expect(s.contentArtifactVersion).toBe(1);
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
