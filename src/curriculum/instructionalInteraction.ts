// v0.62 §9/§10 — INSTRUCTIONAL INTERACTIONS.
//
// WHY THIS EXISTS
//
// The v0.61 audit found every item in the bank reports format
// `unknown` and is in practice a text multiple-choice question. For a
// competency literally named "visualises them on the number line"
// (MIDDLE:C-1.4), four lines of text with radio buttons cannot assess
// the thing. A student who can pick "3/4" from a list has not
// demonstrated that they can place 3/4.
//
// SCOPE
//
// v0.62 shipped four formats, chosen because §7.4 needs them.
//
// v0.68 §6 adds exactly ONE more, `area_model_selection`, and the test
// it had to pass was "does this evidence something the existing four
// cannot?" It does: strips are one-dimensional and partitioned equally
// by construction, so a strip can never show an UNEQUAL partition.
// §7.1 and §7.2 both hinge on the student noticing that parts must be
// equal, and no other format in this file can even pose that question.
// Equivalence and comparison were re-tested against the same bar and
// still fail it — strip selection already serves them.
//
// No drag-and-drop. It would demo well and evidence nothing extra.
//
// SEPARATION FROM GROWTH
//
// `use: 'instructional_practice'` is fixed on every item here. These
// formats do not enter secure Growth assessment; Growth item-use
// separation is a v0.52 invariant and is not touched.

import {
  fractionsEqual,
  type ExactFraction,
} from './visualSpecification';
import type { FractionsMisconceptionId } from './fractionsMisconceptions';
import {
  resolveMisconception,
  chapterRef,
  section74Ref,
  type MisconceptionRef,
} from './misconceptionResolver';
import { MISCONCEPTION_FEEDBACK } from './section74Misconceptions';
import type { MisconceptionId } from './section74Misconceptions';

// v0.68 §2 — re-exported from `section74Misconceptions.ts`, where they
// now live so the resolver can read them without an import cycle. The
// values are unchanged and `contentArtifact.ts` still imports
// `MISCONCEPTION_FEEDBACK` from here, so the fingerprint payload is
// byte-identical.
export { MISCONCEPTION_FEEDBACK };
export { SECTION_7_4_MISCONCEPTION_IDS } from './section74Misconceptions';
export type { MisconceptionId };

export const INTERACTION_FORMATS = [
  'multiple_choice',
  'numeric_entry',
  'select_point_on_number_line',
  'fraction_strip_selection',
  // v0.68 §6 — the one addition. Justified above.
  'area_model_selection',
] as const;
export type InteractionFormat = (typeof INTERACTION_FORMATS)[number];

export type Choice = {
  id: string;
  text: string;
  /**
   * Present ONLY when this distractor represents a specific,
   * documented error from the frozen §7.4 map. A distractor that is
   * merely wrong carries null and receives neutral corrective guidance.
   *
   * v0.68: still required, still four values, still inside the §7.4
   * fingerprint. Do not widen it — see `chapterMisconceptionId`.
   */
  misconceptionId: MisconceptionId | null;
  /**
   * v0.68 §2 — the chapter-registry alternative.
   *
   * OPTIONAL by design: §7.4's own choices never set it, so
   * `JSON.stringify` omits the key and the frozen payload does not
   * move. Every other section may use it, which is how
   * `add_numerators_and_denominators` and `compare_numerators_only`
   * finally reach the distractors that actually diagnose them.
   *
   * Setting both is a mistake and `auditItemMisconceptions` reports it.
   */
  chapterMisconceptionId?: FractionsMisconceptionId;
};

type Base = {
  itemId: string;
  /** Fixed. Instructional practice is not Growth. */
  use: 'instructional_practice';
  officialSectionId: string;
  prompt: string;
  /** Shown when the answer is right — confirms the reasoning, not just
   *  the outcome. */
  correctFeedback: string;
  /** Used when the error is not one of the documented misconceptions. */
  neutralIncorrectFeedback: string;
};

