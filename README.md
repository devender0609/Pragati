# Pragati — Growth Assessment Prototype

A pre-pilot prototype adaptive assessment **and Learn module** for CBSE
Class 6 Math. As of v0.5 this MVP covers the **complete Class 6
Fractions Module** — seven skills (FR.02, FR.03, FR.04, FR.05, FR.06,
FR.07, FR.08) — over a **104-item bank** with mixed item types (MCQ,
numeric entry, visual fraction bars and area grids), plus a Learn
section with a reteach lesson, visual explanation, five practice
questions, and teacher / parent notes for every skill, and demonstrates:

1. a simple adaptive routing rule that picks the next item based on the
   previous answer,
2. **per-student session history** (multiple sessions per student, never
   overwritten),
3. **a stratified random session pool** so two attempts by the same student
   draw a different 10-item subset of the relevant skill bank,
4. **a skill picker** at session start (FR.06, FR.07, or a mixed
   FR.06+FR.07 session), with per-skill accuracy breakdowns on the
   results screen for mixed sessions and a same-skill-only growth
   comparison on every session,
5. **a composite, hedged change indicator** that compares the most recent
   session to the most recent prior session **on the same skill mode**
   (so an FR.06 baseline isn't compared against an FR.07 mid-year) on
   three dimensions (accuracy, average difficulty attempted, misconception
   rate) with an explicit confidence band,
6. a student-facing results page with a performance band, per-skill
   accuracy (for mixed sessions), and likely misconception patterns, and
7. a teacher-facing dashboard with a student list, growth history,
   item-by-item responses, error tags, suggested next teaching steps,
   recommended prerequisite skills, an "Export data (JSON)" download, a
   class roll-up dashboard with a **per-skill filter**, and a destructive
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
  composite of three heuristics on a small per-skill bank (24 items for
  FR.06, 20 for FR.07) and is reported with an explicit "low" or
  "moderate" confidence band. It is useful as a conversation starter; it
  is not a validated growth score and is not RIT-equivalent.
- **Not validated.** Items have not been through a full teacher-validation
  review or a student cognitive lab yet. They should be before any real
  student sees them.
- **Not a placement or reporting tool.** Do not use the bands to make
  placement, promotion, or remediation decisions about a student.

---

## What this version adds (v0.5)

The headline change in v0.5 is that Pragati now covers the **complete
Class 6 Fractions Module**, with a Learn section alongside the
assessment.

- **Five new skill banks (60 new items).**
  - **FR.02 — Represent fractions visually** (12 items, 6 visual)
  - **FR.03 — Equivalent fractions** (12 items)
  - **FR.04 — Mixed numbers and improper fractions** (12 items)
  - **FR.05 — Add and subtract with like denominators** (12 items)
  - **FR.08 — Fraction word problems** (12 items)
  Each bank follows the same gold-standard schema (id, skillId,
  difficulty, band, cognitiveType, MCQ options or numeric answer,
  misconception-tagged distractors, worked solution, estimated time)
  and spans foundational / core / advanced bands. The module total is
  now 104 items across 7 skills.
- **Learn section.** A new top-level **Learn** view in the navigation
  opens the Fractions Module dashboard, with one card per skill. Each
  card opens a Learn page with: a **short reteach lesson** (numbered
  steps), a **visual explanation** (inline fraction-bar or area-grid
  diagram with caption), **5 hand-picked practice questions** (with
  show/hide solutions), a **teacher intervention note**, and a
  **parent-friendly home-practice note**.
- **Skill cards and Fractions Module dashboard.** The dashboard shows
  every skill with its prerequisites, item count, and quick links to
  Learn or to a single-skill assessment. There's also a
  Mixed Fractions Assessment shortcut at the top.
- **Skill-aware band copy and prerequisites.** Performance-band
  descriptions are now per-skill for all 7 skills (an FR.04
  Foundational student gets pointed at FR.02/FR.03 prereqs, an FR.08
  Foundational student at FR.05/FR.06/FR.07, and so on). Static
  prereqs follow the curriculum tree: FR.02 → FR.03 → FR.04 → FR.05 →
  FR.06 / FR.07 → FR.08.
- **Polished landing and mobile layout.** New gradient hero with
  feature cards, a teaser strip of skill cards, sticky condensed nav
  on mobile, and a more confident "what this is / what this is not"
  block. Skill picker on the StartForm is now a dropdown (cleaner with
  8 modes) with the per-mode description shown live.
- **Class dashboard skill filter expanded.** The teacher's class
  dashboard skill filter now offers all 7 skills plus "all". Mixed-mode
  sessions are still included for any single-skill view, contributing
  only their relevant responses.
- **No data migration.** Old v0.3 / v0.4 sessions (with `skillId` =
  `'FR.06'`, `'FR.07'`, or `'mixed'`) load unchanged; mixed-mode
  sessions are still backwards-compatible because mixed now just means
  "across the whole module".

What v0.5 deliberately does NOT do, per the brief: no other classes (only
Class 6), no English (only Maths), no Supabase (still localStorage-only),
no claim of official CBSE alignment or validated scoring.

## What v0.4 added

The headline change in v0.4 is that the assessment is no longer a single
skill. Pragati now covers **two related skills**, with shared
infrastructure for adding more later:

- **New skill bank: FR.07 — Subtract fractions with unlike denominators.**
  20 new items spanning the same gold-standard schema as FR.06: 4
  foundational (difficulty 2–3), 12 core (difficulty 4–6), 4 advanced
  (difficulty 7–9). Includes 3 visual items (fraction bars and an area
  grid), 4 numeric-entry items, 5 word problems, and 4 mixed-number
  subtractions of which 3 require borrowing. Every distractor and every
  numeric error pattern is tagged with a misconception code.
- **Two new misconception codes.** `subtract_across` (mirror of
  `add_across` — the student subtracts numerators and denominators
  separately, e.g., 3/4 − 1/2 = 2/2) and `borrowing_error` (in
  mixed-number subtraction, the student avoids the borrow by subtracting
  the smaller fractional part from the larger, e.g., 3 1/4 − 1 3/4 = 2
  1/2). Both have full teacher-facing "next step" guidance.
- **Skill picker at session start.** The Start form now asks the teacher
  which skill bank to draw from: FR.06 only, FR.07 only, or a **mixed
  session** that draws from both banks together. Mixed sessions are
  routed by the same stratified pool builder; the only thing that
  changes is which items are eligible.
- **Per-skill breakdown on results.** A mixed session's results screen
  splits accuracy by skill so the teacher can see, for example, that the
  student is solid on FR.06 but stuck on FR.07. The same breakdown
  appears in the teacher's per-student detail view.
- **Skill-aware growth comparison.** The growth card and Δ-vs-previous
  column on the growth-history table now compare a session only against
  prior sessions in the **same skill mode**. This is the most important
  correctness change in v0.4: a per-skill accuracy delta computed across
  different skills was not meaningful.
- **Class dashboard skill filter.** The teacher's class dashboard has a
  new dropdown to scope the entire roll-up — average accuracy,
  misconception distribution, hardest items — to FR.06 responses,
  FR.07 responses, or all responses. Mixed-mode sessions are included
  for either single-skill view, but only the responses for that skill
  count toward the aggregate.
- **Skill-aware band copy and prerequisite mapping.** Performance-band
  descriptions are now per-skill (an FR.07 "Foundational" student is
  pointed at FR.05 + FR.06, not at FR.06 prereqs), and the new
  misconception codes have their own prerequisite recommendations.
- **No data migration required.** Old v0.3 sessions are stored with
  `skillId: 'FR.06'`, which is still a valid `SkillMode`. They render
  unchanged in v0.4 with an `FR.06 — Add unlike` chip on every row.

## What v0.3.2 added

Two interpretation-quality changes on top of v0.3.1:

- **Growth card refocused on accuracy + misconception + composite.** The
  per-session growth card no longer shows "average difficulty attempted"
  as a headline tile, since that number was the closest analog to a raw
  ability delta and was the easiest to over-interpret. The three headline
  tiles are now **Accuracy change**, **Misconception change**, and the
  **Prototype change indicator** itself (composite arrow with a numeric
  composite in the −1…+1 range). The composite still uses average
  difficulty internally so it stays robust, but the headline is now the
  two interpretable per-session deltas plus the hedged composite.
- **Class-level teacher dashboard.** A new view, reachable from the
  "Class dashboard" button on the teacher's student list, rolls up every
  completed session on the device:
  - Total students and how many have at least one completed session.
  - Total completed sessions and total response-level data points.
  - Average accuracy and average time per item across the whole class.
  - **Misconception distribution** — every non-`none` misconception code,
    sorted by total occurrences, with a horizontal bar and the list of
    students who triggered each one (clickable, drills through to that
    student's detail page).
  - **Most difficult items** — bottom 10 items by class-wide accuracy,
    with attempts, correct count, accuracy, and average time per item.
    Tie-break is attempt count so a 0/4 item ranks above a 0/1 item.
  Everything is a pure read of localStorage; no backend, no new schema.

## What v0.3.1 added

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
    ├── App.tsx                  # all views (landing, start form, assessment, results, teacher list, student detail, class dashboard)
    ├── main.tsx                 # React entry point
    ├── index.css                # Tailwind layers + component utilities
    ├── types.ts                 # Student, Session, Response, AssessmentWindow, SkillId, SkillMode
    ├── vite-env.d.ts
    ├── data/
    │   ├── items.ts             # 104 items across 7 fraction skills (MCQ + numeric entry + visual specs)
    │   └── lessons.ts           # Per-skill Learn content (reteach + visual + practice + teacher/parent notes)
    └── lib/
        ├── adaptiveEngine.ts    # session-pool sampling (skill-aware), next-item selection, ability update, stop rule
        ├── scoring.ts           # bands (per-skill), misconception aggregation, per-skill summaries, composite change indicator, prerequisite recommendations
        ├── classDashboard.ts    # class-level aggregator (with optional skill filter)
        └── storage.ts           # localStorage CRUD for students + sessions, delete + export bundle
```

### Data model

A **Student** stores an id, name, grade, optional school, and createdAt.

A **Session** stores an id, the studentId, a snapshot of the student's
attributes at the time of the attempt, the assessment window
(`baseline | midyear | endyear | practice`), the **skill mode**
(`'FR.06' | 'FR.07' | 'mixed'` — field name kept as `skillId` for v0.3
backwards compatibility), startedAt / completedAt timestamps, every
individual response, and the final running ability estimate.

An **Item** is a discriminated union of `MCQItem` and `NumericItem`.
Both share `id`, `skillId` (`'FR.06' | 'FR.07'`), `stem`, `difficulty`
(1–10), `band`, `cognitiveType`, optional `visual` (fraction bars or
area grid), and a worked `solution`. MCQ items add four `options` —
each tagged with the misconception code it represents — and a
`correctIndex`. Numeric items add `acceptedAnswers`, named
`errorPatterns` (each with its own misconception tag), and an
`inputHint`.

Misconception codes include `add_across`, **`subtract_across`**,
`incomplete_conversion`, `product_not_lcm`, `operation_confusion`,
`mixed_number_error`, **`borrowing_error`**, `conceptual_gap`,
`form_error`, `arithmetic_slip`, and `visual_misread`. Each code has a
human label, a suggested next teaching step that the teacher dashboard
surfaces, and (in `scoring.ts`) a list of prerequisite skills it points
to.

### Adaptive rule

- **Scope the bank by skill mode.** The teacher's selection on the Start
  form (FR.06, FR.07, or mixed) restricts which items are eligible:
  `filterItemsBySkillMode(ITEMS, mode)`. For mixed, both banks are in
  play together.
- **Build a session pool.** For each attempt, draw 2 foundational + 5
  core + 3 advanced items from the eligible bank, preferring items this
  student has not seen on prior attempts. If the unseen-by-band set is
  too small, fall back to seen items in the same band so we still hit
  the stratified target. Top up cross-band only as a last resort.
- **Start at ability = 5.**
- On a correct answer, ability += 1 (capped at 10).
- On an incorrect answer, ability -= 1 (floored at 1).
- **Pick the next item from the session pool** (not the full bank) whose
  difficulty is closest to the current ability. Deterministic tiebreak
  by item id.
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

1. **Teacher validation of the 104 items.** A CBSE Class 6 math teacher
   should read every stem, every option, every accepted numeric answer,
   and every worked solution across both FR.06 and FR.07. Register,
   phrasing, and context (names, units, everyday scenes) must feel
   natural. Pay particular attention to the new mixed-number subtraction
   items in FR.07, where the borrowing step is the load-bearing piece.
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
4. **Calibration study.** Collect ~200 responses per item from a
   representative sample of Class 6 students (the JSON export is
   structured for this). Fit a Rasch or 2PL IRT model (for example with
   `mirt` in R or `py-irt` in Python). Replace seed difficulty with
   calibrated parameters. Re-compute bands from a proper cut-score study.
   With two skills now in scope, the model fit can support a multi-skill
   ability estimate rather than a single number.
5. **Backend + identity.** Replace localStorage with a real database
   (e.g., Supabase or Firebase). Add teacher authentication. Add
   per-school rosters and class management. Support sync across devices.
6. **Expand skill coverage.** Apply the same template (≥20 items per
   skill, tagged distractors, teacher-validated, cognitive-lab piloted,
   calibrated) to more skills in the Class 6 Math skill tree —
   multiplication and division of fractions are the natural next step
   after addition + subtraction.

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
