# Class 9 pilot — source alignment audit

Audited after authoring, against the canonical section evidence rather than
against the lessons' own claims. Every lesson's `source.startPage` was checked
to be the section's **PDF** coordinate, and all six match.

| Lesson | Section | Source extent | Verdict | Notes |
|---|---|---|---|---|
| `ncert_iemh2_s12_1_lesson` | 12.1 What Exactly is a Quadrilateral? | PDF 2–6 | **ALIGNED** | Teaches the definition and the adjacent/opposite vocabulary the section establishes; the crossed-figure case is the section’s own distinction, treated with an original figure. |
| `ncert_iemh2_s12_2_properties_lesson` | 12.2 Parallelograms | PDF 6–10 | **ALIGNED** | Covers all three properties and the congruence proof the section gives; stops before the converses, which the companion lesson carries. |
| `ncert_iemh2_s12_2_converses_lesson` | 12.2 Parallelograms | PDF 6–10 | **ALIGNED** | Covers the converse tests and the insufficient one-pair condition. Adds no mathematics beyond the section; the counterexample is Pragati’s own figure. |
| `ncert_iemh2_s12_3_midpoint_lesson` | 12.3 Applications of Parallelograms | PDF 10–19 | **ALIGNED** | Proves the Midpoint Theorem by the construction the section uses and states the converse. Matches subsection 12.3.1. |
| `ncert_iemh2_s12_3_medians_lesson` | 12.3 Applications of Parallelograms | PDF 10–19 | **ALIGNED** | Derives the four-congruent-triangles result and the median bisection, matching subsection 12.3.2. Explicitly declines to claim the medians are concurrent, which the section does not establish. |
| `ncert_iemh2_s12_4_lesson` | 12.4 Tiling the Plane Using Any 4-gon | PDF 19–34 | **ALIGNED** | Gives the half-turn method and the angle-sum justification, including the non-convex case the section raises. The pentagon comparison is Pragati’s own and is marked as a contrast, not a source claim. |

## What the audit checked

Scope against the recorded section intent; proof demands preserved rather than
reduced to statements; subsection demands covered where the section prints them
(12.3.1 and 12.3.2 each own a lesson); no mathematics introduced that the source
does not carry; progression claims consistent with the Class 8→9 audit; practice
assessing the stated objective; Think deeper extending rather than enlarging.

## Defects found and corrected during the audit

- Six worked-example steps carried reasoning too thin to explain anything
  ("Subtracting from the supplementary total"). Each was rewritten to say which
  fact licenses the step. A test now requires every step's reasoning to be
  substantive rather than merely present.
- The medians lesson originally implied the three medians are concurrent. The
  source establishes the bisection result, not concurrency, so the lesson now
  states plainly that concurrency is true and not proved here.

## What this audit does not do

It does not review the mathematics for a human. No lesson is reviewed, sent,
adjudicated or published; all six remain `authored_draft`.
