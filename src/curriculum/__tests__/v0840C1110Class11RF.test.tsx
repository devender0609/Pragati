// ---------------------------------------------------------------------------
// v0.84.0-c11.10 checkpoint 81 — CLASS 11 CHAPTER 2, RELATIONS AND FUNCTIONS.
//
// The governing question: can a function be a mathematical object whose
// domain, codomain, range, evaluation and graph all come from one semantic
// source, while relations stay genuinely broader and composition stays a
// separate formative-only extension?
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import {
  cartesianProduct, checkFunction, combine, compositionsAgree,
  constantFunction, formatTuple, functionFailureReason,
  identityFunction, inProduct, isManyToOne,
  pair, productCardinality, productsEqual, rangeIsProperSubsetOfCodomain,
  relation, relationCodomain, relationDomain, relationRange,
  tuple, tuplesEqual, validateFunctionGraph, validateRelation,
  buildFunctionGraph,
} from '../relationsFunctions';
import { roster, cardinality, setsEqual, type ExplicitSet } from '../setTheory';
import {
  C11_RF_SECTIONS, CANONICAL_FUNCTION_GRAPHS, F_GIF, F_LOG, F_MODULUS,
  F_RECIPROCAL, F_SIGNUM, G_GIF, G_RECIPROCAL, G_SIGNUM, LOG_AFTER_MOD,
  MOD_AFTER_LOG, PROD_AB, PROD_BA, Q_IDENTITY_OVER_IDENTITY, REL_DOUBLE,
  REL_MISSING, REL_R, SET_A, SET_B,
} from '../relationsClass11Sections';
import { C11_SETS_SECTIONS } from '../setsClass11Sections';
import { C11_TRIG_SECTIONS } from '../trigClass11Sections';
import { CIRCULAR_FUNCTIONS, inDomain as trigInDomain, evaluate as trigEvaluate } from '../circularFunctions';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';

const DEC = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', '..', '..', 'class11-source', 'CLASS11_DECOMPOSITION.json'), 'utf8'
)) as Array<Record<string, string>>;
const RF = DEC.filter((u) => u.unitId.startsWith('C11-RF'));
const FO2 = RF.find((u) => u.unitId === 'C11-RF-FO2')!;
const FO1 = DEC.find((u) => u.unitId === 'C11-SET-FO1')!;
const FO3 = DEC.find((u) => u.unitId === 'C11-TRG-FO3')!;

const set = (id: string, members: (string | number)[]): ExplicitSet =>
  ({ kind: 'explicit', id, label: id, members });

describe('ordered pairs keep their order', () => {
  it('distinguishes (1,2) from (2,1)', () => {
    expect(tuplesEqual(pair(1, 2), pair(2, 1))).toBe(false);
    expect(tuplesEqual(pair(1, 2), pair(1, 2))).toBe(true);
    expect(formatTuple(pair(1, 2))).toBe('(1, 2)');
  });

  it('builds the product from the factors and counts it correctly', () => {
    expect(PROD_AB.length).toBe(productCardinality(SET_A, SET_B));
    expect(PROD_AB.length).toBe(cardinality(SET_A) * cardinality(SET_B));
    for (const t of PROD_AB) expect(inProduct(t, SET_A, SET_B)).toBe(true);
  });

  it('does not treat A x B as B x A, despite equal cardinality', () => {
    expect(productsEqual(PROD_AB, PROD_BA)).toBe(false);
    expect(PROD_AB.length).toBe(PROD_BA.length);
  });

  it('lets a duplicated roster entry create no extra pair', () => {
    const withRepeat = set('A2', [1, 1, 2]);
    expect(cartesianProduct(withRepeat, set('B2', ['a'])).length).toBe(2);
  });

  it('extends to triples without n-ary machinery', () => {
    const triple = cartesianProduct(SET_A, SET_A, SET_A);
    expect(triple.length).toBe(8);
    expect(triple[0].coordinates.length).toBe(3);
    expect(tuplesEqual(tuple(1, 2, 3), tuple(1, 3, 2))).toBe(false);
  });

  it('gives the empty product when a factor is empty', () => {
    expect(cartesianProduct(SET_A, set('E', [])).length).toBe(0);
  });
});

