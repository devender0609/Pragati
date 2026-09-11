// v0.68 §9/§10/§11 — THE MANUAL CONTENT AUDIT, RECORDED.
//
// WHAT THIS IS
//
// Every worked example, guided item, independent item and reasoning
// task in Chapter 7 was read by hand against the checklist in §9-§11 of
// the v0.68 specification: mathematics, exact answer, stated
// assumptions, same-whole conditions, terminology, circularity,
// misleading shortcuts, early concepts, and fit to the section
// objective.
//
// This file records the VERDICT for the ones that changed, and the
// counts for the ones that did not. It exists because "we audited it"
// is not a claim anyone can check, and because a reviewer deserves to
// see what was already found before spending their time re-finding it.
//
// WHAT `accepted_as_is` DOES AND DOES NOT MEAN
//
// It means: read, and no defect found against that checklist. It does
// NOT mean good, well-pitched, or approved. The mathematics being
// correct is the floor, not the ceiling, and no educator has read any
// of this. v0.67 audited by hand and found two errors; v0.68 audited by
// hand and found seven more, which is the honest reason to expect a
// real reviewer to find further ones.

export type AuditVerdict =
  | 'accepted_as_is'
  | 'revised'
  | 'removed'
  | 'needs_human_review';

export type AuditedArtefact =
  | 'worked_example'
  | 'guided_item'
  | 'independent_item'
  | 'reasoning_task'
  | 'interactive_item'
  | 'distractor'
  | 'explanation';

export type ContentAuditEntry = {
  id: string;
  officialSectionId: string;
  sectionNumber: string;
  artefact: AuditedArtefact;
  verdict: AuditVerdict;
  /** The defect, in terms a reviewer can disagree with. */
  finding: string;
  /** What was done about it. */
  action: string;
  /** Which specification clause required the look. */
  clause: string;
};

const S = (n: string) => `ncert_gp_c6_s7_${n}`;

/**
 * Findings from the v0.68 hand audit. Only CHANGED artefacts appear;
 * `contentAuditCounts()` derives the accepted-as-is totals from the
 * live chapter so the two can never disagree.
 */
