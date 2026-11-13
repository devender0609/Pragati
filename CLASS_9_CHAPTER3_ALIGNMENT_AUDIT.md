# Class 9 Chapter 3 — alignment and mathematical audit

The World of Numbers. **8 lessons from 9 units.** §3.1 unauthored and blocked;
§3.7 dispositioned REVIEW at checkpoint 31.

| Lesson | Source | Verdict | Notes |
|---|---|---|---|
| `ncert_iemh1_s3_2_lesson` | §3.2 | **ALIGNED** | Zero as placeholder versus zero as number, Brahmagupta's rules, and both division failures kept distinct. |
| `ncert_iemh1_s3_3_lesson` | §3.3 | **ALIGNED** | Integers via 3-5, debt-and-fortune for sums, and the distributive argument for negative times negative. |
| `ncert_iemh1_s3_4_arith_lesson` | §3.4 (split 1) | **ALIGNED** | Rationals as p/q with q non-zero tied back to §3.2, equivalent names, lowest terms, signed arithmetic. |
| `ncert_iemh1_s3_4_density_lesson` | §3.4 (split 2) | **ALIGNED** | Number line placement, distance as |a-b|, density by averaging, and density explicitly distinguished from completeness. |
| `ncert_iemh1_s3_5_proof_lesson` | §3.5 (split 1) | **ALIGNED** | The contradiction proof in four named stages, with the odd-squared step proved rather than asserted. |
| `ncert_iemh1_s3_5_construct_lesson` | §3.5 (split 2) | **ALIGNED** | Exact construction of root 2 on the line, pi as a second irrational, exactness kept apart from approximation. |
| `ncert_iemh1_s3_6_decimals_lesson` | §3.6 (split 1) | **ALIGNED** | Terminating and repeating decimals explained by the finiteness of remainders; conversion back by multiply-and-subtract. |
| `ncert_iemh1_s3_6_cyclic_lesson` | §3.6 (split 2) | **ALIGNED** | The 142857 rotations, the two-way rationality test, and the real line completed. |

## §3.1 did not leak

The tempting way to finish a chapter with a blocked opening is to move its
material into the next lesson. A test searches every authored Chapter 3 lesson
for the §3.1 subjects — the Ishango bone, tally marks, the chapter's opening
narrative — and finds none. §3.2 opens on place value, which is its own
mathematics.

The unit itself is untouched: still present, still `NEEDS_HUMAN_CHECK`, still
keyed to `historical_material_lesson_vs_context`, still pointing at
`ncert_iemh1_s3_1`.

## Progression care

Class 8 already met root 2 and non-terminating decimals. **What Class 9 adds is
the proof**, and the §3.5 lesson says so in its opening paragraph — "you have
met root 2 before, and you have seen its decimal run on". A test asserts the
lesson never claims irrationality or reasoning is new.

## Mathematical audit — the specific risks

| Risk | How it was handled |
|---|---|
| "non-terminating means irrational" | Confronted directly with 1/3 as a counterexample; the two-way test is stated as *terminates or repeats*, and a test asserts the phrase appears |
| `=` where `≈` belongs | No lesson writes root 2 = 1.414 or pi = 3.14; the construction lesson contrasts the exact point with 1.414² = 1.999396, and a test forbids the equalities |
| Proof reduced to algebra | The four stages are named — assumption, consequence, contradiction, conclusion — and the odd-squared-is-odd step is proved separately rather than assumed |
| Density mistaken for completeness | Stated explicitly at the end of §3.4 and again in §3.5: being dense is not filling the line |
| Sign rules as convention | The distributive argument is written out; a Think deeper asks what else would break if the rule were different |
| Division by zero as one case | The two failures are kept separate: no candidate for 7/0, every candidate for 0/0 |

No radical manipulation appears in these units, so no radical-expression audit
was needed; adding one would have been a validator with nothing to check.

## Mechanical gates — clean

Source pages verified against the canonical records before alignment (the
checkpoint-38 defect class). Zero wrong pages, zero thin reasoning steps, zero
duplicated hints or goals. All **104 learning goals** across the repository
remain distinct.

## What this audit does not do

It does not review the mathematics for a human. All 8 lessons remain
`authored_draft`.