describe('a relation is a subset of a product', () => {
  it('accepts a legal relation and rejects a stray pair', () => {
    expect(validateRelation(REL_R)).toEqual([]);
    const stray = relation('X', 'X', SET_A, SET_B, [pair(9, 'p')]);
    expect(validateRelation(stray).join(' ')).toMatch(/first coordinate outside/);
    const strayTarget = relation('Y', 'Y', SET_A, SET_B, [pair(1, 'zzz')]);
    expect(validateRelation(strayTarget).join(' ')).toMatch(/second coordinate outside/);
  });

  it('derives domain and range from the pairs, not from a declaration', () => {
    expect(roster(relationDomain(REL_R))).toBe('{1, 2}');
    expect(roster(relationRange(REL_R))).toBe('{p}');
  });

  it('keeps the codomain declared and larger than the range', () => {
    expect(setsEqual(relationCodomain(REL_R), SET_B)).toBe(true);
    expect(rangeIsProperSubsetOfCodomain(REL_R)).toBe(true);
    // The negative fixture: an implementation equating the two fails here.
    expect(setsEqual(relationRange(REL_R), relationCodomain(REL_R))).toBe(false);
    expect(cardinality(relationRange(REL_R))).toBeLessThan(cardinality(relationCodomain(REL_R)));
  });
});

describe('a function needs exactly one image for every input', () => {
  it('rejects an unmapped input', () => {
    const c = checkFunction(REL_MISSING);
    expect(c.isFunction).toBe(false);
    expect(c.unmapped).toEqual([2]);
    expect(functionFailureReason(REL_MISSING)).toMatch(/no image/);
  });

  it('rejects an input with two images', () => {
    const c = checkFunction(REL_DOUBLE);
    expect(c.isFunction).toBe(false);
    expect(c.multiplyMapped[0].images.length).toBe(2);
    expect(functionFailureReason(REL_DOUBLE)).toMatch(/more than one image/);
  });

  it('accepts many-to-one', () => {
    expect(checkFunction(REL_R).isFunction).toBe(true);
    expect(isManyToOne(REL_R)).toBe(true);
    expect(functionFailureReason(REL_R)).toBeNull();
  });

  it('does not silently shrink the domain to rescue a missing input', () => {
    // The pairs alone would suggest a domain of {1}; the relation is from A,
    // so it is simply not a function from A.
    expect(roster(relationDomain(REL_MISSING))).toBe('{1}');
    expect(checkFunction(REL_MISSING).isFunction).toBe(false);
  });

  it('counts a repeated identical pair once', () => {
    const r = relation('R2', 'R2', SET_A, SET_B, [pair(1, 'p'), pair(2, 'p'), pair(1, 'p')]);
    expect(checkFunction(r).isFunction).toBe(true);
  });
});

describe('a domain is part of a real function', () => {
  it('excludes non-positive arguments from the logarithm, structurally', () => {
    expect(F_LOG.inDomain(0)).toBe(false);
    expect(F_LOG.inDomain(-1)).toBe(false);
    expect(F_LOG.evaluate(-1)).toBeNull();
    expect(F_LOG.inDomain(1)).toBe(true);
  });

  it('excludes the zero of a rational denominator', () => {
    expect(F_RECIPROCAL.inDomain(0)).toBe(false);
    expect(F_RECIPROCAL.evaluate(0)).toBeNull();
    expect(F_RECIPROCAL.evaluate(2)).toBeCloseTo(0.5, 12);
  });

  it('never returns Infinity or NaN as a value', () => {
    for (const f of [F_LOG, F_RECIPROCAL, F_MODULUS, F_SIGNUM, F_GIF]) {
      for (let x = -5; x <= 5; x += 0.25) {
        const y = f.evaluate(Number(x.toFixed(4)));
        if (y === null) continue;
        expect(Number.isFinite(y), `${f.name} at ${x}`).toBe(true);
        expect(Number.isNaN(y), `${f.name} at ${x}`).toBe(false);
      }
    }
  });

  it('records range analytically rather than reading it off a graph', () => {
    expect(constantFunction(3).rangeDescription).toBe('{3}');
    expect(F_SIGNUM.rangeDescription).toBe('{\u22121, 0, 1}');
    expect(F_MODULUS.rangeDescription).toMatch(/non-negative/);
    expect(F_GIF.rangeDescription).toMatch(/integers/);
  });

  it('evaluates the standard functions from their rules', () => {
    expect(F_SIGNUM.evaluate(-4)).toBe(-1);
    expect(F_SIGNUM.evaluate(0)).toBe(0);
    expect(F_SIGNUM.evaluate(4)).toBe(1);
    expect(F_GIF.evaluate(2.7)).toBe(2);
    expect(F_GIF.evaluate(-2.3)).toBe(-3);
    expect(F_MODULUS.evaluate(-3)).toBe(3);
    expect(identityFunction().evaluate(7)).toBe(7);
  });
});

