// ---------------------------------------------------------------------------
// v0.84.0-c11.12 checkpoint 83 — CLASS 11 CHAPTER 4, COMPLEX NUMBERS.
//
// The governing question: can ONE exact complex number drive the algebraic
// form, the arithmetic, the conjugate and modulus, the Argand coordinates,
// the polar representation and the roots of a quadratic — with the renderer
// truthful at every layer?
//
// The last clause is why the renderer gate below exists. Checkpoint 82 found
// two visual specs that validated perfectly and displayed nothing.
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import {
  add, argandPoint, argandSpec, complex, complexEqual, complexRoots, conjugate,
  describeArgandPoint, divide, divisionDenominator, formatComplex, formatModulus,
  formatPolar, formatRational, isZero, modulus, modulusSquared, multiply, placement,
  polarForm, polarRoundTrips, powerOfI, powerOfIRemainder, rational, rootsAreConjugates,
  subtract, validateArgand, writtenRootsArePair, I, ONE, ZERO,
} from '../complexNumbers';
import { validateVisual } from '../visualSpecification';
import {
  C11_CPX_SECTIONS, CANONICAL_ARGAND, V_ARGAND_BASIC, V_ARGAND_MODULUS, Z1, Z2, Z3,
} from '../complexClass11Sections';
import { C11_SETS_SECTIONS } from '../setsClass11Sections';
import { C11_TRIG_SECTIONS, G_TAN } from '../trigClass11Sections';
import { C11_RF_SECTIONS, G_RECIPROCAL } from '../relationsClass11Sections';
import { allAuthoredSections } from '../authoredSections';
import { authoredLearnCatalogueForReview, authoredLearnCatalogueForGrade } from '../authoredLearnCatalogue';
import { __setAuthoredLearnPreviewForTests } from '../authoredLearnAccess';
import { learnContentFor } from '../../features/learn/learnSectionContent';
import { LearnSectionView } from '../../features/learn/LearnSectionView';

const DEC = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', '..', '..', 'class11-source', 'CLASS11_DECOMPOSITION.json'), 'utf8'
)) as Array<Record<string, string>>;
const CPX = DEC.filter((u) => u.unitId.startsWith('C11-CPX'));
const FO5a = CPX.find((u) => u.unitId === 'C11-CPX-FO5a')!;
const FO5b = CPX.find((u) => u.unitId === 'C11-CPX-FO5b')!;

describe('a complex number is exact, and identity is not display', () => {
  it('holds rational parts rather than floats', () => {
    const z = complex(rational(1, 3), rational(1, 7));
    expect(z.re).toEqual({ n: 1, d: 3 });
    expect(z.im).toEqual({ n: 1, d: 7 });
    expect(complexEqual(z, complex(rational(2, 6), rational(2, 14)))).toBe(true);
  });

  it('separates identity from the way it is written', () => {
    expect(formatComplex(complex(3, -2))).toBe('3 \u2212 2i');
    expect(formatComplex(complex(5, 0))).toBe('5');
    expect(formatComplex(complex(0, 1))).toBe('i');
    expect(formatComplex(complex(0, -1))).toBe('\u2212i');
    expect(formatComplex(ZERO)).toBe('0');
    // Different display, same number.
    expect(complexEqual(complex(3, -2), { re: rational(3), im: rational(-2) })).toBe(true);
  });

  it('compares part by part, not as text', () => {
    expect(complexEqual(complex(2, 3), complex(3, 2))).toBe(false);
    expect(complexEqual(complex(2, 3), complex(2, 3))).toBe(true);
  });
});

describe('arithmetic comes from the parts', () => {
  it('adds and subtracts componentwise', () => {
    expect(formatComplex(add(Z1, Z2))).toBe('4 + 2i');
    expect(formatComplex(subtract(Z1, Z2))).toBe('2 + 6i');
  });

  it('gets the minus sign in multiplication from i squared', () => {
    expect(formatComplex(multiply(I, I))).toBe('-1');
    expect(formatComplex(multiply(Z1, Z2))).toBe('11 \u2212 2i');
    // The parts-times-parts error, which must NOT be what multiply does.
    expect(formatComplex(multiply(Z1, Z2))).not.toBe('3 \u2212 8i');
  });

  it('can produce a real number from two non-real ones', () => {
    expect(formatComplex(multiply(complex(0, 2), complex(0, 3)))).toBe('-6');
    expect(formatComplex(multiply(Z1, conjugate(Z1)))).toBe('25');
  });
});

