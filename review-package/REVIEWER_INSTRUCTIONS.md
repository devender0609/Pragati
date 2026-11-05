# Reviewing a Class 9 lesson

Thank you for doing this. These lessons have never been reviewed by anyone.

## What you are judging

One **lesson**, exactly as a student would see it. Each lesson carries a
**review code** at the top of its screen, like `C9-BC88B-v2i1-318A32`. Quote
that code on everything you send back — it identifies precisely which lesson,
which version of it, and which set of questions you answered.

If the lesson is later edited, your response will be flagged as referring to an
earlier version rather than being silently applied to the new one. That is
deliberate, and it is why the code matters.

## Opening the lessons

1. Extract the review package.
2. `npm ci`
3. Create a file named `.env.local` containing one line:
   `VITE_ENABLE_AUTHORED_LEARN_PREVIEW=true`
4. `npm run build`
5. `npm run preview`, and open the address it prints.

Review **this** build, not a later one. The build you are looking at is
recorded as part of your response, because a question like "are the labels
readable on a phone?" is about what was rendered.

## The questions

Between 12 and 15 questions per lesson, depending on what the lesson contains.
You will not be asked about figures in a lesson that has none, or about charts
outside the data chapter.

They cover: the mathematics, fidelity to the source textbook, the teaching,
the feedback students receive, and the teacher notes where present.

## Your overall judgement

Four positions: **approve**, **approve with changes**, **revise**, **reject**.

Choose the one you mean. A lesson is not approved because every checkbox was
ticked — your judgement is the judgement, and the boxes are notes toward it.

## What happens to your feedback

It is classified and adjudicated, not implemented automatically. A reviewer
suggestion is evidence about the lesson; whether to act on it is a separate
decision, made with the other reviewer's response alongside yours.

Pragati's own standard — an internal policy, not an external requirement — is
**two independent perspectives** before a lesson counts as reviewed: a
practising educator and a curriculum specialist.

## What you do not need to understand

Internal identifiers, file names, or anything about how the software works. If
a screen shows you something that looks like engineering rather than
mathematics, that is a defect worth reporting.
