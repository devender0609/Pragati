import {
  deleteAssignment,
  endAssignment,
  loadAssignments,
} from '../lib/storage';
import { ASSIGNMENT_TARGET_LABELS } from '../types';
import { formatDate } from '../lib/format';
import { TeacherStat } from '../design/TeacherKit';
import { SkillChip } from './common/SkillChip';
import { publishClassroomAssignmentsToCode } from '../lib/accessCodes';
import { class6ChapterCards } from '../curriculum/studentChapterModel';
import { officialChapterLearnState } from '../curriculum/eligibilityPolicy';

// ===========================================================================
// v0.78 §9/§10/§12 — ASSIGN LEARNING.
//
// WHAT THIS SCREEN USED TO BE
//
// "Assign assessments — create focused student-facing assessment cards."
// Its own comment described it as v0.11 assessment-assignment behaviour,
// unchanged. That model predates everything Pragati now knows: it has no
// notion of official curriculum, no notion of the difference between an
// official lesson and related legacy practice, and it calls every one of
// them an assessment.
//
// THE FOUR THINGS A TEACHER CAN ASSIGN, AND WHY THEY ARE NOT ONE THING
//
//   OFFICIAL LEARN       a lesson for a section of the current textbook.
//                        Requires a reviewed, student-eligible official
//                        artifact. Pragati currently has NONE — nine
//                        Fractions drafts, none reviewed — and this
//                        screen says so rather than offering one.
//   RELATED PRACTICE     older Pragati activities that practise the same
//                        mathematics. Real, assignable, and never
//                        described as the chapter's lesson.
//   INSTRUCTIONAL CHECK  ordinary classroom evidence. A teacher's own
//                        check on what a class can do.
//   PRAGATI GROWTH       the formal governed instrument. Frozen, and
//                        deliberately NOT offered here: letting an
//                        ordinary check inherit Growth's vocabulary is
//                        how "mastery" and "ability" claims get made by
//                        accident.
//
// §10 — availability comes from `officialChapterLearnState`, the same
// policy the student product reads. If nothing official is assignable
// the screen states it; it does not invent a sample assignment to look
// populated.
// ===========================================================================
/**
 * §10 — what is actually assignable, by type, from the canonical policy.
 *
 * This is the part the old screen had no concept of. It reads
 * `officialChapterLearnState` for every Class 6 chapter — the same
 * function the student Home and Learn read — so a teacher and a student
 * cannot be told different things about the same chapter.
 */
function AssignableWork() {
  const chapters = class6ChapterCards().map((c) => ({
    ...c,
    state: officialChapterLearnState(c.officialChapterId),
  }));
  const officialLearn = chapters.filter(
    (c) => c.state === 'official_learn_available'
  );
  const practice = chapters.filter(
    (c) => c.state === 'related_practice_available'
  );
  const preparing = chapters.filter(
    (c) => c.state === 'official_lessons_preparing'
  );

  const Row = ({
    title,
    detail,
    items,
    tone,
  }: {
    title: string;
    detail: string;
    items: string[];
    tone: string;
  }) => (
    <div className="border-t border-ink-100 py-4 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className={`font-display text-base font-bold ${tone}`}>{title}</p>
        <p className="num text-sm text-ink-400">
          {items.length === 0 ? 'none available' : `${items.length} available`}
        </p>
      </div>
      <p className="mt-1 max-w-[70ch] text-sm leading-relaxed text-ink-500">
        {detail}
      </p>
      {items.length > 0 && (
        <p className="mt-2 text-sm font-medium text-ink-700">
          {items.join(' · ')}
        </p>
      )}
    </div>
  );

  // v0.78 §12 — NOT FOUR EQUAL CHOICES.
  //
  // The first version listed all four kinds as identical rows, so an
  // Official lesson that cannot be assigned at all sat at the top of the
  // list looking like the primary option, above the practice a teacher
  // can actually give today. Availability now drives the grouping, and
  // the group a teacher can act on comes first.
  const Group = ({
    label,
    hint,
    children,
  }: {
    label: string;
    hint: string;
    children: React.ReactNode;
  }) => (
    <div className="mt-6 first:mt-0">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h3 className="font-display text-sm font-bold text-ink-900">{label}</h3>
        <p className="text-xs text-ink-400">{hint}</p>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );

  return (
    <section className="rounded-2xl bg-paper-200/70 p-5 sm:p-6">
      <h2 className="font-display text-lg font-bold text-ink-900">
        What you can assign today
      </h2>
      <Group label="Available now" hint="you can give these to a class today">
        <Row
          title="Related practice"
          tone="text-practice-800"
          detail="Older Pragati activities that practise the same mathematics. Shown to the student as practice — never as the chapter's lesson."
          items={practice.map((c) => c.title)}
        />
        <Row
          title="Instructional check"
          tone="text-brand-800"
          detail="Your own check on what the class can do, built from the item bank. Classroom evidence, not a calibrated score."
          items={practice.map((c) => c.title)}
        />
      </Group>
      <Group label="Not yet available" hint="written, waiting on educator review">
        <Row
          title="Official lesson"
          tone="text-ink-500"
          detail="A lesson written for a section of the current textbook. These become assignable once an educator has reviewed them; nothing is assignable on a draft."
          items={officialLearn.map((c) => c.title)}
        />
      </Group>
      <Group label="A separate, governed product" hint="not assigned from here">
        <Row
          title="Pragati Growth"
          tone="text-ink-500"
          detail="The formal assessment track. An instructional check never becomes one: Growth carries calibration and norming claims that ordinary classroom practice cannot support."
          items={[]}
        />
      </Group>
      {preparing.length > 0 && (
        <p className="mt-4 border-t border-ink-100 pt-4 text-sm text-ink-500">
          <span className="font-semibold text-ink-700">
            {preparing.length} chapter{preparing.length === 1 ? '' : 's'} being
            prepared:
          </span>{' '}
          {preparing.map((c) => c.title).join(' · ')}. Lessons for these are
          written but not yet reviewed, so they cannot be assigned.
        </p>
      )}
    </section>
  );
}

