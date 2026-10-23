# Student functional matrix — v0.74

Every visible primary student control, clicked at 390 / 768 / 1440 by
`tools/interactionMatrix.mjs` against a real production build. A control that
is absent, zero-sized, or that changes nothing when clicked is a FAIL.

**Result: 0 failures across 57 probes.**

## Method, and why the first run was wrong

The first run reported 14 student failures at 390. All fourteen were the
harness, not the app: it clicked *the first* button whose text matched, and the
app renders both the desktop and mobile navs at every width, hiding one with
CSS. The first match was the hidden desktop nav, measuring 0x0.

`visualQa.mjs` had already learned this and clicks the *last* exact match. The
harness now selects on **visibility** instead, which states the same fix as
what it means: a control a person cannot see is not a control they can use.
That distinction is what exposed the genuine Teacher defect below.

## Matrix

| Surface | Control | 390 | 768 | 1440 | Destination changed | Notes |
|---|---|---|---|---|---|---|
| Student nav | Learn | works | works | works | yes |  |
| Student nav | Practice | works | works | works | yes | v0.74: first release to verify this tab at all. |
| Student nav | Progress | works | works | works | yes |  |
| Student nav | Home | works | works | works | yes |  |
| Student Learn | Chapter 7 | works | works | works | yes | Opens the official chapter landing. |
| Student Fractions | Fractions as parts of a whole | works | works | works | yes | Legacy lesson. Official §7.x lessons are unpublished. |
| Student Practice | Practise a concept | works | works | works | yes | Opens the concept chooser (v0.50 §3), not skillIds[0]. |
| Student Practice | Open chapter | works | works | works | yes | Opens the chapter landing. |
| Student Practice | Mixed practice | works | works | works | yes | Legacy mixed set. Labelled as related practice. |
| Student Practice | Chapter check | works | works | works | yes | Blueprint-gated; only Fractions offers it. |
| Student Progress | Start: Fractions as parts of a whole | works | works | works | yes | Carries "Related practice — not a chapter lesson" (v0.72 §14). |

## What is deliberately absent

`Worked examples`, `Next step` and `Think deeper` are §7.4 lesson stages. §7.4
is an **unpublished authored draft** reachable only through the Admin reviewer
preview, so their absence from every student route is correct, not a gap. They
are captured under `admin_lesson_*` by `visualQa.mjs`.

No student route reaches unpublished official-section content. 0 reviewed,
0 published.
