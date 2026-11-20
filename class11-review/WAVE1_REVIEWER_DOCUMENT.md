# Class 11 — Human Review, Wave 1

**25 lessons. Nothing has been sent, reviewed or published.**

Every judgement field in these packets is empty. Automated checks confirmed each lesson is well-formed and truthfully mapped to its source — they say nothing about whether it *teaches* what it claims to. That is the question here.

## Why these lessons

architectural information value — unit-to-lesson granularity, shared source keys, CBSE-only ownership, scope fragments and new visual families — not mathematical difficulty

### The architectural fact worth knowing before you start

The mapping between canonical units and lessons is **many-to-many**, in both directions:

- **35 of 90 lessons** carry more than one canonical unit
- **27 units** are taught across more than one lesson

So "does this lesson teach its objective?" has a companion question: **is this the right number of lessons for these objectives?** The granularity field in each packet is where that goes, and it bears on whether Class 12 should inherit the same mapping.

---

## 1. You will count the members of two overlapping sets by accounting for each region once, and see why the overlap must be subtracted.

`ncert_kemh1_s1_9_practical_counting_lesson` · chapter-1 · fingerprint `3d3a0e329e9a914e…`

**Selected because:** carries 3 canonical units; covers a tracked shared source key; shares unit(s) with another lesson: C11-SET-09, C11-SET-10; risk class C; scope-fragment source

**Source:** NCERT 1.9, page 17 (kemh1)

### Objectives this lesson claims to cover

**C11-SET-09** — Compute the union and intersection of sets and read each off a Venn diagram.

- demand: APPLY · representation: set notation and Venn diagram · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s1_9_union_intersection_lesson, ncert_kemh1_s1_9_difference_lesson

**C11-SET-10** — Compute the difference of two sets and distinguish it from the complement.

- demand: APPLY · representation: set notation and Venn diagram · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s1_9_union_intersection_lesson, ncert_kemh1_s1_9_difference_lesson

**C11-SET-FO1** — Use the two-set counting relation to solve practical problems about overlapping collections.

- demand: APPLY · representation: Venn diagram · risk C · FORMATIVE_ONLY

### The lesson

**Goal.** You will count the members of two overlapping sets by accounting for each region once, and see why the overlap must be subtracted.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

> Two overlapping sets cut the people or objects being counted into three regions inside the union: in A only, in both, and in B only. Counting each region once gives the size of the union.

> Take a group where 18 take up one activity and 12 take up another, with 6 doing both. The region counts are: 12 in the first only, 6 in both, and 6 in the second only. The union is 12 + 6 + 6 = 24.

> This way of counting is called inclusion-exclusion, and it begins with the regions. Now compare the region count with simply adding the totals: 18 + 12 = 30, which is 6 more than the 24 the regions give. The reason is that the 6 people doing both were counted once inside the first total and again inside the second.

> So subtract the overlap once: n(A \u222a B) = n(A) + n(B) \u2212 n(A \u2229 B). Here 18 + 12 \u2212 6 = 24, matching the region count exactly. The relation holds: the counts reconcile.

> If a universal set is known, the rest follows. With a group of 26 altogether, the number outside both activities is 26 \u2212 24 = 2.

> When the sets are disjoint the overlap is 0 and the subtraction changes nothing, so the relation still holds and simply reduces to adding the totals.

**Visuals.**

- *venn*: Two overlapping circles marked C and T inside a rectangle marked U. All three regions inside the circles are shaded and each carries its own count.

**Worked examples.**

- Of a group, 18 do the first activity, 12 the second, and 6 do both. How many do at least one?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 24.
- Derive the counting relation from that region accounting.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** n(A \u222a B) = n(A) + n(B) \u2212 n(A \u2229 B).
- A student answers 30 for the number doing at least one. What has gone wrong?
    - [object Object]
    - [object Object]
    - **answer:** 24; the overlap was counted twice.

**Try it.**

- In a group of 40, 25 like one subject, 20 like another and 10 like both. How many like neither? → *5.* — 
- Can n(A \u222a B) ever be larger than n(A) + n(B)? → *No.* — 
- If n(A) = 12, n(B) = 9 and n(A \u222a B) = 15, how many are in both? → *6.* — 
- Why does the relation subtract the overlap once rather than twice? → *Because it was counted twice in total, and should be counted once.* — 

**Think deeper.**

- If A and B are disjoint, what happens to the counting relation, and why is that the expected answer rather than a special case?

**Summary.** Counting two overlapping sets means counting each region once: 12 + 6 + 6 = 24. Adding the totals instead counts the overlap twice, so n(A \u222a B) = n(A) + n(B) \u2212 n(A \u2229 B). With the universe known, the rest lie outside the union.

### Your review

For **each** objective above, answered separately:

- **C11-SET-09** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-SET-10** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-SET-FO1** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s1_9_practical_counting_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 2. You will state the binomial theorem for a positive integral index and follow its proof by induction.

`ncert_kemh1_s7_2_binomial_theorem_lesson` · chapter-7 · fingerprint `d721cc79c8850f1b…`

**Selected because:** carries 4 canonical units — the hardest granularity case; covers a tracked shared source key; scope-fragment source

**Source:** NCERT 7.2, page 160 (kemh1)

### Objectives this lesson claims to cover

**C11-BIN-01** — State the binomial theorem for a positive integral index and follow its proof by induction on the index.

- demand: PROVE · representation: binomial coefficient and sigma notation · risk B · SUMMATIVE_CORE
- proof expectation: PROVE

**C11-BIN-02** — Generate the binomial coefficients from Pascal’s triangle and relate each entry to nCr.

- demand: UNDERSTAND · representation: Pascal's triangle figure · risk B · SUMMATIVE_CORE

**C11-BIN-03** — Expand a binomial power and use the expansion in simple numerical and algebraic applications.

- demand: APPLY · representation: expansion notation · risk B · SUMMATIVE_CORE

**C11-BIN-FO7** — Write the general term of a binomial expansion and identify the middle term.

- demand: APPLY · representation: general term notation · risk B · FORMATIVE_ONLY

### The lesson

**Goal.** You will state the binomial theorem for a positive integral index and follow its proof by induction.

**Vocabulary.** [object Object] · [object Object] · [object Object]

**Learn the idea / See it.**

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

### Your review

For **each** objective above, answered separately:

- **C11-BIN-01** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-BIN-02** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-BIN-03** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-BIN-FO7** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s7_2_binomial_theorem_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 3. You will use the step-deviation method and show it agrees with the direct method.

`ncert_kemh1_s13_5_4_shortcut_lesson` · chapter-13 · fingerprint `324ec7c06418a76c…`

**Selected because:** carries 3 canonical units; covers a tracked shared source key; shares unit(s) with another lesson: C11-STA-05, C11-STA-06

**Source:** NCERT 13.5, page 373 (kemh1)

### Objectives this lesson claims to cover

**C11-STA-05** — Compute the variance and standard deviation of ungrouped data and explain why deviations are squared.

- demand: DERIVE · representation: squared deviation table · risk B · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s13_5_variance_sd_lesson, ncert_kemh1_s13_5_grouped_variance_lesson

**C11-STA-06** — Compute the variance and standard deviation for a grouped frequency distribution.

- demand: DERIVE · representation: grouped frequency table · risk B · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s13_5_variance_sd_lesson, ncert_kemh1_s13_5_grouped_variance_lesson

**C11-STA-07** — Use the step-deviation form to compute the standard deviation and show it agrees with the direct method.

- demand: DERIVE · representation: step-deviation table · risk A · SUMMATIVE_CORE

### The lesson

**Goal.** You will use the step-deviation method and show it agrees with the direct method.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

> The direct method works, but with large class marks the squared deviations become awkward numbers. The shortcut method reduces the arithmetic without changing the answer.

> Pick an assumed mean a, and divide each deviation by the class width h. That gives the step deviation u = (x − a)/h, usually a small whole number.

> With assumed mean 15 and width 10, the class marks 5, 15, 25 give step deviations -1, 0, 1 — far easier to square than the deviations themselves.

> The variance is then recovered by σ² = h²[Σfu²/n − (Σfu/n)²]. With Σfu = -1 and Σfu² = 5 over 10 observations, this gives 49.

> The direct method gave 49. The two agree, and that is the point: the shortcut is not a different measure or an approximation, it is the same variance reached by easier arithmetic.

> The h² is there because dividing every deviation by h divided the variance by h². Multiplying back restores the original scale.

> The assumed mean can be any convenient value. Choosing 15 rather than another class mark changes the intermediate columns completely but not the final answer — a method that only worked for one lucky choice would not be a method.

> One condition does matter. Step deviations divide by a common class width, so if the classes have different widths there is no single h and the method does not apply. The direct method still does.

**Visuals.**

- *grouped_table*: A step-deviation table with class marks 5, 15, 25, their deviations from the assumed mean of 15, the step deviations -1, 0, 1 found by dividing by the class width 10, and those weighted by frequency and squared. The small whole numbers are what make this route easier than squaring the deviations directly.
- *method_comparison*: A table giving the variance of the same distribution twice: once by the direct method, squaring each deviation from the mean, and once by the shortcut method with an assumed mean. Both give 49, which is the point — they are two ways of computing one quantity, not two separate answers.

**Worked examples.**

- Find the step deviations for assumed mean 15.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** -1, 0, 1
- Find the variance by the shortcut method and compare with the direct one.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 49
- Why must the classes share a common width?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because the step deviation divides by one common width h.

**Try it.**

- The classes are 0–10, 10–25, 25–40. Can the shortcut be used? → *No.* — 
- Does changing the assumed mean change the variance? → *No.* — 
- If the shortcut and direct answers differ, what follows? → *One of them has an error.* — 
- What is the step deviation of the class mark equal to the assumed mean? → *0.* — 

**Think deeper.**

- Why is it worth proving the shortcut agrees rather than just trusting the formula?

**Summary.** The step deviation u = (x − a)/h makes the arithmetic small, and σ² = h²[Σfu²/n − (Σfu/n)²] recovers the variance: 49, matching the direct method's 49. The h² restores the scale that dividing removed. Any convenient assumed mean works, but the classes must share a common width or there is no h to divide by.

