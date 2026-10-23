# Class 9 — official section accounting

Ganita Manjari, Grade 9, Parts I and II. **74 numbered sections**, each heading
located in the body and checked against the rendered page.

## Two coordinate systems, kept apart

`pdfStartPage` / `pdfEndPage` are 1-based positions inside the individual chapter
PDF and are the only coordinates used for page retrieval, ledger joins and
evidence lookup. `printedFolioStart` / `printedFolioEnd` are the numbers printed
in the book's running head. They are different systems: **10 of 74** sections begin
on a page that carries no printed number at all, usually a chapter opening.

Checkpoint 29 found Part I's records storing a folio where a PDF page belonged.
All 74 are rebuilt on PDF coordinates here, and every subsection extent sits
inside its parent.

| Record | № | Title | PDF extent | Printed folios | Subsections | Boundary | Intent |
|---|---|---|---|---|---|---|---|
| `ncert_iemh1_s1_1` | 1.1 | Introduction | PDF 1–2 | — | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s1_2` | 1.2 | Settling In | PDF 2–3 | 2–3 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s1_3` | 1.3 | The 2-d Cartesian Coordinate System | PDF 3–8 | 3–8 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s1_4` | 1.4 | Distance Between Two Points in the 2-D Plane | PDF 8–15 | 8–15 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s2_1` | 2.1 | Introduction | PDF 1–4 | — | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s2_2` | 2.2 | Linear Polynomials | PDF 4–6 | 19–21 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s2_3` | 2.3 | Exploring linear patterns | PDF 6–9 | 21–24 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s2_4` | 2.4 | Linear growth and linear decay | PDF 9–11 | 24–26 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s2_5` | 2.5 | Linear Relationships | PDF 11–12 | 26–27 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s2_6` | 2.6 | Visualising linear relationships | PDF 12–25 | 27–40 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s3_1` | 3.1 | The Dawn of Mathematics: The Human Need to Cou | PDF 1–3 | — | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s3_2` | 3.2 | The Revolution of Śhūnya: When Nothing Became  | PDF 3–5 | 43–45 | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s3_3` | 3.3 | Integers: Expanding the Horizon | PDF 5–6 | 45–46 | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s3_4` | 3.4 | Filling the Spaces: Fractions and Rational Num | PDF 6–13 | 46–53 | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s3_5` | 3.5 | Irrational Numbers | PDF 13–17 | 53–57 | 3 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s3_6` | 3.6 | Real Numbers: Decimals and Cyclic Patterns | PDF 17–22 | 57–62 | 3 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s3_7` | 3.7 | Conclusion: The Never-Ending Journey | PDF 22–27 | 62–67 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s4_1` | 4.1 | Introduction | PDF 1–2 | — | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s4_2` | 4.2 | Visualising Identities | PDF 2–5 | 69–72 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s4_3` | 4.3 | Factorisation of Algebraic Expressions Using I | PDF 5–8 | 72–75 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s4_4` | 4.4 | More Identities | PDF 8–11 | 75–78 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s4_5` | 4.5 | Factorisation Using Algebra Tiles | PDF 11–13 | 78–80 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s4_6` | 4.6 | Factorisation Without Using Algebra Tiles | PDF 13–15 | 80–82 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s4_7` | 4.7 | Finding New Identities | PDF 15–19 | 82–86 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s4_8` | 4.8 | Simplifying Rational Expressions | PDF 19–24 | 86–91 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s5_1` | 5.1 | Definitions | PDF 2–3 | 93–94 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s5_2` | 5.2 | Symmetries of a Circle | PDF 3–3 | 94–94 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s5_3` | 5.3 | How Many Circles? | PDF 3–7 | 94–98 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s5_4` | 5.4 | Chords and the Angles They Subtend | PDF 7–9 | 98–100 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s5_5` | 5.5 | Midpoints and Perpendicular Bisectors of Chord | PDF 9–11 | 100–102 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s5_6` | 5.6 | Distance of Chords from the Centre | PDF 11–15 | 102–106 | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s5_7` | 5.7 | Angles Subtended by an Arc | PDF 15–20 | 106–111 | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s5_8` | 5.8 | Concyclicity of Points | PDF 20–26 | 111–117 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s6_1` | 6.1 | Perimeter of a Shape | PDF 2–3 | 119–120 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s6_2` | 6.2 | Perimeter of a Circle — The C/D Ratio | PDF 3–6 | 120–123 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s6_3` | 6.3 | π Is Irrational | PDF 6–8 | 123–125 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s6_4` | 6.4 | Length of an Arc of a Circle | PDF 8–10 | 125–127 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s6_5` | 6.5 | Problems, Puzzles, and Paradoxes on Perimeter | PDF 10–13 | 127–130 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s6_6` | 6.6 | Area of a Rectangle | PDF 13–13 | 130–130 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s6_7` | 6.7 | Area of a Parallelogram | PDF 13–15 | 130–132 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s6_8` | 6.8 | Area of a Triangle | PDF 15–23 | 132–140 | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s6_9` | 6.9 | Squaring a Rectangle | PDF 23–26 | 140–143 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s6_10` | 6.10 | Area of a Circle | PDF 26–37 | 143–154 | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s7_1` | 7.1 | What is Probability? | PDF 1–5 | — | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s7_2` | 7.2 | Measuring Probability Objectively | PDF 5–12 | 159–166 | 3 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s7_3` | 7.3 | Elements of Probability: Sample Spaces and Eve | PDF 12–14 | 166–168 | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s7_4` | 7.4 | Tree diagrams | PDF 14–19 | 168–173 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s8_1` | 8.1 | Introduction to Sequences | PDF 1–3 | — | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s8_2` | 8.2 | Explicit Rule for a Sequence | PDF 3–5 | 176–178 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s8_3` | 8.3 | Recursive Rule for a Sequence | PDF 5–7 | 178–180 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s8_4` | 8.4 | Arithmetic Progressions | PDF 7–10 | 180–183 | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s8_5` | 8.5 | Sum of the First n Natural Numbers | PDF 10–13 | 183–186 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh1_s8_6` | 8.6 | Geometric Progressions | PDF 13–27 | 186–None | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s10_1` | 10.1 | Combining Things | PDF 1–11 | — | 3 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s10_2` | 10.2 | Visualising and Interpreting Data | PDF 11–29 | 18–36 | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s11_1` | 11.1 | Adding Numbers | PDF 1–3 | — | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s11_2` | 11.2 | Greatest Common Divisor | PDF 3–7 | 39–43 | 3 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s11_3` | 11.3 | Data Structures | PDF 7–14 | 43–50 | 3 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s12_1` | 12.1 | What Exactly is a Quadrilateral? | PDF 2–6 | 52–56 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s12_2` | 12.2 | Parallelograms | PDF 6–10 | 56–60 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s12_3` | 12.3 | Applications of Parallelograms | PDF 10–19 | 60–69 | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s12_4` | 12.4 | Tiling the Plane Using Any 4-gon | PDF 19–34 | 69–84 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s13_1` | 13.1 | Linear Equations in Two Variables | PDF 1–4 | — | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s13_2` | 13.2 | Solution of Linear Equation in Two Variables | PDF 4–10 | 88–94 | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s13_3` | 13.3 | Slope-intercept form of a Linear Equation | PDF 10–19 | 94–103 | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s13_4` | 13.4 | Pair of Linear Equations in Two Variables | PDF 19–21 | 103–105 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s13_5` | 13.5 | Finding Solutions to a Pair of Linear Equation | PDF 21–28 | 105–112 | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s13_6` | 13.6 | Graphical Method for Solving A Pair of Linear | PDF 28–38 | 112–122 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s14_1` | 14.1 | Cuboids and Cubes | PDF 1–5 | — | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s14_2` | 14.2 | Right Circular Cylinder | PDF 5–8 | 127–130 | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s14_3` | 14.3 | Cones | PDF 8–12 | 130–134 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s14_4` | 14.4 | Pyramidal Shapes | PDF 12–13 | 134–135 | 0 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s14_5` | 14.5 | Spheres and Hemispheres | PDF 13–19 | 135–141 | 2 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |
| `ncert_iemh2_s14_6` | 14.6 | Areas and Volumes Around Us | PDF 19–42 | 141–None | 1 | VERIFIED_FROM_SOURCE | BODY_GROUNDED |

**Part I 53 · Part II 21 · total 74 · subsections 51.**
Chapter 9 carries no numbered section and is represented by three Pragati source
segments covering all seven of its pages.
