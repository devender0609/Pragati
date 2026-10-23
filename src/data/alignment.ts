// Alignment metadata for the Class 6 Math prototype (v0.10).
//
// What this file IS:
//   - The prototype's own reading of the public Class 6 framework
//     (NCF / NCERT / Ganita Prakash 2024). One SkillAlignment per
//     SkillId. Plus a small set of per-item overrides where an item is
//     borderline for grade 6, ambiguous, or carries a parser limitation.
//
// What this file IS NOT:
//   - An official CBSE alignment.
//   - A claim of CBSE / NCERT endorsement.
//   - A teacher-validated mapping.
//
// Every alignment statement here is "the prototype's reading" and
// requires a CBSE Class 6 maths teacher to review before pilot use.
// The Alignment Review page surfaces this caveat prominently.

import { ITEMS, type Item } from './items';
import {
  type AlignmentConfidence,
  type AuditFlag,
  type CognitiveDemand,
  type ItemAlignment,
  type ModuleId,
  type SkillAlignment,
  type SkillId,
} from '../types';

// ---------------------------------------------------------------------------
// Per-skill alignment (36 Class 6 + 9 Class 7 = 45 entries)
// ---------------------------------------------------------------------------
// v0.23: Class 7 alignment authored in src/data/class7.ts and spread in.
import { CLASS7_ALIGNMENT } from './class7';

