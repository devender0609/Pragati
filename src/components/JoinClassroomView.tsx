// v0.19: Join-a-classroom form for students.
//
// Two paths:
//   - Code + name → join (resolveAccessCode + joinClassroomWithCode in
//     lib/accessCodes.ts).
//   - "Skip — practice solo" → use the regular student home as before.
//
// Local-demo mode also works: the resolver falls back to local classrooms
// when Firebase is not configured.

import { useState } from 'react';
import { joinClassroomWithCode, type StudentJoinState } from '../lib/accessCodes';
import { isFirebaseEnabled } from '../lib/firebase';

export function JoinClassroomView({
  onJoined,
  onSkip,
}: {
  onJoined: (state: StudentJoinState) => void;
  onSkip: () => void;
}) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fbEnabled = isFirebaseEnabled();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const state = await joinClassroomWithCode({ code, studentName: name });
      onJoined(state);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not join.';
      setError(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="text-xs font-medium uppercase tracking-wide text-violet-700">
          Student · Join classroom
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Enter your classroom code
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          Your teacher will share a short code (e.g. <code className="font-mono text-xs">MAP-7B3K</code>). Enter it
          together with your name to see your current assignment.
        </p>
      </header>

      <form
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        onSubmit={onSubmit}
      >
        <label className="block text-sm">
          <span className="font-medium text-slate-800">Classroom code</span>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
            required
            placeholder="MAP-7B3K"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-mono uppercase tracking-wider shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
          <span className="mt-1 block text-xs text-slate-500">
            Codes are not case-sensitive.
          </span>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-800">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Asha Sharma"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </label>

        {error && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800">
            {error}
          </div>
        )}

        {!fbEnabled && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-700">
            Running in local demo mode — codes are matched against classrooms on
            this device only.
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Skip — practise solo
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
          >
            {submitting ? 'Joining…' : 'Join classroom →'}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        Pragati is a prototype. Your name is stored on this device; nothing is
        sent to the cloud unless your teacher has set up a Firebase project and
        you joined a synced classroom.
      </div>
    </div>
  );
}
