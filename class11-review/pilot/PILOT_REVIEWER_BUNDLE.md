# Class 11 — Human Review Pilot (4 lessons)

**Nothing here has been reviewed, sent or published.** Every judgement field is empty.

## What has already been established, and what has not

Automated checks confirmed these lessons exist, map to the stated curriculum units, carry valid provenance, render correctly and pass technical checks.

They establish that a lesson is **well-formed**. They cannot establish that it **teaches**. That is what you are being asked:

- is the mathematics correct?
- is each mapped objective materially taught, or only mentioned?
- is the scope right — nothing missing, nothing borrowed from later?
- is the lesson-to-unit granularity right?
- do the explanation, examples and feedback actually support learning?

You are free to disagree with anything the automation concluded. A lesson it called ready can come back MISALIGNED; that is the pilot working.

## Why these four

The unit-to-lesson mapping across Class 11 runs **both ways**: 35 of 90 lessons carry several objectives, and 26 objectives are taught across several lessons. Neither has been checked by a person. These four test both directions plus the two newest lesson models.

## Two questions for every lesson

**A. Material alignment** — per mapped objective, separately: ALIGNED · PARTIAL · MISALIGNED · CANNOT_DETERMINE. *Mentioned is not taught.*

**B. Granularity** — ONE_LESSON_APPROPRIATE · SHOULD_SPLIT · SHOULD_MERGE · DUPLICATIVE_ACROSS_ARTIFACTS · UNCERTAIN. This one carries beyond the lesson: the same mapping approach is about to be used for Class 12.

---

# Lesson 1 — You will state the binomial theorem for a positive integral index and follow its proof by induction.

`ncert_kemh1_s7_2_binomial_theorem_lesson`

**Fingerprint:** `d721cc79c8850f1bf2d981529aa51f92`  — copy this into your response.

**Source:** NCERT section 7.2, page 160

**Why this lesson is in the pilot:** Four canonical units on one lesson — the strongest test of whether several objectives can share a lesson without any of them being crowded into a mention.

## Objectives it claims to cover

**C11-BIN-01** — State the binomial theorem for a positive integral index and follow its proof by induction on the index.

- demand: PROVE · representation expected: binomial coefficient and sigma notation · risk B
- proof expectation: PROVE

**C11-BIN-02** — Generate the binomial coefficients from Pascal’s triangle and relate each entry to nCr.

- demand: UNDERSTAND · representation expected: Pascal's triangle figure · risk B

**C11-BIN-03** — Expand a binomial power and use the expansion in simple numerical and algebraic applications.

- demand: APPLY · representation expected: expansion notation · risk B

**C11-BIN-FO7** — Write the general term of a binomial expansion and identify the middle term.

- demand: APPLY · representation expected: general term notation · risk B

## The lesson

**Goal.** You will state the binomial theorem for a positive integral index and follow its proof by induction.

**Vocabulary.** [object Object] · [object Object] · [object Object]

> Multiplying (a + b) by itself a few times shows a pattern. a^2 + 2ab + b^2 for the square, and a^3 + 3a^2b + 3ab^2 + b^3 for the cube.

> Two things stay true in every line. Each term has a power of a and a power of b that add to the index, and the coefficients are not arbitrary.

> Where do the coefficients come from? Expanding (a + b)^3 means choosing, from each of the 3 brackets, either a or b, and adding up every way of doing it. A term with b^2 comes from choosing b in exactly 2 of the 3 brackets — and the number of ways to do that is 3C2, which is 3. The coefficient is a count, which is why it is a combination.

> That gives the theorem. For a positive integral index n, (a + b)^n is the sum over r from 0 to n of nCr a^(n−r) b^r. The term at index r is nCr a^(n−r) b^r, and the exponents add to n because every bracket contributes exactly one of the two symbols.

> The ends behave without any special rule. The first coefficient is nC0, which is 1, because there is one way to choose none of the brackets; the last is nCn, also 1, because there is one way to choose all of them. The same formula gives both.

> Laying the rows out shows the structure: row n holds nC0 up to nCn, and 4 gives 1, 4, 6, 4, 1.

