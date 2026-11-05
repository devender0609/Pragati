// v0.36 — "Full" Math coverage for the primary bundle (Classes 1–5).
//
// PROTOTYPE STARTER content. Not CBSE- or NCERT-verified, not reviewed
// by a subject-matter teacher, not calibrated. All modules and skills
// registered as `teacher_review_required`.
//
// Structure:
//   Each grade already has 2 modules × 3 skills × 4 items = 24 items
//   from v0.29 (module 1) and v0.31 (module 2). This file adds 4 more
//   modules per grade × 3 skills × 4 items = 48 items per grade × 5
//   grades = 240 new items, taking each primary grade to 6 modules ×
//   18 skills × 72 items (matching the module-count shape of the
//   Class 6/7 bank).
//
//   Full primary NCERT chapters covered here (per grade):
//     Class 1 — Numbers 21-99, +/- to 50 & skip-count, time, measurement
//     Class 2 — 3-digit numbers & arith, tables & ÷, fractions & length/weight,
//               capacity, pictographs, 3D shapes
//     Class 3 — Numbers to 10,000 & 4-digit arith, tables 6-9 & ÷,
//               fractions/time/money, weight/bar graphs/patterns
//     Class 4 — Long ×/÷, fractions & decimals, perimeter/area/symmetry,
//               time/money/data
//     Class 5 — Crore/HCF/LCM, decimal & fraction ops, percent/volume/angles,
//               data & mixed word problems

import type { Item } from './items';

function mcq(args: {
  id: string;
  skillId: Item['skillId'];
  skillName: string;
  difficulty: number;
  band: 'foundational' | 'core' | 'advanced';
  stem: string;
  correct: string;
  wrong: [string, string, string];
  solution: string;
  estimatedTimeSec?: number;
}): Item {
  return {
    id: args.id,
    skillId: args.skillId,
    skillName: args.skillName,
    difficulty: args.difficulty,
    band: args.band,
    cognitiveType: 'Procedural fluency',
    kind: 'mcq',
    stem: args.stem,
    options: [
      { text: args.correct, misconception: 'none' },
      { text: args.wrong[0], misconception: 'conceptual_gap' },
      { text: args.wrong[1], misconception: 'arithmetic_slip' },
      { text: args.wrong[2], misconception: 'operation_confusion' },
    ],
    correctIndex: 0,
    solution: args.solution,
    estimatedTimeSec: args.estimatedTimeSec ?? 40,
  } as Item;
}

// ===========================================================================
// CLASS 1 — Numbers 21–99, +/- to 50, time, measurement, data, 3D, money
// ===========================================================================

// Module: Numbers 21-99 & place value
const G1_M3: Item[] = [
  mcq({ id: 'G1.07-01', skillId: 'G1.07', skillName: 'Numbers 21 to 50', difficulty: 2, band: 'foundational',
    stem: 'What number comes after 39?', correct: '40', wrong: ['30', '41', '49'], solution: 'Counting: 39, 40, 41.' }),
  mcq({ id: 'G1.07-02', skillId: 'G1.07', skillName: 'Numbers 21 to 50', difficulty: 2, band: 'foundational',
    stem: 'Which is bigger: 27 or 32?', correct: '32', wrong: ['27', 'Same', 'Cannot tell'], solution: '32 is more than 27.' }),
  mcq({ id: 'G1.07-03', skillId: 'G1.07', skillName: 'Numbers 21 to 50', difficulty: 3, band: 'core',
    stem: 'Number before 25 is:', correct: '24', wrong: ['26', '20', '15'], solution: 'Backward count: 25 - 1 = 24.' }),
  mcq({ id: 'G1.07-04', skillId: 'G1.07', skillName: 'Numbers 21 to 50', difficulty: 4, band: 'advanced',
    stem: 'Write 43 in tens and ones:', correct: '4 tens 3 ones', wrong: ['3 tens 4 ones', '4 tens 4 ones', '43 tens'],
    solution: '43 = 40 + 3 = 4 tens and 3 ones.' }),

  mcq({ id: 'G1.08-01', skillId: 'G1.08', skillName: 'Numbers 51 to 99', difficulty: 2, band: 'foundational',
    stem: 'Number after 68 is:', correct: '69', wrong: ['67', '70', '78'], solution: 'Add 1: 68 + 1 = 69.' }),
  mcq({ id: 'G1.08-02', skillId: 'G1.08', skillName: 'Numbers 51 to 99', difficulty: 3, band: 'foundational',
    stem: 'What is 10 more than 55?', correct: '65', wrong: ['56', '45', '75'], solution: '55 + 10 = 65.' }),
  mcq({ id: 'G1.08-03', skillId: 'G1.08', skillName: 'Numbers 51 to 99', difficulty: 4, band: 'core',
    stem: 'Which is the smallest: 71, 17, 77, 91?', correct: '17', wrong: ['71', '77', '91'],
    solution: '17 has only 1 ten; the others have more.' }),
  mcq({ id: 'G1.08-04', skillId: 'G1.08', skillName: 'Numbers 51 to 99', difficulty: 5, band: 'advanced',
    stem: '9 tens 4 ones = ?', correct: '94', wrong: ['49', '904', '90'], solution: '9 × 10 + 4 = 94.' }),

  mcq({ id: 'G1.09-01', skillId: 'G1.09', skillName: 'Number names 20-50', difficulty: 3, band: 'foundational',
    stem: 'How do you write 25 in words?', correct: 'Twenty-five', wrong: ['Two-five', 'Fifty-two', 'Fifteen'],
    solution: '25 = twenty + five = twenty-five.' }),
  mcq({ id: 'G1.09-02', skillId: 'G1.09', skillName: 'Number names 20-50', difficulty: 3, band: 'foundational',
    stem: 'Which number is "thirty-eight"?', correct: '38', wrong: ['30', '83', '18'], solution: 'Thirty = 30, eight = 8, so 38.' }),
  mcq({ id: 'G1.09-03', skillId: 'G1.09', skillName: 'Number names 20-50', difficulty: 4, band: 'core',
    stem: 'Write 47 in words:', correct: 'Forty-seven', wrong: ['Fourteen-seven', 'Four-seven', 'Seventy-four'],
    solution: '40 = forty, 7 = seven → forty-seven.' }),
  mcq({ id: 'G1.09-04', skillId: 'G1.09', skillName: 'Number names 20-50', difficulty: 5, band: 'advanced',
    stem: 'Which is "fifty"?', correct: '50', wrong: ['15', '55', '5'], solution: 'Fifty = 5 tens = 50.' }),
];

// Module: Addition & subtraction up to 50
const G1_M4: Item[] = [
  mcq({ id: 'G1.10-01', skillId: 'G1.10', skillName: 'Addition up to 50', difficulty: 3, band: 'foundational',
    stem: '18 + 5 = ?', correct: '23', wrong: ['13', '20', '25'], solution: '18 + 5 = 23.' }),
  mcq({ id: 'G1.10-02', skillId: 'G1.10', skillName: 'Addition up to 50', difficulty: 4, band: 'foundational',
    stem: '25 + 10 = ?', correct: '35', wrong: ['15', '250', '26'], solution: '25 + 10 = 35 (add 1 to the tens place).' }),
  mcq({ id: 'G1.10-03', skillId: 'G1.10', skillName: 'Addition up to 50', difficulty: 5, band: 'core',
    stem: 'Riya has 22 marbles. She gets 18 more. Total?', correct: '40', wrong: ['30', '42', '400'],
    solution: '22 + 18 = 40.' }),
  mcq({ id: 'G1.10-04', skillId: 'G1.10', skillName: 'Addition up to 50', difficulty: 6, band: 'advanced',
    stem: 'Missing number: 27 + __ = 45', correct: '18', wrong: ['15', '20', '22'], solution: '45 - 27 = 18.' }),

  mcq({ id: 'G1.11-01', skillId: 'G1.11', skillName: 'Subtraction up to 50', difficulty: 3, band: 'foundational',
    stem: '30 - 8 = ?', correct: '22', wrong: ['28', '38', '32'], solution: '30 - 8 = 22.' }),
  mcq({ id: 'G1.11-02', skillId: 'G1.11', skillName: 'Subtraction up to 50', difficulty: 4, band: 'foundational',
    stem: '45 - 20 = ?', correct: '25', wrong: ['65', '15', '45'], solution: '45 - 20 = 25.' }),
  mcq({ id: 'G1.11-03', skillId: 'G1.11', skillName: 'Subtraction up to 50', difficulty: 5, band: 'core',
    stem: 'A bus has 40 seats. 12 people are sitting. How many seats are empty?', correct: '28', wrong: ['52', '32', '48'],
    solution: '40 - 12 = 28.' }),
  mcq({ id: 'G1.11-04', skillId: 'G1.11', skillName: 'Subtraction up to 50', difficulty: 6, band: 'advanced',
    stem: 'Fill in: 50 - __ = 26', correct: '24', wrong: ['26', '76', '20'], solution: '50 - 26 = 24.' }),

  mcq({ id: 'G1.12-01', skillId: 'G1.12', skillName: 'Skip counting by 2s, 5s, 10s', difficulty: 3, band: 'foundational',
    stem: 'Skip count by 2: 2, 4, 6, __', correct: '8', wrong: ['7', '10', '12'], solution: 'Add 2: 6 + 2 = 8.' }),
  mcq({ id: 'G1.12-02', skillId: 'G1.12', skillName: 'Skip counting by 2s, 5s, 10s', difficulty: 4, band: 'foundational',
    stem: 'Skip count by 5: 5, 10, 15, __', correct: '20', wrong: ['16', '25', '18'], solution: 'Add 5: 15 + 5 = 20.' }),
  mcq({ id: 'G1.12-03', skillId: 'G1.12', skillName: 'Skip counting by 2s, 5s, 10s', difficulty: 5, band: 'core',
    stem: 'Skip count by 10: 10, 20, 30, __, __', correct: '40, 50', wrong: ['31, 32', '35, 40', '40, 60'],
    solution: 'Add 10 each time: 30 + 10 = 40, 40 + 10 = 50.' }),
  mcq({ id: 'G1.12-04', skillId: 'G1.12', skillName: 'Skip counting by 2s, 5s, 10s', difficulty: 6, band: 'advanced',
    stem: 'How many groups of 5 make 25?', correct: '5', wrong: ['4', '10', '25'], solution: '5 + 5 + 5 + 5 + 5 = 25, so 5 groups.' }),
];

// Module: Time
const G1_M5: Item[] = [
  mcq({ id: 'G1.13-01', skillId: 'G1.13', skillName: 'Parts of the day', difficulty: 2, band: 'foundational',
    stem: 'We usually eat breakfast in the:', correct: 'Morning', wrong: ['Night', 'Evening', 'Afternoon'],
    solution: 'Breakfast is in the morning.' }),
  mcq({ id: 'G1.13-02', skillId: 'G1.13', skillName: 'Parts of the day', difficulty: 2, band: 'foundational',
    stem: 'The sun is highest at:', correct: 'Noon (afternoon)', wrong: ['Morning', 'Night', 'Sunset'],
    solution: 'Sun is directly overhead near noon.' }),
  mcq({ id: 'G1.13-03', skillId: 'G1.13', skillName: 'Parts of the day', difficulty: 3, band: 'core',
    stem: 'It is dark outside and stars are visible. It is:', correct: 'Night', wrong: ['Morning', 'Afternoon', 'Noon'],
    solution: 'Dark sky with stars = night.' }),
  mcq({ id: 'G1.13-04', skillId: 'G1.13', skillName: 'Parts of the day', difficulty: 4, band: 'advanced',
    stem: 'Which comes right after morning?', correct: 'Afternoon', wrong: ['Night', 'Sunrise', 'Yesterday'],
    solution: 'Order: morning → afternoon → evening → night.' }),

  mcq({ id: 'G1.14-01', skillId: 'G1.14', skillName: 'Days of the week', difficulty: 2, band: 'foundational',
    stem: 'How many days in a week?', correct: '7', wrong: ['5', '30', '12'], solution: 'A week = 7 days.' }),
  mcq({ id: 'G1.14-02', skillId: 'G1.14', skillName: 'Days of the week', difficulty: 3, band: 'foundational',
    stem: 'Day after Monday is:', correct: 'Tuesday', wrong: ['Sunday', 'Wednesday', 'Friday'],
    solution: 'Sequence: Sun, Mon, Tue, …' }),
  mcq({ id: 'G1.14-03', skillId: 'G1.14', skillName: 'Days of the week', difficulty: 4, band: 'core',
    stem: 'Which is a "weekend" day (in India, typically)?', correct: 'Sunday', wrong: ['Monday', 'Wednesday', 'Friday'],
    solution: 'Sunday is the common weekend day.' }),
  mcq({ id: 'G1.14-04', skillId: 'G1.14', skillName: 'Days of the week', difficulty: 5, band: 'advanced',
    stem: '3 days after Wednesday is:', correct: 'Saturday', wrong: ['Sunday', 'Monday', 'Friday'],
    solution: 'Wed → Thu → Fri → Sat.' }),

  mcq({ id: 'G1.15-01', skillId: 'G1.15', skillName: 'Months of the year', difficulty: 3, band: 'foundational',
    stem: 'How many months in a year?', correct: '12', wrong: ['7', '30', '10'], solution: 'A year = 12 months.' }),
  mcq({ id: 'G1.15-02', skillId: 'G1.15', skillName: 'Months of the year', difficulty: 3, band: 'foundational',
    stem: 'The first month of the year is:', correct: 'January', wrong: ['December', 'March', 'April'],
    solution: 'Calendar starts with January.' }),
  mcq({ id: 'G1.15-03', skillId: 'G1.15', skillName: 'Months of the year', difficulty: 4, band: 'core',
    stem: 'The month after August is:', correct: 'September', wrong: ['July', 'October', 'November'],
    solution: 'Aug → Sep in the calendar.' }),
  mcq({ id: 'G1.15-04', skillId: 'G1.15', skillName: 'Months of the year', difficulty: 5, band: 'advanced',
    stem: 'Which month has (usually) 28 or 29 days?', correct: 'February', wrong: ['January', 'March', 'April'],
    solution: 'February is the only month with fewer than 30 days.' }),
];

