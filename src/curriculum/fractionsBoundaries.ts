// v0.68 §8 — THE FRACTIONS CONCEPT-BOUNDARY TABLE.
//
// WHY THE KEYWORD VALIDATOR WAS NOT ENOUGH
//
// `sequenceLeaks()` searches student prose for a handful of forbidden
// phrases: "number line", "mixed fraction", "common denominator". It
// is a useful guardrail and it stays. But it is shallow in a specific,
// demonstrable way — v0.68's manual audit found two real boundary
// violations it could not see:
//
//   s73.i5  "Which is longer, 3/4 of a unit or 5/8 of a unit?"
//           Needs equivalent fractions (§7.6) and unlike comparison
//           (§7.7) at §7.3. Names no forbidden phrase.
//   s75.i4  rationale compared 1/4 with 1/2 at §7.5.
//
// Both were fixed. Neither would ever have failed a keyword test,
// because the offence is in what the item REQUIRES, not what it says.
//
// WHAT THIS TABLE IS
//
// For each of the nine official sections, three lists taken from the
// verified textbook sequence:
//
//   mayAssume   — already taught, free to use
//   teachHere   — this section's own work
//   deferTo     — belongs later, must not appear
//
// WHAT IT IS NOT
//
// It is not proof of sequence fidelity. `checkBoundaries()` compares
// authored `sequence` declarations against this record and flags
// disagreements — that catches a section contradicting the chapter
// plan. It cannot tell whether an item silently REQUIRES a deferred
// idea; that took a human reading all 69 items, and it is why §8 of
// the spec says automation must not be claimed to prove this.

export type SectionBoundary = {
  officialSectionId: string;
  sectionNumber: string;
  title: string;
  mayAssume: string[];
  teachHere: string[];
  deferTo: Array<{ concept: string; belongsToSection: string }>;
};

const S = (n: string) => `ncert_gp_c6_s7_${n}`;

