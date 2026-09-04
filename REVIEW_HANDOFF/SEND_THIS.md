# §7.4 review handoff — exactly what to send, and to whom

**Status: NOT SENT.** Nothing in this repository has been emailed to anyone.
This document prepares the handoff; it does not perform it, and no part of
Pragati will record a review as received until a real response is imported.

Two different people are being asked two different questions. Do not merge the
packages — a curriculum specialist judging placement and a Grade 6 teacher
judging the lesson are answering about different things, and combining them
produces a response that cannot be adjudicated.

---

## 1 · Grade 6 mathematics educator

**Send these three files:**

| File | What it is |
|---|---|
| `PRAGATI_SECTION_7_4_REVIEW_FINAL/PACKAGE_B_FOR_REVIEWER.md` | The 37 questions |
| `PRAGATI_SECTION_7_4_REVIEW_FINAL/README.md` | How to answer, and what happens next |
| `PRAGATI_SECTION_7_4_REVIEW_FINAL/review-candidate.json` | The frozen artifact identity |

**Who:** somebody who has actually taught fractions to Class 6. A mathematics
graduate who has not taught this age is the wrong reviewer — most of Package B
is about whether the explanation lands with an eleven-year-old.

**Time required:** 45–60 minutes.

### Message to send

> Hi [name],
>
> I've built one complete Class 6 fractions lesson in Pragati — section 7.4 of
> Ganita Prakash, "Marking Fraction Lengths on the Number Line" — and before I
> write any more, I'd like someone who actually teaches this to tell me whether
> it's any good.
>
> There are 37 questions attached, covering the mathematics, the visuals and
> the practice. Roughly an hour. Please be blunt: if the explanation wouldn't
> work in your classroom, that's the single most useful thing you can tell me.
>
> Nothing is published and no student has seen it. This one lesson decides the
> shape of the next fifty, so I'd rather find out now that it's wrong.
>
> Thank you — [your name]

---

## 2 · Curriculum reviewer

**Send these three files:**

| File | What it is |
|---|---|
| `PRAGATI_SECTION_7_4_CURRICULUM_REVIEW/PACKAGE_A_CURRICULUM_QUESTIONS.md` | The placement questions |
| `PRAGATI_SECTION_7_4_CURRICULUM_REVIEW/README.md` | Context |
| `PRAGATI_SECTION_7_4_CURRICULUM_REVIEW/curriculum-evidence.json` | The mapping evidence |

**Who:** somebody who knows the NCF-SE 2023 / Ganita Prakash structure — a
curriculum coordinator, a textbook-aligned teacher trainer, or a DIET faculty
member. This is not the same person as above and should not be.

**Time required:** 20–30 minutes.

### Message to send

> Hi [name],
>
> I'm checking whether Pragati has mapped one Class 6 fractions section to the
> right place in the current curriculum. It's section 7.4 of Ganita Prakash,
> and I want to confirm the competency mapping and the prerequisite ordering
> are defensible before the same mapping gets applied to sixty more sections.
>
> The questions and the evidence I used are attached — about half an hour.
> If the mapping is wrong, or if I've assumed prior knowledge that the book
> introduces later, that's exactly what I need to hear.
>
> Thank you — [your name]

---

## When a response comes back

**Pragati → Teacher mode → Admin & Research → import the submission.**

The importer recomputes the content fingerprint at import time and rejects a
response whose fingerprint does not match. That is deliberate: a review is
evidence about *the artifact the reviewer actually saw*. If the lesson changed
after it was sent, the response is evidence about something that no longer
exists, and the correct action is to re-send rather than to accept it.

Until a response is imported:

- `reviewed` stays **0**
- `published` stays **0**
- §7.4 stays `review_ready`
- the fingerprint stays `a1a3ff57`

**Do not mark this done because it was sent.** Sent and reviewed are separate
states, and collapsing them is the one elision that could let unreviewed
content reach a child.
