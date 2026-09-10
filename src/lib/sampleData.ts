// v0.18: sample classroom + students + sessions generator.
//
// Surfaces a non-empty teacher dashboard for first-run / demo / pilot
// rehearsal users. Designed to be safe to call multiple times (idempotent
// by student name + classroom id), and to be just as easy to delete.
//
// Everything created here is tagged with `sampleDataFlag = true` in
// localStorage at `pragati.sample_data.v1` so deleteSampleData() can clean
// up exactly what we added without touching real records.

import { ITEMS, type Item } from '../data/items';
import {
  findOrCreateStudent,
  loadSessions,
  saveSession,
} from './storage';
import { loadClassrooms, saveClassroom } from './classroomStore';
import type { Classroom } from './cloudStore';
import { SKILL_IDS_ORDERED, type Session, type SkillId, type SkillMode } from '../types';

const FLAG_KEY = 'pragati.sample_data.v1';
const SAMPLE_CLASSROOM_ID = 'sample-classroom-v0.18';
const SAMPLE_CLASSROOM_NAME = 'Demo classroom — Class 6A';
const SAMPLE_SCHOOL = 'Demo Public School';
const SAMPLE_GRADE = 'Class 6';

const SAMPLE_STUDENT_NAMES = [
  'Aanya Sharma',
  'Vihaan Kapoor',
  'Diya Iyer',
  'Arjun Patel',
  'Saanvi Reddy',
  'Kabir Singh',
];

type SampleFlag = {
  studentIds: string[];
  classroomId: string;
  sessionIds: string[];
  createdAt: number;
};

function readFlag(): SampleFlag | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(FLAG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Array.isArray(parsed.studentIds) &&
      Array.isArray(parsed.sessionIds) &&
      typeof parsed.classroomId === 'string'
    ) {
      return parsed as SampleFlag;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeFlag(flag: SampleFlag): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(FLAG_KEY, JSON.stringify(flag));
  } catch {
    /* ignore */
  }
}

export function hasSampleData(): boolean {
  return readFlag() !== null;
}

/**
 * Create the sample classroom + 6 students + ~12 mixed sessions if not
 * already present. Safe to call multiple times.
 */
export function seedSampleData(): { studentsCreated: number; sessionsCreated: number } {
  const existing = readFlag();
  if (existing) {
    return { studentsCreated: 0, sessionsCreated: 0 };
  }

  const studentIds: string[] = [];
  for (const name of SAMPLE_STUDENT_NAMES) {
    const s = findOrCreateStudent(name, SAMPLE_GRADE, SAMPLE_SCHOOL);
    studentIds.push(s.id);
  }

  // Create / update the sample classroom.
  const classrooms = loadClassrooms();
  const existingClass = classrooms.find((c) => c.id === SAMPLE_CLASSROOM_ID);
  const now = Date.now();
  const classroom: Classroom = {
    id: SAMPLE_CLASSROOM_ID,
    teacherUid: existingClass?.teacherUid ?? 'local-demo',
    name: SAMPLE_CLASSROOM_NAME,
    notes: `${SAMPLE_GRADE} · ${SAMPLE_SCHOOL} · sample data for the Pragati v0.18 demo.`,
    studentIds,
    archived: false,
    createdAt: existingClass?.createdAt ?? now,
    updatedAt: now,
  };
  saveClassroom(classroom);

  // Generate 2 sessions per student, drawn from a small skill mix so the
  // dashboards look populated. Each session has a deterministic mix of
  // correct + incorrect responses to keep the avg accuracy in a sensible
  // band (≈ 55–75% per student).
  const sessionIds: string[] = [];
  const sampleSkills: SkillMode[] = [
    'FR.03',
    'mixed_decimals',
    'FM.07',
    'GB.03',
    'AL.02',
    'GB.08',
    'mixed_geometry',
  ];

  let skillCursor = 0;
  for (let i = 0; i < studentIds.length; i++) {
    const studentId = studentIds[i];
    const studentName = SAMPLE_STUDENT_NAMES[i];
    for (let k = 0; k < 2; k++) {
      const skillMode = sampleSkills[skillCursor++ % sampleSkills.length];
      const session = buildSampleSession({
        studentId,
        studentName,
        skillMode,
        seed: i * 10 + k,
        completedDaysAgo: 2 + (k * 2),
        items: ITEMS,
      });
      if (session) {
        saveSession(session);
        sessionIds.push(session.id);
      }
    }
  }

  const flag: SampleFlag = {
    studentIds,
    classroomId: SAMPLE_CLASSROOM_ID,
    sessionIds,
    createdAt: now,
  };
  writeFlag(flag);

  return {
    studentsCreated: studentIds.length,
    sessionsCreated: sessionIds.length,
  };
}

