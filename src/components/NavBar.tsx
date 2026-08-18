// v0.18: NavBar uses the unified AccountMenu for sign-in / signup / sync.
//
// Changes vs v0.17:
//   - Removed duplicate "Sign-in" button + duplicate SyncStatusBadge "Sign in
//     to sync" pill. There is now ONE account area on the right of the nav.
//   - When in teacher mode, the AccountMenu renders the sync pill + dropdown.
//     When in student mode, the account area is hidden (students should not
//     see teacher sign-in).
//   - Teacher and student mode now use a distinct accent on the active
//     dashboard pill (brand for teacher, violet for student) so the two
//     modes feel visibly different at a glance.

import { getActivePilot } from '../lib/storage';
import type { AppMode } from '../types';
import { AccountMenu } from './AccountMenu';
import { ModeToggle } from './ModeToggle';
import { LanguageSwitcher } from './common/LanguageSwitcher';

const LEARN_VIEWS = new Set(['class6math', 'module', 'learn', 'learningPath']);
const TEACHER_VIEWS = new Set([
  'teacher',
  'teacherLanding',
  'studentDetail',
  'classDashboard',
  'itemReview',
  'pilotSetup',
  'teachingPlan',
  'alignmentReview',
  'assignments',
  'assignmentForm',
  'pilotReport',
  'classrooms',
]);

export function NavBar({
  view,
  appMode,
  onSetAppMode,
  onNavLanding,
  onNavLearn,
  onNavTeacher,
  onOpenSignIn,
  onOpenSignUp,
}: {
  view: string;
  appMode: AppMode;
  onSetAppMode: (m: AppMode) => void;
  onNavLanding: () => void;
  onNavLearn: () => void;
  onNavTeacher: () => void;
  // v0.18: both open the unified TeacherLoginModal, in different initial
  // modes. Optional so callers that haven't been updated still type-check.
  onOpenSignIn?: () => void;
  onOpenSignUp?: () => void;
}) {
  const learnActive = LEARN_VIEWS.has(view);
  const teacherActive = TEACHER_VIEWS.has(view);
  const activePilot = getActivePilot();

  // Teacher mode = brand (orange/red family), Student mode = violet.
  // Surfaces in the active dashboard pill and on the Pragati logo.
  const accentLogo =
    appMode === 'teacher'
      ? 'bg-brand-600'
      : 'bg-violet-600';
  const accentPill =
    appMode === 'teacher'
      ? 'bg-brand-50 text-brand-700 ring-brand-200'
      : 'bg-violet-50 text-violet-700 ring-violet-200';

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <button
          onClick={onNavLanding}
          className="flex min-h-[44px] items-center gap-2 text-left"
        >
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold text-white shadow-sm ${accentLogo}`}
          >
            P
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-slate-900">Pragati</div>
            <div className="text-xs text-slate-500">
              {appMode === 'teacher'
                ? 'Teacher console · Class 6 Math'
                : 'Learn and practise maths'}
            </div>
          </div>
          <div className="block sm:hidden text-sm font-semibold text-slate-900">
            Pragati
          </div>
        </button>
        <nav className="flex min-w-0 flex-wrap items-center justify-end gap-1 text-sm sm:gap-2">
          {appMode === 'teacher' && activePilot && (
            <span
              className="hidden items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 sm:inline-flex"
              title={`Active pilot: ${activePilot.teacherName} · ${activePilot.className} (${activePilot.school})`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Pilot
            </span>
          )}
          {appMode === 'teacher' && onOpenSignIn && onOpenSignUp && (
            <span className="hidden sm:inline-flex">
              <AccountMenu
                onOpenAuth={onOpenSignIn}
                onOpenSignUp={onOpenSignUp}
              />
            </span>
          )}
          {appMode === 'teacher' && (
            <>
              <button
                onClick={onNavLearn}
                className={`inline-flex min-h-[44px] items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition sm:px-3 ${
                  learnActive
                    ? accentPill + ' ring-1'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Learn
              </button>
              <button
                onClick={onNavTeacher}
                className={`inline-flex min-h-[44px] items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition sm:px-3 ${
                  teacherActive
                    ? accentPill + ' ring-1'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="hidden sm:inline">Teacher dashboard</span>
                <span className="sm:hidden">Teacher</span>
              </button>
            </>
          )}
          <ModeToggle appMode={appMode} onSetAppMode={onSetAppMode} />
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
