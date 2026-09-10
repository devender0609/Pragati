// v0.65 §2/§3 — WHAT, EXACTLY, DID THE REVIEWER SEE?
//
// THE PROBLEM
//
// The Package B template said `packageVersion: "v0.61"`. That is the
// version in which the QUESTIONS were designed. The educator will be
// reviewing the §7.4 lesson as it stands after v0.62, v0.63 and v0.64 —
// which changed worked example 4, replaced the fraction-strip schema,
// rewrote the visual labels, and added the interactive practice set.
//
// Conflating "when the questions were written" with "what the content
// says now" is how a review of one thing comes to authorize another.
//
// THE FIX
//
// The lesson has its own identity: an artifact ID, a version, and a
// fingerprint computed from the content a reviewer actually judges.
//
// FINGERPRINT SCOPE — deliberately narrow.
//
// Included: explanation, worked examples (prompts, steps, reasoning,
// answers), visual SEMANTICS, practice items, feedback, misconceptions,
// teacher notes, answer rationales.
//
// Excluded: styling, layout, component structure, build metadata,
// timestamps. A CSS change must not invalidate an educator's review;
// changing "1/4 is greater than 1/3" to "1/3 is greater than 1/4" must.

import {
  DEMO_SECTION_SOURCE,
  DEMO_SECTION_STUDENT,
  DEMO_SECTION_TEACHER,
  DEMO_SECTION_VISUALS,
} from './demonstrationSection';
import { SECTION_7_4_PRACTICE } from './fractionsPracticeItems';
import { MISCONCEPTION_FEEDBACK } from './instructionalInteraction';
import type { VisualSpec } from './visualSpecification';

export type ContentArtifact = {
  contentArtifactId: string;
  contentArtifactVersion: number;
  officialChapterId: string;
  officialSectionId: string;
  sectionTitle: string;
  sourceReference: string;
  /** Deterministic over review-relevant semantics only. */
  contentFingerprint: string;
  /** Short human-quotable form, for the reviewer packet. */
  reviewCode: string;
};

// ---------------------------------------------------------------------------
// Fingerprint
// ---------------------------------------------------------------------------

/**
 * v0.66 §6 — WHY FNV-1a AND NOT SHA-256.
 *
 * SHA-256 was considered and NOT adopted. The reasons, so the decision
 * can be revisited rather than inherited:
 *
 *  - The threat is accidental drift — content edited after a packet was
 *    sent — not an adversary forging a review. Nobody gains from
 *    colliding a lesson hash.
 *  - The only synchronous SHA-256 available here is `node:crypto`, which
 *    would not run in the browser build where this module is imported.
 *    `crypto.subtle` is async, which would make every caller async for
 *    no evidential gain.
 *  - Adding a hashing dependency for one 8-hex string is the "heavy
 *    infrastructure" §6 warns against.
 *
 * CONSEQUENCES, stated rather than glossed:
 *  - This is NOT cryptographic. No document describes the review as
 *    "cryptographically tied" to the content.
 *  - The full 8-hex fingerprint is the authoritative identifier; the
 *    short review code (`S74-v1-1A9346`) is a human convenience for
 *    quoting in email, not an ID the system trusts.
 *
 * If this artifact ever needs to resist a motivated party, replace this
 * function — the canonical payload below is already separated for
 * exactly that swap.
 */
