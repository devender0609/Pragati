// Scoring + diagnostic aggregation.
//
// These are HEURISTIC summaries for a prototype, not calibrated scores.
// The "ability" used here is the running ability estimate from the simple
// rule-based adaptive engine (1-10 scale). Bands are tuned by inspection,
// not by a validated cut-score study.
//
// v0.3 changes:
//   - Growth indicator now uses a composite of three deltas (accuracy,
//     average difficulty attempted, misconception rate) rather than the
//     single noisy ability number. The per-component deltas are still
//     reported transparently.
//   - Adds a confidence label (low / moderate) based on the number of
//     items in the current session and the spread of difficulties seen.
//   - Language is hedged: "prototype change indicator", "early signal,
//     not calibrated growth".
//
// v0.4 changes:
//   - Added new misconception codes (`subtract_across`, `borrowing_error`)
//     to PREREQUISITE_FOR_MISCONCEPTION. Added FR.06 as a prerequisite
//     code (FR.07 is built on top of FR.06).
//   - Added `responsesBySkill`, `summarizeSessionBySkill`, and
//     `summarizeMisconceptionsBySkill` helpers so the results screen
//     and class dashboard can show per-skill breakdowns for mixed
//     sessions.
//   - Band descriptions are now per-skill so an FR.07 "Foundational"
//     student gets pointed at FR.06 (and earlier prereqs), not at
//     fictitious FR.06-prereq advice.

import {
  MISCONCEPTION_LABELS,
  MISCONCEPTION_NEXT_STEP,
  type Item,
  type MisconceptionCode,
} from '../data/items';
import type { Response, Session, SkillId, SkillMode } from '../types';

export type { Response, Session };

export type Band = 'Foundational' | 'Developing' | 'On Track' | 'Advanced';

