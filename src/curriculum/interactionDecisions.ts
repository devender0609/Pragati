// v0.68 §5/§6 — INTERACTION DECISIONS, SECTION BY SECTION.
//
// THE QUESTION §5 REQUIRES
//
// Not "does this section have an interaction?" but:
//
//   Does an interactive response provide educational evidence that
//   static guided/independent practice cannot?
//
// Counts are NOT to be evened out. A section with no interaction
// because none would evidence anything is in better shape than a
// section with one added to balance a table.
//
// WHAT CHANGED IN v0.68
//
// Four sections gained an interaction (§7.1, §7.2, §7.3, §7.5) because
// each answered YES for a specific reason recorded below. §7.9 stays
// non-interactive, and so does nothing else — the two remaining
// no-interaction sections do not exist, because every other section
// already had one.
//
// One new format was added (§6): `area_model_selection`. Two candidate
// formats were REJECTED and the reasons are recorded, because a
// rejected option with no recorded reason gets re-proposed forever.

export type InteractionDecision = 'added' | 'already_present' | 'intentionally_none';

export type SectionInteractionDecision = {
  officialSectionId: string;
  sectionNumber: string;
  decision: InteractionDecision;
  /** What an interaction evidences here that static practice cannot —
   *  or, for `intentionally_none`, why nothing does. */
  rationale: string;
  formats: string[];
  itemIds: string[];
};

const S = (n: string) => `ncert_gp_c6_s7_${n}`;

export const INTERACTION_DECISIONS: SectionInteractionDecision[] = [
  {
    officialSectionId: S('1'),
    sectionNumber: '7.1',
    decision: 'added',
    rationale:
      'Guided item s71.g3 asks whether three unequal ribbon pieces are thirds and accepts the word "No". A student can answer "No" having learnt only that ribbon questions are trick questions. Selecting the correctly partitioned region from three candidates — one unequally divided, one equal but wrongly counted — requires reading the partition itself.',
    formats: ['area_model_selection'],
    itemIds: ['s71.p1'],
  },
  {
    officialSectionId: S('2'),
    sectionNumber: '7.2',
    decision: 'added',
    rationale:
      'Every static item runs diagram-to-fraction. Running it fraction-to-diagram fails differently: a student who has memorised "top number, count the shaded" as a procedure cannot apply it in reverse without the meaning. Nothing already in the section tests that direction.',
    formats: ['area_model_selection'],
    itemIds: ['s72.p1'],
  },
  {
    officialSectionId: S('3'),
    sectionNumber: '7.3',
    decision: 'added',
    rationale:
      'The static items convert the phrase "5 quarter-units" into 5/4, which is arithmetic performed on words. Picking the strip whose shading actually reaches the stated length makes the student read a quantity off a picture, which is what measuring is. Deliberately a strip and not a number line: the line belongs to §7.4 and using it here would teach the chapter out of order.',
    formats: ['fraction_strip_selection'],
    itemIds: ['s73.p1'],
  },
  {
    officialSectionId: S('4'),
    sectionNumber: '7.4',
    decision: 'already_present',
    rationale:
      'Six items. The competency is literally about placing a fraction on a line, and a list of fraction names cannot assess placement. Unchanged in v0.68 — this content is the frozen review candidate.',
    formats: [
      'select_point_on_number_line',
      'numeric_entry',
      'multiple_choice',
      'fraction_strip_selection',
    ],
    itemIds: ['s74.p1', 's74.p2', 's74.p3', 's74.p4', 's74.p5', 's74.p6'],
  },
  {
    officialSectionId: S('5'),
    sectionNumber: '7.5',
    decision: 'added',
    rationale:
      'The chapter documented mixed_number_is_multiplication and never tested for it anywhere. Free numeric entry does: a student who types 6/4 for 2¾ has PRODUCED the multiplication rather than recognised it among options, and 6/4 is reachable by no other route. A second item places 7/4 on a line, which is the "same point, two names" claim the section rests on.',
    formats: ['numeric_entry', 'select_point_on_number_line'],
    itemIds: ['s75.p1', 's75.p2'],
  },
  {
    officialSectionId: S('6'),
    sectionNumber: '7.6',
    decision: 'already_present',
    rationale:
      'Three items. Equivalence is a judgement about relative size, and a text list lets a student guess without ever looking at the quantities.',
    formats: ['fraction_strip_selection', 'numeric_entry', 'multiple_choice'],
    itemIds: ['s76.p1', 's76.p2', 's76.p3'],
  },
  {
    officialSectionId: S('7'),
    sectionNumber: '7.7',
    decision: 'already_present',
    rationale:
      'Three items, including the same-numerator case where the bigger-denominator error is most visible.',
    formats: ['multiple_choice', 'fraction_strip_selection', 'numeric_entry'],
    itemIds: ['s77.p1', 's77.p2', 's77.p3'],
  },
  {
    officialSectionId: S('8'),
    sectionNumber: '7.8',
    decision: 'already_present',
    rationale:
      'Four items. 1/4 + 1/4 is the diagnostic case: the wrong method yields 2/8, which equals one of the addends, so the student can see for themselves that it cannot be right.',
    formats: ['numeric_entry', 'multiple_choice', 'select_point_on_number_line'],
    itemIds: ['s78.p1', 's78.p2', 's78.p3', 's78.p4'],
  },
  {
    officialSectionId: S('9'),
    sectionNumber: '7.9',
    decision: 'intentionally_none',
    rationale:
      'The learning here is discussion: that notation was invented by people solving problems, and could have been otherwise. A multiple-choice quiz on names and dates would assess recall of facts the section does not ask anyone to memorise, and would misrepresent what it teaches. The reasoning task (discovered vs invented) is the right instrument and already exists.',
    formats: [],
    itemIds: [],
  },
];