// Module: Measurement basics
const G1_M6: Item[] = [
  mcq({ id: 'G1.16-01', skillId: 'G1.16', skillName: 'Heavy and light', difficulty: 2, band: 'foundational',
    stem: 'Which is heavier: a feather or a brick?', correct: 'A brick', wrong: ['A feather', 'Both same', 'Cannot tell'],
    solution: 'A brick weighs much more than a feather.' }),
  mcq({ id: 'G1.16-02', skillId: 'G1.16', skillName: 'Heavy and light', difficulty: 3, band: 'foundational',
    stem: 'Which weighs LESS: a book or an elephant?', correct: 'A book', wrong: ['An elephant', 'Both same', 'Cannot tell'],
    solution: 'A book is much lighter than an elephant.' }),
  mcq({ id: 'G1.16-03', skillId: 'G1.16', skillName: 'Heavy and light', difficulty: 4, band: 'core',
    stem: 'To weigh things, we use a:', correct: 'Balance / weighing scale', wrong: ['Ruler', 'Clock', 'Cup'],
    solution: 'A balance or a scale is used to weigh.' }),
  mcq({ id: 'G1.16-04', skillId: 'G1.16', skillName: 'Heavy and light', difficulty: 5, band: 'advanced',
    stem: 'A pan balance shows the left side low and right side high. Which side is heavier?', correct: 'The left side', wrong: ['The right side', 'Both equal', 'Cannot tell'],
    solution: 'The heavier side goes down.' }),

  mcq({ id: 'G1.17-01', skillId: 'G1.17', skillName: 'Full and empty (capacity)', difficulty: 2, band: 'foundational',
    stem: 'A glass with no water is:', correct: 'Empty', wrong: ['Full', 'Half full', 'Heavy'],
    solution: 'No water inside = empty.' }),
  mcq({ id: 'G1.17-02', skillId: 'G1.17', skillName: 'Full and empty (capacity)', difficulty: 3, band: 'foundational',
    stem: 'Which holds MORE water: a bucket or a spoon?', correct: 'A bucket', wrong: ['A spoon', 'Both same', 'Cannot tell'],
    solution: 'A bucket holds much more than a spoon.' }),
  mcq({ id: 'G1.17-03', skillId: 'G1.17', skillName: 'Full and empty (capacity)', difficulty: 4, band: 'core',
    stem: 'Which is used to measure liquid at home?', correct: 'A measuring cup or jug', wrong: ['A ruler', 'A clock', 'A scale (for weight)'],
    solution: 'Measuring cups / jugs measure liquid amounts.' }),
  mcq({ id: 'G1.17-04', skillId: 'G1.17', skillName: 'Full and empty (capacity)', difficulty: 5, band: 'advanced',
    stem: 'A jug is half filled. If it takes 4 more cups to fill it, the total capacity is:', correct: '8 cups', wrong: ['4 cups', '2 cups', '16 cups'],
    solution: 'Half = 4 cups, so full = 8 cups.' }),

  mcq({ id: 'G1.18-01', skillId: 'G1.18', skillName: 'Non-standard length units', difficulty: 3, band: 'foundational',
    stem: 'Which is a "non-standard" unit for length?', correct: 'Handspan', wrong: ['Centimetre', 'Metre', 'Kilogram'],
    solution: 'Handspan, footstep, and pencil-length are non-standard.' }),
  mcq({ id: 'G1.18-02', skillId: 'G1.18', skillName: 'Non-standard length units', difficulty: 4, band: 'foundational',
    stem: 'Why do we prefer standard units like cm and m over handspans?', correct: 'Handspans vary between people', wrong: ['They look nicer', 'They are longer', 'They are shorter'],
    solution: 'Different people have different handspans, giving different measurements.' }),
  mcq({ id: 'G1.18-03', skillId: 'G1.18', skillName: 'Non-standard length units', difficulty: 5, band: 'core',
    stem: 'A pencil is 5 handspans long for Rina, and only 4 handspans for her father. Why?', correct: 'Her father has a bigger handspan', wrong: ['She measured wrong', 'The pencil changed size', 'They both have same handspan'],
    solution: 'Bigger handspan → fewer handspans needed for the same length.' }),
  mcq({ id: 'G1.18-04', skillId: 'G1.18', skillName: 'Non-standard length units', difficulty: 6, band: 'advanced',
    stem: 'Which non-standard unit fits a short pencil best?', correct: 'Paperclip', wrong: ['Footstep', 'Handspan', 'Kilometre'],
    solution: 'A pencil is short — small unit like a paperclip is best.' }),
];

const G1_ITEMS = [...G1_M3, ...G1_M4, ...G1_M5, ...G1_M6];

// ===========================================================================
// CLASS 2 — 3-digit numbers, +/-, tables, division intro, fractions,
//           measurement (m/g/L), data, 3D shapes
// ===========================================================================

const G2_M3: Item[] = [
  mcq({ id: 'G2.07-01', skillId: 'G2.07', skillName: 'Numbers up to 999', difficulty: 3, band: 'foundational',
    stem: 'Number after 199 is:', correct: '200', wrong: ['198', '210', '299'], solution: '199 + 1 = 200.' }),
  mcq({ id: 'G2.07-02', skillId: 'G2.07', skillName: 'Numbers up to 999', difficulty: 4, band: 'foundational',
    stem: '5 hundreds 3 tens 6 ones = ?', correct: '536', wrong: ['635', '5306', '563'], solution: '500 + 30 + 6 = 536.' }),
  mcq({ id: 'G2.07-03', skillId: 'G2.07', skillName: 'Numbers up to 999', difficulty: 5, band: 'core',
    stem: 'Number just before 400 is:', correct: '399', wrong: ['401', '390', '300'], solution: '400 - 1 = 399.' }),
  mcq({ id: 'G2.07-04', skillId: 'G2.07', skillName: 'Numbers up to 999', difficulty: 6, band: 'advanced',
    stem: 'Which is largest: 587, 785, 578, 758?', correct: '785', wrong: ['587', '578', '758'],
    solution: 'Compare hundreds first — 7 > 5, then 8 > 5.' }),

  mcq({ id: 'G2.08-01', skillId: 'G2.08', skillName: '3-digit addition (no regrouping)', difficulty: 3, band: 'foundational',
    stem: '123 + 245 = ?', correct: '368', wrong: ['358', '378', '122'], solution: 'Add ones: 3+5=8, tens: 2+4=6, hundreds: 1+2=3.' }),
  mcq({ id: 'G2.08-02', skillId: 'G2.08', skillName: '3-digit addition (no regrouping)', difficulty: 4, band: 'foundational',
    stem: '312 + 456 = ?', correct: '768', wrong: ['678', '758', '768.5'], solution: '3+4=7 (H), 1+5=6 (T), 2+6=8 (O).' }),
  mcq({ id: 'G2.08-03', skillId: 'G2.08', skillName: '3-digit addition (no regrouping)', difficulty: 5, band: 'core',
    stem: 'A shop sold 234 pencils on Monday and 152 on Tuesday. Total?', correct: '386', wrong: ['376', '396', '286'],
    solution: '234 + 152 = 386.' }),
  mcq({ id: 'G2.08-04', skillId: 'G2.08', skillName: '3-digit addition (no regrouping)', difficulty: 6, band: 'advanced',
    stem: '401 + 205 = ?', correct: '606', wrong: ['606.5', '506', '706'], solution: '4+2=6, 0+0=0, 1+5=6.' }),

  mcq({ id: 'G2.09-01', skillId: 'G2.09', skillName: '3-digit subtraction (no regrouping)', difficulty: 3, band: 'foundational',
    stem: '456 - 123 = ?', correct: '333', wrong: ['323', '343', '223'], solution: 'Ones: 6-3=3, tens: 5-2=3, hundreds: 4-1=3.' }),
  mcq({ id: 'G2.09-02', skillId: 'G2.09', skillName: '3-digit subtraction (no regrouping)', difficulty: 4, band: 'foundational',
    stem: '789 - 245 = ?', correct: '544', wrong: ['534', '454', '444'], solution: '7-2=5, 8-4=4, 9-5=4.' }),
  mcq({ id: 'G2.09-03', skillId: 'G2.09', skillName: '3-digit subtraction (no regrouping)', difficulty: 5, band: 'core',
    stem: '698 - 356 = ?', correct: '342', wrong: ['332', '352', '442'], solution: '6-3=3 (H), 9-5=4 (T), 8-6=2 (O).' }),
  mcq({ id: 'G2.09-04', skillId: 'G2.09', skillName: '3-digit subtraction (no regrouping)', difficulty: 6, band: 'advanced',
    stem: 'A book has 500 pages. Riya has read 250. How many pages are left?', correct: '250', wrong: ['750', '150', '350'],
    solution: '500 - 250 = 250.' }),
];

