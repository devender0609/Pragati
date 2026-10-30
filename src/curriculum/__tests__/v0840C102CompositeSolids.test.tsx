// ---------------------------------------------------------------------------
// v0.84.0-c10.2 checkpoint 56 — COMPOSITE SOLIDS.
//
// The governing question was whether the model itself can know which surfaces
// disappear at a join, so that a visually plausible but mathematically wrong
// surface-area calculation is prevented rather than merely discouraged.
//
// These tests are that guarantee: the exposed set is recomputed from the
// model, every authored figure is validated, and impossible joins are proved
// to be rejected.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  validateCompositeSolid,
  exposedSurfaces,
  exposedSurfaceArea,
  naiveTotalSurfaceArea,
  compositeVolume,
  surfacesOf,
  volumeOf,
  surfaceAccount,
  type CompositeSolidSpec,
} from '../compositeSolidSpecification';
import { validateVisual } from '../visualSpecification';
import {
  CLASS10_COMPOSITE_SOLIDS_SECTIONS,
  C10_SECTION_12_2A,
} from '../compositeSolidsSections';
import { CLASS10_TRIGONOMETRY_SECTIONS } from '../trigonometrySections';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { CompositeSolidFigure } from '../../features/learn/CompositeSolidFigure';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';

const SPECS = CLASS10_COMPOSITE_SOLIDS_SECTIONS.flatMap((s) =>
  Object.entries(s.visualsById).map(([k, v]) => [s.contentArtifactId, k, v as CompositeSolidSpec] as const)
);
const uniq = new Map(SPECS.map(([, k, v]) => [k, v] as const));

describe('the composition model', () => {
  it('validates every authored composite, through the one visual entry point', () => {
    for (const [artifact, key, spec] of SPECS) {
      expect(validateCompositeSolid(spec), `${artifact}/${key}`).toEqual([]);
      expect(validateVisual(spec), `${artifact}/${key} via validateVisual`).toEqual([]);
    }
    expect(uniq.size).toBeGreaterThanOrEqual(3);
  });

  it('derives the exposed set rather than taking an author\u2019s word', () => {
    const cylHemi = uniq.get('F_CYL_HEMI')!;
    expect(exposedSurfaces(cylHemi).map((x) => `${x.component.id}.${x.surface.id}`).sort()).toEqual([
      'cyl.base_lower', 'cyl.curved', 'hem.curved',
    ]);
    // Both joined faces are gone, not one.
    const account = surfaceAccount(cylHemi);
    expect(account.filter((a) => !a.exposed).length).toBe(2);
    expect(account.filter((a) => a.exposed).length).toBe(3);
  });

  it('shows the join deficit as exactly twice the joined face', () => {
    for (const [, key, spec] of SPECS) {
      const gap = naiveTotalSurfaceArea(spec) - exposedSurfaceArea(spec);
      const joined = spec.joins[0];
      const c = spec.components.find((x) => x.id === joined.a.component)!;
      const face = surfacesOf(c).find((x) => x.id === joined.a.surface)!;
      expect(gap, key).toBeCloseTo(2 * face.area, 9);
    }
  });

  it('never counts an internal surface in the exposed area', () => {
    for (const [, key, spec] of SPECS) {
      const hidden = new Set(spec.joins.flatMap((j) => [j.a, j.b]).map((r) => `${r.component}.${r.surface}`));
      for (const e of exposedSurfaces(spec)) {
        expect(hidden.has(`${e.component.id}.${e.surface.id}`), `${key} counts an internal surface`).toBe(false);
      }
      // And no exposed surface was accidentally dropped.
      const total = spec.components.reduce((t, c) => t + surfacesOf(c).length, 0);
      expect(exposedSurfaces(spec).length + hidden.size).toBe(total);
    }
  });

  it('rejects joins that could not exist', () => {
    const base = uniq.get('F_CYL_HEMI')!;
    // Mismatched radii — invisible in any drawing.
    const mismatched: CompositeSolidSpec = {
      ...base,
      components: [base.components[0], { ...base.components[1], dimensions: { radius: 4 } }],
    };
    expect(validateCompositeSolid(mismatched).join(' ')).toMatch(/cannot meet/);
    // A curved surface is not a face.
    const curved: CompositeSolidSpec = {
      ...base,
      joins: [{ a: { component: 'cyl', surface: 'curved' }, b: { component: 'hem', surface: 'curved' } }],
    };
    expect(validateCompositeSolid(curved).length).toBeGreaterThan(0);
    // One surface cannot be hidden twice.
    const twice: CompositeSolidSpec = {
      ...base,
      joins: [...base.joins, { a: { component: 'cyl', surface: 'base_upper' }, b: { component: 'hem', surface: 'base' } }],
    };
    expect(validateCompositeSolid(twice).join(' ')).toMatch(/only once/);
    // The CBSE scope of two solids is enforced, not left to discipline.
    const three: CompositeSolidSpec = {
      ...base,
      components: [...base.components, { id: 'x', kind: 'sphere', label: 'sphere', dimensions: { radius: 7 } }],
    };
    expect(validateCompositeSolid(three).join(' ')).toMatch(/exceeds the prescribed scope/);
    // A cone whose slant height contradicts its radius and height.
    const badCone: CompositeSolidSpec = {
      ...uniq.get('F_CYL_CONE')!,
      components: [
        uniq.get('F_CYL_CONE')!.components[0],
        { id: 'con', kind: 'cone', label: 'cone', dimensions: { radius: 3, height: 4, slantHeight: 4 } },
      ],
    };
    expect(validateCompositeSolid(badCone).join(' ')).toMatch(/slant height/);
  });

  it('adds volumes where it subtracts surfaces', () => {
    for (const [, , spec] of SPECS) {
      expect(compositeVolume(spec)).toBeCloseTo(
        spec.components.reduce((t, c) => t + volumeOf(c), 0), 9
      );
    }
  });
});