/** §6 — formats considered and turned down, with the reason. */
export const REJECTED_INTERACTION_FORMATS = [
  {
    format: 'mixed_fraction_match',
    consideredFor: '§7.5',
    reason:
      'Free numeric entry diagnoses the target misconception BETTER. A student who types 6/4 has produced the multiplication error; a student who drags 2¾ onto 6/4 has recognised it among options offered to them. Recognition is weaker evidence than production, so the new format would have measured less while costing more.',
  },
  {
    format: 'equivalence_selection',
    consideredFor: '§7.6',
    reason:
      'Strip selection already asks exactly this question — pick the strip equal to the target — and does it with a format the student has already met. A second format for the same evidence is interface churn.',
  },
  {
    format: 'comparison_selection',
    consideredFor: '§7.7',
    reason:
      'Multiple choice with reasoned options already carries the diagnosis, because the option states WHY the student picked it. A bare "which is larger" tap would evidence less, not more.',
  },
  {
    format: 'drag_and_drop_ordering',
    consideredFor: 'chapter-wide',
    reason:
      'It would demo well and evidence nothing extra. Ordering three fractions can be assessed by entry or selection; building a general drag engine is the architecture-for-its-own-sake §6 forbids.',
  },
] as const;

export function decisionFor(
  officialSectionId: string
): SectionInteractionDecision | null {
  return (
    INTERACTION_DECISIONS.find((d) => d.officialSectionId === officialSectionId) ??
    null
  );
}

export type InteractionDecisionIssue = {
  officialSectionId: string;
  detail: string;
};

/**
 * The recorded decision must match the chapter as authored.
 *
 * A section recorded `intentionally_none` that has items, or `added`
 * that has none, means the rationale is describing something that is no
 * longer true.
 */
export function checkInteractionDecisions(
  sections: Array<{
    source: { officialSectionId: string; sectionNumber: string };
    interactivePractice: Array<{ itemId: string; format: string }>;
  }>
): InteractionDecisionIssue[] {
  const issues: InteractionDecisionIssue[] = [];
  for (const s of sections) {
    const id = s.source.officialSectionId;
    const d = decisionFor(id);
    if (!d) {
      issues.push({ officialSectionId: id, detail: 'no interaction decision recorded' });
      continue;
    }
    const actual = s.interactivePractice.map((i) => i.itemId).sort();
    const recorded = [...d.itemIds].sort();
    if (JSON.stringify(actual) !== JSON.stringify(recorded)) {
      issues.push({
        officialSectionId: id,
        detail: `recorded items [${recorded.join(', ')}] but section has [${actual.join(', ')}]`,
      });
    }
    if (d.decision === 'intentionally_none' && actual.length > 0) {
      issues.push({
        officialSectionId: id,
        detail: 'recorded as intentionally non-interactive but has interactive items',
      });
    }
    if (d.decision !== 'intentionally_none' && actual.length === 0) {
      issues.push({
        officialSectionId: id,
        detail: `recorded as '${d.decision}' but has no interactive items`,
      });
    }
  }
  return issues;
}