// Per-skill band descriptions. The "mixed" mode is a module-wide summary
// that covers all 7 fraction skills.
//
// v0.29 — widened from Record to Partial<Record>. Reason: the v0.29
// starter skills (G1.01 … G12.03) don't have per-skill band descriptions
// authored yet, and shipping stubs would be misleading. `bandDescription`
// falls back to a generic starter message when no specific one exists.
export const BAND_DESCRIPTIONS_BY_SKILL: Partial<Record<SkillMode, Record<Band, string>>> = {
  'FR.02': {
    Foundational:
      'Reads basic visual fractions but trips up on equal-partition or numerator/denominator role. Useful next step: model bars and area grids hands-on, count cells aloud.',
    Developing:
      'Reads simple visuals and writes the matching fraction. Stumbles when the partition is irregular or when comparing two visuals. Needs more variety in models (bars, grids, number line).',
    'On Track':
      'Reads visual models reliably and can compare two fractions on the same whole. Ready to move into equivalent fractions (FR.03) and to read more complex partitions.',
    Advanced:
      'Confident with bars, area grids, and number-line representations of fractions; can write the fraction and explain it. Appropriate to begin operating on fractions (FR.05).',
  },
  'FR.03': {
    Foundational:
      'Recognises some equivalent fractions but applies the rule inconsistently — sometimes only changes the numerator or only the denominator. Revisit FR.02 (visualise) and the meaning of multiplying by k/k = 1.',
    Developing:
      'Can multiply both top and bottom by the same number on small examples. Tends to leave answers unsimplified. Needs targeted practice on simplifying with HCF.',
    'On Track':
      'Generates equivalent fractions and simplifies to lowest terms reliably. Ready for FR.04 (mixed/improper) and for FR.05 problems requiring simplification.',
    Advanced:
      'Fluent with equivalence and simplification on larger numerators and denominators. Appropriate to bridge into LCM-based fraction operations.',
  },
  'FR.04': {
    Foundational:
      'Confuses how a mixed number is built from whole + fractional part. Revisit FR.02 (visualise) and FR.03 (equivalent fractions) — particularly the picture of a whole as denominator/denominator.',
    Developing:
      'Can convert between mixed and improper fractions on small examples but slips on multi-digit ones. Needs more practice with larger numerators and the connection to division with remainder.',
    'On Track':
      'Converts both directions reliably and recognises mixed-number form in word problems. Ready for FR.05 (like-denominator addition/subtraction) and FR.06 onwards.',
    Advanced:
      'Fluent with conversions on larger numbers and with mixed-number arithmetic context. Appropriate to apply to FR.07-style mixed-number subtraction with borrowing.',
  },
  'FR.05': {
    Foundational:
      'Tends to add or subtract denominators when they already match. Revisit the meaning of the denominator (FR.02) and re-establish the rule that only numerators move when denominators agree.',
    Developing:
      'Adds and subtracts simple like-denominator fractions but does not always simplify. Needs targeted practice on simplification (FR.03) and on result-as-mixed-number conversions (FR.04).',
    'On Track':
      'Adds and subtracts like-denominator fractions reliably, including in simplest form and as mixed numbers. Ready for FR.06 (addition with unlike denominators) and FR.08 (word problems).',
    Advanced:
      'Fluent with like-denominator arithmetic across mixed-number cases and word problems. Appropriate to move into unlike-denominator work (FR.06/FR.07).',
  },
  'FR.06': {
    Foundational:
      'Early signs that the core idea of a common denominator is not yet in place when adding. Strong candidate for revisiting FR.05 (like denominators) and equivalent fractions before continuing.',
    Developing:
      'Can add fractions when the conversion is very simple. Stumbles once LCM is required or the numerator has to be scaled. Needs targeted practice on core-band addition items.',
    'On Track':
      'Reliably adds fractions with unlike denominators, including standard two-term and mixed-number sums. Ready for FR.07 (subtraction) and for word-problem application work.',
    Advanced:
      'Fluent with three-term sums, mixed numbers, and multi-step word problems in addition. Appropriate to begin bridging to more complex fraction operations and pre-algebra.',
  },
  'FR.07': {
    Foundational:
      'Early signs that subtraction with unlike denominators is not yet stable. Likely to benefit from revisiting FR.05 (like-denominator subtraction), equivalent fractions, and FR.06 (addition with unlike denominators) before continuing.',
    Developing:
      'Can subtract fractions when the conversion is very simple. Stumbles once LCM is required, or once a borrow is needed for mixed-number subtraction. Needs targeted practice on core-band subtraction items.',
    'On Track':
      'Reliably subtracts fractions with unlike denominators, including standard two-term and basic mixed-number differences. Ready for borrowing-required mixed-number subtraction and word-problem application work.',
    Advanced:
      'Fluent with mixed-number subtraction (including borrowing) and multi-step word problems. Appropriate to begin bridging to more complex fraction operations and pre-algebra.',
  },
  'FR.08': {
    Foundational:
      'Often picks the wrong operation in a word problem (adds when subtraction is needed, or vice versa). Revisit operation cues and re-anchor in FR.05 / FR.06 procedural fluency.',
    Developing:
      'Picks the right operation in single-step problems but trips on multi-step or comparison problems. Needs more practice rewording the problem in their own words first.',
    'On Track':
      'Reliably solves one- and two-step fraction word problems and explains the steps. Ready for multi-step and mixed-number word problems.',
    Advanced:
      'Fluent with multi-step fraction word problems involving mixed numbers and unlike denominators. Appropriate to bridge into ratio and percentage problem solving.',
  },
  // ----- Decimals -----
  'DE.01': {
    Foundational:
      'Decimal place value is not yet anchored — the student confuses tenths with hundredths or treats the decimal as two whole numbers. Revisit place value with a place-value chart.',
    Developing:
      'Identifies tenths and hundredths on simple examples but slips on three-place decimals or on writing decimals from words. Needs more place-value-chart practice.',
    'On Track':
      'Reads and writes decimals to thousandths and recognises trailing-zero equivalence. Ready for DE.02 (conversions) and DE.03 (compare).',
    Advanced:
      'Fluent with decimal place value, including word-form ↔ standard-form conversions. Appropriate to move into decimal arithmetic.',
  },
  'DE.02': {
    Foundational:
      'Trips up on the basic equivalences (1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75). Revisit FR.03 (equivalent fractions) alongside DE.01 (place value).',
    Developing:
      'Knows the common conversions but slips on tenths-vs-hundredths or on simplifying the resulting fraction.',
    'On Track':
      'Converts both directions reliably for fractions with denominators 2, 4, 5, 10, 100. Ready for DE.03 / DE.04.',
    Advanced:
      'Fluent with conversions including 1/8, 3/8, mixed numbers ↔ decimals. Appropriate for decimal arithmetic word problems.',
  },
  'DE.03': {
    Foundational:
      '"Length bias" present — thinks 0.65 > 0.7 because it has more digits. Re-anchor with the pad-with-zeros idea (0.7 = 0.70).',
    Developing:
      'Compares simple pairs but trips on three-place decimals or on ordering 3+ values.',
    'On Track':
      'Compares and orders decimals reliably to thousandths. Ready for DE.04 (arithmetic) and DE.05 (word problems).',
    Advanced:
      'Fluent with comparison and ordering across many decimals; recognises trailing-zero equivalence. Appropriate to apply to measurement problems.',
  },
  'DE.04': {
    Foundational:
      'Decimal points are not lined up — adds tenths to hundredths digit-by-digit. Revisit place-value alignment with a column-style layout.',
    Developing:
      'Aligns decimals on simple cases but slips when the operands have different numbers of decimal places. Needs explicit padding-with-zeros practice.',
    'On Track':
      'Adds and subtracts decimals reliably, including borrowing. Ready for DE.05 (word problems).',
    Advanced:
      'Fluent with three-term sums and multi-step subtraction. Appropriate to begin decimal × / ÷ work in later grades.',
  },
  'DE.05': {
    Foundational:
      'Right arithmetic, wrong operation in word problems. Re-read the problem; underline question words ("left", "in total"). Re-anchor in DE.04.',
    Developing:
      'Picks the right operation in one-step problems but trips on multi-step ones. Needs to write the calculation explicitly with units.',
    'On Track':
      'Solves one- and two-step decimal word problems reliably. Ready for harder multi-step problems and bridges into ratio.',
    Advanced:
      'Fluent across multi-step decimal word problems with money / measurement contexts. Appropriate to move on.',
  },
  // ----- Factors & Multiples -----
  'FM.03': {
    Foundational:
      'Confuses prime / composite — calls 1 prime, calls 9 prime, etc. Re-anchor with the "exactly two factors" definition.',
    Developing:
      'Identifies primes ≤ 20 reliably but slips on larger numbers and on prime factorisation steps.',
    'On Track':
      'Recognises primes ≤ 100 and writes correct prime factorisations. Ready for FM.06 (HCF) and FM.07 (LCM).',
    Advanced:
      'Fluent with prime factorisation of larger numbers and the special place of 2 (the only even prime). Appropriate for HCF/LCM word problems.',
  },
  'FM.04': {
    Foundational:
      'Mixes up divisibility rules (e.g., applies the divisibility-by-3 rule to test for 4). Revisit the rules one at a time, on small examples.',
    Developing:
      'Knows the rules for 2, 5, and 10 but slips on 3, 6, 9. Practise digit-sum on more examples.',
    'On Track':
      'Applies divisibility rules for 2, 3, 4, 5, 6, 9, 10 reliably. Ready for FM.06 (HCF).',
    Advanced:
      'Confident with multi-rule combinations (e.g., divisible by 6 ⇔ by 2 and 3) and with finding missing-digit problems.',
  },
  'FM.06': {
    Foundational:
      'Confuses HCF with LCM, or with simple "common factor". Revisit prime factorisation (FM.03) alongside the "lowest common power" rule for HCF.',
    Developing:
      'Finds HCF on small numbers by listing factors but slips on larger ones. Needs the prime-factorisation method.',
    'On Track':
      'Finds HCF reliably for two and three numbers using prime factorisation. Ready for HCF word problems (FM.08).',
    Advanced:
      'Fluent with HCF on larger numbers and recognises coprime pairs. Appropriate for application problems.',
  },
  'FM.07': {
    Foundational:
      'Confuses LCM with HCF, or with the product of the numbers. Revisit FM.03 (primes) and the "highest common power" rule for LCM.',
    Developing:
      'Finds LCM on small numbers by listing multiples but slips on larger ones or three-number cases.',
    'On Track':
      'Finds LCM reliably using prime factorisation. Ready for LCM word problems (FM.08) and for FR.06 / FR.07 (where LCM is the prereq).',
    Advanced:
      'Fluent with LCM on three-or-more numbers; uses the formula a × b = HCF × LCM where helpful.',
  },
  'FM.08': {
    Foundational:
      'Picks HCF when LCM is needed (or vice versa). Revisit cue words: "together again / smallest common" → LCM; "maximum equal / greatest common" → HCF.',
    Developing:
      'Picks the right operation on simple problems but slips on multi-step or three-number cases.',
    'On Track':
      'Reliably solves single-step HCF/LCM word problems and explains the choice of operation. Ready for multi-step problems.',
    Advanced:
      'Fluent with multi-step HCF/LCM problems including bell/light cycles and grouping. Appropriate to bridge into ratio reasoning.',
  },
  // ----- Ratio & Proportion -----
  'RP.01': {
    Foundational:
      'Writes ratios in the wrong order, or fails to simplify. Revisit the "out of" sense and FR.03 (simplification).',
    Developing:
      'Writes simple ratios in the right order but does not always simplify. Needs more HCF practice.',
    'On Track':
      'Writes and simplifies two- and three-term ratios reliably; converts unit-mismatched ratios. Ready for RP.02 / RP.03.',
    Advanced:
      'Fluent with three-term ratios and unit conversions inside ratios. Appropriate for application problems.',
  },
  'RP.02': {
    Foundational:
      'Multiplies one term but forgets the other (the FR.03 mistake repeated). Revisit the "k/k = 1" idea.',
    Developing:
      'Builds equivalent ratios on small examples but slips on larger multipliers or simplification.',
    'On Track':
      'Generates equivalent ratios reliably; finds missing terms when one term is the multiplier base. Ready for RP.03 (proportion).',
    Advanced:
      'Fluent with equivalent ratios across reduce-and-scale chains. Appropriate for proportion problems.',
  },
  'RP.03': {
    Foundational:
      'Doesn\'t reach for cross-multiplication; tests proportion by comparing one side only. Re-anchor in the rule a×d = b×c.',
    Developing:
      'Cross-multiplies on simple problems but slips on missing-term setups or larger numbers.',
    'On Track':
      'Tests for proportion and finds missing terms reliably using cross-multiplication.',
    Advanced:
      'Fluent with proportion problems including word-problem applications. Appropriate for the unitary method.',
  },
  'RP.04': {
    Foundational:
      'Skips the unit-quantity step or applies it only sometimes. Revisit the explicit "first find the cost / amount per 1 unit" routine.',
    Developing:
      'Applies the unitary method on direct-proportion problems but slips when the relationship is "more workers ⇒ fewer days".',
    'On Track':
      'Solves unitary-method problems in cost, distance, and rate contexts. Ready for multi-step word problems.',
    Advanced:
      'Fluent with unitary-method applications across direct and inverse contexts. Appropriate for ratio word problems.',
  },
  'RP.05': {
    Foundational:
      'Solid arithmetic, weak problem identification — picks ratio when proportion is needed, or vice versa. Re-anchor in question wording.',
    Developing:
      'Sets up the right calculation on simple problems but slips on multi-step or "share in ratio" problems.',
    'On Track':
      'Solves one- and two-step ratio / proportion word problems reliably.',
    Advanced:
      'Fluent across multi-step word problems including share-and-find-larger contexts.',
  },
  // ----- Module-mixed and full-mixed -----
  mixed_fractions: {
    Foundational:
      'Across the Fractions Module, the basics (visualising, equivalence, like denominators) are not yet stable. Strong candidate for the Learn section before more assessments.',
    Developing:
      'Some Fractions skills are coming together but there is still drift on procedural skills (LCM, borrowing) or word problems. Use the per-skill breakdown.',
    'On Track':
      'Most Fractions skills are reliable. Spot the one or two skills still in transition and target them.',
    Advanced:
      'Fluent across the Fractions module on this prototype. Appropriate to bridge to multiplication / division of fractions.',
  },
  mixed_decimals: {
    Foundational:
      'Across the Decimals module, place value is not yet anchored. Revisit DE.01 with a place-value chart before continuing.',
    Developing:
      'Some Decimals skills are coming together but trip on multi-place comparison or decimal arithmetic alignment.',
    'On Track':
      'Most Decimals skills are reliable. Practise on word problems (DE.05) to consolidate.',
    Advanced:
      'Fluent across the Decimals module. Appropriate for decimal × / ÷ work in later grades.',
  },
  mixed_factors_multiples: {
    Foundational:
      'Across F&M, the prime / composite definition and divisibility rules need more time. Revisit FM.03 + FM.04.',
    Developing:
      'Knows some divisibility rules and finds HCF/LCM on small numbers; slips on larger numbers and on word problems.',
    'On Track':
      'Most F&M skills are reliable, including HCF and LCM via prime factorisation. Practise word-problem identification.',
    Advanced:
      'Fluent across F&M including multi-step HCF/LCM word problems.',
  },
  mixed_ratio_proportion: {
    Foundational:
      'Across R&P, the order of terms in a ratio and the cross-multiplication rule are not yet stable. Revisit RP.01 and RP.03.',
    Developing:
      'Sets up simple ratio and proportion problems but slips on multi-step or "share in ratio" problems.',
    'On Track':
      'Most R&P skills are reliable. Push into multi-step word problems.',
    Advanced:
      'Fluent across R&P including age, share, and rate problems.',
  },
  // ----- Algebra Basics -----
  'AL.01': {
    Foundational:
      'Treats x as a literal letter, not as a placeholder for a number. Re-anchor with concrete examples ("x is the number of pencils"). Practise reading 3y as "three times some number".',
    Developing:
      'Recognises a variable on simple expressions but slips when more than one variable appears. Needs more examples connecting words to letters.',
    'On Track':
      'Comfortable with variables as placeholders for unknown numbers. Ready for AL.02 (writing simple expressions).',
    Advanced:
      'Fluent with the idea of a variable; sees that the choice of letter is arbitrary. Appropriate to begin algebraic manipulation.',
  },
  'AL.02': {
    Foundational:
      'Confuses an expression with an equation, or with a single variable. Re-anchor: an expression has variables AND constants joined by +, −, ×, ÷, but no equals sign.',
    Developing:
      'Can write basic expressions but slips on word→symbol translation ("3 less than x" → x − 3, NOT 3 − x).',
    'On Track':
      'Reliably writes expressions for word phrases and identifies coefficients and constants. Ready for AL.03 (evaluation).',
    Advanced:
      'Fluent with expressions of two variables and natural constants. Ready for AL.04 (one-step equations).',
  },
  'AL.03': {
    Foundational:
      'Confuses substitution with concatenation (e.g., x = 3 in 2x → "23" instead of 6). Re-anchor: substituting MULTIPLIES the coefficient by the value.',
    Developing:
      'Substitutes correctly on simple expressions but slips on order of operations or two-variable cases.',
    'On Track':
      'Evaluates one- and two-variable expressions reliably, with bracket / order-of-operations care. Ready for AL.04.',
    Advanced:
      'Fluent across multi-term expressions and word-problem evaluation. Appropriate to bridge into solving equations.',
  },
  'AL.04': {
    Foundational:
      'Picks the wrong inverse operation (adds when subtraction was needed, or vice versa). Re-anchor with the "do the opposite to undo it" idea on a number-line picture.',
    Developing:
      'Solves x + a = b reliably but trips on multiplicative or division equations.',
    'On Track':
      'Solves all four one-step equation types (+, −, ×, ÷) and checks the answer. Ready for AL.05 (word problems).',
    Advanced:
      'Fluent with one-step equations including those that ask for an expression of x (e.g., "find x + 2 if 3x = 21"). Ready for two-step equations in later grades.',
  },
  'AL.05': {
    Foundational:
      'Right arithmetic, wrong equation. The translation from words to an equation is the load-bearing step. Underline the question, then write "let x be …" before any maths.',
    Developing:
      'Translates one-step problems into equations but slips on two-step problems or on identifying what x represents.',
    'On Track':
      'Reliably writes and solves equations for one- and two-step word problems. Ready for harder multi-step problems.',
    Advanced:
      'Fluent with a range of word problems including age, cost-and-quantity, and "more / less than" framings.',
  },
  mixed_algebra: {
    Foundational:
      'Across Algebra Basics, the role of a variable and the reading of an expression are not yet stable. Revisit AL.01 and AL.02 before continuing.',
    Developing:
      'Some Algebra skills are coming together; trips on substitution or on choosing the right inverse operation.',
    'On Track':
      'Most Algebra Basics skills are reliable. Practise word problems (AL.05) to consolidate.',
    Advanced:
      'Fluent across Algebra Basics. Appropriate to bridge into two-step equations in later grades.',
  },
  // ----- Geometry Basics -----
  'GB.01': {
    Foundational:
      'Confuses point, line, line segment, and ray — for example, treats a ray and a line segment as the same. Revisit each definition with a labelled diagram before more practice.',
    Developing:
      'Identifies a point and a line on simple diagrams but slips on the difference between a line segment and a ray. More naming-and-drawing practice will help.',
    'On Track':
      'Reliably names and draws points, lines, line segments, and rays, including correct notation (AB, ray AB, segment AB). Ready for GB.02 (parallel and intersecting lines).',
    Advanced:
      'Fluent with all four basic objects and with notation. Appropriate to begin angle work (GB.03).',
  },
  'GB.02': {
    Foundational:
      'Confuses parallel with perpendicular, or thinks two lines that look close are parallel. Revisit GB.01 and use grid paper to check "never meet, no matter how far they are extended".',
    Developing:
      'Identifies parallel and intersecting lines on simple diagrams but slips on perpendicular vs ordinary intersection.',
    'On Track':
      'Reliably classifies pairs of lines as parallel, intersecting, or perpendicular. Ready for GB.03.',
    Advanced:
      'Fluent with parallel / intersecting / perpendicular and with the special "concurrent lines" case. Appropriate for GB.06 (quadrilaterals) where parallelism matters.',
  },
  'GB.03': {
    Foundational:
      'Confuses acute and obtuse, or calls a right angle "straight". Revisit angle types with a corner of a paper / set-square as a 90° reference.',
    Developing:
      'Identifies acute, right, and obtuse on clear pictures but slips on borderline cases or on straight / reflex angles.',
    'On Track':
      'Reliably classifies all five angle types (acute, right, obtuse, straight, reflex). Ready for GB.04 (measuring with a protractor).',
    Advanced:
      'Fluent with all five angle types and with reflex / non-reflex partners around a point. Appropriate for GB.05 (triangles by angle) and GB.06 (quadrilaterals).',
  },
  'GB.04': {
    Foundational:
      'Reads the wrong scale on the protractor (e.g., reads 130° as 50° on the inner scale) or starts the count from a non-zero mark. Revisit "line up the centre, line up the zero" routine.',
    Developing:
      'Reads the protractor on simple acute / obtuse angles but slips on angles near 90° or on drawing a given angle.',
    'On Track':
      'Measures and draws angles to the nearest degree reliably, including obtuse angles. Ready for GB.05.',
    Advanced:
      'Fluent with measuring and drawing across the full 0°–180° range, with care over inner / outer protractor scales. Appropriate for triangle / quadrilateral construction tasks in later grades.',
  },
  'GB.05': {
    Foundational:
      'Confuses scalene / isosceles / equilateral, or mixes side-based and angle-based classifications. Revisit GB.01 (sides) and GB.03 (angles) before more practice.',
    Developing:
      'Classifies clear cases by sides and clear cases by angles, but slips when a triangle is both (e.g., isosceles right triangle).',
    'On Track':
      'Classifies triangles by sides AND by angles reliably, and recognises that a triangle has two classifications. Ready for GB.06.',
    Advanced:
      'Fluent across all combinations (e.g., right isosceles, obtuse scalene) and with the angle-sum = 180° fact. Appropriate for triangle construction tasks.',
  },
  'GB.06': {
    Foundational:
      'Confuses square / rectangle / parallelogram, or treats a rhombus as just a "tilted square". Revisit definitions with property tables (sides equal? parallel? right angles?).',
    Developing:
      'Names common quadrilaterals on clear pictures but slips on trapeziums or on which properties imply which.',
    'On Track':
      'Reliably names and lists the basic properties of squares, rectangles, parallelograms, rhombuses, and trapeziums. Ready for area / perimeter work in later grades.',
    Advanced:
      'Fluent with the quadrilateral hierarchy (every square is a rectangle is a parallelogram, etc.) and with property-based classification. Appropriate for proof-style reasoning in later grades.',
  },
  'GB.07': {
    Foundational:
      'Confuses radius with diameter, or thinks a chord must pass through the centre. Revisit each definition on a labelled circle diagram.',
    Developing:
      'Names centre, radius, and diameter on clear diagrams but slips on chord (any segment with both endpoints on the circle) and arc.',
    'On Track':
      'Reliably names centre, radius, diameter, chord, and arc, and uses the diameter = 2 × radius relationship. Ready for circumference / area in later grades.',
    Advanced:
      'Fluent with all five terms and with the diameter-as-longest-chord property. Appropriate for circumference and circle-construction tasks.',
  },
  'GB.08': {
    Foundational:
      'Counts symmetry lines by what "looks symmetrical" rather than by the fold test. Revisit symmetry on a square and a non-square rectangle with paper folding.',
    Developing:
      'Reliably counts symmetry lines on a square, equilateral triangle, and rectangle, but slips on parallelograms (claims diagonals as symmetry lines) or on letters of the alphabet.',
    'On Track':
      'Reliably counts symmetry lines on common polygons and letters, and recognises that a parallelogram (non-rectangle, non-rhombus) has none and a circle has infinitely many.',
    Advanced:
      'Fluent with the "n sides → n lines" pattern for regular polygons and with the distinction between line symmetry and rotational symmetry.',
  },
  'GB.09': {
    Foundational:
      'Confuses x-axis and y-axis, or swaps x and y when reading and plotting points. Revisit the convention (x first, y second) with a labelled grid.',
    Developing:
      'Reads and plots points in the first quadrant on a clearly labelled grid but slips on points that lie on the axes, or on which coordinate corresponds to "across" vs. "up".',
    'On Track':
      'Reliably reads and plots points (x, y) in the first quadrant, including points on each axis, and computes distances between points that share an x- or y-coordinate.',
    Advanced:
      'Fluent with first-quadrant coordinates and with finding the missing corner of a rectangle on the grid. Ready to extend to the other three quadrants in later grades.',
  },
  mixed_geometry: {
    Foundational:
      'Across Geometry Basics, the basic objects (points, lines, rays) and the angle types are not yet stable. Revisit GB.01 and GB.03 before more assessments.',
    Developing:
      'Some Geometry skills are coming together — naming objects, recognising angle types — but trips on measuring with a protractor or on quadrilateral classification.',
    'On Track':
      'Most Geometry Basics skills are reliable. Practise on the harder triangle / quadrilateral classification items to consolidate.',
    Advanced:
      'Fluent across Geometry Basics on this prototype. Appropriate to begin perimeter / area / construction work in later grades.',
  },
  mixed: {
    Foundational:
      'Across the whole Class 6 Math prototype, basics in multiple modules are not yet stable. Use the per-module / per-skill breakdown and the Learn section before more assessments.',
    Developing:
      'Some modules are coming together but there is still drift on others. Use the per-skill breakdown to pick a focus.',
    'On Track':
      'Most skills across the four modules are reliable. Spot the one or two skills still in transition and target them.',
    Advanced:
      'Fluent across the whole Class 6 Math prototype on this device. Appropriate to begin bridging to harder topics.',
  },
  // v0.23 — Class 7 starter band copy (terse; teacher review required).
  'IR.01': {
    Foundational: 'Slips on sign rules when adding/subtracting integers. Revisit IR.01 with a number line.',
    Developing: 'Right idea, but signs slip on subtracting negatives. Drill the "subtract a negative = add the positive" identity.',
    'On Track': 'Reliable on integer addition and subtraction, including multi-step expressions.',
    Advanced: 'Fluent with sign rules and inverse identities — ready for integer multiplication / division.',
  },
  'IR.02': {
    Foundational: 'Confuses the sign rule for multiplication / division. Revisit the "same → +, different → −" table.',
    Developing: 'Knows the simple sign rule but trips on multi-factor products (counting negatives).',
    'On Track': 'Reliable on integer products and quotients, including 3-factor products and word problems.',
    Advanced: 'Fluent with the sign rule and the parity-of-negatives shortcut.',
  },
  'IR.03': {
    Foundational: 'Treats negative rationals like positives when comparing. Revisit the number line and standard form.',
    Developing: 'Recognises the p/q form but slips when comparing across signs or adding with unlike denominators.',
    'On Track': 'Reliable on identifying, comparing, and operating on rational numbers.',
    Advanced: 'Fluent with density and standard form; ready for proper rational-number arithmetic.',
  },
  'FE.01': {
    Foundational: 'Multiplies fractions across (or forgets to flip when dividing). Re-anchor with area models and "keep, change, flip".',
    Developing: 'Right rules, but slips on mixed-number conversions before multiplying / dividing.',
    'On Track': 'Reliable on fraction × and ÷, including mixed numbers and word problems.',
    Advanced: 'Fluent with all four fraction operations and "fraction of a quantity" reasoning.',
  },
  'FE.02': {
    Foundational: 'Treats "× 100" as "append zeros" without shifting the decimal point.',
    Developing: 'Knows the shift but mis-counts the number of places.',
    'On Track': 'Reliable with × and ÷ by 10, 100, 1000 across both directions, with correct zero-padding.',
    Advanced: 'Fluent with extended powers (10000, 1/10000) and with mixed shifts in word problems.',
  },
  'FE.03': {
    Foundational: 'Right-aligns decimals when adding or forgets to count decimal places in products.',
    Developing: 'Column-aligns correctly but slips on the place-count rule for ×.',
    'On Track': 'Reliable on decimal +, −, ×, ÷ to thousandths, with estimation as a sanity check.',
    Advanced: 'Fluent with multi-step decimal word problems and division by decimals.',
  },
  'AE.01': {
    Foundational: 'Combines unlike terms (e.g., 3x + 4y → 7xy). Revisit "like = same variable AND same exponent".',
    Developing: 'Combines like terms but slips on distributing over brackets.',
    'On Track': 'Reliable on combining like terms, including over expressions with brackets and leading minus.',
    Advanced: 'Fluent with distribution and grouping — ready for simple polynomial simplification.',
  },
  'AE.02': {
    Foundational: 'Squares negatives without brackets, or forgets BODMAS when evaluating.',
    Developing: 'Substitutes correctly but slips on sign rules in the arithmetic step.',
    'On Track': 'Reliable evaluating expressions at signed values, including squares of negatives.',
    Advanced: 'Fluent with signed substitution and with multi-variable expressions.',
  },
  'AE.03': {
    Foundational: 'Inverts in the wrong order (divides before clearing the constant).',
    Developing: 'Right order, but slips on word-problem translation to equation form.',
    'On Track': 'Reliable on two-step equations and their word-problem variants; verifies by substitution.',
    Advanced: 'Fluent with two-step equations, including division-first forms like (x - 5)/3 = 4.',
  },
  mixed_c7_integers: {
    Foundational: 'Across the Class 7 Integers & Rational Numbers starter, sign rules are not yet stable.',
    Developing: 'Some skills landing; mix of sign-rule slips and rational-number ordering errors.',
    'On Track': 'Most Class 7 Integers/Rationals skills are reliable on this starter bank.',
    Advanced: 'Fluent across the Class 7 Integers & Rational Numbers starter.',
  },
  mixed_c7_fractions_ext: {
    Foundational: 'Across the Class 7 Fractions & Decimals Extension starter, ×/÷ rules are not yet stable.',
    Developing: 'Some progress; mix of "keep-change-flip" slips and decimal-place errors.',
    'On Track': 'Most Class 7 Fractions/Decimals Extension skills are reliable on this starter bank.',
    Advanced: 'Fluent across the Class 7 Fractions & Decimals Extension starter.',
  },
  mixed_c7_algebra_ext: {
    Foundational: 'Across the Class 7 Algebraic Expressions & Equations starter, combining/evaluating is not yet stable.',
    Developing: 'Some progress; mix of like-term and sign errors in evaluation and equation-solving.',
    'On Track': 'Most Class 7 Algebra Extension skills are reliable on this starter bank.',
    Advanced: 'Fluent across the Class 7 Algebra Extension starter.',
  },

  // v0.25 — Class 7 deepening per-skill bands.
  'LA.01': {
    Foundational: 'Confuses complementary (90°) and supplementary (180°); reads vertically opposite as a linear pair.',
    Developing: 'Identifies the right pair name, but slips on the arithmetic (90 − x vs 180 − x).',
    'On Track': 'Reliable on all four angle pairs, including linear-pair and ratio questions.',
    Advanced: 'Fluent in mixed angle-pair reasoning and in setting up linear equations from angle conditions.',
  },
  'LA.02': {
    Foundational: 'Mixes corresponding, alternate, and co-interior pairs; assumes lines are parallel without markers.',
    Developing: 'Identifies pair types in clean diagrams; slips on co-interior supplementarity.',
    'On Track': 'Reliable on parallel-line angle relationships, including equation-based questions.',
    Advanced: 'Fluent with multi-step transversal reasoning and algebraic-angle equations.',
  },
  'LA.03': {
    Foundational: 'Uses 360° in place of 180°; isosceles/right-triangle deductions unreliable.',
    Developing: 'Angle sum applied, but slips on exterior-angle or ratio questions.',
    'On Track': 'Reliable on angle-sum, exterior-angle, ratio, and isosceles triangle reasoning.',
    Advanced: 'Fluent in multi-step triangle reasoning, including setting up equations for the third angle.',
  },
  'CQ.01': {
    Foundational: 'Decimal-shift direction confused (×/÷ 100); treats 3/5 as 3% without conversion.',
    Developing: 'Single conversions land; struggles to order mixed-form quantities.',
    'On Track': 'Reliable on all six F↔D↔% conversion directions and on ordering mixed forms.',
    Advanced: 'Fluent in non-terminating cases (rounding 1/3, 2/7) and in conversion chains.',
  },
  'CQ.02': {
    Foundational: 'Reports "p% of A" as p; takes p% of the wrong base in percent-change questions.',
    Developing: 'Direct percent-of lands; slips on reverse problems and on net change of repeated %s.',
    'On Track': 'Reliable on percent-of, percent-change, and reverse problems in everyday contexts.',
    Advanced: 'Fluent with chained percent changes (up p% then down q%) and reverse-base problems.',
  },
  'CQ.03': {
    Foundational: 'Forgets the /100 in SI; takes profit % off SP instead of CP.',
    Developing: 'Direct SI and direct profit/loss percent land; slips on amount-vs-interest distinctions.',
    'On Track': 'Reliable on SI, total-amount, and profit/loss percent in everyday financial contexts.',
    Advanced: 'Fluent on reverse problems (find CP from SP and profit %, find R from SI).',
  },
  'DH.01': {
    Foundational: 'Ignores pictograph scale; misreads non-1 bar-graph y-axes.',
    Developing: 'Reads single-bar/pictograph correctly; slips on totals and on double-bar comparisons.',
    'On Track': 'Reliable on all three graph types, including double-bar gap and total questions.',
    Advanced: 'Fluent on partial-icon and non-1 scale pictographs; reasons about trends across categories.',
  },
  'DH.02': {
    Foundational: 'Forgets to sort before taking the median; reports frequency instead of mode value.',
    Developing: 'Single measures land; slips when distinguishing odd/even count for median.',
    'On Track': 'Reliable on mean, median, and mode of small (≤10) datasets, including even count.',
    Advanced: 'Fluent on "missing value to make a given mean" and on mixed-measure reasoning.',
  },
  'DH.03': {
    Foundational: 'Lists sample space incompletely; gives probabilities outside [0, 1].',
    Developing: 'Direct coin/die probabilities land; slips on multi-event and complement questions.',
    'On Track': 'Reliable on equally-likely outcomes for dice, spinners, bags, and on P(not A).',
    Advanced: 'Fluent on prime-on-die, complement, and conditional intuition (within scope).',
  },

  // v0.25 — Class 7 deepening per-module mixed bands.
  mixed_c7_lines_angles: {
    Foundational: 'Across the Class 7 Lines & Angles module, angle-pair names and the 180° triangle sum are not yet stable.',
    Developing: 'Some skills landing; mix of complement/supplement confusion and parallel-line slips.',
    'On Track': 'Most Class 7 Lines & Angles skills are reliable on this bank.',
    Advanced: 'Fluent across the Class 7 Lines & Angles module, including algebraic-angle reasoning.',
  },
  mixed_c7_comparing_quantities: {
    Foundational: 'Across the Class 7 Comparing Quantities module, percent-shift and base-selection slips dominate.',
    Developing: 'Some progress; reverse and chained-percent questions still unstable.',
    'On Track': 'Most Class 7 Comparing Quantities skills are reliable on this bank.',
    Advanced: 'Fluent across F↔D↔%, percent change, simple interest, and profit/loss.',
  },
  mixed_c7_data_handling: {
    Foundational: 'Across the Class 7 Data Handling module, scale-reading and central-tendency definitions are not yet stable.',
    Developing: 'Some progress; slips on even-count median and on probability complements.',
    'On Track': 'Most Class 7 Data Handling skills are reliable on this bank.',
    Advanced: 'Fluent across graphs, mean/median/mode, and basic probability.',
  },
};

