// ===========================================================================
// v0.82.1 §C — PAGE-LEVEL ALIGNMENT RECORDS FOR CHAPTER 3.
//
// The primary pages were read on 2026-09-17 from
// https://ncert.nic.in/textbook/pdf/fegp103.pdf (Ganita Prakash, Grade 6,
// Reprint 2026-27) — the chapter PDF itself, not a summary of it.
//
// THE HEADLINE, STATED BEFORE THE DETAIL
//
// §3.2 is substantially aligned. §3.1 and §3.3 are NOT: they teach
// mathematics the source does not teach. Both were authored from the
// section title plus a plausible reading, which is exactly the failure
// mode the briefs kept warning about, and the warning was right.
//
// Nothing here rewrites content. These records state what the source
// says and what Pragati currently claims, so the gap is visible in the
// product rather than in a report nobody re-reads.
// ===========================================================================

export type AlignmentStatus =
  /** Pragati teaches the mathematics the source teaches, at this point. */
  | 'aligned'
  /** Aligned in substance, with labelled Pragati enrichment on top. */
  | 'aligned_with_enrichment'
  /** Pragati teaches something the source does not teach here. */
  | 'misaligned_requires_rewrite';

export type SectionAlignment = {
  officialSectionId: string;
  sectionNumber: string;
  exactTitle: string;
  /** Inclusive page range in the primary chapter PDF. */
  pages: [number, number];
  sourceUrl: string;
  edition: string;
  inspectionDate: string;
  /** What the source actually asks students to do. */
  sourceIntent: string;
  /** The representation the source itself uses. */
  sourceRepresentation: string;
  status: AlignmentStatus;
  /** Claims Pragati makes that the source supports. */
  aligned: string[];
  /** Defensible additions that stay inside the section's mathematics. */
  enrichment: string[];
  /** Claims the source does not support at this point in the book. */
  unsupported: string[];
};

const SRC = 'https://ncert.nic.in/textbook/pdf/fegp103.pdf';
const EDITION = 'Ganita Prakash, Grade 6, NCERT, Reprint 2026-27';
const INSPECTED = '2026-09-17';

export const NUMBER_PLAY_ALIGNMENT: SectionAlignment[] = [
  {
    officialSectionId: 'ncert_gp_c6_s3_1',
    sectionNumber: '3.1',
    exactTitle: 'Numbers can Tell us Things',
    pages: [55, 56],
    sourceUrl: SRC,
    edition: EDITION,
    inspectionDate: INSPECTED,
    sourceIntent:
      'Children of different heights stand in a line and each says how many of the children standing next to them are TALLER — 0, 1 or 2. Students work out what the numbers encode, then reason about which sequences are possible: can the children at the ends say 2, can everyone say 0, can two neighbours say the same number, is 1,1,1,1,1 possible for five children of different heights.',
    sourceRepresentation:
      'A line of people, each labelled with a count of taller neighbours. Numbers describe a STRUCTURE, and the reasoning is about which labellings can and cannot occur.',
    // v0.82.1 — REWRITTEN. The lesson below this record was replaced,
    // not edited: it now teaches neighbour-counting, which is what the
    // pages teach. The v0.79 material (units, "more is not always
    // better", different-sized groups, list position) was removed
    // entirely rather than moved, because no later section of this
    // chapter teaches it either.
    status: 'aligned_with_enrichment',
    aligned: [
      'Each position reports how many of its ADJACENT neighbours are taller — source-explicit.',
      'Values are 0, 1 or 2 because a position has at most two neighbours — source-explicit.',
      'An end position has one neighbour and can never report 2 — the source asks this directly as its first question.',
      'Deciding which sequences can occur, including whether 1,1,1,1,1 is possible for five children of different heights — source-explicit.',
      'The maximum number of positions that can report 2 — the source asks it as its last question.',
    ],
    enrichment: [
      'Pragati uses plants of stated heights rather than the source’s children, so every example and exercise is original.',
      'Stating explicitly that the tallest always reports 0. The source implies it through its questions rather than writing it as a rule.',
    ],
    unsupported: [],
  },
  {
    officialSectionId: 'ncert_gp_c6_s3_2',
    sectionNumber: '3.2',
    exactTitle: 'Supercells',
    pages: [57, 59],
    sourceUrl: SRC,
    edition: EDITION,
    inspectionDate: INSPECTED,
    sourceIntent:
      'A cell is coloured — a supercell — if the number in it is larger than its adjacent cells. The source opens on a single row, then explicitly extends to several rows where "the neighbouring cells are those that are immediately to the left, right, top and bottom", and asks students to construct tables meeting supercell conditions.',
    sourceRepresentation:
      'A table of numbers with cells coloured. Single row first, then a 4×4 grid (Table 1, where 8632 beats 4580, 8280, 4795 and 1944).',
    status: 'aligned_with_enrichment',
    aligned: [
      'A supercell is larger than EVERY adjacent cell — source wording is "greater than all the numbers in its neighbouring cells".',
      'End cells qualify: the source states that 198 is coloured because it has only one adjacent cell, 109, and 198 is larger than it. Source-explicit.',
      'A single row comes first, then a rectangular grid. Source-explicit ordering.',
      'Orthogonal adjacency in a grid — left, right, top and bottom — with diagonals excluded. Source-explicit.',
      'Whether the largest number in a table is always a supercell (Pragati reasoning task r2) — the source asks this directly.',
    ],
    enrichment: [
      'The tie case. The source’s tables use distinct numbers and never discuss equal neighbours, so "equal is not larger" is Pragati’s extension of the definition. Defensible and worth teaching, but it must be labelled enrichment and not presented as the book’s emphasis.',
      'Pragati’s row and grid numbers are original; the source’s own tables are not reproduced.',
    ],
    unsupported: [],
  },
  {
    officialSectionId: 'ncert_gp_c6_s3_3',
    sectionNumber: '3.3',
    exactTitle: 'Patterns of Numbers on the Number Line',
    pages: [59, 60],
    sourceUrl: SRC,
    edition: EDITION,
    inspectionDate: INSPECTED,
    sourceIntent:
      'Place given four- and five-digit numbers at their approximate positions on a number line running 1000 to 10,000; then read number lines at other scales (2010–2020, 9996–9997, 15,077–15,083, 86,705–87,705), identify the marked numbers and label the remaining positions, circling the smallest and boxing the largest.',
    sourceRepresentation:
      'Number lines at several different SCALES, with most positions unlabelled. The work is reading and assigning large-number positions, not describing growth patterns.',
    // v0.82.1 — REWRITTEN. The geometric-sequence material was removed
    // entirely; it belongs to no section of this chapter.
    status: 'aligned_with_enrichment',
    aligned: [
      'Placing four- and five-digit numbers on a 1000-to-10,000 line — source-explicit.',
      'Reading lines at other scales, including tight five-digit windows — source-explicit, matching 2010-2020, 9996-9997 and 15,077-15,083.',
      'Lines that do not start at zero — every window the source shows after the first.',
      'Identifying values at unlabelled ticks — the source asks students to label the remaining positions.',
    ],
    enrichment: [
      'Deriving the interval by dividing the span by the number of intervals, stated as a method. The source expects it without naming it.',
      'The 86,000-to-88,000 window with a step of 250, chosen so the answer is not a round thousand. Pragati’s window, not the book’s.',
    ],
    unsupported: [],
  },
];