describe('numeric fidelity of the authored answers', () => {
  const P22 = 22 / 7;
  it('recomputes every area figure the lessons state', () => {
    // 12.2b we1: cylinder r7 h10 + hemisphere, pi = 22/7.
    expect(2 * P22 * 7 * 10 + P22 * 49 + 2 * P22 * 49).toBeCloseTo(902, 6);
    // we2: the wrong sum, and the gap.
    expect(2 * P22 * 7 * 10 + 2 * P22 * 49 + 3 * P22 * 49).toBeCloseTo(1210, 6);
    expect(1210 - 902).toBeCloseTo(2 * P22 * 49, 6);
    // we3: cone r3 h4 on cylinder r3 h8, in terms of pi.
    expect(Math.PI * 3 * 5 + 2 * Math.PI * 3 * 8 + Math.PI * 9).toBeCloseTo(72 * Math.PI, 9);
    // guided: hemisphere r5 on cylinder r5 h12.
    expect(2 * Math.PI * 5 * 12 + Math.PI * 25 + 2 * Math.PI * 25).toBeCloseTo(195 * Math.PI, 9);
    // independent i1 and i2.
    expect(2 * P22 * 7 * 20 + P22 * 49 + 2 * P22 * 49).toBeCloseTo(1342, 6);
    expect(Math.PI * 9 * 15 + 2 * Math.PI * 81).toBeCloseTo(297 * Math.PI, 9);
  });

  it('recomputes every volume figure the lessons state', () => {
    // 12.3a we1: pi = 22/7.
    expect(P22 * 49 * 10 + (2 / 3) * P22 * 343).toBeCloseTo(6776 / 3, 6);
    // we2: cone r6 h8 + hemisphere r6.
    expect((1 / 3) * Math.PI * 36 * 8 + (2 / 3) * Math.PI * 216).toBeCloseTo(240 * Math.PI, 9);
    // we3 area for the same object.
    expect(Math.PI * 6 * 10 + 2 * Math.PI * 36).toBeCloseTo(132 * Math.PI, 9);
    // guided g1 and g3.
    expect(Math.PI * 9 * 10 + (2 / 3) * Math.PI * 27).toBeCloseTo(108 * Math.PI, 9);
    expect(Math.PI * 36 * 15 + (2 / 3) * Math.PI * 216).toBeCloseTo(684 * Math.PI, 9);
    // independent i1 and i2 — both were wrong on first authoring.
    expect((1 / 3) * Math.PI * 25 * 12 + (2 / 3) * Math.PI * 125).toBeCloseTo((550 / 3) * Math.PI, 9);
    expect(P22 * 49 * 6 + 2 * ((2 / 3) * P22 * 343)).toBeCloseTo(7084 / 3, 6);
  });

  it('agrees with the model for the figures the lessons draw', () => {
    const cylHemi = uniq.get('F_CYL_HEMI')!;
    // The figure uses r=7, h=10, so exposed area is 2pi*70 + pi*49 + 2pi*49.
    expect(exposedSurfaceArea(cylHemi)).toBeCloseTo(Math.PI * (140 + 49 + 98), 9);
    expect(compositeVolume(cylHemi)).toBeCloseTo(Math.PI * 490 + (2 / 3) * Math.PI * 343, 9);
    const coneHemi = uniq.get('F_CONE_HEMI')!;
    expect(exposedSurfaceArea(coneHemi)).toBeCloseTo(132 * Math.PI, 9);
    expect(compositeVolume(coneHemi)).toBeCloseTo(240 * Math.PI, 9);
  });

  it('states the stated answers, with no self-correction left in the prose', () => {
    const all = CLASS10_COMPOSITE_SOLIDS_SECTIONS.flatMap((s) => [
      ...s.explanation, s.summary,
      ...s.workedExamples.flatMap((w) => [w.answer, ...w.steps.map((x) => `${x.text} ${x.reasoning}`)]),
      ...s.guidedPractice.flatMap((g) => [g.answer, g.rationale]),
      ...s.independentPractice.flatMap((p) => [p.answer, p.rationale]),
    ]).join(' ');
    expect(all).not.toMatch(/recheck|actually it|wait,/i);
    expect(all).toContain('(550/3)');
    expect(all).toContain('7084/3');
  });
});

