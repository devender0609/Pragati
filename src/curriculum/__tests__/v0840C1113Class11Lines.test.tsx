// ---------------------------------------------------------------------------
// v0.84.0-c11.13 checkpoint 84 — CLASS 11 CHAPTER 9, STRAIGHT LINES.
//
// The governing question: can one geometric line exist independently of
// whichever equation happens to describe it — so slope, inclination,
// parallelism, perpendicularity, graphing and distance all reconcile,
// vertical lines included?
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import {
  areParallel, arePerpendicular, axisParallelForm, distanceToLine, drawingEndpoints,
  generalForm, inclination, interceptForm, intercepts, line,
  lineFromPointSlope, lineGraph, lineThrough, pointIsOn, pointSlopeForm, sameLine,
  inclinationIsExact, slopeInterceptForm, slopeMatchesInclination, slopeOf, slopeThrough, formatSlope,
  tanAngleBetween, validateLineGraph, verticalLine,
} from '../straightLine';
import { pt, rational, formatRadical, formatRational, radicalValue } from '../coordinateGeometry';
import { formatAngle } from '../angleMeasure';
import { validateVisual } from '../visualSpecification';
import {
  C11_STL_SECTIONS, CANONICAL_LINE_GRAPHS, L_345, L_AB, L_ANTI, L_DIAG, L_HORZ,
  L_INT, L_VERT, P_A, P_B, P_Q,
} from '../straightLinesClass11Sections';
import { C11_SETS_SECTIONS } from '../setsClass11Sections';
import { C11_TRIG_SECTIONS } from '../trigClass11Sections';
import { C11_RF_SECTIONS } from '../relationsClass11Sections';
import { C11_CPX_SECTIONS } from '../complexClass11Sections';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';

const DEC = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', '..', '..', 'class11-source', 'CLASS11_DECOMPOSITION.json'), 'utf8'
)) as Array<Record<string, string | string[]>>;
const STL = DEC.filter((u) => String(u.unitId).startsWith('C11-STL'));
const FO9 = STL.find((u) => u.unitId === 'C11-STL-FO9')!;

describe('a line exists apart from its equation', () => {
  it('treats scalar multiples as the same line', () => {
    expect(sameLine(line('a', 2, 3, -6), line('b', 4, 6, -12))).toBe(true);
    expect(sameLine(line('c', 2, 3, -6), line('d', -2, -3, 6))).toBe(true);
    // Not string equality: the two were written differently.
    expect(generalForm(line('a', 2, 3, -6))).toBe(generalForm(line('b', 4, 6, -12)));
  });

  it('does not call parallel lines equal', () => {
    expect(sameLine(line('e', 2, 3, -6), line('f', 2, 3, 6))).toBe(false);
    expect(areParallel(line('e', 2, 3, -6), line('f', 2, 3, 6))).toBe(true);
  });

  it('refuses an equation that is not a line', () => {
    expect(() => line('bad', 0, 0, 5)).toThrow(/not a line/);
  });

  it('knows which points are on it', () => {
    expect(pointIsOn(L_AB, P_A)).toBe(true);
    expect(pointIsOn(L_AB, P_B)).toBe(true);
    expect(pointIsOn(L_AB, pt('Z', 0, 5, 'Z'))).toBe(false);
  });
});

describe('slope, with the vertical case refused rather than faked', () => {
  it('computes an exact rational slope', () => {
    expect(formatSlope(slopeThrough(P_A, P_B))).toBe('2');
    expect(formatSlope(slopeOf(L_AB))).toBe('2');
    expect(formatSlope(slopeThrough(pt('O', 0, 0, 'O'), pt('R', 5, -2, 'R')))).toBe('-2/5');
  });

  it('reports a vertical slope as undefined, never Infinity', () => {
    const s = slopeOf(L_VERT);
    expect(s.kind).toBe('undefined');
    expect(formatSlope(s)).toBe('not defined');
    const t = slopeThrough(pt('V1', 3, 1, 'V1'), pt('V2', 3, 7, 'V2'));
    expect(t.kind).toBe('undefined');
    if (t.kind === 'undefined') expect(t.reason).toMatch(/vertical/);
    const asAny = s as unknown as { value?: number };
    expect(asAny.value).toBeUndefined();
  });

  it('keeps a horizontal slope at zero, distinct from undefined', () => {
    expect(formatSlope(slopeOf(L_HORZ))).toBe('0');
    expect(slopeOf(L_HORZ).kind).toBe('defined');
  });

  it('is unaffected by which point is taken first', () => {
    expect(formatSlope(slopeThrough(P_A, P_B))).toBe(formatSlope(slopeThrough(P_B, P_A)));
  });

  it('represents a vertical line exactly', () => {
    expect(axisParallelForm(L_VERT)).toBe('x = 3');
    expect(generalForm(L_VERT)).toBe('x \u2212 3 = 0');
    expect(slopeInterceptForm(L_VERT)).toBeNull();
  });
});