describe('graphs come from the functions and break where they must', () => {
  it('validates every canonical graph against its own function', () => {
    const fns = [F_MODULUS, F_SIGNUM, F_GIF, F_RECIPROCAL];
    CANONICAL_FUNCTION_GRAPHS.forEach((g, i) => {
      expect(validateFunctionGraph(g, fns[i]), g.id).toEqual([]);
    });
  });

  it('draws a jumping function in separate pieces', () => {
    expect(G_SIGNUM.branches.length).toBeGreaterThan(1);
    expect(G_GIF.branches.length).toBeGreaterThan(1);
  });

  it('leaves an excluded argument blank rather than drawing through it', () => {
    expect(G_RECIPROCAL.breaks).toContain(0);
    expect(G_RECIPROCAL.branches.length).toBe(2);
    for (const b of G_RECIPROCAL.branches) {
      expect(b.points.some((p) => p.x < 0) && b.points.some((p) => p.x > 0)).toBe(false);
      for (const p of b.points) expect(F_RECIPROCAL.inDomain(p.x)).toBe(true);
    }
  });

  it('rejects a graph joined across an excluded argument', () => {
    const joined = {
      ...G_RECIPROCAL, id: 'joined',
      branches: [{ points: G_RECIPROCAL.branches.flatMap((b) => b.points) }],
    };
    expect(validateFunctionGraph(joined, F_RECIPROCAL).join(' ')).toMatch(/crosses the excluded/);
  });

  it('plots no point outside the domain of the logarithm', () => {
    const g = buildFunctionGraph('g_log', F_LOG, 0.1, 5, 'the logarithm over positive arguments');
    for (const b of g.branches) for (const p of b.points) expect(p.x).toBeGreaterThan(0);
    expect(validateFunctionGraph(g, F_LOG)).toEqual([]);
  });
});

describe('algebra of functions derives its domain', () => {
  it('intersects the domains for a sum, difference and product', () => {
    for (const op of ['sum', 'difference', 'product'] as const) {
      const h = combine(op, F_LOG, F_MODULUS);
      expect(h.inDomain(-1), op).toBe(false);
      expect(h.inDomain(2), op).toBe(true);
    }
  });

  it('removes the zeros of the divisor for a quotient, structurally', () => {
    expect(Q_IDENTITY_OVER_IDENTITY.inDomain(0)).toBe(false);
    expect(Q_IDENTITY_OVER_IDENTITY.evaluate(0)).toBeNull();
    expect(Q_IDENTITY_OVER_IDENTITY.evaluate(2)).toBe(1);
    // The restriction lives in the function, so simplifying the written rule
    // cannot discard it.
    expect(Q_IDENTITY_OVER_IDENTITY.domainDescription).toMatch(/divisor is zero/);
  });

  it('computes values pointwise', () => {
    const sum = combine('sum', F_MODULUS, identityFunction());
    expect(sum.evaluate(-3)).toBe(0);
    expect(sum.evaluate(3)).toBe(6);
  });
});

