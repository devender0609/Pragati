// v0.68 §2 — ONE MISCONCEPTION MODEL, TWO SOURCES.
//
// THE DEFECT THIS FIXES
//
// v0.67 §10 found two distractors carrying the wrong misconception ID
// and had to set both to `null`. The correct IDs
// (`compare_numerators_only`, `add_numerators_and_denominators`) existed
// in the chapter registry, but `Choice.misconceptionId` was typed to the
// four-value §7.4 enum and widening that enum would have changed the
// frozen fingerprint `a1a3ff57`. A wrong diagnosis is worse than none,
// so v0.67 shipped none — which left two real, diagnosable errors
// receiving generic guidance.
//
// THE FIX
//
// A reference, not an enum widening:
//
//   { source: 'section_7_4_map',            id: MisconceptionId }
//   { source: 'fractions_chapter_registry', id: FractionsMisconceptionId }
//
// `Choice` keeps `misconceptionId` exactly as it was and gains an
// OPTIONAL `chapterMisconceptionId`. §7.4's six practice items do not
// set the new field, so `JSON.stringify` omits it and the serialised
// payload is byte-identical. The fingerprint test proves this rather
// than the comment asserting it.
//
// WHY NOT COPY THE FEEDBACK ONTO EACH ITEM
//
// Because then correcting a wrong sentence means finding every item
// that repeated it. Feedback stays in one record per misconception and
// is resolved at judging time.
//
// THE RULE ON DIAGNOSIS, RESTATED AND NOW ENFORCED
//
// A misconception may be attached to a response only when that response
// could not plausibly have come from something else. Two registry
// entries are marked `diagnosticSignal: null` precisely because they
// cannot be inferred from one answer; `assertDiagnosable` refuses them,
// and `auditItemMisconceptions` refuses them at the whole-chapter level
// so authoring cannot quietly reintroduce the v0.67 defect.

import {
  MISCONCEPTION_FEEDBACK,
  type MisconceptionId,
} from './section74Misconceptions';
import {
  FRACTIONS_MISCONCEPTIONS,
  type FractionsMisconceptionId,
  type MisconceptionRecord,
} from './fractionsMisconceptions';

export type MisconceptionSource =
  /** The four values frozen inside the §7.4 fingerprint payload. */
  | 'section_7_4_map'
  /** The nine-entry chapter registry the other eight sections use. */
  | 'fractions_chapter_registry';

export type MisconceptionRef =
  | { source: 'section_7_4_map'; id: MisconceptionId }
  | { source: 'fractions_chapter_registry'; id: FractionsMisconceptionId };

export type ResolvedMisconception = {
  ref: MisconceptionRef;
  /** The exact sentence the student sees. */
  feedback: string;
  /**
   * Can this error be inferred from a single response?
   *
   * The §7.4 four are all diagnosable — each is attached only to a
   * distractor or an off-by-one that admits no other reading. Registry
   * entries carry their own `diagnosticSignal`, and a null signal means
   * no.
   */
  diagnosable: boolean;
  /** Present only for registry entries; the §7.4 map has no records. */
  record: MisconceptionRecord | null;
};

const REGISTRY = new Map(FRACTIONS_MISCONCEPTIONS.map((m) => [m.id, m]));

export function isSection74MisconceptionId(id: string): id is MisconceptionId {
  return Object.prototype.hasOwnProperty.call(MISCONCEPTION_FEEDBACK, id);
}

export function isChapterMisconceptionId(
  id: string
): id is FractionsMisconceptionId {
  return REGISTRY.has(id as FractionsMisconceptionId);
}

/**
 * Resolve a reference to the feedback a student will actually read.
 *
 * Throws on an unknown ID rather than falling back to neutral text. A
 * silent fallback would let a typo ship as "the error could not be
 * identified", which is indistinguishable from the deliberate neutral
 * case and would hide the bug forever.
 */
export function resolveMisconception(
  ref: MisconceptionRef
): ResolvedMisconception {
  if (ref.source === 'section_7_4_map') {
    if (!isSection74MisconceptionId(ref.id)) {
      throw new Error(`unknown §7.4 misconception '${ref.id}'`);
    }
    return {
      ref,
      feedback: MISCONCEPTION_FEEDBACK[ref.id],
      diagnosable: true,
      record: null,
    };
  }
  const rec = REGISTRY.get(ref.id);
  if (!rec) throw new Error(`unknown chapter misconception '${ref.id}'`);
  return {
    ref,
    feedback: rec.feedback,
    diagnosable: rec.diagnosticSignal !== null,
    record: rec,
  };
}

/**
 * Guard for authoring: a misconception that cannot be inferred from a
 * response must never be attached to one.
 *
 * `parts_count_vs_part_size` is the case that matters. A student who
 * answers 2/8 for 1/4 + 1/4 might be confusing count with size — or
 * might have added the denominators, or mis-copied. Telling them which
 * one they did is a guess wearing the clothes of a diagnosis.
 */
export function assertDiagnosable(ref: MisconceptionRef): ResolvedMisconception {
  const r = resolveMisconception(ref);
  if (!r.diagnosable) {
    throw new Error(
      `misconception '${ref.id}' is not diagnosable from a single response and must not be attached to a distractor`
    );
  }
  return r;
}

/** Convenience for the common case: a chapter-registry reference. */
export function chapterRef(id: FractionsMisconceptionId): MisconceptionRef {
  return { source: 'fractions_chapter_registry', id };
}

/** Convenience for the frozen §7.4 four. */
export function section74Ref(id: MisconceptionId): MisconceptionRef {
  return { source: 'section_7_4_map', id };
}

export type MisconceptionAttachmentError = {
  itemId: string;
  optionId: string;
  id: string;
  reason: 'unknown_id' | 'not_diagnosable';
};

/**
 * Whole-chapter validation over authored attachments.
 *
 * Takes plain records rather than `InstructionalItem` so this module
 * stays free of the import cycle described at the top of the file.
 */
export function auditMisconceptionAttachments(
  attachments: Array<{ itemId: string; optionId: string; ref: MisconceptionRef }>
): MisconceptionAttachmentError[] {
  const errors: MisconceptionAttachmentError[] = [];
  for (const a of attachments) {
    try {
      assertDiagnosable(a.ref);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({
        itemId: a.itemId,
        optionId: a.optionId,
        id: a.ref.id,
        reason: message.includes('unknown') ? 'unknown_id' : 'not_diagnosable',
      });
    }
  }
  return errors;
}
