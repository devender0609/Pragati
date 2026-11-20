# Pragati Growth — Mathematics Assessment Specification

**Status: DRAFT v0.1 (v0.51). Nothing in this document has been
validated empirically. No part of it may be cited as evidence that
Pragati measures anything.**

This specification describes what Pragati Growth is *intended* to
become. It is written now, before items are authored, because an
assessment whose purpose is decided after its items exist tends to
measure whatever the items happen to contain.

### Relationship to other products

Pragati Growth is not a copy of any existing assessment. It does not
use, and must never use, another product's scale, scoring, item
content, reports, algorithms, or branding. Where this document
references general practice in interim adaptive assessment, it does so
as publicly understood measurement practice, not as an imitation of a
specific product. Pragati must never be described as equivalent to,
comparable with, or benchmarked against a commercial assessment until
independent evidence supports the comparison.

---

## 1. Purpose

**Intended decisions supported (once validated):**

1. Identify a student's current Mathematics achievement across domains.
2. Detect domain-level strengths and gaps to inform teaching.
3. Support instructional grouping within a class.
4. Monitor change across testing windows within an academic year.

**What it explicitly cannot support today:**

- Any percentile, national ranking, or grade-equivalent statement.
- Any claim about growth. Two uncalibrated scores are not comparable,
  so their difference is not growth.
- Placement, promotion, retention, streaming, or selection decisions.
- Board-exam prediction.
- Teacher or school evaluation.
- Comparison between schools, states, or cohorts.
- Diagnosis of a learning disability.

**Current honest description:** *a structured set of Mathematics
questions that records which competencies were sampled and how the
student responded.* Nothing stronger.

---

## 2. Population

Classes 3–10 in the medium term. Classes 1–2 need a
visual/audio-first administration model that does not assume fluent
reading, and are out of scope until that exists.

The pilot targets **Classes 5–8** for the Rational Number strand,
because the strand's assessable band already spans that range.

---

## 3. Administration

**Proposed:** three windows — beginning, middle, and end of academic
year.

**Justification, and its limits.** Three windows is a common structure
because it gives a baseline, a mid-course correction point, and an
end-of-year picture. But the interval that matters is the one over
which real change is detectable, and that depends on the precision of
the instrument — which Pragati does not yet know. **The three-window
proposal is therefore provisional.** It should be revisited once
field-test data gives an estimate of measurement precision. If the
instrument turns out to be imprecise, three windows would produce three
numbers whose differences are mostly noise, which is worse than two.

Administration conditions:

- Proctored, in school, on a school-provided device where possible.
- One sitting. Resumption permitted only within the same school day.
- No teaching, hints, worked solutions, or correctness feedback during
  the test.
- Calculator policy set per item specification, not globally.

---

## 4. Test length

**The 10-item prototype length is rejected.** Ten items across ten
domains cannot support any domain-level statement; it yields roughly
one item per domain, which is not evidence.

Length must be derived from what the test claims. Considerations:

- A total-score statement needs enough items to keep error tolerable.
- A *domain-level* statement needs enough items **within each reported
  domain** — this is the binding constraint, and it is why blueprint
  weighting and length must be decided together.
- Adaptive administration is more efficient per item than fixed-form,
  because items are targeted, but it does not make three items per
  domain sufficient.
- Against this: attention. A 40-minute period is a realistic ceiling
  for middle-grade students in Indian schools, and a tired student's
  responses degrade the measurement they were meant to improve.

**Pilot proposal: 30–40 items, target 35, in a 40–45 minute window,**
reporting at *domain-group* level rather than for all ten domains
separately.

**Rationale:** ~35 items over 4–5 reported domain groups gives roughly
7–9 items per group — enough for a cautious statement about relative
strength, while staying inside one period.

**This number is a starting point for the field test, not a validated
design.** The field test's job is partly to determine the real length.
If precision at 35 items proves inadequate, the honest response is to
narrow what is reported, not to add a claim the data cannot carry.

---

## 5. Content blueprint

Weighting is by **assessment domain**, not textbook chapter — chapters
change when textbooks are revised, as the Class 6 replacement showed.

Draft middle-stage weighting (Classes 6–8):

| Domain | Target share |
| :--- | ---: |
| Number Sense & Operations | 20% |
| Fractions & Rational Number Reasoning | 20% |
| Algebraic Thinking | 15% |
| Geometry & Spatial Reasoning | 15% |
| Measurement | 10% |
| Data & Statistics | 10% |
| Patterns & Relationships | 5% |
| Probability | 5% |