// v0.34 — widened to Partial<Record>. The v0.29→v0.33 starter grades
// (G1.01 … G12.30) don't have hand-authored alignment records, and
// shipping stubs would be misleading. `getItemAlignment` synthesises a
// safe fallback for skills without an entry so nothing crashes.
export const SKILL_ALIGNMENT: Partial<Record<SkillId, SkillAlignment>> = {
  ...CLASS7_ALIGNMENT,
  // ===== Fractions module =====
  'FR.02': {
    skillId: 'FR.02',
    skillName: 'Represent fractions visually',
    moduleId: 'fractions',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Fractions chapter: introduction to fractions on visual models.',
    learningOutcome:
      'Reads and writes a fraction for the shaded part of a given visual model (bar, area grid, number line) where the whole is divided into equal parts.',
    competencyStatement:
      'Recognises a fraction as a number representing equal parts of a whole, written as numerator over denominator.',
    prerequisiteSkills: [],
    cognitiveFocus: 'conceptual',
  },
  'FR.03': {
    skillId: 'FR.03',
    skillName: 'Equivalent fractions',
    moduleId: 'fractions',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Fractions chapter: equivalent fractions and simplest form.',
    learningOutcome:
      'Builds equivalent fractions by multiplying numerator and denominator by the same non-zero number, and reduces a fraction to its simplest form using HCF.',
    competencyStatement:
      'Generates equivalent fractions and simplifies a given fraction to its lowest terms.',
    prerequisiteSkills: ['FR.02'],
    cognitiveFocus: 'procedural',
  },
  'FR.04': {
    skillId: 'FR.04',
    skillName: 'Mixed numbers and improper fractions',
    moduleId: 'fractions',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Fractions chapter: mixed and improper forms.',
    learningOutcome:
      'Converts between mixed numbers and improper fractions using division with remainder.',
    competencyStatement:
      'Recognises that a mixed number and its improper fraction represent the same value, and switches between them.',
    prerequisiteSkills: ['FR.02', 'FR.03'],
    cognitiveFocus: 'procedural',
  },
  'FR.05': {
    skillId: 'FR.05',
    skillName: 'Add and subtract with like denominators',
    moduleId: 'fractions',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Fractions chapter: addition and subtraction with the same denominator.',
    learningOutcome:
      'Adds and subtracts fractions with the same denominator by combining only the numerators, and simplifies the result.',
    competencyStatement:
      'Adds and subtracts fractions with like denominators and expresses the answer in simplest form.',
    prerequisiteSkills: ['FR.02', 'FR.03', 'FR.04'],
    cognitiveFocus: 'procedural',
  },
  'FR.06': {
    skillId: 'FR.06',
    skillName: 'Add fractions with unlike denominators',
    moduleId: 'fractions',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Fractions chapter: addition with unlike denominators using LCM.',
    learningOutcome:
      'Adds fractions with unlike denominators by rewriting them over a common denominator (LCM) and adding the numerators.',
    competencyStatement:
      'Adds fractions with unlike denominators (including mixed numbers) using equivalent fractions, and expresses the answer in simplest form.',
    prerequisiteSkills: ['FR.02', 'FR.03', 'FR.04', 'FR.05', 'FM.07'],
    cognitiveFocus: 'procedural',
  },
  'FR.07': {
    skillId: 'FR.07',
    skillName: 'Subtract fractions with unlike denominators',
    moduleId: 'fractions',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Fractions chapter: subtraction with unlike denominators, including borrowing on mixed numbers.',
    learningOutcome:
      'Subtracts fractions with unlike denominators using equivalent fractions, including mixed-number subtraction with borrowing.',
    competencyStatement:
      'Subtracts fractions with unlike denominators (including mixed numbers with borrowing) and expresses the answer in simplest form.',
    prerequisiteSkills: ['FR.03', 'FR.04', 'FR.05', 'FR.06', 'FM.07'],
    cognitiveFocus: 'procedural',
  },
  'FR.08': {
    skillId: 'FR.08',
    skillName: 'Fraction word problems',
    moduleId: 'fractions',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Fractions chapter: real-life applications of fraction operations.',
    learningOutcome:
      'Solves one- and two-step real-life problems involving addition and subtraction of fractions, choosing the correct operation from the question.',
    competencyStatement:
      'Applies fraction operations (FR.05–FR.07) to one- and two-step word problems with measurement and money contexts.',
    prerequisiteSkills: ['FR.05', 'FR.06', 'FR.07'],
    cognitiveFocus: 'application',
  },

  // ===== Decimals module =====
  'DE.01': {
    skillId: 'DE.01',
    skillName: 'Decimal place value',
    moduleId: 'decimals',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Decimals chapter: place value to thousandths.',
    learningOutcome:
      'Reads and writes decimals to thousandths and identifies the place value of each digit (tenths, hundredths, thousandths).',
    competencyStatement:
      'Recognises decimals as an extension of place value, and reads / writes the value of each digit.',
    prerequisiteSkills: [],
    cognitiveFocus: 'conceptual',
  },
  'DE.02': {
    skillId: 'DE.02',
    skillName: 'Convert fractions and decimals',
    moduleId: 'decimals',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Decimals chapter: fractions with denominators 10 / 100 / 1000 and their decimal forms.',
    learningOutcome:
      'Converts between common fractions (denominators 2, 4, 5, 10, 100) and their decimal equivalents.',
    competencyStatement:
      'Recognises a decimal as a fraction with a power-of-ten denominator, and switches between the two forms.',
    prerequisiteSkills: ['DE.01', 'FR.03'],
    cognitiveFocus: 'procedural',
  },
  'DE.03': {
    skillId: 'DE.03',
    skillName: 'Compare and order decimals',
    moduleId: 'decimals',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Decimals chapter: comparing decimals using place value.',
    learningOutcome:
      'Compares and orders decimals to thousandths by aligning place values (padding with zeros where needed).',
    competencyStatement:
      'Compares two or more decimals and orders them, recognising trailing-zero equivalence.',
    prerequisiteSkills: ['DE.01'],
    cognitiveFocus: 'conceptual',
  },
  'DE.04': {
    skillId: 'DE.04',
    skillName: 'Add and subtract decimals',
    moduleId: 'decimals',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Decimals chapter: addition and subtraction with decimal-point alignment.',
    learningOutcome:
      'Adds and subtracts decimals (to two decimal places, extending to thousandths) by aligning decimal points.',
    competencyStatement:
      'Adds and subtracts decimals using place-value alignment, including borrowing across the decimal point.',
    prerequisiteSkills: ['DE.01', 'DE.03'],
    cognitiveFocus: 'procedural',
  },
  'DE.05': {
    skillId: 'DE.05',
    skillName: 'Decimal word problems',
    moduleId: 'decimals',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Decimals chapter: applications in money, length, and capacity.',
    learningOutcome:
      'Solves one- and two-step real-life problems involving decimals in money / length / capacity contexts.',
    competencyStatement:
      'Applies decimal addition and subtraction to real-life problems and writes the answer with the correct units.',
    prerequisiteSkills: ['DE.04'],
    cognitiveFocus: 'application',
  },

  // ===== Factors & Multiples module =====
  'FM.03': {
    skillId: 'FM.03',
    skillName: 'Prime and composite numbers',
    moduleId: 'factors_multiples',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Playing with Numbers chapter: prime, composite, and factor trees.',
    learningOutcome:
      'Identifies prime and composite numbers up to 100 and writes the prime factorisation of a small composite number.',
    competencyStatement:
      'Recognises prime and composite numbers and writes a small composite number as a product of primes.',
    prerequisiteSkills: [],
    cognitiveFocus: 'conceptual',
  },
  'FM.04': {
    skillId: 'FM.04',
    skillName: 'Divisibility rules',
    moduleId: 'factors_multiples',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Playing with Numbers chapter: divisibility tests for 2, 3, 4, 5, 6, 9, 10.',
    learningOutcome:
      'Applies divisibility tests for 2, 3, 4, 5, 6, 9, and 10 without performing the full division.',
    competencyStatement:
      'Tests divisibility of given numbers using digit-based rules.',
    prerequisiteSkills: [],
    cognitiveFocus: 'procedural',
  },
  'FM.06': {
    skillId: 'FM.06',
    skillName: 'Highest Common Factor (HCF)',
    moduleId: 'factors_multiples',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Playing with Numbers chapter: HCF by listing factors and by prime factorisation.',
    learningOutcome:
      'Finds the HCF of two or three numbers by listing factors or by prime factorisation.',
    competencyStatement:
      'Finds the HCF of two or three numbers using either listing or prime factorisation.',
    prerequisiteSkills: ['FM.03'],
    cognitiveFocus: 'procedural',
  },
  'FM.07': {
    skillId: 'FM.07',
    skillName: 'Lowest Common Multiple (LCM)',
    moduleId: 'factors_multiples',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Playing with Numbers chapter: LCM by listing multiples and by prime factorisation.',
    learningOutcome:
      'Finds the LCM of two or three numbers by listing multiples or by prime factorisation.',
    competencyStatement:
      'Finds the LCM of two or three numbers using either listing or prime factorisation.',
    prerequisiteSkills: ['FM.03'],
    cognitiveFocus: 'procedural',
  },
  'FM.08': {
    skillId: 'FM.08',
    skillName: 'HCF / LCM word problems',
    moduleId: 'factors_multiples',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Playing with Numbers chapter: applications of HCF and LCM (intervals, groupings).',
    learningOutcome:
      'Decides between HCF and LCM in a real-life context (e.g., "biggest equal grouping" vs "next time together") and computes the answer.',
    competencyStatement:
      'Applies HCF / LCM to one- and two-step word problems involving intervals and equal groupings.',
    prerequisiteSkills: ['FM.06', 'FM.07'],
    cognitiveFocus: 'application',
  },

  // ===== Ratio & Proportion module =====
  'RP.01': {
    skillId: 'RP.01',
    skillName: 'Concept of ratio',
    moduleId: 'ratio_proportion',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Ratio and Proportion chapter: ratio as a comparison of like quantities.',
    learningOutcome:
      'Writes a ratio as a comparison of two or three like quantities and expresses it in simplest form using HCF, including unit conversion.',
    competencyStatement:
      'Recognises a ratio as a comparison of like quantities and writes ratios in simplest form.',
    prerequisiteSkills: ['FR.03', 'FM.06'],
    cognitiveFocus: 'conceptual',
  },
  'RP.02': {
    skillId: 'RP.02',
    skillName: 'Equivalent ratios',
    moduleId: 'ratio_proportion',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Ratio and Proportion chapter: equivalent ratios.',
    learningOutcome:
      'Builds equivalent ratios by multiplying both terms by the same non-zero number and finds missing terms in equivalent ratios.',
    competencyStatement:
      'Generates equivalent ratios and finds the missing term given one of them.',
    prerequisiteSkills: ['RP.01'],
    cognitiveFocus: 'procedural',
  },
  'RP.03': {
    skillId: 'RP.03',
    skillName: 'Proportion',
    moduleId: 'ratio_proportion',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Ratio and Proportion chapter: proportion as equality of two ratios, cross-multiplication.',
    learningOutcome:
      'Tests whether four quantities are in proportion using cross-multiplication and finds a missing term in a proportion.',
    competencyStatement:
      'Verifies if four quantities are in proportion and finds a missing term using cross-multiplication.',
    prerequisiteSkills: ['RP.01', 'RP.02'],
    cognitiveFocus: 'procedural',
  },
  'RP.04': {
    skillId: 'RP.04',
    skillName: 'Unitary method',
    moduleId: 'ratio_proportion',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Ratio and Proportion chapter: unitary method for direct (and basic inverse) proportion.',
    learningOutcome:
      'Solves direct-proportion word problems using the unitary method (find the per-unit value, then multiply).',
    competencyStatement:
      'Applies the unitary method to direct-proportion situations involving cost / quantity / distance.',
    prerequisiteSkills: ['RP.03'],
    cognitiveFocus: 'procedural',
  },
  'RP.05': {
    skillId: 'RP.05',
    skillName: 'Ratio and proportion word problems',
    moduleId: 'ratio_proportion',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Ratio and Proportion chapter: applications, share-in-ratio.',
    learningOutcome:
      'Solves multi-step word problems involving ratio, equivalent ratios, proportion, and share-in-ratio.',
    competencyStatement:
      'Applies ratio and proportion concepts to multi-step real-life word problems including sharing in a ratio.',
    prerequisiteSkills: ['RP.03', 'RP.04'],
    cognitiveFocus: 'application',
  },

  // ===== Algebra Basics module =====
  'AL.01': {
    skillId: 'AL.01',
    skillName: 'Understanding variables',
    moduleId: 'algebra',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Algebra chapter: introduction to variables.',
    learningOutcome:
      'Uses a letter (e.g., x, y, n) to stand for an unknown number, and reads expressions like 3y as "three times some number".',
    competencyStatement:
      'Recognises a variable as a placeholder for a number and uses letters to represent unknowns in mathematical statements.',
    prerequisiteSkills: [],
    cognitiveFocus: 'conceptual',
  },
  'AL.02': {
    skillId: 'AL.02',
    skillName: 'Simple expressions',
    moduleId: 'algebra',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Algebra chapter: writing simple expressions in one variable.',
    learningOutcome:
      'Writes simple algebraic expressions in one variable from word descriptions, and identifies the coefficient, variable, and constant.',
    competencyStatement:
      'Writes and reads simple one-variable algebraic expressions and identifies their parts.',
    prerequisiteSkills: ['AL.01'],
    cognitiveFocus: 'procedural',
  },
  'AL.03': {
    skillId: 'AL.03',
    skillName: 'Evaluate expressions',
    moduleId: 'algebra',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Algebra chapter: substituting a value into an expression.',
    learningOutcome:
      'Evaluates a simple algebraic expression for a given value of the variable, including expressions with two variables and a single bracket.',
    competencyStatement:
      'Substitutes a given value for the variable in a simple algebraic expression and computes the value.',
    prerequisiteSkills: ['AL.01', 'AL.02'],
    cognitiveFocus: 'procedural',
  },
  'AL.04': {
    skillId: 'AL.04',
    skillName: 'One-step equations',
    moduleId: 'algebra',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Algebra chapter: solving simple one-step equations using inverse operations.',
    learningOutcome:
      'Solves one-step linear equations of the form x ± a = b or ax = b or x ÷ a = b using the inverse operation on both sides.',
    competencyStatement:
      'Solves one-step equations by performing the same inverse operation on both sides.',
    prerequisiteSkills: ['AL.02', 'AL.03'],
    cognitiveFocus: 'procedural',
  },
  'AL.05': {
    skillId: 'AL.05',
    skillName: 'Algebra word problems',
    moduleId: 'algebra',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Algebra chapter: turning a word statement into a simple equation.',
    learningOutcome:
      'Translates a simple word problem into a one-step (occasionally light two-step) equation, defines the variable explicitly, and solves it.',
    competencyStatement:
      'Translates a word problem into a one-step equation in one variable and solves it.',
    prerequisiteSkills: ['AL.03', 'AL.04'],
    cognitiveFocus: 'application',
  },

  // ===== Geometry Basics module (v0.16) =====
  'GB.01': {
    skillId: 'GB.01',
    skillName: 'Points, lines, line segments, rays',
    moduleId: 'geometry',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Basic Geometrical Ideas chapter: points, line segments, lines, rays, and basic notation.',
    learningOutcome:
      'Identifies and names a point, a line, a line segment, and a ray; uses correct notation (e.g., AB, ray AB, segment AB).',
    competencyStatement:
      'Distinguishes between a point, line, line segment, and ray and writes them with correct notation.',
    prerequisiteSkills: [],
    cognitiveFocus: 'conceptual',
  },
  'GB.02': {
    skillId: 'GB.02',
    skillName: 'Parallel and intersecting lines',
    moduleId: 'geometry',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Basic Geometrical Ideas chapter: pairs of lines (parallel, intersecting, perpendicular).',
    learningOutcome:
      'Classifies a pair of lines as parallel, intersecting, or perpendicular from a given diagram or description.',
    competencyStatement:
      'Recognises whether two given lines are parallel, intersecting, or perpendicular and explains the reasoning briefly.',
    prerequisiteSkills: ['GB.01'],
    cognitiveFocus: 'conceptual',
  },
  'GB.03': {
    skillId: 'GB.03',
    skillName: 'Types of angles',
    moduleId: 'geometry',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Understanding Elementary Shapes chapter: classifying angles by size (acute, right, obtuse, straight, reflex).',
    learningOutcome:
      'Classifies a given angle as acute, right, obtuse, straight, or reflex from its measure or from a picture.',
    competencyStatement:
      'Names the type of an angle (acute / right / obtuse / straight / reflex) given its measure or a sketch.',
    prerequisiteSkills: ['GB.01'],
    cognitiveFocus: 'conceptual',
  },
  'GB.04': {
    skillId: 'GB.04',
    skillName: 'Measuring and drawing angles',
    moduleId: 'geometry',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Understanding Elementary Shapes chapter: measuring and constructing angles using a protractor.',
    learningOutcome:
      'Measures a given angle to the nearest degree using a protractor and draws an angle of a given measure.',
    competencyStatement:
      'Reads the size of an angle from a protractor and draws an angle of a stated size, using inner / outer scales correctly.',
    prerequisiteSkills: ['GB.03'],
    cognitiveFocus: 'procedural',
  },
  'GB.05': {
    skillId: 'GB.05',
    skillName: 'Triangles: classify by sides and angles',
    moduleId: 'geometry',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Understanding Elementary Shapes chapter: classifying triangles by sides (scalene / isosceles / equilateral) and by angles (acute / right / obtuse).',
    learningOutcome:
      'Classifies a triangle by its side lengths (scalene, isosceles, equilateral) AND by its angle types (acute, right, obtuse).',
    competencyStatement:
      'Names the side-classification and the angle-classification of a given triangle, recognising that a triangle has both.',
    prerequisiteSkills: ['GB.01', 'GB.03'],
    cognitiveFocus: 'conceptual',
  },
  'GB.06': {
    skillId: 'GB.06',
    skillName: 'Quadrilaterals: basic properties',
    moduleId: 'geometry',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Understanding Elementary Shapes chapter: squares, rectangles, parallelograms, rhombuses, and trapeziums.',
    learningOutcome:
      'Identifies a square, rectangle, parallelogram, rhombus, or trapezium and lists basic properties (sides, parallelism, right angles).',
    competencyStatement:
      'Names common quadrilaterals and states which sides are equal, which are parallel, and whether the angles are right angles.',
    prerequisiteSkills: ['GB.01', 'GB.02', 'GB.03'],
    cognitiveFocus: 'conceptual',
  },
  'GB.07': {
    skillId: 'GB.07',
    skillName: 'Circles: centre, radius, diameter, chord, arc',
    moduleId: 'geometry',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Basic Geometrical Ideas chapter: parts of a circle (centre, radius, diameter, chord, arc).',
    learningOutcome:
      'Names the centre, a radius, a diameter, a chord, and an arc on a labelled circle, and uses the relationship diameter = 2 × radius.',
    competencyStatement:
      'Identifies the parts of a circle (centre, radius, diameter, chord, arc) and applies diameter = 2 × radius.',
    prerequisiteSkills: ['GB.01'],
    cognitiveFocus: 'conceptual',
  },
  'GB.08': {
    skillId: 'GB.08',
    skillName: 'Symmetry: lines of symmetry in plane figures',
    moduleId: 'geometry',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, Symmetry chapter: lines of symmetry of common plane figures (squares, rectangles, triangles, regular polygons, letters of the alphabet).',
    learningOutcome:
      'Identifies whether a given line is a line of symmetry of a plane figure, and counts the lines of symmetry of squares, rectangles, equilateral triangles, regular polygons, and a circle.',
    competencyStatement:
      'Determines lines of symmetry of common plane figures and recognises that a parallelogram (non-rectangle, non-rhombus) has none.',
    prerequisiteSkills: ['GB.05', 'GB.06'],
    cognitiveFocus: 'conceptual',
  },
  'GB.09': {
    skillId: 'GB.09',
    skillName: 'Coordinate basics: axes, origin, plotting points',
    moduleId: 'geometry',
    chapterReference:
      'NCERT / Ganita Prakash — Class 6, introduction to coordinates: the x-axis, the y-axis, the origin, ordered pairs (x, y), and plotting/reading points in the first quadrant.',
    learningOutcome:
      'Names the x-axis, y-axis, and origin; reads the coordinates of a marked point in the first quadrant; plots a point given its coordinates; and applies the convention that order matters in (x, y).',
    competencyStatement:
      'Reads and plots points (x, y) in the first quadrant of a Cartesian grid, and identifies the special cases of points on each axis.',
    prerequisiteSkills: ['GB.01'],
    cognitiveFocus: 'procedural',
  },
};

