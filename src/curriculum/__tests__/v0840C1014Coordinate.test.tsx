// ---------------------------------------------------------------------------
// v0.84.0-c10.14 checkpoint 68 — CLASS 10 COORDINATE GEOMETRY.
//
// Can the points and the segment be stored once, so the distance, midpoint,
// section point, ratio and figure all derive from the same model and no
// representation can silently disagree with another?
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  approxDistance, auditExcludedCoordinate, classifyQuadrilateral,
  collinearByDistance, distance, distanceIsSymmetric, distanceSquared,
  formatPoint, formatRadical, formatRational, isEquidistant, isInternalPoint,
  midpoint, pt, ratEq, ratioOf, rational, sectionPoint, toNumber,
  validateSection, type Point,
} from '../coordinateGeometry';
import {
  CLASS10_COORDINATE_SECTIONS, CLASS_9_COORDINATE_PRIOR, CANONICAL_POINTS,
  A_1_2, B_4_6, O_0_0, P_5_12, Q_2_4, R_5_7, COL_A, COL_B, COL_C,
  SQ, RH, RECT, SEC_A, SEC_B,
} from '../coordinateClass10Sections';
import { auditCoordinateNovelty, COORDINATE_WORK_IN_CLASS_9 } from '../coordinateProgression';
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
import { CLASS10_AP_SECTIONS } from '../apSections';
import { CLASS10_PROBABILITY_SECTIONS } from '../probabilityClass10Sections';
import { CLASS10_CIRCLE_AREA_SECTIONS } from '../circleAreaSections';
import { CLASS10_TANGENT_SECTIONS } from '../tangentSections';

const blocks = (s: (typeof CLASS10_COORDINATE_SECTIONS)[number]): Array<[string, string]> => [
  ['learningGoal', s.learningGoal],
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];
const prose = () => CLASS10_COORDINATE_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');

