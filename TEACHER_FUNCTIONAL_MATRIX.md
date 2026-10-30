# Teacher functional matrix — v0.74

Every visible primary teacher control, clicked at 390 / 768 / 1440 by
`tools/interactionMatrix.mjs` against a real production build.

**Result after the fix: 0 failures. Before the fix: 2 workflows unreachable.**

## The defect this matrix found

v0.71 §17 cut the phone nav from six tabs to four and left this comment:

> Nothing is removed — Assess and Insights are reachable from the Overview and
> from the desktop header, and no functionality is behind fewer taps than before.

It was not true. `TeacherOverviewBody` accepted only `onOpenAssign` and
`onOpenClasses`; the header nav is `hidden` below `md`. Measured at 390, the
Assess button reported `width 0, height 0` and no other route existed.

**Assess and Insights were unreachable on a phone for three releases, behind a
comment asserting they were not.** Neither was ever captured or contracted, so
nothing failed.

Fixed in v0.74: Overview now carries real entry points for both below `md`, and
the false comment is corrected in place rather than deleted.

## Matrix

| Surface | Control | 390 | 768 | 1440 | Destination changed | Notes |
|---|---|---|---|---|---|---|
| Teacher nav | Classes | works | works | works | yes |  |
| Teacher nav | Assign | works | works | works | yes |  |
| Teacher nav | Assess | works | works | works | yes | v0.74 FIX: was 0x0 and unreachable at 390. |
| Teacher nav | Insights | works | works | works | yes | v0.74 FIX: was 0x0 and unreachable at 390. |
| Teacher nav | Resources | works | works | works | yes |  |
| Teacher Overview | Open Classes | works | works | works | yes |  |
| Teacher Overview | Create assignment | works | works | works | yes |  |
| Teacher Overview | View curriculum | works | works | works | yes | Routes to Classes; label and destination differ — see report. |

## What Assess actually is

Teacher → Assess is **entirely the formal Pragati Growth path**. There is no
ordinary instructional-check surface behind it.

That is defensible — Growth is frozen, and `GrowthAssignPanel` refuses honestly
rather than offering an assessment that cannot run — but it must be *labelled*,
or a teacher reads "Assess" as everyday checking and meets a refusal. The
`teacher_assess` route contract now requires the screen to say
**"Pragati Growth"** and **"Separate from everyday practice"**, and forbids
`RIT`, `percentile` and `mastery`.

## Still prototype-quality — NOT addressed in v0.74

§13–§17 were deferred deliberately in favour of planner correctness. These
screens have the v0.71 palette and nav only, and remain centred mobile layouts
at 1440:

| Screen | State |
|---|---|
| Classes / Students | Not redesigned |
| Assign | Not redesigned — still reads as an internal assessment prototype |
| Insights | Not redesigned |
| Resources / Teach | Not redesigned |
| Desktop layout (1440) | Still effectively a centred mobile column |

`View curriculum` on the Overview routes to Classes, which is a label/destination
mismatch. It fires a handler and changes the screen, so it is not a dead
control, but it is not what the label promises. Recorded here rather than
quietly fixed, because Teacher redesign is a v0.75 scope decision.