> Checking a few indices is not a proof, though. The claim is about every positive integer, and no number of verified cases settles a statement with infinitely many instances. The source proves it by induction on the index.

> The step turns on one fact about the coefficients: two adjacent ones in a row add to the coefficient below them between them. That is not a coincidence of the numbers. Choosing r objects from k + 1 either leaves the new object out, which can be done kCr ways, or takes it, which can be done kC(r−1) ways — separate cases covering everything, so the counts add.

**Visuals.**

- *coefficient_rows*: Rows of binomial coefficients from n = 0 to n = 5, each row one line of numbers. Row 0 is a single 1; row 1 is 1 and 1; row 4 is 1, 4, 6, 4, 1. Each entry in row n is the number of ways of choosing that many of the n factors to contribute the second symbol, and every row begins and ends with 1 because there is exactly one way to choose none and one way to choose all.
- *proof_layout*: The proof of the binomial theorem set out in five labelled parts. The claim states the expansion for a positive integral index. The base case checks n = 1, where both sides come to a + b. The induction hypothesis assumes the expansion for one particular index k. The inductive step multiplies that expansion by one more factor of a + b, collects the terms with the same power of b, and uses the fact that two adjacent coefficients of one row add to a coefficient of the next. The conclusion states the result for every positive integer, resting on the base case and the step together.

**Worked examples.**

- Expand (a + b)^4 using the theorem.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4
- In the expansion of (a + b)^4, why is the coefficient of 6a^2b^2 equal to 6 rather than something else?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 6, because it counts the ways of choosing which 2 brackets give b.
- Why does the inductive step need two adjacent coefficients to combine?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because collecting like terms makes each new coefficient the sum of two old ones.

**Try it.**

- Write the expansion of a binomial with index 3. → *a^3 + 3a^2b + 3ab^2 + b^3* — 
- What is the coefficient of the term with b^3 when n = 5? → *10* — 
- Someone writes an expansion of index 4 in which one term is a^2b^3. What is wrong? → *The exponents add to 5, not 4.* — 
- Why is the first coefficient always 1, whatever the index? → *Because nC0 is 1.* — 
- A proof checks the expansion at n = 1, 2, 3 and 4 and stops. Is the theorem proved? → *No.* — 

**Think deeper.**

- Why should counting have anything to do with expanding an algebraic power? The two look like different subjects.
- The base case here is almost trivial, and the inductive step does all the work. Why is the base case needed at all?

**Summary.** For a positive integral index n, (a + b)^n is the sum over r from 0 to n of nCr a^(n−r) b^r. The coefficients are combinations because each counts the ways of choosing which brackets contribute the second symbol, and the exponents in every term add to n. The source proves the theorem by induction on the index, with the step resting on two adjacent coefficients adding to the next.

## Your response

Answer **separately** for each objective — a single verdict for the lesson is not enough, and for this lesson that means 4 separate answers:

- **C11-BIN-01** — materially taught or only mentioned? sufficient for a PROVE demand? crowded out by the others?
- **C11-BIN-02** — materially taught or only mentioned? sufficient for a UNDERSTAND demand? crowded out by the others?
- **C11-BIN-03** — materially taught or only mentioned? sufficient for a APPLY demand? crowded out by the others?
- **C11-BIN-FO7** — materially taught or only mentioned? sufficient for a APPLY demand? crowded out by the others?

Then for the lesson: mathematical correctness · scope · explanation · worked examples · whether feedback explains the misconception or just marks right/wrong · representation · accessibility · **granularity** · overall recommendation.

Record it in `class11-review/pilot/responses/ncert_kemh1_s7_2_binomial_theorem_lesson.response.json`. Put your name or reviewer code in `reviewer`.

---

# Lesson 2 — You will derive the sine and cosine of a sum and a difference of two angles, and use them to find values the standard angles alone could not give.

`ncert_kemh1_s3_4_sum_difference_lesson`

**Fingerprint:** `e8aba9128c52ea2cbc7d2995ccd12c9e`  — copy this into your response.

**Source:** NCERT section 3.4, page 49

**Why this lesson is in the pilot:** Both its units are also taught by a second lesson — the mirror question: is spreading an objective across lessons complementary, or redundant?

