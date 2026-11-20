# 0.84.0-c11.46r — WIP SAFETY ARCHIVE 2 — **NOT FIRST GREEN**

**NOT FIRST GREEN. NOT hardened. NOT human-reviewed.** The full suite is
RED. This archive exists so the governance work survives a container reset.

## Complete

**GD-2** (see WIP archive 1) and now **GD-1**, both recomputed from durable
data rather than replayed from the lost reports.

The dependency cascade was re-derived: **RF-FO2 is the only one of the nine
with a downstream dependent** (`C11-LIM-FO11`, itself required under the
same migration), so it alone becomes `REQUIRED_PREREQUISITE`; the other
eight become `REQUIRED_CORE`.

- Instructional: **90 REQUIRED_CORE, 3 REQUIRED_PREREQUISITE, 0 OPTIONAL**
- Assessment unchanged: **80 / 13**, summativeEligible exactly 80
- Required denominator **93**; coverage **90 / 93**; orphans **0**
- Five ledgers regenerated from canonical data
- Chapter matrix: all summative complete; required-incomplete only at 8, 11, 12
- `GOVERNANCE_DEBT.json`: GD-1 and GD-2 RESOLVED, history preserved

## NOT done — the known red work

- **Stale regressions not yet rewritten.** The full suite will fail on
  assertions written against the pre-migration world: ownership tests,
  chapter row counts, `optional enrichment` policy claims, and the
  placement test that guarded the duplication defect.
- Preview smoke, public-safe, first-green packaging: not run.

Typecheck: **0**. Focused governance checks: verified by hand this session,
formal policy suite not yet rebuilt.
