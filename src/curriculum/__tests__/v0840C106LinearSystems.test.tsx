// ---------------------------------------------------------------------------
// v0.84.0-c10.6 checkpoint 60 — PAIRS OF LINEAR EQUATIONS.
//
// The governing question: can one pair be encoded so that the graph, the
// coefficient classification, substitution and elimination all describe
// exactly the same solution set, and cannot silently contradict each other?
//
// The graph-algebra reconciliation below is the central permanent invariant.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  classify, lineRelationship, isConsistent, determinant, uniqueSolution,
  satisfies, satisfiesBoth, scalarMultiple, pointsOn, pointIsOn, clipToWindow,
  windowOf, solveBySubstitution, solveByElimination, validateLinearSystem,
  validateLinearSystemGraph, rational, toNumber, formatRational,
  type LinearSystem,
} from '../linearSystem';
import {
  CLASS10_LINEAR_SYSTEM_SECTIONS, CANONICAL_GRAPHS,
  S_UNIQUE, S_PARALLEL, S_COINCIDENT, S_TICKETS, S_FRACTIONAL,
} from '../linearSystemSections';
import { LinearSystemGraph } from '../../features/learn/LinearSystemGraph';
import { validateVisual } from '../visualSpecification';
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

const ALL: Array<[string, LinearSystem]> = [
  ['unique', S_UNIQUE], ['parallel', S_PARALLEL], ['coincident', S_COINCIDENT],
  ['tickets', S_TICKETS], ['fractional', S_FRACTIONAL],
];

const blocks = (s: (typeof CLASS10_LINEAR_SYSTEM_SECTIONS)[number]): Array<[string, string]> => [
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];

describe('graph and algebra cannot disagree — the central invariant', () => {
  it('derives the same relationship from both readings, for every system', () => {
    const expected = { unique: 'intersecting', no_solution: 'distinct_parallel', infinitely_many: 'coincident' } as const;
    for (const [name, s] of ALL) {
      expect(lineRelationship(s), name).toBe(expected[classify(s)]);
      expect(validateLinearSystem(s), name).toEqual([]);
    }
  });

  it('classifies by cross products, surviving a zero coefficient', () => {
    // x = 3 and y = 5 — a ratio classifier would divide by zero here.
    const axes: LinearSystem = {
      id: 'axes',
      first: { a: 1, b: 0, c: 3, label: 'x = 3' },
      second: { a: 0, b: 1, c: 5, label: 'y = 5' },
    };
    expect(classify(axes)).toBe('unique');
    expect(determinant(axes)).toBe(1);
    const sol = uniqueSolution(axes)!;
    expect([toNumber(sol.x), toNumber(sol.y)]).toEqual([3, 5]);
    expect(satisfiesBoth(axes, sol.x, sol.y)).toBe(true);
    // Parallel verticals, also with a zero coefficient.
    const verticals: LinearSystem = {
      id: 'vert',
      first: { a: 1, b: 0, c: 3, label: 'x = 3' },
      second: { a: 2, b: 0, c: 8, label: '2x = 8' },
    };
    expect(classify(verticals)).toBe('no_solution');
    expect(lineRelationship(verticals)).toBe('distinct_parallel');
  });

  it('separates the three states exactly', () => {
    expect(classify(S_UNIQUE)).toBe('unique');
    expect(classify(S_PARALLEL)).toBe('no_solution');
    expect(classify(S_COINCIDENT)).toBe('infinitely_many');
    // Consistent is NOT the same as unique.
    expect(isConsistent(S_UNIQUE)).toBe(true);
    expect(isConsistent(S_COINCIDENT)).toBe(true);
    expect(isConsistent(S_PARALLEL)).toBe(false);
  });

  it('establishes coincidence by scalar multiple, not by shared points', () => {
    expect(formatRational(scalarMultiple(S_COINCIDENT)!)).toBe('2');
    expect(scalarMultiple(S_PARALLEL)).toBeNull();
    expect(scalarMultiple(S_UNIQUE)).toBeNull();
  });
});

