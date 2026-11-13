/**
 * v0.84.0-c11.22 checkpoint 88 — Chapter 6, Permutations and Combinations.
 *
 * The question is whether counting STRUCTURE is represented: does order
 * matter, are the objects distinguishable. A model that only returns the
 * expected formula has not represented anything, so every formula is checked
 * against an enumeration oracle for small cases, and every rule carries a
 * fixture that must be rejected.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  arrangementFigure, combinations, countRepeated, countStaged, countWithFixedPositions,
  describeCount, enumerateRepeated, enumerateSelection, enumerateStaged, factorial,
  fallingFactorial, isCount, permutations, repeatedArrangement, selection, stageTree,
  stagedChoice, validateArrangement, validateStageTree,
} from '../counting';
import {
  C11_PNC_SECTIONS, CANONICAL_COUNTING_VISUALS, REP_AABC, REP_LETTERS,
  SC_CLOTHES, SC_THREE, V_ARRANGEMENT, V_TREE,
} from '../countingClass11Sections';
import { validateVisual } from '../visualSpecification';
import { AUTHORED_CHAPTERS, INSTRUCTIONAL_ORDER_OVERRIDES_SOURCE_ORDER } from '../authoredSections';
import { authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

const val = (r: ReturnType<typeof factorial>): bigint => {
  if (!isCount(r)) throw new Error(`expected a count, got: ${r.reason}`);
  return r.value;
};

describe('counts are exact whole numbers', () => {
  it('keeps factorials exact past the safe range of a double', () => {
    expect(val(factorial(5))).toBe(120n);
    expect(val(factorial(0))).toBe(1n);
    // 21! exceeds Number.MAX_SAFE_INTEGER; an approximate count is a wrong count.
    expect(val(factorial(25))).toBe(15511210043330985984000000n);
    expect(describeCount(factorial(25))).not.toMatch(/e\+|Infinity|NaN/);
  });

  it('cancels a factorial quotient instead of building both factorials', () => {
    expect(val(fallingFactorial(7, 3))).toBe(210n);
    expect(val(fallingFactorial(7, 3))).toBe(val(factorial(7)) / val(factorial(4)));
    // Large n with small r stays cheap and exact.
    expect(val(fallingFactorial(100, 3))).toBe(970200n);
  });

  it('gives nCr as a whole number for every valid n and r', () => {
    for (let n = 0; n <= 12; n += 1) {
      for (let r = 0; r <= n; r += 1) {
        const c = combinations(n, r);
        expect(isCount(c), `${n}C${r}`).toBe(true);
        if (isCount(c)) expect(c.value >= 0n).toBe(true);
      }
    }
  });
});

describe('formulas agree with enumeration on small cases', () => {
  it('matches the staged count to the enumerated outcomes', () => {
    for (const sc of [SC_CLOTHES, SC_THREE]) {
      expect(val(countStaged(sc)), sc.id).toBe(BigInt(enumerateStaged(sc).length));
    }
  });

  it('matches nPr to the enumerated ordered selections', () => {
    const objects = ['A', 'B', 'C', 'D', 'E'];
    for (let r = 0; r <= 4; r += 1) {
      expect(val(permutations(5, r)), `5P${r}`).toBe(BigInt(enumerateSelection(objects, r, true).length));
    }
  });

  it('matches nCr to the enumerated unordered selections', () => {
    const objects = ['A', 'B', 'C', 'D', 'E'];
    for (let r = 0; r <= 5; r += 1) {
      expect(val(combinations(5, r)), `5C${r}`).toBe(BigInt(enumerateSelection(objects, r, false).length));
    }
  });

  it('matches the repeated-object count to the distinct enumerated arrangements', () => {
    for (const a of [REP_AABC, REP_LETTERS]) {
      expect(val(countRepeated(a)), a.id).toBe(BigInt(enumerateRepeated(a).length));
    }
  });

  it('reconciles nPr with nCr times r!', () => {
    for (let n = 1; n <= 10; n += 1) {
      for (let r = 0; r <= n; r += 1) {
        expect(val(permutations(n, r)), `${n},${r}`).toBe(val(combinations(n, r)) * val(factorial(r)));
      }
    }
  });
});

describe('order and distinguishability are explicit, and wrong treatment is caught', () => {
  it('counts an ordered selection differently from an unordered one', () => {
    // The two differ ONLY in orderMatters, and must not agree.
    const ordered = selection('o', 5, 3, true);
    const unordered = selection('u', 5, 3, false);
    expect(val(countStagedless(ordered))).not.toBe(val(countStagedless(unordered)));
    expect(val(countStagedless(ordered))).toBe(60n);
    expect(val(countStagedless(unordered))).toBe(10n);
  });

  it('would catch an ordered arrangement counted as unordered', () => {
    // 3P2 is 6; treating it as unordered would give 3. The enumeration says 6.
    expect(enumerateSelection(['A', 'B', 'C'], 2, true)).toHaveLength(6);
    expect(enumerateSelection(['A', 'B', 'C'], 2, false)).toHaveLength(3);
    expect(val(permutations(3, 2))).not.toBe(val(combinations(3, 2)));
  });

  it('would catch identical-object swaps counted as distinct', () => {
    // The ordinary count is 24; the distinct count is 12.
    expect(val(factorial(REP_AABC.total))).toBe(24n);
    expect(val(countRepeated(REP_AABC))).toBe(12n);
    expect(new Set(enumerateRepeated(REP_AABC)).size).toBe(12);
  });

  it('refuses r greater than n rather than returning zero', () => {
    const r = permutations(3, 5);
    expect(r.kind).toBe('undefined');
    if (r.kind === 'undefined') expect(r.reason).toMatch(/cannot take 5 objects from only 3/);
    expect(describeCount(r)).not.toMatch(/NaN|Infinity|null|undefined/);
  });

  it('refuses negative and non-integer inputs', () => {
    expect(factorial(-1).kind).toBe('undefined');
    expect(factorial(2.5).kind).toBe('undefined');
    expect(permutations(5.5, 2).kind).toBe('undefined');
    expect(countWithFixedPositions({ id: 'f', total: 3, fixed: 5 }).kind).toBe('undefined');
  });

  it('refuses repetition multiplicities that do not account for every object', () => {
    expect(() => repeatedArrangement('bad', 5, [{ label: 'A', count: 2 }, { label: 'B', count: 2 }]))
      .toThrow(/add to 4 but there are 5/);
    expect(() => repeatedArrangement('bad', 4, [{ label: 'A', count: 4 }, { label: 'B', count: 1 }]))
      .toThrow(/add to 5 but there are 4/);
  });

  it('refuses a stage with no choices', () => {
    expect(() => stagedChoice('bad', [{ name: 'hat', choices: 0 }])).toThrow(/nothing to count/);
    expect(() => stagedChoice('bad', [])).toThrow(/at least one stage/);
  });

  it('keeps repeated objects and fixed positions as separate treatments', () => {
    // Five objects, two fixed: three remain, so 3! — NOT 5! divided by anything.
    expect(val(countWithFixedPositions({ id: 'f', total: 5, fixed: 2 }))).toBe(6n);
    expect(val(countWithFixedPositions({ id: 'f', total: 5, fixed: 2 })))
      .not.toBe(val(countRepeated(repeatedArrangement('r', 5, [{ label: 'A', count: 2 }, { label: 'B', count: 3 }]))));
  });
});

/** Local helper: counts a Selection through the shared entry point. */
function countStagedless(s: ReturnType<typeof selection>) {
  return s.orderMatters ? permutations(s.from, s.take) : combinations(s.from, s.take);
}