// ---------------------------------------------------------------------------
// Map an item's `cognitiveType` to the per-item CognitiveDemand.
// (cognitiveType uses the v0.3 author-friendly labels; CognitiveDemand
// uses the alignment vocabulary.)
// ---------------------------------------------------------------------------
const COGNITIVE_TYPE_MAP: Record<Item['cognitiveType'], CognitiveDemand> = {
  'Procedural fluency': 'procedural',
  'Conceptual understanding': 'conceptual',
  'Application / word problem': 'application',
  'Visual representation': 'conceptual',
};

// ---------------------------------------------------------------------------
// Per-item alignment overrides
// ---------------------------------------------------------------------------
// Most items inherit the skill's chapter and competency. We only override
// when an item is borderline (medium / needs review), or when a specific
// audit flag applies (parser limitation, cross-skill, two-step disguised
// as one-step, etc.).
//
// The principle: if you want to flag an item, list it here. Anything not
// listed is treated as 'high' confidence with no audit flags.

type ItemAlignmentOverride = {
  alignmentConfidence?: AlignmentConfidence;
  auditFlags?: AuditFlag[];
};

const ITEM_ALIGNMENT_OVERRIDES: Record<string, ItemAlignmentOverride> = {
  // ----- Fractions: the older v0.1 advanced 3-term word problems sit at
  //       the top of Class 6 scope; flag for teacher review.
  'FR.06-11': { alignmentConfidence: 'medium' }, // 3/5 + 1/4 + 1/10
  'FR.06-12': {
    alignmentConfidence: 'medium',
    auditFlags: ['wording_too_complex'],
  }, // 2 3/4 + 1 2/3 + 1/2 multi-line word problem
  'FR.06-24': { alignmentConfidence: 'medium' }, // 1/2 + 3/4 + 1/3 multi-step
  'FR.07-20': {
    alignmentConfidence: 'medium',
    auditFlags: ['needs_cbse_teacher_review'],
  }, // mixed-number subtraction with borrow + simplification

  // ----- Decimals: 0.125 ↔ 1/8 and 3/8 ↔ 0.375 are borderline for
  //       Class 6 (denominators are not powers of 10).
  'DE.02-09': {
    alignmentConfidence: 'medium',
    auditFlags: ['grade_level_mismatch'],
  }, // 0.125 → 1/8
  'DE.02-10': {
    alignmentConfidence: 'medium',
    auditFlags: ['grade_level_mismatch'],
  }, // 3/8 → 0.375

  // ----- Algebra: extra care because Class 6 algebra is light.
  'AL.02-08': {
    alignmentConfidence: 'medium',
    auditFlags: ['parser_limitation'],
  }, // "x divided by 4" — was numeric in v0.7; converted to MCQ in v0.9 because the numeric parser does not handle algebraic answers
  'AL.04-10': {
    alignmentConfidence: 'medium',
    auditFlags: ['cross_skill_contamination'],
  }, // 3x = 21, find x + 2 — combines AL.04 + AL.03
  'AL.05-08': { alignmentConfidence: 'medium' }, // 2x + 5 = 17 — light two-step
  'AL.05-10': {
    alignmentConfidence: 'needs_teacher_review',
    auditFlags: ['cross_skill_contamination', 'needs_cbse_teacher_review'],
  }, // x + (x + 5) = 35 — true two-step, may push beyond Class 6 syllabus

  // ----- Ratio: multi-term ratios (a:b:c) are borderline at Class 6.
  'RP.01-09': {
    alignmentConfidence: 'medium',
    auditFlags: ['grade_level_mismatch'],
  }, // 24 : 60 : 36 → 2 : 5 : 3
};

