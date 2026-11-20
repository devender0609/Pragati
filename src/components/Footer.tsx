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
    // v0.78.1 §15 — SAME CLAIM, LESS SHOUTING.
    //
    // The sentence is correct and must not weaken. Printing it in full
    // under all six teacher destinations made the product read as a
    // research prototype rather than a tool, and a caveat repeated six
    // times a day is a caveat nobody reads by the third.
    //
    // It is now a disclosure the teacher opens. Closed, it names the
    // subject — how to read these numbers — which is the cue a teacher
    // needs; open, it says exactly what it always said, word for word.
    // Nothing is hidden behind a hover or a tooltip: the text is in the
    // DOM, findable and printable.
    <footer className="mx-auto mt-10 max-w-[84rem] px-4 pb-10">
      <details className="group mx-auto max-w-2xl rounded-xl bg-paper-200/60 px-4 py-3">
        <summary className="cursor-pointer list-none text-center text-xs font-semibold text-ink-500 marker:content-none">
          About these results
          <span className="ml-1 text-ink-300 group-open:hidden">▾</span>
          <span className="ml-1 hidden text-ink-300 group-open:inline">▴</span>
        </summary>
        <p className="mt-3 text-center text-xs leading-relaxed text-ink-500">
          Pragati does not produce a calibrated score. Results need teacher
          judgement, and a calibration study is required before any
          operational use.
        </p>
      </details>
    </footer>
  );
}
