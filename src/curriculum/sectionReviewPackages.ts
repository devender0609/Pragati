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
import { fractionsChapterSections, authoredSectionById } from './fractionsChapter';
import { assessSection } from './instructionalCompleteness';
import type { ReviewRecord } from './educatorReview';

/** The question set version for the short section instrument. */
export const SECTION_QUESTION_SET_VERSION = 1;

/** Bumped by hand when a section lesson is deliberately revised. */
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
  return `S${n}-v${SECTION_ARTIFACT_VERSION}-${fp.slice(0, 6).toUpperCase()}`;
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
export function sectionsNeedingPackages(): string[] {
  return fractionsChapterSections()
    .filter((s) => {
      const id = s.source.officialSectionId;
      if (id === ALREADY_PACKAGED) return false;
      return assessSection(s).level === 'complete_instructional_draft';
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
  return {
    packageId: `S_section:${officialSectionId}`,
    packageVersion: 'v0.75',
    questionSetVersion: SECTION_QUESTION_SET_VERSION,
    contentArtifactId: `${officialSectionId}_lesson`,
    contentArtifactVersion: SECTION_ARTIFACT_VERSION,
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

This is one section of a Class 6 fractions chapter, authored by Pragati and
**not yet seen by any student**. Nothing here is published.

You are the ${officialSectionId === 'ncert_gp_c6_s7_1' ? 'first' : 'a'} reviewer of this
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
