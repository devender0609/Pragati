// ---------------------------------------------------------------------------
// v0.84.0-c11.8 checkpoint 79 — CLASS 11 CHAPTER 1, SETS.
//
// Two things are under test. First, that one set model drives the symbolic
// operations, the Venn regions and the counting, so none of the three can
// drift from the others. Second — and this is the governance half — that a
// lesson can be REQUIRED_CORE instruction while remaining FORMATIVE_ONLY for
// assessment, with neither field inferred from the other.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import {
  canonicalMembers, cardinality, complement, countingRelationHolds,
  deMorganIntersectionHolds, deMorganUnionHolds, difference, formatInterval,
  intersection, isMember, isProperSubset, isSubset, regionMembers, roster,
  setsEqual, shadedNotation, twoSetCount, union, validateVenn,
} from '../setTheory';
import {
  C11_SETS_SECTIONS, CANONICAL_VENNS, C_CRICKET, C_TENNIS, I_CLOSED, I_HALF,
  I_OPEN, S_A, S_B, S_EMPTY, S_CONTAINS_EMPTY, S_EVEN10, S_EVEN10_SHUFFLED,
  S_FIRST5, S_ODD5, U_CLASS, U_DIGITS, U_SMALL, V_COUNT, V_DIFFERENCE,
  V_INTERSECTION, V_UNION,
} from '../setsClass11Sections';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';

const DEC = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', '..', '..', 'class11-source', 'CLASS11_DECOMPOSITION.json'), 'utf8'
)) as Array<Record<string, string>>;
const SETS_UNITS = DEC.filter((u) => u.unitId.startsWith('C11-SET'));
const FO1 = SETS_UNITS.find((u) => u.unitId === 'C11-SET-FO1')!;

