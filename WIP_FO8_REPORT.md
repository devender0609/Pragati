# 0.84.0-c11.51 — WIP SAFETY ARCHIVE — **NOT FIRST GREEN**

**Typecheck is RED. The tree is broken. Nothing human-reviewed.** Packaged
before any repair, because the model work inside is expensive to reproduce
and a red typecheck is the reason to snapshot, not a reason to delay.

The hardened FO-10 base `da7b503f…` is untouched.

## Implemented and independently verified

**The FO-8 special-sum mathematics.** Closed forms for Σk, Σk² and Σk³,
built on the `CountResult` bigint-and-refusal idiom from `counting.ts`
rather than a new convention.

- oracle agrees with explicit summation for **all three kinds, n = 1..20,
  0 mismatches** — the oracle walks terms as BigInt and never calls
  `specialSum`, so agreement is evidence, not a tautology
- cube identity `Σk³ = (Σk)²` exact at n = 1, 2, 5, 10, 37, 100
- `2Σk = n(n+1)` exact and `n(n+1)(2n+1)` divisible by 6 for n ≤ 50
- n = 1 gives 1 for all three
- n = 10⁷ cubes is a 28-digit integer — Number cannot hold it
- refusals: n = 0, negative, fractional, NaN, Infinity, lower bound ≠ 1

The Number-returning `sumOf` is untouched; `exactSumOf` is a separate
BigInt path with the type boundary stated, not coerced.

**The `special_sum` visual family**: spec type, `specialSumFigure`,
validator, VisualSpec union, dispatcher case, renderer and
`data-visual-kind`. Shows sigma, expansion, closed form and exact total as
four views of one derived value. The validator recomputes and refuses
drift, and refuses a cube description that does not say the closed form is
the square of the natural-number sum.

`indexed_sequence` was rejected because it carries `approaches` — a limit —
and these sums are finite; `method_comparison` is typed to grouped
distributions.

## Broken

**`sequencesClass11Sections.ts` holds a DUPLICATED figures block.**
`sumVal` is declared twice (around lines 74 and 98). Cause: a mutation
script wrote the file successfully and then failed later in the same run,
so the failure was misread as "no change" and the script was re-run.

**Typecheck: RED.** Also incomplete:

- FO-8 lesson prose unwritten — no five-stage content, no distractors
- catalogue registration not done; counts still 88 / 91 of 93
- ledgers not regenerated; no suite, browser walk, preview or public-safe

## Next

Package this, then: delete the duplicate by **reading the file**, not by a
guessed marker; typecheck to 0 BEFORE authoring prose; then the lesson,
registration, ledgers, suite, and first-green package.