describe('figures derive from the model', () => {
  it('rejects a tree whose stated total does not match its branches', () => {
    const tampered = { ...V_TREE, totalText: '99' };
    expect(validateStageTree(tampered))
      .toContain('the stated total does not match the branches, so the tree would claim a count it does not show');
  });

  it('rejects a tree too large to read', () => {
    const big = stageTree('big', stagedChoice('b', [
      { name: 'a', choices: 5 }, { name: 'b', choices: 5 }, { name: 'c', choices: 2 },
    ]), 'a description long enough to serve as a real accessible name for this figure');
    expect(validateStageTree(big).some((e) => /unreadable/.test(e))).toBe(true);
  });

  it('rejects an arrangement figure that repeats an arrangement', () => {
    const dupe = { ...V_ARRANGEMENT, shown: ['AABC', 'AABC'] };
    expect(validateArrangement(dupe))
      .toContain('the figure repeats an arrangement, which is the very overcount the lesson removes');
  });

  it('shows only distinct arrangements, each once', () => {
    expect(new Set(V_ARRANGEMENT.shown).size).toBe(V_ARRANGEMENT.shown.length);
    expect(V_ARRANGEMENT.shown.every((a) => enumerateRepeated(REP_AABC).includes(a))).toBe(true);
  });

  it('validates every canonical figure through the shared validator', () => {
    for (const v of CANONICAL_COUNTING_VISUALS) {
      expect(validateVisual(v as never), v.id).toEqual([]);
      expect(v.altText.length).toBeGreaterThan(80);
      expect(v.altText).not.toMatch(/\b(red|blue|green|colour|color)\b/i);
    }
    expect(validateArrangement(arrangementFigure('x', REP_LETTERS, 'a long enough accessible description for the figure'))).toEqual([]);
  });
});

