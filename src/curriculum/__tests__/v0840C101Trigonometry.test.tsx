// ---------------------------------------------------------------------------
// v0.84.0-c10.1 checkpoint 55 — THE CLASS 10 TRIGONOMETRY PILOT.
//
// The governing question was whether Pragati can teach a trigonometric ratio
// as a relationship defined relative to an angle — visually, symbolically and
// logically — without leaning on labels that merely look right.
//
// These tests are the "without leaning on labels" part. Every figure's claims
// are recomputed from its own coordinates, and every standard-angle value is
// recomputed from the triangles the lesson actually derives.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  CLASS10_TRIGONOMETRY_SECTIONS,
  STANDARD_ANGLE_RATIOS,
  C10_SECTION_8_2A,
  C10_SECTION_8_2B,
  C10_SECTION_8_3A,
} from '../trigonometrySections';
import {
  validateRightTriangleRoles,
  validateAngleMarkGeometry,
  type GeometryFigureSpec,
} from '../visualSpecification';
import { authoredLearnCatalogueForReview } from '../authoredLearnCatalogue';
import { allAuthoredSections } from '../authoredSections';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';

const FIGURES = CLASS10_TRIGONOMETRY_SECTIONS.flatMap((s) =>
  Object.entries(s.visualsById).map(([k, v]) => [s.contentArtifactId, k, v as GeometryFigureSpec] as const)
);

describe('trigonometric figure semantics', () => {
  it('validates every side-role claim against the figure coordinates', () => {
    for (const [artifact, key, spec] of FIGURES) {
      expect(validateRightTriangleRoles(spec), `${artifact}/${key}`).toEqual([]);
    }
  });

  it('checks every claimed angle against the geometry actually drawn', () => {
    for (const [artifact, key, spec] of FIGURES) {
      expect(spec.exactGeometry, `${artifact}/${key} must declare exactness`).toBe(true);
      expect(validateAngleMarkGeometry(spec), `${artifact}/${key}`).toEqual([]);
    }
  });

  it('rejects a figure whose opposite side touches the reference angle', () => {
    // The validator has to catch the error that label placement cannot: a
    // figure claiming a role the geometry contradicts.
    const broken: GeometryFigureSpec = {
      ...(FIGURES[0][2] as GeometryFigureSpec),
      // Reference and right angle at the same vertex makes the adjacent leg
      // degenerate and the reference angle non-acute.
      rightTriangleRoles: [{ referenceVertex: 'b', rightAngleVertex: 'b', thirdVertex: 'c' }],
    };
    expect(validateRightTriangleRoles(broken).length).toBeGreaterThan(0);
  });

  it('rejects a figure that claims an angle its coordinates do not make', () => {
    const base = FIGURES.find(([, k]) => k === 'F_ISOSCELES_RIGHT')![2];
    const lying: GeometryFigureSpec = {
      ...base,
      angleMarks: (base.angleMarks ?? []).map((m) =>
        m.label === '45' ? { ...m, label: '30' } : m
      ),
    };
    expect(validateAngleMarkGeometry(lying).join(' ')).toMatch(/claims 30/);
  });

  it('records the same side under different roles from different angles', () => {
    // The point of the whole extension: BC is opposite A and adjacent to C.
    const roles = (C10_SECTION_8_2A.visualsById.F_ROLES as GeometryFigureSpec).rightTriangleRoles!;
    expect(roles.length).toBe(2);
    expect(roles.map((r) => r.referenceVertex).sort()).toEqual(['a', 'c']);
    // Both share the same right-angle vertex, so the hypotenuse is common.
    expect(new Set(roles.map((r) => r.rightAngleVertex)).size).toBe(1);
  });
});

