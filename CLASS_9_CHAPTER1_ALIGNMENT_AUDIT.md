# Class 9 Chapter 1 — source alignment audit

Coordinates. Audited after authoring, against the canonical section evidence.
5 lessons, 4 official sections, one merge and two splits.

| Lesson | Source | Verdict | Notes |
|---|---|---|---|
| `ncert_iemh1_s1_1_2_lesson` | §1.1 + §1.2 (merged) | **ALIGNED** | Framework as a set of choices, plus the transmission history the source carries (Brahmagupta into Arabic geography, Al-Biruni). §1.2 named in provenance. No plotting, which §1.3 owns. |
| `ncert_iemh1_s1_3_plot_lesson` | §1.3 (split 1) | **ALIGNED** | Axes, origin, ordered pair and the plot/read procedure, including a non-unit scale. Stops before signs, which the sibling carries. |
| `ncert_iemh1_s1_3_signs_lesson` | §1.3 (split 2) | **ALIGNED** | Signed coordinates, the four regions, and the (x,0) / (0,y) forms the section establishes. No explanation shared with its sibling. |
| `ncert_iemh1_s1_4_distance_lesson` | §1.4 (split 1) | **ALIGNED** | The perpendicular construction and the distance derivation, explicitly using the Class 8 relation rather than reproving it. |
| `ncert_iemh1_s1_4_apply_lesson` | §1.4 (split 2) | **ALIGNED** | Collinearity by distance comparison and midpoints by averaging, both applications of the derived result. |

## Scope discipline

The chapter deliberately does **not** use the word slope, the form y = mx + c,
the section formula or the centroid. Chapter 13 defines slope with a derivation;
importing the word here would assert a definition the chapter has not given. A
test asserts their absence from the authored prose.

## Coordinate fidelity

Every figure plots on a fixed grid — 10 svg units per coordinate unit, origin at
(110, 110), y inverted. A test parses the pair out of each point's label and
checks the drawn position against it, so a figure that labels a point (3, 2) and
draws it where (2, 3) belongs now fails. 14 labelled points checked, 0 misplaced.

This matters more here than anywhere so far: the lesson's whole subject is that
the order of the pair decides the place, and a figure contradicting that would
teach the error directly.

## Defects found and corrected

- One figure had an unlabelled foot-of-perpendicular point; the figure validator
  caught it and it is now labelled (3, 0).
- Three coordinate descriptions stated positions without naming the origin or
  the axes, so a nonvisual reader could not place the points. All three were
  rewritten to describe each point relative to the origin.

## What this audit does not do

It does not review the mathematics for a human. All 5 lessons remain
`authored_draft`.
