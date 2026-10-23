// v0.62 §5 — LEGACY MODULE DISPOSITION.
//
// THE PROBLEM
//
// `decimals`, `ratio_proportion` and `algebra` (150 items) are shown to
// Class 6 students as Class 6 curriculum. The primary sources say
// otherwise: none appears in Ganita Prakash Grade 6, and all three have
// named chapters at Grade 7 or Grade 8.
//
// WHAT THIS FILE DOES AND DOES NOT DO
//
// It removes them from the Class 6 CORE pathway. It does not delete
// them, re-level them, change their grade IDs, or touch their items.
// Disposition is an educator decision that has not been made
// (Review Package A, items D1-D6), and acting on the evidence by
// deleting content would be exactly the overreach v0.61 warned about.
//
// The honest interim position: content whose placement is contested is
// not presented to a child as their curriculum. Hiding is reversible;
// teaching a child from the wrong grade's material is not.

export type LegacyDisposition =
  /** Evidence points to another grade; awaiting educator adjudication. */
  | 'legacy_pending_relevel'
  /** Evidence points to another grade AND the pedagogic approach
   *  differs, so moving alone would not fix it. */
  | 'legacy_pending_rewrite'
  /** Could be offered as optional extra practice — but only once a
   *  reviewer approves that presentation. */
  | 'supplementary_pending_review'
  /** Verified as belonging where it sits. */
  | 'core_verified';

export type LegacyModuleRecord = {
  moduleId: string;
  currentGradeId: string;
  disposition: LegacyDisposition;
  /** Where the primary sources place it. Null when unresolved. */
  evidencedHome: string | null;
  evidence: string;
  /** Review Package A item that will settle it. */
  awaitingReviewItem: string;
  itemCount: number;
};

export const LEGACY_MODULE_DISPOSITIONS: LegacyModuleRecord[] = [
  {
    moduleId: 'decimals',
    currentGradeId: 'class6',
    disposition: 'legacy_pending_relevel',
    evidencedHome: 'Ganita Prakash Grade 7, Chapter 3 "A Peek Beyond the Point"',
    evidence:
      'Zero occurrences of "decimal" across all ten Grade 6 chapters. Grade 7 Ch 3 is a full decimals chapter; DE.01/DE.03/DE.04 map to §3.4, §3.6, §3.7.',
    awaitingReviewItem: 'D1',
    itemCount: 50,
  },
  {
    moduleId: 'ratio_proportion',
    currentGradeId: 'class6',
    disposition: 'legacy_pending_relevel',
    evidencedHome:
      'Ganita Prakash Grade 8, Chapter 7 "Proportional Reasoning-1"',
    evidence:
      'Grade 6 has ratio only as historical prose in §7.9. Grade 7 has no ratio chapter. Grade 8 Ch 7 has 175 occurrences; RP.01/RP.02/RP.03/RP.05 map to §7.2, §7.3, §7.4.',
    awaitingReviewItem: 'D2',
    itemCount: 50,
  },
  {
    moduleId: 'algebra',
    currentGradeId: 'class6',
    // Not merely relevel: the textbook introduces "letter-numbers"
    // before formal variable vocabulary, so items using "variable" from
    // the first line are wrongly WORDED, not merely wrongly graded.
    disposition: 'legacy_pending_rewrite',
    evidencedHome: 'Ganita Prakash Grade 7, Chapter 4 "Using Letter-Numbers"',
    evidence:
      'Zero "variable" occurrences in Grade 6. Grade 7 Ch 2 covers arithmetic expressions and Ch 4 introduces letter-numbers before formal terminology. Pragati AL.01-AL.05 use formal vocabulary from the start.',
    awaitingReviewItem: 'D3',
    itemCount: 50,
  },
];

const BY_ID = new Map(LEGACY_MODULE_DISPOSITIONS.map((r) => [r.moduleId, r]));

export function dispositionFor(moduleId: string): LegacyModuleRecord | null {
  return BY_ID.get(moduleId) ?? null;
}

/**
 * May this module appear in the Class 6 CORE learning pathway?
 *
 * Only `core_verified` qualifies. Everything under review is excluded —
 * including `supplementary_pending_review`, because "pending review" is
 * not "approved as supplementary". That distinction is the whole point:
 * a plausible-sounding interim presentation is still a claim about the
 * curriculum, and it has not been checked.
 */
export function isClass6Core(moduleId: string): boolean {
  const d = BY_ID.get(moduleId);
  return d === undefined ? true : d.disposition === 'core_verified';
}

/** Modules currently withheld from the Class 6 core pathway. */
export function withheldFromClass6Core(): LegacyModuleRecord[] {
  return LEGACY_MODULE_DISPOSITIONS.filter(
    (r) => r.currentGradeId === 'class6' && r.disposition !== 'core_verified'
  );
}

export function withheldItemCount(): number {
  return withheldFromClass6Core().reduce((n, r) => n + r.itemCount, 0);
}
