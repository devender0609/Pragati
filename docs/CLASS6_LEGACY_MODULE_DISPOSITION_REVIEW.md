# Class 6 Legacy Module Disposition Review

**Written:** 2026-08-24 · **Revised:** 2026-08-24 with Grade 7 and Grade 8 primary evidence (v0.61 §5)
**Status:** provisional classification · **human curriculum review required**
**Modules under review:** `decimals`, `ratio_proportion`, `algebra` (≈150 items)

---

## 1. The question, stated correctly

v0.61's interim mapping found that Ganita Prakash Grade 6 has no
standalone chapter titled Decimals, Ratio and Proportion, or Algebra.
It is tempting to conclude that these modules are outside the
curriculum.

**That inference is invalid, and this review exists to block it.**

"No standalone chapter with that title" and "not in the curriculum" are
different claims. A concept can be:

- present inside a differently-titled chapter;
- present in the Middle Stage framework but placed at Grade 7 or 8;
- genuinely absent from the stage.

Only the third justifies retirement. Distinguishing them requires
looking, so I looked.

---

## 2. Evidence gathered

### 2.1 NCF-SE 2023 Middle Stage (primary — §3.4.1.2, pp. 255–256)

| Concept | Middle Stage competency | Verdict |
| :--- | :--- | :--- |
| Decimals | **C-1.6** — "Explores and applies fractions (both as ratios and **in decimal form**) in daily-life situations" | **Explicitly named** |
| Ratio | **C-1.6** — "both as **ratios** and in decimal form" | **Explicitly named** |
| Percentage | **C-1.5** — "Explores the idea of percentage and applies it" | Explicitly named |
| Algebra | **CG-2 entire** — variable, constant, coefficient, expression, one-variable equation (C-2.1–C-2.5) | **An entire curricular goal** |

All three concepts are unambiguously Middle Stage content. Algebra is
not a marginal topic at this stage — it is one of the ten goals.

### 2.2 Ganita Prakash Grade 6 (primary — full-text search of all ten chapter PDFs)

| Search term | Occurrences across the whole Grade 6 textbook |
| :--- | :--- |
| "decimal" | **0** |
| "ratio" | 2 — both inside §7.9 *A Pinch of History*, describing Sulba-sutra rules for operations with fractions. Not taught as a concept. |
| "variable" | 0 |
| "formula" | 4 — all in Chapter 6, for perimeter and area |

Decimals are absent from Grade 6 entirely. Ratio appears only as
historical prose. There is no algebraic-variable content.

### 2.3 Ganita Prakash Grade 7 (primary — retrieved 2026-08-24)

ISBN 978-93-5729-983-1, Reprint 2026-27.

Retrieved from `https://ncert.nic.in/textbook/pdf/gegp1dd.zip`
(HTTP 200, 19.0 MB, 8 chapter PDFs). Chapter titles read from each
chapter's opening page:

| # | Title |
| :--- | :--- |
| 1 | Large Numbers Around Us |
| 2 | **Arithmetic Expressions** |
| 3 | **A Peek Beyond the Point** |
| 4 | **Using Letter-Numbers** |
| 5 | Parallel and Intersecting Lines |
| 6 | Number Play |
| 7 | A Tale of Three Intersecting Lines |
| 8 | Working with Fractions |

This is decisive:

- **Chapter 3, "A Peek Beyond the Point"** — §3.1 opens with "The Need
  for Smaller Units". This is **decimals**, under a descriptive rather
  than technical title.
- **Chapter 4, "Using Letter-Numbers"** — this is **algebra**
  (variables), again descriptively titled.
- **Chapter 2, "Arithmetic Expressions"** — §2.1 "Simple Expressions",
  the precursor to formal algebraic expression work.

**The concepts were not removed from the curriculum. They were moved to
Grade 7 and renamed in the new textbook's descriptive style.** Anyone
searching Grade 7's contents page for "Decimals" or "Algebra" would find
neither and could conclude they had been dropped — which is very likely
how the old-book-to-new-book comparison went wrong in the first place.

---

## 3. Provisional classification

