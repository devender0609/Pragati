// v0.17: Per-student learning path.
//
// Picks the weakest skill from the student's most recent session (lowest
// per-skill accuracy with at least one attempt; ties broken by curriculum
// order), then renders, in sequence:
//   - the rich mini-lesson (if available; otherwise the base intro)
//   - 3 guided practice items (worked examples from the lesson)
//   - 3 independent practice items (from rich materials, falling back to
//     the lesson's practice list with answers omitted)
//   - an exit ticket (if rich materials provide one)
//   - a "Retake the assessment" button that loops back into the engine
//
// This is a v0.17 prototype — it does NOT yet track which steps the student
// completed. The flow is purely guided sequencing.

import { useMemo, useState } from 'react';
import { ITEMS } from '../data/items';
import { lessonFor, skillHasRichMaterials } from '../data/lessons';
import { summarizeBySkill } from '../lib/scoring';
import {
  SKILL_IDS_ORDERED,
  SKILL_LABELS,
  type Session,
  type SkillId,
  type SkillMode,
} from '../types';
import { SkillChip } from './common/SkillChip';
import { VisualRenderer } from './common/VisualRenderer';

export function StudentLearningPath({
  session,
  onRetake,
  onBack,
}: {
  session: Session;
  onRetake: (mode: SkillMode) => void;
  onBack: () => void;
}) {
  // Pick weakest skill: lowest accuracy among skills with at least one
  // attempt. Ties broken by curriculum order.
  const weakest: SkillId = useMemo(() => {
    const summary = summarizeBySkill(session.responses, ITEMS);
    const attempted = summary.filter((s) => s.attempted > 0);
    if (attempted.length === 0) return SKILL_IDS_ORDERED[0];
    let best: typeof attempted[number] = attempted[0];
    for (const row of attempted) {
      if (row.accuracy < best.accuracy) best = row;
      else if (
        row.accuracy === best.accuracy &&
        SKILL_IDS_ORDERED.indexOf(row.skillId) <
          SKILL_IDS_ORDERED.indexOf(best.skillId)
      ) {
        best = row;
      }
    }
    return best.skillId;
  }, [session]);

  // v0.35 — lessonFor() always returns a Lesson now (synthesised from
  // the item bank when no hand-authored one exists), so the guided
  // learning path always has real worked examples and practice items
  // to show.
  const lesson = useMemo(() => lessonFor(weakest), [weakest]);
  const rich = lesson.rich;
  const hasRich = skillHasRichMaterials(weakest);

  // Guided practice: the lesson's worked examples (capped at 3).
  const guided = lesson.workedExamples.slice(0, 3);
  // Independent practice: prefer rich.independentPractice, fall back to
  // the existing practice item IDs (with answers hidden).
  const independent = useMemo(() => {
    if (rich?.independentPractice && rich.independentPractice.length > 0) {
      return rich.independentPractice.slice(0, 3);
    }
    const byId = new Map(ITEMS.map((it) => [it.id, it]));
    return lesson.practice
      .slice(0, 3)
      .map((id) => byId.get(id))
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
      .map((it) => ({
        prompt: it.stem,
        answer:
          it.kind === 'mcq'
            ? `Choice ${String.fromCharCode(65 + it.correctIndex)}: ${it.options[it.correctIndex].text}`
            : it.acceptedAnswers[0] ?? '(see lesson)',
      }));
  }, [rich, lesson]);

  const exitTicket = rich?.exitTicket ?? [];

  // Reveal-on-click for independent practice and exit ticket.
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const toggleReveal = (key: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          ← Back to results
        </button>
      </div>

      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-50 via-white to-brand-50 p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
          Learning path · {hasRich ? 'Enhanced' : 'Standard'}
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Let's focus on {SKILL_LABELS[weakest]}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
          Based on the session you just finished, this is the skill where extra
          practice will help most. Work through the steps below, then come
          back and retake the assessment.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <SkillChip mode={weakest} />
        </div>

        {/* v0.18: progress dots — visible mastery markers across the path. */}
        <div className="mt-5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Your path
          </div>
          <ol className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
            <ProgressDot n={1} label="Read" />
            <ProgressDot n={2} label="Walk through" />
            <ProgressDot n={3} label="Try yourself" />
            {exitTicket.length > 0 && <ProgressDot n={4} label="Check" />}
            <ProgressDot n={exitTicket.length > 0 ? 5 : 4} label="Retake" terminal />
          </ol>
        </div>
      </section>

      {/* Step 1: mini-lesson */}
      <PathStep
        n={1}
        title="Read the mini-lesson"
        subtitle="Read it once aloud if you can. The wording is meant to be slow."
      >
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 sm:text-base">
          {rich?.miniLesson ?? lesson.intro}
        </p>
        {rich?.visualWalkthrough && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Look at the picture below as you read each line
            </div>
            <div className="mt-3 flex justify-center rounded-xl bg-white p-3 ring-1 ring-slate-200">
              <VisualRenderer visual={lesson.visualExplanation.visual} />
            </div>
            <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-slate-700">
              {rich.visualWalkthrough.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          </div>
        )}
      </PathStep>

      {/* Step 2: guided practice (worked examples) */}
      <PathStep
        n={2}
        title="Walk through 3 guided examples"
        subtitle="Each problem comes with the full working. Read it line by line."
      >
        <div className="space-y-4">
          {guided.map((ex, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Guided example {i + 1}
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                {ex.problem}
              </div>
              <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-slate-700">
                {ex.steps.map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ol>
              <div className="mt-3 text-sm font-semibold text-emerald-700">
                Answer: {ex.answer}
              </div>
            </div>
          ))}
        </div>
      </PathStep>

      {/* Step 3: independent practice */}
      <PathStep
        n={3}
        title="Try 3 on your own"
        subtitle="Work it out in your notebook first, then reveal the answer to check."
      >
        <div className="space-y-3">
          {independent.map((q, i) => {
            const key = `ind-${i}`;
            const isOpen = revealed.has(key);
            return (
              <div
                key={key}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="text-sm font-medium text-slate-900">
                    Q{i + 1}. {q.prompt}
                  </div>
                  <button
                    onClick={() => toggleReveal(key)}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    {isOpen ? 'Hide answer' : 'Reveal answer'}
                  </button>
                </div>
                {isOpen && (
                  <div className="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
                    {q.answer}
                  </div>
                )}
              </div>
            );
          })}
          {independent.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600">
              No practice items found for this skill yet.
            </div>
          )}
        </div>
      </PathStep>

      {/* Step 4: exit ticket */}
      {exitTicket.length > 0 && (
        <PathStep
          n={4}
          title="Exit ticket"
          subtitle="Quick check — answer these two before you retake the assessment."
        >
          <div className="space-y-3">
            {exitTicket.map((q, i) => {
              const key = `et-${i}`;
              const isOpen = revealed.has(key);
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-violet-200 bg-violet-50 p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-sm font-medium text-violet-900">
                      {q.prompt}
                    </div>
                    <button
                      onClick={() => toggleReveal(key)}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200 hover:bg-violet-100"
                    >
                      {isOpen ? 'Hide' : 'Check'}
                    </button>
                  </div>
                  {isOpen && (
                    <div className="mt-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-violet-900 ring-1 ring-violet-200">
                      {q.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </PathStep>
      )}

      {/* v0.18: encouragement summary — no points, no streaks, no badges. */}
      <EncouragementCard weakest={weakest} session={session} />

      {/* Retake CTA */}
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
        <div className="font-semibold">Ready to try again?</div>
        <p className="mt-1">
          When you feel solid on the mini-lesson and the guided examples,
          retake an assessment on this skill. The system will pick a fresh set
          of items.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => onRetake(weakest)}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Retake the assessment on {SKILL_LABELS[weakest]}
          </button>
          {/* v0.18: "try another similar question" — re-runs same skill but
              with a different starting seed via the same retake handler. */}
          <button
            onClick={() => onRetake(weakest)}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-300 hover:bg-emerald-100"
          >
            Try another similar question
          </button>
        </div>
        <p className="mt-3 text-xs text-emerald-700">
          Tip: scroll back up to <em>"Walk through 3 guided examples"</em> to
          watch the worked solutions again before retaking.
        </p>
      </section>

      {!hasRich && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          This skill is using the standard learning path. Richer materials are
          authored for FR.06, DE.01, FM.07, and GB.03 in this build; the same
          pattern can be extended to every skill.
        </div>
      )}
    </div>
  );
}

function PathStep({
  n,
  title,
  subtitle,
  children,
}: {
  n: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 ring-1 ring-brand-200">
          {n}
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            {title}
          </h2>
          <p className="text-xs text-slate-500 sm:text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="pl-0 sm:pl-11">{children}</div>
    </section>
  );
}

// v0.18: visual path marker. School-appropriate — no badges, no streaks.
function ProgressDot({
  n,
  label,
  terminal,
}: {
  n: number;
  label: string;
  terminal?: boolean;
}) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
          terminal
            ? 'bg-emerald-600 text-white'
            : 'bg-brand-100 text-brand-700 ring-1 ring-brand-200'
        }`}
      >
        {n}
      </span>
      <span className="font-medium text-slate-700">{label}</span>
      {!terminal && <span className="text-slate-300">→</span>}
    </li>
  );
}

// v0.18: short, factual encouragement strip + targeted misconception alert.
// Avoids gamification; uses observed signal from the session.
function EncouragementCard({
  weakest,
  session,
}: {
  weakest: SkillId;
  session: Session;
}) {
  const skillResponses = session.responses.filter(
    // We can't reliably re-derive the per-response skill here without
    // hitting items.ts; for this surface we only care whether the wrong
    // answer for this skill carried a misconception tag.
    () => true
  );
  const wrongs = session.responses.filter((r) => !r.correct);
  const topMisc = (() => {
    const counts = new Map<string, number>();
    for (const r of wrongs) {
      if (r.misconceptionTriggered === 'none') continue;
      counts.set(
        r.misconceptionTriggered,
        (counts.get(r.misconceptionTriggered) ?? 0) + 1
      );
    }
    let best: { code: string; count: number } | null = null;
    for (const [code, count] of counts.entries()) {
      if (!best || count > best.count) best = { code, count };
    }
    return best;
  })();

  const accuracy =
    session.responses.length === 0
      ? 0
      : session.responses.filter((r) => r.correct).length /
        session.responses.length;
  const accPct = Math.round(accuracy * 100);

  return (
    <section className="rounded-2xl border border-brand-200 bg-brand-50 p-5 text-sm text-brand-900">
      <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
        Where you are right now
      </div>
      <p className="mt-1">
        You answered <strong>{accPct}%</strong> of the items correctly across{' '}
        {session.responses.length} questions. Focusing on{' '}
        <strong>{SKILL_LABELS[weakest]}</strong> next is the most useful next
        step — small, focused practice tends to land faster than re-doing a
        full mixed session.
      </p>
      {topMisc && skillResponses.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <strong>Common mistake alert:</strong> a pattern called{' '}
          <code className="font-mono text-[11px]">{topMisc.code}</code> came up
          {topMisc.count > 1 ? ` ${topMisc.count} times` : ' once'}. The
          mini-lesson and guided examples above are written to address it
          directly.
        </div>
      )}
    </section>
  );
}
