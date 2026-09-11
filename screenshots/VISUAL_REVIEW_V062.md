# v0.62 Visual and Interaction Review

Captured 2026-08-25 from the production build at 390 / 768 / 1440 px.
**0 console errors, 0 page errors** across all captures.

## What v0.61 failed to capture, and v0.62 did

| Screen | Result |
| :-- | :-- |
| Class 6 Learn, all ten official chapters | Captured |
| Unavailable chapter state | Captured |
| Fractions chapter landing, nine sections | Captured |
| Number-line interaction before answering | Captured |
| Correct-response feedback | Captured |
| Misconception feedback | Captured |
| Teacher curriculum coverage | Captured |

## Verified by pixel inspection

- Ten chapters render in Ganita Prakash order, 1–10, no gaps.
- Five unavailable chapters are dashed non-clickable panels reading
  "Not available yet" — not disabled buttons.
- Decimals, Ratio & Proportion and Algebra Basics **no longer appear**
  in the student view. In the v0.61 capture all three read "Ready to
  learn".
- Nine Fractions sections listed; 7.3, 7.4, 7.7, 7.9 unavailable.
- Number-line ticks equal; the selected point sits on a tick.
- Correct answer → "Yes. Three spaces of one-fourth each, counted
  from 0."
- One tick short → "Count the spaces you move, not the marks. Starting
  at 0 is not a move yet." — the documented misconception, not a
  generic rejection.

## A bug the screenshots caught that the tests did not

`learnOverride` was declared on `StudentRouteOutletProps` and never
forwarded to `StudentShell`. Typecheck passed, 933 tests passed, and the
student still saw the legacy module list. Only the capture revealed it.
Second iteration running where pixels caught what types could not.

## Noted, not claimed as a defect

On the Fractions landing full-page capture the sticky header renders
mid-page. This is a known artifact of full-page screenshots with sticky
positioning. It should be confirmed in a real browser before being
treated as an overlap defect.

## Not captured

Teacher assignment of a reviewed section (§18 item 9) — no section is
reviewed, so there is nothing in that state to photograph. Recorded as
outstanding rather than staged with fake data.
