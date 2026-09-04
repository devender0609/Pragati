# Structure verification backlog — Classes 1, 2, 3, 4, 5, 7, 8

**This is not instructional content backlog. It is human evidence backlog.**

Seven of twelve grades have no official Mathematics structure verified from a
primary source. They therefore produce **zero** entries in the content backlog
— not because they are complete, but because nobody has read their textbooks.

## Why this document exists

The content backlog is a generator over *verified* official records. That is
the right design, and it has an edge that had never been stated:

> A grade whose textbook nobody has read produces zero verified records,
> therefore zero backlog entries, therefore zero planned work.

A reader who sees **"89 official records need work"** on a page titled
Classes 1–12 will reasonably conclude 89 is the Classes 1–12 workload. It is
the workload currently **knowable**. More than half the grades are absent from
it, and the true total is larger by an amount nobody can yet count.

`structureVerificationBacklog.ts` holds this second backlog explicitly, and
`unknownCurriculumCaveat()` supplies the sentence any report quoting a backlog
total must carry.

## The seven grades

| Class | Stage | What to open | Template |
|---|---|---|---|
| 1 | Primary (early) · 1–2 | Prescribed book — confirm the title on the cover | `curriculum-verification/grade1_curriculum_verification.json` |
| 2 | Primary (early) · 1–2 | Prescribed book — confirm the title on the cover | `curriculum-verification/grade2_curriculum_verification.json` |
| 3 | Primary · 3–5 | Prescribed Mathematics textbook | `curriculum-verification/grade3_curriculum_verification.json` |
| 4 | Primary · 3–5 | Prescribed Mathematics textbook | `curriculum-verification/grade4_curriculum_verification.json` |
| 5 | Primary · 3–5 | Prescribed Mathematics textbook | `curriculum-verification/grade5_curriculum_verification.json` |
| 7 | Middle · 6–8 | *Ganita Prakash* Grade 7 — **note whether Part I, Part II or both**. Secondary sources disagree on the total (15 vs 16). | `curriculum-verification/grade7_curriculum_verification.json` |
| 8 | Middle · 6–8 | The NCF-SE aligned Grade 8 book — confirm the title rather than assuming continuity from Grade 7 | `curriculum-verification/grade8_curriculum_verification.json` |

**Record count for all seven: `UNKNOWN`.** Deliberately null, never zero.
Rendering it as zero is the single most misleading thing this file could do.

## The action, per grade

1. Open the **printed or official-PDF** textbook. Not a website chapter list.
2. Copy each chapter title **exactly as the Contents page prints it**. Do not
   tidy, translate or shorten.
3. Sections are optional — but if you record them for a chapter, record **all**
   of them for that chapter.
4. Fill in the edition line and name a real person as verifier.
5. Import through **Pragati → Teacher mode → Admin & Research → Verify a
   curriculum from its textbook**.

The validator refuses gaps in numbering, blank titles, a missing edition line,
and a verifier who is not a person.

## Why no engineering task can substitute

`ncert.nic.in` blocks automated fetch. The templates, the validator and the
patch workflow have existed since **v0.70**. Nothing more is needed and nothing
more should be built.

**The missing input is a person with a book.** Four releases have now added
tooling around this gap instead of closing it.

## What happens on import

The moment a grade becomes `primary_source_verified`, every one of its official
records appears in the content backlog automatically — nobody has to remember
to add them — and it disappears from this file. Both are derived; neither is
maintained by hand.
