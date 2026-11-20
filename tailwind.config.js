/**
 * v0.69 §2/§10 — THE PRAGATI DESIGN SYSTEM.
 *
 * The v0.68 product was white, slate, and one blue. It was legible and
 * it looked like internal tooling. This palette is the fix, and every
 * entry has a job — nothing is here for decoration.
 *
 * SEMANTIC COLOUR (§10)
 *
 *   brand    indigo   identity, primary actions, focus
 *   learn    violet   instruction — reading, explanations, worked examples
 *   practice teal     doing — guided and independent practice
 *   correct  emerald  a confirmed correct answer
 *   attend   amber    "needs another look" — NEVER red for a wrong answer
 *   teacher  slate-blue  teacher-only material inside a lesson
 *   progress sky      factual activity counts
 *
 * Wrong answers are amber, not red. Red is the colour of failure and a
 * wrong answer in a practice item is not a failure; it is the moment the
 * teaching happens. Red stays reserved for genuine destructive errors.
 *
 * ACCESSIBILITY (§10, §38)
 *
 * The 700 step of every semantic ramp clears 4.5:1 on white, so any
 * text using it passes AA. The 500 step is for fills and borders, not
 * text. Colour never carries meaning alone — every semantic surface in
 * the UI pairs its colour with an icon or a label.
 *
 * CHAPTER ACCENTS (§4)
 *
 * Ten hues, one per Class 6 chapter, assigned by chapter number so a
 * chapter keeps its colour everywhere it appears. They are for
 * recognition, not status — availability is never signalled by hue.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // v0.76 §11 — Anek Latin, loaded in index.html. Bricolage was
        // declared here from v0.69 and never loaded; the fallback silently
        // rendered every heading in Inter.
        display: ['Anek Latin', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        deva: ['Anek Devanagari', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        /**
         * v0.76 §2/§4 — INK AND PAPER.
         *
         * Every Pragati screen through v0.75 was slate-50 behind white
         * cards. Ten semantic ramps sat on top of a ground that said
         * "administrative software", and no amount of accent colour
         * survives that, because the ground is 80% of the pixels.
         *
         * Two families fix the ground itself:
         *
         *   ink    a deep indigo-navy for LARGE FIELDS. Hero bands,
         *          chapter headers, the app frame. Not a text colour
         *          borrowed for backgrounds — drawn as a background
         *          family, with the chroma to sit under white type
         *          without going flat black.
         *   paper  a warm low-chroma ground. Replaces slate-50 as the
         *          page. Warm because a maths book is printed on paper,
         *          not on a dashboard.
         *
         * Ink and paper carry no meaning. They are composition, and that
         * is the point: the SEMANTIC ramps below keep their exact jobs,
         * and stop having to also perform "this screen is interesting".
         */
        ink: {
          50: '#EEF0F7', 100: '#D6DBEB', 200: '#A9B3D4', 300: '#7382B4',
          400: '#4A5A92', 500: '#31406F', 600: '#24315A', 700: '#1A2544',
          800: '#131B33', 900: '#0D1426', 950: '#070B18',
        },
        paper: {
          50: '#FDFBF7', 100: '#FAF6EF', 200: '#F4EDE1', 300: '#E9DFCD',
          400: '#D8CAB2', 500: '#BCAB8E',
        },
        /**
         * §3 — the identity accent. Saffron appears in the Pragati mark,
         * in the lattice, and on ink fields. It is NEVER a status: amber
         * already means "needs another look", and a second warm hue that
         * sometimes means celebration would make the first ambiguous.
         */
        saffron: {
          100: '#FEEBC4', 200: '#FBD68A', 300: '#F7BE4C', 400: '#F0A31E',
          500: '#DF8709', 600: '#B96806',
        },
        brand: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
          800: '#3730a3', 900: '#312e81',
        },
        learn: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95',
        },
        practice: {
          50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
          400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e',
          800: '#115e59', 900: '#134e4a',
        },
        correct: {
          50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
          400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
          800: '#065f46', 900: '#064e3b',
        },
        attend: {
          50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309',
          800: '#92400e', 900: '#78350f',
        },
        progress: {
          50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc',
          400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1',
          800: '#075985', 900: '#0c4a6e',
        },
        teacher: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 500: '#64748b',
          600: '#475569', 700: '#334155', 900: '#0f172a',
        },
        /** §5 — chapter accents. Recognition only, never status. */
        chapter: {
          1: '#7c3aed', 2: '#0284c7', 3: '#059669', 4: '#d97706', 5: '#db2777',
          6: '#0d9488', 7: '#4f46e5', 8: '#ea580c', 9: '#9333ea', 10: '#0891b2',
        },
      },
      backgroundImage: {
        /**
         * §3 — THE PATTERN LANGUAGE: a pulli lattice.
         *
         * A kolam is drawn on a grid of dots laid on the threshold, and
         * the whole figure is defined by how a line moves around them.
         * It is Indian, it is geometric, it is the oldest drawing-on-a-
         * lattice practice there is, and it is what mathematics looks
         * like before it is written down.
         *
         * So Pragati's texture is a dot lattice, not a gradient wash.
         * Chapter artwork is CONSTRUCTED on the same lattice, which is
         * why a screenshot with the logo removed still reads as Pragati:
         * the geometry sits on visible dots.
         */
        lattice:
          'radial-gradient(currentColor 1.1px, transparent 1.2px)',
        'lattice-fine':
          'radial-gradient(currentColor 0.8px, transparent 0.9px)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 4px 16px rgba(15,23,42,0.06)',
        lift: '0 2px 4px rgba(15,23,42,0.05), 0 12px 28px rgba(15,23,42,0.10)',
        inset: 'inset 0 1px 2px rgba(15,23,42,0.06)',
      },
      borderRadius: { xl2: '1rem', xl3: '1.5rem' },
      keyframes: {
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-once': {
          '0%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        // Short and small. §11 forbids anything that draws attention to
        // itself rather than to the mathematics.
        'rise-in': 'rise-in 220ms ease-out both',
        'pulse-once': 'pulse-once 320ms ease-out',
      },
    },
  },
  plugins: [],
};
