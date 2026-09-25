# Defects discovered during page-level decomposition

Recorded, not silently fixed. The v0.83.5 infrastructure is locked; a
defect found here is reported so you can decide.

## None affecting the locked infrastructure so far

Classes 1 and 2 were read at page level (24 chapters, 192 pages). No
defect was found in the curriculum master map, the runtime registry, the
Student or Teacher surfaces, the review importer or the review packages.
The chapter counts and titles rendered by the product matched the books
on every page inspected.

## Observations that are not defects, but are worth your attention

1. **Two chapters in each class run past the pages read.** Class 1
   chapters 6 and 8, and Class 2 chapters 6, 8 and 9, were read only as
   far as pages 68, 92, 59, 90 and 105 respectively. Their final units
   are `DRAFT_DECOMPOSITION` and flagged for a second pass. This is an
   incomplete reading, not a source problem.

2. **Some Class 1 and 2 material is mathematically thin.** Class 1
   chapter 10's seasons pages and Class 2 chapter 9's season/festival
   pages carry classification and cyclic sequence and little else. They
   are recorded as `GUIDED_APPLICATION` rather than dropped, because the
   book teaches them there, but they should not be given the same
   authoring weight as, say, regrouping.

3. **Two prerequisites could not be resolved to a unit yet** — counting
   to 100 and money values in rupees, both referenced from Class 2 before
   the unit that teaches them has been identified. They are recorded in
   plain language rather than as invented unit ids, exactly as §18 allows
   for the first pass.

4. **The "Puzzles" pages at the end of Class 1 chapter 13 and Class 2
   chapter 11** are enrichment: they rehearse taught material and
   introduce nothing new. Recorded as non-instructional with the pages,
   so they are neither lost nor counted as authoring targets.