describe('inclination reuses the typed angle', () => {
  it('gives the inclination as an angle with a unit', () => {
    expect(formatAngle(inclination(L_DIAG))).toBe('45\u00b0');
    expect(formatAngle(inclination(L_HORZ))).toBe('0\u00b0');
    expect(formatAngle(inclination(L_VERT))).toBe('90\u00b0');
    expect((inclination(L_DIAG) as { unit: string }).unit).toBe('degree');
  });

  it('reconciles slope with tan of the inclination', () => {
    for (const l of [L_DIAG, L_ANTI, L_HORZ, L_AB]) {
      expect(slopeMatchesInclination(l), generalForm(l)).toBe(true);
    }
    // And says which inclinations are exact rather than rounded.
    expect(inclinationIsExact(L_DIAG)).toBe(true);
    expect(inclinationIsExact(L_HORZ)).toBe(true);
    expect(inclinationIsExact(L_AB)).toBe(false);
    // The vertical case is exactly where m = tan θ breaks.
    expect(slopeMatchesInclination(L_VERT)).toBe(false);
  });
});

describe('parallel and perpendicular work for vertical lines too', () => {
  it('recognises two vertical lines as parallel', () => {
    const v1 = verticalLine('v1', rational(1, 1));
    const v2 = verticalLine('v2', rational(5, 1));
    expect(areParallel(v1, v2)).toBe(true);
    // A slope test would be comparing two undefined values here.
    expect(slopeOf(v1).kind).toBe('undefined');
  });

  it('recognises horizontal against vertical as perpendicular', () => {
    expect(arePerpendicular(L_HORZ, L_VERT)).toBe(true);
    expect(arePerpendicular(L_VERT, L_HORZ)).toBe(true);
  });

  it('applies the slope condition where both slopes exist', () => {
    expect(arePerpendicular(L_DIAG, L_ANTI)).toBe(true);
    expect(arePerpendicular(L_DIAG, L_HORZ)).toBe(false);
    expect(areParallel(L_INT, line('p', 4, 6, 1))).toBe(true);
  });

  it('gives no tangent for parallel or perpendicular pairs', () => {
    expect(tanAngleBetween(L_DIAG, L_ANTI)).toBeNull();
    expect(tanAngleBetween(L_INT, line('q', 4, 6, 1))).toBeNull();
    expect(formatRational(tanAngleBetween(L_DIAG, L_HORZ)!)).toBe('1');
  });

  it('never divides by zero computing an angle', () => {
    for (const [a, b] of [[L_DIAG, L_ANTI], [L_VERT, L_HORZ], [L_VERT, L_DIAG]] as const) {
      expect(() => tanAngleBetween(a, b)).not.toThrow();
    }
  });
});

describe('the named forms all come from the one object', () => {
  it('derives slope-intercept, intercept and point-slope forms', () => {
    expect(slopeInterceptForm(L_AB)).toBe('y = 2x');
    expect(interceptForm(L_INT)).toBe('x/3 + y/2 = 1');
    expect(pointSlopeForm(L_AB, P_A)).toBe('y \u2212 2 = 2(x \u2212 1)');
    expect(formatRational(intercepts(L_INT).x!)).toBe('3');
    expect(formatRational(intercepts(L_INT).y!)).toBe('2');
  });

  it('declines a form the line does not have, rather than dividing by zero', () => {
    expect(interceptForm(L_DIAG)).toBeNull();   // through the origin
    expect(slopeInterceptForm(L_VERT)).toBeNull();
    expect(pointSlopeForm(L_VERT, pt('V', 3, 5, 'V'))).toBeNull();
    expect(axisParallelForm(L_AB)).toBeNull();
  });

  it('rebuilds the same line from a point and a slope', () => {
    const rebuilt = lineFromPointSlope('r', P_A, rational(2, 1));
    expect(sameLine(rebuilt, L_AB)).toBe(true);
  });

  it('builds the vertical line through two points without a slope', () => {
    const v = lineThrough('vv', pt('V1', 3, 1, 'V1'), pt('V2', 3, 7, 'V2'));
    expect(sameLine(v, L_VERT)).toBe(true);
    expect(slopeOf(v).kind).toBe('undefined');
  });

  it('refuses two identical points', () => {
    expect(() => lineThrough('x', P_A, pt('A2', 1, 2, 'A2'))).toThrow(/distinct/);
  });
});

