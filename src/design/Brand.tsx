// v0.69 §3 — PRODUCT IDENTITY.
//
// v0.68 branded the product with a blue square containing the letter
// "P". That is the default every internal tool ships with, and it says
// nothing about what Pragati is.
//
// THE MARK — v0.76 §3
//
// v0.69 replaced the letter P with three ascending bars carrying a
// chevron. That was better than a letter in a square, and it was still
// a generic growth glyph: swap the wordmark and it belongs to any
// analytics product shipped in the last decade.
//
// The mark now draws the product's own geometry. Pragati (प्रगति) means
// progress, and the mark is one continuous line rising left to right,
// looping once around the centre of a nine-dot lattice — the pulli grid
// a kolam is set out on, which is the pattern language every chapter
// illustration in the product is constructed with.
//
// Two claims in one figure: a single unbroken path that rises, and the
// lattice it is drawn on. It is still geometric and still scales to a
// favicon, but it now shares its construction with the artwork, which
// is what §3's real test asks for — remove the wordmark and the
// screenshot should still be recognisably Pragati.

export function PragatiMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pragati-mark" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0D1426" />
          <stop offset="58%" stopColor="#1B2A56" />
          <stop offset="100%" stopColor="#3C2F86" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11.5" fill="url(#pragati-mark)" />

      {/* The pulli lattice the whole product is drawn on. Nine dots,
          which is the smallest grid a kolam is ever set out on. */}
      {[11, 20, 29].map((x) =>
        [11, 20, 29].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={1.15} fill="#ffffff" opacity={0.26} />
        ))
      )}

      {/* One continuous line, rising, looping once around the centre
          dot. A kolam is a single path that never lifts; progress is a
          single path that rises. The mark is both statements at once,
          and it is drawn with the same geometry as every chapter
          illustration in the product. */}
      <path
        d="M8 32 L14.4 25.6 A5 5 0 1 0 25.6 14.4 L32 8"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.9"
        strokeLinecap="round"
      />
      {/* The three dots the line actually touches, in the identity
          accent — the only place saffron carries no status meaning. */}
      <circle cx="20" cy="20" r="2" fill="#F7BE4C" />
      <circle cx="32" cy="8" r="2.5" fill="#F7BE4C" />
    </svg>
  );
}

/**
 * The wordmark.
 *
 * The Devanagari प्रगति sits under the Latin wordmark at full size. It
 * is not decoration: this is an Indian product, the name is a Hindi
 * word, and showing it in its own script is the cheapest possible
 * signal that the product knows where it is. It is hidden at `compact`
 * size, where it would be illegible rather than meaningful.
 */
export function PragatiWordmark({
  compact = false,
  subtitle,
}: {
  compact?: boolean;
  subtitle?: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <PragatiMark className={compact ? 'h-8 w-8' : 'h-9 w-9'} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-bold tracking-tight text-ink-900">
          Pragati
        </span>
        {compact ? null : (
          <span className="mt-0.5 text-[0.65rem] font-medium text-slate-400" lang="hi">
            प्रगति
          </span>
        )}
        {subtitle ? (
          <span className="mt-0.5 text-[0.7rem] font-medium text-slate-500">
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
