# Class 6 "Ready to Learn" Audit

**Version:** v0.70.0 · **Method:** walking the actual student routes in a
browser, not reading the data model.

---

## Summary

v0.69 showed **5 of 10** Class 6 chapters as "Ready to learn".

**Four of those five routed nothing.** A student tapped the card, landed on the
chapter, and found every single part marked *Coming soon*. A fifth — Fractions —
offered four tappable parts whose taps did nothing at all, because the click
handler matched one hard-coded section id that could never fire.

After this audit, Class 6 shows **1 chapter ready**. The number going down is
the fix.

---

## Chapter-by-chapter

| Chapter | v0.69 said | Sections | Sections that route | What a student actually got | v0.70 says |
|---|---|---|---|---|---|
| 1 Patterns in Mathematics | Not available | 6 | 0 | — | Not available ✓ |
| **2 Lines and Angles** | **Ready to learn** | 11 | **0** | Chapter page, 11 parts, all *Coming soon* | **Not available** |
| 3 Number Play | Not available | 12 | 0 | — | Not available ✓ |
| 4 Data Handling | Not available | 5 | 0 | — | Not available ✓ |
| **5 Prime Time** | **Ready to learn** | 6 | **0** | Chapter page, 6 parts, all *Coming soon* | **Not available** |
| **6 Perimeter and Area** | **Ready to learn** | 3 | **0** | Chapter page, 3 parts, all *Coming soon* | **Not available** |
| **7 Fractions** | Ready to learn | 9 | **4** | Four parts offering "Learn →" that **did nothing** | Ready to learn ✓ |
| 8 Playing with Constructions | Not available | 6 | 0 | — | Not available ✓ |
| **9 Symmetry** | **Ready to learn** | 2 | **0** | Chapter page, 2 parts, all *Coming soon* | **Not available** |
| 10 The Other Side of Zero | Not available | 5 | 0 | — | Not available ✓ |

---

## Defect 1 — chapter availability asked the wrong question

`getStudentChapterAvailability` decided Learn by:

> does any legacy module mapped to this chapter have a lesson?

That is a question about **Pragati's internal module inventory**, not about the
chapter a student taps. Chapter 2 maps to the legacy `geometry` module, which
has lessons; none of those lessons is eligible for any of Chapter 2's eleven
official sections. So the card said "Ready to learn" and the chapter was empty.

v0.64 had already fixed exactly this bug for **Practice**, rolling chapter status
up from section eligibility so there is one decision-maker. Learn was left
deciding for itself and drifted. It now rolls up the same way.

## Defect 2 — the four tappable Fractions parts were dead links

```js
onOpenSection={(sectionId) => {
  if (sectionId === 'ncert_gp_c6_s7_4') { setView('section74Practice'); }
}}
```

One hard-coded id, and it is §7.4 — which is unpublished and therefore never
tappable. So the branch could not fire, and §7.2, §7.5, §7.6 and §7.8 rendered a
"Learn →" affordance that moved nothing.

It survived three releases because **every test asserted what the list showed,
never what a tap did.** The route-verified screenshot harness found it on its
first successful walk of the chapter.

## Defect 3 — "Learn" overclaimed what the content is

The four Fractions parts that now route are backed by **legacy skill lessons**:

| Section | Routes to | What that is |
|---|---|---|
| 7.2 Fractional Units as Parts of a Whole | `FR.02` | Legacy skill lesson |
| 7.5 Mixed Fractions | `FR.04` | Legacy skill lesson |
| 7.6 Equivalent Fractions | `FR.03` | Legacy skill lesson |
| 7.8 Addition and Subtraction of Fractions | `FR.05` | Legacy skill lesson |

These were authored against the **old 14-chapter book**, keyed by Pragati's
internal skill codes, never section-verified against Ganita Prakash, never
educator-reviewed. The content is real and usable. It is **not** this section's
lesson.

Calling it "Learn" told a student that Pragati teaches §7.2 of their textbook.
The section now says:

> *Related practice from an earlier Pragati topic* — **Practise →**

`sectionRouting.ts` carries the provenance (`legacy_skill_content` vs
`official_section_content`) so the distinction is representable rather than
implied. No section currently has `official_section_content`.

---

## The irony worth recording

**§7.4 is the only Fractions section with genuinely authored, official-section
Learn content** — thirty-one worked examples, a frozen artifact, three
iterations of hand audit.

It is the one section a student **cannot** reach, because it is unpublished and
awaiting educator review.

Meanwhile the four sections a student *could* reach were backed by grandfathered
content that no one has verified against the current textbook. That inversion is
the honest state of the product, and it is the strongest argument for sending the
§7.4 review.

---

## What was NOT done

- **No legacy content was removed.** All of it still exists, still routes, and is
  now labelled for what it is.
- **No content was authored** to make a chapter available. Four chapters became
  unavailable, which is the truthful outcome, not a regression to fix by writing
  filler.
- **Section-level verification of the legacy lessons has not been done.** Whether
  `FR.02`'s lesson genuinely teaches §7.2 is a curriculum judgement requiring
  someone who has read both. Until then the label stays cautious.

## What must not be claimed

- Class 6 has **one** learnable chapter, not five.
- That chapter's four open parts serve **legacy** material, not verified
  official-section lessons.
- No Class 6 content has been educator-reviewed.
