// ---------------------------------------------------------------------------
// v0.84.0-c10.11 checkpoint 65 — CLASS 10 PROBABILITY.
//
// Can the experiment, sample space and event be one object, so that the
// denominator, the favourable outcomes, the equal-likelihood assumption and
// the complement cannot silently describe different models?
// ---------------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  approxDecimal, areComplementary, complement, eventSize, formatRational,
  isImpossible, isSubsetOfSampleSpace, isSure, partitionsSampleSpace,
  probability, rational, sampleSpaceSize, statedCountMatches, toNumber,
  validateEvent, validateExperiment, type Event, type Experiment,
} from '../sampleSpace';
import {
  CLASS10_PROBABILITY_SECTIONS, CANONICAL_EXPERIMENTS, CANONICAL_EVENTS,
  DIE, COIN2, DICE2, CARD, MARBLES, SPINNER,
  E_EVEN, E_SEVEN, E_UNDER_7, E_ONE_HEAD, E_SUM7, E_SUM2,
  E_RED_CARD, E_KING, E_RED_MARBLE, E_NOT_WHITE, E_ONE_OR_THREE,
} from '../probabilityClass10Sections';
import {
  auditProbabilityNovelty, CLASS_9_PROBABILITY_PRIOR, PROBABILITY_IN_CLASS_9,
} from '../probabilityProgression';
import { auditProbabilitySection } from '../probabilityAudit';
import { probabilityChapterSections } from '../probabilitySections';
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

const blocks = (s: (typeof CLASS10_PROBABILITY_SECTIONS)[number]): Array<[string, string]> => [
  ['learningGoal', s.learningGoal],
  ['explanation', s.explanation.join(' ')],
  ['summary', s.summary],
  ...s.workedExamples.map((w) => [w.id, [w.prompt, ...w.steps.map((x) => `${x.text} ${x.reasoning}`), w.answer].join(' ')] as [string, string]),
  ...s.guidedPractice.map((g) => [g.id, `${g.prompt} ${g.answer} ${g.rationale}`] as [string, string]),
  ...s.independentPractice.map((p) => [p.id, `${p.prompt} ${p.answer} ${p.rationale}`] as [string, string]),
  ...s.reasoningApplication.map((r) => [r.id, `${r.prompt} ${r.expectedReasoning}`] as [string, string]),
];
const prose = () => CLASS10_PROBABILITY_SECTIONS.flatMap((s) => blocks(s).map(([, t]) => t)).join(' ');

describe('progression — Chapter 14 is FORMALISATION, not a first encounter', () => {
  it('records what the frozen Class 9 probability lessons already cover', () => {
    expect(probabilityChapterSections().length).toBe(6);
    expect(CLASS_9_PROBABILITY_PRIOR.alreadyCovered.join(' ')).toMatch(/sample space/i);
    expect(CLASS_9_PROBABILITY_PRIOR.alreadyCovered.join(' ')).toMatch(/equally likely/i);
    expect(CLASS_9_PROBABILITY_PRIOR.alreadyCovered.join(' ')).toMatch(/theoretical probability/i);
    expect(PROBABILITY_IN_CLASS_9).toContain('sample space');
    expect(PROBABILITY_IN_CLASS_9).toContain('equally likely');
  });

  it('claims no novelty for anything Class 9 already covered', () => {
    for (const s of CLASS10_PROBABILITY_SECTIONS) {
      expect(auditProbabilityNovelty(blocks(s)), s.contentArtifactId).toEqual([]);
    }
  });

  it('catches overclaims and allows true novelty', () => {
    for (const t of [
      'Today you meet probability for the first time.',
      'A sample space is a new idea in Class 10.',
      'Events are introduced here.',
      'This is your first use of equally likely outcomes.',
      'Theoretical probability is new in Class 10.',
    ]) expect(auditProbabilityNovelty([['x', t]]).length, t).toBe(1);
    for (const t of [
      'You already wrote sample spaces in Class IX; Class 10 formalises the classical calculation.',
      'Complementary events are new in Class 10.',
      'The sure event is introduced here.',
      'A student says events are introduced here, which is wrong.',
    ]) expect(auditProbabilityNovelty([['x', t]]), t).toEqual([]);
  });

  it('frames the chapter as formalisation in its own prose', () => {
    expect(prose()).toMatch(/Class IX/);
    expect(prose()).toMatch(/formalis/i);
  });
});