describe('the model, not the prose, owns the mathematics', () => {
  it('treats order and repetition as writing, not identity', () => {
    expect(setsEqual(S_EVEN10, S_EVEN10_SHUFFLED)).toBe(true);
    expect(canonicalMembers(S_EVEN10_SHUFFLED)).toEqual([2, 4, 6, 8]);
    expect(cardinality(S_EVEN10_SHUFFLED)).toBe(4);
  });

  it('keeps the empty set distinct from the set containing it', () => {
    expect(cardinality(S_EMPTY)).toBe(0);
    expect(cardinality(S_CONTAINS_EMPTY)).toBe(1);
    expect(setsEqual(S_EMPTY, S_CONTAINS_EMPTY)).toBe(false);
  });

  it('separates subset from proper subset', () => {
    expect(isSubset(S_ODD5, S_FIRST5)).toBe(true);
    expect(isProperSubset(S_ODD5, S_FIRST5)).toBe(true);
    expect(isSubset(S_FIRST5, S_FIRST5)).toBe(true);
    expect(isProperSubset(S_FIRST5, S_FIRST5)).toBe(false);
    expect(isSubset(S_EMPTY, S_FIRST5)).toBe(true);
  });

  it('gives intervals structured endpoints rather than punctuation', () => {
    expect(isMember(I_OPEN, 2)).toBe(false);
    expect(isMember(I_CLOSED, 2)).toBe(true);
    expect(isMember(I_HALF, 2)).toBe(true);
    expect(isMember(I_HALF, 7)).toBe(false);
    expect(formatInterval(I_OPEN)).toBe('(2, 7)');
    expect(formatInterval(I_CLOSED)).toBe('[2, 7]');
  });

  it('deduplicates a union instead of concatenating', () => {
    const u = union(S_A, S_B);
    expect(roster(u)).toBe('{1, 2, 3, 4, 5, 6, 7, 8}');
    expect(cardinality(u)).toBe(8);
    expect(cardinality(u)).toBeLessThan(cardinality(S_A) + cardinality(S_B));
  });

  it('keeps an empty intersection distinct from an empty set', () => {
    const disjoint = intersection(S_ODD5, { kind: 'explicit', id: 'e', label: 'E', members: [2, 4] });
    expect(cardinality(disjoint)).toBe(0);
    expect(cardinality(S_ODD5)).toBeGreaterThan(0);
  });

  it('makes difference directional', () => {
    expect(roster(difference(S_A, S_B))).toBe('{1, 2, 3}');
    expect(roster(difference(S_B, S_A))).toBe('{7, 8}');
    expect(setsEqual(difference(S_A, S_B), difference(S_B, S_A))).toBe(false);
  });

  it('refuses a complement with no universe', () => {
    expect(() => (complement as unknown as (u: undefined, a: typeof S_A) => unknown)(undefined, S_A))
      .toThrow(/universal set/);
  });

  it('makes the complement relative to the universe', () => {
    expect(roster(complement(U_DIGITS, S_A))).toBe('{7, 8, 9, 10}');
    expect(cardinality(complement(U_SMALL, S_A))).toBe(0);
    expect(setsEqual(complement(U_DIGITS, S_A), complement(U_SMALL, S_A))).toBe(false);
  });

  it('rejects a universe that does not contain the set', () => {
    const tooSmall = { kind: 'explicit' as const, id: 'ts', label: 'U', members: [1, 2, 3] };
    expect(() => complement(tooSmall, S_A)).toThrow(/not a subset/);
  });

  it('evaluates both De Morgan laws rather than quoting them', () => {
    expect(deMorganUnionHolds(U_DIGITS, S_A, S_B)).toBe(true);
    expect(deMorganIntersectionHolds(U_DIGITS, S_A, S_B)).toBe(true);
    expect(setsEqual(complement(U_DIGITS, union(S_A, S_B)),
      intersection(complement(U_DIGITS, S_A), complement(U_DIGITS, S_B)))).toBe(true);
  });

  it('derives the counting relation from region accounting', () => {
    const c = twoSetCount(C_CRICKET, C_TENNIS, U_CLASS);
    expect(c.onlyA + c.both + c.onlyB).toBe(c.union);
    expect(c.totalA + c.totalB - c.both).toBe(c.union);
    expect(countingRelationHolds(C_CRICKET, C_TENNIS)).toBe(true);
    expect(c.outside).toBe(cardinality(U_CLASS) - c.union);
  });

  it('holds the counting relation for disjoint sets too', () => {
    const d = { kind: 'explicit' as const, id: 'd', label: 'D', members: [2, 4] };
    expect(countingRelationHolds(S_ODD5, d)).toBe(true);
    expect(twoSetCount(S_ODD5, d).both).toBe(0);
  });
});

describe('a Venn region knows which expression it is', () => {
  it('validates every canonical figure against its own sets', () => {
    for (const v of CANONICAL_VENNS.filter((x) => x.id !== 'v_count')) {
      expect(validateVenn(v, S_A, S_B, U_DIGITS), v.id).toEqual([]);
    }
    expect(validateVenn(V_COUNT, C_CRICKET, C_TENNIS, U_CLASS)).toEqual([]);
  });

  it('computes region contents from the sets', () => {
    expect(regionMembers('A_and_B', S_A, S_B)).toEqual(canonicalMembers(intersection(S_A, S_B)));
    expect(regionMembers('A_minus_B', S_A, S_B)).toEqual(canonicalMembers(difference(S_A, S_B)));
    expect(regionMembers('outside_both', S_A, S_B, U_DIGITS))
      .toEqual(canonicalMembers(complement(U_DIGITS, union(S_A, S_B))));
  });

  it('shades the difference without the overlap', () => {
    expect(V_DIFFERENCE.shaded).toEqual(['A_minus_B']);
    expect(V_DIFFERENCE.shaded).not.toContain('A_and_B');
    expect(shadedNotation(V_DIFFERENCE)).toBe('A \u2212 B');
  });

  it('rejects a figure whose shading contradicts its claim', () => {
    // The negative fixture: a difference figure that wrongly shades the overlap.
    const wrong = { ...V_DIFFERENCE, id: 'wrong', shaded: ['A_minus_B', 'A_and_B'] as typeof V_DIFFERENCE.shaded };
    expect(shadedNotation(wrong)).not.toBe(shadedNotation(V_DIFFERENCE));
    expect(regionMembers('A_and_B', S_A, S_B).length).toBeGreaterThan(0);
  });

  it('refuses a complement region with no universe', () => {
    const errs = validateVenn({ ...V_UNION, id: 'noU', shaded: ['A_complement'] }, S_A, S_B, undefined);
    expect(errs.join(' ')).toMatch(/universal set/);
  });

  it('names the union as all three inner regions', () => {
    expect(V_UNION.shaded).toEqual(['A_only', 'A_and_B', 'B_only']);
    expect(V_INTERSECTION.shaded).toEqual(['A_and_B']);
  });

  it('gives every figure alt text naming the universe, the sets and the region', () => {
    for (const v of CANONICAL_VENNS) {
      expect(v.altText.length, v.id).toBeGreaterThan(40);
      expect(v.altText, v.id).toMatch(/shade|region|inside|outside|overlap/i);
      expect(v.altText, v.id).not.toMatch(/\b(red|blue|green|colour|color)\b/i);
    }
  });
});

