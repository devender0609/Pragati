# Pragati — Growth Assessment Prototype

A **CBSE/NCERT-informed prototype**, mapped to a draft skill framework
for CBSE Class 6 Math (and a small Class 7 starter as of v0.23).
As of v0.24 the Teacher Home is reorganised into three tabs
(Today / Pilot setup / Admin &amp; validation) to declutter the dashboard,
v0.25 deepened the Class 7 starter with three more modules
(Lines &amp; Angles, Comparing Quantities, Data Handling Basics) and
added a priority-based item-review workflow, and **v0.26 introduces a
curriculum registry** so new grades and subjects can be added as data
rather than as edits to central `types.ts`, `scoring.ts`, and
`accessCodes.ts`. The Class 6 &amp; Class 7 assessments and every
localStorage record from earlier releases continue to work unchanged.
This MVP covers **six Class 6
Math modules** — **Fractions** (7 skills), **Decimals** (5 skills),
**Factors & Multiples** (5 skills), **Ratio & Proportion** (5 skills),
**Algebra Basics** (5 skills), and **Geometry Basics** (9 skills, now
including Symmetry and Coordinate basics) — over a **390-item bank**
with an optional **Firebase classroom backend** (self-service teacher
sign-up / sign-in, password reset, profile, push-only sync with
background auto-sync every 5 minutes, classroom roster) that degrades
cleanly to local-demo mode when not configured, a **4-step first-run
onboarding wizard**, a **teacher dashboard summary** widget with
weakest-skills / top-misconceptions / recent activity, **distinct
teacher/student visual modes**, a **sample-classroom seeder** for
demo / pilot rehearsal, plus **richer per-skill learning materials**
(mini-lesson, visual walkthrough, misconception-coded reteach,
teacher activity, independent practice, exit ticket, parent home practice,
printable worksheet) and a per-student **Learning Path** that focuses on
the weakest skill from the most recent session, with
mixed item types (MCQ, numeric entry, visual fraction bars and area
grids), plus a Learn section with a reteach lesson, visual
explanation, two worked examples, three common-mistake notes, and
five practice questions for every skill, and demonstrates:

> **Important:** Pragati is NOT an official CBSE-aligned product, NOT a
> calibrated assessment, and NOT a teacher-validated mapping. The
> alignment, learning outcomes, and competency statements here are this
> prototype's reading of the public Class 6 framework (NCF / NCERT /
> Ganita Prakash). A CBSE Class 6 maths teacher should review every
> "medium" or "needs teacher review" item before any pilot use.

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

## Deploy troubleshooting

If a clean Linux/Vercel build fails with:

```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

that is the npm optional-dependencies bug
([npm/cli#4828](https://github.com/npm/cli/issues/4828)) — the lockfile
declares Rollup's platform-specific binaries as optional but doesn't
resolve them on a different OS. Two fixes:

1. **Quick fix locally:** delete `node_modules` and `package-lock.json`,
   reinstall, commit the regenerated lockfile.
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   git add package-lock.json
   git commit -m "Regenerate lockfile to fix Rollup native-binary bug"
   git push
   ```
2. **Permanent fix (already applied in v0.15):** `package.json` lists
   `@rollup/rollup-linux-x64-gnu`, `-darwin-arm64`, `-darwin-x64`, and
   `-win32-x64-msvc` in `optionalDependencies`. npm then tries to
   resolve them on every platform and silently skips ones that don't
   match the OS, so the lockfile always carries the linux entry that
   Vercel needs.

Other deploy reminders:

- **Do not commit `node_modules` or `dist`.** They are generated.
  `.gitignore` excludes them, and the repo only tracks source +
  config (≈ 25 files).
- **Use `npm ci && npm run build` before deploy.** `npm ci` installs
  exactly what `package-lock.json` says — this is what Vercel runs.
  `npm run build` runs `tsc --noEmit` then `vite build`. If either step
  fails, don't push.

---

## Pilot-ready status

Pragati is a **CBSE/NCERT-informed prototype** — fine for a small,
opt-in, teacher-supervised pilot of 5–10 students. It is **not** an
official CBSE-aligned product, **not** a calibrated assessment, and
**not** a teacher-validated mapping.

**What is ready:**
- Three full assessment surfaces: student home (recommended assessment,
  practise weak skill, learn next skill, plus the active assignment
  card), assessment runner (MCQ + numeric + visual fraction bars / area
  grids), and results page (band, per-skill breakdown, growth indicator,
  next-step suggestion, student feedback capture).
- Teacher workflow home with a six-step guided flow, pilot-readiness
  checklist, prominent next-step CTA, and a "More tools" panel.
- Per-student growth history, per-class dashboard, teaching plan
  (weakest skills, top misconceptions, suggested small groups,
  recommended reteach), and per-item review.
- Pilot tagging end-to-end: pilot setup, active-pilot indicator on the
  navbar, sessions tagged with `pilotId`, JSON export bundle including
  pilot metadata, and a dedicated **Pilot Report view** with Export
  JSON + Copy Summary buttons.
- localStorage-only persistence — no login, no backend, no network.
  Teacher can hand the device back to a student without disturbing
  another teacher's data.

**What is prototype-only:**
- Difficulty values are **seed estimates on a 1–10 scale**, not IRT
  parameters.
- The "ability estimate" and the prototype "growth indicator" are
  rule-based heuristics on a small per-skill bank — useful as a teacher
  conversation starter, not a placement signal.
- Skill-status labels (`not_started` / `developing` / `strong`),
  alignment confidence (`high` / `medium` / `needs_teacher_review`),
  and item quality flags all come from rule-based heuristics — every
  "medium" or "needs_teacher_review" item should be reviewed by a CBSE
  Class 6 maths teacher before any pilot use.
- Items have not been through a full teacher-validation review or a
  student cognitive lab yet.