### Your review

For **each** objective above, answered separately:

- **C11-STA-05** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-STA-06** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-STA-07** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s13_5_4_shortcut_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 4. You will write the equation of a line parallel to an axis, and build the point-slope form from the definition of slope rather than from memory.

`ncert_kemh1_s9_3_axis_point_slope_lesson` · chapter-9 · fingerprint `b669a62bbdb4bd0a…`

**Selected because:** carries 2 canonical units; covers a tracked shared source key; shares unit(s) with another lesson: C11-STL-03, C11-STL-04; scope-fragment source

**Source:** NCERT 9.3, page 156 (kemh1)

### Objectives this lesson claims to cover

**C11-STL-03** — Write the equation of a line parallel to an axis, and of a line through a given point with a given slope.

- demand: DERIVE · representation: coordinate graph · risk B · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s9_3_forms_lesson

**C11-STL-04** — Write the equation of a line in slope-intercept, two-point and intercept form and convert between them.

- demand: DERIVE · representation: coordinate graph · risk B · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s9_3_forms_lesson

### The lesson

**Goal.** You will write the equation of a line parallel to an axis, and build the point-slope form from the definition of slope rather than from memory.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

> An equation of a line is a condition its points satisfy. Two conditions must hold: every point of the line satisfies it, and no other point does.

> Lines parallel to the axes are the simplest. On x = 3 every point has x-coordinate 3 whatever its height, so that single statement is the equation. On y = -2 every point has y-coordinate −2.

> Now a line through a known point with a known slope. Let the point be (x₁, y₁) and let (x, y) be any other point of the line. The slope between them is (y − y₁)/(x − x₁), and that must equal m.

> Multiplying through gives y − y₁ = m(x − x₁), the point-slope form. It is not a formula to remember separately: it is the definition of slope with the denominator cleared.

> For the line through (1, 2) with slope 2, this gives y − 2 = 2(x − 1), and rearranging gives 2x − y = 0.

> The form has a limit worth naming. It contains m, so it cannot describe a vertical line, which has no slope to substitute. That is not a gap in the geometry — x = 3 is a perfectly good equation — but a reminder that no single form covers every line.

**Visuals.**

- *coordinate_line_graph*: A coordinate grid showing two lines parallel to the axes. The solid line is x = 3, running straight up and down so that every point on it has the same x-coordinate and it has no slope at all. The dashed line is y = -2, running flat so that every point has the same y-coordinate and its slope is 0.

**Worked examples.**

- Write the equation of the vertical line through (3, 5).
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** x = 3
- Derive the equation of the line through (1, 2) with slope 2.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** y − 2 = 2(x − 1)
- A student tries to write a vertical line in point-slope form. What goes wrong?
    - [object Object]
    - [object Object]
    - **answer:** No slope exists to substitute; the line is written as x equals a constant instead.

**Try it.**

- Write the equation of the y-axis. → *x = 0.* — 
- Does every point satisfying y − 2 = 2(x − 1) lie on the line through (1, 2) with slope 2? → *Yes.* — 
- Why does the point-slope form need a point as well as a slope? → *Because slope alone fixes only the direction.* — 
- Is (4, 8) on the line 2x − y = 0? → *Yes: the point satisfies the equation.* — 

**Think deeper.**

- Why does an equation of a line need to exclude points as well as include them?

**Summary.** A line parallel to an axis is written by fixing the constant coordinate, such as x = 3 or y = -2. The point-slope form y − y₁ = m(x − x₁) is the definition of slope with the denominator cleared, and it cannot describe a vertical line, which has no slope.

### Your review

For **each** objective above, answered separately:

- **C11-STL-03** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-STL-04** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s9_3_axis_point_slope_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 5. You will write a line in three further forms and recognise that different equations can describe the same line.

`ncert_kemh1_s9_3_forms_lesson` · chapter-9 · fingerprint `500dfd1dc3ae8e29…`

**Selected because:** carries 2 canonical units; covers a tracked shared source key; shares unit(s) with another lesson: C11-STL-03, C11-STL-04; scope-fragment source

**Source:** NCERT 9.3, page 159 (kemh1)

### Objectives this lesson claims to cover

**C11-STL-03** — Write the equation of a line parallel to an axis, and of a line through a given point with a given slope.

- demand: DERIVE · representation: coordinate graph · risk B · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s9_3_axis_point_slope_lesson

**C11-STL-04** — Write the equation of a line in slope-intercept, two-point and intercept form and convert between them.

- demand: DERIVE · representation: coordinate graph · risk B · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s9_3_axis_point_slope_lesson

### The lesson

**Goal.** You will write a line in three further forms and recognise that different equations can describe the same line.

**Vocabulary.** [object Object] · [object Object]

**Learn the idea / See it.**

> Each form below is the point-slope form with a particular point substituted, so none is a new fact.

> Take the point where the line crosses the y-axis, which is (0, c). Substituting gives y − c = m(x − 0), that is y = mx + c, the slope-intercept form. Here c is the y-intercept. For 2x − y = 0 this is y = 2x.

> If two points are known instead of a slope, compute the slope from them and substitute either point. That gives the two-point form. The same caution applies as before: if the two points share an x-coordinate there is no slope, and the line is written as x equals a constant.

> If both intercepts are known, the line can be written as x/a + y/b = 1, where a is the x-intercept and b the y-intercept. For 2x + 3y − 6 = 0 the intercepts are 3 and 2, giving x/3 + y/2 = 1.

> This form has its own limitation. A line through the origin has both intercepts zero, and the expression would divide by zero, so x − y = 0 has no intercept form: the form does not exist for it.

> A line is not its equation. 2x + 3y − 6 = 0 and 4x + 6y − 12 = 0 look different and describe the same points, because one is a multiple of the other: the two equations describe one line. Multiplying an equation through by a non-zero number changes which points satisfy it not at all.

**Visuals.**

- *coordinate_line_graph*: A coordinate grid with the line through (1, 2) and (4, 8) drawn across it. Both points are marked. Going from the first to the second, x increases by 3 and y increases by 6, so the line rises twice as fast as it runs and its slope is 2.

**Worked examples.**

- Write 2x − y = 0 in slope-intercept form.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** y = 2x
- Write 2x + 3y − 6 = 0 in intercept form.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** x/3 + y/2 = 1
- A student says 2x + 3y − 6 = 0 and 4x + 6y − 12 = 0 are different lines. What has gone wrong?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** They are the same line written two ways.

**Try it.**

- Write the line through (0, 0) and (2, 6) in slope-intercept form. → *y = 3x.* — 
- Why can a vertical line not be written as y = mx + c? → *Because it has no slope to put in m.* — 
- If two equations are not multiples of each other, can they describe the same line? → *No.* — 
- Are 2x + 3y − 6 = 0 and 2x + 3y + 6 = 0 the same line? → *No: they are different lines.* — 

**Think deeper.**

- Why are there several forms for the equation of a line at all, rather than one?

**Summary.** Slope-intercept, two-point and intercept forms are all the point-slope form with particular information substituted. A line through the origin has no intercept form and a vertical line has no slope-intercept form. Different equations describe the same line exactly when one is a non-zero multiple of the other.

### Your review

For **each** objective above, answered separately:

- **C11-STL-03** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-STL-04** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s9_3_forms_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 6. You will derive the sine and cosine of a sum and a difference of two angles, and use them to find values the standard angles alone could not give.

`ncert_kemh1_s3_4_sum_difference_lesson` · chapter-3 · fingerprint `e8aba9128c52ea2c…`

**Selected because:** carries 2 canonical units; covers a tracked shared source key; shares unit(s) with another lesson: C11-TRG-06, C11-TRG-07; risk class C

**Source:** NCERT 3.4, page 49 (kemh1)

### Objectives this lesson claims to cover

**C11-TRG-06** — Express sin and cos of a sum or difference in terms of the component angles and apply the results.

- demand: DERIVE · representation: identity statements; no figure required · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s3_4_multiple_angles_lesson

**C11-TRG-07** — Deduce the double- and triple-angle identities and the sum-to-product forms from the sum and difference identities.

- demand: DERIVE · representation: identity statements · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s3_4_multiple_angles_lesson

### The lesson

**Goal.** You will derive the sine and cosine of a sum and a difference of two angles, and use them to find values the standard angles alone could not give.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

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

### Your review

For **each** objective above, answered separately:

- **C11-TRG-06** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-TRG-07** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s3_4_sum_difference_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 7. You will deduce the double- and triple-angle identities and the sum-to-product forms from the sum and difference identities, rather than collecting them as separate formulas.

`ncert_kemh1_s3_4_multiple_angles_lesson` · chapter-3 · fingerprint `eb87aa91324f5ba5…`

**Selected because:** carries 2 canonical units; covers a tracked shared source key; shares unit(s) with another lesson: C11-TRG-06, C11-TRG-07; risk class C

**Source:** NCERT 3.4, page 54 (kemh1)

### Objectives this lesson claims to cover

**C11-TRG-06** — Express sin and cos of a sum or difference in terms of the component angles and apply the results.

- demand: DERIVE · representation: identity statements; no figure required · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s3_4_sum_difference_lesson

**C11-TRG-07** — Deduce the double- and triple-angle identities and the sum-to-product forms from the sum and difference identities.

- demand: DERIVE · representation: identity statements · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s3_4_sum_difference_lesson

### The lesson

**Goal.** You will deduce the double- and triple-angle identities and the sum-to-product forms from the sum and difference identities, rather than collecting them as separate formulas.

**Vocabulary.** [object Object] · [object Object]

**Learn the idea / See it.**

> Every identity in this lesson comes from the previous one. None is new information; each is the sum or difference identity used in a particular way.

> Setting y = x in sin(x + y) = sin x cos y + cos x sin y gives sin 2x = 2 sin x cos x immediately, because both products become the same.

> The same substitution in cos(x + y) = cos x cos y − sin x sin y gives cos 2x = cos²x − sin²x. Using sin²x + cos²x = 1 to remove one term at a time gives the other two forms, 2cos²x − 1 and 1 − 2sin²x, which are the same identity wearing different clothes.

