# Classes 1–12 Mathematics Curriculum Completeness Audit

**Version:** v0.68.0 · **Date:** 2026-08-27

---

## The defect this audit responds to

Pragati showed six "chapters" for Class 3 and ten for Class 6. A user could
only read that as a statement about the two curricula. It was not. Class 6 had
been verified against the current NCERT book; Class 3's six rows were an
inventory of Pragati's own legacy modules.

**A missing Pragati lesson was silently deleting an official chapter.**

Two concepts are now permanently separated in the codebase:

| Concept | Meaning | Lives in |
|---|---|---|
| **Official curriculum** | What the current authoritative source says exists | `officialCurriculum.ts` |
| **Pragati coverage** | What Pragati has mapped, authored, reviewed or published | everywhere else |

Neither number may determine the other. This is enforced by
`checkRegistryInvariants()` and by the tests in `v068Curriculum1to12.test.ts`.

---

## The master table

**Learn / Practice / Reviewed / Published are Pragati counts. Official
units/topics are curriculum counts. They are independent.**

| Class | Current authoritative source | Official units | Official topics | In Pragati | Learn | Practice | Reviewed | Published | Registry status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Joyful Mathematics (NCERT) | **UNKNOWN** | **UNKNOWN** | 0 | 0 | 0 | 0 | 0 | pending primary verification |
| 2 | Joyful Mathematics (NCERT) | **UNKNOWN** | **UNKNOWN** | 0 | 0 | 0 | 0 | 0 | pending primary verification |
| 3 | Maths Mela (NCERT) | **UNKNOWN** | **UNKNOWN** | 0 | 0 | 0 | 0 | 0 | pending primary verification |
| 4 | Maths Mela (NCERT) | **UNKNOWN** | **UNKNOWN** | 0 | 0 | 0 | 0 | 0 | pending primary verification |
| 5 | Maths Mela (NCERT) | **UNKNOWN** | **UNKNOWN** | 0 | 0 | 0 | 0 | 0 | pending primary verification |
| 6 | Ganita Prakash, Grade 6 (NCERT) | **10** | **65** | 1 | 1 | 1 | 0 | 0 | primary source verified |
| 7 | Ganita Prakash, Grade 7 (NCERT), Parts I & II | **UNKNOWN** | **UNKNOWN** | 0 | 0 | 0 | 0 | 0 | pending primary verification |
| 8 | Ganita Prakash, Grade 8 (NCERT), Part I | **UNKNOWN** | **UNKNOWN** | 0 | 0 | 0 | 0 | 0 | pending primary verification |
| 9 | Mathematics Class IX — CBSE Curriculum 2026-27 | **6** | **15** | 0 | 0 | 0 | 0 | 0 | primary source verified |
| 10 | Mathematics Class X — CBSE Curriculum 2026-27 | **7** | **15** | 0 | 0 | 0 | 0 | 0 | primary source verified |
| 11 | Mathematics Class XI — CBSE Curriculum 2026-27 | **5** | **14** | 0 | 0 | 0 | 0 | 0 | primary source verified |
| 12 | Mathematics Class XII — CBSE Curriculum 2026-27 | **6** | **13** | 0 | 0 | 0 | 0 | 0 | primary source verified |

**5 of 12 grades verified, covering 34 official units. The remaining 7 have an
unknown number of official units — not zero.**

`UNKNOWN` is a first-class value in the code (`null`), not a rendering of `0`.
`officialUnitCount()` returns `null`, the teacher table prints the word
"Unknown" in amber, and a test asserts that an unverified grade cannot report a
count at all.

---

## What was newly verified in v0.68

### Classes IX–XII — CBSE Academic Unit, Curriculum 2026-27

`cbseacademic.nic.in` serves automated clients. All four documents were
retrieved and read on **2026-08-27**.

**Class IX** — 6 units, 15 chapters. The syllabus is redesigned against NEP 2020
and NCF-SE 2023 and reproduces curricular goals CG-1..CG-11 verbatim. Unusually
for CBSE, it prints an explicit chapter-name column, so both unit and chapter
levels are transcribed.

| Unit | Title | Chapters | Marks |
|---|---|---|---|
| I | Number System | Number System | 7 |
| II | Algebra | Introduction to Polynomials; Sequences and Progressions; Exploring Algebraic Identities; Linear Equations in Two Variables | 20 |
| III | Coordinate Geometry | Coordinate Geometry | 4 |
| IV | Geometry | Introduction to Euclid's Geometry; Lines and Angles; Triangles – Congruence Theorems; 4-gons (Quadrilaterals); Circles | 25 |
| V | Mensuration | Area and Perimeter; Surface Area and Volume | 14 |
| VI | Statistics and Probability | Statistics; Introduction to Probability | 10 |

**Class X** — 7 units, 15 content topics (subject codes 041 and 241). This
document does *not* print a separate chapter-name column, so topic titles are
transcribed from the content column.

| Unit | Title | Topics | Marks |
|---|---|---|---|
| I | Number Systems | Real Numbers | 6 |
| II | Algebra | Polynomials; Pair of Linear Equations in Two Variables; Quadratic Equations; Arithmetic Progressions | 20 |
| III | Coordinate Geometry | Coordinate Geometry | 6 |
| IV | Geometry | Triangles; Circles | 15 |
| V | Trigonometry | Introduction to Trigonometry; Trigonometric Identities; Heights and Distances | 12 |
| VI | Mensuration | Areas Related to Circles; Surface Areas and Volumes | 10 |
| VII | Statistics and Probability | Statistics; Probability | 11 |