const G2_M4: Item[] = [
  mcq({ id: 'G2.10-01', skillId: 'G2.10', skillName: 'Multiplication tables 4 and 5', difficulty: 3, band: 'foundational',
    stem: '4 × 3 = ?', correct: '12', wrong: ['7', '15', '9'], solution: 'Table of 4: 4, 8, 12.' }),
  mcq({ id: 'G2.10-02', skillId: 'G2.10', skillName: 'Multiplication tables 4 and 5', difficulty: 3, band: 'foundational',
    stem: '5 × 6 = ?', correct: '30', wrong: ['11', '25', '35'], solution: 'Table of 5: 5, 10, 15, 20, 25, 30.' }),
  mcq({ id: 'G2.10-03', skillId: 'G2.10', skillName: 'Multiplication tables 4 and 5', difficulty: 4, band: 'core',
    stem: '4 × 9 = ?', correct: '36', wrong: ['32', '40', '13'], solution: 'Table of 4 up to 9: 36.' }),
  mcq({ id: 'G2.10-04', skillId: 'G2.10', skillName: 'Multiplication tables 4 and 5', difficulty: 5, band: 'advanced',
    stem: '5 packets have 4 sweets each. Total sweets?', correct: '20', wrong: ['9', '25', '15'], solution: '5 × 4 = 20.' }),

  mcq({ id: 'G2.11-01', skillId: 'G2.11', skillName: 'Table of 10', difficulty: 2, band: 'foundational',
    stem: '10 × 3 = ?', correct: '30', wrong: ['13', '3', '20'], solution: 'Add a zero: 3 → 30.' }),
  mcq({ id: 'G2.11-02', skillId: 'G2.11', skillName: 'Table of 10', difficulty: 3, band: 'foundational',
    stem: '10 × 7 = ?', correct: '70', wrong: ['17', '77', '107'], solution: '7 × 10 = 70.' }),
  mcq({ id: 'G2.11-03', skillId: 'G2.11', skillName: 'Table of 10', difficulty: 4, band: 'core',
    stem: '10 × __ = 60', correct: '6', wrong: ['16', '60', '10'], solution: '60 ÷ 10 = 6.' }),
  mcq({ id: 'G2.11-04', skillId: 'G2.11', skillName: 'Table of 10', difficulty: 5, band: 'advanced',
    stem: '10 pens in a box. How many pens in 8 boxes?', correct: '80', wrong: ['18', '88', '108'], solution: '10 × 8 = 80.' }),

  mcq({ id: 'G2.12-01', skillId: 'G2.12', skillName: 'Division as equal sharing', difficulty: 3, band: 'foundational',
    stem: 'Share 12 sweets equally among 4 children. Each gets:', correct: '3', wrong: ['4', '8', '12'],
    solution: '12 ÷ 4 = 3.' }),
  mcq({ id: 'G2.12-02', skillId: 'G2.12', skillName: 'Division as equal sharing', difficulty: 4, band: 'foundational',
    stem: '20 apples in 5 boxes equally. Each box has:', correct: '4', wrong: ['5', '15', '25'], solution: '20 ÷ 5 = 4.' }),
  mcq({ id: 'G2.12-03', skillId: 'G2.12', skillName: 'Division as equal sharing', difficulty: 5, band: 'core',
    stem: '15 pencils shared among 3 friends. Each gets:', correct: '5', wrong: ['3', '12', '18'], solution: '15 ÷ 3 = 5.' }),
  mcq({ id: 'G2.12-04', skillId: 'G2.12', skillName: 'Division as equal sharing', difficulty: 6, band: 'advanced',
    stem: 'How many groups of 2 make 14?', correct: '7', wrong: ['12', '16', '2'], solution: '14 ÷ 2 = 7.' }),
];

const G2_M5: Item[] = [
  mcq({ id: 'G2.13-01', skillId: 'G2.13', skillName: 'Half and quarter (fractions intro)', difficulty: 3, band: 'foundational',
    stem: 'Half of 8 is:', correct: '4', wrong: ['2', '6', '8'], solution: '8 ÷ 2 = 4.' }),
  mcq({ id: 'G2.13-02', skillId: 'G2.13', skillName: 'Half and quarter (fractions intro)', difficulty: 4, band: 'foundational',
    stem: 'Quarter (1/4) of 12 is:', correct: '3', wrong: ['4', '6', '12'], solution: '12 ÷ 4 = 3.' }),
  mcq({ id: 'G2.13-03', skillId: 'G2.13', skillName: 'Half and quarter (fractions intro)', difficulty: 5, band: 'core',
    stem: '1/2 = ?', correct: 'One out of two equal parts', wrong: ['Two out of one part', 'Two halves make a quarter', 'Same as 1/4'],
    solution: '1/2 = 1 part out of 2 equal parts.' }),
  mcq({ id: 'G2.13-04', skillId: 'G2.13', skillName: 'Half and quarter (fractions intro)', difficulty: 6, band: 'advanced',
    stem: 'A chocolate bar is broken into 4 equal parts. Riya eats 2. She ate:', correct: 'Half', wrong: ['Quarter', 'All', 'None'],
    solution: '2/4 = 1/2 = half.' }),

  mcq({ id: 'G2.14-01', skillId: 'G2.14', skillName: 'Length in cm and m', difficulty: 3, band: 'foundational',
    stem: '1 metre = ? centimetres', correct: '100', wrong: ['10', '1000', '1'], solution: '1 m = 100 cm.' }),
  mcq({ id: 'G2.14-02', skillId: 'G2.14', skillName: 'Length in cm and m', difficulty: 4, band: 'foundational',
    stem: 'Which is longer: 90 cm or 1 metre?', correct: '1 metre', wrong: ['90 cm', 'Same', 'Cannot compare'],
    solution: '1 m = 100 cm > 90 cm.' }),
  mcq({ id: 'G2.14-03', skillId: 'G2.14', skillName: 'Length in cm and m', difficulty: 5, band: 'core',
    stem: 'A ribbon is 250 cm long. In metres?', correct: '2 m 50 cm', wrong: ['25 m', '250 m', '2.5 cm'],
    solution: '250 cm = 200 cm + 50 cm = 2 m 50 cm.' }),
  mcq({ id: 'G2.14-04', skillId: 'G2.14', skillName: 'Length in cm and m', difficulty: 6, band: 'advanced',
    stem: 'Which is best for measuring a classroom wall?', correct: 'Metres', wrong: ['Centimetres', 'Kilometres', 'Millimetres'],
    solution: 'A room is a few metres long — metres is convenient.' }),

  mcq({ id: 'G2.15-01', skillId: 'G2.15', skillName: 'Weight in g and kg', difficulty: 3, band: 'foundational',
    stem: '1 kg = ? g', correct: '1000', wrong: ['10', '100', '1'], solution: '1 kg = 1000 g.' }),
  mcq({ id: 'G2.15-02', skillId: 'G2.15', skillName: 'Weight in g and kg', difficulty: 4, band: 'foundational',
    stem: 'Which weighs more: 500 g or 1 kg?', correct: '1 kg', wrong: ['500 g', 'Same', 'Cannot tell'],
    solution: '1 kg = 1000 g > 500 g.' }),
  mcq({ id: 'G2.15-03', skillId: 'G2.15', skillName: 'Weight in g and kg', difficulty: 5, band: 'core',
    stem: 'A packet weighs 2500 g. In kg?', correct: '2 kg 500 g', wrong: ['25 kg', '250 kg', '0.25 kg'],
    solution: '2500 g = 2 kg + 500 g.' }),
  mcq({ id: 'G2.15-04', skillId: 'G2.15', skillName: 'Weight in g and kg', difficulty: 6, band: 'advanced',
    stem: 'Which best measures the weight of a small biscuit?', correct: 'Grams', wrong: ['Kilograms', 'Metres', 'Litres'],
    solution: 'Biscuit is very light — grams is the right unit.' }),
];

const G2_M6: Item[] = [
  mcq({ id: 'G2.16-01', skillId: 'G2.16', skillName: 'Capacity in mL and L', difficulty: 3, band: 'foundational',
    stem: '1 litre = ? mL', correct: '1000', wrong: ['10', '100', '1'], solution: '1 L = 1000 mL.' }),
  mcq({ id: 'G2.16-02', skillId: 'G2.16', skillName: 'Capacity in mL and L', difficulty: 4, band: 'foundational',
    stem: 'Which holds more: 500 mL or 1 L?', correct: '1 L', wrong: ['500 mL', 'Same', 'Cannot tell'],
    solution: '1 L = 1000 mL > 500 mL.' }),
  mcq({ id: 'G2.16-03', skillId: 'G2.16', skillName: 'Capacity in mL and L', difficulty: 5, band: 'core',
    stem: 'A bottle has 2000 mL. In L?', correct: '2 L', wrong: ['20 L', '0.2 L', '200 L'],
    solution: '2000 mL = 2 L.' }),
  mcq({ id: 'G2.16-04', skillId: 'G2.16', skillName: 'Capacity in mL and L', difficulty: 6, band: 'advanced',
    stem: 'For a cough syrup dose, best unit is:', correct: 'Millilitres', wrong: ['Litres', 'Kilograms', 'Metres'],
    solution: 'Small liquid amount — mL is convenient.' }),

  mcq({ id: 'G2.17-01', skillId: 'G2.17', skillName: 'Pictographs (basic)', difficulty: 3, band: 'foundational',
    stem: 'A pictograph uses:', correct: 'Pictures to show data', wrong: ['Numbers only', 'Bars only', 'Only words'],
    solution: 'Pictograph = picture representation of counts.' }),
  mcq({ id: 'G2.17-02', skillId: 'G2.17', skillName: 'Pictographs (basic)', difficulty: 4, band: 'foundational',
    stem: 'If one apple picture = 2 apples, then 4 apple pictures represent:', correct: '8', wrong: ['4', '6', '2'],
    solution: '4 × 2 = 8.' }),
  mcq({ id: 'G2.17-03', skillId: 'G2.17', skillName: 'Pictographs (basic)', difficulty: 5, band: 'core',
    stem: 'If ★ = 5 books, then how many stars for 20 books?', correct: '4', wrong: ['20', '5', '10'],
    solution: '20 ÷ 5 = 4 stars.' }),
  mcq({ id: 'G2.17-04', skillId: 'G2.17', skillName: 'Pictographs (basic)', difficulty: 6, band: 'advanced',
    stem: 'Advantage of a pictograph over a written count is:', correct: 'Easier to see and compare at a glance', wrong: ['Uses less paper', 'Faster to draw', 'More accurate'],
    solution: 'Pictures make comparison easy visually.' }),

  mcq({ id: 'G2.18-01', skillId: 'G2.18', skillName: '3D shapes basic', difficulty: 3, band: 'foundational',
    stem: 'A dice is shaped like a:', correct: 'Cube', wrong: ['Sphere', 'Cylinder', 'Cone'], solution: 'Dice = 6 equal square faces = cube.' }),
  mcq({ id: 'G2.18-02', skillId: 'G2.18', skillName: '3D shapes basic', difficulty: 3, band: 'foundational',
    stem: 'A ball is shaped like a:', correct: 'Sphere', wrong: ['Cube', 'Cylinder', 'Cone'], solution: 'A ball is a sphere.' }),
  mcq({ id: 'G2.18-03', skillId: 'G2.18', skillName: '3D shapes basic', difficulty: 4, band: 'core',
    stem: 'An ice-cream cone is a:', correct: 'Cone', wrong: ['Cylinder', 'Sphere', 'Cube'], solution: 'A pointy circular base solid = cone.' }),
  mcq({ id: 'G2.18-04', skillId: 'G2.18', skillName: '3D shapes basic', difficulty: 5, band: 'advanced',
    stem: 'A drum with two circular ends is a:', correct: 'Cylinder', wrong: ['Cone', 'Sphere', 'Cube'], solution: 'Two circular ends + curved side = cylinder.' }),
];

const G2_ITEMS = [...G2_M3, ...G2_M4, ...G2_M5, ...G2_M6];

// ===========================================================================
// CLASS 3 — Numbers to 10000, 4-digit +/-, tables 6-10, fractions, time,
//           weight, data bar graphs, patterns
// ===========================================================================

const G3_M3: Item[] = [
  mcq({ id: 'G3.07-01', skillId: 'G3.07', skillName: 'Numbers up to 10000', difficulty: 3, band: 'foundational',
    stem: 'Successor of 999 is:', correct: '1000', wrong: ['998', '1001', '9999'], solution: '999 + 1 = 1000.' }),
  mcq({ id: 'G3.07-02', skillId: 'G3.07', skillName: 'Numbers up to 10000', difficulty: 4, band: 'foundational',
    stem: '4 thousands 5 hundreds 6 tens 2 ones = ?', correct: '4562', wrong: ['4526', '45,62', '2654'],
    solution: '4000 + 500 + 60 + 2 = 4562.' }),
  mcq({ id: 'G3.07-03', skillId: 'G3.07', skillName: 'Numbers up to 10000', difficulty: 5, band: 'core',
    stem: 'Which is largest: 7809, 7908, 7089, 8079?', correct: '8079', wrong: ['7809', '7908', '7089'],
    solution: 'Compare thousands: 8 > 7.' }),
  mcq({ id: 'G3.07-04', skillId: 'G3.07', skillName: 'Numbers up to 10000', difficulty: 6, band: 'advanced',
    stem: 'Predecessor of 5000 is:', correct: '4999', wrong: ['5001', '4990', '4900'], solution: '5000 - 1 = 4999.' }),

  mcq({ id: 'G3.08-01', skillId: 'G3.08', skillName: '4-digit addition', difficulty: 4, band: 'foundational',
    stem: '1234 + 2345 = ?', correct: '3579', wrong: ['3679', '4579', '3489'], solution: '1234 + 2345 = 3579.' }),
  mcq({ id: 'G3.08-02', skillId: 'G3.08', skillName: '4-digit addition', difficulty: 5, band: 'foundational',
    stem: '3456 + 1234 = ?', correct: '4690', wrong: ['4680', '4790', '4590'], solution: '3456 + 1234 = 4690.' }),
  mcq({ id: 'G3.08-03', skillId: 'G3.08', skillName: '4-digit addition', difficulty: 6, band: 'core',
    stem: 'A school library has 4560 books. It buys 1240 more. Total:', correct: '5800', wrong: ['5700', '5900', '4600'],
    solution: '4560 + 1240 = 5800.' }),
  mcq({ id: 'G3.08-04', skillId: 'G3.08', skillName: '4-digit addition', difficulty: 7, band: 'advanced',
    stem: '1999 + 1001 = ?', correct: '3000', wrong: ['3010', '2999', '2001'], solution: '1999 + 1001 = 3000.' }),

  mcq({ id: 'G3.09-01', skillId: 'G3.09', skillName: '4-digit subtraction', difficulty: 4, band: 'foundational',
    stem: '5678 - 2345 = ?', correct: '3333', wrong: ['3233', '3433', '3423'], solution: '5678 - 2345 = 3333.' }),
  mcq({ id: 'G3.09-02', skillId: 'G3.09', skillName: '4-digit subtraction', difficulty: 5, band: 'foundational',
    stem: '9876 - 1234 = ?', correct: '8642', wrong: ['8532', '8742', '7642'], solution: '9876 - 1234 = 8642.' }),
  mcq({ id: 'G3.09-03', skillId: 'G3.09', skillName: '4-digit subtraction', difficulty: 6, band: 'core',
    stem: 'A hall seats 5000 people. 2350 seats are taken. Empty seats?', correct: '2650', wrong: ['2350', '7350', '2500'],
    solution: '5000 - 2350 = 2650.' }),
  mcq({ id: 'G3.09-04', skillId: 'G3.09', skillName: '4-digit subtraction', difficulty: 7, band: 'advanced',
    stem: '10000 - 5678 = ?', correct: '4322', wrong: ['4232', '4432', '5678'], solution: '10000 - 5678 = 4322.' }),
];