> The triple-angle results come from writing 3x as 2x + x and applying the sum identity, then substituting the double-angle results just obtained. That dependency is worth noticing: the triple-angle identity rests on the double-angle one, which rests on the sum identity.

> The sum-to-product forms are the sum and difference identities read backwards. Adding sin(A + B) and sin(A − B) cancels the second term of each and leaves 2 sin A cos B; writing the two angles as the half-sum and half-difference of the original pair turns that into a rule for sin C + sin D.

> So the chain is: the chord argument gives cos(x − y); substitution gives the other three sum and difference identities; setting the angles equal gives the double-angle forms; combining those gives the triple-angle forms; and adding or subtracting pairs gives the sum-to-product forms.

**Worked examples.**

- Derive sin 2x.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** sin 2x = 2 sin x cos x.
- Obtain the three forms of cos 2x.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** cos 2x = cos²x − sin²x = 2cos²x − 1 = 1 − 2sin²x.
- A student treats sin 2x = 2 sin x as obvious. What has gone wrong?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** sin 2x = 2 sin x cos x; the factor cos x cannot be dropped.

**Try it.**

- Derive cos 2x in the form 1 − 2sin²x and say which earlier results you used. → *From cos(x + y) with y = x, then the Pythagorean identity.* — 
- Is tan 2x = 2 tan x? → *No.* — 
- Why does adding sin(A + B) and sin(A − B) simplify? → *Because the cos A sin B terms cancel.* — 
- If the sum identity were wrong, which results in this lesson would be affected? → *All of them.* — 

**Think deeper.**

- This lesson could be presented as a list of eight formulas to memorise. What is lost by doing so?

**Summary.** Setting y = x in the sum identities gives the double-angle forms, the Pythagorean identity gives the three versions of cos 2x, writing 3x as 2x + x gives the triple-angle forms, and adding or subtracting pairs gives the sum-to-product forms. Every result traces back to the chord argument for cos(x − y).

### Your review

For **each** objective above, answered separately:

- **C11-TRG-06** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-TRG-07** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s3_4_multiple_angles_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 8. You will decide whether one set is contained in another, and separate a subset from a proper subset.

`ncert_kemh1_s1_6_subsets_lesson` · chapter-1 · fingerprint `152192c638d6b5c3…`

**Selected because:** carries 2 canonical units; covers a tracked shared source key; shares unit(s) with another lesson: C11-SET-05, C11-SET-06; risk class C

**Source:** NCERT 1.6, page 6 (kemh1)

### Objectives this lesson claims to cover

**C11-SET-05** — Decide containment between sets and distinguish a subset from a proper subset.

- demand: UNDERSTAND · representation: subset symbols · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s1_6_intervals_lesson

**C11-SET-06** — Read and write open, closed and half-open intervals as subsets of the reals.

- demand: UNDERSTAND · representation: interval notation and the real line · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s1_6_intervals_lesson

### The lesson

**Goal.** You will decide whether one set is contained in another, and separate a subset from a proper subset.

**Vocabulary.** [object Object] · [object Object] · [object Object]

**Learn the idea / See it.**

> The previous lesson needed two directions to establish equality. A single direction is worth a name of its own: when every element of A belongs to B, we say A is a subset of B, written A \u2286 B.

> So {1, 3, 5} \u2286 {1, 2, 3, 4, 5}, because 1, 3 and 5 all appear in the second set. The test is elementwise and nothing else.

> Every set is a subset of itself, since every element of A is certainly in A. And the empty set is a subset of every set, because it has no element that could fail the test.

> When A \u2286 B and the two are not equal, A is a proper subset of B. {1, 3, 5} is a proper subset of {1, 2, 3, 4, 5} because 2 and 4 are in the larger set only.

> A caution about the reading of pictures: containment is decided by elements, not by a drawing. A circle drawn inside another circle asserts a subset relation; it does not establish one. The elements settle it.

**Visuals.**

- *venn*: Two overlapping circles inside a rectangle marked U. The overlap, the region inside both A and B, is shaded.

**Worked examples.**

- Is {1, 3, 5} a subset of {1, 2, 3, 4, 5}?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Yes.
- Is {1, 3, 5} a proper subset of {1, 2, 3, 4, 5}?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Yes, a proper subset.
- A student concludes A \u2286 B because A has fewer elements than B. What has gone wrong?
    - [object Object]
    - [object Object]
    - **answer:** Fewer elements does not imply containment; each element must be checked.

**Try it.**

- Is {1, 5} \u2286 {1, 2, 3}? → *No.* — 
- List all subsets of {a, b}. → *∅, {a}, {b}, {a, b}.* — 
- If A \u2286 B and B \u2286 A, what follows? → *A = B.* — 
- A diagram shows circle A inside circle B. Does that prove A \u2286 B? → *No.* — 

**Think deeper.**

- Why is ∅ a subset of every set, when it has nothing in common with them?

**Summary.** A \u2286 B when every element of A is in B, tested one element at a time. If in addition A is not equal to B, the containment is proper. ∅ is a subset of every set and every set is a subset of itself.

### Your review

For **each** objective above, answered separately:

- **C11-SET-05** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-SET-06** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s1_6_subsets_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 9. You will write the sum of a sequence’s terms in sigma notation and expand it again.

`ncert_kemh1_s8_3_series_sigma_lesson` · chapter-8 · fingerprint `e94ab5fefee0b6bf…`

**Selected because:** carries 2 canonical units; covers a tracked shared source key; shares unit(s) with another lesson: C11-SEQ-02, C11-SEQ-03

**Source:** NCERT 8.3, page 181 (kemh1)

### Objectives this lesson claims to cover

**C11-SEQ-02** — Write the sum of a sequence as a series using sigma notation.

- demand: UNDERSTAND · representation: sigma notation · risk B · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s8_3_arithmetic_mean_lesson

**C11-SEQ-03** — Insert the arithmetic mean between two numbers and insert n arithmetic means.

- demand: DERIVE · representation: A.M. notation · risk A · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s8_3_arithmetic_mean_lesson

### The lesson

**Goal.** You will write the sum of a sequence’s terms in sigma notation and expand it again.

**Vocabulary.** [object Object] · [object Object]

**Learn the idea / See it.**

> Take the sequence with a_n = 2n + 1, whose first four terms are 3, 5, 7, 9. Adding them gives 24. That sum is a series.

> A sequence and a series are different objects. The sequence is the ordered list; the series is the single number that results from adding its terms. Writing them the same way invites the error of treating one as the other.

> Writing out long sums is impractical, so there is a notation. Sigma notation records three things: the index variable, where it starts, where it stops, and the expression being summed.

> So the sum from k = 1 to 4 of 2k + 1 means exactly 3 + 5 + 7 + 9, which is 24. Nothing is hidden in the notation: it is the same sum, written compactly.

> The bounds are not decoration. Without them the symbol names no particular sum — it would say to add terms, without saying which. Changing the upper bound changes the sum.

> Another example: the sum from k = 1 to 5 of k² expands to 1 + 4 + 9 + 16 + 25, giving 55.

> The index variable is internal to the sum. Whether it is called k or i makes no difference to the answer, since it only counts the positions being included.

**Worked examples.**

- Expand and evaluate the sum from k = 1 to 4 of 2k + 1.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 24
- Evaluate the sum from k = 1 to 5 of k².
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 55
- Why must sigma notation carry bounds?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because without them the notation names no particular sum.

**Try it.**

- Expand the sum of k from k = 1 to 4. → *1 + 2 + 3 + 4 = 10.* — 
- Write the sum 2 + 4 + 6 + 8 in sigma notation. → *The sum of 2k from k = 1 to 4.* — 
- How many terms does a sum with index from 3 to 7 have? → *5.* — 
- Is a series an ordered list? → *No.* — 

**Think deeper.**

- Sigma notation says nothing a written-out sum does not. Why introduce it at all?

**Summary.** A series is the sum of a sequence’s terms, and it is a different object from the sequence. Sigma notation records the index, its lower and upper bounds, and the summand: the sum from k = 1 to 4 of 2k + 1 is 3 + 5 + 7 + 9 = 24. The bounds are essential, since without them no particular sum is named.

### Your review

For **each** objective above, answered separately:

- **C11-SEQ-02** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-SEQ-03** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s8_3_series_sigma_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 10. You will differentiate a composite function using the chain rule.

`cbse_fo11_chain_rule_lesson` · chapter-less required · fingerprint `9b1c590b87fd25ac…`

**Selected because:** CBSE-only required content (FO-11); chapter-less placement; risk class C; new visual family: chain_rule

**Source:** CBSE-only, entry FO-11 — CBSE-only: no NCERT section or page exists for this content; empty section and page 0 are absence markers, not missing data

### Objectives this lesson claims to cover

**C11-LIM-FO11** — Differentiate a composite function using the chain rule.

- demand: APPLY · representation: derivative notation · risk C · FORMATIVE_ONLY

### The lesson

**Goal.** You will differentiate a composite function using the chain rule.

**Vocabulary.** [object Object] · [object Object]

**Learn the idea / See it.**

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

### Your review

For **each** objective above, answered separately:

- **C11-LIM-FO11** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/cbse_fo11_chain_rule_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 11. You will recognise the standard real functions by rule, domain, range and graph, and see why some of their graphs must be drawn in pieces.

`ncert_kemh1_s2_4_1_real_functions_lesson` · chapter-2 · fingerprint `0f564b73e3aff072…`

**Selected because:** carries 2 canonical units; shares unit(s) with another lesson: C11-RF-03; risk class C

**Source:** NCERT 2.4, page 32 (kemh1)

### Objectives this lesson claims to cover

**C11-RF-03** — Test whether a relation is a function and state its domain, codomain and range.

- demand: UNDERSTAND · representation: arrow diagram · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s2_4_functions_lesson, ncert_kemh1_s2_4_2_algebra_of_functions_lesson

**C11-RF-04** — Identify and sketch constant, identity, polynomial, rational, modulus, signum, exponential, logarithmic and greatest-integer functions, stating domain and range.

