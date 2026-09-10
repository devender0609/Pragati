# Manual Curriculum Verification — Classes 1–5, 7 and 8

**For:** anyone who can open an NCERT textbook and read its Contents page.
**Not for:** developers only. Nothing here requires editing code.
**Time:** about 15 minutes per class.

---

## Why this is a human job

Pragati verified Classes 6, 9, 10, 11 and 12 automatically. It cannot verify
the other seven, because `ncert.nic.in` disallows automated access in its
`robots.txt`, and Pragati does not circumvent that.

Secondary websites do list these chapters. **Do not use them for the final
count.** For Class 7 independent sources actively contradict each other — some
say 15 chapters, some say 16 — and for Class 6 several agreed with each other
while all being unchecked. Agreement between sources that copied one another is
not evidence.

So the chapter list stays `UNKNOWN` until a person reads the book. Unknown is
recorded as unknown, never as zero, and Pragati will keep saying so on every
teacher screen until this is done.

---

## What you need

- The **current** NCERT Mathematics textbook for the class, in print or as the
  official PDF from `ncert.nic.in/textbook.php` opened in a normal browser.
- Pragati, in **Teacher mode → Admin & Research → Verify a curriculum from its
  textbook**.

---

## The five steps, for every class

### 1. Open the right book

| Class | Book to open | What to confirm on the title page |
|---|---|---|
| 1 | **Joyful Mathematics** | That it is the NCF-aligned book, not the older *Math-Magic* |
| 2 | **Joyful Mathematics** | Same — *Math-Magic* is the superseded book |
| 3 | **Maths Mela** | Not *Math-Magic* |
| 4 | **Maths Mela** | Not *Math-Magic*. Confirm a 2025 or later edition |
| 5 | **Maths Mela** | Not *Math-Magic*. Confirm a 2025 or later edition |
| 7 | **Ganita Prakash, Grade 7** | Whether there is a **Part I and Part II**, and whether you have both |
| 8 | **Ganita Prakash, Grade 8** | Whether a **Part II** exists for 2026-27 — this is genuinely unresolved |

The book titles above are corroborated by secondary sources. **They are a
starting point, not a fact.** If the book in your hand has a different title,
record what it actually says and note the discrepancy — you have found something
more important than the chapter list.

### 2. Confirm the edition

Find the imprint page, usually the second or third page. Copy the edition line
**exactly**, for example:

> First Edition April 2025, Reprint 2026-27

This is how a second person confirms they are holding the same book. A chapter
list without an edition line cannot be checked by anyone else.

### 3. Read the Contents page

Copy **every chapter, in order**, with:

- its **number**
- its **exact title**, including punctuation and capitalisation as printed

Do not tidy, translate, expand or shorten a title. If the book says
*"A Peek Beyond the Point"*, that is the title — not *"Decimals"*.

**Sections are optional.** If you also record a chapter's sections, record all
of them for that chapter. Recording three of nine sections is worse than
recording none, because Pragati would then report nine sections as three rather
than as unknown.

### 4. Enter it

In Pragati: **Teacher mode → Admin & Research → Verify a curriculum from its
textbook**.

1. Pick the class.
2. Press **Insert blank template**.
3. Fill it in. It looks like this:

```json
{
  "grade": "class7",
  "officialBookTitle": "Ganita Prakash, Grade 7",
  "academicYear": "2026-27",
  "edition": "First Edition April 2025, Reprint 2026-27",
  "source": "printed copy, school library",
  "verifier": "A. Sharma",
  "inspectionDate": "2026-08-28",
  "chapters": [
    { "number": 1, "title": "Large Numbers Around Us", "page": 1 },
    { "number": 2, "title": "Arithmetic Expressions", "page": 25 }
  ],
  "notes": "Part II not held; chapters above are Part I only."
}
```

4. Press **Check this submission**.

The checker will tell you about: a missing or duplicated chapter number, a gap
in the numbering, a blank title, a missing edition line, a date that is not a
real date, and a verifier field that is not a person's name.

**`"verifier": "admin"` is rejected.** Verification is attributable or it is not
verification — if the chapter list turns out to be wrong, someone has to be able
to ask who read it.

**A numbering gap is the single most likely real mistake**, because it usually
means a page was turned two at a time. If the book genuinely skips a number, say
so in `notes` and it will be accepted.

### 5. Commit it, and check the result

When the checker shows a green panel, it prints the exact record it would
create. **It does not save it.**

That is deliberate. Curriculum evidence is committed to the repository so a
second person can check it against the book. A verification that lived only in
one browser's local storage would be the weakest link in a system built entirely
on auditable evidence.

Send the validated JSON to whoever maintains the repository. Once it is
committed, confirm the rendered result:

- **Teacher → Admin & Research → Curriculum** — the class should now show a real
  chapter count instead of *Unknown*, and *Not yet available* should equal the
  full chapter count, since Pragati has no lessons for these classes.
- **Student → Learn**, for that class — the complete official chapter list should
  appear, every chapter marked *Coming soon*.

If a chapter is missing from the student view, the import was incomplete. If a
chapter appears that is not in the book, something was pasted twice.

---

## What must remain true afterwards

- **The official chapter count and Pragati's lesson count stay independent.** A
  class with 14 verified chapters and 0 Pragati lessons is a correct, honest
  state, and every chapter still appears.
- **No placeholder lessons.** Do not create empty lessons to make the numbers
  match. The gap is the point.
- **Nothing becomes student-assignable.** Verifying a curriculum records what the
  book contains. It does not review, approve or publish any content.
- **Unknown depth stays unknown.** A chapter whose sections you did not read
  reports unknown sections, not zero.

---

## If you cannot establish something

Say so, in `notes`, and submit what you do know:

- *"Part II for 2026-27 could not be located."*
- *"The school's copy is the 2024 reprint; the 2026-27 imprint was not
  available."*

An honest partial record with its limits stated is worth more than a confident
complete one that quietly filled a gap. That principle is why five of these
twelve classes are verified and seven are not, rather than all twelve being
verified from a website.
