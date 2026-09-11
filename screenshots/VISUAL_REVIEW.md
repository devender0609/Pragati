# v0.61 Visual Review

Captured 2026-08-24 from the production build (`vite preview`) at
390 px, 768 px and 1440 px. Chromium via Playwright, full-page.

## Checks performed

| Check | Result |
| :-- | :-- |
| Number-line intervals equal | **PASS** — ticks generated from `partitions`, verified by pixel inspection |
| 3/4 lands exactly on a tick | **PASS** |
| Equivalence: 1/2 and 2/4 at same x | **PASS** |
| Fraction strips 1/2 = 2/4 = 4/8 end at same point | **PASS** — verified by crop at 2× zoom |
| Mobile label readability | **FIXED this iteration** — see below |
| Console / page errors | **0** across all three widths |
| Overflow | None observed |
| Touch targets | Buttons use `min-h-11` (44 px) |

## Defect found and fixed

At 390 px the number-line SVG (640-wide viewBox) scales to ~0.55, so
12 px tick labels rendered at roughly 7 px — well below body text and
unreadable on a phone. Tick labels raised to 19 px and point labels to
22 px, giving ~10–12 px effective at the narrowest width. Re-captured
and verified.

## Defect found and NOT fixed

**Class 6 Home renders one card and two-thirds of an empty viewport.**
See `docs/STUDENT_PRODUCT_QUALITY_GAP.md` §1. This is a content and
information-architecture problem, not a styling one, and fixing it
requires a product decision about how chapters with no content should
be represented.

## Files

`01-student-landing`, `02-class6-learn`, `04-admin-curriculum`,
`04b-admin-tools`, `05-admin-roadmap`, `06-section74-preview`,
`07-section74-full` — each at `-390`, `-768`, `-1440`.

Not captured: the Fractions chapter interior and the guided-practice
run, both of which needed interaction paths that timed out. Recorded
as outstanding rather than claimed.