describe('the five lessons', () => {
  it('authors exactly five, in prerequisite order where it differs from the page order', () => {
    expect(C11_PNC_SECTIONS).toHaveLength(5);
    // Factorial (§6.3.1, p119) must precede permutations (§6.3, p118),
    // because the decomposition makes it a prerequisite. Source order and
    // instructional order disagree, and the chain decides.
    const ids = C11_PNC_SECTIONS.map((s) => s.contentArtifactId);
    expect(ids.findIndex((i) => i.includes('factorial')))
      .toBeLessThan(ids.findIndex((i) => i.includes('s6_3_permutations')));
    expect(ids.findIndex((i) => i.includes('counting_principle'))).toBe(0);
    expect(ids.findIndex((i) => i.includes('combinations'))).toBe(4);
  });

  it('records subsection provenance under its parent, inventing no section id', () => {
    for (const [id, sub] of [['s6_3_1', '6.3.1'], ['s6_3_3', '6.3.3']] as const) {
      const s = C11_PNC_SECTIONS.find((x) => x.contentArtifactId.includes(id))!;
      expect(s.source.sectionNumber).toBe('6.3');
      expect((s.source as { officialSubsectionNumber?: string }).officialSubsectionNumber).toBe(sub);
      expect(s.source.officialSectionId).toBe('ncert_kemh1_s6_3');
    }
  });

  it('gives every lesson all five stages', () => {
    for (const s of C11_PNC_SECTIONS) {
      expect(s.workedExamples.length, s.contentArtifactId).toBeGreaterThanOrEqual(3);
      expect(s.guidedPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.independentPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.reasoningApplication.length).toBeGreaterThanOrEqual(1);
      expect(s.explanation.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('does not teach the binomial theorem it only prepares for', () => {
    const prose = C11_PNC_SECTIONS.flatMap((s) => [
      ...s.explanation, s.summary, s.learningGoal,
      ...s.workedExamples.flatMap((w) => [w.prompt, w.answer]),
    ]).join(' ').toLowerCase();
    // Naming what the count will later be used for is fine; teaching the
    // expansion here is not.
    expect(prose).not.toMatch(/\(a \+ b\)\^n|pascal|expansion of \(/);
    expect(prose).not.toMatch(/binomial coefficient/);
  });

  it('leaves every artifact at version 1 and authored_draft', () => {
    for (const s of C11_PNC_SECTIONS) {
      expect(s.contentArtifactVersion).toBe(1);
      expect(s.reviewStatus).toBe('authored_draft');
    }
  });

  it('registers Chapter 6 in canonical order without inventing Chapter 5', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    expect(c.chapters.map((x) => x.number)).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14]);
    expect(c.chapters).toHaveLength(12);
    // Chapter-owned and total stay distinct denominators.
    expect(c.chapters.reduce((n, x) => n + x.lessonCount, 0)).toBe(80);
    expect(c.prerequisiteLessons).toHaveLength(1);
    expect(c.lessonCount).toBe(81);
    expect(c.chapters.some((x) => x.number === 5)).toBe(false);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('writes no duplicated hint across the corpus', () => {
    const hints = AUTHORED_CHAPTERS
      .flatMap((c) => c.sections())
      .flatMap((s) => s.guidedPractice.map((g) => (g as { hint?: string }).hint))
      .filter((h): h is string => Boolean(h))
      .map((h) => h.trim().toLowerCase());
    expect([...new Set(hints.filter((h, i) => hints.indexOf(h) !== i))]).toEqual([]);
  });
});

describe('the binomial prerequisite gate', () => {
  it('now has BOTH prerequisites authored, with the edges intact', () => {
    const units = JSON.parse(
      require('node:fs').readFileSync(
        require('node:path').join(__dirname, '../../../class11-source/CLASS11_DECOMPOSITION.json'), 'utf8'
      )
    ) as Array<{ unitId: string; prerequisites: string[] }>;
    const bin = units.find((u) => u.unitId === 'C11-BIN-01')!;
    // The edges stay; being satisfied is not a reason to delete them.
    expect(bin.prerequisites).toContain('C11-PNC-05');
    expect(bin.prerequisites).toContain('C11-IND-01');

    const ids = AUTHORED_CHAPTERS.flatMap((c) => c.sections()).map((s) => s.contentArtifactId);
    expect(ids.some((i) => i.includes('s6_4_combinations'))).toBe(true);
    expect(ids.some((i) => i.includes('induction'))).toBe(true);
    // And the dependent unit itself is still unauthored. Class 11 ids only:
    // other grades have their own section 7.2.
    const class11 = ids.filter((i) => i.startsWith('ncert_kemh1_'));
    // v0.84.0-c11.24 checkpoint 89 — §7.2 is authored now that combinations
    // and induction both exist; §7.3 was never a section (checkpoint 73).
    expect(class11.some((i) => i.includes('s7_2'))).toBe(true);
    expect(class11.some((i) => i.includes('s7_3'))).toBe(false);
  });
});

describe('counting figures reach the student through the real product', () => {
  const show = (lesson: typeof C11_PNC_SECTIONS[number]) => {
    __setAuthoredLearnPreviewForTests(true);
    const out = render(<LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />);
    const seeIt = screen.getAllByRole('button', { name: /See it/i })[0];
    if (seeIt) fireEvent.click(seeIt);
    return out;
  };

  it('renders the stage trees with branches drawn from the stages', () => {
    show(C11_PNC_SECTIONS[0]);
    const figs = screen.getAllByRole('img').filter((n) => (n.getAttribute('aria-label') || '').length > 80);
    expect(figs.length).toBeGreaterThanOrEqual(2);
    // 3 shirts then 4 trousers: 3 + 12 branch lines, one per node below the top.
    expect(figs[0].querySelectorAll('line').length).toBe(15);
    expect(figs[0].querySelectorAll('circle').length).toBe(16);
  });

  it('renders the arrangement figure with each arrangement once', () => {
    const { container } = show(C11_PNC_SECTIONS[3]);
    // The figure's own list, not every list on the page.
    const fig = container.querySelector('figure[aria-label], [role=group][aria-label]')!;
    const items = [...fig.querySelectorAll('li')].map((n) => n.textContent);
    expect(items.length).toBeGreaterThan(0);
    expect(new Set(items).size).toBe(items.length);
    expect(container.textContent).toContain('12 distinct arrangements');
    __setAuthoredLearnPreviewForTests(null);
  });
});

/**
 * v0.84.0-c11.22 checkpoint 88 — THE INSTRUCTIONAL OVERRIDE IN THE PRODUCT.
 *
 * The registry can hold the right order and the UI can still render the
 * wrong one; this project has found that gap four times. These assert the
 * rendered rows, and that the override is a named, justified entry rather
 * than a silent skip.
 */
describe('the instructional override reaches the student', () => {
  it('renders the factorial row before the permutations row', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    const ch6 = c.chapters.find((x) => x.number === 6)!;
    const ids = ch6.lessons.map((l) => l.contentArtifactId);
    expect(ids).toHaveLength(5);
    const factorial = ids.findIndex((i) => i.includes('factorial'));
    const perms = ids.findIndex((i) => i.includes('s6_3_permutations'));
    // Despite the factorial sitting on the LATER page, 119 against 118.
    expect(factorial).toBeLessThan(perms);
    expect(ids[0]).toContain('counting_principle');
    expect(ids[4]).toContain('combinations');
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the provenance pages as printed, out of order', () => {
    const byId = (frag: string) => C11_PNC_SECTIONS.find((s) => s.contentArtifactId.includes(frag))!;
    // The pages are NOT edited to make the sort come out right.
    expect(byId('factorial').source.startPage).toBe(119);
    expect(byId('s6_3_permutations').source.startPage).toBe(118);
  });

  it('names the override with a substantive reason rather than skipping', () => {
    const reason = INSTRUCTIONAL_ORDER_OVERRIDES_SOURCE_ORDER.ncert_kemh1_ch06;
    expect(reason).toBeTruthy();
    expect(reason.length).toBeGreaterThan(40);
    expect(reason).toMatch(/prerequisite/i);
    // Exactly one chapter claims an override; it is not a general escape.
    expect(Object.keys(INSTRUCTIONAL_ORDER_OVERRIDES_SOURCE_ORDER)).toEqual(['ncert_kemh1_ch06']);
  });
});

describe('exact counts survive the artifact serialisation boundary', () => {
  it('fingerprints all five Chapter 6 artifacts without a BigInt error', () => {
    for (const s of C11_PNC_SECTIONS) {
      expect(() => JSON.stringify(s), s.contentArtifactId).not.toThrow();
    }
  });

  it('carries the exact count as a decimal string, never a Number', () => {
    expect(V_TREE.totalText).toBe('12');
    expect(typeof V_TREE.totalText).toBe('string');
    expect(V_ARRANGEMENT.totalText).toBe('12');
    // A very large exact count stays exact and in plain decimal.
    const big = describeCount(factorial(25));
    expect(big).toBe('15511210043330985984000000');
    expect(big).not.toMatch(/e\+|\./);
  });
});
