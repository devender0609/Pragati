// v0.61 §11 — THE ADMIN CONTENT ROADMAP, at section level.
//
// WHAT THIS SCREEN REFUSES TO DO
//
// It shows COUNTS, never a completeness percentage. "5 of 9 sections
// mapped" is a true statement about mapping. "56% complete" would be a
// false statement about content: a mapped section may have no lesson,
// no visuals and no reviewed practice. Mapping coverage, instructional
// completeness and review completeness are three different questions,
// and conflating them is how a product comes to believe it has a
// curriculum.
//
// For grades with no primary-verified official unit list, it shows
// "official denominator unknown" rather than any number at all.

import { useState } from 'react';
import {
  CLASS6_OFFICIAL_SECTIONS,
  sectionsForChapter,
  sectionCoverageForChapter,
  type OfficialSectionRecord,
} from '../../curriculum/officialSections';
import {
  OFFICIAL_CHAPTERS,
  GANITA_PRAKASH_C6_SOURCE,
} from '../../curriculum/officialChapters';
import {
  grandfatheringReport,
  grandfatheredClass6Lessons,
} from '../../curriculum/grandfatheredLessons';
import {
  completenessForAllGrades,
  DENOMINATOR_PROBLEM_TEXT,
} from '../../curriculum/completenessRecord';

type Filter =
  | 'all'
  | 'unmapped'
  | 'competency_pending'
  | 'no_educator_review';

const FILTER_LABEL: Record<Filter, string> = {
  all: 'All sections',
  unmapped: 'Unmapped official sections',
  competency_pending: 'Competency mapping pending',
  no_educator_review: 'Mapping not educator-reviewed',
};

function matches(s: OfficialSectionRecord, f: Filter): boolean {
  switch (f) {
    case 'all':
      return true;
    case 'unmapped':
      return s.mappingType === 'unmapped';
    case 'competency_pending':
      return s.competencyMappingStatus === 'competency_mapping_pending';
    case 'no_educator_review':
      return s.mappingReviewStatus !== 'educator_reviewed';
  }
}

