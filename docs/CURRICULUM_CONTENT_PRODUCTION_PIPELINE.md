# Curriculum Content Production Pipeline

**Written:** 2026-08-24 (v0.61 §5)

A Pragati instructional unit moves through five stages. **A unit may not
skip a stage, and "content exists" never means "content complete."**

Each numbered step maps to a status value in
`src/curriculum/contentStatus.ts`. The statuses are independent axes —
completing step 9 does not advance step 11.

---

## A. Source

| # | Step | Gate |
| :--- | :--- | :--- |
| 1 | Current primary official source located | `source_located` |
| 2 | Exact source inspected | `primary_inspected` |
| 3 | Version / academic year recorded | — |
| 4 | Official unit / chapter recorded | `official_unit_recorded` |

**Step 2 is the one that gets skipped.** For seven iterations Pragati
recorded Class 6 as blocked because one URL returned HTTP 503. A
different URL on the same host served the whole textbook. Before
recording a source as unavailable, exhaust the access paths — the
publisher's archive, the chapter bundle, the catalogue page — and record
*which* paths were tried.

Secondary corroboration is **not** step 2. Multiple secondary sources
agreeing is not evidence; Class 7 demonstrated this directly, where
independent sources disagree on whether the book has 15 or 16 chapters.

---

## B. Mapping

| # | Step | Gate |
| :--- | :--- | :--- |
| 5 | Existing Pragati module mapping assessed | `mapping_pending` → `mapped` |
| 6 | Competency mapping reviewed | — |
| 7 | Prerequisites reviewed | `mapping_reviewed` |

Mapping types: `exact`, `partial`, `combined`, `split`, `obsolete`,
`unmapped`.

**Map at section level, not chapter level.** Chapter-level mapping
recorded Pragati's `fractions` module as `exact` against Ganita Prakash
Chapter 7. Section-level mapping showed it covers 5 of 9 sections. The
coarser grain did not merely lose detail — it produced a false
statement.

Step 6 must use the **correct NCF-SE stage**: Middle Stage goals
(CG-1..CG-10) for Classes 6–8, Secondary Stage (CG-1..CG-11) for 9–12.

---

## C. Content

| # | Step | Gate |
| :--- | :--- | :--- |
| 8 | Lesson outline drafted | `lesson: authored_draft` |
| 9 | Explanation authored | ↑ |
| 10 | Worked examples authored | `workedExamples: draft` |
| 11 | Mathematical visuals specified / created | `visuals: concept_specific` |
| 12 | Misconceptions documented | — |
| 13 | Guided practice authored | `guidedPractice: draft` |
| 14 | Independent practice authored | `independentPractice: draft` |
| 15 | Mixed / application practice authored | `mixedApplicationPractice: draft` |
| 16 | Teacher resources authored | `teacherResources: draft` |
| 17 | Unit check defined where appropriate | `unitCheck: blueprint_draft` |

Model-generated text enters at `generated_draft`, which sits **below**
`authored_draft` on the same axis and can never be published. Generation
is a starting point for an author, not a substitute for one.

---

## D. Review

| # | Step | Gate |
| :--- | :--- | :--- |
| 18 | Mathematical accuracy review | `lesson: math_reviewed` |
| 19 | Curriculum alignment review | `lesson: curriculum_reviewed` |
| 20 | Language / readability review | — |
| 21 | Age-stage review | — |
| 22 | Visual review | `visuals: mathematically_reviewed` |
| 23 | Educator review | `lesson: educator_reviewed` |

**Step 23 requires a practising teacher of that grade.** It cannot be
performed by the author, by a maintainer, or by a model. No Pragati unit
has passed it.

---

## E. Publication

| # | Step | Gate |
| :--- | :--- | :--- |
| 24 | Approved for student use | all axes `published` |
| 25 | Versioned and published | — |

`isPublishedForStudents()` is conjunctive across every axis. A published
lesson with placeholder visuals is not a published unit, and the failure
is loud by design.

---

## What this pipeline forbids

- Authoring units before the official structure is primary-verified
  (v0.61 §9 — and the "seven missing chapters" claim shows why: the
  real answer was five wholly missing and four partial, with zero
  complete).
- Deriving one status from another.
- Counting a Pragati module as official coverage before step 5.
- Reporting a completeness percentage where the official unit count is
  unknown. `completenessRecord.ts` returns `null` and a reason, not a
  number.
