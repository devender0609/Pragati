// v0.75 §21 — REVIEW PACKAGES FOR THE SEVEN REMAINING FRACTIONS DRAFTS.
//
// WHAT v0.74 ESTABLISHED
//
// Eight Chapter 7 sections are complete instructional drafts. Exactly
// one — §7.4 — could actually be reviewed, because it alone had a
// frozen candidate, a pinned build and a question set. Package B's 37
// questions are written about §7.4's number line and are not
// transferable. The other seven sat in `review_package_preparation`,
// which v0.73 had reported as "blocked on people, not engineering".
//
// This module builds the seven missing packages.
//
// WHY NOT SEVEN COPIES OF PACKAGE B
//
// §21 says explicitly: do not create 37-question clones blindly. Two
// reasons, and the second is the important one.
//
// First, cost. 37 questions × 7 sections is 259 questions. No educator
// will answer that, and a package nobody completes produces
// `review_partially_adjudicated` — which the gate correctly refuses,
// so the work would buy nothing.
//
// Second, and worse: a fixed question set ASKS ABOUT THINGS THAT DO NOT
// EXIST. Package B has six questions on visuals (V1–V6) and four on
// interactive practice (P1–P4). §7.9 has neither, by a recorded and
// justified waiver. Asking a reviewer to judge the visual in a section
// with no visual invites them to answer anyway — and a fabricated
// answer is worse evidence than no answer, because it is indistinguishable
// from a real one after import.
//
// So each package is DERIVED from what its section actually contains.
// A section with no interactive item is not asked about interaction.
// The instrument is shorter, section-specific, and every question has a
// referent.
//
// §7.4 IS NOT REBUILT. Its package is frozen, sent-ready, and its
// fingerprint is `a1a3ff57`. Nothing here touches it.

import { fingerprintOf } from './contentArtifact';
// v0.81 §A — the packaging system used to import the Fractions
// accessors directly, so it could only ever see one chapter. Number Play
// §3.1 and §3.2 were complete drafts with no route to a reviewer. It now
// reads the cross-chapter registry.
import { isReviewEligible } from './numberPlayAlignment';
import {
  allAuthoredSections,
  anyAuthoredSectionById as authoredSectionById,
  authoredSectionsForChapter,
  FRACTIONS_CHAPTER_ID,
} from './authoredSections';
import { assessSection } from './instructionalCompleteness';
import type { ReviewRecord } from './educatorReview';

/**
 * v0.82.2 §14 — TWO VERSIONS, DELIBERATELY DIFFERENT THINGS.
 *
 *   SECTION_QUESTION_SET_VERSION versions the REVIEW INSTRUMENT — the
 *   shape of the questions a reviewer answers. It is global because the
 *   instrument is the same for every section.
 *
 *   `section.contentArtifactVersion` versions the LESSON. It is
 *   per-section because lessons change independently, and §3.1 is at
 *   version 2 because it was replaced rather than edited after the
 *   source audit.
 *
 * Conflating them was the bug: every package reported artifact version
 * 1, so a reviewer handed the rewritten §3.1 would have been told they
 * were reading the draft it replaced.
 */
export const SECTION_QUESTION_SET_VERSION = 1;

/** @deprecated use `section.contentArtifactVersion`. */
export const SECTION_ARTIFACT_VERSION = 1;

/** §7.4 already has a frozen package; it is never regenerated here. */
export const ALREADY_PACKAGED = 'ncert_gp_c6_s7_4';

export type ReviewQuestion = {
  id: string;
  /** What the reviewer is being asked to judge. */
  prompt: string;
  /** Why this question is in THIS package. Quoted in the markdown. */
  appliesBecause: string;
};

/**
 * The content a reviewer of this section actually judges.
 *
 * Mirrors `reviewRelevantContent()` in shape so the fingerprint means
 * the same thing for every section: change the lesson, change the hash,
 * and an old response stops matching.
 */
export function sectionReviewContent(officialSectionId: string): unknown {
  const s = authoredSectionById(officialSectionId);
  if (!s) return null;
  return {
    section: {
      chapter: s.source.officialChapterId,
      section: s.source.officialSectionId,
      title: s.source.exactTitle,
      page: s.source.startPage,
    },
    learningGoal: s.learningGoal,
    explanation: s.explanation,
    workedExamples: s.workedExamples,
    guidedPractice: s.guidedPractice,
    independentPractice: s.independentPractice,
    reasoningApplication: s.reasoningApplication,
    visuals: s.visuals,
    interactivePractice: s.interactivePractice,
  };
}

