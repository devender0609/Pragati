# 0.84.0-c11.51 — WIP SAFETY ARCHIVE (repaired tree) — **NOT FIRST GREEN**

**NOT FIRST GREEN. Full QA not yet run. Nothing human-reviewed.**
Supersedes the stale WIP `874519b6…`, which predates every repair below.
The hardened FO-10 base `da7b503f…` is untouched.

## Complete

- **FO-8 mathematics** — three closed forms on the `CountResult`
  bigint-and-refusal idiom; `exactSumOf` a separate BigInt path; the
  Number-returning `sumOf` untouched
- **Five-stage lesson authored**, every number derived: figures 21, 91, 441,
  and 441 = 21² demonstrates the cube identity in the authored data
- **`special_sum` family** — spec, validator, union, dispatcher, renderer
- **Chapter-less registration** under `cbse_fo8_c11_special_sums`
- **Ledgers regenerated** from canonical coverage

**Typecheck 0.** Counts reconcile: 89 artifacts · 92/93 · formative 12/13 ·
buckets 82/1/6/89 · Chapter 8 rows 7 · 0 duplicates · 0 orphans. Queue is
`C11-LIM-FO11` alone; incomplete chapters 12 only.

## Two defects repaired, one diagnosis corrected

**The earlier "duplicated figures block" diagnosis was WRONG.** There was a
pre-existing `sumVal` helper for GP growth, and the new FO-8 helper
collided with its name — one declaration each, not two copies. The repair
was renaming the FO-8 helper to `specialTotal`; **the GP helper is
untouched**. Had the earlier deletion marker matched, it would have
destroyed working GP code.

**Chapter 8 spread the whole module** (`[...C11_SEQ_SECTIONS]`), so once
FO-8 joined it the lesson showed as chapter-owned AND in the chapter-less
group — 90 artifacts, 1 duplicate. Chapter 8 now lists only what it owns.

## Not done

Focused FO-8 suite, sequence regressions, representation contract,
all-family (expect 19), full repository suite, browser walk,
Finish/persistence, preview, public-safe, first-green packaging.
