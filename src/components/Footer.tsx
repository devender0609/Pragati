// v0.50 §5 — the footer used to print the pre-pilot disclaimer on every
// screen, including a Class 1 student's Home. The limitation itself is
// real and must not disappear — it now shows only in teacher/admin
// context, where the person reading it can act on it.
export function Footer({ appMode = 'student' }: { appMode?: 'student' | 'teacher' }) {
  if (appMode !== 'teacher') {
    // Students get no footer chrome at all. The measurement caveats
    // live in "About this result" on the results screen.
    return null;
  }
  return (
    <footer className="mx-auto mt-10 max-w-5xl px-4 pb-10 text-center text-xs text-slate-500">
      Pragati prototype · Pre-pilot content · Not a calibrated assessment.
      Requires teacher validation and a calibration study before any
      operational use.
    </footer>
  );
}
