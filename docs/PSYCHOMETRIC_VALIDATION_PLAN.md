# Pragati — Psychometric Validation Plan

**Status: PLAN ONLY. None of the twelve stages below has been carried
out. Pragati has no calibrated item, no validated scale, and no norms.**

This document exists so that the work required to make measurement
claims is written down before anyone is tempted to make them. Its most
important function is to record what has *not* happened.

---

## Current state, stated plainly

| Asset | Status |
| :--- | :--- |
| Item difficulty values | Author judgement on a 1–10 scale. Not empirical. |
| Ability estimate | Heuristic ±1 walk. No scale, no interpretation. |
| Standard error | Not computable. Reported as `null`, deliberately. |
| Item parameters | None. |
| Field-test data | None. |
| Calibration sample | None. |
| Norms | None. Must not be borrowed from any other product. |
| Dimensionality evidence | None. |
| DIF analysis | None. |
| Growth scale | None. |

Consequently Pragati may not report: percentile, national percentile,
grade equivalent, grade level, true ability, calibrated growth,
projected score, mastery, or any norm-referenced statement.

---

## Item parameter schema (for future calibration)

Recorded per Growth item once field-test data exists. Defined now so
items are authored with calibration in mind.

| Field | Notes |
| :--- | :--- |
| `itemId` | Stable, never reused. |
| `competencyId` | From the competency framework, not the chapter. |
| `gradeExposureRange` | Grades where administration is permitted. |
| `format` | See item-type architecture. |
| `fieldTestStatus` | not_tested / in_field_test / analysed / retired |
| `calibrationSampleSize` | n, with composition described. |
| `calibrationSampleDescription` | Who these students were. Essential for judging generalisability. |
| `model` | e.g. 1PL / 2PL / 3PL / GPCM. Chosen by fit, not preference. |
| `difficulty` | b. Null until estimated. |
| `discrimination` | a, where the model includes it. |
| `guessing` | c, where justified. Not assumed. |
| `fitStatistics` | Infit/outfit or equivalent. |
| `difFlags` | By gender, language medium, locale, board. |
| `exposureRate` | Proportion of administrations. |
| `retirementStatus` | active / rested / retired, with reason. |
| `calibrationVersion` | Which calibration run produced these values. |

**Empty parameter fields must stay empty.** A plausible-looking number
in a `difficulty` column is worse than a null, because downstream code
will use it.

---

## The twelve stages

### 1. Expert item review
Mathematics educators and curriculum experts review every item for
correctness, curricular alignment, and stage appropriateness.
*Exit:* every item reviewed by ≥2 experts; disagreements resolved.

### 2. Cognitive labs / student interviews
Small-n think-alouds confirming items elicit the intended reasoning
rather than test-wiseness or reading ability.
*Exit:* each item specification represented; item revisions applied.

### 3. Pilot
Small-scale administration for usability, timing, and instructions.
*Exit:* completion rates and timing acceptable; no systematic confusion.

### 4. Field test
Administration at scale to gather response data. Items are
`growth_field_test`, never operational, and results are never reported
to students or teachers as scores.
*Exit:* sufficient responses per item across a defensible sample.

### 5. Calibration
Estimate item parameters. Model choice justified by fit, not
convenience.
*Exit:* parameters estimated; convergence documented.

### 6. Dimensionality evaluation
Does one Mathematics dimension hold, or do domains separate? This
determines whether a single score is defensible at all.
*Exit:* dimensionality reported; scale structure decided by evidence.

### 7. Item-fit analysis
Identify misfitting items. Misfit means revise or retire — never
retain-and-ignore.
*Exit:* fit reported for all items; poor items removed.

### 8. Fairness / DIF review
Differential item functioning by gender, language medium, urban/rural,
state board, and socio-economic proxy where available. Flagged items
reviewed substantively by experts, not removed mechanically.
*Exit:* DIF analysed and documented; biased items removed.

### 9. Linking / equating
Establish comparability across forms, windows, and (for a vertical
scale) grades. This is what makes cross-grade growth statements
possible; without it, growth cannot be claimed.
*Exit:* linking design executed and evaluated.

### 10. Reliability / precision
Report reliability and conditional standard error across the scale —
precision is not uniform, and it is usually worst at the extremes,
exactly where decisions are most consequential.
*Exit:* precision documented; reporting claims limited to what it
supports.

### 11. Growth-scale evaluation
Determine whether score differences across windows are interpretable as
growth, and what difference exceeds measurement error.
*Exit:* growth interpretation supported, or **the growth claim is
dropped**. This outcome is acceptable and must remain on the table.

### 12. Norming
Only after stages 1–11, and only with a sample representative of the
intended Indian population — across states, boards, languages,
urban/rural, and school types.

**Norms may never be borrowed from another product.** Norms from a
different population describe that population, and applying them to
Indian students would produce confident, wrong statements about
children.

*Exit:* norms published with sample composition, date, and limitations.

---

## Fairness commitments

- Language medium is a fairness variable, not a display option.
- Reading load is a Mathematics-assessment threat; items are reviewed
  for it.
- Device and bandwidth differences must not affect measured
  performance.
- No high-stakes decision about a child on uncalibrated output.

---

## Governance

- No stage may be marked complete without an artefact — data, report,
  or reviewed document.
- Any claim in the product must trace to a completed stage.
- Where evidence is absent, the interface says so rather than staying
  silent, because silence reads as confidence.

---

## What would falsify the approach

Recorded deliberately, because a plan that cannot fail is not a plan:

- Dimensionality shows Mathematics does not form one usable scale at
  these ages → single-score reporting is abandoned.
- Precision is too low for within-year change → the growth claim is
  dropped and Pragati is described as a diagnostic.
- DIF is pervasive across language media → the multi-language design is
  reconsidered before release.
- Teachers cannot act on domain-level reports → the reporting model is
  redesigned regardless of psychometric quality.