describe('distance from a point to a line', () => {
  it('is exact and reduced', () => {
    expect(formatRadical(distanceToLine(L_345, P_Q))).toBe('1');
    expect(formatRadical(distanceToLine(line('xy', 1, 1, 0), pt('R', 1, 0, 'R')))).toBe('1/2\u221a2');
    expect(radicalValue(distanceToLine(line('xy', 1, 1, 0), pt('R', 1, 0, 'R'))))
      .toBeCloseTo(Math.SQRT1_2, 12);
  });

  it('is zero exactly when the point is on the line', () => {
    expect(formatRadical(distanceToLine(L_AB, P_A))).toBe('0');
    expect(radicalValue(distanceToLine(L_AB, P_B))).toBe(0);
    expect(radicalValue(distanceToLine(L_AB, pt('Z', 0, 5, 'Z')))).toBeGreaterThan(0);
  });

  it('does not depend on how the equation was scaled', () => {
    for (const k of [2, 3, -1, -5]) {
      const scaled = line(`k${k}`, 3 * k, 4 * k, -5 * k);
      expect(formatRadical(distanceToLine(scaled, P_Q)), `k=${k}`)
        .toBe(formatRadical(distanceToLine(L_345, P_Q)));
    }
  });

  it('is never negative, on either side of the line', () => {
    for (const p of [pt('U', 5, 5, 'U'), pt('D', -5, -5, 'D')]) {
      expect(radicalValue(distanceToLine(L_345, p))).toBeGreaterThan(0);
    }
  });
});

describe('the line graph passes all four registration layers', () => {
  it('1 and 2 — the spec exists and the shared validator knows it', () => {
    for (const g of CANONICAL_LINE_GRAPHS) {
      expect(g.type).toBe('coordinate_line_graph');
      expect(validateVisual(g as never), g.id).toEqual([]);
    }
  });

  it('rejects a false claim about a marked point, in both directions', () => {
    const offLine = lineGraph('bad1', [L_DIAG], 'alt text here', { markedPoints: [pt('Z', 1, 5, 'Z')] });
    expect(validateLineGraph(offLine).join(' ')).toMatch(/marked as on a line but lies on none/);
    const onLine = lineGraph('bad2', [L_DIAG], 'alt text here', { externalPoints: [pt('W', 2, 2, 'W')] });
    expect(validateLineGraph(onLine).join(' ')).toMatch(/marked as off the lines but actually lies on one/);
  });

  it('draws a vertical line truly vertical and a horizontal one truly horizontal', () => {
    const [v1, v2] = drawingEndpoints(L_VERT, 6);
    expect(v1.x).toBeCloseTo(v2.x, 12);
    expect(v1.x).toBeCloseTo(3, 12);
    const [h1, h2] = drawingEndpoints(L_HORZ, 6);
    expect(h1.y).toBeCloseTo(h2.y, 12);
    expect(h1.y).toBeCloseTo(-2, 12);
  });

  it('puts every drawn endpoint on its own line', () => {
    for (const g of CANONICAL_LINE_GRAPHS) {
      for (const l of g.lines) {
        for (const e of drawingEndpoints(l, g.span)) {
          const resid = Number(l.a.num / l.a.den) * e.x + Number(l.b.num / l.b.den) * e.y
            + Number(l.c.num / l.c.den);
          expect(Math.abs(resid), `${g.id} ${generalForm(l)}`).toBeLessThan(1e-9);
        }
      }
    }
  });

  it('3 and 4 — the union accepts it and the real renderer draws it', () => {
    const lesson = C11_STL_SECTIONS.find((s) => s.contentArtifactId.includes('s9_2_slope'))!;
    const { container, unmount } = render(
      <LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />
    );
    fireEvent.click(screen.getAllByRole('button', { name: /See it/i })[0]);
    const svgs = container.querySelectorAll('svg[role="img"]');
    expect(svgs.length).toBeGreaterThan(0);
    // A real drawing with strokes, not an empty frame.
    expect(container.querySelectorAll('line').length).toBeGreaterThan(2);
    expect([...svgs].some((s) => (s.getAttribute('aria-label') || '').includes('slope'))).toBe(true);
    unmount(); cleanup();
  });

  it('describes the line rather than pixel endpoints, without colour', () => {
    for (const g of CANONICAL_LINE_GRAPHS) {
      expect(g.altText.length, g.id).toBeGreaterThan(100);
      expect(g.altText, g.id).not.toMatch(/\b(red|blue|green|colour|color)\b/i);
      expect(g.altText, g.id).not.toMatch(/pixel|endpoint of the drawing/i);
    }
  });
});