export function fnv1a(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** Only the mathematical semantics of a visual — never its rendering. */
function visualSemantics(v: VisualSpec): unknown {
  if (v.type === 'number_line') {
    return {
      t: v.type,
      min: v.min,
      max: v.max,
      partitions: v.partitions,
      points: v.markedPoints.map((p) => ({ v: p.value, l: p.label })),
      from: v.highlightFrom,
      to: v.highlightTo,
      tier: v.equivalenceTier,
      alt: v.altText,
      caption: v.caption,
    };
  }
  if (v.type === 'fraction_strip') {
    return {
      t: v.type,
      strips: v.strips,
      asserts: v.assertsEquivalence,
      alt: v.altText,
      caption: v.caption,
    };
  }
  return { t: v.type, alt: v.altText, caption: v.caption };
}

/**
 * The exact material a reviewer judges, in a stable order.
 *
 * Key order is fixed by construction (object literals serialise in
 * insertion order), so the same content yields the same string on every
 * run.
 */
export function reviewRelevantContent(): unknown {
  return {
    section: {
      chapter: DEMO_SECTION_SOURCE.officialChapterId,
      section: DEMO_SECTION_SOURCE.officialSectionId,
      title: DEMO_SECTION_SOURCE.exactTitle,
      page: DEMO_SECTION_SOURCE.startPage,
    },
    learningGoal: DEMO_SECTION_STUDENT.learningGoal,
    prerequisites: DEMO_SECTION_STUDENT.prerequisiteCheck,
    explanation: DEMO_SECTION_STUDENT.explanation,
    representations: DEMO_SECTION_STUDENT.representations,
    workedExamples: DEMO_SECTION_STUDENT.workedExamples.map((w) => ({
      id: w.id,
      prompt: w.prompt,
      steps: w.steps.map((s) => ({ text: s.text, reasoning: s.reasoning })),
      answer: w.answer,
      visualRef: w.visualRef ?? null,
    })),
    misconceptions: DEMO_SECTION_STUDENT.misconceptions.map((m) => ({
      id: m.id,
      misconception: m.misconception,
      why: m.whyItHappens,
      studentFeedback: m.studentFeedback,
      teacherNote: m.teacherNote,
    })),
    guidedPractice: DEMO_SECTION_STUDENT.guidedPractice,
    independentPractice: DEMO_SECTION_STUDENT.independentPractice,
    reasoning: DEMO_SECTION_STUDENT.reasoningApplication,
    summary: DEMO_SECTION_STUDENT.summary,
    nextStep: DEMO_SECTION_STUDENT.nextStep,
    visuals: DEMO_SECTION_VISUALS.map(visualSemantics),
    practiceItems: SECTION_7_4_PRACTICE.map((i) => ({
      id: i.itemId,
      format: i.format,
      prompt: i.prompt,
      correctFeedback: i.correctFeedback,
      neutralIncorrectFeedback: i.neutralIncorrectFeedback,
      spec:
        i.format === 'multiple_choice'
          ? { choices: i.choices, correct: i.correctChoiceId }
          : i.format === 'numeric_entry'
            ? { correct: i.correctValue, equiv: i.acceptEquivalent }
            : i.format === 'select_point_on_number_line'
              ? {
                  min: i.min,
                  max: i.max,
                  partitions: i.partitions,
                  tick: i.correctTickIndex,
                }
              : i.format === 'fraction_strip_selection'
                ? { strips: i.strips, target: i.targetValue }
                // v0.68 §6 — `area_model_selection` exists chapter-wide
                // but §7.4 has no item in that format, so this branch
                // is never taken here and the serialised payload is
                // unchanged. The fingerprint test proves it.
                : { options: i.options, target: i.targetValue },
    })),
    // v0.66 §5 — MISCONCEPTION FEEDBACK WAS MISSING from the payload.
    // Found by the fingerprint regression test: the text a student sees
    // after a wrong answer lives in MISCONCEPTION_FEEDBACK, not on the
    // items, so editing "count the spaces" to "count the marks" — a
    // mathematically wrong instruction — would not have moved the hash.
    // Package B item X6 asks about exactly this wording.
    misconceptionFeedback: MISCONCEPTION_FEEDBACK,
    teacherNotes: DEMO_SECTION_TEACHER.teachingNotes,
    questioningPrompts: DEMO_SECTION_TEACHER.questioningPrompts,
    support: DEMO_SECTION_TEACHER.supportForStrugglingLearners,
    extension: DEMO_SECTION_TEACHER.extension,
    answerRationales: DEMO_SECTION_TEACHER.answerRationales,
    competencyMapping: DEMO_SECTION_TEACHER.competencyMapping.map((c) => ({
      id: c.id,
      text: c.text,
    })),
  };
}

/**
 * v0.66 §5 — the canonical payload, exposed so a test can hash a
 * MUTATED copy and prove the hash actually differs.
 *
 * The v0.65 regression test compared two serialized strings and
 * asserted they were unequal — which proves the mutation happened, not
 * that the fingerprint would catch it. Hashing is now injectable.
 */
export function canonicalPayload(content?: unknown): string {
  return JSON.stringify(content ?? reviewRelevantContent());
}

export function fingerprintOf(content?: unknown): string {
  return fnv1a(canonicalPayload(content));
}

export function computeContentFingerprint(): string {
  return fingerprintOf();
}

// ---------------------------------------------------------------------------
// The artifact
// ---------------------------------------------------------------------------

/** Bumped by hand when the lesson is deliberately revised. The
 *  fingerprint catches accidental drift; the version records intent. */
export const SECTION_7_4_ARTIFACT_VERSION = 1;

export function section74Artifact(): ContentArtifact {
  const fp = computeContentFingerprint();
  return {
    contentArtifactId: 'ncert_gp_c6_s7_4_lesson',
    contentArtifactVersion: SECTION_7_4_ARTIFACT_VERSION,
    officialChapterId: DEMO_SECTION_SOURCE.officialChapterId,
    officialSectionId: DEMO_SECTION_SOURCE.officialSectionId,
    sectionTitle: DEMO_SECTION_SOURCE.exactTitle,
    sourceReference: DEMO_SECTION_SOURCE.sourceReference,
    contentFingerprint: fp,
    // What the reviewer quotes back. Short enough to type.
    reviewCode: `S74-v${SECTION_7_4_ARTIFACT_VERSION}-${fp.slice(0, 6).toUpperCase()}`,
  };
}

/** The question set, versioned independently of the content. */
export const PACKAGE_B_QUESTION_SET_VERSION = 1;