describe('composition is ordered and doubly conditioned', () => {
  it('is not commutative', () => {
    expect(compositionsAgree(LOG_AFTER_MOD, MOD_AFTER_LOG, [0.5, 2, 3])).toBe(false);
  });

  it('requires both that x is in Dom(f) and that f(x) is in Dom(g)', () => {
    // The modulus is defined at zero, but its value there is rejected by log.
    expect(F_MODULUS.inDomain(0)).toBe(true);
    expect(F_LOG.inDomain(F_MODULUS.evaluate(0) as number)).toBe(false);
    expect(LOG_AFTER_MOD.inDomain(0)).toBe(false);
    expect(LOG_AFTER_MOD.evaluate(0)).toBeNull();
  });

  it('applies the inner function first', () => {
    expect(LOG_AFTER_MOD.evaluate(-2)).toBeCloseTo(Math.log(2), 12);
  });

  it('is not multiplication', () => {
    const product = combine('product', F_LOG, F_MODULUS);
    expect(compositionsAgree(LOG_AFTER_MOD, product, [2, 3, 4])).toBe(false);
  });
});

describe('the general contract fits the circular functions unchanged', () => {
  it('lets a trigonometric function satisfy the contract without being rewritten', () => {
    const asContract = {
      name: 'tan',
      inDomain: (x: number) => trigInDomain('tan', x),
      evaluate: (x: number) => trigEvaluate('tan', x),
      domainDescription: `all reals except ${CIRCULAR_FUNCTIONS.tan.domainExclusion}`,
      rangeDescription: CIRCULAR_FUNCTIONS.tan.rangeDescription,
    };
    expect(asContract.inDomain(Math.PI / 2)).toBe(false);
    expect(asContract.evaluate(Math.PI / 2)).toBeNull();
    expect(asContract.evaluate(0)).toBeCloseTo(0, 12);
    // The circular functions keep their own exact semantics; the contract is
    // satisfied by them, not imposed on them.
    expect(CIRCULAR_FUNCTIONS.tan.period).toEqual({ piNum: 1, piDen: 1 });
  });
});