describe('powers of i cycle, and are never computed by floating exponentiation', () => {
  it('runs the four-step cycle', () => {
    expect([0, 1, 2, 3, 4, 5].map((n) => formatComplex(powerOfI(n))))
      .toEqual(['1', 'i', '-1', '\u2212i', '1', 'i']);
  });

  it('reduces a large exponent by its remainder', () => {
    expect(powerOfIRemainder(2026)).toBe(2);
    expect(formatComplex(powerOfI(2026))).toBe('-1');
    expect(formatComplex(powerOfI(100))).toBe('1');
    expect(complexEqual(powerOfI(-1), powerOfI(3))).toBe(true);
  });

  it('refuses a non-integer power', () => {
    expect(() => powerOfI(1.5)).toThrow(/integer/);
  });
});

describe('division uses the conjugate and refuses zero', () => {
  it('makes the denominator real', () => {
    expect(formatRational(divisionDenominator(Z2))).toBe('5');
    expect(divisionDenominator(Z2).n).toBeGreaterThan(0);
    expect(formatComplex(divide(Z1, Z2))).toBe('-1 + 2i');
  });

  it('throws rather than returning Infinity or NaN', () => {
    expect(() => divide(Z1, ZERO)).toThrow(/by zero/);
    const q = divide(Z1, Z2);
    expect(Number.isFinite(q.re.n / q.re.d)).toBe(true);
    expect(Number.isNaN(q.im.n / q.im.d)).toBe(false);
  });

  it('checks the division against multiplication', () => {
    expect(complexEqual(multiply(divide(Z1, Z2), Z2), Z1)).toBe(true);
  });
});

describe('modulus and conjugate, exact', () => {
  it('keeps the modulus exact rather than decimal', () => {
    expect(formatModulus(Z1)).toBe('5');
    expect(formatModulus(Z3)).toBe('\u221a2');
    expect(formatModulus(complex(-3, 4))).toBe('5');
    expect(formatModulus(ZERO)).toBe('0');
  });

  it('satisfies the source-supported invariants', () => {
    for (const z of [Z1, Z2, Z3, complex(-2, 5)]) {
      expect(complexEqual(conjugate(conjugate(z)), z)).toBe(true);
      // z times its conjugate is real, non-negative, and equals |z| squared.
      const p = multiply(z, conjugate(z));
      expect(p.im.n).toBe(0);
      expect(p.re.n).toBeGreaterThanOrEqual(0);
      expect(p.re).toEqual(modulusSquared(z));
      // z plus its conjugate is twice the real part.
      expect(add(z, conjugate(z)).im.n).toBe(0);
      expect(add(z, conjugate(z)).re.n).toBe(2 * z.re.n);
    }
  });

  it('is zero only for zero', () => {
    expect(formatModulus(ZERO)).toBe('0');
    for (const z of [Z1, Z2, Z3, I, ONE]) {
      expect(isZero(z)).toBe(false);
      expect(modulus(z).p).not.toBe(0);
    }
  });

  it('gives a number and its conjugate the same modulus', () => {
    for (const z of [Z1, Z2, Z3]) expect(formatModulus(conjugate(z))).toBe(formatModulus(z));
  });
});

describe('the radical caution from section 4.3.6 survives', () => {
  it('offers no operation that multiplies radicals of negatives', () => {
    // The unsafe route would give root(-4) root(-9) = root(36) = 6. The model
    // provides no such operation; the safe route is i out first.
    const safe = multiply(complex(0, 2), complex(0, 3));
    expect(formatComplex(safe)).toBe('-6');
    expect(formatComplex(safe)).not.toBe('6');
  });

  it('writes complex roots with i outside the radical, never a negative radicand', () => {
    for (const [a, b, c] of [[1, 2, 5], [2, 1, 3], [1, 1, 1]] as const) {
      const r = complexRoots(a, b, c);
      expect(r.writtenRoots).not.toMatch(/\u221a\s*-|\u221a\u2212/);
      expect(r.writtenRoots).toMatch(/i/);
    }
  });
});

