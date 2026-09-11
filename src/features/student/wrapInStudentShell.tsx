// v0.49 §2 — wrap student-mode session content in the StudentShell
// chrome, with real navigation semantics.
//
// v0.48 kept the nav *visible* during a session but left it wired to
// setStudentTab while `view` stayed 'assessment' — so the tabs looked
// clickable and did nothing. This version takes an explicit `locked`
// flag and an exit handler, and hands both to the shell, which
// disables the tabs and shows Save & Exit instead.

import type { ReactNode } from 'react';
import { StudentShell } from './StudentShell';
import { loadStudents } from '../../lib/storage';
import { normalizeGrade } from '../../lib/gradeNormalization';
import type { AppMode } from '../../types';
import type { StudentTab } from './studentRouter';

export type ShellWrapOptions = {
  appMode: AppMode;
  selectedStudentId: string | null;
  studentTab: StudentTab;
  onSwitchTab: (t: StudentTab) => void;
  openChapterId: string | null;
  onOpenChapter: (id: string | null) => void;
  child: ReactNode;
  /** True only while questions are still being answered. Results and
   *  review screens are post-session and stay freely navigable. */
  locked?: boolean;
  onExitSession?: () => void;
  exitLabel?: string;
};

export function renderInStudentShell(opts: ShellWrapOptions): ReactNode {
  const {
    appMode, selectedStudentId, studentTab, onSwitchTab,
    openChapterId, onOpenChapter, child, locked = false,
    onExitSession, exitLabel,
  } = opts;

  // Teacher previews render bare on purpose — a teacher inspecting an
  // item should not see the student's bottom nav.
  if (appMode !== 'student') return child;
  const students = loadStudents();
  const active =
    (selectedStudentId
      ? students.find((s) => s.id === selectedStudentId)
      : null) ?? students[0] ?? null;
  if (!active) return child;
  const grade = normalizeGrade(active.grade);
  if (!grade) return child;

  return (
    <StudentShell
      activeTab={studentTab}
      onSwitchTab={onSwitchTab}
      openChapterId={openChapterId}
      onOpenChapter={onOpenChapter}
      studentGrade={grade}
      studentName={active.name}
      studentId={active.id}
      // Unreachable while sessionChild renders; the shell requires the
      // prop signatures regardless.
      onLaunchLesson={() => {}}
      onLaunchConceptPractice={() => {}}
      onLaunchMixedChapterPractice={() => {}}
      onLaunchChapterCheck={() => {}}
      sessionChild={child}
      sessionLocked={locked}
      onExitSession={onExitSession}
      exitLabel={exitLabel}
    />
  );
}

/** Legacy positional signature kept so any caller not yet migrated
 *  keeps compiling. New call sites should use `renderInStudentShell`. */
export function renderMaybeInStudentShell(
  appMode: AppMode,
  selectedStudentId: string | null,
  studentTab: StudentTab,
  onSwitchTab: (t: StudentTab) => void,
  openChapterId: string | null,
  onOpenChapter: (id: string | null) => void,
  child: ReactNode
): ReactNode {
  return renderInStudentShell({
    appMode, selectedStudentId, studentTab, onSwitchTab,
    openChapterId, onOpenChapter, child,
  });
}
