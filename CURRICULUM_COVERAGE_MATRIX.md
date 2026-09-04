# Curriculum Coverage Matrix — Classes 1–12 Mathematics

**Version:** v0.72.0 · Generated from `coverageMatrix.ts`, which reads the
registry directly. Nothing below is maintained by hand.

---

## The three truths, kept apart

| | Question | Enforced by |
|---|---|---|
| **1. Official curriculum completeness** | Does the registry hold every official record? | `officialCompleteness.ts` — a hard `validate:curriculum` failure |
| **2. Pragati content completeness** | Is there enough material to actually teach it? | `instructionalCompleteness.ts` |
| **3. Review / publication** | Has a human checked it? May a student see it? | `educatorReview.ts` / `publicationGate.ts` |

Collapsing any two is how a product ends up claiming a chapter is "done"
because a file exists.

**No coverage percentage appears anywhere.** For seven of twelve classes the
denominator is unknown, so a percentage would be computed against Pragati's own
inventory and would report high coverage of a curriculum nobody has read.

---

## The matrix

| Class | Verified | Units | Chapters | Topics | In registry | **Omissions** | Ch. w/ Learn | Topics w/ practice | Complete drafts | Drafts | Reviewed | Student-ready |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | no | UNKNOWN | UNKNOWN | UNKNOWN | — | — | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | no | UNKNOWN | UNKNOWN | UNKNOWN | — | — | 0 | 0 | 0 | 0 | 0 | 0 |
| 3 | no | UNKNOWN | UNKNOWN | UNKNOWN | — | — | 0 | 0 | 0 | 0 | 0 | 0 |
| 4 | no | UNKNOWN | UNKNOWN | UNKNOWN | — | — | 0 | 0 | 0 | 0 | 0 | 0 |
| 5 | no | UNKNOWN | UNKNOWN | UNKNOWN | — | — | 0 | 0 | 0 | 0 | 0 | 0 |
| **6** | **yes** | — | **10** | **65** | **10** | **0** | 1 | 9 | **8** | 9 | 0 | **0** |
| 7 | no | UNKNOWN | UNKNOWN | UNKNOWN | — | — | 0 | 0 | 0 | 0 | 0 | 0 |
| 8 | no | UNKNOWN | UNKNOWN | UNKNOWN | — | — | 0 | 0 | 0 | 0 | 0 | 0 |
| **9** | **yes** | **6** | **15** | **15** | **6** | **0** | 0 | 0 | 0 | 0 | 0 | **0** |
| **10** | **yes** | **7** | UNKNOWN | **15** | **7** | **0** | 0 | 0 | 0 | 0 | 0 | **0** |
| **11** | **yes** | **5** | UNKNOWN | **14** | **5** | **0** | 0 | 0 | 0 | 0 | 0 | **0** |
| **12** | **yes** | **6** | UNKNOWN | **13** | **6** | **0** | 0 | 0 | 0 | 0 | 0 | **0** |

**Zero omissions across all five verified classes.** Every official record —
34 units, 65 Class 6 sections — is represented in the registry, including the
89 that do not yet have complete, reviewed, published instructional coverage.

**v0.74 correction.** This paragraph used to describe all 89 backlog records
as ones holding nothing whatsoever — nine lines below a table showing Class 6
with 9 authored drafts and 8 complete instructional drafts. Both statements were
generated from the same data and contradicted each other. The error was not a
typo: it collapsed five distinct states into one word, and erased eight
complete drafts plus the §7.4 review package built on top of them.

Of the 89:

| State | Records | Next action |
|---|---|---|
| No instructional content at all | 80 | AUTHOR against the production brief |
| Incomplete draft (§7.9) | 1 | AUTHOR: close the named gaps |
| Complete draft, no review package | 7 | ENGINEERING: build the review package |
| Complete draft, review-ready (§7.4) | 1 | PERSON: send to an educator |
| Reviewed | 0 | — |
| Published | 0 | — |

