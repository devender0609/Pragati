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

None found in Pragati's runtime infrastructure: the master map, registry,
Student, Teacher, review importer and review packages matched the books on
every page inspected.

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

## Human review questions — 7 open, none of them unread source

- `pragati_iu_g01_ch10_u3` — Seasons of the year: This page is mostly context or general knowledge with light mathematics. Is it worth a Pragati lesson at all?
- `pragati_iu_g02_ch09_u1` — Seasons and the year: This page is mostly context or general knowledge with light mathematics. Is it worth a Pragati lesson at all?
- `pragati_iu_g01_ch13_u2` — Puzzles that need a new kind of reasoning: Is a reasoning-extension puzzle of this kind core Pragati Learn content at this stage, or enrichment offered alongside it?
- `pragati_iu_g01_ch13_u3` — Puzzles that need constraint reasoning: Is a reasoning-extension puzzle of this kind core Pragati Learn content at this stage, or enrichment offered alongside it?
- `pragati_iu_g01_ch13_u4` — Puzzles that reach past Class 1 mathematics: Is a reasoning-extension puzzle of this kind core Pragati Learn content at this stage, or enrichment offered alongside it?
- `pragati_iu_g02_ch11_u5` — Puzzles that need new reasoning: Is a reasoning-extension puzzle of this kind core Pragati Learn content at this stage, or enrichment offered alongside it?
- `pragati_iu_g01_ch08_u6` — Reading a picture for information: These two objectives are each very small for this stage. Should they be one instructional unit or stay separate?
