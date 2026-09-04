// v0.70 §1/§22 — ROUTE CONTRACTS FOR VISUAL QA.
//
// WHY THIS FILE EXISTS
//
// v0.69's harness navigated by clicking text and screenshotted whatever
// was on screen afterwards. When a click silently failed — and several
// did — it saved the previous screen under the next screen's filename.
// Two shipped captures prove it:
//
//   20-lesson-7_1-390.png   is Student Home. Not a lesson.
//   10-teacher-overview-390.png is Student Home, and reads STUDENT MODE.
//
// The manifest then reported "clean", because the only checks were
// overflow, tap size and console errors — every one of which a wrong
// screen passes perfectly. The v0.69 report's claim that lesson and
// teacher screens were visually reviewed was therefore unfounded.
//
// THE FIX
//
// A screenshot is not evidence unless it proves which screen it is. Each
// route declares text that MUST appear and text that MUST NOT, and the
// capture is refused rather than saved when a contract fails. A missing
// screenshot is an honest gap; a mislabelled one is a false claim.
//
// `mustNotContain` matters as much as `mustContain`: the teacher capture
// failed v0.69 not because it lacked teacher content but because it was
// still in Student mode, and only a negative assertion catches that.

/** @typedef {{ id: string, label: string, mustContain: string[], mustNotContain?: string[] }} RouteContract */