// Backwards-compatible default (FR.06 phrasing, kept for any caller that
// doesn't yet pass a skill).
export const BAND_DESCRIPTIONS: Record<Band, string> = BAND_DESCRIPTIONS_BY_SKILL['FR.06']!;

// Generic fallback used when a skill (e.g. the v0.29 starter skills) has
// no per-skill band description authored yet. The teacher-review status
// is surfaced verbatim so the reader knows this is prototype content.
const STARTER_BAND_FALLBACK: Record<Band, string> = {
  Foundational: 'Foundational on this prototype starter session — needs teacher review before any pilot use.',
  Developing: 'Developing on this prototype starter session — needs teacher review before any pilot use.',
  'On Track': 'On track on this prototype starter session — needs teacher review before any pilot use.',
  Advanced: 'Advanced on this prototype starter session — needs teacher review before any pilot use.',
};

export const bandDescription = (band: Band, skill: SkillMode): string => {
  const perSkill = BAND_DESCRIPTIONS_BY_SKILL[skill];
  return perSkill ? perSkill[band] : STARTER_BAND_FALLBACK[band];
};

export const computeBand = (ability: number): Band => {
  if (ability < 3.5) return 'Foundational';
  if (ability < 5.5) return 'Developing';
  if (ability < 7.5) return 'On Track';
  return 'Advanced';
};

