// v0.62 §22 — guards for the Class 6 instructional pilot.

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  class6ChapterCards,
  availableClass6Chapters,
  unavailableClass6Chapters,
  fractionsSectionCards,
} from '../studentChapterModel';
import {
  isClass6Core,
  withheldFromClass6Core,
  withheldItemCount,
  LEGACY_MODULE_DISPOSITIONS,
} from '../legacyDisposition';
import {
  alignmentForSkill,
  alignsToSection,
  alignmentIsReviewed,
  validateAlignment,
  emptyAlignment,
  fractionsAlignmentCoverage,
  CLASS6_FRACTIONS_SKILL_ALIGNMENT,
} from '../itemAlignment';
import {
  judge,
  classifyReadingLoad,
  wordCount,
  tickValue,
  CLASS_6_8_STEM_WORD_LIMIT,
} from '../instructionalInteraction';
import { SECTION_7_4_PRACTICE } from '../fractionsPracticeItems';
import { fractionsEqual } from '../visualSpecification';
import {
  packageState,
  mayAdvanceBeyondDraft,
  reviewRecordFor,
  unansweredItems,
  type ReviewRecord,
} from '../educatorReview';
import { sectionsForChapter } from '../officialSections';

// ---------------------------------------------------------------------------
// §4 — official chapter order
// ---------------------------------------------------------------------------

