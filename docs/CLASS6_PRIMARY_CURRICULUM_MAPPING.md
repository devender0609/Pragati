# Class 6 Primary Curriculum Mapping

**Status:** official structure primary-verified · Pragati mapping **not yet educator-reviewed**
**Written:** 2026-08-24 (v0.61 §9)

---

## 1. The primary source, as inspected

| Field | Value |
| :--- | :--- |
| Issuing organisation | NCERT (National Council of Educational Research and Training) |
| Textbook title | **Ganita Prakash** |
| Subtitle | Textbook of Mathematics for Grade 6 |
| Publication code | 0674 |
| ISBN | 978-93-5292-717-3 |
| First edition | August 2024 (Shravna 1946) |
| Reprints | December 2024 (Pausha 1946); January 2026 (Pausha 1947) |
| Edition inspected | **Reprint 2026-27** |
| Curriculum framework | NCF-SE 2023 |
| Retrieved from | `https://ncert.nic.in/textbook/pdf/fegp1dd.zip` |
| Contents page | Prelims PDF (`fegp1ps.pdf`) |
| Inspection date | 2026-08-24 |

### Why this was blocked for seven iterations, and what changed

Nothing about NCERT's access policy changed. The **per-chapter** endpoint
`https://ncert.nic.in/textbook/pdf/fegp1ps.pdf` still returns **HTTP 503**
to an automated client, which is what v0.50–v0.60 correctly recorded.

The **full-book archive** on the same host —
`https://ncert.nic.in/textbook/pdf/fegp1dd.zip` — returns **HTTP 200** and
21.3 MB containing the prelims plus every chapter PDF
(`fegp101.pdf` … `fegp110.pdf`).

The blocker was a URL, not a policy. This is worth recording precisely,
because "the source is blocked" was treated as a settled fact for seven
iterations on the evidence of one failing endpoint. **One failing path is
not an exhausted search.**

### Verification method

1. Contents page read from the prelims PDF.
2. Every chapter number and exact title **cross-checked against the
   opening page of that chapter's own PDF** — not taken from the
   contents listing alone.
3. Section headings extracted per chapter (used in §3 below).
4. Edition, ISBN, and publication code read from the imprint page.

**What was NOT verified:** no subject teacher has confirmed that
Pragati's content matches what each chapter actually teaches. The
official *structure* is verified; the *mapping* in §3 is a maintainer's
reading and is marked `mapping_pending` until an educator signs it off.

---

## 2. The official structure — all ten chapters

| # | Official title | Page | Sections |
| :--- | :--- | :--- | :--- |
| 1 | Patterns in Mathematics | 1 | 1.1–1.6 |
| 2 | Lines and Angles | 13 | 2.1–2.11 |
| 3 | Number Play | 55 | 3.1–3.12 |
| 4 | Data Handling and Presentation | 74 | 4.1–4.5 |
| 5 | Prime Time | 107 | 5.1–5.6 |
| 6 | Perimeter and Area | 129 | 6.1–6.3 |
| 7 | Fractions | 151 | 7.1–7.9 |
| 8 | Playing with Constructions | 187 | 8.1–8.6 |
| 9 | Symmetry | 217 | 9.1–9.2 |
| 10 | The Other Side of Zero | 242 | 10.1–10.5 |

Plus **Learning Material Sheets** (p. 272) — an appendix of cut-out
materials, **not a chapter**. It must not be counted as an eleventh unit.

**Official unit denominator for Class 6 Mathematics: 10.**

This is the first grade in Pragati where that number rests on primary
evidence, so it is the first grade where a completeness percentage may
honestly be calculated at all.

---

## 3. Official unit → Pragati mapping

Pragati's Class 6 module set was authored against the **old 14-chapter**
NCERT *Mathematics* textbook. The mapping below is against the current
book.

### Ch 1 — Patterns in Mathematics
- **Pragati modules:** none
- **Mapping:** `unmapped`
- **Official content:** number sequences, visualising sequences, relations
  among sequences, patterns in shapes (1.1–1.6)
- **Genuinely missing:** the whole chapter. Note this is the *opening*
  chapter of the current book and carries NCF-SE CG-1 (C-1.2, patterns
  in numbers) and CG-8 (computational thinking). Its absence is not a
  minor tail-end gap.

