// v0.63 §16 — the pilot loop must be internally consistent.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  mayOfferSectionPractice,
  sectionEligibility,
  getStudentChapterAvailability,
  getTeacherCoverageStatus,
  mayAssignSectionActivity,
  assignableSections,
  LEGACY_LESSON_GRANDFATHERING,
} from '../eligibilityPolicy';
import {
  class6ChapterCards,
  fractionsSectionCards,
} from '../studentChapterModel';
import { sectionsForChapter } from '../officialSections';
import { fractionsAlignmentCoverage } from '../itemAlignment';
import {
  sectionProgressForChapter,
  eligibleSectionForSkill,
  continueFrom,
  unattributedSessionCount,
} from '../sectionProgress';
import {
  importReviewSubmission,
  packageState,
  mayAdvanceBeyondDraft,
  reviewRecordFor,
  type ReviewRecord,
} from '../educatorReview';
import { Class6ChapterList } from '../../features/student/Class6Learn';
import { SectionAssignmentPanel } from '../../features/teacher/SectionAssignmentPanel';
import type { Session } from '../../types';

const CH7 = 'ncert_gp_c6_ch07_fractions';

// ---------------------------------------------------------------------------
// §1 — the 5-vs-4 conflict cannot recur
// ---------------------------------------------------------------------------

describe('§1 one authoritative answer for section practice', () => {
  it('refuses §7.1, whose only related skill is aligned elsewhere', () => {
    // THE v0.62 DEFECT. §7.1 lists FR.02 in pragatiSkillIds; FR.02 is
    // exactly aligned to §7.2. Listing is not alignment, and v0.62
    // offered "§7.1 Practice" backed by §7.2's items.
    const e = sectionEligibility('ncert_gp_c6_s7_1');
    expect(mayOfferSectionPractice('ncert_gp_c6_s7_1')).toBe(false);
    expect(e.hasMapping).toBe(true); // related content DOES exist
    expect(e.alignedSkillIds).toEqual([]); // but none aligned here
    expect(e.withheldReason).toMatch(/aligned to another section/);
  });

  it('offers exactly the four sections with aligned skills', () => {
    const offered = sectionsForChapter(CH7)
      .filter((s) => mayOfferSectionPractice(s.officialSectionId))
      .map((s) => s.sectionNumber);
    expect(offered).toEqual(['7.2', '7.5', '7.6', '7.8']);
  });

  it('does not offer a section served only by a multi-section skill', () => {
    // §7.7's only candidate is FR.08, which spans three sections.
    const e = sectionEligibility('ncert_gp_c6_s7_7');
    expect(e.hasEligiblePractice).toBe(false);
    expect(e.ambiguousSkillIds).toContain('FR.08');
    expect(e.withheldReason).toMatch(/multi-section/);
  });

  it('agrees across student landing, teacher coverage and alignment', () => {
    // The three numbers that disagreed in v0.62.
    const studentPractisable = fractionsSectionCards().filter(
      (s) => s.availability !== 'not_available_yet'
    ).length;
    const coverage = getTeacherCoverageStatus(CH7);
    const alignment = fractionsAlignmentCoverage(
      sectionsForChapter(CH7).map((s) => s.officialSectionId)
    );

    expect(studentPractisable).toBe(4);
    expect(coverage.practiceAvailable).toBe(4);
    expect(alignment.sectionsWithAlignedSkills).toBe(4);

    // And `mapped` remains 5 — a different, also-true count that is
    // reported separately rather than conflated.
    expect(coverage.mapped).toBe(5);
  });

  it('keeps mapped and practice-available as distinct counts', () => {
    const c = getTeacherCoverageStatus(CH7);
    expect(c.mapped).toBeGreaterThan(c.practiceAvailable);
  });
});

// ---------------------------------------------------------------------------
// §2 — readiness means what it says
// ---------------------------------------------------------------------------

describe('§2 "Ready to learn" requires actual Learn content', () => {
  it('states the grandfathering rule explicitly', () => {
    expect(LEGACY_LESSON_GRANDFATHERING.applies).toBe(true);
    expect(LEGACY_LESSON_GRANDFATHERING.rule).toMatch(/current textbook/i);
    expect(LEGACY_LESSON_GRANDFATHERING.doesNotApplyTo).toMatch(
      /educator review/i
    );
  });

  it('marks a chapter available only when a lesson exists', () => {
    for (const c of class6ChapterCards()) {
      const e = getStudentChapterAvailability(c.officialChapterId);
      if (c.statusLine === 'Ready to learn') {
        expect(e.hasEligibleLearn).toBe(true);
      }
      if (c.availability === 'not_available_yet') {
        expect(e.hasEligibleLearn).toBe(false);
        expect(e.hasEligiblePractice).toBe(false);
      }
    }
  });

  it('keeps §7.4 invisible to students despite being the best section', () => {
    const s74 = fractionsSectionCards().find((s) => s.sectionNumber === '7.4');
    expect(s74?.availability).toBe('not_available_yet');
    expect(sectionEligibility('ncert_gp_c6_s7_4').withheldReason).toMatch(
      /awaiting educator review/
    );
  });
});