// ---------------------------------------------------------------------------
// Builder: get the alignment record for an item.
// ---------------------------------------------------------------------------
export const getItemAlignment = (item: Item): ItemAlignment => {
  const skill = SKILL_ALIGNMENT[item.skillId];
  const override = ITEM_ALIGNMENT_OVERRIDES[item.id] ?? {};
  // v0.34 — safe fallback for skills that don't have a hand-authored
  // alignment record yet (all v0.29+ starter grades). We surface the
  // skill name and mark alignment confidence as
  // `needs_teacher_review` so the item review view treats these items
  // as prototype content that a teacher still has to walk.
  if (!skill) {
    return {
      alignmentSkillId: item.skillId,
      chapterReference: `Prototype starter content · skill ${item.skillId} — teacher review required.`,
      competencyTag: item.skillName ?? `Skill ${item.skillId}`,
      cognitiveDemand: COGNITIVE_TYPE_MAP[item.cognitiveType],
      alignmentConfidence: override.alignmentConfidence ?? 'needs_teacher_review',
      auditFlags: override.auditFlags ?? [],
    };
  }
  return {
    alignmentSkillId: item.skillId,
    chapterReference: skill.chapterReference,
    competencyTag: skill.competencyStatement,
    cognitiveDemand: COGNITIVE_TYPE_MAP[item.cognitiveType],
    alignmentConfidence: override.alignmentConfidence ?? 'high',
    auditFlags: override.auditFlags ?? [],
  };
};