describe('the Argand point is derived from the number', () => {
  it('maps a + ib to (a, b)', () => {
    const p = argandPoint(Z1);
    expect(p.x).toBe(3);
    expect(p.y).toBe(4);
    expect(complexEqual(p.z, Z1)).toBe(true);
  });

  it('places axis numbers on an axis, not in a quadrant', () => {
    expect(placement(complex(1, 1))).toBe(1);
    expect(placement(complex(-2, 3))).toBe(2);
    expect(placement(complex(-1, -2))).toBe(3);
    expect(placement(complex(2, -1))).toBe(4);
    expect(placement(ZERO)).toBe('origin');
    expect(placement(complex(0, 2))).toBe('positive imaginary axis');
    expect(placement(complex(-5, 0))).toBe('negative real axis');
  });

  it('rejects a figure whose plotted point disagrees with its number', () => {
    const good = argandSpec('ok', [{ z: Z1 }], 'a valid figure naming 3 + 4i at (3, 4)');
    expect(validateArgand(good)).toEqual([]);
    const bad = { ...good, id: 'bad', points: [{ ...good.points[0], x: 99 }] };
    expect(validateArgand(bad).join(' ')).toMatch(/plotted at real coordinate 99/);
  });

  it('describes a point by number, both coordinates and placement', () => {
    const d = describeArgandPoint(Z1);
    expect(d).toContain('3 + 4i');
    expect(d).toContain('real coordinate 3');
    expect(d).toContain('imaginary coordinate 4');
    expect(d).toContain('quadrant 1');
  });
});

describe('the Argand visual passes all four registration layers', () => {
  it('1 and 2 — the spec exists and the shared validator knows it', () => {
    for (const v of CANONICAL_ARGAND) {
      expect(v.type).toBe('argand_plane');
      expect(validateVisual(v as never), v.id).toEqual([]);
    }
    expect(validateVisual({ ...V_ARGAND_BASIC, altText: ' ' } as never))
      .toContain('altText is required');
  });

  it('3 and 4 — the union accepts it and the real renderer draws it', () => {
    // The checkpoint-82 defect in test form: a spec that validates and
    // renders nothing would pass everything above and fail here.
    const lesson = C11_CPX_SECTIONS.find((s) => s.contentArtifactId.includes('argand_plane'))!;
    const { container, unmount } = render(
      <LearnSectionView content={learnContentFor(lesson)} visualsById={lesson.visualsById} />
    );
    // The figure lives on the "See it" stage, which is not the stage a lesson
    // opens on, so the gate has to reach it the way a student would.
    fireEvent.click(screen.getAllByRole('button', { name: /See it/i })[0]);
    const svgs = container.querySelectorAll('svg[role="img"]');
    expect(svgs.length).toBeGreaterThan(0);
    const named = [...svgs].filter((s) => (s.getAttribute('aria-label') || '').includes('Argand'));
    expect(named.length).toBeGreaterThan(0);
    // A real drawing, not an empty frame.
    expect(container.querySelectorAll('circle').length).toBeGreaterThan(0);
    unmount(); cleanup();
  });

  it('describes axes, coordinates and placement without relying on colour', () => {
    for (const v of CANONICAL_ARGAND) {
      expect(v.altText.length, v.id).toBeGreaterThan(80);
      expect(v.altText, v.id).toMatch(/real axis|real coordinate/i);
      expect(v.altText, v.id).toMatch(/imaginary/i);
      expect(v.altText, v.id).not.toMatch(/\b(red|blue|green|colour|color)\b/i);
    }
    expect(V_ARGAND_MODULUS.altText).toMatch(/modulus/i);
  });
});

describe('polar form reuses the typed angle and refuses to invent one for zero', () => {
  it('writes the polar form with an exact modulus and a typed angle', () => {
    expect(formatPolar(Z3)).toBe('\u221a2(cos \u03c0/4 + i sin \u03c0/4)');
    expect(formatPolar(complex(2, 2))).toBe('2\u221a2(cos \u03c0/4 + i sin \u03c0/4)');
  });

  it('is quadrant-aware rather than an unguarded arctangent', () => {
    // 1+i and -1-i have the same ratio b/a; a plain atan would confuse them.
    expect(formatPolar(complex(-1, 1))).toContain('3\u03c0/4');
    expect(formatPolar(complex(-1, -1))).not.toBe(formatPolar(complex(1, 1)));
  });

  it('round-trips through the modulus and argument', () => {
    for (const z of [Z3, complex(2, 2), complex(-1, 1), complex(0, 3), complex(-4, 0)]) {
      expect(polarRoundTrips(z), formatComplex(z)).toBe(true);
    }
  });

  it('gives zero no argument at all', () => {
    const p = polarForm(ZERO);
    expect(p.argumentDefined).toBe(false);
    expect(p.argument).toBeNull();
    expect(p.note).toMatch(/not defined/);
    expect(formatPolar(ZERO)).toMatch(/not defined/);
  });

  it('carries the unit on the argument rather than a bare number', () => {
    const p = polarForm(Z3);
    expect(p.argument).not.toBeNull();
    expect(['degree', 'radian']).toContain((p.argument as { unit: string }).unit);
  });
});

