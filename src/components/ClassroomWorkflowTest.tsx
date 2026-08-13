// v0.23: teacher/admin-only end-to-end checklist for the classroom-code
// workflow. Reads from local state (classrooms, assignments, sessions,
// import status, join state) and reports pass / fail / pending for each
// of the eight steps that a real pilot needs to clear. It's a diagnostic
// view, not a student-facing one.

import { useMemo, useState } from 'react';
import {
  classifyCode,
  importStudentSubmissions,
  loadReviewedImports,
  loadStudentJoinState,
  loadTeacherImportStatus,
} from '../lib/accessCodes';
import { loadClassrooms } from '../lib/classroomStore';
import {
  getActiveAssignments,
  loadSessions,
  loadStudents,
} from '../lib/storage';
import { isFirebaseEnabled } from '../lib/firebase';

type CheckResult = {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'pending';
  detail: string;
};

export function ClassroomWorkflowTest({
  onBack,
}: {
  onBack: () => void;
}) {
  const [version, setVersion] = useState(0);
  const [running, setRunning] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const bump = () => setVersion((n) => n + 1);

  const results = useMemo<CheckResult[]>(() => {
    // Reload everything on each version bump so the table reflects
    // whatever the teacher did since opening this view.
    const classrooms = loadClassrooms();
    const activeAssignments = getActiveAssignments();
    const sessions = loadSessions();
    const students = loadStudents();
    const join = loadStudentJoinState();
    const importStatus = loadTeacherImportStatus();
    const reviewedMap = loadReviewedImports();

    const checks: CheckResult[] = [];

    // 1. Create a classroom
    checks.push({
      id: 'create_classroom',
      label: '1. Create a classroom',
      status: classrooms.length > 0 ? 'pass' : 'fail',
      detail:
        classrooms.length === 0
          ? 'No classrooms on this device yet. Use Classrooms → New classroom.'
          : `${classrooms.length} classroom${classrooms.length === 1 ? '' : 's'} created.`,
    });

    // 2. Generate active code
    const activeCodes = classrooms.filter((c) => classifyCode(c) === 'active');
    const revokedCodes = classrooms.filter((c) => classifyCode(c) === 'revoked');
    const expiredCodes = classrooms.filter((c) => classifyCode(c) === 'expired');
    checks.push({
      id: 'generate_code',
      label: '2. Generate an active access code',
      status: activeCodes.length > 0 ? 'pass' : classrooms.length > 0 ? 'fail' : 'pending',
      detail:
        activeCodes.length > 0
          ? `${activeCodes.length} active code${activeCodes.length === 1 ? '' : 's'}${revokedCodes.length > 0 || expiredCodes.length > 0 ? ` (${revokedCodes.length} revoked, ${expiredCodes.length} expired)` : ''}.`
          : classrooms.length === 0
            ? 'Needs at least one classroom first.'
            : 'No active code. Generate one from the classroom card.',
    });

    // 3. Publish an assignment to a coded classroom
    const activeIds = new Set(activeCodes.map((c) => c.id));
    const publishedToCode = activeAssignments.filter(
      (a) => a.classroomId && activeIds.has(a.classroomId)
    );
    checks.push({
      id: 'publish_assignment',
      label: '3. Publish an assignment to the code',
      status: publishedToCode.length > 0 ? 'pass' : activeCodes.length > 0 ? 'fail' : 'pending',
      detail:
        publishedToCode.length > 0
          ? `${publishedToCode.length} active assignment${publishedToCode.length === 1 ? '' : 's'} bound to an active code.`
          : activeCodes.length === 0
            ? 'Needs an active code first.'
            : 'No assignment bound to an active code. Pick a classroom on the AssignmentForm.',
    });

    // 4. Join as student using code
    const studentJoined = activeCodes.some((c) => c.studentIds.length > 0);
    checks.push({
      id: 'student_join',
      label: '4. Join as student using the code',
      status: studentJoined ? 'pass' : activeCodes.length > 0 ? 'pending' : 'pending',
      detail:
        activeCodes.length === 0
          ? 'Needs an active code first.'
          : !studentJoined
            ? 'No students have joined any active code yet. Test this from another device, or from this device by switching to student mode and tapping "Join with a code".'
            : `${activeCodes
                .map((c) => c.studentIds.length)
                .reduce((a, b) => a + b, 0)} student joins across active codes.`,
    });

    // 5. Complete an assigned assessment (any session bound to one of
    // those assignments — local OR imported counts).
    const assignmentIds = new Set(publishedToCode.map((a) => a.id));
    const completedAssignedSessions = sessions.filter(
      (s) =>
        s.completedAt !== null &&
        s.assignmentId &&
        assignmentIds.has(s.assignmentId)
    );
    checks.push({
      id: 'complete_session',
      label: '5. Complete an assigned assessment',
      status:
        completedAssignedSessions.length > 0
          ? 'pass'
          : publishedToCode.length > 0
            ? 'pending'
            : 'pending',
      detail:
        publishedToCode.length === 0
          ? 'Needs a published assignment first.'
          : completedAssignedSessions.length === 0
            ? 'No completed assignment-bound sessions yet. Take an assignment as a student to test.'
            : `${completedAssignedSessions.length} completed assignment-bound session${completedAssignedSessions.length === 1 ? '' : 's'}.`,
    });

    // 6. Submit to teacher (a join exists, joined classroom has the
    // active code, and we have at least one session marked Submitted).
    const localJoinOk =
      join !== null &&
      activeCodes.some((c) => c.id === join.classroomId);
    checks.push({
      id: 'submit_to_teacher',
      label: '6. Submit completed session to teacher',
      status: !isFirebaseEnabled()
        ? 'pending'
        : localJoinOk && completedAssignedSessions.length > 0
          ? 'pass'
          : 'pending',
      detail: !isFirebaseEnabled()
        ? 'Local demo mode — submissions are not sent to the cloud.'
        : !localJoinOk
          ? 'No active student join state on this device. The Submit step happens after a student completes an assigned session.'
          : completedAssignedSessions.length === 0
            ? 'Needs a completed assignment-bound session first.'
            : 'Latest assigned session was submitted to the cloud (subject to network).',
    });

    // 7. Import submissions
    const importedSessions = sessions.filter(
      (s) => typeof s.importedFromCode === 'string'
    );
    checks.push({
      id: 'import_submissions',
      label: '7. Import submissions on the teacher device',
      status:
        importedSessions.length > 0
          ? 'pass'
          : isFirebaseEnabled()
            ? 'pending'
            : 'pending',
      detail: !isFirebaseEnabled()
        ? 'Local demo mode — nothing to import.'
        : importedSessions.length === 0
          ? 'No imports yet. Click "Run import" below or use the panel on the teacher home.'
          : `${importedSessions.length} imported session${importedSessions.length === 1 ? '' : 's'} on this device${importStatus ? `; last import ${new Date(importStatus.lastImportedAt).toLocaleString()}.` : '.'}`,
    });

    // 8. Verify the imported session links to the teacher-side roster.
    const rosterIds = new Set(students.map((s) => s.id));
    const linkedCount = importedSessions.filter((s) =>
      rosterIds.has(s.studentId)
    ).length;
    const unlinkedCount = importedSessions.length - linkedCount;
    const reviewedCount = importedSessions.filter(
      (s) => reviewedMap[s.id] !== undefined
    ).length;
    checks.push({
      id: 'roster_linked',
      label: '8. Imported sessions link to teacher roster',
      status:
        importedSessions.length === 0
          ? 'pending'
          : unlinkedCount === 0
            ? 'pass'
            : 'fail',
      detail:
        importedSessions.length === 0
          ? 'Needs at least one imported submission first.'
          : `${linkedCount} / ${importedSessions.length} imported sessions linked to a roster student; ${reviewedCount} reviewed.${
              unlinkedCount > 0
                ? ` ${unlinkedCount} unlinked — visit Imported Submissions to inspect.`
                : ''
            }`,
    });

    return checks;
  }, [version]);

  const passed = results.filter((r) => r.status === 'pass').length;

  const runImport = async () => {
    if (running) return;
    setRunning(true);
    setImportMessage(null);
    try {
      const summary = await importStudentSubmissions();
      setImportMessage(
        `Imported ${summary.imported} new · ${summary.skippedDuplicates} duplicates skipped · ${summary.errors} errors.`
      );
      bump();
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back to teacher home
        </button>
      </div>

      <header className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wide text-brand-700">
          Teacher · Classroom workflow test
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          End-to-end classroom-code test
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          Walks the eight steps a real classroom needs before a pilot.
          Each row reads from this device's local state (and, where the
          teacher is signed in, from Firestore). This is a teacher /
          admin diagnostic — it is not surfaced to students.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Test status
            </div>
            <div className="mt-0.5 text-sm font-semibold text-slate-900">
              {passed} / {results.length} steps passing on this device
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={bump}
              className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
            >
              Refresh
            </button>
            <button
              onClick={runImport}
              disabled={running}
              className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
            >
              {running ? 'Running…' : 'Run import'}
            </button>
          </div>
        </div>
        {importMessage && (
          <div className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-700 ring-1 ring-slate-200">
            {importMessage}
          </div>
        )}
      </section>

      <section className="card">
        <ol className="space-y-2">
          {results.map((r) => (
            <li
              key={r.id}
              className={`flex flex-wrap items-start gap-3 rounded-xl border p-3 text-sm ${
                r.status === 'pass'
                  ? 'border-emerald-200 bg-emerald-50'
                  : r.status === 'fail'
                    ? 'border-rose-200 bg-rose-50'
                    : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-bold ${
                  r.status === 'pass'
                    ? 'bg-emerald-600 text-white'
                    : r.status === 'fail'
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-300 text-slate-700'
                }`}
              >
                {r.status === 'pass' ? '✓' : r.status === 'fail' ? '!' : '·'}
              </span>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{r.label}</div>
                <div className="mt-0.5 text-xs text-slate-700">{r.detail}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
        Pre-pilot prototype. This page only reflects data on THIS device.
        Step 4 ("student joins") and step 6 ("submit") need a SECOND
        device — either a student tablet on the same network or another
        browser. After the student device submits, return here and click
        "Run import" to pull the submissions and re-check steps 7 and 8.
      </section>
    </div>
  );
}
