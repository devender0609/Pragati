# Class 9 Chapter 11 — alignment and algorithmic-fidelity audit

Algorithms. 4 lessons, 3 official sections, one split (§11.3), no merges.

| Lesson | Source | Verdict | Notes |
|---|---|---|---|
| `ncert_iemh2_s11_1_lesson` | §11.1 | **ALIGNED** | Column addition written as an algorithm with its four parts, and its cost compared with counting under a stated rule. Carries the source's point that cost follows digits, not value. |
| `ncert_iemh2_s11_2_lesson` | §11.2 | **ALIGNED** | Subsections 11.2.1–11.2.3: divisors by testing candidates, two lists compared, assembled into the first gcd algorithm. Plants the divisor-pairing observation the next lesson uses. |
| `ncert_iemh2_s11_3_improve_lesson` | §11.3 (split 1) | **ALIGNED** | Subsections 11.3.1 and 11.3.2: the single-pass improvement and the running value, each judged for correctness first and cost second. |
| `ncert_iemh2_s11_3_euclid_lesson` | §11.3 (split 2) | **ALIGNED** | Subsection 11.3.3: Euclid's subtraction algorithm and its division refinement, with two pairs chosen to expose input dependence. |

## The Algorithmic Reasoning Standard applied

Four things are kept apart throughout, because prose collapses them so easily:

1. **Correctness** — does the procedure give the right answer?
2. **Cost** — how much of *what* does it take?
3. **One input** — what happened in this case?
4. **General claim** — what holds across inputs?

Every comparison in the chapter names both its input and its counting rule.
The §11.3 improvement lesson asks *"still correct?"* before *"cheaper?"* on
each change, and one of its changes — keeping a running value instead of a
list — is deliberately **not** an improvement under the test-count measure.
That is the lesson, not an oversight: a change can improve one cost and leave
another untouched, so the measure is part of the claim.

## Adversarial claim audit

Every comparative sentence was read against *what evidence makes this true
beyond this one example?* Findings:

- **The Euclid lesson's two pairs are the core evidence.** On 48 and 18 the
  two forms take 4 steps and 3; on 100 and 3 they take 35 and 2. The chapter
  shows the input dependence rather than asserting it, and then declines to
  conclude a universal result from two pairs.
- **No optimality claim anywhere.** The strongest statement in the chapter is
  that across the pairs tested the division form never did worse, explicitly
  labelled evidence rather than proof.
- **No runtime language.** Nothing is said to run faster on a computer; the
  source counts steps informally and so does Pragati.
- **No complexity theory.** No Big-O, no asymptotic labels, no pseudocode — a
  test asserts their absence.

## Trace fidelity

Every gcd and every step count asserted in the lessons is **recomputed in the
test suite** from working implementations of the three procedures:

| Pair | gcd | Subtraction steps | Division steps |
|---|---|---|---|
| 48, 18 | 6 | 4 | 3 |
| 100, 3 | 1 | 35 | 2 |
| 60, 45 | 15 | 3 | 2 |
| 91, 7 | 7 | 12 | 1 |

Divisor-list costs are checked the same way: 120 candidate tests for 84 and
36, 105 for 60 and 45, 70 for 50 and 20. A further test requires each of
those figures to appear in the authored prose, so a corrected trace cannot
silently diverge from the lesson that quotes it.

## The audit tool, and the two false positives it produced

`algorithmAudit.ts` flags claims that generalise beyond their evidence,
comparisons that do not name their input, and "more efficient" with no measure
named. It flags for review and never rewrites.

Its first run produced **six findings, all false positives**, in two classes
that were both worth fixing properly:

1. **Challenged claims.** *"Does this mean the division form is always
   faster?"* and *"one example cannot show a method is always faster"* contain
   the overclaim's wording because they are the chapter refuting it. The audit
   now skips a sentence that questions or negates the claim it quotes.
2. **Inputs named as numbers.** *"On 100 and 3 the subtraction form took 35
   steps while the division form took 2"* is exactly the honest form the
   standard asks for. The audit recognised `on this input` but not `on 100 and
   3`, and an audit that flagged it would have taught authors to write vaguer
   prose.

One genuine catch remained after those fixes: a sentence citing 33 and 35
steps whose input was named only in the preceding sentence. **The lesson was
reworded to name the pair in the sentence itself rather than loosening the
audit** — the better prose and the stricter validator were the same fix.

Six positive fixtures of honestly scoped comparison now sit beside five
negative fixtures of overclaiming.

## Mechanical defects

None. Source-page provenance, reasoning depth and duplicate content were all
checked before alignment, per the checkpoint-38 lesson. All 94 learning goals
across the repository remain distinct.

## What this audit does not do

It does not review the mathematics for a human. All 4 lessons remain
`authored_draft`.
