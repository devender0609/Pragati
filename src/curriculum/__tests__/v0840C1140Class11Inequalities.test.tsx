/**
 * v0.84.0-c11.40 checkpoint 96B — Chapter 5 and the CBSE-only FO-6.
 *
 * Two things carry the weight. The MATHEMATICS: every picture is a
 * rendering of one solution set, checked against the predicate rather than
 * against another rendering. And the ACCOUNTING: FO-6 is chapter-less and
 * required-core, so it must appear in the total without being called a
 * prerequisite or given a chapter.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  applyTransform, boundaryEquation, boundaryIncluded, containsPoint, describeRay,
  halfPlane, halfPlaneRegion, isStrict, numberLineRegion, onBoundary, oneVar, rayContains,
  sameTruthSet, satisfies, solve, solutionInterval, system, systemAgreesOverGrid,
  systemContains, testPoint, unionContains, validateHalfPlaneRegion, validateNumberLineRegion,
} from '../inequality';
import {
  C11_INQ_SECTIONS, H_SUM, H_THROUGH_ORIGIN, H_VERTICAL, NEGATIVE, SOLVED_NEG,
  STRICT, SYSTEM, V_HALF, V_STRICT, V_SYSTEM, WEAK,
} from '../inequalityClass11Sections';
import { contractProblems, declaredFamilies } from '../representationContract';
import { validateVisual } from '../visualSpecification';
import { authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

describe('relations, strict and weak', () => {
  it('excludes the boundary when strict and includes it when weak', () => {
    expect([isStrict('<'), isStrict('>'), isStrict('<='), isStrict('>=')]).toEqual([true, true, false, false]);
    expect([boundaryIncluded('<'), boundaryIncluded('>='), boundaryIncluded('<=')]).toEqual([false, true, true]);
  });

  it('decides membership at the boundary, which is the only place the two differ', () => {
    expect([2, 3, 4].map((x) => satisfies(STRICT, x))).toEqual([false, false, true]);
    expect([2, 3, 4].map((x) => satisfies(WEAK, x))).toEqual([false, true, true]);
  });

  it('derives the interval from the inequality rather than beside it', () => {
    const iv = solutionInterval(STRICT, 'iv', 'x > 3');
    expect([iv.low, iv.lowClosed, iv.high]).toEqual([3, false, Number.POSITIVE_INFINITY]);
    expect(solutionInterval(WEAK, 'iv2', 'x >= 3').lowClosed).toBe(true);
    // The ray and the predicate must agree everywhere that matters.
    const r = solve(STRICT);
    for (const x of [2, 2.999, 3, 3.001, 4]) expect(rayContains(r, x), String(x)).toBe(satisfies(STRICT, x));
  });
});

describe('sign reversal, checked by truth set', () => {
  it('reverses when dividing by a negative, and the result means the same thing', () => {
    expect(solve(NEGATIVE)).toEqual({ boundary: -3, direction: 'greater', included: false });
    expect(sameTruthSet(NEGATIVE, SOLVED_NEG, [-6, -4, -3.5, -3, -2.9, 0, 7])).toBe(true);
  });

  it('CATCHES the missing reversal — the classic error', () => {
    const wrong = oneVar('wrong', 1, 0, '<', -3);
    expect(sameTruthSet(NEGATIVE, wrong, [-6, -4, -3, -2, 0, 7])).toBe(false);
  });

  it('leaves the relation alone for a positive multiplier or an addition', () => {
    expect(applyTransform(STRICT, { op: 'multiply', value: 2 }).relation).toBe('>');
    expect(applyTransform(STRICT, { op: 'add', value: 5 }).relation).toBe('>');
    expect(applyTransform(STRICT, { op: 'multiply', value: -2 }).relation).toBe('<');
  });

  it('refuses multiplication by zero and a missing x term', () => {
    expect(() => applyTransform(STRICT, { op: 'multiply', value: 0 })).toThrow(/destroys it/);
    expect(() => oneVar('bad', 0, 1, '<', 2)).toThrow(/not a linear inequality in one variable/);
  });
});

describe('the number-line region', () => {
  it('derives boundary, inclusion and direction from the inequality', () => {
    expect(validateNumberLineRegion(V_STRICT)).toEqual([]);
    expect(describeRay(STRICT)).toMatch(/greater than 3.*3 excluded/);
    expect(describeRay(WEAK)).toMatch(/greater than 3.*3 itself/);
  });

  it('cannot express an endpoint that contradicts its relation', () => {
    // The spec stores the inequality; the endpoint is computed at render.
    // There is no field to set wrongly, which is stronger than rejecting it.
    expect(Object.keys(V_STRICT)).not.toContain('included');
    expect(Object.keys(V_STRICT)).not.toContain('endpoint');
    expect(solve(V_STRICT.inequality).included).toBe(boundaryIncluded(V_STRICT.inequality.relation));
  });

  it('rejects an axis that cannot show the boundary', () => {
    const off = numberLineRegion('off', STRICT, 5, 9, 'c', 'a sufficiently long accessible description here');
    expect(validateNumberLineRegion(off).some((e) => /outside the drawn axis/.test(e))).toBe(true);
  });
});

describe('the half-plane', () => {
  it('reads the boundary in general form', () => {
    expect(boundaryEquation(H_SUM)).toBe('x + y = 4');
    expect(boundaryEquation(H_VERTICAL)).toBe('x = 2');
  });

  it('handles a VERTICAL boundary without slope', () => {
    expect(containsPoint(H_VERTICAL, 3, 99)).toBe(true);
    expect(containsPoint(H_VERTICAL, 3, -99)).toBe(true);
    expect(containsPoint(H_VERTICAL, 2, 0)).toBe(false);
    expect(H_VERTICAL.b).toBe(0);
  });

  it('handles a horizontal boundary too', () => {
    const h = halfPlane('horiz', 0, 1, '<=', 3);
    expect(containsPoint(h, 99, 3)).toBe(true);
    expect(containsPoint(h, -99, 4)).toBe(false);
  });

  it('refuses the degenerate form with no x and no y', () => {
    expect(() => halfPlane('bad', 0, 0, '<', 1)).toThrow(/no boundary line/);
  });

  it('falls back when the origin lies ON the boundary', () => {
    expect(onBoundary(H_THROUGH_ORIGIN, 0, 0)).toBe(true);
    const t = testPoint(H_THROUGH_ORIGIN);
    expect(t.usedOrigin).toBe(false);
    expect(onBoundary(H_THROUGH_ORIGIN, t.x, t.y)).toBe(false);
    // ...and uses it where it is valid.
    expect(testPoint(H_SUM).usedOrigin).toBe(true);
  });

  it('classifies inside, outside and boundary by strictness', () => {
    expect(containsPoint(H_SUM, 0, 0)).toBe(true);
    expect(containsPoint(H_SUM, 5, 5)).toBe(false);
    expect(containsPoint(H_SUM, 2, 2)).toBe(true); // on the boundary, weak relation
    const strict = halfPlane('s', 1, 1, '<', 4);
    expect(containsPoint(strict, 2, 2)).toBe(false); // same point, strict relation
  });
});

describe('a system is an intersection', () => {
  it('agrees with "every member is true" across the grid', () => {
    const g = systemAgreesOverGrid(SYSTEM);
    expect(g.checked).toBeGreaterThanOrEqual(169);
    expect(g.disagreements).toEqual([]);
  });

  it('is PROVABLY not a union', () => {
    expect(systemContains(SYSTEM, 0, 0)).toBe(false);
    expect(unionContains(SYSTEM, 0, 0)).toBe(true);
    expect(systemContains(SYSTEM, 3, 0)).toBe(true);
  });

  it('fails if a member is dropped', () => {
    const partial = system('partial', [H_SUM]);
    expect(systemContains(partial, 0, 0)).toBe(true);
    expect(systemContains(SYSTEM, 0, 0)).toBe(false);
  });

  it('validates both region figures', () => {
    for (const v of [V_HALF, V_SYSTEM]) expect(validateVisual(v as never), v.id).toEqual([]);
    const noArea = halfPlaneRegion('n', [H_SUM], { xMin: 2, xMax: 2, yMin: 0, yMax: 1 }, 'c', 'a long enough description for this region figure');
    expect(validateHalfPlaneRegion(noArea).some((e) => /no area/.test(e))).toBe(true);
  });
});

describe('the three lessons', () => {
  it('declares a family only where the mathematics needs one', () => {
    const by = (frag: string) => C11_INQ_SECTIONS.find((s) => s.contentArtifactId.includes(frag))!;
    expect(declaredFamilies(by('s5_2'))).toEqual([]);
    expect(declaredFamilies(by('s5_3'))).toEqual(['region:number_line']);
    expect(declaredFamilies(by('fo6'))).toEqual(['region:half_plane']);
    for (const s of C11_INQ_SECTIONS) expect(contractProblems(s), s.contentArtifactId).toEqual([]);
  });

  it('keeps FO-6 free of NCERT ownership and of a fabricated section', () => {
    const fo6 = C11_INQ_SECTIONS.find((s) => s.contentArtifactId.includes('fo6'))!;
    expect(fo6.source.officialChapterId).not.toBe('ncert_kemh1_ch05');
    expect(fo6.source.officialSectionId).toBe('');
    expect(fo6.source.sectionNumber).toBe('');
    expect(fo6.source.startPage).toBe(0);
    expect((fo6.source as { cbseEntryId?: string }).cbseEntryId).toBe('FO-6');
    expect(fo6.chapterlessRole).toBe('required_core');
  });

  it('records §5.2 and §5.3 for the two NCERT lessons', () => {
    const by = (frag: string) => C11_INQ_SECTIONS.find((s) => s.contentArtifactId.includes(frag))!;
    expect(by('s5_2').source.sectionNumber).toBe('5.2');
    expect(by('s5_3').source.sectionNumber).toBe('5.3');
    for (const f of ['s5_2', 's5_3']) expect(by(f).source.officialChapterId).toBe('ncert_kemh1_ch05');
  });

  it('keeps the FO-6 governance decided at checkpoint 94', () => {
    const units = JSON.parse(require('node:fs').readFileSync(
      require('node:path').join(__dirname, '../../../class11-source/CLASS11_DECOMPOSITION.json'), 'utf8'
    )) as Array<{ unitId: string; prerequisites: string[]; assessmentStatus: string; instructionalStatus: string; summativeEligible: boolean; source: { ncertChapterOwner: unknown } }>;
    const fo6 = units.find((u) => u.unitId === 'C11-INQ-FO6')!;
    expect(fo6.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(fo6.instructionalStatus).toBe('REQUIRED_CORE');
    expect(fo6.summativeEligible).toBe(false);
    expect(fo6.source.ncertChapterOwner).toBeNull();
    expect(fo6.prerequisites).toEqual(['C11-INQ-02']);
    expect(fo6.prerequisites).not.toContain('C11-STL-01');
  });

  it('gives every lesson five stages at version 1', () => {
    expect(C11_INQ_SECTIONS).toHaveLength(3);
    for (const s of C11_INQ_SECTIONS) {
      expect(s.workedExamples.length).toBeGreaterThanOrEqual(3);
      expect(s.guidedPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.independentPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.reasoningApplication.length).toBeGreaterThanOrEqual(1);
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('renders the number line and the half-plane through the real renderer', () => {
    __setAuthoredLearnPreviewForTests(true);
    for (const [frag, kind] of [['s5_3', 'number_line_region'], ['fo6', 'half_plane_region']] as const) {
      const lesson = C11_INQ_SECTIONS.find((s) => s.contentArtifactId.includes(frag))!;
      const { container, unmount } = render(
        <LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />
      );
      const seeIt = screen.getAllByRole('button', { name: /See it/i })[0];
      if (seeIt) fireEvent.click(seeIt);
      expect(container.querySelectorAll(`[data-visual-kind="${kind}"]`).length, frag).toBeGreaterThan(0);
      unmount();
    }
    __setAuthoredLearnPreviewForTests(null);
  });
});

describe('catalogue accounting — FO-6 counted as what it is', () => {
  it('splits chapter-owned, prerequisite and chapter-less required-core', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    // v0.84.0-c11.43 checkpoint 97B — 85 after Chapter 11's three sections.
    expect(c.chapterOwnedCount).toBe(82);
    expect(c.prerequisiteLessons).toHaveLength(1);
    expect(c.requiredCoreLessons).toHaveLength(7);
    expect(c.lessonCount).toBe(90);
    // The invariant that replaces chapter-owned + prerequisite = total.
    expect(c.chapterOwnedCount + c.prerequisiteLessons.length + c.requiredCoreLessons.length)
      .toBe(c.lessonCount);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('puts FO-6 in required-core, NOT in the prerequisite count or Chapter 5', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    const ids = (ls: Array<{ contentArtifactId: string }>) => ls.map((l) => l.contentArtifactId);
    // GD-2 moved three older CBSE-only lessons into this same category.
    expect(ids(c.requiredCoreLessons)).toContain('cbse_fo6_half_plane_lesson');
    expect(ids(c.requiredCoreLessons)).toHaveLength(7);
    expect(ids(c.prerequisiteLessons)).toEqual(['cbse_fo4_induction_lesson']);
    const ch5 = c.chapters.find((x) => x.number === 5)!;
    expect(ch5.lessonCount).toBe(2);
    expect(ids(ch5.lessons)).not.toContain('cbse_fo6_half_plane_lesson');
    // ...but it IS routable, so the lesson is reachable.
    expect(ids(c.lessons)).toContain('cbse_fo6_half_plane_lesson');
    __setAuthoredLearnPreviewForTests(null);
  });

  it('registers Chapter 5 in order without disturbing the rest', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    expect(c.chapters.map((x) => x.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    expect(c.chapters.some((x) => x.number === 11)).toBe(true);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('is general, not written around FO-6', () => {
    const src = require('node:fs').readFileSync(
      require('node:path').join(__dirname, '../authoredLearnCatalogue.ts'), 'utf8'
    ) as string;
    expect(src).not.toMatch(/fo6|FO-6|INQ-FO6/);
    expect(src).toMatch(/chapterlessRole/);
  });
});