/**
 * Remove ONLY the sample students, sessions, and classroom — leaves all
 * real records intact.
 */
export function deleteSampleData(): void {
  const flag = readFlag();
  if (!flag) return;

  // Remove sample sessions.
  try {
    const sessions = loadSessions();
    const next = sessions.filter((s) => !flag.sessionIds.includes(s.id));
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pragati.sessions.v1', JSON.stringify(next));
    }
  } catch {
    /* ignore */
  }

  // Remove sample classroom.
  try {
    const classrooms = loadClassrooms();
    const next = classrooms.filter((c) => c.id !== flag.classroomId);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pragati.classrooms.v1', JSON.stringify(next));
    }
  } catch {
    /* ignore */
  }

  // Remove sample students.
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('pragati.students.v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((s: { id: string }) => !flag.studentIds.includes(s.id));
          localStorage.setItem('pragati.students.v1', JSON.stringify(filtered));
        }
      }
    }
  } catch {
    /* ignore */
  }

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(FLAG_KEY);
    }
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Internal: deterministic session builder
// ---------------------------------------------------------------------------

function buildSampleSession(input: {
  studentId: string;
  studentName: string;
  skillMode: SkillMode;
  seed: number;
  completedDaysAgo: number;
  items: Item[];
}): Session | null {
  const { studentId, studentName, skillMode, seed, completedDaysAgo, items } = input;

  // Pick a small slice of items that match the skillMode.
  let pool: Item[] = [];
  if (skillMode === 'mixed') {
    pool = items.slice(0, 10);
  } else if (skillMode.startsWith('mixed_')) {
    const moduleId = skillMode.slice('mixed_'.length);
    pool = items.filter((it) => (SKILL_IDS_ORDERED as string[]).includes(it.skillId) && skillModuleFor(it.skillId) === moduleId);
  } else {
    pool = items.filter((it) => it.skillId === (skillMode as SkillId));
  }
  if (pool.length === 0) return null;

  const picked = pool.slice(0, Math.min(8, pool.length));
  const now = Date.now();
  const completedAt = now - completedDaysAgo * 24 * 60 * 60 * 1000;
  const startedAt = completedAt - 7 * 60 * 1000; // 7 minutes earlier

  // Deterministic per-item correctness: ~65% correct, with a seeded twist
  // that varies per student.
  const responses = picked.map((it, idx) => {
    const isCorrect = ((idx + seed) * 7) % 10 < 7; // ~70%
    const optionsLen = it.kind === 'mcq' ? it.options.length : 0;
    let chosenIndex = -1;
    let chosenText: string | undefined;
    let misconception: Session['responses'][number]['misconceptionTriggered'];
    if (it.kind === 'mcq') {
      if (isCorrect) {
        chosenIndex = it.correctIndex;
        misconception = 'none';
      } else {
        // pick a wrong option deterministically
        const wrong = (it.correctIndex + 1) % optionsLen;
        chosenIndex = wrong;
        misconception = it.options[wrong].misconception;
      }
    } else {
      if (isCorrect) {
        chosenText = it.acceptedAnswers[0];
        misconception = 'none';
      } else {
        const errorPick = it.errorPatterns[0];
        chosenText = errorPick?.answers[0] ?? '0';
        misconception = errorPick?.misconception ?? 'arithmetic_slip';
      }
    }
    const before = 4 + ((idx + seed) % 3);
    const after = before + (isCorrect ? 1 : -1);
    return {
      itemId: it.id,
      chosenIndex,
      ...(chosenText !== undefined ? { chosenText } : {}),
      correct: isCorrect,
      timeMs: 20_000 + ((seed + idx) % 5) * 5_000,
      difficultyAtAttempt: it.difficulty,
      abilityBefore: before,
      abilityAfter: after,
      misconceptionTriggered: misconception,
    };
  });

  const session: Session = {
    id: `sample-${studentId}-${seed}-${completedDaysAgo}`,
    studentId,
    studentSnapshot: {
      name: studentName,
      grade: SAMPLE_GRADE,
      school: SAMPLE_SCHOOL,
    },
    window: 'practice',
    skillId: skillMode,
    startedAt,
    completedAt,
    responses,
    finalAbility: responses[responses.length - 1]?.abilityAfter ?? 5,
  };

  return session;
}

// Tiny local helper so we don't pull in moduleForSkillMode and its
// import surface here. The mapping is fixed at this revision.
function skillModuleFor(skill: string): string {
  if (skill.startsWith('FR.')) return 'fractions';
  if (skill.startsWith('DE.')) return 'decimals';
  if (skill.startsWith('FM.')) return 'factors_multiples';
  if (skill.startsWith('RP.')) return 'ratio_proportion';
  if (skill.startsWith('AL.')) return 'algebra';
  if (skill.startsWith('GB.')) return 'geometry';
  return '';
}