export const bandColor = (band: Band): string => {
  switch (band) {
    case 'Foundational':
      return 'bg-rose-50 text-rose-700 ring-rose-200';
    case 'Developing':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'On Track':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'Advanced':
      return 'bg-brand-50 text-brand-700 ring-brand-200';
  }
};

export type MisconceptionSummary = {
  code: MisconceptionCode;
  label: string;
  count: number;
  itemIds: string[];
  nextStep: string;
};

export const summarizeMisconceptions = (
  responses: Response[]
): MisconceptionSummary[] => {
  const counts = new Map<
    MisconceptionCode,
    { count: number; itemIds: string[] }
  >();

  for (const r of responses) {
    if (r.correct) continue;
    if (r.misconceptionTriggered === 'none') continue;
    const entry = counts.get(r.misconceptionTriggered) ?? {
      count: 0,
      itemIds: [],
    };
    entry.count += 1;
    entry.itemIds.push(r.itemId);
    counts.set(r.misconceptionTriggered, entry);
  }

  return Array.from(counts.entries())
    .map(([code, { count, itemIds }]) => ({
      code,
      label: MISCONCEPTION_LABELS[code],
      count,
      itemIds,
      nextStep: MISCONCEPTION_NEXT_STEP[code],
    }))
    .sort((a, b) => b.count - a.count);
};

