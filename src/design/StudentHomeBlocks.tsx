// v0.70 §3/§4/§12/§16/§18 — STUDENT HOME COMPOSITION.
//
// THE PROBLEM v0.69 SHIPPED
//
// At 390px the Home screen was: header, greeting, one card, and then
// roughly 500px of empty grey. It looked unfinished because it WAS
// unfinished — the layout had one slot and nothing to put in the rest.
//
// The wrong fix is to fill the space with invented data: a streak, a
// mastery ring, an activity feed. Those are all available and all
// dishonest, because Pragati records almost none of it.
//
// The right fix is to give the space something REAL to hold: the
// curriculum. A student's chapter list is genuine, useful, visually
// rich, and always present — even on day one, when nothing else is.
//
// SURFACE LANGUAGE (§18)
//
// Five surfaces, used consistently, so the app stops being "card soup":
//
//   hero        gradient, white text — one per screen, the main action
//   raised      white + shadow + hover lift — tappable
//   tinted      accent wash + accent border — grouped, not tappable
//   flat        white + hairline — information
//   upcoming    white/60 + no shadow — real but not yet available
//
// Nothing gets border AND shadow AND tint AND a heavy radius at once.

import type { ReactNode } from 'react';
import { ChapterMotif, chapterAccent, motifForChapter, type MotifKey } from './ChapterMotif';

// ---------------------------------------------------------------------------
// §6 — chapter motifs as real visual assets
// ---------------------------------------------------------------------------

/**
 * A chapter tile: the motif at a size where it actually reads, on a wash
 * of the chapter's own accent, with a faint repeating field behind it.
 *
 * v0.69 rendered these at 24px inside a 44px chip, which is an icon, not
 * an identity — at that size a compass and a factor tree are two grey
 * smudges. The tile is the smallest size at which the mathematics in the
 * motif is legible.
 */
export function ChapterTile({
  motif,
  accent,
  size = 'md',
  className = '',
}: {
  motif: MotifKey;
  accent: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const box =
    size === 'lg' ? 'h-20 w-20' : size === 'md' ? 'h-14 w-14' : 'h-11 w-11';
  const art = size === 'lg' ? 'h-11 w-11' : size === 'md' ? 'h-8 w-8' : 'h-6 w-6';
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl2 ${box} ${className}`}
      style={{ backgroundColor: `${accent}17`, color: accent }}
    >
      {/* A faint diagonal field so the tile is a surface rather than a
          flat swatch. Kept under 5% opacity: texture, not decoration. */}
      <span
        className="absolute inset-0 opacity-[0.5]"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${accent}0c 0 6px, transparent 6px 12px)`,
        }}
      />
      <ChapterMotif motif={motif} className={`relative ${art}`} />
    </span>
  );
}

/**
 * The chapter's motif enlarged as a header backdrop.
 *
 * Bleeds off the right edge at low opacity, so a chapter header is
 * recognisable at a glance without the artwork competing with the title.
 */
