// ===========================================================================
// v0.84.0-c11.14 checkpoint 84C — RENDERER FOR VENN DIAGRAMS.
//
// WHY THIS IS ONLY APPEARING NOW
//
// `VennSpec` was built at checkpoint 79, validated, and attached to eight
// figures across six Sets lessons. It was never given a branch in the
// LearnSectionView dispatch, so every one of them has rendered nothing for
// five checkpoints.
//
// Checkpoint 82 found exactly this defect in two graph specs and established
// the four-layer rule that has governed every visual since. The rule caught
// every NEW spec and never looked back at the oldest one. The visual-presence
// regression in this checkpoint is what finally did.
//
// Shading is driven by the region expression the spec names, so the picture
// cannot claim a region the semantics did not.
// ===========================================================================

import type { VennSpec } from '../../curriculum/setTheory';

const W = 300, H = 200;
const LEFT = { cx: 120, cy: 105, r: 62 };
const RIGHT = { cx: 180, cy: 105, r: 62 };

export function VennDiagram({ spec }: { spec: VennSpec }) {
  const shaded = new Set(spec.shaded as unknown as string[]);
  const uid = spec.id;

  return (
    <figure className="my-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ maxWidth: W, height: 'auto' }}
        role="img"
        aria-label={spec.altText}
      >
        <title>{spec.altText}</title>
        <defs>
          {/* A shades only where it is not also in B. */}
          <mask id={`${uid}-a-only`}>
            <rect x={0} y={0} width={W} height={H} fill="white" />
            <circle cx={RIGHT.cx} cy={RIGHT.cy} r={RIGHT.r} fill="black" />
          </mask>
          <mask id={`${uid}-b-only`}>
            <rect x={0} y={0} width={W} height={H} fill="white" />
            <circle cx={LEFT.cx} cy={LEFT.cy} r={LEFT.r} fill="black" />
          </mask>
          {/* Outside both, within the universe rectangle. */}
          <mask id={`${uid}-outside`}>
            <rect x={6} y={6} width={W - 12} height={H - 12} fill="white" />
            <circle cx={LEFT.cx} cy={LEFT.cy} r={LEFT.r} fill="black" />
            <circle cx={RIGHT.cx} cy={RIGHT.cy} r={RIGHT.r} fill="black" />
          </mask>
          <clipPath id={`${uid}-both`}>
            <circle cx={LEFT.cx} cy={LEFT.cy} r={LEFT.r} />
          </clipPath>
        </defs>

        {/* The universe. Every region is drawn inside it. */}
        <rect x={6} y={6} width={W - 12} height={H - 12} fill="none" stroke="currentColor" strokeWidth={1.5} />
        <text x={14} y={22} fontSize={11} fill="currentColor">{spec.universeLabel}</text>

        {shaded.has('outside_both') ? (
          <rect x={6} y={6} width={W - 12} height={H - 12} fill="currentColor" opacity={0.28} mask={`url(#${uid}-outside)`} />
        ) : null}
        {shaded.has('A_only') || shaded.has('A_minus_B') ? (
          <circle cx={LEFT.cx} cy={LEFT.cy} r={LEFT.r} fill="currentColor" opacity={0.28} mask={`url(#${uid}-a-only)`} />
        ) : null}
        {shaded.has('B_only') || shaded.has('B_minus_A') ? (
          <circle cx={RIGHT.cx} cy={RIGHT.cy} r={RIGHT.r} fill="currentColor" opacity={0.28} mask={`url(#${uid}-b-only)`} />
        ) : null}
        {shaded.has('A_or_B') ? (
          <g>
            <circle cx={LEFT.cx} cy={LEFT.cy} r={LEFT.r} fill="currentColor" opacity={0.28} />
            <circle cx={RIGHT.cx} cy={RIGHT.cy} r={RIGHT.r} fill="currentColor" opacity={0.28} />
          </g>
        ) : null}
        {shaded.has('A_and_B') ? (
          <g clipPath={`url(#${uid}-both)`}>
            <circle cx={RIGHT.cx} cy={RIGHT.cy} r={RIGHT.r} fill="currentColor" opacity={0.38} />
          </g>
        ) : null}
        {shaded.has('A_complement') ? (
          <rect x={6} y={6} width={W - 12} height={H - 12} fill="currentColor" opacity={0.28} mask={`url(#${uid}-a-only)`} />
        ) : null}

        <circle cx={LEFT.cx} cy={LEFT.cy} r={LEFT.r} fill="none" stroke="currentColor" strokeWidth={1.8} />
        <circle cx={RIGHT.cx} cy={RIGHT.cy} r={RIGHT.r} fill="none" stroke="currentColor" strokeWidth={1.8} />
        <text x={LEFT.cx - 42} y={LEFT.cy - 38} fontSize={12} fill="currentColor">{spec.aLabel}</text>
        <text x={RIGHT.cx + 32} y={RIGHT.cy - 38} fontSize={12} fill="currentColor">{spec.bLabel}</text>
      </svg>
      <figcaption className="mt-1 text-sm opacity-80">
        {/* The claim in words, so shading never carries meaning alone. */}
        {spec.description}
      </figcaption>
    </figure>
  );
}