export const FRACTIONS_BOUNDARIES: SectionBoundary[] = [
  {
    officialSectionId: S('1'),
    sectionNumber: '7.1',
    title: 'Fractional Units and Equal Shares',
    mayAssume: [
      'Whole numbers',
      'Division as equal sharing',
      'Cutting an object into pieces',
    ],
    teachHere: [
      'A fractional unit as one of b equal parts of one whole',
      'Unit-fraction notation 1/b',
      'Unit fractions shrink as b grows',
      'Parts must be exactly equal',
    ],
    deferTo: [
      { concept: 'General a/b notation', belongsToSection: S('2') },
      { concept: 'Measuring with fractional units', belongsToSection: S('3') },
      { concept: 'Fractions on a number line', belongsToSection: S('4') },
      { concept: 'Mixed fractions', belongsToSection: S('5') },
      { concept: 'Equivalent fractions', belongsToSection: S('6') },
      { concept: 'Comparing unlike fractions', belongsToSection: S('7') },
      { concept: 'Adding fractions', belongsToSection: S('8') },
    ],
  },
  {
    officialSectionId: S('2'),
    sectionNumber: '7.2',
    title: 'Fractional Units as Parts of a Whole',
    mayAssume: ['Fractional units 1/b (§7.1)', 'Equal partitioning'],
    teachHere: [
      'a/b as a count of fractional units',
      'Numerator counts, denominator sizes',
      'The same fraction across different shapes of one whole',
      'The whole must be the same before amounts are compared',
    ],
    deferTo: [
      { concept: 'Measuring with fractional units', belongsToSection: S('3') },
      { concept: 'Fractions on a number line', belongsToSection: S('4') },
      { concept: 'Mixed fractions', belongsToSection: S('5') },
      { concept: 'Equivalent fractions', belongsToSection: S('6') },
      { concept: 'Comparing unlike fractions', belongsToSection: S('7') },
    ],
  },
  {
    officialSectionId: S('3'),
    sectionNumber: '7.3',
    title: 'Measuring Using Fractional Units',
    mayAssume: ['Naming a/b (§7.2)', 'Fractional units (§7.1)'],
    teachHere: [
      'A unit of length cut into fractional units',
      'A length expressed as a count of fractional units',
      'Smaller units measure more finely',
      'Counts may pass the whole (5 half-units is 5/2)',
    ],
    deferTo: [
      { concept: 'Marking fractions on a number line', belongsToSection: S('4') },
      { concept: 'Mixed fractions', belongsToSection: S('5') },
      { concept: 'Equivalent fractions', belongsToSection: S('6') },
      // v0.68: the boundary s73.i5 crossed before it was rewritten.
      { concept: 'Comparing unlike fractions', belongsToSection: S('7') },
      { concept: 'Adding fractions', belongsToSection: S('8') },
    ],
  },
  {
    officialSectionId: S('4'),
    sectionNumber: '7.4',
    title: 'Marking Fraction Lengths on the Number Line',
    mayAssume: [
      'Fractional units (§7.1)',
      'Naming a/b (§7.2)',
      'Fractions as lengths (§7.3)',
    ],
    teachHere: [
      'The unit interval partitioned into b equal spaces',
      'Placing a/b by counting spaces from 0',
      'Fractions beyond 1 on the line',
      'Two names can mark the same point',
    ],
    deferTo: [
      { concept: 'Mixed fractions', belongsToSection: S('5') },
      { concept: 'Procedures for generating equivalent fractions', belongsToSection: S('6') },
      // Worded to match §7.4's own `mustNotIntroduce` declaration. §7.4
      // is frozen, so where the two plans differ the boundary table is
      // the one that moves.
      { concept: 'Comparing unlike fractions', belongsToSection: S('7') },
      { concept: 'Operations on fractions', belongsToSection: S('8') },
    ],
  },
  {
    officialSectionId: S('5'),
    sectionNumber: '7.5',
    title: 'Mixed Fractions',
    mayAssume: [
      'a/b as a count of units (§7.2)',
      'Fractions greater than 1 (§7.3)',
      'The number line (§7.4)',
    ],
    teachHere: [
      'Improper fraction to mixed form and back',
      'Reading a mixed fraction as "and", never "times"',
      'Both names sit at the same point',
    ],
    deferTo: [
      { concept: 'Equivalent fractions', belongsToSection: S('6') },
      { concept: 'Comparing unlike fractions', belongsToSection: S('7') },
      { concept: 'Adding fractions', belongsToSection: S('8') },
    ],
  },
  {
    officialSectionId: S('6'),
    sectionNumber: '7.6',
    title: 'Equivalent Fractions',
    mayAssume: ['Naming a/b (§7.2)', 'Fractions as points (§7.4)'],
    teachHere: [
      'Subdividing parts leaves the amount unchanged',
      'Multiplying numerator and denominator by the same number',
      'Different names for one amount',
    ],
    deferTo: [
      { concept: 'Comparing unlike fractions', belongsToSection: S('7') },
      { concept: 'Adding fractions', belongsToSection: S('8') },
      { concept: 'Simplification as a required final step', belongsToSection: 'grade_7_ch8' },
    ],
  },
  {
    officialSectionId: S('7'),
    sectionNumber: '7.7',
    title: 'Comparing Fractions',
    mayAssume: [
      'Unit fractions shrink as b grows (§7.1)',
      'Equivalent fractions (§7.6)',
    ],
    teachHere: [
      'Same denominator: count the parts',
      'Same numerator: compare part sizes',
      'Otherwise rewrite to a common denominator',
      'Comparison requires the same whole',
    ],
    deferTo: [
      { concept: 'Adding and subtracting fractions', belongsToSection: S('8') },
      { concept: 'Multiplying and dividing fractions', belongsToSection: 'grade_7_ch8' },
    ],
  },
  {
    officialSectionId: S('8'),
    sectionNumber: '7.8',
    title: 'Addition and Subtraction of Fractions',
    mayAssume: [
      'a/b as a count of units (§7.2)',
      'Equivalent fractions (§7.6)',
      'Common denominators (§7.7)',
    ],
    teachHere: [
      'Adding and subtracting like fractions by counting',
      'Rewriting unlike fractions to a common denominator first',
      'Why denominators are not added',
    ],
    deferTo: [
      { concept: 'Multiplication and division of fractions', belongsToSection: 'grade_7_ch8' },
    ],
  },
  {
    officialSectionId: S('9'),
    sectionNumber: '7.9',
    title: 'A Pinch of History',
    mayAssume: ['Everything earlier in the chapter'],
    teachHere: [
      'Fraction ideas predate fraction notation',
      'Indian contributions, including the Sulba-sutras',
      'Notation was invented, and could have been otherwise',
    ],
    // Nothing is deferred: the section closes the chapter. It refers to
    // multiplication and division of fractions as a HISTORICAL fact
    // about what Indian mathematicians set out — it does not teach the
    // operations, and removing the mention would misreport the source.
    deferTo: [],
  },
];