describe('teaching the lost surface', () => {
  it('names the internal surfaces in prose, not only in a figure', () => {
    const prose = [...C10_SECTION_12_2A.explanation, C10_SECTION_12_2A.summary].join(' ');
    expect(prose).toMatch(/internal/i);
    expect(prose).toMatch(/2\u03c0r\u00b2/);
    expect(prose).toMatch(/paint/i);
  });

  it('describes the join and the exposed set in alt text, without relying on colour', () => {
    for (const [, key, spec] of SPECS) {
      expect(spec.altText.length, key).toBeGreaterThan(120);
      expect(spec.altText, key).toMatch(/internal|inside the finished solid/i);
      expect(spec.altText, key).toMatch(/outside/i);
      expect(spec.altText, key).not.toMatch(/\b(red|blue|green|shaded in|coloured)\b/i);
      expect(spec.altText, key).not.toBe('a composite solid');
    }
  });

  it('renders a surface table a reader can use without the drawing', () => {
    const spec = uniq.get('F_CYL_HEMI')!;
    render(<CompositeSolidFigure spec={spec} />);
    // The table names every surface and says whether it counts, in text.
    expect(screen.getByText(/on the outside\?/i)).toBeTruthy();
    expect(screen.getAllByText(/upper circular face of the cylinder/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/3 surfaces counted, 2 internal/i)).toBeTruthy();
    expect(surfaceAccount(spec).every((a) => a.reason.length > 10)).toBe(true);
    cleanup();
  });
});

describe('content hygiene and governance', () => {
  it('uses every term it defines and carries no thin reasoning', () => {
    for (const s of CLASS10_COMPOSITE_SOLIDS_SECTIONS) {
      const whole = [
        ...s.explanation, s.summary, s.nextStep,
        ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.map((x) => `${x.text} ${x.reasoning}`)]),
        ...s.guidedPractice.flatMap((g) => [g.prompt, g.answer, g.rationale, g.hint]),
        ...s.independentPractice.flatMap((p) => [p.prompt, p.answer, p.rationale]),
        ...s.reasoningApplication.flatMap((r) => [r.prompt, r.expectedReasoning]),
      ].join(' ').toLowerCase();
      for (const v of s.vocabulary) {
        const head = v.term.toLowerCase().split(' ').slice(-1)[0];
        expect(whole.includes(v.term.toLowerCase()) || whole.includes(head), `${s.contentArtifactId}: ${v.term}`).toBe(true);
      }
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.length, `${w.id}`).toBeGreaterThan(40);
        }
      }
      for (const t of [...s.explanation, s.summary]) {
        expect(t).not.toMatch(/TODO|TBD|placeholder|lorem/i);
      }
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch12');
      expect(['12.2', '12.3']).toContain(s.source.sectionNumber);
    }
  });

  it('stays inside the current source scope', () => {
    const all = CLASS10_COMPOSITE_SOLIDS_SECTIONS.flatMap((s) => [...s.explanation, s.summary]).join(' ');
    // The current edition contains no frustum, so neither may the lessons.
    expect(all).not.toMatch(/frustum/i);
    for (const [, , spec] of SPECS) expect(spec.components.length).toBeLessThanOrEqual(2);
  });

  it('keeps its three lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.3 checkpoint 57 — Chapter 6 joins the catalogue, so this
    // test narrows to the composite-solids chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const chapter12 = cat.chapters.find((c) => c.number === 12)!;
    expect(chapter12.lessons.length).toBe(3);
    for (const lesson of chapter12.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the public-safe gate closed and Class 9 frozen', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    const c9 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh'));
    expect(c9.length).toBe(92);
  });

  it('leaves the trigonometry pilot untouched', () => {
    expect(CLASS10_TRIGONOMETRY_SECTIONS.length).toBe(4);
    for (const s of CLASS10_TRIGONOMETRY_SECTIONS) {
      expect(s.contentArtifactVersion).toBe(1);
      expect(s.reviewStatus).toBe('authored_draft');
    }
  });
});
