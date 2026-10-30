// v0.46 Checkpoint 2 — Design tokens.
//
// Single source of truth for semantic colours, elevation, radii, spacing,
// motion, and typography. Consumers reach these via named exports rather
// than string-literal Tailwind class-strings, so future palette shifts
// happen in one file.
//
// This module does not replace GRADE_COLORS in components/common/gradePalette.ts;
// GRADE_COLORS remains the per-grade hue map. `tokens` adds:
//   - semantic status colours (success / warning / error / info)
//   - four age-stage themes (early primary → secondary)
//   - shared elevation / radius / spacing / motion tokens.

export type Elevation = 'flat' | 'card' | 'raised' | 'overlay';
export type Radius = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill';
export type MotionSpeed = 'instant' | 'fast' | 'base' | 'slow';

// --- Semantic colour tokens (Tailwind class strings) --------------------

export const SEMANTIC = {
  primary: {
    bg: 'bg-brand-600',
    bgHover: 'hover:bg-brand-700',
    text: 'text-brand-700',
    textLight: 'text-brand-500',
    tintBg: 'bg-brand-50',
    tintRing: 'ring-brand-200',
    border: 'border-brand-300',
  },
  neutral: {
    bg: 'bg-slate-100',
    bgHover: 'hover:bg-slate-200',
    text: 'text-slate-700',
    textStrong: 'text-slate-900',
    textMuted: 'text-slate-500',
    tintBg: 'bg-slate-50',
    border: 'border-slate-200',
  },
  success: {
    bg: 'bg-emerald-600',
    bgHover: 'hover:bg-emerald-700',
    text: 'text-emerald-800',
    tintBg: 'bg-emerald-50',
    tintRing: 'ring-emerald-200',
    border: 'border-emerald-200',
  },
  warning: {
    bg: 'bg-amber-500',
    bgHover: 'hover:bg-amber-600',
    text: 'text-amber-800',
    tintBg: 'bg-amber-50',
    tintRing: 'ring-amber-200',
    border: 'border-amber-200',
  },
  error: {
    bg: 'bg-rose-600',
    bgHover: 'hover:bg-rose-700',
    text: 'text-rose-800',
    tintBg: 'bg-rose-50',
    tintRing: 'ring-rose-200',
    border: 'border-rose-200',
  },
  info: {
    bg: 'bg-sky-600',
    bgHover: 'hover:bg-sky-700',
    text: 'text-sky-800',
    tintBg: 'bg-sky-50',
    tintRing: 'ring-sky-200',
    border: 'border-sky-200',
  },
} as const;

// --- Elevation ----------------------------------------------------------

export const ELEVATION: Record<Elevation, string> = {
  flat: '',
  card: 'shadow-card',
  raised: 'shadow-md',
  overlay: 'shadow-xl',
};

// --- Radii --------------------------------------------------------------

export const RADIUS: Record<Radius, string> = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-3xl',
  pill: 'rounded-full',
};

// --- Motion -------------------------------------------------------------

export const MOTION: Record<MotionSpeed, string> = {
  instant: 'transition-none',
  fast: 'transition duration-100',
  base: 'transition duration-200',
  slow: 'transition duration-500',
};

// --- Focus ring (shared) ------------------------------------------------

export const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2';

// --- Typography scale ---------------------------------------------------

export const TYPE = {
  displayXl: 'text-3xl font-bold tracking-tight sm:text-4xl',
  displayLg: 'text-2xl font-bold tracking-tight sm:text-3xl',
  h1: 'text-xl font-semibold sm:text-2xl',
  h2: 'text-lg font-semibold sm:text-xl',
  h3: 'text-base font-semibold sm:text-lg',
  body: 'text-sm sm:text-base',
  bodyLg: 'text-base sm:text-lg leading-relaxed',
  small: 'text-xs sm:text-sm',
  mono: 'font-mono text-xs sm:text-sm',
  eyebrow: 'text-[11px] font-semibold uppercase tracking-wider text-slate-500',
} as const;

// --- Composite button styles (used by primary/secondary CTAs) -----------

export const BUTTON = {
  primary: `inline-flex items-center justify-center gap-1.5 ${RADIUS.md} ${SEMANTIC.primary.bg} px-4 py-2.5 text-sm font-semibold text-white ${ELEVATION.card} ${MOTION.base} ${SEMANTIC.primary.bgHover} active:translate-y-px ${FOCUS_RING} disabled:cursor-not-allowed disabled:opacity-50 sm:px-5`,
  secondary: `inline-flex items-center justify-center gap-1.5 ${RADIUS.md} bg-white px-4 py-2.5 text-sm font-semibold ${SEMANTIC.neutral.text} ${ELEVATION.card} ring-1 ${SEMANTIC.neutral.border.replace('border', 'ring')} ${MOTION.base} ${SEMANTIC.neutral.bgHover} active:translate-y-px ${FOCUS_RING} sm:px-5`,
  ghost: `inline-flex items-center justify-center gap-1.5 ${RADIUS.md} px-3 py-2 text-sm font-medium ${SEMANTIC.neutral.text} ${MOTION.base} hover:bg-slate-100 ${FOCUS_RING}`,
} as const;