## Objectives it claims to cover

**C11-TRG-06** — Express sin and cos of a sum or difference in terms of the component angles and apply the results.

- demand: DERIVE · representation expected: identity statements; no figure required · risk C

**C11-TRG-07** — Deduce the double- and triple-angle identities and the sum-to-product forms from the sum and difference identities.

- demand: DERIVE · representation expected: identity statements · risk C

## Also taught elsewhere

**ncert_kemh1_s3_4_multiple_angles_lesson** also teaches C11-TRG-06 and C11-TRG-07.

Its content is given here as context — you are not being asked to review it separately.

> *Goal:* You will deduce the double- and triple-angle identities and the sum-to-product forms from the sum and difference identities, rather than collecting them as separate formulas.

> Every identity in this lesson comes from the previous one. None is new information; each is the sum or difference identity used in a particular way.

> Setting y = x in sin(x + y) = sin x cos y + cos x sin y gives sin 2x = 2 sin x cos x immediately, because both products become the same.

> The same substitution in cos(x + y) = cos x cos y − sin x sin y gives cos 2x = cos²x − sin²x. Using sin²x + cos²x = 1 to remove one term at a time gives the other two forms, 2cos²x − 1 and 1 − 2sin²x, which are the same identity wearing different clothes.

> The triple-angle results come from writing 3x as 2x + x and applying the sum identity, then substituting the double-angle results just obtained. That dependency is worth noticing: the triple-angle identity rests on the double-angle one, which rests on the sum identity.

> The sum-to-product forms are the sum and difference identities read backwards. Adding sin(A + B) and sin(A − B) cancels the second term of each and leaves 2 sin A cos B; writing the two angles as the half-sum and half-difference of the original pair turns that into a rule for sin C + sin D.

> So the chain is: the chord argument gives cos(x − y); substitution gives the other three sum and difference identities; setting the angles equal gives the double-angle forms; combining those gives the triple-angle forms; and adding or subtracting pairs gives the sum-to-product forms.

> *Summary:* Setting y = x in the sum identities gives the double-angle forms, the Pythagorean identity gives the three versions of cos 2x, writing 3x as 2x + x gives the triple-angle forms, and adding or subtracting pairs gives the sum-to-product forms. Every result traces back to the chord argument for cos(x − y).

**The question:** do the two lessons give complementary instruction, or is the objective duplicated in a way that would confuse a student?

> **Pre-review observation.** This lesson carries no figures. Both objectives specify *"no figure required"*, so this is consistent with the curriculum record rather than an omission — noted so it is not mistaken for one. Whether the identities would nonetheless be clearer with a visual is your call.

## The lesson

**Goal.** You will derive the sine and cosine of a sum and a difference of two angles, and use them to find values the standard angles alone could not give.

**Vocabulary.** [object Object]

> An identity is not an equation to solve. It holds for every argument, so it can be used as a substitution anywhere.

> The central result is the cosine of a difference. Take two angles x and y, and the points on the unit circle at those angles. The distance between them can be computed in two ways: from the coordinates, and from the fact that the same chord subtends the angle x minus y at the centre. Setting the two expressions equal and simplifying with sin² + cos² = 1 gives cos(x − y) = cos x cos y + sin x sin y.

> Notice the sign. The cosine of a difference carries a plus between the products, and the cosine of a sum carries a minus. Replacing y by −y in the result above, and using that cos is unchanged by a change of sign while sin reverses, gives cos(x + y) = cos x cos y − sin x sin y.

> The sine results follow from the same identity by shifting through a right angle: sin(x + y) = sin x cos y + cos x sin y, and sin(x − y) = sin x cos y − cos x sin y. Here the sine of a sum carries the plus, which is the opposite way round from cosine and the most common place to slip.

> Dividing the sine result by the cosine result gives the tangent of a sum, tan(x + y) = (tan x + tan y) / (1 − tan x tan y), valid wherever every tangent in it is defined and the denominator is not zero.

> These let us reach angles the standard table does not list. For instance 15° is 45° − 30°, so cos 15° can be written from values we already have, even though 15° has no row of its own.

