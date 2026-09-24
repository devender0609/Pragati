// v0.69 §41 — the release's own guarantees.
//
// Three things are being defended here at once: that the visual work
// changed nothing about what a student may reach, that unit/chapter/
// topic stay distinct, and that the manual verification workflow cannot
// accept a half-read contents page.

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  officialUnitCount,
  officialChapterCount,
  officialTopicCount,
  officialSectionCount,
  officialCurriculumForGrade,
  officialChapterList,
  chaptersEstablished,
  structureNoun,
  OFFICIAL_CURRICULA,
} from '../officialCurriculum';
import { gradeCurriculumView } from '../officialCurriculumStudentModel';
import {
  validateManualSubmission,
  submissionIsImportable,
  submissionToCurriculum,
  parseSubmission,
  blankSubmissionTemplate,
  type ManualCurriculumSubmission,
} from '../manualCurriculumImport';
import { auditAllGrades, checkRegistryInvariants } from '../curriculumCompletenessAudit';
import { computeContentFingerprint, section74Artifact } from '../contentArtifact';
import { fractionsSectionCards, class6ChapterCards } from '../studentChapterModel';
import { sectionEligibility } from '../eligibilityPolicy';
import { mayPublishSection } from '../publicationGate';
import { fractionsChapterSections, authoredSectionById } from '../fractionsChapter';
import { judge, auditItemMisconceptions } from '../instructionalInteraction';
import { distractorAuditSummary } from '../distractorAudit';
import { Class6ChapterList, FractionsChapterLanding } from '../../features/student/Class6Learn';
import { motifForChapter, chapterAccent } from '../../design/ChapterMotif';
import { OFFICIAL_CHAPTERS } from '../officialChapters';

// ---------------------------------------------------------------------------
// §19/§20 — unit, chapter and topic are three different things
// ---------------------------------------------------------------------------

describe('§19 the three structural levels stay distinct', () => {
  it('declares a top level for every curriculum', () => {
    for (const c of OFFICIAL_CURRICULA) {
      expect(['unit', 'chapter']).toContain(c.topLevel);
    }
  });

  it('treats a CBSE syllabus as units and an NCERT textbook as chapters', () => {
    expect(structureNoun('class6').plural).toBe('chapters');
    for (const g of ['class9', 'class10', 'class11', 'class12'] as const) {
      expect(structureNoun(g).plural, g).toBe('units');
    }
  });

  it('counts units and chapters separately, and neither stands in for the other', () => {
    // Class 10: 7 units, 15 topics, and NO known chapter count.
    expect(officialUnitCount('class10')).toBe(7);
    expect(officialTopicCount('class10')).toBe(15);
    expect(officialChapterCount('class10')).toBeNull();
    // Class 9: 6 units AND 15 chapters, because its syllabus names them.
    expect(officialUnitCount('class9')).toBe(6);
    expect(officialChapterCount('class9')).toBe(15);
    // Class 6: the entries ARE chapters.
    expect(officialChapterCount('class6')).toBe(10);
  });

  // v0.83.3 §3 — Classes 10-12 DO have chapters now, but not because a
  // syllabus topic resembled one: the textbooks were read. The original
  // rule is what still matters, so it is asserted directly — the chapter
  // list comes from the NCERT books and does NOT equal the CBSE units.
  it('takes Classes 10-12 chapters from the textbook, never from syllabus topics', () => {
    const expected = { class10: 14, class11: 14, class12: 13 } as const;
    for (const g of ['class10', 'class11', 'class12'] as const) {
      const list = officialChapterList(g)!;
      expect(list, g).not.toBeNull();
      expect(list.length, g).toBe(expected[g]);
      // The CBSE syllabus for these grades has units and topics and no
      // chapters; the two hierarchies remain separate.
      expect(officialCurriculumForGrade(g)!.topLevel, g).toBe('unit');
      expect(chaptersEstablished(g), g).toBe(false);
    }
  });
});