export function alignmentFor(officialSectionId: string): SectionAlignment | null {
  return (
    NUMBER_PLAY_ALIGNMENT.find(
      (a) => a.officialSectionId === officialSectionId
    ) ?? null
  );
}

/**
 * §3.4, read only far enough to establish the §3.3 boundary and the
 * representation question — pp. 60-61.
 *
 * WHAT IT ACTUALLY CONTAINS: how many numbers have two, three, four and
 * five digits; DIGIT SUMS (numbers whose digits add to 14, digit sums of
 * 40 to 70, digit sums of three-digit numbers with consecutive digits);
 * and digit-occurrence counting (how many times the digit 7 appears from
 * 1 to 100, and from 1 to 1000).
 *
 * SO `PlaceValueSpec` IS NOT JUSTIFIED. v0.81 proposed place-value
 * columns showing what each digit is worth in its place — seven hundreds
 * for the 7 in 736. The section does not do that. It treats a number as
 * a BAG OF DIGITS to be added or counted, and place is largely
 * irrelevant to it: 68, 176 and 545 have the same digit sum precisely
 * because position does not matter.
 *
 * That proposal came from the title "Playing with Digits" plus a
 * plausible reading, which is the same error this audit found in §3.1
 * and §3.3. The representation §3.4 needs, if any, is closer to a digit
 * decomposition strip with a running sum — and whether it needs one at
 * all is a question for whoever authors it against these pages.
 */
export const SECTION_3_4_REPRESENTATION_FINDING = {
  pages: [60, 61] as [number, number],
  placeValueSpecJustified: false,
  reason:
    'The section works with digit sums and digit-occurrence counts, where position is deliberately irrelevant. Place-value columns would represent a different idea from the one the section teaches.',
} as const;

/**
 * v0.82.1 §19 — THE GATE THE MODEL WAS MISSING.
 *
 * `complete_instructional_draft` says every structural field is
 * populated. It says nothing about whether the section teaches the
 * mathematics the source teaches, and for three releases §3.1 and §3.3
 * were complete and wrong.
 *
 * So review eligibility needs BOTH. This fails closed: a section with
 * no alignment record is not eligible, because an unaudited section is
 * not an aligned one and absence of evidence must not read as evidence.
 */
export function isReviewEligible(
  officialSectionId: string,
  completenessLevel: string
): boolean {
  if (completenessLevel !== 'complete_instructional_draft') return false;
  const a = alignmentFor(officialSectionId);
  if (!a) return false;
  return a.status !== 'misaligned_requires_rewrite';
}
