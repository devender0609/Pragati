# Class 9 Wave 2 — source alignment audit

Chapters 6 and 8. Audited after authoring, against the canonical section
evidence rather than against the lessons' own claims. 18 lessons, 16 official
sections, one merge and three splits.

| Lesson | Source | Verdict | Notes |
|---|---|---|---|
| `ncert_iemh1_s6_1_lesson` | §6.1 | **ALIGNED** | Perimeter as the border walked once, with deduced side lengths on composite shapes. Linear units insisted on from the first lesson. |
| `ncert_iemh1_s6_2_lesson` | §6.2 | **ALIGNED** | The constant C/D ratio established by measurement, with the source's contrast against the fixed perimeter-to-side ratio of equilateral triangles and squares. |
| `ncert_iemh1_s6_3_lesson` | §6.3 | **ALIGNED** | Irrationality stated, not proved, and its consequence drawn for 22/7 and 355/113. Madhava's series named as the source does. |
| `ncert_iemh1_s6_4_lesson` | §6.4 | **ALIGNED** | Arc length as theta/360 of the circumference, checked on the semicircle and quadrant cases the section uses. |
| `ncert_iemh1_s6_5_lesson` | §6.5 | **ALIGNED** | The 400 m track as straights plus one full circle, and the semicircle paradox where curved length stays 6 pi however many bumps. |
| `ncert_iemh1_s6_6_7_lesson` | §6.6 + §6.7 (merged) | **ALIGNED** | Rectangle area as the chapter's starting point, then the parallelogram by cutting and reattaching. §6.7 named in provenance. |
| `ncert_iemh1_s6_8_base_lesson` | §6.8 (split 1) | **ALIGNED** | Triangle as half a parallelogram from two congruent copies, with the three base-height pairs. |
| `ncert_iemh1_s6_8_heron_lesson` | §6.8 (split 2) | **ALIGNED** | Heron from the semi-perimeter, checked against base-and-height on the 3-4-5, and Brahmagupta with Heron as its d=0 case. |
| `ncert_iemh1_s6_9_lesson` | §6.9 | **ALIGNED** | The squaring construction with the semicircle right angle from chapter 5, extended to a triangle via an equal rectangle. |
| `ncert_iemh1_s6_10_disc_lesson` | §6.10 (split 1) | **ALIGNED** | Archimedes' sector rearrangement, stated honestly as a limit rather than an exact finite dissection. |
| `ncert_iemh1_s6_10_sector_lesson` | §6.10 (split 2) | **ALIGNED** | Sector area as theta/360 of the disc, with arc and sector kept in different units and the sector perimeter including both radii. |
| `ncert_iemh1_s8_1_lesson` | §8.1 | **ALIGNED** | Sequence, term and position named; finitely many terms shown not to determine a rule. Opens from prior pattern work, not as a first encounter. |
| `ncert_iemh1_s8_2_lesson` | §8.2 | **ALIGNED** | Explicit rules with membership decided by solving for n and requiring a counting number, as the section does. |
| `ncert_iemh1_s8_3_lesson` | §8.3 | **ALIGNED** | Recursive rules including the three-back case, with the explicit/recursive trade-off the section draws. |
| `ncert_iemh1_s8_4_lesson` | §8.4 | **ALIGNED** | AP nth term derived from unsimplified terms, with the recursive rule alongside, matching the section's own route. |
| `ncert_iemh1_s8_5_lesson` | §8.5 | **ALIGNED** | Pairing from the ends for the first n naturals, extended to any AP as the section extends it. |
| `ncert_iemh1_s8_6_algebra_lesson` | §8.6 (split 1) | **ALIGNED** | GP named by its ratio with nth term ar^(n-1), including fractional and negative ratios. |
| `ncert_iemh1_s8_6_visual_lesson` | §8.6 (split 2) | **ALIGNED** | The Sierpinski GP and the AP-versus-GP growth comparison. Shares no explanation with its sibling. |

## Provenance

Every official section of both chapters is claimed by exactly one lesson.
§6.6 is merged into §6.7 and survives through `additionalOfficialSectionIds`;
a test enforces it, as it has since checkpoint 33.

## Splits

Three sibling pairs (§6.8, §6.10, §8.6). Each pair has distinct learning
goals, shares no explanation text, and orders itself by prerequisite.

## Defects found and corrected

- **Ten Chapter 6 lessons carried wrong source start pages.** The existing
  validator caught every one and all ten were corrected from the canonical
  records. This is the single largest defect class any wave has produced, and
  it is a direct consequence of authoring eleven lessons at once.
- Four worked-example steps failed the reasoning-depth gate ("Ten pairs of
  86", "One times 243"). All four were rewritten to say why the step follows.
- One hint was reused verbatim between the perimeter and arc lessons. Caught
  by the new duplicate detection and made distinct.
- Two figure points were unlabelled and two shared a position in the AP/GP
  comparison; the figure validator rejected all four.

## Dimensional discipline

Chapter 6 is 2-D throughout. A test asserts its prose carries no cubic units
and no Chapter 14 vocabulary (curved surface area, volume of a cylinder), and
that its worked-example answers use square units and never cubic ones. The two
chapters share the word "area" and none of their mathematics.

## What this audit does not do

It does not review the mathematics for a human. All 18 lessons remain
`authored_draft`.
