// v0.71 §14 — THE PEDAGOGY AUDIT.
//
// Deferred in v0.69 and again in v0.70, both times honestly reported and
// both times not done. This is it.
//
// WHAT THIS AUDIT ASKS
//
// Not "is the mathematics correct?" — three hand audits have asked that
// and the answers are in `contentAuditLog.ts`. This asks a different
// question, which no automated check and no correctness audit reaches:
//
//   Is the material SEQUENCED so that a student learns from it?
//
// Five things were looked for in every section:
//   1. prose that a visual would carry better
//   2. a concept that runs on with no chance to check understanding
//   3. a worked example doing two jobs at once
//   4. practice arriving too late to consolidate
//   5. feedback so general it teaches nothing
//
// WHAT WAS DELIBERATELY NOT DONE
//
// No content was added. §14 is explicit — "do not add volume" — and the
// temptation in a pedagogy audit is always to write another example. Two
// findings below are acted on by MOVING existing material; the rest are
// recorded as findings for the educator review, because acting on them
// means authoring, and authoring unreviewed content to fix unreviewed
// content is how a chapter grows without getting better.

export type PedagogyFindingKind =
  | 'prose_could_be_visual'
  | 'no_check_after_concept'
  | 'example_does_two_jobs'
  | 'practice_arrives_late'
  | 'feedback_too_generic';

export type PedagogyDisposition =
  /** Fixed in this release, by moving or restaging existing material. */
  | 'addressed_by_presentation'
  /** Real, and fixing it means authoring. Left for educator review. */
  | 'recorded_for_review'
  /** Looked at and judged not a problem, with the reason stated. */
  | 'considered_and_kept';

export type PedagogyFinding = {
  sectionNumber: string;
  kind: PedagogyFindingKind;
  finding: string;
  disposition: PedagogyDisposition;
  action: string;
};

