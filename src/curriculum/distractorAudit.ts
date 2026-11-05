// v0.68 §3 — THE DISTRACTOR AUDIT.
//
// WHAT THIS ANSWERS
//
// For every incorrect option a student can choose anywhere in Chapter
// 7: is the reason for choosing it knowable, or not?
//
//   diagnostic     — this answer supports one documented misconception
//                    and admits no other reading.
//   non_diagnostic — the answer is wrong, but a student could have
//                    reached it more than one way. Neutral guidance.
//
// The classification is DERIVED from the authored data, not restated
// beside it. A distractor is diagnostic exactly when it carries a
// resolvable, diagnosable misconception reference. That means the table
// cannot drift from the items: if someone removes a tag, the row moves
// to non_diagnostic on the next run rather than the report going stale.
//
// WHAT IT DOES NOT DO
//
// It does not certify that a diagnosis is CORRECT. `whyUnique` is an
// argument a human can reject — and in v0.67 two such arguments were
// rejected, which is how this file came to exist. The audit makes the
// claims visible and checkable; it does not adjudicate them.

import { fractionsChapterSections } from './fractionsChapter';
import {
  refForOption,
  partsAreEqual,
  shadedAmount,
  type InstructionalItem,
} from './instructionalInteraction';
import { resolveMisconception, type MisconceptionRef } from './misconceptionResolver';
import { FRACTIONS_MISCONCEPTIONS } from './fractionsMisconceptions';
import { fractionsEqual } from './visualSpecification';

export type DistractorClassification = 'diagnostic' | 'non_diagnostic';

export type DistractorAuditRow = {
  officialSectionId: string;
  sectionNumber: string;
  itemId: string;
  format: string;
  optionId: string;
  optionText: string;
  classification: DistractorClassification;
  /** Null for non-diagnostic rows. */
  misconceptionId: string | null;
  misconceptionSource: string | null;
  /** Why this response uniquely reflects the misconception. */
  whyUnique: string | null;
  /** The exact sentence the student receives. */
  studentFeedback: string;
};

function describeChoiceUniqueness(
  itemId: string,
  optionId: string
): string {
  const key = `${itemId}:${optionId}`;
  const notes: Record<string, string> = {
    's74.p5:b':
      'Choosing the mark AT zero is only reachable by counting marks instead of spaces; every other wrong mark is a miscount of position.',
    's74.p5:d':
      'The option states the belief outright — that a fraction below 1 cannot be shown — so no other reading is available.',
    's76.p3:b':
      'The option gives its own reason: that 3 and 6 being larger numbers makes the fraction larger.',
    's77.p1:b':
      'The option gives its own reason: that 5 being bigger than 3 makes 2/5 the larger fraction.',
    's77.p1:c':
      'The option gives its own reason: that the fractions are equal because both numerators are 2. Only ignoring the denominator produces that claim.',
    's78.p2:b':
      '2/8 from 1/4 + 1/4 is reachable only by adding numerators and denominators separately.',
    's71.p1:b':
      'The part count is right (four parts, one shaded) and only the equality is wrong, so the sole available inference is that unequal parts were accepted as fourths.',
  };
  return notes[key] ?? 'Authored as diagnostic; uniqueness argument not recorded.';
}