export function ChapterHeroArt({ motif }: { motif: MotifKey }) {
  return (
    <span
      className="pointer-events-none absolute -right-6 -top-6 text-white/20"
      aria-hidden="true"
    >
      <ChapterMotif motif={motif} className="h-36 w-36" />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

/** The one thing on the screen a student should do next. */
export function HeroAction({
  eyebrow,
  title,
  detail,
  actionLabel,
  onAction,
  motif,
  accent = '#4f46e5',
}: {
  eyebrow: string;
  title: string;
  detail?: string;
  actionLabel: string;
  onAction: () => void;
  motif?: MotifKey;
  accent?: string;
}) {
  return (
    <section
      className="relative overflow-hidden rounded-xl3 p-5 text-white shadow-card"
      style={{ background: `linear-gradient(135deg, ${accent}, #6d28d9)` }}
    >
      {motif ? <ChapterHeroArt motif={motif} /> : null}
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-display text-xl font-bold leading-snug sm:text-2xl">
          {title}
        </h2>
        {detail ? (
          <p className="mt-1.5 text-sm text-white/85">{detail}</p>
        ) : null}
        <button
          type="button"
          onClick={onAction}
          className="tap mt-4 inline-flex items-center gap-1.5 rounded-xl2 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700"
        >
          {actionLabel}
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 4l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

/** A tinted grouping surface. Not tappable, so no shadow and no lift. */
export function TintedSection({
  tone,
  eyebrow,
  title,
  children,
}: {
  tone: 'learn' | 'practice' | 'progress';
  eyebrow?: string;
  title?: string;
  children: ReactNode;
}) {
  const tones = {
    learn: 'border-learn-200 bg-learn-50/60',
    practice: 'border-practice-200 bg-practice-50/60',
    progress: 'border-progress-200 bg-progress-50/60',
  } as const;
  const text = {
    learn: 'text-learn-700',
    practice: 'text-practice-700',
    progress: 'text-progress-700',
  } as const;
  return (
    <section className={`rounded-xl3 border p-4 ${tones[tone]}`}>
      {eyebrow ? (
        <p className={`text-xs font-bold uppercase tracking-wide ${text[tone]}`}>
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2 className="mt-0.5 font-display text-base font-bold text-slate-900">
          {title}
        </h2>
      ) : null}
      <div className={eyebrow || title ? 'mt-3' : ''}>{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// §12 — progress that is visual without being invented
// ---------------------------------------------------------------------------

export type SectionDotState = 'not_started' | 'in_progress' | 'practised' | 'upcoming';

/**
 * A row of dots, one per official section.
 *
 * Every state maps to something Pragati actually records. There is no
 * "mastered" state, because Pragati cannot know that — accuracy on a
 * handful of practice items is not evidence of learning, and §12 forbids
 * inferring it.
 *
 * The dots are aria-hidden and the same counts appear as text beside
 * them, so this is never the only way to read the information.
 */
export function SectionDots({
  states,
  accent = '#0d9488',
}: {
  states: SectionDotState[];
  accent?: string;
}) {
  return (
    <span className="flex flex-wrap items-center gap-1.5" aria-hidden="true">
      {states.map((s, i) => {
        if (s === 'practised') {
          return (
            <span
              key={i}
              className="flex h-3 w-3 items-center justify-center rounded-full"
              style={{ backgroundColor: accent }}
            />
          );
        }
        if (s === 'in_progress') {
          return (
            <span
              key={i}
              className="h-3 w-3 rounded-full border-2"
              style={{ borderColor: accent, backgroundColor: `${accent}33` }}
            />
          );
        }
        if (s === 'not_started') {
          return (
            <span
              key={i}
              className="h-3 w-3 rounded-full border-2 border-slate-300 bg-white"
            />
          );
        }
        return (
          <span key={i} className="h-3 w-3 rounded-full border border-dashed border-slate-300" />
        );
      })}
    </span>
  );
}

/** One factual number with a label. No percentages, no ratings. */
export function FactStat({
  value,
  label,
  tone = 'text-slate-900',
}: {
  value: number | string;
  label: string;
  tone?: string;
}) {
  return (
    <div>
      <p className={`font-display text-2xl font-bold leading-none ${tone}`}>
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}

/**
 * A compact chapter row for the Home "explore" strip.
 *
 * Deliberately different in shape from the Learn tab's chapter cards —
 * §5 asks for visual rhythm, and repeating the same card in two places
 * is what made the app feel like one long list.
 */
export function ChapterChip({
  number,
  title,
  available,
  onOpen,
  officialChapterId,
}: {
  number: number;
  title: string;
  available: boolean;
  onOpen?: () => void;
  officialChapterId: string;
}) {
  const accent = chapterAccent(number);
  const motif = motifForChapter(officialChapterId);
  const inner = (
    <>
      <ChapterTile motif={motif} accent={accent} size="sm" />
      <span className="mt-2 block text-[0.7rem] font-semibold uppercase tracking-wide text-slate-400">
        Ch {number}
      </span>
      <span
        className={`mt-0.5 block text-sm font-bold leading-snug ${
          available ? 'text-slate-900' : 'text-slate-400'
        }`}
      >
        {title}
      </span>
    </>
  );

  if (!available || !onOpen) {
    return (
      <div className="w-[9.5rem] shrink-0 rounded-xl2 border border-slate-200 bg-white/60 p-3">
        {inner}
        <span className="mt-1.5 block text-[0.7rem] font-medium text-slate-400">
          Coming soon
        </span>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      className="tap w-[9.5rem] shrink-0 rounded-xl2 border border-slate-200 bg-white p-3 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      {inner}
      <span
        className="mt-1.5 block text-[0.7rem] font-semibold"
        style={{ color: accent }}
      >
        Open
      </span>
    </button>
  );
}