describe('the six lessons', () => {
  it('are all authored under Chapter 2', () => {
    expect(C11_RF_SECTIONS.length).toBe(6);
    expect(RF.length).toBe(6);
    expect(new Set(C11_RF_SECTIONS.map((s) => s.contentArtifactId)).size).toBe(6);
    for (const s of C11_RF_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_kemh1_ch02');
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('records the two subsections against their parent section', () => {
    const sub = C11_RF_SECTIONS.filter((s) => s.source.officialSubsectionNumber);
    expect(sub.map((s) => s.source.officialSubsectionNumber)).toEqual(['2.4.1', '2.4.2']);
    for (const s of sub) {
      expect(s.source.officialSectionId).toBe('ncert_kemh1_s2_4');
      expect(s.source.sectionNumber).toBe('2.4');
    }
  });

  it('carries all five stages with no placeholder', () => {
    for (const s of C11_RF_SECTIONS) {
      expect(s.explanation.length, s.contentArtifactId).toBeGreaterThanOrEqual(3);
      expect(s.workedExamples.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.guidedPractice.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.independentPractice.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.reasoningApplication.length, s.contentArtifactId).toBeGreaterThanOrEqual(1);
      const all = JSON.stringify(s);
      expect(all, s.contentArtifactId).not.toMatch(/\b(TODO|TBD|placeholder|FIXME)\b/i);
      expect(all, s.contentArtifactId).not.toMatch(/\$\{/);
      // Guards against an implementation value leaking into prose. The
      // English word "undefined" is legitimate in a question about domains,
      // so only the JavaScript values are excluded.
      expect(all, s.contentArtifactId).not.toMatch(/\bnull\b|\bNaN\b|\bInfinity\b/);
    }
  });

  it('uses every term it defines', () => {
    for (const s of C11_RF_SECTIONS) {
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
    for (const s of C11_RF_SECTIONS) {
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId} ${w.id}`).toBeGreaterThan(39);
        }
      }
    }
  });

  it('never confuses the codomain with the range', () => {
    const r = C11_RF_SECTIONS.find((s) => s.contentArtifactId.includes('relations_lesson'))!;
    const body = [...r.explanation].join(' ');
    expect(body).toMatch(/codomain/);
    expect(body).toMatch(/range/);
    expect(body).not.toMatch(/range (?:is|equals) the codomain(?!\s*,? (?:but|and need|need))/i);
  });

  it('never calls composition a multiplication', () => {
    const f = C11_RF_SECTIONS.find((s) => s.contentArtifactId.includes('fo2'))!;
    expect([...f.explanation].join(' ')).toMatch(/not multiplication/i);
  });

  it('renders all six through the real LearnSectionView', () => {
    __setAuthoredLearnPreviewForTests(true);
    for (const s of C11_RF_SECTIONS) {
      const content = learnContentFor(s);
      const { unmount, container } = render(<LearnSectionView content={content} visualsById={s.visualsById} />);
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      expect(container.textContent ?? '', s.contentArtifactId).not.toMatch(/ncert_kemh1_s|contentArtifactId/);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });
});

describe('FO2 governance, and three distinct status combinations', () => {
  it('is formative-only and optional enrichment', () => {
    expect(FO2.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(FO2.instructionalStatus).toBe('OPTIONAL_ENRICHMENT');
  });

  it('shows assessment status does not determine instructional status', () => {
    for (const u of [FO1, FO2, FO3]) expect(u.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(FO1.instructionalStatus).toBe('REQUIRED_CORE');
    expect(FO2.instructionalStatus).toBe('OPTIONAL_ENRICHMENT');
    expect(FO3.instructionalStatus).toBe('OPTIONAL_ENRICHMENT');
    // Same assessment status across all three, two different instructional
    // statuses: neither field can be read off the other.
    expect(new Set([FO1, FO2, FO3].map((u) => u.instructionalStatus)).size).toBe(2);
  });

  it('is excluded from summative eligibility while the other five are not', () => {
    const eligible = (u: Record<string, string>) => u.assessmentStatus === 'SUMMATIVE_CORE';
    expect(eligible(FO2)).toBe(false);
    expect(RF.filter(eligible).length).toBe(5);
    for (const u of [FO1, FO2, FO3]) expect(eligible(u)).toBe(false);
  });

  it('names a CBSE entry and no official section', () => {
    const art = C11_RF_SECTIONS.find((s) => s.contentArtifactId.includes('fo2'))!;
    expect(art.source.sourceKind).toBe('cbse_only');
    expect(art.source.cbseEntryId).toBe('FO-2');
    expect(art.source.officialSectionId).toBe('');
    expect(art.source.sectionNumber).toBe('');
  });

  it('is placed last in the chapter by instructional sequence', () => {
    __setAuthoredLearnPreviewForTests(true);
    const ch2 = authoredLearnCatalogueForReview('class11').chapters.find((c) => c.number === 2)!;
    expect(ch2.lessons.length).toBe(6);
    expect(ch2.lessons[5].contentArtifactId).toBe('ncert_kemh1_fo2_composition_lesson');
    __setAuthoredLearnPreviewForTests(null);
  });
});

describe('delivery governance and prior work', () => {
  it('shows 33 Class 11 lessons internally, in canonical chapter order', () => {
    expect(authoredLearnCatalogueForGrade('class11').lessonCount).toBe(0);
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class11');
    expect(cat.lessonCount).toBe(33);
    expect(cat.chapters.map((c) => c.number)).toEqual([1, 2, 3, 4]);
    expect(cat.chapters.map((c) => c.lessons.length)).toEqual([12, 6, 8, 7]);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('leaves Sets, Trigonometry and the prior grades unchanged', () => {
    expect(C11_SETS_SECTIONS.length).toBe(12);
    expect(C11_TRIG_SECTIONS.length).toBe(8);
    for (const s of [...C11_SETS_SECTIONS, ...C11_TRIG_SECTIONS]) {
      expect(s.contentArtifactVersion).toBe(1);
    }
    __setAuthoredLearnPreviewForTests(true);
    expect(authoredLearnCatalogueForReview('class10').lessonCount).toBe(65);
    expect(authoredLearnCatalogueForReview('class9').lessonCount).toBe(92);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('leaves the two human-check units unauthored', () => {
    const authored = allAuthoredSections().map((s) => s.contentArtifactId).join(' ');
    expect(authored).not.toMatch(/induction/i);
    expect(authored).not.toMatch(/graphical_inequal/i);
  });
});