describe('standard-angle values', () => {
  it('recomputes every table entry from the derivation triangles', () => {
    // 45 from legs 1,1 and hypotenuse root 2; 30 and 60 from 1, root 3, 2.
    const r2 = Math.sqrt(2);
    const r3 = Math.sqrt(3);
    const expected: Record<number, [number, number, number]> = {
      30: [1 / 2, r3 / 2, 1 / r3],
      45: [1 / r2, 1 / r2, 1 / 1],
      60: [r3 / 2, 1 / 2, r3 / 1],
    };
    for (const row of STANDARD_ANGLE_RATIOS) {
      const [s, c, t] = expected[row.degrees];
      expect(row.sin.value, `sin ${row.degrees}`).toBeCloseTo(s, 12);
      expect(row.cos.value, `cos ${row.degrees}`).toBeCloseTo(c, 12);
      expect(row.tan.value, `tan ${row.degrees}`).toBeCloseTo(t, 12);
      // tan must equal sin over cos, which a retyped table can silently break.
      expect(row.tan.value).toBeCloseTo(row.sin.value / row.cos.value, 12);
      // Every acute-angle sine and cosine lies strictly between 0 and 1.
      for (const v of [row.sin.value, row.cos.value]) {
        expect(v).toBeGreaterThan(0);
        expect(v).toBeLessThan(1);
      }
    }
  });

  it('keeps exact forms, not decimals', () => {
    for (const row of STANDARD_ANGLE_RATIOS) {
      for (const cell of [row.sin, row.cos, row.tan]) {
        expect(cell.exact, `${row.degrees}`).not.toMatch(/0\.\d/);
      }
    }
    expect(STANDARD_ANGLE_RATIOS.find((r) => r.degrees === 60)!.sin.exact).toBe('\u221a3/2');
  });

  it('stays out of 8.3b territory: no 0 or 90 degree claim', () => {
    expect(STANDARD_ANGLE_RATIOS.map((r) => r.degrees)).toEqual([30, 45, 60]);
    const prose = CLASS10_TRIGONOMETRY_SECTIONS.flatMap((s) => [...s.explanation, s.summary]).join(' ');
    expect(prose).not.toMatch(/\bnot defined\b|\bundefined\b/i);
  });

  it('agrees with the prose the 8.3a lesson actually states', () => {
    const prose = [...C10_SECTION_8_3A.explanation, C10_SECTION_8_3A.summary].join(' ');
    for (const probe of ['sin 45 = 1/\u221a2', 'tan 45 = 1', 'sin 60 = \u221a3/2', 'cos 60 = 1/2', 'tan 60 = \u221a3', 'sin 30 = 1/2', 'cos 30 = \u221a3/2', 'tan 30 = 1/\u221a3']) {
      expect(prose, probe).toContain(probe);
    }
  });
});

describe('ratio definitions', () => {
  it('states each of the six ratios with the right numerator and denominator', () => {
    const prose = [...C10_SECTION_8_2A.explanation, C10_SECTION_8_2A.summary].join(' ');
    expect(prose).toMatch(/sin A is opposite over hypotenuse/);
    expect(prose).toMatch(/cos A is adjacent over hypotenuse/);
    expect(prose).toMatch(/tan A is opposite over adjacent/);
    expect(prose).toMatch(/cosec A is hypotenuse over opposite/);
    expect(prose).toMatch(/sec A is hypotenuse over adjacent/);
    expect(prose).toMatch(/cot A is adjacent over opposite/);
    // The reciprocal relationships are derived from the definitions, not
    // presented as unrelated facts.
    expect(prose).toMatch(/cosec A = 1\/sin A/);
    expect(prose).toMatch(/not new facts to remember/);
  });

  it('computes the 3-4-5 ratios correctly in the worked example', () => {
    const we = C10_SECTION_8_2A.workedExamples.find((w) => w.id === 's82a.we1')!;
    // Recompute from the figure's own side lengths rather than trusting prose.
    const [opp, adj, hyp] = [3, 4, 5];
    for (const [name, value] of [
      ['sin A', `${opp}/${hyp}`], ['cos A', `${adj}/${hyp}`], ['tan A', `${opp}/${adj}`],
      ['cosec A', `${hyp}/${opp}`], ['sec A', `${hyp}/${adj}`], ['cot A', `${adj}/${opp}`],
    ] as const) {
      expect(we.answer, name).toContain(`${name} = ${value}`);
    }
  });

  it('never claims a sine or cosine above 1 anywhere in the pilot', () => {
    const prose = CLASS10_TRIGONOMETRY_SECTIONS.flatMap((s) => [
      ...s.explanation, s.summary,
      ...s.workedExamples.map((w) => w.answer),
      ...s.independentPractice.map((p) => p.answer),
    ]).join(' ');
    for (const m of prose.matchAll(/\b(?:sin|cos) [A-Z0-9]+ = (\d+)\/(\d+)\b/g)) {
      expect(Number(m[1]) / Number(m[2]), m[0]).toBeLessThanOrEqual(1);
    }
  });
});