- demand: APPLY · representation: function graphs for nine families · risk C · SUMMATIVE_CORE

### The lesson

**Goal.** You will recognise the standard real functions by rule, domain, range and graph, and see why some of their graphs must be drawn in pieces.

**Vocabulary.** [object Object] · [object Object] · [object Object] · [object Object]

**Learn the idea / See it.**

> A real function takes real numbers to real numbers. Its graph is simply the set of pairs (x, f(x)), so the picture and the rule are the same object seen two ways.

> The simplest are the constant function, f(x) = 3, whose domain is all real numbers and whose range is the single value {3}; and the identity function, f(x) = x, where domain and range are both all real numbers.

> The modulus function f(x) = |x| has domain all real numbers and range all non-negative real numbers, since a distance is never negative. Its graph is the familiar V, and it comes from the rule rather than being drawn by hand.

> The signum function records only the sign: f(x) = −1 for x < 0, 0 for x = 0, 1 for x > 0. Its range is just {−1, 0, 1}. Its graph cannot be one line, because the value jumps as the argument passes zero, so it is drawn in 3 separate pieces.

> The greatest integer function f(x) = [x] assigns each number the greatest integer not above it, giving range all integers. Its graph is a staircase: over the sampled range it needs 7 separate steps, because the value jumps at every integer instead of sliding.

> Some functions exclude arguments outright. The reciprocal f(x) = 1/x has domain all real numbers except 0, so its graph has 2 branches with nothing drawn at the excluded argument. The logarithmic function has domain all positive real numbers, so no part of its graph lies to the left of zero.

> In every case the domain belongs to the function. A drawn curve that passes over an excluded argument is not a neater picture of the same function; it is a picture of a different claim.

**Visuals.**

- *real_function_graph*: The graph of the modulus function from minus four to four. Two straight pieces meeting at the origin in a V shape, the left falling to the origin and the right rising from it, so no value is ever negative.
- *real_function_graph*: The graph of the signum function. A horizontal piece at minus one for every negative argument, a single isolated point at the origin, and a horizontal piece at one for every positive argument. The three pieces are drawn separately because the function jumps between them.
- *real_function_graph*: The graph of the greatest integer function. A sequence of horizontal steps, each one unit long, rising by one at every integer. Each step is drawn as its own piece because the value jumps at the integers rather than sliding.
- *real_function_graph*: The graph of one over x. Two separate branches, one in the lower left and one in the upper right, with nothing drawn at zero because the function has no value there.

**Worked examples.**

- Why is the range of f(x) = 3 only {3}?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** {3}
- Why must the graph of the greatest integer function be drawn in separate pieces?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 7 separate steps.
- A student draws the graph of f(x) = 1/x as one continuous curve sweeping through the origin. What has gone wrong?
    - [object Object]
    - [object Object]
    - **answer:** Two separate branches, with nothing drawn at the excluded argument.

**Try it.**

- What is the greatest integer of 2.7, and of −2.3? → *2 and -3.* — 
- Why is the range of the signum function finite? → *Because it has only three possible outputs.* — 
- Can a graph be used to read off the domain? → *Only partly.* — 
- Is the modulus function one-to-one? → *No.* — 

**Think deeper.**

- Two of these functions jump and one simply has an argument missing. Why are those different situations, even though both graphs come in pieces?

**Summary.** The standard real functions carry their domains and ranges with them: the constant has a single-value range, the modulus never goes negative, the signum takes only {−1, 0, 1}, and the greatest integer steps through the integers. Graphs are drawn in pieces wherever the function jumps or has no value.

### Your review

For **each** objective above, answered separately:

- **C11-RF-03** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-RF-04** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s2_4_1_real_functions_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 12. You will reduce any integer power of i using a cycle of four, and divide one complex number by another using the conjugate.

`ncert_kemh1_s4_3_5_powers_division_lesson` · chapter-4 · fingerprint `2c28e5f36f31ad52…`

**Selected because:** carries 2 canonical units; shares unit(s) with another lesson: C11-CPX-02; risk class C

**Source:** NCERT 4.3, page 82 (kemh1)

### Objectives this lesson claims to cover

**C11-CPX-02** — Add, subtract and multiply complex numbers and state the field properties used.

- demand: APPLY · representation: exact complex arithmetic · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s4_3_algebra_lesson

**C11-CPX-03** — Compute powers of i and divide complex numbers using the multiplicative inverse.

- demand: DERIVE · representation: exact complex arithmetic · risk C · SUMMATIVE_CORE

### The lesson

**Goal.** You will reduce any integer power of i using a cycle of four, and divide one complex number by another using the conjugate.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

> Powers of i repeat. i⁰ is 1, i¹ is i, i² is -1 and i³ is −i. Then i⁴ is 1 and the cycle begins again.

> So a power of i depends only on the remainder when the exponent is divided by 4. For i²⁰²⁶ the remainder is 2, so the value is -1. No one multiplies i by itself two thousand times.

> Division needs a different idea, because a + ib sitting underneath a fraction line is awkward. The trick is to make the denominator real, and the conjugate does exactly that.

> Multiplying c + id by its conjugate c − id gives c² + d², since the cross terms cancel and the i² term changes sign. That is a real number, and it is positive whenever the denominator is not zero. For 1 − 2i it is 5.

> So to divide, multiply above and below by the conjugate of the denominator. Dividing 3 + 4i by 1 − 2i gives -1 + 2i, and the result is again in standard form.

> Division by zero remains impossible. The conjugate of 0 is 0 and the denominator c² + d² becomes 0, so there is nothing to divide by. The quotient has no value, which is a statement about absence rather than about size.

**Worked examples.**

- Find i²⁰²⁶.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** -1
- Divide 3 + 4i by 1 − 2i.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** -1 + 2i
- Why does multiplying by the conjugate make the denominator real?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because the cross terms cancel and i² turns the subtraction into addition.

**Try it.**

- Find i⁷ + i⁵. → *0* — 
- Divide 2 by i. → *−2i* — 
- Why can you not divide by 0 + 0i? → *Because the real denominator c² + d² would be zero.* — 
- What is the conjugate of a real number? → *The number itself.* — 

**Think deeper.**

- The cycle of powers of i has length four. Why four, and not some other number?

**Summary.** Powers of i repeat with period four, so i to any integer power is settled by the remainder modulo 4. Division is done by multiplying above and below by the conjugate of the denominator, which makes it the real number c² + d²; division by zero remains impossible.

### Your review

For **each** objective above, answered separately:

- **C11-CPX-02** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-CPX-03** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s4_3_5_powers_division_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 13. You will write and use factorial notation for the products that counting keeps producing.

`ncert_kemh1_s6_3_1_factorial_lesson` · chapter-6 · fingerprint `e2df9815581248a6…`

**Selected because:** carries 2 canonical units; shares unit(s) with another lesson: C11-PNC-03; risk class C

**Source:** NCERT 6.3, page 119 (kemh1)

### Objectives this lesson claims to cover

**C11-PNC-02** — Read and compute factorial n and simplify quotients of factorials.

- demand: UNDERSTAND · representation: factorial notation · risk C · SUMMATIVE_CORE

**C11-PNC-03** — Derive nPr = n!/(n-r)! and use it to count arrangements of distinct objects.

- demand: DERIVE · representation: nPr notation · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s6_3_permutations_lesson, ncert_kemh1_s6_3_3_repeated_objects_lesson

### The lesson

**Goal.** You will write and use factorial notation for the products that counting keeps producing.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

> Counting problems keep producing the same shape of product: a run of consecutive whole numbers multiplied together. Writing that out becomes unwieldy, so it gets a name.

> For a whole number n, n! means the product of every whole number from 1 up to n. So 5! is 1 × 2 × 3 × 4 × 5, which is 120.

> Factorials grow very fast. 5! is 120, 10! is already 3628800, and 20! is 2432902008176640000. That growth is why the shorthand earns its place, and why these counts must be kept as exact whole numbers rather than rounded.

> The source also defines 0! = 1. That is a definition rather than a product with no factors evaluated by accident, and it is made so that the formulas in the next lessons work without a special case at the ends.

> A useful relationship falls out immediately: n! is n times (n − 1)!. Each factorial contains the one below it, which is exactly why large factorials cancel so neatly in a quotient.

> That cancelling matters in practice. The quotient 7!/4! does not need both factorials worked out: everything from 1 up to 4 appears in both, so what remains is 5 × 6 × 7, which is 210.

> Factorials are defined only for whole numbers that are not negative. A factorial of a negative number or a fraction has no meaning at this level, and asking for one is a question without an answer rather than a calculation that returns something odd.

**Worked examples.**

- Work out 6!.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 720
- Simplify 7!/4! without working out either factorial.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 210
- Why is 0! defined to be 1 rather than 0?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 1

**Try it.**

- What is 7!? → *5040* — 
- Simplify 10!/7!. → *720* — 
- Express 8! using 6!. → *8 × 7 × 6!.* — 
- Which is larger, 5! or 2 × 4!? → *5!.* — 

**Think deeper.**

- Factorials grow faster than almost anything else you have met. Why does that matter for counting rather than being a curiosity?

**Summary.** n! is the product of every whole number from 1 up to n, with 0! defined as 1. The values grow quickly — 5! is 120 and 20! is 2432902008176640000 — and each factorial contains the one below it, which lets quotients such as 7!/4! be simplified by cancelling to 210.

### Your review

For **each** objective above, answered separately:

- **C11-PNC-02** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-PNC-03** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s6_3_1_factorial_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 14. You will see what the four conics collapse to when the cutting plane passes through the vertex of the cone.

`ncert_kemh1_s10_2_2_degenerate_lesson` · chapter-10 · fingerprint `207345634a30817d…`

**Selected because:** carries 2 canonical units; shares unit(s) with another lesson: C11-CON-01; risk class C

**Source:** NCERT 10.2, page 170 (kemh1)

### Objectives this lesson claims to cover

**C11-CON-01** — Describe how a plane cutting a cone produces a circle, ellipse, parabola or hyperbola according to the angle of the cut.

- demand: UNDERSTAND · representation: cone section diagram · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s10_2_cone_sections_lesson

