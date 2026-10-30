// ---------------------------------------------------------------------------
// v0.84.0-c11.9 checkpoint 80 — CLASS 11 CHAPTER 3, TRIGONOMETRIC FUNCTIONS.
//
// The governing question: can a broader radian/function model sit BESIDE the
// frozen Class 10 acute-angle model, agree with it where their domains
// overlap, and leave it entirely untouched?
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import {
  addTurns, degrees, formatAngle, isCoterminal, piMultiple, principal,
  sameAngle, sense, toDegree, toRadian,
} from '../angleMeasure';
import {
  CIRCULAR_FUNCTIONS, FUNCTION_NAMES, evaluate, generalSolution,
  inDomain, numberOf, onUnitCircle, periodHolds, pythagoreanHolds, quadrantOf,
  signsInQuadrant, solutionFamilyChecks, solutionMembers, unitCirclePoint,
  validateGraph, valueAt, writtenValue,
} from '../circularFunctions';
import { ratioAt, writtenOf, valueOf, isDefined, RATIO_NAMES, ACUTE_STANDARD_ANGLES } from '../specialAngles';
import { C11_TRIG_SECTIONS, CANONICAL_GRAPHS, G_SIN, G_TAN } from '../trigClass11Sections';
import { C11_SETS_SECTIONS } from '../setsClass11Sections';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';

const DEC = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', '..', '..', 'class11-source', 'CLASS11_DECOMPOSITION.json'), 'utf8'
)) as Array<Record<string, string>>;
const TRG = DEC.filter((u) => u.unitId.startsWith('C11-TRG'));
const FO3 = TRG.find((u) => u.unitId === 'C11-TRG-FO3')!;
const FO1 = DEC.find((u) => u.unitId === 'C11-SET-FO1')!;

describe('an angle carries its unit and its sign', () => {
  it('converts exactly in both directions and round-trips', () => {
    expect(formatAngle(toRadian(degrees(60)))).toBe('\u03c0/3');
    expect(formatAngle(toRadian(degrees(150)))).toBe('5\u03c0/6');
    expect(formatAngle(toDegree(piMultiple(5, 6)))).toBe('150\u00b0');
    for (const d of [0, 30, 45, 60, 90, 120, 150, 180, 270, 330]) {
      expect(formatAngle(toDegree(toRadian(degrees(d))))).toBe(`${d}\u00b0`);
    }
  });

  it('preserves sign through conversion', () => {
    expect(formatAngle(toRadian(degrees(-45)))).toBe('\u2212\u03c0/4');
    expect(formatAngle(toDegree(piMultiple(-1, 3)))).toBe('-60\u00b0');
    expect(sense(degrees(-45))).toBe('clockwise');
    expect(sense(degrees(45))).toBe('anticlockwise');
    expect(sense(degrees(0))).toBe('none');
  });

  it('does not represent an angle that has forgotten its unit', () => {
    const d = degrees(60), r = piMultiple(1, 3);
    expect(d.unit).toBe('degree');
    expect(r.unit).toBe('radian');
    expect(sameAngle(d, r)).toBe(true);
    // 60 degrees and 60 radians are different angles, and both are expressible.
    expect(sameAngle(degrees(60), piMultiple(60, 1))).toBe(false);
  });

  it('recognises coterminal angles without equating them', () => {
    expect(isCoterminal(degrees(30), degrees(390))).toBe(true);
    expect(isCoterminal(degrees(90), degrees(-270))).toBe(true);
    expect(isCoterminal(degrees(30), degrees(210))).toBe(false);
    expect(sameAngle(degrees(30), degrees(390))).toBe(false);
    expect(formatAngle(principal(piMultiple(-1, 3)))).toBe('5\u03c0/3');
    expect(isCoterminal(piMultiple(1, 4), addTurns(piMultiple(1, 4), 3))).toBe(true);
  });
});

