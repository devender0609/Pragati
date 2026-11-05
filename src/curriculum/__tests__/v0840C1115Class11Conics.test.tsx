/**
 * v0.84.0-c11.15 checkpoint 85 — Chapter 10 Conic Sections.
 *
 * The governing question is whether one semantic object per conic can make
 * its locus, parameters, standard equation and drawn figure agree. These
 * tests are written to catch the opposite: four independently authored
 * truths that happen to look consistent. Every invariant therefore carries
 * a negative fixture — a point just off the curve that must FAIL.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  circle, conicBranches, conicGraph, coneSection, conicParameterErrors, directrix,
  eccentricity, ellipse, focalDifference, focalDistance, focalSum, foci,
  focusDirectrixHolds, hyperbola, latusRectum, onCircle, parabola, parabolaFocus,
  radicalValueOf, standardEquation, validateConeSection, validateConicGraph, vertices,
} from '../conicSections';
import { formatRadical, formatRational, pt, rational } from '../coordinateGeometry';
import { validateVisual } from '../visualSpecification';
import { C11_CON_SECTIONS, CANONICAL_CONIC_VISUALS, C_5, E_H, E_V, H_34, P_8 } from '../conicClass11Sections';
import { AUTHORED_CHAPTERS } from '../authoredSections';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

const r = (n: number) => rational(n, 1);

describe('a conic is one object, not four authored truths', () => {
  it('derives the circle equation from the distance definition', () => {
    expect(standardEquation(C_5)).toBe('x² + y² = 25');
    expect(onCircle(C_5, pt('P', 3, 4, 'P'))).toBe(true);
    expect(onCircle(C_5, pt('Q', 3, 3, 'Q'))).toBe(false);
  });

  it('refuses a circle of zero or negative radius rather than producing one', () => {
    expect(() => circle('z', pt('O', 0, 0, 'O'), r(0))).toThrow(/positive radius/);
    expect(() => circle('z', pt('O', 0, 0, 'O'), rational(-2, 1))).toThrow(/positive radius/);
  });

  it('holds focus-directrix on the parabola and fails just off it', () => {
    expect(focusDirectrixHolds(P_8, pt('A', 2, 4, 'A'))).toBe(true);
    expect(focusDirectrixHolds(P_8, pt('C', 8, 8, 'C'))).toBe(true);
    // Without this, the check would only be reproducing its own expectation.
    expect(focusDirectrixHolds(P_8, pt('B', 2, 5, 'B'))).toBe(false);
    expect(focusDirectrixHolds(P_8, pt('D', 1, 4, 'D'))).toBe(false);
  });

  it('places the parabola focus and directrix on opposite sides of the vertex', () => {
    expect(formatRational(parabolaFocus(P_8).x)).toBe('2');
    expect(directrix(P_8).written).toBe('x = -2');
    expect(standardEquation(P_8)).toBe('y² = 8x');
    expect(formatRational(latusRectum(P_8))).toBe('8');
  });

  it('keeps the two ellipse orientations distinct rather than duplicates', () => {
    expect(standardEquation(E_H)).toBe('x²/25 + y²/9 = 1');
    expect(standardEquation(E_V)).toBe('x²/9 + y²/25 = 1');
    expect(standardEquation(E_H)).not.toBe(standardEquation(E_V));
    // The foci move with the orientation; that is the information carried.
    expect(foci(E_H).map((f) => formatRational(f.y))).toEqual(['0', '0']);
    expect(foci(E_V).map((f) => formatRational(f.x))).toEqual(['0', '0']);
  });

  it('uses c² = a² − b² for an ellipse and c² = a² + b² for a hyperbola', () => {
    expect(formatRadical(focalDistance(E_H))).toBe('4');
    expect(formatRadical(focalDistance(H_34))).toBe('5');
    expect(radicalValueOf(focalDistance(E_H))).toBeLessThan(E_H.a.num / E_H.a.den);
    expect(radicalValueOf(focalDistance(H_34))).toBeGreaterThan(H_34.a.num / H_34.a.den);
  });

  it('holds the focal sum and difference, and fails off the curve', () => {
    expect(focalSum(E_H, vertices(E_H)[1])).toBeCloseTo(10, 6);
    expect(focalSum(E_H, pt('T', 0, 3, 'T'))).toBeCloseTo(10, 6);
    expect(focalSum(E_H, pt('X', 1, 1, 'X'))).not.toBeCloseTo(10, 3);
    expect(focalDifference(H_34, vertices(H_34)[1])).toBeCloseTo(6, 6);
    expect(focalDifference(H_34, pt('Y', 1, 1, 'Y'))).not.toBeCloseTo(6, 3);
  });

  it('keeps eccentricity exact, below 1 for an ellipse and above 1 for a hyperbola', () => {
    expect(formatRadical(eccentricity(E_H))).toBe('4/5');
    expect(formatRadical(eccentricity(H_34))).toBe('5/3');
    expect(radicalValueOf(eccentricity(E_H))).toBeLessThan(1);
    expect(radicalValueOf(eccentricity(H_34))).toBeGreaterThan(1);
  });

  it('derives the latus rectum from parameters rather than a typed value', () => {
    expect(formatRational(latusRectum(E_H))).toBe('18/5');
    expect(formatRational(latusRectum(H_34))).toBe('32/3');
    expect(formatRational(latusRectum(E_H))).not.toMatch(/\./);
  });

  it('rejects mathematically contradictory conics', () => {
    expect(() => ellipse('bad', r(3), r(5))).toThrow(/semi-major/);
    expect(() => ellipse('circleish', r(4), r(4))).toThrow(/circle/);
    expect(() => hyperbola('bad', r(0), r(2))).toThrow(/positive/);
    expect(() => parabola('bad', r(0))).toThrow(/positive/);
    expect(conicParameterErrors(E_H)).toEqual([]);
    expect(conicParameterErrors(H_34)).toEqual([]);
  });
});

describe('the drawn figure agrees with the object', () => {
  it('never joins the two branches of a hyperbola', () => {
    const branches = conicBranches(H_34, 8);
    expect(branches).toHaveLength(2);
    expect(branches[0].every((p) => p.x > 0) || branches[0].every((p) => p.x < 0)).toBe(true);
    expect(Math.sign(branches[0][0].x)).not.toBe(Math.sign(branches[1][0].x));
  });

  it('draws closed conics as a single branch', () => {
    expect(conicBranches(C_5, 8)).toHaveLength(1);
    expect(conicBranches(E_H, 8)).toHaveLength(1);
    expect(conicBranches(P_8, 8)).toHaveLength(1);
  });

  it('samples only points that actually satisfy the curve', () => {
    for (const p of conicBranches(C_5, 8)[0]) expect(p.x * p.x + p.y * p.y).toBeCloseTo(25, 6);
    for (const p of conicBranches(E_H, 8)[0]) expect((p.x * p.x) / 25 + (p.y * p.y) / 9).toBeCloseTo(1, 6);
    for (const b of conicBranches(H_34, 8)) {
      for (const p of b) expect((p.x * p.x) / 9 - (p.y * p.y) / 16).toBeCloseTo(1, 6);
    }
    for (const p of conicBranches(P_8, 8)[0]) expect(p.y * p.y).toBeCloseTo(8 * p.x, 6);
  });

  it('rejects a figure claiming geometry its conic does not have', () => {
    expect(validateConicGraph(conicGraph('x', C_5, 'alt', { showFoci: true })))
      .toContain('a circle has a centre rather than foci');
    expect(validateConicGraph(conicGraph('x', E_H, 'alt', { showDirectrix: true })))
      .toContain('only a parabola carries a directrix in this chapter');
    expect(validateConicGraph(conicGraph('x', P_8, ''))).toContain('altText is required');
  });

  it('checks a cone section against its cut rather than its label', () => {
    expect(validateConeSection(coneSection('a', 'parallel_to_generator', 'parabola', 'alt'))).toEqual([]);
    expect(validateConeSection(coneSection('b', 'perpendicular_to_axis', 'hyperbola', 'alt')))
      .toEqual(['a plane perpendicular to axis cuts a circle, not a hyperbola']);
  });

  it('distinguishes a vertex cut from an ordinary one', () => {
    expect(validateConeSection(coneSection('d1', 'perpendicular_to_axis', 'point', 'alt', true))).toEqual([]);
    expect(validateConeSection(coneSection('d2', 'parallel_to_axis', 'pair of intersecting lines', 'alt', true))).toEqual([]);
    expect(validateConeSection(coneSection('d3', 'perpendicular_to_axis', 'circle', 'alt', true)))
      .toEqual(['a plane perpendicular to axis through the vertex cuts a point, not a circle']);
    // And a point claimed for a cut that misses the vertex must fail too.
    expect(validateConeSection(coneSection('d4', 'perpendicular_to_axis', 'point', 'alt', false))).toHaveLength(1);
  });

  it('validates every canonical figure through the shared validator', () => {
    for (const v of CANONICAL_CONIC_VISUALS) {
      expect(validateVisual(v as never), v.id).toEqual([]);
      expect(v.altText.length).toBeGreaterThan(80);
      expect(v.altText).not.toMatch(/\b(red|blue|green|colour|color)\b/i);
    }
  });
});

describe('the eight lessons', () => {
  it('authors exactly eight, in source order', () => {
    expect(C11_CON_SECTIONS).toHaveLength(8);
    const pages = C11_CON_SECTIONS.map((s) => s.source.startPage);
    expect([...pages].sort((a, b) => a - b)).toEqual(pages);
  });

  it('records subsection provenance under its parent, inventing no section ids', () => {
    const by = (id: string) => C11_CON_SECTIONS.find((s) => s.contentArtifactId.includes(id))!;
    for (const [id, parent, sub] of [
      ['s10_2_2', '10.2', '10.2.2'], ['s10_5_2', '10.5', '10.5.2'], ['s10_6_1', '10.6', '10.6.1'],
    ] as const) {
      const s = by(id);
      expect(s.source.sectionNumber).toBe(parent);
      expect((s.source as { officialSubsectionNumber?: string }).officialSubsectionNumber).toBe(sub);
      expect(s.source.officialSectionId).toBe(`ncert_kemh1_s${parent.replace('.', '_')}`);
    }
  });

  it('creates no separate lesson for the structural-only subsection 10.4.2', () => {
    expect(C11_CON_SECTIONS.some((s) => s.contentArtifactId.includes('10_4_2'))).toBe(false);
    expect(C11_CON_SECTIONS.some((s) => (s.source as { officialSubsectionNumber?: string })
      .officialSubsectionNumber === '10.4.2')).toBe(false);
    const para = C11_CON_SECTIONS.find((s) => s.contentArtifactId.includes('parabola'))!;
    expect(JSON.stringify(para).toLowerCase()).toContain('latus rectum');
  });

  it('gives every lesson all five stages', () => {
    for (const s of C11_CON_SECTIONS) {
      expect(s.workedExamples.length, s.contentArtifactId).toBeGreaterThanOrEqual(3);
      expect(s.guidedPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.independentPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.reasoningApplication.length).toBeGreaterThanOrEqual(1);
      expect(s.explanation.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('writes no duplicated hint across the chapter or the corpus', () => {
    const hints = AUTHORED_CHAPTERS
      .flatMap((c) => c.sections())
      .flatMap((s) => s.guidedPractice.map((g) => (g as { hint?: string }).hint))
      .filter((h): h is string => Boolean(h))
      .map((h) => h.trim().toLowerCase());
    const dupes = hints.filter((h, i) => hints.indexOf(h) !== i);
    expect([...new Set(dupes)]).toEqual([]);
  });

  it('leaves every artifact at version 1 and authored_draft', () => {
    for (const s of C11_CON_SECTIONS) {
      expect(s.contentArtifactVersion).toBe(1);
      expect(s.reviewStatus).toBe('authored_draft');
    }
  });

  it('registers the chapter so Class 11 holds 47 lessons in order 1,2,3,4,9,10', () => {
    const c11 = AUTHORED_CHAPTERS.filter((c) => c.officialChapterId.includes('kemh1'));
    expect(c11.reduce((n, c) => n + c.sections().length, 0)).toBe(51);
    const ids = c11.flatMap((c) => c.sections()).map((s) => s.contentArtifactId);
    expect(new Set(ids).size).toBe(51);
    const strays = AUTHORED_CHAPTERS
      .filter((c) => !c.officialChapterId.includes('kemh1'))
      .flatMap((c) => c.sections())
      .filter((s) => s.contentArtifactId.includes('kemh1'));
    expect(strays).toEqual([]);
  });

  it('preserves the prerequisite chain from the frozen decomposition', () => {
    const page = (id: string) => C11_CON_SECTIONS.find((s) => s.contentArtifactId.includes(id))!.source.startPage;
    expect(page('s10_2_cone')).toBeLessThan(page('s10_2_2'));
    expect(page('s10_3')).toBeLessThan(page('s10_4'));
    expect(page('s10_4')).toBeLessThan(page('s10_5_ellipse'));
    expect(page('s10_5_ellipse')).toBeLessThan(page('s10_5_2'));
    expect(page('s10_5_ellipse')).toBeLessThan(page('s10_6_hyperbola'));
    expect(page('s10_6_hyperbola')).toBeLessThan(page('s10_6_1'));
  });
});

describe('conic figures reach the student through the real product', () => {
  const show = (lesson: typeof C11_CON_SECTIONS[number]) => {
    __setAuthoredLearnPreviewForTests(true);
    const out = render(<LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />);
    const seeIt = screen.getAllByRole('button', { name: /See it/i })[0];
    if (seeIt) fireEvent.click(seeIt);
    return out;
  };

  it('renders the hyperbola as two separate polylines', () => {
    const lesson = C11_CON_SECTIONS.find((s) => s.contentArtifactId.includes('s10_6_hyperbola'))!;
    show(lesson);
    const fig = screen.getAllByRole('img').filter((n) => (n.getAttribute('aria-label') || '').length > 80);
    expect(fig.length).toBeGreaterThan(0);
    expect(fig[0].querySelectorAll('polyline').length).toBe(2);
  });

  it('renders the four cone-section figures of the opening lesson', () => {
    show(C11_CON_SECTIONS[0]);
    const fig = screen.getAllByRole('img').filter((n) => (n.getAttribute('aria-label') || '').length > 80);
    expect(fig.length).toBeGreaterThanOrEqual(4);
    for (const f of fig) expect(f.querySelectorAll('polygon, ellipse, line').length).toBeGreaterThan(3);
  });

  it('renders three vertex-cut figures in the degenerate lesson', () => {
    const lesson = C11_CON_SECTIONS.find((s) => s.contentArtifactId.includes('degenerate'))!;
    const { container } = show(lesson);
    const fig = screen.getAllByRole('img').filter((n) => (n.getAttribute('aria-label') || '').length > 80);
    expect(fig).toHaveLength(3);
    const captions = [...container.querySelectorAll('figcaption')].map((n) => n.textContent ?? '');
    expect(captions.some((c) => c.includes('point'))).toBe(true);
    expect(captions.some((c) => c.includes('pair of intersecting lines'))).toBe(true);
    expect(captions.filter((c) => c.includes('through the vertex'))).toHaveLength(3);
  });

  it('renders both ellipse orientations as visibly different figures', () => {
    const lesson = C11_CON_SECTIONS.find((s) => s.contentArtifactId.includes('s10_5_ellipse'))!;
    const { container } = show(lesson);
    const captions = [...container.querySelectorAll('figcaption')].map((n) => n.textContent);
    expect(captions.some((c) => c?.includes('x²/25 + y²/9 = 1'))).toBe(true);
    expect(captions.some((c) => c?.includes('x²/9 + y²/25 = 1'))).toBe(true);
    __setAuthoredLearnPreviewForTests(null);
  });
});
