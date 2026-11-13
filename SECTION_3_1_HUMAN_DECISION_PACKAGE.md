# §3.1 — a decision for a person

**Policy key:** `historical_material_lesson_vs_context`
**Status:** blocked since v0.84.0 checkpoint 31. Not decided here.

This is the one Class 9 unit with no lesson. Everything else is authored.

---

## What it is

| | |
|---|---|
| Official section | §3.1, "The Dawn of Mathematics: The Human Need to Count" |
| Location | Part I, Chapter 3, PDF pages 1–4 |
| Unit | `pragati_iu_g09_ch03_u1`, "How counting began" |
| Objective | Examine the earliest physical evidence of recorded number and the practical need it met |
| Evidence depth | `FULL_PAGE_INSPECTED` |

Its recorded mathematical intent: the chapter opens the number story with the
practical need to count — tally marks, the Ishango bone — rather than with a
definition, and treats counting as a human invention with physical evidence.

## Why it is blocked — and what the block is NOT

**The source evidence is complete.** The pages were read in full, the intent is
recorded, the extent is verified. Nothing is missing and nothing needs
re-reading.

The question is instructional, and it is this:

> When a numbered section is historical material *about* mathematics rather
> than mathematics *to be done*, is it a Pragati lesson of its own, or context
> carried inside the units whose mathematics it describes?

Every authored lesson in this repository has a mathematical objective a student
practises and is assessed against. §3.1 has no such objective. A student cannot
be asked to *do* the Ishango bone. Authoring it as an ordinary lesson would
mean either inventing practice the source does not support, or shipping the
first lesson in Pragati whose Try it stage is not mathematics.

That is a curriculum judgement about what a Pragati lesson is for. It is not an
engineering problem, and no amount of further authoring resolves it.

## The Class 8 precedent — undecided too

The same policy covers `pragati_iu_g08_ch01_u4`. Whatever is decided here sets
the pattern for both, and for every later class's historical material. That is
an argument for deciding it deliberately rather than quickly.

## Options

### A. Author it as a standalone Learn lesson

**Benefit:** Chapter 3 becomes complete, the chapter opens the way the book
opens, and the history gets room to be interesting rather than compressed.

**Risk:** The five-stage standard would have to bend. Try it and Think deeper
would be about historical reasoning, not mathematics — defensible, but it would
be the first lesson of its kind, and the standard that has held for 104 lessons
would now have an exception that later chapters will cite.

**Learn coverage:** 93 of 93 units authored.

### B. Carry it as context inside §3.2

**Benefit:** The history reaches students where it does mathematical work —
the need to count is what makes zero's arrival a revolution. No new lesson
type, no bent standard.

**Risk:** §3.2 grows a section whose provenance is a different official
section, which the merge mechanism (`additionalOfficialSectionIds`) supports
but which was designed for mathematical merges. And the history gets less room
than a standalone lesson would give it.

**Learn coverage:** 92 of 93 units authored, with §3.1 recorded as merged
rather than absent.

### C. Enrichment or reference, outside core Learn

**Benefit:** The material is preserved and reachable without claiming to be a
lesson. Honest about what it is.

**Risk:** Pragati has no enrichment surface today. This option is the only one
of the three that needs a product decision as well as a curriculum one, and it
would be the first non-Learn content type.

**Learn coverage:** 92 of 93, with §3.1 dispositioned to a surface that does
not yet exist.

## Recommendation — labelled as recommendation, not source fact

**B**, if the decision has to be made from what exists today.

The reasoning: the merge mechanism already exists and is tested, the five-stage
standard stays intact, and the history lands where it changes how a student
reads the next lesson. A is attractive and quietly costly — the exception it
creates will be cited by Class 8's unit and by every historical section after
it. C is probably right in the long run and cannot be chosen until there is a
surface to put it on.

That is a judgement about trade-offs, not a reading of the source. The source
says only what is on pages 1–4. **The decision is yours.**

## What implementing each option would involve

| Option | Work |
|---|---|
| A | One authored lesson; a decision about what its Try it stage contains; a test exemption for the five-stage standard |
| B | Extend §3.2 with a context block; add `ncert_iemh1_s3_1` to its `additionalOfficialSectionIds`; re-version that artifact; update the reconciliation expectation |
| C | A product decision first; then a new content type, surface and governance path |

None of this should start before the decision is made.
