# Pragati — Growth Assessment Prototype

A pre-pilot prototype adaptive assessment for CBSE Class 6 Math. This MVP
exercises **one skill** — FR.06, "Add fractions with unlike denominators" —
over 12 carefully-authored items, and demonstrates:

1. a simple adaptive routing rule that picks the next item based on the
   previous answer,
2. **per-student session history** (multiple sessions per student, never
   overwritten),
3. **an early growth indicator** that compares a student's most recent
   session against their prior session on the same skill,
4. a student-facing results page with a performance band and likely
   misconception patterns, and
5. a teacher-facing dashboard with a student list, growth history,
   item-by-item responses, error tags, suggested next teaching steps, and
   recommended prerequisite skills to revisit.

It is built in React + Vite + TypeScript + Tailwind CSS, has no backend, and
deploys to Vercel out of the box.

---

## What this prototype is

- A working demo of the assessment flow, UI, and reporting surfaces.
- A reference implementation of a transparent, rule-based adaptive engine
  (correct → harder, incorrect → easier, stop after 8–10 items).
- A diagnostic UI that ties every wrong-answer distractor to a specific
  misconception code and surfaces it to the teacher.
- A multi-session, multi-student prototype: take a baseline, take a
  mid-year session, and the dashboard shows an early growth indicator
  across them.

## What this prototype is **not**

- **Not a calibrated measurement instrument.** Difficulty values are seed
  estimates on a 1–10 scale, not IRT parameters.
- **Not a RIT score.** The "ability estimate" is a running heuristic, not a
  latent-trait estimate. Language across the app is deliberately
  conservative — "prototype estimate", "pre-pilot", "seed difficulty".
- **Not a validated growth metric.** The "early growth indicator" is the
  difference between two heuristic estimates on a 12-item bank. It is
  useful as a conversation starter; it is not a validated growth score and
  is not RIT-equivalent.
- **Not validated.** Items have not been through a teacher-validation review
  or a student cognitive lab yet. They should be before any real student sees
  them.
- **Not a placement or reporting tool.** Do not use the bands to make
  placement, promotion, or remediation decisions about a student.

---

## What this version adds (v0.2)

Compared with the initial single-attempt demo:

- **Student identity.** Every attempt is tied to a named student (name,
  grade, optional school). Students are looked up by case-insensitive name
  + grade + school so re-entering the same student does not create a
  duplicate.
- **Assessment windows.** Each attempt is tagged Baseline, Mid-year,
  End-of-year, or Practice. The teacher dashboard can filter on this.
- **Multiple sessions per student.** Sessions are appended to the store —
  taking a second assessment never overwrites a previous one.
- **Early growth indicator.** On the results screen and on the student
  detail page, Pragati shows the change in the prototype ability estimate
  versus the most recent prior session, with careful "not calibrated"
  language.
- **Teacher dashboard rebuild.** The dashboard now lists all students with
  their latest band, latest window, total session count, and last attempt
  date. Search by name / school / grade and filter by window. Click a row
  to open a per-student detail page with growth history, item-by-item
  responses, misconception summary, and recommended prerequisite skills.
- **Prerequisite recommendations.** When a student selects a misconception
  distractor, Pragati maps it to a direct prerequisite skill in the Class 6
  Math skill tree (e.g., `add_across` → FR.05 / FR.02; `product_not_lcm` →
  FM.07; `mixed_number_error` → FR.04; `incomplete_conversion` → FR.03).
- **Submit-button hardening.** The submit button is disabled while the
  selection is empty and while a save is in flight, preventing
  double-submission.
- **In-assessment context bar.** The student name and assessment window are
  shown above the question so the test-administrator does not lose context.

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
    ├── App.tsx                  # all views (landing, start form, assessment, results, teacher list, student detail)
    ├── main.tsx                 # React entry point
    ├── index.css                # Tailwind layers + component utilities
    ├── types.ts                 # Student, Session, Response, AssessmentWindow
    ├── vite-env.d.ts
    ├── data/
    │   └── items.ts             # 12 FR.06 items with per-distractor misconception tags
    └── lib/
        ├── adaptiveEngine.ts    # next-item selection, ability update, stop rule
        ├── scoring.ts           # bands, misconception aggregation, growth indicator, prerequisite recommendations
        └── storage.ts           # localStorage CRUD for students + sessions
```

### Data model

A **Student** stores an id, name, grade, optional school, and createdAt.

A **Session** stores an id, the studentId, a snapshot of the student's
attributes at the time of the attempt, the assessment window
(`baseline | midyear | endyear | practice`), the skillId, startedAt /
completedAt timestamps, every individual response, and the final running
ability estimate.

Each **Item** stores `stem`, four `options` (each with the misconception code
it represents when chosen), `correctIndex`, a seed `difficulty` in 1–10, a
`cognitiveType`, and a short worked `solution`.

Misconception codes are declared in `src/data/items.ts` and include
`add_across`, `incomplete_conversion`, `product_not_lcm`,
`operation_confusion`, `mixed_number_error`, `conceptual_gap`, `form_error`,
and `arithmetic_slip`. Each code has a human label, a suggested next teaching
step that the teacher dashboard surfaces, and (in `scoring.ts`) a list of
prerequisite skills it points to.

### Adaptive rule

- Start at ability = 5.
- On a correct answer, ability += 1 (capped at 10).
- On an incorrect answer, ability -= 1 (floored at 1).
- Pick the unseen item whose difficulty is closest to the current ability.
- Stop after 10 items or when the pool is exhausted.

This is a transparent heuristic meant to demonstrate adaptive flow. It is
not IRT and should not be described as such.

### Storage

Pragati uses `localStorage` only — there is no backend in this version.

Two keys:

- `pragati.students.v1` → an array of `Student` records.
- `pragati.sessions.v1` → an array of `Session` records (one flat list
  across all students; the dashboard filters by `studentId` at read time).

Sessions are **appended** on save and never overwrite a different session.
A session in the same `id` slot will be replaced (this is what allows the
in-flight session record to be promoted to a completed session).

### Early growth indicator

When a student finishes a session, Pragati looks for their most recent
strictly-earlier completed session on the same skill. If one exists, it
shows:

- prior estimate
- current estimate
- delta on the 1–10 seed scale, with an arrow and color
- a careful, hedged summary line

Anything under 0.5 on the 1–10 scale is reported as "roughly flat" rather
than as growth or regression. None of this is a validated growth score.

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
   fraction addition). Add visual / fraction-bar items, which CBSE textbooks
   rely on heavily.
4. **Add at least one more skill.** Multi-skill coverage is the only way to
   make growth claims that are not trivially attributable to one item bank.
   The natural next is **FR.07 — Subtract fractions with unlike denominators**.
5. **Calibration study.** Collect ~200 responses per item from a representative
   sample of Class 6 students. Fit a Rasch or 2PL IRT model (for example
   with `mirt` in R or `py-irt` in Python). Replace seed difficulty with
   calibrated parameters. Re-compute bands from a proper cut-score study.
6. **Backend + identity.** Replace localStorage with a real database (e.g.,
   Supabase or Firebase). Add teacher authentication. Add per-school rosters
   and class management. Support sync across devices.
7. **Expand skill coverage.** Apply the same template (12 items, tagged
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
- **Privacy.** This version stores student names in the browser's
  localStorage on whichever device runs the app. No data leaves the device.
  Do not enter PII you would not want stored unencrypted on that device,
  and clear the browser before handing the device to a different teacher.

---

## License

Prototype — use at your discretion. No warranty.