**Worked examples.**

- Derive cos(x + y) from cos(x − y).
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** cos(x + y) = cos x cos y − sin x sin y.
- Find cos 15° using the difference identity.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** cos 15° = cos 45° cos 30° + sin 45° sin 30°, evaluated exactly from the standard values.
- A student writes sin(x − y) = sin x cos y + cos x sin y. What has gone wrong?
    - [object Object]
    - [object Object]
    - **answer:** sin(x − y) = sin x cos y − cos x sin y.

**Try it.**

- Express sin 75° using standard angles. → *sin(45° + 30°) = sin 45° cos 30° + cos 45° sin 30°.* — 
- Check the sum identity for cosine at x = y = 0. → *Both sides give 1.* — 
- Does checking an identity at three angles prove it? → *No.* — 
- Why does cos(−y) = cos y? → *Because cos is the x-coordinate, and reflecting an angle in the x-axis leaves that coordinate unchanged.* — 

**Think deeper.**

- Why are the signs in the cosine identities the reverse of those in the sine identities?

**Summary.** cos(x − y) = cos x cos y + sin x sin y is derived from the distance between two unit-circle points; replacing y by −y gives the sum form with the opposite sign. The sine identities carry the sign of the operation, and the tangent form follows by division wherever its denominator is not zero.

## Your response

Answer **separately** for each objective — a single verdict for the lesson is not enough, and for this lesson that means 2 separate answers:

- **C11-TRG-06** — materially taught or only mentioned? sufficient for a DERIVE demand? crowded out by the others?
- **C11-TRG-07** — materially taught or only mentioned? sufficient for a DERIVE demand? crowded out by the others?

Then for the lesson: mathematical correctness · scope · explanation · worked examples · whether feedback explains the misconception or just marks right/wrong · representation · accessibility · **granularity** · overall recommendation.

Record it in `class11-review/pilot/responses/ncert_kemh1_s3_4_sum_difference_lesson.response.json`. Put your name or reviewer code in `reviewer`.

---

# Lesson 3 — You will differentiate a composite function using the chain rule.

`cbse_fo11_chain_rule_lesson`

**Fingerprint:** `9b1c590b87fd25aca82bf1fa935befb0`  — copy this into your response.

**Source:** CBSE-only, entry FO-11 — no NCERT section or page exists for this content; its chapter adjacency is instructional placement, not bibliographic ownership

**Why this lesson is in the pilot:** CBSE-only, chapter-less, newest semantic model and visual family. Structural verification is strong here; whether it teaches the chain rule at the right depth is untested.

## Objectives it claims to cover

**C11-LIM-FO11** — Differentiate a composite function using the chain rule.

- demand: APPLY · representation expected: derivative notation · risk C

## The lesson

**Goal.** You will differentiate a composite function using the chain rule.

**Vocabulary.** [object Object] · [object Object]

> You already know what x² + 1 does to a number, and what cubing does to a number. A composite does both, one after the other: x² + 1 first, then the cube. The inner function acts first; the outer function acts on its result.

> To differentiate that, take the layers in turn. Differentiate the OUTER function, leaving the inner one sitting inside it, then multiply by the derivative of the INNER function. In symbols: d/dx[g(f(x))] = g′(f(x)) · f′(x).

> Both factors are there for a reason. The outer derivative says how fast the outer function changes with respect to its own input. But its input is not x — it is the inner function, which is changing too. The second factor accounts for that.

> For (x² + 1)³: the inner function is x² + 1 and the outer is u³. The outer derivative is 3u², which with the inner put back is 3(x² + 1)². The inner derivative is 2x. Multiply: 3(x² + 1)² × 2x.

> Check it at a number. At x = 2 the inner function is 5, so the outer derivative there is 75, the inner derivative is 4, and the derivative is 75 × 4 = 300.

> There is a memory phrase for this — differentiate the outside, leave the inside alone, multiply by the derivative of the inside. It is a good phrase as long as you can say what the outside and the inside ARE. Applied without that, it gets used on things that are not composites at all.

