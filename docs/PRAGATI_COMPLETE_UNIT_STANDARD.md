# The Pragati Complete-Unit Standard

**Written:** 2026-08-24 (v0.61 §13)
**Status:** proposed. No unit in Pragati currently meets it.

---

## 1. Why this document exists

Pragati has repeatedly been able to say "we have content for that" when
what existed was a title, a row in a registry, and a bank of
multiple-choice items. The v0.61 mapping made the cost concrete: the
`fractions` module — 104 items, 7 lessons, the reference module for the
whole product — covers **5 of the 9 sections** of the official chapter,
and nothing in the codebase said so.

A unit is **not** complete because:

- a title exists in the registry;
- an item bank exists;
- one lesson exists;
- a language model generated text for it;
- a percentage somewhere reads 100%.

This document defines what complete actually requires. It is
deliberately demanding. The point is not to make the number look good;
it is to make the number mean something.

---

## 2. The student requirements

A complete unit gives a student **all** of the following.

### 2.1 A clear learning goal
Stated in words the student can read, at the top, before anything else.
Not a competency code. "By the end of this you will be able to compare
two fractions and say which is larger" — not `C-1.6`.

### 2.2 An age-appropriate explanation
Written for the stage, per `docs/AGE_STAGE_CONTENT_AUTHORING_STANDARDS.md`.
Reading load is part of the mathematics: a Class 2 student who cannot
decode the sentence has not been given a mathematics problem, they have
been given a reading problem.

### 2.3 Multiple representations
At least two ways of seeing the same idea — for example a fraction as an
area, as a length on a number line, and as a share. A single
representation teaches the representation, not the concept.

### 2.4 Meaningful worked examples
Three to five, minimum, per unit. "Meaningful" excludes:
- the same problem with different numbers;
- examples that only demonstrate the procedure just stated;
- examples with no reasoning shown between steps.

At least one worked example should show a **non-obvious** case — where
the straightforward move fails, or where a choice has to be made.

### 2.5 Mathematical visuals
Concept-specific, from the typed catalogue in
`docs/MATHEMATICAL_VISUAL_SYSTEM.md`. A visual must carry mathematical
information. Decorative illustration does not count and must never be
counted.

### 2.6 Guided practice
Problems with scaffolding, hints, and worked feedback. Distinct from
independent practice — a bank of items without hints is not guided
practice with the hints turned off.

### 2.7 Independent practice
Enough items, across the unit's skills, for a student to reach fluency
without repetition becoming pattern-matching on the item template.

### 2.8 Application and reasoning
Problems that require choosing a method rather than executing a named
one. Currently Pragati's weakest area across every module audited.

### 2.9 Misconception feedback
When a student gets something wrong, the response should address **the
specific error made**, not merely mark it incorrect. This requires the
misconceptions to be documented at authoring time, per unit.

### 2.10 Review, progress, and a clear next step
The student should always be able to answer: what did I just learn, how
am I doing, and what do I do now?

---

## 3. The teacher requirements

A complete unit gives a teacher **all** of the following.

| Requirement | Why it is not optional |
| :--- | :--- |
| Official source and unit reference | A teacher must be able to check Pragati against the textbook their school actually uses |
| Competency mapping | To NCF-SE curricular goals, at the correct **stage** (see §5) |
| Prerequisite knowledge | So a teacher can tell whether a struggling student's problem is in this unit or before it |
| Teaching notes | How to introduce it, what to emphasise, what usually goes wrong |
| Misconception notes | The same list that drives student feedback, in teacher language |
| Worked examples | Usable directly on a board |
| Answer rationales | Why each answer is right, and why each distractor is wrong |
| Assignable practice | A teacher must be able to give this to a class |
| Unit check | Something that tells the teacher whether the unit landed |

---

## 4. The quality gates

A unit may not be marked `published` until it has passed **all five**,
recorded independently on the axes in `src/curriculum/contentStatus.ts`:

1. **Mathematically reviewed** — the mathematics is correct.
2. **Curriculum reviewed** — it matches the official unit it claims.
3. **Readability reviewed** — appropriate to the stage.
4. **Visual accuracy reviewed** — the diagrams are mathematically true
   (a number line with unequal intervals teaches something false).
5. **Educator reviewed** — a practising teacher of that grade has
   confirmed it is usable.

**Gate 5 cannot be performed by a maintainer, a model, or an author.**
It is the gate Pragati has never passed, on any unit, at any grade.

---

## 5. A stage warning

NCF-SE 2023 defines Mathematics curricular goals **per stage**, and the
sets differ:

- **Middle Stage** (Classes 6–8): CG-1 … CG-10
- **Secondary Stage** (Classes 9–12): CG-1 … CG-11

Pragati's existing framework review
(`docs/MATHEMATICS_COMPETENCY_FRAMEWORK_REVIEW.md`) was conducted against
the CBSE Class IX curriculum document, which reproduces the **Secondary
Stage** goals. Pragati's pilot grade is Class 6, which is Middle Stage.

**Competency mapping for any Class 6–8 unit must use the Middle Stage
goals.** Mapping a Class 6 unit to a Secondary Stage CG number produces a
citation that looks authoritative and is wrong.

---

## 6. What "complete" is not

- Not a percentage. A grade at 80% complete with every unit failing
  gate 5 is 0% usable.
- Not a count of items. 104 items covering 5 of 9 sections is not 104
  items' worth of coverage.
- Not derivable. Each axis in `contentStatus.ts` is recorded by someone
  who checked. None is inferred from another, and the tests enforce it.

---

## 7. Current status against this standard

| Units meeting the full standard | **0** |
| :--- | :--- |
| Units meeting the student requirements | 0 |
| Units meeting the teacher requirements | 0 |
| Units passing educator review | 0 |
| Grades with a primary-verified unit list | 1 (Class 6) |

This is the honest baseline. It is worse than the registry implied, and
it is the number the next iteration should be measured against.