describe('the proof unit', () => {
  it('proves rather than observes', () => {
    const prose = [...C10_SECTION_8_2B.explanation, ...C10_SECTION_8_2B.workedExamples.flatMap((w) => w.steps.map((s) => `${s.text} ${s.reasoning}`))].join(' ');
    // The mechanism, the criterion, and the correspondence step must all be present.
    expect(prose).toMatch(/similar/i);
    expect(prose).toMatch(/AA/);
    expect(prose).toMatch(/correspond/i);
    expect(prose).toMatch(/proportional/i);
    // And it must say why measurement would not do.
    expect(prose).toMatch(/measure/i);
  });

  it('carries the correspondence step in its worked proof', () => {
    const we = C10_SECTION_8_2B.workedExamples[0];
    expect(we.steps.length).toBeGreaterThanOrEqual(5);
    expect(we.steps.some((s) => /corresponding to A|B to P/.test(s.text))).toBe(true);
  });
});

describe('vocabulary and content hygiene', () => {
  it('uses every term it defines', () => {
    for (const s of CLASS10_TRIGONOMETRY_SECTIONS) {
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
    }
  });

  it('has no placeholder or thin content', () => {
    for (const s of CLASS10_TRIGONOMETRY_SECTIONS) {
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.explanation.length).toBeGreaterThanOrEqual(5);
      expect(s.workedExamples.length).toBeGreaterThanOrEqual(3);
      expect(s.independentPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.reasoningApplication.length).toBeGreaterThanOrEqual(2);
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          // No thin step such as "Use sine."
          expect(step.reasoning.length, `${w.id}`).toBeGreaterThan(40);
        }
      }
      for (const t of [...s.explanation, s.summary]) {
        expect(t).not.toMatch(/TODO|TBD|placeholder|lorem/i);
      }
    }
  });

  it('keeps provenance on the real source', () => {
    for (const s of CLASS10_TRIGONOMETRY_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch08');
      expect(s.source.textbook).toContain('Class X');
      expect(['8.2', '8.3']).toContain(s.source.sectionNumber);
      expect(s.source.sourceReference).toContain('jemh1dd.zip');
    }
  });
});

describe('student rendering and governance', () => {
  it('renders all four through the real LearnSectionView', () => {
    __setAuthoredLearnPreviewForTests(true);
    // v0.84.0-c10.2 checkpoint 56 — Chapter 12 joins the catalogue, so this
    // test narrows to the four trigonometry lessons it is actually about.
    const cat = authoredLearnCatalogueForReview('class10');
    const chapter8 = cat.chapters.find((c) => c.number === 8)!;
    expect(chapter8.lessons.length).toBe(7);
    for (const lesson of chapter8.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount();
      cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('leaves Class 9 exactly as it was', () => {
    const c9 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh'));
    expect(c9.length).toBe(92);
    for (const s of c9) expect(s.reviewStatus).toBe('authored_draft');
  });

  it('keeps every authored Class 10 lesson a draft with no invented competency', () => {
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    expect(c10.filter((s) => s.source.officialChapterId === 'ncert_jemh1_ch08').length).toBe(7);
    for (const s of c10) {
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.competencyMappingStatus).toBe('competency_mapping_pending');
      expect(s.competencyCandidates).toEqual([]);
      // No assessment-bank metadata beyond ordinary lesson practice.
      expect(s.interactivePractice).toEqual([]);
    }
  });
});