const G3_M4: Item[] = [
  mcq({ id: 'G3.10-01', skillId: 'G3.10', skillName: 'Multiplication tables 6 and 7', difficulty: 3, band: 'foundational',
    stem: '6 × 4 = ?', correct: '24', wrong: ['20', '18', '30'], solution: '6+6+6+6 = 24.' }),
  mcq({ id: 'G3.10-02', skillId: 'G3.10', skillName: 'Multiplication tables 6 and 7', difficulty: 4, band: 'foundational',
    stem: '7 × 5 = ?', correct: '35', wrong: ['30', '40', '12'], solution: 'Table of 7 up to 5 = 35.' }),
  mcq({ id: 'G3.10-03', skillId: 'G3.10', skillName: 'Multiplication tables 6 and 7', difficulty: 5, band: 'core',
    stem: '6 × 9 = ?', correct: '54', wrong: ['52', '56', '45'], solution: '6 × 9 = 54.' }),
  mcq({ id: 'G3.10-04', skillId: 'G3.10', skillName: 'Multiplication tables 6 and 7', difficulty: 6, band: 'advanced',
    stem: '7 boxes have 6 laddoos each. Total:', correct: '42', wrong: ['13', '48', '36'], solution: '7 × 6 = 42.' }),

  mcq({ id: 'G3.11-01', skillId: 'G3.11', skillName: 'Multiplication tables 8 and 9', difficulty: 3, band: 'foundational',
    stem: '8 × 3 = ?', correct: '24', wrong: ['11', '18', '32'], solution: 'Table of 8 up to 3 = 24.' }),
  mcq({ id: 'G3.11-02', skillId: 'G3.11', skillName: 'Multiplication tables 8 and 9', difficulty: 4, band: 'foundational',
    stem: '9 × 6 = ?', correct: '54', wrong: ['45', '63', '15'], solution: 'Table of 9 up to 6 = 54.' }),
  mcq({ id: 'G3.11-03', skillId: 'G3.11', skillName: 'Multiplication tables 8 and 9', difficulty: 5, band: 'core',
    stem: '8 × 7 = ?', correct: '56', wrong: ['54', '58', '15'], solution: 'Table of 8 up to 7 = 56.' }),
  mcq({ id: 'G3.11-04', skillId: 'G3.11', skillName: 'Multiplication tables 8 and 9', difficulty: 6, band: 'advanced',
    stem: '9 × 9 = ?', correct: '81', wrong: ['18', '72', '99'], solution: '9² = 81.' }),

  mcq({ id: 'G3.12-01', skillId: 'G3.12', skillName: 'Division with tables', difficulty: 4, band: 'foundational',
    stem: '36 ÷ 6 = ?', correct: '6', wrong: ['5', '7', '30'], solution: '6 × 6 = 36.' }),
  mcq({ id: 'G3.12-02', skillId: 'G3.12', skillName: 'Division with tables', difficulty: 4, band: 'foundational',
    stem: '48 ÷ 8 = ?', correct: '6', wrong: ['5', '7', '4'], solution: '8 × 6 = 48.' }),
  mcq({ id: 'G3.12-03', skillId: 'G3.12', skillName: 'Division with tables', difficulty: 5, band: 'core',
    stem: '63 ÷ 9 = ?', correct: '7', wrong: ['6', '8', '9'], solution: '9 × 7 = 63.' }),
  mcq({ id: 'G3.12-04', skillId: 'G3.12', skillName: 'Division with tables', difficulty: 6, band: 'advanced',
    stem: '56 sweets shared equally among 7 friends. Each gets:', correct: '8', wrong: ['7', '9', '6'], solution: '56 ÷ 7 = 8.' }),
];

const G3_M5: Item[] = [
  mcq({ id: 'G3.13-01', skillId: 'G3.13', skillName: 'Fractions on number line', difficulty: 4, band: 'foundational',
    stem: 'On a 0 to 1 number line, 1/2 lies at:', correct: 'The midpoint', wrong: ['At 1', 'At 0', 'Beyond 1'],
    solution: '1/2 is halfway between 0 and 1.' }),
  mcq({ id: 'G3.13-02', skillId: 'G3.13', skillName: 'Fractions on number line', difficulty: 5, band: 'foundational',
    stem: 'Between 0 and 1, 1/4 lies:', correct: 'Closer to 0 than 1/2', wrong: ['At 1', 'Same as 1/2', 'Closer to 1'],
    solution: '1/4 = 0.25, before 1/2 = 0.5.' }),
  mcq({ id: 'G3.13-03', skillId: 'G3.13', skillName: 'Fractions on number line', difficulty: 6, band: 'core',
    stem: 'Which fraction is bigger: 3/4 or 1/4?', correct: '3/4', wrong: ['1/4', 'Same', 'Cannot tell'],
    solution: '3 out of 4 > 1 out of 4.' }),
  mcq({ id: 'G3.13-04', skillId: 'G3.13', skillName: 'Fractions on number line', difficulty: 7, band: 'advanced',
    stem: '2/4 = ?', correct: '1/2', wrong: ['1/4', '2', '4'], solution: '2/4 simplifies to 1/2.' }),

  mcq({ id: 'G3.14-01', skillId: 'G3.14', skillName: 'Time: hours and minutes', difficulty: 3, band: 'foundational',
    stem: '1 hour = ? minutes', correct: '60', wrong: ['30', '100', '24'], solution: '1 hour = 60 min.' }),
  mcq({ id: 'G3.14-02', skillId: 'G3.14', skillName: 'Time: hours and minutes', difficulty: 4, band: 'foundational',
    stem: '2 hours = ? minutes', correct: '120', wrong: ['200', '60', '90'], solution: '2 × 60 = 120.' }),
  mcq({ id: 'G3.14-03', skillId: 'G3.14', skillName: 'Time: hours and minutes', difficulty: 5, band: 'core',
    stem: 'Half an hour = ? minutes', correct: '30', wrong: ['15', '60', '90'], solution: 'Half of 60 = 30.' }),
  mcq({ id: 'G3.14-04', skillId: 'G3.14', skillName: 'Time: hours and minutes', difficulty: 6, band: 'advanced',
    stem: 'A movie starts at 4:00 and ends at 6:30. Duration is:', correct: '2 hours 30 minutes', wrong: ['2 hours', '3 hours', '1 hour 30 min'],
    solution: '4:00 → 6:00 is 2 hrs; +30 min = 2 hrs 30 min.' }),

  mcq({ id: 'G3.15-01', skillId: 'G3.15', skillName: 'Money: rupees and paise (advanced)', difficulty: 4, band: 'foundational',
    stem: '₹1 = ? paise', correct: '100', wrong: ['10', '1000', '50'], solution: '1 rupee = 100 paise.' }),
  mcq({ id: 'G3.15-02', skillId: 'G3.15', skillName: 'Money: rupees and paise (advanced)', difficulty: 5, band: 'foundational',
    stem: 'A pencil costs ₹5 and eraser ₹3. Total?', correct: '₹8', wrong: ['₹5', '₹2', '₹15'], solution: '5 + 3 = 8.' }),
  mcq({ id: 'G3.15-03', skillId: 'G3.15', skillName: 'Money: rupees and paise (advanced)', difficulty: 6, band: 'core',
    stem: 'Riya pays ₹50 for goods worth ₹35. Change?', correct: '₹15', wrong: ['₹5', '₹85', '₹25'], solution: '50 - 35 = 15.' }),
  mcq({ id: 'G3.15-04', skillId: 'G3.15', skillName: 'Money: rupees and paise (advanced)', difficulty: 7, band: 'advanced',
    stem: '5 chocolates cost ₹40. One chocolate costs:', correct: '₹8', wrong: ['₹5', '₹4', '₹200'], solution: '40 ÷ 5 = 8.' }),
];

const G3_M6: Item[] = [
  mcq({ id: 'G3.16-01', skillId: 'G3.16', skillName: 'Weight: grams and kilograms', difficulty: 3, band: 'foundational',
    stem: '1 kg = ? g', correct: '1000', wrong: ['10', '100', '10000'], solution: '1 kg = 1000 g.' }),
  mcq({ id: 'G3.16-02', skillId: 'G3.16', skillName: 'Weight: grams and kilograms', difficulty: 4, band: 'foundational',
    stem: '2 kg 500 g in grams:', correct: '2500', wrong: ['250', '25000', '2050'], solution: '2000 + 500 = 2500 g.' }),
  mcq({ id: 'G3.16-03', skillId: 'G3.16', skillName: 'Weight: grams and kilograms', difficulty: 5, band: 'core',
    stem: '3500 g in kg:', correct: '3 kg 500 g', wrong: ['35 kg', '350 kg', '0.35 kg'], solution: '3500 = 3 kg + 500 g.' }),
  mcq({ id: 'G3.16-04', skillId: 'G3.16', skillName: 'Weight: grams and kilograms', difficulty: 6, band: 'advanced',
    stem: 'Adding 750 g + 250 g gives:', correct: '1 kg', wrong: ['750 g', '500 g', '5 kg'], solution: '1000 g = 1 kg.' }),

  mcq({ id: 'G3.17-01', skillId: 'G3.17', skillName: 'Bar graphs (basic)', difficulty: 4, band: 'foundational',
    stem: 'A bar graph uses:', correct: 'Rectangular bars whose heights show data values', wrong: ['Only pictures', 'A single line', 'Just numbers'],
    solution: 'Bar chart = bars proportional to values.' }),
  mcq({ id: 'G3.17-02', skillId: 'G3.17', skillName: 'Bar graphs (basic)', difficulty: 5, band: 'foundational',
    stem: 'On a bar graph, the tallest bar means:', correct: 'The largest value', wrong: ['The smallest value', 'The average', 'Nothing'],
    solution: 'Height = value.' }),
  mcq({ id: 'G3.17-03', skillId: 'G3.17', skillName: 'Bar graphs (basic)', difficulty: 6, band: 'core',
    stem: 'Two bars for Class 3A (25 students) and 3B (30 students). Which bar is taller?', correct: '3B', wrong: ['3A', 'Same', 'Cannot tell'],
    solution: '30 > 25 so 3B has the taller bar.' }),
  mcq({ id: 'G3.17-04', skillId: 'G3.17', skillName: 'Bar graphs (basic)', difficulty: 7, band: 'advanced',
    stem: 'What is drawn on the vertical axis of a simple bar graph?', correct: 'The scale for the counts', wrong: ['The category names', 'Nothing', 'A separate chart'],
    solution: 'Categories go on horizontal, counts on vertical.' }),

  mcq({ id: 'G3.18-01', skillId: 'G3.18', skillName: 'Number patterns', difficulty: 3, band: 'foundational',
    stem: 'Next in the pattern 2, 4, 6, 8, __:', correct: '10', wrong: ['12', '9', '16'], solution: 'Add 2 each time.' }),
  mcq({ id: 'G3.18-02', skillId: 'G3.18', skillName: 'Number patterns', difficulty: 4, band: 'foundational',
    stem: 'Next in 5, 10, 15, __:', correct: '20', wrong: ['16', '25', '30'], solution: 'Add 5 each time.' }),
  mcq({ id: 'G3.18-03', skillId: 'G3.18', skillName: 'Number patterns', difficulty: 5, band: 'core',
    stem: 'Pattern rule for 3, 6, 12, 24, ...:', correct: 'Multiply by 2', wrong: ['Add 3', 'Add 6', 'Subtract 3'],
    solution: 'Each term doubles: 3 → 6 → 12 → 24.' }),
  mcq({ id: 'G3.18-04', skillId: 'G3.18', skillName: 'Number patterns', difficulty: 6, band: 'advanced',
    stem: 'Missing: 1, 4, 9, __, 25', correct: '16', wrong: ['12', '15', '18'],
    solution: 'Squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25.' }),
];