function rowsForItem(
  officialSectionId: string,
  sectionNumber: string,
  item: InstructionalItem
): DistractorAuditRow[] {
  const rows: DistractorAuditRow[] = [];

  const push = (
    optionId: string,
    optionText: string,
    ref: MisconceptionRef | null,
    whyUnique: string | null,
    neutralText: string
  ) => {
    if (ref) {
      const r = resolveMisconception(ref);
      if (r.diagnosable) {
        rows.push({
          officialSectionId,
          sectionNumber,
          itemId: item.itemId,
          format: item.format,
          optionId,
          optionText,
          classification: 'diagnostic',
          misconceptionId: ref.id,
          misconceptionSource: ref.source,
          whyUnique: whyUnique ?? describeChoiceUniqueness(item.itemId, optionId),
          studentFeedback: r.feedback,
        });
        return;
      }
    }
    rows.push({
      officialSectionId,
      sectionNumber,
      itemId: item.itemId,
      format: item.format,
      optionId,
      optionText,
      classification: 'non_diagnostic',
      misconceptionId: null,
      misconceptionSource: null,
      whyUnique: null,
      studentFeedback: neutralText,
    });
  };

  if (item.format === 'multiple_choice') {
    for (const c of item.choices) {
      if (c.id === item.correctChoiceId) continue;
      push(c.id, c.text, refForOption(c), null, item.neutralIncorrectFeedback);
    }
  }

  if (item.format === 'area_model_selection') {
    for (const o of item.options) {
      const isCorrect =
        partsAreEqual(o.partWidths) &&
        fractionsEqual(shadedAmount(o), item.targetValue);
      if (isCorrect) continue;
      push(o.id, o.altText, refForOption(o), null, item.neutralIncorrectFeedback);
    }
  }

  if (item.format === 'numeric_entry' && item.diagnosticValues) {
    for (const d of item.diagnosticValues) {
      const label = `${d.value.numerator}/${d.value.denominator}`;
      push(
        label,
        `entered ${label}`,
        { source: 'fractions_chapter_registry', id: d.chapterMisconceptionId },
        d.whyUnique,
        item.neutralIncorrectFeedback
      );
    }
  }

  // Strip selection and number-line placement report WHICH option was
  // chosen, not why. The number line's one exception — landing exactly
  // one tick short — is judged at response time rather than authored on
  // an option, so it has no row here. That is deliberate: the audit
  // covers authored option/misconception pairs, and a response-derived
  // inference is a different claim tested separately.
  return rows;
}

export function distractorAudit(): DistractorAuditRow[] {
  const rows: DistractorAuditRow[] = [];
  for (const s of fractionsChapterSections()) {
    for (const item of s.interactivePractice) {
      rows.push(
        ...rowsForItem(s.source.officialSectionId, s.source.sectionNumber, item)
      );
    }
  }
  return rows;
}

export type DistractorAuditSummary = {
  totalIncorrectOptions: number;
  diagnostic: number;
  nonDiagnostic: number;
  byMisconception: Record<string, number>;
  bySection: Record<string, { diagnostic: number; nonDiagnostic: number }>;
};

export function distractorAuditSummary(): DistractorAuditSummary {
  const rows = distractorAudit();
  const byMisconception: Record<string, number> = {};
  const bySection: Record<string, { diagnostic: number; nonDiagnostic: number }> = {};

  for (const r of rows) {
    const bucket = (bySection[r.sectionNumber] ??= {
      diagnostic: 0,
      nonDiagnostic: 0,
    });
    if (r.classification === 'diagnostic') {
      bucket.diagnostic += 1;
      if (r.misconceptionId) {
        byMisconception[r.misconceptionId] =
          (byMisconception[r.misconceptionId] ?? 0) + 1;
      }
    } else {
      bucket.nonDiagnostic += 1;
    }
  }

  return {
    totalIncorrectOptions: rows.length,
    diagnostic: rows.filter((r) => r.classification === 'diagnostic').length,
    nonDiagnostic: rows.filter((r) => r.classification === 'non_diagnostic').length,
    byMisconception,
    bySection,
  };
}

/**
 * Every registry misconception, and whether any distractor actually
 * uses it.
 *
 * Documenting a misconception is not the same as detecting one. This
 * separation is what stops "9 misconceptions covered" from being said
 * when three of them are never diagnosed anywhere.
 */
export function misconceptionUsage(): Array<{
  id: string;
  diagnosable: boolean;
  usedInDistractors: number;
}> {
  const rows = distractorAudit();
  const counts: Record<string, number> = {};
  for (const r of rows) {
    if (r.misconceptionId) counts[r.misconceptionId] = (counts[r.misconceptionId] ?? 0) + 1;
  }
  return FRACTIONS_MISCONCEPTIONS.map((m) => ({
    id: m.id,
    diagnosable: m.diagnosticSignal !== null,
    usedInDistractors: counts[m.id] ?? 0,
  }));
}
