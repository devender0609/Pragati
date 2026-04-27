# Pragati — Growth Assessment Prototype

A pre-pilot prototype adaptive assessment for CBSE Class 6 Math. This MVP
exercises **one skill** — FR.06, "Add fractions with unlike denominators" —
over a **24-item bank** with mixed item types (MCQ, numeric entry, visual
fraction bars and area grids), and demonstrates:

1. a simple adaptive routing rule that picks the next item based on the
   previous answer,
2. **per-student session history** (multiple sessions per student, never
   overwritten),
3. **a stratified random session pool** so two attempts by the same student
   draw a different 10-item subset of the 24-item bank,
4. **a composite, hedged change indicator** that compares the most recent
   session to the prior session on three dimensions (accuracy, average
   difficulty attempted, misconception rate) with an explicit confidence
   band,
5. a student-facing results page with a performance band and likely
   misconception patterns, and
6. a teacher-facing dashboard with a student list, growth history, item-by-item
   responses, error tags, suggested next teaching steps, recommended
   prerequisite skills, an "Export data (JSON)" download, and a destructive
   delete-student affordance.

It is built in React + Vite + TypeScript + Tailwind CSS, has no backend, and
deploys to Vercel out of the box.

---

## What this prototype is

- A working demo of the assessment flow, UI, and reporting surfaces.
- A reference implementation of a transparent, rule-based adaptive engine
  (correct → harder, incorrect → easier, stop after 8–10 items) operating
  over a stratified random session pool.
- A diagnostic UI that ties every wrong-answer distractor (and every
  numeric-entry error pattern) to a specific misconception code and surfaces
  it to the teacher.
- A multi-session, multi-student prototype: take a baseline, take a
  mid-year session, and the dashboard shows an early change indicator across
  them with a confidence band.

## What this prototype is **not**

- **Not a calibrated measurement instrument.** Difficulty values are seed
  estimates on a 1–10 scale, not IRT parameters.
- **Not a RIT score.** The "ability estimate" is a running heuristic, not a
  latent-trait estimate. Language across the app is deliberately
  conservative — "prototype estimate", "pre-pilot", "seed difficulty",
  "prototype change indicator", "early signal, not calibrated growth".
- **Not a validated growth metric.** The change indicator is a normalised
  composite of three heuristics on a 24-item bank and is reported with an
  explicit "low" or "moderate" confidence band. It is useful as a
  conversation starter; it is not a validated growth score and is not
  RIT-equivalent.
- **Not validated.** Items have not been through a full teacher-validation
  review or a student cognitive lab yet. They should be before any real
  student sees them.
- **Not a placement or reporting tool.** Do not use the bands to make
  placement, promotion, or remediation decisions about a student.

---

## What this version adds (v0.3.1)

A focused integrity pass on top of v0.3:

- **Visual fractions now share a common whole.** Every fraction bar in the
  app renders at the same outer width (so a 1/4 bar and a 1/8 bar are
  literally the same length, with only the partition count differing).
  Every area model uses the same outer dimensions. This was the single
  biggest mathematical-correctness bug in v0.3 — a 1/8 bar had previously
  been drawn twice as wide as a 1/4 bar, which actively contradicts what
  the item is teaching.
