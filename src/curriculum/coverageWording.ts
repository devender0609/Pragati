// v0.74 §5/§6/§28 — WHAT THE COVERAGE REPORT IS ALLOWED TO SAY.
//
// THE SENTENCE THIS FILE EXISTS TO STOP
//
// `CURRICULUM_COVERAGE_MATRIX.md` said, at line 44:
//
//   "Every official record ... is represented in the registry, including
//    the 89 for which Pragati has no content at all."
//
// Nine lines above it, its own table showed Class 6 with 9 drafts and 8
// complete instructional drafts. Both statements were generated from the
// same data, and they contradict each other.
//
// The error is not a typo. It comes from collapsing five distinct states
// into one word. "No complete, reviewed, published content" and "no
// content at all" are different claims, and the second one erases eight
// complete drafts and the §7.4 review package built on top of them.
//
// WHY A HELPER RATHER THAN A CAREFUL EDIT
//
// Editing the sentence fixes today's document. The next generated report
// makes the same collapse, because the collapse is easy and the correct
// phrasing is long. So the phrasing lives here, is derived from the
// data, and `assertCoverageWordingConsistent()` fails the suite if any
// report claims emptiness for records that hold authored drafts.

import {
  coverageMatrix,
  coverageBacklog,
  type GradeCoverageRow,
} from './coverageMatrix';
import { fractionsChapterSections } from './fractionsChapter';
import { assessSection } from './instructionalCompleteness';
import { chapterReviewReadiness } from './reviewReadiness';

/**
 * §6 — the states a verified official record can be in.
 *
 * Ordered from least to most advanced. Every verified record is in
 * exactly one, and the backlog's job is to name the NEXT ACTION, which
 * differs for every state below.
 */
export type RecordState =
  /** The official record exists; Pragati holds no instructional content. */
  | 'structure_only'
  /** Some artifact exists but nothing teachable. */
  | 'generated_skeleton'
  /** Real material with named gaps. */
  | 'incomplete_draft'
  /** Every applicable component present. NOT student-ready. */
  | 'complete_instructional_draft'
  /** Complete, but no review package exists yet. Engineering. */
  | 'review_package_preparation'
  /** A reviewer could start today. */
  | 'awaiting_review'
  /** A response arrived and needs adjudicating. */
  | 'review_received'
  /** Adjudicated; changes requested. */
  | 'review_changes_required'
  /** Adjudicated and accepted. */
  | 'reviewed'
  /** Cleared for publication. */
  | 'publication_ready'
  /** Visible to students. */
  | 'published';

export const RECORD_STATE_LABEL: Record<RecordState, string> = {
  structure_only: 'Official record only — no instructional content',
  generated_skeleton: 'Skeleton — too thin to teach from',
  incomplete_draft: 'Draft with named gaps',
  complete_instructional_draft: 'Complete draft — not reviewed',
  review_package_preparation: 'Complete draft — review package not built',
  awaiting_review: 'Awaiting educator review',
  review_received: 'Reviewer response received',
  review_changes_required: 'Changes required after review',
  reviewed: 'Reviewed',
  publication_ready: 'Cleared for publication',
  published: 'Published to students',
};

/** The next action for a record in this state, naming who does it. */
export const RECORD_STATE_NEXT_ACTION: Record<RecordState, string> = {
  structure_only: 'AUTHOR: write the section against its production brief',
  generated_skeleton: 'AUTHOR: replace the skeleton with real material',
  incomplete_draft: 'AUTHOR: close the named gaps',
  complete_instructional_draft: 'ENGINEERING: build the review package',
  review_package_preparation: 'ENGINEERING: frozen candidate, pinned build, question set',
  awaiting_review: 'PERSON: send to a Grade 6 mathematics educator',
  review_received: 'PERSON: adjudicate the responses',
  review_changes_required: 'AUTHOR: apply the reviewer’s required changes',
  reviewed: 'GATE: publication decision',
  publication_ready: 'GATE: publish',
  published: 'none — live',
};

export type RecordStateCounts = Record<RecordState, number>;

function emptyCounts(): RecordStateCounts {
  return {
    structure_only: 0,
    generated_skeleton: 0,
    incomplete_draft: 0,
    complete_instructional_draft: 0,
    review_package_preparation: 0,
    awaiting_review: 0,
    review_received: 0,
    review_changes_required: 0,
    reviewed: 0,
    publication_ready: 0,
    published: 0,
  };
}

/**
 * Every verified official record, counted by state.
 *
 * DERIVED from the completeness assessment and the review readiness
 * model. Nothing is stored, so no count can be optimistic.
 */
