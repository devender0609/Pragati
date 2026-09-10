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
    // v0.71 §16 — the caveat stays; the word "prototype" leaves the
    // teacher's daily chrome.
    //
    // Two claims were being made here at once. The FIRST — that Pragati
    // does not produce a calibrated score and needs a calibration study
    // before operational use — is the one that matters, is unchanged,
    // and must never disappear. The SECOND was a running commentary on
    // the software's maturity, printed under every teacher screen, which
    // told a teacher nothing they could act on.
    //
    // The full statement, including the pilot status, is in Admin &
    // Research and in the release documentation.
    <footer className="mx-auto mt-10 max-w-6xl px-4 pb-10 text-center text-xs text-slate-500">
      Pragati does not produce a calibrated score. Results need teacher
      judgement, and a calibration study is required before any operational
      use.
    </footer>
  );
}