The wording is now derived in `coverageWording.ts` rather than written by hand,
and `assertCoverageWordingConsistent()` fails the suite if any report claims
emptiness the data contradicts — including this file, which is read and checked
by `v074Docs.test.ts`.

`UNKNOWN` is a first-class value (`null`), never rendered as `0`. Class 10's
chapter count is unknown because its syllabus is organised into units and
nobody has read the textbook; several of its topic titles closely resemble
NCERT chapter names, and resembling is not evidence.

---

## Completeness now checks verified section depth

v0.71 proved the ten Class 6 chapters exist. It would **not** have noticed
§7.5 disappearing from Chapter 7: the chapter is still there, and an aggregate
topic total of 65 could be restored by a duplicate elsewhere.

Section counts are now checked **per chapter**:

```
[6, 11, 12, 5, 6, 3, 9, 6, 2, 5]  → 65
```

A test removes one section and asserts the failure names the chapter, so the
message points at the file to open.

Section depth is checked **only where a human read the source that deep** —
Class 6 alone. Demanding a section count for an unread source would either
invent a number or force the gate to be switched off.

---

## Instructional completeness, Class 6 Chapter 7

**8 of 9 sections are complete instructional drafts. 0 reviewed. 0 published.**

| Section | Level | Gap |
|---|---|---|
| 7.1–7.3, 7.5–7.8 | complete instructional draft | — |
| 7.4 | complete instructional draft | — |
| 7.9 A Pinch of History | **incomplete draft** | 1 worked example (needs 2); 2 independent items (needs 3) |

### Applicability is part of the model

A naive checklist fails §7.9 for having no diagram and no interactive item —
and the "fix" would be bolting a quiz about dates onto a discussion section,
making the content worse to turn a number green.

Every requirement can be waived, and **a waiver must carry a reason** that a
reviewer can reject. §7.9's three waivers are recorded in full in
`instructionalCompleteness.ts`, beside the requirements it does satisfy.

### One model bug found and fixed

The first run reported §7.4 — the most thoroughly audited section in the
chapter — as missing misconception support. Its four misconceptions live in the
**frozen §7.4 map**, not the chapter registry, so counting only the registry
produced a false gap. The model was wrong, not the content.

---

## Backlog — 89 official records with no complete, reviewed, published content

| Class | Records | Priority |
|---|---|---|
| Class 6 | 65 | P1 (9 authored) / P2 (56) |
| Class 9 | 6 | P3 |
| Class 10 | 7 | P3 |
| Class 11 | 5 | P3 |
| Class 12 | 6 | P3 |
| **Total** | **89** | 80 need Learn · 80 need practice · **65 will need review** |

**v0.74 correction.** The review column used to read "89 need review". A Class
10 syllabus unit with no verified sections has nothing for an educator to read
— its next action is somebody opening the textbook. Only the 65 plannable
Class 6 section records carry an `educator_review` work item; the other 24
carry `verify_official_structure` instead.

**This is not the Classes 1–12 workload.** Seven grades (1, 2, 3, 4, 5, 7, 8)
produce no backlog entries at all, because their official structure is
unverified — not because they are complete. See
`STRUCTURE_VERIFICATION_BACKLOG.md`. How many official records they hold is
`UNKNOWN`, and rendering that as zero would make more than half of Classes
1–12 look finished.

**Derived, not maintained.** Nothing is listed by hand, so nothing can be
forgotten by being left out of an edit — and the moment a pending class becomes
verified, all of its records appear here without anyone remembering to add
them. A test asserts the count equals the registry's own record count.

---

## What this matrix does not claim

- **Nothing is student-ready.** Zero sections are educator-reviewed and zero
  are published. "Complete instructional draft" means every applicable
  component exists — it says nothing about whether the teaching is good.
- **Seven classes have an unknown official structure.** The gate covers the
  five verified ones; it cannot check a source nobody has read.
- **Classes 9–12 have a verified curriculum and no content.** That is a
  content gap, not a curriculum gap, and every official unit remains listed.