export const V068_CONTENT_AUDIT: ContentAuditEntry[] = [
  {
    id: 's71.we1',
    officialSectionId: S('1'),
    sectionNumber: '7.1',
    artefact: 'worked_example',
    verdict: 'revised',
    finding:
      'Premise was "Three guavas together weigh 1 kg. They are about the same size", then divided by three to get exactly 1/3 kg each. Similar size does not give equal weight. §7.1 exists to establish that parts must be EXACTLY equal, so the example contradicted the section it belongs to — and taught that an eyeballed resemblance licenses an exact fractional model.',
    action:
      'Premise replaced with a stated equal division: one kilogram of guavas divided equally into 3 bags. The answer drops the hedging "about".',
    clause: '§9 (approximation and real-world quantities)',
  },
  {
    id: 's72.we3',
    officialSectionId: S('2'),
    sectionNumber: '7.2',
    artefact: 'worked_example',
    verdict: 'revised',
    finding:
      'Asked whether 3 of 4 sectors of a circle is "the same amount as" 3 of 4 parts of a rectangle. If the two shapes differ in size the answer is no. The stored answer covered itself with "of their own whole" while the prompt still said "the same amount" — the same-whole condition was dodged rather than taught.',
    action:
      'Prompt now asks what fraction each shows. A fourth step states explicitly that this does not make the two coloured amounts equal in size.',
    clause: '§9 (same-whole conditions)',
  },
  {
    id: 's73.i5',
    officialSectionId: S('3'),
    sectionNumber: '7.3',
    artefact: 'independent_item',
    verdict: 'revised',
    finding:
      'Asked a student at §7.3 to compare 3/4 with 5/8, which requires equivalent fractions (§7.6) and unlike-fraction comparison (§7.7). Neither has been taught. The keyword sequence validator could not see it because the item names no forbidden phrase — the offence is in what it REQUIRES.',
    action:
      'Replaced with "How many eighth-units make one unit?", which uses only §7.3 material.',
    clause: '§8 / §10 (later concept leak)',
  },
  {
    id: 's75.i4',
    officialSectionId: S('5'),
    sectionNumber: '7.5',
    artefact: 'independent_item',
    verdict: 'revised',
    finding:
      'Item ("Which is greater, 9/4 or 2½?") is in scope, but its rationale justified the answer by comparing 1/4 with 1/2 — unlike-fraction comparison, which is §7.7.',
    action:
      'Rationale rewritten to stay in fourths: 2½ is 10 fourths and 9/4 is 9 fourths.',
    clause: '§8 / §10 (later concept leak)',
  },
  {
    id: 's76.i2',
    officialSectionId: S('6'),
    sectionNumber: '7.6',
    artefact: 'independent_item',
    verdict: 'revised',
    finding:
      'Rationale read "Ten halves-of-fifths: 5 of 10 covers one half." The first clause is not a phrase that means anything, and a student shown it would learn nothing.',
    action:
      'Rewritten: cutting each half into 5 gives 10 parts, and the half now covers 5 of them.',
    clause: '§10 (rationale quality)',
  },
  {
    id: 's77.r1',
    officialSectionId: S('7'),
    sectionNumber: '7.7',
    artefact: 'reasoning_task',
    verdict: 'revised',
    finding:
      'Three defects. (1) Ungrammatical prompt: "explain how you know 5/9 is less than 6/11 is FALSE or TRUE". (2) Self-contradictory: it forbade a common denominator and the expected reasoning then used one (55/99 vs 54/99). (3) The reasoning used 4.5 and 5.5 — decimals, which the current Grade 6 book does not contain at all, since Ganita Prakash has no decimals chapter.',
    action:
      'Replaced with "Is 4/9 or 5/8 closer to one half?", which the landmark method actually settles, with no decimals and no contradiction.',
    clause: '§11 (reasoning task coherence)',
  },
  {
    id: 's78.p2:d',
    officialSectionId: S('8'),
    sectionNumber: '7.8',
    artefact: 'distractor',
    verdict: 'revised',
    finding:
      'Option read "1/2 is impossible here". That is mathematically false — 1/2 IS the answer in lowest terms — so a student selecting it might have been right for the wrong reason, and would then be told they were wrong.',
    action: 'Replaced with 4/4, which is unambiguously incorrect.',
    clause: '§4 (feedback must not overclaim)',
  },
  {
    id: 's77.p1:c',
    officialSectionId: S('7'),
    sectionNumber: '7.7',
    artefact: 'distractor',
    verdict: 'revised',
    finding:
      'Carried null after the v0.67 audit correctly identified it as compare_numerators_only but had no way to express the ID. A real, safely inferable error was receiving generic guidance.',
    action:
      'Now carries chapterMisconceptionId compare_numerators_only through the unified resolver.',
    clause: '§2 / §3 (unified misconception model)',
  },
  {
    id: 's78.p2:b',
    officialSectionId: S('8'),
    sectionNumber: '7.8',
    artefact: 'distractor',
    verdict: 'revised',
    finding:
      'Same defect: 2/8 from 1/4 + 1/4 is reachable only by adding numerators and denominators, and the correct ID existed but could not be attached.',
    action:
      'Now carries chapterMisconceptionId add_numerators_and_denominators.',
    clause: '§2 / §3 (unified misconception model)',
  },
  {
    id: 's76.p1',
    officialSectionId: S('6'),
    sectionNumber: '7.6',
    artefact: 'interactive_item',
    verdict: 'revised',
    finding:
      'Third strip offered 5/9 against a target of 2/3 — an unrelated wrong number that tests nothing in particular.',
    action:
      'Changed to 2/9, which keeps the target numerator and varies only the denominator, so the distractor tests the idea the section teaches.',
    clause: '§3 (distractor quality)',
  },
  {
    id: 's73.explanation[5]',
    officialSectionId: S('3'),
    sectionNumber: '7.3',
    artefact: 'explanation',
    verdict: 'revised',
    finding:
      'A single 33-word sentence carried the section\'s entire conceptual move from area to length.',
    action: 'Split into two sentences.',
    clause: '§7 (advisory readability)',
  },
  {
    id: 's76.explanation[4]',
    officialSectionId: S('6'),
    sectionNumber: '7.6',
    artefact: 'explanation',
    verdict: 'revised',
    finding: 'One 30-word sentence containing the equivalence argument.',
    action: 'Split into two sentences.',
    clause: '§7 (advisory readability)',
  },
  {
    id: 's77.summary',
    officialSectionId: S('7'),
    sectionNumber: '7.7',
    artefact: 'explanation',
    verdict: 'accepted_as_is',
    finding:
      'Flagged jargon-dense: three tracked terms in 17 words ("denominator", "numerator", "common denominator").',
    action:
      'Kept deliberately. It is the summary of a section about denominators and numerators; removing the words would remove the summary. Recorded so the flag is answered rather than ignored.',
    clause: '§7 (advisory readability)',
  },
  {
    id: 's79.explanation[2]',
    officialSectionId: S('9'),
    sectionNumber: '7.9',
    artefact: 'explanation',
    verdict: 'accepted_as_is',
    finding:
      'Mentions that Indian mathematicians set out rules for multiplication and division of fractions — operations deferred to Grade 7 Chapter 8.',
    action:
      'Kept. It is a historical statement about what was written down, not instruction in the operations, and removing it would misreport the source. Flagged here so a reviewer can overrule the judgement.',
    clause: '§8 (sequence boundary)',
  },
];