### `decimals` (50 items, DE.01–DE.05)

**Classification: `relevel_candidate`**

| Question | Finding |
| :--- | :--- |
| In Middle Stage NCF-SE? | **Yes** — C-1.6, explicitly |
| In Ganita Prakash Grade 6? | **No** — zero occurrences |
| Expected at Grade 7/8? | **Yes** — Grade 7 Chapter 3, "A Peek Beyond the Point" |
| Age/grade appropriate content? | Likely, but written against the old Grade 6 sequence |
| Supplementary or core? | **Core Middle Stage content, at Grade 7** |

#### Grade 7 Chapter 3, section level

| Section | Title | Pragati skill |
| :--- | :--- | :--- |
| 3.1 | The Need for Smaller Units | — |
| 3.2 | A Tenth Part | — |
| 3.3 | A Hundredth Part | — |
| 3.4 | **Decimal Place Value** | **DE.01** |
| 3.5 | Units of Measurement | — |
| 3.6 | **Locating and Comparing Decimals** | **DE.03** |
| 3.7 | **Addition and Subtraction of Decimals** | **DE.04** |
| 3.8 | More on the Decimal System | — |

Three of five skills map to named sections. **DE.02** (fraction/decimal
conversion) has no dedicated section — the book builds decimals *from*
fractional units in 3.1–3.3 rather than treating conversion separately.
**DE.05** (word problems) is distributed rather than sectioned.

**Gap worth noting:** sections 3.1, 3.2, 3.3 and 3.5 — the conceptual
derivation of decimals from tenths and hundredths, and the measurement
context — have **no Pragati coverage at all**. The existing module
begins at place value, which is where the textbook arrives *after*
three sections of groundwork.

**Recommended action for review:** re-level to Grade 7 Chapter 3, retain
DE.01/DE.03/DE.04 as candidates, author 3.1–3.3 and 3.5. **Do not
retire.**

### `ratio_proportion` (50 items, RP.01–RP.05)

**Classification: `relevel_candidate` (Grade 8)** — upgraded from
`evidence_insufficient` now that Grade 8 has been inspected.

| Question | Finding |
| :--- | :--- |
| In Middle Stage NCF-SE? | **Yes** — C-1.6, ratios named explicitly |
| In Ganita Prakash Grade 6? | **No** — only historical prose in §7.9 |
| Grade 7? | Not a chapter. Ch 8 is fraction multiplication/division |
| **Grade 8?** | **Chapter 7, "Proportional Reasoning-1" — 175 occurrences of "ratio"** |

#### Grade 8 Chapter 7, section level

| Section | Title | Pragati skill |
| :--- | :--- | :--- |
| 7.1 | Observing Similarity in Change | — |
| 7.2 | **Ratios** | **RP.01** |
| 7.3 | **Ratios in their Simplest Form** | **RP.02** |
| 7.4 | **Problem Solving with Proportional Reasoning** | **RP.03, RP.05** |
| 7.5 | Sharing, but Not Equally! | — |
| 7.6 | **Unit Conversions** | **RP.04** (partial) |

Four of five Pragati skills map to named Grade 8 sections. The chapter
title carries "-1", implying a continuation at a later stage.

**Note on RP.04.** Grade 8 §7.6 is *Unit Conversions*, related to but
not identical with the unitary method as Pragati frames it. Needs an
educator's eye.

**Provisional disposition:** re-level to **Grade 8** — two grades above
its current placement, not one. The largest misplacement of the three.

### `algebra` (50 items, AL.01–AL.05)

**Classification: `relevel_candidate`**

| Question | Finding |
| :--- | :--- |
| In Middle Stage NCF-SE? | **Yes** — CG-2 is an entire curricular goal |
| In Ganita Prakash Grade 6? | **No** — no variable content |
| Expected at Grade 7/8? | **Yes** — Grade 7 Chapter 4 "Using Letter-Numbers", and Chapter 2 "Arithmetic Expressions" |
| Age/grade appropriate? | Needs review — see below |
| Supplementary or core? | **Core Middle Stage content, at Grade 7** |

