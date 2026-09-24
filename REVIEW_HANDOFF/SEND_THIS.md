# §7.4 review handoff — exactly what to send, and to whom

**v0.83.2 — send the `_CURRENT` folders only.** The folders without
`_CURRENT` are historical: they cite §7.4 as page 160 and code
S74-v1-A1A3FF. Every current package states one identity — code
`S74-v1-DFC56A`, content fingerprint `dfc56ab5`, provenance fingerprint
`efeccb48`, page 159 — and there is nothing for a reviewer to reconcile.

**Status: NOT SENT.** Nothing in this repository has been emailed to anyone.

**Current state (v0.83.3):** Fractions has 9 complete drafts, all
review-ready; none sent, reviewed or published. §7.4 goes first because it
is the anchor/template section, not because it is the only lesson written.
Its CURRENT packages were regenerated with the corrected source page
(159) and carry separate instructional and provenance identities, so
nothing in them has to be corrected by hand.

Two different people are being asked two different questions. Do not merge the
packages — a curriculum specialist judging placement and a Grade 6 teacher
judging the lesson are answering about different things, and combining them
produces a response that cannot be adjudicated.

---

## 1 · Grade 6 mathematics educator

**Send these three files:**

| File | What it is |
|---|---|
| `PRAGATI_SECTION_7_4_REVIEW_CURRENT/PACKAGE_B_FOR_REVIEWER.md` | The 37 questions |
| `PRAGATI_SECTION_7_4_REVIEW_CURRENT/README.md` | How to answer, and what happens next |
| `PRAGATI_SECTION_7_4_REVIEW_CURRENT/review-candidate.json` | The frozen artifact identity |

**Who:** somebody who has actually taught fractions to Class 6. A mathematics
graduate who has not taught this age is the wrong reviewer — most of Package B
is about whether the explanation lands with an eleven-year-old.

**Time required:** 45–60 minutes.

### Message to send

> Hi [name],
>
> I'm building Pragati, a mathematics learning app for Indian schools, and I'd
> value a review from someone who actually teaches Class 6.
>
> Pragati now has nine complete draft lessons for Chapter 7, Fractions, of
> Ganita Prakash. I'm asking you to review one of them first: section 7.4,
> "Marking Fraction Lengths on the Number Line". It's the anchor section — the
> one the other Fractions drafts were modelled on — so what you tell me about
> it will shape how I judge and revise the other eight before anyone else sees
> them.
>
> There are 37 questions attached. They ask whether the lesson suits an
> eleven-year-old, whether the mathematics is explained clearly, whether the
> number lines and other visuals help, whether the practice is right in amount
> and difficulty, and whether you could actually use it in a classroom. Roughly
> an hour. Please be blunt: if the explanation wouldn't work in your classroom,
> that's the single most useful thing you can tell me.
>
> Two notes. The attached files are the current package: the source page
> reads 159, which is the printed page, and the review code inside them is
> the one to quote back. And the lesson shows students
> short "watch out for" lines, which restate common mistakes in the second
> person ("You might count just the shaded pieces…"). No educator has read
> that wording yet — if any line is wrong, unclear or unkind, please say so.
>
> Nothing is published and no student has seen any of it.
>
> Thank you — [your name]

---

## 2 · Curriculum reviewer

**Send these three files:**

| File | What it is |
|---|---|
| `PRAGATI_SECTION_7_4_CURRICULUM_REVIEW_CURRENT/PACKAGE_A_CURRICULUM_QUESTIONS.md` | The placement questions |
| `PRAGATI_SECTION_7_4_CURRICULUM_REVIEW_CURRENT/README.md` | Context |
| `PRAGATI_SECTION_7_4_CURRICULUM_REVIEW_CURRENT/curriculum-evidence.json` | The mapping evidence |

**Who:** somebody who knows the NCF-SE 2023 / Ganita Prakash structure — a
curriculum coordinator, a textbook-aligned teacher trainer, or a DIET faculty
member. This is not the same person as above and should not be.

**Time required:** 20–30 minutes.

### Message to send

> Hi [name],
>
> I'm building Pragati, a mathematics learning app for Indian schools, and I
> need someone who knows the NCF-SE 2023 / Ganita Prakash structure to check
> its curriculum placement.
>
> Pragati has nine complete draft lessons for Chapter 7, Fractions. I'm asking
> about one of them: section 7.4, "Marking Fraction Lengths on the Number
> Line", which is the anchor section for the chapter. There are three
> questions — whether the section is placed correctly, whether the competency
> mapping is defensible, and whether the prerequisites I've assumed are
> actually taught before it. What you tell me will guide how I check the
> placement of the other drafts. About half an hour.
>
> I'm not asking about teaching quality; a practising Class 6 teacher is
> reviewing that separately. If the mapping is wrong, or I've assumed prior
> knowledge the book introduces later, that's exactly what I need to hear.
>
> The attached files are the current package, citing the printed page 159.
> Nothing is published.
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
- the fingerprint stays `dfc56ab5`

**Do not mark this done because it was sent.** Sent and reviewed are separate
states, and collapsing them is the one elision that could let unreviewed
content reach a child.


---

## v0.78 — one thing that changed in the packages, and one gap

Every regenerated package now carries a section headed **"Also
unreviewed: the student-facing 'watch out for' wording"**. v0.77.2 added
short second-person paraphrases of the chapter's misconceptions so a
Class 6 student reads "You might count just the shaded pieces and write
3" instead of the teacher-facing "Why students do this / How to fix it".

That paraphrase wording is presentation copy Pragati wrote and no
educator has read. It restates the authored misconception and its
correction in second person and introduces no new mathematical claim —
but that is *our* assessment, and it is exactly the judgement a reviewer
should make rather than inherit. The reviewer is asked to read those
lines and say if any is wrong, unclear or unkind.

**The gap:** §7.4's package is frozen by design and is NOT regenerated,
so it does not carry this note. The educator covering message above now
mentions the paraphrases by hand. Unfreezing the package to
add a paragraph would change its fingerprint, which is a worse trade
than one sentence in an email.

**Status is unchanged: NOT SENT.** Sent is not reviewed.
