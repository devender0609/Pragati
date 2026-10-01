# Decomposition defect log

Four categories, kept apart on purpose: an **architecture defect** is a fault
in Pragati's model; a **source discrepancy** is the book disagreeing with
itself or with our record; a **decomposition judgement** is a call we made
about splitting or scoping; a **human review question** is a curriculum
decision nobody has made yet.

## Architecture defects — all RESOLVED

| Defect | Found | Resolved |
|---|---|---|
| Digest-only evidence (headings and opening text) treated as page inspection | checkpoint 1 | checkpoint 2 — per-unit evidence depth |
| `FULL_PAGE_INSPECTED` claimed on one rendered page of a multi-page unit | checkpoint 2 | checkpoint 3 — per-page evidence ledger; depth derived, never asserted |
| A part-read chapter counted as `page_level_inspected` | checkpoint 2 | checkpoint 3 — record-level states; FULLY_INSPECTED needs the whole extent |
| Per-class unit counts typed by hand and reversed in the report | checkpoint 2 | checkpoint 3 — figures generated, with a consistency test |
| `ncert_bejm1_ch11_puzzles`: an invented NCERT id | checkpoint 3 | checkpoint 4 — source segments in `pragati_srcseg_*`; official-id validation test |
| Class 2 Chapter 5 missing from `recordExtents`, denominator read 10 of 11 | checkpoint 3 | checkpoint 4 — extents generated from the master map |
| Pages inside a chapter but outside every unit went unaccounted | checkpoint 3 | checkpoint 4 — every page has a unit or a segment, with a test |
| Six Class 2 segments still said "pages not yet read" inside a class declared source-complete | checkpoint 5 review | checkpoint 6 — segments re-read and resolved; a test forbids an unread-source justification where evidence is complete |
| Class 2 Chapter 6 printed extent read 51–27: a Project Work answer (30 − 17 = 27) was taken for a folio | checkpoint 5 review | checkpoint 6 — folio detection restricted to the outer bottom margin and cross-checked against neighbours; page 21's folio read as **70** from the rendered page; inverted-range test added |
| A generated note claimed 130 of 121 picture-carried pages seen | checkpoint 5 review | checkpoint 6 — the note is built from the structured values, and a test rejects any number in it that is not one of them |
| Two retained segments still carried `sourceEvidence.establishes = "Pages not yet read…"` while their evidence was complete | checkpoint 6 review | checkpoint 7 — text rewritten from the pages; the stale-wording test now reads every evidence-bearing field, not only `justification` |
| Two retained segments kept `sourceLabel` ranges from the ranges they used to span ("pages 9-12" for a one-page segment) | checkpoint 6 review | checkpoint 7 — generated labels derive from the pdf range, with a flag marking labels that are real book headings |
| Class 1 Chapter 13's rehearsal pages were a whole-record `NonInstructionalRecord` inside a chapter with four units | checkpoint 6 review | checkpoint 7 — migrated to `pragati_srcseg_g01_ch13_rehearsal`; a gate requires a non-instructional record to span a whole record with no units |
| The overlap audit checked only unit-to-unit while the report implied it was comprehensive | checkpoint 6 review | checkpoint 7 — `overlapAudit()` covers units, segments and non-instructional records, and every pair must carry a written reason |
| `overlapAudit()` used `A.reason ?? B.reason`, so a merge note written about a third object could be attached to any pair involving A | checkpoint 7 review | checkpoint 8 — justifications are keyed by both ids; tests require one per detected pair and reject orphans |
| `recordIsCovered()` treated any source segment as whole-record instructional coverage | checkpoint 7 review | checkpoint 8 — split into `recordSourceIsAccountedFor` (page accounting) and `recordHasInstructionalDisposition` (units, or a whole record judged to produce none); the gap report uses the second |
| A superseded draft unit, `pragati_iu_g01_ch13_u2`, survived the checkpoint-5 split into `_u3` and `_u4` and duplicated their pages | checkpoint 8 (found by the pair-reason work) | checkpoint 8 — removed, its mirror-symmetry and matchstick ideas folded into `_u3` |