describe('the unit circle owns the values', () => {
  const ARGS = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

  it('puts every point on the unit circle', () => {
    for (const d of ARGS) expect(onUnitCircle(unitCirclePoint(degrees(d))), `${d}`).toBe(true);
  });

  it('establishes the Pythagorean identity for every representable argument', () => {
    for (const d of ARGS) expect(pythagoreanHolds(degrees(d)), `${d}`).toBe(true);
  });

  it('derives the other four by division, so undefined is a kind and not a number', () => {
    expect(writtenValue(valueAt(degrees(90), 'tan'))).toBe('not defined');
    expect(writtenValue(valueAt(degrees(90), 'sec'))).toBe('not defined');
    expect(writtenValue(valueAt(degrees(180), 'cot'))).toBe('not defined');
    expect(writtenValue(valueAt(degrees(0), 'cosec'))).toBe('not defined');
    expect(() => numberOf(valueAt(degrees(90), 'tan'))).toThrow(/no value/);
    for (const d of ARGS) {
      for (const n of FUNCTION_NAMES) {
        const v = valueAt(degrees(d), n);
        if (v.kind === 'defined') {
          const num = numberOf(v);
          expect(Number.isFinite(num), `${n} ${d}`).toBe(true);
          expect(Number.isNaN(num), `${n} ${d}`).toBe(false);
        }
      }
    }
  });

  it('gives values a triangle could not', () => {
    expect(writtenValue(valueAt(degrees(150), 'cos'))).toBe('\u2212\u221a3/2');
    expect(writtenValue(valueAt(degrees(210), 'sin'))).toBe('\u22121/2');
    expect(writtenValue(valueAt(degrees(180), 'cos'))).toBe('\u22121');
  });
});

describe('Class 10 is untouched, and the two models agree where they overlap', () => {
  it('agrees on every acute standard value, by exact value', () => {
    let compared = 0;
    for (const d of ACUTE_STANDARD_ANGLES) {
      for (const n of RATIO_NAMES) {
        const c10 = ratioAt(d, n);
        const c11 = valueAt(degrees(d), n);
        if (!isDefined(c10)) { expect(c11.kind).toBe('undefined'); continue; }
        expect(c11.kind, `${n} ${d}`).toBe('defined');
        expect(valueOf(c10), `${n} ${d}`).toBeCloseTo(numberOf(c11), 12);
        compared += 1;
      }
    }
    expect(compared).toBe(18);
  });

  it('does not force either model to adopt the other\u2019s written convention', () => {
    // Class 10 leaves the radical in the denominator; Class 11 rationalises.
    // Equal values, different typography, and neither is bent to match.
    expect(writtenOf(ratioAt(30, 'tan'))).toBe('1/\u221a3');
    expect(writtenValue(valueAt(degrees(30), 'tan'))).toBe('\u221a3/3');
    expect(valueOf(ratioAt(30, 'tan'))).toBeCloseTo(numberOf(valueAt(degrees(30), 'tan')), 12);
  });

  it('leaves the Class 10 table exactly as it was', () => {
    expect(ACUTE_STANDARD_ANGLES).toEqual([30, 45, 60]);
    expect(writtenOf(ratioAt(45, 'sin'))).toBe('1/\u221a2');
    expect(writtenOf(ratioAt(90, 'tan'))).toBe('not defined');
    expect(writtenOf(ratioAt(60, 'cos'))).toBe('1/2');
  });

  it('never asks the Class 10 model about an argument outside its domain', () => {
    expect(() => ratioAt(150 as never, 'sin')).toThrow(/standard angle/);
    // The Class 11 model answers there instead, rather than Class 10 being widened.
    expect(valueAt(degrees(150), 'sin').kind).toBe('defined');
  });
});

