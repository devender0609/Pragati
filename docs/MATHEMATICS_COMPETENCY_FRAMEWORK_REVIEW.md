# Mathematics Competency Framework — Review Against Primary Indian Sources

**Date:** 2026-08-18
**Reviewer:** Automated review (Claude), for human validation
**Framework reviewed:** `src/curriculum/competencyFramework.ts`, status
`draft_internal` at v0.51

---

## 1. What was actually inspected

| Source | Access | Status |
| :--- | :--- | :--- |
| CBSE Curriculum 2026-27, Mathematics Class IX (`cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf`) | **Full text retrieved and read** | **PRIMARY — official CBSE document** |
| CBSE Curriculum 2026-27, Mathematics Class X (same directory) | Title and introduction retrieved | Primary, partial |
| NCF-SE 2023 (the framework document itself) | **NOT retrieved** | Quoted second-hand via the CBSE documents above |
| PARAKH National Assessment Framework | **NOT retrieved** | **Not reviewed** |
| NCERT Learning Outcomes (Classes I–VIII) | **NOT retrieved** | Referenced by CBSE's CBE portal; not read |
| NCERT Ganita Prakash textbooks | Blocked (robots.txt) | Secondary corroboration only |

**The central caveat:** the Class IX CBSE syllabus reproduces the NCF-SE
2023 Curricular Goals and Competencies *verbatim*, with codes. That
makes it strong primary evidence for **what CBSE states the goals are**,
and good — but not conclusive — evidence for NCF-SE 2023 itself. A human
should still read NCF-SE 2023 pages 181–187, which the secondary
literature identifies as the Mathematics learning-standards section.

**A significant structural finding:** CBSE has published the NCF-aligned
2026-27 curriculum for **Classes 9, 10, 11, 12 only**. No equivalent
NCF-aligned CBSE syllabus for Classes 6–8 was found. Pragati's pilot
targets Classes 5–8 — precisely the stage where primary competency
evidence is *weakest*. This should change v0.53 planning.

---

## 2. The primary evidence

NCF-SE 2023 Curricular Goals for Secondary Mathematics, as reproduced in
the CBSE Class IX curriculum:

| Code | Curricular Goal (abbreviated) |
| :--- | :--- |
| CG-1 | Understands numbers (natural … real), representation, relationships, number sets |
| CG-2 | Builds deductive and inductive logic to **prove theorems related to numbers** |
| CG-3 | Discovers and proves algebraic identities; **models real-life situations as equations** |
| CG-4 | Analyses properties of 2-D shapes; develops mathematical arguments (includes **coordinate geometry** C-4.5 and **trigonometry** C-4.6) |
| CG-5 | Derives and uses formulae for area, surface area, volume |
| CG-6 | Analyses and interprets data using statistical concepts **and probability** |
| CG-7 | Perceives the **axiomatic and deductive structure** of Mathematics |
| CG-8 | Visualisation, optimisation, representation, **mathematical modelling** |
| CG-9 | **Computational thinking** — decomposition, algorithms, generalising procedures |
| CG-10 | Knows and appreciates contributions of mathematicians (Indian and global) |
| CG-11 | Explores connections of Mathematics with other subjects |

---

## 3. Domain-by-domain review

### NUM — Number Sense & Operations
**Evidence:** CG-1 directly. C-1.1 covers real numbers and properties.
**Recommendation: REMAIN.** Strongly supported.

### RAT — Fractions & Rational Number Reasoning
**Evidence:** CG-1 includes rational numbers within the number strand.
NCF-SE does **not** give rational numbers a separate curricular goal at
secondary.
**Recommendation: REMAIN, with a caveat.** Keeping it separate is
defensible for *measurement* — rational-number reasoning is a
well-evidenced difficulty area with a long developmental progression, and
a reporting domain does not have to mirror a curricular goal. But this is
now an explicit Pragati choice that departs from the official structure,
and must be recorded as such rather than presented as alignment.

### ALG — Algebraic Thinking
**Evidence:** CG-3 directly.
**Recommendation: REMAIN.**

### PAT — Patterns & Relationships
**Evidence:** **No separate curricular goal.** In the CBSE Class IX
syllabus, "Sequences and Progressions" maps to CG-11/C-8.1 and CG-9 —
i.e. patterns are treated through algebra, modelling, and computational
thinking.
**Recommendation: MERGE into ALG at middle and secondary stages.**
Retain as a distinct domain at the foundational stage only, where
pattern recognition is a genuine standalone competency. Reporting a
5%-weighted "Patterns" domain at Class 9 is not supportable.

### GEO — Geometry & Spatial Reasoning
**Evidence:** CG-4, plus CG-7 for the deductive apparatus.
**Recommendation: REMAIN — and BROADEN.** Note that NCF-SE places
**coordinate geometry (C-4.5) and trigonometry (C-4.6) inside the
geometry goal**. Pragati's draft implicitly treated trigonometry as
secondary-stage algebra. This should be corrected.

