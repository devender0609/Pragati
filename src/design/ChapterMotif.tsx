// v0.69 §5 — MATHEMATICAL CHAPTER MOTIFS.
//
// Every motif draws the MATHEMATICS of its chapter. Not a generic book,
// not a decorative squiggle, and explicitly not emoji — emoji render
// differently on every platform, cannot be recoloured, and would make a
// maths product look like a chat app.
//
// Each is a plain inline SVG on a 24×24 grid using `currentColor`, so a
// chapter's accent hue flows in from the parent and the motif works on
// any background at any size.
//
// They are DECORATIVE in the accessibility sense: the chapter title is
// always adjacent as real text, so every motif is aria-hidden. A
// screen-reader user hearing "pattern icon, Patterns in Mathematics"
// has been told the same thing twice.

export type MotifKey =
  | 'patterns'
  | 'lines_angles'
  | 'number_play'
  | 'data_handling'
  | 'prime_time'
  | 'perimeter_area'
  | 'fractions'
  | 'constructions'
  | 'symmetry'
  | 'integers'
  | 'generic';

const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function Body({ motif }: { motif: MotifKey }) {
  switch (motif) {
    // Repeating tiles — the chapter is about growing/repeating structure.
    case 'patterns':
      return (
        <>
          <rect x="3" y="3" width="6" height="6" rx="1" {...P} />
          <rect x="12" y="3" width="6" height="6" rx="1" fill="currentColor" opacity="0.28" stroke="none" />
          <rect x="3" y="12" width="6" height="6" rx="1" fill="currentColor" opacity="0.28" stroke="none" />
          <rect x="12" y="12" width="6" height="6" rx="1" {...P} />
          <circle cx="21" cy="21" r="1.1" fill="currentColor" />
        </>
      );
    // Two rays from a vertex with the angle arc drawn — the actual object.
    case 'lines_angles':
      return (
        <>
          <path d="M4 20 L20 20" {...P} />
          <path d="M4 20 L17 6" {...P} />
          <path d="M11 20 A7 7 0 0 0 8.6 14.8" {...P} strokeWidth={1.3} />
        </>
      );
    // A numeral grid — number play is arranging and rearranging numbers.
    case 'number_play':
      return (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2.5" {...P} />
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18" {...P} strokeWidth={1.1} opacity="0.55" />
          <circle cx="6" cy="6" r="1.2" fill="currentColor" />
          <circle cx="18" cy="18" r="1.2" fill="currentColor" />
        </>
      );
    // A bar chart, because the chapter is about presenting data.
    case 'data_handling':
      return (
        <>
          <path d="M3 21h18" {...P} />
          <rect x="5" y="12" width="3.6" height="9" rx="0.8" fill="currentColor" opacity="0.35" stroke="none" />
          <rect x="10.2" y="7" width="3.6" height="14" rx="0.8" fill="currentColor" opacity="0.6" stroke="none" />
          <rect x="15.4" y="14.5" width="3.6" height="6.5" rx="0.8" fill="currentColor" opacity="0.35" stroke="none" />
        </>
      );
    // A number branching into two factors.
    case 'prime_time':
      return (
        <>
          <circle cx="12" cy="5" r="2.6" {...P} />
          <path d="M10.2 7.2 L6.6 12.4M13.8 7.2 L17.4 12.4" {...P} />
          <circle cx="5.5" cy="15" r="2.6" {...P} />
          <circle cx="18.5" cy="15" r="2.6" {...P} />
          <path d="M5.5 18.4v2M18.5 18.4v2" {...P} strokeWidth={1.2} />
        </>
      );
    // A rectangle with its boundary emphasised and its interior tiled —
    // perimeter and area, distinguished, in one figure.
    case 'perimeter_area':
      return (
        <>
          <rect x="3.5" y="6" width="17" height="12" rx="1.5" {...P} strokeWidth={2} />
          <path d="M8.5 6v12M13.5 6v12M18 6v12M3.5 12h17" {...P} strokeWidth={0.9} opacity="0.5" />
        </>
      );
    // A circle with one of four equal parts shaded — a unit fraction.
    case 'fractions':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" {...P} />
          <path d="M12 3.5 A8.5 8.5 0 0 1 20.5 12 L12 12 Z" fill="currentColor" opacity="0.45" stroke="none" />
          <path d="M12 3.5v17M3.5 12h17" {...P} strokeWidth={1.2} />
        </>
      );
    // A compass: the tool the chapter is named for.
    case 'constructions':
      return (
        <>
          <circle cx="12" cy="4.6" r="1.7" {...P} />
          <path d="M11 6.1 L6 20M13 6.1 L18 20" {...P} />
          <path d="M6 20 L4.4 21.5M18 20 L19.6 21.5" {...P} strokeWidth={1.2} />
          <path d="M8.2 14.6 A6 6 0 0 0 15.8 14.6" {...P} strokeWidth={1.1} opacity="0.6" />
        </>
      );
    // A shape and its mirror image across a dashed axis.
    case 'symmetry':
      return (
        <>
          <path d="M12 2.5v19" stroke="currentColor" strokeWidth={1.3} strokeDasharray="2.5 2.5" fill="none" />
          <path d="M10 6 L4 12 L10 18 Z" fill="currentColor" opacity="0.4" stroke="none" />
          <path d="M14 6 L20 12 L14 18 Z" {...P} />
        </>
      );
    // A number line crossing zero — the chapter is literally about that.
    case 'integers':
      return (
        <>
          <path d="M2.5 12h19" {...P} />
          <path d="M6 9.2v5.6M12 8.2v7.6M18 9.2v5.6" {...P} strokeWidth={1.3} />
          <path d="M2.5 12 L4.4 10.4M2.5 12 L4.4 13.6M21.5 12 L19.6 10.4M21.5 12 L19.6 13.6" {...P} strokeWidth={1.2} />
          <circle cx="12" cy="12" r="1.8" fill="currentColor" />
        </>
      );
    default:
      return (
        <>
          <circle cx="12" cy="12" r="8.5" {...P} />
          <path d="M8.5 12h7M12 8.5v7" {...P} />
        </>
      );
  }
}