export type MultipleChoiceItem = Base & {
  format: 'multiple_choice';
  choices: Choice[];
  correctChoiceId: string;
};

/**
 * v0.68 §3 — a specific wrong VALUE that admits only one reading.
 *
 * `2/5` entered for `1/2 + 1/3` is the added-denominators error and
 * nothing else; no other method produces it. `6/4` for `2¾` is the
 * mixed-number-as-multiplication error and nothing else. Free entry
 * turns out to diagnose BETTER than multiple choice here, because the
 * student produced the number instead of recognising it in a list.
 *
 * Only exact-value matches count. An equivalent form is not evidence of
 * the same error.
 */
export type DiagnosticValue = {
  value: ExactFraction;
  chapterMisconceptionId: FractionsMisconceptionId;
  /** Why this value admits no other reading. Recorded, not decorative —
   *  the audit report prints it and a reviewer can disagree with it. */
  whyUnique: string;
};

export type NumericEntryItem = Base & {
  format: 'numeric_entry';
  /** Exact. Judged by cross-multiplication, never float comparison. */
  correctValue: ExactFraction;
  /** Accept an unsimplified equivalent (2/4 for 1/2)? Usually yes —
   *  the section teaches that they are the same point. */
  acceptEquivalent: boolean;
  /** Optional. Absent on every §7.4 item, so the payload is unmoved. */
  diagnosticValues?: DiagnosticValue[];
};

export type NumberLinePointItem = Base & {
  format: 'select_point_on_number_line';
  min: ExactFraction;
  max: ExactFraction;
  partitions: number;
  /** The tick the student must select, counted from `min`. */
  correctTickIndex: number;
  labelTicks: boolean;
};

export type FractionStripItem = Base & {
  format: 'fraction_strip_selection';
  /** Strips offered; the student picks the one matching `targetValue`. */
  strips: Array<{ denominator: number; shadedCount: number }>;
  targetValue: ExactFraction;
};

/**
 * v0.68 §6 — pick the region that shows the stated fraction.
 *
 * Each option is a rectangle described by the WIDTHS of its parts, in
 * order, as exact rationals of the whole. That representation is the
 * point: `[1/2, 1/4, 1/4]` is a legitimate partition of a rectangle and
 * is visibly NOT fourths, which is a claim no strip can make, because a
 * strip is defined by a single denominator.
 *
 * An option is correct when its parts are all equal AND the shaded
 * parts total the target. Correctness is DERIVED, never authored, so a
 * diagram cannot disagree with its own description.
 */
export type AreaModelOption = {
  id: string;
  /** Part widths as fractions of the whole, left to right. Must sum to 1. */
  partWidths: ExactFraction[];
  /** Indices into `partWidths` that are shaded. */
  shadedIndices: number[];
  /** Screen-reader text. Describes the partition, not the answer. */
  altText: string;
  misconceptionId?: MisconceptionId;
  chapterMisconceptionId?: FractionsMisconceptionId;
};

export type AreaModelSelectionItem = Base & {
  format: 'area_model_selection';
  options: AreaModelOption[];
  /** The amount the student must find shaded, in equal parts. */
  targetValue: ExactFraction;
  /** Must the parts be equal for the option to count? Always true for
   *  a fraction; kept explicit so the rule is visible in the data. */
  requiresEqualParts: true;
};

export type InstructionalItem =
  | MultipleChoiceItem
  | NumericEntryItem
  | NumberLinePointItem
  | FractionStripItem
  | AreaModelSelectionItem;

// ---------------------------------------------------------------------------
// Exact rational helpers (integers only — no float ever reaches a verdict)
// ---------------------------------------------------------------------------

export function addFractions(a: ExactFraction, b: ExactFraction): ExactFraction {
  return {
    numerator: a.numerator * b.denominator + b.numerator * a.denominator,
    denominator: a.denominator * b.denominator,
  };
}

export function sumFractions(fs: ExactFraction[]): ExactFraction {
  return fs.reduce(addFractions, { numerator: 0, denominator: 1 });
}