export function sectionFingerprint(officialSectionId: string): string {
  return fingerprintOf(sectionReviewContent(officialSectionId));
}

export function sectionReviewCode(officialSectionId: string): string {
  const n = officialSectionId.split('_s').pop()?.replace('_', '') ?? '??';
  const fp = sectionFingerprint(officialSectionId);
  // The review CODE carries the instrument version, not the lesson's:
  // it identifies a response sheet. Changing it would invalidate the
  // eight Fractions codes already generated.
  return `S${n}-v${SECTION_QUESTION_SET_VERSION}-${fp.slice(0, 6).toUpperCase()}`;
}

/**
 * Build the question set for one section from its completeness
 * assessment.
 *
 * The core block is always asked — every lesson has mathematics, an
 * explanation, worked examples and practice. The conditional blocks are
 * asked only where the component exists.
 */
export function questionsForSection(officialSectionId: string): ReviewQuestion[] {
  const s = authoredSectionById(officialSectionId);
  if (!s) return [];
  const a = assessSection(s);
  const qs: ReviewQuestion[] = [];
  const always = 'Every lesson is judged on this.';

  // --- Mathematics: always ------------------------------------------------
  qs.push(
    { id: 'M1', prompt: 'Is every mathematical statement in this section correct?', appliesBecause: always },
    { id: 'M2', prompt: 'Is the notation the one a Class 6 student meets in Ganita Prakash?', appliesBecause: always },
    { id: 'M3', prompt: 'Does the explanation match what this section of the printed book actually teaches?', appliesBecause: always },
    { id: 'M4', prompt: 'Would this explanation work with your own Class 6 students?', appliesBecause: always },
  );

  // --- Worked examples: count-scaled --------------------------------------
  if (a.workedExampleCount > 0) {
    qs.push(
      { id: 'W1', prompt: `Do the ${a.workedExampleCount} worked example(s) show the reasoning at every step, not just the answer?`, appliesBecause: `This section has ${a.workedExampleCount} worked example(s).` },
      { id: 'W2', prompt: 'Could a student reproduce these steps unaided afterwards?', appliesBecause: `This section has ${a.workedExampleCount} worked example(s).` },
    );
  }

  // --- Practice -----------------------------------------------------------
  if (a.guidedPracticeCount + a.independentPracticeCount > 0) {
    qs.push(
      { id: 'X1', prompt: 'Are the practice items at the right difficulty for this point in the chapter?', appliesBecause: `This section has ${a.guidedPracticeCount} guided and ${a.independentPracticeCount} independent item(s).` },
      { id: 'X2', prompt: 'Does any item test something this section never taught?', appliesBecause: `This section has ${a.guidedPracticeCount} guided and ${a.independentPracticeCount} independent item(s).` },
      { id: 'X3', prompt: 'Is the feedback on a wrong answer useful rather than merely corrective?', appliesBecause: 'Every practice item carries a rationale.' },
    );
  }

  // --- Visual: only if one exists ----------------------------------------
  if (a.visualRequirement.required && a.visualRequirement.satisfied) {
    qs.push(
      { id: 'V1', prompt: 'Does the visual carry mathematics, or is it decoration?', appliesBecause: 'This section has a semantic visual.' },
      { id: 'V2', prompt: 'Does the alt text convey the mathematics to a student who cannot see it?', appliesBecause: 'This section has a semantic visual.' },
    );
  }

  // --- Interaction: only if one exists ------------------------------------
  if (a.interactionRequirement.required && a.interactionRequirement.satisfied) {
    qs.push({
      id: 'P1',
      prompt: 'Does the interactive item teach, or does it test recall the section never asked for?',
      appliesBecause: 'This section has an interactive practice item.',
    });
  }

  // --- Reasoning ----------------------------------------------------------
  if (a.reasoningRequirement.required && a.reasoningRequirement.satisfied) {
    qs.push({
      id: 'R1',
      prompt: 'Is the reasoning task genuinely reasoning, rather than another computation?',
      appliesBecause: 'This section has a reasoning or application task.',
    });
  }

  // --- Misconception ------------------------------------------------------
  if (a.misconceptionRequirement.required && a.misconceptionRequirement.satisfied) {
    qs.push({
      id: 'C1',
      prompt: 'Is the documented misconception one you actually see, and is the feedback safe to show a child?',
      appliesBecause: 'This section documents a misconception.',
    });
  }

  // --- Overall: always ----------------------------------------------------
  qs.push(
    { id: 'O1', prompt: 'Is the reading load appropriate for one sitting at this age?', appliesBecause: always },
    { id: 'O2', prompt: 'Would you be willing to use this section with a class as it stands?', appliesBecause: always },
  );

  return qs;
}