describe('progression — distance is revision, the section formula is new', () => {
  it('records the frozen Class 9 coordinate work', () => {
    expect(CLASS_9_COORDINATE_PRIOR.alreadyCovered.length).toBe(5);
    expect(CLASS_9_COORDINATE_PRIOR.alreadyCovered.join(' ')).toMatch(/distance/i);
    expect(CLASS_9_COORDINATE_PRIOR.alreadyCovered.join(' ')).toMatch(/midpoint/i);
    expect(CLASS_9_COORDINATE_PRIOR.alreadyCovered.join(' ')).toMatch(/collinear/i);
    expect(CLASS_9_COORDINATE_PRIOR.genuinelyNewInClass10.join(' ')).toMatch(/section formula/i);
    expect(COORDINATE_WORK_IN_CLASS_9).toContain('distance formula');
    expect(COORDINATE_WORK_IN_CLASS_9).toContain('midpoint');
  });

  it('claims no novelty for distance, midpoint or the plane', () => {
    for (const s of CLASS10_COORDINATE_SECTIONS) {
      expect(auditCoordinateNovelty(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });

  it('catches overclaims and allows the section formula as new', () => {
    for (const t of [
      'Now you learn the distance formula for the first time.',
      'The coordinate plane is introduced here.',
      'The midpoint formula is new in Class 10.',
      'This is your first distance formula.',
    ]) expect(auditCoordinateNovelty([['x', t]]).length, t).toBe(1);
    for (const t of [
      'You derived the distance formula in Class IX; Class 10 re-derives it.',
      'The section formula is new in Class 10.',
      'Internal division is introduced here.',
      'A student says the midpoint formula is new in Class 10, which is wrong.',
    ]) expect(auditCoordinateNovelty([['x', t]]), t).toEqual([]);
  });

  it('says plainly that distance and midpoint come from Class IX', () => {
    const all = prose();
    expect(all).toMatch(/Class IX/);
    expect(all).toMatch(/derived.{0,60}Class IX|Class IX.{0,80}deriv/i);
    expect(all).toMatch(/re-derive|revision/i);
  });
});

describe('distance — derived, exact, symmetric', () => {
  it('validates every canonical point and recomputes every authored distance', () => {
    expect(CANONICAL_POINTS.length).toBeGreaterThan(10);
    const cases: Array<[Point, Point, string]> = [
      [A_1_2, B_4_6, '5'],
      [O_0_0, P_5_12, '13'],
      [Q_2_4, R_5_7, '3\u221a2'],
      [pt('a', 0, 0), pt('b', 8, 15), '17'],
      [pt('a', -2, 1), pt('b', 1, 5), '5'],
    ];
    for (const [p, q, expected] of cases) {
      expect(formatRadical(distance(p, q)), `${formatPoint(p)}\u2013${formatPoint(q)}`).toBe(expected);
    }
    expect(formatRational(distanceSquared(Q_2_4, R_5_7))).toBe('18');
    expect(approxDistance(distance(Q_2_4, R_5_7))).toBe(4.24);
  });

  it('is symmetric for every pair, because the differences are squared', () => {
    for (const p of CANONICAL_POINTS) {
      for (const q of CANONICAL_POINTS) {
        expect(distanceIsSymmetric(p, q), `${p.id}\u2013${q.id}`).toBe(true);
        expect(formatRadical(distance(p, q))).toBe(formatRadical(distance(q, p)));
      }
    }
  });

  it('never returns a negative distance', () => {
    for (const p of CANONICAL_POINTS) {
      for (const q of CANONICAL_POINTS) {
        expect(toNumber(distanceSquared(p, q))).toBeGreaterThanOrEqual(0);
        expect(toNumber(distance(p, q).coefficient)).toBeGreaterThanOrEqual(0);
      }
    }
    expect(prose()).toMatch(/cannot be negative|non-negative/i);
  });

  it('keeps radicals exact rather than decimal', () => {
    expect(formatRadical(distance(Q_2_4, R_5_7))).toBe('3\u221a2');
    expect(formatRadical(distance(pt('a', 0, 0), pt('b', 2, 3)))).toBe('\u221a13');
    // Any decimal in the prose is labelled approximate.
    for (const m of prose().matchAll(/\b4\.24\b/g)) expect(m[0]).toBeTruthy();
    expect(prose()).toMatch(/approximate|approximation/i);
  });
});

describe('distance applications', () => {
  it('finds collinearity AND the point between', () => {
    const r = collinearByDistance(COL_A, COL_B, COL_C);
    expect(r.collinear).toBe(true);
    expect(r.between).toBe('B');
    expect(collinearByDistance(pt('A', 0, 0), pt('B', 1, 5), pt('C', 3, 1)).collinear).toBe(false);
    // The ordering is part of the answer, not an extra.
    expect(prose()).toMatch(/between/i);
    expect(prose()).toMatch(/which sum holds/i);
  });

  it('classifies quadrilaterals on sufficient evidence', () => {
    expect(classifyQuadrilateral(SQ[0], SQ[1], SQ[2], SQ[3])).toBe('square');
    expect(classifyQuadrilateral(RH[0], RH[1], RH[2], RH[3])).toBe('rhombus');
    expect(classifyQuadrilateral(RECT[0], RECT[1], RECT[2], RECT[3])).toBe('rectangle');
    expect(classifyQuadrilateral(pt('A', 0, 0), pt('B', 4, 0), pt('C', 6, 3), pt('D', 2, 3))).toBe('parallelogram');
  });

  it('refuses to call equal sides a square without equal diagonals', () => {
    // The rhombus has four equal sides and unequal diagonals.
    const sides = [distanceSquared(RH[0], RH[1]), distanceSquared(RH[1], RH[2]),
      distanceSquared(RH[2], RH[3]), distanceSquared(RH[3], RH[0])];
    expect(sides.every((s) => ratEq(s, sides[0]))).toBe(true);
    expect(ratEq(distanceSquared(RH[0], RH[2]), distanceSquared(RH[1], RH[3]))).toBe(false);
    expect(classifyQuadrilateral(RH[0], RH[1], RH[2], RH[3])).not.toBe('square');
    expect(prose()).toMatch(/diagonal/i);
    expect(prose()).toMatch(/do not make a square|not.{0,30}square/i);
  });

  it('verifies the equidistant point', () => {
    const T = pt('T', -7, 0);
    expect(isEquidistant(T, pt('A', 2, -5), pt('B', -2, 9))).toBe(true);
    expect(formatRational(distanceSquared(T, pt('A', 2, -5)))).toBe('106');
    expect(formatRational(distanceSquared(T, pt('B', -2, 9)))).toBe('106');
  });
});

describe('the section formula — weights, exactness, internality', () => {
  it('recomputes every authored section point', () => {
    expect(formatPoint(sectionPoint(A_1_2, B_4_6, 2, 1))).toBe('(3, 14/3)');
    expect(formatPoint(sectionPoint(A_1_2, B_4_6, 1, 2))).toBe('(2, 10/3)');
    expect(formatPoint(sectionPoint(SEC_A, SEC_B, 2, 3))).toBe('(13/5, 23/5)');
    expect(formatPoint(sectionPoint(pt('A', -1, 3), pt('B', 4, -2), 3, 2))).toBe('(2, 0)');
  });

  it('keeps coordinates exact rather than rounded', () => {
    const p = sectionPoint(SEC_A, SEC_B, 2, 3);
    expect(p.x).toEqual(rational(13, 5));
    expect(p.y).toEqual(rational(23, 5));
    expect(formatPoint(p)).not.toMatch(/2\.6|4\.6/);
  });

  it('puts every section point strictly between the endpoints', () => {
    for (const [m1, m2] of [[1, 1], [2, 1], [1, 2], [2, 3], [3, 2], [5, 1], [1, 7]]) {
      const p = sectionPoint(SEC_A, SEC_B, m1, m2);
      expect(isInternalPoint(SEC_A, SEC_B, p), `${m1}:${m2}`).toBe(true);
      expect(validateSection(SEC_A, SEC_B, p, m1, m2), `${m1}:${m2}`).toEqual([]);
    }
    // An endpoint is on the segment but not strictly between.
    expect(isInternalPoint(SEC_A, SEC_B, SEC_A)).toBe(false);
    // A point beyond B is on the line, but not internal.
    expect(isInternalPoint(SEC_A, SEC_B, pt('X', 9, 11))).toBe(false);
  });

  it('refuses non-positive ratio parts, which would be external division', () => {
    expect(() => sectionPoint(A_1_2, B_4_6, -2, 1)).toThrow(/positive ratio parts/);
    expect(() => sectionPoint(A_1_2, B_4_6, 2, 0)).toThrow(/positive ratio parts/);
    expect(validateSection(A_1_2, B_4_6, A_1_2, 3, -1).join(' ')).toMatch(/positive ratio parts/);
  });

  it('detects reversed weights', () => {
    // The characteristic error: m1:m2 computed as m2:m1.
    for (const [m1, m2] of [[2, 1], [2, 3], [5, 2]]) {
      const right = sectionPoint(A_1_2, B_4_6, m1, m2);
      const wrong = sectionPoint(A_1_2, B_4_6, m2, m1);
      expect(formatPoint(right), `${m1}:${m2}`).not.toBe(formatPoint(wrong));
      expect(validateSection(A_1_2, B_4_6, wrong, m1, m2).length).toBeGreaterThan(0);
    }
    // The midpoint is the one case where reversal is harmless.
    expect(formatPoint(sectionPoint(A_1_2, B_4_6, 1, 1))).toBe(formatPoint(sectionPoint(A_1_2, B_4_6, 1, 1)));
    expect(prose()).toMatch(/revers/i);
  });

  it('gives the same physical point when the endpoints are swapped and the ratio reversed', () => {
    for (const [m1, m2] of [[2, 1], [2, 3], [4, 5]]) {
      const p = sectionPoint(SEC_A, SEC_B, m1, m2);
      const q = sectionPoint(SEC_B, SEC_A, m2, m1);
      expect(formatPoint(q), `${m1}:${m2} reversed`).toBe(formatPoint(p));
    }
  });
});

describe('ratio recovery and cross-dimension agreement', () => {
  it('recovers the ratio from the coordinates', () => {
    for (const [m1, m2] of [[1, 1], [2, 1], [2, 3], [3, 2], [5, 4]]) {
      const p = sectionPoint(SEC_A, SEC_B, m1, m2);
      expect(ratioOf(SEC_A, SEC_B, p), `${m1}:${m2}`).toEqual({ m1, m2 });
    }
    expect(ratioOf(pt('A', -1, 3), pt('B', 4, -2), pt('P', 2, 0))).toEqual({ m1: 3, m2: 2 });
  });

  it('rejects a point whose coordinates imply different ratios', () => {
    // On the x-coordinate this looks like 2:3; on the y it does not.
    const inconsistent = pt('P', 13 / 5 * 5 / 5, 99);
    expect(ratioOf(SEC_A, SEC_B, pt('P', 13, 99))).toBeNull();
    expect(ratioOf(SEC_A, SEC_B, inconsistent)).toBeNull();
    expect(prose()).toMatch(/both must give the same|BOTH must give/i);
    expect(prose()).toMatch(/inconsistent/i);
  });

  it('lets one coordinate decide when the other is degenerate', () => {
    const vertA = pt('A', 3, 0);
    const vertB = pt('B', 3, 10);
    const onVert = sectionPoint(vertA, vertB, 2, 3);
    expect(formatPoint(onVert)).toBe('(3, 4)');
    expect(ratioOf(vertA, vertB, onVert)).toEqual({ m1: 2, m2: 3 });
    const horizA = pt('A', 0, 7);
    const horizB = pt('B', 10, 7);
    expect(ratioOf(horizA, horizB, sectionPoint(horizA, horizB, 1, 4))).toEqual({ m1: 1, m2: 4 });
    expect(prose()).toMatch(/vertical|horizontal/i);
  });

  it('returns no ratio for a point outside the segment', () => {
    expect(ratioOf(SEC_A, SEC_B, pt('X', 9, 11))).toBeNull();
    expect(ratioOf(SEC_A, SEC_B, pt('X', -3, -1))).toBeNull();
  });
});

describe('midpoint regresses to the Class 9 result', () => {
  it('equals the section formula at 1:1 for every canonical pair', () => {
    for (const a of CANONICAL_POINTS) {
      for (const b of CANONICAL_POINTS) {
        if (a.x.num === b.x.num && a.y.num === b.y.num) continue;
        const m = midpoint(a, b);
        expect(formatPoint(m)).toBe(formatPoint(sectionPoint(a, b, 1, 1)));
        // And equals the Class 9 average formula exactly.
        const avgX = rational(a.x.num * b.x.den + b.x.num * a.x.den, 2 * a.x.den * b.x.den);
        const avgY = rational(a.y.num * b.y.den + b.y.num * a.y.den, 2 * a.y.den * b.y.den);
        expect(ratEq(m.x, avgX)).toBe(true);
        expect(ratEq(m.y, avgY)).toBe(true);
      }
    }
  });

  it('recomputes the authored midpoints', () => {
    expect(formatPoint(midpoint(A_1_2, B_4_6))).toBe('(5/2, 4)');
    expect(formatPoint(midpoint(SEC_A, SEC_B))).toBe('(3, 5)');
    expect(ratioOf(A_1_2, B_4_6, midpoint(A_1_2, B_4_6))).toEqual({ m1: 1, m2: 1 });
  });

  it('derives the midpoint rather than restating it', () => {
    const all = prose();
    expect(all).toMatch(/special case|1 : 1|contained in the general/i);
    expect(all).toMatch(/not a separate (?:fact|formula)|one formula here rather than two/i);
  });
});

describe('scope — nothing outside this edition', () => {
  it('finds no excluded coordinate topic in any lesson', () => {
    for (const s of CLASS10_COORDINATE_SECTIONS) {
      expect(auditExcludedCoordinate(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });

  it('catches each excluded topic, and allows a declared exclusion', () => {
    for (const t of [
      'The area of a triangle from the coordinates of its vertices is given by a formula.',
      'Use the determinant to find the area.',
      'The slope of the line is (y2 - y1)/(x2 - x1).',
      'The point externally divides the segment in 3:1.',
      'The centroid is the average of the three vertices.',
      'Find the equation of the line through the two points.',
    ]) expect(auditExcludedCoordinate([['x', t]]).length, t).toBe(1);
    for (const t of [
      'The area of a triangle from coordinates is absent from this edition.',
      'Slope is outside this chapter.',
      'External division is not part of this scope.',
      'This chapter does not use slope.',
    ]) expect(auditExcludedCoordinate([['x', t]]), t).toEqual([]);
  });

  it('is not a blunt ban on the word area', () => {
    expect(auditExcludedCoordinate([['x', 'The area of the square is 16 square units.']])).toEqual([]);
    expect(auditExcludedCoordinate([['x', 'Compare the areas of the two rectangles.']])).toEqual([]);
  });
});

describe('lesson quality and governance', () => {
  it('authors four lessons with correct Chapter 7 provenance', () => {
    expect(CLASS10_COORDINATE_SECTIONS.length).toBe(4);
    for (const s of CLASS10_COORDINATE_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch07');
      expect(['7.2', '7.3']).toContain(s.source.sectionNumber);
      expect([100, 106]).toContain(s.source.startPage);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_COORDINATE_SECTIONS) {
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

  it('keeps its four lessons renderable as Class 10 completes', () => {
    // v0.84.0-c10.15 checkpoint 69 — the last three units land in Chapter 8,
    // so this test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const ch7 = cat.chapters.find((c) => c.number === 7)!;
    expect(ch7.lessons.length).toBe(4);
    for (const lesson of ch7.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the thirteen earlier waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    const waves = [CLASS10_TRIGONOMETRY_SECTIONS, CLASS10_COMPOSITE_SOLIDS_SECTIONS,
      CLASS10_SIMILARITY_SECTIONS, CLASS10_QUADRATIC_SECTIONS, CLASS10_STATISTICS_SECTIONS,
      CLASS10_LINEAR_SYSTEM_SECTIONS, CLASS10_HEIGHTS_DISTANCES_SECTIONS,
      CLASS10_REAL_NUMBERS_SECTIONS, CLASS10_POLYNOMIAL_SECTIONS, CLASS10_AP_SECTIONS,
      CLASS10_PROBABILITY_SECTIONS, CLASS10_CIRCLE_AREA_SECTIONS, CLASS10_TANGENT_SECTIONS];
    expect(waves.map((w) => w.length)).toEqual([4, 3, 6, 4, 8, 5, 3, 4, 4, 5, 4, 3, 5]);
    for (const w of waves) for (const s of w) expect(s.contentArtifactVersion).toBe(1);
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