**C11-CON-02** — Identify the point, the straight line and the pair of intersecting lines as degenerate cases of a conic.

- demand: UNDERSTAND · representation: cone section diagram · risk C · SUMMATIVE_CORE

### The lesson

**Goal.** You will see what the four conics collapse to when the cutting plane passes through the vertex of the cone.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

> Every cut so far has missed the vertex. Move the plane so that it passes through the vertex and the same four tilts give something much smaller.

> A plane perpendicular to the axis through the vertex touches the cone at the vertex alone. The circle has shrunk to a single point.

> A plane parallel to a generator through the vertex meets the cone along that one generator. The parabola has collapsed to a straight line.

> A plane parallel to the axis through the vertex cuts along two generators, one on each nappe. The hyperbola has collapsed to a pair of intersecting lines, crossing at the vertex.

> These three are called degenerate conic sections. They are not failures of the method; they are what the ordinary cases become in a limiting position, and they are still sections of a cone.

> The name is worth taking literally. Something has degenerated: a curve with extent has lost it, and what remains is a point or straight lines with no curvature at all.

**Visuals.**

- *cone_section*: The same double cone, cut by a plane perpendicular to the axis but passing through the vertex itself. The circle has shrunk until nothing is left of it but the vertex, marked as a single dot.
- *cone_section*: The double cone cut by a plane through the vertex, parallel to one slanting edge. The plane now contains that edge, so the section is the single straight generator drawn from the vertex down the surface.
- *cone_section*: The double cone cut by a plane through the vertex, running parallel to the axis so that it meets both nappes. It cuts one generator from each, and the two straight lines cross at the vertex.

**Worked examples.**

- What does the plane perpendicular to the axis give when it passes through the vertex?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** A single point.
- Why does a plane through the vertex parallel to a generator give one line rather than two?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** A single straight line.
- Why do two intersecting lines rather than two parallel ones come from the vertex cut parallel to the axis?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because both lines pass through the vertex.

**Try it.**

- Is a point a conic section? → *Yes, a degenerate one.* — 
- Can a degenerate section be curved? → *No.* — 
- What does an ellipse degenerate to? → *A point.* — 
- Why study these cases at all? → *Because they show what the ordinary cases become in a limiting position.* — 

**Think deeper.**

- The degenerate cases are a point and some straight lines. Why call them conic sections at all, rather than saying the cut produced nothing interesting?

**Summary.** When the cutting plane passes through the vertex, the conic sections collapse: the circle and ellipse to a point, the parabola to a single straight line, and the hyperbola to a pair of lines intersecting at the vertex. These are the degenerate conic sections.

### Your review

For **each** objective above, answered separately:

- **C11-CON-01** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-CON-02** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s10_2_2_degenerate_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 15. You will compute limits of polynomials and rational functions, including the case where a factor cancels and the original function still has a hole.

`ncert_kemh1_s12_3_1_polynomial_rational_lesson` · chapter-12 · fingerprint `34f7ed09504cfe4a…`

**Selected because:** carries 2 canonical units; shares unit(s) with another lesson: C11-LIM-02; risk class C

**Source:** NCERT 12.3, page 228 (kemh1)

### Objectives this lesson claims to cover

**C11-LIM-02** — Evaluate a limit informally from values approaching a point and recognise when a limit fails to exist.

- demand: UNDERSTAND · representation: limit value table and graph · risk C · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s12_3_intuitive_limit_lesson

**C11-LIM-03** — Evaluate limits of polynomial and rational functions, including the cancelling case.

- demand: APPLY · representation: limit notation · risk C · SUMMATIVE_CORE

### The lesson

**Goal.** You will compute limits of polynomials and rational functions, including the case where a factor cancels and the original function still has a hole.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

> A polynomial has every real number in its domain and no jumps, so its values near a point close in on its value at that point. For x³ + 2x at x = 2, the limit is 12, and the function value and the limit are both 12.

> So for polynomials, substituting the point gives the limit. That is a property of polynomials, not the meaning of a limit, and the distinction matters as soon as the function is a quotient.

> For a rational function, first ask whether the point is in the domain. For (x + 3)/(x + 1) at x = 1 the denominator is not zero, so substitution is available and the limit is 2.

> When the denominator is zero the point is outside the domain and substitution is unavailable. (x² − 1)/(x − 1) at x = 1 is the case from the previous lesson: the function has no value there.

> But the numerator is zero there too, and it factors. Away from x = 1 the expression agrees exactly with x + 1, so the nearby behaviour is that of the simpler expression, and the limit is 2.

> This is where care is needed. Cancelling tells you about behaviour near the point; it does not change the function. (x² − 1)/(x − 1) is still undefined at 1 — the function has no value there, yet the limit is 2 — while x + 1 is perfectly well defined there. The two agree everywhere except at the hole, and the hole stays.

> Cancelling is not always available. For 1/(x − 1) at x = 1 the numerator is not zero, so nothing cancels: the limit does not exist, because the values grow without bound as x approaches 1 from the left

**Visuals.**

- *limit_table*: A table of values of the expression (x squared minus 1) divided by (x minus 1) at x values closing in on 1 from below and from above. The outputs rise towards 2 from the left and fall towards 2 from the right, while at x equal to 1 itself the expression has no value at all.

**Worked examples.**

- Find the limit of x³ + 2x as x approaches 2.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 12.
- Find the limit of (x² − 1)/(x − 1) as x approaches 1.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 2, with the function undefined at 1.
- Why does cancelling not work for 1/(x − 1) at x = 1?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because the numerator is not zero there, so no factor cancels.

**Try it.**

- Find the limit of (x + 3)/(x + 1) as x approaches 1. → *2.* — 
- Why is substitution valid for every polynomial? → *Because every real number is in the domain and the values nearby close in on the value at the point.* — 
- Two expressions agree everywhere except at one point. Must they have the same limit there? → *Yes.* — 
- Must they have the same value at that point? → *No.* — 

**Think deeper.**

- Cancelling a factor gives the right limit but the wrong function. Why is that not a contradiction?

**Summary.** For a polynomial, substitution gives the limit because every point is in the domain. For a rational function, check the domain first: where the denominator is non-zero, substitute; where both numerator and denominator vanish, a factor may cancel and the limit exists even though the original function keeps its hole, as with (x² − 1)/(x − 1) at 1. Where nothing cancels, the limit does not exist, because the values grow without bound as x approaches 1 from the left

### Your review

For **each** objective above, answered separately:

- **C11-LIM-02** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-LIM-03** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s12_3_1_polynomial_rational_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 16. You will use the closed forms for the sums of the first n natural numbers, their squares and their cubes.

`cbse_fo8_special_sums_lesson` · chapter-less required · fingerprint `d2297c06c7424d87…`

**Selected because:** CBSE-only required content (FO-8); chapter-less placement; new visual family: special_sum

**Source:** CBSE-only, entry FO-8 — CBSE-only: no NCERT section or page exists for this content; empty section and page 0 are absence markers, not missing data

### Objectives this lesson claims to cover

**C11-SEQ-FO8** — Use the closed forms for the sum of the first n natural numbers, their squares and their cubes.

- demand: APPLY · representation: sigma notation · risk B · FORMATIVE_ONLY

### The lesson

**Goal.** You will use the closed forms for the sums of the first n natural numbers, their squares and their cubes.

**Vocabulary.** [object Object] · [object Object]

**Learn the idea / See it.**

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

### Your review

For **each** objective above, answered separately:

- **C11-SEQ-FO8** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/cbse_fo8_special_sums_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 17. You will derive the favourable-over-total rule as the equally likely case of the axioms.

`ncert_kemh1_s14_2_2_equally_likely_lesson` · chapter-14 · fingerprint `b85b58ca67ce1aeb…`

**Selected because:** carries 2 canonical units; shares unit(s) with another lesson: C11-PRB-04

**Source:** NCERT 14.2, page 397 (kemh1)

### Objectives this lesson claims to cover

**C11-PRB-04** — State the axioms of probability and compute the probability of an event from them.

- demand: UNDERSTAND · representation: set notation · risk B · SUMMATIVE_CORE
- **also taught by:** ncert_kemh1_s14_2_axiomatic_probability_lesson, ncert_kemh1_s14_2_3_probability_rules_lesson

**C11-PRB-05** — Derive that each of n equally likely outcomes has probability one over n and compute the probability of an event as favourable over total.

- demand: DERIVE · representation: set notation · risk B · SUMMATIVE_CORE

### The lesson

**Goal.** You will derive the favourable-over-total rule as the equally likely case of the axioms.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

> Suppose the 6 outcomes of an experiment are equally likely — each carries the same number. The axioms then decide what that number must be.

> Call it p. The outcomes total 1, and there are 6 of them, so 6p = 1 and p = 1/6. In general, with n equally likely outcomes each has probability 1/n.

> Nothing was assumed about the value; it was forced. Equal likelihood plus a total of 1 leaves no choice.

> Now take an event with k outcomes. Its probability is the sum of k copies of 1/n, which is k/n — the number of favourable outcomes over the total number.

> So the familiar rule is not a definition. It is what the axioms give when, and only when, the outcomes are equally likely. For "the number is even" the rule gives 1/2, which is exactly what adding the outcome probabilities gave.

> The condition is doing real work. If the outcomes are not equally likely, counting them is simply the wrong calculation, and the rule gives an answer to a question nobody asked. A weighted die has six outcomes, but its probabilities are not 1/6 each.

> This also explains why the earlier grades' work was correct: every experiment there was modelled with equally likely outcomes, so the condition held even when it was not stated.

**Worked examples.**

- Derive the probability of a single outcome of a die is rolled once, modelled as fair.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 1/6
- Find the probability of "the number is below 4" two ways.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 1/2
- Why can favourable-over-total not be used for a weighted die?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because its outcomes are not equally likely, so counting them is the wrong calculation.

**Try it.**

- What is the probability of "the number is 6" for a fair die? → *1/6* — 
- A bag has outcomes that are not equally likely. Can you count to find a probability? → *No.* — 
- For two fair coins, what is the probability of exactly one head? → *1/2.* — 
- Does 1/n depend on which outcome is chosen? → *No.* — 

