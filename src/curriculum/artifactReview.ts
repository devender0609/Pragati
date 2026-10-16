// ===========================================================================
// v0.84.0-review.1 checkpoint 48 — REVIEWING THE ARTIFACT, NOT THE SECTION.
//
// WHY THE EXISTING SYSTEM CANNOT CARRY CLASS 9
//
// The v0.66–v0.83 review machinery was written for Fractions, where one
// official section meant one lesson. Three assumptions follow from that and
// all three fail here:
//
//   1. `authoredSectionById()` searches ONLY the Fractions chapter, so every
//      Class 9 artifact resolves to null and gets no questions at all.
//   2. `sectionReviewCode()` derives a code from the section id, splitting on
//      '_s'. Chapter 9's lessons have no section id, so they would collide on
//      '??'; and the eleven split sections would give two lessons one code.
//   3. The question set asks "is the notation the one a Class 6 student meets
//      in Ganita Prakash?" — a real question, about the wrong book.
//
// So Class 9 review identity is the ARTIFACT: `contentArtifactId` plus its
// version and fingerprints. An official section is provenance. For a split
// section it is shared by two lessons, for a merged lesson there are two of
// them, and for Chapter 9 there is none — none of which a section-keyed
// identity survives.
//
// The sound part of the old design is kept and generalised: three separate
// identities, so a response goes stale for the right reason.
//
//   semantic     — the mathematics and teaching. A CSS change must not
//                  invalidate a judgement that 3/4 is correct.
//   provenance   — the book, pages and sections. A curriculum reviewer judges
//                  exactly this, and a correction here need not invalidate a
//                  pedagogy review.
//   presentation — what was rendered. "Can you read this on a phone?" is
//                  stale when the renderer changes, however stable the words.
//
// Class 6 §7.4 keeps its historical frozen identity untouched. This module
// adds a path; it migrates nothing.
// ===========================================================================

import type { AuthoredSection } from './authoredSection';
import { artifactSourceKind } from './authoredSection';
import { allAuthoredSections } from './authoredSections';
import { authoredLearnCatalogueForReview } from './authoredLearnCatalogue';
import { fingerprintOf, fnv1a } from './contentArtifact';
import { SOURCE_SEGMENTS } from './instructionalUnits';

/** The instrument version. Bumping it invalidates every response sheet. */
export const CLASS9_INSTRUMENT_VERSION = 1;

// ---------------------------------------------------------------------------
// Fingerprints
// ---------------------------------------------------------------------------

/** The mathematics and teaching a reviewer judges. Styling is excluded. */
export function artifactSemanticContent(s: AuthoredSection): unknown {
  return {
    learningGoal: s.learningGoal,
    priorKnowledgeCheck: s.priorKnowledgeCheck,
    vocabulary: s.vocabulary,
    explanation: s.explanation,
    workedExamples: s.workedExamples,
    guidedPractice: s.guidedPractice,
    independentPractice: s.independentPractice,
    reasoningApplication: s.reasoningApplication,
    summary: s.summary,
    nextStep: s.nextStep,
    teacher: s.teacher,
    visuals: s.visuals,
    dataSets: s.dataSets,
    dataDisplays: s.dataDisplays,
  };
}

export function artifactSemanticFingerprint(s: AuthoredSection): string {
  return fingerprintOf(artifactSemanticContent(s));
}

/** Where the lesson came from — the book, the pages, the sections or segments. */
export function artifactProvenanceContent(s: AuthoredSection): unknown {
  return {
    kind: artifactSourceKind(s.source),
    chapter: s.source.officialChapterId,
    officialSectionId: s.source.officialSectionId,
    additionalOfficialSectionIds: s.source.additionalOfficialSectionIds ?? [],
    sourceSegmentIds: s.source.sourceSegmentIds ?? [],
    sectionNumber: s.source.sectionNumber ?? '',
    exactTitle: s.source.exactTitle,
    startPage: s.source.startPage,
    textbook: s.source.textbook,
    inspectionDate: s.source.inspectionDate,
  };
}

export function artifactProvenanceFingerprint(s: AuthoredSection): string {
  return fingerprintOf(artifactProvenanceContent(s));
}

// ---------------------------------------------------------------------------
// Review code
// ---------------------------------------------------------------------------