**Class XI** — 5 units, 14 summative topics. The document additionally lists
topics assessed *formatively only*; those are noted rather than dropped, and are
not counted as summative units.

**Class XII** — 6 units, 13 topics. Prescribed books: Mathematics Part I and
Part II for Class XII, NCERT.

---

## What could NOT be verified, and why

`ncert.nic.in` disallows automated access via robots.txt. Every attempt in this
iteration was refused, and **no attempt was made to circumvent it.**

Secondary sources agree on the *textbook titles* — Joyful Mathematics for
Classes 1–2, Maths Mela for 3–5, Ganita Prakash for 6–8 — and those titles are
recorded as secondary corroboration.

**Secondary agreement is not evidence.** v0.51 demonstrated this precisely: for
Class 7 independent sources actively contradict each other on whether the book
has 15 or 16 chapters, and for Class 6 they happened to agree, which felt like
confirmation and was not — the real verification came later from the primary
document and it was the primary document that settled it.

So Classes 1–5, 7 and 8 carry `official_structure_pending_verification` with a
**null** unit count. Not zero. Not an estimate. Not inherited from the pre-NCF
books that Pragati's legacy modules were built against.

Class 8 has a second open question the audit records rather than resolves:
Part I is corroborated (First Edition July 2025, Reprint 2026-27), but whether a
Part II exists for 2026-27 is itself unestablished.

### The manual step, written down so it is actionable

> Open the current NCERT textbook PDF for this grade in a browser, read the
> Contents page, and record each chapter number and exact title. Then set status
> to `primary_source_verified` with the inspection date and the verifier name.

This is stored on each pending record as `manualVerificationStep`, and a test
asserts every pending grade has one — a gap with no stated remedy is not a gap
anyone will close.

---

## §G — why each class shows fewer units than its source

The audit refuses to call all differences errors. Three genuinely different
situations were found:

| Reason | Classes | What it means |
|---|---|---|
| `legacy_module_inventory_only` | 1, 2, 3, 4, 5, 7, 8 | The rows Pragati holds are legacy internal modules, not units of the current official curriculum. They must not be presented as official chapters. |
| `no_pragati_coverage` | 9, 10, 11, 12 | The official structure is verified. Pragati has no content at all. This is an honest, visible gap. |
| `partial_pragati_coverage` | 6 | Verified structure; content for some of it (Chapter 7 only). |

Class 3 (never read) and Class 10 (read, no content) look identical in a naïve
chapter count and are completely different problems. A test asserts they carry
different labels.

---

## §H — legacy content preserved, not deleted

No legacy module was removed. `CHAPTER_CATALOGUE` retains all 76 rows across the
twelve grades and continues to carry its existing disposition classifications
(`exact_current_alignment`, `partial_current_alignment`, `pending_relevel`,
`supplementary_candidate`, `requires_rewrite`, `obsolete_pending_review`,
`evidence_insufficient`).

What changed is that legacy rows are no longer *presented as* the official
curriculum. For an unverified grade the student is told the chapter list is not
ready; they are not shown six internal module names dressed as Class 3
Mathematics.

---

## §E / §F — what the two audiences now see

**Students**, for a verified grade: the complete official chapter list in source
order, with `Ready to learn` / `Practice` / `Continue` / `Not available yet` per
chapter. Class 10 shows all seven official chapters, all marked not available —
they do not vanish. Availability is derived from the same eligibility policy the
teacher surfaces read, so a student and their teacher cannot be told different
things.

For an unverified grade: *"The chapter list for this class is not ready yet. It
will appear here once it is."* No governance vocabulary reaches a student — a
test asserts that no student-facing string in any of the twelve grades contains
`primary_source_verified`, `pending_verification`, `authored_draft`, `unmapped`
or `legacy`.

**Teachers**: the master table above, rendered in the Admin & Research →
Curriculum route. **No percentages anywhere**, and a test enforces it. For seven
of twelve grades the denominator is unknown, so any percentage would be computed
against Pragati's own inventory and would report 100% coverage of a curriculum
nobody has read.

---

## §C — no placeholder content was created

34 official units are now known across five verified grades. Pragati represents
**one** of them. That ratio is the honest state of the product and the registry
exists to make it visible, not to be filled in.

A test asserts that verified units exceed 30 while covered units remain below 5,
so a future iteration cannot quietly satisfy the numbers with shallow
placeholder lessons.

---

## §I — Class 6 remains the instructional pilot

Class 6 Fractions is still the only chapter being deeply authored and reviewed.
This registry work established structure and coverage truth for the other
grades; it authored no lessons. A test asserts Class 6 is the only grade with
any Learn or Practice coverage at all, and that no grade is reviewed or
published.

---

## What this audit does not claim

- It does not claim Classes 1–5, 7 and 8 have few chapters. It claims their
  chapter count is unknown.
- It does not claim the CBSE transcriptions are complete to sub-topic depth
  beyond what the documents enumerate.
- It does not claim any mapping between an official unit and Pragati content has
  been reviewed by an educator. None has.
- For Class 6, section depth (65 sections) is primary-verified; for Classes 9–12
  the topic lists come from the syllabus document, which is authoritative for
  assessment but is not the textbook's own contents page.