const G3_ITEMS = [...G3_M3, ...G3_M4, ...G3_M5, ...G3_M6];

// ===========================================================================
// CLASS 4 — Large numbers, long ×/÷, fractions, decimals, perimeter+area,
//           symmetry, data
// ===========================================================================

const G4_M3: Item[] = [
  mcq({ id: 'G4.07-01', skillId: 'G4.07', skillName: 'Numbers up to 99999', difficulty: 4, band: 'foundational',
    stem: '10000 written in words:', correct: 'Ten thousand', wrong: ['One thousand', 'Ten hundred', 'One lakh'],
    solution: '10,000 = ten thousand.' }),
  mcq({ id: 'G4.07-02', skillId: 'G4.07', skillName: 'Numbers up to 99999', difficulty: 5, band: 'foundational',
    stem: 'Successor of 12999:', correct: '13000', wrong: ['12998', '13099', '12000'], solution: '12999 + 1 = 13000.' }),
  mcq({ id: 'G4.07-03', skillId: 'G4.07', skillName: 'Numbers up to 99999', difficulty: 6, band: 'core',
    stem: 'Place value of 7 in 47,352:', correct: 'Seven thousand', wrong: ['Seventy', 'Seven hundred', 'Seven'],
    solution: '7 is in the thousands place.' }),
  mcq({ id: 'G4.07-04', skillId: 'G4.07', skillName: 'Numbers up to 99999', difficulty: 7, band: 'advanced',
    stem: 'Which is greatest: 45678, 45876, 45786, 45687?', correct: '45876', wrong: ['45786', '45687', '45678'],
    solution: 'Compare hundred: 8 > 7.' }),

  mcq({ id: 'G4.08-01', skillId: 'G4.08', skillName: 'Long multiplication (2×2 digit)', difficulty: 5, band: 'foundational',
    stem: '23 × 12 = ?', correct: '276', wrong: ['246', '256', '286'], solution: '23 × 12 = 23 × 10 + 23 × 2 = 230 + 46 = 276.' }),
  mcq({ id: 'G4.08-02', skillId: 'G4.08', skillName: 'Long multiplication (2×2 digit)', difficulty: 6, band: 'foundational',
    stem: '45 × 20 = ?', correct: '900', wrong: ['90', '450', '9000'], solution: '45 × 2 × 10 = 90 × 10 = 900.' }),
  mcq({ id: 'G4.08-03', skillId: 'G4.08', skillName: 'Long multiplication (2×2 digit)', difficulty: 7, band: 'core',
    stem: '34 × 25 = ?', correct: '850', wrong: ['800', '860', '925'], solution: '34 × 25 = 34 × 20 + 34 × 5 = 680 + 170 = 850.' }),
  mcq({ id: 'G4.08-04', skillId: 'G4.08', skillName: 'Long multiplication (2×2 digit)', difficulty: 8, band: 'advanced',
    stem: '56 × 47 = ?', correct: '2632', wrong: ['2532', '2732', '2432'], solution: '56 × 47 = 56 × 40 + 56 × 7 = 2240 + 392 = 2632.' }),

  mcq({ id: 'G4.09-01', skillId: 'G4.09', skillName: 'Long division (3-digit ÷ 1-digit)', difficulty: 5, band: 'foundational',
    stem: '84 ÷ 4 = ?', correct: '21', wrong: ['20', '22', '80'], solution: '84 ÷ 4 = 21.' }),
  mcq({ id: 'G4.09-02', skillId: 'G4.09', skillName: 'Long division (3-digit ÷ 1-digit)', difficulty: 6, band: 'foundational',
    stem: '156 ÷ 6 = ?', correct: '26', wrong: ['16', '36', '25'], solution: '6 × 26 = 156.' }),
  mcq({ id: 'G4.09-03', skillId: 'G4.09', skillName: 'Long division (3-digit ÷ 1-digit)', difficulty: 7, band: 'core',
    stem: '245 ÷ 5 = ?', correct: '49', wrong: ['39', '50', '45'], solution: '5 × 49 = 245.' }),
  mcq({ id: 'G4.09-04', skillId: 'G4.09', skillName: 'Long division (3-digit ÷ 1-digit)', difficulty: 8, band: 'advanced',
    stem: '124 ÷ 5 = ? (quotient, remainder)', correct: 'Quotient 24, remainder 4', wrong: ['Quotient 24, remainder 0', 'Quotient 25, remainder 1', 'Quotient 20, remainder 4'],
    solution: '5 × 24 = 120, 124 - 120 = 4 → Q 24, R 4.' }),
];

const G4_M4: Item[] = [
  mcq({ id: 'G4.10-01', skillId: 'G4.10', skillName: 'Equivalent fractions', difficulty: 4, band: 'foundational',
    stem: '1/2 = ?/4', correct: '2', wrong: ['1', '3', '4'], solution: '1/2 × 2/2 = 2/4.' }),
  mcq({ id: 'G4.10-02', skillId: 'G4.10', skillName: 'Equivalent fractions', difficulty: 5, band: 'foundational',
    stem: '2/3 = ?/6', correct: '4', wrong: ['3', '5', '6'], solution: '2 × 2 = 4, 3 × 2 = 6.' }),
  mcq({ id: 'G4.10-03', skillId: 'G4.10', skillName: 'Equivalent fractions', difficulty: 6, band: 'core',
    stem: '3/4 = 9/?', correct: '12', wrong: ['16', '9', '4'], solution: '3 × 3 = 9, so multiply denominator by 3: 4 × 3 = 12.' }),
  mcq({ id: 'G4.10-04', skillId: 'G4.10', skillName: 'Equivalent fractions', difficulty: 7, band: 'advanced',
    stem: 'Which fraction equals 1/2?', correct: '5/10', wrong: ['3/5', '4/6', '2/5'], solution: '5/10 simplifies to 1/2.' }),

  mcq({ id: 'G4.11-01', skillId: 'G4.11', skillName: 'Same-denominator fractions', difficulty: 4, band: 'foundational',
    stem: '1/5 + 2/5 = ?', correct: '3/5', wrong: ['3/10', '3', '2/5'], solution: 'Add numerators: 1+2=3; denominator stays 5.' }),
  mcq({ id: 'G4.11-02', skillId: 'G4.11', skillName: 'Same-denominator fractions', difficulty: 5, band: 'foundational',
    stem: '4/7 - 2/7 = ?', correct: '2/7', wrong: ['2/14', '6/7', '2/0'], solution: '4-2=2, keep denominator.' }),
  mcq({ id: 'G4.11-03', skillId: 'G4.11', skillName: 'Same-denominator fractions', difficulty: 6, band: 'core',
    stem: '5/8 + 1/8 = ?', correct: '6/8 (or 3/4)', wrong: ['6/16', '5/8', '4/8'], solution: '5+1=6/8 = 3/4.' }),
  mcq({ id: 'G4.11-04', skillId: 'G4.11', skillName: 'Same-denominator fractions', difficulty: 7, band: 'advanced',
    stem: '7/10 + 3/10 = ?', correct: '1', wrong: ['10/20', '4/10', '10/10 but not 1'], solution: '10/10 = 1.' }),

  mcq({ id: 'G4.12-01', skillId: 'G4.12', skillName: 'Decimal arithmetic (tenths)', difficulty: 5, band: 'foundational',
    stem: '0.3 + 0.4 = ?', correct: '0.7', wrong: ['0.07', '3.4', '7'], solution: '3 tenths + 4 tenths = 7 tenths = 0.7.' }),
  mcq({ id: 'G4.12-02', skillId: 'G4.12', skillName: 'Decimal arithmetic (tenths)', difficulty: 6, band: 'foundational',
    stem: '1.5 - 0.7 = ?', correct: '0.8', wrong: ['0.7', '0.85', '2.2'], solution: '1.5 - 0.7 = 0.8.' }),
  mcq({ id: 'G4.12-03', skillId: 'G4.12', skillName: 'Decimal arithmetic (tenths)', difficulty: 7, band: 'core',
    stem: '2.5 + 1.5 = ?', correct: '4', wrong: ['3.10', '3.5', '4.5'], solution: '4.0.' }),
  mcq({ id: 'G4.12-04', skillId: 'G4.12', skillName: 'Decimal arithmetic (tenths)', difficulty: 8, band: 'advanced',
    stem: 'Which is bigger: 0.7 or 0.09?', correct: '0.7', wrong: ['0.09', 'Same', 'Cannot tell'],
    solution: '0.7 = 0.70 > 0.09.' }),
];

const G4_M5: Item[] = [
  mcq({ id: 'G4.13-01', skillId: 'G4.13', skillName: 'Perimeter', difficulty: 4, band: 'foundational',
    stem: 'Perimeter of a square with side 4 cm:', correct: '16 cm', wrong: ['8 cm', '12 cm', '16 cm²'],
    solution: 'P = 4 × side = 4 × 4 = 16 cm.' }),
  mcq({ id: 'G4.13-02', skillId: 'G4.13', skillName: 'Perimeter', difficulty: 5, band: 'foundational',
    stem: 'Perimeter of a rectangle 5 × 3:', correct: '16', wrong: ['15', '8', '30'],
    solution: 'P = 2(5+3) = 16.' }),
  mcq({ id: 'G4.13-03', skillId: 'G4.13', skillName: 'Perimeter', difficulty: 6, band: 'core',
    stem: 'A wire is bent into a square of side 6 cm. Length of wire used?', correct: '24 cm', wrong: ['12 cm', '36 cm', '18 cm'],
    solution: 'Wire length = perimeter = 4 × 6 = 24 cm.' }),
  mcq({ id: 'G4.13-04', skillId: 'G4.13', skillName: 'Perimeter', difficulty: 7, band: 'advanced',
    stem: 'Perimeter of a triangle with sides 3, 4, 5:', correct: '12', wrong: ['24', '60', '9'],
    solution: '3 + 4 + 5 = 12.' }),

  mcq({ id: 'G4.14-01', skillId: 'G4.14', skillName: 'Area of rectangles (unit squares)', difficulty: 5, band: 'foundational',
    stem: 'Area of a 4 × 3 rectangle:', correct: '12 square units', wrong: ['7', '14', '12 units'],
    solution: 'A = 4 × 3 = 12.' }),
  mcq({ id: 'G4.14-02', skillId: 'G4.14', skillName: 'Area of rectangles (unit squares)', difficulty: 6, band: 'foundational',
    stem: 'Area of a 5 cm × 6 cm rectangle:', correct: '30 cm²', wrong: ['11 cm', '30 cm', '11 cm²'],
    solution: 'A = 5 × 6 = 30 cm².' }),
  mcq({ id: 'G4.14-03', skillId: 'G4.14', skillName: 'Area of rectangles (unit squares)', difficulty: 7, band: 'core',
    stem: 'A tile is 10 cm × 10 cm. How many tiles cover 100 × 100 cm?', correct: '100', wrong: ['10', '1000', '400'],
    solution: 'Floor area / tile area = 10000 / 100 = 100.' }),
  mcq({ id: 'G4.14-04', skillId: 'G4.14', skillName: 'Area of rectangles (unit squares)', difficulty: 8, band: 'advanced',
    stem: 'Difference between perimeter and area units:', correct: 'Perimeter uses length units; area uses square units', wrong: ['Same units', 'Perimeter uses squares', 'Area uses lengths'],
    solution: 'Perimeter cm, area cm².' }),

  mcq({ id: 'G4.15-01', skillId: 'G4.15', skillName: 'Symmetry', difficulty: 4, band: 'foundational',
    stem: 'A square has how many lines of symmetry?', correct: '4', wrong: ['2', '1', '0'],
    solution: '2 through opposite sides, 2 through diagonals.' }),
  mcq({ id: 'G4.15-02', skillId: 'G4.15', skillName: 'Symmetry', difficulty: 5, band: 'foundational',
    stem: 'A rectangle (non-square) has how many lines of symmetry?', correct: '2', wrong: ['4', '1', '0'],
    solution: 'Only through midpoints of opposite sides.' }),
  mcq({ id: 'G4.15-03', skillId: 'G4.15', skillName: 'Symmetry', difficulty: 6, band: 'core',
    stem: 'A circle has how many lines of symmetry?', correct: 'Infinitely many (every diameter)', wrong: ['2', '4', '0'],
    solution: 'Every diameter is a line of symmetry.' }),
  mcq({ id: 'G4.15-04', skillId: 'G4.15', skillName: 'Symmetry', difficulty: 7, band: 'advanced',
    stem: 'An equilateral triangle has how many lines of symmetry?', correct: '3', wrong: ['1', '2', '6'],
    solution: 'One from each vertex to the midpoint of the opposite side.' }),
];

