# Reviewing a Class 11 lesson

You are checking whether a lesson **actually teaches** what the syllabus
says it should. Automated checks already confirmed each lesson is
well-formed and correctly labelled. They cannot tell whether it teaches
anything. That is what you are for.

You are free to disagree with anything the automation concluded.

## What you do

**1. Open a packet.** `class11-review/packets/<artifact-id>.json`, or read
the same content in `WAVE1_REVIEWER_DOCUMENT.md`, which is laid out for
reading rather than for machines.

**2. Read the objectives first, then the lesson.** Each packet lists the
canonical objectives the lesson claims to cover, with the demand level and
any proof expectation. Read those before the lesson, so you are checking
the lesson against the syllabus rather than the other way round.

**3. Judge each objective separately.** A lesson covering four objectives
gets four answers, not one:

- **ALIGNED** — materially taught
- **PARTIAL** — touched but thin for the demand level
- **MISALIGNED** — mentioned, assumed, or wrong
- **CANNOT_DETERMINE** — you need something you do not have

The distinction that matters most: **mentioned is not taught.** A lesson
can name an objective, use its vocabulary, and still never instruct it.

**4. Answer the granularity question.** Several lessons here carry more
than one objective, and several objectives are spread across more than one
lesson. Both are deliberate; neither has been checked.

- **ONE_LESSON_APPROPRIATE**
- **SHOULD_SPLIT** — objectives are crowding each other
- **SHOULD_MERGE** — this should be one lesson with another
- **DUPLICATIVE_ACROSS_ARTIFACTS** — another lesson already teaches this and
  this one adds nothing
- **UNCERTAIN**

This answer carries weight beyond the lesson. The same mapping approach is
about to be used for Class 12, so a repeated SHOULD_SPLIT is a reason to
change the approach before it is repeated.

**5. Record issues where you have them.** Each needs the unit, the stage,
a category, a severity and an explanation.

- **CRITICAL** — the instruction is wrong or unsafe to teach
- **MAJOR** — a required objective is missing, a serious conceptual
  problem, or the wrong granularity
- **MODERATE** — instructionally meaningful, needs correction
- **MINOR** — clarity and wording

Formatting alone is MINOR unless it changes the mathematics.

**6. Copy the fingerprint.** Each packet has an `artifactFingerprint`. Copy
it into `reviewedFingerprint`. It records exactly which version of the
lesson you read — if the lesson is edited afterwards, your review is marked
stale rather than silently applied to text you never saw.

**7. Return the file.** Fill `reviewerResponse` in the packet, or submit a
separate file matching `RESPONSE_SCHEMA.json`. Put your name or reviewer
code in `reviewer`; a response without it cannot be accepted as a human
review.

## What you can ignore

Repository structure, tests, build tooling, checkpoint history. None of it
bears on whether the mathematics is taught properly.

## A suggested start

If you would rather test the process before committing to all 25, four
packets exercise every part of it:

| Artifact | Why |
|---|---|
| `ncert_kemh1_s7_2_binomial_theorem_lesson` | four objectives on one lesson — the hardest granularity case |
| `ncert_kemh1_s3_4_sum_difference_lesson` | shares two objectives with another lesson |
| `cbse_fo11_chain_rule_lesson` | CBSE-only, new visual family |
| `cbse_fo8_special_sums_lesson` | CBSE-only, new visual family |

Nothing is assigned or sent until you say so.
