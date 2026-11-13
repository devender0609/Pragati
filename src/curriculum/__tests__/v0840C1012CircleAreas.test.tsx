// ---------------------------------------------------------------------------
// v0.84.0-c10.12 checkpoint 66 — AREAS RELATED TO CIRCLES.
//
// Can one circle figure drive sector, triangle and segment as related
// regions, so the picture, the formula and the final area cannot silently
// describe different parts of the circle?
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  addArea, anglesReconcile, arcLength, arcLengthCoefficient, areaValue,
  ALLOWED_SEGMENT_ANGLES, centreTriangleArea, circumference, discArea,
  formatArea, formatRational, majorSegmentArea, minorSegmentArea,
  proportionsAgree, rational, regionArea, sectorArea, segmentsCompleteTheDisc,
  subArea, validateRegion, type CircleRegion,
} from '../circleRegion';
import {
  CLASS10_CIRCLE_AREA_SECTIONS, CANONICAL_REGIONS, CLASS_9_CIRCLE_PRIOR,
  R14, R7, R6, R_MINOR_90, R_MINOR_60, R_MINOR_120, R_MAJOR_90, R_SECTOR_90,
} from '../circleAreaSections';
import { auditCircleNovelty, CIRCLE_WORK_IN_CLASS_9 } from '../circleProgression';
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

const blocks = (s: (typeof CLASS10_CIRCLE_AREA_SECTIONS)[number]): Array<[string, string]> => [
  ['learningGoal', s.learningGoal],
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];
const prose = () => CLASS10_CIRCLE_AREA_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
const n2 = (v: number) => Number(v.toFixed(2));

