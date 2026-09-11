# Instructional Item-Bank Audit

**Written:** 2026-08-24 (v0.61 §14) · **Method:** automated census + sampled inspection
**Not** an expert content review.

## 1. Census

Measured directly from `data/items.ts` and `data/lessons.ts`.

| Module | Grade | Items | Unique stems | Distinct opening-5-word groups | Avg words | Max words | Lessons | Worked examples |
| :-- | :-- | --: | --: | --: | --: | --: | :-- | --: |
| `g2_math_starter` | 2 | 12 | 12 | 12 | 7 | 12 | 0/3 | 0 |
| `g4_math_starter` | 4 | 12 | 12 | 12 | 9 | 15 | 0/3 | 0 |
| `fractions` | 6 | 104 | 103 | 96 | 16 | 53 | 7/7 | 14 |
| `decimals` | 6 | 50 | 50 | 49 | 9 | 26 | 5/5 | 10 |
| `ratio_proportion` | 6 | 50 | 50 | 50 | 16 | 29 | 5/5 | 10 |
| `algebra` | 6 | 50 | 50 | 50 | 12 | 23 | 5/5 | 10 |
| `g10_math_starter` | 10 | 12 | 12 | 12 | 7 | 12 | 0/3 | 0 |

## 2. Findings

**2.1 Duplicate/template repetition is LOW, and that is a genuine positive.**
`fractions` has 103 unique stems out of 104 and 96 distinct opening
phrasings. The banks are not the same question with the numbers
swapped, which was the suspected failure and is not what the data shows.

**2.2 Item format is uniform and unrecorded.** Every item across every
module reports format `unknown` — the field is either absent or not
populated. So the product cannot currently state its own format
distribution. Multiple-choice is the de facto only format; there is no
constructed response, no ordering, no number-line interaction. For a
section like 7.4 whose competency is *visualising on the number line*,
a bank of four-option text items cannot assess the competency at all.

**2.3 Author-assigned difficulty spans 1–9 and is NOT calibrated.**
`fractions` distributes 1:1, 2:14, 3:14, 4:18, 5:22, 6:13, 7:9, 8:10,
9:3 — a plausible-looking spread produced by author judgement with no
response data behind it. It must never be described as calibrated,
scaled, or comparable across modules.

**2.4 Reading burden is a real risk at Class 6.** `fractions` averages
16 words with a maximum of 53. A 53-word stem for an 11-year-old is a
reading assessment wearing a mathematics costume. `ratio_proportion`
also averages 16.

**2.5 The Class 2/4/10 banks are skeletons, confirmed numerically.**
12 items, 3 skills, 0 lessons, 0 worked examples — identical shape at
every grade outside 6 and 7. Average stem 7 words at both Class 2 and
Class 10, which means the Class 10 bank is not pitched at Class 10.

**2.6 Misconception targeting and visual dependence: ZERO.** No item in
any sampled module carries a misconception tag or references a visual
specification. Distractors exist but no data records what error each
one represents, so wrong-answer feedback cannot be specific.

**2.7 Official-section alignment: absent.** No item references an
`officialSectionId`. The section model added in v0.61 is not yet
connected to the item bank, so no item can currently be said to assess
a verified curriculum section.

## 3. Classification

| Module | Classification | Basis |
| :-- | :-- | :-- |
| `g2_math_starter` | `generated_skeleton` | 12 items, no lessons, no examples |
| `g4_math_starter` | `generated_skeleton` | as above |
| `g10_math_starter` | `generated_skeleton` | as above; stem length not grade-appropriate |
| `fractions` | `substantial_content` + `expert_review_required` | real volume and lessons; reading burden and section gaps need an educator |
| `decimals` | `usable_draft` + `relevel_candidate` | coherent bank, wrong grade (Grade 7 Ch 3) |
| `ratio_proportion` | `usable_draft` + `relevel_candidate` | coherent bank, wrong grade (Grade 8 Ch 7) |
| `algebra` | `requires_rewrite` | terminology precedes the textbook's introduction of it (see disposition review §5) |

## 4. What this audit did NOT assess

Mathematical accuracy of individual items, distractor plausibility, and
answer-cueing were **not** verified — those require reading every item
with subject expertise. This audit is a census plus structural
inspection. It can say the banks are not repetitive and that difficulty
is uncalibrated; it cannot say the mathematics is right.
