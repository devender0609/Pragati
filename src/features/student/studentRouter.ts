// v0.47 A — Student route model.
//
// Replaces the closed View union for student mode with a small,
// explicit route model that the StudentShell renders. Legacy view
// IDs (from App.tsx's View union) still resolve — see the
// mapLegacyViewToStudentRoute compatibility adapter.

export type StudentTab = 'home' | 'learn' | 'practice' | 'progress';

export type StudentRoute =
  | { kind: 'tab'; tab: StudentTab }
  | { kind: 'chapter'; officialChapterId: string }
  | { kind: 'lesson'; skillId: string }
  | { kind: 'assessment' } // in-session; App.tsx owns the actual run
  | { kind: 'results' }
  | { kind: 'learning_path' }
  | { kind: 'join_classroom' };

export const DEFAULT_STUDENT_ROUTE: StudentRoute = { kind: 'tab', tab: 'home' };

/** Compatibility: turn a legacy App.tsx `view` string into a student
 *  route. Legacy views the student flow never uses (teacher-only)
 *  return null. */
export function mapLegacyViewToStudentRoute(
  view: string
): StudentRoute | null {
  switch (view) {
    case 'landing':
    case 'startForm':
    case 'assessmentPicker':
    case 'class6math':
    case 'module':
      return { kind: 'tab', tab: 'home' };
    case 'learn':
      // legacy learn passed a skillId separately — the shell will hand
      // that through to the lesson slot.
      return { kind: 'tab', tab: 'learn' };
    case 'assessment':
      return { kind: 'assessment' };
    case 'results':
      return { kind: 'results' };
    case 'learningPath':
      return { kind: 'learning_path' };
    case 'joinClassroom':
      return { kind: 'join_classroom' };
    default:
      return null;
  }
}