Reasoning and Modelling are assessed *through* the other domains rather
than as separate blocks, because isolating them tends to produce
artificial items.

**These percentages are a draft.** They must be reviewed against the
NCF-SE 2023 emphasis and by practising Indian teachers before any
field test.

---

## 6. Adaptivity

**Today:** `HeuristicAdaptiveRouter` — starts at 5, steps ±1 over
author-assigned difficulties (1–10), picks the nearest item. Adequate
for keeping practice at a reasonable challenge level. It is **not** an
ability estimator: the difficulties are judgements, not parameters, and
the resulting number has no interpretable scale.

**Future:** `CalibratedAdaptiveEngine`, selecting on estimated
information at the current estimate, subject to content-blueprint
constraints and exposure control. This requires calibrated item
parameters, which require a field test.

The `AssessmentRouter` interface exists so this swap does not touch the
assessment UI.

---

## 7. Stopping rule

**Today:** fixed length, or pool exhaustion.

**Future:** stop when *either* the standard error falls below a
threshold set by the reporting claim, *or* a maximum length is reached
— whichever comes first, with blueprint coverage enforced regardless.
Coverage must never be sacrificed to precision: a precise score for a
student who never saw a Geometry item is not a Mathematics score.

A variable-length test also raises a fairness question — students
receiving different numbers of items — that must be examined before it
is adopted.

---

## 8. Score reporting

**No RIT-style scale, and no imitation of one.**

**Today** reports carry only:

- number of questions administered;
- competencies and domains sampled;
- count and proportion of correct responses;
- observed evidence per domain, where enough items were administered;
- explicit limitations.

**Future scale development path:** field test → calibrate → establish a
vertical scale across grades (this is what makes cross-grade growth
statements possible at all) → evaluate whether growth on that scale is
interpretable → only then report growth. Each step can fail, and
failure means not making the claim.

---

## 9. Precision

Not currently estimable. Once calibrated, each reported score carries a
standard error, and every reported difference carries the error of that
difference — which is larger than either score's error, and is the
number that determines whether a change is real.

Reports must never show a point estimate without its uncertainty.

---

## 10. Security

- Growth items live in a separate pool (`growth_field_test`,
  `growth_operational`) and are enforced-separate from instructional
  items. See `src/features/assessment/itemUse.ts`.
- Growth items must never appear in Learn or Practice. Once seen, an
  item is compromised permanently.
- Exposure is recorded per item; over-exposed items are rested or
  retired.
- Retest within a window is not permitted by default.
- Items are not shown to students after administration, and correct
  answers are not revealed.

---

## 11. Accessibility

- Language load minimised; the target is Mathematics, not reading.
- Available in English and Hindi; other languages require translation
  review plus a DIF check, not translation alone.
- Screen-reader compatible; no meaning carried by colour alone.
- Touch targets ≥44px.
- Extended time as an accommodation, recorded on the session.
- Text-to-speech for younger students, once Classes 1–2 are in scope.

Accommodations must be recorded, because an accommodated
administration may not be comparable to a standard one.

---

## 12. Reporting

**Student:** what they worked on, what went well, what to practise
next. No score, no comparison to peers.

**Teacher:** class and individual domain evidence, sampled
competencies, response counts, and limitations. No ranking.

**School:** participation and coverage only, until validation exists.

---

## 13. Validation plan

Summarised here; detail in `PSYCHOMETRIC_VALIDATION_PLAN.md`.

1. **Content validity** — expert review against the Indian curriculum;
   teacher review of every item.
2. **Cognitive validity** — student interviews confirming items elicit
   the intended reasoning.
3. **Psychometric** — field test, calibration, dimensionality, item fit.
4. **Fairness** — DIF by gender, language medium, urban/rural, and
   state board.
5. **Usability** — administration under real school conditions,
   including low-bandwidth and shared-device settings.

---

## 14. Open questions

1. Is a within-year growth claim achievable at all at this precision,
   or is Pragati honestly an interim *diagnostic* rather than a growth
   instrument?
2. Does a single Mathematics scale hold across Classes 3–10, or does
   dimensionality force separate domain scales?
3. What sample size and spread is realistic for an Indian field test?
4. How should multi-language administration be equated?
5. Do state-board curricula diverge enough to need separate blueprints?

None of these can be answered from the armchair.