/** True when every part is the same exact width. */
export function partsAreEqual(parts: ExactFraction[]): boolean {
  if (parts.length === 0) return false;
  return parts.every((p) => fractionsEqual(p, parts[0]));
}

/** The shaded amount of an area-model option, as an exact rational. */
export function shadedAmount(option: AreaModelOption): ExactFraction {
  return sumFractions(option.shadedIndices.map((i) => option.partWidths[i]));
}

// ---------------------------------------------------------------------------
// Responses and judging
// ---------------------------------------------------------------------------

export type Response =
  | { kind: 'choice'; choiceId: string }
  | { kind: 'fraction'; value: ExactFraction }
  | { kind: 'tick'; tickIndex: number }
  | { kind: 'strip'; stripIndex: number }
  | { kind: 'region'; optionId: string };

export type Judgement = {
  correct: boolean;
  feedback: string;
  /**
   * Non-null only when the response format can actually distinguish
   * the error, AND the error is one of the frozen §7.4 four.
   * Unchanged from v0.62 so existing callers and tests keep working.
   */
  misconceptionId: MisconceptionId | null;
  /** v0.68 §2 — the chapter-registry counterpart. */
  chapterMisconceptionId: FractionsMisconceptionId | null;
  /** v0.68 §2 — the unified reference, whichever source it came from. */
  misconceptionRef: MisconceptionRef | null;
};

/** The tick index's exact value — derived from integers, so a tick can
 *  be compared to a fraction without any float ever being involved. */
export function tickValue(
  min: ExactFraction,
  max: ExactFraction,
  partitions: number,
  tickIndex: number
): ExactFraction {
  // min + (tickIndex/partitions) * (max - min), in exact arithmetic.
  const spanNum = max.numerator * min.denominator - min.numerator * max.denominator;
  const spanDen = min.denominator * max.denominator;
  const addNum = spanNum * tickIndex;
  const addDen = spanDen * partitions;
  return {
    numerator: min.numerator * addDen + addNum * min.denominator,
    denominator: min.denominator * addDen,
  };
}

function correctJudgement(item: InstructionalItem): Judgement {
  return {
    correct: true,
    feedback: item.correctFeedback,
    misconceptionId: null,
    chapterMisconceptionId: null,
    misconceptionRef: null,
  };
}

function neutral(item: InstructionalItem): Judgement {
  return {
    correct: false,
    feedback: item.neutralIncorrectFeedback,
    misconceptionId: null,
    chapterMisconceptionId: null,
    misconceptionRef: null,
  };
}

/** Build the diagnosed verdict from a reference, through the resolver
 *  so the feedback text lives in exactly one place. */
function diagnosed(ref: MisconceptionRef): Judgement {
  const r = resolveMisconception(ref);
  return {
    correct: false,
    feedback: r.feedback,
    misconceptionId: ref.source === 'section_7_4_map' ? ref.id : null,
    chapterMisconceptionId:
      ref.source === 'fractions_chapter_registry' ? ref.id : null,
    misconceptionRef: ref,
  };
}

/**
 * The reference an authored option carries, if any.
 *
 * §7.4's legacy field wins when both are set, and
 * `auditItemMisconceptions` reports that combination as an authoring
 * error so it does not survive review.
 */
export function refForOption(o: {
  misconceptionId?: MisconceptionId | null;
  chapterMisconceptionId?: FractionsMisconceptionId;
}): MisconceptionRef | null {
  if (o.misconceptionId) return section74Ref(o.misconceptionId);
  if (o.chapterMisconceptionId) return chapterRef(o.chapterMisconceptionId);
  return null;
}

/**
 * v0.62 §9 — judging is EXACT.
 *
 * Every path compares integers by cross-multiplication. No branch
 * converts to decimal, so a student entering 1/3 is never judged
 * against 0.3333. Screen coordinates use floats; correctness does not.
 */