**A caution for the reviewer.** Pragati's AL.01–AL.05 ("Understanding
variables", "Simple expressions", "Evaluate expressions", "One-step
equations", "Algebra word problems") uses formal algebraic vocabulary
from the start. Grade 7 Chapter 4 is titled *Using Letter-Numbers* and
Chapter 2 is *Arithmetic Expressions* — the new book deliberately
approaches variables through arithmetic expressions and a concrete
"letter-number" framing before formal terminology.

#### Grade 7 Chapter 4, section level

| Section | Title |
| :--- | :--- |
| 4.1 | The Notion of Letter-Numbers |
| 4.2 | Revisiting Arithmetic Expressions |
| 4.4 | Simplification of Algebraic Expressions |
| 4.5 | Pick Patterns and Reveal Relationships |

Grade 8 continues it in Ch 6, "We Distribute, Yet Things Multiply"
(algebraic distribution).

**This is the case where re-levelling alone is likely insufficient.**
The textbook spends Chapter 2 on *arithmetic* expressions, introduces
the variable as a "letter-number" in 4.1 before any formal terminology,
and reaches simplification only in 4.4. Pragati's items use formal
algebraic vocabulary from the first item.

Items that say "variable" before the textbook says "variable" are not
wrongly graded — they are wrongly worded for this curriculum. Expect
rewriting rather than moving. See
`docs/LEGACY_ITEM_DISPOSITION_AUDIT.md`.

---

## 4. Summary

| Module | Classification | Middle competency | Grade 6 | Likely home | Skills mapped |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `decimals` | `relevel_candidate` | C-1.6 | absent | **Grade 7 Ch 3** | 3 of 5 |
| `ratio_proportion` | `relevel_candidate` | C-1.6 | absent | **Grade 8 Ch 7** | 4 of 5 |
| `algebra` | `relevel_candidate` + rewrite risk | CG-2 (whole goal) | absent | **Grade 7 Ch 4** | sequencing differs |

**None is `obsolete`. None should be retired.** All three are Middle
Stage content, misplaced rather than surplus. Every one now has a named
chapter at a named grade, verified from the primary source.

The interim report's framing — "150 items target content that is not in
the Class 6 curriculum" — was correct about Grade 6 and misleading about
the curriculum.

---

## 4a. Probability — a precise statement

**What the evidence supports:**

> NCF-SE 2023 Middle Stage Mathematics does not explicitly specify
> probability as a competency in the CG-1 to CG-10 block. A full-text
> search of Ganita Prakash Grades 7 and 8 returns **zero** occurrences
> of "probabilit*" in any chapter.

**What the evidence does NOT support:** that probability is absent from
Middle Stage education generally. Grade 6 was not searched for this term
in this pass, other publishers were not inspected, and state boards may
differ.

**Action:** no Middle Stage probability reporting domain is created. The
v0.52 claim that "Data and Probability are ONE goal (CG-6)" is false
*for the Middle Stage CG block* — that is the precise scope of the
correction, and it should not be stated more broadly.

## 5. What happens next — and what must not

**Must not happen automatically:**

- No item migration. No `gradeId` rewrite.
- No deletion of any item.
- No re-labelling of these modules as Class 7 content in the product.

**Required before any disposition:**

1. ~~Inspect Ganita Prakash Grade 8~~ — **DONE.** Code 0874, ISBN
   978-93-5729-642-7, Reprint 2026-27, 7 chapters.
2. ~~Read Grade 7 Chapters 2, 3, 4 and 8 at section level~~ — **DONE.**
   Ch 8 is *Working with Fractions* (8.1 multiplication, 8.2 division,
   8.3 problems) and contains no ratio treatment.
3. Educator judgement on whether Pragati's existing items match the new
   book's pedagogic approach, or need rewriting rather than moving.
4. A decision on interim presentation: these modules are currently shown
   to Class 6 students as Class 6 curriculum, which the evidence does
   not support. Options include hiding them, labelling them clearly as
   extra practice, or leaving them pending review — **a product
   decision, recorded here as open.**

The one outcome the evidence rules out is the current state persisting
silently.
