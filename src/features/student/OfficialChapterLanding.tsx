// v0.64 §5/§6/§7 — THE OFFICIAL CHAPTER EXPERIENCE.
//
// THE INVARIANT THIS ENFORCES
//
//   LEGACY MODULE != OFFICIAL CHAPTER
//
// Until now the chapter card was official and the chapter INTERIOR was
// not: opening Chapter 7 resolved to `primaryLegacyModuleId` and handed
// the student to `ChapterLandingPage(moduleId)`, which structured the
// screen around the module's nine skills and reported "0 of 9 skills
// strong". So the official curriculum was navigation chrome wrapped
// around a module experience — and the number nine came from Pragati's
// module, not from the book, which happens to have nine Fractions
// sections for entirely unrelated reasons.
//
// Here the structure comes from the verified section registry. Legacy
// modules may still SUPPLY the content behind an eligible section, but
// they no longer define what the child sees.
//
// REUSABLE, NOT FRACTIONS-SPECIAL. It takes an officialChapterId and
// renders honestly for any verified chapter, including ones where every
// section is unavailable.

import {
  openableSectionTarget,
  relatedPracticeForChapter,
} from '../../curriculum/sectionRouting';
import { nextActionForChapter } from '../../curriculum/nextAction';
import { ChapterMotif, chapterAccent, motifForChapter } from '../../design/ChapterMotif';
// v0.71 §8 — `SectionDots` removed from this header: filled/unfilled
// circles are the convention for COMPLETION, and they were showing
// AVAILABILITY. The component is still used on Home, where the states
// it renders really are recorded progress.
import { ChapterHeroArt, type SectionDotState } from '../../design/StudentHomeBlocks';
import { useMemo } from 'react';
import { OFFICIAL_CHAPTERS } from '../../curriculum/officialChapters';
import { sectionsForChapter } from '../../curriculum/officialSections';
import { sectionEligibility } from '../../curriculum/eligibilityPolicy';
import {
  sectionProgressForChapter,
  type SectionProgress,
} from '../../curriculum/sectionProgress';
import { loadSessions } from '../../lib/storage';

/** Student-facing wording for a factual activity state. Never
 *  "Strong", "Mastered" or "Proficient" — none of those is defined. */
// v0.71 §9 — no longer used HERE. The official journey shows the
// textbook sequence and its availability; per-section progress labels
// live on the Progress tab, where progress is what is being reported.

export type OfficialSectionRow = {
  officialSectionId: string;
  sectionNumber: string;
  title: string;
  /** What the student can do here, in plain words. */
  action: 'Learn' | 'Practice' | 'Not available yet';
  progress: SectionProgress;
  /**
   * v0.70 §27 — WHAT the content behind this section actually is.
   *
   * `legacy_skill_content` means a lesson authored against Pragati's
   * internal skill codes before the official-section model existed. It
   * is real, usable content. It has NOT been verified against this
   * section of Ganita Prakash and no educator has reviewed it, so
   * presenting it as this section's lesson would overclaim.
   *
   * Null when the section is unavailable.
   */
  provenance: 'official_section_content' | 'legacy_skill_content' | null;
};

export function officialChapterRows(
  officialChapterId: string,
  studentId: string
): OfficialSectionRow[] {
  const sessions = loadSessions().filter((s) => s.studentId === studentId);
  const progress = sectionProgressForChapter(officialChapterId, sessions);
  const byId = new Map(progress.map((p) => [p.officialSectionId, p]));

  return sectionsForChapter(officialChapterId).map((s) => {
    const e = sectionEligibility(s.officialSectionId);
    return {
      officialSectionId: s.officialSectionId,
      sectionNumber: s.sectionNumber,
      title: s.exactTitle,
      provenance: openableSectionTarget(s.officialSectionId)?.provenance ?? null,
      action:
        e.availability === 'learn_available'
          ? 'Learn'
          : e.availability === 'practice_available'
            ? 'Practice'
            : 'Not available yet',
      progress: byId.get(s.officialSectionId)!,
    };
  });
}

