# Structure Verification Backlog — Classes 1–12

**Generated** from the curriculum master map (`src/curriculum/curriculumMasterMap.ts`) at version 0.83.3. Do not hand-edit: the test suite compares this file to the model on every run.

---

**11 of 12 classes are complete at structure level. 1 is not: Class 9.**

Complete at structure level means: the current book was identified from
the NCERT portal, its current printing was read from the imprint, and
every chapter and every numbered section the source defines was read
from the primary document. It does NOT mean the mathematical intent of
each section has been inspected — that happens per section, before
authoring.

## Hierarchy by class

| Class | Source | Units | Chapters | Sections | Sub-sections | Topics | Structure status |
|---|---|---|---|---|---|---|---|
| Class 1 | NCERT textbook: Joyful Mathematics | — | 13 | — | — | — | COMPLETE AT STRUCTURE LEVEL |
| Class 2 | NCERT textbook: Joyful Mathematics | — | 11 | — | — | — | COMPLETE AT STRUCTURE LEVEL |
| Class 3 | NCERT textbook: Maths Mela | — | 14 | — | — | — | COMPLETE AT STRUCTURE LEVEL |
| Class 4 | NCERT textbook: Math-Mela | — | 14 | — | — | — | COMPLETE AT STRUCTURE LEVEL |
| Class 5 | NCERT textbook: Math-Mela | — | 15 | — | — | — | COMPLETE AT STRUCTURE LEVEL |
| Class 6 | NCERT textbook: Ganita Prakash | — | 10 | 65 | — | — | COMPLETE AT STRUCTURE LEVEL |
| Class 7 | NCERT textbook: Ganita Prakash (Part I + Part II) | — | 15 | 65 | — | — | COMPLETE AT STRUCTURE LEVEL |
| Class 8 | NCERT textbook: Ganita Prakash (Part I + Part II) | — | 14 | 58 | — | — | COMPLETE AT STRUCTURE LEVEL |
| Class 9 | CBSE syllabus: Mathematics, Class IX — CBSE Curriculum 2026-27 | 6 | 15 | — | — | 15 | primary source verified |
| Class 9 | NCERT textbook: Ganita Manjari (Part I) | — | 8 (Part I only; class total UNKNOWN) | 53 (Part I only; class total UNKNOWN) | UNKNOWN | — | PARTIAL — see finding F1 |
| Class 10 | CBSE syllabus: Mathematics, Class X — CBSE Curriculum 2026-27 | 7 | — | — | — | 15 | primary source verified |
| Class 10 | NCERT textbook: Mathematics | — | 14 | 55 | 2 | — | COMPLETE AT STRUCTURE LEVEL |
| Class 11 | CBSE syllabus: Mathematics, Class XI — CBSE Curriculum 2026-27 | 5 | — | — | — | 14 | primary source verified |
| Class 11 | NCERT textbook: Mathematics | — | 14 | 63 | — | — | COMPLETE AT STRUCTURE LEVEL |
| Class 12 | CBSE syllabus: Mathematics, Class XII — CBSE Curriculum 2026-27 | 6 | — | — | — | 13 | primary source verified |
| Class 12 | NCERT textbook: Mathematics (Part I + Part II) | — | 13 | 65 | — | — | COMPLETE AT STRUCTURE LEVEL |

The in-app curriculum registry agrees with the master map for every class.

## Open structure evidence

| Class | Source | Level | State |
|---|---|---|---|
| Class 9 | Ganita Manjari (Part I) | subsection | partially enumerated — count UNKNOWN |

## Findings to resolve or accept

- **F1_class9_book_vs_syllabus** (Class 9, unresolved) — The CBSE Class IX syllabus 2026-27 prescribes "Mathematics - Textbook for class IX - NCERT Publication" and names 15 chapters. The NCERT portal currently lists only "Ganita Manjari" (Textbook of Mathematics for Grade 9, Part I; First Edition April 2026) with 8 chapters. No Part II is listed. The syllabus chapter names are NOT asserted to correspond to Ganita Manjari chapters, and the textbook denominator for Class 9 remains UNKNOWN until Part II is published or NCERT states Part I is complete.
- **F2_class6_registry_pages** (Class 6, data_defect_reported_not_fixed) — 43 of 65 Class 6 section start pages in officialSections.ts differ from the printed folio in the Reprint 2026-27 chapter PDFs (e.g. §7.4 recorded p.160; printed p.159, confirmed by the page folio and the typesetting file name). Titles and numbering all match. Not corrected: Class 6 records are preserved and §7.4 is frozen. The master map shows both values.
- **F3_cbse_xii_title** (Class 12, corrected) — The runtime registry transcribed CBSE Class XII Unit III topic 4 as "Applications of the Integrals". The 2026-27 syllabus prints "Application of the Integrals". Corrected in the registry.
- **F4_part_ii_numbering** (all classes, note) — Ganita Prakash Grade 7 Part II and Grade 8 Part II restart chapter numbering at 1. Chapters are therefore identified by book part as well as number; "Class 7 Chapter 1" is ambiguous without the part.
- **F5_class4_title_variant** (Class 4, note) — Class 4 Chapter 3 is "Pattern Around Us" on the contents page and "Patterns Around Us" on the chapter opening page. The contents-page title is recorded; the variant is noted. Other differences observed were capitalisation only (Class 4 Ch 8, Class 5 Ch 14).
- **F6_class9_subsections** (Class 9, unknown) — Ganita Manjari prints numbered sub-sections (N.M.K) in Chapters 3, 6, 7 and 8. Text extraction found 22 of them with visible gaps in numbering, so the sub-section count is UNKNOWN rather than 22.
- **F7_summary_sections** (all classes, note) — Class 10 numbers "Summary" as a section in most chapters; those are recorded as printed and flagged as non-instructional so they do not inflate the authoring backlog.
- **F8_no_chapter_body_crosscheck_10_12** (all classes, limitation) — For Classes 10-12 chapters and sections were read from the contents pages of the current Reprint 2026-27 prelims. Chapter bodies were not downloaded or cross-checked in this phase.

## Intent inspection backlog

| Class | Authoring records | Page-level intent inspected | Not yet inspected |
|---|---|---|---|
| Class 1 | 13 | 0 | 13 |
| Class 2 | 11 | 0 | 11 |
| Class 3 | 14 | 0 | 14 |
| Class 4 | 14 | 0 | 14 |
| Class 5 | 15 | 0 | 15 |
| Class 6 | 65 | 12 | 53 |
| Class 7 | 65 | 0 | 65 |
| Class 8 | 58 | 0 | 58 |
| Class 9 | 53 | 0 | 53 |
| Class 10 | 41 | 0 | 41 |
| Class 11 | 63 | 0 | 63 |
| Class 12 | 65 | 0 | 65 |

Structure verified is not the same claim as intent inspected. A section
must have its primary pages read before any lesson is authored for it —
the rule learned from Number Play.