describe('sample-space fidelity', () => {
  it('validates every canonical experiment', () => {
    expect(CANONICAL_EXPERIMENTS.length).toBe(6);
    for (const e of CANONICAL_EXPERIMENTS) expect(validateExperiment(e), e.id).toEqual([]);
    expect(sampleSpaceSize(DIE)).toBe(6);
    expect(sampleSpaceSize(COIN2)).toBe(4);
    expect(sampleSpaceSize(DICE2)).toBe(36);
    expect(sampleSpaceSize(CARD)).toBe(52);
    expect(sampleSpaceSize(MARBLES)).toBe(10);
  });

  it('rejects duplicate outcomes masquerading as distinct', () => {
    const dupe: Experiment = { ...DIE, outcomes: ['1', '1', '2'] };
    expect(validateExperiment(dupe).join(' ')).toMatch(/listed twice/);
  });

  it('keeps two-coin and two-dice outcomes ordered', () => {
    expect(COIN2.outcomes).toEqual(['HH', 'HT', 'TH', 'TT']);
    expect(DICE2.outcomes).toContain('(1,6)');
    expect(DICE2.outcomes).toContain('(6,1)');
    expect(new Set(DICE2.outcomes).size).toBe(36);
  });
});

describe('equal likelihood is an assumption, not a count', () => {
  it('refuses to compute when the assumption is not established', () => {
    expect(SPINNER.equallyLikely).toBeNull();
    const red: Event = { id: 'r', experimentId: SPINNER.id, description: 'red', outcomes: ['red'] };
    expect(() => probability(SPINNER, red)).toThrow(/does not establish that its outcomes are equally likely/);
  });

  it('carries a stated justification on every experiment it computes with', () => {
    for (const e of CANONICAL_EXPERIMENTS.filter((x) => x.equallyLikely !== null)) {
      expect(e.equallyLikely!.length, e.id).toBeGreaterThan(30);
      // Model language, not an empirical claim about a physical object.
      expect(e.equallyLikely!).toMatch(/modelled|treated as/i);
    }
  });

  it('teaches the spinner refutation and survives the prose audit', () => {
    expect(prose()).toMatch(/spinner/i);
    expect(prose()).toMatch(/would be wrong/i);
    for (const s of CLASS10_PROBABILITY_SECTIONS) {
      expect(auditProbabilitySection(s).map((f) => `${f.where}: ${f.claim}`), s.contentArtifactId).toEqual([]);
    }
  });

  it('lets the audit pass a quoted misconception and fail a bare assertion', () => {
    const quoted = {
      ...CLASS10_PROBABILITY_SECTIONS[0],
      explanation: ['It would be wrong to say there are two outcomes, so each must have probability one half.'],
    };
    expect(auditProbabilitySection(quoted as never)).toEqual([]);
    const bare = {
      ...CLASS10_PROBABILITY_SECTIONS[0],
      explanation: ['There are two outcomes, so each has probability one half.'],
      summary: '', workedExamples: [], guidedPractice: [], independentPractice: [],
    };
    expect(auditProbabilitySection(bare as never).length).toBeGreaterThan(0);
  });
});

describe('event-subset and complement fidelity', () => {
  it('keeps every authored event inside its sample space', () => {
    for (const [exp, ev] of CANONICAL_EVENTS) {
      expect(isSubsetOfSampleSpace(exp, ev), ev.id).toBe(true);
      expect(validateEvent(exp, ev), ev.id).toEqual([]);
      expect(eventSize(ev)).toBeLessThanOrEqual(sampleSpaceSize(exp));
    }
  });

  it('reports rather than throws when an event escapes its sample space', () => {
    const bad: Event = { id: 'bad', experimentId: DIE.id, description: 'seven', outcomes: ['7'] };
    const errs = validateEvent(DIE, bad);
    expect(errs.join(' ')).toMatch(/not in the sample space/);
    expect(() => validateEvent(DIE, bad)).not.toThrow();
    // probability itself still refuses.
    expect(() => probability(DIE, bad)).toThrow(/outside the sample space/);
  });

  it('derives the complement so it cannot drift from the event', () => {
    for (const [exp, ev] of CANONICAL_EVENTS) {
      const c = complement(exp, ev);
      expect(eventSize(c) + eventSize(ev), ev.id).toBe(sampleSpaceSize(exp));
      expect(ev.outcomes.filter((o) => c.outcomes.includes(o))).toEqual([]);
      expect(partitionsSampleSpace(exp, ev)).toBe(true);
      expect(areComplementary(exp, ev, c)).toBe(true);
      expect(toNumber(probability(exp, ev)) + toNumber(probability(exp, c))).toBe(1);
    }
    // Changing the event changes the complement automatically.
    const narrowed: Event = { ...E_EVEN, outcomes: ['2'] };
    expect(complement(DIE, narrowed).outcomes).toEqual(['1', '3', '4', '5', '6']);
    expect(complement(DIE, E_EVEN).outcomes).toEqual(['1', '3', '5']);
  });

  it('refuses to call disjoint events complementary', () => {
    expect(areComplementary(DIE, E_EVEN, E_ONE_OR_THREE)).toBe(false);
    // They are disjoint, which is exactly why the second condition matters.
    expect(E_EVEN.outcomes.filter((o) => E_ONE_OR_THREE.outcomes.includes(o))).toEqual([]);
    expect(toNumber(probability(DIE, E_EVEN)) + toNumber(probability(DIE, E_ONE_OR_THREE))).not.toBe(1);
    expect(prose()).toMatch(/disjoint/i);
    expect(prose()).toMatch(/cover/i);
  });
});

