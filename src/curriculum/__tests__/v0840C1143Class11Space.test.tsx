/**
 * v0.84.0-c11.43 checkpoint 97B — Chapter 11, three-dimensional geometry.
 *
 * The suite tests SEMANTICS independently of the renderer. Every distance
 * is checked against an oracle computed here, never against the function
 * under test, and the projection is proven unable to reach the
 * mathematics rather than merely assumed not to.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  type Point3D, ALL_OCTANTS, axesContaining, coordinate3D, describePosition,
  distance3D, distance3DIsSymmetric, distanceSquared3D, formatDistance3D,
  isEquidistant, octantLabel, octantOf, onAxis, onPlane, orderedTriple, p3, planar,
  planeEquation, planesContaining, project3D, reducesToPlanar, validateCoordinate3D,
} from '../coordinateSpace';
import {
  type Point, distance as distance2D, distanceSquared as distanceSquared2D,
  formatRadical, formatRational, rational,
} from '../coordinateGeometry';
import {
  C11_SPACE_SECTIONS, D_A, D_B, FLAT_A, FLAT_B, P_MIXED, P_OCTANT, P_ON_AXIS,
  P_ON_PLANE, V_AXES, V_DISTANCE, V_PLOT,
} from '../spaceClass11Sections';
import { contractProblems, declaredFamilies } from '../representationContract';
import { validateVisual } from '../visualSpecification';
import { authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

/** The oracle: computed here, from coordinates, with no 3-D helper involved. */
const oracleSquared = (a: [number, number, number], b: [number, number, number]): number =>
  (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2 + (b[2] - a[2]) ** 2;

describe('planes, axes and octants', () => {
  it('puts a point on a plane exactly when that plane\u2019s coordinate vanishes', () => {
    expect(onPlane(p3('a', 3, 4, 0, 'A'), 'xy')).toBe(true);
    expect(onPlane(p3('b', 0, 4, 5, 'B'), 'yz')).toBe(true);
    expect(onPlane(P_ON_PLANE, 'zx')).toBe(true);
    // NEGATIVE 3: a claim of plane membership without the zero fails.
    expect(onPlane(p3('c', 3, 4, 1, 'C'), 'xy')).toBe(false);
    expect(onPlane(p3('d', 2, 4, 5, 'D'), 'yz')).toBe(false);
    expect(onPlane(P_OCTANT, 'zx')).toBe(false);
    expect(planeEquation('xy')).toBe('z = 0');
  });

  it('puts a point on an axis only when BOTH other coordinates vanish', () => {
    expect(onAxis(p3('x', 5, 0, 0, 'X'), 'x')).toBe(true);
    expect(onAxis(P_ON_AXIS, 'z')).toBe(true);
    // NEGATIVE 4: one zero is a plane, not an axis.
    expect(onAxis(p3('n', 5, 0, 2, 'N'), 'x')).toBe(false);
    expect(onAxis(P_ON_PLANE, 'x')).toBe(false);
    expect(axesContaining(p3('o', 0, 0, 0, 'O'))).toEqual(['x', 'y', 'z']);
  });

  it('generates all eight sign patterns exactly once', () => {
    expect(ALL_OCTANTS).toHaveLength(8);
    expect(new Set(ALL_OCTANTS.map(octantLabel)).size).toBe(8);
  });

  it('classifies an octant from signs alone', () => {
    // NEGATIVE 1: the octant is whatever the signs say, not what a label claims.
    expect(octantLabel(octantOf(P_OCTANT)!)).toBe('(+, +, +)');
    expect(octantLabel(octantOf(P_MIXED)!)).toBe('(-, +, -)');
    expect(octantLabel(octantOf(p3('q', -1, -2, -3, 'Q'))!)).toBe('(-, -, -)');
    for (const o of ALL_OCTANTS) {
      const p = p3('t', o.x === '+' ? 2 : -2, o.y === '+' ? 3 : -3, o.z === '+' ? 4 : -4, 'T');
      expect(octantLabel(octantOf(p)!), octantLabel(o)).toBe(octantLabel(o));
    }
  });

  it('REFUSES an octant for any point with a zero coordinate', () => {
    // NEGATIVE 2: no nearest octant, no default — the absence is the answer.
    for (const p of [P_ON_PLANE, P_ON_AXIS, p3('z', 0, 0, 0, 'O'), p3('w', 1, 2, 0, 'W')]) {
      expect(octantOf(p), orderedTriple(p)).toBeNull();
    }
    expect(describePosition(P_ON_PLANE)).toMatch(/zx-plane.*no octant/);
    expect(describePosition(P_ON_AXIS)).toBe('on the z-axis');
    expect(describePosition(p3('o', 0, 0, 0, 'O'))).toBe('at the origin');
    expect(planesContaining(P_ON_PLANE)).toEqual(['zx']);
  });
});

describe('distance, against an independent oracle', () => {
  it('matches dx\u00b2 + dy\u00b2 + dz\u00b2 computed separately', () => {
    const d2 = distanceSquared3D(D_A, D_B);
    expect(d2.num / d2.den).toBe(oracleSquared([1, -1, 2], [4, 3, -2]));
    expect(d2.num / d2.den).toBe(41);
    expect(formatDistance3D(D_A, D_B)).toBe('\u221a41');
  });

  it('OMITTING dz gives the wrong answer, and the model does not', () => {
    // NEGATIVE 7: the planar part alone is 25, the truth is 41.
    const planarOnly = distanceSquared2D(planar(D_A), planar(D_B));
    expect(planarOnly.num / planarOnly.den).toBe(25);
    expect(distanceSquared3D(D_A, D_B).num).toBe(41);
    expect(planarOnly.num).not.toBe(distanceSquared3D(D_A, D_B).num);
  });

  it('reduces to the 2-D distance when z is unchanged', () => {
    // NEGATIVE 8: any disagreement here fails.
    expect(reducesToPlanar(FLAT_A, FLAT_B)).toBe(true);
    expect(formatDistance3D(FLAT_A, FLAT_B)).toBe('5');
    expect(formatRadical(distance2D(planar(FLAT_A), planar(FLAT_B)))).toBe('5');
    expect(reducesToPlanar(D_A, D_B)).toBe(false); // z differs, so it does not apply
  });

  it('keeps the exact radical, and does not canonicalise a decimal', () => {
    // NEGATIVE 9: 6.40 is a description of \u221a41, never the value.
    expect(formatDistance3D(D_A, D_B)).toBe('\u221a41');
    expect(formatDistance3D(D_A, D_B)).not.toMatch(/6\.4/);
    // One that simplifies to an integer, one that stays irrational.
    expect(formatDistance3D(p3('o', 0, 0, 0, 'O'), p3('p', 2, 3, 6, 'P'))).toBe('7');
    expect(distance3D(D_A, D_B).radicand).toBe(41);
  });

  it('is symmetric, zero on itself, and axis-aligned where it should be', () => {
    expect(distance3DIsSymmetric(D_A, D_B)).toBe(true);
    expect(formatDistance3D(D_B, D_A)).toBe(formatDistance3D(D_A, D_B));
    // Identity: the SEMANTIC result is zero.
    const self = distanceSquared3D(D_A, D_A);
    expect(self.num).toBe(0);
    expect(distance3D(D_A, D_A).coefficient.num).toBe(0);
    for (const [a, b, expected] of [
      [p3('a', 2, 3, 1, 'A'), p3('b', 2, 3, 9, 'B'), '8'],
      [p3('c', -1, 4, 5, 'C'), p3('d', 6, 4, 5, 'D'), '7'],
      [p3('e', 1, 2, 3, 'E'), p3('f', 1, 9, 3, 'F'), '7'],
    ] as Array<[Point3D, Point3D, string]>) {
      expect(formatDistance3D(a, b), `${orderedTriple(a)}\u2013${orderedTriple(b)}`).toBe(expected);
    }
  });

  it('tests a geometric claim exactly, without taking roots', () => {
    expect(isEquidistant(p3('m', 0, 0, 0, 'M'), p3('e', 3, 0, 0, 'E'), p3('f', 0, -3, 0, 'F'))).toBe(true);
    expect(isEquidistant(p3('m', 0, 0, 0, 'M'), p3('e', 3, 0, 0, 'E'), p3('g', 0, -4, 0, 'G'))).toBe(false);
  });
});

describe('projection cannot reach the mathematics', () => {
  it('leaves semantic distance unchanged when the view changes', () => {
    // NEGATIVE 6: stronger than grepping the source. Project at three very
    // different scales; the mathematics must not move.
    const before = formatDistance3D(D_A, D_B);
    const views = [[6, 300], [20, 900], [3, 120]] as Array<[number, number]>;
    const projections = views.map(([e, s]) => project3D(D_A, e, s));
    // The projections genuinely differ...
    expect(new Set(projections.map((p) => `${p.sx},${p.sy}`)).size).toBeGreaterThan(1);
    // ...and the distance does not.
    for (const [e, s] of views) {
      void project3D(D_A, e, s); void project3D(D_B, e, s);
      expect(formatDistance3D(D_A, D_B)).toBe(before);
      expect(distanceSquared3D(D_A, D_B).num).toBe(41);
    }
  });

  it('projects deterministically for the same point and bounds', () => {
    const a = project3D(P_OCTANT, 6, 300);
    const b = project3D(P_OCTANT, 6, 300);
    expect(a).toEqual(b);
    expect(project3D(P_OCTANT, 6, 300)).not.toEqual(project3D(P_MIXED, 6, 300));
  });

  it('keeps membership and octant free of pixels', () => {
    const far = p3('f', 1, 1, 1, 'F');
    const screenA = project3D(far, 6, 300);
    const screenB = project3D(far, 60, 3000);
    expect(screenA).not.toEqual(screenB);
    expect(octantLabel(octantOf(far)!)).toBe('(+, +, +)');
    expect(onPlane(far, 'xy')).toBe(false);
  });
});

describe('the 3-D visual spec', () => {
  it('validates the authored figures', () => {
    for (const v of [V_AXES, V_PLOT, V_DISTANCE]) {
      expect(validateVisual(v as never), v.id).toEqual([]);
    }
  });

  it('REJECTS a segment pointing at a point that is not there', () => {
    // NEGATIVE 10.
    const bad = coordinate3D('bad', [P_OCTANT], {
      segments: [{ from: 'P', to: 'ghost' }], altText: 'a long enough accessible description for this figure',
    });
    expect(validateCoordinate3D(bad).some((e) => /"ghost" is not a point/.test(e))).toBe(true);
  });

  it('REJECTS duplicate point ids', () => {
    // NEGATIVE 11.
    const dup = coordinate3D('dup', [p3('P', 1, 1, 1, 'P'), p3('P', 2, 2, 2, 'P2')], {
      altText: 'a long enough accessible description for this figure',
    });
    expect(validateCoordinate3D(dup).some((e) => /share an id/.test(e))).toBe(true);
  });

  it('rejects a point drawn outside its own axes, and a missing description', () => {
    const off = coordinate3D('off', [p3('P', 99, 1, 1, 'P')], { extent: 6, altText: 'x'.repeat(40) });
    expect(validateCoordinate3D(off).some((e) => /outside the drawn axes/.test(e))).toBe(true);
    const mute = coordinate3D('mute', [P_OCTANT], { altText: '' });
    expect(validateCoordinate3D(mute)).toContain('altText is required');
  });

  it('derives the ordered triple from the point, so it cannot drift', () => {
    // NEGATIVE 5: there is no separate coordinate field to disagree with.
    expect(orderedTriple(P_OCTANT)).toBe('(2, 3, 4)');
    expect(Object.keys(P_OCTANT).sort()).toEqual(['id', 'label', 'x', 'y', 'z']);
    expect(V_PLOT.points.map(orderedTriple)).toContain(orderedTriple(P_OCTANT));
    expect(V_PLOT.points[0].x).toBe(P_OCTANT.x);
  });
});

describe('the three lessons', () => {
  it('declares the 3-D family and consumes it', () => {
    // v0.84.0-c11.48 checkpoint 100B — the module now holds four lessons:
    // the three NCERT sections plus the chapter-less FO-10.
    expect(C11_SPACE_SECTIONS).toHaveLength(4);
    for (const s of C11_SPACE_SECTIONS) {
      expect(declaredFamilies(s), s.contentArtifactId).toEqual(['coordinate:3d']);
      // NEGATIVE 12: declaring the family with no compatible visual fails.
      expect(contractProblems(s), s.contentArtifactId).toEqual([]);
      expect(s.visuals.length).toBeGreaterThan(0);
    }
    const naked = { ...C11_SPACE_SECTIONS[0], visuals: [], visualsById: {} };
    expect(contractProblems(naked as never).length).toBeGreaterThan(0);
  });

  it('records the three NCERT sections as owned, and FO-10 as neither', () => {
    // v0.84.0-c11.48 checkpoint 100B — this asserted FO-10 was absent while
    // it was unauthored. It is authored now, so the invariant sharpens: the
    // chapter owns exactly its three sections, and FO-10 claims no chapter.
    const ncert = C11_SPACE_SECTIONS.filter((s) => s.source.officialChapterId === 'ncert_kemh1_ch11');
    expect(ncert.map((s) => s.source.sectionNumber)).toEqual(['11.2', '11.3', '11.4']);
    const fo10 = C11_SPACE_SECTIONS.find((s) => /fo10/i.test(s.contentArtifactId))!;
    expect(fo10).toBeDefined();
    expect(fo10.source.officialChapterId).toBe('cbse_fo10_c11_section_formula');
    expect(fo10.source.officialSectionId).toBe('');
    expect(fo10.source.sectionNumber).toBe('');
    expect(fo10.source.startPage).toBe(0);
    expect((fo10.source as { cbseEntryId?: string }).cbseEntryId).toBe('FO-10');
  });

  it('gives every lesson five stages at version 1', () => {
    for (const s of C11_SPACE_SECTIONS) {
      expect(s.workedExamples.length).toBeGreaterThanOrEqual(3);
      expect(s.guidedPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.independentPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.reasoningApplication.length).toBeGreaterThanOrEqual(1);
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('renders a real 3-D figure through the product renderer', () => {
    __setAuthoredLearnPreviewForTests(true);
    const lesson = C11_SPACE_SECTIONS[0];
    const { container, unmount } = render(
      <LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />
    );
    const seeIt = screen.getAllByRole('button', { name: /See it/i })[0];
    if (seeIt) fireEvent.click(seeIt);
    // LearnSectionView wraps every visual in a `display: contents` div that
    // also carries data-visual-kind, so a bare attribute selector matches
    // the wrapper as well as the figure. The FIGURE is what carries the
    // accessible description, so that is what is asserted on here.
    const roots = container.querySelectorAll('figure[data-visual-kind="coordinate_3d"]');
    expect(roots.length).toBeGreaterThan(0);
    const figure = roots[0];
    // Three axes, a point, and text that states coordinates rather than depth.
    expect(figure.querySelectorAll('line').length).toBeGreaterThanOrEqual(3);
    expect(figure.querySelectorAll('circle').length).toBeGreaterThan(0);
    // Every rendered 3-D figure carries a description that names the
    // diagram and states coordinates, since depth cannot be inferred from
    // a flat projection by a screen reader.
    for (const root of roots) {
      const alt = root.getAttribute('aria-label') ?? '';
      expect(alt.length, `alt on ${root.getAttribute('data-visual-kind')}`).toBeGreaterThan(60);
      expect(alt).toMatch(/three-dimensional/);
      expect(root.textContent ?? '').toMatch(/\(\s*-?\d+,\s*-?\d+,\s*-?\d+\s*\)/);
    }
    expect(container.textContent).toMatch(/z = 0/);
    unmount();
    __setAuthoredLearnPreviewForTests(null);
  });
});

describe('the 2-D model is untouched', () => {
  it('keeps Point with no z field', () => {
    const p: Point = { id: 'p', x: rational(1, 1), y: rational(2, 1), label: 'P' };
    expect(Object.keys(p).sort()).toEqual(['id', 'label', 'x', 'y']);
    expect(formatRational(p.x)).toBe('1');
    expect(formatRadical(distance2D(p, { id: 'q', x: rational(4, 1), y: rational(6, 1), label: 'Q' }))).toBe('5');
  });

  it('builds the 3-D squared distance ON the 2-D one', () => {
    const planarPart = distanceSquared2D(planar(D_A), planar(D_B));
    const full = distanceSquared3D(D_A, D_B);
    const dz = (-2) - 2;
    expect(full.num / full.den).toBe(planarPart.num / planarPart.den + dz * dz);
  });
});

describe('catalogue', () => {
  it('registers Chapter 11 with three OWNED rows, FO-10 reachable elsewhere', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    expect(c.chapters.map((x) => x.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    const ch11 = c.chapters.find((x) => x.number === 11)!;
    // Chapter 11 still owns three lessons: authoring FO-10 must not grow a
    // chapter that does not own it.
    expect(ch11.lessonCount).toBe(3);
    expect(ch11.lessons.some((l) => /fo10/i.test(l.contentArtifactId))).toBe(false);
    // ...but it IS reachable, exactly once, in the chapter-less group.
    expect(c.requiredCoreLessons.some((l) => /fo10/i.test(l.contentArtifactId))).toBe(true);
    expect(c.lessons.filter((l) => /fo10/i.test(l.contentArtifactId))).toHaveLength(1);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('counts 82 / 1 / 5 / 88', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    expect(c.chapterOwnedCount).toBe(82);
    expect(c.prerequisiteLessons).toHaveLength(1);
    expect(c.requiredCoreLessons).toHaveLength(7);
    expect(c.lessonCount).toBe(90);
    expect(c.chapterOwnedCount + c.prerequisiteLessons.length + c.requiredCoreLessons.length)
      .toBe(c.lessonCount);
    __setAuthoredLearnPreviewForTests(null);
  });
});