describe('the twelve lessons', () => {
  it('are all authored and routable under Chapter 1', () => {
    expect(C11_SETS_SECTIONS.length).toBe(12);
    expect(SETS_UNITS.length).toBe(12);
    const ids = C11_SETS_SECTIONS.map((s) => s.contentArtifactId);
    expect(new Set(ids).size).toBe(12);
    for (const s of C11_SETS_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_kemh1_ch01');
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('carry all five stages with no placeholder', () => {
    for (const s of C11_SETS_SECTIONS) {
      expect(s.explanation.length, s.contentArtifactId).toBeGreaterThanOrEqual(3);
      expect(s.workedExamples.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.guidedPractice.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.independentPractice.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.reasoningApplication.length, s.contentArtifactId).toBeGreaterThanOrEqual(1);
      const all = JSON.stringify(s);
      expect(all, s.contentArtifactId).not.toMatch(/\b(TODO|TBD|placeholder|FIXME)\b/i);
      expect(all, s.contentArtifactId).not.toMatch(/\$\{/);
    }
  });

  it('uses every term it defines', () => {
    for (const s of C11_SETS_SECTIONS) {
      const body = [s.learningGoal, s.summary, ...s.explanation,
        ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.map((x) => `${x.text} ${x.reasoning}`)]),
        ...s.guidedPractice.map((g) => `${g.prompt} ${g.answer} ${g.rationale}`),
        ...s.independentPractice.map((p) => `${p.prompt} ${p.answer} ${p.rationale}`),
        ...s.reasoningApplication.map((r) => `${r.prompt} ${r.expectedReasoning}`)].join(' ').toLowerCase();
      for (const v of s.vocabulary) {
        const head = v.term.toLowerCase().split(/[\s\u2019']/).slice(-1)[0];
        expect(body.includes(v.term.toLowerCase()) || body.includes(head),
          `${s.contentArtifactId} defines "${v.term}" and never uses it`).toBe(true);
      }
    }
  });

  it('gives every worked-example step a real justification', () => {
    for (const s of C11_SETS_SECTIONS) {
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId} ${w.id}`).toBeGreaterThan(39);
        }
      }
    }
  });

  it('never treats union as exclusive or', () => {
    const u = C11_SETS_SECTIONS.find((s) => s.contentArtifactId.includes('union_intersection'))!;
    const body = [...u.explanation, ...u.reasoningApplication.map((r) => r.expectedReasoning)].join(' ');
    expect(body).toMatch(/or in both|or both|at least one/i);
  });

  it('never states a complement without naming a universe', () => {
    const c = C11_SETS_SECTIONS.find((s) => s.contentArtifactId.includes('complement'))!;
    for (const p of c.explanation) {
      if (/complement/i.test(p) && /=/.test(p)) {
        expect(p, 'a complement statement must mention the universe').toMatch(/U|universal|universe/);
      }
    }
  });

  it('renders all twelve through the real LearnSectionView', () => {
    __setAuthoredLearnPreviewForTests(true);
    for (const s of C11_SETS_SECTIONS) {
      const content = learnContentFor(s);
      const { unmount, container } = render(<LearnSectionView content={content} visualsById={s.visualsById} />);
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      expect(container.textContent ?? '', s.contentArtifactId).not.toMatch(/ncert_kemh1_s|contentArtifactId/);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });
});

describe('FO1 — required instruction, formative-only assessment', () => {
  it('is REQUIRED_CORE and FORMATIVE_ONLY at once', () => {
    expect(FO1.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(FO1.instructionalStatus).toBe('REQUIRED_CORE');
  });

  it('is not optional merely because it is formative-only', () => {
    expect(FO1.instructionalStatus).not.toBe('OPTIONAL_ENRICHMENT');
    const formativeUnits = DEC.filter((u) => u.assessmentStatus === 'FORMATIVE_ONLY');
    expect(formativeUnits.some((u) => u.instructionalStatus !== 'OPTIONAL_ENRICHMENT')).toBe(true);
  });

  it('is excluded from summative eligibility while the other eleven are not', () => {
    const eligible = (u: Record<string, string>) => u.assessmentStatus === 'SUMMATIVE_CORE';
    expect(eligible(FO1)).toBe(false);
    expect(SETS_UNITS.filter(eligible).length).toBe(11);
  });

  it('records its provenance as a scope fragment, not a fabricated section', () => {
    const art = C11_SETS_SECTIONS.find((s) => s.contentArtifactId.includes('practical_counting'))!;
    expect(art.source.sourceKind).toBe('scope_fragment');
    expect(art.source.scopeFragmentId).toBe('FO-1-APPLICATION');
    expect(art.source.officialSectionId).toBe('ncert_kemh1_s1_9');
    expect(art.source.sectionNumber).toBe('1.9');
  });

  it('appears in the Learn catalogue like any other lesson', () => {
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class11');
    const ch1 = cat.chapters.find((c) => c.number === 1)!;
    const ids = ch1.lessons.map((l) => l.contentArtifactId);
    expect(ids).toContain('ncert_kemh1_s1_9_practical_counting_lesson');
    expect(ids.length).toBe(12);
    expect(new Set(ids).size).toBe(12);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('derives its counts from the model rather than typing them', () => {
    const art = C11_SETS_SECTIONS.find((s) => s.contentArtifactId.includes('practical_counting'))!;
    const c = twoSetCount(C_CRICKET, C_TENNIS, U_CLASS);
    const body = [...art.explanation, art.summary].join(' ');
    for (const n of [c.onlyA, c.onlyB, c.both, c.union, c.outside]) {
      expect(body, `count ${n} should appear`).toContain(String(n));
    }
    // The sum of the totals must also appear, since the lesson contrasts it
    // with the union to motivate the subtraction.
    expect(body).toContain(String(c.totalA + c.totalB));
  });
});

describe('delivery governance', () => {
  it('delivers no Class 11 draft in the public-safe mode', () => {
    expect(authoredLearnCatalogueForGrade('class11').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
  });

  it('delivers twelve Class 11 lessons under the internal flag, and leaves prior grades intact', () => {
    __setAuthoredLearnPreviewForTests(true);
    // Chapter 3 was authored at checkpoint 80, so Class 11 now has 20.
    expect(authoredLearnCatalogueForReview('class11').lessonCount).toBe(33);
    expect(authoredLearnCatalogueForReview('class10').lessonCount).toBe(65);
    expect(authoredLearnCatalogueForReview('class9').lessonCount).toBe(92);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('leaves the two human-check units unauthored', () => {
    const authored = allAuthoredSections().map((s) => s.contentArtifactId).join(' ');
    expect(authored).not.toMatch(/induction/i);
    expect(authored).not.toMatch(/two_variable|graphical_inequal/i);
  });
});
