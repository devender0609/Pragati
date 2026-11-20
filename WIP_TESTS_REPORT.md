# 0.84.0-c11.46r — WIP SAFETY ARCHIVE 3 — **NOT FIRST GREEN**

**NOT FIRST GREEN. NOT hardened. NOT human-reviewed.** The full suite is
RED. Packaged so the recovered governance survives a container reset.

## Recovered and verified from the durable base

GD-2 and GD-1 are both complete and were **recomputed, not replayed**:

- coverage **90 / 93**, uncovered exactly SEQ-FO8 / 3DG-FO10 / LIM-FO11,
  **0 orphans, 0 blank keys** — the 8 shared source keys were read from the
  data, and differ from the examples quoted in the handoff
- catalogue **82 / 1 / 4 / 87**, chapters 2/3/4 at **5 / 7 / 6**, **0 duplicates**
- instructional **90 REQUIRED_CORE / 3 REQUIRED_PREREQUISITE / 0 OPTIONAL**
- assessment unchanged **80 / 13**, summativeEligible exactly 80
- five ledgers regenerated; `GOVERNANCE_DEBT.json` GD-1 and GD-2 RESOLVED
  with history preserved
- `class11Coverage.ts` rebuilt: four source kinds, throw on unknown

Typecheck **0**.

## Remaining red: stale regressions

The full suite reports **41 failures**, of which **~11 are the §A2
state-document comparisons** — regenerated in this archive, not hand-edited,
since those files are emitted from the model.

The rest are the hand-rewrite work, in the four known classes:

1. **denominators** — chapter-owned 85 → 82, chapter rows, required 1 → 4
2. **policy claims** — `formative-only and optional enrichment` is now wrong
3. **false ownership** — `are all authored under Chapter 2`
4. **defect-guarding** — `placed last in the chapter`, which protected the
   append that caused the duplication and must be replaced, not inverted

Also to rebuild: the independence-test witness (the old contrasting pair now
shares both statuses), the `try/finally` preview-flag fix, and the stray-id
allowance for historical route ids.

## Next session

Rewrite those by meaning, reach green, then package the official
first-green governance archive. Do not author FO10 until that closes.
