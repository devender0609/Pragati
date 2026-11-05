# Student Product Quality Gap

**Written:** 2026-08-24 (v0.61 §15) · Based on captured screenshots at 390/768/1440 px.

## 1. What was actually observed

Screenshots in `screenshots/`. Findings are from the images, not from
reading the code.

### Class 6 Home (all three widths)

The Home screen renders **one card** — "Lines and Angles · Start
learning" — followed by roughly two-thirds of a 1440×900 viewport of
empty white space.

This is the most important student-facing finding in the iteration. A
Class 6 student opening Pragati sees a single chapter and a blank page.
The product has 304 Class 6 items and 22 authored lessons; none of that
is visible. It does not look like a mathematics learning product; it
looks like an application that failed to load.

### Ages 2 / 4 / 10

Identical structure to Class 6 with different chapter names. **The
age-stage differentiation is not visible in the rendered output** — the
same card, the same hierarchy, the same density at Class 2 and Class 10.
`AGE_STAGE_PRODUCT_PRINCIPLES.md` is not reaching the screen.

### Section 7.4 reviewer preview (the new renderer)

By contrast this reads as mathematics: goal in plain language, a
number line with equal intervals and 3/4 on a tick, an equivalence
figure with 1/2 above and 2/4 below at the same x-position, fraction
strips whose three shaded regions terminate at exactly the same point,
step-by-step worked examples, misconception cards.

The gap between this screen and Class 6 Home is the gap between what
Pragati is and what it is trying to become.

## 2. Against the §15 questions

| Question | Answer |
| :-- | :-- |
| Age appropriate? | **No.** Class 2 and Class 10 render identically |
| Next action obvious? | Partly — one button, so trivially obvious, but only because there is nothing else |
| Feels like mathematics? | **Home: no.** 7.4 preview: yes |
| Visuals mathematically meaningful? | **Home: none at all.** 7.4: yes, and validated |
| Progress visible? | Minimal — a chapter card with a percentage |
| Unavailable content honest? | **Not addressed** — missing chapters are simply absent, not shown as unavailable |
| Governance terms hidden? | **Yes.** Verified by test and by inspection of the captures |

## 3. Change made this iteration

**Number-line and strip label sizes raised** (`MathVisuals.tsx`). At
390 px the 640-wide SVG scales to ~0.55, rendering 12 px tick labels at
about 7 px — far below body text and unreadable on a phone. Tick labels
raised to 19 px and point labels to 22 px so they land near 10–12 px
effective at the narrowest width.

That is the only change made. §15 asks for obvious low-risk
improvements, not a redesign, and the Home-screen emptiness is a content
and information-architecture problem rather than a styling one.

## 4. Not fixed, and why

**The empty Home screen** needs a decision about what a Class 6 student
should see when 5 of 10 official chapters have no content: all ten with
honest "not available yet" states, or only what exists. That is a
product decision, and inventing an answer here would pre-empt it.

**Age-stage differentiation** requires the authoring standard to be
applied to actual content. It cannot be fixed in the shell.
