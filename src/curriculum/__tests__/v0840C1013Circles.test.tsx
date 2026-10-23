// ---------------------------------------------------------------------------
// v0.84.0-c10.13 checkpoint 67 — CLASS 10 CIRCLES.
//
// Can the tangent theorems be proved from explicit hypotheses, without
// smuggling the conclusion into the diagram or leaning on what the picture
// appears to show?
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  auditCircularProof, auditProofByDiagram, corresponds, distSq, dot,
  isTangentAt, positionOf, relationOf, sub, tangentCount, tangentCountFor,
  tangentSegmentLengthSq, tangentSegmentsEqual, validateTangentFigure,
  validateTwoTangents, type Circle, type Pt,
} from '../tangency';
import {
  CLASS10_TANGENT_SECTIONS, CLASS_9_CIRCLE_PROOF_PRIOR, CANONICAL_POINTS,
  CIRCLE_O, EXTERNAL_P, CONTACT_A, CONTACT_B, POINT_ON, POINT_INSIDE,
  OA, OP, PA,
  C10_SECTION_10_2A, C10_SECTION_10_2B, C10_SECTION_10_3A, C10_SECTION_10_3B, C10_SECTION_10_3C,
} from '../tangentSections';
import { auditProofScope } from '../proofScopeAudit';
import { auditCircleNovelty } from '../circleProgression';
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
import { CLASS10_LINEAR_SYSTEM_SECTIONS } from '../linearSystemSections';
import { CLASS10_HEIGHTS_DISTANCES_SECTIONS } from '../heightsDistancesSections';
import { CLASS10_REAL_NUMBERS_SECTIONS } from '../realNumbersSections';
import { CLASS10_POLYNOMIAL_SECTIONS } from '../polynomialSections';
import { CLASS10_AP_SECTIONS } from '../apSections';
import { CLASS10_PROBABILITY_SECTIONS } from '../probabilityClass10Sections';
import { CLASS10_CIRCLE_AREA_SECTIONS } from '../circleAreaSections';

const blocks = (s: (typeof CLASS10_TANGENT_SECTIONS)[number]): Array<[string, string]> => [
  ['learningGoal', s.learningGoal],
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];
const prose = () => CLASS10_TANGENT_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');

