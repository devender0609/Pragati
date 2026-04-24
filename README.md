# CBSE Growth Assessment — Prototype

A pre-pilot prototype adaptive assessment for CBSE Class 6 Math. This MVP
exercises **one skill** — FR.06, "Add fractions with unlike denominators" —
over 12 carefully-authored items, and demonstrates:

1. a simple adaptive routing rule that picks the next item based on the
   previous answer,
2. a student-facing results page with a performance band and likely
   misconception patterns, and
3. a teacher-facing dashboard with item-by-item responses, error tags, and
   suggested next teaching steps.

It is built in React + Vite + TypeScript + Tailwind CSS, has no backend, and
deploys to Vercel out of the box.

---

## What this prototype is

- A working demo of the assessment flow, UI, and reporting surfaces.
- A reference implementation of a transparent, rule-based adaptive engine
  (correct → harder, incorrect → easier, stop after 8–10 items).
- A diagnostic UI that ties every wrong-answer distractor to a specific
  misconception code and surfaces it to the teacher.

## What this prototype is **not**

- **Not a calibrated measurement instrument.** Difficulty values are seed
  estimates on a 1–10 scale, not IRT parameters.
- **Not a RIT score.** The "ability estimate" is a running heuristic, not a
  latent-trait estimate. Language across the app is deliberately
  conservative — "prototype estimate", "pre-pilot", "seed difficulty".
- **Not validated.** Items have not been through a teacher-validation review
  or a student cognitive lab yet. They should be before any real student sees
  them.
- **Not a placement or reporting tool.** Do not use the bands to make
  placement, promotion, or remediation decisions about a student.

---

## Run locally

Requires Node.js 18 or later.

```bash
npm install
npm run dev
```

The dev server prints a URL (usually `http://localhost:5173`). Open it in a
browser.

To build a production bundle and preview it:

```bash
npm run build
npm run preview
```

---

## Deploy to Vercel

This app is a static SPA with no backend.

**Option 1 — Vercel dashboard (recommended for first deploy):**

1. Push this folder to a GitHub repository.
2. In the Vercel dashboard, click **Add New → Project** and import the repo.
3. Vercel will auto-detect the framework as **Vite**. Defaults are correct:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Click **Deploy**.

**Option 2 — Vercel CLI:**

```bash
npm install -g vercel
vercel           # from inside this folder
vercel --prod    # promote a preview to production
```

No environment variables are required.

---

## Project structure

```
cbse-growth-app/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── README.md
└── src/
    ├── App.tsx                  # all four views (landing, assessment, results, teacher)
    ├── main.tsx                 # React entry point
    ├── index.css                # Tailwind layers + component utilities
    ├── vite-env.d.ts
    ├── data/
    │   └── items.ts             # 12 FR.06 items with per-distractor misconception tags
    └── lib/
        ├── adaptiveEngine.ts    # next-item selection, ability update, stop rule
        └── scoring.ts           # band computation, misconception aggregation
```

### Data model

Each item stores `stem`, four `options` (each with the misconception code it
represents when chosen), `correctIndex`, a seed `difficulty` in 1–10, a
`cognitiveType`, and a short worked `solution`.

Misconception codes are declared in `src/data/items.ts` and include
`add_across`, `incomplete_conversion`, `product_not_lcm`, `operation_confusion`,
`mixed_number_error`, `conceptual_gap`, `form_error`, and `arithmetic_slip`.
Each code has a human label and a suggested next teaching step that the
teacher dashboard surfaces.

### Adaptive rule

- Start at ability = 5.
- On a correct answer, ability += 1 (capped at 10).
- On an incorrect answer, ability -= 1 (floored at 1).
- Pick the unseen item whose difficulty is closest to the current ability.
- Stop after 10 items or when the pool is exhausted.

This is a transparent heuristic meant to demonstrate adaptive flow. It is
not IRT and should not be described as such.

### Session persistence

The most recent completed session is stored in `localStorage` under the key
`cbse-growth-assessment-session-v1`, so a user can reload the page and still
open the teacher dashboard. Starting a new assessment clears this.

---

## Next steps before this becomes a real assessment

This prototype is the beginning, not the end. Before any student sees this
outside a pilot setting, the following are required:

1. **Teacher validation of the 12 items.** A CBSE Class 6 math teacher should
   read every stem, every option, and every worked solution. Register, phrasing,
   and context (names, units, everyday scenes) must feel natural.
2. **Cognitive-lab pilot with ~5 students.** Watch students take the
   assessment and talk aloud. Which items confuse them for reasons unrelated
   to the math? Which distractors are they eliminating and which are they
   genuinely considering? If an item fails here, the same failure mode will
   propagate across the rest of the bank.
3. **Item revision.** Apply feedback from (1) and (2). Drop, rewrite, or
   re-tag items as needed. Resolve cross-skill contamination (e.g., the
   three-term LCM item FR.06-11 probably over-measures LCM rather than
   fraction addition).
4. **Calibration study.** Collect ~200 responses per item from a representative
   sample of Class 6 students. Fit a Rasch or 2PL IRT model (for example
   with `mirt` in R or `py-irt` in Python). Replace seed difficulty with
   calibrated parameters. Re-compute bands from a proper cut-score study.
5. **Expand skill coverage.** Apply the same template (12 items, tagged
   distractors, teacher-validated, cognitive-lab piloted, calibrated) to the
   remaining 67 skills in the Class 6 Math skill tree.

## Honest notes

- **Accessibility** is minimal right now. No keyboard-only shortcuts beyond
  tab, no screen-reader verification, no multilingual support. Add these
  before real deployment in Indian schools.
- **Offline / low-bandwidth** modes are not implemented. The app works once
  the static bundle is loaded, but no service worker or offline asset
  caching is configured.
- **Analytics, usage logging, and anonymized response collection** are not
  included. You will need these to run a calibration study — plan the
  instrumentation before the first real pilot.

---

## License

Prototype — use at your discretion. No warranty.
