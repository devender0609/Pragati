# 0.84.0-c11.54 — WIP SAFETY ARCHIVE — **NOT FIRST GREEN**

**NOT FIRST GREEN. Nothing human-reviewed.** FO-8 hardened `fd52d1f5…`
untouched. Memory healthy this session (3812 MB available).

## Implemented

**The chain rule, as ONE new `DerivativeRule`** — `chainRule(id, parts,
excludes)` in `derivative.ts`, built entirely on machinery that existed:

- `compose(g, f)` from `relationsFunctions` — no second composition engine
- `DerivativeRule` — no parallel rule hierarchy
- `ruleAgreesWithFirstPrinciples` — the independent oracle

No symbolic algebra, no expression tree, no simplifier: `3(x²+1)²·2x` is
left as the rule produces it, because a simplifier would be a second
source of mathematical truth.

Also added: `chainComposite` (the composite, for independent checking) and
`chainWorkingAt` (the factors separately, so a lesson can show structure
rather than only an answer).

### Verified

| Check | Result |
|---|---|
| Composition oracle, `(x²+1)³` | **0 mismatches** vs `g(f(x))` computed directly |
| `(x²+1)³` at x=2 | **300** = 3·5²·4 |
| `(3x+2)⁵` at x=1 | **9375** = 5·5⁴·3 |
| `sin(x²)` radians, first principles | **5/5 agree** |
| Identity inner reduces to g′ | **0 mismatches** vs `powerRule(3)` |
| Omitted inner factor | 300 vs 75 — materially different |
| Order g∘f vs f∘g | 300 vs 192 |
| Restricted domain `1/(x−2)` | composite(2) null, derivative(2) null, `inDomain(2)` false, derivative(3) = −1, first principles **4/4** |

`chainWorkingAt(2)` explains the exclusion in words: *"x − 2(2) = 0, which
is outside the domain of 1/u"*.

### A fixture bug I made, and fixed

My first oracle run showed 6 composition mismatches. The chain values were
right; the **composite** was wrong, because `polynomialFunction` takes
coefficients **highest-degree first** (Horner reduce) and I had passed them
lowest-first. Fixtures corrected; the rule was never at fault.

## Open

**First-principles agreement is partial on two fixtures**: `(x²+1)³` 7/8
and `(3x+2)⁵` 2/4. The analytic values are exactly right at every point
checked, so this reads as the oracle's absolute tolerance (1e-3) being too
tight for derivatives of magnitude 300–9375, where a numeric difference
quotient loses precision. **Not yet confirmed** — next session should
verify by relative tolerance before trusting it.

## Not done

Lesson prose (five stages), representation decision and any visual,
catalogue registration, ledgers, targeted suite, regressions, full suite,
browser, preview, public-safe, first-green package.

Counts unmoved: 89 artifacts, 92/93, queue `C11-LIM-FO11`.

Typecheck: **exit 0, diagnostics 0**.