describe('quadratics over the complex numbers', () => {
  it('gives exact conjugate roots for a negative discriminant', () => {
    const r = complexRoots(1, 2, 5);
    expect(r.discriminant).toBe(-16);
    expect(r.kind).toBe('complex_conjugate');
    expect(r.writtenRoots).toBe('-1 \u00b1 2i');
    expect(rootsAreConjugates(r)).toBe(true);
    expect(r.roots!.map(formatComplex)).toEqual(['-1 + 2i', '-1 \u2212 2i']);
  });

  it('refuses to approximate an irrational imaginary part', () => {
    const r = complexRoots(2, 1, 3);
    expect(r.writtenRoots).toBe('-1/4 \u00b1 1/4i\u221a23');
    // The exact pair is withheld rather than faked as a decimal fraction.
    expect(r.roots).toBeNull();
    expect(r.rootsAreRational).toBe(false);
    expect(writtenRootsArePair(r)).toBe(true);
  });

  it('simplifies a perfect-square surd', () => {
    expect(complexRoots(1, 0, 9).writtenRoots).toBe('0 \u00b1 3i');
    expect(complexRoots(1, 0, 1).writtenRoots).toBe('0 \u00b1 i');
  });

  it('leaves the real case to the real machinery', () => {
    expect(complexRoots(1, -3, 2).kind).toBe('real');
    expect(complexRoots(1, -3, 2).roots).toBeNull();
  });

  it('refuses a non-quadratic', () => {
    expect(() => complexRoots(0, 1, 2)).toThrow(/not a quadratic/);
  });
});