export const correctCount = (responses: Response[]): number =>
  responses.filter((r) => r.correct).length;

export const averageTimeSec = (responses: Response[]): number => {
  if (responses.length === 0) return 0;
  const total = responses.reduce((sum, r) => sum + r.timeMs, 0);
  return Math.round(total / responses.length / 1000);
};

/**
 * Simple diagnostic: list the bands in which the student answered correctly.
 * This is a transparency tool for the teacher ("saw 4 core items, got 3
 * right") - it is not an attempt at a latent-trait inference.
 */
export const bandAccuracy = (
  responses: Response[],
  pool: Item[]
): Array<{
  band: 'foundational' | 'core' | 'advanced';
  attempted: number;
  correct: number;
}> => {
  const byId = new Map(pool.map((it) => [it.id, it]));
  const bands: Array<'foundational' | 'core' | 'advanced'> = [
    'foundational',
    'core',
    'advanced',
  ];
  return bands.map((band) => {
    const subset = responses.filter((r) => byId.get(r.itemId)?.band === band);
    return {
      band,
      attempted: subset.length,
      correct: subset.filter((r) => r.correct).length,
    };
  });
};

// ---------------------------------------------------------------------------
// Prerequisite recommendations
// ---------------------------------------------------------------------------
// FR.06 has three direct prerequisites in the Class 6 skill tree:
//   FR.05 - Add fractions with like denominators
//   FR.03 - Equivalent fractions
//   FM.07 - Find LCM
// Plus FR.04 (mixed-number conversion) and FR.02 (fraction-as-model).
//
// FR.07 (subtract unlike denominators) shares those prerequisites, plus
// FR.06 itself: a student who cannot add fractions with unlike denominators
// is unlikely to subtract them reliably, so FR.06 is included as a
// prerequisite for the FR.07-specific misconceptions.