export function boundaryFor(officialSectionId: string): SectionBoundary | null {
  return (
    FRACTIONS_BOUNDARIES.find((b) => b.officialSectionId === officialSectionId) ??
    null
  );
}

export type BoundaryIssue = {
  officialSectionId: string;
  kind:
    | 'missing_boundary_record'
    | 'assumes_undeclared_prerequisite'
    | 'defers_to_earlier_section'
    | 'authored_defer_not_in_boundary';
  detail: string;
};

/**
 * Compare each authored section's own `sequence` declaration with the
 * chapter boundary record.
 *
 * Two independent statements of the same plan. If they disagree, one is
 * wrong and a human must decide which — the checker reports, it does
 * not reconcile.
 */
export function checkBoundaries(
  sections: Array<{
    source: { officialSectionId: string; sectionNumber: string };
    sequence: {
      prerequisiteSectionIds: string[];
      mustNotIntroduce: Array<{ concept: string; belongsToSection: string }>;
    };
  }>
): BoundaryIssue[] {
  const issues: BoundaryIssue[] = [];

  for (const s of sections) {
    const id = s.source.officialSectionId;
    const b = boundaryFor(id);
    if (!b) {
      issues.push({
        officialSectionId: id,
        kind: 'missing_boundary_record',
        detail: `no boundary record for ${s.source.sectionNumber}`,
      });
      continue;
    }

    // A section may not defer to something that comes before it.
    for (const d of s.sequence.mustNotIntroduce) {
      if (d.belongsToSection.startsWith('ncert_gp_c6_s7_') && d.belongsToSection <= id) {
        issues.push({
          officialSectionId: id,
          kind: 'defers_to_earlier_section',
          detail: `${s.source.sectionNumber} defers '${d.concept}' to ${d.belongsToSection}, which is not later`,
        });
      }
      // Everything the section declares off-limits must appear in the
      // chapter record, or the two plans have diverged.
      const known = b.deferTo.some(
        (x) =>
          x.belongsToSection === d.belongsToSection &&
          x.concept.toLowerCase().slice(0, 8) === d.concept.toLowerCase().slice(0, 8)
      );
      if (!known) {
        issues.push({
          officialSectionId: id,
          kind: 'authored_defer_not_in_boundary',
          detail: `${s.source.sectionNumber} defers '${d.concept}' to ${d.belongsToSection}, which the boundary table does not record`,
        });
      }
    }

    // Every prerequisite section must precede this one.
    for (const pre of s.sequence.prerequisiteSectionIds) {
      if (!pre.startsWith('ncert_gp_c6_s7_')) continue;
      if (pre >= id) {
        issues.push({
          officialSectionId: id,
          kind: 'assumes_undeclared_prerequisite',
          detail: `${s.source.sectionNumber} lists ${pre} as a prerequisite, but it does not come earlier`,
        });
      }
    }
  }

  return issues;
}