describe('probability values', () => {
  it('lands every authored probability in 0 to 1', () => {
    for (const [exp, ev] of CANONICAL_EVENTS) {
      const v = toNumber(probability(exp, ev));
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('recomputes every authored value exactly', () => {
    const cases: Array<[Experiment, Event, string, string]> = [
      [DIE, E_EVEN, '1/2', '1/2'],
      [DIE, E_SEVEN, '0', '1'],
      [DIE, E_UNDER_7, '1', '0'],
      [COIN2, E_ONE_HEAD, '1/2', '1/2'],
      [DICE2, E_SUM7, '1/6', '5/6'],
      [DICE2, E_SUM2, '1/36', '35/36'],
      [CARD, E_RED_CARD, '1/2', '1/2'],
      [CARD, E_KING, '1/13', '12/13'],
      [MARBLES, E_RED_MARBLE, '1/2', '1/2'],
      [MARBLES, E_NOT_WHITE, '7/10', '3/10'],
    ];
    for (const [exp, ev, p, pc] of cases) {
      expect(formatRational(probability(exp, ev)), `${ev.id}`).toBe(p);
      expect(formatRational(probability(exp, complement(exp, ev))), `not ${ev.id}`).toBe(pc);
    }
  });

  it('separates impossible from unlikely, and sure from very likely', () => {
    expect(isImpossible(E_SEVEN)).toBe(true);
    expect(formatRational(probability(DIE, E_SEVEN))).toBe('0');
    expect(isSure(DIE, E_UNDER_7)).toBe(true);
    expect(formatRational(probability(DIE, E_UNDER_7))).toBe('1');
    // Small but positive is NOT impossible.
    expect(isImpossible(E_SUM2)).toBe(false);
    expect(toNumber(probability(DICE2, E_SUM2))).toBeGreaterThan(0);
    // Most likely sum is NOT sure.
    expect(isSure(DICE2, E_SUM7)).toBe(false);
    expect(toNumber(probability(DICE2, E_SUM7))).toBeLessThan(1);
  });

  it('keeps fractions exact and marks decimals as approximate', () => {
    expect(formatRational(rational(1, 3))).toBe('1/3');
    expect(approxDecimal(rational(3, 8))).toBe('0.375');
    expect(prose()).toMatch(/rounded/i);
    expect(prose()).not.toMatch(/0\.33333|0\.666666/);
  });
});

describe('dice sums, deck facts and prose counts', () => {
  it('shows the sums are not equally likely', () => {
    expect(eventSize(E_SUM7)).toBe(6);
    expect(eventSize(E_SUM2)).toBe(1);
    expect(formatRational(probability(DICE2, E_SUM7))).not.toBe(formatRational(probability(DICE2, E_SUM2)));
    // 1/11 appears only as a claim being refuted, never asserted.
    const all = prose();
    for (const m of all.matchAll(/.{0,140}1\/11.{0,140}/g)) {
      expect(m[0], 'an unrefuted 1/11 claim').toMatch(/wrong|not equally likely|rather than|what is wrong/i);
    }
    expect(all).toMatch(/not equally likely/i);
  });

  it('states only the deck facts it uses, with no jokers', () => {
    expect(sampleSpaceSize(CARD)).toBe(52);
    expect(eventSize(E_RED_CARD)).toBe(26);
    expect(eventSize(E_KING)).toBe(4);
    // Jokers appear only as an exclusion, never as part of the deck.
    expect(CARD.description).toMatch(/no jokers/i);
    for (const m of prose().matchAll(/.{0,40}joker.{0,20}/gi)) {
      expect(m[0], 'a joker treated as part of the deck').toMatch(/no jokers/i);
    }
  });

  it('treats marbles as individual outcomes, not colours', () => {
    expect(sampleSpaceSize(MARBLES)).toBe(10);
    expect(eventSize(E_RED_MARBLE)).toBe(5);
    expect(eventSize(E_NOT_WHITE)).toBe(7);
    expect(prose()).toMatch(/not (?:the )?colours|not three|per marble, not per colour/i);
  });

  it('reconciles the counts stated in prose with the model', () => {
    const all = prose();
    const stated: Array<[number, number]> = [
      [sampleSpaceSize(DICE2), 36], [eventSize(E_SUM7), 6], [sampleSpaceSize(CARD), 52],
      [eventSize(E_KING), 4], [eventSize(E_RED_CARD), 26], [sampleSpaceSize(MARBLES), 10],
    ];
    for (const [actual, inProse] of stated) expect(statedCountMatches(actual, inProse)).toBe(true);
    for (const n of [36, 52, 10]) expect(all).toContain(String(n));
  });

  it('introduces nothing beyond the classical, simple-problem scope', () => {
    const all = prose();
    expect(all).not.toMatch(/conditional probability|given that|independen|mutually exclusive|Bayes|random variable|distribution/i);
    expect(all).not.toMatch(/multiplication (?:rule|theorem)|addition (?:rule|theorem)/i);
    expect(all).not.toMatch(/becomes exactly|approaches the theoretical/i);
  });
});

describe('lesson quality and governance', () => {
  it('authors four lessons with correct Chapter 14 provenance', () => {
    expect(CLASS10_PROBABILITY_SECTIONS.length).toBe(4);
    for (const s of CLASS10_PROBABILITY_SECTIONS) {
      expect(s.source.officialChapterId).toBe('ncert_jemh1_ch14');
      expect(s.source.sectionNumber).toBe('14.1');
      expect(s.source.startPage).toBe(202);
      expect(s.reviewStatus).toBe('authored_draft');
      expect(s.contentArtifactVersion).toBe(1);
    }
  });

  it('uses every term it defines, with no thin reasoning or placeholder', () => {
    for (const s of CLASS10_PROBABILITY_SECTIONS) {
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
        // An unevaluated template literal would survive as a literal ${...}.
        expect(t, s.contentArtifactId).not.toMatch(/\$\{/);
      }
    }
  });

  it('keeps its four lessons renderable as Class 10 grows', () => {
    // v0.84.0-c10.12 checkpoint 66 — Chapter 11 joins the catalogue, so this
    // test narrows to the chapter it is actually about.
    const c10 = allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_jemh'));
    for (const s of c10) expect(s.reviewStatus).toBe('authored_draft');
    __setAuthoredLearnPreviewForTests(true);
    const cat = authoredLearnCatalogueForReview('class10');
    const ch14 = cat.chapters.find((c) => c.number === 14)!;
    expect(ch14.lessons.length).toBe(4);
    for (const lesson of ch14.lessons) {
      const { unmount } = render(
        <LearnSectionView content={learnContentFor(lesson.section)} visualsById={lesson.section.visualsById} />
      );
      expect(screen.getAllByRole('button', { name: /Learn the idea/i }).length).toBeGreaterThan(0);
      unmount(); cleanup();
    }
    __setAuthoredLearnPreviewForTests(null);
  });

  it('leaves the six Class 9 probability lessons and their audit untouched', () => {
    expect(probabilityChapterSections().length).toBe(6);
    for (const s of probabilityChapterSections()) {
      expect(s.contentArtifactVersion).toBe(1);
      expect(auditProbabilitySection(s), s.contentArtifactId).toEqual([]);
    }
  });

  it('keeps the gate closed and the ten earlier Class 10 waves unchanged', () => {
    expect(authoredLearnCatalogueForGrade('class10').lessonCount).toBe(0);
    expect(authoredLearnCatalogueForGrade('class9').lessonCount).toBe(0);
    const waves = [CLASS10_TRIGONOMETRY_SECTIONS, CLASS10_COMPOSITE_SOLIDS_SECTIONS,
      CLASS10_SIMILARITY_SECTIONS, CLASS10_QUADRATIC_SECTIONS, CLASS10_STATISTICS_SECTIONS,
      CLASS10_LINEAR_SYSTEM_SECTIONS, CLASS10_HEIGHTS_DISTANCES_SECTIONS,
      CLASS10_REAL_NUMBERS_SECTIONS, CLASS10_POLYNOMIAL_SECTIONS, CLASS10_AP_SECTIONS];
    expect(waves.map((w) => w.length)).toEqual([4, 3, 6, 4, 8, 5, 3, 4, 4, 5]);
    for (const w of waves) for (const s of w) expect(s.contentArtifactVersion).toBe(1);
    expect(allAuthoredSections().filter((s) => s.source.officialChapterId.startsWith('ncert_iemh')).length).toBe(92);
  });
});
