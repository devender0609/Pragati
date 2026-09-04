// v0.67 §12/§13 — CHAPTER-LEVEL REVIEWER PREVIEW.
//
// Lets a reviewer walk all nine Fractions sections end to end. It
// REUSES the student instructional component tree (`LearnSectionView`,
// `PracticeItemView`) rather than rendering a parallel demo — a
// reviewer must judge what a student would actually get, not an
// approximation of it.
//
// Governance labels are allowed here. This is Admin, never student UI.

import { useState } from 'react';
import { fractionsChapterSections } from '../../curriculum/fractionsChapter';
import { qualityRowFor } from '../../curriculum/chapterQuality';
import { decisionFor } from '../../curriculum/interactionDecisions';
import { boundaryFor } from '../../curriculum/fractionsBoundaries';
import { ChapterQualitySummary } from './ChapterQualitySummary';
import {
  addReviewNote,
  deleteReviewNote,
  exportReviewNotes,
  reviewNotesFor,
  reviewNoteCounts,
  REVIEW_NOTE_CATEGORIES,
  REVIEW_NOTE_CATEGORY_LABEL,
  type ReviewNoteCategory,
} from './reviewNotes';
import { LearnSectionView } from '../learn/LearnSectionView';
import { PracticeItemView } from '../learn/PracticeItemView';
import { misconceptionsForSection } from '../../curriculum/fractionsMisconceptions';
import type { AuthoredSection } from '../../curriculum/authoredSection';