describe('unique-solution recomputation', () => {
  it('verifies every claimed solution in BOTH equations', () => {
    for (const [name, s] of ALL) {
      const sol = uniqueSolution(s);
      if (classify(s) !== 'unique') { expect(sol, name).toBeNull(); continue; }
      expect(satisfies(s.first, sol!.x, sol!.y), `${name} first`).toBe(true);
      expect(satisfies(s.second, sol!.x, sol!.y), `${name} second`).toBe(true);
    }
  });

  it('keeps a non-integer solution exact', () => {
    const sol = uniqueSolution(S_FRACTIONAL)!;
    expect(formatRational(sol.x)).toBe('23/13');
    expect(formatRational(sol.y)).toBe('11/13');
    // Exactness matters: a rounded pair would fail this.
    expect(satisfiesBoth(S_FRACTIONAL, sol.x, sol.y)).toBe(true);
    const rounded = { x: rational(177, 100), y: rational(85, 100) };
    expect(satisfiesBoth(S_FRACTIONAL, rounded.x, rounded.y)).toBe(false);
  });

  it('finds no common solution for the inconsistent pair', () => {
    expect(uniqueSolution(S_PARALLEL)).toBeNull();
    // Every point on the first line fails the second.
    for (const p of pointsOn(S_PARALLEL.first)) {
      expect(pointIsOn(S_PARALLEL.first, p)).toBe(true);
      expect(pointIsOn(S_PARALLEL.second, p)).toBe(false);
    }
  });

  it('puts every point of one coincident line on the other', () => {
    for (const p of pointsOn(S_COINCIDENT.first)) {
      expect(pointIsOn(S_COINCIDENT.first, p)).toBe(true);
      expect(pointIsOn(S_COINCIDENT.second, p)).toBe(true);
    }
  });
});

describe('substitution, elimination and their agreement', () => {
  it('makes both methods reach the classifier\u2019s verdict', () => {
    for (const [name, s] of ALL) {
      expect(solveBySubstitution(s).outcome, `${name} sub`).toBe(classify(s));
      expect(solveByElimination(s).outcome, `${name} elim`).toBe(classify(s));
    }
  });

  it('makes both methods reach the same solution', () => {
    for (const [name, s] of ALL) {
      const a = solveBySubstitution(s).solution;
      const b = solveByElimination(s).solution;
      if (!a || !b) { expect(a, name).toEqual(b); continue; }
      expect(toNumber(a.x), `${name} x`).toBe(toNumber(b.x));
      expect(toNumber(a.y), `${name} y`).toBe(toNumber(b.y));
      expect(satisfiesBoth(s, a.x, a.y), name).toBe(true);
    }
  });

  it('reads 0 = 0 and 0 = k as information about the system', () => {
    expect(solveByElimination(S_COINCIDENT).degenerateReading).toBe('0 = 0');
    expect(solveBySubstitution(S_COINCIDENT).degenerateReading).toBe('0 = 0');
    expect(solveByElimination(S_PARALLEL).degenerateReading).toBe('0 = k');
    expect(solveBySubstitution(S_PARALLEL).degenerateReading).toBe('0 = k');
    // Neither is reported as a solution.
    expect(solveByElimination(S_COINCIDENT).solution).toBeNull();
    expect(solveByElimination(S_PARALLEL).solution).toBeNull();
    // And neither is described as an error.
    const detail = [...solveByElimination(S_COINCIDENT).steps, ...solveByElimination(S_PARALLEL).steps]
      .map((x) => x.detail).join(' ');
    expect(detail).toMatch(/information, not an accident/);
  });

  it('carries real reasoning in every traced step', () => {
    for (const [, s] of ALL) {
      for (const t of [solveBySubstitution(s), solveByElimination(s)]) {
        for (const step of t.steps) expect(step.detail.length).toBeGreaterThan(40);
      }
    }
  });
});

