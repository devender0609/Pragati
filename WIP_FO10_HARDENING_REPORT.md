# 0.84.0-c11.50 — WIP SAFETY ARCHIVE — **NOT FIRST GREEN**

**NOT hardened-final. Suite NOT verified green. Nothing human-reviewed.**
The FO-10 first-green archive `1629a70b…` is untouched and remains the
durable state; this snapshot only protects the hardening delta.

## Two real defects found and fixed

**Label collisions at every viewport.** Every point label used the same
fixed `+7/-5` offset — fine for scattered points, but a divided segment
puts A, P and B on one line a short way apart, so the labels stacked:
5 collisions at 1280, 834 and 360 alike, worst
`"C (0, 0, 0)" / "Q (7/3, 11/3, 5/3)"` overlapping 50x13px.

Fixed with a **general declutter pass** in the `coordinate_3d` renderer:
each label takes the first of eight candidate offsets that clears the
labels already placed, historical position tried first so scattered
figures are unchanged. Geometry untouched — only text moves; each dot
stays where the projection puts it.

Re-measured: **0 collisions, 0 overflow, 0 real clipping, 0 sub-9px text,
0 console errors at 1280 / 834 / 360.**

**Two incomplete figure descriptions.** The fractional figure never said
the division was *internal*; the constant-z figure stated **neither** the
ratio nor the internal division. A sighted reader gets both from the
picture; a screen-reader user got neither. Both rewritten — all three now
carry three coordinate triples, the ratio and the internal division, at
231 / 271 / 354 characters.

Typecheck **0** after both changes.

## Failing gate

The full suite has **not been seen green on this tree**. Two runs were
killed with `EXIT=137` — a memory kill, not a test failure — and a
single-fork re-run was still in progress when the session ended.

This matters: the alt-text edits touch authored strings that several tests
assert on. Until the suite passes, this is not hardened-final.

## Next

Run the suite to green, then package
`pragati-0.84.0-c11.50-fo10-hardened.zip` with SHA and reopen
verification. Then `C11-SEQ-FO8` alone.