describe('the seven lessons', () => {
  it('are all authored under Chapter 4 with the right provenance', () => {
    expect(C11_CPX_SECTIONS.length).toBe(7);
    expect(CPX.length).toBe(7);
    expect(new Set(C11_CPX_SECTIONS.map((s) => s.contentArtifactId)).size).toBe(7);
    const byId = (frag: string) => C11_CPX_SECTIONS.find((s) => s.contentArtifactId.includes(frag))!;
    expect(byId('s4_3_5').source.officialSubsectionNumber).toBe('4.3.5');
    expect(byId('s4_3_5').source.officialSectionId).toBe('ncert_kemh1_s4_3');
    expect(byId('argand_plane').source.scopeFragmentId).toBe('SF-1-SUMMATIVE');
    expect(byId('polar').source.scopeFragmentId).toBe('SF-1-FORMATIVE');
    expect(byId('argand_plane').source.officialSectionId).toBe('ncert_kemh1_s4_5');
    expect(byId('polar').source.officialSectionId).toBe('ncert_kemh1_s4_5');
    expect(byId('fo5b').source.sourceKind).toBe('cbse_only');
    expect(byId('fo5b').source.cbseEntryId).toBe('FO-5');
    expect(byId('fo5b').source.officialSectionId).toBe('');
  });

  it('carries all five stages with no placeholder or leaked value', () => {
    for (const s of C11_CPX_SECTIONS) {
      expect(s.explanation.length, s.contentArtifactId).toBeGreaterThanOrEqual(3);
      expect(s.workedExamples.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.guidedPractice.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.independentPractice.length, s.contentArtifactId).toBeGreaterThanOrEqual(2);
      expect(s.reasoningApplication.length, s.contentArtifactId).toBeGreaterThanOrEqual(1);
      const all = JSON.stringify(s);
      expect(all, s.contentArtifactId).not.toMatch(/\b(TODO|TBD|placeholder|FIXME)\b/i);
      expect(all, s.contentArtifactId).not.toMatch(/\$\{/);
      // Guards a leaked implementation value. "undefined" and "not defined"
      // are legitimate English here — the argument of zero genuinely is.
      expect(all, s.contentArtifactId).not.toMatch(/\bnull\b|\bNaN\b|\bInfinity\b/);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('uses every term it defines', () => {
    for (const s of C11_CPX_SECTIONS) {
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
    for (const s of C11_CPX_SECTIONS) {
      for (const w of s.workedExamples) {
        for (const step of w.steps) {
          expect(step.reasoning.trim().length, `${s.contentArtifactId} ${w.id}`).toBeGreaterThan(39);
        }
      }
    }
  });

  it('states the fundamental theorem without proving it', () => {
    const f = C11_CPX_SECTIONS.find((s) => s.contentArtifactId.includes('fo5b'))!;
    const body = [...f.explanation].join(' ');
    expect(body).toMatch(/fundamental theorem of algebra/i);
    expect(body).toMatch(/not proved|stated and used|belongs to later study/i);
    expect(body).not.toMatch(/\bproof that\b|we now prove|the proof runs/i);
  });

  it('never calls the Class 10 statement wrong', () => {
    const all = C11_CPX_SECTIONS.flatMap((s) => s.explanation).join(' ');
    expect(all).toMatch(/no real root/i);
    expect(all).not.toMatch(/Class 10 was wrong|incorrect in Class 10/i);
  });

  it('renders all seven through the real LearnSectionView', () => {
    __setAuthoredLearnPreviewForTests(true);
    for (const s of C11_CPX_SECTIONS) {
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

describe('formative governance across five units', () => {
  it('keeps FO5a and FO5b formative-only and optional', () => {
    for (const u of [FO5a, FO5b]) {
      expect(u.assessmentStatus).toBe('FORMATIVE_ONLY');
      expect(u.instructionalStatus).toBe('OPTIONAL_ENRICHMENT');
    }
    expect(FO5b.textbookBodyDemand).toBe('STATE_WITHOUT_PROOF');
  });

  it('excludes them from summative eligibility while the other five are not', () => {
    const eligible = (u: Record<string, string>) => u.assessmentStatus === 'SUMMATIVE_CORE';
    expect(CPX.filter(eligible).length).toBe(5);
    expect(eligible(FO5a)).toBe(false);
    expect(eligible(FO5b)).toBe(false);
  });

  it('still proves assessment status does not determine instructional status', () => {
    const ids = ['C11-SET-FO1', 'C11-RF-FO2', 'C11-TRG-FO3', 'C11-CPX-FO5a', 'C11-CPX-FO5b'];
    const units = ids.map((i) => DEC.find((u) => u.unitId === i)!);
    for (const u of units) expect(u.assessmentStatus).toBe('FORMATIVE_ONLY');
    expect(units[0].instructionalStatus).toBe('REQUIRED_CORE');
    for (const u of units.slice(1)) expect(u.instructionalStatus).toBe('OPTIONAL_ENRICHMENT');
    expect(new Set(units.map((u) => u.instructionalStatus)).size).toBe(2);
  });

  it('keeps the two halves of section 4.5 apart', () => {
    const summative = CPX.find((u) => u.unitId === 'C11-CPX-05')!;
    expect(summative.assessmentStatus).toBe('SUMMATIVE_CORE');
    expect(FO5a.assessmentStatus).toBe('FORMATIVE_ONLY');
    // Same parent section, different assessment status: the fragment exists
    // precisely so the boundary stays truthful.
    expect(JSON.parse(JSON.stringify(summative.source)).parentSection)
      .toBe(JSON.parse(JSON.stringify(FO5a.source)).parentSection);
  });
});

describe('delivery, and no regression in prior work', () => {
  it('shows 33 Class 11 lessons internally and none publicly', () => {
    expect(authoredLearnCatalogueForGrade('class11').lessonCount).toBe(0);
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class11');
    expect(cat.lessonCount).toBe(33);
    expect(cat.chapters.map((c) => c.number)).toEqual([1, 2, 3, 4]);
    expect(cat.chapters.map((c) => c.lessons.length)).toEqual([12, 6, 8, 7]);
    __setAuthoredLearnPreviewForTests(null);
  });

  it('leaves the earlier Class 11 chapters and their visuals intact', () => {
    expect(C11_SETS_SECTIONS.length).toBe(12);
    expect(C11_RF_SECTIONS.length).toBe(6);
    expect(C11_TRIG_SECTIONS.length).toBe(8);
    for (const s of [...C11_SETS_SECTIONS, ...C11_RF_SECTIONS, ...C11_TRIG_SECTIONS]) {
      expect(s.contentArtifactVersion).toBe(1);
    }
    // The shared union gained a member; the existing members still validate.
    expect(validateVisual(G_TAN as never)).toEqual([]);
    expect(validateVisual(G_RECIPROCAL as never)).toEqual([]);
    const venn = C11_SETS_SECTIONS.flatMap((s) => s.visuals).find((v) => v.type === 'venn');
    expect(venn).toBeTruthy();
    expect(validateVisual(venn as never)).toEqual([]);
  });

  it('leaves Classes 9 and 10 unchanged', () => {
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