> That is the trap worth naming. You met the product rule just before this. f(x)·g(x) is a PRODUCT: two functions multiplied. g(f(x)) is a COMPOSITE: one function inside another. They look alike on the page and need different rules. Ask what is being done to what.

> The answers here are left unsimplified, like 3(x² + 1)² × 2x. That is a correct derivative. Tidying it is arithmetic you can do afterwards; the structure is what the rule gives you, and it is the structure that shows whether you applied the rule properly.

**Visuals.**

- *chain_rule*: A table for the composite (x² + 1) cubed. The inner function is x squared plus 1 and the outer function is u cubed. The derivative of the outer function is 3u squared, which at the inner function is 3 times (x squared plus 1) squared. The derivative of the inner function is 2x. Multiply the two factors together to get the derivative, 3 times (x squared plus 1) squared, times 2x.
- *chain_rule*: A table for the composite (3x + 2) to the fifth power. The inner function is 3x plus 2 and the outer function is u to the fifth. The derivative of the outer function is 5u to the fourth, which at the inner function is 5 times (3x plus 2) to the fourth. The derivative of the inner function is 3, a constant. Multiply the two factors together to get the derivative, 5 times (3x plus 2) to the fourth, times 3.

**Worked examples.**

- Differentiate (x² + 1)³.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 3(x² + 1)² × 2x
- Differentiate (3x + 2)⁵.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 5(3x + 2)⁴ × 3
- Differentiate sin(x²), with x in radians.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** cos(x²) × 2x

**Try it.**

- A student differentiates (x² + 1)³ and writes 3(x² + 1)². What is missing? → *The inner derivative: the answer is 3(x² + 1)² × 2x.* — 
- Differentiate (3x + 2)⁵. → *5(3x + 2)⁴ × 3.* — 
- Let f(x) = x² + 1 and g(u) = u³. Is g(f(x)) the same as f(g(x))? → *No.* — 
- Which rule for sin(x) · x², and which for sin(x²)? → *Product rule for the first; chain rule for the second.* — 

**Think deeper.**

- If the inner function is just x, the chain rule gives g′(x)·1. Why does the extra factor vanish, and what does that tell you?

**Summary.** A composite g(f(x)) has an inner function applied first and an outer function applied to the result. Its derivative is g′(f(x)) · f′(x): differentiate the outer function with the inner left in place, then multiply by the derivative of the inner. For (x² + 1)³ that is 3(x² + 1)² × 2x, which at x = 2 equals 300. The forgotten factor is the inner derivative. A product of two functions is a different structure and needs the product rule instead.

## Your response

Answer **separately** for each objective — a single verdict for the lesson is not enough:

- **C11-LIM-FO11** — materially taught or only mentioned? sufficient for a APPLY demand?

Then for the lesson: mathematical correctness · scope · explanation · worked examples · whether feedback explains the misconception or just marks right/wrong · representation · accessibility · **granularity** · overall recommendation.

Record it in `class11-review/pilot/responses/cbse_fo11_chain_rule_lesson.response.json`. Put your name or reviewer code in `reviewer`.

---

# Lesson 4 — You will use the closed forms for the sums of the first n natural numbers, their squares and their cubes.

`cbse_fo8_special_sums_lesson`

**Fingerprint:** `d2297c06c7424d875b9e8bf336dbe97f`  — copy this into your response.

**Source:** CBSE-only, entry FO-8 — no NCERT section or page exists for this content; its chapter adjacency is instructional placement, not bibliographic ownership

**Why this lesson is in the pilot:** CBSE-only, chapter-less, new visual family, and three formulas in one lesson — is that one coherent lesson or too dense?

## Objectives it claims to cover

**C11-SEQ-FO8** — Use the closed forms for the sum of the first n natural numbers, their squares and their cubes.

- demand: APPLY · representation expected: sigma notation · risk B

## The lesson

**Goal.** You will use the closed forms for the sums of the first n natural numbers, their squares and their cubes.

**Vocabulary.** [object Object] · [object Object]

> You can already write a finite sum in sigma notation and expand it. Adding 1 + 2 + 3 + 4 + 5 + 6 is no trouble. Adding the first two hundred natural numbers the same way is.

