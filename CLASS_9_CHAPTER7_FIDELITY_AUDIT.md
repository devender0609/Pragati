# Class 9 Chapter 7 — alignment and mathematical-fidelity audit

Probability. 6 lessons, 4 official sections, two splits (§7.1, §7.2), no merges.

| Lesson | Source | Verdict | Notes |
|---|---|---|---|
| `ncert_iemh1_s7_1_random_lesson` | §7.1 (split 1) | **ALIGNED** | Subsection 7.1.1: randomness as knowing the possibilities without predicting the result. Separates randomness from uniformity using the drawing pin. |
| `ncert_iemh1_s7_1_scale_lesson` | §7.1 (split 2) | **ALIGNED** | Subsection 7.1.2: the 0-to-1 scale with impossible and certain at the ends. Shares no explanation with its sibling. |
| `ncert_iemh1_s7_2_experimental_lesson` | §7.2 (split 1) | **ALIGNED** | Subsection 7.2.1: trials counted into a fraction, treated as an estimate. States that the method needs no equal-likelihood assumption. |
| `ncert_iemh1_s7_2_theoretical_lesson` | §7.2 (split 2) | **ALIGNED** | Subsections 7.2.2 and the comparison: fairness established before counting, the unequal spinner as counterexample, and the gambler's fallacy refuted from the mechanism. |
| `ncert_iemh1_s7_3_lesson` | §7.3 | **ALIGNED** | Subsections 7.3.1 and 7.3.2: sample space as a complete list, event as a subset, and the source's own point that the choice of sample space matters. |
| `ncert_iemh1_s7_4_lesson` | §7.4 | **ALIGNED** | Tree enumeration of a two-stage sample space, with probabilities read off only under a stated equal-likelihood model. |

## The Probability Authoring Standard applied

1. **Randomness is not uniformity.** Stated in the first lesson and carried
   through. The drawing pin is random and plainly uneven.
2. **Equal likelihood is established before it is used.** Every use of
   favourable over total is preceded by a statement of what makes the
   outcomes equally likely — fairness, symmetry, thorough mixing — and that
   statement is about the mechanism, never about the number of labels.
3. **A count of outcomes licenses nothing.** The unequal spinner has three
   outcomes and probabilities 1/4, 1/4, 1/2.
4. **Experimental probability is an estimate**, not a fact about the
   mechanism, and two runs are shown giving different values.
5. **Visual symmetry is not evidence.** The tree diagram's branches are
   evenly drawn by convention, and the three-plain-shirts variant gives a
   different probability behind an identical picture.

## Adversarial assumption audit

Every probability statement in the chapter was read against the question
*what assumption makes this true?* Findings:

- **The spinner example** was the deliberate counterexample required by the
  standard. Its figure draws the sectors at the sizes the prose claims — a
  quarter, a quarter, a half — so the picture cannot suggest an equal split
  the mathematics denies.
- **The tree lesson** originally risked implying that counting paths always
  gives probabilities. It now carries a worked case where the diagram is
  unchanged and the answer is 3/4 rather than 1/2.
- **No independence or multiplication rule** appears. The two-stage work is
  enumeration only, which is the Class 9 treatment the source supports; a
  test asserts no conditional-probability or independence language.
- **No convergence promise.** The experimental lesson says more trials give a
  more trustworthy estimate, never that frequency becomes probability.

## The audit tool, and the trap it had to avoid

`probabilityAudit.ts` flags claims that look like they assume equal
likelihood without establishing it, plus values outside [0, 1] and stated
counts that disagree with their fractions. It flags for review; it never
rewrites.

**It caught a false positive on its first run, which was the useful part.**
The scale lesson teaches that a computed probability of 7/4 is an error — a
correct sentence containing an impossible value. A naive range check rejects
it, and an author would learn to write around the tool rather than with it.
The audit now skips a value whose surrounding text marks it as invalid, and
the test suite carries four positive fixtures of honest mathematics that must
pass alongside four negative fixtures that must fail.

## Mechanical defects

None. The three defect classes checkpoint 38 produced at scale — wrong source
pages, thin reasoning, duplicated content — were checked for before alignment
and found absent. Two figure defects were caught during authoring: a
zero-length segment and the unlabelled points, both rejected by the existing
figure validator.

## What this audit does not do

It does not review the mathematics for a human. All 6 lessons remain
`authored_draft`.
