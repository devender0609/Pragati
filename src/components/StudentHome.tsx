import { useEffect, useMemo, useState } from 'react';
import { ITEMS } from '../data/items';
import { computeSkillProgress } from '../lib/progression';
import {
  getMostRecentActiveAssignment,
  loadSessions,
} from '../lib/storage';
import {
  ASSIGNMENT_TARGET_LABELS,
  SKILL_IDS_ORDERED,
  SKILL_LABELS,
  SKILL_MODE_LABELS,
  type AssessmentAssignment,
  type AssignmentSize,
  type SkillId,
  type SkillMode,
} from '../types';
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
  // Compute device-wide progression so we can pick a "weak skill" and a
  // "next skill" suggestion. Both fall back to FR.02 if there's no
  // session history yet.
  const progress = useMemo(
    () => computeSkillProgress(loadSessions(), ITEMS),
    []
  );
  // Weak skill: the first skill (in curriculum order) with a 'developing'
  // status. Falls back to the first non-strong skill, then to FR.02.
  const weakSkill: SkillId = useMemo(() => {
    for (const s of SKILL_IDS_ORDERED) {
      if (progress[s].status === 'developing') return s;
    }
    for (const s of SKILL_IDS_ORDERED) {
      if (progress[s].status !== 'strong') return s;
    }
    return SKILL_IDS_ORDERED[0];
  }, [progress]);
  // Next skill: first skill that hasn't been started yet, or the first
  // non-strong skill. Same fallback.
  const nextSkill: SkillId = useMemo(() => {
    for (const s of SKILL_IDS_ORDERED) {
      if (progress[s].status === 'not_started') return s;
    }
    for (const s of SKILL_IDS_ORDERED) {
      if (progress[s].status !== 'strong') return s;
    }
    return SKILL_IDS_ORDERED[SKILL_IDS_ORDERED.length - 1];
  }, [progress]);

  // Has the student done anything yet on this device?
  const totalSessions = loadSessions().length;
  const hasHistory = totalSessions > 0;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 shadow-sm ring-1 ring-slate-200 sm:p-10">
        <div className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
          Class 6 Math · Student · CBSE/NCERT-informed prototype
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          What do you want to do today?
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {hasHistory
            ? 'Pick one of the three options below. We picked them based on what you have done so far on this device.'
            : 'Pick one of the three options below to get started.'}
        </p>
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

      <section className="grid gap-4 md:grid-cols-3">
        <StudentActionCard
          title="Start recommended assessment"
          subtitle={
            onBrowseAssessments
              ? 'Pick your class and subject'
              : 'Mixed Class 6 Math · 8–10 questions'
          }
          body={
            onBrowseAssessments
              ? "Choose your class (1–12) and subject. Pragati loads only the assessments that have real content for that combination."
              : 'A short adaptive check across the whole module. The questions adjust to your answers.'
          }
          ctaLabel={onBrowseAssessments ? 'Choose an assessment' : 'Start assessment'}
          tone="brand"
          // v0.30: default the primary CTA to the registry-driven picker
          // so students in Classes 1–5 and 8–12 aren't silently sent
          // through the Class-6-only legacy path. When the picker isn't
          // wired (older shells / tests), fall back to onStart.
          onClick={onBrowseAssessments ?? onStart}
        />
        <StudentActionCard
          title="Practise a weak skill"
          subtitle={`${weakSkill} — ${SKILL_LABELS[weakSkill]}`}
          body={
            hasHistory
              ? `Open the Learn page for ${weakSkill} — reteach + worked examples + 5 practice questions.`
              : `No sessions yet, so we picked ${weakSkill} as a sensible starting point.`
          }
          ctaLabel={`Open ${weakSkill} practice`}
          tone="rose"
          onClick={onLearn}
        />
        <StudentActionCard
          title="Learn the next skill"
          subtitle={`${nextSkill} — ${SKILL_LABELS[nextSkill]}`}
          body={
            hasHistory
              ? `The next skill in the recommended order, based on what you have done so far.`
              : `${nextSkill} is the next skill in the recommended order.`
          }
          ctaLabel={`Open ${nextSkill} lesson`}
          tone="violet"
          onClick={onLearn}
        />
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
            Or use the Class 6 quick-start form →
          </button>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              For your teacher
            </div>
            <p className="mt-1 text-sm text-slate-700">
              Looking for the teacher dashboard, item review, or pilot setup?
            </p>
          </div>
          <button onClick={onTeacher} className="btn-secondary">
            Switch to teacher mode →
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <div className="font-semibold">What this is not</div>
        <p className="mt-1">
          This is a pre-pilot prototype. It does not produce a calibrated score
          and does not claim official CBSE alignment. The "growth indicator"
          is an early signal from a rule-based heuristic on a small item bank,
          not a validated growth metric.
        </p>
      </section>
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
