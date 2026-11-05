// v0.50 §3 — Concept chooser.
//
// v0.49's "Practise a concept" button did this:
//
//   const firstSkill = c.inventory.mapping.skillIds[0];
//   onLaunchConceptPractice(firstSkill)
//
// So it was never a choice — it silently launched whichever skill
// happened to sort first. A student wanting to practise "add fractions
// with unlike denominators" got "represent fractions visually", with no
// way to say otherwise.
//
// This component shows the chapter's concepts by their student-friendly
// names and lets the student pick. Skill codes (FR.02) never appear.

import { useMemo } from 'react';
import { Card } from '../../design/primitives/Card';
import { PageHeader } from '../../design/primitives/PageHeader';
import { ITEMS } from '../../data/items';
import { loadSessions } from '../../lib/storage';
import { computeSkillProgress } from '../../lib/progression';
import { SKILL_LABELS, type SkillId } from '../../types';

/** Simple, student-legible state for a concept. Deliberately three
 *  values — a child does not need a mastery percentage. */
export type ConceptState = 'new' | 'practised' | 'review';

export const CONCEPT_STATE_LABEL: Record<ConceptState, string> = {
  new: 'New',
  practised: 'Practised',
  review: 'Review recommended',
};

export type ConceptChoice = {
  skillId: SkillId;
  /** Student-friendly name. Never a skill code. */
  label: string;
  state: ConceptState;
  itemCount: number;
};

/**
 * Build the concept list for a chapter.
 *
 * Pure apart from the injected progress map, so the state rules are
 * testable. A concept is:
 *   review    — attempted enough times to judge, and accuracy is low;
 *   practised — attempted at all;
 *   new       — not attempted.
 */
export function buildConceptChoices(args: {
  skillIds: SkillId[];
  progress: Record<string, { attempted: number; correct: number } | undefined>;
  itemCountFor: (s: SkillId) => number;
  /** Minimum attempts before we are willing to recommend review. One
   *  wrong answer is not evidence. */
  minAttemptsForReview?: number;
  reviewAccuracyBelow?: number;
}): ConceptChoice[] {
  const {
    skillIds, progress, itemCountFor,
    minAttemptsForReview = 3, reviewAccuracyBelow = 0.6,
  } = args;

  return skillIds
    .map((skillId) => {
      const p = progress[skillId];
      const attempted = p?.attempted ?? 0;
      const correct = p?.correct ?? 0;
      let state: ConceptState = 'new';
      if (attempted > 0) {
        const accuracy = correct / attempted;
        state =
          attempted >= minAttemptsForReview && accuracy < reviewAccuracyBelow
            ? 'review'
            : 'practised';
      }
      return {
        skillId,
        label: SKILL_LABELS[skillId] ?? 'Practice',
        state,
        itemCount: itemCountFor(skillId),
      };
    })
    // Only concepts that actually have questions can be practised.
    .filter((c) => c.itemCount > 0);
}

export function ConceptChooser({
  chapterTitle,
  skillIds,
  studentId,
  onChoose,
  onBack,
}: {
  chapterTitle: string;
  skillIds: SkillId[];
  studentId: string;
  onChoose: (skill: SkillId) => void;
  onBack: () => void;
}) {
  const choices = useMemo(() => {
    const scoped = loadSessions().filter((s) => s.studentId === studentId);
    const prog = computeSkillProgress(scoped, ITEMS) as Record<
      string,
      { attempted: number; correct: number } | undefined
    >;
    return buildConceptChoices({
      skillIds,
      progress: prog,
      itemCountFor: (s) => ITEMS.filter((i) => i.skillId === s).length,
    });
  }, [skillIds.join(','), studentId]);

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="min-h-[44px] text-sm font-medium text-slate-500 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        ← Back
      </button>
      <PageHeader
        eyebrow={chapterTitle}
        title="Which idea do you want to practise?"
      />
      {choices.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-600">
            No questions are ready for this chapter yet.
          </p>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {choices.map((c) => (
            <li key={c.skillId}>
              <button
                onClick={() => onChoose(c.skillId)}
                className="flex min-h-[44px] w-full flex-col items-start gap-1 rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition hover:ring-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {c.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    c.state === 'review'
                      ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
                      : c.state === 'practised'
                        ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {/* Status is carried by text, not colour alone (§13). */}
                  {CONCEPT_STATE_LABEL[c.state]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