- The pilot report's "recommended next teaching action" is a heuristic
  pick (weakest skill → top misconception → "keep collecting
  evidence"), not a calibrated recommendation.

**How to run a small 5–10 student pilot on this device:**
1. Open the app on the device the students will use.
2. Switch to **Teacher mode** (toggle in the navbar).
3. **Set up the pilot** (Pilot mode card on the workflow home): teacher
   name, class name, school, date, default skill mode, notes. Click
   **Start pilot**.
4. **Create one or two assignments** (Assignments → New assignment).
   Set the title, focus, item count, audience (whole class / small
   group / individual student), and any teacher note. Save.
5. Switch back to **Student mode** and hand the device to a student.
   The active assignment surfaces as the primary card. Each student
   takes the assignment, sees their results, and can leave feedback.
6. Repeat for each student in the pilot. Sessions append; nothing is
   ever overwritten.
7. Switch to **Teacher mode** → **Class dashboard** to see the class
   roll-up, **Teaching plan** to see weakest skills + suggested
   groups, and **Pilot report** for the one-page summary.
8. **Export pilot data** from the workflow home (or **Export Pilot
   Report JSON** from the pilot report page) when the run is over.
   Both downloads are pure client-side and never leave the device
   except via the teacher's own download.

**Reminder:** Pragati is a prototype. Use the dashboards to focus a
teacher conversation, not to make placement, promotion, or remediation
decisions about a student.

---

## What this version adds (v0.39)

**Accuracy & validity infrastructure.** New content-integrity module
that runs mechanical checks over the whole item bank and enforces
them in CI. Surfaced 6 real bugs on first run — all fixed in this
release.

### The check module

`src/curriculum/contentIntegrity.ts` — six pure functions over
`ITEMS`:

- `detectDuplicateStems` — same stem authored twice (case-insensitive,
  whitespace-collapsed). Warning-level.
- `checkDifficultyDistribution` — every module has at least one
  foundational, one core, and one advanced item.
- `detectMissingSolutions` — item without a `solution` string. Error.
- `detectShortSolutions` — solution under 20 chars. Info-level.
- `detectMcqDuplicateOptions` — MCQ where two option texts collapse
  to the same normalized string. Error.
- `detectMcqMissingMisconception` — MCQ distractors without a
  misconception code. Warning.

`runContentIntegrity()` aggregates them all and returns
`{ issues, countsBySeverity, countsByCategory, totalItems }`.

### Bugs surfaced & fixed on first run

The initial run flagged 6 items where two MCQ options normalized to
the same text (student could not distinguish two choices):

- `DE.04-04` — Class 6 Decimals — "3.75" appeared as options A and D
- `G2.03-03` — Class 2 subtraction — "55" appeared twice
- `G2.11-04` — Class 2 tables — "18" appeared twice
- `G4.04-04` — Class 4 large numbers — "65,442" appeared twice
- `G4.08-04` — Class 4 long × — "2532" appeared twice
- `G10.26-02` — Class 10 grouped statistics — "l + f × h" vs "l + F × h"
  collapsed under case-insensitive compare

Each item was patched with a distinct plausible distractor.

### Test-suite coverage

New `src/curriculum/__tests__/contentIntegrity.test.ts` (7 tests):
- Regression guards that assert 0 missing solutions, 0 duplicate MCQ
  options across the whole bank.
- Targeted unit tests for each detector against synthetic inputs.
- Report-aggregator sanity check.

The MCQ-duplicate-options check is now a hard test — any future
authoring mistake that ships a duplicate-option item fails the
build.

### Command output (v0.39)

```
npm ci                       → 253 packages
npm run typecheck            → 0 errors
npm test                     → 8 files, 87 tests, 87 passed / 0 failed
npm run build                → ✓ built in 7.85s
```

Test count grew from 80 → 87 (+7 integrity tests).

---

## What v0.38 added

**Math notation rendering with KaTeX.** Previously, item stems and
solutions displayed LaTeX-like source as-is: `\frac{1}{2}` stayed
as literal text, exponents like `x²` relied on unicode, integrals
`∫f(x)dx` looked awkward. v0.38 introduces a `<MathText>` component
that renders any `$...$` (inline) or `$$...$$` (block) fragment
through KaTeX and leaves the rest as plain text.

### What changed

- **New dependency**: `katex@^0.16` (~275 kB minified; loaded from the
  main bundle) + KaTeX stylesheet.
- **New component**: `src/components/common/MathText.tsx`. Parses the
  input string into `text | $inline$ | $$block$$` segments, renders
  each math segment with `katex.renderToString`, escapes text
  segments, and joins them into a single element with
  `dangerouslySetInnerHTML`. `\$` in source is honored as a literal
  dollar sign (so "₹ costs $5" style copy is safe).
- **Fallback**: KaTeX runs with `throwOnError: false` and `strict:
  'ignore'` — a malformed LaTeX fragment renders as literal source
  rather than blanking the item.
- **Wired in**: item stem + MCQ option text in `Assessment`, item
  stem + `solution` in `LearnView` and `ItemReviewView`. Existing
  plain-text items keep rendering identically; new authored items
  can opt-in with `$...$` markers.

### Author example

```
"Standard equation of a circle centred at origin, radius r: $x^2 + y^2 = r^2$."
"$\\int_0^1 x^2\\,dx = \\frac{1}{3}$"
"$$\\frac{d}{dx}(x^n) = n x^{n-1}$$"
```

Everything already in the bank (240+ items with unicode math) keeps
working. Future item revisions can migrate to KaTeX progressively.

### Command output (v0.38)

```
npm ci                       → added 251 + 2 (katex) packages
npm run typecheck            → 0 errors
npm test                     → 7 files, 80 tests, 80 passed / 0 failed
npm run build                → ✓ built in 6.37s (bundle now 2.17 MB / 548 kB gzip)
```

Note: bundle grew ~260 kB (raw) / ~80 kB (gzip) due to KaTeX. v0.40
plans code-splitting via dynamic import so KaTeX only loads when a
math-tagged item is rendered.

---

## What v0.37 added

**Colorful per-grade palette + navigation polish.** First step of the
UI-quality push. The previous starter/full modules across Classes
1-5 and 8-12 all used a uniform slate chip color, which made 21
grade rows look identical on the module dashboard. v0.37 assigns
each grade a distinct color and threads it through chips, the session
progress bar, and a new grade badge.

### Colorful per-grade palette

Introduced `src/components/common/gradePalette.ts`. Each grade
(Class 1-12) gets `{chip, accent, header, text, border}` tokens
drawn from the Tailwind rainbow:

- Class 1 rose · 2 orange · 3 amber · 4 lime · 5 emerald
- Class 6 teal (kept handcrafted per-module) · 7 cyan (same)
- Class 8 sky · 9 blue · 10 indigo · 11 violet · 12 fuchsia

`MODULE_CHIP_CLASS` in SkillChip.tsx now inherits the grade color for
all Classes 1-5 and 8-12 modules. Class 6 and Class 7 keep their
handcrafted per-module palettes so each of those 12 modules stays
visually distinct at a glance.

### Session polish

- **Grade badge** — a new `<GradeBadge>` chip renders in the session
  header ("Class 8") so students never lose track of what class the
  session belongs to.
- **Grade-tinted progress bar** — the session progress bar was hard-coded
  to `bg-brand-600`. It now picks up the current grade's accent color
  (e.g. `bg-sky-500` for a Class 8 session), so the bar itself
  is a subtle grade cue.
- **Dot-per-item rail** — under the % bar, a row of dots (one per item
  slot) shows answered / current / upcoming state. The current dot
  pulses with a ring; answered dots are filled with the grade color.
  Every dot carries an `aria-label` for screen readers.

### Command output (v0.37)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 7 files, 80 tests, 80 passed / 0 failed
npm run build                → ✓ built in 5.60s
```

Next iterations (already scheduled):
- v0.38 — KaTeX math notation rendering
- v0.39 — accuracy / validity infrastructure (duplicate detection, teacher-approve workflow)
- v0.40 — full student-flow redesign + empty-state polish

---

## What v0.36 added

**Primary bundle: Classes 1–5 get full chapter coverage.** Iteration 4
of the "all chapters for every class" rollout closes the gap for the
primary grades, which had been sitting on 2 modules each since v0.31.

### 4 new modules per grade × 5 grades = 20 new modules

Each primary grade now has **6 modules × 3 skills × 4 items = 72
items** (matching the 6-module shape of the Class 6 and Class 7 banks).
Added modules per grade:

- **Class 1** — Numbers 21–99, Addition & Subtraction up to 50, Time
  basics, Measurement basics
- **Class 2** — Numbers up to 999 & 3-digit arithmetic, Tables & division,
  Fractions & length/weight, Capacity/pictographs/3D shapes
- **Class 3** — Numbers up to 10,000 & 4-digit arithmetic, Tables 6–10 & division,
  Fractions on line/time/money, Weight/bar graphs/patterns
- **Class 4** — Numbers up to 99,999 & long ×/÷, Fractions & decimals,
  Perimeter/area/symmetry, Time/money/data
- **Class 5** — Crore/HCF/LCM, Decimal & fraction ops, Percent/volume/angles,
  Data (mean) & mixed word problems

Total new content: **240 items across 60 skills**. Every item marked
`teacher_review_required`. No claim of CBSE-verified alignment. Content
is a plain-English NCERT-informed prototype — a subject teacher should
walk the bank before pilot use.

### Programmatic content counts (v0.36)

| Grade | Modules | Skills | Items | Status | Chapter coverage |
| ---: | ---: | ---: | ---: | :---: | :---: |
| **1** | **6** | **18** | **72** | Teacher review required | **Primary bundle full (v0.36)** |
| **2** | **6** | **18** | **72** | Teacher review required | **Primary bundle full (v0.36)** |
| **3** | **6** | **18** | **72** | Teacher review required | **Primary bundle full (v0.36)** |
| **4** | **6** | **18** | **72** | Teacher review required | **Primary bundle full (v0.36)** |
| **5** | **6** | **18** | **72** | Teacher review required | **Primary bundle full (v0.36)** |
| 6 | 6 | 36 | 390 | Piloted-quality | Complete for the framework used |
| 7 | 6 | 18 | 138 | Teacher review required | Class 7 starter + deepening |
| 8 | 10 | 30 | 120 | Teacher review required | All ~13 NCERT chapters |
| 9 | 10 | 30 | 120 | Teacher review required | All ~14 NCERT chapters |
| 10 | 10 | 30 | 120 | Teacher review required | All ~14 NCERT chapters |
| 11 | 10 | 30 | 120 | Teacher review required | All ~10 NCERT chapters |
| 12 | 10 | 30 | 120 | Teacher review required | All ~13 NCERT chapters |

### Multi-iteration rollout status

- ✅ **v0.29 / v0.31** — Classes 1–5 & 8–12 (starter, 2 modules each)
- ✅ **v0.32** — Class 10 + Class 12 full coverage
- ✅ **v0.33** — Class 8 + Class 9 full coverage
- ✅ **v0.34** — blank-page crash fix (SKILL_ALIGNMENT hardening)
- ✅ **v0.35** — Class 11 full coverage + auto-synthesised lessons
- ✅ **v0.36** — Classes 1–5 primary full coverage

Every grade in Classes 1–12 now has multi-module coverage suitable
for a pilot walkthrough (subject-teacher review required before use
with real students).

### Command output (v0.36)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 7 files, 80 tests, 80 passed / 0 failed
npm run build                → ✓ built in 5.76s
npm run validate:curriculum  → 1 test passed (0 registry errors)
```

---

## What v0.35 added

**Two parallel improvements** in response to the screenshot that
showed "Guided learning path unavailable" on skill G12.03:

### 1. Auto-synthesised lessons — no more "unavailable" screens

The v0.29 → v0.33 rollout added 200+ prototype skill codes
(G1.01 … G12.30) but only a handful had hand-authored `Lesson`
records. Everywhere else — the Learn tab, the Student Learning Path,
the skill card on the module dashboard — either crashed or fell back
to a "no lesson authored yet" placeholder.

v0.35 introduces `src/data/lessonSynthesis.ts`, which reads the
actual item bank for a skill and builds a real, teacher-review-required
lesson from it on the fly:

- **Intro** — 2 sentences that name the skill and explain the layout
- **Reteach steps** — extracted from the solution field of the
  easier items, so the reteach reflects real content, not filler
- **Two worked examples** — the two easiest items, with their
  solution strings split into numbered steps and the correct
  answer shown at the bottom
- **Common mistakes** — derived from the `misconception` codes on
  each distractor / `errorPattern`, mapped to short "why students
  make it" + "how to fix" copy
- **Practice** — the remaining item IDs, hidden-answer

Nothing is invented: every worked example, every mistake, every
answer traces back to an item already in the bank. The alignment
layer continues to mark these skills `needs_teacher_review` so the
honesty guarantees still hold. `lessonFor()` now always returns
a `Lesson`, so the v0.34 `lesson?.` guards in `App.tsx`,
`StudentLearningPath.tsx`, and `teachingPlan.ts` are gone.

### 2. Class 11 full NCERT chapter coverage

Iteration 3 of the "all chapters for every class" rollout. 8 new
modules × 3 skills × 4 items = **96 new items** covering the
Class 11 NCERT Mathematics chapters that weren't in the v0.29 /
v0.31 starter modules:

- Relations & Functions extended (Ch 2)
- Trigonometric Functions (Ch 3)
- Linear Inequalities (Ch 6)
- Permutations and Combinations (Ch 7)
- Binomial Theorem (Ch 8)
- Conic Sections (Ch 11)
- Limits and Derivatives (Ch 13)
- Probability (Ch 16)

Combined with the v0.29 / v0.31 starter modules, **Class 11 now has
10 modules × 3 skills = 30 skills, 120 items** — the same
"grade-full" coverage as Classes 8, 9, 10, and 12.

Every new item is marked `teacher_review_required`. No content is
claimed to be CBSE-verified. A subject teacher should walk the bank
before pilot use.

### Programmatic content counts (v0.35)

| Grade | Modules | Skills | Items | Status | Chapter coverage |
| ---: | ---: | ---: | ---: | :---: | :---: |
| **1–5** | 2 each | 6 each | 24 each | Teacher review required | Starter (2 modules) |
| **6** | 6 | 36 | 390 | Piloted-quality | Complete for the framework used |
| **7** | 6 | 18 | 138 | Teacher review required | Class 7 starter + deepening |
| **8** | 10 | 30 | 120 | Teacher review required | All ~13 NCERT chapters |
| **9** | 10 | 30 | 120 | Teacher review required | All ~14 NCERT chapters |
| **10** | 10 | 30 | 120 | Teacher review required | All ~14 NCERT chapters |
| **11** | 10 | 30 | 120 | Teacher review required | **All ~10 NCERT chapters (v0.35)** |
| **12** | 10 | 30 | 120 | Teacher review required | All ~13 NCERT chapters |

### Multi-iteration rollout status

- ✅ **v0.29 / v0.31** — Classes 1–5 & 8–12 (starter, 2 modules each)
- ✅ **v0.32** — Class 10 + Class 12 full coverage
- ✅ **v0.33** — Class 8 + Class 9 full coverage
- ✅ **v0.34** — blank-page crash fix (SKILL_ALIGNMENT hardening)
- ✅ **v0.35** — Class 11 full coverage + auto-synthesised lessons
- **v0.36 (next)** — Classes 1–5 full coverage (primary bundle)

### Command output (v0.35)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 7 files, 80 tests, 80 passed / 0 failed
npm run build                → ✓ built in 5.39s
npm run validate:curriculum  → 1 test passed (0 registry errors)
```

---

## What v0.34 added

**Bug-fix release.** No new content, no new grades.

**The bug (introduced in v0.29 and only surfaced now that lots of
starter items are in the bank):** any teacher tab that walked
`ITEMS` and called `getItemAlignment()` — Item Review, Alignment
Review, Class Dashboard, Teaching Plan — crashed with
`Cannot read property 'chapterReference' of undefined` because
`SKILL_ALIGNMENT` had no entries for the 140+ new starter skill
codes (G1.01 … G12.30). The crash reached React's error boundary
and rendered a blank page.

### What changed

1. **`SKILL_ALIGNMENT` widened to `Partial<Record>`.** No fake
   entries were shipped for the starter skills; the type now
   correctly represents that some skills don't have hand-authored
   alignment yet.
2. **`getItemAlignment` returns a safe fallback** for items whose
   skill has no alignment record. The fallback surfaces the skill
   name and marks the item as `needs_teacher_review` — no fake
   NCERT chapter reference is invented.
3. **`buildSkillAlignmentSummary`** initialises buckets on demand
   rather than only for pre-registered skills, so aggregate views
   don't crash on starter items.
4. **`skillsForModule`** filters out undefined entries.
5. **`AlignmentReviewView`** renders a "no alignment authored yet"
   fallback panel for starter skills.
6. **`LearnView`** renders a "no lesson authored yet" fallback for
   skills where `LESSONS[skill]` is undefined; the student can
   still start the practice.
7. **`StudentLearningPath`** short-circuits with a friendly note
   when the weakest skill has no authored lesson.
8. **`lessonFor()` type widened to `Lesson | undefined`** and
   callers guarded (`?.practice ?? []`).
9. **New `smoke.test.ts`** walks every item in the bank through
   `getItemAlignment` and every registered skill through
   `lessonFor` — catches this class of regression at test time.

### Command output (v0.34)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 7 files, 80 tests, 80 passed / 0 failed
npm run build                → ✓ built in 5.51s
npm run validate:curriculum  → 1 test passed (0 registry errors)
```

The 3 new smoke tests exercise 1,158 items and every registered
skill through the exact code paths that were blanking the tabs.

---

## What v0.33 added

**Iteration 2 of the full-coverage rollout: Class 8 + Class 9** (secondary),
plus an **AssessmentPicker UX fix** that lets the picker actually start
an assessment for a brand-new student.

### AssessmentPicker fix (answers "why do I get 'No active student'?")

The picker previously refused to start any session unless there was a
student record on the device. On a fresh device (opening the picker
directly from the landing "Start" card), that meant a dead end.

v0.33 changes:
- Removed the stale **v0.27** version tag from the picker header.
- Rewrote the intro copy to reflect current content status.
- Added an inline **"Your name"** field at the Start step when no
  active student exists. Typing a name creates a local Student record
  (via `findOrCreateStudent`) and starts the assessment for it — no
  need to bounce back to StartForm.

### Content — Class 8 + Class 9 (secondary)

Each grade now covers all NCERT Math chapters via 10 modules.

**Class 8 chapters (v0.29/v0.31 + v0.33):**
Rationals · Linear equations · Squares & cubes · Area △/▱ · Pie charts · Identities · **Quadrilaterals · Data Handling ext · Comparing Quantities · Algebraic Expressions ext · Mensuration ext · Exponents and Powers · Direct/Inverse Proportions · Introduction to Graphs**

**Class 9 chapters (v0.29/v0.31 + v0.33):**
Real numbers · Polynomials · Coordinate geometry · Linear Eqns 2-var · Congruence · Mean/median/mode · **Lines & Angles · Quadrilaterals · Areas of ∥m & △ · Circles · Heron's Formula · Surface Areas & Volumes · Probability · Euclid's Geometry + Rationalisation**

### Programmatic content counts (v0.33)

| Grade | Modules | Skills | Items | Availability | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | 6 | 24 | Teacher review required | Starter |
| 2 | 2 | 6 | 24 | Teacher review required | Starter |
| 3 | 2 | 6 | 24 | Teacher review required | Starter |
| 4 | 2 | 6 | 24 | Teacher review required | Starter |
| 5 | 2 | 6 | 24 | Teacher review required | Starter |
| 6 | 6 | 36 | 390 | **Available** | Reviewed baseline |
| 7 | 6 | 18 | 144 | Teacher review required | Class 7 deepened |
| **8** | **10** | **30** | **120** | **Teacher review required** | **All ~13 NCERT chapters (v0.33)** |
| **9** | **10** | **30** | **120** | **Teacher review required** | **All ~14 NCERT chapters (v0.33)** |
| 10 | 10 | 30 | 120 | Teacher review required | All 14 NCERT chapters (v0.32) |
| 11 | 2 | 6 | 24 | Teacher review required | Starter |
| 12 | 10 | 30 | 120 | Teacher review required | All 13 NCERT chapters (v0.32) |
| **Total** | **64** | **210** | **1,158** | | |

### Multi-iteration rollout status

- ✅ **v0.32** — Class 10 + Class 12 (board grades) full coverage
- ✅ **v0.33** — Class 8 + Class 9 (secondary) full coverage
- **v0.34** — Class 11 full coverage (senior secondary, ~16 chapters)
- **v0.35** — Classes 1–5 full coverage (primary bundle)

**All new content marked `teacher_review_required`.** Not
CBSE/NCERT-verified. Not reviewed by a subject-matter teacher.
Not calibrated. Every item shows up in the teacher review view as
"needs teacher review".

### Command output (v0.33)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 6 files, 77 tests, 77 passed / 0 failed
npm run build                → ✓ built in 9.23s
npm run validate:curriculum  → 1 test passed (0 registry errors)
```

Every one of the 64 registered modules and 210 registered skills has
at least one item; every blueprint has enough eligible items to reach
its `minItems`. The validator enforces this.

---

## What v0.32 added

**Iteration 1 of the multi-iteration "full NCERT chapter coverage"
rollout: Class 10 + Class 12** (both board-exam grades).

Both grades now have all NCERT Math chapters represented in the
registry as separate modules. Class 10 covers all 14 chapters
(10 modules including the earlier v0.29/v0.31 starters); Class 12
covers all 13 chapters (10 modules including the earlier starters).

### Programmatic content counts (v0.32)

| Grade | Modules | Skills | Items | Availability | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | 6 | 24 | Teacher review required | 2-module starter |
| 2 | 2 | 6 | 24 | Teacher review required | 2-module starter |
| 3 | 2 | 6 | 24 | Teacher review required | 2-module starter |
| 4 | 2 | 6 | 24 | Teacher review required | 2-module starter |
| 5 | 2 | 6 | 24 | Teacher review required | 2-module starter |
| 6 | 6 | 36 | 390 | **Available** | Reviewed baseline |
| 7 | 6 | 18 | 144 | Teacher review required | Class 7 deepened |
| 8 | 2 | 6 | 24 | Teacher review required | 2-module starter |
| 9 | 2 | 6 | 24 | Teacher review required | 2-module starter |
| **10** | **10** | **30** | **120** | **Teacher review required** | **All 14 NCERT chapters** |
| 11 | 2 | 6 | 24 | Teacher review required | 2-module starter |
| **12** | **10** | **30** | **120** | **Teacher review required** | **All 13 NCERT chapters** |
| **Total** | **48** | **162** | **966** | | |

### Class 10 module coverage (v0.32)

1. HCF/LCM, Quadratics, Basic Trig (v0.29 starter — Ch 1, 4, 8 partial)
2. Coordinate Geometry / AP / Circles (v0.31 — Ch 5, 7, 10 partial)
3. **Polynomials (Ch 2)** — types, zeros, division
4. **Pair of Linear Equations in Two Variables (Ch 3)** — graphical, substitution, consistency
5. **Triangles / Similarity (Ch 6)** — BPT, similarity criteria, Pythagoras
6. **Applications of Trigonometry (Ch 9)** — elevation, depression, heights & distances
7. **Areas Related to Circles (Ch 11)** — circle area, sector, segment
8. **Surface Areas and Volumes (Ch 12)** — combinations, frustum
9. **Statistics grouped data (Ch 13)** — mean, median, mode
10. **Probability (Ch 14)** — sample spaces, simple events, complementary

### Class 12 module coverage (v0.32)

1. Matrices, Derivatives, Integrals (v0.29 starter — Ch 3, 5, 7 partial)
2. Determinants, Chain rule, Dot product (v0.31 — Ch 4, ch 5 ext, ch 10 partial)
3. **Relations and Functions (Ch 1)** — types, composition, inverse
4. **Inverse Trigonometric Functions (Ch 2)** — principal values, identities
5. **Applications of Derivatives (Ch 6)** — monotonicity, max/min, rate of change
6. **Applications of Integrals (Ch 8)** — area under curve, area between curves
7. **Differential Equations (Ch 9)** — order/degree, separable, linear first-order
8. **Three-dimensional Geometry (Ch 11)** — direction cosines, line, plane
9. **Linear Programming (Ch 12)** — basics, constraints, graphical
10. **Probability (Ch 13)** — conditional, Bayes intuition, random variables

**All new content marked `teacher_review_required`.** Not
CBSE/NCERT-verified. Not reviewed by a subject-matter teacher.
Not calibrated. Every item shows up in the teacher review view as
"needs teacher review".

### Multi-iteration rollout plan (remaining grades)

- **v0.33** — Class 8 + Class 9 full chapter coverage (secondary)
- **v0.34** — Class 11 full chapter coverage (senior secondary)
- **v0.35** — Classes 1–5 full chapter coverage (primary bundle)

### Command output (v0.32)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 6 files, 77 tests, 77 passed / 0 failed
npm run build                → ✓ built in 5.36s
npm run validate:curriculum  → 1 test passed (0 registry errors)
```

Every one of the 48 registered modules and 162 registered skills has
at least one item; every blueprint has enough eligible items to reach
its `minItems`. The validator enforces this.

---

## What v0.31 added

v0.31 does **content expansion + four "flawless-app" polish items**.

### Scope note — content is still not "exhaustive"

The user asked for exhaustive CBSE Math coverage across Classes 1–12.
An honest exhaustive bank per grade is 200–400 authored items with
verified answers, distractor rationales, misconception mapping, and
teacher review — roughly 2,000–5,000 items in total. That is not
achievable in a single iteration without producing shallow, templated
items that violate rules set earlier in this project.

v0.31 delivers a **realistic middle**: each starter grade doubled
from 12 → 24 items, gaining a second three-skill module with real
CBSE-appropriate topics. Total item count is now **774** across
**32 modules and 114 skills**. Full exhaustive coverage requires a
proper curriculum-author workflow with teacher review at each step —
not batch LLM generation.

### 1. Second starter module per grade (120 new items)

For each of Classes 1–5 and 8–12, added one new module with 3 new
skills × 4 items = 12 items per grade (120 items total across the 10
starter grades). Coverage:

| Grade | Module 1 (v0.29) | Module 2 (v0.31) |
| --- | --- | --- |
| 1 | Counting, Add, Subtract | Shapes, Length compare, Coins |
| 2 | Place value, 2-digit Add/Sub | Tables 2/3, Rupees & paise, Clocks |
| 3 | Times tables, Division, 3-digit place | Fractions, 3-digit Add, Length in m |
| 4 | Fractions intro, Measurement, Multi-digit × | Lakhs, Division with rem., Decimals |
| 5 | Decimal PV, Percentage, Long division | Fractions unlike, Perimeter/Area, Bar graphs |
| 8 | Rationals, Linear eqns, Squares/cubes | Area △/▱, Pie charts, Identities |
| 9 | Real numbers, Polynomials, Coord geom | LE 2-var, Congruence, Mean/median/mode |
| 10 | HCF/LCM, Quadratics, Trig basics | Distance/section, AP, Tangent |
| 11 | Sets, Functions, Trig identities | Complex, GP sum, Line slope |
| 12 | Matrices, Derivatives, Integrals | Determinants, Chain rule, Dot product |

Every new module and skill is registered with
`availability: 'teacher_review_required'`. The item review view shows
every one as "needs teacher review."

### 2. Programmatic content counts (v0.31)

| Grade | Modules | Skills | Items | Availability |
| --- | --- | --- | --- | --- |
| 1–5 | 2 each | 6 each | 24 each | Teacher review required |
| 6 | 6 | 36 | 390 | Available |
| 7 | 6 | 18 | 144 | Teacher review required |
| 8–12 | 2 each | 6 each | 24 each | Teacher review required |
| **Total** | **32** | **114** | **774** | |

### 3. Polish items

- **StartForm / OnboardingFlow class picker.** Both forms replaced
  the free-text `grade` field with a dropdown of Class 1–12, so a
  student's persisted grade always maps to a real gradeId via
  `migrateLegacyStudentGrade`.
- **Unified selected-grade localStorage.** The AssessmentPicker
  now cross-writes its choice to `pragati.selected_grade.v1` as
  well, so picking a class in the picker also updates the module
  dashboard hero.
- **`comparabilityReason` displayed in the results screen.** When
  Pragati refuses to compare a session with a prior session
  (different grade, subject, module, or scope-kind), the results
  screen now shows a "Growth comparison unavailable — reason" note
  instead of silently hiding the growth card.

### Command output (v0.31)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 6 files, 77 tests, 77 passed / 0 failed
npm run build                → ✓ built in 7.12s
npm run validate:curriculum  → 1 test passed (0 registry errors)
```

Every one of the 32 registered modules and 114 registered skills has
at least one item; every blueprint has enough eligible items to reach
its `minItems`. The validator enforces this.

### What still isn't wired (deferred)

- Age-stage design tokens (Class 1 primary vs Class 12 senior
  secondary) still not implemented.
- The AssessmentPicker's cross-write only pushes the picker's grade
  into `pragati.selected_grade.v1`; it doesn't yet push the picker's
  subject or blueprint anywhere else. Adequate for now.
- True exhaustive content per grade (10–15 chapters × 20–40 items)
  needs a curriculum-author workflow, not this iteration.

---

## What v0.30 added

v0.30 makes the registry-driven **AssessmentPicker the default entry
point** for the student flow and retires the last piece of the closed
`Grade = 'class6' | 'class7'` UI toggle. All 12 grades are now
reachable from the landing page in one click — no more "Browse
assessments" preview card at the bottom.

1. **Primary "Start recommended assessment" card now opens the
   picker.** When `onBrowseAssessments` is wired (always the case in
   App.tsx), the top-left action card on `StudentHome` opens the
   Grade → Subject → Assessment picker directly. The pre-v0.30
   Class-6-only StartForm quick-start path stays available as a small
   "Or use the Class 6 quick-start form →" link below the card so
   nothing existing breaks.

2. **Module dashboard's closed grade pill row is retired.** The
   pill row in `Class6MathDashboard` (which iterated `GRADE_LABELS`
   as pills — 2 pills in v0.24, 12 pills after v0.29 widened the
   Grade union) is replaced with a single "*(current class)* ·
   Change class →" button that opens the AssessmentPicker. That
   funnels every class-switch decision through the registry.

3. **Hard-coded "Class 6" / "Class 7" copy replaced with
   `GRADE_LABELS[grade]`.** The dashboard hero now reads its grade
   label from the same lookup table that generates the picker, so
   adding new grades doesn't require chasing string literals across
   the app.

### Command output (v0.30)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 6 files, 77 tests, 77 passed / 0 failed
npm run build                → ✓ built in 4.54s
npm run validate:curriculum  → 1 test passed
```

### What still isn't wired (deferred)

- The `pragati.selected_grade.v1` localStorage key still stores a
  legacy `Grade` union value. The AssessmentPicker uses its own key
  (`pragati.assessment_picker.v1`) for the "which class → which
  subject → which assessment" tuple. A follow-up can unify the two
  so the module-dashboard hero opens on whichever grade the picker
  last landed on.
- Age-stage design tokens (Class 1 primary vs Class 12 senior
  secondary) still not implemented — Class 1 and Class 12 land on
  the same visual density.
- `comparabilityReason(a, b)` is available but the growth card still
  just hides itself when comparison is refused; no visible
  "unavailable because…" message yet.

---

## What v0.29 added

v0.29 does two things:

1. **Adds prototype starter Math content for Classes 1–5 and Classes
   8–12.** Every one of Pragati's 12 grade shells can now actually
   run an assessment. All new content is marked
   `teacher_review_required` — see the honest table below.
2. **Wires the `areSessionsComparable` guard into growth reporting.**
   The results-screen growth card and the per-student growth panel
   now refuse to compare two sessions that don't share the same
   curriculum, grade, subject, and scope-kind — even when the legacy
   `SkillMode` string matches.

### PLEASE READ before using the new starter content

The 120 new items in `src/data/starterGrades.ts` are **prototype
content**. They are:

- **not** CBSE- or NCERT-verified,
- **not** reviewed by a subject-matter teacher,
- **not** calibrated,
- **not** sequenced against any specific chapter or textbook.

Every new module, skill, and blueprint is registered with
`availability: 'teacher_review_required'`. The teacher-facing item
review view shows every one of these items with the "needs teacher
review" priority. Do NOT use these items in a real pilot without a
teacher walking the bank first.

### Programmatic content counts (from the registry, v0.29)

| Curriculum | Grade | Modules | Skills | Items | Availability |
| --- | --- | --- | --- | --- | --- |
| CBSE | Class 1 | 1 | 3 | 12 | Teacher review required (starter) |
| CBSE | Class 2 | 1 | 3 | 12 | Teacher review required (starter) |
| CBSE | Class 3 | 1 | 3 | 12 | Teacher review required (starter) |
| CBSE | Class 4 | 1 | 3 | 12 | Teacher review required (starter) |
| CBSE | Class 5 | 1 | 3 | 12 | Teacher review required (starter) |
| CBSE | Class 6 | 6 | 36 | 390 | Available (reviewed baseline) |
| CBSE | Class 7 | 6 | 18 | 144 | Teacher review required |
| CBSE | Class 8 | 1 | 3 | 12 | Teacher review required (starter) |
| CBSE | Class 9 | 1 | 3 | 12 | Teacher review required (starter) |
| CBSE | Class 10 | 1 | 3 | 12 | Teacher review required (starter) |
| CBSE | Class 11 | 1 | 3 | 12 | Teacher review required (starter) |
| CBSE | Class 12 | 1 | 3 | 12 | Teacher review required (starter) |
| **Total** | **12 grades** | **22** | **84** | **654** | |

### What changed in code

- **New `src/data/starterGrades.ts`.** 120 items (10 grades × 3 skills
  × 4 items), MCQ only, misconceptions tagged from the existing
  taxonomy. Also exports `STARTER_GRADE_META` describing each grade's
  module and skills.
- **Legacy union expansion** in `src/types.ts`: `Grade` widened to
  `class1 … class12`; `ModuleId` gains 10 starter modules;
  `SkillId` gains 30 starter skill codes. `MODULE_GRADE`,
  `SKILLS_BY_MODULE`, `MODULES_FOR_GRADE`, `MODULE_LABELS`,
  `MODULE_DESCRIPTIONS`, `SKILL_LABELS`, `SKILL_SHORT_LABELS`,
  `SKILL_MODE_DESCRIPTIONS` all extended.
- **`BAND_DESCRIPTIONS_BY_SKILL` and `STATIC_PREREQUISITES_BY_SKILL`
  widened to `Partial<Record>`.** No hand-written band description or
  prerequisite chain is authored for the starter skills — the
  reporting layer falls back to a generic "starter, teacher review
  required" copy so nothing crashes and no fake per-skill copy is
  shipped.
- **Registry** (`src/curriculum/registry.ts`) picks up
  `STARTER_GRADE_META` and registers 10 new curriculum × grade
  entries plus one prototype starter blueprint per grade.
- **New `src/curriculum/sessionScope.ts`.** `scopeFromSession(s)`,
  `areSessionsComparable(a, b)`, `comparabilityReason(a, b)`. Used
  by `ResultsView` and the per-student growth panel in `App.tsx`.

### Command output (v0.29)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 6 files, 77 tests, 77 passed / 0 failed
npm run build                → ✓ built in 4.74s
npm run validate:curriculum  → 1 test passed (0 registry errors)
```

Every one of the 22 registered modules and 84 registered skills has
at least one item; every blueprint has enough eligible items to reach
its `minItems`. The validator enforces this.

### What still isn't wired (deferred)

- **The App-level Class 6 / Class 7 grade toggle at
  `App.tsx:927`** still uses only `'class6' | 'class7'`. The v0.27
  AssessmentPicker is the way to reach the other 10 grades in the
  UI today. A follow-up can retire the toggle once the picker
  becomes the default landing.
- Reporting UI does not visibly show the comparability reason yet —
  when a growth comparison is refused, the card just doesn't render.
  A follow-up can add a "growth comparison unavailable because…"
  note using `comparabilityReason(a, b)`.
- Age-stage design tokens (Class 1 primary vs Class 12 senior
  secondary) still not implemented.

---

## What v0.28 added

v0.28 makes the registry the **default path** for the landing-page
"Start recommended assessment" button — every session that flow
produces now carries real curriculum + blueprint context, not just
the free-text `grade` field. Nothing that worked in v0.27 changes.

1. **`pickRecommendedBlueprint(hint)`** in `src/curriculum/recommend.ts`.
   Given a student (or an incomplete hint), returns the diagnostic
   blueprint to launch, plus the resolution reason
   (`student_gradeId` | `student_grade_text` | `default_grade_06`).
   Prefers `available` blueprints over `teacher_review_required`.
   Never fabricates a blueprint — if the student's grade has no
   registered content, the resolver falls through to the historical
   Class 6 default rather than pretending there's content elsewhere.

2. **`startAssessmentFor` delegates to the registry** when the caller
   passed the default `'mixed'` skill mode and no explicit assignment.
   That is the "Start recommended assessment" flow from the landing
   page. The new Session record gets `curriculumId`, `gradeId`,
   `subjectId`, `blueprintId`, `blueprintVersion`, `scoringVersion`,
   and `contentReviewStatus` stamped on it (same fields v0.27's
   picker path already recorded). Anything explicit — a single skill,
   a mixed-module mode, or an assignment — still uses the legacy
   `filterItemsBySkillMode` path so nothing about assignments or
   deep-links breaks.

3. **13 new resolver tests** in
   `src/curriculum/__tests__/recommend.test.ts` covering: gradeId
   precedence, legacy `'Class 6'` / `'class6'` text migration,
   default-to-`grade_06` fallback, availability preference, and
   `hasUsableBlueprint` per grade. **Total suite: 66 tests, 66 passed.**

### Command output (v0.28)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 5 files, 66 tests, 66 passed / 0 failed
npm run build                → ✓ built in 5.84s
npm run validate:curriculum  → 1 test passed (0 registry errors)
```

### What still isn't wired (unchanged from v0.27)

- The App-level Class 6 / Class 7 grade toggle at `App.tsx:927` still
  uses the legacy closed `Grade` union.
- The item bank is still monolithic in `src/data/items.ts` and
  `src/data/class7.ts`.
- `StartForm` and `OnboardingFlow` still default the free-text
  `grade` field to `'Class 6'` — but the v0.28 delegation now
  normalises that free text via `migrateLegacyGradeToken` inside
  `pickRecommendedBlueprint`, so a student with `grade: 'Class 6'`
  ends up with a Session that carries `gradeId: 'grade_06'` and
  `blueprintId: 'cbse_g06_math_diagnostic'`.
- Reporting still uses the pre-v0.26 band and growth logic.
  `scopesAreComparable` is now available and blueprint context is
  on the session, but the growth-card doesn't yet enforce
  comparability.

---

## What v0.27 added

v0.27 puts the v0.26 curriculum registry to work in the student flow.
It **does not** add new content and it **does not** change any
Class 6 or Class 7 assessment that already worked.

1. **Blueprint-aware adaptive engine.** New in `src/lib/adaptiveEngine.ts`:
   `collectItemsForBlueprint(bp)`, `buildBlueprintSession(bp, priorIds)`,
   `shouldStopBlueprint(state, config, poolSize)`,
   `canFinishEarlyBlueprint(state, config)`. Blueprint sessions honour
   the blueprint's own `minItems` / `maxItems` instead of the hard-coded
   8–10 rule. If a blueprint's target modules or skills can't yield
   enough items, `buildBlueprintSession` throws and the app refuses to
   start — the "assessment with zero items" case is impossible by
   construction. Legacy `buildSessionPool` / `shouldStop` /
   `filterItemsBySkillMode` are unchanged.

2. **Registry-driven picker** (`src/components/AssessmentPicker.tsx`).
   A new screen that walks Grade → Subject → Assessment. Every option
   is read from the curriculum registry; grades with no registered
   content are shown but disabled with a "Framework being prepared"
   chip; assessments not marked `available` or
   `teacher_review_required` cannot be started. Persists the last
   selection in `pragati.assessment_picker.v1` so a student returns to
   the same context.

3. **Curriculum context on new Sessions.** When a session is launched
   via the picker, the new Session record carries `curriculumId`,
   `curriculumVersion`, `gradeId`, `subjectId`, `blueprintId`,
   `blueprintVersion`, `scoringVersion`, and `contentReviewStatus`.
   `StudentSnapshot` also captures the curriculum + grade + subject.
   Legacy sessions load unchanged.

4. **Student home entry point.** `StudentHome` gains an optional
   `onBrowseAssessments` prop; when the App passes it, a compact
   "Browse assessments" card renders below the recommended-action
   grid. The old grade toggle and legacy `startAssessmentFor` path
   are untouched.

5. **7 new blueprint tests** in
   `src/curriculum/__tests__/blueprint.test.ts` covering: grade-scoped
   item collection, no cross-grade leakage, `minItems` / `maxItems`
   enforcement, refusal on insufficient coverage, `shouldStopBlueprint`
   vs `canFinishEarlyBlueprint`. **Total suite: 53 tests, 53 passed.**

### Command output (v0.27)

```
npm ci                       → added 251 packages
npm run typecheck            → 0 errors
npm test                     → 4 files, 53 tests, 53 passed / 0 failed
npm run build                → ✓ built in ~6s
npm run validate:curriculum  → 1 test passed (0 registry errors)
```

### Explicitly NOT changed in v0.27 (deferred)

- The App-level Class 6 / Class 7 grade toggle at `App.tsx:927` still
  uses the legacy closed `Grade` union. The AssessmentPicker is the
  new v0.27 entry point but doesn't replace the toggle — a follow-up
  can retire the toggle once the picker is the default landing.
- `src/data/items.ts` and `src/data/class7.ts` are still monolithic.
  The registry reads from them through a wrapper; a follow-up can move
  them under `src/curriculum/cbse/grade-06/mathematics/…` without
  changing the public registry API.
- `StartForm` and `OnboardingFlow` still default the free-text
  `grade` field to `'Class 6'`. Only the AssessmentPicker path
  records the normalised `gradeId`.
- Reporting still uses the pre-v0.26 band and growth logic.
  `scopesAreComparable` is available for whoever wires the growth-card
  comparison next.
- Age-stage design tokens, content-governance UI, and content
  reorganisation are still deferred, as documented in the v0.26 notes.

---

## What v0.26 added

**v0.26 is an architecture-and-honesty pass.** It introduces the
extensibility spine needed to add Classes 1–12 and other subjects
without repeatedly rewriting central types, routes, and scoring code —
while keeping every Class 6 and Class 7 assessment that worked in v0.25
running exactly as before. It does **not** add new curriculum content,
and it does **not** claim Pragati now "supports Classes 1–12."

### What content actually exists (programmatic count from the registry)

| Curriculum | Grade | Subject | Modules | Skills | Items | Availability |
| --- | --- | --- | --- | --- | --- | --- |
| CBSE | Class 6 | Mathematics | 6 | 36 | 390 | Available |
| CBSE | Class 7 | Mathematics | 6 | 18 | 144 | Teacher review required |
| CBSE | Classes 1–5, 8–12 | Mathematics | 0 | 0 | 0 | Framework being prepared |
| CBSE | any grade | any other subject | 0 | 0 | 0 | Not yet available |

Grade **shells exist** for Classes 1–12 (so teachers and dashboards can
address them by stable ID), but there is no fabricated content behind
any grade that isn't in the table above. The registry, the validator,
and every test enforce this — the app cannot start an assessment with
zero eligible items.

### New — extensibility spine

1. **Curriculum registry** (`src/curriculum/`).
   - `schema.ts` — `CurriculumDefinition`, `GradeDefinition`,
     `SubjectDefinition`, `ModuleDefinition`, `SkillDefinition`,
     `AssessmentBlueprint`, `AvailabilityStatus` enum.
   - `registry.ts` — the query API: `getGrades()`, `getSubjectsForGrade`,
     `getModules`, `getSkills`, `getItemsForSkill`, `getBlueprints`,
     `getAvailableAssessments`, `getCurriculumStatus`,
     `programmaticCounts`. Wraps existing Class 6 / Class 7 data as
     the first curriculum entries — the item bank has NOT been moved,
     only wrapped, so nothing in `src/data/*` broke.
   - `grades.ts` — `grade_01` … `grade_12` with real school-stage
     mapping (`primary` / `preparatory` / `middle` / `secondary` /
     `senior_secondary`) and a `migrateLegacyGradeToken` helper.
   - `migrations.ts` — `migrateLegacySkillMode` turns
     `'FR.06'` / `'mixed'` / `'mixed_c7_lines_angles'` into a normalised
     `AssessmentScope { curriculumId, gradeId, subjectId, ... }`.
     Two scopes are `scopesAreComparable(a, b)` only if they share
     curriculum + grade + subject + scope-kind.
   - `validate.ts` — the developer validator run by
     `npm run validate:curriculum`. Reports empty grade × subject
     combos, modules with no skills, skills with no items, blueprints
     with insufficient coverage, blueprints referring to missing
     modules or skills, and un-initialised registries.
2. **Curriculum context on Student, StudentSnapshot, Classroom,
   Assignment, Session.** All new fields (`curriculumId`, `gradeId`,
   `subjectId`, `academicYear`, `blueprintId`, `blueprintVersion`,
   `scoringVersion`, `contentReviewStatus`) are optional so every
   pre-v0.26 record loads unchanged. New sessions populate these from
   the classroom + selected assessment scope.
3. **Access-code enrollment fix.** Joining via a v0.26 classroom now
   uses that classroom's own grade (`Classroom.gradeId`), not a
   hard-coded `'Class 6'`. Legacy classrooms without a grade still fall
   back to `'Class 6'` — that fallback is now in exactly one function,
   `classroomLabelForEnrollment`, and is the only remaining place the
   old default is used.
4. **Imported submission fix.** `importStudentSubmissions()` now
   snapshots the classroom's grade / curriculum / subject onto every
   reconstructed session's `studentSnapshot`, instead of hard-coding
   `'Class 6'` on every imported row.
5. **Vitest + real test suite.** 46 tests in
   `src/curriculum/__tests__/` cover registry bootstrap, grade-scoped
   query isolation, legacy id resolution, legacy `mixed` migration,
   blueprint coverage (no zero-item runs), grade shell integrity, and
   the validator itself.
6. **Developer CLI**: `npm run validate:curriculum`.

### Explicitly NOT changed in v0.26 (deferred by design)

To keep the iteration testable, the following phases from the full spec
are **staged for a future release**. Nothing in v0.26 breaks the current
UI or storage, but the following are still true:

- File organization: `src/data/items.ts` is still one 7,100-line file,
  and `src/data/class7.ts` is still ~2,700 lines. The curriculum registry
  reads from them via the wrapper; a follow-up iteration can move them
  under `src/curriculum/cbse/grade-XX/mathematics/` without changing the
  public API of the registry.
- Navigation redesign (role → curriculum → grade → subject → module) is
  not shipped. `App.tsx` still uses the v0.23 Class 6 / Class 7 grade
  toggle.
- Blueprint-driven assessment execution is not shipped. The adaptive
  engine still uses its 8–10-item stopping rule; blueprints exist in
  the registry as data for future use.
- Reporting redesign, age-stage design tokens, and content-governance
  UI (author / reviewer / publication status) are not shipped.
- All Pragati warnings from earlier releases still apply: this is not
  a calibrated assessment, not IRT-based, not a validated growth score,
  and not appropriate for placement, promotion, or high-stakes
  decisions.

### How to add a new grade or subject

1. Ensure the grade ID is one of `grade_01` … `grade_12`
   (`src/curriculum/grades.ts`). If you need a new subject, add a
   `SubjectDefinition` there.
2. Author the modules, skills, items, lessons, and (optionally) the
   assessment blueprint(s) in a new file under `src/curriculum/`.
3. Call `registerCurriculumGrade({ curriculum, gradeId, subject,
   modules, skills, blueprints })` from a `registerXxxContent()` entry
   point (see `registerCbseCoreContent()` in `registry.ts` for the
   template).
4. Run `npm run validate:curriculum` — it must return zero errors
   before the new content is user-visible.

### How to test v0.26 locally

```bash
npm ci             # or npm install
npm run typecheck  # tsc --noEmit
npm test           # vitest run
npm run build      # tsc --noEmit && vite build
npm run validate:curriculum   # standalone content validator
```

All five commands were run against v0.26 in the release-verification
sandbox; `npm test` reports **46 passed / 0 failed** and both
`typecheck` and `build` are clean.

---

## What v0.25 added (superseded by v0.26)

The v0.25 release **deepens the Class 7 starter into a real Class 7
prototype**, further declutters the Teacher Home, and adds a
priority-based item-review workflow so a reviewer knows which item to look
at next. All changes are additive; nothing was removed and the
Firebase / access-code / import / adaptive-engine paths are untouched.

1. **Class 7 Math: three new modules (9 skills / 72 items).**
   - **Lines & Angles (LA.01–03)** — complementary, supplementary,
     vertically opposite, and linear-pair angles; angles on parallel lines
     cut by a transversal (corresponding / alternate / co-interior); the
     triangle angle-sum property (with the exterior-angle corollary).
   - **Comparing Quantities (CQ.01–03)** — fluent conversion between
     fractions, decimals, and percentages; percent of a quantity and
     percent change (including reverse); simple interest and profit /
     loss percent in everyday contexts.
   - **Data Handling Basics (DH.01–03)** — reading pictographs, bar
     graphs, and double-bar graphs; mean, median, and mode of small
     datasets (odd- and even-count); basic probability of equally likely
     outcomes.
   - Each skill has 8 items (2 foundational / 4 core / 2 advanced),
     per-distractor misconception tags reusing the existing taxonomy,
     worked-solution text, estimated time, and a per-skill lesson
     (intro, reteach steps, two worked examples, two common-mistake
     notes, teacher note, parent note).
   - Every new skill has a `SkillAlignment` row (chapter reference,
     learning outcome, competency statement, prerequisite skills,
     cognitive focus) marked **CBSE/NCERT-informed prototype — teacher
     review required**.
   - New per-skill and per-module (mixed) band descriptions in
     `scoring.ts`, and static prerequisite chains that connect back into
     Class 6 (e.g. LA.01 → GB.03 / GB.04; CQ.01 → FR.03 / DE.02).

2. **Class 7 learning path.**
   - A new `CLASS7_LEARNING_ORDER` constant in `types.ts` lays out the
     recommended sequence across all 18 Class 7 skills (Integers →
     Fractions & Decimals ext → Algebra ext → Lines & Angles →
     Comparing Quantities → Data Handling). Grade-aware UI keeps Class 6
     and Class 7 dashboards separate unless a mixed-grade mode is chosen.

3. **Today tab, further decluttered.**
   - One primary action (the next-step CTA), one class snapshot (four
     headline tiles), one teaching recommendation (the weakest skill,
     framed as "re-teach X"). Secondary panels (weakest-skill list, top
     misconceptions, recent activity) are hidden behind a "View details"
     toggle. The first screen is now consistently scannable in a few
     seconds.

4. **Refactor: `TeacherWorkflowHome.tsx` split into 5 files.**
   - `TeacherWorkflowHome.tsx` — slim orchestrator (~195 lines).
   - `TeacherHomeSummary.tsx` — `useTeacherHomeSummary()` hook plus
     shared helpers (`timeAgo`, `friendlyCta`, `SectionHeader`,
     `buildStepHandlers`).
   - `TeacherHomeTabs.tsx` — `TabBar`.
   - `TeacherTodayTab.tsx`, `TeacherPilotSetupTab.tsx`,
     `TeacherAdminValidationTab.tsx` — one tab per file. Behaviour
     unchanged; the 1,212-line monolith is gone.

5. **Item-review priority: "Review next 10 priority items".**
   - New `src/lib/reviewPriority.ts` computes a three-level priority per
     item:
     - **High** — teacher-marked "needs revision", any audit flag on
       the alignment, alignment confidence `needs_teacher_review`, or
       high usage (≥ 5 attempts) with low accuracy (< 50%).
     - **Medium** — alignment confidence `medium`, Class 7 content
       (starter or deepening) not yet approved, or any single quality
       flag that hasn't hit the HIGH bar.
     - **Low** — teacher-approved or `high`-confidence with no other
       signals.
   - The Item Review view has a new "Filter by review priority"
     dropdown with "Review next 10 priority items" as a quick global
     mode. The table gains a Priority column (chip with the reason
     summary in the tooltip), and rows are sorted by priority + score
     within any active filter.
   - All thresholds are prototype heuristics, NOT calibrated
     psychometrics — noted in the priority chip tooltip and in the
     Admin tab's "Prototype notes" panel.

Compatibility: all localStorage keys are preserved; existing sessions
against Class 6 / Class 7 v0.23 skills continue to work; every export
bundle still includes students, sessions, assignments, pilots, item
reviews, feedback, alignment metadata, and the readiness summary. If
you had a v0.24 workspace open, v0.25 uses the same
`pragati.teacher_tab.v1` key for the tab preference and no migration
step is required.

Known constraint: the JavaScript bundle exceeds Vite's 500 kB warning
threshold. This is expected given the item bank + Firebase SDK; a
future release will code-split by teacher route.

---

## What v0.24 added

The v0.24 release is a **UX simplification pass** on the Teacher Home.
The page had grown too long and too dense across v0.18–v0.23 (At a
glance + Student submissions import + Sample data + Workflow + Pilot
readiness + Pilot report + More tools + Reminder + Classroom workflow
test, all stacked). v0.24 reorganises everything into three clear tabs,
collapses the noisy sections by default, and uses teacher-friendly
language. **No behaviour changes** — same data, same handlers, same
exports.

1. **Three Teacher Home tabs.**
   - **Today** — single next-step CTA, one class snapshot, three list
     cards (weakest skills, top misconceptions, recent activity), and a
     primary "Open teaching plan" button. The first screen is now
     scannable in 5 seconds.
   - **Pilot setup** — the guided 6-step pilot workflow, an
     assignments quick-access row, a classroom-codes status row, the
     readiness checklist (collapsed by default with a "3 of 12 checks
     complete" pill), and the pilot report card.
   - **Admin &amp; validation** — collect student work (collapsible
     submissions import), the eight tool cards (Students, Class
     dashboard, Item review, Alignment review, Imported submissions,
     Assignments, Classrooms &amp; codes, Learn), the classroom workflow
     test, sample data, the JSON export, and the prototype-notes
     reminder. Each non-essential section is collapsed by default with
     a compact status pill (e.g. "0 submissions waiting", "All items
     reviewed", "Sample loaded").
   - The active tab is remembered in `pragati.teacher_tab.v1` so a
     refresh keeps you where you were.

2. **Decluttered first screen.** The Today tab shows only the things a
   teacher needs to look at first: mode/account hint at the top, an
   active-pilot pill if relevant, the next-step CTA card, one class
   snapshot row, and an "Open teaching plan" / "See class dashboard, item
   review &amp; more" pair. Everything else moved into Pilot setup or
   Admin &amp; validation.

3. **Collapsed-by-default sections** with compact status pills:
   - **Pilot readiness checklist** — "{passed} of {total} checks
     complete" pill; the full row list shows only when expanded.
   - **Collect student work** (submissions import) — "0 submissions
     waiting" pill plus "last imported X ago"; the full panel only
     appears when expanded.
   - **Sample data** — "Sample loaded" / "Not loaded" pill; the seed /
     remove buttons appear when expanded.
   - **Classroom workflow test** — "End-to-end self-check" pill; the
     long explanation only appears when expanded.
   - **Prototype notes** — flagged-items count pill (e.g. "11 items
     still need review" or "All items reviewed"); the disclaimer paragraph
     only appears when expanded.

4. **Teacher-friendly wording.** Some labels rewritten in the UI without
   touching the underlying workflow ids:
   - "Student submissions import" → **Collect student work**
   - "Export pilot data" / "Export JSON" → **Download pilot report**
   - "Review flagged items" → **Check items needing teacher review**
   - "No pilot active yet" → **Start your first classroom pilot**
   - The CTA labels for the workflow step cards are mapped through a
     small `friendlyCta()` helper so the source workflow stays the
     authoritative spec.

5. **Tab badges.** Each tab shows a small numeric badge when there's
   something needing attention — readiness gaps on Pilot setup, unreviewed
   imports on Admin &amp; validation — so the teacher can see at a glance
   where to look next.

**Preserved unchanged** (per the brief): item bank, scoring, adaptive
engine, Firebase sync, access-code logic, Class 6 / Class 7 content,
localStorage schema, Firestore schema. Every feature from v0.23 is still
present — just reorganised. The same handler props (`onOpenStudents`,
`onOpenItemReview`, etc.) are passed in; the host App.tsx wiring did
not need to change.

**Disclaimer language preserved**: CBSE/NCERT-informed prototype, not
official CBSE alignment, not calibrated, teacher review required,
pre-pilot.

## What v0.23 added

The v0.23 release **fixes three access-code cloud bugs**, adds an
**end-to-end classroom workflow test helper**, and lays in a small
**Class 7 Math starter** (3 modules × 3 skills × 8 items). All Class 6
content (item bank, lessons, alignment, scoring, dashboards) is
preserved exactly as v0.22 shipped them.

1. **Bug fix — revoked-code reactivation.**
   `publishClassroomAssignmentsToCode()` previously wrote
   `revoked: false` on every assignment edit, silently un-revoking a
   classroom code. v0.23 refuses to publish when the local classroom
   carries `accessCodeRevoked === true` and returns
   `{ ok: false, reason: 'code_revoked' }`. The AssignmentForm catches
   this and surfaces a friendly alert. The Classrooms view shows a
   banner ("This classroom code is revoked. Regenerate a code before
   publishing assignments.") on the code card whenever the status is
   revoked.

2. **Bug fix — "Never expire" cloud write.**
   `setAccessCodeExpiry(classroomId, null)` previously wrote only
   `{ updatedAt }`, leaving the existing `expiresAt` in Firestore
   untouched. v0.23 imports `deleteField` from `firebase/firestore`
   and writes `{ expiresAt: deleteField(), updatedAt }` so the field
   is genuinely removed.

3. **Bug fix — preserve expiry / revoked on publish.**
   `publishClassroomAssignmentsToCode()` now explicitly preserves the
   classroom's `accessCodeExpiresAt` — writing the number when present,
   or `deleteField()` when the teacher chose "Never expire" — so a
   republish never silently mutates either expiry or revoked state.

4. **Classroom workflow test helper.** New
   `components/ClassroomWorkflowTest.tsx` walks the eight steps a real
   pilot needs and reports pass / fail / pending for each — create
   classroom → active code → published assignment → student joined →
   completed assignment → submission → import → roster-link. Includes
   a "Run import" button. Mounted on the Teacher home as a tool card;
   never shown to students.

5. **Class 7 Math starter.** New `src/data/class7.ts` adds 3 modules
   (Integers & Rational Numbers; Fractions & Decimals Extension;
   Algebraic Expressions & Simple Equations), 9 skills (IR.01–IR.03,
   FE.01–FE.03, AE.01–AE.03), 72 items, 9 lessons, 9 alignment rows,
   9 band-copy entries, and 9 prereq entries. Total bank goes from
   390 → 462 items, total skill count from 36 → 45. All Class 7
   content is labelled **CBSE/NCERT-informed prototype, teacher review
   required, pre-pilot**.

6. **Grade-aware UI.** New `Grade` type and `MODULES_FOR_GRADE`. The
   math dashboard now has a **grade-picker pill** (Class 6 Math /
   Class 7 Math Starter) at the top. The selection persists in
   `pragati.selected_grade.v1` and filters the module cards + item
   counts. The Mixed Class 6 Math button is hidden when Class 7 is
   selected. Module chip colours: c7_integers = rose,
   c7_fractions_ext = pink, c7_algebra_ext = cyan, so Class 7 skills
   are visually distinct from Class 6.

**Preserved unchanged** (per the brief): Class 6 item bank, Class 6
lessons, scoring logic, adaptive engine, Firebase teacher auth, the
access-code student-submission flow (except the three fixes above),
pilot reports, localStorage compatibility.

**Disclaimer language preserved**: CBSE/NCERT-informed prototype, not
official CBSE alignment, not calibrated, teacher review required,
pre-pilot.

> Old Class 6 sessions, classrooms, assignments, and imports continue
> to load. Old Class 6 codes also continue to work; if a teacher had a
> revoked code from v0.22, v0.23 will keep it marked revoked locally.
> The `setAccessCodeExpiry` fix means existing Firestore codes will
> now actually clear their `expiresAt` when you tap "Never expire".

## What v0.22 added

The v0.22 release **hardens the classroom-code workflow for a real small
pilot**. No new content, no schema breaks — the v0.21 cloud structure,
`accessCodes/{code}` mirror, and submissions subcollection all keep
working. v0.22 adds the safeguards and visibility that turn the workflow
from "works on one device" into something a teacher can actually take
into a classroom.

1. **Access-code expiry UX.** Codes now carry an optional
   `expiresAt` (default 30 days from generation). The Classrooms view
   shows an explicit **Active / Expired / Revoked** status pill,
   a human readable "expires in N days" label, and a per-code expiry
   editor with `+7 days`, `+30 days`, "Set to: <date>", and "Never
   expire" controls. Regenerate and Revoke continue to show
   descriptive confirms ("students currently using the old code will
   be locked out immediately"). Expired codes are blocked at the join
   step — `resolveAccessCode()` returns the expiresAt and the join
   flow throws a friendly "This classroom code has expired" error.

2. **Submission payload validation.** New `validateSubmissionShape()`
   in `lib/accessCodes.ts` runs before every cloud write. It checks
   sessionId / assignmentId / classroomId presence, studentName length
   (`MAX_STUDENT_NAME_LEN = 80`), skillMode pattern, completedAt,
   responses array (non-empty, capped at `MAX_RESPONSES = 50`), each
   response's chosenText length (`MAX_RESPONSE_CHOSEN_TEXT_LEN = 200`),
   and a serialised-size ceiling (`MAX_SUBMISSION_BYTES = 200 KB`).
   When a check fails, the submission is recorded as `local_only`
   with reason "Invalid submission payload: …" — the cloud write is
   skipped and the local session is preserved.

3. **Stronger Firestore rules + production-hardening section.** The
   rules in the README now include **field-level validators**
   (`isValidCodeDoc`, `isValidSubmissionDoc`, `isCodeAcceptingSubmissions`)
   that enforce the same limits as the client. The
   ["Production hardening"](#production-hardening) section spells out
   the seven things you must add before sharing a code beyond the
   room: App Check, field validation, rate limiting, code expiry
   enforcement, submission size limits, duplicate-id behaviour, and
   anonymous-write risk mitigations.

4. **Imported submissions review filter.** The Imported Submissions
   view gained an "Unreviewed / Reviewed / All" filter, per-row
   **Mark reviewed** / **Undo** buttons (persisted to
   `pragati.imported_reviewed.v1`), a **Linked / Pending** roster-match
   badge per row, a **New** badge for sessions imported in the most
   recent import run, and a header strip with four count tiles
   (total imported / new since last import / unreviewed /
   duplicates skipped on the last run).

5. **Submission status card.** The Results screen's submission pill
   is now a full-width card with a coloured dot, heading, sub-line,
   and a **"What this means"** explainer paragraph. Three states:
   "Submitted to teacher" (green, with timestamp), "Saved locally
   only" (slate, with the reason), and "Submission failed" (rose,
   with the error and a **Retry submission** button).

6. **Pilot-readiness checklist update.** Five new rows on the
   teacher home checklist:
   - Classroom code active (at least one non-revoked, non-expired code)
   - Assignment published to a code
   - At least one student joined by code
   - At least one submission imported
   - Imported sessions reviewed
   The new rows show neutral "no data yet" details when classrooms
   haven't been used, so they don't penalise the headline before the
   teacher reaches that part of the workflow.

**Preserved unchanged** (per the brief): item bank, scoring, adaptive
engine, lessons, rich materials, alignment metadata, pilot reports,
teacher auth, local-demo mode, localStorage compatibility.

**Disclaimer language preserved**: CBSE/NCERT-informed prototype, not
official CBSE alignment, not calibrated, teacher review required,
pre-pilot.

## What v0.21 added

The v0.21 release fixes the imported-submission **student linking bug**
and adds visibility around the import flow. It does NOT change the
v0.20 cloud structure — your existing `accessCodes/{code}` docs,
submissions subcollections, and Firestore rules keep working.

1. **Fixed student linking on import.** In v0.20 the import path used
   `studentId: sub.studentLocalId`, but that id is the STUDENT device's
   local id and has nothing to do with the teacher's roster ids. The
   teacher's dashboard would not link imported sessions to the correct
   student record. v0.21 now resolves (or creates) the teacher-side
   Student via `findOrCreateStudent(sub.studentName, 'Class 6')` and
   writes the session with the teacher-side `studentId`. The original
   student-device id is preserved on the session as
   `externalStudentLocalId`. Sessions also carry
   `importedFromCode: string` and `importedAt: number` for traceability.

2. **Visible "Student submissions" panel.** New shared component
   `components/common/SubmissionsImportPanel.tsx` shows last import
   time, totals (imported / duplicates skipped / conflicts / errors),
   and a per-code breakdown. Surfaced on **both** the Teacher workflow
   home and the Classrooms view, with a single "Import submissions
   now" button.

3. **Student submission status + Retry.** `submitStudentSession()`
   now returns a structured `SubmissionState`
   (`submitted` / `local_only` / `failed` / `not_applicable`) and
   persists it to `pragati.submission_state.v1` so the
   `ResultsView` shows an explicit pill:
   - **Submitted to teacher** (green) — cloud write succeeded.
   - **Saved locally only** (slate) — by design (no join, no code,
     or local-demo mode). The session is safe locally.
   - **Submission failed** (rose) — with the error reason and a
     **Retry submission** button that calls
     `retrySubmitStudentSession(sessionId)`.

4. **Imported submissions review.** New
   `components/ImportedSubmissionsView.tsx` lists every session that
   was imported via `importedFromCode`, with filters by code and by
   student name, an accuracy pill, top misconceptions, completed
   timestamp, and a row click that opens the standard StudentDetail
   view. Routed from the Teacher workflow home as **Imported
   submissions** in the *More tools* section.

5. **Access-code management upgrades.** Classroom code cards now show
   the created date, active/revoked status, and the count of active
   assignments published to the code. Regenerate and Revoke now
   show **descriptive confirmation dialogs** that name the classroom
   and explain the consequences ("students currently using the old
   code will be locked out immediately").

6. **Firestore rules hardening notes.** The
   [Firestore rules (prototype)](#firestore-rules-prototype) section
   now opens with a clearly-labelled warning that the v0.20/v0.21
   rules **intentionally allow unauthenticated submissions** and
   should not be deployed to production without App Check, field
   validation, rate limiting, and code expiry.

**Preserved unchanged** (per the brief): item bank, scoring, adaptive
engine, lessons, rich materials, alignment metadata, pilot reports,
teacher auth, local-demo mode, localStorage compatibility.

**Disclaimer language preserved**: CBSE/NCERT-informed prototype, not
official CBSE alignment, not calibrated, teacher review required,
pre-pilot.

## What v0.20 added

The v0.20 release makes classroom **access codes a real multi-device
workflow**. In v0.19 a student could enter a code, but the student device
was never signed in as the teacher, so any cloud writes that tried to
touch teacher-owned paths got silently swallowed. v0.20 redesigns the
data flow so the public `accessCodes/{code}` document is the only place
a student device needs to read from or write to, and the teacher's
`syncAll()` imports those submissions back into the teacher-owned store.

1. **Redesigned `accessCodes/{code}` mirror document.** Now carries
   `code`, `teacherUid`, `classroomId`, `classroomName`, `createdAt`,
   `updatedAt`, `revoked`, `expiresAt?`, and a safe `activeAssignments`
   array (`assignmentId`, `title`, `skillMode`, `itemCount`, `kind`,
   `teacherNote`, `dueDateMs?`, `targetKind?`). No pilot ids, no
   per-student data, no analytics.

2. **Teacher publishes assignments to the mirror.** When the teacher
   saves an assignment bound to a classroom (via the v0.19
   `classroomId` dropdown), `publishAssignmentChange()` rewrites
   `accessCodes/{code}.activeAssignments`. Closing or deleting an
   assignment also re-publishes.

3. **Student join pulls cloud assignments.** `resolveAccessCode()`
   returns the full `activeAssignments` plus `revoked`/`expiresAt`
   flags. `joinClassroomWithCode()` caches the bundle under
   `pragati.cloud_assignments.v1`. The StudentHome refreshes it on
   every mount.

4. **Student session submission to the cloud.** When a student finishes
   an assignment-bound session, the app writes a minimal
   `CloudSubmissionRecord` to
   `accessCodes/{code}/submissions/{sessionId}`. The local session is
   unchanged.

5. **Teacher import on every sync.** `syncAll()` calls
   `importStudentSubmissions()` — walks every classroom with a code,
   reads the submissions subcollection, and merges new sessions into
   localStorage (dedup by sessionId; local rows are never deleted).
   The result appears in the sync summary as
   `… · 5 student submissions imported`, and a per-teacher
   `pragati.teacher_import_status.v1` record exposes the last imported
   time + counts.

6. **UI updates.** StudentHome renders cloud-cached classroom
   assignments as the priority section, with "Submitted" / "Overdue"
   badges and due-date labels. The legacy local "active assignment"
   card is suppressed when the student is in a joined classroom. The
   Classrooms view gets a manual "Import student submissions" button
   plus a last-imported summary, and each classroom progress panel
   header shows the running session count.

7. **Firestore security rules.** See the dedicated section
   ["Firestore rules (prototype)"](#firestore-rules-prototype) below.

**Preserved unchanged** (per the brief): item bank, scoring, adaptive
engine, lessons, rich materials, alignment metadata, pilot reports,
teacher auth, local-demo mode, localStorage compatibility.

**Disclaimer language preserved**: CBSE/NCERT-informed prototype, not
official CBSE alignment, not calibrated, teacher review required,
pre-pilot.

## Firestore rules (prototype)

> ⚠️ **PROTOTYPE RULES — NOT PRODUCTION READY.**
> The rules below intentionally allow **unauthenticated devices to create
> submission documents** under `accessCodes/{code}/submissions`. This is
> what makes the student "join with code + name, no password" workflow
> work, and it is acceptable for a controlled prototype demo in a single
> classroom. For any real deployment, treat the rules below as a
> starting point and add the items listed in the
> [Production hardening](#production-hardening) section.

Paste this as `firestore.rules` in your Firebase project (Firebase
console → Build → Firestore Database → Rules). It matches the
v0.20–v0.22 data model and now includes **field-level validators** on
every write so a malformed submission is rejected at the rule layer
even before App Check is added.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ----- Teacher-private data -----
    // Everything under teachers/{uid}/** is readable and writable ONLY by
    // the signed-in teacher whose uid matches the path segment. Covers
    // students, sessions, assignments, pilots, item reviews, student
    // feedback, classrooms, and pilot reports.
    match /teachers/{teacherUid}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == teacherUid;
    }

    // ----- Public classroom access codes -----
    // A student device is NOT signed in. The accessCodes/{code} doc
    // exposes only the safe join payload (classroom name + active
    // assignment summaries — no teacher PII). Anyone may read a
    // non-revoked, non-expired code. Only the owning teacher may write.
    match /accessCodes/{code} {

      // v0.22: deny reads on revoked OR expired codes so the student
      // device sees a clear "closed" state.
      allow read: if resource == null
                  || (resource.data.revoked == false
                      && (!('expiresAt' in resource.data)
                          || resource.data.expiresAt > request.time.toMillis()));

      // Teacher mirror writes — only the owning teacher.
      allow create, update, delete: if request.auth != null
                         && request.auth.uid == request.resource.data.teacherUid
                         && isValidCodeDoc(request.resource.data);

      // ----- Submissions subcollection -----
      // Any device (signed in or not) may CREATE a submission doc under
      // an existing non-revoked, non-expired code. They cannot read
      // others' work. Only the owning teacher may list/read/delete.
      match /submissions/{sessionId} {
        allow create: if isCodeAcceptingSubmissions(code)
                      && request.resource.data.sessionId == sessionId
                      && isValidSubmissionDoc(request.resource.data);
        allow read, update, delete: if request.auth != null
                       && request.auth.uid == get(/databases/$(database)/documents/accessCodes/$(code)).data.teacherUid;
      }
    }

    // ----- Default deny -----
    match /{document=**} {
      allow read, write: if false;
    }

    // ----- Validators -----

    function isValidCodeDoc(d) {
      return d.code is string && d.code.size() >= 4 && d.code.size() <= 32
          && d.teacherUid is string && d.teacherUid.size() <= 128
          && d.classroomId is string && d.classroomId.size() <= 128
          && d.classroomName is string && d.classroomName.size() <= 200
          && d.revoked is bool
          && (!('expiresAt' in d) || d.expiresAt is number)
          && (!('activeAssignments' in d) || (d.activeAssignments is list && d.activeAssignments.size() <= 25));
    }

    function isCodeAcceptingSubmissions(code) {
      return exists(/databases/$(database)/documents/accessCodes/$(code))
          && get(/databases/$(database)/documents/accessCodes/$(code)).data.revoked == false
          && (!('expiresAt' in get(/databases/$(database)/documents/accessCodes/$(code)).data)
              || get(/databases/$(database)/documents/accessCodes/$(code)).data.expiresAt > request.time.toMillis());
    }

    function isValidSubmissionDoc(d) {
      return d.sessionId is string && d.sessionId.size() <= 64
          && d.assignmentId is string && d.assignmentId.size() <= 64
          && d.classroomId is string && d.classroomId.size() <= 128
          && d.studentLocalId is string && d.studentLocalId.size() <= 64
          && d.studentName is string && d.studentName.size() >= 1 && d.studentName.size() <= 80
          && d.skillMode is string && d.skillMode.size() <= 32
          && d.startedAt is number
          && d.completedAt is number
          && d.finalAbility is number
          && d.accuracy is number
          && d.responses is list && d.responses.size() >= 1 && d.responses.size() <= 50
          && d.submittedAt is number;
    }
  }
}
```

The client also pre-validates the submission payload against the same
limits (see `validateSubmissionShape` in `src/lib/accessCodes.ts` —
constants `MAX_STUDENT_NAME_LEN`, `MAX_RESPONSES`,
`MAX_RESPONSE_CHOSEN_TEXT_LEN`, `MAX_SUBMISSION_BYTES`). When a
local validation check fails, the student device records
"Saved locally only — invalid submission payload: <reason>" and
the cloud write is never attempted.

### Production hardening

These rules are intentionally permissive on the
`accessCodes/{code}/submissions/{id}` write path so unauthenticated
student devices can post their work. For a production rollout you must
add **all** of the following:

1. **App Check.** Add Firebase App Check (reCAPTCHA Enterprise on web,
   DeviceCheck/App Attest on iOS, Play Integrity on Android) and gate
   submission writes on `request.app != null` — only verified Pragati
   builds (not random scripts) will be able to write.

2. **Field validation.** The rules above clamp every string and array.
   In production, also (a) reject any unexpected top-level field with
   `d.keys().hasOnly([...])`, (b) reject negative timestamps, (c)
   require `completedAt >= startedAt`, and (d) cap each response object's
   serialised size.

3. **Rate limiting / abuse protection.** Firestore enforces a default
   per-IP write rate but it is not enough for a public path. Front the
   write with a Cloud Function that takes the App Check token, checks a
   per-classroom counter in a separate `_rateLimits/{code}` doc, and
   only forwards the write if the rate is under threshold. Pair with
   App Check above.

4. **Code expiry enforcement.** The rules already deny reads and
   submission creates when `expiresAt < now`. Add a scheduled Cloud
   Function (every 6 hours) that finds codes whose `expiresAt` has
   passed and sets `revoked: true` so the field is also marked
   explicitly. This avoids unbounded growth in long-lived stale codes.

5. **Submission size limits.** The rules already cap `responses` to 50
   entries; in production also cap the total doc size with a Cloud
   Function pre-check, and reject submissions whose serialised size
   exceeds (say) 200 KB.

6. **Duplicate sessionId behavior.** The current rules allow
   `create` (not `update`) so a second write with the same `sessionId`
   is rejected — preventing a student from silently overwriting an
   earlier submission. The teacher-side `importStudentSubmissions()`
   also dedupes locally by `sessionId`.

7. **Anonymous write risks.** Without App Check, anyone who learns a
   live classroom code can post arbitrary "submissions". The rules
   keep the doc shape valid and the teacher-side import flow tags
   imported sessions with `importedFromCode` so a teacher can quickly
   audit (and delete) suspicious entries via the Imported Submissions
   view. **For any real classroom pilot, add App Check before sharing
   a code beyond the room.**

**No PII beyond the entered name** is written to public paths. The
student local id is a UUIDv4 from `crypto.getRandomValues`, not
correlated to any identity.

## What v0.19 added

The v0.19 release builds out the parts of Pragati that a real pilot
classroom needs without changing any of the foundations (item bank,
scoring, adaptive engine, alignment metadata, auth, local-demo mode).

1. **Rich learning materials for every skill (36 of 36).** v0.18 had
   `RICH_BY_SKILL` content authored only for 4 skills (FR.06, DE.01,
   FM.07, GB.03). v0.19 fills in the remaining 32 — each skill now
   ships a mini-lesson, visual walkthrough, misconception-keyed reteach,
   10–12 minute teacher activity, independent practice, 2-question exit
   ticket, parent home-practice script, and printable worksheet text.
   All content is CBSE/NCERT-informed prototype copy — teacher review
   required.

2. **Two-way Firestore sync with merge.** `syncAll()` now PUSHES local
   rows missing or newer than cloud, PULLS cloud rows missing or newer
   than local, and SKIPS rows that match. Merge uses each row's
   `updatedAt` (or the strongest available timestamp — `completedAt`,
   `reviewedAt`, `createdAt`). When neither side has a timestamp, the
   row is recorded as a CONFLICT and local data is preserved (never
   deleted silently). The result object now reports `{ pushed, pulled,
   skipped, conflicts }` per collection plus a totals summary, which
   the AccountMenu surfaces inline as "12 pushed · 3 pulled · 1
   conflict".

3. **Sync status messages.** AccountMenu shows the state explicitly:
   "Cloud connected", "Local demo mode", "Unsynced changes", "Last
   synced …", and "Sync failed" with the error text. `hasUnsyncedChanges()`
   walks every collection's latest timestamps against the last
   successful sync time.

4. **Student access codes (no full accounts).** Teachers can generate
   a short, friendly per-classroom code (e.g. `MAP-7B3K`) from the
   Classrooms view. The code is mirrored to a top-level
   `accessCodes/{code}` Firestore doc so students can look it up
   without needing the teacher's uid up front. Students see a new
   "Join classroom" panel on the student home: enter code + name →
   they are added to the classroom roster and see the classroom's
   active assignment. Local-demo mode resolves codes against
   on-device classrooms only. **No student passwords, no PII beyond
   the entered name.**

5. **Classroom progress panel.** Each classroom card now has a
   collapsible "Classroom progress" section showing roster size,
   completed sessions, completed assignments, average accuracy,
   weakest skills, top flagged misconceptions, students needing
   support (< 50% accuracy), recent activity, and a 4-week class
   trend bar chart. Computed by `lib/classroomSummary.ts`; explicit
   "prototype signal — teacher review required" disclaimer attached.

6. **Assignment workflow upgrades.** `AssessmentAssignment` now
   carries optional `kind` (assessment | practice), `dueDateMs`,
   `classroomId`, and `targetStudentIds`. The AssignmentForm exposes
   the new fields as a kind dropdown, a date picker, and a
   classroom dropdown.

7. **Code splitting.** Five heavy teacher views — `PilotReportView`,
   `TeachingPlanView`, `AlignmentReviewView`, `ItemReviewView`,
   `ClassDashboardView` — are now lazy-loaded via `React.lazy()`,
   wrapped in a single `<Suspense fallback>`. Build now emits
   one main bundle (≈ 332 KB gzipped) plus five small chunks
   (≈ 18 KB gzipped total) — they load only when the teacher
   actually navigates to those views.

**Preserved unchanged** (per the brief): item bank, scoring,
adaptive engine, alignment metadata, pilot reports, geometry
module, teacher auth, local-demo mode, localStorage compatibility.

**Disclaimer language preserved.** CBSE/NCERT-informed prototype,
not official CBSE alignment, not calibrated, teacher review
required, pre-pilot.

## What v0.18 added

The v0.18 release is a **major UX polish pass** that makes Pragati feel
like a serious early-stage adaptive assessment platform for Indian schools,
not a developer demo. Nothing about the adaptive engine, scoring,
dashboards, alignment metadata, item review, misconception system, or
localStorage / Firestore schemas changed — everything still loads cleanly
from any prior version.

**Highlights**

1. **Self-service teacher accounts.** No more pre-creating teachers in
   the Firebase Authentication console. The auth modal now has three tabs
   — **Sign in**, **Sign up**, and **Forgot password?** — with inline
   validation, friendly error messages, and a loading state. Sign-up
   collects name, school, email, password, and confirm; on success a
   profile doc is written to `teachers/{uid}/profile/profile` (no schema
   migration; fits the existing security rule). Password resets use
   Firebase's `sendPasswordResetEmail` flow.

2. **Unified Account menu in the nav.** The duplicate "Sign-in pill" +
   "Sign-in button" pair from v0.17 has been removed. There is now ONE
   account area, which surfaces, in priority order: signed-in state
   (name + email + school + sync status + last sync + Sync now + Sign
   out), signed-out state (Sign in / Create account), or a local-demo
   badge when Firebase isn't configured.

3. **First-run 4-step onboarding wizard.** New devices see an explainer
   on launch: (1) What is Pragati? (2) How Pragati works, (3) Start your
   first pilot (create teacher account OR continue in demo mode), and
   (4) Quick setup (school / grade / class section / first classroom).
   Completion is persisted in `localStorage` at `pragati.onboarding.v1`
   so returning teachers aren't nagged. The demo-mode branch can
   one-click seed a sample classroom for an instantly-populated dashboard.

4. **Teacher dashboard summary widget.** A new at-a-glance card sits
   at the top of the teacher workflow home: students assessed, roster
   size, active classrooms, sessions completed (with last-7-day count),
   average accuracy (with this-week-vs-last-week trend), weakest skills,
   top flagged misconceptions, and the most recent five sessions. All
   computed lazily from on-device storage by `lib/dashboardSummary.ts`.

5. **Distinct teacher vs. student visual modes.** Teacher mode uses the
   brand accent; student mode uses a violet accent. The Pragati logo
   and the active dashboard pill switch colour accordingly. Same data,
   same workflow, but a clearer visual signal of "which hat am I wearing".

6. **Learning experience polish (school-appropriate, NOT gamified).**
   The Learning Path now shows visible progress dots (Read → Walk
   through → Try yourself → Check → Retake), an encouragement card with
   factual accuracy + a targeted **Common mistake alert**, and a
   "Try another similar question" affordance alongside Retake. No
   points, no streaks, no badges.

7. **Content expansion (carefully).** Two net-new Geometry Basics
   skills, GB.08 Symmetry (lines of symmetry in plane figures) and
   GB.09 Coordinate basics (axes, origin, plotting points in the first
   quadrant), with 8 items each, full lessons (intro, reteach,
   visualExplanation, two worked examples, three common-mistake notes,
   five practice items, teacherNote, parentNote), per-skill alignment
   metadata, and band copy. **Total item bank: 390 items across 36
   skills, 6 modules.** Note we did NOT add Class 7, English, or Science
   in v0.18 by design.

8. **Sync and cloud improvements.** Push-only sync now also runs
   **automatically in the background every 5 minutes** (when Firebase
   is enabled, a teacher is signed in, and the document is visible).
   The account menu surfaces "Cloud connected" + "Sync status" + "Last
   synced" + an inline sync-error message when something goes wrong.

9. **Pilot-ready sample data.** From the teacher dashboard (or from
   the onboarding demo branch) you can seed a sample classroom — 6
   students with 12 short mixed sessions — with one click. Cleanly
   delete it just as easily. No real records are touched.

**Deliberately deferred to v0.19**

* The App.tsx component-extraction refactor (Assessment, StudentDetail,
  TeacherStudentList, Class6MathDashboard, ModuleDashboard) was deferred
  to keep the v0.18 release UX-focused and reduce regression risk.

**Preserved from earlier versions** (no changes): adaptive engine,
scoring logic, dashboards, pilot reports, assignment workflow, alignment
metadata, geometry fixes, item review system, misconception system,
localStorage compatibility, Firestore sync architecture.

**Disclaimer language is unchanged.** Pragati remains a CBSE/NCERT-INFORMED
prototype. It is NOT a published curriculum, NOT calibrated, NOT
psychometrically validated, and NOT officially endorsed by CBSE. Every
output requires teacher review.

## What v0.17 added

The v0.17 release plumbs a **Firebase classroom backend** into Pragati and
authors **richer learning materials** for a handful of representative skills.
No new grades, subjects, modules, or item-bank items are added in this release.

### Firebase setup

Pragati v0.17 reads Firebase configuration from six Vite environment
variables at build time. To enable cloud features (teacher sign-in, sync,
cross-device classrooms), copy `.env.local.example` to `.env.local` and
fill them in:

```bash
# .env.local — never commit this file
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

In your Firebase project you need to enable **Authentication → Email/Password**
and create **Firestore Database** in production mode. Create a teacher account
yourself in the Authentication console — Pragati never creates accounts on
your behalf.

A minimum Firestore security rule that matches Pragati's path convention is:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teachers/{teacherId}/{document=**} {
      allow read, write: if request.auth != null
                         && request.auth.uid == teacherId;
    }
  }
}
```

This grants each teacher access to documents only under their own UID.
Pragati writes everything as `teachers/{uid}/{collection}/{doc}`.

### Local demo mode

If any of the six `VITE_FIREBASE_*` env vars is missing, Pragati continues
to work end-to-end using localStorage only. The teacher nav-bar shows a
**"Local demo mode"** pill, the sign-in modal explains the situation, and
the sync layer reports `kind: 'skipped'` cleanly. This is the recommended
mode for the prototype-only / pre-pilot phase.

### Sync behavior (push-only)

When a teacher is signed in, the sync layer pushes the following
localStorage collections to Firestore, idempotently, on demand
(via the **Sync now** button in the nav-bar):

- `students` (keyed by Student.id)
- `sessions` (keyed by Session.id)
- `assignments` (keyed by Assignment.id)
- `pilots` (keyed by Pilot.id)
- `itemReviews` (keyed by item id — one review per item per teacher)
- `studentFeedback` (keyed by session id — one feedback per session)
- `classrooms` (keyed by Classroom.id)

Sync is push-only. The one exception is **classrooms**, which pull on
the Classrooms view open so a teacher's classrooms appear on every signed-in
device. Cloud wins on classroom collisions. Conflict resolution for other
collections is deliberately out of scope for v0.17 — the localStorage on
each device remains the source of truth for sessions and assignments.

A pill in the nav-bar shows one of:
- **Local demo mode** (Firebase not configured)
- **Sign in to sync** (configured but no teacher signed in)
- **Syncing…** (an in-flight push)
- **Synced 2m ago** (last successful push) with a **Sync now** button
- **Sync error** (last push reported errors; hover for details)

### Classroom management

The **Classrooms** view (Teacher dashboard → More tools → Classrooms)
lets a teacher create classrooms, give each a name + notes, select
students from the on-device roster, archive / unarchive, and delete the
grouping (students themselves are not touched). When signed in, every
classroom write also goes to Firestore.

### Richer learning materials

The `Lesson` type now carries an optional `rich` field
(`RichLessonMaterials`) with eight sub-fields: `miniLesson`,
`visualWalkthrough`, `misconceptionReteach`, `teacherActivity`,
`independentPractice`, `exitTicket`, `parentHomePractice`, and
`printableWorksheet`. Authoring is per-skill in
`src/data/lessons.ts → RICH_BY_SKILL`. **v0.17 ships full rich content
for four representative skills**: `FR.06`, `DE.01`, `FM.07`, and `GB.03`.
The other 30 skills still render the base Lesson untouched. Adding rich
materials to another skill is a single map entry — no UI changes needed.

### Student learning path

After any assessment, the Results page now offers an **Open my learning
path** button. The Learning Path:

1. picks the **weakest skill** from the session (lowest per-skill
   accuracy; ties broken by curriculum order),
2. shows the rich mini-lesson (or the base intro if no rich materials),
3. walks through the lesson's three worked examples as guided practice,
4. surfaces three independent practice prompts (from the rich materials,
   or the existing practice items with answers hidden) with a per-row
   reveal button,
5. (if rich materials provide them) shows two **Exit ticket** checks,
6. ends with a **Retake the assessment** button that loops back into
   the engine with the same skill prefilled.

### Preserved (unchanged)

- Item bank: still 374 items / 34 skills / 6 modules.
- Geometry Basics module, adaptive engine, scoring, dashboards, pilot
  reports, assignment workflow, alignment review, JSON export.
- localStorage schema (`pragati.*` keys, schemaVersion 4); old
  sessions / pilots / assignments / item reviews / feedback continue
  to load unchanged.

### What v0.17 deliberately does NOT do (per the brief)

- No new grades (no Class 5, no Class 7).
- No new subjects (no English, no Science).
- No new item-bank modules.
- No claim of official CBSE alignment.
- No removal of the standard prototype caveats (this remains a
  CBSE/NCERT-informed prototype that requires teacher review and is
  not calibrated).

## What v0.16 added

The v0.16 release adds the **Geometry Basics module** to the Class 6
Math prototype — 7 new skills, 70 new items, 7 new lessons, alignment
metadata for every skill, and full app integration (module chip, skill
picker, mixed_geometry mode, Learn pages, class-dashboard filter,
teaching plan, progression).

- **Geometry Basics module — 7 skills:**
  - `GB.01` — Points, lines, line segments, rays
  - `GB.02` — Parallel and intersecting lines
  - `GB.03` — Types of angles (acute / right / obtuse / straight / reflex)
  - `GB.04` — Measuring and drawing angles
  - `GB.05` — Triangles: classify by sides and angles
  - `GB.06` — Quadrilaterals: basic properties (square, rectangle,
    parallelogram, rhombus, trapezium)
  - `GB.07` — Circles: centre, radius, diameter, chord, arc
- **70 new items.** 10 per skill, distributed across foundational /
  core / advanced bands, mixing MCQ and numeric-entry. Every distractor
  is tagged with a misconception code (mostly `conceptual_gap`,
  `arithmetic_slip`, `visual_misread`, or `operation_confusion` for
  geometry-specific errors). Every item has a worked solution and an
  estimated time.
- **7 new lessons.** Each Geometry skill has intro, reteach (5+ steps),
  visualExplanation, 2 worked examples, 3 common-mistake cards (with
  pattern / why / fix), 5 practice item IDs, teacher note, parent note.
  Visual explanations use a placeholder marker because the existing
  visual primitive is built for fraction bars / area grids; the
  geometric content is carried in the caption + reading steps.
- **Alignment metadata** (`src/data/alignment.ts`). One
  `SkillAlignment` entry per GB skill with chapter reference (NCERT /
  Ganita Prakash Class 6 — Basic Geometrical Ideas and Understanding
  Elementary Shapes), learning outcome, competency statement,
  prerequisite skills, and cognitive focus. All carry the standard
  "prototype reading; teacher review required; not official CBSE
  alignment; not calibrated" caveats inherited from v0.10.
- **App integration.** `mixed_geometry` is wired into every place a
  module-mixed mode is referenced: `SKILLS_BY_MODULE`,
  `MODULE_IDS_ORDERED`, `MODULE_LABELS`, `MODULE_DESCRIPTIONS`,
  `SKILL_MODE_LABELS`, `SKILL_MODE_DESCRIPTIONS`, `moduleForSkillMode`,
  the band-description table in `scoring.ts`,
  `STATIC_PREREQUISITES_BY_SKILL`, and the `MODULE_CHIP_CLASS` palette
  (geometry gets emerald). The Class 6 Math dashboard, Learn module
  cards, skill picker, class-dashboard filter, teaching plan, and
  progression logic all pick up Geometry automatically because they
  iterate over the typed maps.

**Total bank: 374 items across 34 skills, 6 modules.** Existing items,
lessons, and behavior are unchanged. localStorage schema is unchanged
(no migration needed — `pragati.*` keys still at schemaVersion 4); old
sessions / pilots / assignments continue to load. Stop / start rules,
adaptive engine, scoring, pilot report calculations, dashboards, and
assignment workflow all preserved.

What v0.16 deliberately does NOT do, per the brief: no Supabase, no
Class 5 / Class 7, no English / Science, no other new content beyond
the Geometry module.

## What v0.15 added

The v0.15 release fixes the Vercel/Linux clean-build reliability issue
and finishes the low-risk navigation extractions.

- **Rollup native-binary bug fixed.** `package.json` now declares
  `@rollup/rollup-linux-x64-gnu`, `-darwin-arm64`, `-darwin-x64`, and
  `-win32-x64-msvc` in `optionalDependencies`, and `package-lock.json`
  was regenerated so the linux entry is resolved. `npm ci` →
  `npm run build` is now reliable on Vercel without any manual reinstall
  step. See **Deploy troubleshooting** above.
- **Four more low-risk extractions** to `src/components/`:
  - `NavBar.tsx` — sticky top nav with logo, Learn / Teacher tabs,
    pilot indicator, and mode toggle. Uses string view ids (no
    `View`-union coupling) to keep `App.tsx` free to evolve.
  - `ModeToggle.tsx` — Student ↔ Teacher pill.
  - `Footer.tsx` — pre-pilot disclaimer.
  - `StartForm.tsx` — student name / grade / school / window /
    skill-mode capture at session start.
- **App.tsx is now 2,172 lines** — down 68% from the v0.11 baseline of
  6,757. Still inline (deferred — these share state with the routing
  root): `Assessment` + `McqOptions` + `NumericEntry`,
  `Class6MathDashboard` + `ModuleCard` + `ModuleDashboard` +
  `SkillProgressionStrip` + `SkillCard`, `TeacherStudentList` +
  `EmptyDashboard`, `StudentDetail` + `DeleteConfirm` +
  `GrowthHistory` + `LatestSessionPanel`. Per the brief: "Do not
  refactor Assessment or StudentDetail yet if risky."
- **Behavior preserved.** Item bank, lessons, scoring, adaptive engine,
  alignment metadata, pilot report calculations, dashboards,
  assignments, and the `pragati.*` localStorage schema (schemaVersion
  4) are all unchanged.

What v0.15 deliberately does NOT do, per the brief: no Geometry, no
Class 5/Class 7, no English/Science, no new modules / skills / items,
no Supabase. localStorage only.

## What v0.14 added

The v0.14 release finishes the App.tsx refactor that v0.12 / v0.13 started.
**App.tsx is now 2,521 lines** — down 63% from the v0.11 baseline of
6,757. It is the routing / state-orchestration root; every named view in
the brief now lives in its own file under `src/components/`.

- **More shared helpers extracted** to `src/components/common/`:
  - `BandPill.tsx` — performance-band pill (Foundational / Developing /
    On Track / Advanced) with the matching colour ring.
  - `Field.tsx` — label + optional required marker + child input.
  - `NextStepCard.tsx` — "Next step for you" card from the Results page.
  - `SessionFeedbackCard.tsx` — student-feedback strip on Results.
  - `GrowthCard.tsx` — prototype change indicator (with private
    CompositeCell + DeltaCell).
  - `SkillBreakdownCard.tsx` — per-skill summary card (used by Results
    and the Latest Session panel).
- **Round B + Round C view extractions completed:**
  - `src/components/ResultsView.tsx` (with private `BandAccuracyTable`)
  - `src/components/ClassDashboardView.tsx` (with private
    `ClassHeadlineTiles`, `HeadlineTile`,
    `ClassMisconceptionDistribution`, `ClassHardestItems`)
  - `src/components/ItemReviewView.tsx` (with private `ItemReviewForm`,
    `ReviewStatusTile`, `ReviewStatusPill`, `ReviewYesNoRow`,
    `ReviewYesNoNaRow`, `ReviewDifficultyRow`)
  - `src/components/AlignmentReviewView.tsx` (with private
    `ConfidenceTile`, `ConfidencePill`, `SkillAlignmentBlock`,
    `SkillSummaryRow`)
  - `src/components/LearnView.tsx` (with private `SkillStatusPill`,
    `WorkedExampleCard`, `CommonMistakeCard`, `PracticeItem`,
    `NoteCard`)
- **App.tsx role.** Top-level state (engine, session, current item,
  student / pilot / assignment selection), routing (the `View` union and
  the `view === 'foo'` cases), localStorage loading / saving for the
  active session, and prop-passing to views. The `NavBar`, `ModeToggle`,
  `Footer`, and the still-coupled `Assessment` / `StartForm` /
  `Class6MathDashboard` / `ModuleDashboard` / `TeacherStudentList` /
  `StudentDetail` clusters remain inline because they share a tight
  network of helpers and state with the routing root; extracting them
  is a follow-up that would need its own state-prop redesign.
- **Behavior preserved.** Item bank, scoring, adaptive engine, lessons,
  alignment metadata, pilot report calculations, dashboards,
  assignments, and the localStorage schema (`pragati.*` keys, schema
  version 4) are all unchanged. Old sessions / pilots / assignments /
  item reviews continue to load.

### Deploy notes

- **Do not commit `node_modules` or `dist`.** These are generated.
  `.gitignore` excludes them, and the repo only tracks source +
  config (≈25 files).
- **Use `npm ci && npm run build` before deploy.** `npm ci` honours
  `package-lock.json` exactly; `npm run build` runs `tsc --noEmit`
  first, then `vite build`. If you ever see `Cannot find module
  @rollup/rollup-linux-x64-gnu`, that's the known npm optional-deps
  bug — `rm -rf node_modules package-lock.json && npm install` fixes
  it.
- **Pilot-ready but still prototype.** Pragati is a CBSE/NCERT-informed
  prototype, fine for a small teacher-supervised pilot, **not** an
  official CBSE-aligned product, **not** a calibrated assessment, and
  **not** a teacher-validated mapping. Every "medium" or "needs teacher
  review" item should be reviewed by a CBSE Class 6 maths teacher
  before pilot use. See the **Pilot-ready status** section above for
  step-by-step pilot instructions.

What v0.14 deliberately does NOT do, per the brief: no Geometry, no
Class 5 / Class 7, no English / Science, no new modules / skills /
items, no Supabase. localStorage only.

## What v0.13 added

The headline change in v0.13 is finishing the **App.tsx refactor** that
v0.12 started, adding a **Pilot-ready status** section to this README,
and tightening project packaging for a clean GitHub / Vercel deploy.

- **Shared helpers extracted to dedicated files:**
  - `src/lib/format.ts` — `formatDate`, `formatPercent`, `formatMs`,
    `formatNumber`, `pluralise`. Defensive (never throw on bad input).
  - `src/components/common/SkillChip.tsx` — `SkillChip`, plus the
    `MODULE_CHIP_CLASS` palette and the `skillChipClass(mode)` helper.
  - `src/components/common/StatCard.tsx` — small uppercase-label +
    colour-customisable value tile.
  - `src/components/common/VisualRenderer.tsx` — `VisualRenderer`
    (fraction-bar + area-grid SVG renderer). Same colours, outer
    dimensions, and a11y labels as before.
  - `src/components/common/SectionHeader.tsx` — consistent `h-section`
    heading + optional subtitle + right-side slot.
- **App.tsx refactor — round 2 view extractions:**
  - `src/components/StudentHome.tsx` (was `Landing` in App.tsx)
  - `src/components/TeacherWorkflowHome.tsx` (with its private
    WorkflowStepCard / ReadinessRow / TeacherToolCard helpers)
  - `src/components/AssignmentsView.tsx`
  - `src/components/AssignmentForm.tsx`
  - `src/components/TeachingPlanView.tsx` (with private WeakSkillRow)
  - `src/components/PilotSetupView.tsx` (with private Field copy)
- **App.tsx is now a thin routing / state-orchestration root.** Down
  from 6,757 lines (v0.12) to roughly 5,100 lines, with each extracted
  view living in its own file under `src/components/`. The remaining
  views still in App.tsx (Results, ClassDashboard, ItemReview,
  AlignmentReview, LearnView, plus Assessment/StartForm) share a
  network of inline helpers (`Stat`, `BandPill`, `Field`, `NextStepCard`,
  `GrowthCard`, `SessionFeedbackCard`, etc.) and are scoped for a
  follow-up round so the build never regresses mid-extraction.
- **Behavior preserved.** Item bank, scoring, adaptive engine, lessons,
  alignment metadata, pilot report calculations, dashboards, and the
  localStorage schema (`pragati.*` keys, schema version 4) are all
  unchanged. Old sessions / pilots / assignments / item reviews
  continue to load.
- **Project packaging.** `.gitignore` confirmed to exclude
  `node_modules`, `dist`, `dist-ssr`, `.vercel`,
  `vite.config.ts.timestamp-*.mjs`, `.env*`, editor / OS junk. `.git`
  is implicit. The repo currently tracks 25 source + config files
  (no generated folders).

What v0.13 deliberately does NOT do, per the brief: no Geometry, no
Class 5 / Class 7, no English / Science, no new modules / skills /
items, no Supabase. Existing FR / DE / FM / RP / AL items, lessons,
alignment, and counts unchanged.

## What v0.12 added

The headline change in v0.12 is a **dedicated Pilot Report view**, plus the
first round of an **App.tsx refactor** into the `src/components/` folder
and a tighter **teacher home**.

- **Pilot Report view** (`src/components/PilotReportView.tsx` +
  `src/lib/pilotReport.ts`). One scrollable teacher page that summarises
  one pilot (or all data on this device) end-to-end:
  - active / past pilot metadata,
  - students tested + sessions completed (+ in-progress),
  - assessment modes used,
  - average accuracy and average time per item,
  - weakest skills (with module, accuracy, attempts, students-affected),
  - top misconceptions (label, occurrences, students-affected),
  - students needing support,
  - flagged items used **inside** scoped sessions (with FlaggedBadge),
  - item review status across the bank,
  - student-feedback summary (difficulty, pictures-helped, hardest-part /
    confusing-questions samples), and
  - a single recommended next teaching action.
  - Two actions: **Export Pilot Report JSON** (`pragati-pilot-report-…json`)
    and **Copy summary for teacher / admin** (plain-text, includes the
    "prototype, teacher review required" disclaimer).
- **Assignment audience** (continuing v0.12): the assignment form now has
  a target picker (whole class / small group / individual student) with a
  free-text label. The student home and teacher assignments list both
  show the audience line.
- **Teacher home UX.** The home leads with the next-recommended step as
  a prominent CTA (title + subtitle + primary button). The
  pilot-readiness checklist auto-collapses when all checks pass. A new
  Pilot Report card sits above the secondary tools. The "Students /
  Item review / Alignment review / Assignments / Class dashboard /
  Learn" grid is collapsed under a "More tools" toggle so the page leads
  with the action.
- **App.tsx refactor (round 1).** First two extractions live under
  `src/components/common/`: `MetricCard.tsx` and `FlaggedBadge.tsx`.
  `PilotReportView.tsx` is a third real file. Extractions of the heavier
  view components (`StudentHome`, `AssignmentsView`, `AssignmentForm`,
  `ResultsView`, `ClassDashboardView`, `TeachingPlanView`,
  `ItemReviewView`, `AlignmentReviewView`, `PilotSetupView`,
  `LearnView`, `TeacherWorkflowHome`, `TeacherHome`) are scoped for
  follow-up rounds; doing all of them in one pass would risk regressing
  behavior on a 6.7k-line file. App.tsx remains the routing /
  state-orchestration root.
- **Project hygiene.** `.gitignore` already excludes `node_modules`,
  `dist`, `dist-ssr`, `.vercel`, and `vite.config.ts.timestamp-*.mjs`.
  The repo currently tracks 25 files (source + config only).

What v0.12 deliberately does NOT do, per the brief: no Geometry, no
new classes, no English / Science, no new modules, no Supabase. Existing
FR / DE / FM / RP / AL items, lessons, and counts unchanged. Old
sessions and assignments in localStorage continue to load (assignment
records without a `target` are treated as whole-class).

## What v0.11 added

The headline change in v0.11 is a **guided teacher workflow**. The
existing tool grid is replaced by a six-step pilot flow with status
pills, a pilot-readiness checklist, an assignment system, and a
flagged-item warning surfaced everywhere items are listed.

- **Guided teacher home with 6 ordered steps.** Computed from device
  state by `src/lib/workflow.ts`. Each step has a status pill
  (`not_started` / `in_progress` / `complete` / `needs_attention`),
  a CTA, and a one-line subtitle. Steps:
  1. Start or select a pilot
  2. Assign an assessment
  3. Review class results
  4. View tomorrow's teaching plan
  5. Review flagged items
  6. Export pilot data
  The home shows the next-recommended step as a "Next: …" hero so
  the teacher always knows what to do next.
- **Pilot Readiness Checklist (7 rows).** Below the workflow:
  pilot metadata created, at least one assessment assigned, at least 5
  student sessions completed, student feedback collected, teacher item
  reviews started, flagged items reviewed, export bundle ready. Each
  row shows a passed/not-passed pill and a small detail string. These
  are guidance — not gates. The headline reads "X of 7 checks passed".
- **Assessment assignment flow.** New views: `assignments` (list with
  end / edit / delete) and `assignmentForm` (skill or module-mixed
  picker, item count 8 / 10 / 12 / 15, pilot toggle, student-facing
  title, short teacher note). Stored in `pragati.assignments.v1`.
  Sessions started from an assignment carry `assignmentId` on the
  Session. The student home surfaces the most recent active
  assignment as a primary card above the three default options.
- **Flagged-item warning badge.** A new `<FlaggedBadge>` shows
  whenever an item has audit flags or alignment confidence below
  `high`. It surfaces in the **Item Review** list, the
  **Alignment Review** item table, the **Teaching Plan** recommended
  items, and inside the **Assessment** view above the question. It
  doesn't block — it just makes the warning visible. The same data
  drives the workflow's "Review flagged items" step.
- **Export bundle → schemaVersion 4.** `buildExportBundle()` now
  includes `assignments`, `lastExportedAt`, and an optional
  `readinessSummary` snapshot (the same checklist the teacher sees on
  screen). The Teacher Workflow Home's Export step calls
  `markExported()` on success so the workflow status flips to
  `complete`. Older v1 / v2 / v3 consumers still parse the v4 bundle.
- **Polish.** Tighter teacher nav, consistent `.h-section` headings,
  `MetricCard` for assignment-list tiles, mobile padding sweep on the
  workflow + assignments + assignment form views.

What v0.11 deliberately does NOT do, per the brief: no Geometry, no
new classes, no English / Science, no Supabase. Existing FR / DE /
FM / RP / AL items, lessons, and counts unchanged. Old sessions in
localStorage continue to load.

## What v0.10 added

The headline change in v0.10 is a **CBSE/NCERT-informed alignment +
audit layer**. No new items, modules, or classes — every change is
about credibility and quality control before pilot use.

- **Per-skill alignment metadata.** New `src/data/alignment.ts` carries
  one `SkillAlignment` for each of the 27 skills:
  - `chapterReference` — public-framework chapter (NCERT / Ganita
    Prakash, Class 6).
  - `learningOutcome` — plain-English outcome.
  - `competencyStatement` — CBSE-style competency.
  - `prerequisiteSkills` — `SkillId[]` cross-references inside the
    curriculum.
  - `cognitiveFocus` — dominant cognitive demand (recall / procedural
    / conceptual / application / reasoning).
- **Per-item alignment.** `getItemAlignment(item)` derives an
  `ItemAlignment` from the skill's alignment plus a small set of
  per-item overrides (alignment confidence + audit flags). Defaults
  are `high` confidence with no flags. Overrides currently flag a
  dozen edge-case items (advanced 3-term fraction sums; 0.125 ↔ 1/8
  decimals; algebra items that lean two-step or rely on a symbolic
  expression).
- **Audit flags.** Items can be tagged with `grade_level_mismatch`,
  `wording_too_complex`, `possible_ambiguity`,
  `cross_skill_contamination`, `needs_cbse_teacher_review`, or
  `parser_limitation`. Every flag has a label and a description.
- **Alignment Review page.** A new teacher view (Teacher mode →
  "Alignment review" tool card) shows:
  - 3 headline tiles: high / medium / needs-teacher-review counts.
  - Per-module skill list with chapter, outcome, competency,
    prereqs, cognitive focus, and an alignment breakdown row per skill.
  - Item-level filters: confidence, audit flag, module, free-text
    search. Click any item to jump straight into the existing Item
    Review form.
- **Algebra-specific quality review.** AL.04-10 (`3x = 21, find x + 2`)
  flagged `cross_skill_contamination`, AL.05-10 (`x + (x + 5) = 35`)
  flagged `needs_teacher_review` + `cross_skill_contamination`,
  AL.05-08 (light two-step) marked medium confidence, AL.02-08 (was
  numeric `x/4`) flagged `parser_limitation`. Per the brief,
  expression-writing items stay as MCQ.
- **Language audit.** Affirmative claims of "official CBSE-aligned" /
  "validated" / "calibrated" / "certified" don't appear in the app.
  Where these terms are used, they are **defensive** ("not validated",
  "not calibrated", "not an official CBSE alignment"). The new
  affirmative framing is **"CBSE/NCERT-informed prototype, mapped to
  draft skill framework, teacher review required"** — surfaced on the
  Landing, Teacher Landing, and Alignment Review pages.
- **Export bundle → schemaVersion 3.** `buildExportBundle()` now
  includes a `prototypeNotice` string spelling out what the bundle
  IS NOT, plus optional `alignmentBySkill` (the full
  `SKILL_ALIGNMENT` map) and `alignmentByItem` (a snapshot of every
  item's `getItemAlignment` result). The Teacher dashboard "Export
  JSON" button passes both. Older v1 / v2 consumers still parse the
  v3 bundle — the new fields are additive.

What v0.10 deliberately does NOT do, per the brief: no Geometry, no
new classes, no English / Science, no Supabase. Existing FR / DE /
FM / RP / AL items and content unchanged. Old sessions still load.

## What v0.9 added

The headline change in v0.9 is one new module — **Algebra Basics** —
added in a controlled way: 5 skills, 50 items, 5 lessons, no other
content changes. The pilot-readiness work from v0.8 (item review,
pilot mode, teaching plan, item quality flags, student/teacher modes)
is unchanged.

- **Algebra Basics module (5 skills, 50 items).**
  - **AL.01 Understanding variables** — what x and y mean as
    placeholders for numbers; reading 3y as "three times some number".
  - **AL.02 Simple expressions** — translating words to symbols
    (twice y → 2y; 3 less than x → x − 3); identifying coefficient,
    constant, and variable.
  - **AL.03 Evaluate expressions** — substitute a value for the
    variable, then compute. Includes one- and two-variable cases and
    bracketed expressions.
  - **AL.04 One-step equations** — x + a = b, x − a = b, ax = b,
    x/a = b. The "do the opposite to both sides" rule.
  - **AL.05 Word problems** — turning a story into a one-step (or
    light two-step) equation, with explicit "Let x = …" practice.
  10 items per skill, foundational / core / advanced bands, MCQ +
  numeric entry, misconception-tagged distractors, worked solutions,
  estimated time. Total bank is now **304 items across 27 skills**.
- **5 new Learn pages** (one per AL skill) with intro, reteach steps,
  visual + step-by-step reading, two worked examples, three
  common-mistake notes (concatenation in 2x, "less than" order swap,
  doing the same operation instead of the opposite, etc.), five
  practice IDs, teacher and parent notes.
- **App integration.** The Algebra module appears automatically on
  the Class 6 Math dashboard, with its own colour (indigo). New
  per-module mixed mode `mixed_algebra` joins the StartForm picker
  and the class-dashboard filter. Teaching plan, item quality flags,
  item review, and student-mode "weak skill" / "next skill"
  suggestions all pick up the new skills automatically because they
  iterate over `SKILL_IDS_ORDERED` / `MODULE_IDS_ORDERED`.

What v0.9 deliberately does NOT do, per the brief: no other new
modules, no item changes to existing modules, no Supabase, no claim
of official CBSE alignment. Existing FR / DE / FM / RP functionality
and previous-version sessions in localStorage are intact.

## What v0.8 added

The headline change in v0.8 is that Pragati turns its attention from
content (more items / modules) to **quality control, pilot readiness,
and teacher usefulness**. No new items, classes, or subjects in this
version — every change is workflow / planning / UX.

- **Item Review workflow.** A new "Item Review" teacher view walks the
  bank item-by-item with a structured form: correct-answer verified,
  wording clear, grade-appropriate, visual helpful, difficulty rating,
  ambiguity concern, comments, reviewer name. Each review carries a
  status — Not reviewed / Needs revision / Approved — and is stored on
  the device by item id. The list view filters by status, module, and
  quality flag, and shows per-item attempts / accuracy / quality flags
  alongside.
- **Pilot mode.** A new "Pilot setup" view starts a tagged pilot with
  teacher name, class name, school, date, default skill mode, and notes.
  Every session started while a pilot is active is tagged with that
  pilot's id (`Session.pilotId`); the active pilot is shown as a chip in
  the nav bar and the pilot can be ended at any time. Past pilots are
  archived.
- **Session feedback on Results.** After every session the student is
  asked four short questions — easy / okay / hard, were any questions
  confusing, did the pictures help, what was the hardest part. Stored
  per session and surfaced on the Results page (and exported).
- **Teaching Plan page.** A new "Teaching plan" view auto-generates
  next-lesson guidance from session history: top 3 weakest skills, top 3
  misconceptions, suggested small groups (students grouped by their
  personal weakest skill), recommended reteach skill (with a one-click
  open-the-lesson CTA), recommended practice item IDs, and a list of
  students needing support (each with their weak skills as chips,
  click-through to detail).
- **Item Quality Flags.** New `src/lib/itemQuality.ts` derives, per
  item: `low_accuracy` (< 50% correct over ≥ 3 attempts), `high_avg_time`
  (> 1.5× the seed estimate), `frequent_misconception` (one code
  triggers ≥ 50% of wrong answers), `too_few_attempts` (< 3 attempts
  yet), and `needs_teacher_review` (review marked needs-revision OR ≥ 2
  other flags). Flags appear on the Item Review list and in the JSON
  export.
- **Student vs teacher mode.** A new app-mode toggle (persisted to
  localStorage) splits the home screen in two:
  - **Student mode** is the default. Home is a focused 3-card screen:
    *Start recommended assessment*, *Practise a weak skill*, *Learn the
    next skill*. The "weak" and "next" skill picks come from
    device-wide progression. Students don't have to navigate 22 skills.
  - **Teacher mode** unlocks the Class 6 Math dashboard, students,
    class dashboard, item review, pilot setup, teaching plan, and
    Learn nav. The teacher home has a tool-card grid with stats per
    tool.
  The toggle lives in the nav and is one click.
- **Export bundle now schemaVersion 2.** `buildExportBundle()` now
  includes `itemReviews`, `pilots`, `sessionFeedback`, and (from the
  Teacher Students dashboard "Export JSON" button) snapshots of the
  current `teachingPlanSummary` and `itemQualityFlags`. Old v0.3-v0.7
  consumers can still parse the v2 bundle — they just lack the new
  fields.

What v0.8 deliberately does NOT do, per the brief: no new items, no new
modules, no new classes, no new subjects, no Supabase. Existing
functionality is intact (FR.02–FR.08, DE.*, FM.*, RP.* all still work
exactly as before; old sessions still load).

## What v0.7 added

The headline change in v0.7 is that Pragati is no longer Fractions-only
— it now covers **four Class 6 Math modules** with a module-aware UI
on top of v0.6's existing learning loop and skill-progression system.

- **Three new modules, 15 new skills, 150 new items.**
  - **Decimals** (5 skills): DE.01 (Place value), DE.02 (Fraction ↔
    decimal), DE.03 (Compare and order), DE.04 (Add / subtract),
    DE.05 (Word problems).
  - **Factors & Multiples** (5 skills): FM.03 (Prime / composite),
    FM.04 (Divisibility rules), FM.06 (HCF), FM.07 (LCM), FM.08
    (HCF/LCM word problems).
  - **Ratio & Proportion** (5 skills): RP.01 (Ratio concept), RP.02
    (Equivalent ratios), RP.03 (Proportion), RP.04 (Unitary method),
    RP.05 (Word problems).
  - 10 items per skill, foundational / core / advanced bands, MCQ +
    numeric entry, misconception-tagged distractors, worked solutions,
    estimated time. Total module bank is now **254 items across 22
    skills**.
- **15 new Learn pages** (one per new skill), each with a reteach
  lesson, a visual explanation with step-by-step reading, two worked
  examples, three common-mistake notes, five practice questions, and
  teacher / parent notes — same shape as the Fractions Learn pages.
- **New top-level Class 6 Math dashboard.** The Learn nav now opens a
  Class 6 Math dashboard with one card per module, showing per-module
  stats (Strong / started / item count) and a Mixed Class 6 Math
  Assessment shortcut.
- **Per-module dashboards.** Each module card opens a per-module
  dashboard (the v0.6 Fractions dashboard, generalised) with that
  module's recommended order strip, skill cards with status pills and
  accuracy bars, and a Mixed-within-module assessment CTA.
- **Module-aware skill picker.** The StartForm dropdown is now grouped
  by module: across-everything Mixed, then per-module sections each
  with a Mixed-within-module option plus all the single skills.
- **Module-aware class dashboard filter.** The teacher's class-level
  dashboard filter accepts a module ("All Decimals"), a single skill,
  or "All Class 6 Math". Mixed-mode sessions are still included for any
  scoped view, contributing only their relevant responses.
- **Per-module Mixed Assessment modes.** New `mixed_fractions`,
  `mixed_decimals`, `mixed_factors_multiples`, and
  `mixed_ratio_proportion` SkillModes complement the existing 'mixed'
  (across all modules). They're surfaced on every module dashboard.
- **No data migration.** Old v0.3 / v0.4 / v0.5 / v0.6 sessions in
  localStorage continue to load unchanged. Sessions whose `skillId`
  was 'FR.06', 'FR.07', or 'mixed' (= mixed-fractions in v0.5/v0.6)
  still render correctly — 'mixed' now means "across all modules"
  but the responses themselves are unchanged.

What v0.7 deliberately does NOT do, per the brief: no new classes
(only Class 6), no new subjects (only Maths), no Supabase (still
localStorage-only), no claim of official CBSE alignment or validated
scoring.

## What v0.6 added

The headline change in v0.6 is a tighter learning loop: every assessment
now ends with an actionable next step, and every Learn page now contains
worked examples and common-mistake notes alongside the reteach lesson.
Skill progression is surfaced device-wide.

- **Next Step for You.** Every Results page now opens with a "Next Step
  for You" card that runs `suggestNextStep(session, items, progress)`:
  - If a skill in the just-completed session was weak (≥ 2 attempted,
    accuracy < 70%), the weakest one is the focus and three buttons
    appear: open the lesson, jump to the practice questions, and
    **retake just that skill**.
  - If everything in the session was solid, the suggestion is the next
    non-strong skill in curriculum order.
  - If every skill in the device's history is in the Strong band, the
    suggestion is a careful "looking solid" mastery message.
- **Skill progression.** A new `src/lib/progression.ts` library
  computes per-skill `not_started` / `developing` / `strong` status from
  device-wide session history. Thresholds: ≥ 5 attempts and ≥ 70%
  accuracy ⇒ Strong; otherwise Developing; otherwise Not started. These
  are deliberate prototype heuristics, NOT calibrated mastery cuts.
- **Fractions Module dashboard polish.** The dashboard now shows a
  one-line summary of progression ("3/7 skills Strong, 5/7 skills
  started"), a horizontal recommended-order strip with status pips, and
  a per-skill card that includes a status pill, an accuracy bar, and a
  prereq chain visualised with check / open icons. A "Continue with
  ${skill}" CTA is the next non-strong skill in the recommended order.
- **Lessons rewritten and expanded.** Every skill page now has, in
  addition to the v0.5 reteach + visual + practice + notes:
  - **Step-by-step reading of the visual** (`readingSteps[]` instead of
    a single paragraph).
  - **Two worked examples** (`workedExamples[]`) — one foundational and
    one core/advanced — each with numbered steps and a final answer.
  - **Three common mistakes** (`commonMistakes[]`) — pattern, "looks
    like" example, why students do it, and how to fix it.
  Generic copy in intros and notes has been tightened or replaced with
  skill-specific guidance.
- **UI polish.** Tighter typography (system font with `-letter-spacing`
  on headings, looser body line-height), a section utility class for
  consistent card hierarchy, button micro-interactions, sticky
  back-blurred nav, and explicit mobile-first padding on cards. Teacher
  dashboard headings get the same hierarchy treatment.

## What v0.5 added

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
    │   ├── items.ts             # 304 items across 27 skills in 5 modules (MCQ + numeric entry + visual specs)
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

1. **Teacher validation of the 304 items.** A CBSE Class 6 math teacher
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