// --- Prefers-reduced-motion helper -------------------------------------

/** True if the current user has requested reduced motion. Components
 *  that would otherwise animate a big transform or a persistent pulse
 *  should degrade to a still state when this returns true. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

// ===========================================================================
// v0.75 §1/§2 — SURFACES.
//
// WHAT WAS MISSING, AND WHY IT LOOKED CHEAP
//
// v0.69 gave Pragati a real semantic palette — brand, learn, practice,
// correct, attend, progress — and every colour in it has a job. The
// palette was never the problem.
//
// The problem is that almost every screen composes it the same way: a
// slate-50 page, white rounded cards, a thin slate-200 ring, one violet
// hero at the top. A palette cannot rescue a composition where every
// element sits at the same visual depth. That reads as internal
// tooling no matter how considered the hues are.
//
// So this block adds the layer that was absent: SURFACES. Not more
// colours — a vocabulary for depth, grouping and emphasis, so a screen
// can have foreground and background instead of one flat plane of
// cards.
//
// THE RULE THAT KEEPS THIS FROM BECOMING NOISE
//
// A surface is chosen for its ROLE, never for variety. Two panels doing
// the same job take the same surface. If a screen needs four surfaces
// to explain itself, the screen is doing too much — that is a layout
// problem, and reaching for a fifth colour hides it rather than fixing
// it.
// ===========================================================================

export type SurfaceRole =
  /** The page itself. Never white — white is for raised content. */
  | 'page'
  /** A grouped region of the page. Tinted, no border, no shadow. */
  | 'zone'
  /** Ordinary content sitting above the page. */
  | 'panel'
  /** Content the user acts on. Slightly stronger than a panel. */
  | 'interactive'
  /** The one thing on the screen that matters most. */
  | 'feature'
  /** Real but not yet available. Must not read as broken. */
  | 'upcoming'
  /** Needs a person's attention. Never alarming. */
  | 'attention';

/**
 * Surface recipes.
 *
 * Deliberately whole class-strings rather than composable fragments: a
 * surface is a single decision, and splitting it into bg + ring + shadow
 * is how a system drifts into forty near-identical cards.
 */
export const SURFACE: Record<SurfaceRole, string> = {
  page: 'bg-slate-50',
  zone: 'rounded-3xl bg-gradient-to-b from-brand-50/70 to-transparent',
  panel: 'rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-card',
  interactive:
    'rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-card transition duration-200 hover:ring-brand-300 hover:shadow-md',
  feature:
    'rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-learn-600 text-white shadow-lg',
  // Dashed, tinted, no shadow: legible as "real, later" rather than
  // "a control that failed to load". §4 — an unavailable chapter must
  // never look like a broken button.
  upcoming: 'rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/60',
  attention: 'rounded-2xl bg-attend-50 ring-1 ring-attend-300',
};

/**
 * Desktop composition widths.
 *
 * §10 — a 1440px viewport is not a wide phone. These exist so a screen
 * declares its intended composition instead of every component picking
 * its own max-width and producing a centred column by accident.
 */
export const LAYOUT = {
  /** Reading measure. Long-form prose must not exceed this. */
  prose: 'max-w-[68ch]',
  /** Single-column screens that genuinely have one column of content. */
  column: 'mx-auto w-full max-w-3xl',
  /** Main + context. The default for Student learning screens. */
  withContext: 'mx-auto w-full max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6',
  /** Nav + work + context. The teacher workspace. */
  workspace:
    'mx-auto w-full max-w-[90rem] lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-6 lg:items-start',
  /** Dense tabular admin content may use the full width. */
  wide: 'mx-auto w-full max-w-[100rem]',
} as const;

/**
 * Desktop typography.
 *
 * §9 — lesson text was rendering visually tiny inside large centred
 * white panels at 1440, because the scale stopped at `sm:`. Body copy
 * that a student reads for ten minutes steps up again at `lg:`.
 */
export const READING = {
  lessonBody: 'text-base leading-relaxed sm:text-[1.0625rem] lg:text-lg lg:leading-8',
  lessonHeading: 'font-display text-xl font-bold sm:text-2xl lg:text-3xl',
  sectionHeading: 'font-display text-lg font-bold sm:text-xl lg:text-2xl',
} as const;
