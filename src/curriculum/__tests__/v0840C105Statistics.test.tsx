// ---------------------------------------------------------------------------
// v0.84.0-c10.5 checkpoint 59 — STATISTICS OF GROUPED DATA.
//
// The governing question: can one grouped dataset be a single mathematical
// object from which every table, method and statistic is derived, so three
// computational routes cannot silently disagree?
//
// These tests are that guarantee. The cross-method reconciliation is the
// central permanent invariant; the numeric-prose reconciliation is what
// stops a typed figure drifting from the data behind it.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  classMark, classWidth, cumulativeFrequencies, directMean, assumedMean,
  stepDeviationMean, median, medianClassIndex, modalClassIndex, mode,
  sumFd, sumFu, sumFx, totalFrequency, boundaries, intervalLabel,
  meansReconcile, validateGroupedDistribution, validateGroupedTable,
  type GroupedDistribution,
} from '../groupedDistribution';
import {
  CLASS10_STATISTICS_SECTIONS, CANONICAL_DISTRIBUTIONS, CANONICAL_TABLES,
  D_WATER, D_SEEDLINGS, D_READING,
} from '../statisticsSections';
import { GroupedTableFigure } from '../../features/learn/GroupedTableFigure';
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

const blocks = (s: (typeof CLASS10_STATISTICS_SECTIONS)[number]): Array<[string, string]> => [
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];

describe('the grouped-data model', () => {
  it('validates every canonical distribution', () => {
    expect(CANONICAL_DISTRIBUTIONS.length).toBe(3);
    for (const d of CANONICAL_DISTRIBUTIONS) {
      expect(validateGroupedDistribution(d), d.id).toEqual([]);
    }
  });

  it('derives class marks and labels rather than storing them', () => {
    expect(D_WATER.intervals.map(classMark)).toEqual([5, 15, 25, 35, 45]);
    expect(D_SEEDLINGS.intervals.map(classMark)).toEqual([7.5, 12.5, 17.5, 22.5, 27.5]);
    expect(D_WATER.intervals.map(intervalLabel)[2]).toBe('20\u201330');
  });

  it('rejects distributions that could not exist', () => {
    const base = D_WATER;
    const negative: GroupedDistribution = {
      ...base, intervals: [{ lower: 0, upper: 10, frequency: -2 }, ...base.intervals.slice(1)],
    };
    expect(validateGroupedDistribution(negative).join(' ')).toMatch(/non-negative/);
    const fractional: GroupedDistribution = {
      ...base, intervals: [{ lower: 0, upper: 10, frequency: 2.5 }, ...base.intervals.slice(1)],
    };
    expect(validateGroupedDistribution(fractional).join(' ')).toMatch(/whole count/);
    const gapped: GroupedDistribution = {
      ...base, intervals: [{ lower: 0, upper: 10, frequency: 4 }, { lower: 15, upper: 25, frequency: 8 }],
    };
    expect(validateGroupedDistribution(gapped).join(' ')).toMatch(/share a boundary/);
    const inverted: GroupedDistribution = {
      ...base, intervals: [{ lower: 10, upper: 5, frequency: 4 }, { lower: 10, upper: 20, frequency: 8 }],
    };
    expect(validateGroupedDistribution(inverted).join(' ')).toMatch(/upper limit must exceed/);
  });

  it('adjusts boundaries under an inclusive convention', () => {
    const inclusive: GroupedDistribution = {
      id: 'inc', unitLabel: 'item', quantity: 'score', convention: 'inclusive',
      intervals: [
        { lower: 10, upper: 19, frequency: 3 },
        { lower: 20, upper: 29, frequency: 7 },
        { lower: 30, upper: 39, frequency: 5 },
      ],
    };
    expect(boundaries(inclusive, 1)).toEqual({ lower: 19.5, upper: 29.5 });
    expect(classWidth(inclusive)).toBe(10);
  });
});