export type PrerequisiteSkill = {
  code:
    // Fractions
    | 'FR.02'
    | 'FR.03'
    | 'FR.04'
    | 'FR.05'
    | 'FR.06'
    | 'FR.07'
    | 'FR.08'
    // Decimals
    | 'DE.01'
    | 'DE.02'
    | 'DE.03'
    | 'DE.04'
    | 'DE.05'
    // Factors & Multiples
    | 'FM.03'
    | 'FM.04'
    | 'FM.06'
    | 'FM.07'
    | 'FM.08'
    // Ratio & Proportion
    | 'RP.01'
    | 'RP.02'
    | 'RP.03'
    | 'RP.04'
    | 'RP.05'
    // Algebra Basics
    | 'AL.01'
    | 'AL.02'
    | 'AL.03'
    | 'AL.04'
    | 'AL.05'
    // Geometry Basics (v0.16, extended in v0.18 with GB.08 + GB.09)
    | 'GB.01'
    | 'GB.02'
    | 'GB.03'
    | 'GB.04'
    | 'GB.05'
    | 'GB.06'
    | 'GB.07'
    | 'GB.08'
    | 'GB.09'
    // v0.23 — Class 7 starter prerequisite codes.
    | 'IR.01'
    | 'IR.02'
    | 'IR.03'
    | 'FE.01'
    | 'FE.02'
    | 'FE.03'
    | 'AE.01'
    | 'AE.02'
    | 'AE.03'
    // v0.25 — Class 7 deepening prerequisite codes.
    | 'LA.01'
    | 'LA.02'
    | 'LA.03'
    | 'CQ.01'
    | 'CQ.02'
    | 'CQ.03'
    | 'DH.01'
    | 'DH.02'
    | 'DH.03';
  name: string;
};

export const PREREQUISITE_FOR_MISCONCEPTION: Record<
  MisconceptionCode,
  PrerequisiteSkill[]
> = {
  add_across: [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.05', name: 'Add fractions with like denominators' },
  ],
  subtract_across: [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
  ],
  incomplete_conversion: [
    { code: 'FR.03', name: 'Equivalent fractions' },
  ],
  product_not_lcm: [
    { code: 'FM.07', name: 'Find LCM of two or three numbers' },
  ],
  operation_confusion: [
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
  ],
  mixed_number_error: [
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
  ],
  borrowing_error: [
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
    { code: 'FR.06', name: 'Add fractions with unlike denominators' },
  ],
  conceptual_gap: [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
  ],
  visual_misread: [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
  ],
  arithmetic_slip: [],
  form_error: [
    { code: 'FR.03', name: 'Equivalent fractions' },
  ],
  none: [],
};