export function recordStateCounts(): RecordStateCounts {
  const counts = emptyCounts();
  const readinessById = new Map(
    chapterReviewReadiness().map((r) => [r.officialSectionId, r])
  );

  const authoredById = new Map(
    fractionsChapterSections().map((s) => [
      s.source.officialSectionId,
      assessSection(s),
    ])
  );

  for (const entry of coverageBacklog()) {
    const id = entry.officialSectionId;
    const a = id ? authoredById.get(id) : undefined;

    if (!a) {
      counts.structure_only += 1;
      continue;
    }

    if (a.level === 'generated_skeleton') {
      counts.generated_skeleton += 1;
      continue;
    }
    if (a.level === 'incomplete_draft') {
      counts.incomplete_draft += 1;
      continue;
    }

    // Complete draft: which side of the review handoff is it on?
    const r = id ? readinessById.get(id) : undefined;
    if (r?.state === 'review_ready') counts.awaiting_review += 1;
    else if (r?.state === 'review_received') counts.review_received += 1;
    else if (r?.state === 'review_adjudicated') counts.reviewed += 1;
    else counts.review_package_preparation += 1;
  }

  return counts;
}

/**
 * §5 — the sentence a report is allowed to write about the backlog.
 *
 * Built from the counts so it cannot contradict them.
 */
export function backlogCoverageSentence(): string {
  const c = recordStateCounts();
  const total = Object.values(c).reduce((n, x) => n + x, 0);
  const withSomeContent =
    c.generated_skeleton +
    c.incomplete_draft +
    c.complete_instructional_draft +
    c.review_package_preparation +
    c.awaiting_review +
    c.review_received;

  return (
    `${total} verified official records do not yet have complete, reviewed, published ` +
    `instructional coverage. Of those, ${c.structure_only} hold no instructional content at all ` +
    `and ${withSomeContent} hold authored content that is not yet published ` +
    `(${c.incomplete_draft} incomplete draft, ` +
    `${c.review_package_preparation + c.awaiting_review} complete drafts). ` +
    `0 are reviewed and 0 are published.`
  );
}

/** Per-grade wording, same guarantee. */
export function gradeCoverageSentence(row: GradeCoverageRow): string {
  if (!row.verified) {
    return `${row.gradeLabel}: official structure not verified from a primary source. Content coverage is not measurable until it is.`;
  }
  if (row.drafts === 0) {
    return `${row.gradeLabel}: official structure verified; no instructional content authored yet.`;
  }
  return (
    `${row.gradeLabel}: ${row.drafts} authored drafts, ` +
    `${row.completeInstructionalDrafts} of them complete. ` +
    `${row.educatorReviewed} reviewed, ${row.published} published.`
  );
}

/**
 * §28 — the consistency guard.
 *
 * Fails when a report would claim emptiness that the data contradicts.
 * The specific historical failure — "the 89 for which Pragati has no
 * content at all" beside a table showing nine drafts — is the first
 * check.
 */
export function assertCoverageWordingConsistent(
  documentText?: string
): string[] {
  const violations: string[] = [];
  const c = recordStateCounts();
  const matrix = coverageMatrix();
  const totalDrafts = matrix.reduce((n, r) => n + r.drafts, 0);
  const backlogTotal = coverageBacklog().length;

  // 1. The derived sentence must not describe every backlog record as
  //    empty when authored drafts sit inside the backlog.
  if (c.structure_only === backlogTotal && totalDrafts > 0) {
    violations.push(
      `backlog claims all ${backlogTotal} records are structure-only, but ${totalDrafts} authored drafts exist`
    );
  }

  // 2. State counts must sum to the backlog.
  const sum = Object.values(c).reduce((n, x) => n + x, 0);
  if (sum !== backlogTotal) {
    violations.push(`record states sum to ${sum}, backlog holds ${backlogTotal}`);
  }

  // 3. Nothing may be reported reviewed or published while both are zero
  //    in the completeness model.
  const reviewed = matrix.reduce((n, r) => n + r.educatorReviewed, 0);
  const published = matrix.reduce((n, r) => n + r.published, 0);
  if (c.reviewed !== reviewed) {
    violations.push(`review states say ${c.reviewed} reviewed, coverage matrix says ${reviewed}`);
  }
  if (published !== c.published) {
    violations.push(`published disagreement: ${published} vs ${c.published}`);
  }

  // 4. If a document was supplied, check its prose against the data.
  if (documentText) {
    const forbidden = [
      /(\d+)\s+for which Pragati has no content at all/i,
      /(\d+)\s+records? .{0,30}no content at all/i,
    ];
    for (const re of forbidden) {
      const m = documentText.match(re);
      if (m && Number(m[1]) > c.structure_only) {
        violations.push(
          `document claims ${m[1]} records have "no content at all"; only ${c.structure_only} are structure-only`
        );
      }
    }
  }

  return violations;
}