// Convenience: a snapshot of all per-item alignments for export / dashboard.
export const buildItemAlignments = (
  items: Item[] = ITEMS
): Record<string, ItemAlignment> => {
  const out: Record<string, ItemAlignment> = {};
  for (const it of items) {
    out[it.id] = getItemAlignment(it);
  }
  return out;
};

// Aggregate counts per skill for the Alignment Review dashboard.
export type SkillAlignmentSummary = {
  skillId: SkillId;
  itemCount: number;
  byConfidence: Record<AlignmentConfidence, number>;
  byCognitiveDemand: Record<CognitiveDemand, number>;
  byAuditFlag: Record<AuditFlag, number>;
};

export const buildSkillAlignmentSummary = (
  items: Item[] = ITEMS
): Record<SkillId, SkillAlignmentSummary> => {
  const out = {} as Record<SkillId, SkillAlignmentSummary>;
  // Initialise empty buckets for every skill.
  for (const skillId of Object.keys(SKILL_ALIGNMENT) as SkillId[]) {
    out[skillId] = {
      skillId,
      itemCount: 0,
      byConfidence: { high: 0, medium: 0, needs_teacher_review: 0 },
      byCognitiveDemand: {
        recall: 0,
        procedural: 0,
        conceptual: 0,
        application: 0,
        reasoning: 0,
      },
      byAuditFlag: {
        grade_level_mismatch: 0,
        wording_too_complex: 0,
        possible_ambiguity: 0,
        cross_skill_contamination: 0,
        needs_cbse_teacher_review: 0,
        parser_limitation: 0,
      },
    };
  }
  for (const it of items) {
    const a = getItemAlignment(it);
    // v0.34 — items whose skillId isn't in SKILL_ALIGNMENT (e.g. the
    // v0.29+ starter skills) don't have a pre-initialised bucket.
    // Create one on demand so aggregate views don't crash.
    if (!out[it.skillId]) {
      out[it.skillId] = {
        skillId: it.skillId,
        itemCount: 0,
        byConfidence: { high: 0, medium: 0, needs_teacher_review: 0 },
        byCognitiveDemand: {
          recall: 0,
          procedural: 0,
          conceptual: 0,
          application: 0,
          reasoning: 0,
        },
        byAuditFlag: {
          grade_level_mismatch: 0,
          wording_too_complex: 0,
          possible_ambiguity: 0,
          cross_skill_contamination: 0,
          needs_cbse_teacher_review: 0,
          parser_limitation: 0,
        },
      };
    }
    const bucket = out[it.skillId];
    bucket.itemCount += 1;
    bucket.byConfidence[a.alignmentConfidence] += 1;
    bucket.byCognitiveDemand[a.cognitiveDemand] += 1;
    for (const f of a.auditFlags) bucket.byAuditFlag[f] += 1;
  }
  return out;
};

// Module-level helper: aggregate skills for a given module.
export const skillsForModule = (m: ModuleId): SkillAlignment[] =>
  Object.values(SKILL_ALIGNMENT).filter(
    (s): s is SkillAlignment => Boolean(s) && s.moduleId === m
  );