describe('quadrant signs come from the coordinates', () => {
  it('computes the sign table rather than storing it', () => {
    expect(signsInQuadrant(1)).toEqual({ sin: '+', cos: '+', tan: '+', cosec: '+', sec: '+', cot: '+' });
    expect(signsInQuadrant(2).cos).toBe('\u2212');
    expect(signsInQuadrant(2).sin).toBe('+');
    expect(signsInQuadrant(3).tan).toBe('+');
    expect(signsInQuadrant(4).sin).toBe('\u2212');
  });

  it('keeps a reciprocal\u2019s sign equal to its partner\u2019s', () => {
    for (const q of [1, 2, 3, 4] as const) {
      const s = signsInQuadrant(q);
      expect(s.cosec).toBe(s.sin);
      expect(s.sec).toBe(s.cos);
      expect(s.cot).toBe(s.tan);
    }
  });

  it('puts an axis argument in no quadrant', () => {
    expect(quadrantOf(degrees(0))).toBe('positive_x');
    expect(quadrantOf(degrees(90))).toBe('positive_y');
    expect(quadrantOf(degrees(180))).toBe('negative_x');
    expect(quadrantOf(degrees(270))).toBe('negative_y');
    expect(quadrantOf(degrees(135))).toBe(2);
    expect(quadrantOf(degrees(210))).toBe(3);
  });
});

describe('functions as objects: domain, range, period and graphs', () => {
  it('records the correct period for each function and verifies it', () => {
    expect(CIRCULAR_FUNCTIONS.sin.period).toEqual({ piNum: 2, piDen: 1 });
    expect(CIRCULAR_FUNCTIONS.tan.period).toEqual({ piNum: 1, piDen: 1 });
    expect(CIRCULAR_FUNCTIONS.sec.period).toEqual({ piNum: 2, piDen: 1 });
    for (const n of FUNCTION_NAMES) expect(periodHolds(n), n).toBe(true);
  });

  it('excludes exactly the arguments where the denominator vanishes', () => {
    expect(inDomain('tan', Math.PI / 2)).toBe(false);
    expect(inDomain('sec', Math.PI / 2)).toBe(false);
    expect(inDomain('cot', 0)).toBe(false);
    expect(inDomain('cosec', Math.PI)).toBe(false);
    expect(inDomain('sin', Math.PI / 2)).toBe(true);
    expect(evaluate('tan', Math.PI / 2)).toBeNull();
  });

  it('respects the range of every function', () => {
    for (let x = -6; x < 6; x += 0.137) {
      for (const n of FUNCTION_NAMES) {
        const y = evaluate(n, x);
        if (y === null) continue;
        expect(CIRCULAR_FUNCTIONS[n].inRange(y), `${n} at ${x}`).toBe(true);
      }
    }
  });

  it('breaks a graph at every undefined argument and never draws through one', () => {
    expect(G_TAN.branches.length).toBeGreaterThan(1);
    expect(G_TAN.breaks.length).toBeGreaterThan(0);
    for (const g of CANONICAL_GRAPHS) expect(validateGraph(g), g.id).toEqual([]);
    for (const b of G_TAN.branches) {
      for (const br of G_TAN.breaks) {
        const spans = b.points.some((p) => p.x < br) && b.points.some((p) => p.x > br);
        expect(spans, `a branch crosses ${br}`).toBe(false);
      }
    }
  });

  it('leaves a function defined everywhere as one unbroken curve', () => {
    expect(G_SIN.branches.length).toBe(1);
    expect(G_SIN.breaks.length).toBe(0);
  });

  it('generates every plotted point from the function', () => {
    for (const g of CANONICAL_GRAPHS) {
      for (const b of g.branches) {
        for (const p of b.points) {
          const y = evaluate(g.functionName, p.x);
          expect(y, `${g.id} at ${p.x}`).not.toBeNull();
          expect(Math.abs((y as number) - p.y), `${g.id} at ${p.x}`).toBeLessThan(1e-6);
        }
      }
    }
  });

  it('rejects a graph whose branches were joined across a break', () => {
    const joined = {
      ...G_TAN, id: 'joined',
      branches: [{ points: G_TAN.branches.flatMap((b) => b.points) }],
    };
    expect(validateGraph(joined).join(' ')).toMatch(/crosses the undefined argument/);
  });
});