const G4_M6: Item[] = [
  mcq({ id: 'G4.16-01', skillId: 'G4.16', skillName: 'Time and calendar (advanced)', difficulty: 4, band: 'foundational',
    stem: 'How many days in an ordinary year?', correct: '365', wrong: ['366', '360', '52'],
    solution: '365 days in a common year.' }),
  mcq({ id: 'G4.16-02', skillId: 'G4.16', skillName: 'Time and calendar (advanced)', difficulty: 5, band: 'foundational',
    stem: 'A leap year has how many days?', correct: '366', wrong: ['365', '360', '400'],
    solution: 'Every 4th year is a leap year (usually), Feb has 29 days → 366.' }),
  mcq({ id: 'G4.16-03', skillId: 'G4.16', skillName: 'Time and calendar (advanced)', difficulty: 6, band: 'core',
    stem: 'How many weeks in a year (rounded down)?', correct: '52', wrong: ['12', '365', '48'],
    solution: '365 ÷ 7 ≈ 52 weeks + 1 day.' }),
  mcq({ id: 'G4.16-04', skillId: 'G4.16', skillName: 'Time and calendar (advanced)', difficulty: 7, band: 'advanced',
    stem: '4 hours 45 min = ? min', correct: '285', wrong: ['405', '245', '445'], solution: '4 × 60 + 45 = 285 min.' }),

  mcq({ id: 'G4.17-01', skillId: 'G4.17', skillName: 'Money word problems', difficulty: 5, band: 'foundational',
    stem: 'A pen costs ₹12. Cost of 5 pens?', correct: '₹60', wrong: ['₹17', '₹12', '₹120'],
    solution: '12 × 5 = 60.' }),
  mcq({ id: 'G4.17-02', skillId: 'G4.17', skillName: 'Money word problems', difficulty: 6, band: 'foundational',
    stem: 'Total cost: 3 books at ₹45 each + 2 pens at ₹8 each:', correct: '₹151', wrong: ['₹53', '₹135', '₹161'],
    solution: '3 × 45 + 2 × 8 = 135 + 16 = 151.' }),
  mcq({ id: 'G4.17-03', skillId: 'G4.17', skillName: 'Money word problems', difficulty: 7, band: 'core',
    stem: 'Sohan had ₹200. He spent ₹75 and ₹40. Money left?', correct: '₹85', wrong: ['₹115', '₹125', '₹35'],
    solution: '200 - 75 - 40 = 85.' }),
  mcq({ id: 'G4.17-04', skillId: 'G4.17', skillName: 'Money word problems', difficulty: 8, band: 'advanced',
    stem: 'A shirt costs ₹350. Discount is ₹50. Sale price?', correct: '₹300', wrong: ['₹400', '₹250', '₹350'],
    solution: '350 - 50 = 300.' }),

  mcq({ id: 'G4.18-01', skillId: 'G4.18', skillName: 'Data handling: tables', difficulty: 4, band: 'foundational',
    stem: 'What goes in the first column of a simple frequency table?', correct: 'The categories being counted', wrong: ['The totals', 'The graph', 'Empty'],
    solution: 'Categories on one axis, counts (frequencies) on the other.' }),
  mcq({ id: 'G4.18-02', skillId: 'G4.18', skillName: 'Data handling: tables', difficulty: 5, band: 'foundational',
    stem: 'Tally marks — how do you write 5?', correct: 'Four vertical lines with a diagonal across', wrong: ['Five separate lines', 'The digit 5', 'A star'],
    solution: 'IIII with a slash across = 5 (a "gate").' }),
  mcq({ id: 'G4.18-03', skillId: 'G4.18', skillName: 'Data handling: tables', difficulty: 6, band: 'core',
    stem: 'A tally shows |||| |||| ||. That is:', correct: '12', wrong: ['10', '11', '14'], solution: '5 + 5 + 2 = 12.' }),
  mcq({ id: 'G4.18-04', skillId: 'G4.18', skillName: 'Data handling: tables', difficulty: 7, band: 'advanced',
    stem: 'Best chart to compare number of students in 4 sections:', correct: 'Bar graph', wrong: ['Line graph', 'Pie chart with one category', 'Pictograph with no key'],
    solution: 'Bars compare category counts clearly.' }),
];

const G4_ITEMS = [...G4_M3, ...G4_M4, ...G4_M5, ...G4_M6];

// ===========================================================================
// CLASS 5 — Large numbers (crore), HCF/LCM intro, decimal ×/÷, fractions,
//           percent, volume, angles, data (mean)
// ===========================================================================

const G5_M3: Item[] = [
  mcq({ id: 'G5.07-01', skillId: 'G5.07', skillName: 'Large numbers (crore)', difficulty: 4, band: 'foundational',
    stem: '1 lakh = ?', correct: '1,00,000', wrong: ['10,000', '10,00,000', '1,000'], solution: '1 lakh = 100,000.' }),
  mcq({ id: 'G5.07-02', skillId: 'G5.07', skillName: 'Large numbers (crore)', difficulty: 5, band: 'foundational',
    stem: '1 crore = ? lakh', correct: '100', wrong: ['10', '1000', '1'], solution: '1 crore = 100 lakh = 1,00,00,000.' }),
  mcq({ id: 'G5.07-03', skillId: 'G5.07', skillName: 'Large numbers (crore)', difficulty: 6, band: 'core',
    stem: 'Read: 5,23,000', correct: 'Five lakh twenty-three thousand', wrong: ['Fifty-two lakh three thousand', 'Five thousand twenty-three', 'Five crore twenty-three thousand'],
    solution: 'Indian system: 5 lakh + 23 thousand.' }),
  mcq({ id: 'G5.07-04', skillId: 'G5.07', skillName: 'Large numbers (crore)', difficulty: 7, band: 'advanced',
    stem: 'How many zeros in one crore?', correct: '7', wrong: ['5', '6', '8'], solution: '1,00,00,000 has 7 zeros.' }),

  mcq({ id: 'G5.08-01', skillId: 'G5.08', skillName: 'HCF introduction', difficulty: 5, band: 'foundational',
    stem: 'HCF of 6 and 9 is:', correct: '3', wrong: ['1', '6', '18'],
    solution: 'Factors of 6: 1,2,3,6. Factors of 9: 1,3,9. Common: 1, 3. Highest = 3.' }),
  mcq({ id: 'G5.08-02', skillId: 'G5.08', skillName: 'HCF introduction', difficulty: 6, band: 'foundational',
    stem: 'HCF of 8 and 12 is:', correct: '4', wrong: ['2', '8', '24'],
    solution: 'Common factors of 8 and 12: 1, 2, 4. Highest = 4.' }),
  mcq({ id: 'G5.08-03', skillId: 'G5.08', skillName: 'HCF introduction', difficulty: 7, band: 'core',
    stem: 'HCF of two consecutive natural numbers is always:', correct: '1', wrong: ['0', '2', 'The smaller one'],
    solution: 'Consecutive numbers share no common factor other than 1.' }),
  mcq({ id: 'G5.08-04', skillId: 'G5.08', skillName: 'HCF introduction', difficulty: 8, band: 'advanced',
    stem: 'HCF of 24 and 36 is:', correct: '12', wrong: ['6', '24', '72'],
    solution: 'Common factors: 1,2,3,4,6,12. HCF = 12.' }),

  mcq({ id: 'G5.09-01', skillId: 'G5.09', skillName: 'LCM introduction', difficulty: 5, band: 'foundational',
    stem: 'LCM of 2 and 3 is:', correct: '6', wrong: ['1', '5', '12'],
    solution: 'Multiples of 2: 2,4,6,8; of 3: 3,6,9. Least common = 6.' }),
  mcq({ id: 'G5.09-02', skillId: 'G5.09', skillName: 'LCM introduction', difficulty: 6, band: 'foundational',
    stem: 'LCM of 4 and 6 is:', correct: '12', wrong: ['2', '24', '10'],
    solution: 'Multiples of 4: 4,8,12; of 6: 6,12. LCM = 12.' }),
  mcq({ id: 'G5.09-03', skillId: 'G5.09', skillName: 'LCM introduction', difficulty: 7, band: 'core',
    stem: 'LCM of 5 and 10 is:', correct: '10', wrong: ['5', '50', '15'],
    solution: '10 is a multiple of both 5 and 10.' }),
  mcq({ id: 'G5.09-04', skillId: 'G5.09', skillName: 'LCM introduction', difficulty: 8, band: 'advanced',
    stem: 'Product of HCF and LCM of 8 and 12:', correct: '96', wrong: ['20', '4', '24'],
    solution: 'HCF × LCM = number × number → 4 × 24 = 96 = 8 × 12.' }),
];

const G5_M4: Item[] = [
  mcq({ id: 'G5.10-01', skillId: 'G5.10', skillName: 'Decimal multiplication', difficulty: 5, band: 'foundational',
    stem: '0.2 × 3 = ?', correct: '0.6', wrong: ['0.06', '6', '0.23'], solution: '0.2 + 0.2 + 0.2 = 0.6.' }),
  mcq({ id: 'G5.10-02', skillId: 'G5.10', skillName: 'Decimal multiplication', difficulty: 6, band: 'foundational',
    stem: '0.5 × 0.4 = ?', correct: '0.20', wrong: ['0.9', '2', '0.2 (correct)'],
    solution: '0.5 × 0.4 = 5 × 4 / 100 = 0.20 (same as 0.2).' }),
  mcq({ id: 'G5.10-03', skillId: 'G5.10', skillName: 'Decimal multiplication', difficulty: 7, band: 'core',
    stem: '1.2 × 0.5 = ?', correct: '0.6', wrong: ['0.06', '6', '1.7'], solution: '12 × 5 / 100 = 0.60.' }),
  mcq({ id: 'G5.10-04', skillId: 'G5.10', skillName: 'Decimal multiplication', difficulty: 8, band: 'advanced',
    stem: '0.25 × 4 = ?', correct: '1', wrong: ['0.1', '10', '0.29'], solution: '0.25 + 0.25 + 0.25 + 0.25 = 1.' }),

  mcq({ id: 'G5.11-01', skillId: 'G5.11', skillName: 'Decimal division (by whole)', difficulty: 5, band: 'foundational',
    stem: '0.6 ÷ 2 = ?', correct: '0.3', wrong: ['0.03', '3', '0.12'], solution: '6/2 = 3, so 0.6 / 2 = 0.3.' }),
  mcq({ id: 'G5.11-02', skillId: 'G5.11', skillName: 'Decimal division (by whole)', difficulty: 6, band: 'foundational',
    stem: '4.8 ÷ 4 = ?', correct: '1.2', wrong: ['12', '0.12', '4.2'], solution: '48/4 = 12, so 4.8/4 = 1.2.' }),
  mcq({ id: 'G5.11-03', skillId: 'G5.11', skillName: 'Decimal division (by whole)', difficulty: 7, band: 'core',
    stem: '2.5 ÷ 5 = ?', correct: '0.5', wrong: ['5', '0.05', '0.25'], solution: '25/5 = 5, so 2.5/5 = 0.5.' }),
  mcq({ id: 'G5.11-04', skillId: 'G5.11', skillName: 'Decimal division (by whole)', difficulty: 8, band: 'advanced',
    stem: '9.6 ÷ 8 = ?', correct: '1.2', wrong: ['0.12', '12', '9.68'], solution: '96/8 = 12 → 9.6/8 = 1.2.' }),

  mcq({ id: 'G5.12-01', skillId: 'G5.12', skillName: 'Fraction multiplication', difficulty: 5, band: 'foundational',
    stem: '1/2 × 4 = ?', correct: '2', wrong: ['1/8', '1/4', '4'], solution: '1/2 of 4 = 2.' }),
  mcq({ id: 'G5.12-02', skillId: 'G5.12', skillName: 'Fraction multiplication', difficulty: 6, band: 'foundational',
    stem: '1/3 × 1/2 = ?', correct: '1/6', wrong: ['1/5', '2/3', '2/6'], solution: 'Multiply top × top, bottom × bottom.' }),
  mcq({ id: 'G5.12-03', skillId: 'G5.12', skillName: 'Fraction multiplication', difficulty: 7, band: 'core',
    stem: '2/3 × 3/4 = ?', correct: '1/2', wrong: ['6/12', '5/7', '5/12'], solution: '6/12 = 1/2.' }),
  mcq({ id: 'G5.12-04', skillId: 'G5.12', skillName: 'Fraction multiplication', difficulty: 8, band: 'advanced',
    stem: '3/5 of 25 = ?', correct: '15', wrong: ['5', '75', '30'], solution: '(3/5) × 25 = 3 × 5 = 15.' }),
];