export function ChapterMotif({
  motif,
  className = 'h-6 w-6',
}: {
  motif: MotifKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      // Decorative: the chapter title is always present as real text.
      aria-hidden="true"
      focusable="false"
    >
      <Body motif={motif} />
    </svg>
  );
}

/**
 * Motif for an official Class 6 chapter.
 *
 * Keyed on the stable official chapter ID, not on the title, so
 * rewording a title cannot silently change a chapter's identity. An
 * unrecognised chapter gets a neutral mark rather than a wrong one.
 */
export function motifForChapter(officialChapterId: string): MotifKey {
  const map: Record<string, MotifKey> = {
    ncert_gp_c6_ch01_patterns: 'patterns',
    ncert_gp_c6_ch02_lines_angles: 'lines_angles',
    ncert_gp_c6_ch03_number_play: 'number_play',
    ncert_gp_c6_ch04_data_handling: 'data_handling',
    ncert_gp_c6_ch05_prime_time: 'prime_time',
    ncert_gp_c6_ch06_perimeter_area: 'perimeter_area',
    ncert_gp_c6_ch07_fractions: 'fractions',
    ncert_gp_c6_ch08_constructions: 'constructions',
    ncert_gp_c6_ch09_symmetry: 'symmetry',
    ncert_gp_c6_ch10_other_side_of_zero: 'integers',
  };
  return map[officialChapterId] ?? 'generic';
}

/** Chapter accent hue, by chapter number. Recognition, never status. */
export function chapterAccent(n: number): string {
  const hues = [
    '#7c3aed', '#0284c7', '#059669', '#d97706', '#db2777',
    '#0d9488', '#4f46e5', '#ea580c', '#9333ea', '#0891b2',
  ];
  return hues[(n - 1 + hues.length) % hues.length];
}