None found in Pragati's runtime infrastructure: the master map, registry,
Student, Teacher, review importer and review packages matched the books on
every page inspected.

## Status-model defects found in checkpoint 9 — all RESOLVED in checkpoint 10

| Defect | Found | Resolved |
|---|---|---|
| Evidence-incomplete Class 3 units were classified `NEEDS_HUMAN_CHECK`, turning missing renders into a pretend review queue (33 flagged, 4 real questions) | checkpoint 9 review | checkpoint 10 — status derived by `derivedStatusFor()`; a test requires complete evidence AND a named question for review |
| `humanReviewStatus: flagged_for_review` was used for missing visual evidence | checkpoint 9 review | checkpoint 10 — an evidence-incomplete unit must be DRAFT and `not_reviewed` |
| `recordInspectionState()` could report `INDEXED_ONLY` for a chapter whose whole text had been read, when no page yet met the full bar | checkpoint 9 review | checkpoint 10 — any full-text evidence makes a record at least PARTIALLY_INSPECTED; tested |
| `pagesUnresolved` read 0 for Class 3 while 107 picture-carried pages were unseen | checkpoint 9 review | checkpoint 10 — `pagesFullTextPending`, `visualPagesPending` and `pagesEvidenceIncomplete` reported separately |

## Metadata and reporting defects found in checkpoint 10 — all RESOLVED in checkpoint 11

| Defect | Found | Resolved |
|---|---|---|
| `hardeningClassification` stayed on as a second current status and contradicted `decompositionStatus` on 33 units | checkpoint 10 review | checkpoint 11 — verdicts moved to dated `auditHistory`; the field is gone and a test forbids its return |
| The Class 3 audit hard-coded a checkpoint-9 sentence saying the class was not source-complete, directly under its own SOURCE_COMPLETE line | checkpoint 10 review | checkpoint 11 — the completion wording is derived from `classProgress`; a test forbids a complete class being described as incomplete |
| The Class 3 audit listed source segments and units from Classes 1-2 | checkpoint 10 review | checkpoint 11 — both generators filter by class; tests assert no cross-class ids appear |
| "Visual seen" counted every rendered page against the visual-required denominator, giving rows like 20 seen of 17 required | checkpoint 10 review | checkpoint 11 — seen counts only required-and-inspected pages, with "Pages rendered" reported separately; a test requires seen ≤ required and equality for FULLY_INSPECTED |

## Checkpoint-12 review findings — all RESOLVED in checkpoint 13

| Defect | Found | Resolved |
|---|---|---|
| Legacy `pagesUnresolved` remained in current canonical state beside the precise fields that replaced it | checkpoint 12 review | checkpoint 13 — removed from data, type and tests; no alias replaces it; a test asserts its absence |
| The Classes 1-2 audit ledger still selected source segments negatively (`!includes('cemm1')`), so Class 4 segments fed its internal ledger | checkpoint 12 review | checkpoint 13 — all four generators consume `scopeFor(d, [n])`; no `includes` filter remains in any generator |
| The Class 4 audit ledger took every `nonInstructional` record rather than its own class's | checkpoint 12 review | checkpoint 13 — same scope helper covers units, segments, non-instructional records and extents |
| Completed-class regression protection compared unit counts only, so an objective, page range or status could change unnoticed | checkpoint 12 review | checkpoint 13 — `decompositionFingerprint(n)` hashes the canonical fields and page ledger; Classes 1-4 are locked to their checkpoint-12 values |
| Five Class 4 units carried one identical generic question, presented as five independent judgements | checkpoint 12 review | checkpoint 13 — a shared `humanJudgementPolicyKey` names the one decision, and each question names that unit's own material |

## Checkpoint-15 review findings — RESOLVED in checkpoint 16