export function judge(item: InstructionalItem, r: Response): Judgement {
  switch (item.format) {
    case 'multiple_choice': {
      if (r.kind !== 'choice') return neutral(item);
      const chosen = item.choices.find((c) => c.id === r.choiceId);
      if (r.choiceId === item.correctChoiceId) return correctJudgement(item);
      // A distractor speaks for itself only when it was authored to
      // represent a specific error.
      const ref = chosen ? refForOption(chosen) : null;
      return ref ? diagnosed(ref) : neutral(item);
    }

    case 'numeric_entry': {
      if (r.kind !== 'fraction') return neutral(item);
      const exact =
        r.value.numerator === item.correctValue.numerator &&
        r.value.denominator === item.correctValue.denominator;
      const equivalent =
        item.acceptEquivalent && fractionsEqual(r.value, item.correctValue);
      if (exact || equivalent) return correctJudgement(item);

      // v0.68 §3 — an exact wrong value that admits one reading.
      // Deliberately NOT an equivalence match: 4/10 equals 2/5 but is
      // not evidence that the student added the denominators.
      const hit = item.diagnosticValues?.find(
        (d) =>
          d.value.numerator === r.value.numerator &&
          d.value.denominator === r.value.denominator
      );
      return hit ? diagnosed(chapterRef(hit.chapterMisconceptionId)) : neutral(item);
    }

    case 'select_point_on_number_line': {
      if (r.kind !== 'tick') return neutral(item);
      if (r.tickIndex === item.correctTickIndex) return correctJudgement(item);
      // An off-by-one to the LEFT is the counting-ticks-not-spaces
      // error, and the format DOES distinguish it — the student landed
      // exactly one tick short. Any other miss does not identify a
      // cause, so it gets neutral guidance rather than a guess.
      if (r.tickIndex === item.correctTickIndex - 1) {
        return diagnosed(section74Ref('counts_ticks_not_spaces'));
      }
      return neutral(item);
    }

    case 'fraction_strip_selection': {
      if (r.kind !== 'strip') return neutral(item);
      const strip = item.strips[r.stripIndex];
      if (!strip) return neutral(item);
      const value = {
        numerator: strip.shadedCount,
        denominator: strip.denominator,
      };
      return fractionsEqual(value, item.targetValue)
        ? correctJudgement(item)
        : neutral(item);
    }

    case 'area_model_selection': {
      if (r.kind !== 'region') return neutral(item);
      const option = item.options.find((o) => o.id === r.optionId);
      if (!option) return neutral(item);
      const equal = partsAreEqual(option.partWidths);
      const amount = shadedAmount(option);
      if (equal && fractionsEqual(amount, item.targetValue)) {
        return correctJudgement(item);
      }
      const ref = refForOption(option);
      return ref ? diagnosed(ref) : neutral(item);
    }
  }
}

// ---------------------------------------------------------------------------
// v0.68 §3 — authoring audit over the attachments themselves
// ---------------------------------------------------------------------------

export type ItemMisconceptionIssue = {
  itemId: string;
  optionId: string;
  issue:
    | 'both_sources_set'
    | 'unknown_id'
    | 'not_diagnosable'
    | 'attached_to_correct_option';
  detail: string;
};

/**
 * Every place an item claims to diagnose something, checked.
 *
 * Catches four things the type system cannot: a misconception attached
 * to the CORRECT option (which would tell a right answer it was a
 * known error), a non-diagnosable ID on a distractor, an unknown ID,
 * and both sources set at once.
 */
