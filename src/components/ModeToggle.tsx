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
      className="ml-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200 sm:ml-2 sm:text-xs"
      title={`Switch to ${next} mode`}
    >
      {appMode === 'student' ? 'Student mode' : 'Teacher mode'}
    </button>
  );
}