### Ch 2 — Lines and Angles
- **Pragati modules:** `geometry` (GB.01–GB.04 in part)
- **Mapping:** `partial`
- **Covered:** points/lines/segments/rays (GB.01), parallel and
  intersecting lines (GB.02), types of angles (GB.03), measuring and
  drawing angles (GB.04) — these align well to 2.1–2.11.
- **To revise:** Pragati's `geometry` module bundles material the current
  book splits across **four separate chapters** (2, 6, 8, 9). It should
  be decomposed rather than remapped wholesale.
- **Missing:** 2.7 "Making Rotating Arms" — the book's hands-on
  construction of angle as rotation. Pragati treats angle statically.

### Ch 3 — Number Play
- **Pragati modules:** none
- **Mapping:** `unmapped`
- **Official content:** supercells, number-line patterns, digit play,
  palindromes, Kaprekar's number, clock/calendar numbers, mental maths,
  the Collatz conjecture, estimation, winning strategies (3.1–3.12)
- **Genuinely missing:** the whole chapter. It is the book's principal
  vehicle for CG-7 (puzzles, own strategies) and CG-8 (systematic
  counting, algorithmic thinking). Pragati has no equivalent anywhere.

### Ch 4 — Data Handling and Presentation
- **Pragati modules:** none at Class 6
- **Mapping:** `unmapped`
- **Note:** Pragati has `c7_data_handling` (Class 7, 24 items, 3 skills).
  Whether that content can be re-levelled to Class 6 is a **curriculum
  decision, not an engineering one** — flagged for educator review, not
  assumed.

### Ch 5 — Prime Time
- **Pragati modules:** `factors_multiples` (FM.03, FM.04, FM.06–FM.08)
- **Mapping:** `partial`
- **Covered:** prime/composite (5.2), divisibility tests (5.5), HCF/LCM
  (relates to 5.1 common factors and multiples)
- **Missing:** 5.3 co-prime numbers, 5.4 prime factorisation — both are
  explicit sections of the official chapter and absent from Pragati.
- **To revise:** Pragati's HCF/LCM framing comes from the old "Playing
  with Numbers" chapter. *Prime Time* approaches the same ground
  through common multiples and factors first. The order differs.

### Ch 6 — Perimeter and Area
- **Pragati modules:** `geometry` (partial, incidental)
- **Mapping:** `partial`
- **Official content:** perimeter (6.1), area (6.2), area of a triangle (6.3)
- **Assessment:** Pragati's coverage here is thin and arrives via a
  module aimed at something else. Closer to `unmapped` in practice.

### Ch 7 — Fractions
- **Pragati modules:** `fractions` (FR.02–FR.08) — **104 items, 7 lessons**
- **Mapping:** `exact` at chapter level
- **Section-level alignment:**

  | Official section | Pragati skill | Assessment |
  | :--- | :--- | :--- |
  | 7.1 Fractional Units and Equal Shares | FR.02 (partial) | partial |
  | 7.2 Fractional Units as Parts of a Whole | FR.02 | covered |
  | 7.3 Measuring Using Fractional Units | — | **missing** |
  | 7.4 Marking Fraction Lengths on the Number Line | — | **missing** |
  | 7.5 Mixed Fractions | FR.04 | covered |
  | 7.6 Equivalent Fractions | FR.03 | covered |
  | 7.7 Comparing Fractions | — | **missing** |
  | 7.8 Addition and Subtraction of Fractions | FR.05, FR.06, FR.07 | covered |
  | 7.9 A Pinch of History | — | **missing** (CG-9) |

- **This is the important finding of the mapping.** Pragati's best-resourced
  chapter — the reference module, 104 items — is `exact` at chapter level
  and **misses four of nine official sections**. Chapter-level mapping
  concealed that. Section-level mapping is the minimum useful grain.
- **Retain:** FR.03–FR.08 content and items.
- **Revise:** FR.02 to cover 7.1 fully.
- **Author:** measuring with fractional units, the number line treatment,
  explicit comparison of fractions, and the history section.

### Ch 8 — Playing with Constructions
- **Pragati modules:** none
- **Mapping:** `unmapped`
- **Genuinely missing:** the whole chapter (8.1–8.6). This is
  compass-and-straightedge construction — NCF-SE C-3.4 — and it is
  inherently visual and hands-on. It cannot be covered by multiple-choice
  items and is the clearest evidence for §15's visual system.