/** The seven sections needing a package. Derived, never hard-coded. */

/**
 * v0.82.2 §10 — the chapter, named from the section rather than
 * hard-coded. The generic function said "a Class 6 fractions chapter"
 * for every package, which would be simply false on a Number Play one.
 */
function chapterDescription(sec: {
  source: { officialChapterId: string };
}): string {
  return sec.source.officialChapterId.includes('ch03')
    ? 'Chapter 3, Number Play, of Class 6 Mathematics'
    : 'Chapter 7, Fractions, of Class 6 Mathematics';
}

/**
 * v0.82.2 §11 — supplementary notes belong to the chapter that earned
 * them.
 *
 * The shaded-pieces note is a FRACTIONS obligation: v0.77.2 added
 * second-person misconception paraphrases to that chapter's lessons.
 * Putting it in a Number Play package would ask an educator to review
 * wording that does not exist there, which wastes their time and erodes
 * their trust in the rest of the package.
 *
 * Number Play's notes are its real enrichment — what Pragati added or
 * chose that the source does not state — not template filler.
 */
function chapterReviewerNotes(sec: {
  source: { officialChapterId: string; officialSectionId: string };
}): string {
  if (!sec.source.officialChapterId.includes('ch03')) {
    return [
      '### Also unreviewed: the student-facing "watch out for" wording',
      '',
      "v0.77.2 added short second-person paraphrases of this chapter's",
      'misconceptions, so that a Class 6 student reading a lesson sees "You',
      'might count just the shaded pieces and write 3" rather than the',
      'teacher-facing "Why students do this / How to fix it".',
      '',
      '**That paraphrase wording is presentation copy written by Pragati and',
      'has not been reviewed by any educator.** It restates the authored',
      'misconception and its correction in second person and introduces no',
      'new mathematical claim — but that is our assessment, not yours, and',
      'it is exactly the judgement a reviewer should make rather than',
      'inherit. Please read those lines as part of this package and say if',
      'any of them is wrong, unclear, or unkind.',
      '',
      'The underlying misconception records are unchanged.',
    ].join('\n');
  }

  const perSection: Record<string, string[]> = {
    ncert_gp_c6_s3_1: [
      '- Pragati uses **plants of stated heights** where the source uses',
      '  children standing in a line. The mathematics is the same; the',
      '  scenario is ours. Does it carry the idea as well?',
      '- Stating outright that **the tallest always reports 0**. The source',
      '  leads students to it through questions instead. Is naming it early',
      '  a help or a giveaway?',
    ],
    ncert_gp_c6_s3_2: [
      '- The **tie case** — two equal neighbours, so neither is a supercell',
      '  — is Pragati enrichment. The source tables use distinct numbers and',
      '  never raise it. We think it sharpens the definition; you may think',
      "  it distracts from the section's own emphasis.",
      '- All grid numbers are original rather than the source’s.',
    ],
    ncert_gp_c6_s3_3: [
      "- The **number-line windows are Pragati's**, not the source's,",
      '  including an 86,000–88,000 line whose interval is 250 rather than',
      '  a round thousand.',
      '- Stating the **method** explicitly — divide the span by the number',
      '  of intervals — where the source expects it without naming it.',
    ],
  };

  return [
    "### What in this section is Pragati's, not the book's",
    '',
    'The primary pages were read and this lesson follows their mathematics.',
    'These choices are ours, and are the parts most worth your judgement:',
    '',
    ...(perSection[sec.source.officialSectionId] ?? ['- (none recorded)']),
  ].join('\n');
}