> Each of these three sums has a closed form: a formula that gives the same total without listing a single term. The formula does not change what the sum MEANS. It computes the same finite total by a shorter route.

> For the first n natural numbers, the sum from k = 1 to n of k is n(n + 1)/2. At n = 6 that is 6 x 7 / 2 = 21, which is exactly what writing the terms out gives.

> For their squares, the sum from k = 1 to n of k² is n(n + 1)(2n + 1)/6. At n = 6: 6(6 + 1)(2 × 6 + 1)/6 = 91. The summand is k², so each term is the square of the INDEX — not the square of the running total.

> For their cubes, the sum from k = 1 to n of k³ is [n(n + 1)/2]². Read that carefully: it is the square of the natural-number sum, not the sum of the squares. At n = 6 the natural sum is 21, and 21 squared is 441.

> Those two are genuinely different numbers. At n = 6 the sum of squares is 91 and the sum of cubes is 441. Confusing them is the single most common error here.

> All three totals are whole numbers for every whole n, even though the formulas divide by 2 and by 6. That is not a coincidence: among n, n + 1 and 2n + 1 the product always carries the factors the division needs.

> Choosing the formula is a matter of reading the summand. k means the first; k² the second; k³ the third. The bounds tell you n — the sum from k = 1 to n has n terms, and the upper bound IS the count only because the lower bound is 1.

**Visuals.**

- *special_sum*: The sum from k = 1 to 6 of k, written out as 1 + 2 + 3 + 4 + 5 + 6, with closed form 6(6 + 1)/2 and exact total 21.
- *special_sum*: The sum from k = 1 to 6 of k squared, written out as 1 + 4 + 9 + 16 + 25 + 36, with closed form 6(6 + 1)(2 × 6 + 1)/6 and exact total 91. Each term is the square of the index, not the square of the running total.
- *special_sum*: The sum from k = 1 to 6 of k cubed, written out as 1 + 8 + 27 + 64 + 125 + 216, with exact total 441. Its closed form is the square of the natural-number sum 21, not the sum of the squares.

**Worked examples.**

- Find the sum of the first 50 natural numbers.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 1275
- Find the sum from k = 1 to 10 of k². The formula is not named for you — read the summand.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 385
- Find the sum from k = 1 to 10 of k³.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 3025

**Try it.**

- A student computes the sum from k = 1 to 10 of k² and answers 55. What went wrong? → *They used the wrong formula; the answer is 385.* — 
- Another student computes the sum from k = 1 to 10 of k³ by squaring 385. What went wrong? → *They squared the wrong sum; the answer is 3025.* — 
- For the sum from k = 1 to 7 of k, a student substitutes n = 8 "because there are 8 numbers from 0 to 7". What went wrong? → *n is 7, so the total is 28.* — 
- Find the sum from k = 1 to 5 of k³. → *225.* — 

**Think deeper.**

- Compare the two closed forms for the sum of cubes and the sum of the first n natural numbers. What does the comparison tell you?

**Summary.** Three closed forms: the sum of k is n(n + 1)/2, the sum of k² is n(n + 1)(2n + 1)/6, and the sum of k³ is [n(n + 1)/2]² — the square of the natural-number sum, not the sum of the squares. Choose by reading the summand, and take n from the upper bound, which counts the terms because the sum starts at k = 1. At n = 6 the three totals are 21, 91 and 441.

## Your response

Answer **separately** for each objective — a single verdict for the lesson is not enough:

- **C11-SEQ-FO8** — materially taught or only mentioned? sufficient for a APPLY demand?

Then for the lesson: mathematical correctness · scope · explanation · worked examples · whether feedback explains the misconception or just marks right/wrong · representation · accessibility · **granularity** · overall recommendation.

Record it in `class11-review/pilot/responses/cbse_fo8_special_sums_lesson.response.json`. Put your name or reviewer code in `reviewer`.

---

# Returning your work

One file per lesson, in `class11-review/pilot/responses/`. Each is validated on structure only — completeness, allowed values, matching fingerprint. **No validator will reject a judgement for what it concludes.**

Reviews are accepted one at a time; you do not need to finish all four before returning one.
