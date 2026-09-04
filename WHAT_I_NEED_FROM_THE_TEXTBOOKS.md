# What I need from the textbooks

**Seven grades are blocked on one thing: a person with a book.**

Classes 1, 2, 3, 4, 5, 7 and 8 have no verified Mathematics structure. They
contribute **zero** entries to the content backlog — not because they are
complete, but because nobody has read their contents pages. Until that happens,
Pragati cannot say how much work Classes 1–12 actually is.

The tooling has existed since v0.70. **No more software will help.**
`ncert.nic.in` blocks automated fetch, so reading the page by hand is the only
honest route.

---

## For each grade

| Class | Template to fill in |
|---|---|
| 1 | `curriculum-verification/grade1_curriculum_verification.json` |
| 2 | `curriculum-verification/grade2_curriculum_verification.json` |
| 3 | `curriculum-verification/grade3_curriculum_verification.json` |
| 4 | `curriculum-verification/grade4_curriculum_verification.json` |
| 5 | `curriculum-verification/grade5_curriculum_verification.json` |
| 7 | `curriculum-verification/grade7_curriculum_verification.json` |
| 8 | `curriculum-verification/grade8_curriculum_verification.json` |

## What to copy

From the **printed book or the official NCERT PDF** — not a website chapter
list, not a blog summary, not a coaching-site index.

1. **Every chapter number and title**, exactly as the Contents page prints it.
   Do not tidy, translate, shorten or fix perceived typos.
2. **Sections are optional** — but if you record them for one chapter, record
   *all* of them for that chapter. A half-recorded chapter is worse than none,
   because it looks complete.

## Source metadata required

The validator rejects the file without these:

- **Book title** exactly as printed on the cover
- **Edition / reprint year** from the imprint page
- **Verifier name** — a real person, not "team" or "auto"
- **Date inspected**

## Two grades need extra care

- **Class 7** — check whether you have *Part I*, *Part II*, or both. Secondary
  sources disagree on the chapter total (15 vs 16), which is exactly the kind of
  thing that must be settled from the book rather than the internet.
- **Class 8** — confirm the title on the cover. Do not assume it continues the
  Grade 7 series.

## Where it goes

**Pragati → Teacher mode → Admin & Research → Verify a curriculum from its
textbook.** Paste the filled-in template and import.

The validator refuses gaps in numbering, blank titles, a missing edition line,
and a verifier who is not a person.

## What happens then

The moment a grade imports successfully, every one of its official records
appears in the content backlog automatically, and it disappears from this
document. Both lists are derived — nobody has to remember to update either.

**One grade is enough to start.** Class 7 is the highest value: it is Middle
Stage, where an authoring standard already exists, so its records become
plannable immediately rather than waiting behind a standard that has not been
established.