const G5_M5: Item[] = [
  mcq({ id: 'G5.13-01', skillId: 'G5.13', skillName: 'Percent of a quantity', difficulty: 5, band: 'foundational',
    stem: '50% of 40 = ?', correct: '20', wrong: ['4', '80', '50'], solution: 'Half of 40 = 20.' }),
  mcq({ id: 'G5.13-02', skillId: 'G5.13', skillName: 'Percent of a quantity', difficulty: 6, band: 'foundational',
    stem: '25% of 80 = ?', correct: '20', wrong: ['25', '4', '32'], solution: '25% = 1/4; 80/4 = 20.' }),
  mcq({ id: 'G5.13-03', skillId: 'G5.13', skillName: 'Percent of a quantity', difficulty: 7, band: 'core',
    stem: '10% of 250 = ?', correct: '25', wrong: ['10', '2.5', '2500'], solution: '10% = 1/10; 250/10 = 25.' }),
  mcq({ id: 'G5.13-04', skillId: 'G5.13', skillName: 'Percent of a quantity', difficulty: 8, band: 'advanced',
    stem: '20% of 60 = ?', correct: '12', wrong: ['20', '6', '30'], solution: '20% = 1/5; 60/5 = 12.' }),

  mcq({ id: 'G5.14-01', skillId: 'G5.14', skillName: 'Volume of cuboid (informal)', difficulty: 5, band: 'foundational',
    stem: 'Volume of a 2 × 3 × 4 box (unit cubes):', correct: '24', wrong: ['9', '20', '18'],
    solution: 'V = l × w × h = 2 × 3 × 4 = 24.' }),
  mcq({ id: 'G5.14-02', skillId: 'G5.14', skillName: 'Volume of cuboid (informal)', difficulty: 6, band: 'foundational',
    stem: 'Volume of a cube with side 5:', correct: '125', wrong: ['25', '15', '150'], solution: '5 × 5 × 5 = 125.' }),
  mcq({ id: 'G5.14-03', skillId: 'G5.14', skillName: 'Volume of cuboid (informal)', difficulty: 7, band: 'core',
    stem: 'Volume unit for solid space:', correct: 'Cubic units (e.g. cm³)', wrong: ['Square units', 'Length units', 'None'],
    solution: 'Volume is measured in cubic units.' }),
  mcq({ id: 'G5.14-04', skillId: 'G5.14', skillName: 'Volume of cuboid (informal)', difficulty: 8, band: 'advanced',
    stem: 'How many 1 cm cubes fit in a 2 × 2 × 2 cm cube?', correct: '8', wrong: ['6', '4', '2'],
    solution: '2 × 2 × 2 = 8.' }),

  mcq({ id: 'G5.15-01', skillId: 'G5.15', skillName: 'Angles: types', difficulty: 4, band: 'foundational',
    stem: 'An angle of 90° is:', correct: 'Right angle', wrong: ['Acute', 'Obtuse', 'Straight'],
    solution: 'Right angle = 90°.' }),
  mcq({ id: 'G5.15-02', skillId: 'G5.15', skillName: 'Angles: types', difficulty: 5, band: 'foundational',
    stem: 'An angle less than 90° is:', correct: 'Acute', wrong: ['Right', 'Obtuse', 'Straight'],
    solution: 'Acute < 90°.' }),
  mcq({ id: 'G5.15-03', skillId: 'G5.15', skillName: 'Angles: types', difficulty: 6, band: 'core',
    stem: 'An angle of 180° is:', correct: 'Straight angle', wrong: ['Right', 'Obtuse', 'Reflex'],
    solution: '180° = straight line.' }),
  mcq({ id: 'G5.15-04', skillId: 'G5.15', skillName: 'Angles: types', difficulty: 7, band: 'advanced',
    stem: 'An angle between 90° and 180° is:', correct: 'Obtuse', wrong: ['Acute', 'Right', 'Reflex'],
    solution: 'Obtuse: 90° < θ < 180°.' }),
];

const G5_M6: Item[] = [
  mcq({ id: 'G5.16-01', skillId: 'G5.16', skillName: 'Data: mean introduction', difficulty: 5, band: 'foundational',
    stem: 'Mean of 2, 4, 6:', correct: '4', wrong: ['3', '6', '12'], solution: '(2+4+6)/3 = 12/3 = 4.' }),
  mcq({ id: 'G5.16-02', skillId: 'G5.16', skillName: 'Data: mean introduction', difficulty: 6, band: 'foundational',
    stem: 'Mean of 3, 5, 7, 9:', correct: '6', wrong: ['5', '7', '24'], solution: '(3+5+7+9)/4 = 24/4 = 6.' }),
  mcq({ id: 'G5.16-03', skillId: 'G5.16', skillName: 'Data: mean introduction', difficulty: 7, band: 'core',
    stem: 'Mean is:', correct: 'Sum of values ÷ number of values', wrong: ['The largest value', 'The most common value', 'The middle value'],
    solution: 'Mean = arithmetic average.' }),
  mcq({ id: 'G5.16-04', skillId: 'G5.16', skillName: 'Data: mean introduction', difficulty: 8, band: 'advanced',
    stem: '5 students scored: 8, 9, 10, 7, 6. Mean:', correct: '8', wrong: ['7', '9', '10'], solution: '(8+9+10+7+6)/5 = 40/5 = 8.' }),

  mcq({ id: 'G5.17-01', skillId: 'G5.17', skillName: 'Bar graph: read and compare', difficulty: 5, band: 'foundational',
    stem: 'On a bar graph, if scale is 1 cm = 10 units and a bar is 4 cm tall, value is:', correct: '40', wrong: ['4', '14', '400'],
    solution: '4 × 10 = 40.' }),
  mcq({ id: 'G5.17-02', skillId: 'G5.17', skillName: 'Bar graph: read and compare', difficulty: 6, band: 'foundational',
    stem: 'Best chart to show change of temperature over a week:', correct: 'Line graph', wrong: ['Pictograph', 'Table only', 'Pie chart'],
    solution: 'Line graph is best for trend over time.' }),
  mcq({ id: 'G5.17-03', skillId: 'G5.17', skillName: 'Bar graph: read and compare', difficulty: 7, band: 'core',
    stem: 'On a bar graph, "frequency" means:', correct: 'How many times something occurred', wrong: ['The name of the item', 'Total of all bars', 'Height in cm only'],
    solution: 'Frequency = count of occurrences.' }),
  mcq({ id: 'G5.17-04', skillId: 'G5.17', skillName: 'Bar graph: read and compare', difficulty: 8, band: 'advanced',
    stem: 'To find the total students across all bars, you:', correct: 'Sum the frequencies of all bars', wrong: ['Multiply all bars', 'Look at the tallest bar', 'Take the average'],
    solution: 'Total = sum of individual bar values.' }),

  mcq({ id: 'G5.18-01', skillId: 'G5.18', skillName: 'Word problems: mixed operations', difficulty: 6, band: 'foundational',
    stem: 'Sohan buys 5 kg rice at ₹40/kg. He gives ₹500. Change?', correct: '₹300', wrong: ['₹200', '₹400', '₹100'],
    solution: 'Cost 5 × 40 = 200; 500 - 200 = 300.' }),
  mcq({ id: 'G5.18-02', skillId: 'G5.18', skillName: 'Word problems: mixed operations', difficulty: 7, band: 'foundational',
    stem: '3 trains carry 250 people each. Total?', correct: '750', wrong: ['253', '500', '850'], solution: '3 × 250 = 750.' }),
  mcq({ id: 'G5.18-03', skillId: 'G5.18', skillName: 'Word problems: mixed operations', difficulty: 8, band: 'core',
    stem: 'A tank holds 500 L. It has 350 L. To fill it, add:', correct: '150 L', wrong: ['850 L', '500 L', '50 L'],
    solution: '500 - 350 = 150.' }),
  mcq({ id: 'G5.18-04', skillId: 'G5.18', skillName: 'Word problems: mixed operations', difficulty: 9, band: 'advanced',
    stem: 'A shop keeper buys apples at ₹80 per dozen and sells at ₹10 each. Profit per apple:', correct: '₹10/3 ≈ ₹3.33', wrong: ['₹80', '₹10', '₹2'],
    solution: 'Buy: 80/12 ≈ 6.67; sell 10. Profit ≈ 3.33.' }),
];

const G5_ITEMS = [...G5_M3, ...G5_M4, ...G5_M5, ...G5_M6];

// ---------------------------------------------------------------------------
// Public exports
// ---------------------------------------------------------------------------
export const FULL_GRADE_ITEMS_G15: Item[] = [
  ...G1_ITEMS, ...G2_ITEMS, ...G3_ITEMS, ...G4_ITEMS, ...G5_ITEMS,
];

export type FullGradeModuleMetaG15 = {
  gradeId: string;
  moduleSlug: string;
  moduleTitle: string;
  moduleDescription: string;
  displayOrder: number;
  skills: Array<{ legacyId: string; displayLabel: string; shortLabel: string }>;
};