**Think deeper.**

- Earlier grades used favourable-over-total without mentioning any condition. Were those answers wrong?

**Summary.** If n outcomes are equally likely, the axioms force each to have probability 1/n, and an event with k of them has probability k/n. The familiar favourable-over-total rule is therefore derived, not defined, and it is valid only under equal likelihood — for "the number is even" it gives 1/2, agreeing with the assignment.

### Your review

For **each** objective above, answered separately:

- **C11-PRB-04** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?
- **C11-PRB-05** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s14_2_2_equally_likely_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 18. You will feed the output of one function into another, and see why the order and the domain both need care.

`ncert_kemh1_fo2_composition_lesson` · chapter-less required · fingerprint `95c2e24603b76e25…`

**Selected because:** CBSE-only required content (FO-2); chapter-less placement; risk class C

**Source:** CBSE-only, entry FO-2 — CBSE-only: no NCERT section or page exists for this content; empty section and page 0 are absence markers, not missing data

### Objectives this lesson claims to cover

**C11-RF-FO2** — Form the composition of two functions and determine when it is defined.

- demand: APPLY · representation: mapping diagram · risk C · FORMATIVE_ONLY

### The lesson

**Goal.** You will feed the output of one function into another, and see why the order and the domain both need care.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

> Combining functions by arithmetic keeps them side by side. Composition does something different: it feeds the output of one into the other.

> For functions f and g, the composition g ∘ f assigns to each argument x the value g(f(x)). The inner function acts first, even though it is written second, which is a common place to slip.

> This is not multiplication. The two functions are not multiplied together, and the symbol does not distribute. It records an order of application.

> Because it is an order, reversing it generally changes the result. Taking the logarithm of a modulus and taking the modulus of a logarithm are different functions: the two orders disagree at several arguments is what comparing them at several arguments shows.

> The domain needs two conditions, not one. An argument x belongs to the domain of g ∘ f only when x is in the domain of f AND the value f(x) lies in the domain of g. The second condition is the one most easily forgotten.

> For logarithmic after modulus the domain is the arguments x where f is defined and f(x) lies in the domain of logarithmic. At −2 the inner function gives 2, which the logarithm accepts, so the composition has the value 0.6931. At zero the inner function gives zero, which the logarithm does not accept, so the composition has no value at all.

**Worked examples.**

- In g ∘ f, which function acts first?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** f acts first.
- Does reversing the order change the result?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Yes, in general the two orders give different functions.
- Why does logarithmic after modulus have no value at zero?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because the inner value falls outside the domain of the outer function.

**Try it.**

- If f doubles its argument and g adds three, what does g ∘ f do? → *It doubles and then adds three.* — 
- What does f ∘ g do with the same two functions? → *It adds three and then doubles.* — 
- Can the domain of g ∘ f be smaller than the domain of f? → *Yes.* — 
- Evaluate logarithmic after modulus at −2. → *0.6931* — 

**Think deeper.**

- Why does composition need a domain condition that addition and multiplication do not?

**Summary.** The composition g ∘ f assigns g(f(x)), with the inner function acting first. It is not multiplication, the order generally matters, and an argument belongs to its domain only when x is in the domain of f and f(x) is in the domain of g.

### Your review

For **each** objective above, answered separately:

- **C11-RF-FO2** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_fo2_composition_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 19. You will shade the half-plane satisfying a two-variable inequality and find the region satisfying a system.

`cbse_fo6_half_plane_lesson` · chapter-less required · fingerprint `4f82848aee259ad3…`

**Selected because:** CBSE-only required content (FO-6); chapter-less placement; risk class C

**Source:** CBSE-only, entry FO-6 — CBSE-only: no NCERT section or page exists for this content; empty section and page 0 are absence markers, not missing data

### Objectives this lesson claims to cover

**C11-INQ-FO6** — Shade the half-plane satisfying a linear inequality in two variables and find the region satisfying a system of them.

- demand:  · representation: half-plane region on a coordinate plane · risk C · FORMATIVE_ONLY

### The lesson

**Goal.** You will shade the half-plane satisfying a two-variable inequality and find the region satisfying a system.

**Vocabulary.** [object Object] · [object Object] · [object Object]

**Learn the idea / See it.**

> With one variable the solution set was part of a line. With two variables, x and y, a point needs both coordinates, so the solution set is part of the plane.

> Take x + y ≤ 4. Replacing the relation with an equals sign gives the boundary line x + y = 4, which divides the plane in two.

> Every point on one side satisfies the inequality and every point on the other does not. Which side is which is settled by testing a single point: (0, 0) gives 0 is less than or equal to 4, which is true, so the side containing the origin is the solution.

> One point decides the whole side, because the two sides cannot be mixed — crossing the boundary is the only way the comparison can change.

> The origin is convenient but not always available. For x − y = 0 the line passes through (0, 0), so the origin is on the boundary and settles nothing. Any other point off the line does instead.

> The boundary itself belongs to the solution set only when the relation is weak, exactly as the endpoint did on the number line. A solid line shows it is included, a dashed line that it is not — and the written description says which, since a line style alone is easy to miss.

> A boundary need not be slanted. x > 2 has boundary x = 2, a vertical line, and the inequality says nothing about y at all: every point far enough to the right satisfies it, whatever its height.

> A system asks for several inequalities at once. A point belongs only if it satisfies every one of them, so the region is where the half-planes OVERLAP — the intersection, not everything either one covers.

> For x + y ≤ 4 together with x > 2, the point (3, 0) satisfies both and belongs. The point (0, 0) satisfies the first but not the second, so it is outside the region even though one inequality holds there.

**Visuals.**

- *half_plane_region*: A coordinate plane from -6 to 6 on both axes with the solid line x + y = 4 drawn across it and the region below and left of that line shaded. The line is solid because the relation allows equality, and the shaded side is the side of x + y = 4 containing the point (0, 0), with the boundary line itself included.
- *half_plane_region*: A coordinate plane with the dashed vertical line x = 2 and everything to its right shaded. The line is dashed because the relation is strict, so points on it do not satisfy the inequality. A vertical boundary has no slope, which is why the line is given in general form.
- *half_plane_region*: A coordinate plane showing both boundary lines, x + y = 4 solid and x = 2 dashed, with only the overlap of their two half-planes shaded. Every point in the shaded wedge satisfies both inequalities; a point satisfying just one of them lies outside it.

**Worked examples.**

- Shade the region satisfying x + y ≤ 4.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** the side of x + y = 4 containing the point (0, 0), with the boundary line itself included
- Shade the region satisfying x > 2.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Everything to the right of x = 2, the line excluded.
- Find the region satisfying both inequalities.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** The overlap of the two half-planes.

**Try it.**

- What is the boundary line of 2x − y ≥ 6? → *2x − y = 6.* — 
- Should the boundary be solid or dashed for x + y < 4? → *Dashed.* — 
- A point satisfies one inequality of a system but not the other. Is it in the region? → *No.* — 
- Does the solution region stop at the edge of the drawn axes? → *No.* — 

**Think deeper.**

- Why does testing one point settle an entire half of the plane?
- The shaded region runs off the edge of the picture. Is the solution set unbounded, or is the drawing just small?

**Summary.** A two-variable inequality divides the plane along its boundary line, found by replacing the relation with an equals sign. One test point off that line settles which side satisfies it: for x + y ≤ 4 the origin works, but for x − y = 0 it lies on the line and another point is needed. The boundary belongs only when the relation is weak. A system's region is where the half-planes overlap, since every inequality must hold.

### Your review

For **each** objective above, answered separately:

- **C11-INQ-FO6** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/cbse_fo6_half_plane_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 20. You will write the complete solution of a simple trigonometric equation as an infinite family parameterised by an integer, rather than as a single value.

`ncert_kemh1_fo3_general_solutions_lesson` · chapter-less required · fingerprint `d042968746f87c08…`

**Selected because:** CBSE-only required content (FO-3); chapter-less placement; risk class C

**Source:** CBSE-only, entry FO-3 — CBSE-only: no NCERT section or page exists for this content; empty section and page 0 are absence markers, not missing data

### Objectives this lesson claims to cover

**C11-TRG-FO3** — Write the general solution of sin x = sin y, cos x = cos y and tan x = tan y.

- demand: APPLY · representation: periodicity diagram · risk C · FORMATIVE_ONLY

### The lesson

**Goal.** You will write the complete solution of a simple trigonometric equation as an infinite family parameterised by an integer, rather than as a single value.

**Vocabulary.** [object Object] · [object Object]

**Learn the idea / See it.**

> An equation such as sin x = sin y does not have one solution. Because sin repeats after every full turn, any solution can be shifted by a whole turn and remain a solution, so there are infinitely many.

> Writing down one value is therefore an incomplete answer. The complete answer is a family, described by a formula containing an integer parameter n which may be positive, negative or zero: n ∈ ℤ.

> For sine the general solution of sin x = sin y is x = nπ + (−1)ⁿ  y, n ∈ ℤ, in the form x = nπ + (−1)ⁿ y. The alternating sign reflects that within each turn there are two arguments with the same sine, placed symmetrically.

> For cosine the general solution of cos x = cos y is of the form x = 2nπ ± y. The plus-or-minus appears because cos takes the same value at an angle and at its negative, and the step is a full turn rather than a half turn.

> For tangent the general solution of tan x = tan y is x = nπ + y, a simpler form because tan repeats after a half turn rather than a full one.

> Taking a concrete reference, the solutions of the sine equation with y = π/6 are given by x = nπ + (−1)ⁿ π/6, n ∈ ℤ. Substituting n = 0, 1 and −1 gives three different solutions, and every other integer gives another.

**Worked examples.**

- Why does sin x = 1/2 have infinitely many solutions?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because sin is periodic, so every solution generates infinitely many more.
- Write the general solution of sin x = sin π/6.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** x = nπ + (−1)ⁿ π/6, n ∈ ℤ
- A student answers sin x = sin π/6 with x = π/6 alone. What is missing?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** The infinite family; one value is only a single member of it.

**Try it.**