function Pill({
  tone,
  children,
}: {
  tone: 'ok' | 'partial' | 'none';
  children: React.ReactNode;
}) {
  const cls =
    tone === 'ok'
      ? 'bg-emerald-100 text-emerald-800'
      : tone === 'partial'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-slate-100 text-slate-600';
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

export function ContentRoadmap({
  onOpenDemonstration,
}: {
  onOpenDemonstration?: () => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [openChapter, setOpenChapter] = useState<string | null>(
    'ncert_gp_c6_ch07_fractions'
  );

  const class6Chapters = OFFICIAL_CHAPTERS.filter((c) => c.grade === 'class6');
  const grades = completenessForAllGrades();
  const unverified = grades.filter((g) => !g.primaryVerified);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold text-slate-900">
          Content roadmap — Class 6 Mathematics
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {GANITA_PRAKASH_C6_SOURCE.textbookTitle},{' '}
          {GANITA_PRAKASH_C6_SOURCE.edition} · {CLASS6_OFFICIAL_SECTIONS.length}{' '}
          official sections across {class6Chapters.length} chapters ·
          primary source inspected {GANITA_PRAKASH_C6_SOURCE.inspectionDate}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Mapping coverage is not instructional completeness. A mapped
          section may still have no lesson, no visuals and no reviewed
          practice.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABEL) as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`min-h-11 rounded-lg px-3 text-sm font-medium ${
              filter === f
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {FILTER_LABEL[f]}
          </button>
        ))}
      </div>

      {onOpenDemonstration && (
        <button
          type="button"
          onClick={onOpenDemonstration}
          className="min-h-11 w-full rounded-lg border border-amber-300 bg-amber-50 px-4 text-left text-sm"
        >
          <span className="font-semibold text-amber-900">
            Open the Section 7.4 reviewer preview →
          </span>
          <span className="mt-0.5 block text-amber-800">
            Authored draft. Not published, not visible to students.
          </span>
        </button>
      )}

      <div className="space-y-3">
        {class6Chapters.map((ch) => {
          const cov = sectionCoverageForChapter(ch.officialChapterId);
          const rows = sectionsForChapter(ch.officialChapterId).filter((s) =>
            matches(s, filter)
          );
          const isOpen = openChapter === ch.officialChapterId;
          if (rows.length === 0 && filter !== 'all') return null;

          return (
            <div
              key={ch.officialChapterId}
              className="rounded-lg border border-slate-200"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenChapter(isOpen ? null : ch.officialChapterId)
                }
                className="flex min-h-11 w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {ch.officialChapterNumber}. {ch.officialTitle}
                </span>
                <span className="text-xs text-slate-600">
                  {cov.officialSections} sections ·{' '}
                  {cov.mappedSections + cov.partiallyMappedSections} with
                  content · {cov.unmappedSections} unmapped ·{' '}
                  {cov.educatorReviewedMappings} educator-reviewed
                </span>
              </button>

              {isOpen && (
                // v0.68 §19 — visual QA found this table pushing the
                // whole document 92px wide at 390px, so every screen in
                // Admin scrolled sideways. Pre-existing, and caught only
                // because v0.68 measured document overflow rather than
                // eyeballing screenshots.
                <div className="overflow-x-auto border-t border-slate-200">
                  <table className="w-full min-w-[480px] text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2">Section</th>
                        <th className="px-3 py-2">Mapping</th>
                        <th className="px-3 py-2">Competency</th>
                        <th className="px-3 py-2">Pragati skills</th>
                        <th className="px-3 py-2">Educator review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((s) => (
                        <tr
                          key={s.officialSectionId}
                          className="border-t border-slate-100"
                        >
                          <td className="px-3 py-2">
                            <span className="font-medium text-slate-900">
                              {s.sectionNumber}
                            </span>{' '}
                            {s.exactTitle}
                            <span className="block text-slate-400">
                              p. {s.startPage}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <Pill
                              tone={
                                s.mappingType === 'exact'
                                  ? 'ok'
                                  : s.mappingType === 'unmapped'
                                    ? 'none'
                                    : 'partial'
                              }
                            >
                              {s.mappingType}
                            </Pill>
                          </td>
                          <td className="px-3 py-2">
                            <Pill
                              tone={
                                s.competencyMappingStatus ===
                                'competency_educator_reviewed'
                                  ? 'ok'
                                  : s.competencyMappingStatus ===
                                      'competency_proposed'
                                    ? 'partial'
                                    : 'none'
                              }
                            >
                              {s.competencyMappingStatus.replace(
                                'competency_',
                                ''
                              )}
                            </Pill>
                            {s.mappedCompetencyIds.length > 0 && (
                              <span className="mt-1 block text-slate-500">
                                {s.mappedCompetencyIds.join(', ')}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-slate-700">
                            {s.pragatiSkillIds.length > 0
                              ? s.pragatiSkillIds.join(', ')
                              : '—'}
                          </td>
                          <td className="px-3 py-2">
                            <Pill
                              tone={
                                s.mappingReviewStatus === 'educator_reviewed'
                                  ? 'ok'
                                  : 'none'
                              }
                            >
                              {s.mappingReviewStatus.replace(/_/g, ' ')}
                            </Pill>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* v0.64 §13 — grandfathering is temporary; this is the list of
          what still owes a section check. */}
      {(() => {
        const gf = grandfatheringReport();
        return (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h3 className="text-sm font-semibold text-amber-900">
              Grandfathered Class 6 lessons awaiting section verification
            </h3>
            <p className="mt-1 text-sm text-amber-800">{gf.summary}</p>
            <p className="mt-2 text-xs text-amber-700">
              not_section_verified: {gf.notSectionVerified} ·
              section_candidate: {gf.sectionCandidate} · section_verified:{' '}
              {gf.sectionVerified}
            </p>
            <ul className="mt-3 space-y-1 text-xs text-amber-900">
              {grandfatheredClass6Lessons()
                .filter((r) => r.status !== 'section_verified')
                .slice(0, 12)
                .map((r) => (
                  <li key={r.skillId}>
                    <span className="font-medium">{r.skillId}</span>{' '}
                    {r.conceptName} — {r.status}
                    {r.candidateSectionId
                      ? ` → ${r.candidateSectionId}`
                      : ''}
                  </li>
                ))}
            </ul>
          </section>
        );
      })()}

      <section>
        <h3 className="text-sm font-semibold text-slate-900">
          Other grades
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          No completeness figure can be shown for these. The number of
          official units is unknown, so there is no denominator.
        </p>
        <ul className="mt-2 space-y-1 text-xs text-slate-600">
          {unverified.map((g) => (
            <li key={g.grade} className="flex gap-2">
              <span className="w-20 font-medium text-slate-800">
                Class {g.grade.replace('class', '')}
              </span>
              <span>
                official denominator unknown —{' '}
                {g.denominatorProblem
                  ? DENOMINATOR_PROBLEM_TEXT[g.denominatorProblem]
                  : ''}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