| Defect | Found | Resolved |
|---|---|---|
| My narrative summary said Class 6 was 38 READY / 4 flagged while the canonical data and the generated report said 37 / 5. The data was right; the hand-typed summary was wrong | checkpoint 15 review | checkpoint 16 — `tools/emitCheckpointSummary.mjs` derives every status count into `CHECKPOINT_STATUS_COUNTS.json`, and tests check both the file against the dataset and the checkpoint report against the file |
| The interim Class 6 audit said "0 picture-carried pages still to render" while 231 pages were unread and so had no visual classification yet | checkpoint 15 review | checkpoint 16 — the wording now says the figure covers the pages inspected so far and that the unread pages' visual requirement is not yet determined; a test forbids the old phrasing for any class with unread pages |

## Checkpoint-14 review findings — all RESOLVED in checkpoint 15

| Defect | Found | Resolved |
|---|---|---|
| The Class 6 audit generator still identified the book as Maths Mela | checkpoint 14 review | checkpoint 15 — it names Ganita Prakash; a test forbids the old name |
| It claimed Class 6 had 14 chapters and numbered no sections | checkpoint 14 review | checkpoint 15 — it states 10 chapters holding 65 numbered sections; tests forbid both false claims |
| `chaptersTotal` carried the section denominator (65) while `officialChapterCount` was 10 | checkpoint 14 review | checkpoint 15 — `chaptersTotal` counts chapters again; `officialSectionsTotal`, `chaptersFullyInspected/PartiallyInspected/IndexedOnly` and `sectionsAccountedFor/NotYetInspected` are separate fields |
| The audit consequently printed "0/65 chapters" | checkpoint 14 review | checkpoint 15 — it prints chapters and sections as two denominators; a test forbids "/65 chapters" |
| Fractions was described as a decomposed, fully inspected chapter while its evidence showed 35/50 text and PARTIALLY_INSPECTED | checkpoint 14 review | checkpoint 15 — pages 36-50 read and rendered; the chapter now derives FULLY_INSPECTED from evidence, and a test derives that state rather than asserting it |
| The Fractions solutions pages 36-50 were DIGEST_ONLY inside the record extent | checkpoint 14 review | checkpoint 15 — inspected in full. Reading them showed page 36 is the chapter **Summary**, not solutions, so the segment was split: p36 SUMMARY, pp37-50 REFERENCE |

## Checkpoint-13 review findings — all RESOLVED in checkpoint 14

| Defect | Found | Resolved |
|---|---|---|
| The checkpoint-13 report and progression audit claimed all 18 flagged units shared one policy; only 8 carried a key and the questions described three different decisions | checkpoint 13 review | checkpoint 14 — policies are canonical (`humanJudgementPolicies`), every flagged unit carries a key, and a test requires the report to state flags and distinct decisions separately |
| The defect log still headed a section "Human review questions — 7 open", naming superseded unit ids | checkpoint 13 review | checkpoint 14 — that section is marked HISTORICAL with the checkpoint it was true at, and points to the canonical policies for current state |
| Progression was recorded only as free text inside `notes` | checkpoint 13 review | checkpoint 14 — `progressionRelationship` (a controlled vocabulary of seven values) plus `progressionRationale`, migrated from the 66 Class 5 notes; unknown is left unset rather than invented |
| Classes 1-4 fingerprints changed in this checkpoint — **deliberately** | checkpoint 14 | The policy key and the progression fields are inside the fingerprint, so adding them changed all five values. The new values were frozen before any Class 6 work began, and the tests carry them. |

## Class 5 (checkpoint 13)

**No methodology defect.** The locked method carried over to Class 5 without
change, and text and visuals were inspected in the same chapter pass.

**No source discrepancy.** All 15 Math-Mela chapter titles, order and extents
matched the canonical records.

## Class 4 (checkpoint 12)

**No methodology defect.** The locked method carried over to Math-Mela without
change. One reporting defect was found and fixed in the same checkpoint: the
Classes 1-2 audit generator excluded Class 3 by name (`!includes('cemm1')`)
rather than selecting its own books, so the 14 new Class 4 chapters leaked into
it the moment they existed. Both audits now select their own books positively,
and the test that counts 24 chapters caught it.

