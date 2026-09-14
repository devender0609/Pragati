// ===========================================================================
// v0.78.1 §1 — DETERMINISTIC TEACHER FIXTURE.
//
// WHY THIS LIVES IN tools/ AND NOT IN src/
//
// Every Teacher screenshot in v0.78 was an empty state, so six screens
// were signed off on how they look with nothing in them. This fixture
// exists to fix that, and it must not become a way for invented data to
// reach the product: it is seeded into localStorage by the capture
// harness, using the same storage keys the app writes, and no
// production file imports it. Delete this file and the product is
// unchanged.
//
// WHAT IS AND IS NOT INVENTED
//
// Invented: eight names, a class, when sessions happened, and which
// options were chosen. That is the raw activity a real class would
// generate.
//
// NOT invented: anything derived from it. No mastery, ability,
// proficiency or growth value is seeded, because Pragati does not
// compute those and a fixture that contained them would let a screen
// display one without anybody noticing it had no source. `finalAbility`
// is written as 0 for the same reason — the field exists in the Session
// type for historical reasons and nothing in the Teacher product may
// present it as a measure.
//
// The activity is deliberately uneven: two students have not worked at
// all, two worked once a fortnight ago, four are recent. A fixture where
// everyone is equally active would hide exactly the case Insights is
// supposed to surface — the student nobody has heard from.
// ===========================================================================

const DAY = 86400000;
// Fixed clock so captures are byte-comparable between runs.
const NOW = Date.UTC(2026, 8, 10, 9, 0, 0);

const NAMES = [
  'Aarav Sharma',
  'Bhavna Patel',
  'Chetan Rao',
  'Diya Nair',
  'Farhan Ali',
  'Gauri Iyer',
  'Harsh Mehta',
  'Ishita Bose',
];

const ITEMS = ['FR.02-01', 'FR.02-04', 'FR.02-05', 'FR.02-08', 'FR.02-12'];

const students = NAMES.map((name, i) => ({
  id: `stu_fx_${i + 1}`,
  name,
  grade: 'Class 6',
  gradeId: 'class6',
  curriculumId: 'cbse',
  createdAt: NOW - 30 * DAY,
}));

/**
 * How recently each student worked, by index.
 * `null` means never — a real roster always has some.
 */
const LAST_ACTIVE_DAYS = [0, 1, 2, 3, 14, 16, null, null];

/**
 * Which of the five items each student got right.
 *
 * Chosen so the pattern is READABLE rather than random: item 3
 * (FR.02-05, "write the fraction shaded" on an 8-cell square) is missed
 * by most of the class, which is the kind of thing a teacher should be
 * able to notice from Insights without the product calling it a
 * diagnosis.
 */
const CORRECTNESS = [
  [true, true, false, true, true],
  [true, true, false, true, false],
  [true, false, false, true, true],
  [true, true, true, true, true],
  [false, true, false, false, true],
  [true, false, false, true, false],
  [],
  [],
];

const sessions = [];
students.forEach((s, i) => {
  const days = LAST_ACTIVE_DAYS[i];
  if (days === null) return;
  const startedAt = NOW - days * DAY;
  const marks = CORRECTNESS[i];
  sessions.push({
    id: `ses_fx_${i + 1}`,
    studentId: s.id,
    studentSnapshot: {
      name: s.name,
      grade: s.grade,
      gradeId: s.gradeId,
      curriculumId: s.curriculumId,
    },
    window: 'baseline',
    skillId: 'FR.02',
    startedAt,
    completedAt: startedAt + 9 * 60000,
    // finalAbility is written as 0 on purpose — see the note above.
    finalAbility: 0,
    assignmentId: 'asg_fx_active',
    responses: marks.map((correct, k) => ({
      itemId: ITEMS[k],
      chosenIndex: correct ? 0 : 1,
      correct,
      timeMs: 22000 + k * 3000,
      difficultyAtAttempt: k + 1,
      abilityBefore: 0,
      abilityAfter: 0,
      misconceptionTriggered: correct ? 'none' : 'visual_misread',
    })),
  });
});

const classroom = {
  id: 'cls_fx_1',
  teacherUid: 'local',
  name: 'Class 6B — Mathematics',
  notes: '',
  studentIds: students.map((s) => s.id),
  archived: false,
  createdAt: NOW - 30 * DAY,
  updatedAt: NOW - DAY,
};

const assignments = [
  {
    id: 'asg_fx_active',
    createdAt: NOW - 4 * DAY,
    skillMode: 'FR.02',
    itemCount: 10,
    pilotModeOn: false,
    title: 'Fractions as parts of a whole',
    teacherNote: 'Take your time and show your best thinking.',
    active: true,
    kind: 'practice',
    classroomId: classroom.id,
    target: { kind: 'class', label: 'Class 6B — Mathematics' },
  },
  {
    id: 'asg_fx_closed',
    createdAt: NOW - 18 * DAY,
    skillMode: 'FR.03',
    itemCount: 10,
    pilotModeOn: false,
    title: 'Equivalent fractions — first check',
    teacherNote: 'We will go over this together on Thursday.',
    active: false,
    kind: 'practice',
    classroomId: classroom.id,
    target: { kind: 'class', label: 'Class 6B — Mathematics' },
  },
];

export const TEACHER_FIXTURE = {
  'pragati.students.v1': students,
  'pragati.sessions.v1': sessions,
  'pragati.classrooms.v1': [classroom],
  'pragati.assignments.v1': assignments,
};

export const FIXTURE_FACTS = {
  students: students.length,
  studentsWithActivity: sessions.length,
  studentsNeverActive: students.length - sessions.length,
  activeAssignments: assignments.filter((a) => a.active).length,
  closedAssignments: assignments.filter((a) => !a.active).length,
  className: classroom.name,
};