/**
 * A code a human can read aloud that identifies exactly one frozen candidate.
 *
 * Derived from the ARTIFACT id, not the section number, so split siblings
 * differ and Chapter 9 is representable. The short hash of the artifact id
 * keeps it compact without exposing an internal identifier, and the semantic
 * fingerprint prefix makes a content change visible in the code itself.
 *
 *   C9-<artifact hash>-v<artifact version>i<instrument>-<semantic prefix>
 */
export function artifactReviewCode(s: AuthoredSection): string {
  const handle = fnv1a(s.contentArtifactId).slice(0, 5).toUpperCase();
  const fp = artifactSemanticFingerprint(s).slice(0, 6).toUpperCase();
  return `C9-${handle}-v${s.contentArtifactVersion}i${CLASS9_INSTRUMENT_VERSION}-${fp}`;
}

// ---------------------------------------------------------------------------
// Provenance, in words a reviewer can use
// ---------------------------------------------------------------------------

export function reviewerSourceDescription(s: AuthoredSection): string {
  if (artifactSourceKind(s.source) === 'source_segment') {
    const segs = (s.source.sourceSegmentIds ?? [])
      .map((id) => SOURCE_SEGMENTS.find((x) => x.sourceSegmentId === id))
      .filter((x): x is NonNullable<typeof x> => !!x);
    const pages = segs
      .map((x) => `${x.sourceEvidence.pdfPageStart}\u2013${x.sourceEvidence.pdfPageEnd}`)
      .join(', ');
    // No §9.1 is invented. The book prints no number, and saying so is
    // more useful to a reviewer than a plausible fabrication.
    return `${s.source.textbook} \u2014 Chapter 9, unnumbered instructional segment${
      segs.length > 1 ? 's' : ''
    }, pages ${pages}`;
  }
  const extra = s.source.additionalOfficialSectionIds ?? [];
  const base = `${s.source.textbook} \u2014 \u00a7${s.source.sectionNumber} ${s.source.exactTitle}, from page ${s.source.startPage}`;
  return extra.length > 0
    ? `${base}. This lesson deliberately integrates material from ${extra.length} further section${extra.length > 1 ? 's' : ''}.`
    : base;
}

// ---------------------------------------------------------------------------
// The instrument — core questions plus the ones that apply
// ---------------------------------------------------------------------------

export type ReviewQuestionArea =
  | 'mathematics'
  | 'source_fidelity'
  | 'instruction'
  | 'misconceptions'
  | 'teacher_material'
  | 'presentation';

export type ArtifactReviewQuestion = {
  id: string;
  area: ReviewQuestionArea;
  prompt: string;
  /** Why this reviewer is being asked this about this lesson. */
  appliesBecause: string;
  /** True when the answer depends on what was rendered, not only the words. */
  presentationDependent: boolean;
};

