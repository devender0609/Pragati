# Class 9 Wave 1 — source alignment audit

Chapters 2, 4 and 13. Audited after authoring, against the canonical section
evidence rather than against the lessons' own claims. 24 lessons, 24 verdicts.

| Lesson | Source | Verdict | Notes |
|---|---|---|---|
| `ncert_iemh1_s2_1_2_lesson` | §2.1 + §2.2 (merged) | **ALIGNED** | Covers the motivation and the definition, and names §2.2 in provenance. Degree, coefficient and constant term all appear; graphing is deferred to §2.6 as the source orders it. |
| `ncert_iemh1_s2_3_lesson` | §2.3 | **ALIGNED** | Constant difference and the nth term, with the rule tested against known terms. The matchstick context is Pragati's own. |
| `ncert_iemh1_s2_4_lesson` | §2.4 | **ALIGNED** | Growth and decay as a signed coefficient. The valid-range discussion is a consequence of the source model, not added mathematics. |
| `ncert_iemh1_s2_5_lesson` | §2.5 | **ALIGNED** | Fitting a and b to tabulated data, matching the section intent exactly, including the case where no linear rule fits. |
| `ncert_iemh1_s2_6_graph_lesson` | §2.6 (split 1) | **ALIGNED** | Producing the graph and establishing collinearity. Stops before parameter effects, which the sibling carries. |
| `ncert_iemh1_s2_6_params_lesson` | §2.6 (split 2) | **ALIGNED** | Reading a and b off families of lines by controlled comparison. Deliberately withholds the word slope, which §13.3 defines. |
| `ncert_iemh1_s4_1_lesson` | §4.1 | **ALIGNED** | Identity versus equation, with the prove/refute asymmetry. Matches the section's framing role. |
| `ncert_iemh1_s4_2_lesson` | §4.2 | **ALIGNED** | Area justification of the square identities including the subtract-twice-add-back argument, and states the limits of an area argument. |
| `ncert_iemh1_s4_3_lesson` | §4.3 | **ALIGNED** | Factorising with the square identities, common factor first. Notes the absence of a sum-of-squares identity. |
| `ncert_iemh1_s4_4_lesson` | §4.4 | **ALIGNED** | Three-term square derived by substitution, with numerical application. §4.4 is the section an earlier detector missed; it is covered here. |
| `ncert_iemh1_s4_5_lesson` | §4.5 | **ALIGNED** | Tile model with a non-factorising case, and the model's limits named. |
| `ncert_iemh1_s4_6_lesson` | §4.6 | **ALIGNED** | Coefficient comparison including negatives and a leading coefficient, as the section's title requires. |
| `ncert_iemh1_s4_7_cube_lesson` | §4.7 (split 1) | **ALIGNED** | Cube expansion from the square identity and from the solid dissection. |
| `ncert_iemh1_s4_7_factor_lesson` | §4.7 (split 2) | **ALIGNED** | Sum and difference of cubes, plus combination with the three-term square. No explanation shared with its sibling. |
| `ncert_iemh1_s4_8_lesson` | §4.8 | **ALIGNED** | Simplifying rational expressions with excluded values stated — the domain point the source raises. |
| `ncert_iemh2_s13_1_lesson` | §13.1 | **ALIGNED** | Standard form and the coefficient condition, with a worked non-example. |
| `ncert_iemh2_s13_2_pairs_lesson` | §13.2 (split 1) | **ALIGNED** | Ordered-pair solutions and the infinitude argument. |
| `ncert_iemh2_s13_2_line_lesson` | §13.2 (split 2) | **ALIGNED** | Collinearity of the solution set and the two-way correspondence with the line. |
| `ncert_iemh2_s13_3_slope_lesson` | §13.3 (split 1) | **ALIGNED** | Slope as rise over run, with invariance across point pairs and the undefined vertical case. |
| `ncert_iemh2_s13_3_form_lesson` | §13.3 (split 2) | **ALIGNED** | Derivation of y = mx + c with both constants justified, and the vertical-line exception. |
| `ncert_iemh2_s13_4_lesson` | §13.4 | **ALIGNED** | Setting up a pair from context and the general subscripted pair. |
| `ncert_iemh2_s13_5_substitution_lesson` | §13.5 (split 1) | **ALIGNED** | Substitution with the validity of the replacement justified. |
| `ncert_iemh2_s13_5_elimination_lesson` | §13.5 (split 2) | **ALIGNED** | Elimination including both degenerate outcomes, treated as information rather than failure. |
| `ncert_iemh2_s13_6_lesson` | §13.6 | **ALIGNED** | Graphical method and classification by coefficient ratios into the three cases. |

## Provenance reconciliation

Every official section of all three chapters is claimed by exactly one lesson,
as primary or additional. Chapter 2's merged lesson carries §2.2 in
`additionalOfficialSectionIds`; the checkpoint-33 field needed no change to
serve a second chapter. The reconciliation is now a class-wide test rather
than a Chapter 5 fixture, so Classes 10-12 inherit it.

## Splits

Six split sibling pairs across the wave (§2.6, §4.7, §13.2, §13.3, §13.5).
Each pair has distinct learning goals, shares no explanation text, and the
second names the first as prerequisite. Enforced by test for every authored
chapter, not just the ones in this wave.

## Defects found and corrected

- Two Chapter 13 lessons carried section titles that did not match the
  canonical records: "Slope-intercept form of a Line" for a section actually
  titled "...of a Linear Equation", and a truncation in §13.6. The title check
  in `validateAuthoredSection` caught both; both were corrected from evidence.
- Three figures failed the checkpoint-33 figure validator — unlabelled points
  in two cases, and two points at identical coordinates in a third. All three
  were corrected rather than the check being relaxed.

## Defect found but NOT caused by this wave

`ncert_gp_c6_s3_3_lesson` (Class 6, §3.3) fails `sequenceLeaks`: it mentions
"number line", which the sequence model assigns to §7.4. Checked against the
packaged checkpoint 33 — **it predates Wave 1**. It is left untouched here, and
recorded so it can be fixed under its own justification rather than silently
inside an authoring checkpoint.

## What this audit does not do

It does not review the mathematics for a human. All 24 lessons remain
`authored_draft`: alignment-passed and review-ready, not reviewed.