describe('progression — circle proof is not new, the tangent is', () => {
  it('records the frozen Class 9 circle foundation', () => {
    expect(CLASS_9_CIRCLE_PROOF_PRIOR.alreadyCovered.length).toBe(6);
    expect(CLASS_9_CIRCLE_PROOF_PRIOR.alreadyCovered.join(' ')).toMatch(/chord/i);
    expect(CLASS_9_CIRCLE_PROOF_PRIOR.alreadyCovered.join(' ')).toMatch(/RHS/);
    expect(CLASS_9_CIRCLE_PROOF_PRIOR.tangentMentionsInClass9).toBe(0);
    expect(CLASS_9_CIRCLE_PROOF_PRIOR.genuinelyNewInClass10.join(' ')).toMatch(/tangent/i);
  });

  it('claims no novelty for circle reasoning itself', () => {
    for (const s of CLASS10_TANGENT_SECTIONS) {
      expect(auditCircleNovelty(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });

  it('says plainly that Class IX proved circle results', () => {
    const all = prose();
    expect(all).toMatch(/Class IX/);
    expect(all).toMatch(/prove[d]?.{0,60}Class IX|Class IX.{0,80}prov/i);
    expect(all).not.toMatch(/first circle theorem|first time.{0,30}chord/i);
  });

  it('does not claim RHS or congruence is new', () => {
    const all = prose();
    expect(all).toMatch(/RHS/);
    expect(all).not.toMatch(/RHS is new|congruence is new/i);
    expect(all).toMatch(/Class IX.{0,60}(?:RHS|congruence)|(?:RHS|congruence).{0,60}Class IX/i);
  });
});

describe('proof scope — two PROVE units that actually prove', () => {
  it('passes auditProofScope at each unit\u2019s recorded expectation', () => {
    const expectations: Array<[typeof C10_SECTION_10_2A, 'PROVE' | 'DERIVE' | 'APPLY' | 'UNDERSTAND']> = [
      [C10_SECTION_10_2A, 'UNDERSTAND'],
      [C10_SECTION_10_2B, 'PROVE'],
      [C10_SECTION_10_3A, 'DERIVE'],
      [C10_SECTION_10_3B, 'PROVE'],
      [C10_SECTION_10_3C, 'APPLY'],
    ];
    for (const [section, expectation] of expectations) {
      expect(auditProofScope(section, expectation), `${section.contentArtifactId} as ${expectation}`).toEqual([]);
    }
  });

  it('fails a PROVE unit that only asserts the theorem', () => {
    const asserted = {
      ...C10_SECTION_10_2B,
      learningGoal: 'You will use the fact that the tangent meets the radius at a right angle.',
      explanation: ['The tangent at a point of a circle is perpendicular to the radius there.'],
      summary: 'The tangent meets the radius at a right angle.',
      workedExamples: [],
    };
    const findings = auditProofScope(asserted as never, 'PROVE');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.map((f) => f.reason).join(' ')).toMatch(/never proves anything|proof chain/);
  });

  it('fails a PROVE unit that defers its proof', () => {
    const deferred = {
      ...C10_SECTION_10_2B,
      explanation: [...C10_SECTION_10_2B.explanation, 'It can be shown that OP is perpendicular to the tangent.'],
    };
    expect(auditProofScope(deferred as never, 'PROVE').map((f) => f.reason).join(' '))
      .toMatch(/defers a proof/);
  });

  it('does not confuse applying a proved theorem with proving it', () => {
    // 10.3c applies both theorems and reproves neither; APPLY must be clean.
    expect(auditProofScope(C10_SECTION_10_3C, 'APPLY')).toEqual([]);
    expect(prose()).toMatch(/by the tangent-radius theorem/i);
    expect(C10_SECTION_10_3C.explanation.join(' ')).toMatch(/reprove[s]? neither|used here, not reproved|are used/i);
  });

  it('carries a real proof chain in each PROVE unit', () => {
    for (const s of [C10_SECTION_10_2B, C10_SECTION_10_3B]) {
      const proof = s.workedExamples[0];
      expect(proof.steps.length, s.contentArtifactId).toBeGreaterThanOrEqual(5);
      const text = [proof.prompt, ...proof.steps.map((x) => x.text)].join(' ');
      expect(text, s.contentArtifactId).toMatch(/GIVEN/);
      expect(text, s.contentArtifactId).toMatch(/TO PROVE/);
    }
    // The equal-tangents proof names its criterion and its correspondence.
    const eq = C10_SECTION_10_3B.workedExamples[0];
    const t = eq.steps.map((x) => `${x.text} ${x.reasoning}`).join(' ');
    expect(t).toMatch(/RHS/);
    expect(t).toMatch(/O\u2194O, A\u2194B, P\u2194P/);
  });
});

describe('no proof by diagram, no circular reasoning', () => {
  it('finds neither in any authored lesson', () => {
    for (const s of CLASS10_TANGENT_SECTIONS) {
      expect(auditProofByDiagram(blocks(s)), `${s.contentArtifactId} diagram`).toEqual([]);
      expect(auditCircularProof(blocks(s)), `${s.contentArtifactId} circular`).toEqual([]);
    }
  });

  it('catches proof by diagram, and passes the sentence rejecting it', () => {
    for (const t of [
      'Clearly PA = PB from the diagram.',
      'The figure shows the two segments are equal.',
      'OP looks perpendicular to the tangent, so the angle is 90\u00b0.',
      'By symmetry of the figure, PA = PB.',
      'Measuring shows the angle is 90\u00b0.',
    ]) expect(auditProofByDiagram([['x', t]]).length, t).toBe(1);
    for (const t of [
      'Saying PA = PB is clear from the diagram is not a proof.',
      'A student writes that the figure shows the two segments are equal, which is wrong.',
      'Arguing by symmetry of the figure that PA = PB would be circular.',
    ]) expect(auditProofByDiagram([['x', t]]), t).toEqual([]);
  });

  it('catches circular tangent reasoning, and passes its correction', () => {
    for (const t of [
      'PA = PB because tangents from a point are equal.',
      'They are equal because the tangents from a point are equal.',
    ]) expect(auditCircularProof([['x', t]]).length, t).toBe(1);
    for (const t of [
      'A student writes PA = PB because tangents from a point are equal, which is circular.',
      'Saying PA = PB because tangents from a point are equal would be wrong.',
    ]) expect(auditCircularProof([['x', t]]), t).toEqual([]);
  });

  it('marks no right angle as a given inside the proof lesson', () => {
    // The proof lesson must say the mark would assume the conclusion.
    const t = C10_SECTION_10_2B.explanation.join(' ') + C10_SECTION_10_2B.summary;
    expect(t).toMatch(/right-angle mark|mark(?:ing)?.{0,40}conclusion|assume the conclusion/i);
  });
});

describe('the canonical figure is exact and honest', () => {
  it('has whole-number distances from a scaled 3-4-5 triangle', () => {
    expect(distSq(CIRCLE_O.centre, CONTACT_A)).toBe(OA * OA);
    expect(distSq(CIRCLE_O.centre, EXTERNAL_P)).toBe(OP * OP);
    expect(distSq(EXTERNAL_P, CONTACT_A)).toBe(PA * PA);
    expect(OA * OA + PA * PA).toBe(OP * OP);
    expect(tangentSegmentLengthSq(CIRCLE_O, EXTERNAL_P)).toBe(PA * PA);
  });

  it('places the contact points on the circle with perpendicular radii', () => {
    for (const c of [CONTACT_A, CONTACT_B]) {
      expect(positionOf(CIRCLE_O, c)).toBe('on');
      // The radius to the contact point is perpendicular to the tangent segment.
      expect(dot(sub(c, CIRCLE_O.centre), sub(EXTERNAL_P, c))).toBe(0);
    }
    expect(validateTwoTangents(CIRCLE_O, EXTERNAL_P, CONTACT_A, CONTACT_B)).toEqual([]);
    expect(tangentSegmentsEqual(EXTERNAL_P, CONTACT_A, CONTACT_B)).toBe(true);
  });

  it('validates a tangent line and rejects near misses', () => {
    const tangentLine = { a: CONTACT_A, b: { x: CONTACT_A.x + 12, y: CONTACT_A.y - 9 } };
    expect(relationOf(CIRCLE_O, tangentLine)).toBe('tangent');
    expect(isTangentAt(CIRCLE_O, tangentLine, CONTACT_A)).toBe(true);
    expect(validateTangentFigure(CIRCLE_O, tangentLine, CONTACT_A)).toEqual([]);
    // A secant through the centre, and a line that misses entirely.
    expect(relationOf(CIRCLE_O, { a: { x: -20, y: 0 }, b: { x: 20, y: 0 } })).toBe('secant');
    expect(relationOf(CIRCLE_O, { a: { x: -20, y: 30 }, b: { x: 20, y: 30 } })).toBe('misses');
    // Tangent-looking line whose contact point is wrong.
    expect(validateTangentFigure(CIRCLE_O, tangentLine, CONTACT_B).join(' ')).toMatch(/not at the stated point/);
  });

  it('breaks each two-tangent condition in turn', () => {
    expect(validateTwoTangents(CIRCLE_O, POINT_INSIDE, CONTACT_A, CONTACT_B).join(' '))
      .toMatch(/interior.{0,60}two tangents cannot/);
    expect(validateTwoTangents(CIRCLE_O, EXTERNAL_P, { x: 10, y: 12 }, CONTACT_B).join(' '))
      .toMatch(/does not lie on the circle/);
    expect(validateTwoTangents(CIRCLE_O, EXTERNAL_P, CONTACT_A, CONTACT_A).join(' '))
      .toMatch(/coincide, so there is only one tangent/);
  });
});

describe('point location and tangent count', () => {
  it('derives the count from the position', () => {
    expect(tangentCount('interior')).toBe(0);
    expect(tangentCount('on')).toBe(1);
    expect(tangentCount('exterior')).toBe(2);
    expect(tangentCountFor(CIRCLE_O, POINT_INSIDE)).toBe(0);
    expect(tangentCountFor(CIRCLE_O, POINT_ON)).toBe(1);
    expect(tangentCountFor(CIRCLE_O, EXTERNAL_P)).toBe(2);
    // The centre is interior, so no tangent passes through it.
    expect(tangentCountFor(CIRCLE_O, CIRCLE_O.centre)).toBe(0);
  });

  it('classifies the three canonical points correctly', () => {
    expect(CANONICAL_POINTS.length).toBe(3);
    const expected: Array<[string, string]> = [
      ['inside the circle', 'interior'], ['on the circle', 'on'], ['outside the circle', 'exterior'],
    ];
    CANONICAL_POINTS.forEach(([label, p], i) => {
      expect(label).toBe(expected[i][0]);
      expect(positionOf(CIRCLE_O, p), label).toBe(expected[i][1]);
    });
  });

  it('rejects an exterior point claiming one tangent', () => {
    // The count is derived, so a mismatched claim cannot be constructed —
    // the assertion below is what a hand-authored label would have to beat.
    expect(tangentCountFor(CIRCLE_O, EXTERNAL_P)).not.toBe(1);
    const borderline: Pt = { x: OA, y: 0 };
    expect(positionOf(CIRCLE_O, borderline)).toBe('on');
    expect(tangentCountFor(CIRCLE_O, borderline)).toBe(1);
  });

  it('gives the interior case a reason, not an absence', () => {
    const t = C10_SECTION_10_3A.explanation.join(' ') + C10_SECTION_10_3A.workedExamples[0].steps.map((s) => s.text).join(' ');
    expect(t).toMatch(/every line through.{0,60}secant|meets the circle at two points/i);
    expect(t).not.toMatch(/it is impossible\.?$/i);
  });
});

describe('congruence correspondence and tangent-vs-segment', () => {
  it('maps PA to PB and not to anything else', () => {
    expect(corresponds(['O', 'A', 'P'], ['O', 'B', 'P'], 'PA', 'PB')).toBe(true);
    expect(corresponds(['O', 'A', 'P'], ['O', 'B', 'P'], 'OA', 'OB')).toBe(true);
    expect(corresponds(['O', 'A', 'P'], ['O', 'B', 'P'], 'PA', 'OB')).toBe(false);
    expect(corresponds(['O', 'A', 'P'], ['O', 'B', 'P'], 'OA', 'PB')).toBe(false);
  });

  it('separates the tangent line from the tangent segment', () => {
    const all = prose();
    expect(all).toMatch(/tangent segment/i);
    expect(all).toMatch(/a tangent is a LINE and has no length|line has no length/i);
    expect(C10_SECTION_10_3B.vocabulary.map((v) => v.term)).toContain('tangent segment');
  });

  it('does not read the theorem backwards', () => {
    expect(prose()).toMatch(/does not run backwards|theorem runs one way|not a test for it/i);
  });
});

describe('application fidelity', () => {
  it('recomputes every authored length and angle', () => {
    const cases: Array<[number, number, number]> = [[15, 25, 20], [8, 17, 15], [5, 13, 12]];
    for (const [r, op, pa] of cases) {
      expect(op * op - r * r).toBe(pa * pa);
      const circle: Circle = { centre: { x: 0, y: 0 }, radius: r };
      expect(tangentSegmentLengthSq(circle, { x: op, y: 0 })).toBe(pa * pa);
    }
    // Quadrilateral OAPB: the two right angles leave 180 for the other two.
    expect(360 - 90 - 90 - 70).toBe(110);
    expect(180 - 60).toBe(120);
    expect(Math.round(Math.sqrt(72) * 100) / 100).toBe(8.49);
  });

  it('keeps the tangent length tied to its right triangle', () => {
    const t = C10_SECTION_10_3C.explanation.join(' ') + prose();
    expect(t).toMatch(/not a separate formula|Pythagoras applied|rather than as a tangent-length formula/i);
  });

  it('names the theorem rather than saying "since it is a tangent"', () => {
    const all = prose();
    expect(all).toMatch(/radius to the point of contact.{0,80}tangent-radius theorem/i);
    // The thin phrasing appears only as the thing being improved.
    for (const m of all.matchAll(/.{0,90}since it is a tangent.{0,90}/gi)) {
      expect(m[0], 'unimproved thin justification').toMatch(/improve|skips the reason|student writes/i);
    }
  });
});

describe('lesson quality and governance', () => {
  it('authors five lessons with correct Chapter 10 provenance', () => {
    expect(CLASS10_TANGENT_SECTIONS.length).toBe(5);
    for (const s of CLASS10_TANGENT_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch10');
      expect(['10.2', '10.3']).toContain(s.source.sectionNumber);
      expect([145, 147]).toContain(s.source.startPage);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
    // The proof dependency is recorded in the lesson sequence.
    expect(C10_SECTION_10_3B.sequence.prerequisiteSectionIds).toContain('ncert_jemh1_s10_2b');
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_TANGENT_SECTIONS) {
      const whole = blocks(s).map(([, t]) => t).join(' ').toLowerCase() + ' ' + s.nextStep.toLowerCase()
        + ' ' + s.vocabulary.map((v) => v.meaning).join(' ').toLowerCase();
      for (const v of s.vocabulary) {
        const head = v.term.toLowerCase().split(' ').slice(-1)[0];
        expect(whole.includes(v.term.toLowerCase()) || whole.includes(head), `${s.contentArtifactId}: ${v.term}`).toBe(true);
      }
      for (const w of s.workedExamples) {
        for (const step of w.steps) expect(step.reasoning.length, `${w.id}: ${step.text}`).toBeGreaterThan(40);
      }
      for (const [, t] of blocks(s)) {
        expect(t, s.contentArtifactId).not.toMatch(/TODO|TBD|placeholder|recheck/i);
        expect(t, s.contentArtifactId).not.toMatch(/\$\{/);
      }
    }
  });

  it('keeps its five lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.14 checkpoint 68 — Chapter 7 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const ch10 = cat.chapters.find((c) => c.number === 10)!;
    expect(ch10.lessons.length).toBe(5);
    for (const lesson of ch10.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('keeps the gate closed and the twelve earlier waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    const waves = [CLASS10_TRIGONOMETRY_SECTIONS, CLASS10_COMPOSITE_SOLIDS_SECTIONS,
      CLASS10_SIMILARITY_SECTIONS, CLASS10_QUADRATIC_SECTIONS, CLASS10_STATISTICS_SECTIONS,
      CLASS10_LINEAR_SYSTEM_SECTIONS, CLASS10_HEIGHTS_DISTANCES_SECTIONS,
      CLASS10_REAL_NUMBERS_SECTIONS, CLASS10_POLYNOMIAL_SECTIONS, CLASS10_AP_SECTIONS,
      CLASS10_PROBABILITY_SECTIONS, CLASS10_CIRCLE_AREA_SECTIONS];
    expect(waves.map((w) => w.length)).toEqual([4, 3, 6, 4, 8, 5, 3, 4, 4, 5, 4, 3]);
    for (const w of waves) for (const s of w) expect(s.contentArtifactVersion).toBe(1);
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