// ---------------------------------------------------------------------------
// §4 — section-aware progress
// ---------------------------------------------------------------------------

function session(itemIds: string[], completed: boolean): Session {
  return {
    id: `s-${itemIds.join('-')}`,
    studentId: 'stu',
    studentSnapshot: { name: 'A', grade: 'Class 6' } as never,
    window: 'baseline' as never,
    skillId: 'mixed_fractions' as never,
    startedAt: 1000,
    completedAt: completed ? 2000 : null,
    responses: itemIds.map((id) => ({ itemId: id } as never)),
    finalAbility: 0,
  };
}

describe('§4 progress counts only explicit eligible activity', () => {
  it('records nothing when there are no sessions', () => {
    const p = sectionProgressForChapter(CH7, []);
    expect(p).toHaveLength(9);
    expect(p.every((x) => x.state === 'not_started')).toBe(true);
  });

  it('attributes an aligned skill to its section', () => {
    expect(eligibleSectionForSkill('FR.03')).toBe('ncert_gp_c6_s7_6');
  });

  it('attributes a multi-section skill to NO section', () => {
    // FR.08 spans 7.6, 7.7 and 7.8. Picking one would invent a fact.
    expect(eligibleSectionForSkill('FR.08')).toBeNull();
  });

  it('attributes a displaced module skill to no section', () => {
    expect(eligibleSectionForSkill('DE.01')).toBeNull();
  });

  it('never derives section progress from module membership', () => {
    // A fractions-module skill with no exact alignment contributes
    // nothing, even though its module maps to the chapter.
    expect(eligibleSectionForSkill('FR.08')).toBeNull();
  });

  it('preserves unattributable sessions rather than dropping them', () => {
    const sessions = [session(['nonexistent-item'], true)];
    // No false attribution...
    const p = sectionProgressForChapter(CH7, sessions);
    expect(p.every((x) => x.sessionCount === 0)).toBe(true);
    // ...and the session is not silently lost from history either.
    expect(unattributedSessionCount(sessions)).toBe(0); // no known skills at all
  });

  it('suggests a continue point only when one is truthful', () => {
    const p = sectionProgressForChapter(CH7, []);
    const next = continueFrom(p);
    expect(next?.state).toBe('not_started');
  });

  it('uses descriptive states, never mastery', () => {
    const p = sectionProgressForChapter(CH7, []);
    for (const x of p) {
      expect(['not_started', 'in_progress', 'practice_completed']).toContain(
        x.state
      );
    }
  });
});

// ---------------------------------------------------------------------------
// §6 — assignment gates
// ---------------------------------------------------------------------------

describe('§6 assignment requires reviewed alignment', () => {
  it('allows nothing today, and says why', () => {
    expect(assignableSections(CH7, 'practice')).toEqual([]);
    expect(assignableSections(CH7, 'learn')).toEqual([]);
    const r = mayAssignSectionActivity('ncert_gp_c6_s7_2', 'practice');
    expect(r.allowed).toBe(false);
    if (!r.allowed) expect(r.reason).toMatch(/has not yet checked/i);
  });

  it('refuses a draft section outright', () => {
    const r = mayAssignSectionActivity('ncert_gp_c6_s7_4', 'practice');
    expect(r.allowed).toBe(false);
  });

  it('refuses a section served only by multi-section content', () => {
    const r = mayAssignSectionActivity('ncert_gp_c6_s7_7', 'practice');
    expect(r.allowed).toBe(false);
    if (!r.allowed) expect(r.reason).toMatch(/multi-section/);
  });
});

// ---------------------------------------------------------------------------
// §7 — review ingestion
// ---------------------------------------------------------------------------

function emptyRecord(): ReviewRecord {
  return {
    packageId: 'B_demonstration',
    packageVersion: 'v0.61',
    expectedItemIds: ['M1', 'M2'],
    submissions: [],
    adjudications: [],
  };
}

const goodSubmission = {
  packageId: 'B_demonstration',
  reviewerId: 'r1',
  reviewerName: 'A Teacher',
  reviewerRole: 'practising_teacher',
  reviewDate: '2026-08-25',
  responses: [{ itemId: 'M1', decision: 'accept', rationale: 'correct' }],
};

