# UX Simplicity Audit

Deferred from v0.52 and v0.53. Conducted against 24 screenshots at
320 / 390 / 768 / 1440 px, plus instrumented measurement of overflow,
touch-target size, and competing primary CTAs.

**Student criterion:** next action identifiable within five seconds.
**Teacher criterion:** what needs attention identifiable within ten.

---

## Student screens

### Home
- **Goal:** resume or start learning.
- **Primary action:** Continue / Start on the chapter card.
- **Competing primary CTAs:** 0 (measured).
- **Verdict: PASSES.** The unfinished-set card, when present, correctly
  outranks the chapter card.
- **Watch:** if a Growth Check card is ever added alongside an
  unfinished set, there would be two urgent cards. Decide precedence
  before that ships.

### Learn
- **Goal:** pick a chapter.
- **Primary action:** a chapter card.
- **Verdict: PASSES.** Stage-driven column counts differ correctly.
- **Minor:** "Coming soon" chapters are visually equal to available
  ones. A Class 12 student sees mostly unavailable chapters. Consider
  de-emphasising or grouping them. *Not changed — needs a design call.*

### Practice
- **Verdict: PASSES.** Four labelled actions, each doing what it says.
- **Watch:** four buttons per card is the ceiling. Do not add a fifth.

### Progress
- **Verdict: PASSES.** Friendly concept names; no codes.

---

## Teacher screens

### Overview
- **Goal:** see what needs attention.
- **Verdict: PASSES** since v0.50's evidence-based rewrite. "Not enough
  recent activity yet" is honest rather than a fake zero.

### Assess
- **Goal:** understand Growth status.
- **Verdict: PASSES** after v0.53's rewrite. Leads with "Learn and
  Practice are unaffected"; detail is behind a disclosure.

### Resources
- **Verdict: PASSES.**

### Admin & Research — readiness
- **FINDING (fixed):** grade filter chips were 28px tall. Now 44px.
- **FINDING (not fixed):** this screen now stacks two tables — the
  existing Curriculum Coverage catalogue and the new four-axis
  Readiness Matrix. They overlap in purpose. **Recommend merging them
  in v0.55**; not done here because merging is a redesign, and this
  iteration's remit was safe targeted fixes.
- **Note:** "92 chapters catalogued, 92 source unverified" is
  uncomfortable and correct. Do not soften it.

---

## Instrumented results

| Measure | Result |
| :--- | :--- |
| Horizontal overflow, all screens and widths | **0** |
| Undersized touch targets, before fix | 14 (Admin only) |
| Undersized touch targets, after fix | **0** |
| Screens with >1 competing primary CTA | **0** |

---

## Explicitly not done

- Merging the two Admin tables (design decision).
- De-emphasising unavailable chapters (design decision).
- Any change to student navigation.

**Zero overflow is not the same as good design.** The measurements
above establish that nothing is broken; they do not establish that the
product is well designed. That judgement needs users, and Pragati has
not had any.
