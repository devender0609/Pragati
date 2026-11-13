/**
 * v0.84.0-c11.31 checkpoint 92 — Chapter 14, Probability.
 *
 * Two things carry the weight. The GOVERNANCE case: C11-PRB-FO12 is
 * FORMATIVE_ONLY and REQUIRED_PREREQUISITE at once, so formative must not
 * be allowed to mean optional. And the MATHEMATICAL case: favourable over
 * total must stay a derived special case, refused when equal likelihood is
 * not established.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  addRationals, additionRule, andEvent, checkAssignment, classicalAgreesWithAssignment,
  classifyEvents, complementRule, equallyLikelyAssignment, isExhaustive,
  isMutuallyExclusive, notEvent, orEvent, probabilityOf, rationalsEqual, show,
} from '../probabilitySpace';
import { type Event, formatRational, probability, rational } from '../sampleSpace';
import {
  BELOW_FOUR, C11_PRB_SECTIONS, DIE, DIE_ASSIGNMENT, EVEN, ODD, SIX, TWO_COINS,
} from '../probabilityClass11Sections';
import { AUTHORED_CHAPTERS } from '../authoredSections';
import { authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

const ev = (id: string, outcomes: string[]): Event =>
  ({ id, experimentId: 'die', description: id, outcomes });

describe('FO12 is formative-only AND required — neither implies the other', () => {
  it('is authored, first in the chapter, and ordered before PRB-01', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    const ch14 = c.chapters.find((x) => x.number === 14)!;
    const ids = ch14.lessons.map((l) => l.contentArtifactId);
    expect(ids).toHaveLength(7);
    // Formative does not mean "sorted to the back".
    expect(ids[0]).toContain('sf3_formative');
    expect(ids[1]).toContain('sf3_summative');
    expect(ids.findIndex((i) => i.includes('sf3_formative')))
      .toBeLessThan(ids.findIndex((i) => i.includes('sf3_summative')));
    __setAuthoredLearnPreviewForTests(null);
  });

  it('carries both statuses in the decomposition, read independently', () => {
    const units = JSON.parse(require('node:fs').readFileSync(
      require('node:path').join(__dirname, '../../../class11-source/CLASS11_DECOMPOSITION.json'), 'utf8'
    )) as Array<{ unitId: string; assessmentStatus: string; instructionalStatus: string; summativeEligible: boolean; prerequisites: string[] }>;
    const fo12 = units.find((u) => u.unitId === 'C11-PRB-FO12')!;
    expect(fo12.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(fo12.instructionalStatus).toBe('REQUIRED_PREREQUISITE');
    expect(fo12.summativeEligible).toBe(false);
    // And PRB-01 genuinely depends on it.
    expect(units.find((u) => u.unitId === 'C11-PRB-01')!.prerequisites).toContain('C11-PRB-FO12');
    // The six summative units are eligible; the prerequisite is not.
    for (const id of ['C11-PRB-01', 'C11-PRB-02', 'C11-PRB-03', 'C11-PRB-04', 'C11-PRB-05', 'C11-PRB-06']) {
      expect(units.find((u) => u.unitId === id)!.summativeEligible, id).toBe(true);
    }
  });

  it('splits §14.1 by fragment rather than classifying the section one way', () => {
    const [formative, summative] = C11_PRB_SECTIONS;
    expect(formative.source.sectionNumber).toBe('14.1');
    expect(summative.source.sectionNumber).toBe('14.1');
    expect((formative.source as { scopeFragmentId?: string }).scopeFragmentId).toBe('SF-3-FORMATIVE');
    expect((summative.source as { scopeFragmentId?: string }).scopeFragmentId).toBe('SF-3-SUMMATIVE');
  });
});

describe('events are subsets of a real sample space', () => {
  it('refuses an event containing an outcome outside the sample space', () => {
    expect(() => notEvent(DIE, ev('bad', ['7']))).toThrow(/outside the sample space/);
    expect(() => andEvent(DIE, EVEN, ev('bad', ['7']))).toThrow(/outside the sample space/);
    expect(() => orEvent(DIE, ev('bad', ['0']), EVEN)).toThrow(/outside the sample space/);
  });

  it('builds not, and, or as complement, intersection and inclusive union', () => {
    expect(notEvent(DIE, EVEN).outcomes).toEqual(['1', '3', '5']);
    expect(andEvent(DIE, EVEN, BELOW_FOUR).outcomes).toEqual(['2']);
    // Inclusive: the overlap is IN the union, once.
    const union = orEvent(DIE, EVEN, BELOW_FOUR).outcomes;
    expect(union).toEqual(['1', '2', '3', '4', '6']);
    expect(union.filter((o) => o === '2')).toHaveLength(1);
  });

  it('would catch an exclusive-or reading', () => {
    const inclusive = orEvent(DIE, EVEN, BELOW_FOUR).outcomes;
    const exclusiveOr = [...EVEN.outcomes, ...BELOW_FOUR.outcomes]
      .filter((o) => !(EVEN.outcomes.includes(o) && BELOW_FOUR.outcomes.includes(o)));
    expect(inclusive).not.toEqual([...new Set(exclusiveOr)].sort());
  });
});

describe('exhaustive and mutually exclusive are derived, and independent', () => {
  it('covers all four combinations', () => {
    // both
    expect(classifyEvents(DIE, [EVEN, ODD])).toEqual({ exhaustive: true, mutuallyExclusive: true });
    // neither
    expect(classifyEvents(DIE, [EVEN, BELOW_FOUR])).toEqual({ exhaustive: false, mutuallyExclusive: false });
    // mutually exclusive but not exhaustive
    expect(classifyEvents(DIE, [ev('a', ['1']), ev('b', ['2'])]))
      .toEqual({ exhaustive: false, mutuallyExclusive: true });
    // exhaustive but not mutually exclusive
    expect(classifyEvents(DIE, [ev('all', DIE.outcomes), EVEN]))
      .toEqual({ exhaustive: true, mutuallyExclusive: false });
  });

  it('reads them from the sets, not from a label', () => {
    expect(isExhaustive(DIE, [EVEN])).toBe(false);
    expect(isMutuallyExclusive([EVEN, notEvent(DIE, EVEN)])).toBe(true);
    expect(isExhaustive(DIE, [EVEN, notEvent(DIE, EVEN)])).toBe(true);
  });
});

describe('the axioms are checked, and invalid assignments refused', () => {
  it('accepts a valid assignment', () => {
    expect(checkAssignment(DIE, DIE_ASSIGNMENT)).toEqual({ kind: 'valid' });
  });

  it('rejects a total that is not 1, rather than rescaling it', () => {
    const bad = { id: 'b', experimentId: 'die', masses: DIE.outcomes.map((o) => ({ outcome: o, p: rational(1, 5) })) };
    const r = checkAssignment(DIE, bad);
    expect(r.kind).toBe('invalid');
    if (r.kind === 'invalid') expect(r.problems[0]).toMatch(/total 6\/5, not 1/);
  });

  it('rejects a negative mass and one above 1, rather than clamping', () => {
    const neg = { id: 'n', experimentId: 'die', masses: DIE.outcomes.map((o, i) => ({ outcome: o, p: i === 0 ? rational(-1, 6) : rational(7, 30) })) };
    const r = checkAssignment(DIE, neg);
    expect(r.kind).toBe('invalid');
    if (r.kind === 'invalid') expect(r.problems.some((p) => /negative probability/.test(p))).toBe(true);
    const over = { id: 'o', experimentId: 'die', masses: [{ outcome: '1', p: rational(3, 2) }] };
    const r2 = checkAssignment(DIE, over);
    expect(r2.kind).toBe('invalid');
  });

  it('rejects a duplicated or unknown outcome', () => {
    const dup = { id: 'd', experimentId: 'die', masses: [...DIE.outcomes, '1'].map((o) => ({ outcome: o, p: rational(1, 7) })) };
    const r = checkAssignment(DIE, dup);
    expect(r.kind).toBe('invalid');
    if (r.kind === 'invalid') expect(r.problems.some((p) => /twice/.test(p))).toBe(true);
  });

  it('refuses to compute with an invalid assignment at all', () => {
    const bad = { id: 'b', experimentId: 'die', masses: DIE.outcomes.map((o) => ({ outcome: o, p: rational(1, 5) })) };
    expect(() => probabilityOf(DIE, bad, EVEN)).toThrow(/not a probability assignment/);
  });

  it('derives event probability from the outcomes it contains', () => {
    expect(show(probabilityOf(DIE, DIE_ASSIGNMENT, EVEN))).toBe('1/2');
    expect(show(probabilityOf(DIE, DIE_ASSIGNMENT, SIX))).toBe('1/6');
    expect(show(probabilityOf(DIE, DIE_ASSIGNMENT, ev('none', [])))).toBe('0');
    expect(show(probabilityOf(DIE, DIE_ASSIGNMENT, ev('all', DIE.outcomes)))).toBe('1');
  });

  it('keeps probabilities exact, never floating point', () => {
    expect(formatRational(rational(1, 6))).toBe('1/6');
    expect(show(probabilityOf(TWO_COINS, equallyLikelyAssignment(TWO_COINS), { id: 'one_head', experimentId: 'two_coins', description: 'exactly one head', outcomes: ['HT', 'TH'] }))).toBe('1/2');
  });
});

describe('favourable over total is DERIVED, not assumed', () => {
  it('agrees with the axiomatic assignment under equal likelihood', () => {
    for (const e of [EVEN, ODD, BELOW_FOUR, SIX]) {
      expect(classicalAgreesWithAssignment(DIE, e), e.id).toBe(true);
    }
  });

  it('REFUSES when equal likelihood is not established', () => {
    const weighted = { ...DIE, id: 'weighted', equallyLikely: null };
    expect(() => equallyLikelyAssignment(weighted)).toThrow(/does not establish equally likely/);
    // The checkpoint-10 guard in sampleSpace still refuses too.
    expect(() => probability(weighted, EVEN)).toThrow(/equally likely/);
  });

  it('forces 1/n from the axioms rather than assuming it', () => {
    const a = equallyLikelyAssignment(DIE);
    expect(a.masses).toHaveLength(6);
    for (const m of a.masses) expect(show(m.p)).toBe('1/6');
    const total = a.masses.reduce((acc, m) => addRationals(acc, m.p), rational(0, 1));
    expect(rationalsEqual(total, rational(1, 1))).toBe(true);
  });
});

describe('the rules come from the event sets', () => {
  it('derives the complement rule from the partition', () => {
    const c = complementRule(DIE, DIE_ASSIGNMENT, EVEN);
    expect(c.partitions).toBe(true);
    expect(c.totalsOne).toBe(true);
    expect([show(c.pEvent), show(c.pComplement)]).toEqual(['1/2', '1/2']);
  });

  it('subtracts the overlap, and agrees with the union event itself', () => {
    const r = additionRule(DIE, DIE_ASSIGNMENT, EVEN, BELOW_FOUR);
    expect([show(r.pX), show(r.pY), show(r.pBoth), show(r.pEither)]).toEqual(['1/2', '1/2', '1/6', '5/6']);
    expect(r.derivedMatchesDirect).toBe(true);
    expect(r.mutuallyExclusive).toBe(false);
  });

  it('would catch an addition that omits the overlap subtraction', () => {
    const r = additionRule(DIE, DIE_ASSIGNMENT, EVEN, BELOW_FOUR);
    const naive = addRationals(r.pX, r.pY);
    expect(rationalsEqual(naive, r.pEither)).toBe(false);
    expect(show(naive)).toBe('1');
  });

  it('treats the mutually exclusive form as a special case, not the rule', () => {
    const r = additionRule(DIE, DIE_ASSIGNMENT, EVEN, ODD);
    expect(r.mutuallyExclusive).toBe(true);
    expect(show(r.pBoth)).toBe('0');
    // With an empty overlap the subtraction takes nothing away.
    expect(rationalsEqual(addRationals(r.pX, r.pY), r.pEither)).toBe(true);
    expect(r.derivedMatchesDirect).toBe(true);
  });

  it('keeps one truth: change the event set and the probability follows', () => {
    const union = orEvent(DIE, EVEN, BELOW_FOUR);
    expect(show(probabilityOf(DIE, DIE_ASSIGNMENT, union)))
      .toBe(show(additionRule(DIE, DIE_ASSIGNMENT, EVEN, BELOW_FOUR).pEither));
  });
});

describe('the seven lessons', () => {
  it('builds no second set or sample-space model', () => {
    const src = require('node:fs').readFileSync(
      require('node:path').join(__dirname, '../probabilitySpace.ts'), 'utf8'
    ) as string;
    expect(src).toMatch(/from '\.\/sampleSpace'/);
    expect(src).not.toMatch(/export type (Experiment|Event|Rational) =/);
    expect(src).not.toMatch(/class \w*ProbabilitySpace/);
  });

  it('records subsection provenance without fabricating section ids', () => {
    for (const [frag, sub] of [['14_1_2', '14.1.2'], ['14_1_4', '14.1.4'], ['14_2_2', '14.2.2'], ['14_2_3', '14.2.3']] as const) {
      const s = C11_PRB_SECTIONS.find((x) => x.contentArtifactId.includes(frag))!;
      expect((s.source as { officialSubsectionNumber?: string }).officialSubsectionNumber).toBe(sub);
      expect(s.source.officialSectionId).toMatch(/^ncert_kemh1_s14_[12]$/);
    }
  });

  it('gives every lesson five stages at version 1', () => {
    expect(C11_PRB_SECTIONS).toHaveLength(7);
    for (const s of C11_PRB_SECTIONS) {
      expect(s.workedExamples.length).toBeGreaterThanOrEqual(3);
      expect(s.guidedPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.independentPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.reasoningApplication.length).toBeGreaterThanOrEqual(1);
      expect(s.contentArtifactVersion).toBe(1);
      expect(s.reviewStatus).toBe('authored_draft');
    }
  });

  it('does not present favourable over total as the definition of probability', () => {
    const axioms = C11_PRB_SECTIONS[4];
    const prose = [...axioms.explanation, axioms.summary].join(' ').toLowerCase();
    expect(prose).toMatch(/total exactly 1|total 1/);
    expect(prose).toMatch(/not require the outcomes to be equally likely|do not require/);
  });

  it('registers Chapter 14 without inventing Chapter 11', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    expect(c.chapters.map((x) => x.number)).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14]);
    expect(c.chapters.reduce((n, x) => n + x.lessonCount, 0)).toBe(80);
    expect(c.prerequisiteLessons).toHaveLength(1);
    expect(c.lessonCount).toBe(81);
    // v0.84.0-c11.33 checkpoint 93 — Chapter 13 is AUTHORED now, so it
    // leaves the absent list; 11 has no authored content and stays.
    expect(c.chapters.some((x) => x.number === 13)).toBe(true);
    expect(c.chapters.some((x) => x.number === 11)).toBe(false);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('leaves the other formative extensions unauthored', () => {
    const ids = AUTHORED_CHAPTERS.flatMap((c) => c.sections()).map((s) => s.contentArtifactId);
    expect(ids.some((i) => /fo8|special_sum|fo11|chain_rule/.test(i))).toBe(false);
  });

  it('reaches the student through the real renderer', () => {
    __setAuthoredLearnPreviewForTests(true);
    const lesson = C11_PRB_SECTIONS[0];
    const { container } = render(
      <LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />
    );
    const seeIt = screen.getAllByRole('button', { name: /See it/i })[0];
    if (seeIt) fireEvent.click(seeIt);
    expect(container.textContent).toMatch(/sample space/i);
    __setAuthoredLearnPreviewForTests(null);
  });
});