describe('§4 Class 6 Learn uses the official book order', () => {
  const EXPECTED = [
    'Patterns in Mathematics',
    'Lines and Angles',
    'Number Play',
    'Data Handling and Presentation',
    'Prime Time',
    'Perimeter and Area',
    'Fractions',
    'Playing with Constructions',
    'Symmetry',
    'The Other Side of Zero',
  ];

  it('shows all ten official chapters', () => {
    expect(class6ChapterCards()).toHaveLength(10);
  });

  it('orders them exactly as Ganita Prakash does', () => {
    expect(class6ChapterCards().map((c) => c.title)).toEqual(EXPECTED);
  });

  it('numbers them 1..10 with no gaps', () => {
    expect(class6ChapterCards().map((c) => c.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it('cannot silently revert to legacy module ordering', () => {
    // The legacy order began with fractions/geometry. If the source of
    // truth ever reverts to module declaration order, chapter 1 stops
    // being Patterns in Mathematics.
    const first = class6ChapterCards()[0];
    expect(first.title).toBe('Patterns in Mathematics');
    expect(first.number).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// §3 — honest unavailable states
// ---------------------------------------------------------------------------

describe('§3 unavailable chapters stay honest', () => {
  it('marks chapters with no content as not available', () => {
    const unavailable = unavailableClass6Chapters().map((c) => c.number);
    // Chapters 1, 3, 4, 8, 10 have no Pragati content at all.
    expect(unavailable).toEqual(expect.arrayContaining([1, 3, 4, 8, 10]));
  });

  it('does not fabricate content to fill the screen', () => {
    for (const c of unavailableClass6Chapters()) {
      // v0.70 §27 — `moduleIds` is no longer required to be empty.
      //
      // Chapter availability now rolls up from SECTION eligibility, so
      // a chapter can hold a mapped legacy module and still be
      // unavailable — which is exactly the case this release fixed.
      // Lines and Angles maps to `geometry` and had none of its eleven
      // sections routed, yet advertised "Ready to learn"; a student
      // tapped it and found every part Coming soon.
      //
      // What must remain true is the STUDENT-FACING claim: an
      // unavailable chapter says so and offers nothing.
      expect(c.statusLine).toBe('Not available yet');
      expect(c.availability).not.toBe('available');
    }
  });

  it('still shows every official chapter, available or not', () => {
    const total =
      availableClass6Chapters().length + unavailableClass6Chapters().length;
    expect(total).toBe(10);
  });

  it('uses no governance vocabulary in student status lines', () => {
    const BANNED = [
      'unmapped', 'competency', 'authored_draft', 'primary_verified',
      'educator_review', 'mapping', 'partial', 'draft',
    ];
    for (const c of [...class6ChapterCards(), ...fractionsSectionCards()]) {
      for (const term of BANNED) {
        expect(c.statusLine.toLowerCase()).not.toContain(term);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// §5 — legacy modules out of the core pathway
// ---------------------------------------------------------------------------

describe('§5 misplaced legacy modules leave the Class 6 core', () => {
  it('excludes decimals, algebra and ratio_proportion from core', () => {
    expect(isClass6Core('decimals')).toBe(false);
    expect(isClass6Core('algebra')).toBe(false);
    expect(isClass6Core('ratio_proportion')).toBe(false);
  });

  it('keeps verified modules in core', () => {
    expect(isClass6Core('fractions')).toBe(true);
    expect(isClass6Core('geometry')).toBe(true);
  });

  it('never surfaces them as an official Class 6 chapter', () => {
    const allModules = class6ChapterCards().flatMap((c) => c.moduleIds);
    expect(allModules).not.toContain('decimals');
    expect(allModules).not.toContain('algebra');
    expect(allModules).not.toContain('ratio_proportion');
  });

  it('preserves the items rather than deleting them', () => {
    // 150 items withheld, not destroyed. Disposition is an educator
    // decision (Package A, D1-D3) that has not been made.
    expect(withheldItemCount()).toBe(150);
    expect(withheldFromClass6Core()).toHaveLength(3);
  });

  it('records evidence and the review item that will settle each', () => {
    for (const r of LEGACY_MODULE_DISPOSITIONS) {
      expect(r.evidence.length).toBeGreaterThan(30);
      expect(r.awaitingReviewItem).toMatch(/^D\d$/);
      // Grade IDs untouched — no automatic re-levelling.
      expect(r.currentGradeId).toBe('class6');
    }
  });

  it('does not treat pending-review as approved supplementary', () => {
    // 'supplementary_pending_review' must not reach the core path
    // either — pending is not approved.
    expect(isClass6Core('decimals')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// §6 — item alignment requires evidence
// ---------------------------------------------------------------------------

describe('§6 section alignment is never inferred from the module', () => {
  it('does not align fractions skills to §7.4 merely by module membership', () => {
    // §7.4 is one of the four sections the module does NOT cover.
    // Mass-tagging by module would have produced 104 false claims.
    for (const skillId of Object.keys(CLASS6_FRACTIONS_SKILL_ALIGNMENT)) {
      expect(alignsToSection(alignmentForSkill(skillId), 'ncert_gp_c6_s7_4')).toBe(
        false
      );
    }
  });

  it('defaults an unknown skill to unmapped, not to the chapter', () => {
    const a = alignmentForSkill('FR.99');
    expect(a.alignmentStatus).toBe('unmapped');
    expect(a.officialSectionId).toBeNull();
    expect(a.officialChapterId).toBeNull();
  });

  it('does not let chapter knowledge imply section knowledge', () => {
    const a = alignmentForSkill('FR.08');
    expect(a.officialChapterId).toBe('ncert_gp_c6_ch07_fractions');
    // Chapter known, section deliberately not.
    expect(a.officialSectionId).toBeNull();
    expect(a.alignmentStatus).toBe('multi_section_candidate');
    expect(a.candidateSectionIds.length).toBeGreaterThanOrEqual(2);
  });

  it('refuses a multi-section item as practice for one section', () => {
    const a = alignmentForSkill('FR.08');
    expect(alignsToSection(a, 'ncert_gp_c6_s7_6')).toBe(false);
  });

  it('requires evidence for any status past unmapped', () => {
    const bad = { ...emptyAlignment('x'), alignmentStatus: 'exact_section_candidate' as const };
    const errors = validateAlignment(bad);
    expect(errors.some((e) => /requires alignmentEvidence/.test(e))).toBe(true);
    expect(errors.some((e) => /requires officialSectionId/.test(e))).toBe(true);
  });

  it('validates every recorded alignment', () => {
    for (const skillId of Object.keys(CLASS6_FRACTIONS_SKILL_ALIGNMENT)) {
      expect(validateAlignment(alignmentForSkill(skillId))).toEqual([]);
    }
  });

  it('never marks a pending alignment as reviewed automatically', () => {
    for (const skillId of Object.keys(CLASS6_FRACTIONS_SKILL_ALIGNMENT)) {
      expect(alignmentIsReviewed(alignmentForSkill(skillId))).toBe(false);
    }
  });

  it('supports FEWER sections than chapter-level mapping claimed', () => {
    const ids = sectionsForChapter('ncert_gp_c6_ch07_fractions').map(
      (s) => s.officialSectionId
    );
    const cov = fractionsAlignmentCoverage(ids);

    // v0.61's SECTION MAPPING recorded 5 sections as having Pragati
    // content (7.1, 7.2, 7.5, 7.6, 7.8). Per-skill ITEM ALIGNMENT
    // supports only 4 — because FR.02 serves §7.2 squarely and §7.1
    // only partially, and a partial fit is not an exact alignment.
    //
    // The two numbers measure different things and the smaller one is
    // the stricter claim. Recorded rather than reconciled: it is a
    // question for the educator review (Package A, item B1).
    expect(cov.sectionsWithAlignedSkills).toBe(4);
    expect(cov.sectionsWithoutAlignedSkills).toBe(5);
    expect(cov.educatorReviewedAlignments).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// §9 — exact semantics in interactions
// ---------------------------------------------------------------------------

describe('§9 interactions judge by exact rationals', () => {
  it('computes tick values as exact fractions', () => {
    const t = tickValue(
      { numerator: 0, denominator: 1 },
      { numerator: 2, denominator: 1 },
      8,
      5
    );
    // 10/8, exactly equal to 5/4 — no float ever produced.
    expect(fractionsEqual(t, { numerator: 5, denominator: 4 })).toBe(true);
  });

  it('accepts an equivalent fraction where the section teaches equivalence', () => {
    const item = SECTION_7_4_PRACTICE.find((i) => i.itemId === 's74.p4')!;
    const asFourSixths = judge(item, {
      kind: 'fraction',
      value: { numerator: 4, denominator: 6 },
    });
    const asTwoThirds = judge(item, {
      kind: 'fraction',
      value: { numerator: 2, denominator: 3 },
    });
    expect(asFourSixths.correct).toBe(true);
    expect(asTwoThirds.correct).toBe(true);
  });

  it('does not accept a decimal approximation of a repeating fraction', () => {
    const item = SECTION_7_4_PRACTICE.find((i) => i.itemId === 's74.p4')!;
    // 666/1000 is near 2/3 and is NOT 2/3. A float comparison with a
    // tolerance would accept it.
    const j = judge(item, {
      kind: 'fraction',
      value: { numerator: 666, denominator: 1000 },
    });
    expect(j.correct).toBe(false);
  });

  it('marks the correct tick right and a different tick wrong', () => {
    const item = SECTION_7_4_PRACTICE.find((i) => i.itemId === 's74.p1')!;
    expect(judge(item, { kind: 'tick', tickIndex: 3 }).correct).toBe(true);
    expect(judge(item, { kind: 'tick', tickIndex: 1 }).correct).toBe(false);
  });

  it('offers formats beyond multiple choice', () => {
    const formats = new Set(SECTION_7_4_PRACTICE.map((i) => i.format));
    expect(formats.has('select_point_on_number_line')).toBe(true);
    expect(formats.has('numeric_entry')).toBe(true);
    expect(formats.has('fraction_strip_selection')).toBe(true);
    expect(formats.size).toBeGreaterThanOrEqual(4);
  });

  it('keeps instructional practice out of Growth', () => {
    for (const i of SECTION_7_4_PRACTICE) {
      expect(i.use).toBe('instructional_practice');
    }
  });
});

// ---------------------------------------------------------------------------
// §10 — feedback maps only where supported
// ---------------------------------------------------------------------------

describe('§10 misconception feedback claims only what it can know', () => {
  it('names the misconception when the format distinguishes it', () => {
    const item = SECTION_7_4_PRACTICE.find((i) => i.itemId === 's74.p1')!;
    // One tick short IS the counting-ticks error and nothing else.
    const j = judge(item, { kind: 'tick', tickIndex: 2 });
    expect(j.misconceptionId).toBe('counts_ticks_not_spaces');
    expect(j.feedback).toMatch(/spaces/i);
  });

  it('gives neutral guidance when the error is not identifiable', () => {
    const item = SECTION_7_4_PRACTICE.find((i) => i.itemId === 's74.p1')!;
    const j = judge(item, { kind: 'tick', tickIndex: 0 });
    expect(j.misconceptionId).toBeNull();
    expect(j.feedback.length).toBeGreaterThan(10);
  });

  it('never says merely "Wrong."', () => {
    for (const i of SECTION_7_4_PRACTICE) {
      expect(i.neutralIncorrectFeedback.toLowerCase().trim()).not.toBe('wrong.');
      expect(wordCount(i.neutralIncorrectFeedback)).toBeGreaterThan(4);
    }
  });

  it('maps a distractor to a misconception only when authored to', () => {
    const mcq = SECTION_7_4_PRACTICE.find((i) => i.itemId === 's74.p5');
    if (mcq && mcq.format === 'multiple_choice') {
      const tagged = mcq.choices.filter((c) => c.misconceptionId !== null);
      const untagged = mcq.choices.filter((c) => c.misconceptionId === null);
      // Both kinds exist: not every wrong option represents a known error.
      expect(tagged.length).toBeGreaterThan(0);
      expect(untagged.length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// §11 — reading load
// ---------------------------------------------------------------------------

describe('§11 reading load is enforced for the pilot', () => {
  it('keeps every Section 7.4 stem within the Classes 6-8 limit', () => {
    for (const i of SECTION_7_4_PRACTICE) {
      const r = classifyReadingLoad(i.prompt);
      expect(
        r.classification,
        `${i.itemId} has ${r.wordCount} words: "${i.prompt}"`
      ).toBe('within_standard');
    }
  });

  it('flags an over-long stem as requiring rewrite', () => {
    const long = Array.from({ length: 40 }, (_, i) => `word${i}`).join(' ');
    expect(classifyReadingLoad(long).classification).toBe('rewrite_required');
  });

  it('permits a justified exception, but only with a rationale', () => {
    const long = Array.from({ length: 40 }, (_, i) => `word${i}`).join(' ');
    expect(
      classifyReadingLoad(long, 'multi-part reasoning task').classification
    ).toBe('justified_exception');
  });

  it('uses 25 words as the Classes 6-8 limit', () => {
    expect(CLASS_6_8_STEM_WORD_LIMIT).toBe(25);
  });
});

// ---------------------------------------------------------------------------
// §2/§19 — review state is real
// ---------------------------------------------------------------------------

describe('§19 educator review is not fabricated', () => {
  it('reports both packages as prepared but unanswered', () => {
    for (const id of ['A_curriculum', 'B_demonstration'] as const) {
      const r = reviewRecordFor(id);
      expect(packageState(r)).toBe('review_package_ready');
      expect(r.submissions).toEqual([]);
      expect(unansweredItems(r)).toEqual(r.expectedItemIds);
    }
  });

  it('refuses to advance content beyond draft', () => {
    const result = mayAdvanceBeyondDraft(reviewRecordFor('B_demonstration'));
    expect(result.allowed).toBe(false);
  });

  it('keeps received and adjudicated as distinct states', () => {
    const received: ReviewRecord = {
      packageId: 'B_demonstration',
      packageVersion: 'test',
      expectedItemIds: ['M1'],
      submissions: [
        {
          submissionId: 's1',
          packageId: 'B_demonstration',
          reviewerId: 'r1',
          reviewerName: 'Reviewer',
          reviewerRole: 'practising_teacher',
          reviewDate: '2026-08-25',
          responses: [{ itemId: 'M1', decision: 'accept', rationale: 'fine' }],
        },
      ],
      adjudications: [],
    };
    // A response is NOT an adjudication, and must not unlock release.
    expect(packageState(received)).toBe('review_received');
    expect(mayAdvanceBeyondDraft(received).allowed).toBe(false);
  });

  it('blocks release when any adjudication rejects or defers', () => {
    const blocked: ReviewRecord = {
      packageId: 'B_demonstration',
      packageVersion: 'test',
      expectedItemIds: ['M1'],
      submissions: [
        {
          submissionId: 's1',
          packageId: 'B_demonstration',
          reviewerId: 'r1',
          reviewerName: 'R',
          reviewerRole: 'practising_teacher',
          reviewDate: '2026-08-25',
          responses: [{ itemId: 'M1', decision: 'reject', rationale: 'no' }],
        },
      ],
      adjudications: [
        {
          itemId: 'M1',
          outcome: 'content_rejected',
          actionTaken: 'withdrawn',
          adjudicatedBy: 'maintainer',
          adjudicationDate: '2026-08-25',
        },
      ],
    };
    expect(packageState(blocked)).toBe('review_adjudicated');
    expect(mayAdvanceBeyondDraft(blocked).allowed).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// §12 — draft content is not offered to students
// ---------------------------------------------------------------------------

describe('§12 draft content stays out of the student pathway', () => {
  it('shows §7.4 as not available despite the draft existing', () => {
    // The demonstration lesson exists and is authored_draft. A student
    // must not see it, and must not be told something is hidden.
    const s74 = fractionsSectionCards().find((s) => s.sectionNumber === '7.4');
    expect(s74?.availability).toBe('not_available_yet');
    expect(s74?.statusLine).toBe('Not available yet');
  });

  it('shows all nine Fractions sections', () => {
    expect(fractionsSectionCards()).toHaveLength(9);
  });
});

// ---------------------------------------------------------------------------
// §22 — no governance vocabulary in student components
// ---------------------------------------------------------------------------

describe('§22 student UI carries no governance vocabulary', () => {
  it('keeps internal terms out of rendered student text', () => {
    const dir = join(__dirname, '..', '..', 'features', 'student');
    const BANNED = [
      'authored_draft', 'competency_mapping_pending', 'primary_source_verified',
      'legacy_pending_relevel', 'exact_section_candidate', 'MIDDLE:',
    ];
    const hits: string[] = [];
    for (const f of readdirSync(dir).filter(
      (x) => x.endsWith('.tsx') && !x.includes('.test.')
    )) {
      const code = readFileSync(join(dir, f), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
        .replace(/^\s*import[\s\S]*?from\s+['"][^'"]+['"];?$/gm, '');
      const rendered = [
        ...(code.match(/'[^'\n]*'/g) ?? []),
        ...(code.match(/"[^"\n]*"/g) ?? []),
        ...(code.match(/>[^<>{}]+</g) ?? []),
      ].join(' ');
      for (const t of BANNED) {
        if (rendered.includes(t)) hits.push(`${f}: ${t}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