export const FULL_GRADE_META_G15: FullGradeModuleMetaG15[] = [
  // Class 1
  { gradeId: 'grade_01', moduleSlug: 'numbers_21_99', moduleTitle: 'Numbers 21 to 99 (Class 1)', moduleDescription: 'Numbers 21-50, 51-99, and number names. Prototype content, teacher review required.', displayOrder: 2,
    skills: [{ legacyId: 'G1.07', displayLabel: 'Numbers 21 to 50', shortLabel: 'G1.07 — 21–50' },
             { legacyId: 'G1.08', displayLabel: 'Numbers 51 to 99', shortLabel: 'G1.08 — 51–99' },
             { legacyId: 'G1.09', displayLabel: 'Number names 20-50', shortLabel: 'G1.09 — Names' }] },
  { gradeId: 'grade_01', moduleSlug: 'add_sub_50', moduleTitle: 'Addition & Subtraction up to 50 (Class 1)', moduleDescription: 'Addition, subtraction, and skip-counting up to 50. Prototype content, teacher review required.', displayOrder: 3,
    skills: [{ legacyId: 'G1.10', displayLabel: 'Addition up to 50', shortLabel: 'G1.10 — Add ≤50' },
             { legacyId: 'G1.11', displayLabel: 'Subtraction up to 50', shortLabel: 'G1.11 — Sub ≤50' },
             { legacyId: 'G1.12', displayLabel: 'Skip counting by 2s, 5s, 10s', shortLabel: 'G1.12 — Skip count' }] },
  { gradeId: 'grade_01', moduleSlug: 'time_basics', moduleTitle: 'Time basics (Class 1)', moduleDescription: 'Parts of the day, days of the week, months of the year. Prototype content, teacher review required.', displayOrder: 4,
    skills: [{ legacyId: 'G1.13', displayLabel: 'Parts of the day', shortLabel: 'G1.13 — Day parts' },
             { legacyId: 'G1.14', displayLabel: 'Days of the week', shortLabel: 'G1.14 — Weekdays' },
             { legacyId: 'G1.15', displayLabel: 'Months of the year', shortLabel: 'G1.15 — Months' }] },
  { gradeId: 'grade_01', moduleSlug: 'measurement_basics', moduleTitle: 'Measurement basics (Class 1)', moduleDescription: 'Heavy/light comparison, full/empty capacity, non-standard length units. Prototype content, teacher review required.', displayOrder: 5,
    skills: [{ legacyId: 'G1.16', displayLabel: 'Heavy and light', shortLabel: 'G1.16 — Weight' },
             { legacyId: 'G1.17', displayLabel: 'Full and empty (capacity)', shortLabel: 'G1.17 — Capacity' },
             { legacyId: 'G1.18', displayLabel: 'Non-standard length units', shortLabel: 'G1.18 — Non-std length' }] },
  // Class 2
  { gradeId: 'grade_02', moduleSlug: 'numbers_999', moduleTitle: 'Numbers up to 999 and 3-digit arithmetic (Class 2)', moduleDescription: 'Place value to 999, 3-digit addition and subtraction (no regrouping). Prototype content, teacher review required.', displayOrder: 2,
    skills: [{ legacyId: 'G2.07', displayLabel: 'Numbers up to 999', shortLabel: 'G2.07 — Numbers ≤999' },
             { legacyId: 'G2.08', displayLabel: '3-digit addition (no regrouping)', shortLabel: 'G2.08 — 3-digit +' },
             { legacyId: 'G2.09', displayLabel: '3-digit subtraction (no regrouping)', shortLabel: 'G2.09 — 3-digit −' }] },
  { gradeId: 'grade_02', moduleSlug: 'tables_division', moduleTitle: 'Multiplication tables and division intro (Class 2)', moduleDescription: 'Tables of 4, 5, 10 and division as equal sharing. Prototype content, teacher review required.', displayOrder: 3,
    skills: [{ legacyId: 'G2.10', displayLabel: 'Multiplication tables 4 and 5', shortLabel: 'G2.10 — × 4, 5' },
             { legacyId: 'G2.11', displayLabel: 'Table of 10', shortLabel: 'G2.11 — × 10' },
             { legacyId: 'G2.12', displayLabel: 'Division as equal sharing', shortLabel: 'G2.12 — ÷ sharing' }] },
  { gradeId: 'grade_02', moduleSlug: 'fractions_measurement', moduleTitle: 'Fractions intro and length/weight (Class 2)', moduleDescription: 'Half and quarter, length in cm/m, weight in g/kg. Prototype content, teacher review required.', displayOrder: 4,
    skills: [{ legacyId: 'G2.13', displayLabel: 'Half and quarter (fractions intro)', shortLabel: 'G2.13 — 1/2 & 1/4' },
             { legacyId: 'G2.14', displayLabel: 'Length in cm and m', shortLabel: 'G2.14 — cm/m' },
             { legacyId: 'G2.15', displayLabel: 'Weight in g and kg', shortLabel: 'G2.15 — g/kg' }] },
  { gradeId: 'grade_02', moduleSlug: 'capacity_data_shapes', moduleTitle: 'Capacity, pictographs, and 3D shapes (Class 2)', moduleDescription: 'Capacity in mL/L, reading pictographs, basic 3D shapes. Prototype content, teacher review required.', displayOrder: 5,
    skills: [{ legacyId: 'G2.16', displayLabel: 'Capacity in mL and L', shortLabel: 'G2.16 — mL/L' },
             { legacyId: 'G2.17', displayLabel: 'Pictographs (basic)', shortLabel: 'G2.17 — Pictograph' },
             { legacyId: 'G2.18', displayLabel: '3D shapes basic', shortLabel: 'G2.18 — 3D shapes' }] },
  // Class 3
  { gradeId: 'grade_03', moduleSlug: 'numbers_10000', moduleTitle: 'Numbers up to 10,000 and 4-digit arithmetic (Class 3)', moduleDescription: 'Place value to 10,000, 4-digit addition and subtraction. Prototype content, teacher review required.', displayOrder: 2,
    skills: [{ legacyId: 'G3.07', displayLabel: 'Numbers up to 10000', shortLabel: 'G3.07 — ≤10000' },
             { legacyId: 'G3.08', displayLabel: '4-digit addition', shortLabel: 'G3.08 — 4-digit +' },
             { legacyId: 'G3.09', displayLabel: '4-digit subtraction', shortLabel: 'G3.09 — 4-digit −' }] },
  { gradeId: 'grade_03', moduleSlug: 'tables_6to10', moduleTitle: 'Multiplication tables 6–10 and division (Class 3)', moduleDescription: 'Tables 6, 7, 8, 9 and division using the tables. Prototype content, teacher review required.', displayOrder: 3,
    skills: [{ legacyId: 'G3.10', displayLabel: 'Multiplication tables 6 and 7', shortLabel: 'G3.10 — × 6, 7' },
             { legacyId: 'G3.11', displayLabel: 'Multiplication tables 8 and 9', shortLabel: 'G3.11 — × 8, 9' },
             { legacyId: 'G3.12', displayLabel: 'Division with tables', shortLabel: 'G3.12 — ÷ tables' }] },
  { gradeId: 'grade_03', moduleSlug: 'fractions_time_money', moduleTitle: 'Fractions on line, time, money (Class 3)', moduleDescription: 'Fractions on number line, hours and minutes, rupees and paise problems. Prototype content, teacher review required.', displayOrder: 4,
    skills: [{ legacyId: 'G3.13', displayLabel: 'Fractions on number line', shortLabel: 'G3.13 — Frac line' },
             { legacyId: 'G3.14', displayLabel: 'Time: hours and minutes', shortLabel: 'G3.14 — H/M' },
             { legacyId: 'G3.15', displayLabel: 'Money: rupees and paise (advanced)', shortLabel: 'G3.15 — ₹/paise' }] },
  { gradeId: 'grade_03', moduleSlug: 'weight_data_patterns', moduleTitle: 'Weight, bar graphs, patterns (Class 3)', moduleDescription: 'Weight in g/kg, basic bar graphs, number patterns. Prototype content, teacher review required.', displayOrder: 5,
    skills: [{ legacyId: 'G3.16', displayLabel: 'Weight: grams and kilograms', shortLabel: 'G3.16 — g/kg' },
             { legacyId: 'G3.17', displayLabel: 'Bar graphs (basic)', shortLabel: 'G3.17 — Bar graph' },
             { legacyId: 'G3.18', displayLabel: 'Number patterns', shortLabel: 'G3.18 — Patterns' }] },
  // Class 4
  { gradeId: 'grade_04', moduleSlug: 'numbers_99999_ops', moduleTitle: 'Numbers up to 99,999 and long ×/÷ (Class 4)', moduleDescription: 'Numbers up to 99,999, long multiplication, long division. Prototype content, teacher review required.', displayOrder: 2,
    skills: [{ legacyId: 'G4.07', displayLabel: 'Numbers up to 99999', shortLabel: 'G4.07 — ≤99999' },
             { legacyId: 'G4.08', displayLabel: 'Long multiplication (2×2 digit)', shortLabel: 'G4.08 — 2×2 ×' },
             { legacyId: 'G4.09', displayLabel: 'Long division (3-digit ÷ 1-digit)', shortLabel: 'G4.09 — 3÷1' }] },
  { gradeId: 'grade_04', moduleSlug: 'fractions_decimals', moduleTitle: 'Fractions and decimals (Class 4)', moduleDescription: 'Equivalent fractions, same-denominator +/-, decimal arithmetic to tenths. Prototype content, teacher review required.', displayOrder: 3,
    skills: [{ legacyId: 'G4.10', displayLabel: 'Equivalent fractions', shortLabel: 'G4.10 — Equiv frac' },
             { legacyId: 'G4.11', displayLabel: 'Same-denominator fractions', shortLabel: 'G4.11 — Same denom' },
             { legacyId: 'G4.12', displayLabel: 'Decimal arithmetic (tenths)', shortLabel: 'G4.12 — Dec arith' }] },
  { gradeId: 'grade_04', moduleSlug: 'perimeter_area_symmetry', moduleTitle: 'Perimeter, area, symmetry (Class 4)', moduleDescription: 'Perimeter of shapes, area of rectangles, lines of symmetry. Prototype content, teacher review required.', displayOrder: 4,
    skills: [{ legacyId: 'G4.13', displayLabel: 'Perimeter', shortLabel: 'G4.13 — Perimeter' },
             { legacyId: 'G4.14', displayLabel: 'Area of rectangles (unit squares)', shortLabel: 'G4.14 — Area' },
             { legacyId: 'G4.15', displayLabel: 'Symmetry', shortLabel: 'G4.15 — Symmetry' }] },
  { gradeId: 'grade_04', moduleSlug: 'time_money_data', moduleTitle: 'Time, money, data handling (Class 4)', moduleDescription: 'Calendar, money word problems, tally and simple tables. Prototype content, teacher review required.', displayOrder: 5,
    skills: [{ legacyId: 'G4.16', displayLabel: 'Time and calendar (advanced)', shortLabel: 'G4.16 — Calendar' },
             { legacyId: 'G4.17', displayLabel: 'Money word problems', shortLabel: 'G4.17 — Money WP' },
             { legacyId: 'G4.18', displayLabel: 'Data handling: tables', shortLabel: 'G4.18 — Data tables' }] },
  // Class 5
  { gradeId: 'grade_05', moduleSlug: 'crore_hcf_lcm', moduleTitle: 'Crore, HCF and LCM intro (Class 5)', moduleDescription: 'Indian large number system, HCF and LCM basics. Prototype content, teacher review required.', displayOrder: 2,
    skills: [{ legacyId: 'G5.07', displayLabel: 'Large numbers (crore)', shortLabel: 'G5.07 — Crore' },
             { legacyId: 'G5.08', displayLabel: 'HCF introduction', shortLabel: 'G5.08 — HCF' },
             { legacyId: 'G5.09', displayLabel: 'LCM introduction', shortLabel: 'G5.09 — LCM' }] },
  { gradeId: 'grade_05', moduleSlug: 'decimals_fractions_ops', moduleTitle: 'Decimal and fraction operations (Class 5)', moduleDescription: 'Decimal ×/÷ and fraction multiplication. Prototype content, teacher review required.', displayOrder: 3,
    skills: [{ legacyId: 'G5.10', displayLabel: 'Decimal multiplication', shortLabel: 'G5.10 — Dec ×' },
             { legacyId: 'G5.11', displayLabel: 'Decimal division (by whole)', shortLabel: 'G5.11 — Dec ÷' },
             { legacyId: 'G5.12', displayLabel: 'Fraction multiplication', shortLabel: 'G5.12 — Frac ×' }] },
  { gradeId: 'grade_05', moduleSlug: 'percent_volume_angles', moduleTitle: 'Percent, volume, angles (Class 5)', moduleDescription: 'Percent of a quantity, informal volume of cuboid, types of angles. Prototype content, teacher review required.', displayOrder: 4,
    skills: [{ legacyId: 'G5.13', displayLabel: 'Percent of a quantity', shortLabel: 'G5.13 — % of' },
             { legacyId: 'G5.14', displayLabel: 'Volume of cuboid (informal)', shortLabel: 'G5.14 — Volume' },
             { legacyId: 'G5.15', displayLabel: 'Angles: types', shortLabel: 'G5.15 — Angles' }] },
  { gradeId: 'grade_05', moduleSlug: 'data_word_problems', moduleTitle: 'Data (mean) and word problems (Class 5)', moduleDescription: 'Mean, reading bar graphs, mixed-operation word problems. Prototype content, teacher review required.', displayOrder: 5,
    skills: [{ legacyId: 'G5.16', displayLabel: 'Data: mean introduction', shortLabel: 'G5.16 — Mean' },
             { legacyId: 'G5.17', displayLabel: 'Bar graph: read and compare', shortLabel: 'G5.17 — Bar read' },
             { legacyId: 'G5.18', displayLabel: 'Word problems: mixed operations', shortLabel: 'G5.18 — Mixed WP' }] },
];
