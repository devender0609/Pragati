// v0.47 F — Design primitive: status badge.
//
// Renders a coloured pill for the DerivedStatus values produced by
// the inventory function. Same tokens as the rest of the app so a
// palette change only edits tokens.ts.

import { SEMANTIC } from '../tokens';
import {
  DERIVED_STATUS_LABEL,
  type DerivedStatus,
} from '../../curriculum/inventory';

const TONE: Record<DerivedStatus, string> = {
  no_content: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
  shell: `${SEMANTIC.warning.tintBg} ${SEMANTIC.warning.text} ring-1 ${SEMANTIC.warning.tintRing}`,
  assessment_prototype: `${SEMANTIC.warning.tintBg} ${SEMANTIC.warning.text} ring-1 ${SEMANTIC.warning.tintRing}`,
  lesson_prototype: `${SEMANTIC.warning.tintBg} ${SEMANTIC.warning.text} ring-1 ${SEMANTIC.warning.tintRing}`,
  partial_prototype: `${SEMANTIC.warning.tintBg} ${SEMANTIC.warning.text} ring-1 ${SEMANTIC.warning.tintRing}`,
  prototype_ready_review: `${SEMANTIC.info.tintBg} ${SEMANTIC.info.text} ring-1 ${SEMANTIC.info.tintRing}`,
  teacher_reviewed: `${SEMANTIC.success.tintBg} ${SEMANTIC.success.text} ring-1 ${SEMANTIC.success.tintRing}`,
  pilot_ready: `${SEMANTIC.success.tintBg} ${SEMANTIC.success.text} ring-1 ${SEMANTIC.success.tintRing}`,
  published: `${SEMANTIC.success.tintBg} ${SEMANTIC.success.text} ring-1 ${SEMANTIC.success.tintRing}`,
};

export function StatusBadge({
  status,
  title,
  label,
}: {
  status: DerivedStatus;
  /** Reviewer tooltip explaining WHY the status is what it is. */
  title?: string;
  /** v0.50 §5 — plain-language override for student surfaces. When
   *  omitted the authoring vocabulary is used, which is correct for
   *  teacher and admin screens. */
  label?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${TONE[status]}`}
    >
      {label ?? DERIVED_STATUS_LABEL[status]}
    </span>
  );
}