// Static prerequisite list per skill, surfaced to the teacher as "what
// FR.0x is built on" reference text — independent of misconception
// observations. Used in the assessment results screen and on the Learn
// skill cards.
// v0.29 — widened to Partial so the starter skills (which have no
// authored prerequisite chain yet) can be missing without a compile
// error. Callers should treat a missing entry as "no static prereqs".
export const STATIC_PREREQUISITES_BY_SKILL: Partial<Record<SkillId, PrerequisiteSkill[]>> = {
  'FR.02': [],
  'FR.03': [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
  ],
  'FR.04': [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.03', name: 'Equivalent fractions' },
  ],
  'FR.05': [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.03', name: 'Equivalent fractions' },
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
  ],
  'FR.06': [
    { code: 'FR.02', name: 'Read and represent fractions on a model' },
    { code: 'FR.03', name: 'Equivalent fractions' },
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
    { code: 'FM.07', name: 'Find LCM of two or three numbers' },
  ],
  'FR.07': [
    { code: 'FR.03', name: 'Equivalent fractions' },
    { code: 'FR.04', name: 'Convert between mixed numbers and improper fractions' },
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
    { code: 'FR.06', name: 'Add fractions with unlike denominators' },
    { code: 'FM.07', name: 'Find LCM of two or three numbers' },
  ],
  'FR.08': [
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators' },
    { code: 'FR.06', name: 'Add fractions with unlike denominators' },
    { code: 'FR.07', name: 'Subtract fractions with unlike denominators' },
  ],
  // Decimals
  'DE.01': [],
  'DE.02': [
    { code: 'DE.01', name: 'Decimal place value' },
    { code: 'FR.03', name: 'Equivalent fractions' },
  ],
  'DE.03': [
    { code: 'DE.01', name: 'Decimal place value' },
  ],
  'DE.04': [
    { code: 'DE.01', name: 'Decimal place value' },
    { code: 'DE.03', name: 'Compare and order decimals' },
  ],
  'DE.05': [
    { code: 'DE.04', name: 'Add and subtract decimals' },
  ],
  // Factors & Multiples
  'FM.03': [],
  'FM.04': [],
  'FM.06': [
    { code: 'FM.03', name: 'Prime and composite numbers' },
  ],
  'FM.07': [
    { code: 'FM.03', name: 'Prime and composite numbers' },
  ],
  'FM.08': [
    { code: 'FM.06', name: 'Highest Common Factor (HCF)' },
    { code: 'FM.07', name: 'Lowest Common Multiple (LCM)' },
  ],
  // Ratio & Proportion
  'RP.01': [
    { code: 'FR.03', name: 'Equivalent fractions' },
    { code: 'FM.06', name: 'Highest Common Factor (HCF)' },
  ],
  'RP.02': [
    { code: 'RP.01', name: 'Concept of ratio' },
  ],
  'RP.03': [
    { code: 'RP.01', name: 'Concept of ratio' },
    { code: 'RP.02', name: 'Equivalent ratios' },
  ],
  'RP.04': [
    { code: 'RP.03', name: 'Proportion' },
  ],
  'RP.05': [
    { code: 'RP.03', name: 'Proportion' },
    { code: 'RP.04', name: 'Unitary method' },
  ],
  // Algebra Basics
  'AL.01': [],
  'AL.02': [
    { code: 'AL.01', name: 'Understanding variables' },
  ],
  'AL.03': [
    { code: 'AL.01', name: 'Understanding variables' },
    { code: 'AL.02', name: 'Simple expressions' },
  ],
  'AL.04': [
    { code: 'AL.02', name: 'Simple expressions' },
    { code: 'AL.03', name: 'Evaluate expressions' },
  ],
  'AL.05': [
    { code: 'AL.03', name: 'Evaluate expressions' },
    { code: 'AL.04', name: 'One-step equations' },
  ],
  // Geometry Basics
  'GB.01': [],
  'GB.02': [
    { code: 'GB.01', name: 'Points, lines, line segments, rays' },
  ],
  'GB.03': [
    { code: 'GB.01', name: 'Points, lines, line segments, rays' },
  ],
  'GB.04': [
    { code: 'GB.03', name: 'Types of angles' },
  ],
  'GB.05': [
    { code: 'GB.01', name: 'Points, lines, line segments, rays' },
    { code: 'GB.03', name: 'Types of angles' },
  ],
  'GB.06': [
    { code: 'GB.01', name: 'Points, lines, line segments, rays' },
    { code: 'GB.02', name: 'Parallel and intersecting lines' },
    { code: 'GB.03', name: 'Types of angles' },
  ],
  'GB.07': [
    { code: 'GB.01', name: 'Points, lines, line segments, rays' },
  ],
  'GB.08': [
    { code: 'GB.05', name: 'Triangles: classify by sides and angles' },
    { code: 'GB.06', name: 'Quadrilaterals: basic properties' },
  ],
  'GB.09': [
    { code: 'GB.01', name: 'Points, lines, line segments, rays' },
  ],
  // v0.23 — Class 7 starter prerequisites.
  'IR.01': [
    { code: 'FR.05', name: 'Add and subtract fractions with like denominators (sign-free arithmetic)' },
  ],
  'IR.02': [
    { code: 'IR.01', name: 'Add and subtract integers' },
  ],
  'IR.03': [
    { code: 'FR.03', name: 'Equivalent fractions' },
    { code: 'IR.01', name: 'Add and subtract integers' },
  ],
  'FE.01': [
    { code: 'FR.04', name: 'Mixed numbers and improper fractions' },
    { code: 'FR.06', name: 'Add fractions with unlike denominators' },
  ],
  'FE.02': [
    { code: 'DE.01', name: 'Decimal place value' },
  ],
  'FE.03': [
    { code: 'DE.04', name: 'Add and subtract decimals' },
    { code: 'FE.02', name: 'Multiply and divide decimals by powers of 10' },
  ],
  'AE.01': [
    { code: 'AL.02', name: 'Simple expressions' },
  ],
  'AE.02': [
    { code: 'AL.03', name: 'Evaluate expressions' },
    { code: 'IR.02', name: 'Multiply and divide integers' },
  ],
  'AE.03': [
    { code: 'AL.04', name: 'One-step equations' },
    { code: 'AE.01', name: 'Combine like terms' },
  ],
  // v0.25 — Class 7 deepening prerequisites.
  'LA.01': [
    { code: 'GB.03', name: 'Types of angles' },
    { code: 'GB.04', name: 'Measuring and drawing angles' },
  ],
  'LA.02': [
    { code: 'GB.02', name: 'Parallel and intersecting lines' },
    { code: 'LA.01', name: 'Complementary, supplementary, and vertically opposite angles' },
  ],
  'LA.03': [
    { code: 'GB.05', name: 'Triangles: classify by sides and angles' },
    { code: 'LA.01', name: 'Complementary, supplementary, and vertically opposite angles' },
  ],
  'CQ.01': [
    { code: 'FR.03', name: 'Equivalent fractions' },
    { code: 'DE.02', name: 'Convert fractions and decimals' },
  ],
  'CQ.02': [
    { code: 'CQ.01', name: 'Convert between fractions, decimals, and percentages' },
    { code: 'RP.04', name: 'Unitary method' },
  ],
  'CQ.03': [
    { code: 'CQ.02', name: 'Percentage of a quantity and percent change' },
  ],
  'DH.01': [
    { code: 'FR.05', name: 'Add and subtract with like denominators (arithmetic fluency)' },
  ],
  'DH.02': [
    { code: 'DE.04', name: 'Add and subtract decimals' },
    { code: 'DH.01', name: 'Read pictographs, bar graphs, and double-bar graphs' },
  ],
  'DH.03': [
    { code: 'FR.03', name: 'Equivalent fractions (for simplifying probability fractions)' },
  ],
};

export type PrerequisiteRecommendation = {
  skill: PrerequisiteSkill;
  reason: string;
};

export const recommendPrerequisites = (
  responses: Response[]
): PrerequisiteRecommendation[] => {
  const summaries = summarizeMisconceptions(responses);
  const seen = new Set<string>();
  const recs: PrerequisiteRecommendation[] = [];
  for (const s of summaries) {
    const skills = PREREQUISITE_FOR_MISCONCEPTION[s.code];
    for (const skill of skills) {
      if (seen.has(skill.code)) continue;
      seen.add(skill.code);
      recs.push({
        skill,
        reason: `Selected the "${s.label.toLowerCase()}" distractor on ${s.count} item${s.count > 1 ? 's' : ''} (${s.itemIds.join(', ')}).`,
      });
    }
  }
  return recs;
};

// ---------------------------------------------------------------------------
// Session summary (used by growth indicator + history table)
// ---------------------------------------------------------------------------
export type SessionSummary = {
  total: number;
  correct: number;
  accuracy: number;            // 0..1
  avgDifficulty: number;       // mean of difficultyAtAttempt
  difficultyRange: number;     // max - min of difficultyAtAttempt
  misconceptionRate: number;   // (# wrong with non-'none' tag) / total
  avgTimeSec: number;
};

export const summarizeSession = (s: Session): SessionSummary => {
  const total = s.responses.length;
  const correct = correctCount(s.responses);
  const accuracy = total === 0 ? 0 : correct / total;
  const diffs = s.responses.map((r) => r.difficultyAtAttempt);
  const avgDifficulty =
    diffs.length === 0
      ? 0
      : diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const difficultyRange =
    diffs.length === 0 ? 0 : Math.max(...diffs) - Math.min(...diffs);
  const misconceptionWrong = s.responses.filter(
    (r) => !r.correct && r.misconceptionTriggered !== 'none'
  ).length;
  const misconceptionRate = total === 0 ? 0 : misconceptionWrong / total;
  return {
    total,
    correct,
    accuracy,
    avgDifficulty,
    difficultyRange,
    misconceptionRate,
    avgTimeSec: averageTimeSec(s.responses),
  };
};

// ---------------------------------------------------------------------------
// Prototype change indicator (composite, with confidence)
// ---------------------------------------------------------------------------
// Compares two completed sessions for the SAME student & SAME skill and
// returns a careful change descriptor.
//
// Composite direction is computed from three normalised components:
//   - accuracyDelta:        current.accuracy - prev.accuracy        (-1..+1)
//   - difficultyDeltaNorm:  (current.avgDiff - prev.avgDiff) / 9    (-1..+1)
//   - misconceptionDelta:   prev.misRate - current.misRate          (-1..+1)
// (For misconception, an *improvement* is a *decrease* in rate, so we
// flip the sign so positive composite = improvement on every axis.)
//
// composite = avg(weights * components). Thresholds: |composite| < 0.05
// is reported as flat.
//
// This is NOT a validated growth metric. Display copy uses "prototype
// change indicator" and "early signal, not calibrated growth".

export type GrowthDirection = 'up' | 'down' | 'flat';
export type GrowthConfidence = 'low' | 'moderate';

