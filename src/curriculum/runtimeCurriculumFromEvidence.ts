// ===========================================================================
// v0.83.1 §A — ONE CURRICULUM TRUTH, DERIVED NOT COPIED.
//
// v0.83 left a deliberate split: the master map knew Classes 1-5, 7 and 8,
// and `OFFICIAL_CURRICULA` — the model Student and Teacher read — still
// said "pending verification". That was honest for an evidence checkpoint
// and wrong as an architecture: two registries that can disagree will.
//
// This module removes the split WITHOUT creating a second hand-maintained
// registry. It derives the runtime curriculum for every NCERT-textbook
// grade from the same canonical evidence file the master map reads, so
// there is nothing to keep in step by hand:
//
//   mathCurriculumMasterEvidence.json
//        ├── curriculumMasterMap.ts  (master map, documents)
//        └── this module → OFFICIAL_CURRICULA → Student, Teacher, Admin
//
// Class 6 is NOT derived here. Its records are the accepted registry in
// officialChapters.ts / officialSections.ts, which carry section ids the
// authored lessons and review packages depend on. Classes 9-12 keep their
// CBSE syllabus entries, which are a different hierarchy entirely.
//
// TERMINOLOGY IS PRESERVED
//   Classes 1-5 define chapters and no numbered sections. That is
//   recorded as "the source defines no sub-level", NOT as zero sections
//   and NOT as "not read yet".
//   Classes 7-8 are two-part books whose Part II restarts at Chapter 1.
//   The source number is kept exactly as printed and the part is carried
//   alongside it, so the UI can say "Part II · Chapter 1" without
//   renumbering anything.
// ===========================================================================

import type { Grade } from '../types';
import type {
  OfficialCurriculum,
  OfficialUnit,
  OfficialTopic,
} from './officialCurriculum';
import evidenceJson from './data/mathCurriculumMasterEvidence.json';

type EvidenceSource = {
  sourceId: string;
  grade: number;
  title: string;
  printedSubtitle: string;
  part: string | null;
  prelimsUrl: string;
  archiveUrl: string | null;
  currentApplicability: string;
  inspectedOn: string;
  levels: Record<string, string>;
  levelEvidence: string;
};
type EvidenceRecord = {
  recordId: string;
  sourceId: string;
  grade: number;
  level: string;
  number: string;
  title: string;
  descriptor?: string | null;
  parentId: string | null;
  startPage: number | null;
};

const EV = evidenceJson as unknown as {
  sources: EvidenceSource[];
  records: EvidenceRecord[];
};

/** Grades whose runtime curriculum is derived here. Class 6 keeps its
 *  accepted registry; Classes 9-12 keep their CBSE syllabus entries. */
export const EVIDENCE_DERIVED_GRADES: Grade[] = [
  'class1',
  'class2',
  'class3',
  'class4',
  'class5',
  'class7',
  'class8',
];

const STAGE: Record<number, OfficialCurriculum['stage']> = {
  1: 'foundational',
  2: 'foundational',
  3: 'preparatory',
  4: 'preparatory',
  5: 'preparatory',
  7: 'middle',
  8: 'middle',
};

const classNumber = (g: Grade) => Number(g.replace('class', ''));

function sectionsOf(chapterId: string): OfficialTopic[] {
  return EV.records
    .filter((r) => r.parentId === chapterId && r.level === 'section')
    .map((s) => ({
      officialTopicId: s.recordId,
      title: s.title,
      number: Number(s.number.split('.')[1]),
    }));
}

/**
 * The runtime curriculum for one evidence-derived grade, or null.
 *
 * Every chapter the source prints is included whether or not Pragati has
 * content for it. Availability is decided elsewhere; presence is decided
 * by the book.
 */
export function evidenceCurriculumForGrade(grade: Grade): OfficialCurriculum | null {
  if (!EVIDENCE_DERIVED_GRADES.includes(grade)) return null;
  const n = classNumber(grade);
  const books = EV.sources.filter((s) => s.grade === n);
  if (books.length === 0) return null;

  const sectionsDefined = books.every(
    (b) => b.levels.section === 'primary_source_verified'
  );

  const units: OfficialUnit[] = books.flatMap((b) =>
    EV.records
      .filter((r) => r.sourceId === b.sourceId && r.level === 'chapter')
      .map((c) => {
        const topics = sectionsOf(c.recordId);
        return {
          officialUnitId: c.recordId,
          // The number the book prints. Part II restarts at 1 and is left
          // that way; `bookPart` is what makes the pair distinguishable.
          number: Number(c.number),
          title: c.title,
          level: 'chapter' as const,
          bookPart: b.part,
          bookTitle: b.title,
          startPage: c.startPage,
          chapters: [],
          chaptersEstablished: false,
          topics,
          // True: the book was read at section depth. For Classes 1-5 the
          // book defines no sections at all, which is the next field.
          topicsKnown: sectionsDefined,
          subLevelDefinedBySource: sectionsDefined,
        };
      })
  );

  const title = books.length > 1
    ? `${books[0].title.replace(/[ -]?(Part[- ]?I+)$/i, '').replace(/-II$/, '').trim()} — ${books[0].printedSubtitle.replace(/\s*\(Part.*\)$/, '')} (Parts I and II)`
    : `${books[0].title} — ${books[0].printedSubtitle}`;

  return {
    officialCurriculumId: `ncert_math_${grade}`,
    grade,
    subject: 'mathematics',
    stage: STAGE[n],
    authority: 'NCERT',
    documentTitle: title,
    academicYear: '2026-27',
    edition: books.map((b) => `${b.part ? `${b.part}: ` : ''}${b.currentApplicability}`).join('; '),
    sourceUrl: books[0].archiveUrl ?? books[0].prelimsUrl,
    inspectionDate: books[0].inspectedOn,
    status: 'primary_source_verified',
    bookIdentityStatus: 'primary_source_verified',
    structureVerificationStatus: 'primary_source_verified',
    topLevel: 'chapter',
    evidenceNote:
      `Derived from the canonical curriculum evidence (inspected ${books[0].inspectedOn}). ` +
      books.map((b) => `${b.part ?? 'Single volume'}: ${b.levelEvidence}`).join(' ') +
      ` This is a chapter-${sectionsDefined ? ' and section-' : ''}level denominator. ` +
      'Structure verified is not the same claim as intent inspected: the ' +
      'mathematical intent of these pages has not been read, and no lesson ' +
      'may be authored from a title alone.',
    units,
    manualVerificationStep: null,
  };
}

export function evidenceDerivedCurricula(): OfficialCurriculum[] {
  return EVIDENCE_DERIVED_GRADES.map((g) => evidenceCurriculumForGrade(g)!).filter(Boolean);
}