export function OfficialChapterLanding({
  officialChapterId,
  studentId,
  onBack,
  onOpenSection,
}: {
  officialChapterId: string;
  studentId: string;
  onBack: () => void;
  onOpenSection: (officialSectionId: string) => void;
}) {
  const chapter = OFFICIAL_CHAPTERS.find(
    (c) => c.officialChapterId === officialChapterId
  );
  const rows = useMemo(
    () => officialChapterRows(officialChapterId, studentId),
    [officialChapterId, studentId]
  );

  // v0.70 §27 — "open" now means a tap goes SOMEWHERE. Before this,
  // four parts counted as open and routed nowhere.
  const openable = rows.filter(
    (r) => r.action !== 'Not available yet' && r.provenance !== null
  );

  // v0.72 §15 — the next action is no longer computed here. Four
  // surfaces each had their own version and they disagreed; there is
  // now one selector, `nextActionForChapter`.

  const accent = chapterAccent(chapter?.officialChapterNumber ?? 1);
  const motif = motifForChapter(officialChapterId);

  // §12 — one dot per official part. `upcoming` means Pragati has no
  // content for it, which is a fact about Pragati and not about the
  // student, so it is drawn dashed rather than as an unmet goal.
  const related = relatedPracticeForChapter(rows);
  const nextAction = nextActionForChapter(officialChapterId, loadSessions());

  const dotStates: SectionDotState[] = rows.map((r) =>
    r.action === 'Not available yet' || r.provenance === null
      ? 'upcoming'
      : r.progress.state === 'practice_completed'
        ? 'practised'
        : r.progress.state === 'in_progress'
          ? 'in_progress'
          : 'not_started'
  );

  return (
    // v0.69 §6 — this is the chapter page a student ACTUALLY reaches
    // from the Learn tab. The v0.68 version was an h1 above a stack of
    // white boxes with grey dashed ones interleaved.
    <div className="space-y-4 pb-6">
      <button
        type="button"
        onClick={onBack}
        className="tap -ml-1 inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13 4 7 10l6 6" />
        </svg>
        All chapters
      </button>

      {/* §7/§16 — the chapter header carries its own artwork and its
          own colour, and states progress factually underneath. */}
      <header
        className="relative overflow-hidden rounded-xl3 p-5 text-white shadow-card"
        style={{ background: `linear-gradient(135deg, ${accent}, #6d28d9)` }}
      >
        <ChapterHeroArt motif={motif} />
        <div className="relative">
          {chapter?.officialChapterNumber ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
              Chapter {chapter.officialChapterNumber}
            </p>
          ) : null}
          <h1 className="mt-0.5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {chapter?.officialTitle ?? 'Chapter'}
          </h1>
          {/* v0.71 §8 — THE DOTS ARE GONE FROM THIS HEADER.
              They showed AVAILABILITY — which parts Pragati has content
              for — using filled and unfilled circles, the universal
              convention for completion. A student looking at "●●○○○"
              beside "9 parts" reads it as progress through the chapter,
              and it was nothing of the sort: it was a statement about
              what Pragati has written.
              Availability is not progress. It is now stated in words,
              and progress lives on the Progress tab where it is
              measured. */}
          <p className="mt-3 text-sm leading-relaxed text-white/85">
            {rows.length} parts in this chapter.
            {related.length > 0
              ? ` ${related.length} related practice ${
                  related.length === 1 ? 'activity is' : 'activities are'
                } available now.`
              : ' None are ready to open yet.'}
          </p>
        </div>
      </header>

      {/* v0.72 §13/§15 — "START NEXT · 7.2 Fractional Units as Parts of a
          Whole" is gone.
          It named an OFFICIAL SECTION whose own row, six lines below,
          said Coming soon. What actually opened was legacy related
          practice. Both statements were true of different things, and
          the student read the one on the button.
          The next action now comes from the single canonical selector,
          which returns the KIND explicitly. A related-practice action
          carries no section number and says what it is. */}
      {nextAction.kind !== 'none' && (
        <button
          type="button"
          onClick={() =>
            nextAction.activityId && onOpenSection(nextAction.activityId)
          }
          className="tap group flex w-full items-center gap-3 rounded-xl3 border-2 border-practice-200 bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold uppercase tracking-wide text-practice-700">
              {nextAction.kind === 'related_legacy_practice'
                ? 'Practice you can do now'
                : `${nextAction.verb} next`}
            </span>
            <span className="mt-0.5 block font-display text-lg font-bold leading-snug text-slate-900">
              {nextAction.label}
            </span>
            {nextAction.qualifier && (
              <span className="mt-0.5 block text-xs text-slate-500">
                {nextAction.qualifier}
              </span>
            )}
          </span>
          <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-practice-500 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 4l6 6-6 6" />
          </svg>
        </button>
      )}

      {/* §37 — a polished empty state, not a dead grey box. It keeps the
          chapter's own motif so the screen still reads as this chapter,
          and it stays truthful about why there is nothing here. */}
      {openable.length === 0 && (
        <div className="rounded-xl3 border border-slate-200 bg-white p-6 text-center">
          <span
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl2"
            style={{ color: accent, backgroundColor: `${accent}14` }}
          >
            <ChapterMotif motif={motif} className="h-8 w-8" />
          </span>
          <p className="mt-3 font-display text-base font-bold text-slate-900">
            Not ready yet
          </p>
          <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-slate-500">
            This chapter is still being written. Every part of it is listed
            below, so you can see what is coming.
          </p>
        </div>
      )}

      {/* v0.73 §19 — desktop composition. At `lg` the official journey
          holds the main column and related practice becomes a
          supporting column, which also reinforces the separation §9
          established: the textbook sequence is the page, and legacy
          practice sits beside it rather than in it. Below `lg` the
          order is unchanged. */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6">
      <div className="min-w-0">
      {/* §7 — the parts as a connected journey.
          The v0.69 version was a numbered rail beside nine identical
          white cards, which is a list with a line drawn next to it. The
          nodes now carry STATE (open / started / practised / upcoming),
          open parts get a real action row, and upcoming parts collapse
          to a single quiet line — so the eye moves down the sequence
          instead of scanning nine equal blocks.

          The path represents the OFFICIAL SEQUENCE, not mastery. A
          filled node means a practice session was finished, never that
          the student learned it. */}
      <ol className="relative space-y-2 pl-9">
        <span
          className="absolute bottom-5 left-[17px] top-5 w-0.5 rounded bg-slate-200"
          aria-hidden="true"
        />
        {rows.map((r, i) => {
          const open = r.action !== 'Not available yet' && r.provenance !== null;
          const state = dotStates[i];
          const nodeClass =
            state === 'practised'
              ? 'border-practice-600 bg-practice-600 text-white'
              : state === 'in_progress'
                ? 'border-practice-500 bg-white text-practice-700'
                : open
                  ? 'border-slate-300 bg-white text-slate-500'
                  : 'border-dashed border-slate-300 bg-white text-slate-300';
          return (
            <li key={r.officialSectionId} className="relative">
              <span
                className={`absolute -left-9 top-3.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border-2 text-xs font-bold ${nodeClass}`}
                aria-hidden="true"
              >
                {state === 'practised' ? (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 10.5 8.2 14 15.5 6.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              {/* v0.71 §9 — EVERY OFFICIAL PART IS SHOWN THE SAME WAY.
                  v0.70 rendered four of these nine as tappable "Practise
                  →" rows, because legacy skill lessons happened to map
                  to them. That put related practice INSIDE the official
                  chapter sequence, which is precisely what makes a
                  student believe Pragati teaches §7.2 of their textbook.
                  It does not: those nine authored drafts exist and are
                  correctly unpublished.
                  The journey now means the journey. Related practice is
                  a separate section below, with plain names. */}
              <div className="rounded-xl2 border border-slate-200 bg-white/70 px-4 py-3">
                <p className="text-[0.7rem] font-bold uppercase tracking-wide text-slate-400">
                  {r.sectionNumber}
                </p>
                <p className="mt-0.5 font-semibold leading-snug text-slate-700">
                  {r.title}
                </p>
                <p className="mt-1 text-sm text-slate-400">Coming soon</p>
              </div>
            </li>
          );
        })}
      </ol>
      </div>

      <div className="min-w-0 lg:sticky lg:top-4">
      {/* §9 — RELATED PRACTICE, clearly separate and clearly labelled.
          Real, usable content. Not this chapter's lessons: authored
          against the superseded 14-chapter book, keyed by internal skill
          codes, never verified against Ganita Prakash, never
          educator-reviewed. The heading says so in words a student can
          read, and no skill code appears anywhere. */}
      {related.length > 0 && (
        <section className="rounded-xl3 border border-practice-200 bg-practice-50/60 p-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-practice-700">
            Practice you can do now
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            These are extra practice activities on fractions. They are not the
            chapter lessons above — those are still being written.
          </p>
          <ul className="mt-3 space-y-2">
            {related.map((a) => (
              <li key={a.officialSectionId}>
                <button
                  type="button"
                  onClick={() => onOpenSection(a.officialSectionId)}
                  className="tap group flex w-full items-center gap-3 rounded-xl2 bg-white px-4 py-3 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <span className="min-w-0 flex-1 font-semibold leading-snug text-slate-900">
                    {a.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-practice-700">
                    Practise
                    <svg viewBox="0 0 20 20" className="h-4 w-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 4l6 6-6 6" />
                    </svg>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      </div>
      </div>
    </div>
  );
}