describe('cross-method reconciliation — the central invariant', () => {
  it('makes all three routes agree on every canonical distribution', () => {
    for (const d of CANONICAL_DISTRIBUTIONS) {
      expect(meansReconcile(d), d.id).toEqual([]);
    }
  });

  it('agrees for assumed means far outside the data, not only convenient ones', () => {
    for (const d of CANONICAL_DISTRIBUTIONS) {
      const direct = directMean(d);
      for (const a of [-1000, -7.25, 0, 3.5, 1e4]) {
        expect(assumedMean(d, a), `${d.id} a=${a}`).toBeCloseTo(direct, 9);
        expect(stepDeviationMean(d, a)!, `${d.id} step a=${a}`).toBeCloseTo(direct, 9);
      }
    }
  });

  it('recomputes the whole direct-method table', () => {
    expect(sumFx(D_WATER)).toBe(1020);
    expect(totalFrequency(D_WATER)).toBe(40);
    expect(directMean(D_WATER)).toBeCloseTo(25.5, 12);
    expect(sumFx(D_SEEDLINGS)).toBe(865);
    expect(directMean(D_SEEDLINGS)).toBeCloseTo(17.3, 12);
    expect(sumFx(D_READING)).toBe(2100);
    expect(directMean(D_READING)).toBeCloseTo(35, 12);
  });

  it('recomputes the assumed-mean and step-deviation columns', () => {
    expect(sumFd(D_WATER, 25)).toBe(20);
    expect(sumFu(D_WATER, 25)).toBe(2);
    expect(classWidth(D_WATER)).toBe(10);
    expect(25 + sumFd(D_WATER, 25) / 40).toBeCloseTo(25.5, 12);
    expect(25 + 10 * (sumFu(D_WATER, 25)! / 40)).toBeCloseTo(25.5, 12);
    // Omitting h is the characteristic error; it must NOT give the mean.
    expect(25 + sumFu(D_WATER, 25)! / 40).not.toBeCloseTo(25.5, 3);
  });

  it('returns null for step deviation where the widths differ', () => {
    const uneven: GroupedDistribution = {
      id: 'uneven', unitLabel: 'item', quantity: 'score', convention: 'continuous',
      intervals: [
        { lower: 0, upper: 10, frequency: 5 },
        { lower: 10, upper: 30, frequency: 9 },
        { lower: 30, upper: 40, frequency: 4 },
      ],
    };
    expect(classWidth(uneven)).toBeNull();
    expect(stepDeviationMean(uneven, 20)).toBeNull();
    // The assumed-mean route still works there.
    expect(assumedMean(uneven, 20)).toBeCloseTo(directMean(uneven), 12);
  });
});

describe('mode fidelity', () => {
  it('selects the modal class by frequency and computes a number from it', () => {
    expect(modalClassIndex(D_WATER)).toBe(2);
    expect(mode(D_WATER)).toBeCloseTo(26, 12);
    expect(modalClassIndex(D_READING)).toBe(1);
    expect(mode(D_READING)).toBeCloseTo(20 + 200 / 23, 12);
    // The mode must lie inside the modal class.
    for (const d of CANONICAL_DISTRIBUTIONS) {
      const k = modalClassIndex(d)!;
      const b = boundaries(d, k);
      expect(mode(d)!).toBeGreaterThanOrEqual(b.lower);
      expect(mode(d)!).toBeLessThanOrEqual(b.upper);
    }
  });

  it('refuses a modal class when two classes tie', () => {
    const bimodal: GroupedDistribution = {
      ...D_WATER,
      intervals: [
        { lower: 0, upper: 10, frequency: 4 }, { lower: 10, upper: 20, frequency: 14 },
        { lower: 20, upper: 30, frequency: 14 }, { lower: 30, upper: 40, frequency: 6 },
        { lower: 40, upper: 50, frequency: 2 },
      ],
    };
    expect(modalClassIndex(bimodal)).toBeNull();
    expect(mode(bimodal)).toBeNull();
  });

  it('puts the mode at the midpoint when the neighbours are equal', () => {
    const symmetric: GroupedDistribution = {
      ...D_WATER,
      intervals: [
        { lower: 0, upper: 10, frequency: 5 }, { lower: 10, upper: 20, frequency: 12 },
        { lower: 20, upper: 30, frequency: 5 },
      ],
    };
    expect(mode(symmetric)).toBeCloseTo(15, 12);
  });
});

describe('median and cumulative frequency fidelity', () => {
  it('derives cumulative frequencies that rise and end at the total', () => {
    for (const d of CANONICAL_DISTRIBUTIONS) {
      const cf = cumulativeFrequencies(d);
      for (let k = 1; k < cf.length; k += 1) expect(cf[k]).toBeGreaterThanOrEqual(cf[k - 1]);
      expect(cf[cf.length - 1]).toBe(totalFrequency(d));
      // Row by row against a running sum.
      let running = 0;
      d.intervals.forEach((i, k) => { running += i.frequency; expect(cf[k]).toBe(running); });
    }
    expect(cumulativeFrequencies(D_READING)).toEqual([15, 40, 52, 58, 60]);
  });

  it('selects the FIRST class reaching N/2 and computes the median inside it', () => {
    expect(medianClassIndex(D_READING)).toBe(1);
    expect(median(D_READING)).toBeCloseTo(32, 12);
    expect(medianClassIndex(D_WATER)).toBe(2);
    expect(median(D_WATER)).toBeCloseTo(20 + 80 / 14, 12);
    for (const d of CANONICAL_DISTRIBUTIONS) {
      const k = medianClassIndex(d)!;
      const b = boundaries(d, k);
      expect(median(d)!).toBeGreaterThanOrEqual(b.lower);
      expect(median(d)!).toBeLessThanOrEqual(b.upper);
    }
  });

  it('treats a cumulative frequency landing exactly on N/2 as reaching it', () => {
    const exact: GroupedDistribution = {
      ...D_WATER,
      intervals: [
        { lower: 0, upper: 10, frequency: 10 }, { lower: 10, upper: 20, frequency: 10 },
        { lower: 20, upper: 30, frequency: 20 },
      ],
    };
    // N = 40, N/2 = 20, cumulative 10, 20, 40 — the second class reaches it.
    expect(medianClassIndex(exact)).toBe(1);
  });
});