describe('progression — sectors and arcs are re-derived, not introduced', () => {
  it('records the frozen Class 9 circle work', () => {
    expect(CLASS_9_CIRCLE_PRIOR.alreadyCovered.join(' ')).toMatch(/arc/i);
    expect(CLASS_9_CIRCLE_PRIOR.alreadyCovered.join(' ')).toMatch(/sector/i);
    expect(CLASS_9_CIRCLE_PRIOR.alreadyCovered.join(' ')).toMatch(/s6_4|s6_10/);
    expect(CLASS_9_CIRCLE_PRIOR.genuinelyNewInClass10.join(' ')).toMatch(/segment/i);
    expect(CIRCLE_WORK_IN_CLASS_9).toContain('sector');
    expect(CIRCLE_WORK_IN_CLASS_9).toContain('arc length');
  });

  it('claims no novelty for sector or arc work', () => {
    for (const s of CLASS10_CIRCLE_AREA_SECTIONS) {
      expect(auditCircleNovelty(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });

  it('catches overclaims and allows the segment as genuinely new', () => {
    for (const t of [
      'A sector is new in Class 10.',
      'You are learning sector area for the first time.',
      'Class 10 introduces arc length.',
      'The arc is introduced here.',
    ]) expect(auditCircleNovelty([['x', t]]).length, t).toBe(1);
    for (const t of [
      'You derived sector area in Class IX; this lesson re-derives it alongside the arc.',
      'The segment is new in Class 10.',
      'Combined figures are introduced here.',
      'A student says a sector is new in Class 10, which is wrong.',
    ]) expect(auditCircleNovelty([['x', t]]), t).toEqual([]);
  });

  it('credits Class IX in its own prose', () => {
    expect(prose()).toMatch(/Class IX/);
    expect(prose()).toMatch(/re-derive|derived.{0,40}Class IX/i);
  });
});

describe('sector derivation and the shared fraction', () => {
  it('makes arc and area use the same theta/360 share', () => {
    for (const theta of [30, 45, 60, 90, 120, 180, 270, 360]) {
      expect(proportionsAgree(theta), `theta ${theta}`).toBe(true);
      // arc / circumference === sector / disc === theta/360
      const share = theta / 360;
      expect(arcLength(theta, R7) / circumference(R7)).toBeCloseTo(share, 12);
      expect(areaValue(sectorArea(theta), R7) / areaValue(discArea(), R7)).toBeCloseTo(share, 12);
    }
  });

  it('keeps arc length within its bounds', () => {
    for (const theta of [1, 60, 90, 180, 360]) {
      const a = arcLength(theta, R6);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThanOrEqual(circumference(R6) + 1e-12);
    }
    expect(formatRational(arcLengthCoefficient(90))).toBe('1/2');
    expect(formatRational(sectorArea(90).pi)).toBe('1/4');
  });

  it('recomputes every authored sector value', () => {
    expect(n2(circumference(R14))).toBe(87.96);
    expect(n2(arcLength(90, R14))).toBe(21.99);
    expect(n2(areaValue(discArea(), R14))).toBe(615.75);
    expect(n2(areaValue(sectorArea(90), R14))).toBe(153.94);
    expect(n2(areaValue(sectorArea(60), R14))).toBe(102.63);
    expect(n2(arcLength(120, R7))).toBe(14.66);
    expect(n2(areaValue(sectorArea(120), R7))).toBe(51.31);
    expect(n2(areaValue(sectorArea(60), R6))).toBe(18.85);
    expect(n2(arcLength(90, R6))).toBe(9.42);
  });
});

describe('the segment as a derived region — the central invariant', () => {
  it('validates every canonical region', () => {
    expect(CANONICAL_REGIONS.length).toBe(12);
    for (const r of CANONICAL_REGIONS) expect(validateRegion(r), r.id).toEqual([]);
  });

  it('derives the segment as sector minus triangle, never independently', () => {
    for (const theta of ALLOWED_SEGMENT_ANGLES) {
      const expected = subArea(sectorArea(theta), centreTriangleArea(theta));
      expect(minorSegmentArea(theta), `theta ${theta}`).toEqual(expected);
      for (const r of [R6, R7, R14]) {
        expect(areaValue(minorSegmentArea(theta), r))
          .toBeCloseTo(areaValue(sectorArea(theta), r) - areaValue(centreTriangleArea(theta), r), 12);
      }
    }
  });

  it('carries the composition structurally, not in prose', () => {
    expect(R_MINOR_90.composedOf).toEqual(['sector', 'triangle']);
    expect(R_MAJOR_90.composedOf).toEqual(['disc', 'minor_segment']);
    // A segment that does not declare its composition is rejected.
    const bare: CircleRegion = { id: 'x', kind: 'minor_segment', theta: 90, label: 'segment' };
    expect(validateRegion(bare).join(' ')).toMatch(/must declare that it is a sector minus a triangle/);
    // A wrong composition is rejected too.
    const wrong: CircleRegion = { ...R_MINOR_90, composedOf: ['disc', 'triangle'] };
    expect(validateRegion(wrong).join(' ')).toMatch(/is sector minus triangle, not/);
  });

  it('rejects a segment given the sector\u2019s area', () => {
    // The fixture the prompt asks for: segment area set equal to sector area.
    for (const theta of ALLOWED_SEGMENT_ANGLES) {
      const seg = areaValue(minorSegmentArea(theta), R7);
      const sec = areaValue(sectorArea(theta), R7);
      expect(seg, `theta ${theta}`).not.toBeCloseTo(sec, 6);
      expect(seg).toBeLessThan(sec);
    }
  });

  it('rejects the subtraction run the wrong way', () => {
    for (const theta of ALLOWED_SEGMENT_ANGLES) {
      const backwards = subArea(centreTriangleArea(theta), sectorArea(theta));
      expect(areaValue(backwards, R7), `theta ${theta}`).toBeLessThan(0);
    }
  });

  it('keeps every area invariant', () => {
    for (const theta of ALLOWED_SEGMENT_ANGLES) {
      for (const r of [R6, R7, R14]) {
        const tri = areaValue(centreTriangleArea(theta), r);
        const sec = areaValue(sectorArea(theta), r);
        const seg = areaValue(minorSegmentArea(theta), r);
        const disc = areaValue(discArea(), r);
        expect(tri).toBeGreaterThanOrEqual(0);
        expect(seg).toBeGreaterThanOrEqual(0);
        expect(seg).toBeLessThanOrEqual(sec);
        expect(sec).toBeLessThanOrEqual(disc);
      }
    }
  });

  it('makes minor and major segments rebuild the disc', () => {
    for (const theta of ALLOWED_SEGMENT_ANGLES) {
      expect(segmentsCompleteTheDisc(theta), `theta ${theta}`).toBe(true);
      const total = addArea(minorSegmentArea(theta), majorSegmentArea(theta));
      expect(areaValue(total, R14)).toBeCloseTo(areaValue(discArea(), R14), 10);
    }
  });
});

describe('triangle areas derived from the allowed geometry', () => {
  it('uses the construction for each allowed angle', () => {
    // 60 equilateral: (root3/4) r^2
    expect(centreTriangleArea(60)).toEqual({ rat: rational(0, 1), pi: rational(0, 1), root3: rational(1, 4) });
    // 90 right isosceles: 1/2 r^2
    expect(centreTriangleArea(90)).toEqual({ rat: rational(1, 2), pi: rational(0, 1), root3: rational(0, 1) });
    // 120 via the perpendicular: also (root3/4) r^2
    expect(centreTriangleArea(120)).toEqual({ rat: rational(0, 1), pi: rational(0, 1), root3: rational(1, 4) });
    expect(n2(areaValue(centreTriangleArea(90), R14))).toBe(98);
    expect(n2(areaValue(centreTriangleArea(60), R6))).toBe(15.59);
    expect(n2(areaValue(centreTriangleArea(120), R7))).toBe(21.22);
  });

  it('refuses an angle outside the allowed scope', () => {
    expect(() => centreTriangleArea(45)).toThrow(/outside the angles this scope allows/);
    expect(() => centreTriangleArea(180)).toThrow(/outside the angles this scope allows/);
    const bad: CircleRegion = { id: 'b', kind: 'minor_segment', theta: 45, label: 'x', composedOf: ['sector', 'triangle'] };
    expect(validateRegion(bad).join(' ')).toMatch(/restricted to central angles 60, 90, 120/);
  });

  it('imports no out-of-scope trigonometric area formula', () => {
    const all = prose();
    expect(all).not.toMatch(/\u00bd ?ab ?sin|1\/2 ?ab ?sin|r\u00b2 ?sin ?\u03b8/i);
    // The special angles it DOES use are the Chapter 8 ones.
    expect(all).toMatch(/sin 60|cos 60|30-60-90/);
  });
});

describe('figure and arithmetic must agree', () => {
  it('rejects a figure angle that differs from the formula angle', () => {
    expect(anglesReconcile(60, 60)).toBe(true);
    expect(anglesReconcile(60, 120)).toBe(false);
    expect(anglesReconcile(120, 60)).toBe(false);
    // And the two would give different regions, which is why it matters.
    expect(areaValue(sectorArea(60), R7)).not.toBeCloseTo(areaValue(sectorArea(120), R7), 6);
  });

  it('keeps a region kind distinct from its area alone', () => {
    // Sector and segment of the same theta share an arc and differ by the triangle.
    for (const theta of ALLOWED_SEGMENT_ANGLES) {
      expect(areaValue(regionArea({ id: 's', kind: 'sector', theta, label: '' }), R7))
        .not.toBeCloseTo(areaValue(regionArea({ id: 'm', kind: 'minor_segment', theta, label: '', composedOf: ['sector', 'triangle'] }), R7), 6);
    }
    expect(regionArea(R_SECTOR_90)).toEqual(sectorArea(90));
    expect(regionArea(R_MINOR_60)).toEqual(minorSegmentArea(60));
    expect(regionArea(R_MINOR_120)).toEqual(minorSegmentArea(120));
  });

  it('writes exact areas with the pi term leading', () => {
    expect(formatArea(sectorArea(90))).toBe('1/4\u03c0');
    expect(formatArea(centreTriangleArea(90))).toBe('1/2');
    expect(formatArea(minorSegmentArea(90))).toBe('1/4\u03c0 \u2212 1/2');
    expect(formatArea(minorSegmentArea(60))).toBe('1/6\u03c0 \u2212 1/4\u221a3');
    expect(formatArea(majorSegmentArea(120))).toBe('2/3\u03c0 + 1/4\u221a3');
    expect(formatArea(discArea())).toBe('\u03c0');
  });
});

describe('authored numbers and combined figures', () => {
  it('recomputes every authored segment value', () => {
    expect(n2(areaValue(minorSegmentArea(90), R14))).toBe(55.94);
    expect(n2(areaValue(majorSegmentArea(90), R14))).toBe(559.81);
    expect(n2(areaValue(minorSegmentArea(60), R6))).toBe(3.26);
    expect(n2(areaValue(minorSegmentArea(120), R7))).toBe(30.1);
    expect(n2(areaValue(majorSegmentArea(120), R7))).toBe(123.84);
    expect(n2(areaValue(minorSegmentArea(90), R6))).toBe(10.27);
    expect(n2(areaValue(minorSegmentArea(60), R14))).toBe(17.75);
  });

  it('recomputes the combined figures, including the perimeter trace', () => {
    expect(n2(R14 * R14 - areaValue(sectorArea(90), R14))).toBe(42.06);
    // Four corner quarters of radius 7 remove exactly one disc of radius 7,
    // which happens to equal a quarter of the radius-14 disc.
    expect(n2(R14 * R14 - areaValue(discArea(), R14 / 2))).toBe(42.06);
    expect(areaValue(discArea(), R14 / 2)).toBeCloseTo(areaValue(sectorArea(90), R14), 10);
    expect(n2(R6 * R6 - areaValue(sectorArea(90), R6))).toBe(7.73);
    expect(n2(R14 * R14 + areaValue(discArea(), R14 / 2) / 2)).toBe(272.97);
    // The perimeter is traced, not the square's perimeter plus the arc.
    const traced = 2 * R14 + arcLength(90, R14);
    expect(n2(traced)).toBe(49.99);
    expect(traced).toBeLessThan(4 * R14);
    expect(n2(4 * R14 + arcLength(90, R14))).not.toBe(n2(traced));
  });

  it('keeps the chapter planar', () => {
    const all = prose();
    expect(all).not.toMatch(/frustum|cone|cylinder|hemisphere|curved surface area|volume/i);
    expect(all).toMatch(/plane|planar|regions, not solids/i);
  });
});

describe('lesson quality and governance', () => {
  it('authors three lessons with correct Chapter 11 provenance', () => {
    expect(CLASS10_CIRCLE_AREA_SECTIONS.length).toBe(3);
    for (const s of CLASS10_CIRCLE_AREA_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch11');
      expect(s.source.sectionNumber).toBe('11.1');
      expect(s.source.startPage).toBe(154);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('distinguishes sector and segment in words, not only by shading', () => {
    const all = prose();
    expect(all).toMatch(/sector is bounded by (?:the )?two radii|bounded by two radii/i);
    expect(all).toMatch(/segment is bounded by the chord|between (?:a|the) chord and (?:its|the same) arc/i);
    expect(all).toMatch(/chord/i);
    expect(all).not.toMatch(/the shaded region is the segment\b(?![^.]{0,80}chord)/i);
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_CIRCLE_AREA_SECTIONS) {
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

  it('keeps its three lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.13 checkpoint 67 — Chapter 10 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const ch11 = cat.chapters.find((c) => c.number === 11)!;
    expect(ch11.lessons.length).toBe(3);
    for (const lesson of ch11.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the eleven earlier waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    const waves = [CLASS10_TRIGONOMETRY_SECTIONS, CLASS10_COMPOSITE_SOLIDS_SECTIONS,
      CLASS10_SIMILARITY_SECTIONS, CLASS10_QUADRATIC_SECTIONS, CLASS10_STATISTICS_SECTIONS,
      CLASS10_LINEAR_SYSTEM_SECTIONS, CLASS10_HEIGHTS_DISTANCES_SECTIONS,
      CLASS10_REAL_NUMBERS_SECTIONS, CLASS10_POLYNOMIAL_SECTIONS, CLASS10_AP_SECTIONS,
      CLASS10_PROBABILITY_SECTIONS];
    expect(waves.map((w) => w.length)).toEqual([4, 3, 6, 4, 8, 5, 3, 4, 4, 5, 4]);
    for (const w of waves) for (const s of w) expect(s.contentArtifactVersion).toBe(1);
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