export function AssignmentsView({
  onBack,
  onCreate,
  onEdit,
  onChanged,
  inWorkspace = false,
}: {
  onBack: () => void;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onChanged: () => void;
  /**
   * v0.79 §11 — rendered as a tab body inside TeacherShell.
   *
   * The workspace already supplies identity, class scope and
   * navigation, so the standalone "← Back to teacher home" link is
   * noise there: the rail IS the way back. The prop exists because the
   * old top-level route is still reachable by deep link.
   */
  inWorkspace?: boolean;
}) {
  const assignments = loadAssignments().sort(
    (a, b) => b.createdAt - a.createdAt
  );
  const activeCount = assignments.filter((a) => a.active).length;

  const handleEnd = (id: string) => {
    const a = assignments.find((x) => x.id === id);
    endAssignment(id);
    if (a?.classroomId) void publishClassroomAssignmentsToCode(a.classroomId);
    onChanged();
  };

  const handleDelete = (id: string) => {
    const ok = window.confirm(
      'Delete this assignment from this device? Existing completed sessions will remain.'
    );
    if (!ok) return;
    const a = assignments.find((x) => x.id === id);
    deleteAssignment(id);
    if (a?.classroomId) void publishClassroomAssignmentsToCode(a.classroomId);
    onChanged();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {!inWorkspace && (
            <button
              onClick={onBack}
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              ← Back to teacher home
            </button>
          )}
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
            Assign learning
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
            Give a class or a student something to work on: a lesson from
            the textbook, related practice, or a check on what they can do.
          </p>
        </div>
        <button
          onClick={onCreate}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          New assignment
        </button>
      </div>

      {/* §11 — the assignment list is the work; what can be assigned is
          context beside it. Previously both were full-width blocks in
          one column with three zero-valued metric cards between them,
          which is the "three statistics and empty space" shape the brief
          rules out. The counts are now a line of type above the list. */}
      {/* §11 — the left column is the WORK: counts, then the assignments
          themselves. The first attempt put three zeros there alone and
          left the rest of the column empty, which is the same "three
          statistics and a void" shape in a two-column wrapper. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            <TeacherStat value={activeCount} label="open now" />
            <TeacherStat
              value={assignments.length - activeCount}
              label="closed"
            />
            <TeacherStat value={assignments.length} label="all time" />
          </div>
        {assignments.length === 0 ? (
        <div className="card text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No assignments yet
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Nothing is assigned to this class yet. What you assign appears
            on the student's home screen as the next thing to open.
          </p>
          <button
            onClick={onCreate}
            className="mt-4 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Create assignment
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <article key={a.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {a.title}
                    </h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${a.active ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-slate-200'}`}
                    >
                      {a.active ? 'Active' : 'Closed'}
                    </span>
                    {a.pilotModeOn && (
                      <span className="rounded-full bg-pink-50 px-2 py-0.5 text-xs font-semibold text-pink-700 ring-1 ring-pink-200">
                        Pilot tagged
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <SkillChip audience="teacher" mode={a.skillMode} />
                    <span>{a.itemCount} items</span>
                    <span>Created {formatDate(a.createdAt)}</span>
                  </div>
                  {a.target && (
                    <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
                      For {ASSIGNMENT_TARGET_LABELS[a.target.kind].toLowerCase()}
                      {a.target.kind !== 'class' && a.target.label
                        ? `: ${a.target.label}`
                        : ''}
                    </div>
                  )}
                  {a.teacherNote && (
                    <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
                      {a.teacherNote}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onEdit(a.id)}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  {a.active && (
                    <button
                      onClick={() => handleEnd(a.id)}
                      className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 ring-1 ring-amber-200 hover:bg-amber-100"
                    >
                      Close
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
        </div>
        <AssignableWork />
      </div>
    </div>
  );
}