// v0.68 §12 — scratch notes for whoever is walking the chapter.
// Local, draft, and structurally incapable of authorising anything.
function ReviewNotesPanel({ officialSectionId }: { officialSectionId: string }) {
  const [notes, setNotes] = useState(() => reviewNotesFor(officialSectionId));
  const [category, setCategory] = useState<ReviewNoteCategory>('mathematical');
  const [text, setText] = useState('');

  const add = () => {
    if (!addReviewNote(officialSectionId, category, text)) return;
    setNotes(reviewNotesFor(officialSectionId));
    setText('');
  };

  return (
    <div className="mx-auto mt-8 max-w-3xl px-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Reviewer notes (draft)
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Informal notes for this walkthrough. These are not educator-review
        evidence and cannot make any section publishable.
      </p>

      <div className="mt-3 space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor={`cat-${officialSectionId}`}>
          Category
        </label>
        <select
          id={`cat-${officialSectionId}`}
          value={category}
          onChange={(e) => setCategory(e.target.value as ReviewNoteCategory)}
          className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
        >
          {REVIEW_NOTE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {REVIEW_NOTE_CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
        <label className="block text-sm font-medium text-slate-700" htmlFor={`note-${officialSectionId}`}>
          Note
        </label>
        <textarea
          id={`note-${officialSectionId}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
          placeholder="What did you notice?"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={add}
            disabled={text.trim() === ''}
            className="min-h-11 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white disabled:opacity-40"
          >
            Add note
          </button>
          <button
            type="button"
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log(exportReviewNotes());
            }}
            className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm"
          >
            Export all notes
          </button>
        </div>
      </div>

      {notes.length > 0 && (
        <ul className="mt-4 space-y-2">
          {notes.map((n) => (
            <li
              key={n.id}
              className="rounded-lg border border-slate-200 p-3 text-sm"
            >
              <p className="text-xs font-medium text-slate-500">
                {REVIEW_NOTE_CATEGORY_LABEL[n.category]}
              </p>
              <p className="mt-1 text-slate-800">{n.text}</p>
              <button
                type="button"
                onClick={() => {
                  deleteReviewNote(n.id);
                  setNotes(reviewNotesFor(officialSectionId));
                }}
                className="mt-2 min-h-11 text-xs font-medium text-slate-500"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// v0.68 §5/§8 — the decisions a reviewer should be able to disagree
// with, shown next to the content they govern.
function SectionContextPanel({ section }: { section: AuthoredSection }) {
  const id = section.source.officialSectionId;
  const decision = decisionFor(id);
  const boundary = boundaryFor(id);
  const quality = qualityRowFor(id);

  return (
    <div className="mx-auto mt-8 max-w-3xl px-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Authoring decisions (for review)
      </h2>

      {decision && (
        <div className="mt-3 rounded-lg border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-900">
            Interaction: {decision.decision.replace(/_/g, ' ')}
            {decision.formats.length > 0
              ? ` · ${decision.formats.map((f) => f.replace(/_/g, ' ')).join(', ')}`
              : ''}
          </p>
          <p className="mt-1 text-sm text-slate-600">{decision.rationale}</p>
        </div>
      )}

      {boundary && (
        <div className="mt-3 rounded-lg border border-slate-200 p-3 text-sm">
          <p className="font-medium text-slate-900">Concept boundary</p>
          <p className="mt-1 text-slate-600">
            <span className="font-medium">May assume: </span>
            {boundary.mayAssume.join('; ')}
          </p>
          <p className="mt-1 text-slate-600">
            <span className="font-medium">Teach here: </span>
            {boundary.teachHere.join('; ')}
          </p>
          <p className="mt-1 text-slate-600">
            <span className="font-medium">Defer: </span>
            {boundary.deferTo.length === 0
              ? 'nothing — this section closes the chapter'
              : boundary.deferTo
                  .map((d) => `${d.concept} (${d.belongsToSection})`)
                  .join('; ')}
          </p>
        </div>
      )}

      {quality && quality.auditFindings.length > 0 && (
        <div className="mt-3 rounded-lg border border-slate-200 p-3 text-sm">
          <p className="font-medium text-slate-900">
            v0.68 audit findings for this part
          </p>
          <ul className="mt-2 space-y-2">
            {quality.auditFindings.map((f) => (
              <li key={f.id}>
                <span className="font-medium text-slate-800">
                  {f.id} — {f.verdict.replace(/_/g, ' ')}
                </span>
                <span className="block text-slate-600">{f.finding}</span>
                <span className="block text-slate-500">{f.action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SectionBody({ section }: { section: AuthoredSection }) {
  const misconceptions = misconceptionsForSection(
    section.source.officialSectionId
  );

  return (
    <div>
      <div className="border-b border-amber-300 bg-amber-50 px-4 py-3">
        <p className="text-sm font-semibold text-amber-900">
          Reviewer preview — status: {section.reviewStatus}
        </p>
        <p className="mt-1 text-xs text-amber-800">
          {section.contentArtifactId} v{section.contentArtifactVersion} ·{' '}
          {section.source.textbook} · page {section.source.startPage} ·
          not visible to students
        </p>
      </div>

      <div className="pt-6">
        <LearnSectionView
          content={{
            officialReference: `${section.source.sectionNumber} · ${section.source.exactTitle}`,
            learningGoal: section.learningGoal,
            prerequisiteCheck: section.priorKnowledgeCheck,
            explanation: section.explanation,
            visuals: section.visuals,
            workedExamples: section.workedExamples,
            misconceptions: misconceptions.map((m) => ({
              id: m.id,
              misconception: m.description,
              studentFeedback: m.feedback,
            })),
            guidedPractice: section.guidedPractice,
            independentPractice: section.independentPractice,
            reasoningApplication: section.reasoningApplication,
            summary: section.summary,
            nextStep: section.nextStep,
          }}
          visualsById={section.visualsById}
        />
      </div>

      {section.interactivePractice.length > 0 && (
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Practice (for review) — try the interactions
          </h2>
          <div className="mt-3 space-y-4">
            {section.interactivePractice.map((item) => (
              <PracticeItemView key={item.itemId} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto mt-8 max-w-3xl px-4 pb-12">
        <h2 className="text-lg font-semibold text-slate-900">
          Teacher notes (for review)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {section.teacher.objective}
        </p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {section.teacher.teachingNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
        {section.teacher.materialsNeeded.length > 0 && (
          <p className="mt-3 text-sm text-slate-600">
            <span className="font-medium">Materials: </span>
            {section.teacher.materialsNeeded.join(', ')}
          </p>
        )}
      </div>

      <SectionContextPanel section={section} />
      <ReviewNotesPanel officialSectionId={section.source.officialSectionId} />
      <div className="pb-12" />
    </div>
  );
}

export function ChapterReviewPreview({ onBack }: { onBack: () => void }) {
  const sections = fractionsChapterSections();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const noteCounts = reviewNoteCounts();

  if (openIndex !== null) {
    const section = sections[openIndex];
    return (
      <div className="pb-16">
        <div className="border-b border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="min-h-11 text-sm font-medium text-slate-700"
          >
            ← All parts of Chapter 7
          </button>
        </div>
        <SectionBody section={section} />
        <div className="mx-auto flex max-w-3xl justify-between gap-3 px-4">
          <button
            type="button"
            disabled={openIndex === 0}
            onClick={() => setOpenIndex(openIndex - 1)}
            className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm disabled:opacity-40"
          >
            ← Previous part
          </button>
          <button
            type="button"
            disabled={openIndex === sections.length - 1}
            onClick={() => setOpenIndex(openIndex + 1)}
            className="min-h-11 rounded-lg bg-slate-900 px-4 text-sm text-white disabled:opacity-40"
          >
            Next part →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="min-h-11 text-sm font-medium text-slate-600"
      >
        ← Back to Curriculum &amp; Readiness
      </button>

      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Chapter 7 — Fractions (draft review)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {sections.length} official parts · {sections.filter((s) => s.reviewStatus === 'authored_draft').length} authored drafts ·{' '}
          {sections.filter((s) => s.reviewStatus === 'educator_reviewed').length} educator-reviewed ·{' '}
          {sections.filter((s) => s.reviewStatus === 'published').length} published
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Draft content. Not visible to students and not assignable.
        </p>
      </header>

      <ChapterQualitySummary />

      <h3 className="pt-2 text-sm font-semibold text-slate-900">
        Walk the chapter
      </h3>

      <ol className="space-y-2">
        {sections.map((s, i) => (
          <li key={s.source.officialSectionId}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="min-h-11 w-full rounded-lg border border-slate-200 p-3 text-left hover:border-brand-400"
            >
              <span className="text-sm text-slate-500">
                {s.source.sectionNumber}
              </span>
              <span className="ml-2 text-sm font-medium text-slate-900">
                {s.source.exactTitle}
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                {s.reviewStatus} · {s.workedExamples.length} worked examples ·{' '}
                {s.guidedPractice.length + s.independentPractice.length} practice ·{' '}
                {s.visuals.length} visuals
                {s.interactivePractice.length > 0
                  ? ` · ${s.interactivePractice.length} interactive`
                  : ''}
                {noteCounts[s.source.officialSectionId]
                  ? ` · ${noteCounts[s.source.officialSectionId]} draft notes`
                  : ''}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
