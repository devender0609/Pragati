// ---------------------------------------------------------------------------
// v0.84.0-c10.7 checkpoint 61 — HEIGHTS AND DISTANCES.
//
// The governing question: can a real-world observation be turned into the
// correct right triangle BEFORE any trigonometry, so observer height, the
// horizontal reference, line of sight, elevation and depression cannot
// silently drift apart?
//
// The arithmetic here is Chapter 8's and is tested for agreement with it.
// What these tests really guard is the modelling.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  tanOf, sinOf, cosOf, verticalRise, totalHeight, lineOfSight, answerFor,
  eyeHeightEntersAnswer, exactRise, round2, triangleOf, recomputedAngle,
  validateObservation, validateObservationGeometry, type Observation,
} from '../observationModel';
import {
  CLASS10_HEIGHTS_DISTANCES_SECTIONS, CANONICAL_OBSERVATIONS, CANONICAL_HD_FIGURES,
  O_GROUND, O_EYE, O_RISE_ONLY, O_DEPRESSION, O_NEAR, TWO_TRIANGLE,
} from '../heightsDistancesSections';
import { STANDARD_ANGLE_RATIOS, CLASS10_TRIGONOMETRY_SECTIONS } from '../trigonometrySections';
import { validateVisual } from '../visualSpecification';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { CLASS10_COMPOSITE_SOLIDS_SECTIONS } from '../compositeSolidsSections';
import { CLASS10_SIMILARITY_SECTIONS } from '../similaritySections';
import { CLASS10_QUADRATIC_SECTIONS } from '../quadraticSections';
import { CLASS10_STATISTICS_SECTIONS } from '../statisticsSections';
import { CLASS10_LINEAR_SYSTEM_SECTIONS } from '../linearSystemSections';

const blocks = (s: (typeof CLASS10_HEIGHTS_DISTANCES_SECTIONS)[number]): Array<[string, string]> => [
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];

describe('agreement with Chapter 8', () => {
  it('reads every ratio from the canonical table rather than retyping it', () => {
    for (const row of STANDARD_ANGLE_RATIOS) {
      expect(tanOf(row.degrees)).toBe(row.tan);
      expect(sinOf(row.degrees)).toBe(row.sin);
      expect(cosOf(row.degrees)).toBe(row.cos);
    }
    // And the values are still the ones Chapter 8 derived.
    expect(tanOf(45).value).toBe(1);
    expect(tanOf(60).value).toBeCloseTo(Math.sqrt(3), 12);
    expect(tanOf(30).value).toBeCloseTo(1 / Math.sqrt(3), 12);
    expect(tanOf(30).value * tanOf(60).value).toBeCloseTo(1, 12);
  });

  it('stays inside the prescribed angles', () => {
    for (const o of CANONICAL_OBSERVATIONS) expect([30, 45, 60]).toContain(o.angleDegrees);
    const bad = { ...O_GROUND, angleDegrees: 50 as unknown as 30 };
    expect(validateObservation(bad).join(' ')).toMatch(/outside the prescribed/);
  });
});

describe('observer height enters only when the geometry says so', () => {
  it('treats ground-level observation as adding nothing', () => {
    expect(O_GROUND.eyeHeightM).toBe(0);
    expect(eyeHeightEntersAnswer(O_GROUND)).toBe(false);
    expect(totalHeight(O_GROUND)).toBeCloseTo(verticalRise(O_GROUND), 12);
  });

  it('adds the eye height for a total height measured from the ground', () => {
    expect(eyeHeightEntersAnswer(O_EYE)).toBe(true);
    expect(round2(verticalRise(O_EYE))).toBe(24);
    expect(round2(totalHeight(O_EYE))).toBe(25.5);
    expect(round2(totalHeight(O_EYE) - verticalRise(O_EYE))).toBe(O_EYE.eyeHeightM);
  });

  it('does NOT add it when the question asks only for the rise', () => {
    // Same observation, different target quantity.
    expect(O_RISE_ONLY.eyeHeightM).toBe(O_EYE.eyeHeightM);
    expect(eyeHeightEntersAnswer(O_RISE_ONLY)).toBe(false);
    expect(answerFor(O_RISE_ONLY)).toBeCloseTo(verticalRise(O_EYE), 12);
    expect(answerFor(O_RISE_ONLY)).not.toBeCloseTo(answerFor(O_EYE), 3);
  });

  it('catches the classic defect: reporting the rise as the object height', () => {
    // The fixture named in the checkpoint, with original values.
    const o: Observation = {
      id: 'fixture', observer: 'an observer', target: 'a mast',
      eyeHeightM: 1.6, horizontalDistanceM: 28, angleDegrees: 45,
      direction: 'elevation', targetQuantity: 'total_height', unit: 'm',
    };
    expect(round2(verticalRise(o))).toBe(28);
    expect(round2(totalHeight(o))).toBe(29.6);
    // Reporting 28 would be answering a different question.
    expect(answerFor(o)).not.toBeCloseTo(verticalRise(o), 3);
    expect(answerFor({ ...o, targetQuantity: 'rise_above_eye' })).toBeCloseTo(28, 12);
  });
});

