// v0.49 §9 — Teacher chapter resource page.
//
// v0.48's Resources tab had one action per chapter, "Open lesson
// pages", which called `goLearn(firstSkill)`. That did two wrong
// things: it left TeacherShell entirely (LearnView rendered bare at
// App.tsx's top level), and it opened a single skill while implying
// the whole chapter.
//
// This component is the chapter resource page. It renders INSIDE the
// shell and reports what the chapter actually contains, counted from
// the real content modules — never asserted. Anything absent is shown
// as absent rather than omitted, so an incomplete chapter reads as
// incomplete instead of looking finished.

import { useMemo } from 'react';
import { PageHeader } from '../../design/primitives/PageHeader';
import { Card } from '../../design/primitives/Card';
import { StatusBadge } from '../../design/primitives/StatusBadge';
import { SecondaryButton } from '../../design/primitives/SecondaryButton';
import { ITEMS } from '../../data/items';
import { LESSONS, lessonFor } from '../../data/lessons';
import { SKILL_LABELS, type SkillId } from '../../types';
import { resolveChapter } from '../../curriculum/chapterResolver';
import { blueprintForChapter } from '../../curriculum/chapterBlueprints';

export type ChapterResourceRow = {
  skillId: SkillId;
  label: string;
  itemCount: number;
  /** True when a human authored the lesson; false when it is
   *  synthesised from the item bank at read time. The distinction
   *  matters to a teacher deciding whether to use it in class. */
  handAuthoredLesson: boolean;
  workedExampleCount: number;
  misconceptionCount: number;
  hasPrintable: boolean;
};

/** Count what a chapter really has. Pure, so the counts are testable
 *  and cannot drift from what the resource page claims. */
export function chapterResourceRows(skillIds: SkillId[]): ChapterResourceRow[] {
  return skillIds.map((skillId) => {
    const lesson = lessonFor(skillId);
    return {
      skillId,
      label: SKILL_LABELS[skillId] ?? skillId,
      itemCount: ITEMS.filter((it) => it.skillId === skillId).length,
      handAuthoredLesson: Boolean(
        (LESSONS as Record<string, unknown>)[skillId]
      ),
      workedExampleCount: lesson.workedExamples.length,
      misconceptionCount: lesson.commonMistakes.length,
      hasPrintable: Boolean(lesson.rich?.printableWorksheet),
    };
  });
}

export function TeacherResourceOutlet({
  chapterId,
  onBack,
  onOpenLesson,
}: {
  chapterId: string;
  onBack: () => void;
  /** Opens a single concept lesson — clearly labelled as one skill,
   *  never as "the chapter". */
  onOpenLesson: (skill: SkillId) => void;
}) {
  const resolved = useMemo(() => resolveChapter(chapterId), [chapterId]);

  if (!resolved) {
    return (
      <div className="space-y-4">
        <BackLink onBack={onBack} />
        <Card>
          <h2 className="text-sm font-semibold text-slate-900">
            Chapter not recognised
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            This chapter link does not match any record in Pragati.
          </p>
        </Card>
      </div>
    );
  }

  const skillIds = resolved.inventory.mapping.skillIds as SkillId[];
  const rows = chapterResourceRows(skillIds);
  const blueprint = blueprintForChapter(resolved.chapterId);
  const totalItems = rows.reduce((a, r) => a + r.itemCount, 0);
  const printables = rows.filter((r) => r.hasPrintable).length;
  const handAuthored = rows.filter((r) => r.handAuthoredLesson).length;

  return (
    <div className="space-y-4">
      <BackLink onBack={onBack} />

      <div className="flex flex-wrap items-start justify-between gap-2">
        <PageHeader
          eyebrow={`Class ${resolved.grade.replace('class', '')} · Resources`}
          title={resolved.displayTitle}
          subtitle={resolved.displaySubtitle}
        />
        <StatusBadge
          status={resolved.inventory.status}
          title={resolved.inventory.reasons.join(' ')}
        />
      </div>

      {/* CONTENT INVENTORY — what exists, stated plainly. */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-900">
          What this chapter contains
        </h3>
        <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          <Fact label="Skills mapped" value={`${skillIds.length}`} />
          <Fact label="Questions in the bank" value={`${totalItems}`} />
          <Fact
            label="Hand-authored lessons"
            value={`${handAuthored} of ${skillIds.length}`}
            note={
              handAuthored < skillIds.length
                ? 'The rest are generated from the question bank and have not been reviewed.'
                : undefined
            }
          />
          <Fact
            label="Printable worksheets"
            value={printables === 0 ? 'None yet' : `${printables}`}
          />
          <Fact
            label="Chapter check"
            value={blueprint ? 'Available' : 'Not authored yet'}
            note={
              blueprint
                ? `${blueprint.targetItemCount} questions across ${blueprint.requiredSkillIds.length} required skills.`
                : 'Students see practice only for this chapter.'
            }
          />
          <Fact
            label="Curriculum verification"
            value={
              resolved.officialRecord.verificationStatus === 'unverified'
                ? 'Not verified against a source'
                : resolved.officialRecord.verificationStatus.replace('_', ' ')
            }
            note={
              resolved.officialRecord.verificationStatus === 'unverified'
                ? 'No authoritative NCERT/CBSE source has been recorded for this chapter yet.'
                : undefined
            }
          />
        </dl>
      </Card>

      {/* PER-SKILL DETAIL — one row per skill, each honest about what
          it has. Opening a lesson is explicitly one skill. */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-900">Lesson pages</h3>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">
            No skills are mapped to this chapter yet, so there are no lesson
            pages to open.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-slate-100">
            {rows.map((r) => (
              <li
                key={r.skillId}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900">
                    {r.label}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {r.itemCount} question{r.itemCount === 1 ? '' : 's'} ·{' '}
                    {r.workedExampleCount} worked example
                    {r.workedExampleCount === 1 ? '' : 's'} ·{' '}
                    {r.misconceptionCount} misconception
                    {r.misconceptionCount === 1 ? '' : 's'}
                    {r.handAuthoredLesson ? '' : ' · generated lesson'}
                    {r.hasPrintable ? ' · printable' : ''}
                  </div>
                </div>
                <SecondaryButton onClick={() => onOpenLesson(r.skillId)}>
                  Open this lesson
                </SecondaryButton>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="min-h-[44px] text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      ← All chapters
    </button>
  );
}

function Fact({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-semibold text-slate-900">{value}</dd>
      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
    </div>
  );
}
