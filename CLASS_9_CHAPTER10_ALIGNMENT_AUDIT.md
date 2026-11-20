# Class 9 Chapter 10 — source alignment audit

Data. Audited after authoring, against the canonical section evidence.
4 lessons, 2 official sections, both split. No merges.

| Lesson | Source | Verdict | Notes |
|---|---|---|---|
| `ncert_iemh2_s10_1_mean_lesson` | §10.1 (split 1) | **ALIGNED** | Subsection 10.1.1's motivating error — averaging group averages — then the weighted mean that repairs it. No display architecture used. |
| `ncert_iemh2_s10_1_mixtures_lesson` | §10.1 (split 2) | **ALIGNED** | Subsections 10.1.2 and 10.1.3: mixtures by volume weights, and custom weights for marks. Shares no explanation with its sibling. |
| `ncert_iemh2_s10_2_build_lesson` | §10.2 (split 1) | **ALIGNED** | Subsection 10.2.1: building and reading clustered and stacked displays, each matched to the question it answers. |
| `ncert_iemh2_s10_2_choose_lesson` | §10.2 (split 2) | **ALIGNED** | Subsection 10.2.2: the 100% stacked display, what normalisation removes, and which inferences the data does and does not support. |

## Data fidelity

All figures come from one authored dataset of three households' monthly
spending — Pragati's own, not the source's. Fidelity is checked three ways:

- **Derived, not authored.** `normalisedValues()` computes percentages from the
  raw values at render time, so the 100% display cannot disagree with the
  stacked one beside it.
- **Shared dataset.** A test asserts that every pair of displays compared in
  one lesson names the same `dataSetId`, so "the same data" is a fact rather
  than a claim.
- **Prose against data.** A test parses every rupee figure out of the lesson
  prose and alt text and requires it to be a real series value or category
  total. A lesson cannot cite a number the dataset does not contain.

The fixture is built for the teaching point: the three households have
**identical composition** (50% / 37.5% / 12.5%) and totals of 12000, 24000 and
48000 — a fourfold spread. Without that, the normalised display would conceal
nothing and the lesson would have nothing to show.

## Defects found and corrected

None in the authored content. The display validator rejected two drafts of the
alt text that opened by naming the chart format ("a stacked bar chart of…")
rather than saying what the data shows; both were rewritten before they reached
a lesson.

## What this audit does not do

It does not review the mathematics for a human. All 4 lessons remain
`authored_draft`.