describe('elevation, depression and the horizontal reference', () => {
  it('puts the angle at the observer and recomputes it from coordinates', () => {
    for (const o of CANONICAL_OBSERVATIONS) {
      expect(recomputedAngle(o)).toBeCloseTo(o.angleDegrees, 6);
      expect(validateObservationGeometry(o), o.id).toEqual([]);
      // The reference through the eye really is horizontal.
      const t = triangleOf(o);
      expect(t.horizontalFoot.y).toBeCloseTo(t.eye.y, 12);
      expect(t.eye.y).toBe(o.eyeHeightM);
    }
  });

  it('makes a mis-placed angle unrepresentable, and rejects impossible geometry', () => {
    // The triangle is DERIVED from the direction, so an elevation whose
    // sight line falls cannot be built at all — the check below confirms
    // the derivation, which is the guarantee that matters.
    for (const o of CANONICAL_OBSERVATIONS) {
      const t = triangleOf(o);
      if (o.direction === 'elevation') expect(t.sightEnd.y).toBeGreaterThan(t.eye.y);
      else expect(t.sightEnd.y).toBeLessThan(t.eye.y);
    }
    // A depression steeper than the observer is above the ground is impossible.
    const underground: Observation = { ...O_DEPRESSION, angleDegrees: 60 };
    expect(validateObservationGeometry(underground).join(' ')).toMatch(/impossible/);
    // And an out-of-scope angle is rejected rather than throwing.
    expect(validateObservationGeometry({ ...O_GROUND, angleDegrees: 50 as unknown as 30 }).join(' '))
      .toMatch(/outside the prescribed/);
  });

  it('keeps the line of sight longer than both legs', () => {
    for (const o of CANONICAL_OBSERVATIONS) {
      expect(lineOfSight(o)).toBeGreaterThan(o.horizontalDistanceM - 1e-9);
      expect(lineOfSight(o)).toBeGreaterThan(verticalRise(o) - 1e-9);
    }
    expect(round2(lineOfSight(O_GROUND))).toBe(34.64);
    expect(round2(lineOfSight(O_NEAR))).toBe(40);
  });

  it('derives the elevation-depression equality from parallel horizontals', () => {
    const prose = CLASS10_HEIGHTS_DISTANCES_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/alternate angles/i);
    expect(prose).toMatch(/transversal/i);
    expect(prose).toMatch(/parallel/i);
    // It must not be offered as a bare rule.
    expect(prose).not.toMatch(/depression always equals/i);
    expect(prose).toMatch(/not a rule|consequence of/i);
  });
});

describe('numerical recomputation', () => {
  it('recomputes every rise, total and exact form', () => {
    expect(round2(verticalRise(O_GROUND))).toBe(17.32);
    expect(exactRise(O_GROUND)).toBe('10\u221a3');
    expect(round2(verticalRise(O_NEAR))).toBe(34.64);
    expect(exactRise(O_NEAR)).toBe('20\u221a3');
    expect(exactRise(O_EYE)).toBe('24');
    // 10√3 and 20√3 really are those numbers.
    expect(10 * Math.sqrt(3)).toBeCloseTo(verticalRise(O_GROUND), 9);
    expect(20 * Math.sqrt(3)).toBeCloseTo(verticalRise(O_NEAR), 9);
  });

  it('solves the two-triangle problem through the shared side', () => {
    // h = 20√3; AF = h√3 = 60; walk = 40.
    expect(TWO_TRIANGLE.farDistance).toBe(60);
    expect(TWO_TRIANGLE.walkBack).toBe(40);
    expect(TWO_TRIANGLE.farDistance).toBeCloseTo(verticalRise(O_NEAR) / tanOf(30).value, 6);
    // And the near distance is what the near triangle used.
    expect(TWO_TRIANGLE.near.horizontalDistanceM).toBe(20);
  });

  it('agrees with the figures drawn from the same observations', () => {
    for (const o of CANONICAL_OBSERVATIONS) {
      const t = triangleOf(o);
      expect(Math.abs(t.sightEnd.y - t.eye.y)).toBeCloseTo(verticalRise(o), 9);
      expect(t.horizontalFoot.x - t.eye.x).toBeCloseTo(o.horizontalDistanceM, 9);
    }
  });

  it('keeps every quantity in one unit and names it in answers', () => {
    for (const o of CANONICAL_OBSERVATIONS) expect(o.unit).toBe('m');
    for (const s of CLASS10_HEIGHTS_DISTANCES_SECTIONS) {
      for (const w of s.workedExamples) {
        // Any numeric answer carries a unit or is a described quantity.
        if (/^[\d.\u221a\s]+$/.test(w.answer.replace(/\s/g, ''))) {
          expect(w.answer, w.id).toMatch(/\bm\b/);
        }
      }
    }
  });

  it('distinguishes exact from approximate', () => {
    const prose = CLASS10_HEIGHTS_DISTANCES_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/\u2248|approximately|about/);
    // An irrational value must never be stated with a bare equals to a decimal.
    expect(prose).not.toMatch(/\u221a3\s*=\s*1\.7/);
    expect(prose).not.toMatch(/20\u221a3\s*=\s*34\.64/);
  });
});