**No source discrepancy.** All 14 Math-Mela chapter titles, order and extents
matched the canonical records.

## Class 3 (checkpoint 9)

**No methodology defect.** The locked Classes 1-2 method carried over to
Maths Mela without change: canonical chapter ids only, per-page ledger from
page one, full-text then visual inspection, whole-record completion gate,
Pragati units and segments kept out of the `ncert_*` namespace.

## Source discrepancies

None. Printed folios, chapter extents and titles matched the master map
across all 268 pages of Classes 1 and 2.

## Decomposition judgements made from the completed evidence

- **Class 1 Chapter 7 was missing capacity** — three pages of filling a
  bucket with jugs, glasses and bowls. Added as a unit.
- **Class 1 Chapter 4 was missing comparing and ordering to 20**, and
  **Chapter 5 was missing the hidden-dots part-whole work and backward
  hops**. Added.
- **Class 1 Puzzles split three ways**: rehearsal (REVIEW segment),
  constraint reasoning, and puzzles needing ideas Class 1 has not met
  (repeated subtraction as division, a symbol standing for a value,
  fewest coins).
- **Class 2 Puzzles resolved from its own pages** — not from Class 1. It
  also holds both kinds: rehearsal, and reasoning extension (a number
  trick with an invariant, systematic path and rectangle counting, an
  equal-sum constraint, cutting a 6 m cloth into 1 m pieces).
- **Class 2 additions the first pass missed**: comparing and ordering
  two-digit numbers; ordinal position and numbers as labels; growing
  patterns; checking someone else's working; balancing one object
  against another; capacity and scaling a recipe; commutativity of
  multiplication; elapsed time; choosing to maximise a total.

## What the stale segments were hiding

Four of the six were obsolete: their pages had since been taken up by units,
so they were removed and page coverage still equals the chapter extent. Two
were real and are now classified from the pages — Class 2 Chapter 7 page 79
as PRACTICE (comparing two bags and the kinds of balance people use), and
Chapter 11 page 16 as NON_INSTRUCTIONAL (a blank Notes page). Two teaching
objectives were recovered from inside them: **growing patterns** in Chapter 4
and **money left or still needed** in Chapter 10.

## Human review questions (HISTORICAL — true at v0.84.0 checkpoint 5)

The list below is kept as history. It describes the seven questions open when
Classes 1 and 2 were the whole dataset, and several of the unit ids in it were
superseded by later splits. **For the current state see the checkpoint report
and `humanJudgementPolicies` in the canonical data**, which at checkpoint 14
hold 18 flagged units under 3 distinct policy decisions.

### The original seven — 7 open, none of them unread source

- `pragati_iu_g01_ch10_u3` — Seasons of the year: This page is mostly context or general knowledge with light mathematics. Is it worth a Pragati lesson at all?
- `pragati_iu_g02_ch09_u1` — Seasons and the year: This page is mostly context or general knowledge with light mathematics. Is it worth a Pragati lesson at all?
- `pragati_iu_g01_ch13_u2` — Puzzles that need a new kind of reasoning: Is a reasoning-extension puzzle of this kind core Pragati Learn content at this stage, or enrichment offered alongside it?
- `pragati_iu_g01_ch13_u3` — Puzzles that need constraint reasoning: Is a reasoning-extension puzzle of this kind core Pragati Learn content at this stage, or enrichment offered alongside it?
- `pragati_iu_g01_ch13_u4` — Puzzles that reach past Class 1 mathematics: Is a reasoning-extension puzzle of this kind core Pragati Learn content at this stage, or enrichment offered alongside it?
- `pragati_iu_g02_ch11_u5` — Puzzles that need new reasoning: Is a reasoning-extension puzzle of this kind core Pragati Learn content at this stage, or enrichment offered alongside it?
- `pragati_iu_g01_ch08_u6` — Reading a picture for information: These two objectives are each very small for this stage. Should they be one instructional unit or stay separate?
