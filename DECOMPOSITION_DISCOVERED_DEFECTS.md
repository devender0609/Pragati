# Defects and observations found during decomposition

Current as of checkpoint 3. Everything below is derived from the canonical
dataset; nothing here is typed from memory.

## Defects in Pragati's own infrastructure

None. No defect was found in the curriculum master map, the runtime
registry, Student, Teacher, the review importer or the review packages.
The chapter counts and titles the product renders matched the books on
every page inspected.

## Defects found in the DECOMPOSITION itself, and fixed here

1. **The checkpoint-2 report reversed the per-class unit counts** (it said
   Class 1 had 46 and Class 2 had 44; the data said the opposite). The
   numbers were typed into the report by hand. They are now generated
   from the dataset, and a test compares every reported count with it.
2. **`FULL_PAGE_INSPECTED` promised more than the data proved.** A unit
   spanning four pages could carry that label with one page rendered.
   Evidence is now recorded per page, and the label is derived from the
   ledger rather than asserted.
3. **A partially read chapter could be reported as page-level inspected.**
   `inspectedOfficialRecordIds()` accepted any one unit with evidence.
   An official record is now FULLY_INSPECTED only when its whole extent
   is inspected, and partial progress stays visible as
   PARTIALLY_INSPECTED.
4. **Class 1 Chapter 7 was missing capacity entirely.** Reading the whole
   chapter found three pages on filling a bucket with jugs, glasses and
   bowls and comparing containers. That is a third measurable attribute
   beside length and weight; it is now `pragati_iu_g01_ch07_u4`.
5. **The Class 1 Puzzles classification was wrong in both directions.**
   The first pass called the section rehearsal; checkpoint 2 made it one
   enrichment unit. Reading every page shows three different roles:
   rehearsal (REVIEW), constraint reasoning (`_ch13_u3`), and puzzles
   needing ideas Class 1 has not met — repeated subtraction as division,
   a symbol standing for a value, optimisation (`_ch13_u4`,
   REASONING_EXTENSION, flagged for a human scope decision).

## Open, and honestly open

- **Class 2's puzzle section is UNRESOLVED.** Its pages have not been read
  in full or rendered, so no classification is justified. It is recorded
  as unresolved rather than assumed to mirror Class 1 — which changed
  once its pages were actually read.
- **Class 1 is not source-complete**: 123 of 130 pages inside unit ranges are read, and
  66 of 116 picture-carried pages still need rendering.
- **Class 2 is further behind**: 24 of 132 pages read in full text.
- **Two prerequisites** (counting to 100; money values in rupees) point at
  units that do not exist yet and are written in plain language.

## Historical (superseded, kept for the record)

The checkpoint-1 version of this document said the five chapter tails were
unread and that both Puzzles sections introduced nothing new. Both
statements were superseded by checkpoint 2 and again here; they are
retained only as a record of what was believed at the time.
