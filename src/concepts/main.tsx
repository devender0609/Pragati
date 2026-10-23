// ===========================================================================
// v0.77 — VISUAL EXPLORATION HARNESS.
//
// The instruction was explicit: three materially different Student Home
// concepts, judged as pictures, before anything propagates. So these do
// not live inside the product. `concepts.html` is a second Vite entry
// that renders one concept at a time, which means:
//
//   - the shipped app is untouched while the direction is undecided,
//     and its 1404 tests stay meaningful rather than becoming a
//     changing target;
//   - a rejected concept costs a deleted file, not a revert;
//   - all three read the SAME real curriculum functions the product
//     reads, so nothing here is a mock.
//
// PRODUCT TRUTH (§17). Every concept below calls class6ChapterCards()
// and officialChapterRows() — the same two functions Home uses. That
// means availability, the official/legacy distinction, the publication
// gate and the "part is genuinely open" rule are all inherited rather
// than restated. No concept invents a chapter, a section, a percentage
// or a streak. Where a concept has nothing real to show it shows the
// first-run state, which is the truth.
// ===========================================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { class6ChapterCards } from '../curriculum/studentChapterModel';
import { officialChapterRows } from '../features/student/OfficialChapterLanding';
import { relatedPracticeForChapter } from '../curriculum/sectionRouting';
import { sectionsForChapter } from '../curriculum/officialSections';
import { LearnC2 } from './LearnC2';
import { LessonC2 } from './LessonC2';
import { DirectionA } from './DirectionA';
import { DirectionB } from './DirectionB';
import { DirectionC } from './DirectionC';

export type ConceptChapter = {
  officialChapterId: string;
  number: number;
  title: string;
  available: boolean;
  statusLine: string;
  /**
   * v0.77 §3/§4 — the two facts a truthful status needs, kept apart.
   *
   * C1 collapsed both into one "available" flag and then wrote "Ready
   * to learn" over the top of it. A chapter whose only openable content
   * is legacy practice is NOT a chapter with a lesson, and the screen
   * must be able to tell the difference before it can tell the truth.
   */
  hasOfficialLesson: boolean;
  hasPractice: boolean;
};

export type ConceptPart = {
  officialSectionId: string;
  sectionNumber: string;
  title: string;
};

/**
 * v0.77 §4 — the returning state.
 *
 * SEEDED, AND SAID SO. There is no real Asha, so a returning student's
 * activity has to come from somewhere. It comes from one deterministic
 * seed defined here, not from numbers sprinkled into the components:
 * a single unfinished set and two completed activities, from which every
 * figure on the screen is derived by the same rules the first-run state
 * uses. Nothing is a mastery score, a percentage or a streak, because
 * Pragati does not compute those and a demo must not imply it does.
 */
export type ConceptActivity = {
  completedSessions: number;
  answered: number;
  completedActivities: string[];
  unfinished: { activityName: string; remaining: number } | null;
};

export type ConceptPractice = {
  /** Plain student-facing name. Never a skill code. */
  name: string;
};

export type ConceptData = {
  studentName: string;
  gradeLabel: string;
  chapters: ConceptChapter[];
  current: ConceptChapter;
  /** Official sections of the current chapter that are student-eligible. */
  officialLessons: ConceptPart[];
  /** Legacy activities, named the way the shipped chapter landing names them. */
  practice: ConceptPractice[];
  partsTotal: number;
  activity: ConceptActivity;
};

function chapterFacts(officialChapterId: string) {
  const rows = officialChapterRows(officialChapterId, 'concept-preview');
  const official = rows.filter((r) => r.provenance === 'official_section_content');
  // The canonical helper — the same one the shipped chapter landing
  // uses. It de-duplicates the three §7.8 skills that share one name and
  // never returns a skill code.
  const practice = relatedPracticeForChapter(
    sectionsForChapter(officialChapterId).map((s) => ({
      officialSectionId: s.officialSectionId,
      sectionNumber: s.sectionNumber,
    }))
  );
  return { rows, official, practice };
}

const FIRST_RUN: ConceptActivity = {
  completedSessions: 0,
  answered: 0,
  completedActivities: [],
  unfinished: null,
};

function returningActivity(practice: ConceptPractice[]): ConceptActivity {
  return {
    completedSessions: 3,
    answered: 27,
    completedActivities: practice.slice(0, 2).map((p) => p.name),
    unfinished: practice[2]
      ? { activityName: practice[2].name, remaining: 4 }
      : null,
  };
}

function buildData(returning: boolean): ConceptData {
  const cards = class6ChapterCards();
  const chapters: ConceptChapter[] = cards.map((c) => {
    const f = chapterFacts(c.officialChapterId);
    return {
      officialChapterId: c.officialChapterId,
      number: c.number,
      title: c.title,
      available: c.availability === 'available',
      statusLine: c.statusLine,
      hasOfficialLesson: f.official.length > 0,
      hasPractice: f.practice.length > 0,
    };
  });
  const current =
    chapters.find((c) => c.hasOfficialLesson) ??
    chapters.find((c) => c.hasPractice) ??
    chapters[0];
  const f = chapterFacts(current.officialChapterId);
  const practice: ConceptPractice[] = f.practice.map((p) => ({ name: p.name }));
  return {
    studentName: 'Asha',
    gradeLabel: 'Class 6',
    chapters,
    current,
    officialLessons: f.official.map((r) => ({
      officialSectionId: r.officialSectionId,
      sectionNumber: r.sectionNumber,
      title: r.title,
    })),
    practice,
    partsTotal: f.rows.length,
    activity: returning ? returningActivity(practice) : FIRST_RUN,
  };
}

const q = new URLSearchParams(window.location.search);
const which = q.get('c') ?? 'a';
const page = q.get('p') ?? 'home';
const data = buildData(q.get('state') === 'returning');
const Concept =
  page === 'learn'
    ? LearnC2
    : page === 'lesson'
      ? LessonC2
      : which === 'b'
        ? DirectionB
        : which === 'c'
          ? DirectionC
          : DirectionA;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Concept data={data} />
  </StrictMode>
);
