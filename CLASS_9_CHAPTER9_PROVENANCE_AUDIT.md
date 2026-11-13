# Class 9 Chapter 9 — alignment and source-segment provenance audit

Propositions and their Converses. **Zero numbered official sections.**
2 segment-backed lessons, 3 canonical source segments, one of them PRACTICE.

| Lesson | Source | Verdict | Notes |
|---|---|---|---|
| `ncert_iemh2_ch09_seg1_lesson` | seg1 (pages 1-2) | **ALIGNED** | Proposition, converse and counterexample. Matches the segment's recorded intent: separate claims each needing justification, one counterexample refutes a universal claim. |
| `ncert_iemh2_ch09_seg2_lesson` | seg2 (pages 3-5) | **ALIGNED** | Implication notation, the Baudhayana-Pythagoras theorem and its converse as two established theorems, and odd/even divisibility examples. Matches the segment's recorded intent. |

## The provenance assumption audit

Before authoring, I traced every place that assumed an authored lesson comes
from a numbered section. The answer was **about forty call sites across
fifteen modules** — the validator, review-package generation, the readiness
and completeness reports, the quality and readability audits, the distractor
audit, the admin review preview, the student content lookup, and seven test
files. Each read `source.officialSectionId` as a plain required string and
indexed by it.

Making that field optional broke all fifteen at the type level, which is the
honest measurement of how load-bearing the assumption was.

## What was built instead

Provenance now names its **kind**. `sourceKind` is `'official_section'` when
absent, so **all 94 existing artifacts are untouched** and every legacy path
keeps its required string. A segment-backed lesson declares
`'source_segment'`, names its canonical segments, and leaves
`officialSectionId` and `sectionNumber` empty.

The validator does not merely tolerate the empty section — it **requires**
it. A segment-backed lesson that also names a section, a section number, or
an additional section fails. That is the fabricated-section guard, and it is
enforced rather than assumed.

The segment path is checked at least as hard as the section path: each
segment must exist, belong to this chapter, carry a verified page extent and
a verified mathematical intent, and be dispositioned `CORE_MATHEMATICS`.

## One real defect found in the existing model

`SourceSegment.role` was typed `InstructionalRole | 'UNRESOLVED'` — and
`'CORE_MATHEMATICS'`, the value the Chapter 9 segments actually carry, was
not in that union. `mathematicalIntent` and `printedHeading` were in the data
and missing from the type too. Nothing could check any of them. The type now
matches the data it has held since checkpoint 30.

## Segment 3 stays PRACTICE

Exercise Set 9.1 and the chapter summary. No Learn lesson, and a test asserts
the authored lessons claim exactly seg1 and seg2. Covering every segment with
a lesson would be tidier and would misdescribe the chapter.

## Reconciliation, both paths

The class-wide reconciliation test now branches on source kind. The official
path is **unchanged** — every section-backed lesson still names a verified
official section, and no section of an authored chapter may disappear. The
segment path reconciles to segments. Neither was weakened to let the other
pass, and a test asserts the split is exactly 94 section-backed and 2
segment-backed.

## Mathematical treatment

The chapter does not introduce reasoning — Class 8 already proves things, and
a test asserts the lessons never claim otherwise. What is new is the language:
proposition, converse, counterexample, implication.

The asymmetry is made explicit and is the lesson's spine: **one counterexample
refutes a universal claim, and no number of confirming examples establishes
one**. Both all-true pairs (isosceles, Pythagoras) and mixed pairs
(divisible-by-5, divisible-by-4) appear, so no student can learn that
converses are usually true or usually false.

## Student-facing check

A test asserts that no provenance id, the phrase "source segment", or any
reviewer vocabulary appears in anything a student reads.

## Mechanical gates

Clean. Source and provenance validation, reasoning depth, duplicate content
and placeholders were all checked before alignment. All 96 learning goals
across the repository remain distinct.

## What this audit does not do

It does not review the mathematics for a human. Both lessons remain
`authored_draft`.
