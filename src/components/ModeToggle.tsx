import type { AppMode } from '../types';

// Compact "Student mode ↔ Teacher mode" pill in the navbar.
// Extracted from App.tsx in v0.15. Behavior unchanged.
export function ModeToggle({
  appMode,
  onSetAppMode,
}: {
  appMode: AppMode;
  onSetAppMode: (m: AppMode) => void;
}) {
  const next: AppMode = appMode === 'student' ? 'teacher' : 'student';
  return (
    <button
      onClick={() => onSetAppMode(next)}
      // v0.76 §11 — was set in uppercase with tracking, which is the
      // template tell §2 names. Sentence case reads as a person wrote it.
      className="ml-1 inline-flex min-h-[44px] items-center rounded-full bg-ink-50 px-4 py-1 text-xs font-semibold text-ink-600 transition hover:bg-ink-100 sm:ml-2 sm:text-[0.8rem]"
      title={`Switch to ${next} mode`}
    >
      {appMode === 'student' ? 'Student mode' : 'Teacher mode'}
    </button>
  );
}