export type ContentAuditCounts = {
  workedExamples: Record<AuditVerdict, number> & { total: number };
  guidedItems: Record<AuditVerdict, number> & { total: number };
  independentItems: Record<AuditVerdict, number> & { total: number };
  reasoningTasks: Record<AuditVerdict, number> & { total: number };
};

function blank(total: number): Record<AuditVerdict, number> & { total: number } {
  return {
    total,
    accepted_as_is: total,
    revised: 0,
    removed: 0,
    needs_human_review: 0,
  };
}

/**
 * Counts derived from the LIVE chapter plus the findings above.
 *
 * `accepted_as_is` is total minus everything else rather than a stored
 * number, so it cannot drift when an item is added or a finding
 * recorded.
 */
export function contentAuditCounts(
  sections: Array<{
    workedExamples: unknown[];
    guidedPractice: unknown[];
    independentPractice: unknown[];
    reasoningApplication: unknown[];
  }>
): ContentAuditCounts {
  const sum = (fn: (s: (typeof sections)[number]) => unknown[]) =>
    sections.reduce((n, s) => n + fn(s).length, 0);

  const counts: ContentAuditCounts = {
    workedExamples: blank(sum((s) => s.workedExamples)),
    guidedItems: blank(sum((s) => s.guidedPractice)),
    independentItems: blank(sum((s) => s.independentPractice)),
    reasoningTasks: blank(sum((s) => s.reasoningApplication)),
  };

  const bucket = (a: AuditedArtefact) =>
    a === 'worked_example'
      ? counts.workedExamples
      : a === 'guided_item'
        ? counts.guidedItems
        : a === 'independent_item'
          ? counts.independentItems
          : a === 'reasoning_task'
            ? counts.reasoningTasks
            : null;

  for (const e of V068_CONTENT_AUDIT) {
    const b = bucket(e.artefact);
    if (!b) continue;
    if (e.verdict === 'accepted_as_is') continue;
    b[e.verdict] += 1;
    b.accepted_as_is -= 1;
  }

  return counts;
}

export function auditEntriesForSection(
  officialSectionId: string
): ContentAuditEntry[] {
  return V068_CONTENT_AUDIT.filter(
    (e) => e.officialSectionId === officialSectionId
  );
}
