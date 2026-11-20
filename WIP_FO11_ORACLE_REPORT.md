# 0.84.0-c11.55 — WIP SAFETY ARCHIVE — **NOT FIRST GREEN**

**NOT FIRST GREEN. Nothing human-reviewed.** FO-8 hardened `fd52d1f5…`
untouched. Supersedes `b6f933c6…`.

## The oracle question is settled — and my hypothesis was wrong

Last session I guessed the comparison tolerance (1e-3) was too tight for
large derivatives. **It wasn't.** Measurement first, before any change:

| Case | x | analytic | numeric | abs err |
|---|---|---|---|---|
| (x²+1)³ | −2 | −300 | −299.999998 | 2.0e−6 |
| (x²+1)³ | 2 | 300 | 299.999998 | 2.0e−6 |
| (3x+2)⁵ | 0 | 240 | 239.999999 | 1.0e−6 |
| (x²+1)³ | 3 | 1800 | **DOES NOT EXIST** | — |
| (3x+2)⁵ | 1 | 9375 | **DOES NOT EXIST** | — |

Where a value exists, agreement is **7e−9 relative** — comfortably inside
1e-3. The comparison was never reached. The failures are the shared
`limitOf` declaring the limit NON-EXISTENT: it tests left-vs-right
agreement on an **absolute 1e-4**, and at its widest offset (1e-2) a steep
function's one-sided secant slopes differ by far more than that through
ordinary truncation error.

**Classification: `ORACLE_LIMIT_SETTLING_DEFECT`** — not the comparison
tolerance, not the finite-difference step as such, and **not the chain
rule**, whose arithmetic was correct throughout.

### The fix, scoped deliberately

The shared routine is **left alone**. Its absolute settling test is right
for the limit lessons, where "these values do not settle" is the thing
being taught, and loosening it would weaken every existing derivative
check to accommodate one unit's fixtures.

Instead a **local** `chainAgreesWithFirstPrinciples` measures the
derivative with a symmetric difference (error falls as h² rather than h)
and compares on `absErr <= absTol + relTol × max(|expected|, |actual|)`,
which stays strict near zero.

### Controls — the fix does not weaken verification

| Control | Result |
|---|---|
| (x²+1)³ correct | **8/8 agree**, worst relative 2.9e−10 |
| (3x+2)⁵ correct | **4/4 agree**, worst relative 1.8e−9 |
| Omitted inner factor | rejected at 5 of 6 points (x=0 is genuinely 0 = 0) |
| (3x+2)⁵ without the 3 | **rejected 0/4** |
| Near-zero, +1e−3 at x=0 | **rejected** |
| sin(x²) radians | 5/5, undegraded |
| Identity inner | still reduces exactly to `powerRule(3)` |

## Also complete

**The `chain_rule` visual family**, justified by a real gap: the existing
derivative lessons are prose plus a limit table, and a limit table shows a
quotient settling, not a composite's two layers. Wired in one checkpoint —
spec, validator, VisualSpec union, dispatcher, renderer,
`data-visual-kind`, representation family `derivative:notation` →
`chain_rule`.

The validator recomputes: it rejects a product that isn't the two factors,
and **rejects a figure whose product equals the outer derivative alone**
(the dropped inner factor) unless the inner derivative is genuinely 1.
It also requires the description to name both layers and say they are
multiplied, since a screen reader cannot see nesting or primes.

**FO-11 source and figures**, CBSE-only under
`cbse_fo11_c11_chain_rule` — no NCERT chapter, empty section, page 0.
Both figures validate with hand-checked values: 75 × 4 = 300 and
3125 × 3 = 9375.

Typecheck **exit 0, diagnostics 0**.

## Not done

Five-stage lesson prose, catalogue registration, ledgers, targeted suite,
regressions, full suite, browser, preview, public-safe, first-green
package. Counts unmoved at 89 / 92-of-93.
