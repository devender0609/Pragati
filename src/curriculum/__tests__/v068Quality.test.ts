// v0.68 §23 — chapter coherence, the unified misconception model, and
// the Classes 1–12 curriculum registry.

import { describe, it, expect } from 'vitest';
import {
  fractionsChapterSections,
  authoredSectionById,
  section74AsAuthored,
} from '../fractionsChapter';
import { computeContentFingerprint, section74Artifact } from '../contentArtifact';
import { SECTION_7_4_PRACTICE } from '../fractionsPracticeItems';
import {
  MISCONCEPTION_FEEDBACK,
  judge,
  auditItemMisconceptions,
  validateAreaModelItem,
  partsAreEqual,
  shadedAmount,
  INTERACTION_FORMATS,
} from '../instructionalInteraction';
import {
  resolveMisconception,
  assertDiagnosable,
  chapterRef,
  section74Ref,
  auditMisconceptionAttachments,
} from '../misconceptionResolver';
import { MISCONCEPTION_FEEDBACK as RAW_MAP } from '../section74Misconceptions';
import { distractorAudit, distractorAuditSummary, misconceptionUsage } from '../distractorAudit';
import {
  INTERACTION_DECISIONS,
  checkInteractionDecisions,
  REJECTED_INTERACTION_FORMATS,
} from '../interactionDecisions';
import { FRACTIONS_BOUNDARIES, checkBoundaries, boundaryFor } from '../fractionsBoundaries';
import { chapterReadabilityReport } from '../readabilityAudit';
import { readingLoadReport, validateAuthoredSection, sequenceLeaks } from '../sectionValidators';
import { contentAuditCounts, V068_CONTENT_AUDIT } from '../contentAuditLog';
import { chapterQualitySummary, SECTION_7_4_PROJECTION_NOTE } from '../chapterQuality';
import {
  PER_SECTION_REVIEW_INSTRUMENT_DRAFT,
  instrumentMayBeIssued,
  feedbackHasArrived,
  SECTION_7_4_CLASSIFIED_FEEDBACK,
  FEEDBACK_SCOPE_GUIDANCE,
} from '../reviewFeedbackClassification';
import { fractionsSectionCards } from '../studentChapterModel';
import { sectionEligibility } from '../eligibilityPolicy';
import { mayPublishSection, publicationPolicyFor } from '../publicationGate';
import { fractionsEqual } from '../visualSpecification';

// ---------------------------------------------------------------------------
// §1 / §14 — the frozen candidate survives all of this
// ---------------------------------------------------------------------------

describe('§1 the §7.4 review candidate is untouched by v0.68', () => {
  it('still fingerprints to a1a3ff57 after the misconception model was unified', () => {
    expect(computeContentFingerprint()).toBe('a1a3ff57');
    expect(section74Artifact().reviewCode).toBe('S74-v1-A1A3FF');
  });

  it('keeps §7.4 as artifact v1, projected rather than migrated', () => {
    const p = section74AsAuthored();
    expect(p.contentArtifactVersion).toBe(1);
    expect(SECTION_7_4_PROJECTION_NOTE.state).toBe('frozen_v1_projected');
    expect(SECTION_7_4_PROJECTION_NOTE.audience).toBe('admin_reviewer_only');
  });

  it('leaves the §7.4 misconception map at exactly four entries', () => {
    // Widening it is the thing that would break the fingerprint. The
    // chapter registry is where new misconceptions go.
    expect(Object.keys(RAW_MAP)).toHaveLength(4);
    expect(MISCONCEPTION_FEEDBACK).toBe(RAW_MAP);
  });

  it('sets no chapter misconception on any §7.4 choice, so the payload is unmoved', () => {
    for (const item of SECTION_7_4_PRACTICE) {
      if (item.format !== 'multiple_choice') continue;
      for (const c of item.choices) {
        expect(c.chapterMisconceptionId).toBeUndefined();
      }
    }
  });
});

