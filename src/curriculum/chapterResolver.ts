// v0.48 §1 — Canonical chapter resolver.
//
// One function that turns any chapter identifier a UI may pass around
// into a fully-populated ChapterInventory plus display metadata. No
// mutation. No render-time push/pop on STATIC_MAPPING.
//
// Handles four cases:
//   1. `official:<officialChapterId>` — a real OfficialChapterRecord.
//   2. `<officialChapterId>` (no prefix) — same as (1), for legacy IDs.
//   3. `legacy:<legacyModuleId>` — a Pragati module that has no
//       OfficialChapterRecord row yet. Synthesised inline WITHOUT
//       touching global state.
//   4. Any other input — returns null so the shell can render its
//      truthful "Chapter not found" page instead of launching content.

import type { Grade, ModuleId } from '../types';
import { MODULE_GRADE, MODULE_LABELS, MODULE_DESCRIPTIONS } from '../types';
import { OFFICIAL_CHAPTERS, type OfficialChapterRecord } from './officialChapters';
import { STATIC_MAPPING, type StaticMappingRow } from './contentMapping';
import { inventoryChapterWith, type ChapterInventory } from './inventory';

export type ResolvedChapterKind =
  /** Mapped official chapter — the reviewer confirms Pragati has
   *  content that claims to cover it. */
  | 'mapped_official'
  /** Official chapter with no Pragati mapping yet — visible in
   *  coverage as a genuine gap. */
  | 'unmapped_official'
  /** A Pragati module that has never been paired with an official
   *  chapter — surfaced honestly for continuity. */
  | 'legacy_module';

export type ResolvedChapter = {
  kind: ResolvedChapterKind;
  chapterId: string;
  grade: Grade;
  displayTitle: string;
  displaySubtitle: string;
  /** The (possibly synthetic) OfficialChapterRecord passed to
   *  `inventoryChapterWith`. Callers may render its verification
   *  status pill directly. */
  officialRecord: OfficialChapterRecord;
  /** Present when the chapter maps to at least one Pragati module. */
  primaryLegacyModuleId: ModuleId | null;
  inventory: ChapterInventory;
};

/** Resolve any chapter identifier the UI passes around. Returns
 *  null when the identifier is not recognised at all. */
export function resolveChapter(chapterId: string): ResolvedChapter | null {
  if (!chapterId || typeof chapterId !== 'string') return null;

  // --- Case 3: legacy:<moduleId> ---
  if (chapterId.startsWith('legacy:')) {
    const modId = chapterId.slice('legacy:'.length) as ModuleId;
    if (!(modId in MODULE_GRADE)) return null;
    return resolveLegacyModule(modId);
  }

  // --- Case 1/2: official chapter (with or without prefix) ---
  const officialId = chapterId.startsWith('official:')
    ? chapterId.slice('official:'.length)
    : chapterId;
  const record = OFFICIAL_CHAPTERS.find(
    (c) => c.officialChapterId === officialId
  );
  if (!record) return null;

  const staticRow = STATIC_MAPPING.find(
    (r) => r.officialChapterId === record.officialChapterId
  );
  const inventory = inventoryChapterWith(record, staticRow);
  const primaryLegacyModuleId = inventory.mapping.legacyModuleIds[0] ?? null;

  return {
    kind: staticRow ? 'mapped_official' : 'unmapped_official',
    chapterId: `official:${record.officialChapterId}`,
    grade: record.grade,
    displayTitle:
      record.officialTitle ??
      (primaryLegacyModuleId
        ? MODULE_LABELS[primaryLegacyModuleId]
        : 'Chapter'),
    displaySubtitle: staticRow
      ? primaryLegacyModuleId
        ? MODULE_DESCRIPTIONS[primaryLegacyModuleId]
        : ''
      : 'Not yet mapped to Pragati content.',
    officialRecord: record,
    primaryLegacyModuleId,
    inventory,
  };
}

/** Build a ResolvedChapter for a Pragati module that has no
 *  OfficialChapterRecord row. Pure function — no mutation. */
function resolveLegacyModule(modId: ModuleId): ResolvedChapter {
  const synthetic: OfficialChapterRecord = {
    officialChapterId: `legacy:${modId}`,
    curriculum: 'CBSE_NCERT',
    curriculumVersion: null,
    grade: MODULE_GRADE[modId],
    subject: 'mathematics',
    officialChapterNumber: null,
    officialTitle: null,
    textbookTitle: null,
    sourceReference: null,
    edition: null,
    dateVerified: null,
    verificationStatus: 'unverified',
    notes: '',
  };
  const staticRow: StaticMappingRow = {
    officialChapterId: synthetic.officialChapterId,
    legacyModuleIds: [modId],
    mappingType: 'exact',
    notes:
      'Synthetic legacy mapping — Pragati module has no OfficialChapterRecord row yet.',
  };
  const inventory = inventoryChapterWith(synthetic, staticRow);
  return {
    kind: 'legacy_module',
    chapterId: synthetic.officialChapterId,
    grade: MODULE_GRADE[modId],
    displayTitle: MODULE_LABELS[modId],
    displaySubtitle: MODULE_DESCRIPTIONS[modId],
    officialRecord: synthetic,
    primaryLegacyModuleId: modId,
    inventory,
  };
}

/** Explicit "belongs to this grade?" check for cross-grade guard. */
export function chapterBelongsToGrade(
  resolved: ResolvedChapter,
  studentGrade: Grade
): boolean {
  return resolved.grade === studentGrade;
}
