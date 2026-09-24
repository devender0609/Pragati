# Which reviewer package is current — v0.83.1 provenance correction

> **SUPERSEDED — HISTORICAL, v0.83.1 ONLY. DO NOT FOLLOW.** This document
> describes the v0.83.1 architecture: `*_PROVENANCE_V2` folders, the §7.4
> addendum workflow, and code `S74-v1-7BFD8C`. None of those exist now.
> v0.83.2 replaced them with `*_CURRENT` folders and separate content and
> provenance identities. The current instructions are in
> `REVIEW_HANDOFF/CURRENT_REVIEW_IDENTITY_v0_83_3.md`.


**Nothing has been sent.** Fractions: 9 complete · 9 review-ready · 0 sent ·
0 reviewed · 0 published. Number Play: 3 complete · 3 aligned · 3 review-ready ·
0 sent · 0 reviewed · 0 published.

## What changed, and what did not

44 of the 65 Class 6 section start pages held in the registry did not match the
printed pages of Ganita Prakash Grade 6 (Reprint 2026-27). They were corrected
on 2026-09-22 from the chapter PDFs — for example §7.4 was recorded as p. 160
and is printed on p. 159. The full 65-row comparison is in
`CLASS6_PAGE_CORRECTION_AUDIT.md`.

**No instructional content changed.** No explanation, worked example, practice
item, misconception, teacher note or question was edited, and no
`contentArtifactVersion` was bumped. The printed page is part of what a
reviewer is shown, so it sits inside the content fingerprint; correcting it
moved some fingerprints and therefore some review codes. That is provenance
versioning, recorded as `SECTION_7_4_SOURCE_PROVENANCE_VERSION = 2`.

## CURRENT FOR SENDING

| Folder | Contents |
|---|---|
| `PRAGATI_CHAPTER_7_REVIEW_PACKAGES_PROVENANCE_V2/` | Chapter 7 §7.1–§7.3, §7.5–§7.9 |
| `PRAGATI_CHAPTER_3_REVIEW_PACKAGES_PROVENANCE_V2/` | Chapter 3 §3.1–§3.3 |
| `PRAGATI_SECTION_7_4_REVIEW_FINAL/` + `PROVENANCE_ADDENDUM_v0_83_1.md` | §7.4 educator package (Package B), frozen, sent WITH the addendum |
| `PRAGATI_SECTION_7_4_CURRICULUM_REVIEW/` + the same addendum | §7.4 curriculum-specialist package (Package A) |

## SUPERSEDED / HISTORICAL — do not send

| Folder | Why retained |
|---|---|
| `PRAGATI_CHAPTER_7_REVIEW_PACKAGES/` | Built on the pre-correction pages. Unmodified, so the record of what existed before survives. |
| `PRAGATI_CHAPTER_3_REVIEW_PACKAGES/` | Same. |

Checksum of the two superseded folders: **f462c776** — unchanged from v0.82.7 and
v0.83.0. Checksum of the two corrected folders: **a8fa998b**.

## Review codes, before and after

| Section | Superseded code | Current code |
|---|---|---|
| ncert_gp_c6_s3_1 | `S31-v1-20BA61` | `S31-v1-20BA61` — unchanged |
| ncert_gp_c6_s3_2 | `S32-v1-4F4A92` | `S32-v1-1265C8` |
| ncert_gp_c6_s3_3 | `S33-v1-F85783` | `S33-v1-F85783` — unchanged |
| ncert_gp_c6_s7_1 | `S71-v1-0E86DC` | `S71-v1-0AC279` |
| ncert_gp_c6_s7_2 | `S72-v1-37B369` | `S72-v1-37B369` — unchanged |
| ncert_gp_c6_s7_3 | `S73-v1-E47D40` | `S73-v1-E47D40` — unchanged |
| ncert_gp_c6_s7_5 | `S75-v1-7D271B` | `S75-v1-FCD012` |
| ncert_gp_c6_s7_6 | `S76-v1-08C5FD` | `S76-v1-040E88` |
| ncert_gp_c6_s7_7 | `S77-v1-32067E` | `S77-v1-399A76` |
| ncert_gp_c6_s7_8 | `S78-v1-051989` | `S78-v1-98DE49` |
| ncert_gp_c6_s7_9 | `S79-v1-36C902` | `S79-v1-156D6E` |

The §7.4 lesson's own code moved from `S74-v1-A1A3FF` to `S74-v1-7BFD8C`.

## Why §7.4's own two packages were not regenerated

Package A and Package B are hand-written, frozen artifacts: their questions were
written about this exact lesson and their wording is the thing under review.
Regenerating them would replace the reviewed object rather than correct a
citation. They are therefore sent unchanged, with
`PROVENANCE_ADDENDUM_v0_83_1.md`, which states the one correction: where those
documents say page 160, the printed page is 159. The lesson text is identical.