- Write the general solution of cos x = cos y. → *x = 2nπ ± y, with n any integer.* — 
- How many solutions of sin x = sin y lie in one full turn? → *Generally two.* — 
- Why is the general solution written with a parameter rather than as a list? → *Because the set is infinite.* — 
- Give two members of the family x = nπ + π/4, n ∈ ℤ. → *Taking n = 0 and n = 1 gives two arguments one half-turn apart.* — 

**Think deeper.**

- How does periodicity turn one solution into infinitely many, and why does that make the integer parameter necessary?

**Summary.** Because the trigonometric functions are periodic, an equation such as sin x = sin y has infinitely many solutions, written as a family parameterised by an integer: x = nπ + (−1)ⁿ π/6, n ∈ ℤ for the sine case, x = 2nπ ± y for cosine and x = nπ + y for tangent.

### Your review

For **each** objective above, answered separately:

- **C11-TRG-FO3** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_fo3_general_solutions_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 21. You will find the roots of a real-coefficient quadratic whose discriminant is negative, and see that they form a conjugate pair.

`ncert_kemh1_fo5b_complex_quadratics_lesson` · chapter-less required · fingerprint `5beb62bc3b019e8f…`

**Selected because:** CBSE-only required content (FO-5); chapter-less placement; risk class C

**Source:** CBSE-only, entry FO-5 — CBSE-only: no NCERT section or page exists for this content; empty section and page 0 are absence markers, not missing data

### Objectives this lesson claims to cover

**C11-CPX-FO5b** — Solve a quadratic with real coefficients over the complex numbers and state the Fundamental Theorem of Algebra.

- demand: STATE_WITHOUT_PROOF · representation: exact complex arithmetic · risk C · FORMATIVE_ONLY

### The lesson

**Goal.** You will find the roots of a real-coefficient quadratic whose discriminant is negative, and see that they form a conjugate pair.

**Vocabulary.** [object Object]

**Learn the idea / See it.**

> In Class 10 a quadratic with a negative discriminant was reported as having no real roots, and the matter ended there. The number system has since been enlarged, and the sentence can now be completed.

> The quadratic formula still applies. The difficulty was always √D with D negative, and that is no longer an obstacle: take the negative out as i, so √(−k) is i√k for positive k. The caution from earlier in the chapter still holds, which is why the i comes out before anything is multiplied.

> Take x² + 2x + 5 = 0. The discriminant is -16, which is negative, so there are no real roots. The formula now gives -1 ± 2i.

> The two roots are -1 + 2i and -1 − 2i, and they are conjugates of each other: each is the conjugate of the other. That happens whenever the coefficients are real, because the two roots differ only in the sign in front of the radical.

> Not every surd disappears. For 2x² + x + 3 = 0 the discriminant is -23 and the roots are -1/4 ± 1/4i√23, exact and irrational. A decimal would lose information the exact form keeps.

> There is a general result in the background. The fundamental theorem of algebra states that every polynomial equation of degree at least one with complex coefficients has at least one complex root. At this level the theorem is stated and used, not proved: nothing in this chapter establishes it, and its proof belongs to later study.

**Worked examples.**

- Solve x² + 2x + 5 = 0.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** -1 ± 2i
- Solve 2x² + x + 3 = 0 and leave the answer exact.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** -1/4 ± 1/4i√23
- Why do the two roots always form a conjugate pair when the coefficients are real?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because they differ only in the sign of the radical, which carries the i.

**Try it.**

- Solve x² − 2x + 5 = 0. → *1 ± 2i* — 
- If one root of a real-coefficient quadratic is 3 + 2i, what is the other? → *3 − 2i* — 
- Does the fundamental theorem of algebra get proved in this chapter? → *No.* — 
- Can a real-coefficient quadratic have exactly one complex root and one real root? → *No.* — 

**Think deeper.**

- Class 10 said these equations had no real roots. What exactly changed, and what did not?

**Summary.** With a negative discriminant the quadratic formula still applies once the negative is taken out of the radical as i, giving a conjugate pair of complex roots: x² + 2x + 5 = 0 has roots -1 ± 2i. The fundamental theorem of algebra is stated at this level, not proved.

### Your review

For **each** objective above, answered separately:

- **C11-CPX-FO5b** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_fo5b_complex_quadratics_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 22. You will prove a statement about every natural number by checking one case and showing each case carries the next.

`cbse_fo4_induction_lesson` · chapter-less prerequisite · fingerprint `6b6bcac7d4a2df17…`

**Selected because:** CBSE-only required content (FO-4); chapter-less placement; risk class C

**Source:** CBSE-only, entry FO-4 — CBSE-only: no NCERT section or page exists for this content; empty section and page 0 are absence markers, not missing data

### Objectives this lesson claims to cover

**C11-IND-01** — Prove a statement about the natural numbers by establishing a base case and an inductive step.

- demand:  · representation: proof layout; no figure required · risk C · FORMATIVE_ONLY

### The lesson

**Goal.** You will prove a statement about every natural number by checking one case and showing each case carries the next.

**Vocabulary.** [object Object] · [object Object] · [object Object] · [object Object]

**Learn the idea / See it.**

> Some statements are claimed for every natural number at once. There are infinitely many of them, so they cannot be checked one by one, however long you keep going.

> Checking cases is not a proof. For 1 + 2 + … + n = n(n + 1)/2, you can verify n = 1, 2 and 3 and find them all correct — but all 3 checked cases hold, but every natural number n from 1 upwards contains infinitely many values, so checking cases proves nothing about the rest

> Induction replaces the infinite checking with two finite obligations. First, show the statement holds at the starting value. Second, show that whenever it holds at some value, it must also hold at the next one.

> Meet both and the statement follows for every value from the start onwards. The first obligation gives you one true case; the second turns any true case into the next true case; together they reach every value in turn.

> The dominoes picture is useful but incomplete. Lining up dominoes so each would knock the next over does nothing until one is actually pushed, and pushing one does nothing if the spacing fails somewhere down the line. Both obligations are needed, and the proof is the two arguments, not the picture.

> The hypothesis is where care is needed. You assume the statement for one particular k — not for every k, which is what is being proved. Writing "Suppose the formula holds for some particular n = k." keeps it conditional; writing that it holds for all k assumes the conclusion.

> Set out in parts, a proof of 1 + 2 + … + n = n(n + 1)/2 reads: check n = 1, where both sides come to 1; assume it at k; add the next term and rearrange to reach the same formula at k + 1; conclude for every natural number n from 1 upwards.

> This method is worth learning on its own because several later results depend on it. The binomial theorem is proved this way, and a derivative result about powers uses an induction hypothesis in its derivation. Both are for their own lessons; what transfers is the method.

**Visuals.**

- *proof_layout*: A proof set out in five labelled parts. The claim states that the sum of the first n natural numbers equals n times n plus one over two. The base case checks n equals 1, where both sides come to 1. The induction hypothesis assumes the claim for one particular value k. The inductive step adds the next term and rearranges to reach the same formula with k plus one in place of n. The conclusion states that the two obligations together establish the claim for every natural number from 1 upwards.

**Worked examples.**

- Prove that 1 + 2 + … + n = n(n + 1)/2 for every natural number n from 1 upwards.
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** the proof is complete: the formula holds for every natural number n from 1 upwards.
- Prove that 3 divides n³ − n for every natural number n from 1 upwards.
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 3 divides n³ − n for every natural number from 1 upwards.
- Prove that 2ⁿ ≥ n + 1 for every natural number n from 1 upwards.
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 2ⁿ ≥ n + 1 for every natural number from 1 upwards.

**Try it.**

- In the proof of 1 + 2 + … + n = n(n + 1)/2, what is checked in the base case? → *That both sides equal 1 when n = 1.* — 
- Why must the base case be at the first value of the claimed range? → *Because the chain starts there.* — 
- In the inductive step, where exactly is the hypothesis used? → *At the point where the expression for k is replaced by what the hypothesis says it equals.* — 
- Can a proof conclude from the inductive step alone? → *No.* — 

**Think deeper.**

- The base case proves one case and the inductive step proves no cases at all, only an implication. Why do the two together prove infinitely many?

**Summary.** Mathematical induction proves a statement for every natural number from a starting value by two obligations: check the base case directly, then show the statement at k forces it at k + 1. Checking examples is not a proof — all 3 checked cases hold, but every natural number n from 1 upwards contains infinitely many values, so checking cases proves nothing about the rest

### Your review

For **each** objective above, answered separately:

- **C11-IND-01** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/cbse_fo4_induction_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 23. You will find the point that divides a segment in space in a given ratio.

`cbse_fo10_section_formula_lesson` · chapter-less required · fingerprint `3c0c9fe88ee394ff…`

**Selected because:** CBSE-only required content (FO-10); chapter-less placement

**Source:** CBSE-only, entry FO-10 — CBSE-only: no NCERT section or page exists for this content; empty section and page 0 are absence markers, not missing data

### Objectives this lesson claims to cover

**C11-3DG-FO10** — Find the point dividing a segment in space in a given ratio.

- demand: APPLY · representation: 3-D diagram · risk B · FORMATIVE_ONLY

### The lesson

**Goal.** You will find the point that divides a segment in space in a given ratio.

**Vocabulary.** [object Object] · [object Object]

**Learn the idea / See it.**

> In a plane you already find the point dividing a segment in a given ratio by taking a weighted average of the two endpoints, one coordinate at a time. Space changes nothing about that idea. It only adds a third coordinate to average.

> Say P divides AB internally so that AP : PB = m : n. Then each coordinate of P is the weighted average of the matching coordinates of A and B: P = (nA + mB) divided by (m + n).

> The weights look backwards at first, and that is the one thing worth slowing down for. A LARGER m means a longer AP, which puts P further from A and closer to B — so B is the endpoint that carries m.

> Checking it on the ends makes this concrete. If n is tiny, P sits almost at B; if m is tiny, P sits almost at A. The weight on an endpoint measures the distance to the OTHER one.

> For A at (1, 2, 3) and B at (7, 8, 9) with AP : PB = 1 : 2, each coordinate takes two parts of A and one part of B, over three. That gives P at (3, 4, 5), one third of the way along.