### MEA — Measurement
**Evidence:** CG-5 directly.
**Recommendation: REMAIN.**

### DAT — Data & Statistics · PRB — Probability
**Evidence:** **CG-6 covers both in a single goal**, with C-6.1
(central tendency) and C-6.2 (probability) as sibling competencies.
**Recommendation: MERGE into one reporting domain** ("Data, Statistics
and Probability"), while keeping *competency-level* separation
underneath. Two separately-weighted 10% and 5% domains would, on a
35-item form, yield roughly 3 and 2 items — far too few to report
separately even descriptively, and the official structure does not ask
us to.

### REA — Mathematical Reasoning
**Evidence:** CG-2 and CG-7 both concern reasoning, and **both are
attached to content** — CG-2 to numbers, CG-7 to geometry and algebraic
identities. NCF-SE never presents reasoning as content-free.
**Recommendation: RECLASSIFY AS A CROSS-CUTTING PROCESS.** Assess
reasoning *through* the content domains and report it as a process
dimension, not as a standalone content domain. A standalone "Reasoning"
item set tends to produce artificial puzzles.

### MOD — Problem Solving & Modelling
**Evidence:** CG-8 directly (modelling, representation, optimisation);
CG-3's C-3.2 and CG-11 also involve modelling.
**Recommendation: RECLASSIFY AS A CROSS-CUTTING PROCESS**, for the same
reason. CG-8 is a real goal, but it is realised inside content.

### **MISSING — Computational Thinking**
**Evidence:** **CG-9 is a first-class curricular goal** with four
competencies (C-9.1 decomposition, C-9.2 analysing instruction
sequences, C-9.3 generalising a procedure across problems, C-9.4
algorithmic problem-solving). In the CBSE Class IX syllabus it is
attached to **almost every chapter**.
**Recommendation: ADD.** This is the clearest gap in the draft
framework. Whether it becomes a reporting domain or a second
cross-cutting process needs expert judgement — it is content-independent
like reasoning, but far more heavily emphasised than the draft framework
gave any weight to at all.

### **NOT REPRESENTED — CG-10 (history / Indian Knowledge Systems), CG-11 (cross-subject connections)**
Both are explicit curricular goals. CG-10 in particular is woven through
the CBSE syllabus (Brahmagupta, Aryabhata, Madhava, Sulbasutras).
**Recommendation: DO NOT create assessment domains for these.** They are
genuine curricular goals but poorly suited to a short adaptive
assessment, and attempting to measure them would likely produce recall
items. Record the deliberate exclusion so it is a decision, not an
oversight.

---

## 4. Proposed revised structure

**Content domains (reporting):**

1. Number Sense & Operations (CG-1)
2. Fractions & Rational Number Reasoning (CG-1; Pragati split, declared)
3. Algebraic Thinking — *including patterns and sequences* (CG-3)
4. Geometry & Spatial Reasoning — *including coordinate geometry and trigonometry* (CG-4, CG-7)
5. Measurement (CG-5)
6. Data, Statistics & Probability (CG-6)

**Cross-cutting processes (assessed through content, reported separately
only if evidence later supports it):**

- Mathematical Reasoning & Proof (CG-2, CG-7)
- Problem Solving & Modelling (CG-8, CG-11)
- Computational Thinking (CG-9)

Six content domains rather than ten also **fixes a measurement problem**:
on a 35-item form, ten domains average 3.5 items each. Six domains
average ~6, which is at least arguably reportable.

**This restructure is NOT applied in code in v0.52.** It is a
recommendation requiring human expert sign-off — changing the framework
is exactly the kind of decision that should not be made by the same
process that proposed it.

---

## 5. What remains unverified

1. **NCF-SE 2023 itself has not been read.** Pages 181–187.
2. **PARAKH has not been reviewed at all.** It is the national assessment
   framework and is the most relevant single source for an assessment
   product. This is the largest remaining gap.
3. **No middle-stage (Classes 6–8) primary competency source was
   found** — the exact stage Pragati's pilot targets.
4. **Foundational/preparatory stage goals not reviewed.**
5. **No Indian mathematics educator has reviewed any of this.**

---

## 6. Recommended actions

1. Obtain and read NCF-SE 2023 pp. 181–187; confirm the CG list is
   reproduced faithfully by CBSE.
2. Obtain the PARAKH assessment framework — **before** item authoring.
3. Locate NCERT Learning Outcomes for Classes 6–8 to close the
   middle-stage gap.
4. Put this review to two Indian mathematics educators for sign-off.
5. Only then apply the §4 restructure and move
   `frameworkSourceStatus` off `draft_internal`.

Until steps 1–4 are complete, the framework remains a defensible
internal draft informed by one primary source — which is a genuine
advance on v0.51, and is not the same as a verified framework.
