// v0.47 F — Original SVG chapter artwork.
//
// Every chapter card gets a small SVG illustration drawn here.
// Deliberately abstract mathematical imagery — number lines, shapes,
// fraction bars, coordinate grids — so we (a) avoid copying anyone
// else's mascots, (b) avoid emoji, and (c) reinforce the topic.
// All artwork uses currentColor so it inherits the grade tint.

import type { SVGProps } from 'react';

type ArtProps = SVGProps<SVGSVGElement> & {
  /** Tailwind text-* class that drives currentColor. Defaults to
   *  slate so cards without a grade colour still look intentional. */
  tint?: string;
};

function frame({ tint = 'text-slate-500', ...rest }: ArtProps) {
  return {
    width: 56,
    height: 56,
    viewBox: '0 0 56 56',
    className: tint,
    'aria-hidden': true,
    ...rest,
  } as const;
}

/** Fractions — a fraction bar and its half. */
export function ArtFractions(p: ArtProps) {
  return (
    <svg {...frame(p)}>
      <rect x="6" y="14" width="44" height="10" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="6" y="14" width="22" height="10" rx="2" fill="currentColor" opacity="0.55" />
      <line x1="28" y1="12" x2="28" y2="26" stroke="currentColor" strokeWidth="2" />
      <rect x="6" y="32" width="44" height="10" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="6" y="32" width="33" height="10" rx="2" fill="currentColor" opacity="0.55" />
      <line x1="17" y1="30" x2="17" y2="44" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <line x1="28" y1="30" x2="28" y2="44" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <line x1="39" y1="30" x2="39" y2="44" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
    </svg>
  );
}

/** Decimals — a number line with a decimal marker. */
export function ArtDecimals(p: ArtProps) {
  return (
    <svg {...frame(p)}>
      <line x1="6" y1="30" x2="50" y2="30" stroke="currentColor" strokeWidth="2" />
      {[10, 18, 26, 34, 42, 50].map((x, i) => (
        <line key={i} x1={x} y1="26" x2={x} y2="34" stroke="currentColor" strokeWidth="1.5" />
      ))}
      {[14, 22, 30, 38, 46].map((x, i) => (
        <line key={i} x1={x} y1="28" x2={x} y2="32" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      ))}
      <circle cx="32" cy="30" r="3.5" fill="currentColor" />
    </svg>
  );
}

/** Factors & multiples — a small array of dots. */
export function ArtFactors(p: ArtProps) {
  const rows = 4, cols = 6;
  const gap = 6, x0 = 10, y0 = 10;
  return (
    <svg {...frame(p)}>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <circle
            key={`${r}-${c}`}
            cx={x0 + c * gap}
            cy={y0 + r * gap}
            r={2.2}
            fill="currentColor"
            opacity={0.6}
          />
        ))
      )}
      <rect x="7" y="7" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

/** Ratio & proportion — two bars in ratio 2:3. */
export function ArtRatio(p: ArtProps) {
  return (
    <svg {...frame(p)}>
      <rect x="6" y="16" width="18" height="10" rx="2" fill="currentColor" opacity="0.55" />
      <rect x="6" y="30" width="27" height="10" rx="2" fill="currentColor" opacity="0.35" />
      <text x="46" y="22" fontSize="6" fill="currentColor" opacity="0.7">2</text>
      <text x="46" y="38" fontSize="6" fill="currentColor" opacity="0.7">3</text>
    </svg>
  );
}

/** Algebra — a balance scale sketch. */
export function ArtAlgebra(p: ArtProps) {
  return (
    <svg {...frame(p)}>
      <line x1="28" y1="10" x2="28" y2="42" stroke="currentColor" strokeWidth="2" />
      <line x1="12" y1="20" x2="44" y2="20" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="20" width="10" height="8" fill="currentColor" opacity="0.55" />
      <rect x="38" y="20" width="10" height="8" fill="currentColor" opacity="0.35" />
      <circle cx="28" cy="42" r="4" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/** Geometry — a triangle over a coordinate hint. */
export function ArtGeometry(p: ArtProps) {
  return (
    <svg {...frame(p)}>
      <line x1="8" y1="46" x2="48" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="8" y1="8" x2="8" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <polygon points="14,40 40,40 28,16" fill="currentColor" opacity="0.5" />
      <polygon points="14,40 40,40 28,16" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Fallback for unmapped chapters — an outline placeholder. */
export function ArtPlaceholder(p: ArtProps) {
  return (
    <svg {...frame(p)}>
      <rect x="8" y="10" width="40" height="36" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="14" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <line x1="14" y1="30" x2="34" y2="30" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <line x1="14" y1="38" x2="38" y2="38" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

/** Pick artwork by legacy module id. Falls back to placeholder. */
export function chapterArtFor(
  legacyModuleId: string | null | undefined,
  tintClass = 'text-slate-500'
) {
  switch (legacyModuleId) {
    case 'fractions':
      return <ArtFractions tint={tintClass} />;
    case 'decimals':
      return <ArtDecimals tint={tintClass} />;
    case 'factors_multiples':
      return <ArtFactors tint={tintClass} />;
    case 'ratio_proportion':
      return <ArtRatio tint={tintClass} />;
    case 'algebra':
      return <ArtAlgebra tint={tintClass} />;
    case 'geometry':
      return <ArtGeometry tint={tintClass} />;
    default:
      return <ArtPlaceholder tint={tintClass} />;
  }
}