> The answer is kept exact. For (0, 0, 0) and (7, 11, 5) in the ratio 1 : 2 the point is (7/3, 11/3, 5/3) — fractions, not rounded decimals, because those fractions ARE the coordinates.

> The midpoint is not a separate rule. It is this one with the ratio 1 : 1, where each coordinate is the plain average: (1, 2, 3) and (7, 8, 9) give (4, 5, 6).

> And if the two endpoints share a coordinate, the formula still works and simply returns it. E and F are both at z = 5, so their dividing point is too: (7, 5, 5). The x and y come out exactly as the plane formula would give them.

**Visuals.**

- *coordinate_3d*: A three-dimensional axis diagram with A at (1, 2, 3) and B at (7, 8, 9) joined by a straight segment, and P at (3, 4, 5) marked on that segment between them. P lies internally, one third of the way from A, because AP : PB is 1 : 2.
- *coordinate_3d*: A three-dimensional axis diagram with C at (0, 0, 0) and D at (7, 11, 5) joined by a segment, and Q at (7/3, 11/3, 5/3) marked on it. Q divides the segment internally, lying between C and D, with CQ : QD = 1 : 2. Its coordinates are exact fractions, not rounded decimals.
- *coordinate_3d*: A three-dimensional axis diagram with E at (1, 2, 5) and F at (9, 6, 5), both at z = 5, joined by a segment with R at (7, 5, 5) on it. R divides the segment internally, lying between E and F, with ER : RF = 3 : 1. Because the two heights are equal the z coordinate of R is also 5, and the x and y coordinates are what the flat section formula would give.

**Worked examples.**

- Find the point dividing (1, 2, 3) to (7, 8, 9) in the ratio 1 : 2.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** (3, 4, 5)
- Divide (0, 0, 0) to (7, 11, 5) in the ratio 1 : 2.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** (7/3, 11/3, 5/3)
- Divide (1, 2, 5) to (9, 6, 5) in the ratio 3 : 1, where both ends are at the same height.
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** (7, 5, 5)

**Try it.**

- Divide (0, 0, 0) to (6, 9, 3) in the ratio 1 : 2. → *(2, 3, 1).* — 
- A student divides (1, 2, 3) to (7, 8, 9) in the ratio 1 : 2 and writes (5, 6, 7). What went wrong? → *The weights were reversed.* — 
- Can the ratio 0 : 1 divide a segment internally? → *No.* — 
- Is (7/3, 11/3, 5/3) or (2.33, 3.67, 1.67) the dividing point? → *(7/3, 11/3, 5/3).* — 

**Think deeper.**

- Swapping the ratio from m : n to n : m moves the point somewhere specific. Where, and why?

**Summary.** A point dividing AB internally in the ratio AP : PB = m : n has each coordinate equal to (n times A plus m times B) over (m + n). B carries m because a larger m lengthens AP and pulls the point toward B. The method is the plane formula with one more coordinate, the midpoint is the 1 : 1 case, and results stay exact: (0, 0, 0) to (7, 11, 5) in 1 : 2 gives (7/3, 11/3, 5/3), not a decimal.

### Your review

For **each** objective above, answered separately:

- **C11-3DG-FO10** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/cbse_fo10_section_formula_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 24. You will tell a strict inequality from a weak one and say what its solution set is.

`ncert_kemh1_s5_2_inequalities_lesson` · chapter-5 · fingerprint `b8f078eac7768999…`

**Selected because:** 

**Source:** NCERT 5.2, page 98 (kemh1)

### Objectives this lesson claims to cover

**C11-INQ-01** — Distinguish strict from weak inequalities and describe what a solution set is.

- demand: UNDERSTAND · representation: inequality symbols · risk A · SUMMATIVE_CORE

### The lesson

**Goal.** You will tell a strict inequality from a weak one and say what its solution set is.

**Vocabulary.** [object Object] · [object Object] · [object Object] · [object Object]

**Learn the idea / See it.**

> An equation such as x = 3 is satisfied by one number. An inequality such as x > 3 is satisfied by many: 4 works, so does 3.5, so does 1000.

> That is the first thing to notice. An inequality usually has no single answer, and asking "what is x?" is the wrong question. The right one is: which values make it true?

> Those values together form the solution set. For x > 3 it is values greater than 3, with 3 excluded.

> The symbol matters at exactly one point: the boundary. In x > 3 the value 3 does not satisfy the statement, because 3 is not greater than itself. These are the strict inequalities, < and >.

> In x ≥ 3 the value 3 does satisfy it, because the symbol allows equality. These are the weak ones, ≤ and ≥, and their solution sets include the boundary.

> So the two statements differ by a single number, 3 — and in every other respect agree. Testing the boundary is the way to tell them apart, and it is where mistakes happen.

> Checking a candidate is simple: put the value in and see whether the statement is true. For x > 3, the value 2 gives a false statement, 3 gives a false statement, and 4 gives a true one.

**Worked examples.**

- Which of 2, 3 and 4 satisfy x > 3?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Only 4.
- How does the answer change for x ≥ 3?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** 3 and 4 both satisfy it.
- Why does an inequality not have a single answer?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because many values satisfy the comparison, so the answer is a set.

**Try it.**

- Does 5 satisfy x < 5? → *No.* — 
- Does 5 satisfy x ≤ 5? → *Yes.* — 
- Is x > 1 satisfied by more than one value? → *Yes.* — 
- Where do a strict and a weak inequality with the same boundary differ? → *Only at the boundary value itself.* — 

**Think deeper.**

- Why does so much depend on one value at the boundary, when every other number behaves the same in both statements?

**Summary.** An inequality is usually satisfied by many values, and those values form its solution set. Strict symbols, < and >, exclude the boundary: 3 does not satisfy x > 3. Weak symbols, ≤ and ≥, include it. The two forms differ at the boundary and nowhere else, so testing that value is how to tell them apart.

### Your review

For **each** objective above, answered separately:

- **C11-INQ-01** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s5_2_inequalities_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

## 25. You will name the three coordinate planes and the eight octants, and say where a region of space lies.

`ncert_kemh1_s11_2_axes_planes_lesson` · chapter-11 · fingerprint `480f40b4ce0f2155…`

**Selected because:** 

**Source:** NCERT 11.2, page 192 (kemh1)

### Objectives this lesson claims to cover

**C11-3DG-01** — Name the three coordinate planes and the eight octants and locate a region in space.

- demand: UNDERSTAND · representation: 3-D axis diagram · risk B · SUMMATIVE_CORE

### The lesson

**Goal.** You will name the three coordinate planes and the eight octants, and say where a region of space lies.

**Vocabulary.** [object Object] · [object Object] · [object Object]

**Learn the idea / See it.**

> A flat page needs two numbers to fix a point. Space needs three, so a third axis is added at right angles to the other two: the z-axis, usually drawn going up.

> Each PAIR of axes spans a flat surface. The x and y axes span the xy-plane, the y and z axes the yz-plane, and the z and x axes the zx-plane.

> Each plane has an equation, and it is the simplest kind: the xy-plane is every point where z = 0, because leaving the plane is exactly what a non-zero z means.

> So membership is a matter of a vanishing coordinate, not of where a point looks on a drawing: a point is on the zx-plane precisely when y = 0.

> The three planes cut space into 8 regions, called octants — eight, because each of the three coordinates can be positive or negative independently, and 2 x 2 x 2 is 8.

> An octant is identified by that pattern of signs. The one containing (2, 3, 4) is the octant where all three are positive, (+, +, +).

> A point with a zero coordinate is in NO octant. It sits on a plane, which is the boundary between octants rather than inside one: R at (4, 0, 5) is on the zx-plane, so in no octant.

> If two coordinates vanish the point lies on an axis, which is the boundary of boundaries: S at (0, 0, 6) is on the z-axis.

**Visuals.**

- *coordinate_3d*: A three-dimensional axis diagram. The x-axis runs right, the z-axis runs up, and the y-axis is drawn going back at an angle because the page is flat. The origin O sits at (0, 0, 0) where all three meet. The point P at (2, 3, 4) lies off every coordinate plane, in the octant where x, y and z have signs (+, +, +).
- *coordinate_3d*: A three-dimensional axis diagram showing R at (4, 0, 5), which has y = 0 and so lies on the zx-plane, and S at (0, 0, 6), which has x = 0 and y = 0 and so lies on the z-axis. Neither is in any octant.

**Worked examples.**

- Which coordinate plane contains R at (4, 0, 5)?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** The zx-plane.
- Which octant contains (2, 3, 4)?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** (+, +, +)
- Why are there exactly eight octants?
    - [object Object]
    - [object Object]
    - [object Object]
    - **answer:** Because three coordinates each take one of two signs, giving 2 x 2 x 2 = 8.

**Try it.**

- Which plane contains (0, 5, 7)? → *The yz-plane.* — 
- Which octant contains (-1, -2, -3)? → *The octant (-, -, -).* — 
- Where does (0, 0, -4) lie? → *On the z-axis.* — 
- A student says (3, 0, 2) is in the first octant. What is wrong? → *It is in no octant.* — 

**Think deeper.**

- Why does one zero coordinate put a point on a plane, while two put it on an axis?

**Summary.** Space needs three coordinates. Each pair of axes spans a coordinate plane whose equation is simply that the third coordinate vanishes: the xy-plane is z = 0. The three planes cut space into eight octants, one for each pattern of signs, and a point with any zero coordinate lies on a plane rather than inside an octant.

### Your review

For **each** objective above, answered separately:

- **C11-3DG-01** — materially taught, or only mentioned? Sufficient for the demand level? Crowded out by the others?

Then for the lesson as a whole: mathematical correctness · scope discipline · worked examples · whether practice feedback explains the misconception or just marks right/wrong · whether the representation helps · whether the non-visual description preserves the mathematics · **granularity**: is this the right number of lessons for these objectives?

Record in `class11-review/packets/ncert_kemh1_s11_2_axes_planes_lesson.json` under `reviewerResponse`, per `RESPONSE_SCHEMA.json`. Copy the fingerprint above into `reviewedFingerprint`.

---