export const PEDAGOGY_FINDINGS: PedagogyFinding[] = [
  // --- Acted on, chapter-wide, by restaging rather than authoring ----
  {
    sectionNumber: 'all',
    kind: 'no_check_after_concept',
    finding:
      'Every section rendered as one continuous page: explanation, visuals, three to five worked examples, common mistakes, guided practice, independent practice, reasoning and summary, all at once. The v0.70 route-verified capture of §7.4 was 8,703px tall at 390px. A student meets no boundary between "being told" and "having a go", and nothing marks where one idea ends.',
    disposition: 'addressed_by_presentation',
    action:
      'Restaged into five stages — Learn the idea / See it / Worked examples / Try it / Think deeper (§12). Each stage is one screen of related material, every stage stays reachable from the stage bar, and no content was changed.',
  },
  {
    sectionNumber: 'all',
    kind: 'practice_arrives_late',
    finding:
      'The common-mistakes list sat AFTER all worked examples and BEFORE practice — the one position where it helps least. Too late to shape how a student reads the examples, too early to answer a mistake they have actually made.',
    disposition: 'addressed_by_presentation',
    action:
      'Moved onto the "Learn the idea" stage, beside the idea the mistakes are about, so a student meets the trap before walking into it.',
  },

  // --- Recorded. Acting on these means authoring. -------------------
  {
    sectionNumber: '7.6',
    kind: 'prose_could_be_visual',
    finding:
      'Eight explanation paragraphs, the most in the chapter, and two of them (31 and 39 words) carry the whole equivalence argument in prose. The argument is fundamentally visual — one part cut into three — and the section has two visuals, neither of which shows the CUT happening.',
    disposition: 'recorded_for_review',
    action:
      'Not acted on. The fix is a new visual showing subdivision, which is authoring. Flagged as the chapter\'s strongest candidate for prose-to-visual replacement.',
  },
  {
    sectionNumber: '7.9',
    kind: 'prose_could_be_visual',
    finding:
      'Five paragraphs of 23-29 words each and ZERO visuals — the only section in the chapter with none. It is a history section, so this is defensible, but a timeline or an image of early fraction notation would carry it better than continuous prose.',
    disposition: 'recorded_for_review',
    action:
      'Not acted on. Adding a historical visual requires sourcing and rights, and is a decision for review rather than a presentation change.',
  },
  {
    sectionNumber: '7.8',
    kind: 'example_does_two_jobs',
    finding:
      'Five worked examples of three steps each. The unlike-denominator examples do two things in one: find a common denominator, then add. A student who can do the second and not the first cannot tell which half they failed.',
    disposition: 'recorded_for_review',
    action:
      'Not acted on. Splitting an example is authoring, and the split would need to preserve the audited mathematics exactly. Recorded as the strongest split candidate.',
  },
  {
    sectionNumber: '7.4',
    kind: 'example_does_two_jobs',
    finding:
      'Five worked examples, one of four steps. This is the FROZEN section and its content cannot change without a new artifact version.',
    disposition: 'considered_and_kept',
    action:
      'Not acted on, and not to be acted on before review. §7.4 is the review anchor; changing it would invalidate the package already prepared.',
  },
  {
    sectionNumber: '7.1',
    kind: 'no_check_after_concept',
    finding:
      'The section has one interactive item, at the end. Its central claim — that the parts must be EXACTLY equal — arrives in the explanation and is not checked until after three worked examples.',
    disposition: 'addressed_by_presentation',
    action:
      'Partly addressed: the "Learn the idea" stage now ends with the common-mistakes block, which names the unequal-parts trap directly. A true quick check inside the explanation would be a new item, and that is authoring.',
  },
  {
    sectionNumber: '7.9',
    kind: 'practice_arrives_late',
    finding:
      'Two guided and two independent items, the fewest in the chapter, and no interactive practice. Deliberate — §7.9 is discussion, and v0.68 recorded the reason — but it does mean a student finishes the chapter on its lightest section.',
    disposition: 'considered_and_kept',
    action:
      'Kept. v0.68 §5 recorded the pedagogical argument: a multiple-choice quiz on names and dates would assess recall of facts the section never asks anyone to memorise.',
  },
  {
    sectionNumber: 'all',
    kind: 'feedback_too_generic',
    finding:
      'Nine of eighteen incorrect options receive neutral corrective feedback rather than a diagnosis. Reviewed against §24 of v0.70 and this is CORRECT, not a defect: a diagnosis that cannot be justified is worse than none, and v0.70 withdrew one for exactly that reason.',
    disposition: 'considered_and_kept',
    action:
      'Kept. Whether any of the nine can be safely diagnosed is a question for an educator, not for another pass of self-review.',
  },
];

export function findingsForSection(sectionNumber: string): PedagogyFinding[] {
  return PEDAGOGY_FINDINGS.filter(
    (f) => f.sectionNumber === sectionNumber || f.sectionNumber === 'all'
  );
}

export type PedagogyAuditSummary = {
  total: number;
  addressed: number;
  recordedForReview: number;
  consideredAndKept: number;
  byKind: Record<PedagogyFindingKind, number>;
  /** Stated in the record so it cannot be quoted without it. */
  disclaimer: string;
};

export function pedagogyAuditSummary(): PedagogyAuditSummary {
  const byKind = {
    prose_could_be_visual: 0,
    no_check_after_concept: 0,
    example_does_two_jobs: 0,
    practice_arrives_late: 0,
    feedback_too_generic: 0,
  } as Record<PedagogyFindingKind, number>;
  for (const f of PEDAGOGY_FINDINGS) byKind[f.kind] += 1;

  return {
    total: PEDAGOGY_FINDINGS.length,
    addressed: PEDAGOGY_FINDINGS.filter(
      (f) => f.disposition === 'addressed_by_presentation'
    ).length,
    recordedForReview: PEDAGOGY_FINDINGS.filter(
      (f) => f.disposition === 'recorded_for_review'
    ).length,
    consideredAndKept: PEDAGOGY_FINDINGS.filter(
      (f) => f.disposition === 'considered_and_kept'
    ).length,
    byKind,
    disclaimer:
      'This is a self-audit of learning sequence by the same process that authored the content. ' +
      'It is not educator review and does not substitute for it. Three findings are recorded rather than ' +
      'acted on precisely because acting on them means authoring, and authoring unreviewed content to ' +
      'improve unreviewed content grows a chapter without making it better.',
  };
}