describe('the six lessons', () => {
  it('are all authored under Chapter 9 with the right provenance', () => {
    expect(C11_STL_SECTIONS.length).toBe(6);
    expect(STL.length).toBe(6);
    expect(new Set(C11_STL_SECTIONS.map((s) => s.contentArtifactId)).size).toBe(6);
    const by = (frag: string) => C11_STL_SECTIONS.find((s) => s.contentArtifactId.includes(frag))!;
    expect(by('s9_2_1').source.officialSubsectionNumber).toBe('9.2.1');
    expect(by('s9_2_1').source.officialSectionId).toBe('ncert_kemh1_s9_2');
    for (const id of ['axis_point_slope', 'forms_lesson']) {
      expect(by(id).source.scopeFragmentId).toBe('SF-2-SUMMATIVE');
      expect(by(id).source.officialSectionId).toBe('ncert_kemh1_s9_3');
    }
    expect(by('fo9').source.scopeFragmentId).toBe('SF-2-FORMATIVE');
    expect(by('fo9').source.officialSectionId).toBe('ncert_kemh1_s9_3');
    for (const s of C11_STL_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_kemh1_ch09');
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('carries all five stages with no placeholder or leaked value', () => {
    for (const s of C11_STL_SECTIONS) {
      expect(s.explanation.length, s.contentArtifactId).toBeGreaterThanOrEqual(3);
      expect(s.workedExamples.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.guidedPractice.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.independentPractice.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.reasoningApplication.length, s.contentArtifactId).toBeGreaterThanOrEqual(1);
      const all = JSON.stringify(s);
      expect(all, s.contentArtifactId).not.toMatch(/\b(TODO|TBD|placeholder|FIXME)\b/i);
      expect(all, s.contentArtifactId).not.toMatch(/\$\{/);
      // Guards leaked implementation values. Checkpoint 84 added the two
      // booleans after finding ten of them rendered into student prose.
      expect(all, s.contentArtifactId).not.toMatch(/\bnull\b|\bNaN\b|\bInfinity\b/);
      // Narrowed at checkpoint 84B: a leaked value attaches to a colon.
      // " true." also matches ordinary English — "and that remains true" —
      // and the source-level guard in the raw-value suite catches the real
      // defect precisely, so this one no longer needs the loose form.
      expect(all, s.contentArtifactId).not.toMatch(/:\s*(?:true|false|null|undefined|NaN|Infinity)\b/);
    }
  });

  it('uses every term it defines', () => {
    for (const s of C11_STL_SECTIONS) {
      const body = [s.learningGoal, s.summary, ...s.explanation,
        ...s.workedExamples.flatMap((w) => [w.prompt, w.answer, ...w.steps.map((x) => `${x.text} ${x.reasoning}`)]),
        ...s.guidedPractice.map((g) => `${g.prompt} ${g.answer} ${g.rationale}`),
        ...s.independentPractice.map((p) => `${p.prompt} ${p.answer} ${p.rationale}`),
        ...s.reasoningApplication.map((r) => `${r.prompt} ${r.expectedReasoning}`)].join(' ').toLowerCase();
      for (const v of s.vocabulary) {
        const head = v.term.toLowerCase().split(/[\s\u2019'-]/).slice(-1)[0];
        expect(body.includes(v.term.toLowerCase()) || body.includes(head),
          `${s.contentArtifactId} defines "${v.term}" and never uses it`).toBe(true);
      }
    }
  });

  it('gives every worked-example step a real justification', () => {
    for (const s of C11_STL_SECTIONS) {
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId} ${w.id}`).toBeGreaterThan(39);
        }
      }
    }
  });

  it('never calls a vertical slope infinite', () => {
    const all = C11_STL_SECTIONS.flatMap((s) => [...s.explanation, s.summary]).join(' ');
    expect(all).toMatch(/not defined|no slope/i);
    expect(all).not.toMatch(/slope is infinit|infinite slope/i);
  });

  it('renders all six through the real LearnSectionView', () => {
    __setAuthoredLearnPreviewForTests(true);
    for (const s of C11_STL_SECTIONS) {
      const { unmount, container } = render(
        <LearnSectionView content={learnContentFor(s)} visualsById={s.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      expect(container.textContent ?? '', s.contentArtifactId).not.toMatch(/ncert_kemh1_s|contentArtifactId/);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });
});

describe('scope fragments and formative governance', () => {
  it('keeps the two halves of section 9.3 apart', () => {
    const summative = STL.filter((u) => ['C11-STL-03', 'C11-STL-04'].includes(String(u.unitId)));
    expect(summative.length).toBe(2);
    for (const u of summative) expect(u.assessmentStatus).toBe('SUMMATIVE_CORE');
    expect(FO9.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(FO9.instructionalStatus).toBe('OPTIONAL_ENRICHMENT');
    // Same parent section, different assessment status.
    for (const u of [...summative, FO9]) {
      expect((u.source as unknown as { parentSection: string }).parentSection).toBe('9.3');
    }
  });

  it('excludes FO9 from summative eligibility while the other five are not', () => {
    const eligible = (u: Record<string, unknown>) => u.assessmentStatus === 'SUMMATIVE_CORE';
    expect(STL.filter(eligible).length).toBe(5);
    expect(eligible(FO9)).toBe(false);
  });

  it('keeps six formative-only units with two different instructional statuses', () => {
    const ids = ['C11-SET-FO1', 'C11-RF-FO2', 'C11-TRG-FO3', 'C11-CPX-FO5a', 'C11-CPX-FO5b', 'C11-STL-FO9'];
    const units = ids.map((i) => DEC.find((u) => u.unitId === i)!);
    for (const u of units) expect(u.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(units[0].instructionalStatus).toBe('REQUIRED_CORE');
    for (const u of units.slice(1)) expect(u.instructionalStatus).toBe('OPTIONAL_ENRICHMENT');
    expect(new Set(units.map((u) => u.instructionalStatus)).size).toBe(2);
  });
});

describe('delivery, the conic prerequisite, and prior work', () => {
  it('shows 39 Class 11 lessons internally and none publicly', () => {
    expect(authoredLearnCatalogueForGrade('class11').lessonCount).toBe(0);
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class11');
    expect(cat.lessonCount).toBe(81);
    expect(cat.chapters.map((c) => c.number)).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14]);
    expect(cat.chapters.map((c) => c.lessons.length)).toEqual([12, 6, 8, 7, 5, 1, 7, 6, 8, 6, 7, 7]);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('satisfies the prerequisite Conic Sections needs', () => {
    const con3 = DEC.find((u) => u.unitId === 'C11-CON-03')!;
    expect(con3.prerequisites).toContain('C11-STL-01');
    // C11-STL-01 is the slope lesson, now authored.
    const slope = C11_STL_SECTIONS.find((s) => s.contentArtifactId.includes('s9_2_slope'));
    expect(slope).toBeTruthy();
    expect(slope!.reviewStatus).toBe('authored_draft');
  });

  it('leaves Chapters 1 to 4 and their visuals intact', () => {
    expect([C11_SETS_SECTIONS.length, C11_RF_SECTIONS.length,
      C11_TRIG_SECTIONS.length, C11_CPX_SECTIONS.length]).toEqual([12, 6, 8, 7]);
    for (const s of [...C11_SETS_SECTIONS, ...C11_RF_SECTIONS, ...C11_TRIG_SECTIONS, ...C11_CPX_SECTIONS]) {
      expect(s.contentArtifactVersion).toBe(1);
      for (const v of s.visuals) expect(validateVisual(v as never), s.contentArtifactId).toEqual([]);
    }
  });

  it('leaves Classes 9 and 10 unchanged', () => {
    __setAuthoredLearnPreviewForTests(true);
    expect(authoredLearnCatalogueForReview('class10').lessonCount).toBe(65);
    expect(authoredLearnCatalogueForReview('class9').lessonCount).toBe(92);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('authors the resolved human-check unit and leaves the other alone', () => {
    const authored = allAuthoredSections().map((s) => s.contentArtifactId).join(' ');
    // v0.84.0-c11.19 checkpoint 87 — one of the two human-check units has
    // been RESOLVED by an explicit policy decision: C11-IND-01 is authored
    // as a standalone CBSE-only required prerequisite. The other is
    // untouched, so this asserts the split rather than a blanket silence.
    expect(authored).toMatch(/induction/i);
    expect(authored).not.toMatch(/graphical_inequal/i);
  });
});