export type GrowthIndicator = {
  direction: GrowthDirection;
  composite: number;            // -1..+1, positive = improvement
  abilityDelta: number;         // current.finalAbility - prev.finalAbility
  accuracyDelta: number;        // 0..1 fractional change
  difficultyDelta: number;      // raw delta on 1-10 scale
  misconceptionDelta: number;   // current.misRate - prev.misRate (negative = improving)
  prevSummary: SessionSummary;
  currentSummary: SessionSummary;
  prevAbility: number;
  currentAbility: number;
  prevBand: Band;
  currentBand: Band;
  prevAt: number;
  currentAt: number;
  confidence: GrowthConfidence;
  confidenceReasons: string[];
  summary: string;
};

const FLAT_COMPOSITE = 0.05;
const MIN_ITEMS_FOR_CONFIDENCE = 8;
const MIN_DIFF_RANGE_FOR_CONFIDENCE = 4;

export const sessionConfidence = (
  s: SessionSummary
): { confidence: GrowthConfidence; reasons: string[] } => {
  const reasons: string[] = [];
  if (s.total < MIN_ITEMS_FOR_CONFIDENCE) {
    reasons.push(
      `Only ${s.total} item${s.total === 1 ? '' : 's'} in this session (need at least ${MIN_ITEMS_FOR_CONFIDENCE} for moderate confidence).`
    );
  }
  if (s.difficultyRange < MIN_DIFF_RANGE_FOR_CONFIDENCE) {
    reasons.push(
      `Items spanned only ${s.difficultyRange.toFixed(0)} points of seed difficulty (need at least ${MIN_DIFF_RANGE_FOR_CONFIDENCE} for moderate confidence).`
    );
  }
  return {
    confidence: reasons.length === 0 ? 'moderate' : 'low',
    reasons,
  };
};

export const growthIndicator = (
  prev: Session,
  current: Session
): GrowthIndicator => {
  const prevSummary = summarizeSession(prev);
  const currentSummary = summarizeSession(current);

  const abilityDelta = current.finalAbility - prev.finalAbility;
  const accuracyDelta = currentSummary.accuracy - prevSummary.accuracy;
  const difficultyDelta =
    currentSummary.avgDifficulty - prevSummary.avgDifficulty;
  const misconceptionDelta =
    currentSummary.misconceptionRate - prevSummary.misconceptionRate;

  // Normalise difficulty to roughly the same -1..+1 range as the others.
  const difficultyNorm = difficultyDelta / 9;
  // Misconception: improvement = decrease, so flip sign for the composite.
  const misconceptionImprovement = -misconceptionDelta;

  const composite =
    (accuracyDelta + difficultyNorm + misconceptionImprovement) / 3;

  const direction: GrowthDirection =
    Math.abs(composite) < FLAT_COMPOSITE
      ? 'flat'
      : composite > 0
        ? 'up'
        : 'down';

  // Confidence: take the *worse* of the two sessions' confidences.
  const prevConf = sessionConfidence(prevSummary);
  const currentConf = sessionConfidence(currentSummary);
  const confidence: GrowthConfidence =
    prevConf.confidence === 'low' || currentConf.confidence === 'low'
      ? 'low'
      : 'moderate';
  const confidenceReasons: string[] = [];
  if (prevConf.confidence === 'low') {
    confidenceReasons.push(
      ...prevConf.reasons.map((r) => `Prior session: ${r}`)
    );
  }
  if (currentConf.confidence === 'low') {
    confidenceReasons.push(
      ...currentConf.reasons.map((r) => `This session: ${r}`)
    );
  }

  // Build a hedged human summary line.
  const componentsText = describeComponents(
    accuracyDelta,
    difficultyDelta,
    misconceptionDelta
  );
  const directionText =
    direction === 'flat'
      ? 'roughly flat'
      : direction === 'up'
        ? 'an early signal of improvement'
        : 'an early signal of regression';
  const confidenceText =
    confidence === 'low'
      ? ' Confidence is LOW — treat this as anecdotal until more data is available.'
      : ' Confidence is moderate (still not a calibrated growth measurement).';
  const summary = `Prototype change indicator: ${directionText}. ${componentsText}${confidenceText}`;

  return {
    direction,
    composite,
    abilityDelta,
    accuracyDelta,
    difficultyDelta,
    misconceptionDelta,
    prevSummary,
    currentSummary,
    prevAbility: prev.finalAbility,
    currentAbility: current.finalAbility,
    prevBand: computeBand(prev.finalAbility),
    currentBand: computeBand(current.finalAbility),
    prevAt: prev.completedAt ?? prev.startedAt,
    currentAt: current.completedAt ?? current.startedAt,
    confidence,
    confidenceReasons,
    summary,
  };
};

function describeComponents(
  accuracyDelta: number,
  difficultyDelta: number,
  misconceptionDelta: number
): string {
  const accPct = Math.round(accuracyDelta * 100);
  const accStr =
    accPct === 0
      ? 'accuracy unchanged'
      : `accuracy ${accPct > 0 ? 'up' : 'down'} ${Math.abs(accPct)} pts`;
  const diffStr =
    Math.abs(difficultyDelta) < 0.1
      ? 'attempted similar difficulty'
      : `attempted ${difficultyDelta > 0 ? 'harder' : 'easier'} items on average (Δ${difficultyDelta >= 0 ? '+' : '−'}${Math.abs(difficultyDelta).toFixed(1)})`;
  const misPct = Math.round(misconceptionDelta * 100);
  const misStr =
    misPct === 0
      ? 'misconception rate unchanged'
      : `misconception rate ${misPct > 0 ? 'up' : 'down'} ${Math.abs(misPct)} pts`;
  return `${capitalise(accStr)}; ${diffStr}; ${misStr}.`;
}

function capitalise(s: string): string {
  return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Per-skill helpers (v0.4, expanded in v0.5 to cover all 7 fraction skills)
// ---------------------------------------------------------------------------
// A "mixed" session may contain responses across the full Fractions Module.
// These helpers split a response array by the item's skillId so the UI can
// surface per-skill accuracy and misconception breakdowns.

import { SKILL_IDS_ORDERED } from '../types';

// Build a quick lookup from itemId -> skillId for the items the student
// actually saw in this session. Returns 'FR.06' as the safest default for
// any item not found in the pool (this should be vanishingly rare and
// only happens if the bank changes between sessions).
const responseSkillLookup = (
  responses: Response[],
  pool: Item[]
): Map<string, SkillId> => {
  const byId = new Map(pool.map((it) => [it.id, it.skillId]));
  const m = new Map<string, SkillId>();
  for (const r of responses) {
    m.set(r.itemId, byId.get(r.itemId) ?? 'FR.06');
  }
  return m;
};

const emptyBySkill = (): Record<SkillId, Response[]> => {
  const out = {} as Record<SkillId, Response[]>;
  for (const s of SKILL_IDS_ORDERED) out[s] = [];
  return out;
};

export const responsesBySkill = (
  responses: Response[],
  pool: Item[]
): Record<SkillId, Response[]> => {
  const lookup = responseSkillLookup(responses, pool);
  const out = emptyBySkill();
  for (const r of responses) {
    const skill = lookup.get(r.itemId) ?? 'FR.06';
    out[skill].push(r);
  }
  return out;
};

export type SkillBreakdown = {
  skillId: SkillId;
  attempted: number;
  correct: number;
  accuracy: number; // 0..1; 0 if attempted === 0
  avgTimeSec: number;
  misconceptions: MisconceptionSummary[];
};

export const summarizeBySkill = (
  responses: Response[],
  pool: Item[]
): SkillBreakdown[] => {
  const split = responsesBySkill(responses, pool);
  return SKILL_IDS_ORDERED.map((skill) => {
    const subset = split[skill];
    const correct = correctCount(subset);
    return {
      skillId: skill,
      attempted: subset.length,
      correct,
      accuracy: subset.length === 0 ? 0 : correct / subset.length,
      avgTimeSec: averageTimeSec(subset),
      misconceptions: summarizeMisconceptions(subset),
    };
  });
};

// True iff the session draws from more than one skill bank.
export const isMixedSession = (
  responses: Response[],
  pool: Item[]
): boolean => {
  const split = responsesBySkill(responses, pool);
  return SKILL_IDS_ORDERED.filter((s) => split[s].length > 0).length > 1;
};