describe('general solutions are an infinite family', () => {
  it('parameterises over the integers, not the naturals', () => {
    const s = generalSolution('sin', piMultiple(1, 6));
    expect(s.parameterDomain).toBe('\u2124');
    expect(s.written).toMatch(/n \u2208 \u2124/);
    expect(s.written).toMatch(/\(\u22121\)\u207f/);
  });

  it('gives members that really solve the equation, for negative n too', () => {
    for (const eq of ['sin', 'cos', 'tan'] as const) {
      const s = generalSolution(eq, piMultiple(1, 6));
      expect(solutionFamilyChecks(s, [-3, -2, -1, 0, 1, 2, 3]), eq).toBe(true);
      expect(new Set(solutionMembers(s, [-1, 0, 1]).map((x) => x.toFixed(6))).size).toBe(3);
    }
  });

  it('uses the shorter step for tangent, matching its period', () => {
    const t = generalSolution('tan', piMultiple(1, 4));
    expect(t.written).toMatch(/n\u03c0/);
    expect(t.written).not.toMatch(/2n\u03c0/);
    expect(generalSolution('cos', piMultiple(1, 4)).written).toMatch(/2n\u03c0/);
  });
});

describe('the eight lessons', () => {
  it('are all authored under Chapter 3', () => {
    expect(C11_TRIG_SECTIONS.length).toBe(8);
    expect(TRG.length).toBe(8);
    const ids = C11_TRIG_SECTIONS.map((s) => s.contentArtifactId);
    expect(new Set(ids).size).toBe(8);
    for (const s of C11_TRIG_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_kemh1_ch03');
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('carry all five stages with no placeholder', () => {
    for (const s of C11_TRIG_SECTIONS) {
      expect(s.explanation.length, s.contentArtifactId).toBeGreaterThanOrEqual(3);
      expect(s.workedExamples.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.guidedPractice.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.independentPractice.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.reasoningApplication.length, s.contentArtifactId).toBeGreaterThanOrEqual(1);
      const all = JSON.stringify(s);
      expect(all, s.contentArtifactId).not.toMatch(/\b(TODO|TBD|placeholder|FIXME)\b/i);
      expect(all, s.contentArtifactId).not.toMatch(/\$\{/);
    }
  });

  it('uses every term it defines', () => {
    for (const s of C11_TRIG_SECTIONS) {
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
    for (const s of C11_TRIG_SECTIONS) {
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId} ${w.id}`).toBeGreaterThan(39);
        }
      }
    }
  });

  it('never writes infinity as a trigonometric value', () => {
    for (const s of C11_TRIG_SECTIONS) {
      const body = [...s.explanation, ...s.workedExamples.map((w) => w.answer)].join(' ');
      expect(body, s.contentArtifactId).not.toMatch(/=\s*\u221e|equals infinity|is infinity/i);
    }
  });

  it('never rejects a negative angle as invalid', () => {
    const a = C11_TRIG_SECTIONS.find((s) => s.contentArtifactId.includes('angles_lesson'))!;
    const body = [...a.explanation, ...a.workedExamples.map((w) => w.answer)].join(' ');
    expect(body).toMatch(/clockwise/);
    expect(body).not.toMatch(/negative angles? (?:are|is) (?:not|invalid|impossible)/i);
  });

  it('renders all eight through the real LearnSectionView', () => {
    __setAuthoredLearnPreviewForTests(true);
    for (const s of C11_TRIG_SECTIONS) {
      const content = learnContentFor(s);
      const { unmount, container } = render(<LearnSectionView content={content} visualsById={s.visualsById} />);
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      expect(container.textContent ?? '', s.contentArtifactId).not.toMatch(/ncert_kemh1_s|contentArtifactId/);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });
});

describe('FO3 governance, and the contrast with FO1', () => {
  it('is formative-only AND optional enrichment', () => {
    expect(FO3.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(FO3.instructionalStatus).toBe('OPTIONAL_ENRICHMENT');
  });

  it('coexists with FO1, which is formative-only AND required core', () => {
    expect(FO1.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(FO1.instructionalStatus).toBe('REQUIRED_CORE');
    // Same assessment status, different instructional status: the two fields
    // are genuinely independent and neither is read off the other.
    expect(FO1.assessmentStatus).toBe(FO3.assessmentStatus);
    expect(FO1.instructionalStatus).not.toBe(FO3.instructionalStatus);
  });

  it('is excluded from summative eligibility while the other seven are not', () => {
    const eligible = (u: Record<string, string>) => u.assessmentStatus === 'SUMMATIVE_CORE';
    expect(eligible(FO3)).toBe(false);
    expect(TRG.filter(eligible).length).toBe(7);
  });

  it('names a CBSE entry and no official section', () => {
    const art = C11_TRIG_SECTIONS.find((s) => s.contentArtifactId.includes('fo3'))!;
    expect(art.source.sourceKind).toBe('cbse_only');
    expect(art.source.cbseEntryId).toBe('FO-3');
    expect(art.source.officialSectionId).toBe('');
    expect(art.source.sectionNumber).toBe('');
    expect(art.source.textbook).toMatch(/CBSE 2026-27/);
  });

  it('appears in the internal catalogue like any other lesson', () => {
    __setAuthoredLearnPreviewForTests(true);
    const ch3 = authoredLearnCatalogueForReview('class11').chapters.find((c) => c.number === 3)!;
    expect(ch3.lessons.map((l) => l.contentArtifactId))
      .toContain('ncert_kemh1_fo3_general_solutions_lesson');
    expect(ch3.lessons.length).toBe(8);
    __setAuthoredLearnPreviewForTests(null);
  });
});

describe('delivery governance and prior grades', () => {
  it('shows twenty Class 11 lessons internally and none publicly', () => {
    expect(authoredLearnCatalogueForGrade('class11').lessonCount).toBe(0);
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class11');
    expect(cat.lessonCount).toBe(33);
    expect(cat.chapters.find((c) => c.number === 1)!.lessons.length).toBe(12);
    expect(cat.chapters.find((c) => c.number === 3)!.lessons.length).toBe(8);
    // Chapter 2 has no authored lessons, so the catalogue omits it rather
    // than listing it empty. The chapter numbering of what IS listed stays
    // canonical, so the gap reads as a gap and not as a reordering.
    // Chapter 2 was authored at checkpoint 81, so the gap is closed.
    expect(cat.chapters.find((c) => c.number === 2)!.lessons.length).toBe(6);
    // Chapter 4 was authored at checkpoint 83.
    expect(cat.chapters.map((c) => c.number)).toEqual([1, 2, 3, 4]);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('leaves Classes 9 and 10 and the Sets chapter unchanged', () => {
    __setAuthoredLearnPreviewForTests(true);
    expect(authoredLearnCatalogueForReview('class10').lessonCount).toBe(65);
    expect(authoredLearnCatalogueForReview('class9').lessonCount).toBe(92);
    __setAuthoredLearnPreviewForTests(null);
    expect(C11_SETS_SECTIONS.length).toBe(12);
    for (const s of C11_SETS_SECTIONS) expect(s.contentArtifactVersion).toBe(1);
  });

  it('leaves the two human-check units unauthored', () => {
    const authored = allAuthoredSections().map((s) => s.contentArtifactId).join(' ');
    expect(authored).not.toMatch(/induction/i);
    expect(authored).not.toMatch(/graphical_inequal/i);
  });
});