export function auditItemMisconceptions(
  items: InstructionalItem[]
): ItemMisconceptionIssue[] {
  const issues: ItemMisconceptionIssue[] = [];

  const check = (
    itemId: string,
    optionId: string,
    isCorrectOption: boolean,
    o: {
      misconceptionId?: MisconceptionId | null;
      chapterMisconceptionId?: FractionsMisconceptionId;
    }
  ) => {
    if (o.misconceptionId && o.chapterMisconceptionId) {
      issues.push({
        itemId,
        optionId,
        issue: 'both_sources_set',
        detail: `'${o.misconceptionId}' and '${o.chapterMisconceptionId}' both set`,
      });
    }
    const ref = refForOption(o);
    if (!ref) return;
    if (isCorrectOption) {
      issues.push({
        itemId,
        optionId,
        issue: 'attached_to_correct_option',
        detail: `'${ref.id}' is attached to the correct answer`,
      });
      return;
    }
    try {
      const resolved = resolveMisconception(ref);
      if (!resolved.diagnosable) {
        issues.push({
          itemId,
          optionId,
          issue: 'not_diagnosable',
          detail: `'${ref.id}' cannot be inferred from a single response`,
        });
      }
    } catch {
      issues.push({
        itemId,
        optionId,
        issue: 'unknown_id',
        detail: `'${ref.id}' is not in either source`,
      });
    }
  };

  for (const item of items) {
    if (item.format === 'multiple_choice') {
      for (const c of item.choices) {
        check(item.itemId, c.id, c.id === item.correctChoiceId, c);
      }
    }
    if (item.format === 'area_model_selection') {
      for (const o of item.options) {
        const isCorrect =
          partsAreEqual(o.partWidths) &&
          fractionsEqual(shadedAmount(o), item.targetValue);
        check(item.itemId, o.id, isCorrect, o);
      }
    }
    if (item.format === 'numeric_entry' && item.diagnosticValues) {
      for (const d of item.diagnosticValues) {
        const label = `${d.value.numerator}/${d.value.denominator}`;
        // A "diagnostic" value equal to the correct answer would fire
        // on a right answer.
        const isCorrect = fractionsEqual(d.value, item.correctValue);
        check(item.itemId, label, isCorrect, {
          chapterMisconceptionId: d.chapterMisconceptionId,
        });
      }
    }
  }
  return issues;
}

/** Structural validation of area-model options: parts must tile the
 *  whole exactly, and the shaded indices must exist. */
export function validateAreaModelItem(item: AreaModelSelectionItem): string[] {
  const e: string[] = [];
  for (const o of item.options) {
    const total = sumFractions(o.partWidths);
    if (!fractionsEqual(total, { numerator: 1, denominator: 1 })) {
      e.push(
        `${item.itemId}/${o.id}: parts sum to ${total.numerator}/${total.denominator}, not one whole`
      );
    }
    for (const i of o.shadedIndices) {
      if (i < 0 || i >= o.partWidths.length) {
        e.push(`${item.itemId}/${o.id}: shaded index ${i} does not exist`);
      }
    }
    if (new Set(o.shadedIndices).size !== o.shadedIndices.length) {
      e.push(`${item.itemId}/${o.id}: a part is shaded twice`);
    }
    if (!o.altText.trim()) e.push(`${item.itemId}/${o.id}: no alt text`);
  }
  const correct = item.options.filter(
    (o) =>
      partsAreEqual(o.partWidths) &&
      fractionsEqual(shadedAmount(o), item.targetValue)
  );
  if (correct.length !== 1) {
    e.push(
      `${item.itemId}: ${correct.length} options satisfy the target; exactly one must`
    );
  }
  return e;
}

// ---------------------------------------------------------------------------
// §11 — reading load
// ---------------------------------------------------------------------------

export const CLASS_6_8_STEM_WORD_LIMIT = 25;

export type ReadingLoadClass =
  | 'within_standard'
  | 'justified_exception'
  | 'rewrite_required';

export function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Classify a stem against the Classes 6-8 limit.
 *
 * `justifiedException` exists because a blanket limit would be a worse
 * rule than none: a multi-part reasoning task or a quoted source
 * passage can legitimately run long. The exception must be argued,
 * which is why it takes a rationale string rather than a boolean.
 */
export function classifyReadingLoad(
  stem: string,
  justification?: string
): { wordCount: number; classification: ReadingLoadClass } {
  const n = wordCount(stem);
  if (n <= CLASS_6_8_STEM_WORD_LIMIT) {
    return { wordCount: n, classification: 'within_standard' };
  }
  return {
    wordCount: n,
    classification: justification ? 'justified_exception' : 'rewrite_required',
  };
}
