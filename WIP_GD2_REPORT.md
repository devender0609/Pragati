# 0.84.0-c11.46r — WIP SAFETY ARCHIVE 1 — **NOT FIRST GREEN**

## This is not a release

**NOT FIRST GREEN. NOT hardened. NOT human-reviewed.** The full suite is
expected RED: this archive exists only so that substantial unfinished work
survives an ephemeral container, which is exactly what was lost after
checkpoints 99, 99B and 99C.

## What is complete

**GD-2 redone and verified from the durable base.** The audit baseline
reconciled first: 93 units, 80/13 assessment, human-check 0, 87 artifacts,
90 covered, 3 uncovered, 0 orphans, 0 blank coverage keys.

Three CBSE-only artifacts no longer claim an NCERT chapter. The correction
was confirmed narrow against the durable data — `officialSectionId`,
`sectionNumber` and `startPage` were already truthful; `officialChapterId`
was the single false field.

| Unit | Before | After |
|---|---|---|
| C11-RF-FO2 | `ncert_kemh1_ch02` | `cbse_fo2_c11_composition` |
| C11-TRG-FO3 | `ncert_kemh1_ch03` | `cbse_fo3_c11_general_solutions` |
| C11-CPX-FO5b | `ncert_kemh1_ch04` | `cbse_fo5b_c11_complex_quadratics` |

The legacy chapter appends — which displayed each lesson last inside its
old chapter — were removed, since with chapter-less placement they showed
each lesson twice.

**Catalogue: 82 / 1 / 4 / 87**, invariant holding, 0 duplicates. Chapters
2/3/4 at 5/7/6 rows. `class11Coverage.ts` rebuilt with all four source
kinds and throw-on-unknown.

## What is NOT done

- **GD-1 status migration: not started.** All nine units remain
  `OPTIONAL_ENRICHMENT`.
- Five durable ledgers: not regenerated.
- Stale regressions: not rewritten. The full suite is red.
- Preview, public-safe, first-green packaging: not run.

## Failing gates

The full repository suite has **not been run** at this point and is
expected to fail on catalogue-ownership and chapter-row assertions written
against the pre-correction world. Typecheck is **0**.