- **Visuals are accessible.** Every fraction-bar and area-grid SVG now
  carries a math-aware `aria-label` ("a whole bar split into 8 equal
  parts, with 1 part shaded") and a visible `<figcaption>` describing the
  fraction in words, so screen-reader users and sighted users get the
  same information.
- **Numeric-entry validation by mathematical equivalence.** Typed answers
  are parsed into rational numbers and compared by cross-multiplication.
  `5/6`, `1 7/12`, `19/12`, `1 and 7/12`, `1+7/12` and any whitespace
  variants all work. Decimals are intentionally rejected — fraction
  arithmetic should be answered in fractions.
- **`form_error` is now caught automatically.** If a student types
  `10/12` for an answer of `5/6`, the value is right but the form is not.
  Pragati now marks that as wrong with misconception `form_error` and
  surfaces it on the teacher dashboard, instead of silently accepting it
  or counting it as a generic slip.

## What v0.3 added

Compared with v0.2:

- **24-item bank, up from 12.** The new items add visual fraction-bar and
  area-grid problems, mixed-number addition (proper and word problems),
  three-term sums, and **numeric-entry** items where the student types an
  answer like `5/6` or `1 7/12` instead of choosing from four options.
  Distribution: 5 foundational (difficulty 2–3), 11 core (4–6), 8 advanced
  (7–9). Four items use inline SVG visuals; three are numeric-entry.
- **Stratified random session pool.** Each attempt now draws a 10-item
  subset of the 24-item bank with a fixed band ratio (2 foundational / 5
  core / 3 advanced) and a strong preference for items the student has not
  seen on previous attempts. The adaptive engine then routes within that
  per-session pool. Result: a re-take is far less of a memory test.
- **Composite change indicator with confidence.** The single ability-delta
  number is gone. The change card now shows three deltas — accuracy,
  average difficulty attempted, and misconception rate — plus a normalised
  composite arrow (up / flat / down) and a confidence pill. Confidence is
  "low" if either session had fewer than 8 items or a difficulty range
  smaller than 4 points; otherwise "moderate". Low-confidence reasons are
  listed inline. The card's headline copy is "Prototype change indicator"
  and the supporting line reads "Early signal — not calibrated growth."
- **Numeric-entry items.** The bank now includes typed-answer items.
  Pragati canonicalises the input (`"1 and 7/12"`, `"1 7/12"`, `"19/12"`
  all accepted), and tags common error patterns to the same misconception
  vocabulary used by MCQ distractors.
- **Visual rendering.** Fraction-bar and area-grid items render inline as
  SVG with a clear caption strip, no external charting library.
- **Export data (JSON).** A button on the teacher's student list downloads a
  full bundle — schema version, students, every session, every response,
  item ids, correctness, misconception tags — as `pragati-export-<iso>.json`
  for downstream calibration work.
- **Delete student.** The student detail page has a destructive
  "Delete student" button with an inline confirmation modal that removes
  the student record and every session that belonged to them.
- **Exposure warning.** Both the landing page and the start form now
  include "with a small bank, you may see similar question types across
  attempts" so administrators are not surprised by item overlap.

### Carried over from v0.2

- **Student identity.** Every attempt is tied to a named student (name,
  grade, optional school). Lookup is case-insensitive on (name, grade,
  school).
- **Assessment windows.** Each attempt is tagged Baseline, Mid-year,
  End-of-year, or Practice. The teacher dashboard can filter on this.
- **Multiple sessions per student.** Sessions are appended to the store —
  taking a second assessment never overwrites a previous one.
- **Teacher dashboard.** All students with their latest band, latest
  window, total session count, and last attempt date. Search by name /
  school / grade and filter by window. Click a row to open a per-student
  detail page with growth history, item-by-item responses, misconception
  summary, and recommended prerequisite skills.
- **Prerequisite recommendations.** When a student selects a misconception
  distractor or types a numeric error pattern, Pragati maps it to a direct
  prerequisite skill in the Class 6 Math skill tree.
- **Submit-button hardening.** The submit button is disabled when there is
  no answer and while a save is in flight, preventing double-submission.
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

> If `npm run build` fails on Windows with `EPERM: operation not permitted,
> unlink ... dist\...`, an existing `dist/` folder is locked. Delete it from
> Explorer and re-run.

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
    │   └── items.ts             # 24 FR.06 items (MCQ + numeric entry + visual specs)
    └── lib/
        ├── adaptiveEngine.ts    # session-pool sampling, next-item selection, ability update, stop rule
        ├── scoring.ts           # bands, misconception aggregation, composite change indicator, prerequisite recommendations
        └── storage.ts           # localStorage CRUD for students + sessions, delete + export bundle
```

### Data model

A **Student** stores an id, name, grade, optional school, and createdAt.

A **Session** stores an id, the studentId, a snapshot of the student's
attributes at the time of the attempt, the assessment window
(`baseline | midyear | endyear | practice`), the skillId, startedAt /
completedAt timestamps, every individual response, and the final running
ability estimate.

An **Item** is a discriminated union of `MCQItem` and `NumericItem`.
Both share `stem`, `difficulty` (1–10), `band`, `cognitiveType`, optional
`visual` (fraction bars or area grid), and a worked `solution`. MCQ items
add four `options` — each tagged with the misconception code it
represents — and a `correctIndex`. Numeric items add `acceptedAnswers`,
named `errorPatterns` (each with its own misconception tag), and an
`inputHint`.

Misconception codes include `add_across`, `incomplete_conversion`,
`product_not_lcm`, `operation_confusion`, `mixed_number_error`,
`conceptual_gap`, `form_error`, `arithmetic_slip`, and the new
`visual_misread`. Each code has a human label, a suggested next teaching
step that the teacher dashboard surfaces, and (in `scoring.ts`) a list of
prerequisite skills it points to.

### Adaptive rule

- **Build a session pool.** For each attempt, draw 2 foundational + 5 core
  + 3 advanced items from the 24-item bank, preferring items this student
  has not seen on prior attempts. If the unseen-by-band set is too small,
  fall back to seen items in the same band so we still hit the stratified
  target. Top up cross-band only as a last resort.
- **Start at ability = 5.**
- On a correct answer, ability += 1 (capped at 10).
- On an incorrect answer, ability -= 1 (floored at 1).
- **Pick the next item from the session pool** (not the full bank) whose
  difficulty is closest to the current ability. Deterministic tiebreak by
  item id.
- Stop after 10 items or when the session pool is exhausted.

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

`deleteStudent(studentId)` removes the student record and every session
that belonged to them. The UI confirms before calling it.

`buildExportBundle()` and `exportAllAsJSON()` return a JSON-serialisable
snapshot of every student and every session on the device. The teacher
dashboard wires this to a "Export data (JSON)" button that triggers a
file download.

### Composite change indicator

When a student finishes a session, Pragati looks for their most recent
strictly-earlier completed session on the same skill. If one exists, it
computes three per-session summaries:

- `accuracy` — fraction of items answered correctly
- `avgDifficulty` — mean seed difficulty of items the student attempted
- `misconceptionRate` — fraction of responses tagged with a non-`none`
  misconception

It then renders three delta tiles, a normalised composite (an average of
accuracy delta, scaled difficulty delta, and the inverse of misconception
delta), and a confidence pill:

- **Low confidence** if either session had fewer than 8 items, or the
  difficulty range of attempted items in either session was smaller than
  4 points. The card lists the specific reasons.
- **Moderate confidence** otherwise. Still not a validated growth score —
  just the most defensible read this prototype can give.

The headline copy is **"Prototype change indicator"**; the supporting line
is **"Early signal — not calibrated growth."** Composite movement under
0.05 (after normalisation) is reported as **flat** rather than as growth or
regression.

---

## Next steps before this becomes a real assessment

This prototype is the beginning, not the end. Before any student sees this
outside a pilot setting, the following are required:

1. **Teacher validation of the 24 items.** A CBSE Class 6 math teacher
   should read every stem, every option, every accepted numeric answer,
   and every worked solution. Register, phrasing, and context (names,
   units, everyday scenes) must feel natural.
2. **Cognitive-lab pilot with ~5 students.** Watch students take the
   assessment and talk aloud. Which items confuse them for reasons
   unrelated to the math? Which distractors are they eliminating and which
   are they genuinely considering? Do the visual items read the way they
   are supposed to? If an item fails here, the same failure mode will
   propagate across the rest of the bank.
3. **Item revision.** Apply feedback from (1) and (2). Drop, rewrite, or
   re-tag items as needed. Resolve cross-skill contamination (e.g., the
   three-term LCM items probably over-measure LCM rather than fraction
   addition).
4. **Add at least one more skill.** Multi-skill coverage is the only way
   to make growth claims that are not trivially attributable to one item
   bank. The natural next is **FR.07 — Subtract fractions with unlike
   denominators**.
5. **Calibration study.** Collect ~200 responses per item from a
   representative sample of Class 6 students (the JSON export is
   structured for this). Fit a Rasch or 2PL IRT model (for example with
   `mirt` in R or `py-irt` in Python). Replace seed difficulty with
   calibrated parameters. Re-compute bands from a proper cut-score study.
6. **Backend + identity.** Replace localStorage with a real database
   (e.g., Supabase or Firebase). Add teacher authentication. Add
   per-school rosters and class management. Support sync across devices.
7. **Expand skill coverage.** Apply the same template (≥24 items, tagged
   distractors, teacher-validated, cognitive-lab piloted, calibrated) to
   the remaining 67 skills in the Class 6 Math skill tree.

## Honest notes

- **Accessibility** is minimal right now. No keyboard-only shortcuts
  beyond tab, no screen-reader verification of the SVG visuals, no
  multilingual support. Add these before real deployment in Indian
  schools.
- **Offline / low-bandwidth** modes are not implemented. The app works
  once the static bundle is loaded, but no service worker or offline asset
  caching is configured.
- **Analytics, usage logging, and anonymised response collection** beyond
  the on-device JSON export are not included. You will need a hosted
  collection pipeline to run a real calibration study — plan the
  instrumentation before the first real pilot.
- **Privacy.** This version stores student names in the browser's
  localStorage on whichever device runs the app. No data leaves the
  device unless a teacher uses the JSON export. Do not enter PII you
  would not want stored unencrypted on that device, and clear the browser
  before handing the device to a different teacher.

---

## License

Prototype — use at your discretion. No warranty.
