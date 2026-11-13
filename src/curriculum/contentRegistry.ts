// v0.50 §14 — Content loading architecture.
//
// THE PROBLEM THIS SOLVES
//
// All curriculum currently lives in three giant eagerly-imported files:
//
//   data/items.ts    — every question for every grade
//   data/lessons.ts  — every lesson (~4,500 lines)
//   types.ts         — every SkillId, ModuleId, and label as a union
//
// That is why the bundle warns at >500 kB. It is survivable at today's
// volume; it is not survivable at Classes 1–12. Adding twelve grades of
// content to these files would put every grade's questions into every
// student's initial download.
//
// THE SHAPE
//
// Content is addressed by a stable key and loaded through a registry:
//
//   curriculum/cbse/grade-01/mathematics/<chapter>/{items,lessons}.ts
//   curriculum/cbse/grade-06/mathematics/fractions/{items,lessons}.ts
//
// A chapter is the unit of splitting: it is the largest thing a student
// interacts with in one sitting, and the smallest thing a teacher
// assigns. `import()` at chapter granularity means a Class 1 student
// downloads Class 1 content only.
//
// WHAT THIS FILE DOES AND DOES NOT DO
//
// It establishes the registry, the key format, the loader, and the
// adapter that keeps every legacy ID working. It does NOT move any
// existing content — see MIGRATION_PLAN below. Nothing is migrated in
// v0.50 because moving content and changing the loader in the same
// step makes a regression impossible to attribute.

import type { Item } from '../data/items';
import type { Lesson } from '../data/lessons';
import type { Grade, ModuleId, SkillId } from '../types';

/** Stable address for one chapter's content. */
export type ContentKey = {
  curriculum: 'cbse';
  grade: Grade;
  subject: 'mathematics';
  /** Chapter slug, e.g. 'fractions'. Stable across editions. */
  chapter: string;
};

export function contentKeyToPath(key: ContentKey): string {
  const n = key.grade.replace('class', '').padStart(2, '0');
  return `curriculum/${key.curriculum}/grade-${n}/${key.subject}/${key.chapter}`;
}

export type ChapterContent = {
  key: ContentKey;
  items: Item[];
  lessons: Partial<Record<SkillId, Lesson>>;
  /** Legacy module this chapter's content currently belongs to, so the
   *  adapter can answer module-shaped queries during migration. */
  legacyModuleId: ModuleId | null;
};

/** A chapter's content, loaded on demand. */
export type ChapterContentLoader = () => Promise<ChapterContent>;

/**
 * The registry. Entries are loaders, NOT content — registering a
 * chapter must never pull its questions into the main bundle.
 *
 * Empty in v0.50 by design: the loader path is proven by tests and by
 * the bundled-content adapter, and real content moves in v0.51 one
 * chapter at a time.
 */
const REGISTRY = new Map<string, ChapterContentLoader>();

export function registerChapterContent(
  key: ContentKey,
  loader: ChapterContentLoader
): void {
  REGISTRY.set(contentKeyToPath(key), loader);
}

export function registeredChapterPaths(): string[] {
  return Array.from(REGISTRY.keys()).sort();
}

/** Chapters registered for a grade. Used to decide what to prefetch. */
export function registeredChaptersForGrade(grade: Grade): string[] {
  const n = grade.replace('class', '').padStart(2, '0');
  return registeredChapterPaths().filter((p) =>
    p.includes(`/grade-${n}/`)
  );
}

const cache = new Map<string, Promise<ChapterContent>>();

/**
 * Load a chapter's content, memoised.
 *
 * Returns null for an unregistered chapter rather than throwing: during
 * migration most chapters are still served from the bundled files, and
 * a missing registry entry is the normal case, not an error.
 */
export function loadChapterContent(
  key: ContentKey
): Promise<ChapterContent> | null {
  const path = contentKeyToPath(key);
  const loader = REGISTRY.get(path);
  if (!loader) return null;
  const existing = cache.get(path);
  if (existing) return existing;
  const p = loader();
  cache.set(path, p);
  return p;
}

/** Test seam. Never call from application code. */
export function __resetContentRegistry(): void {
  REGISTRY.clear();
  cache.clear();
}

// ---------------------------------------------------------------------------
// LEGACY ADAPTER
//
// Every existing SkillId, ModuleId, item id, and stored session must
// keep working unchanged. Callers ask for content by legacy module; the
// adapter answers from the registry when a chapter has been migrated,
// and from the bundled arrays when it has not.
// ---------------------------------------------------------------------------

export type LegacyContentSource = {
  items: Item[];
  lessonFor: (skill: SkillId) => Lesson;
};

export async function itemsForModule(
  moduleId: ModuleId,
  grade: Grade,
  chapterSlug: string,
  legacy: LegacyContentSource
): Promise<Item[]> {
  const loaded = loadChapterContent({
    curriculum: 'cbse', grade, subject: 'mathematics', chapter: chapterSlug,
  });
  if (loaded) {
    const content = await loaded;
    if (content.items.length > 0) return content.items;
  }
  // Not migrated yet — serve from the bundled arrays. Identical result,
  // so a half-migrated catalogue behaves consistently.
  return legacy.items.filter(
    (i) => (i as { moduleId?: ModuleId }).moduleId === moduleId
  );
}

// ---------------------------------------------------------------------------
// MIGRATION PLAN (§14 requires this be stated before content moves)
//
// Step 0 — v0.50 (this iteration)
//   Registry, key format, loader, and adapter exist and are tested.
//   No content moves. Bundle size is unchanged.
//
// Step 1 — one chapter, both ways
//   Move Class 6 Fractions items+lessons into
//   curriculum/cbse/grade-06/mathematics/fractions/. Register it.
//   Keep the bundled copy in place. Assert both sources produce
//   IDENTICAL item ids and lesson content. This proves the loader
//   without risking the reference chapter.
//
// Step 2 — remove the bundled copy for that chapter
//   Delete the Fractions rows from data/items.ts. Run the full suite
//   plus a session-replay test over stored v0.49 sessions to prove no
//   stored record breaks. Measure the bundle: it must drop.
//
// Step 3 — remaining Class 6 chapters, one per commit
//   Each commit: move one chapter, run tests, check bundle size.
//
// Step 4 — SkillId unions
//   types.ts unions are the remaining eager dependency. Replace the
//   compile-time union with a runtime registry plus a branded string
//   type. This is the riskiest step and gets its own iteration; it
//   must not be bundled with content authoring.
//
// Step 5 — new grades are authored directly into the new layout
//   Classes 1–5 and 8–12 never enter data/items.ts at all.
//
// ROLLBACK: through Step 3 the bundled copy is the fallback, so
// reverting a chapter is a one-line registry deletion.
// ---------------------------------------------------------------------------

export const MIGRATION_STEPS = [
  'registry_and_loader',
  'dual_source_one_chapter',
  'remove_bundled_copy',
  'remaining_chapters',
  'skill_id_registry',
  'new_grades_native',
] as const;

export type MigrationStep = (typeof MIGRATION_STEPS)[number];

/** Where the migration currently stands. Rendered in Admin & Research
 *  so the state is visible rather than tribal knowledge. */
export const CURRENT_MIGRATION_STEP: MigrationStep = 'registry_and_loader';