describe('§20 Class 10 must not call its 7 units chapters', () => {
  it('labels the student view with the source\'s own noun', () => {
    const v = gradeCurriculumView('class10');
    if (v.kind !== 'verified') throw new Error('expected verified');
    expect(v.chapters).toHaveLength(7);
    expect(v.entryNoun.plural).toBe('units');
    // The v0.68 defect, stated as a test: this string said "7 chapters".
    expect(v.summaryLine).toContain('units');
    expect(v.summaryLine).not.toContain('chapters');
  });

  // v0.83.3 §4 — Class 9 shows the EIGHT verified Ganita Manjari Part I
  // chapters, not the CBSE syllabus's fifteen chapter names. Mapping the
  // fifteen onto the eight would be an invented crosswalk, and claiming
  // fifteen would claim a book that is not published.
  it('shows Class 9 as its eight verified Part I chapters', () => {
    const v = gradeCurriculumView('class9');
    if (v.kind !== 'verified') throw new Error('expected verified');
    expect(v.chapters).toHaveLength(8);
    expect(v.entryNoun.plural).toBe('chapters');
    // The CBSE syllabus still names fifteen, separately.
    expect(officialCurriculumForGrade('class9')!.units.flatMap((u) => u.chapters)).toHaveLength(15);
  });

  it('keeps Class 6 exactly as it was', () => {
    const v = gradeCurriculumView('class6');
    if (v.kind !== 'verified') throw new Error('expected verified');
    expect(v.chapters).toHaveLength(10);
    expect(v.entryNoun.plural).toBe('chapters');
  });

  it('never renders an unknown count as zero', () => {
    for (const r of auditAllGrades()) {
      if (r.registryStatus !== 'primary_source_verified') {
        expect(r.officialUnitsKnown, r.gradeLabel).toBeNull();
        expect(r.officialChaptersKnown, r.gradeLabel).toBeNull();
      }
    }
    expect(checkRegistryInvariants()).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §16/§17 — manual verification
// ---------------------------------------------------------------------------

const GOOD: ManualCurriculumSubmission = {
  grade: 'class7',
  officialBookTitle: 'Ganita Prakash, Grade 7',
  academicYear: '2026-27',
  edition: 'First Edition April 2025, Reprint 2026-27',
  source: 'printed copy, school library',
  verifier: 'A. Sharma',
  inspectionDate: '2026-08-28',
  chapters: [
    { number: 1, title: 'Large Numbers Around Us' },
    { number: 2, title: 'Arithmetic Expressions' },
    { number: 3, title: 'A Peek Beyond the Point' },
  ],
};

describe('§16-§17 the manual ingestion workflow', () => {
  // v0.83.1 §A/§12 — this workflow existed because seven grades had no
  // primary reading. All of them now do, so the interesting behaviour is
  // the refusal: an import must NOT be able to overwrite verified
  // evidence. The shape checks below still run on the same submission.
  it('refuses to import over a grade that is already primary-source verified', () => {
    const issues = validateManualSubmission(GOOD);
    expect(issues.some((i) => /already primary-source verified/i.test(i.message))).toBe(true);
    expect(submissionIsImportable(GOOD)).toBe(false);
    expect(submissionToCurriculum(GOOD)).toBeNull();
  });

  it('refuses a blank title rather than inferring one', () => {
    const bad = { ...GOOD, chapters: [{ number: 1, title: '' }] };
    const issues = validateManualSubmission(bad);
    expect(issues.some((i) => /do not guess/i.test(i.message))).toBe(true);
    expect(submissionToCurriculum(bad)).toBeNull();
  });

  it('catches duplicate chapter numbers', () => {
    const bad = {
      ...GOOD,
      chapters: [
        { number: 1, title: 'One' },
        { number: 1, title: 'Two' },
      ],
    };
    expect(validateManualSubmission(bad).some((i) => /more than once/.test(i.message))).toBe(true);
  });

  it('catches a gap in the numbering, which is the likeliest real mistake', () => {
    const bad = {
      ...GOOD,
      chapters: [
        { number: 1, title: 'One' },
        { number: 3, title: 'Three' },
      ],
    };
    expect(validateManualSubmission(bad).some((i) => /jumps/.test(i.message))).toBe(true);
  });

  it('requires an attributable verifier', () => {
    for (const name of ['', 'admin', 'test', 'unknown']) {
      expect(submissionIsImportable({ ...GOOD, verifier: name }), name).toBe(false);
    }
  });

  it('requires a real inspection date', () => {
    expect(submissionIsImportable({ ...GOOD, inspectionDate: 'yesterday' })).toBe(false);
    expect(submissionIsImportable({ ...GOOD, inspectionDate: '' })).toBe(false);
  });

  it('refuses to overwrite an already-verified grade', () => {
    const issues = validateManualSubmission({ ...GOOD, grade: 'class6' });
    expect(issues.some((i) => /already primary-source verified/.test(i.message))).toBe(true);
  });

  it('reports duplicate section numbers inside a chapter', () => {
    const bad: ManualCurriculumSubmission = {
      ...GOOD,
      chapters: [
        {
          number: 1,
          title: 'One',
          sections: [
            { number: '1.1', title: 'A' },
            { number: '1.1', title: 'B' },
          ],
        },
      ],
    };
    expect(validateManualSubmission(bad).some((i) => /repeated/.test(i.message))).toBe(true);
  });

  it('distinguishes "no sections read" from "chapter has no sections"', () => {
    // v0.83.1 — and the third state, now that Classes 1-5 are verified:
    // a book that defines NO section level reports null sections rather
    // than 0, without claiming its depth was never read.
    expect(officialTopicCount('class7')).toBeNull();
    expect(officialSectionCount('class7')).toBe(65);
    expect(officialSectionCount('class3')).toBeNull();
    expect(
      officialCurriculumForGrade('class3')!.units.every(
        (u: { subLevelDefinedBySource?: boolean; topics: unknown[] }) =>
          u.subLevelDefinedBySource === false && u.topics.length === 0
      )
    ).toBe(true);
  });

  it('returns issues instead of throwing on malformed JSON', () => {
    const r = parseSubmission('{ not json');
    expect(r.submission).toBeNull();
    expect(r.issues[0].severity).toBe('error');
  });

  it('offers a blank template that is deliberately not importable', () => {
    // An empty template must never be accepted as a verification.
    expect(submissionIsImportable(blankSubmissionTemplate('class3'))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// §40 — visual polish changed nothing that matters
// ---------------------------------------------------------------------------

describe('§40 no functional regression for design', () => {
  it('leaves the §7.4 fingerprint untouched', () => {
    expect(computeContentFingerprint()).toBe('dfc56ab5');
    expect(section74Artifact().reviewCode).toBe('S74-v1-DFC56A');
  });

  it('leaves student eligibility exactly where it was', () => {
    expect(
      fractionsSectionCards().filter((s) => s.availability !== 'not_available_yet')
    ).toHaveLength(4);
    expect(class6ChapterCards()).toHaveLength(10);
    // v0.70 §27 — was 5. Four of those five routed NOTHING: their
    // chapter cards said "Ready to learn" and every section inside
    // read "Coming soon". Chapter availability now rolls up from
    // section eligibility, so the number a student sees is the number
    // of chapters that actually open. This is a truthfulness fix, and
    // the count going DOWN is the correct outcome.
    expect(
      class6ChapterCards().filter((c) => c.availability === 'available')
    ).toHaveLength(1);
    expect(sectionEligibility('ncert_gp_c6_s7_1').hasEligibleLearn).toBe(false);
  });

  it('publishes nothing new', () => {
    for (const s of fractionsChapterSections()) {
      const id = s.source.officialSectionId;
      if (id === 'ncert_gp_c6_s7_4') continue;
      expect(mayPublishSection(id).mayPublish).toBe(false);
    }
  });

  it('keeps every misconception attachment valid', () => {
    const items = fractionsChapterSections().flatMap((s) => s.interactivePractice);
    expect(auditItemMisconceptions(items)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §24/§25 — the withdrawn diagnosis
// ---------------------------------------------------------------------------

describe('§24 diagnoses that cannot be justified are withdrawn', () => {
  it('no longer claims 6/4 proves multiplication', () => {
    const item = authoredSectionById('ncert_gp_c6_s7_5')!.interactivePractice.find(
      (i) => i.itemId === 's75.p1'
    )!;
    const j = judge(item, { kind: 'fraction', value: { numerator: 6, denominator: 4 } });
    expect(j.correct).toBe(false);
    // 2 + 4 = 6 reaches 6/4 as surely as 2 x 3 does.
    expect(j.chapterMisconceptionId).toBeNull();
    expect(j.misconceptionRef).toBeNull();
  });

  it('keeps the diagnoses that do survive the test', () => {
    const s = distractorAuditSummary();
    expect(s.diagnostic).toBe(8);
    expect(s.nonDiagnostic).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// §5 — motifs are mathematical and stable
// ---------------------------------------------------------------------------

describe('§5 chapter motifs', () => {
  it('gives every official Class 6 chapter its own mathematical motif', () => {
    const c6 = OFFICIAL_CHAPTERS.filter((c) => c.grade === 'class6');
    const motifs = c6.map((c) => motifForChapter(c.officialChapterId));
    expect(motifs).not.toContain('generic');
    // Ten chapters, ten distinct motifs — no chapter borrows another's.
    expect(new Set(motifs).size).toBe(10);
  });

  it('keys on the stable ID, so retitling cannot change identity', () => {
    expect(motifForChapter('ncert_gp_c6_ch07_fractions')).toBe('fractions');
    expect(motifForChapter('not_a_chapter')).toBe('generic');
  });

  it('gives each chapter a stable accent', () => {
    expect(chapterAccent(7)).toBe(chapterAccent(7));
    expect(chapterAccent(1)).not.toBe(chapterAccent(2));
  });
});

// ---------------------------------------------------------------------------
// §34/§36/§37 — the student surfaces
// ---------------------------------------------------------------------------

describe('§34 the student home', () => {
  it('lists every official chapter, available or not', () => {
    render(<Class6ChapterList onOpenChapter={() => {}} />);
    // v0.76 §6 — an upcoming chapter now says "Being written" on its own
    // plate rather than "Coming soon" on a grey row. The assertion that
    // matters is unchanged: every chapter of the book is on the page.
    expect(screen.getAllByText('Being written').length).toBeGreaterThanOrEqual(5);
    for (const c of class6ChapterCards()) {
      expect(screen.getAllByText(c.title).length).toBeGreaterThan(0);
    }
  });

  it('renders the curriculum as a field and a grid, not one list', () => {
    // v0.76 §6 — the defect being defended against is unchanged: ten
    // identical rectangles in one column. v0.70 answered it with three
    // registers of cards, which was still a list of cards. The answer
    // now is a featured chapter rendered as a full field, and the rest
    // of the book as plates carrying their own artwork.
    render(<Class6ChapterList onOpenChapter={() => {}} />);
    // The featured chapter is a heading, not a row.
    expect(screen.getByRole('heading', { name: 'Fractions' })).toBeTruthy();
    expect(screen.getByText('The rest of the book')).toBeTruthy();
    // Every chapter carries its number, so the book's order stays legible.
    expect(screen.getAllByText(/^Chapter \d+$/).length).toBeGreaterThanOrEqual(9);
  });

  it('makes no unavailable chapter tappable', () => {
    render(<Class6ChapterList onOpenChapter={() => {}} />);
    for (const b of screen.getAllByRole('button')) {
      expect(b.textContent).not.toMatch(/Being written/);
    }
  });

  it('never offers to continue, because no progress is recorded here', () => {
    // §34/§36 — unchanged intent. The chapter list has no per-student
    // history to read, so it must never offer to continue anything.
    // v0.76 replaced the "Start here" eyebrow with a plain action.
    render(<Class6ChapterList onOpenChapter={() => {}} />);
    expect(screen.getByText('Open this chapter')).toBeTruthy();
    expect(screen.queryByText(/Continue/i)).toBeNull();
  });

  it('points the shortcut at a genuinely available chapter', () => {
    const opened: string[] = [];
    render(<Class6ChapterList onOpenChapter={(id) => opened.push(id)} />);
    fireEvent.click(screen.getByText('Open this chapter').closest('button')!);
    expect(opened).toHaveLength(1);
    const card = class6ChapterCards().find((c) => c.officialChapterId === opened[0])!;
    expect(card.availability).toBe('available');
  });

  it('uses no governance vocabulary', () => {
    const { container } = render(<Class6ChapterList onOpenChapter={() => {}} />);
    expect(container.textContent).not.toMatch(
      /authored_draft|unmapped|primary_source|competency_pending|fingerprint/i
    );
  });
});

describe('§6/§36 the Fractions chapter landing', () => {
  it('shows all nine parts as an ordered pathway', () => {
    render(<FractionsChapterLanding onBack={() => {}} onOpenPractice={() => {}} />);
    for (const s of fractionsSectionCards()) {
      expect(screen.getByText(s.title)).toBeTruthy();
    }
  });

  it('reports progress factually and claims no mastery', () => {
    const { container } = render(
      <FractionsChapterLanding onBack={() => {}} onOpenPractice={() => {}} />
    );
    expect(screen.getByText(/4 of 9 parts/)).toBeTruthy();
    expect(container.textContent).not.toMatch(/mastered|complete|% done|proficient/i);
  });

  it('opens only the parts a student may actually reach', () => {
    const opened: string[] = [];
    render(
      <FractionsChapterLanding onBack={() => {}} onOpenPractice={(id) => opened.push(id)} />
    );
    const buttons = screen.getAllByRole('button');
    // Four practisable parts, plus the back link.
    expect(buttons).toHaveLength(5);
    for (const b of buttons.slice(1)) fireEvent.click(b);
    for (const id of opened) {
      // Whatever the specific availability state, it must not be the
      // unavailable one — a student may never open a part that has no
      // eligible content behind it.
      expect(sectionEligibility(id).availability).not.toBe('not_available_yet');
    }
  });
});