// ---------------------------------------------------------------------------
// §2 — one model, two sources
// ---------------------------------------------------------------------------

describe('§2 the misconception model became chapter-wide', () => {
  it('resolves an old §7.4 misconception identically to before', () => {
    const r = resolveMisconception(section74Ref('counts_ticks_not_spaces'));
    expect(r.feedback).toBe(RAW_MAP.counts_ticks_not_spaces);
    expect(r.diagnosable).toBe(true);
  });

  it('resolves a chapter-registry misconception through the same interface', () => {
    const r = resolveMisconception(chapterRef('add_numerators_and_denominators'));
    expect(r.feedback).toMatch(/same size/i);
    expect(r.record?.id).toBe('add_numerators_and_denominators');
  });

  it('rejects unknown IDs from either source rather than falling back', () => {
    expect(() =>
      resolveMisconception({ source: 'section_7_4_map', id: 'nonsense' as never })
    ).toThrow(/unknown/);
    expect(() =>
      resolveMisconception({
        source: 'fractions_chapter_registry',
        id: 'nonsense' as never,
      })
    ).toThrow(/unknown/);
  });

  it('refuses to attach a non-diagnosable misconception to a response', () => {
    // parts_count_vs_part_size cannot be inferred from one answer.
    expect(() => assertDiagnosable(chapterRef('parts_count_vs_part_size'))).toThrow(
      /not diagnosable/
    );
    const errs = auditMisconceptionAttachments([
      {
        itemId: 'hypothetical',
        optionId: 'x',
        ref: chapterRef('parts_count_vs_part_size'),
      },
    ]);
    expect(errs).toHaveLength(1);
    expect(errs[0].reason).toBe('not_diagnosable');
  });

  it('attaches add_numerators_and_denominators to the §7.8 distractor that shows it', () => {
    const s78 = authoredSectionById('ncert_gp_c6_s7_8')!;
    const item = s78.interactivePractice.find((i) => i.itemId === 's78.p2')!;
    const j = judge(item, { kind: 'choice', choiceId: 'b' });
    expect(j.correct).toBe(false);
    expect(j.chapterMisconceptionId).toBe('add_numerators_and_denominators');
    expect(j.misconceptionRef?.source).toBe('fractions_chapter_registry');
    // The §7.4 field stays null — the two sources do not bleed.
    expect(j.misconceptionId).toBeNull();
  });

  it('attaches compare_numerators_only where the response actually diagnoses it', () => {
    const s77 = authoredSectionById('ncert_gp_c6_s7_7')!;
    const item = s77.interactivePractice.find((i) => i.itemId === 's77.p1')!;
    const j = judge(item, { kind: 'choice', choiceId: 'c' });
    expect(j.chapterMisconceptionId).toBe('compare_numerators_only');
    expect(j.feedback).toMatch(/top number/i);
  });

  it('diagnoses a produced value, not merely a recognised option', () => {
    // v0.69 §24/§25 — the §7.5 diagnosis on 6/4 was WITHDRAWN. Re-checked
    // against "could a student type this for another reason?", it fails:
    // 2 + 4 = 6 reaches 6/4 by adding the whole to the denominator, which
    // is a different error from multiplying. The response is now neutral.
    const s75 = authoredSectionById('ncert_gp_c6_s7_5')!;
    const item = s75.interactivePractice.find((i) => i.itemId === 's75.p1')!;
    expect(
      judge(item, { kind: 'fraction', value: { numerator: 11, denominator: 4 } }).correct
    ).toBe(true);
    const j = judge(item, { kind: 'fraction', value: { numerator: 6, denominator: 4 } });
    expect(j.correct).toBe(false);
    expect(j.chapterMisconceptionId).toBeNull();
    expect(j.feedback).toMatch(/8 fourths/);

    // The surviving diagnostic value still behaves exactly as designed:
    // exact form only, never by equivalence.
    const s78 = authoredSectionById('ncert_gp_c6_s7_8')!;
    const add = s78.interactivePractice.find((i) => i.itemId === 's78.p3')!;
    expect(
      judge(add, { kind: 'fraction', value: { numerator: 2, denominator: 5 } })
        .chapterMisconceptionId
    ).toBe('add_numerators_and_denominators');
    // 4/10 equals 2/5 but is not evidence of the same method.
    expect(
      judge(add, { kind: 'fraction', value: { numerator: 4, denominator: 10 } })
        .chapterMisconceptionId
    ).toBeNull();
  });

  it('finds no authoring defect anywhere in the chapter', () => {
    const items = fractionsChapterSections().flatMap((s) => s.interactivePractice);
    expect(auditItemMisconceptions(items)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §3 / §4 — the distractor audit
// ---------------------------------------------------------------------------

describe('§3 every incorrect option is classified', () => {
  it('classifies each distractor as diagnostic or non-diagnostic', () => {
    const rows = distractorAudit();
    expect(rows.length).toBeGreaterThan(10);
    for (const r of rows) {
      if (r.classification === 'diagnostic') {
        expect(r.misconceptionId).not.toBeNull();
        expect(r.whyUnique).toBeTruthy();
      } else {
        expect(r.misconceptionId).toBeNull();
      }
      expect(r.studentFeedback.trim().length).toBeGreaterThan(10);
    }
  });

  it('recovers the two diagnoses v0.67 had to abandon', () => {
    const ids = distractorAudit().map((r) => r.misconceptionId);
    expect(ids).toContain('compare_numerators_only');
    expect(ids).toContain('add_numerators_and_denominators');
  });

  it('reports both diagnostic and neutral distractors — neither is zero', () => {
    const s = distractorAuditSummary();
    expect(s.diagnostic).toBeGreaterThan(0);
    // Neutral must remain: a chapter where every wrong answer is
    // diagnosed has stopped admitting that some are unknowable.
    expect(s.nonDiagnostic).toBeGreaterThan(0);
    expect(s.diagnostic + s.nonDiagnostic).toBe(s.totalIncorrectOptions);
  });

  it('separates documented misconceptions from actually-used ones', () => {
    const usage = misconceptionUsage();
    expect(usage).toHaveLength(9);
    // Documenting is not detecting, and the report must show the gap.
    expect(usage.some((u) => u.usedInDistractors === 0)).toBe(true);
    for (const u of usage) {
      if (!u.diagnosable) expect(u.usedInDistractors).toBe(0);
    }
  });

  it('never says merely "Wrong."', () => {
    for (const r of distractorAudit()) {
      expect(r.studentFeedback.toLowerCase().trim()).not.toBe('wrong.');
    }
  });
});

// ---------------------------------------------------------------------------
// §5 / §6 — interaction decisions
// ---------------------------------------------------------------------------

describe('§5 interaction decisions are recorded and match the chapter', () => {
  it('records a decision with a rationale for all nine sections', () => {
    expect(INTERACTION_DECISIONS).toHaveLength(9);
    for (const d of INTERACTION_DECISIONS) {
      expect(d.rationale.length).toBeGreaterThan(60);
    }
  });

  it('agrees with the sections as actually authored', () => {
    expect(checkInteractionDecisions(fractionsChapterSections())).toEqual([]);
  });

  it('gave §7.1, §7.2, §7.3 and §7.5 an interaction, each for a stated reason', () => {
    for (const num of ['7.1', '7.2', '7.3', '7.5']) {
      const d = INTERACTION_DECISIONS.find((x) => x.sectionNumber === num)!;
      expect(d.decision).toBe('added');
      expect(d.itemIds.length).toBeGreaterThan(0);
    }
  });

  it('leaves §7.9 non-interactive on purpose', () => {
    const d = INTERACTION_DECISIONS.find((x) => x.sectionNumber === '7.9')!;
    expect(d.decision).toBe('intentionally_none');
    expect(d.itemIds).toEqual([]);
    expect(authoredSectionById('ncert_gp_c6_s7_9')!.interactivePractice).toEqual([]);
  });

  it('adds exactly one new interaction format and records what was rejected', () => {
    expect(INTERACTION_FORMATS).toHaveLength(5);
    expect(INTERACTION_FORMATS).toContain('area_model_selection');
    expect(REJECTED_INTERACTION_FORMATS.length).toBeGreaterThanOrEqual(3);
    for (const r of REJECTED_INTERACTION_FORMATS) {
      expect(r.reason.length).toBeGreaterThan(40);
    }
  });

  it('keeps §7.1–§7.3 free of the number line', () => {
    for (const num of ['7.1', '7.2', '7.3']) {
      const s = fractionsChapterSections().find((x) => x.source.sectionNumber === num)!;
      expect(
        s.interactivePractice.some((i) => i.format === 'select_point_on_number_line')
      ).toBe(false);
    }
  });
});

describe('§6 area-model items are structurally sound', () => {
  it('tiles the whole exactly and admits exactly one correct option', () => {
    for (const s of fractionsChapterSections()) {
      for (const i of s.interactivePractice) {
        if (i.format !== 'area_model_selection') continue;
        expect(validateAreaModelItem(i), i.itemId).toEqual([]);
      }
    }
  });

  it('evidences what a strip cannot: an unequal partition', () => {
    const s71 = authoredSectionById('ncert_gp_c6_s7_1')!;
    const item = s71.interactivePractice.find((i) => i.itemId === 's71.p1')!;
    if (item.format !== 'area_model_selection') throw new Error('wrong format');
    const unequal = item.options.filter((o) => !partsAreEqual(o.partWidths));
    expect(unequal.length).toBeGreaterThan(0);
    // And an unequal option is wrong however much is shaded.
    for (const o of unequal) {
      expect(judge(item, { kind: 'region', optionId: o.id }).correct).toBe(false);
    }
  });

  it('derives correctness rather than trusting an authored flag', () => {
    const s72 = authoredSectionById('ncert_gp_c6_s7_2')!;
    const item = s72.interactivePractice.find((i) => i.itemId === 's72.p1')!;
    if (item.format !== 'area_model_selection') throw new Error('wrong format');
    const correct = item.options.filter(
      (o) => partsAreEqual(o.partWidths) && fractionsEqual(shadedAmount(o), item.targetValue)
    );
    expect(correct).toHaveLength(1);
    expect(judge(item, { kind: 'region', optionId: correct[0].id }).correct).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// §7 — readability, advisory
// ---------------------------------------------------------------------------

describe('§7 the readability audit is broad and honest about its limits', () => {
  it('keeps the original stem validator green', () => {
    const r = readingLoadReport(fractionsChapterSections());
    expect(r.rewrite_required).toBe(0);
    expect(r.within_standard).toBeGreaterThan(80);
  });

  it('covers prose the stem validator never saw', () => {
    const r = chapterReadabilityReport(fractionsChapterSections());
    // Explanations, goals, reasoning steps, feedback and summaries.
    expect(r.totalProsePieces).toBeGreaterThan(300);
    expect(r.sections).toHaveLength(9);
  });

  it('claims no readability grade', () => {
    const r = chapterReadabilityReport(fractionsChapterSections());
    expect(r.disclaimer).toMatch(/not a readability grade/i);
    expect(r.disclaimer).toMatch(/no reading age is claimed/i);
    expect(JSON.stringify(r)).not.toMatch(/flesch|kincaid|smog|reading age \d/i);
  });

  it('flags outliers without failing the build over them', () => {
    const r = chapterReadabilityReport(fractionsChapterSections());
    // Advisory: a flag is a request for a human read, not an error.
    expect(r.totalFlagged).toBeLessThan(r.totalProsePieces);
  });
});

// ---------------------------------------------------------------------------
// §8 — boundaries
// ---------------------------------------------------------------------------

describe('§8 the concept boundary table covers the chapter', () => {
  it('records may-assume, teach-here and defer for all nine sections', () => {
    expect(FRACTIONS_BOUNDARIES).toHaveLength(9);
    for (const b of FRACTIONS_BOUNDARIES) {
      expect(b.mayAssume.length).toBeGreaterThan(0);
      expect(b.teachHere.length).toBeGreaterThan(0);
    }
  });

  it('agrees with every section\'s own sequence declaration', () => {
    expect(checkBoundaries(fractionsChapterSections())).toEqual([]);
  });

  it('never defers a concept to an earlier section', () => {
    for (const b of FRACTIONS_BOUNDARIES) {
      for (const d of b.deferTo) {
        if (!d.belongsToSection.startsWith('ncert_gp_c6_s7_')) continue;
        expect(d.belongsToSection > b.officialSectionId, `${b.sectionNumber}`).toBe(true);
      }
    }
  });

  it('keeps the keyword sequence guardrail as well', () => {
    // Two independent checks. The keyword one missed the two real
    // violations, which is exactly why it is not the only one.
    for (const s of fractionsChapterSections()) {
      expect(sequenceLeaks(s), s.source.sectionNumber).toEqual([]);
    }
  });

  it('lets §7.9 defer nothing, because it closes the chapter', () => {
    expect(boundaryFor('ncert_gp_c6_s7_9')!.deferTo).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §9 / §10 / §11 — the hand audit
// ---------------------------------------------------------------------------

describe('§9-§11 the manual content audit is recorded and consistent', () => {
  it('records a finding, an action and a clause for every entry', () => {
    expect(V068_CONTENT_AUDIT.length).toBeGreaterThanOrEqual(10);
    for (const e of V068_CONTENT_AUDIT) {
      expect(e.finding.length).toBeGreaterThan(40);
      expect(e.action.length).toBeGreaterThan(10);
      expect(e.clause).toMatch(/§/);
    }
  });

  it('derives accepted-as-is counts from the live chapter', () => {
    const c = contentAuditCounts(fractionsChapterSections());
    for (const b of [c.workedExamples, c.guidedItems, c.independentItems, c.reasoningTasks]) {
      expect(b.accepted_as_is + b.revised + b.removed + b.needs_human_review).toBe(b.total);
      expect(b.accepted_as_is).toBeGreaterThanOrEqual(0);
    }
    expect(c.workedExamples.revised).toBeGreaterThan(0);
    expect(c.independentItems.revised).toBeGreaterThan(0);
    expect(c.reasoningTasks.revised).toBeGreaterThan(0);
  });

  it('actually fixed the guava premise', () => {
    const s71 = authoredSectionById('ncert_gp_c6_s7_1')!;
    const we1 = s71.workedExamples.find((w) => w.id === 's71.we1')!;
    // "about the same size" was doing the work of "equal", in a section
    // whose entire point is that the parts must be exactly equal.
    expect(we1.prompt).not.toMatch(/about the same size/i);
    expect(we1.prompt).toMatch(/equally/i);
  });

  it('removed the decimals from the §7.7 reasoning task', () => {
    const s77 = authoredSectionById('ncert_gp_c6_s7_7')!;
    const r1 = s77.reasoningApplication.find((r) => r.id === 's77.r1')!;
    // The current Grade 6 book has no decimals chapter at all.
    expect(`${r1.prompt} ${r1.expectedReasoning}`).not.toMatch(/\d+\.\d/);
  });

  it('keeps every section structurally valid after the edits', () => {
    for (const s of fractionsChapterSections()) {
      expect(validateAuthoredSection(s), s.source.sectionNumber).toEqual([]);
    }
  });
});

// ---------------------------------------------------------------------------
// §13 / §20 — quality summary
// ---------------------------------------------------------------------------

describe('§13 the chapter quality summary uses counts and flags, not scores', () => {
  it('reports a row per section with artifact identity and review status', () => {
    const s = chapterQualitySummary();
    expect(s.rows).toHaveLength(9);
    for (const r of s.rows) {
      expect(r.artifactId).toBeTruthy();
      expect(r.educatorReviewStatus).toBe('not_reviewed');
      expect(r.boundaryRecorded).toBe(true);
    }
  });

  it('marks §7.4 as projected and everything else as natively authored', () => {
    const rows = chapterQualitySummary().rows;
    const projected = rows.filter(
      (r) => r.authoringMode === 'projected_from_frozen_artifact'
    );
    expect(projected).toHaveLength(1);
    expect(projected[0].officialSectionId).toBe('ncert_gp_c6_s7_4');
  });

  it('publishes no composite score anywhere in the summary', () => {
    const json = JSON.stringify(chapterQualitySummary());
    expect(json).not.toMatch(/"(qualityScore|score|rating|percentComplete)"/);
  });
});

// ---------------------------------------------------------------------------
// §15 / §16 — feedback classification and the DRAFT instrument
// ---------------------------------------------------------------------------

describe('§15-§16 review preparation exists without inventing review', () => {
  it('offers a classification for every feedback scope', () => {
    expect(Object.keys(FEEDBACK_SCOPE_GUIDANCE)).toHaveLength(7);
  });

  it('holds no reviewer feedback, real or sample', () => {
    expect(SECTION_7_4_CLASSIFIED_FEEDBACK).toEqual([]);
    expect(feedbackHasArrived()).toBe(false);
  });

  it('keeps the per-section instrument a draft that cannot be issued', () => {
    expect(PER_SECTION_REVIEW_INSTRUMENT_DRAFT.status).toBe('draft_not_activated');
    expect(PER_SECTION_REVIEW_INSTRUMENT_DRAFT.questions.length).toBeGreaterThanOrEqual(8);
    expect(PER_SECTION_REVIEW_INSTRUMENT_DRAFT.questions.length).toBeLessThanOrEqual(10);
    expect(instrumentMayBeIssued()).toBe(false);
  });

  it('covers every area §16 requires', () => {
    const areas = PER_SECTION_REVIEW_INSTRUMENT_DRAFT.questions
      .map((q) => q.area.toLowerCase())
      .join(' ');
    for (const needle of [
      'mathematical accuracy',
      'textbook fidelity',
      'sequence',
      'explanation',
      'visual',
      'practice',
      'misconception',
      'readability',
      'overall',
    ]) {
      expect(areas, needle).toContain(needle);
    }
  });
});

// ---------------------------------------------------------------------------
// §17 / §18 / §21 — nothing became visible or publishable
// ---------------------------------------------------------------------------

describe('§17-§18 quality work did not change what a student can reach', () => {
  it('leaves the student Fractions landing at four practisable parts', () => {
    const practisable = fractionsSectionCards().filter(
      (s) => s.availability !== 'not_available_yet'
    );
    expect(practisable).toHaveLength(4);
  });

  it('keeps the newly interactive sections invisible to students', () => {
    // §7.1, §7.2, §7.3 and §7.5 gained interactions in Admin only.
    for (const id of ['ncert_gp_c6_s7_1', 'ncert_gp_c6_s7_3']) {
      expect(sectionEligibility(id).hasEligibleLearn).toBe(false);
    }
  });

  it('gives no new section a publication policy', () => {
    for (const s of fractionsChapterSections()) {
      const id = s.source.officialSectionId;
      if (id === 'ncert_gp_c6_s7_4') continue;
      expect(publicationPolicyFor(id)).toBeNull();
      expect(mayPublishSection(id).mayPublish).toBe(false);
    }
  });

  it('marks nothing educator-reviewed', () => {
    const s = chapterQualitySummary();
    expect(s.educatorReviewed).toBe(0);
    expect(s.published).toBe(0);
    expect(s.authoredDrafts).toBe(9);
  });
});