const CORE: ArtifactReviewQuestion[] = [
  { id: 'M1', area: 'mathematics', prompt: 'Is every mathematical statement in this lesson correct?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'M2', area: 'mathematics', prompt: 'Does each worked example\u2019s reasoning actually justify its step, rather than restating it?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'M3', area: 'mathematics', prompt: 'Are the answers and the feedback given to students mathematically right?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'S1', area: 'source_fidelity', prompt: 'Does the lesson stay inside what the source section teaches, without importing later material?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'S2', area: 'source_fidelity', prompt: 'Is the terminology the one this textbook uses at this stage?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'S3', area: 'source_fidelity', prompt: 'Does the lesson meet the source\u2019s mathematical intent, rather than a thinner version of it?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'I1', area: 'instruction', prompt: 'Would a Class 9 student following this lesson understand the idea?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'I2', area: 'instruction', prompt: 'Does it build on what comes before it and prepare what comes after?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'I3', area: 'instruction', prompt: 'Is the practice worth doing \u2014 does it test the idea rather than the arithmetic alone?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
  { id: 'I4', area: 'instruction', prompt: 'Does the Think deeper task ask for reasoning a strong student could not answer by recall?', appliesBecause: 'Asked of every lesson.', presentationDependent: false },
];

export function questionsForArtifact(s: AuthoredSection): ArtifactReviewQuestion[] {
  const qs = [...CORE];

  if ((s.visuals ?? []).length > 0) {
    qs.push(
      { id: 'V1', area: 'presentation', prompt: 'Does each figure show the mathematics correctly, with nothing in it that would mislead?', appliesBecause: 'This lesson contains figures.', presentationDependent: true },
      { id: 'V2', area: 'presentation', prompt: 'Are the figures readable on a phone, with labels large enough to use?', appliesBecause: 'This lesson contains figures.', presentationDependent: true }
    );
  }
  if ((s.dataDisplays ?? []).length > 0) {
    qs.push({ id: 'D1', area: 'presentation', prompt: 'Do the charts show the stated data faithfully, and does the accompanying table give the same figures?', appliesBecause: 'This lesson contains data displays.', presentationDependent: true });
  }
  if ((s.source.additionalOfficialSectionIds ?? []).length > 0) {
    qs.push({ id: 'S4', area: 'source_fidelity', prompt: 'This lesson integrates more than one source section. Is that integration faithful to both, and is the balance between them right?', appliesBecause: 'This lesson carries additional official provenance.', presentationDependent: false });
  }
  if (artifactSourceKind(s.source) === 'source_segment') {
    qs.push({ id: 'S5', area: 'source_fidelity', prompt: 'This chapter prints no numbered sections. Does the lesson represent its source pages accurately without implying a structure the book does not have?', appliesBecause: 'This lesson is backed by source segments rather than a numbered section.', presentationDependent: false });
  }
  if ((s.teacher?.teachingNotes ?? []).length > 0) {
    qs.push({ id: 'T1', area: 'teacher_material', prompt: 'Are the teacher notes accurate and genuinely useful to someone teaching this?', appliesBecause: 'This lesson carries teacher notes.', presentationDependent: false });
  }
  // Misconception feedback only where the lesson actually gives any.
  if (s.guidedPractice.some((g) => (g.rationale ?? '').trim().length > 0)) {
    qs.push({ id: 'X1', area: 'misconceptions', prompt: 'Where a student goes wrong, does the feedback point at the mathematical mistake rather than merely marking it wrong?', appliesBecause: 'This lesson gives feedback on guided practice.', presentationDependent: false });
  }
  return qs;
}

// ---------------------------------------------------------------------------
// The frozen candidate
// ---------------------------------------------------------------------------

export type ArtifactReviewCandidate = {
  reviewCode: string;
  contentArtifactId: string;
  contentArtifactVersion: number;
  semanticFingerprint: string;
  provenanceFingerprint: string;
  provenanceVersion: number;
  instrumentVersion: number;
  reviewBuildId: string;
  grade: string;
  officialChapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  lessonTitle: string;
  learningGoal: string;
  sourceDescription: string;
  sourceKind: string;
  questionCount: number;
  questions: ArtifactReviewQuestion[];
  /** Still `authored_draft`. Freezing a candidate reviews nothing. */
  lifecycleStatus: string;
};

export const SOURCE_PROVENANCE_VERSION_C9 = 1;

export function class9ReviewCandidates(reviewBuildId: string): ArtifactReviewCandidate[] {
  const catalogue = authoredLearnCatalogueForReview('class9');
  // The catalogue is eligibility-filtered for students; review must see every
  // authored artifact regardless of delivery gating, so chapters come from
  // the catalogue's structure and lessons from the registry.
  const authored = allAuthoredSections().filter((s) =>
    s.source.officialChapterId.startsWith('ncert_iemh')
  );
  const chapterOf = new Map(
    catalogue.chapters.map((c) => [c.officialChapterId, c] as const)
  );

  return authored.map((s) => {
    const ch = chapterOf.get(s.source.officialChapterId);
    const qs = questionsForArtifact(s);
    return {
      reviewCode: artifactReviewCode(s),
      contentArtifactId: s.contentArtifactId,
      contentArtifactVersion: s.contentArtifactVersion,
      semanticFingerprint: artifactSemanticFingerprint(s),
      provenanceFingerprint: artifactProvenanceFingerprint(s),
      provenanceVersion: SOURCE_PROVENANCE_VERSION_C9,
      instrumentVersion: CLASS9_INSTRUMENT_VERSION,
      reviewBuildId,
      grade: 'class9',
      officialChapterId: s.source.officialChapterId,
      chapterNumber: ch?.number ?? 0,
      chapterTitle: ch?.title ?? '',
      lessonTitle: ch?.lessons.find((l) => l.contentArtifactId === s.contentArtifactId)?.title ?? '',
      learningGoal: s.learningGoal,
      sourceDescription: reviewerSourceDescription(s),
      sourceKind: artifactSourceKind(s.source),
      questionCount: qs.length,
      questions: qs,
      lifecycleStatus: s.reviewStatus,
    };
  });
}