describe('figure fidelity', () => {
  it('validates every figure through the checkpoint-55 validators', () => {
    expect(CANONICAL_HD_FIGURES.length).toBe(4);
    for (const f of CANONICAL_HD_FIGURES) expect(validateVisual(f), f.caption).toEqual([]);
  });

  it('describes the model, not the scenery, in alt text', () => {
    for (const f of CANONICAL_HD_FIGURES) {
      expect(f.altText.length).toBeGreaterThan(180);
      expect(f.altText).toMatch(/horizontal|line of sight/i);
      expect(f.altText).not.toMatch(/\b(red|blue|green|shaded|coloured)\b/i);
    }
  });

  it('rejects a figure whose claimed angle contradicts its coordinates', () => {
    const lying = { ...O_GROUND, angleDegrees: 60 as const };
    // The model recomputes from its own coordinates, so a mismatch is only
    // possible if coordinates are supplied independently — which they are not.
    expect(recomputedAngle(lying)).toBeCloseTo(60, 6);
    // The figure-level guard: a hand-edited angle mark is caught by validateVisual.
    const f = CANONICAL_HD_FIGURES[0];
    const tampered = {
      ...f,
      angleMarks: f.angleMarks!.map((m) => (m.right ? m : { ...m, label: '60\u00b0' })),
    };
    expect(validateVisual(tampered).join(' ')).toMatch(/claims 60/);
  });
});

describe('content hygiene and governance', () => {
  it('authors three lessons with correct Chapter 9 provenance', () => {
    expect(CLASS10_HEIGHTS_DISTANCES_SECTIONS.length).toBe(3);
    for (const s of CLASS10_HEIGHTS_DISTANCES_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch09');
      expect(s.source.sectionNumber).toBe('9.1');
      expect(s.source.startPage).toBe(133);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('teaches no over-general rule', () => {
    const prose = CLASS10_HEIGHTS_DISTANCES_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).not.toMatch(/always add the (?:observer|eye)/i);
    // "always use tangent" may appear only as a claim being refuted.
    for (const m of prose.matchAll(/.{0,60}always use tan[a-z]*.{0,80}/gi)) {
      expect(m[0], 'unrefuted "always use tangent"').toMatch(/\bno\b|wrong|false rule|Is it true/i);
    }
    // And it must say so explicitly.
    expect(prose).toMatch(/not a rule|habit|consequence of the situations/i);
    // At most two triangles.
    expect(prose).toMatch(/at most two/i);
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_HEIGHTS_DISTANCES_SECTIONS) {
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

  it('keeps its three lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.8 checkpoint 62 — Chapter 1 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const chapter9 = cat.chapters.find((c) => c.number === 9)!;
    expect(chapter9.lessons.length).toBe(3);
    for (const lesson of chapter9.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the six earlier waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    expect(CLASS10_TRIGONOMETRY_SECTIONS.length).toBe(4);
    expect(CLASS10_COMPOSITE_SOLIDS_SECTIONS.length).toBe(3);
    expect(CLASS10_SIMILARITY_SECTIONS.length).toBe(6);
    expect(CLASS10_QUADRATIC_SECTIONS.length).toBe(4);
    expect(CLASS10_STATISTICS_SECTIONS.length).toBe(8);
    expect(CLASS10_LINEAR_SYSTEM_SECTIONS.length).toBe(5);
    for (const s of [...CLASS10_TRIGONOMETRY_SECTIONS, ...CLASS10_COMPOSITE_SOLIDS_SECTIONS,
      ...CLASS10_SIMILARITY_SECTIONS, ...CLASS10_QUADRATIC_SECTIONS,
      ...CLASS10_STATISTICS_SECTIONS, ...CLASS10_LINEAR_SYSTEM_SECTIONS]) {
      expect(s.contentArtifactVersion).toBe(1);
    }
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
