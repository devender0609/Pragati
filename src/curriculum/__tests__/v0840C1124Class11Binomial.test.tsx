/**
 * v0.84.0-c11.24 checkpoint 89 — Chapter 7 §7.2, the binomial theorem.
 *
 * The question is composition: are the coefficients the SAME objects as the
 * combinations authored at checkpoint 88, and is the proof the SAME model
 * authored at 87 — or has either been quietly re-implemented?
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  adjacentCoefficientsCombine, coefficientRows, describeExpansion, expand,
  expandByMultiplication, termAt, validateCoefficientRows, validateExpansion,
} from '../binomial';
import {
  C11_BIN_SECTIONS, E3, E4, P_BINOMIAL, V_COEFFICIENT_ROWS, V_PROOF_BINOMIAL,
} from '../binomialClass11Sections';
import { combinations, isCount } from '../counting';
import { validateInductionProof } from '../induction';
import { validateVisual } from '../visualSpecification';
import { AUTHORED_CHAPTERS } from '../authoredSections';
import { authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

const v = (n: number, r: number): bigint => {
  const c = combinations(n, r);
  if (!isCount(c)) throw new Error('no count');
  return c.value;
};

describe('the coefficients ARE the combinations, not a copy of them', () => {
  it('reads every coefficient from the combination model', () => {
    for (let n = 0; n <= 12; n += 1) {
      const e = expand(`e${n}`, n);
      expect(e.terms).toHaveLength(n + 1);
      e.terms.forEach((t, r) => {
        expect(isCount(t.coefficient), `${n}C${r}`).toBe(true);
        if (isCount(t.coefficient)) expect(t.coefficient.value).toBe(v(n, r));
      });
    }
  });

  it('matches an expansion done by repeated multiplication, with no nCr in it', () => {
    // The independent oracle: the theorem must not verify itself.
    for (let n = 1; n <= 8; n += 1) {
      const oracle = expandByMultiplication(n);
      const fromModel = expand(`e${n}`, n).terms.map((t) => (isCount(t.coefficient) ? t.coefficient.value : -1n));
      expect(fromModel, `index ${n}`).toEqual(oracle);
    }
  });

  it('keeps large coefficients exact', () => {
    expect(v(30, 15)).toBe(155117520n);
    expect(v(40, 20)).toBe(137846528820n);
    const rows = coefficientRows('big', 25, 'a description long enough to serve as a real accessible name here');
    expect(validateCoefficientRows(rows)).toEqual([]);
    expect(rows.rows[25].entries[12]).toBe('5200300');
    expect(JSON.stringify(rows)).toContain('5200300');
  });
});

describe('the exponent invariant', () => {
  it('holds for every term of every expansion', () => {
    for (let n = 0; n <= 10; n += 1) {
      for (const t of expand(`e${n}`, n).terms) {
        expect(t.firstPower + t.secondPower, `${n} term ${t.index}`).toBe(n);
      }
    }
  });

  it('rejects a term whose exponents do not sum to n', () => {
    const bad = expand('bad', 3);
    (bad.terms[1] as { secondPower: number }).secondPower = 2;
    expect(validateExpansion(bad)).toContain('the exponents in term 1 add to 4, not 3');
  });

  it('rejects a wrong coefficient that otherwise looks plausible', () => {
    const bad = expand('bad', 3);
    (bad.terms[2] as { coefficient: unknown }).coefficient = { kind: 'count', value: 9n };
    expect(validateExpansion(bad)).toContain('term 2 does not carry 3C2');
  });

  it('rejects correct coefficients placed in the wrong order', () => {
    // Every coefficient is right; only the order is wrong. 1,4,6,4,1 is
    // symmetric, so a symmetric case would hide this — use an asymmetric one.
    const bad = expand('bad', 5);
    bad.terms.reverse();
    expect(validateExpansion(bad).length).toBeGreaterThan(0);
  });

  it('rejects an index that is not a positive integer', () => {
    expect(() => expand('bad', -2)).toThrow(/positive integral index/);
    expect(() => expand('bad', 2.5)).toThrow(/positive integral index/);
  });

  it('gives the endpoint coefficients through the general model, with no special case', () => {
    for (let n = 1; n <= 10; n += 1) {
      expect(v(n, 0)).toBe(1n);
      expect(v(n, n)).toBe(1n);
    }
  });
});

describe('the identity the inductive step turns on', () => {
  it('holds across the range, checked against the combination model', () => {
    for (let k = 1; k <= 15; k += 1) {
      for (let r = 1; r <= k; r += 1) {
        expect(adjacentCoefficientsCombine(k, r).holds, `${k},${r}`).toBe(true);
      }
    }
    expect(adjacentCoefficientsCombine(4, 2)).toEqual({ holds: true, left: '6 + 4', right: '10' });
  });

  it('is derived rather than hard-coded, so it tracks the combination model', () => {
    expect(v(4, 2) + v(4, 1)).toBe(v(5, 2));
  });
});

describe('the proof REUSES the induction model', () => {
  it('is an InductionProof, validated by the shared validator', () => {
    expect(validateInductionProof(P_BINOMIAL)).toEqual([]);
    expect(P_BINOMIAL.hypothesis.assumesAbout).toBe('k');
    expect(P_BINOMIAL.hypothesis.conditional).toBe(true);
    expect(P_BINOMIAL.inductiveStep.startsFrom).toBe('k');
    expect(P_BINOMIAL.inductiveStep.arrivesAt).toBe('k+1');
    expect(P_BINOMIAL.conclusion.restsOn).toEqual(['base_case', 'inductive_step']);
  });

  it('shows the base case by actual substitution, not by assertion', () => {
    const base = P_BINOMIAL.baseCase;
    expect(base.at).toBe(1);
    expect(base.steps.length).toBeGreaterThanOrEqual(3);
    const prose = base.steps.map((s) => `${s.statement} ${s.justification}`).join(' ');
    expect(prose).toMatch(/a \+ b/);
    expect(prose).not.toMatch(/this is true|obviously|clearly true/i);
  });

  it('reaches k + 1 through the coefficient identity rather than jumping', () => {
    const steps = P_BINOMIAL.inductiveStep.steps;
    expect(steps.length).toBeGreaterThanOrEqual(5);
    const prose = steps.map((s) => `${s.statement} ${s.justification}`).join(' ');
    expect(prose).toMatch(/kCr \+ kC\(r−1\) = \(k\+1\)Cr/);
    // The hypothesis is used, and used once.
    expect(prose).toMatch(/hypothesis/);
    // No step is its own reason.
    for (const s of steps) expect(s.justification.trim()).not.toBe(s.statement.trim());
  });

  it('does NOT introduce a binomial-specific proof type', () => {
    const src = require('node:fs').readFileSync(
      require('node:path').join(__dirname, '../binomial.ts'), 'utf8'
    ) as string;
    // Declarations only — the header comment names BinomialProofSpec to say
    // it deliberately does not exist, which the old regex read as a hit.
    expect(src).not.toMatch(/export type Binomial\w*Proof|export function validateBinomial\w*Proof/);
    // Nor a second combinations engine: the coefficients are imported.
    expect(src).toMatch(/from '\.\/counting'/);
    expect(src).not.toMatch(/function (factorial|combinations)\b/);
  });

  it('would catch a hypothesis written for k + 1', () => {
    const bad = { ...P_BINOMIAL, hypothesis: { ...P_BINOMIAL.hypothesis, assumesAbout: 'k+1' as 'k' } };
    expect(validateInductionProof(bad).length).toBeGreaterThan(0);
  });

  it('would catch a proof with no inductive step', () => {
    const bad = { ...P_BINOMIAL, inductiveStep: { ...P_BINOMIAL.inductiveStep, steps: [] } };
    expect(validateInductionProof(bad).length).toBeGreaterThan(0);
  });

  it('would catch a conclusion resting on the base case alone', () => {
    const bad = { ...P_BINOMIAL, conclusion: { ...P_BINOMIAL.conclusion, restsOn: ['base_case' as const] } };
    expect(validateInductionProof(bad).length).toBeGreaterThan(0);
  });
});

describe('the lesson', () => {
  const lesson = C11_BIN_SECTIONS[0];

  it('is authored once, at version 1, from §7.2', () => {
    expect(C11_BIN_SECTIONS).toHaveLength(1);
    expect(lesson.source.sectionNumber).toBe('7.2');
    expect(lesson.source.officialSectionId).toBe('ncert_kemh1_s7_2');
    expect(lesson.contentArtifactVersion).toBe(1);
    expect(lesson.reviewStatus).toBe('authored_draft');
  });

  it('invents no Pascal section and no fake subsection', () => {
    const ids = AUTHORED_CHAPTERS.flatMap((c) => c.sections())
      .map((s) => s.source.officialSectionId)
      .filter((i) => i.startsWith('ncert_kemh1_'));
    // Checkpoint 73 retracted the false "§7.3 Pascal's Triangle" finding:
    // it was a figure, not a section. Class 11 ids only — other grades have
    // their own section 7.3.
    expect(ids.some((i) => /s7_3/.test(i))).toBe(false);
    expect((lesson.source as { officialSubsectionNumber?: string }).officialSubsectionNumber).toBeUndefined();
  });

  it('stays inside the source scope for the index', () => {
    const prose = [...lesson.explanation, lesson.summary, lesson.learningGoal].join(' ').toLowerCase();
    expect(prose).not.toMatch(/negative index|fractional index|infinite series/);
    expect(prose).toMatch(/positive integral index/);
  });

  it('says the coefficient counts something, not merely what it equals', () => {
    const prose = [...lesson.explanation, ...lesson.workedExamples.flatMap((w) => w.steps.map((s) => `${s.text} ${s.reasoning}`))].join(' ');
    expect(prose).toMatch(/number of ways|counts|choosing/i);
  });

  it('registers Chapter 7 in canonical order without inventing 5 or 11', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    expect(c.chapters.map((x) => x.number)).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14]);
    expect(c.chapters.reduce((n, x) => n + x.lessonCount, 0)).toBe(80);
    expect(c.prerequisiteLessons).toHaveLength(1);
    expect(c.lessonCount).toBe(81);
    // v0.84.0-c11.28 checkpoint 91 — Chapter 8 is AUTHORED now, so it is no
    // longer in the absent list; 5 and 11 have no authored content and stay.
    expect(c.chapters.some((x) => x.number === 8)).toBe(true);
    for (const absent of [5, 11]) expect(c.chapters.some((x) => x.number === absent)).toBe(false);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps both prerequisite edges, satisfied but present', () => {
    const units = JSON.parse(require('node:fs').readFileSync(
      require('node:path').join(__dirname, '../../../class11-source/CLASS11_DECOMPOSITION.json'), 'utf8'
    )) as Array<{ unitId: string; prerequisites: string[] }>;
    const bin = units.find((u) => u.unitId === 'C11-BIN-01')!;
    expect(bin.prerequisites).toEqual(expect.arrayContaining(['C11-IND-01', 'C11-PNC-05']));
    const ids = AUTHORED_CHAPTERS.flatMap((c) => c.sections()).map((s) => s.contentArtifactId);
    expect(ids.some((i) => i.includes('induction'))).toBe(true);
    expect(ids.some((i) => i.includes('s6_4_combinations'))).toBe(true);
    // v0.84.0-c11.26 checkpoint 90 — LIM-05 and LIM-06 are authored now;
    // they shared the induction prerequisite with this unit rather than
    // depending on it, so authoring them changes nothing about these edges.
    expect(ids.some((i) => i.includes('first_principles'))).toBe(true);
    expect(ids.some((i) => i.includes('algebra_of_derivatives'))).toBe(true);
  });
});

describe('both figures reach the student', () => {
  const show = () => {
    __setAuthoredLearnPreviewForTests(true);
    const lesson = C11_BIN_SECTIONS[0];
    const out = render(<LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />);
    const seeIt = screen.getAllByRole('button', { name: /See it/i })[0];
    if (seeIt) fireEvent.click(seeIt);
    return out;
  };

  it('validates both figures through the shared validator', () => {
    for (const spec of [V_COEFFICIENT_ROWS, V_PROOF_BINOMIAL]) {
      expect(validateVisual(spec as never), spec.id).toEqual([]);
      expect(spec.altText.length).toBeGreaterThan(120);
      expect(spec.altText).not.toMatch(/\b(red|blue|green|colour|color)\b/i);
    }
  });

  it('renders the coefficient rows with entries from the model', () => {
    const { container } = show();
    const rows = container.querySelector('[data-visual-kind="coefficient_rows"]');
    expect(rows).not.toBeNull();
    expect(rows!.querySelectorAll('td').length).toBe(21);
    expect(rows!.textContent).toContain('10');
    __setAuthoredLearnPreviewForTests(null);
  });

  it('renders the proof with its five parts', () => {
    const { container } = show();
    const proof = container.querySelector('[data-visual-kind="proof_layout"]');
    expect(proof).not.toBeNull();
    for (const part of ['Claim', 'Base case', 'Induction hypothesis', 'Inductive step', 'Conclusion']) {
      expect(proof!.textContent, part).toContain(part);
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('shows the expansion in prose, derived rather than typed', () => {
    expect(describeExpansion(E3)).toBe('a^3 + 3a^2b + 3ab^2 + b^3');
    expect(describeExpansion(E4)).toBe('a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4');
    expect(termAt(E4, 2)!.firstPower).toBe(2);
  });
});
