import { useEffect, useMemo, useState } from 'react';
// v0.71 §2 — `ITEMS`, `computeSkillProgress`, `SKILL_IDS_ORDERED`,
// `SKILL_LABELS` and `SkillId` are no longer imported here. They powered
// the "weak skill" fallback that named a skill for a student with zero
// recorded sessions, and the raw skill codes printed on every card. All
// four remain in use where real evidence exists; none of them belongs on
// a first-run student screen.
import { getMostRecentActiveAssignment, loadSessions } from '../lib/storage';
import {
  ASSIGNMENT_TARGET_LABELS,
  SKILL_MODE_LABELS,
  type AssessmentAssignment,
  type AssignmentSize,
  type SkillMode,
} from '../types';
import { ChapterMotif } from '../design/ChapterMotif';
import { class6ChapterCards } from '../curriculum/studentChapterModel';
import { SkillChip } from './common/SkillChip';
import {
  clearStudentJoinState,
  loadCloudClassroomAssignments,
  loadStudentJoinState,
  loadSubmittedSessionIds,
  refreshCloudClassroomAssignments,
  type AssignmentSummary,
} from '../lib/accessCodes';

// Student home (v0.8: simplified, three big actions). Extracted from
// App.tsx in v0.13 — behavior unchanged.
export function StudentHome({
  onStart,
  onLearn,
  onTeacher,
  onStartAssignment,
  onJoinClassroom,
  onLeaveClassroom,
  onBrowseAssessments,
  onOpenOfficialChapter,
}: {
  onStart: () => void;
  onLearn: () => void;
  onTeacher: () => void;
  // Optional: when given, the student home surfaces the assignment as the
  // primary card and starts the assignment-bound assessment when clicked.
  onStartAssignment: (a: AssessmentAssignment) => void;
  // v0.19: open the join-classroom flow.
  onJoinClassroom?: () => void;
  onLeaveClassroom?: () => void;
  // v0.27: open the registry-driven picker (grade → subject → blueprint).
  onBrowseAssessments?: () => void;
  /** v0.71 §5 — open an official chapter, the same destination the
   *  returning student's Learn tab uses. One curriculum model, not two. */
  onOpenOfficialChapter?: (officialChapterId: string) => void;
}) {
  const joinState = loadStudentJoinState();
  const activeAssignment = useMemo(
    () => getMostRecentActiveAssignment(),
    []
  );

  // v0.20: cached classroom assignments pulled from accessCodes/{code}.
  // Re-fetched on mount when the student is in a joined classroom so the
  // student picks up newly-published assignments from the teacher.
  const [cloudBundle, setCloudBundle] = useState(() =>
    loadCloudClassroomAssignments()
  );
  useEffect(() => {
    if (!joinState) return;
    let active = true;
    (async () => {
      const ok = await refreshCloudClassroomAssignments();
      if (active && ok) setCloudBundle(loadCloudClassroomAssignments());
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const submittedSessionIds = useMemo(() => loadSubmittedSessionIds(), []);
  const sessionsByAssignment = useMemo(() => {
    const byId = new Map<string, boolean>();
    for (const s of loadSessions()) {
      if (s.assignmentId && s.completedAt) {
        // Mark this assignment as "has any completed local session".
        byId.set(s.assignmentId, byId.get(s.assignmentId) || submittedSessionIds.has(s.id));
      }
    }
    return byId;
  }, [submittedSessionIds]);
  const cloudAssignments = (cloudBundle?.assignments ?? []) as AssignmentSummary[];
  const cloudBundleRevoked = Boolean(cloudBundle?.revoked);
  // v0.71 §2 — THE WEAKNESS FALLBACK IS GONE.
  //
  // This block computed a "weak skill" and a "next skill" from session
  // history, and — crucially — fell back to FR.02 when there was NO
  // history at all. The screen then told a brand-new student it had
  // picked a skill for them to practise, which is a claim about a
  // student the product has never seen answer a question.
  //
  // `computeSkillProgress` still exists and is still used where real
  // evidence exists. What is removed is the fallback that manufactured
  // a recommendation out of nothing.
  //
  // The first action now comes from the CURRICULUM, which is true on
  // day one and needs no history: the first chapter a student can
  // actually open.
  const officialChapters = useMemo(() => class6ChapterCards(), []);
  const chapterCount = officialChapters.length;
  const firstChapter = useMemo(
    () => officialChapters.find((c) => c.availability === 'available') ?? null,
    [officialChapters]
  );

  // Has the student done anything yet on this device?
  const totalSessions = loadSessions().length;
  const hasHistory = totalSessions > 0;

  return (
    <div className="space-y-8">
      {/* v0.71 §1/§22 — THE FIRST-RUN HEADER, REWRITTEN.
          It read "Class 6 Math · Student · CBSE/NCERT-informed
          prototype". A Grade 6 student cannot use the word "prototype",
          and does not need to: that caveat is true, important, and
          belongs in Admin and pilot documentation where an adult reads
          it. What a student needs is to know what this is and where to
          begin. */}
      <section className="relative overflow-hidden rounded-xl3 bg-gradient-to-br from-brand-600 via-brand-600 to-learn-600 p-6 text-white shadow-card sm:p-8">
        <span className="pointer-events-none absolute -right-8 -top-8 text-white/15" aria-hidden="true">
          <ChapterMotif motif="fractions" className="h-44 w-44" />
        </span>
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Class 6 Mathematics
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {hasHistory ? 'Welcome back' : 'Welcome to Pragati'}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/90">
            {hasHistory
              ? 'Pick up where you left off, or start something new.'
              : 'Maths, chapter by chapter, straight from your textbook. Start whenever you are ready.'}
          </p>
        </div>
      </section>

      {/* v0.19: classroom membership banner. */}
      {joinState ? (
        <section className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                Classroom
              </div>
              <div className="mt-0.5 text-sm font-semibold text-slate-900">
                {joinState.studentName} · {joinState.classroomName}
              </div>
            </div>
            {onLeaveClassroom && (
              <button
                onClick={() => {
                  if (!window.confirm('Leave this classroom on this device? Your data is not deleted; you just stop seeing assignments for this classroom.')) return;
                  clearStudentJoinState();
                  onLeaveClassroom();
                }}
                className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-300 hover:bg-violet-100"
              >
                Leave classroom
              </button>
            )}
          </div>
        </section>
      ) : (
        onJoinClassroom && (
          <section className="rounded-2xl border-2 border-dashed border-violet-300 bg-violet-50/60 p-4 text-sm text-violet-900">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-violet-700">
                  Your teacher gave you a code?
                </div>
                <div className="mt-0.5 text-sm">
                  Enter your classroom code to see assigned work.
                </div>
              </div>
              <button
                onClick={onJoinClassroom}
                className="rounded-xl bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
              >
                Join with a code
              </button>
            </div>
          </section>
        )
      )}

      {/* v0.20: classroom-pushed assignments from the access-code mirror.
          These take priority over the generic local assignment when
          present (and the local activeAssignment is suppressed below). */}
      {joinState && cloudAssignments.length > 0 && (
        <section className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-violet-700">
            From your classroom
          </div>
          {cloudAssignments.map((a) => {
            const submitted = sessionsByAssignment.has(a.assignmentId);
            const overdue =
              typeof a.dueDateMs === 'number' && a.dueDateMs < Date.now();
            return (
              <article
                key={a.assignmentId}
                className="rounded-3xl border-2 border-violet-300 bg-violet-50/60 p-5 ring-1 ring-violet-100 sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-violet-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                    Assigned by your teacher
                  </span>
                  <SkillChip mode={a.skillMode} />
                  <span className="text-xs text-slate-500">{a.itemCount}-question {a.kind === 'practice' ? 'practice' : 'check'}</span>
                  {submitted && (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                      Submitted
                    </span>
                  )}
                  {!submitted && overdue && (
                    <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800 ring-1 ring-rose-200">
                      Overdue
                    </span>
                  )}
                </div>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {a.title}
                </h2>
                {typeof a.dueDateMs === 'number' && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-violet-700">
                    Due {new Date(a.dueDateMs).toLocaleDateString()}
                  </p>
                )}
                {a.teacherNote && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {a.teacherNote}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      // Adapt the summary to the AssessmentAssignment shape the
                      // existing onStartAssignment handler expects.
                      const adapted: AssessmentAssignment = {
                        id: a.assignmentId,
                        createdAt: Date.now(),
                        skillMode: a.skillMode as SkillMode,
                        itemCount: a.itemCount as AssignmentSize,
                        pilotModeOn: false,
                        title: a.title,
                        teacherNote: a.teacherNote,
                        active: true,
                        kind: a.kind,
                        ...(typeof a.dueDateMs === 'number' ? { dueDateMs: a.dueDateMs } : {}),
                        classroomId: joinState.classroomId,
                      };
                      onStartAssignment(adapted);
                    }}
                    className="btn-primary"
                  >
                    {submitted ? 'Take again' : `Start the ${a.itemCount}-question ${a.kind === 'practice' ? 'practice' : 'check'}`}
                  </button>
                  <span className="text-xs text-slate-500 sm:self-center">
                    {SKILL_MODE_LABELS[a.skillMode]}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      )}
      {joinState && cloudAssignments.length === 0 && !cloudBundleRevoked && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No active assignments in <strong>{joinState.classroomName}</strong> right now. Your teacher will publish one when ready.
        </section>
      )}
      {joinState && cloudBundleRevoked && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Your teacher has closed this classroom code. Tap "Leave classroom" above to switch.
        </section>
      )}

      {/* Suppress the legacy single-active-assignment card whenever the
          student is in a joined classroom — the cloud-mirror section above
          is the authoritative list. */}
      {!joinState && activeAssignment && (
        <section className="rounded-3xl border-2 border-brand-300 bg-brand-50/60 p-5 ring-1 ring-brand-100 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
              Assigned by your teacher
            </span>
            <SkillChip mode={activeAssignment.skillMode} />
            <span className="text-xs text-slate-500">
              {activeAssignment.itemCount}-question check
            </span>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {activeAssignment.title}
          </h2>
          {activeAssignment.target && activeAssignment.target.kind !== 'class' && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
              For {ASSIGNMENT_TARGET_LABELS[activeAssignment.target.kind].toLowerCase()}
              {activeAssignment.target.label
                ? `: ${activeAssignment.target.label}`
                : ''}
            </p>
          )}
          {activeAssignment.target && activeAssignment.target.kind === 'class' && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-brand-700">
              For the whole class
            </p>
          )}
          {activeAssignment.teacherNote && (
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {activeAssignment.teacherNote}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => onStartAssignment(activeAssignment)}
              className="btn-primary"
            >
              Start the {activeAssignment.itemCount}-question check
            </button>
            <span className="text-xs text-slate-500 sm:self-center">
              You can also pick another option below.
            </span>
          </div>
        </section>
      )}

      {/* v0.71 §2/§3/§4 — THE THREE CARDS, REPLACED.
          Three defects lived here at once.

          (1) §2, a correctness defect: the middle card said "Practise a
              weak skill" and, with ZERO sessions recorded, still named
              one — "No sessions yet, so we picked FR.02 as a sensible
              starting point." There is no evidence any skill is weak.
              Claiming weakness from no history is the assessment
              equivalent of fabricated progress.

          (2) §3: every card printed a raw internal skill code. FR.02 is
              a Pragati identifier; it is not a thing a student has ever
              seen or should ever need to read.

          (3) §4: the screen led with "Start recommended assessment",
              putting an uncalibrated adaptive check first in a product
              whose stated purpose is learning.

          The replacement leads with LEARNING, drawn from the same
          official curriculum model the returning student sees, and
          makes no claim it cannot support. */}
      <section className="grid gap-4 md:grid-cols-2">
        {firstChapter ? (
          <StudentActionCard
            title={hasHistory ? 'Keep learning' : 'Start learning'}
            subtitle={`Chapter ${firstChapter.number} · ${firstChapter.title}`}
            body={
              hasHistory
                ? 'Open your chapter and carry on.'
                : 'Your first chapter is ready. It follows your textbook, part by part.'
            }
            ctaLabel="Open this chapter"
            tone="brand"
            onClick={() => onOpenOfficialChapter?.(firstChapter.officialChapterId) ?? onLearn()}
          />
        ) : (
          <StudentActionCard
            title="Explore your chapters"
            subtitle="Class 6 Mathematics"
            body="See every chapter from your textbook and what is ready to open."
            ctaLabel="See the chapters"
            tone="brand"
            onClick={onLearn}
          />
        )}
        <StudentActionCard
          title="Explore your chapters"
          subtitle={`${chapterCount} chapters from your textbook`}
          body="Every chapter is listed in order, so you can see what is coming next."
          ctaLabel="See all chapters"
          tone="violet"
          onClick={onLearn}
        />
      </section>

      {/* §4 — assessment is still reachable, and no longer leads. The
          infrastructure is untouched; only its priority changed. */}
      <section className="rounded-xl2 border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              Try a set of questions
            </p>
            <p className="mt-0.5 text-sm text-slate-600">
              A short set of maths questions. It is not a test you can fail.
            </p>
          </div>
          <button
            onClick={onBrowseAssessments ?? onStart}
            className="btn-secondary"
          >
            Choose a set
          </button>
        </div>
      </section>

      {/* v0.30 — the legacy Class-6-only "quick start" path is now a
          secondary link so brand-new students can still get to it if
          they want a direct StartForm without going through the picker. */}
      {onBrowseAssessments && (
        <section className="text-xs text-slate-500">
          <button
            onClick={onStart}
            className="font-semibold text-slate-600 hover:text-slate-900 hover:underline"
          >
            Or start a set of questions without signing in →
          </button>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              For your teacher
            </div>
            {/* v0.71 §22 — was "Looking for the teacher dashboard, item
                review, or pilot setup?". "Item review" and "pilot setup"
                are internal workflow names on a screen a twelve-year-old
                reads. Both destinations still exist, one tap away, under
                names their actual audience uses. */}
            <p className="mt-1 text-sm text-slate-700">
              Teachers can open the class dashboard from here.
            </p>
          </div>
          <button onClick={onTeacher} className="btn-secondary">
            Switch to teacher mode →
          </button>
        </div>
      </section>

      {/* v0.71 §22 — the prototype disclaimer moved out of the student
          screen. Every word of it was true and none of it was for a
          twelve-year-old: "calibrated score", "rule-based heuristic",
          "item bank". The claim it guards against is one adults make,
          so the guard belongs where adults read — it is stated in full
          in Admin & Research, in the teacher pilot notice, and in the
          release documentation. Removing it from here removes nothing
          from the record. */}
    </div>
  );
}

function StudentActionCard({
  title,
  subtitle,
  body,
  ctaLabel,
  tone,
  onClick,
}: {
  title: string;
  subtitle: string;
  body: string;
  ctaLabel: string;
  tone: 'brand' | 'rose' | 'violet';
  onClick: () => void;
}) {
  const ringClass =
    tone === 'brand'
      ? 'border-brand-200 bg-brand-50/40'
      : tone === 'rose'
        ? 'border-rose-200 bg-rose-50/40'
        : 'border-violet-200 bg-violet-50/40';
  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-5 ring-1 ring-slate-100 transition hover:shadow-md sm:p-6 ${ringClass}`}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {subtitle}
      </div>
      <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{body}</p>
      <button onClick={onClick} className="btn-primary mt-4 w-fit text-sm">
        {ctaLabel}
      </button>
    </article>
  );
}