export function sectionsNeedingPackages(officialChapterId?: string): string[] {
  const sections = officialChapterId
    ? authoredSectionsForChapter(officialChapterId)
    : allAuthoredSections();
  return sections
    .filter((s) => {
      const id = s.source.officialSectionId;
      if (id === ALREADY_PACKAGED) return false;
      const level = assessSection(s).level;
      if (level !== 'complete_instructional_draft') return false;
      // v0.82.2 §8 — ALIGNMENT GATES PACKAGING, NOT JUST READINESS.
      //
      // Structural completeness says every field is populated. It says
      // nothing about whether the section teaches what the source
      // teaches, and §3.1 and §3.3 were complete and wrong for three
      // releases. Sending a reviewer a wrong lesson wastes the scarcest
      // thing in this project — an educator's afternoon.
      //
      // Fractions keeps the chapter-wide legacy exemption already
      // documented in readiness: its alignment was established in
      // v0.74, section by section, before per-section records existed.
      if (s.source.officialChapterId === FRACTIONS_CHAPTER_ID) return true;
      return isReviewEligible(id, level);
    })
    .map((s) => s.source.officialSectionId);
}

/**
 * A `ReviewRecord` for one section, artifact-scoped and fingerprinted.
 *
 * `expectedFingerprint` is a FUNCTION, computed at import time, exactly
 * as Package B does it — a stored hash would go stale silently and the
 * importer would accept a response about a lesson that had changed.
 */
export function sectionReviewRecord(officialSectionId: string): ReviewRecord {
  const questions = questionsForSection(officialSectionId);
  const section = authoredSectionById(officialSectionId);
  return {
    packageId: `S_section:${officialSectionId}`,
    packageVersion: 'v0.75',
    questionSetVersion: SECTION_QUESTION_SET_VERSION,
    contentArtifactId: `${officialSectionId}_lesson`,
    // §13 — the real per-section version, not a package-wide constant.
    contentArtifactVersion: section?.contentArtifactVersion ?? SECTION_ARTIFACT_VERSION,
    expectedFingerprint: () => sectionFingerprint(officialSectionId),
    expectedItemIds: questions.map((q) => q.id),
    submissions: [],
    adjudications: [],
  };
}

/** All seven, in official section order. */
export function sectionReviewRecords(): ReviewRecord[] {
  return sectionsNeedingPackages().map(sectionReviewRecord);
}

/**
 * The reviewer-facing markdown for one section.
 *
 * Written here rather than by hand so a package cannot drift from the
 * lesson it describes, and so the seven are consistent with each other.
 */
export function sectionPackageMarkdown(officialSectionId: string): string {
  const s = authoredSectionById(officialSectionId);
  if (!s) return '';
  const a = assessSection(s);
  const qs = questionsForSection(officialSectionId);
  const code = sectionReviewCode(officialSectionId);

  const waived: string[] = [];
  if (!a.visualRequirement.required) waived.push(`visual — ${a.visualRequirement.reason}`);
  if (!a.interactionRequirement.required) waived.push(`interactive practice — ${a.interactionRequirement.reason}`);
  if (!a.misconceptionRequirement.required) waived.push(`documented misconception — ${a.misconceptionRequirement.reason}`);

  return `# Pragati review — Section ${s.source.sectionNumber}

**${s.source.exactTitle}**

Review code: \`${code}\`
Source: ${s.source.sourceReference}, p. ${s.source.startPage}
Questions: ${qs.length}

---

## What you are being asked

This is one section of ${chapterDescription(s)}, authored by Pragati and
**not yet seen by any student**. Nothing here is published.

${chapterReviewerNotes(s)}

You are a reviewer of this
section. Please answer as a teacher, not as a proofreader: if the explanation
would not work in your classroom, that matters more than any wording.

For each question answer **accept**, **revise**, **reject** or
**insufficient evidence**, and give a reason. A decision without a reason
cannot be adjudicated and will be treated as unanswered.

${waived.length > 0 ? `## Not included, on purpose

This section deliberately has no:

${waived.map((w) => `- ${w}`).join('\n')}

You are **not** asked about these. If you think that judgement is wrong, say so
under O2 — that is more useful than a guessed answer about something that does
not exist.
` : ''}
---

## Questions

${qs.map((q) => `**${q.id}.** ${q.prompt}\n\n_Asked because: ${q.appliesBecause}_\n`).join('\n')}

---

## Returning this

Send your answers back with the review code \`${code}\` quoted at the top.

Pragati recomputes the content fingerprint when your answers are imported. If
the lesson changes after you receive this, your response will be rejected
rather than silently accepted — your review is evidence about the version you
actually read, and applying it to a different version would misrepresent you.
`;
}
