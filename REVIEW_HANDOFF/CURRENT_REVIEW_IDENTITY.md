# Current review identity and paths — CURRENT FOR SENDING

*This document is release-neutral: it changes only when the review
identity or the package paths change, not at every maintenance release.
Current as of Pragati v0.83.5.*

**Status: NOT SENT.** Fractions: 9 complete · 9 review-ready · 0 sent ·
0 reviewed · 0 published. Number Play: 3 complete · 3 aligned ·
3 review-ready · 0 sent · 0 reviewed · 0 published.

## Send exactly these

| Review | Folder |
|---|---|
| §7.4 educator (pedagogy) | `PRAGATI_SECTION_7_4_REVIEW_CURRENT/` |
| §7.4 curriculum specialist (mapping) | `PRAGATI_SECTION_7_4_CURRICULUM_REVIEW_CURRENT/` |
| Chapter 3, §3.1–§3.3 | `PRAGATI_CHAPTER_3_REVIEW_PACKAGES_CURRENT/` |
| Chapter 7, the other eight sections | `PRAGATI_CHAPTER_7_REVIEW_PACKAGES_CURRENT/` |

Send the markdown files and, where present, `review-candidate.json` /
`curriculum-evidence.json`. Every current folder states one identity and
cites page 159 for §7.4; there is nothing for a reviewer to reconcile.

## §7.4 identity

| | |
|---|---|
| Review code | `S74-v1-DFC56A` |
| Instructional content fingerprint | `dfc56ab5` |
| Source provenance fingerprint | `efeccb48` |
| Source provenance version | 2 |
| Curriculum-mapping fingerprint (Package A) | see `curriculum-evidence.json` |
| Mapping snapshot version | 1 |
| Lesson artifact version | 1 — unchanged |
| Question-set version | 1 |

Two reviews, two identities, on purpose. An educator judges the teaching,
so their response is tied to the content fingerprint. A curriculum
specialist judges the placement and the citation, so theirs is tied to
the mapping and provenance fingerprints. A page correction moves the
second and not the first.

The importer requires the identity a package declares. A response that
omits its provenance is rejected rather than quietly accepted.

## Historical, retained for audit only — DO NOT SEND

`PRAGATI_SECTION_7_4_REVIEW_FINAL/`,
`PRAGATI_SECTION_7_4_CURRICULUM_REVIEW/`,
`PRAGATI_CHAPTER_3_REVIEW_PACKAGES/`,
`PRAGATI_CHAPTER_7_REVIEW_PACKAGES/`, and
`REVIEW_HANDOFF/HISTORICAL_PROVENANCE_CORRECTION_v0_83_1.md`.

They cite page 160 and the superseded codes (the two codes recorded in
`REVIEW_HANDOFF/HISTORICAL_PROVENANCE_CORRECTION_v0_83_1.md`). A response quoting one of those is evidence
about a real reading and is quarantined for re-check, not discarded.