/** @type {Record<string, RouteContract>} */
export const ROUTE_CONTRACTS = {
  student_first_run: {
    id: 'student_first_run',
    label: 'Student Home — first run',
    // v0.71 §1/§2/§3/§22 — the first-run screen's new contract. The
    // negatives ARE the release: every one of them was on the v0.70
    // screen.
    mustContain: ['Welcome to Pragati', 'Class 6', 'Start learning'],
    // A first-run screen must not claim there is something to continue.
    // "Teacher dashboard" is NOT forbidden here: the first-run screen
    // legitimately offers a route into teacher mode, and asserting its
    // absence was a contract error, not an app defect. What matters is
    // that no continue-state is fabricated.
    mustNotContain: [
      'Continue learning',
      'Welcome back',
      // §2 — a weakness claim with zero recorded sessions.
      'weak skill',
      'No sessions yet',
      // §3 — an internal skill code on a student screen.
      'FR.02',
      // §4 — assessment leading a learning product.
      'Start recommended assessment',
      // §22 — words a Grade 6 student cannot use.
      'prototype',
      'calibrated',
      'item bank',
    ],
  },
  student_home_returning: {
    id: 'student_home_returning',
    label: 'Student Home — returning student',
    mustContain: ['Asha', 'Learn', 'Practice', 'Progress'],
    mustNotContain: ['Teacher dashboard', 'Admin & Research'],
  },
  student_learn: {
    id: 'student_learn',
    label: 'Class 6 Learn',
    mustContain: ['Class 6', 'Fractions', 'Patterns in Mathematics', 'Symmetry'],
    mustNotContain: ['Admin & Research'],
  },
  student_fractions: {
    id: 'student_fractions',
    label: 'Fractions chapter',
    mustContain: [
      'Fractions',
      'Chapter 7',
      'A Pinch of History',
      // §8 — availability stated in words, not as dots that read as
      // completion.
      'parts in this chapter',
      // §9 — legacy practice, in its own clearly labelled section.
      'Practice you can do now',
      // v0.72 §13 — the next action says what it actually opens.
      'not a chapter lesson',
    ],
    mustNotContain: [
      'Admin & Research',
      'FR.0',
      // THE v0.71 DEFECT: "START NEXT · 7.2 Fractional Units as Parts of
      // a Whole" named an official section whose own row, six lines
      // below, said Coming soon.
      'Start next',
    ],
  },
  student_lesson: {
    id: 'student_lesson',
    label: 'A lesson, on the route a student actually walks',
    //
    // v0.70 §27 — the contract v0.69 could never have met.
    //
    // §7.4 is the only section with authored official-section content
    // and it is UNPUBLISHED, so no student can open it. The lessons a
    // student can actually reach are the legacy skill lessons behind
    // §7.2, §7.5, §7.6 and §7.8.
    //
    // Requiring a lesson-only marker means a chapter page that merely
    // LISTS a lesson title cannot pass as the lesson — which is
    // precisely how v0.69 shipped Student Home under the filename
    // `20-lesson-7_1-390.png`.
    // The lesson body, not the chapter page that links to it. "Learn ·"
    // is the lesson header's own marker and appears on no other screen.
    mustContain: ['Learn ·'],
    mustNotContain: ['All chapters', 'Coming soon'],
  },
  // The §7.4 lesson renderer — worked examples, math visuals, the
  // redesigned blocks — is reachable ONLY through the Admin reviewer
  // preview, because the content is unpublished. Its contract lives
  // under `admin_` for that reason: labelling it a student capture
  // would repeat exactly the mislabelling this file exists to prevent.
  admin_lesson_74: {
    id: 'admin_lesson_74',
    label: '§7.4 lesson — the "Learn the idea" stage',
    mustContain: [
      'Marking Fraction Lengths on the Number Line',
      // v0.71 §12 — the stage bar, and the mistakes block that moved
      // onto this stage beside the idea it is about.
      'Learn the idea',
      'Think deeper',
      // NOT 'Watch out for': §7.4's four misconceptions live in the
      // FROZEN §7.4 map, not the chapter registry, so
      // `misconceptionsForSection` correctly returns none for it and the
      // block does not render. The contract was wrong, not the app —
      // asserting it would have forced a change to frozen content to
      // satisfy a screenshot.
      'Before you start',
    ],
    // The whole lesson is no longer on one page.
    mustNotContain: ['The big idea'],
  },
  admin_lesson_examples: {
    id: 'admin_lesson_examples',
    label: '§7.4 lesson — the worked-examples stage',
    mustContain: ['Worked example 1', 'Why', 'Answer'],
  },
  admin_lesson_deeper: {
    id: 'admin_lesson_deeper',
    label: '§7.4 lesson — the closing stage',
    mustContain: ['The big idea'],
    mustNotContain: ['Watch out for'],
  },
  admin_practice_interaction: {
    id: 'admin_practice_interaction',
    label: '§7.4 interactive practice, unanswered',
    mustContain: ['Practice'],
    mustNotContain: ['That is right', 'Not quite'],
  },
  admin_feedback_incorrect: {
    id: 'admin_feedback_incorrect',
    label: 'Incorrect-answer feedback — the DIAGNOSED case',
    // Either heading counts as incorrect: "Not quite — try again" for a
    // neutral response, "About that answer" where the response supports
    // a documented misconception. The lowercase word "answer" appeared
    // to work in v0.70 only because the whole lesson was on one page and
    // some other block happened to contain it — a contract that passes
    // for the wrong reason is the failure mode this file exists to stop.
    mustContain: ['About that answer'],
    mustNotContain: ['That is right'],
  },
  // v0.74 §9 — THE TAB THAT WAS NEVER INDEPENDENTLY CAPTURED.
  //
  // v0.73's harness walked Home, Learn, Fractions, a lesson, coming-soon
  // and Progress. Practice — a top-level destination in the bottom nav,
  // on every screen, at every width — was never captured or contracted.
  // It was assumed to work because nothing said it did not.
  student_practice: {
    id: 'student_practice',
    label: 'Student Practice',
    // The tab's own heading. The bare word "Practice" is in the nav on
    // every screen and would pass anywhere — the exact mistake the
    // Progress contract already documents.
    mustContain: ['Short practice sets'],
    mustNotContain: [
      'Admin & Research',
      'Teacher dashboard',
      // Raw skill IDs must never reach a student.
      'FR.0',
      // §7.4 is an unpublished draft. Practice must not offer it.
      'Marking Fraction Lengths',
      // Growth is a separate governed path and must not leak into
      // low-stakes practice.
      'Pragati Growth',
      'Growth Check',
    ],
  },
  student_progress: {
    id: 'student_progress',
    label: 'Student Progress',
    // The tab's own heading. The bare word "Progress" appears
    // in the nav on every screen and would pass anywhere.
    mustContain: ['What you have practised', 'parts started'],
    mustNotContain: [
      '% mastered',
      'mastery',
      // §6 — "Continue" with nothing started is semantically wrong, and
      // the v0.70 screen said exactly that while every row read
      // "Not started".
      'Continue: 7.1',
      // v0.72 §14 — and v0.71 then said "Start: 7.2 Fractional Units as
      // Parts of a Whole", naming an official section whose lesson is
      // unpublished, when what opened was legacy practice.
      'Start: 7.2',
    ],
  },
  student_coming_soon: {
    // v0.70 §27 established the requirement this contract exists to
    // enforce: a student must be able to see every chapter of the book
    // in its own order, and must be told plainly which ones are not
    // ready. That requirement is unchanged.
    //
    // v0.76 changed the WORDS. "Coming soon" is what a marketing page
    // says about a feature; "Being written" is what is actually
    // happening to these chapters, and it is the more honest of the
    // two. The contract now checks the new wording, with the same three
    // obligations: the first chapter, the last chapter, and an explicit
    // statement of unreadiness.
    mustContain: ['Chapter 1', 'Chapter 10', 'Being written'],
    mustNotContain: [],
  },

  teacher_overview: {
    id: 'teacher_overview',
    label: 'Teacher Overview',
    // §15/§16 — an onboarding path, not five denials, and no
    // "Prototype" stamped across a teacher's workspace.
    mustContain: ['Teacher', 'Set up your class'],
    // The v0.69 defect, as an assertion. A teacher capture taken in
    // student mode is not a teacher capture.
    mustNotContain: [
      'STUDENT MODE',
      'Prototype',
      'item-review counters',
      'No completed sessions in this class yet',
    ],
  },
  teacher_classes: {
    id: 'teacher_classes',
    label: 'Teacher — Classes / Students',
    // The nav item reads "Classes"; the view it opens is titled
    // "Students". Assert the VIEW, not the button that led to it —
    // asserting the button would pass on any screen showing the nav.
    mustContain: ['Students'],
    mustNotContain: ['STUDENT MODE'],
  },
  teacher_assign: {
    id: 'teacher_assign',
    label: 'Teacher — Assign',
    mustContain: ['Assign'],
    mustNotContain: ['STUDENT MODE'],
  },
  // v0.74 §11 — Assess, verified as its own workflow.
  //
  // The finding this contract records: Teacher → Assess is ENTIRELY the
  // formal Growth path. There is no ordinary instructional-check surface
  // behind it. That is defensible — Growth is frozen and the panel
  // refuses honestly rather than offering an assessment that cannot run
  // — but it must be LABELLED as formal Growth, or a teacher reads
  // "Assess" as everyday checking and finds a refusal.
  teacher_assess: {
    id: 'teacher_assess',
    label: 'Teacher — Assess (formal Growth path)',
    mustContain: [
      'Pragati Growth',
      // The separation, stated on the screen the teacher actually sees.
      'Separate from everyday practice',
    ],
    mustNotContain: [
      'STUDENT MODE',
      // Growth is frozen: no scale, no norms, no mastery claim may
      // appear on a teacher's assess screen.
      'RIT',
      'percentile',
      'mastery',
    ],
  },
  teacher_insights: {
    id: 'teacher_insights',
    label: 'Teacher — Insights',
    mustContain: ['Insights'],
    mustNotContain: ['STUDENT MODE'],
  },
  teacher_resources: {
    id: 'teacher_resources',
    label: 'Teacher — Resources',
    mustContain: ['Resources'],
    mustNotContain: ['STUDENT MODE'],
  },
  admin_home: {
    id: 'admin_home',
    label: 'Admin & Research',
    mustContain: ['Admin & Research'],
    mustNotContain: ['STUDENT MODE'],
  },
  admin_curriculum: {
    id: 'admin_curriculum',
    label: 'Admin — Classes 1–12 curriculum registry',
    mustContain: [
      'Class 10',
      'Class 12',
      'Unknown',
      // v0.71 §18 — Admin states its own identity and scope.
      'Curriculum evidence',
      // v0.72 §8 — the master matrix and the derived backlog.
      'Curriculum coverage',
      'Content backlog',
      'Every official record',
      // v0.73 — the authoring plan, and the number it must not bury.
      'Authoring plan',
      'Blocked on people, not engineering',
      // v0.74 §7 — the other half of that claim, which v0.73 omitted.
      'Blocked on engineering, not people',
      // v0.74 §20/§21 — seven grades that produce no backlog entries
      // must not be able to vanish from the surface that reports the
      // backlog.
      'Structure verification backlog',
      'still requiring primary textbook verification',
      // v0.74 §1/§4 — the Fractions median, named as an observation.
      'Observed Middle Stage Fractions shape',
      'production standard pending',
    ],
    mustNotContain: ['STUDENT MODE'],
  },
  admin_verification: {
    id: 'admin_verification',
    label: 'Admin — manual curriculum verification',
    mustContain: ['Verify a curriculum from its textbook'],
    mustNotContain: ['STUDENT MODE'],
  },
  admin_chapter_quality: {
    id: 'admin_chapter_quality',
    label: 'Admin — chapter quality summary',
    mustContain: ['quality summary', 'a1a3ff57'],
    mustNotContain: ['STUDENT MODE'],
  },
};

/**
 * Check a contract against the visible text of a page.
 *
 * Returns the failures, so a caller can report every problem at once
 * rather than the first one — a capture that is both the wrong screen
 * and in the wrong mode should say so.
 */
export function checkContract(contract, visibleText) {
  // Case-insensitive, because `innerText` returns text as RENDERED and
  // CSS `text-transform: uppercase` is used throughout for eyebrow
  // labels. A contract asserting "Chapter 7" would otherwise fail on a
  // page that displays "CHAPTER 7" — a false failure that would push
  // whoever maintains this toward loosening the contracts, which is how
  // a guard rots. Matching case-insensitively keeps the assertion
  // strict about CONTENT and indifferent to styling.
  const hay = visibleText.toLowerCase();
  const failures = [];
  for (const needle of contract.mustContain) {
    if (!hay.includes(needle.toLowerCase())) {
      failures.push(`missing required text: "${needle}"`);
    }
  }
  for (const needle of contract.mustNotContain ?? []) {
    if (hay.includes(needle.toLowerCase())) {
      failures.push(`contains forbidden text: "${needle}"`);
    }
  }
  return failures;
}
