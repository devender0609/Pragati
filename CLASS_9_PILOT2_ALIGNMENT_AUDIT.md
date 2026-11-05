# Class 9 second pilot — source alignment audit

Chapter 5, Circles. Audited after authoring, against the canonical section
evidence rather than against the lessons' own claims.

| Lesson | Source | Verdict | Notes |
|---|---|---|---|
| `ncert_iemh1_s5_1_2_lesson` | §5.1 + §5.2 (merged) | **ALIGNED** | Covers the definition and both symmetries, and names §5.2 in provenance. Symmetry is derived from distance preservation, which is what the source argues; no tangent or arc material is imported from later sections. |
| `ncert_iemh1_s5_3_lesson` | §5.3 | **ALIGNED** | Existence and uniqueness through three non-collinear points, the circumcircle construction, and the collinear failure case the source raises. The right-angled-triangle circumcentre example is Pragati's own. |
| `ncert_iemh1_s5_4_lesson` | §5.4 | **ALIGNED** | Both directions of the chord/central-angle result. The source argues from a rotation; this lesson argues from congruence, which is a permitted original treatment of the same claim and keeps the reasoning demand intact. |
| `ncert_iemh1_s5_5_lesson` | §5.5 | **ALIGNED** | Both directions with SSS and RHS named, plus the length computations the section supports. The link back to the centre-finding construction is cross-reference, not new mathematics. |
| `ncert_iemh1_s5_6_lesson` | §5.6 | **ALIGNED** | Longer chords nearer the centre and the equidistant converse, derived from the fixed radius relation. Subsection 5.6.1's investigation is represented as the opening fold activity and then argued. |
| `ncert_iemh1_s5_7_centre_lesson` | §5.7 (split 1) | **ALIGNED** | The doubling theorem with its construction explained, and the semicircle corollary. Matches subsection 5.7.1's proof demand. |
| `ncert_iemh1_s5_7_segment_lesson` | §5.7 (split 2) | **ALIGNED** | The same-segment deduction only. No overlap of explanation with its sibling; it names the sibling as prerequisite and stops before concyclicity. |
| `ncert_iemh1_s5_8_lesson` | §5.8 | **ALIGNED** | The concyclicity test and the cyclic-quadrilateral angle sum, both treated as converses with their own arguments, including the inside/outside comparison the section uses. |

## Merge coverage

§5.2 "Symmetries of a Circle" is a one-page section that exists to use the
definition §5.1 just gave. The merged lesson carries both, and both are named
in `source.officialSectionId` and `source.additionalOfficialSectionIds`. Before
this checkpoint the schema had no second field, so a merged lesson silently
dropped its partner section from provenance; a validator now rejects that.

## Split coverage

§5.7 produces two lessons. Their learning goals differ, their explanations
share no text, and the second names the first as a prerequisite. Between them
they cover the theorem, its construction, the semicircle corollary and the
same-segment deduction, with no source demand falling in the gap.

## Defects found and corrected

- The merged lesson originally recorded only §5.1. Fixed by the schema
  extension above rather than by a note in prose.
- Two figures placed a point marked as on the circle at a distance that did not
  match the radius. The figure validator now computes that distance and rejects
  the mismatch, so a chord cannot be drawn to a point the spec claims is on the
  circle but is not.

## What this audit does not do

It does not review the mathematics for a human. All eight lessons remain
`authored_draft`: alignment-passed and review-ready, not reviewed.