describe('numeric prose reconciliation', () => {
  it('finds every dataset figure the lessons quote in the model', () => {
    const prose = CLASS10_STATISTICS_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    const must: Array<[string, number]> = [
      ['water \u03a3fx', sumFx(D_WATER)], ['water N', totalFrequency(D_WATER)],
      ['water mean', directMean(D_WATER)], ['water mode', mode(D_WATER)!],
      ['water \u03a3fd', sumFd(D_WATER, 25)], ['water \u03a3fu', sumFu(D_WATER, 25)!],
      ['seedling \u03a3fx', sumFx(D_SEEDLINGS)], ['seedling mean', directMean(D_SEEDLINGS)],
      ['reading \u03a3fx', sumFx(D_READING)], ['reading mean', directMean(D_READING)],
      ['reading median', median(D_READING)!],
    ];
    for (const [name, value] of must) {
      expect(prose, `${name} = ${value} should appear`).toContain(String(Number(value.toFixed(4))));
    }
  });

  it('never quotes a figure that contradicts the model', () => {
    const prose = CLASS10_STATISTICS_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    // Values from earlier drafts that the harness rejected.
    for (const wrong of ['820', '1920', '16.4 millimetres']) {
      expect(prose, `stale figure ${wrong} must not survive`).not.toContain(wrong);
    }
  });

  it('keeps the alt text of every table consistent with its distribution', () => {
    for (const t of CANONICAL_TABLES) {
      const d = t.distribution;
      expect(t.altText).toContain(String(totalFrequency(d)));
      expect(t.altText.length).toBeGreaterThan(150);
      expect(t.altText).not.toMatch(/\b(red|blue|green|shaded|coloured)\b/i);
    }
  });
});

describe('table rendering and accessibility', () => {
  it('validates every canonical table through the one visual entry point', () => {
    for (const t of CANONICAL_TABLES) {
      expect(validateGroupedTable(t), t.distribution.id).toEqual([]);
      expect(validateVisual(t), `${t.distribution.id} via validateVisual`).toEqual([]);
    }
  });

  it('refuses a deviation column with no assumed mean', () => {
    const broken = { ...CANONICAL_TABLES[0], columns: ['d', 'fd'] as const, assumedMean: undefined };
    expect(validateGroupedTable(broken as never).join(' ')).toMatch(/needs an assumed mean/);
  });

  it('renders derived totals and row headers a reader can follow', () => {
    render(<GroupedTableFigure spec={CANONICAL_TABLES[0]} />);
    expect(screen.getAllByText('20\u201330').length).toBeGreaterThan(0);
    expect(screen.getAllByText(String(sumFx(D_WATER))).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Total').length).toBeGreaterThan(0);
    // Row headers are real headers, not styled cells.
    const rowHeaders = screen.getAllByRole('rowheader');
    expect(rowHeaders.length).toBeGreaterThanOrEqual(D_WATER.intervals.length);
    cleanup();
  });
});

describe('content hygiene and governance', () => {
  it('authors eight lessons with correct Chapter 13 provenance', () => {
    expect(CLASS10_STATISTICS_SECTIONS.length).toBe(8);
    for (const s of CLASS10_STATISTICS_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch13');
      expect(['13.2', '13.3', '13.4']).toContain(s.source.sectionNumber);
      expect([171, 183, 188]).toContain(s.source.startPage);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_STATISTICS_SECTIONS) {
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

  it('keeps the modal class distinct from the mode, and stays out of scope creep', () => {
    const prose = CLASS10_STATISTICS_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');
    expect(prose).toMatch(/modal class is an interval|interval, not the mode|an interval, not yet the mode/i);
    // Ogive is a passing mention in the source, not prescribed and not taught.
    expect(prose).not.toMatch(/\bogive\b/i);
    // Any mean-median-mode relationship must be framed as empirical.
    if (/3\s*median|3 \u00d7 median/i.test(prose)) {
      expect(prose).toMatch(/empirical|approximate|not an identity/i);
    }
    expect(prose).toMatch(/empirical observation, not an identity/i);
  });

  it('keeps its eight lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.6 checkpoint 60 — Chapter 3 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const chapter13 = cat.chapters.find((c) => c.number === 13)!;
    expect(chapter13.lessons.length).toBe(8);
    for (const lesson of chapter13.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the four earlier waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    expect(CLASS10_TRIGONOMETRY_SECTIONS.length).toBe(4);
    expect(CLASS10_COMPOSITE_SOLIDS_SECTIONS.length).toBe(3);
    expect(CLASS10_SIMILARITY_SECTIONS.length).toBe(6);
    expect(CLASS10_QUADRATIC_SECTIONS.length).toBe(4);
    for (const s of [...CLASS10_TRIGONOMETRY_SECTIONS, ...CLASS10_COMPOSITE_SOLIDS_SECTIONS,
      ...CLASS10_SIMILARITY_SECTIONS, ...CLASS10_QUADRATIC_SECTIONS]) {
      expect(s.contentArtifactVersion).toBe(1);
    }
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