### Ch 9 — Symmetry
- **Pragati modules:** `geometry` (GB.08, lines of symmetry)
- **Mapping:** `partial`
- **Covered:** 9.1 line of symmetry, at one-skill depth
- **Missing:** 9.2 rotational symmetry entirely

### Ch 10 — The Other Side of Zero
- **Pragati modules:** none at Class 6
- **Mapping:** `unmapped`
- **Note:** Pragati has `c7_integers` at Class 7. In the current
  curriculum integers **begin at Class 6**. Same re-levelling question as
  Ch 4 — an educator decision.

---

## 4. Pragati modules with no home in the current book

| Module | Items | Old chapter | Current status |
| :--- | :--- | :--- | :--- |
| `decimals` | 50 | Old Ch 8 — Decimals | No standalone chapter in Ganita Prakash Class 6 |
| `ratio_proportion` | 50 | Old Ch 12 — Ratio and Proportion | No standalone chapter |
| `algebra` | 50 | Old Ch 11 — Algebra | No standalone chapter |

**150 items — roughly a third of Pragati's Class 6 bank — target content
that is not in the GRADE 6 textbook.**

**CORRECTED (v0.61 §5).** An earlier draft of this section said these
modules "target content that is not in the Class 6 curriculum". That
overstated the finding. Subsequent primary inspection of NCF-SE Middle
Stage and of Ganita Prakash **Grade 7** established that all three
concepts ARE Middle Stage curriculum content — decimals and ratios are
named in competency C-1.6, and algebra is the whole of CG-2 — and that
Grade 7 carries them under descriptive titles:

| Grade 7 chapter | Content |
| :--- | :--- |
| Ch 2 — Arithmetic Expressions | precursor to algebraic expressions |
| Ch 3 — A Peek Beyond the Point | **decimals** |
| Ch 4 — Using Letter-Numbers | **algebra / variables** |

They are **misplaced, not surplus**. None is obsolete.

Full analysis, including the unresolved position of `ratio_proportion`,
is in `docs/CLASS6_LEGACY_MODULE_DISPOSITION_REVIEW.md`. Disposition
remains a **curriculum decision for Devender**, and no automatic
migration, re-levelling or deletion has been performed. The one thing
that must not happen is their continuing to be presented to a Class 6
student as Class 6 curriculum.

---

## 5. Corrected headline

The v0.60 claim under test was:

> "Class 6 is missing seven official chapters."

**That claim is not supported, and it understates the problem in one way
while overstating it in another.**

| Mapping | Count | Chapters |
| :--- | :--- | :--- |
| `unmapped` (nothing at all) | **5** | 1, 3, 4, 8, 10 |
| `partial` (some coverage, real gaps) | **4** | 2, 5, 6, 9 |
| `exact` at chapter level | **1** | 7 |
| **Genuinely complete** | **0** | — |

So: **five** chapters wholly missing, not seven. But **zero** chapters are
complete — including Fractions, which misses four of its nine sections.
"Seven missing chapters" would have led to authoring seven units and
declaring Class 6 done, leaving four partial chapters and the reference
chapter itself materially incomplete.

The number was wrong in both directions. This is exactly why §9 forbade
authoring before mapping.

---

## 6. What may now be claimed

**May be claimed:**
- Class 6 Mathematics has 10 official units (primary-verified).
- Pragati has content mapping to 5 of them, none completely.
- Chapter 7 Fractions is the strongest, at 5 of 9 sections.

**May NOT be claimed:**
- Any completeness percentage for Classes 1–5 or 7–12 — no primary
  denominator exists for any of them.
- That the section-level mapping above is correct — it is one
  maintainer's reading of the source, status `mapping_pending`.
- That any Class 6 unit is complete under
  `docs/PRAGATI_COMPLETE_UNIT_STANDARD.md`. None is.

---

## 7. Required next step

An educator review of §3. Every judgement in it — especially the
re-levelling questions for Ch 4 and Ch 10, and the disposition of the
150 orphaned items — is a curriculum decision that a maintainer reading
a PDF is not qualified to settle.
