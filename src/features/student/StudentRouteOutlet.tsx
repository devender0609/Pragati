// v0.49 §1 + §12 — StudentRouteOutlet.
//
// The whole ordinary student journey now renders through this one
// component, inside a single StudentShell instance:
//
//   Home → Learn → Chapter → Concept lesson → Guided practice →
//   Mixed practice → Chapter check → Results → Mistake review →
//   Chapter progress
//
// Before this, `view === 'learn'` rendered LearnView bare at the top
// level of App.tsx, so opening a concept lesson dropped the student
// out of the new shell and back into the old Class 6 chrome. Only the
// assessment / results / learningPath branches were wrapped.
//
// What the outlet preserves across a route change (the reason it owns
// this state rather than App.tsx):
//   - active chapter (openChapterId)
//   - active concept (lessonSkillId)
//   - active tab
//   - back behaviour and the return destination
//   - the running session, via `sessionChild`
//
// App.tsx still owns the assessment engine itself. The outlet receives
// the in-flight session as a child and the launch callbacks as props,
// so no session state moved in this refactor — only the routing did.

import type { ReactNode } from 'react';
import { StudentShell } from './StudentShell';
import { LearnView } from '../../components/LearnView';
import { ConceptChooser } from './ConceptChooser';
import { resolveChapter } from '../../curriculum/chapterResolver';
import { ITEMS } from '../../data/items';
import type { Grade, ModuleId, SkillId, SkillMode } from '../../types';
import type { StudentTab } from './studentRouter';

/** Where the student is inside the shell. `tab` and `chapter` are the
 *  browsing states; `lesson` is a concept page opened from a chapter;
 *  `session` means an assessment/results child is being rendered. */
export type StudentLocation =
  | { kind: 'tab' }
  | { kind: 'lesson'; skillId: SkillId; returnChapterId: string | null }
  // v0.50 §3 — the concept chooser is a route inside the shell, so the
  // student keeps their nav and can back out without losing context.
  | { kind: 'conceptChooser'; moduleId: ModuleId | null; chapterId: string };

export type StudentRouteOutletProps = {
  studentGrade: Grade;
  studentName: string;
  studentId: string;

  activeTab: StudentTab;
  onSwitchTab: (t: StudentTab) => void;

  openChapterId: string | null;
  onOpenChapter: (id: string | null) => void;

  /** The concept lesson currently open, or null when browsing. */
  location: StudentLocation;
  onSetLocation: (loc: StudentLocation) => void;

  onLaunchConceptPractice: (skillId: SkillId) => void;
  onLaunchMixedChapterPractice: (moduleId: ModuleId) => void;
  onLaunchChapterCheck: (moduleId: ModuleId) => void;
  /** Guided practice launched from inside a concept lesson. */
  onLaunchFromLesson: (mode: SkillMode) => void;

  /** Rendered in place of the tab body while a session (or its
   *  results) is on screen. */
  sessionChild?: ReactNode;
  sessionLocked?: boolean;
  onExitSession?: () => void;
  /** §1 — resume an unfinished set. */
  onResumeSession?: (sessionId: string) => void;
};

export function StudentRouteOutlet(props: StudentRouteOutletProps) {
  const {
    studentGrade, studentName, studentId,
    activeTab, onSwitchTab,
    openChapterId, onOpenChapter,
    location, onSetLocation,
    onLaunchConceptPractice,
    onLaunchMixedChapterPractice,
    onLaunchChapterCheck,
    onLaunchFromLesson,
    sessionChild, sessionLocked, onExitSession, onResumeSession,
  } = props;

  // A concept lesson is a route WITHIN the shell, not a replacement
  // for it. Rendering it through `sessionChild` is what keeps the
  // student inside one coherent experience — the shell chrome, the
  // tabs, and the grade header all persist.
  const lessonChild =
    location.kind === 'lesson' ? (
      <LearnView
        skill={location.skillId}
        studentId={studentId}
        onBack={() => {
          // Back returns to wherever the lesson was opened from: the
          // chapter page when there was one, otherwise the Learn tab.
          onSetLocation({ kind: 'tab' });
          onOpenChapter(location.returnChapterId);
        }}
        onStartAssessment={onLaunchFromLesson}
        onOpenLesson={(s) =>
          onSetLocation({
            kind: 'lesson',
            skillId: s,
            returnChapterId: location.returnChapterId,
          })
        }
      />
    ) : null;

  // §3 — the concept chooser. When a chapter has exactly one concept
  // with questions there is no choice to make, so we launch it directly
  // rather than showing a one-item list.
  const chooserChild = (() => {
    if (location.kind !== 'conceptChooser') return null;
    const resolved = resolveChapter(location.chapterId);
    const skillIds = (resolved?.inventory.mapping.skillIds ?? []) as SkillId[];
    const usable = skillIds.filter((s) =>
      ITEMS.some((i) => i.skillId === s)
    );
    if (usable.length === 1) {
      onLaunchConceptPractice(usable[0]);
      return null;
    }
    return (
      <ConceptChooser
        chapterTitle={resolved?.displayTitle ?? 'Practice'}
        skillIds={usable}
        studentId={studentId}
        onChoose={(skill) => {
          onSetLocation({ kind: 'tab' });
          onLaunchConceptPractice(skill);
        }}
        onBack={() => onSetLocation({ kind: 'tab' })}
      />
    );
  })();

  return (
    <StudentShell
      activeTab={activeTab}
      onSwitchTab={onSwitchTab}
      openChapterId={openChapterId}
      onOpenChapter={onOpenChapter}
      studentGrade={studentGrade}
      studentName={studentName}
      studentId={studentId}
      onLaunchLesson={(skillId) =>
        onSetLocation({
          kind: 'lesson',
          skillId,
          returnChapterId: openChapterId,
        })
      }
      onLaunchConceptPractice={onLaunchConceptPractice}
      onLaunchMixedChapterPractice={onLaunchMixedChapterPractice}
      onLaunchChapterCheck={onLaunchChapterCheck}
      // A live session outranks an open lesson; when neither is set the
      // shell renders its own tab/chapter body.
      onChooseConcept={(moduleId, chapterId) =>
        onSetLocation({ kind: 'conceptChooser', moduleId, chapterId })
      }
      sessionChild={sessionChild ?? lessonChild ?? chooserChild ?? undefined}
      sessionLocked={sessionLocked}
      onExitSession={onExitSession}
      onResumeSession={onResumeSession}
    />
  );
}
