# Middle vs Secondary Stage Framework Crosswalk

**Written:** 2026-08-24 (v0.61 §2)
**Sources:** NCF-SE 2023 §3.4.1.2 (Middle, pp. 255–256) and §3.4.1.3 (Secondary, pp. 256–258), both read directly from the primary PDF.

---

## Why this document exists

v0.52 built Pragati's competency framework from the CBSE Class IX
curriculum, which reproduces the **Secondary Stage** goals. Pragati's
pilot grade is Class 6 — **Middle Stage**. The two goal sets are
adjacent in NCF-SE, similarly worded, and **differently numbered**.

The failure mode this table exists to prevent: citing `CG-6` for a Class
6 unit because the v0.52 review said CG-6 was Data and Probability. At
Middle Stage, CG-6 is **mathematical reasoning**, and probability does
not exist at all. The citation would look authoritative, resolve to a
real goal, and be wrong.

**A similarly named goal does not have the same number, and a
similarly numbered goal does not have the same meaning.**

---

## The counts

| Stage | Goals | Grades |
| :--- | :--- | :--- |
| Middle | **CG-1 … CG-10** | 6, 7, 8 |
| Secondary | **CG-1 … CG-11** | 9, 10, 11, 12 |

---

## Construct-by-construct crosswalk

| Construct | Middle Stage | Secondary Stage | Previous Pragati assumption (v0.52) | Number changed? | Meaning changed? | Mapping still valid? | Required action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Number systems** | CG-1 (C-1.1–C-1.6) | CG-1 (C-1.1–…) | CG-1 = numbers | No | **Yes** — Middle covers whole numbers → rationals and explicitly names the **number line** (C-1.4) and **percentage** (C-1.5); Secondary extends to reals and irrationals | Number only; scope differs | Re-cite Class 6 number work to Middle C-1.x |
| **Exponents / powers** | Inside CG-1 (C-1.1) | CG-2 (C-2.1) | Treated as its own goal | **Yes** | Yes — a *sub-competency* at Middle, a *goal* at Secondary | **No** | `requires_stage_review` |
| **Algebra** | **CG-2** (C-2.1–C-2.5) | CG-3 (polynomials, remainder theorem) | CG-2 = algebra | **Yes** | Yes — Middle is variables/expressions/linear equations; Secondary is polynomials and proof | Partially | Re-cite Class 6–8 algebra to Middle CG-2 |
| **Geometry (shapes, properties)** | **CG-3** (C-3.1–C-3.5) | CG-4 (congruence, similarity, coordinate geometry, trigonometry) | CG-4 = geometry, incl. coordinate geometry and trigonometry | **Yes** | **Yes** — coordinate geometry and trigonometry are **Secondary only**; Middle CG-3 is 2D/3D properties and **compass-and-straightedge construction (C-3.4)** | **No** | `requires_stage_review` |
| **Construction (compass/straightedge)** | **C-3.4**, explicit | Absorbed into CG-4 | Not separately identified | — | Yes — a named Middle competency | **No** | Add. Ganita Prakash Ch 8 realises it; Pragati has nothing |
| **Perimeter and area** | **CG-4** (C-4.1–C-4.4) | CG-5 (area, surface area, volume) | Part of geometry | **Yes** | Yes — a **standalone goal** at Middle, incl. Baudhayana-Pythagoras (C-4.2), tiling (C-4.3), fractals (C-4.4) | **No** | Re-cite. Ganita Prakash Ch 6 realises it |
| **Data handling** | **CG-5** (C-5.1–C-5.2) | CG-6 (central tendency + **probability**) | "Data and Probability are ONE goal (CG-6)" | **Yes** | **Yes** — at Middle there is **no probability competency at all** | **No** | `requires_stage_review`. Do not author Class 6 probability |
| **Probability** | **absent** | Inside CG-6 | Assumed present with data | — | Absent entirely at Middle | **No** | Remove any Class 6–8 probability claim |
| **Reasoning / proof** | **CG-6** (C-6.1) | CG-7 (C-7.1) | "Reasoning is content-attached; should be cross-cutting" | **Yes** | Meaning stable; both stages state it as a **standalone** goal | Recommendation needs re-examination — the framework already does what v0.52 proposed | `requires_stage_review` |
| **Puzzles / own strategies** | **CG-7** (C-7.1–C-7.2) | Not a separate goal | Not identified | **Yes** | **Middle-only goal** | **No** | Add. Ganita Prakash Ch 3 realises it |
| **Modelling** | Not a separate goal | CG-8 (C-8.1) | Content-attached | **Yes** | **Secondary-only** as a goal | **No** | Do not cite for Class 6–8 |
| **Computational thinking** | **CG-8** (C-8.1–C-8.2) | CG-9 (C-9.1) | "CG-9 = computational thinking, missing from Pragati" | **Yes** | Meaning stable — present and first-class at **both** stages | Finding valid; **number wrong for Middle** | Re-cite to Middle CG-8 |
| **History of mathematics** | **CG-9** (C-9.1–C-9.2) | CG-10 (C-10.1) | CG-10 = history | **Yes** | Meaning stable | Number only | Re-cite to Middle CG-9 |
| **Cross-subject interaction** | **CG-10** (C-10.1) | CG-11 (C-11.1) | CG-11 = cross-subject | **Yes** | Meaning stable | Number only | Re-cite to Middle CG-10 |
| **Patterns** | Inside CG-1 (**C-1.2**) | Not separately named | "Patterns has no separate goal" | — | Correct at both stages, but Middle names it explicitly as C-1.2 | Valid | Cite C-1.2 for Ganita Prakash Ch 1 |

---

## Summary of impact

**Numbering shifts by one from CG-8 upward** (Middle CG-8/9/10 =
Secondary CG-9/10/11), and **is not a simple shift below that** —
algebra, geometry, area, and data all move differently.

| Category | Count |
| :--- | :--- |
| Constructs where only the number changed | 3 (computational thinking, history, cross-subject) |
| Constructs where the **meaning** changed | 6 (numbers, exponents, algebra, geometry, area, data) |
| Constructs present at Middle only | 2 (puzzles CG-7, construction C-3.4) |
| Constructs present at Secondary only | 2 (probability, modelling CG-8) |

**Nine of the fifteen constructs require action.** This is not a
renumbering exercise.

---

## Decisions marked `requires_stage_review`

Per §3 of the v0.61 spec, prior decisions are **marked, not replaced**:

| Decision | Origin | Reason |
| :--- | :--- | :--- |
| Computational thinking is a missing first-class goal | v0.52 | Finding stands; cited to the wrong stage's number |
| Data and Probability are one goal | v0.52 | False at Middle Stage — no probability competency exists |
| Coordinate geometry and trigonometry sit under Geometry | v0.52 | Secondary-only; not applicable to Classes 6–8 |
| Reasoning and Modelling should be cross-cutting processes | v0.52 | Middle Stage already treats reasoning as standalone (CG-6); modelling is Secondary-only |
| Patterns has no separate goal | v0.52 | Stands, but Middle names it explicitly at C-1.2 |

None of these is resolved here. Resolution requires expert review.

---

## Rule going forward

> **Every competency citation must carry its stage.** A bare `CG-6` is
> ambiguous and must be written as `Middle CG-6` or `Secondary CG-6`.

Enforced by `v061FrameworkStage.test.ts`, which fails if Class 6–8
content data carries a competency ID without stage qualification.