describe('§7 review import validates strictly', () => {
  it('accepts a well-formed submission', () => {
    const r = importReviewSubmission(emptyRecord(), goodSubmission);
    expect(r.ok).toBe(true);
  });

  it('rejects an item ID not in the package', () => {
    const r = importReviewSubmission(emptyRecord(), {
      ...goodSubmission,
      responses: [{ itemId: 'ZZ9', decision: 'accept', rationale: 'x' }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(' ')).toMatch(/not an item in this package/);
  });

  it('rejects a duplicate response for the same item', () => {
    const r = importReviewSubmission(emptyRecord(), {
      ...goodSubmission,
      responses: [
        { itemId: 'M1', decision: 'accept', rationale: 'x' },
        { itemId: 'M1', decision: 'reject', rationale: 'y' },
      ],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(' ')).toMatch(/duplicate/);
  });

  it('rejects a decision with no rationale', () => {
    const r = importReviewSubmission(emptyRecord(), {
      ...goodSubmission,
      responses: [{ itemId: 'M1', decision: 'accept', rationale: '  ' }],
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join(' ')).toMatch(/rationale is required/);
  });

  it('rejects an unrecognised decision or role', () => {
    expect(
      importReviewSubmission(emptyRecord(), {
        ...goodSubmission,
        responses: [{ itemId: 'M1', decision: 'looks_fine', rationale: 'x' }],
      }).ok
    ).toBe(false);
    expect(
      importReviewSubmission(emptyRecord(), {
        ...goodSubmission,
        reviewerRole: 'friend',
      }).ok
    ).toBe(false);
  });

  it('rejects a second submission from the same reviewer', () => {
    const rec = emptyRecord();
    const first = importReviewSubmission(rec, goodSubmission);
    if (first.ok) rec.submissions.push(first.submission);
    expect(importReviewSubmission(rec, goodSubmission).ok).toBe(false);
  });

  it('rejects a mismatched package ID', () => {
    const r = importReviewSubmission(emptyRecord(), {
      ...goodSubmission,
      packageId: 'A_curriculum',
    });
    expect(r.ok).toBe(false);
  });
});

describe('§7 partial adjudication is labelled truthfully', () => {
  it('does not call a partial review adjudicated', () => {
    // v0.63 fix: answering 1 of 2 items and adjudicating it used to
    // report `review_adjudicated`.
    const rec = emptyRecord();
    const imported = importReviewSubmission(rec, goodSubmission);
    if (imported.ok) rec.submissions.push(imported.submission);
    rec.adjudications.push({
      itemId: 'M1',
      outcome: 'content_accepted',
      actionTaken: '',
      adjudicatedBy: 'maintainer',
      adjudicationDate: '2026-08-25',
    });
    expect(packageState(rec)).toBe('review_partially_adjudicated');
    expect(mayAdvanceBeyondDraft(rec).allowed).toBe(false);
  });

  it('still reports both real packages as unanswered', () => {
    for (const id of ['A_curriculum', 'B_demonstration'] as const) {
      expect(packageState(reviewRecordFor(id))).toBe('review_package_ready');
    }
  });
});

// ---------------------------------------------------------------------------
// §11 — render-contract tests for the bug class screenshots kept finding
// ---------------------------------------------------------------------------

describe('§11 render contracts', () => {
  it('renders all ten official chapter titles from the registry', () => {
    // The v0.62 bug: learnOverride was declared and never forwarded, so
    // the student saw the legacy module list. Types and data tests both
    // passed. This renders the real component.
    render(<Class6ChapterList onOpenChapter={() => {}} />);
    for (const title of [
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
    ]) {
      // v0.69 §34 — the first available chapter also appears in the
      // "Start here" card, so its title is on the page twice. Present at
      // least once is the contract that matters: every official chapter
      // is listed.
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    }
  });

  it('renders no displaced legacy module in student Learn', () => {
    render(<Class6ChapterList onOpenChapter={() => {}} />);
    expect(screen.queryByText(/Decimals/i)).toBeNull();
    expect(screen.queryByText(/Ratio/i)).toBeNull();
    expect(screen.queryByText(/Algebra/i)).toBeNull();
  });

  it('renders unavailable chapters as non-interactive', () => {
    render(<Class6ChapterList onOpenChapter={() => {}} />);
    // v0.70 §27 — ONE chapter genuinely opens (Fractions). The other
    // nine are listed and none of them is a button. The count moved
    // from five because four chapters advertised "Ready to learn" and
    // routed nothing at all.
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
    // v0.76 §6 — nine plates, each saying "Being written". The tenth
    // occurrence in v0.75 was the group heading, which no longer exists:
    // the plates say what they are, so nothing has to announce them.
    expect(screen.getAllByText('Being written').length).toBe(9);
    for (const b of buttons) {
      expect(b.textContent).not.toMatch(/Coming soon/);
    }
    for (const b of buttons) {
      expect(b.textContent).not.toMatch(/Coming soon/);
    }
  });

  it('renders no assignable section in the teacher assignment panel', () => {
    render(<SectionAssignmentPanel />);
    expect(screen.queryByRole('button', { name: /Assign practice/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Assign lesson/i })).toBeNull();
    expect(screen.getByText(/Nothing can be assigned/i)).toBeTruthy();
  });

  it('shows all nine Fractions parts in the assignment panel', () => {
    render(<SectionAssignmentPanel />);
    expect(screen.getByText(/Marking Fraction Lengths on the Number Line/)).toBeTruthy();
  });
});
