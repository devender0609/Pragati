/**
 * v0.84.0-c11.33 checkpoint 93 — Chapter 13, Statistics.
 *
 * Two things carry the weight. The ORACLE: a grouped result must agree with
 * the same data written out as individual observations, so the grouped
 * formula is never used to check itself. And the RECONCILIATION: the
 * shortcut method must agree with the direct one, or it is a second truth
 * rather than an easier route.
 */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  allMeasuresZero, dataset, expandToObservations, groupedDispersion, mean,
  meanDeviationAbout, median, methodsReconcile, range, shortcutVariance,
  signedDeviationTotal, validateDispersion, varianceOf,
} from '../dispersion';
import { classMark, directMean, median as groupedMedian, mode } from '../groupedDistribution';
import {
  C11_STA_SECTIONS, DISCRETE, EXPANDED, GROUPED, GROUPED_MEAN, MD_SKEW_MEAN,
  MD_SKEW_MEDIAN, SKEWED, TEAM_A, TEAM_B, VAR_B,
} from '../statisticsClass11Sections';
import { AUTHORED_CHAPTERS } from '../authoredSections';
import { authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { LearnSectionView } from '../../features/learn/LearnSectionView';
import { learnContentFor } from '../../features/learn/learnSectionContent';

describe('Phase 0 — the provenance corrections are recorded, not silent', () => {
  const units = JSON.parse(require('node:fs').readFileSync(
    require('node:path').join(__dirname, '../../../class11-source/CLASS11_DECOMPOSITION.json'), 'utf8'
  )) as Array<{ unitId: string; source: Record<string, unknown> }>;
  const find = (id: string) => units.find((u) => u.unitId === id)!.source;

  it('moves STA-07 from 13.5.3 to 13.5.4, the shortcut method', () => {
    const s = find('C11-STA-07');
    expect(s.subsection).toBe('13.5.4');
    expect(String(s.provenanceCorrection)).toMatch(/CORRECTED from 13\.5\.3/);
  });

  it('widens STA-06 to cover discrete AND continuous grouped data', () => {
    const s = find('C11-STA-06');
    expect(s.coveredSubsections).toEqual(['13.5.2', '13.5.3']);
    expect(String(s.provenanceCorrection)).toMatch(/omitted continuous/);
  });

  it('widens STA-04, since §13.4 splits by ungrouped vs grouped, not mean vs median', () => {
    const s = find('C11-STA-04');
    expect(s.coveredSubsections).toEqual(['13.4.1', '13.4.2']);
    expect(String(s.provenanceCorrection)).toMatch(/omitted the ungrouped case/);
  });

  it('keeps the unit count at seven', () => {
    expect(units.filter((u) => u.unitId.startsWith('C11-STA')).length).toBe(7);
  });

  it('carries the covered subsections into the authored lessons', () => {
    const covered = (frag: string) =>
      (C11_STA_SECTIONS.find((s) => s.contentArtifactId.includes(frag))!.source as
        { additionalSubsectionNumbers?: string[] }).additionalSubsectionNumbers;
    expect(covered('md_median')).toEqual(['13.4.1', '13.4.2']);
    expect(covered('grouped_variance')).toEqual(['13.5.2', '13.5.3']);
    const shortcut = C11_STA_SECTIONS.find((s) => s.contentArtifactId.includes('shortcut'))!;
    expect((shortcut.source as { officialSubsectionNumber?: string }).officialSubsectionNumber).toBe('13.5.4');
  });
});

describe('range, and what it cannot see', () => {
  it('is the distance between the extremes, in the data\u2019s own unit', () => {
    expect(range(TEAM_A)).toEqual({ min: 4, max: 6, value: 2 });
    expect(range(TEAM_B)).toEqual({ min: 1, max: 9, value: 8 });
  });

  it('ignores the interior — two sets share a range and differ inside', () => {
    const a = dataset('a', 'a', [1, 5, 5, 9]);
    const b = dataset('b', 'b', [1, 2, 8, 9]);
    expect(range(a).value).toBe(range(b).value);
    expect(meanDeviationAbout(a, 'mean').value).not.toBe(meanDeviationAbout(b, 'mean').value);
  });

  it('is unchanged by permuting the observations', () => {
    expect(range(dataset('p', 'p', [9, 1, 5])).value).toBe(range(dataset('q', 'q', [1, 5, 9])).value);
  });

  it('refuses an empty dataset rather than inventing extremes', () => {
    expect(() => dataset('empty', 'empty', [])).toThrow(/no observations/);
  });
});

describe('mean deviation — ONE operator, two centres', () => {
  it('always totals zero in SIGNED deviations about the mean', () => {
    for (const d of [TEAM_A, TEAM_B, SKEWED]) {
      expect(Math.abs(signedDeviationTotal(d, 'mean')), d.id).toBeLessThan(1e-9);
    }
    // ...yet the mean deviation is not zero. This is the misconception check.
    expect(meanDeviationAbout(TEAM_B, 'mean').value).toBeGreaterThan(0);
  });

  it('gives DIFFERENT answers about the mean and the median', () => {
    expect(MD_SKEW_MEAN.centreValue).not.toBe(MD_SKEW_MEDIAN.centreValue);
    expect(MD_SKEW_MEAN.value).not.toBe(MD_SKEW_MEDIAN.value);
    expect(MD_SKEW_MEDIAN.centreValue).toBe(median(SKEWED));
    expect(MD_SKEW_MEAN.centreValue).toBe(mean(SKEWED));
  });

  it('derives every row from the data', () => {
    const md = meanDeviationAbout(TEAM_B, 'mean');
    md.rows.forEach((r, i) => {
      expect(r.x).toBe(TEAM_B.observations[i]);
      expect(r.deviation).toBeCloseTo(r.x - md.centreValue, 12);
      expect(r.absolute).toBe(Math.abs(r.deviation));
    });
    expect(md.value).toBeCloseTo(md.totalAbsolute / md.rows.length, 12);
  });

  it('weights grouped rows by frequency', () => {
    const g = groupedDispersion(GROUPED, 'mean');
    g.rows.forEach((r, i) => {
      expect(r.f).toBe(GROUPED.intervals[i].frequency);
      expect(r.x).toBe(classMark(GROUPED.intervals[i]));
      expect(r.weightedAbsolute).toBeCloseTo(r.f * r.absolute, 12);
    });
    // An unweighted version would be a different, wrong number.
    const unweighted = g.rows.reduce((a, r) => a + r.absolute, 0) / g.rows.length;
    expect(unweighted).not.toBeCloseTo(g.meanDeviation, 6);
  });
});

describe('variance and standard deviation', () => {
  it('uses SQUARED deviations, not absolute ones', () => {
    const v = varianceOf(TEAM_B);
    v.rows.forEach((r) => expect(r.squared).toBeCloseTo(r.deviation ** 2, 12));
    expect(v.variance).not.toBeCloseTo(meanDeviationAbout(TEAM_B, 'mean').value, 6);
  });

  it('divides by n, never n − 1', () => {
    expect(VAR_B.denominator).toBe(TEAM_B.observations.length);
    const wrong = VAR_B.totalSquared / (TEAM_B.observations.length - 1);
    expect(VAR_B.variance).not.toBeCloseTo(wrong, 6);
    expect(validateDispersion(VAR_B)).toEqual([]);
  });

  it('keeps σ as the square root of the variance', () => {
    expect(VAR_B.standardDeviation ** 2).toBeCloseTo(VAR_B.variance, 12);
    const tampered = { ...VAR_B, standardDeviation: VAR_B.standardDeviation + 1 };
    expect(validateDispersion(tampered).some((p) => /square root/.test(p))).toBe(true);
  });

  it('reports an impossible variance rather than clamping it', () => {
    const bad = { ...VAR_B, variance: -1 };
    expect(validateDispersion(bad).some((p) => /cannot produce/.test(p))).toBe(true);
  });

  it('reports zero for every measure when there is no spread', () => {
    expect(allMeasuresZero(dataset('z', 'z', [7, 7, 7, 7]))).toBe(true);
  });

  it('is unchanged by translation and scales by k² — independent oracles', () => {
    const base = varianceOf(TEAM_B);
    const shifted = varianceOf(dataset('s', 's', TEAM_B.observations.map((x) => x + 100)));
    expect(shifted.variance).toBeCloseTo(base.variance, 9);
    expect(shifted.mean).toBeCloseTo(base.mean + 100, 9);
    const scaled = varianceOf(dataset('k', 'k', TEAM_B.observations.map((x) => x * 3)));
    expect(scaled.variance).toBeCloseTo(base.variance * 9, 9);
    expect(scaled.standardDeviation).toBeCloseTo(base.standardDeviation * 3, 9);
    expect(range(dataset('k2', 'k2', TEAM_B.observations.map((x) => x * 3))).value)
      .toBeCloseTo(range(TEAM_B).value * 3, 9);
  });
});

describe('the grouped result agrees with the data written out — independent oracle', () => {
  it('matches the expanded observations for variance and mean deviation', () => {
    const expanded = dataset('e', 'e', expandToObservations(GROUPED));
    expect(expanded.observations).toHaveLength(GROUPED_MEAN.totalFrequency);
    expect(varianceOf(expanded).variance).toBeCloseTo(GROUPED_MEAN.variance, 9);
    expect(meanDeviationAbout(expanded, 'mean').value).toBeCloseTo(GROUPED_MEAN.meanDeviation, 9);
    expect(mean(expanded)).toBeCloseTo(GROUPED_MEAN.centreValue, 9);
    expect(EXPANDED.observations).toEqual(expanded.observations);
  });

  it('holds for the discrete distribution too', () => {
    const g = groupedDispersion(DISCRETE, 'mean');
    const expanded = dataset('de', 'de', expandToObservations(DISCRETE));
    expect(varianceOf(expanded).variance).toBeCloseTo(g.variance, 9);
  });

  it('is unchanged when the rows are reordered', () => {
    const reversed = { ...GROUPED, intervals: [...GROUPED.intervals].reverse() };
    expect(groupedDispersion(reversed, 'mean').variance).toBeCloseTo(GROUPED_MEAN.variance, 9);
  });
});

describe('the shortcut is a route, not a second truth', () => {
  it('agrees with the direct method at several assumed means', () => {
    for (const a of [5, 15, 25, 0]) {
      expect(methodsReconcile(GROUPED, a), `a=${a}`).toEqual([]);
      const s = shortcutVariance(GROUPED, a);
      expect(s.kind).toBe('computed');
      if (s.kind === 'computed') {
        expect(s.variance).toBeCloseTo(GROUPED_MEAN.variance, 9);
        expect(s.standardDeviation).toBeCloseTo(GROUPED_MEAN.standardDeviation, 9);
      }
    }
  });

  it('REFUSES when the classes have no common width', () => {
    const uneven = {
      ...GROUPED,
      intervals: [{ lower: 0, upper: 10, frequency: 3 }, { lower: 10, upper: 25, frequency: 5 }],
    };
    const s = shortcutVariance(uneven, 5);
    expect(s.kind).toBe('unavailable');
    if (s.kind === 'unavailable') expect(s.reason).toMatch(/common width/);
    expect(methodsReconcile(uneven, 5)[0]).toMatch(/unavailable/);
  });

  it('derives u, fu and fu² from the data rather than authoring them', () => {
    const s = shortcutVariance(GROUPED, 15);
    expect(s.kind).toBe('computed');
    if (s.kind === 'computed') {
      s.rows.forEach((r, i) => {
        expect(r.x).toBe(classMark(GROUPED.intervals[i]));
        expect(r.u).toBeCloseTo((r.x - s.assumed) / s.width, 12);
        expect(r.fu).toBeCloseTo(r.f * r.u, 12);
        expect(r.fu2).toBeCloseTo(r.f * r.u * r.u, 12);
      });
    }
  });
});

describe('Class 10 grouped statistics are untouched', () => {
  it('leaves the shared model\u2019s centre measures exactly as they were', () => {
    // The dispersion layer only ADDS; these must be unchanged.
    expect(directMean(GROUPED)).toBe(14);
    expect(classMark(GROUPED.intervals[0])).toBe(5);
    expect(typeof groupedMedian(GROUPED)).toBe('number');
    expect(typeof mode(GROUPED)).toBe('number');
  });

  it('declares no second grouped-distribution model', () => {
    const src = require('node:fs').readFileSync(
      require('node:path').join(__dirname, '../dispersion.ts'), 'utf8'
    ) as string;
    expect(src).toMatch(/from '\.\/groupedDistribution'/);
    expect(src).not.toMatch(/export type (GroupedDistribution|ClassInterval) =/);
    expect(src).not.toMatch(/Class11GroupedDistribution/);
  });
});

describe('the seven lessons', () => {
  it('authors seven in source page order, with five stages each', () => {
    expect(C11_STA_SECTIONS).toHaveLength(7);
    const pages = C11_STA_SECTIONS.map((s) => s.source.startPage);
    expect([...pages].sort((a, b) => a - b)).toEqual(pages);
    for (const s of C11_STA_SECTIONS) {
      expect(s.workedExamples.length).toBeGreaterThanOrEqual(3);
      expect(s.guidedPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.independentPractice.length).toBeGreaterThanOrEqual(3);
      expect(s.reasoningApplication.length).toBeGreaterThanOrEqual(1);
      expect(s.contentArtifactVersion).toBe(1);
      expect(s.reviewStatus).toBe('authored_draft');
    }
  });

  it('registers Chapter 13 before Chapter 14', () => {
    __setAuthoredLearnPreviewForTests(true);
    const c = authoredLearnCatalogueForGrade('class11');
    expect(c.chapters.map((x) => x.number)).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14]);
    expect(c.chapters.find((x) => x.number === 13)!.lessonCount).toBe(7);
    expect(c.chapters.reduce((n, x) => n + x.lessonCount, 0)).toBe(80);
    expect(c.prerequisiteLessons).toHaveLength(1);
    expect(c.lessonCount).toBe(81);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('leaves the optional formative extensions unauthored', () => {
    const ids = AUTHORED_CHAPTERS.flatMap((c) => c.sections()).map((s) => s.contentArtifactId);
    expect(ids.some((i) => /fo8|special_sum|fo11|chain_rule/.test(i))).toBe(false);
  });

  it('reaches the student through the real renderer', () => {
    __setAuthoredLearnPreviewForTests(true);
    const lesson = C11_STA_SECTIONS[6];
    const { container } = render(
      <LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />
    );
    // The idea stage carries the prose; this lesson has no figure.
    const idea = screen.getAllByRole('button', { name: /Learn the idea/i })[0];
    if (idea) fireEvent.click(idea);
    expect(container.textContent).toMatch(/step deviation/i);
    expect(container.textContent).toMatch(/the same variance|agree/i);
    __setAuthoredLearnPreviewForTests(null);
  });
});