describe('graph fidelity', () => {
  it('validates every authored graph through the one visual entry point', () => {
    expect(CANONICAL_GRAPHS.length).toBeGreaterThanOrEqual(4);
    for (const g of CANONICAL_GRAPHS) {
      expect(validateLinearSystemGraph(g), g.system.id).toEqual([]);
      expect(validateVisual(g), `${g.system.id} via validateVisual`).toEqual([]);
    }
  });

  it('puts every drawn endpoint on its own line', () => {
    for (const g of CANONICAL_GRAPHS) {
      const w = windowOf(g);
      for (const e of [g.system.first, g.system.second]) {
        const ends = clipToWindow(e, w);
        expect(ends.length, `${g.system.id} ${e.label}`).toBe(2);
        for (const p of ends) expect(Math.abs(e.a * p.x + e.b * p.y - e.c)).toBeLessThan(1e-9);
      }
    }
  });

  it('places the drawn intersection at the algebraic solution', () => {
    for (const g of CANONICAL_GRAPHS) {
      const sol = uniqueSolution(g.system);
      if (!sol) continue;
      const w = windowOf(g);
      expect(toNumber(sol.x)).toBeGreaterThanOrEqual(w.xMin);
      expect(toNumber(sol.x)).toBeLessThanOrEqual(w.xMax);
      expect(satisfiesBoth(g.system, sol.x, sol.y)).toBe(true);
    }
  });

  it('rejects a graph whose alt text misdescribes the lines', () => {
    const lying = { ...CANONICAL_GRAPHS[0], altText: 'Two parallel lines that never meet.' };
    expect(validateLinearSystemGraph(lying).join(' ')).toMatch(/something other than intersecting/);
  });

  it('draws a coincident pair as one line, stated in words', () => {
    const coincident = CANONICAL_GRAPHS.find((g) => lineRelationship(g.system) === 'coincident')!;
    render(<LinearSystemGraph spec={coincident} />);
    expect(screen.getAllByText(/SAME line/i).length).toBeGreaterThan(0);
    // One stroke for the pair, not two overlapping ones.
    const lines = document.querySelectorAll('svg line');
    // two axes plus exactly one equation line
    expect(lines.length).toBe(3);
    cleanup();
    const unique = CANONICAL_GRAPHS.find((g) => lineRelationship(g.system) === 'intersecting')!;
    render(<LinearSystemGraph spec={unique} />);
    expect(document.querySelectorAll('svg line').length).toBe(4);
    expect(screen.getByText(/cross at one point/i)).toBeTruthy();
    cleanup();
  });
});

describe('terminology and scope', () => {
  it('never equates consistent with unique', () => {
    const prose = CLASS10_LINEAR_SYSTEM_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/consistent/i);
    expect(prose).toMatch(/infinitely many/i);
    // The distinction must be stated, not merely avoided.
    expect(prose).toMatch(/consistent[^.]{0,120}(infinitely many|more than one|not only)/i);
    expect(prose).not.toMatch(/consistent means (?:exactly )?one solution/i);
    // 'many solutions' is only vague when it is not 'infinitely many solutions'.
    for (const m of prose.matchAll(/.{0,14}many solutions/gi)) {
      expect(m[0], 'vague "many solutions"').toMatch(/infinitely many solutions/i);
    }
  });

  it('teaches no method outside the current scope', () => {
    const prose = CLASS10_LINEAR_SYSTEM_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    // The verified source has substitution and elimination only.
    expect(prose).not.toMatch(/cross[- ]multiplication/i);
    expect(prose).not.toMatch(/\bmatrix|determinant method|Cramer/i);
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_LINEAR_SYSTEM_SECTIONS) {
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
});

describe('governance and regression', () => {
  it('authors five lessons with correct Chapter 3 provenance', () => {
    expect(CLASS10_LINEAR_SYSTEM_SECTIONS.length).toBe(5);
    for (const s of CLASS10_LINEAR_SYSTEM_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch03');
      expect(['3.2', '3.3']).toContain(s.source.sectionNumber);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
      for (const v of Object.values(s.visualsById)) expect(validateVisual(v)).toEqual([]);
    }
  });

  it('keeps its five lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.7 checkpoint 61 — Chapter 9 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const chapter3 = cat.chapters.find((c) => c.number === 3)!;
    expect(chapter3.lessons.length).toBe(5);
    for (const lesson of chapter3.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the five earlier waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    expect(CLASS10_TRIGONOMETRY_SECTIONS.length).toBe(4);
    expect(CLASS10_COMPOSITE_SOLIDS_SECTIONS.length).toBe(3);
    expect(CLASS10_SIMILARITY_SECTIONS.length).toBe(6);
    expect(CLASS10_QUADRATIC_SECTIONS.length).toBe(4);
    expect(CLASS10_STATISTICS_SECTIONS.length).toBe(8);
    for (const s of [...CLASS10_TRIGONOMETRY_SECTIONS, ...CLASS10_COMPOSITE_SOLIDS_SECTIONS,
      ...CLASS10_SIMILARITY_SECTIONS, ...CLASS10_QUADRATIC_SECTIONS, ...CLASS10_STATISTICS_SECTIONS]) {
      expect(s.contentArtifactVersion).toBe(1);
    }
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
